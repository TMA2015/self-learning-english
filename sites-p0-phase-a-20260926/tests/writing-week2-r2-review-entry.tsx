import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {emptyWeekWork,type WeekWork} from '../domain/writing-course-v2-b';
import {Week2InteractiveLearn,Week2SavedVersionComparison,Week2TransferPractice} from '../app/writing-week2-interactive';
import {Week2ThinkBeforeReveal,Week2RepairBridge,Week2RevisionCoach} from '../app/writing-week2-learning-lab';
import {Week2R2SortBoard} from '../app/writing-week2-r2-sort';
import {Week2R2MindWorkspace} from '../app/writing-week2-r2-mind';
import '../app/writing-week2-r2-visual.css';

type Tab='learn'|'sort'|'mind'|'compare'|'transfer';
const TABS:{id:Tab;name:string}[]=[
 {id:'learn',name:'1 · Learn'},{id:'sort',name:'2 · Sort Ideas'},
 {id:'mind',name:'3 · My Idea Board'},{id:'compare',name:'4 · Compare'},
 {id:'transfer',name:'5 · New Task'}
];
const sample:WeekWork={...emptyWeekWork(),history:[
 {signature:'synthetic-r2-v1',at:1000,kind:'progress',provisional:true,evidenceWeight:0,proficiencyWeight:0,
  fields:{ideas:'Art club\nReading club',reject:'Reading club',best:'Art club',fit:'Students can try new things.'}},
 {signature:'synthetic-r2-v2',at:2000,kind:'progress',provisional:true,evidenceWeight:0,proficiencyWeight:0,
  fields:{ideas:'Art club\nReading club\nSports club',reject:'Reading club: does not fit every student',best:'Art club',fit:'Students can create artwork together and learn from friends.'}}
]};
function R2App(){
 const [tab,setTab]=useState<Tab>(()=>new URLSearchParams(location.search).get('stage')==='sort'?'sort':'mind');
 return <main className="r2-app"><div className="r2-shell">
  <header className="r2-top">
   <span className="r2-kicker">G LEARNING · SELF-LEARNING ENGLISH · UX PROTOTYPE R2</span>
   <h1>Writing Coach · Week 2</h1>
   <p>Interactive idea sorting &amp; mind mapping, built from React source for an isolated browser review.</p>
   <p className="r2-disclaimer"><strong>REVIEW ONLY.</strong> No login, cloud saving, Firebase, Gemini, real learner records or grading. All R2 ideas disappear after refresh. The fourth tab displays labelled synthetic comparisons.</p>
  </header>
  <nav className="r2-nav" aria-label="Prototype learning stages">
   {TABS.map(t=><button key={t.id} type="button" className={tab===t.id?'is-active':''}
     aria-current={tab===t.id?'step':undefined} onClick={()=>setTab(t.id)}>{t.name}</button>)}
  </nav>
  <article className="r2-page">
   {tab==='learn'&&<><Week2InteractiveLearn/><Week2ThinkBeforeReveal/></>}
   {tab==='sort'&&<><Week2R2SortBoard/><Week2RepairBridge/></>}
   {tab==='mind'&&<Week2R2MindWorkspace/>}
   {tab==='compare'&&<><p className="r2-prompt"><small>DEMO DATA</small>These are synthetic versions, not your real submissions.</p>
    <Week2RevisionCoach work={sample}/><Week2SavedVersionComparison work={sample}/></>}
   {tab==='transfer'&&<Week2TransferPractice/>}
   <footer className="r2-footer">This interface tests usability only. It does not replace academic review of the R2 changes, authenticated save/resume, or real-device Safari acceptance. PR #153 and the live site are unchanged.</footer>
  </article>
 </div></main>;
}
createRoot(document.getElementById('app')!).render(<R2App/>);
