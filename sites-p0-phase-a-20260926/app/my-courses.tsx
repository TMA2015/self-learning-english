'use client';
import type {myCourses} from '../domain/course-p1';
export type MyCoursesData=ReturnType<typeof myCourses>;
export function MyCourses({data,error,busy,onSelect,onContinue,onRecommendations}:{data:MyCoursesData|null;error:string;busy:boolean;onSelect:(id:string|null)=>void;onContinue:()=>void;onRecommendations:()=>void}){
 const course=data?.courses[0];
 return <><div className="eyebrow">MY LEARNING · COURSES</div><div className="page-heading"><div><h1>My Courses</h1><p>Choose which course appears in Your Journey. Free lessons remain in Course Catalog.</p></div></div>
 {error&&<p className="notice" role="alert">{error}</p>}
 {!data?<p role="status">Loading My Courses…</p>:<>
  {!data.activeCourse&&<p className="notice">Choose a course to show it in Your Journey.</p>}
  {course&&<section className="panel" aria-label="English Writing Coach course"><span className="status-chip live">Weeks 1–12 available</span><h2>{course.title}</h2><p>{course.progressLabel}. This records the writing process, not a language score.</p><p>Next available: {course.nextActivity}</p><div className="learning-choices"><button className="primary-button" disabled={busy} onClick={onContinue}>Continue</button>{data.activeCourseId===course.id?<button className="secondary-button" disabled={busy} onClick={()=>onSelect(null)}>Clear active course</button>:<button className="secondary-button" disabled={busy} onClick={()=>onSelect(course.id)}>Set active</button>}</div></section>}
  <section className="panel progress-bottom"><h2>More ways to learn</h2><p>Course Catalog offers independent practice without changing your active course. Recommendations are separate from enrolled courses.</p><button className="secondary-button" onClick={onRecommendations}>View recommendations</button></section>
 </>}
 </>;
}
