import unitMap from '../content/sle-unit-navigation-map-v1.json';

/** A small read-only A2 guide built from the adopted programme map and actual imported lessons.
 * Unit membership is navigation advice, never a mastery score or an unlock. */
export const A2_UNIT_GUIDE=[
 {id:'A2-U01',title:'Actions now versus routines'},
 {id:'A2-U02',title:'Past events and simple stories'},
 {id:'A2-U03',title:'Shopping, food and quantities'},
 {id:'A2-U04',title:'Choices, comparisons and reasons'},
 {id:'A2-U05',title:'Plans, arrangements and predictions'},
 {id:'A2-U06',title:'Rules, problems and advice'},
 {id:'A2-U07',title:'Experiences and recent changes'},
 {id:'A2-U08',title:'Travel and community information'},
 {id:'A2-U09',title:'Relevant ideas, messages and paragraphs'},
 {id:'A2-U10',title:'A2 integrated transfer checkpoint'},
] as const;

export type GuideLesson={id:string;title:string;module:string;cefr:string;minutes:number};
export type GuideAttempt={lessonId:string;status:string};
const unitForLesson:Record<string,string>={...unitMap.baseline,...unitMap.conditional_v119};
const submittedStatuses=new Set(['scored','approved','pending_review']);
export function buildA2UnitGuide(lessons:GuideLesson[],attempts:GuideAttempt[],sequence:string[]=[]){
 const sequenceIndex=new Map(sequence.map((id,i)=>[id,i]));
 const available=lessons.filter(l=>l.cefr==='A2').sort((a,b)=>
  (sequenceIndex.get(a.id)??Infinity)-(sequenceIndex.get(b.id)??Infinity)||a.id.localeCompare(b.id));
 const submitted=new Set(attempts.filter(a=>submittedStatuses.has(a.status)).map(a=>a.lessonId));
 const drafts=new Set(attempts.filter(a=>a.status==='started').map(a=>a.lessonId));
 return A2_UNIT_GUIDE.map(unit=>{
  const unitLessons=available.filter(l=>unitForLesson[l.id]===unit.id);
  return {...unit,lessons:unitLessons,submitted:unitLessons.filter(l=>submitted.has(l.id)).length,
   inProgress:unitLessons.filter(l=>drafts.has(l.id)).length};
 });
}
