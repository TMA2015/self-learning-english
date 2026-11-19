/** v21 course-selection contract. Keep the historical ID to preserve existing selections. */
export const WRITING_COURSE_ID='COURSE-WRITING-12W';
export const FOUNDATION_UNIT_IDS=['FW-U01','FW-U02','FW-U03','FW-U04','FW-U05','FW-U06','FW-U07','FW-U08','FW-U09','FW-U10','FW-U11','FW-U12'] as const;
export type CourseSelection={courseV1:1;activeCourseId:string|null;revision:number;lastRequestId:string|null};
export const emptySelection=():CourseSelection=>({courseV1:1,activeCourseId:null,revision:0,lastRequestId:null});

function record(value:unknown):Record<string,unknown>|null{
 return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:null;
}

/** A unit has SAVED work only if a persisted immutable version exists; this is not mastery. */
export function savedFoundationUnitIds(state:Record<string,unknown>|null):string[]{
 const foundation=record(state?.foundationWritingV1);
 if(!foundation||foundation.schemaVersion!==1)return [];
 const units=record(foundation.units);
 if(!units)return [];
 return FOUNDATION_UNIT_IDS.filter(id=>{
  const entry=record(units[id]);
  return !!entry&&Array.isArray(entry.versions)&&entry.versions.length>0;
 });
}

export function writingCourse(state:Record<string,unknown>|null){
 const saved=savedFoundationUnitIds(state);
 const next=FOUNDATION_UNIT_IDS.find(id=>!saved.includes(id));
 return {
  id:WRITING_COURSE_ID,title:'Foundation Writing',kind:'foundation-writing' as const,
  publishedUnits:12,completedRequired:saved.length,availableRequired:12,
  nextActivity:next?'Unit '+next.slice(-2):'Review a saved unit',
  // The count is a save-history indicator, never an assessed score or course mastery claim.
  progressLabel:`${saved.length}/12 units with saved work`,
 };
}

export function myCourses(state:Record<string,unknown>|null,selection:CourseSelection){
 const course=writingCourse(state);
 const activeCourseId=selection.activeCourseId===course.id?course.id:null;
 return {courses:[course],activeCourseId,activeCourse:activeCourseId?course:null,selectionRevision:selection.revision};
}

/** Read-only reference matching for future enrollments; never appends evidence. */
export function attemptMatchesReference(attempt:{packageId:string;version:string;lessonId:string;status:string;results?:{id:string}[]},ref:{packageId:string;contentVersion:string;contentId:string;source:'foundation-lesson'|'foundation-activity'}){
 if(attempt.packageId!==ref.packageId||attempt.version!==ref.contentVersion||!['scored','pending_review','approved'].includes(attempt.status))return false;
 return ref.source==='foundation-lesson'?attempt.lessonId===ref.contentId:!!attempt.results?.some(r=>r.id===ref.contentId);
}
