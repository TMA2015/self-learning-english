/**
 * Read-only guidance from the *actually imported* catalog and existing attempts.
 * This is NOT evidence of CEFR achievement, a Unit unlock, or an assessment engine.
 */
import lessonUnits from '../content/sle-unit-navigation-map-v1.json';

export type TodayLesson = {id:string;title:string;module:string;cefr:string;minutes:number};
export type TodayAttempt = {
 id:string;lessonId:string;createdAt:number;version:string;
 status:'started'|'scored'|'pending_review'|'approved'|'unassessed';
 results?:{id:string;correct:boolean|null}[];
};
export type TodayCatalog<T extends TodayAttempt=TodayAttempt> = {
 lessons:TodayLesson[];attempts:T[];
 course?:{sequence:string[]};
 journey?:{steps:string[]};
};
export type TodayAction<T extends TodayAttempt=TodayAttempt> = {lesson:TodayLesson;attempt?:T;unit?:string;reason:string};
export type TodayPlan<T extends TodayAttempt=TodayAttempt> = {
 focusUnit:string|undefined;availableUnits:string[];
 resume:TodayAction<T>|undefined;review:TodayAction<T>|undefined;learn:TodayAction<T>|undefined;
 emptyReason:string|undefined;
};
const allUnits:{[lessonId:string]:string}={
 ...lessonUnits.baseline,...lessonUnits.conditional_v119,
 ...lessonUnits.confirmed_v121,...lessonUnits.confirmed_v122,
 ...lessonUnits.confirmed_v123,...lessonUnits.confirmed_v124,
 ...lessonUnits.confirmed_v125,...lessonUnits.confirmed_v126,
 ...lessonUnits.confirmed_v127
};
export function primaryUnitForLesson(id:string):string|undefined{return allUnits[id]}
/**
 * Focus is an explicit preference or the Unit of recently practised work.
 * Unknown/unreleased IDs are never suggested, even if they occur in a draft map.
 * Historical in-progress attempts are preferred to new actions.
 */
export function todayLearningPath<T extends TodayAttempt>(
 catalog:TodayCatalog<T>,skill?:string,requestedUnit='auto'
):TodayPlan<T>{
 const visible=catalog.lessons.filter(l=>!skill||l.module===skill);
 const byId=new Map(visible.map(l=>[l.id,l]));
 const order=catalog.course?.sequence??catalog.journey?.steps??visible.map(l=>l.id);
 const orderIndex=new Map(order.map((id,i)=>[id,i]));
 const bySequence=[...visible].sort((a,b)=>(orderIndex.get(a.id)??Infinity)-(orderIndex.get(b.id)??Infinity)||a.id.localeCompare(b.id));
 const availableUnits=[...new Set(visible.map(l=>primaryUnitForLesson(l.id)).filter((u):u is string=>!!u))].sort();
 const activeAttempts=catalog.attempts
  .filter(a=>byId.has(a.lessonId))
  .sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id));
 const draft=activeAttempts.find(a=>a.status==='started');
 const unitOfLast=activeAttempts.map(a=>primaryUnitForLesson(a.lessonId)).find(u=>!!u);
 const focusUnit=requestedUnit!=='auto'&&availableUnits.includes(requestedUnit)
  ?requestedUnit:unitOfLast&&availableUnits.includes(unitOfLast)?unitOfLast:availableUnits[0];
 const inFocus=bySequence.filter(l=>primaryUnitForLesson(l.id)&&(!focusUnit||primaryUnitForLesson(l.id)===focusUnit));
 const newest=new Map<string,T>();
 for(const a of activeAttempts)if(!newest.has(a.lessonId))newest.set(a.lessonId,a);
 const reviewable=inFocus
  .map(l=>({lesson:l,attempt:newest.get(l.id)}))
  .filter((x):x is {lesson:TodayLesson;attempt:T}=>
   !!x.attempt&&x.attempt.status==='scored'&&
   !!x.attempt.results?.some(q=>q.correct===false))
  .sort((a,b)=>b.attempt.createdAt-a.attempt.createdAt||a.lesson.id.localeCompare(b.lesson.id));
 const next=inFocus.find(l=>!newest.has(l.id));
 return {
  focusUnit,availableUnits,
  resume:draft?{lesson:byId.get(draft.lessonId)!,attempt:draft,unit:primaryUnitForLesson(draft.lessonId),
   reason:'Resume your saved draft. Its original content version is preserved.'}:undefined,
  review:reviewable[0]?{lesson:reviewable[0].lesson,attempt:reviewable[0].attempt,
   unit:primaryUnitForLesson(reviewable[0].lesson.id),
   reason:'Your latest submitted objective practice here includes an incorrect answer. Review the explanation before trying again.'}:undefined,
  learn:next?{lesson:next,unit:primaryUnitForLesson(next.id),
   reason:'Next unattempted available lesson in the selected Unit. This is a navigation suggestion, not a proficiency rating.'}:undefined,
  emptyReason:inFocus.length===0
   ?'No currently imported lesson is mapped to this Unit and skill.'
   :!next?'All currently available lessons in this Unit have an attempt. Browse other Units or revisit feedback.':undefined
 };
}
