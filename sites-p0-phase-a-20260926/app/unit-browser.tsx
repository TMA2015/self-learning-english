'use client';
import {useMemo,useState} from 'react';
import type {AcademicAttempt} from '../domain/academic';
import {
 UNIT_LEVELS,unitGuideForCatalog,type UnitCatalogLesson,type UnitLevel
} from '../domain/unit-guide-60';
import {
 lessonProgressForLesson,latestAttemptForLesson,attemptStatusLabel
} from '../domain/attempt-navigation';

type Props={
 lessons:UnitCatalogLesson[];
 attempts:AcademicAttempt[];
 courseOrder:string[];
 disabled:boolean;
 onOpenLesson:(lessonId:string,attempt?:AcademicAttempt)=>void;
};
/**
 * Dedicated Learn by Units destination.
 * Uses the SAME canonical player, attempts, rubrics and audio as Skill Library.
 * The Unit screen never writes a second learner-progress record.
 */
export function UnitBrowser({lessons,attempts,courseOrder,disabled,onOpenLesson}:Props){
 const [level,setLevel]=useState<UnitLevel>('A1');
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const guide=useMemo(()=>unitGuideForCatalog(lessons,courseOrder),[lessons,courseOrder]);
 const selected=guide.units.find(u=>u.id===selectedId)??null;
 const levelUnits=guide.units.filter(u=>u.level===level);
 const activeUnits=guide.units.filter(u=>u.available).length;
 function summary(items:UnitCatalogLesson[]){
  const submitted=items.filter(x=>lessonProgressForLesson(attempts,x.id).kind==='submitted').length;
  const draft=items.filter(x=>lessonProgressForLesson(attempts,x.id).hasDraft).length;
  return {submitted,draft};
 }
 return <div className="sle-unit-browser" aria-label="Learn by Units">
  {!selected?<><div className="unit-browser-hero">
   <span className="eyebrow">LEARN BY UNITS · A1–C2</span>
   <h2>Your English learning path</h2>
   <p>Choose a level, open a Unit and study its available lessons. Every lesson also remains accessible from the Skill Library.</p>
   <div className="unit-browser-metrics" aria-label="Available programme overview">
    <div><strong>60</strong><span>Planned Units</span></div>
    <div><strong>{activeUnits}</strong><span>Units with lessons</span></div>
    <div><strong>{guide.mappedLessonCount}</strong><span>Mapped available lessons</span></div>
   </div>
  </div>
  <div className="unit-level-tabs" role="group" aria-label="Choose CEFR target">
   {UNIT_LEVELS.map(v=><button type="button" className={v===level?'is-active':''}
    aria-pressed={v===level} key={v} onClick={()=>setLevel(v)}>{v}</button>)}
  </div>
  <div className="unit-browser-heading"><h3>{level} · 10 Units</h3>
   <p>Lesson counts are availability indicators, not proficiency or completion certificates.</p>
  </div>
  <div className="unit-card-grid">
   {levelUnits.map(u=>{
    const count=summary(u.lessons);
    return <button key={u.id} type="button" className="unit-card"
     onClick={()=>setSelectedId(u.id)}>
     <span className="unit-card-top"><span className="unit-card-id">{u.id}</span>
      <span className={'unit-card-tag '+(u.available?'':'is-planned')}>
       {u.available?u.lessonCount+' lesson'+(u.lessonCount===1?'':'s'):'Planned'}
      </span>
     </span>
     <strong>{u.title}</strong>
     <small>{u.available?
      count.submitted+' submitted · '+count.draft+' draft'+(count.draft===1?'':'s'):
      u.isCheckpoint?'Transfer checkpoint · content to be reviewed':'Content not available yet'}
     </small>
    </button>;
   })}
  </div>
  {guide.unmappedLessons.length>0&&<p className="unit-unmapped-note" role="note">
   {guide.unmappedLessons.length} current lesson{guide.unmappedLessons.length===1?' has':'s have'} no approved primary Unit assignment yet. {guide.unmappedLessons.map(x=>x.id).join(', ')} remain available in Skill Library.
  </p>}
  </>:<><button type="button" className="text-button unit-back" onClick={()=>setSelectedId(null)}>
   ← Back to {selected.level} Units
  </button>
  <section className="panel unit-detail-heading">
   <span className="eyebrow">{selected.id} · LEARN BY UNITS</span>
   <h2>{selected.title}</h2>
   <p>Follow a recommended learning sequence, or open any lesson. Units organise study; each lesson has one canonical source and shared saved history.</p>
   <div className="unit-detail-counters">
    <span>{selected.lessonCount} available lessons</span>
    <span>{summary(selected.lessons).submitted} submitted</span>
    <span>{summary(selected.lessons).draft} saved drafts</span>
   </div>
   <small>Submitted means an attempt was saved, not that the Unit or CEFR level has been mastered.</small>
  </section>
  <div className="unit-detail-grid">
   <section className="panel unit-lesson-list" aria-label={'Lessons in '+selected.id}>
    <h3>Study in a suggested order</h3>
    {selected.lessons.length===0?
     <div className="unit-empty-note">No lesson is mapped to this Unit in the available curriculum. This is a planned learning outcome, not a failed or completed Unit.</div>:
     selected.lessons.map((item,index)=>{
      const progress=lessonProgressForLesson(attempts,item.id);
      const latest=latestAttemptForLesson(attempts,item.id);
      return <div className="unit-lesson-row" key={item.id}>
       <div className="unit-lesson-info">
        <span className="unit-card-id">LESSON {index+1} · {item.id}</span>
        <strong>{item.title}</strong>
        <small>{item.module} · {item.minutes} min · {attemptStatusLabel(latest)}
         {progress.hasDraft&&progress.kind==='submitted'?' · draft also open':''}
        </small>
       </div>
       <button type="button" className="secondary-button" disabled={disabled}
        onClick={()=>onOpenLesson(item.id,latest)}>
        {progress.hasDraft?'Resume / Review':progress.kind==='submitted'?'View result':'Open lesson'}
       </button>
      </div>;
     })}
   </section>
   <aside className="unit-detail-aside" aria-label="Unit learning guidance">
    <section className="panel">
     <h3>How to study this Unit</h3>
     <ol>
      <li>Learn each available concept and worked example.</li>
      <li>Complete independent practice at your own pace.</li>
      <li>Review feedback, mistakes and unfinished drafts.</li>
      <li>Use an integrated transfer checkpoint when reviewed content is available.</li>
     </ol>
     <p className="unit-checkpoint-note">{selected.isCheckpoint?
      'This is an integrated transfer Unit. A genuine independent checkpoint requires reviewed materials; it is not a score inferred from ordinary lessons.':
      'Transfer checkpoint: planned or subject to academic review. No automatic mastery score is assigned.'}
     </p>
    </section>
    <section className="panel">
     <h3>One learning history</h3>
     <p>The same Lesson ID, answers, draft, grading rubric and submission history are used whether a learner enters from this Unit or the Skill Library.</p>
    </section>
   </aside>
  </div></>}
 </div>;
}
