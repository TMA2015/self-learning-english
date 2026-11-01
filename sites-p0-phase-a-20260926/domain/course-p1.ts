/** v21 P1 projection. This is a virtual view of the saved Writing programme. */
export const WRITING_COURSE_ID='COURSE-WRITING-12W';
export const WRITING_STEP_NAMES=['Question analysis','Brainstorm','Outline','Writing'] as const;
export type CourseSelection={courseV1:1;activeCourseId:string|null;revision:number;lastRequestId:string|null};
export const emptySelection=():CourseSelection=>({courseV1:1,activeCourseId:null,revision:0,lastRequestId:null});

export function writingCourse(state:Record<string,unknown>|null){
 const saved=Array.isArray(state?.completed)?state.completed:[];
 const completed=WRITING_STEP_NAMES.map((_,i)=>i).filter(i=>saved.includes(i));
 const next=WRITING_STEP_NAMES.find((_,i)=>!completed.includes(i));
 return {
  id:WRITING_COURSE_ID,title:'English Writing Coach · 12 Weeks',kind:'legacy-writing' as const,
  publishedWeeks:1,previewWeeks:11,completedRequired:completed.length,availableRequired:4,
  nextActivity:next??'Review your Week 1 work',
  // A saved process flag is not a Writing quality score or a reviewed CEFR level.
  progressLabel:`${completed.length}/4 Week 1 steps saved`,
  week1Complete:completed.length===4,
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
