/**
 * Deterministic practice suggestions from existing saved Foundation attempts.
 * No regrading, CEFR inference, AI provider, new storage, or network calls.
 * A result is eligible only if it was already objectively checked and saved.
 */
export type FoundationPracticeCatalog={
  imported:boolean;
  lessons:{id:string;title:string;module:string}[];
  attempts:{
    id:string;lessonId:string;createdAt:number;submittedAt?:number;
    status:string;
    results?:{id:string;correct:boolean|null;outcome?:'format-only';tags?:string[]}[];
  }[];
};
export type FoundationPracticeAdvice={
  skill:string;module:string;missed:number;total:number;
  lessonId:string;lessonTitle:string;reason:string;
};

const modules=new Set(['grammar','vocabulary','reading','listening','writing','speaking','pronunciation']);
const titleCase=(module:string)=>module.charAt(0).toUpperCase()+module.slice(1);

/**
 * Only latest saved submitted outcome per imported lesson counts.
 * Newer unsubmitted drafts do not erase the previous checked outcome.
 * A later approved/pending/unassessed outcome supersedes older scores but
 * never creates a deterministic error signal by itself.
 */
export function foundationPracticeAdvice(catalog:FoundationPracticeCatalog|null|undefined,max=3):FoundationPracticeAdvice[]{
  if(!catalog?.imported||max<=0)return [];
  const lessons=new Map(catalog.lessons.filter(x=>modules.has(x.module)).map(x=>[x.id,x]));
  const latest=new Map<string,FoundationPracticeCatalog['attempts'][number]>();
  const byTime=[...catalog.attempts].filter(x=>x.status!=='started').sort((a,b)=>
    (b.submittedAt??b.createdAt)-(a.submittedAt??a.createdAt)||b.createdAt-a.createdAt||b.id.localeCompare(a.id));
  for(const attempt of byTime){
    if(!lessons.has(attempt.lessonId)||latest.has(attempt.lessonId))continue;
    latest.set(attempt.lessonId,attempt);
  }
  type Row={skill:string;module:string;missed:number;total:number;lessonId:string;lessonTitle:string;at:number};
  const rows:Row[]=[];
  for(const [id,attempt] of latest){
    if(attempt.status!=='scored'&&attempt.status!=='approved')continue;
    const lesson=lessons.get(id)!;
    const observed=new Map<string,boolean>();
    for(const result of attempt.results??[]){
      if(result.outcome==='format-only'||typeof result.correct!=='boolean'||observed.has(result.id))continue;
      observed.set(result.id,result.correct);
    }
    if(!observed.size)continue;
    rows.push({skill:titleCase(lesson.module),module:lesson.module,missed:[...observed.values()].filter(v=>!v).length,
      total:observed.size,lessonId:id,lessonTitle:lesson.title,at:attempt.submittedAt??attempt.createdAt});
  }
  const groups=new Map<string,{module:string;missed:number;total:number;target:Row|null}>();
  for(const row of rows){
    const current=groups.get(row.module)??{module:row.module,missed:0,total:0,target:null};
    current.total+=row.total;current.missed+=row.missed;
    if(row.missed>0&&(!current.target||row.missed>current.target.missed||
      (row.missed===current.target.missed&&row.at>current.target.at))){
      current.target=row;
    }
    groups.set(row.module,current);
  }
  return [...groups.values()].filter(x=>x.missed>0&&x.target)
    .sort((a,b)=>b.missed-a.missed||(b.missed/b.total)-(a.missed/a.total)||a.module.localeCompare(b.module))
    .slice(0,max)
    .map(x=>{
      const target=x.target!;
      return {skill:titleCase(x.module),module:x.module,missed:x.missed,total:x.total,
        lessonId:target.lessonId,lessonTitle:target.lessonTitle,
        reason:`${x.missed} of ${x.total} objectively checked answers in the latest submitted ${titleCase(x.module)} practice were incorrect. Start with the saved explanation for “${target.lessonTitle}”, then try a new example.`};
    });
}
