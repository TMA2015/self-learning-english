import type {GuideLesson,GuideAttempt} from '../domain/a2-unit-guide';
import {buildA2UnitGuide} from '../domain/a2-unit-guide';
import {lessonProgressForLesson} from '../domain/attempt-navigation';
import type {AcademicAttempt} from '../domain/academic';

/** Optional A2 Unit pilot. Reuses the current imported catalogue and opens the SAME lesson
 * player and stored attempts as the free skill library; no new records or CEFR locks. */
export function A2UnitGuidePilot({lessons,attempts,courseOrder,disabled,onOpen}:{
 lessons:GuideLesson[];attempts:AcademicAttempt[];courseOrder:string[];
 disabled:boolean;onOpen:(lessonId:string)=>void;
}){
 const units=buildA2UnitGuide(lessons,attempts,courseOrder);
 const available=units.reduce((sum,u)=>sum+u.lessons.length,0);
 return <details className="panel foundation-a2-unit-guide">
  <summary><strong>A2 · Explore the 10 Units</strong><span>{available} currently available lessons · optional study path</span></summary>
  <p className="muted">Learn by topic in a suggested order, or keep choosing any skill from the menu. These Unit groupings do not lock lessons or certify your CEFR level.</p>
  <div className="foundation-a2-unit-grid">
   {units.map(unit=><details className="foundation-a2-unit-card" key={unit.id}>
    <summary>
     <span className="foundation-a2-unit-id">{unit.id}</span>
     <strong>{unit.title}</strong>
     <small>{unit.lessons.length} available · {unit.submitted} submitted{unit.inProgress>0?' · '+unit.inProgress+' draft':''}</small>
    </summary>
    {unit.lessons.length===0?
     <p className="muted">This Unit is a planned learning target. No lesson has been imported for it yet.</p>:
     <div className="foundation-a2-unit-lessons">
      {unit.lessons.map(lesson=>{
       const kind=lessonProgressForLesson(attempts,lesson.id).kind;
       const status=kind==='submitted'?'Submitted':kind==='draft'?'In progress':kind==='unassessed'?'Saved, unassessed':'Not started';
       return <button key={lesson.id} type="button" className="secondary-button foundation-a2-unit-lesson"
        disabled={disabled} onClick={()=>onOpen(lesson.id)}>
        <span className="foundation-lesson-id">{lesson.id}</span>
        <strong>{lesson.title}</strong>
        <small>{lesson.module} · {status}</small>
       </button>;
      })}
     </div>}
   </details>)}
  </div>
  <p className="muted">A green submission is not mastery. Unit transfer checkpoints require their own reviewed tasks and are not automatically scored by this guide.</p>
 </details>;
}
