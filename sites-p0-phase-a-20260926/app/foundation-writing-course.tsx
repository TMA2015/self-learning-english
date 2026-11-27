'use client';
import type {FoundationWritingV1} from '../domain/foundation-writing-u01';
import {FOUNDATION_UNIT_IDS,savedFoundationUnitIds} from '../domain/course-p1';

// Titles are retained verbatim from the 12 reviewed Foundation Writing source units.
const titles=[
 'Understand the Writing Task',
 'Generate & Filter Relevant Ideas',
 'Develop Reasons & Concrete Support',
 'Sentence Craft & Meaningful Linkers',
 'Build Unified Single Paragraphs',
 'Plan Multi-Paragraph Outlines',
 'Connect Ideas Across Paragraphs',
 'Adapt Register, Audience & Tone',
 'Draft Integrated Multi-Paragraph Text',
 'Edit Language Mechanics Without Changing Meaning',
 'Revise Meaning, Reason & Flow',
 'Independent Capstone & New-Genre Transfer',
] as const;

export function FoundationWritingCourse({work,onUnit,onBack}:{
 work:FoundationWritingV1|undefined;
 onUnit:(unitId:typeof FOUNDATION_UNIT_IDS[number])=>void;
 onBack:()=>void;
}){
 const saved=savedFoundationUnitIds({foundationWritingV1:work});
 const unknownVersion=work&&work.schemaVersion!==1;
 return <>
  <div className="foundation-unit-top-nav"><button type="button" className="secondary-button" onClick={onBack}>← Back to My Courses</button></div><div className="eyebrow">MY LEARNING · COURSES</div>
  <div className="page-heading"><div>
   <h1>Foundation Writing</h1>
   <p>Learn and practise writing, one unit at a time. Choose any unit to continue.</p>
  </div></div>
  {unknownVersion&&<p className="notice" role="alert">Unknown Foundation Writing data version. Preserve your existing learner backup; no records were changed.</p>}
  <section className="panel" aria-label="Foundation Writing course progress">
   <h2>Your Foundation Writing progress</h2>
   <p><strong>{saved.length}/12 units with saved work</strong></p>
   <p className="muted">Reopen any unit to continue your saved work.</p>
   <div className="fw-course-progress"><span style={{width:(saved.length/12*100)+'%'}}/></div>
  </section>
  <div className="fw-course-grid" aria-label="Foundation Writing course units">
   {FOUNDATION_UNIT_IDS.map((id,index)=>{
    const hasSaved=saved.includes(id);
    return <div key={id} className="fw-course-item">{index%3===0&&<h2 className="fw-group-title">{['Understand & develop ideas','Build sentences & paragraphs','Connect & draft','Edit, revise & transfer'][index/3]}</h2>}<article className="week-card">
     <div className="week-card-top"><span>UNIT {String(index+1).padStart(2,'0')}</span><span className="week-status">{hasSaved?'Saved work':'Not started'}</span></div>
     <h2>{titles[index]}</h2>
     <p className="muted">{hasSaved?'Reopen your saved work or add another version.':'Explore the lesson and save your own work.'}</p>
     <button className="secondary-button" type="button" onClick={()=>onUnit(id)} disabled={!!unknownVersion}>Open Unit {String(index+1).padStart(2,'0')}</button>
    </article>;
   })}
  </div>
 </>;
}
