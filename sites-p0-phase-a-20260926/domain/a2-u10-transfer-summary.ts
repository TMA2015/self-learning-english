/**
 * A2-U10 read-only transfer overview (NotebookLM R1 Design Option B).
 * Never grades, imports, awards CEFR/Unit mastery, requests audio, or writes history.
 * The three EXISTING canonical lessons are the only data sources.
 */
export type TransferLesson={id:string;title:string;module:string};
export type TransferResult={id:string;correct:boolean|null;outcome?:'format-only'};
export type TransferAttempt={
 id:string;lessonId:string;status:string;createdAt:number;submittedAt?:number;
 results?:TransferResult[];
};
export type TransferRow={
 id:string;title:string;skill:'Reading'|'Listening'|'Writing';
 available:boolean;submitted:boolean;hasDraft:boolean;awaitingReview:boolean;
 checked:number;correct:number;wrong:number;
 description:string;
};
export type A2TransferSummary={
 unitId:'A2-U10';available:number;total:3;rows:TransferRow[];
 nextLessonId:string|null;nextAction:string;boundary:string;
};

const REQUIRED=[
 {id:'REA-A2-08',module:'reading',skill:'Reading'},
 {id:'LIS-A2-07',module:'listening',skill:'Listening'},
 {id:'WRI-A2-07',module:'writing',skill:'Writing'},
] as const;
const submittedStates=new Set(['scored','pending_review','approved']);
const newer=(a:TransferAttempt,b:TransferAttempt)=>
 (b.submittedAt??b.createdAt)-(a.submittedAt??a.createdAt)||
 b.createdAt-a.createdAt||b.id.localeCompare(a.id);

/** Display-only hints derived from SAVED outcomes, not fresh grading. */
export function a2Unit10TransferSummary(
 unitId:string,lessons:readonly TransferLesson[],attempts:readonly TransferAttempt[]
):A2TransferSummary|null{
 if(unitId!=='A2-U10')return null;
 const byLesson=new Map(lessons.map(l=>[l.id,l]));
 const rows:TransferRow[]=REQUIRED.map(({id,module,skill})=>{
  const lesson=byLesson.get(id);
  const available=!!lesson&&lesson.module===module;
  const history=available?attempts.filter(a=>a.lessonId===id):[];
  const submitted=history.filter(a=>submittedStates.has(a.status)).sort(newer)[0];
  const latest=history.slice().sort(newer)[0];
  const hasDraft=history.some(a=>a.status==='started');
  const awaitingReview=submitted?.status==='pending_review';
  const observed=new Map<string,boolean>();
  // These are ORIGINAL stored score outcomes. Never use a new key, an AI score,
  // unreviewed Writing or format-only events to infer language ability.
  if(skill!=='Writing'&&submitted&&
    (submitted.status==='scored'||submitted.status==='approved')){
   for(const r of submitted.results??[]){
    if(r.outcome==='format-only'||typeof r.correct!=='boolean'||observed.has(r.id))continue;
    observed.set(r.id,r.correct);
   }
  }
  const checked=observed.size,correct=[...observed.values()].filter(Boolean).length;
  const description=!available
   ?'This lesson is not in the current imported catalog on this device.'
   :submitted?.status==='pending_review'
    ?'Submission saved · awaiting trusted review. No objective or Writing-quality score is inferred.'
   :skill==='Writing'&&submitted?.status==='approved'
    ?'Trusted review recorded. Open the original lesson to read feedback; no new Writing grade is calculated here.'
   :skill==='Writing'&&submitted
    ?'Writing submitted. Language quality is not automatically assessed; read the original review status.'
   :submitted&&checked>0
    ?'Previously saved objective results: '+correct+'/'+checked+' correct. '+(skill==='Listening'?'These may include cross-source questions. ':'')+'This is not an A2 mastery score.'
   :submitted
    ?'Submission saved. No verified objective result is shown here.'
   :hasDraft
    ?'Unfinished draft saved; resume using the original lesson.'
   :latest?.status==='unassessed'
    ?'Work saved as unassessed; no proficiency credit is inferred.'
   :'No saved submission for this lesson.';
  return {id,title:lesson?.title??id,skill,available,
   submitted:!!submitted,hasDraft,awaitingReview,checked,correct,
   wrong:checked-correct,description};
 });
 const available=rows.filter(r=>r.available).length;
 const missing=rows.find(r=>!r.available);
 const needsSubmission=rows.find(r=>r.available&&!r.submitted);
 const mistake=rows.find(r=>r.available&&r.submitted&&r.wrong>0);
 const pending=rows.find(r=>r.awaitingReview);
 const nextLessonId=missing?null:(mistake??needsSubmission??pending??rows[0])?.id??null;
 const nextAction=missing
  ?'One or more reviewed A2-U10 lessons are not imported on this device. Do not treat this Unit as complete; check the current catalog safely.'
  :mistake
   ?'Review the explanation for incorrect objective answers in '+mistake.id+'. You can open the saved result below.'
  :needsSubmission
   ?(needsSubmission.hasDraft?'Resume ':'Study ')+needsSubmission.id+' using the existing lesson player.'
  :pending
   ?'Writing is awaiting trusted review. Review the Reading and Listening feedback while you wait.'
  :'All three lessons have a saved submission. Review the individual explanations; this does not certify mastery or a CEFR level.';
 return {unitId:'A2-U10',available,total:3,rows,nextLessonId,nextAction,
  boundary:'A2-U10 is a transfer learning sequence, not an independent exam. Previously submitted items and drafts keep their original versions. Listening credit is only whatever the original player validly saved; this summary does not replay, rescore or verify audio.'};
}
