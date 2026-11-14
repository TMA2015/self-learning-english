import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {writingWeek,emptyWeekWork,editWeek,type WeekWork} from '../domain/writing-course-v2-b';
import {
 Week2InteractiveLearn, Week2PracticeSort, Week2IdeaWorkspace,
 Week2SavedVersionComparison, Week2TransferPractice
} from '../app/writing-week2-interactive';

type Stage='learn'|'sort'|'main'|'compare'|'transfer';
const STAGES:[Stage,string][]=[
 ['learn','1 · Learn'],['sort','2 · Sort ideas'],
 ['main','3 · My idea board'],['compare','4 · Compare versions'],['transfer','5 · Try a new task']
];

const sampleHistory:NonNullable<WeekWork['history']>=[
 {signature:'synthetic-v1',at:1000,kind:'progress',provisional:true,
  evidenceWeight:0,proficiencyWeight:0,
  fields:{ideas:'Art club\nReading circle',reject:'Reading circle: harder to explain',
    best:'Art club',fit:'Students can work together with paper and pencils'}},
 {signature:'synthetic-v2',at:2000,kind:'progress',provisional:true,
  evidenceWeight:0,proficiencyWeight:0,
  fields:{ideas:'Art club\nReading circle\nDance workshop',reject:'Dance workshop: not all students want to dance',
    best:'Art club',fit:'Students can join with simple materials and make one display together'}}
];

function sampleWeek2():WeekWork{
 return {...emptyWeekWork(),fields:{
   ideas:'Drawing club\nBook exchange\nBoard game afternoon',
   reject:'Board game afternoon — it may need a quieter alternative for some students.',
   best:'Drawing club',
   fit:'Students can share simple materials and display their drawings together.'
 }};
}
function ReviewApp(){
 const [stage,setStage]=useState<Stage>('learn');
 const [work,setWork]=useState<WeekWork>(()=>new URLSearchParams(location.search).has('sample')?sampleWeek2():emptyWeekWork());
 const onEdit=(key:string,value:string)=>setWork(prev=>editWeek(prev,key,value));
 const lesson=writingWeek(2);
 return <main className="w2-review-shell">
   <header className="w2-review-header">
     <div className="w2-review-label">SELF-LEARNING ENGLISH · ISOLATED REVIEW PREVIEW</div>
     <h1>Writing Coach · Week 2</h1>
     <p>Brainstorming &amp; Relevance — try the exact React learning components from Draft PR #153.</p>
     <p className="w2-review-alert"><strong>PREVIEW ONLY.</strong> No login, no Gemini calls, no cloud saving, no real learner records.
       Any edits here exist only in this open tab and disappear after refresh. The comparison tab uses labelled sample history.</p>
   </header>
   <nav aria-label="Demo learning stages" className="w2-review-nav">
     {STAGES.map(([id,label])=><button key={id} type="button"
       aria-current={stage===id?'step':undefined} className={stage===id?'w2-review-active':''}
       onClick={()=>setStage(id)}>{label}</button>)}
   </nav>
   <article className="panel wcv2 wcv2-b">
     {stage==='learn'&&<>
       <p className="w2-review-prompt">Objective: {lesson.goal}</p>
       <Week2InteractiveLearn/>
     </>}
     {stage==='sort'&&<Week2PracticeSort/>}
     {stage==='main'&&<>
       <h2>My brainstorming workspace</h2>
       <p><strong>Main Practice task:</strong> {lesson.prompt}</p>
       <button type="button" className="secondary-button" onClick={()=>setWork(sampleWeek2())}>Load clearly labelled sample ideas</button>
       <Week2IdeaWorkspace work={work} onEdit={onEdit} disabled={false}/>
       <h3>The four original saved fields</h3>
       <p>These fields, rather than a separate Mind Map database, contain the actual Week 2 answers.</p>
       {lesson.fields.map(field=><label className="field" key={field.key}>
         <span>{field.label}{field.required?' *':''}</span>
         <textarea rows={field.key==='ideas'?4:2} value={work.fields[field.key]??''}
           onChange={e=>onEdit(field.key,e.target.value)} aria-label={field.label}/>
       </label>)}
       <button type="button" onClick={()=>setWork(emptyWeekWork())}>Clear preview notes (not production data)</button>
     </>}
     {stage==='compare'&&<>
       <p className="w2-review-prompt">These two versions are synthetic examples, not your saved submissions.</p>
       <Week2SavedVersionComparison work={{...work,history:sampleHistory}}/>
     </>}
     {stage==='transfer'&&<Week2TransferPractice/>}
     <div className="w2-review-footer">
       <p>This is a code-based demo to review layout and teaching usability. It does not replace actual authentication, save/resume,
         grading or real iPad Safari QA.</p>
     </div>
   </article>
 </main>;
}
createRoot(document.getElementById('app')!).render(<ReviewApp/>);
