'use client';
import type {AcademicAttempt} from '../domain/academic';
import {a1b1Unit10TransferSummary} from '../domain/a1b1-u10-transfer-summary';
import copy from '../content/a1b1-u10-transfer-guidance-r2.json';

// The sole Markdown in approved repair copy is emphasis; never render raw HTML.
function ApprovedText({text}:{text:string}){
 return <>{text.split(/(\*[^*]+\*)/g).map((part,i)=>part.startsWith('*')?<em key={i}>{part.slice(1,-1)}</em>:part)}</>;
}
export function A1B1Unit10TransferPanel({unitId,lessons,attempts,disabled,onOpenLesson}:{
 unitId:string;lessons:readonly {id:string;title:string;module:string}[];attempts:AcademicAttempt[];disabled:boolean;
 onOpenLesson:(lessonId:string,attempt?:AcademicAttempt)=>void;
}){
 const summary=a1b1Unit10TransferSummary(unitId,lessons,attempts);
 if(!summary)return null;
 const words=copy[summary.unitId];
 const allObjectiveChecked=summary.rows.slice(0,2).every((r,i)=>r.availableInCurrentCatalog&&r.objectiveChecked===(i===0?4:5)&&r.objectiveWrong===0);
 return <section className="panel a1b1-transfer-panel" aria-label={unitId+' transfer learning review'}>
  <h3>{unitId} · Review your transfer practice</h3>
  <p>{words.guidance}</p>
  <p>{summary.availableLessonCount} of 3 source lessons available. Saved results only; no Unit mastery or CEFR certification.</p>
  <ul className="unit-transfer-summary-list">
   {summary.rows.map((row,index)=><li key={row.lessonId}>
    <strong>{row.skill} · {row.lessonId}</strong>
    <p>{row.description}</p>
    {row.hasSavedSubmission&&<small>Saved content version: {row.savedContentVersion??'not recorded'}</small>}
    {row.hasUnfinishedDraft&&row.hasSavedSubmission&&<p>A separate unfinished draft is saved. The earlier submission is preserved.</p>}
    {row.availableInCurrentCatalog&&row.hasSavedSubmission&&(row.objectiveWrong>0||row.pendingTrustedReview)&&
     <p><ApprovedText text={words.repairs[row.skill==='writing'&&allObjectiveChecked?3:index]}/></p>}
    {row.skill==='writing'&&<small>Writing evidence weight: 0 in this summary. No automatic Writing-quality assessment.</small>}
   </li>)}
  </ul>
  <p><strong>Suggested next step:</strong> {summary.nextAction}</p>
  {summary.nextLessonId&&<button type="button" className="secondary-button" disabled={disabled}
   onClick={()=>onOpenLesson(summary.nextLessonId!,attempts.find(a=>a.id===summary.nextAttemptId&&a.lessonId===summary.nextLessonId))}>
   {summary.nextAction} · {summary.nextLessonId}
  </button>}
 </section>;
}
