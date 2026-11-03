'use client';
import {effectiveEvaluation} from '../domain/writing';
import {useEffect,useState} from 'react';
import type {TeachingRating,WritingSubmission,WritingEvaluation} from '../domain/writing';
import type {Evidence,LearnerModel,LearningPlanModel} from '../domain/learning-model';
export type WritingReply={submission:WritingSubmission;evaluation:WritingEvaluation;evidence:Evidence[];learnerModel?:LearnerModel;learningPlan?:LearningPlanModel};
// Explanations/hints are visible, but a provider must not smuggle the full correction into either.
function activeCorrectionGuidance(value:string|undefined,revised:string){
 const text=value?.trim();if(!text)return null;
 const answer=revised.trim();
 const normalize=(s:string)=>s.replace(/\s+/g,' ').toLowerCase();
 const isFullAnswer=/[.!?]/.test(answer)||answer.split(/\s+/).length>15;
 if(answer&&(normalize(text)===normalize(answer)||(isFullAnswer&&normalize(text).includes(normalize(answer)))))return null;
 return text;
}
function safeActiveFeedback(value:string|undefined,rating:TeachingRating):string|null{
 const result=value?.trim();
 if(!result)return null;
 // Keep substantive comments; suppress any complete replacement passage that
 // the model also placed in a correction field. Never leak the model answer.
 for(const c of rating.corrections??[]){
  if(!activeCorrectionGuidance(result,c.revised))return null;
 }
 return result;
}
export function TeachingFeedback({rating,assisted=false,draft=false,activeWork=false}:{rating:TeachingRating;assisted?:boolean;draft?:boolean;activeWork?:boolean}){if(activeWork){
 const overall=safeActiveFeedback(rating.summary,rating);
 const strengths=(rating.strengths??[]).map(x=>safeActiveFeedback(x,rating)).filter((x):x is string=>!!x);
 const improvements=(rating.improvements??[]).map(x=>safeActiveFeedback(x,rating)).filter((x):x is string=>!!x);
 const exercise=safeActiveFeedback(rating.exercise,rating);
 const focus=safeActiveFeedback(rating.revisionSummary,rating);
 const actions=(rating.revisionInstructions??[]).map(x=>safeActiveFeedback(x,rating)).filter((x):x is string=>!!x);
 return <section className="feedback">
  <div className="feedback-mode">Gemini Writing feedback · provisional educational review</div>
  <p className="mode-note">Read the feedback and revise independently. AI scores are estimates, not an official CEFR assessment.</p>
  <h3>Overall assessment</h3><p>{overall??"The model did not provide a safe, specific summary for this submission."}</p>
  <h3>What you did well</h3>
  {strengths.length?<ul>{strengths.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p>Specific evidence for strengths was not supplied.</p>}
  <h3>What to improve next</h3>
  {improvements.length?<ul>{improvements.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p>No specific improvement was provided. Review the task and your supporting example.</p>}
  <h3>Provisional rubric observations</h3>
  <p className="mode-note">Scores are model-generated. Check the written feedback before relying on them.</p>
  <div className="score-grid">{Object.entries(rating.scores).map(([tag,score])=><div key={tag}><span>{tag.replaceAll("-"," ")}</span><b>{score}/10</b></div>)}</div>
  {(rating.corrections??[]).length>0&&<><h3>Check these language suggestions</h3>
   {rating.corrections.map((c,i)=>{const why=activeCorrectionGuidance(c.why,c.revised),hint=activeCorrectionGuidance(c.hint,c.revised);
    return <div className="correction" key={i}>
     <strong>Your words: “{c.original}”</strong>
     <p>{why??`Check this part for ${c.tag.replaceAll("-"," ")}.`}</p>
     {hint&&<p><strong>Hint:</strong> {hint}</p>}
     <p>Check the whole sentence before accepting this suggestion.</p>
     <p>Now rewrite this part in your own words.</p>
    </div>})}
  </>}
  {focus&&<p><strong>Revision focus:</strong> {focus}</p>}
  {actions.length>0&&<><h3>Revision actions</h3><ul>{actions.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
  {rating.canEstimateLevel===false&&<p className="notice">This sample is too limited for a reliable CEFR estimate.</p>}
  {exercise&&<div className="exercise"><strong>Targeted follow-up{rating.exerciseTag?' · '+rating.exerciseTag:''}</strong><p>{exercise}</p></div>}
  {rating.corrections.length>0&&Object.values(rating.scores).every(x=>x>=9)&&<p className="notice">High rubric scores alongside a correction need review; do not treat these as established mastery.</p>}
  <p className="notice">AI grammar suggestions can be mistaken. These observations do not certify proficiency.</p>
 </section>;
}return <section className="feedback"><div className="feedback-mode">{draft?"Imported feedback · awaiting adult approval":assisted?"Adult-approved assisted AI review · provisional educational estimate":"AI language evaluation · provisional educational estimate"}</div><p>{rating.summary}</p><h3>What worked well</h3><ul>{rating.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul><h3>Your next improvements</h3><ul>{rating.improvements.map((s,i)=><li key={i}>{s}</li>)}</ul>{rating.corrections.map((c,i)=><div className="correction" key={i}><strong>Look at: “{c.original}”</strong><p>{c.why}</p><p><strong>Hint:</strong> {c.hint}</p><details><summary>Show a possible correction</summary><p>{c.revised}</p></details></div>)}{rating.revisionSummary&&<p><strong>Revision review:</strong> {rating.revisionSummary}</p>}{rating.revisionInstructions?.length&&<><h3>Revision instructions</h3><ul>{rating.revisionInstructions.map((x,i)=><li key={i}>{x}</li>)}</ul></>}<p>Try your own revision before revealing a correction.</p><div className="score-grid">{Object.entries({...rating.scores,relevance:rating.relevance}).map(([tag,score])=><div key={tag}><span>{tag.replaceAll('-',' ')}</span><b>{score}/10</b></div>)}</div>{!rating.canEstimateLevel&&<p className="notice">Limited sample: these observations do not establish a Writing CEFR level.</p>}<div className="exercise"><strong>Targeted follow-up · {rating.exerciseTag}</strong><p>{rating.exercise}</p></div></section>}
type History={submissions:WritingSubmission[];evaluations:WritingEvaluation[];aiAvailable:boolean};
export function SavedWriting({revision,onRevision,onResult,refreshKey,activeWork=false}:{activeWork?:boolean;revision:string;onRevision:(value:string)=>void;onResult:(result:WritingReply)=>void;refreshKey:string}){
 const [data,setData]=useState<History|null>(null),[selected,setSelected]=useState(''),[kind,setKind]=useState<'revision'|'sentence'>('sentence'),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function load(preferred?:string){try{const response=await fetch('/api/writing');const value=await response.json() as History&{error?:string};if(!response.ok)throw Error(value.error??'Could not load history');setData(value);setSelected(old=>preferred??(value.submissions.some(s=>s.id===old)?old:value.submissions.at(-1)?.id??''));setError('')}catch(e){setError(e instanceof Error?e.message:'Could not load history')}}
 useEffect(()=>{void load()},[refreshKey]);
 const submission=data?.submissions.find(s=>s.id===selected),evaluation=effectiveEvaluation(data?.evaluations.filter(e=>e.submissionId===selected)??[]);
 async function send(retry=false){if(!submission)return;if(!retry&&!revision.trim()){setError('Write your own revision first.');return}setBusy(true);setError('');try{const r=await fetch('/api/writing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(retry?{text:submission.text,kind:submission.kind,parentId:submission.parentId,retry:true}:{text:revision,kind,parentId:submission.id})});const result=await r.json() as WritingReply&{error?:string};if(!r.ok)throw Error(result.error??'Unable to save revision');onResult(result);await load(result.submission.id)}catch(e){setError(e instanceof Error?e.message:'Unable to save revision')}finally{setBusy(false)}}
 return <section className="panel progress-bottom"><h2>Saved Writing & revisions</h2><p>Original submissions and each revision stay separate. Only validated automatic reviews or adult-approved assisted reviews can add proficiency evidence.</p>{error&&<p role="alert">{error}</p>}{!data?<button className="secondary-button" onClick={()=>void load()}>Load Writing history</button>:<>{!data.aiAvailable&&<p className="notice">Automatic AI is unavailable. New submissions enter Pending Review for an authorized adult. Your work is saved across sessions.</p>}{data.submissions.length>0?<><label className="field">Choose a saved submission<select value={selected} onChange={e=>setSelected(e.target.value)}>{[...data.submissions].reverse().map((s,i)=><option key={s.id} value={s.id}>{s.kind} · {new Date(s.createdAt).toLocaleString('en-GB')} · {s.text.slice(0,35)}</option>)}</select></label>{submission&&<details><summary>View saved text</summary><p style={{whiteSpace:'pre-wrap'}}>{submission.text}</p></details>}<p><strong>Evaluation status:</strong> {evaluation?.status==='approved'?'Approved by an adult':evaluation?.status==='validated'?'Automatic AI review': 'Pending Review'}</p>{evaluation?.rating?<TeachingFeedback activeWork={activeWork} rating={evaluation.rating} assisted={evaluation.source==="assisted-ai"}/>:<p>{evaluation?.reason??'No AI feedback has been saved.'}</p>}{evaluation?.status!=='validated'&&evaluation?.status!=='approved'&&<button className="secondary-button" disabled={busy||!data.aiAvailable} onClick={()=>void send(true)}>Retry AI evaluation</button>}<h3>Revise independently</h3><label className="field">Revision scope<select value={kind} onChange={e=>setKind(e.target.value as typeof kind)}><option value="sentence">One sentence or follow-up exercise · no CEFR estimate</option><option value="revision">Complete revised draft</option></select></label><label className="field">Your revision<textarea rows={kind==='revision'?10:4} value={revision} onChange={e=>onRevision(e.target.value)} placeholder="Use the hint and write your own improvement..."/></label><button className="primary-button" disabled={busy||!revision.trim()} onClick={()=>void send()}>{busy?'Saving and checking…':data.aiAvailable?'Save & evaluate my revision':'Save revision for adult review'}</button></>:<p>Submit your draft in the Writing step first. Existing earlier drafts and feedback remain in their original workspace.</p>}</>}</section>;
}
