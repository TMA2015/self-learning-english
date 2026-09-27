import manifest from '../content/lesson-groups-v1.json';

export type CatalogLesson = {id:string;title:string;module:string;cefr:string;minutes:number};
export type CatalogSection = {id:string;title:{en:string;vi:string}|null;lessons:CatalogLesson[];attempted:number};
export type CatalogAttempt = {lessonId:string;status:string};

/** Navigation metadata only. The server's course.sequence remains the learning route. */
export function catalogSections(lessons:readonly CatalogLesson[],sequence:readonly string[],attempts:readonly CatalogAttempt[],skill?:string,cefr='all'):{grouped:boolean;sections:CatalogSection[]}{
 const rank=new Map(sequence.map((id,i)=>[id,i]));
 const ordered=lessons.filter(l=>(!skill||l.module===skill)&&(cefr==='all'||l.cefr===cefr))
  .sort((a,b)=>(rank.get(a.id)??Number.MAX_SAFE_INTEGER)-(rank.get(b.id)??Number.MAX_SAFE_INTEGER));
 const attempted=new Set(attempts.filter(a=>a.status!=='started').map(a=>a.lessonId));
 const section=(id:string,title:CatalogSection['title'],items:CatalogLesson[]):CatalogSection=>({id,title,lessons:items,attempted:items.filter(l=>attempted.has(l.id)).length});
 if(!skill)return {grouped:false,sections:[section('course',null,ordered)]};
 const groups=manifest.groups[skill as keyof typeof manifest.groups]??[];
 const buckets=groups.map(g=>section(g.id,g.title,ordered.filter(l=>g.lesson_ids.includes(l.id)))).filter(g=>g.lessons.length>0);
 const assigned=new Set(buckets.flatMap(g=>g.lessons.map(l=>l.id)));
 const additional=ordered.filter(l=>!assigned.has(l.id));
 if(additional.length)buckets.push(section(`${skill}-additional`,{en:'Additional lessons',vi:'Bài học bổ sung'},additional));
 const grouped=skill==='grammar'||(lessons.filter(l=>l.module===skill).length>=4&&buckets.length>=2);
 return grouped?{grouped,sections:buckets}:{grouped:false,sections:[section(skill,null,ordered)]};
}
