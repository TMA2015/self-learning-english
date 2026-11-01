'use client';
import {useEffect,useRef,useState} from 'react';
import {requestWritingAI,type OnDemandWritingFeedback} from '../infrastructure/browser/client-services';

/** Independent learner-local feedback cache: never changes the underlying attempt grade.
 * The student must explicitly request AI before any writing is sent to Firebase. */
function fingerprint(value:string){
 let a=2166136261,b=2246822519;
 for(let i=0;i<value.length;i++){const c=value.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,2246822519);}
 return (a>>>0).toString(16)+(b>>>0).toString(16);
}
export function WritingAIReview({reviewId,task,fields,kind,enabled,sourceSample=false}:{
 reviewId:string;task:string;fields:Record<string,string>;
 kind:'draft'|'planning';enabled:boolean;sourceSample?:boolean;
}){
 const signature=JSON.stringify([task,fields,kind]);
 const latestSignature=useRef(signature);
 latestSignature.current=signature;
 const storageKey='g-learning:english:ai-feedback:v1:'+reviewId.replace(/[^a-z0-9-]/gi,'')+':'+fingerprint(signature);
 const [feedback,setFeedback]=useState<OnDemandWritingFeedback|null>(null);
 const [reason,setReason]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>{
   setFeedback(null);setReason('');
   try{
     const stored=localStorage.getItem(storageKey);
     if(stored){
       const parsed=JSON.parse(stored) as OnDemandWritingFeedback;
       if(parsed.provider==='firebase-ai-logic'&&typeof parsed.summary==='string'&&Array.isArray(parsed.strengths))setFeedback(parsed);
     }
   }catch{/* local storage can be blocked; feedback still works without it */}
 },[storageKey]);
 async function request(){
   if(busy||!enabled)return;
   setBusy(true);setReason('');
   const requestedSignature=signature;
   try{
     const result=await requestWritingAI(task,fields,kind);
     // The learner may edit or navigate while a request is in flight. Never
     // display an old response as an assessment of a newer draft.
     if(latestSignature.current!==requestedSignature)return;
     if(result.status==='validated'){
       setFeedback(result.feedback);
       try{localStorage.setItem(storageKey,JSON.stringify(result.feedback))}catch{/* storage optional */}
     }else{setFeedback(null);setReason(result.reason)}
   }catch{if(latestSignature.current===requestedSignature)setReason('AI feedback could not be completed. Your saved work is unchanged.')}
   finally{setBusy(false)}
 }
 return <section className="writing-ai-review" aria-label="Optional Gemini writing feedback">
   <div className="writing-ai-review-heading"><strong>✦ Gemini AI Writing</strong><span>{feedback?'Verified AI response':busy?'Checking your writing…':'Optional · On demand'}</span></div>
   {!feedback&&<p>Get feedback on relevance, ideas, organization and language. This is separate from the saved exercise and is not an official CEFR score.</p>}
   {sourceSample&&<p>Sample-based revision is practice only; any AI feedback cannot assess your independent writing ability.</p>}
   {feedback?<div aria-live="polite">
     <p><strong>AI response received · {feedback.model}</strong> · Provisional educational feedback</p>
     <p>{feedback.summary}</p>
     {feedback.strengths.length>0&&<><strong>What worked well</strong><ul>{feedback.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
     {feedback.improvements.length>0&&<><strong>What to improve</strong><ul>{feedback.improvements.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
     {feedback.scores&&!sourceSample&&<div><strong>AI rubric observations · provisional (0–10)</strong><ul>{Object.entries(feedback.scores).map(([k,v])=><li key={k}>{k.replaceAll('-',' ')}: {v}/10</li>)}</ul></div>}
     {feedback.level&&!sourceSample&&<p>Provisional CEFR screening: {feedback.level}. This is not a certified level.</p>}
     {feedback.corrections.length>0&&<><strong>Revision hints</strong><ul>{feedback.corrections.map((c,i)=><li key={i}>“{c.original}” — {c.hint}</li>)}</ul></>}
     <p><strong>Next practice:</strong> {feedback.exercise}</p>
     <button type="button" className="secondary-button" disabled={busy||!enabled} onClick={()=>void request()}>Request updated AI feedback</button>
   </div>:<>
     <button type="button" className="secondary-button" disabled={!enabled||busy} onClick={()=>void request()}>{busy?'Checking with Gemini…':'Get AI feedback'}</button>
     <p className="muted">Only clicking this button sends your response to Firebase AI Logic. If AI fails, no AI score is assigned.</p>
     {reason&&<p role="status" className="notice">AI not available: {reason} Guided Check and saved work remain available.</p>}
   </>}
 </section>;
}
