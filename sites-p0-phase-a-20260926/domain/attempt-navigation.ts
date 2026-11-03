/** Navigation-only views of versioned Foundation attempts. This file does not write learner data. */
export type AttemptNavigationRecord = {id:string;lessonId:string;status:'started'|'scored'|'pending_review'|'approved'|'unassessed';createdAt:number};
export type LessonNavigationRecord = {id:string;title:string;module:string;cefr:string;minutes:number};

/** Explicit history is authoritative. Never infer the currently selected lesson from a skill sample. */
export function latestAttemptForLesson<T extends AttemptNavigationRecord>(attempts:readonly T[],lessonId:string):T|undefined{
 return attempts.filter(a=>a.lessonId===lessonId).sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id))[0];
}
export function attemptStatusLabel(attempt?:AttemptNavigationRecord):string{
 switch(attempt?.status){
 case 'started':return 'Draft · Resume';
 case 'scored':return 'Submitted · View result';
 case 'pending_review':return 'Submitted · Awaiting adult review';
 case 'approved':return 'Adult reviewed · View feedback';
 case 'unassessed':return 'Saved · Unassessed';
 default:return 'Not started';
 }
}
export function recentSkillWork<T extends AttemptNavigationRecord>(attempts:readonly T[],lessons:readonly LessonNavigationRecord[],skill?:string,limit=4){
 const visible=lessons.filter(l=>!skill||l.module===skill);
 const work=visible.flatMap(lesson=>{const attempt=latestAttemptForLesson(attempts,lesson.id);return attempt?[{lesson,attempt}]:[]});
 return work.sort((a,b)=>b.attempt.createdAt-a.attempt.createdAt||a.lesson.id.localeCompare(b.lesson.id)).slice(0,Math.max(0,limit));
}
export function skillAttemptCount(attempts:readonly AttemptNavigationRecord[],lessons:readonly LessonNavigationRecord[],skill:string):number{
 const ids=new Set(lessons.filter(l=>l.module===skill).map(l=>l.id));
 return new Set(attempts.filter(a=>ids.has(a.lessonId)).map(a=>a.lessonId)).size;
}

/** Historical work is independent of a root attempt on the current package. */
export function hasOlderContent(attempt:{version:string}|null|undefined,currentVersion:string|undefined):boolean{
 return !!attempt&&!!currentVersion&&attempt.version!==currentVersion;
}
export function attemptHistoryLabel(attempt:{version:string;status:string;parentId?:string}):string{
 return attempt.status.replaceAll('_',' ') +(attempt.parentId?' · revision':' · root')+' · content '+attempt.version;
}
