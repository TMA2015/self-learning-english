'use client';

import {useEffect,useRef,useState} from 'react';
import type {WeekWork} from '../domain/writing-course-v2-b';
import type {Week2AIAdvice} from '../application/writing-week2-ai-feedback';

const unavailable="AI feedback isn't available right now. Your plan is saved; you can still edit or finish the lesson.";

/**
 * Provisional on-demand response for one SAVED Week 2 version.
 * Does not update WeekWork, evidence, scores, history or completion.
 */
export function Week2OptionalAIReview({work,saved,busy,error,showVi}:{
 work:WeekWork;saved:boolean;busy:boolean;error:string;showVi:boolean;
}){
 const current=work.submission;
 const version=work.history.findIndex(h=>h.signature===current?.signature&&h.at===current?.at)+1;
 const serverPersistence=process.env.NEXT_PUBLIC_LEARNING_RUNTIME!=='browser';
 const ready=serverPersistence&&!!saved&&!busy&&!error&&!!current&&version>0;
 const signature=current?.signature??'unsaved';
 const identity=signature+':'+(current?.at??0)+':'+version;
 const latest=useRef(identity);
 latest.current=identity;
 const [result,setResult]=useState<Week2AIAdvice|null>(null);
 const [pending,setPending]=useState(false);
 const [message,setMessage]=useState('');

 useEffect(()=>{
  setResult(null);
  setMessage('');
  setPending(false);
 },[identity]);

 async function request(){
  if(!serverPersistence||!ready||pending||!current)return;
  const requestedIdentity=identity;
  const payload={version,signature:current.signature,fields:current.fields};
  setPending(true);setMessage('');setResult(null);
  try{
   const response=await fetch('/api/writing-week2-ai',{
    method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload),
   });
   const body=await response.json() as {feedback?:Week2AIAdvice};
   if(latest.current!==requestedIdentity)return;
   const f=body.feedback;
   if(!response.ok||!f||f.version!==version||f.evidence_weight!==0||
     !f.provisional||!f.strength||!Array.isArray(f.suggestions)||
     f.suggestions.length>2||!f.nextAction){
    setMessage(unavailable);return;
   }
   setResult(f);
  }catch{
   if(latest.current===requestedIdentity)setMessage(unavailable);
  }finally{
   if(latest.current===requestedIdentity)setPending(false);
  }
 }

 return <article className="wcv2-card" aria-label="Optional AI review of saved Week 2 plan">
  <h3>Ask AI to review my ideas (optional)</h3>
  <p>AI can suggest improvements to your plan. It may be mistaken; you decide what to change.</p>
  {showVi&&<p className="vi-help">AI chỉ góp ý cho bản kế hoạch đã lưu; bạn tự quyết định điều chỉnh. Đây không phải điểm hay đánh giá trình độ chính thức.</p>}
  <p className="muted">Pressing this button sends your saved notes to our configured AI provider, subject to the site's data notice. AI feedback is provisional advice, not an official grade.</p>
  {!serverPersistence?<p className="muted">Your plan is saved only on this device. AI review requires an authenticated server-saved version and is unavailable in this browser-only app. You can still edit and finish Week 2.</p>:ready?<p className="muted">Saved version {version} is ready for an optional review.</p>:
   <p className="muted">Save your Main Practice plan successfully before requesting AI feedback. Your lesson does not depend on AI.</p>}
  <button type="button" className="secondary-button"
   disabled={!ready||pending} onClick={()=>void request()}>
   {pending?'Reviewing your saved plan…':'Check my saved plan with AI'}
  </button>
  {result&&<div role="status" aria-live="polite" className="wcv2-card">
   <h4>Version {result.version} AI Review</h4>
   <p className="muted">Provisional AI feedback · not a CEFR/IELTS grade · evidence weight 0</p>
   <p><strong>One strength:</strong> {result.strength}</p>
   {result.suggestions.length>0&&<><strong>Suggestions to consider</strong>
    <ul>{result.suggestions.map((suggestion,i)=><li key={i}>{suggestion}</li>)}</ul></>}
   <p><strong>Next action:</strong> {result.nextAction}</p>
   {showVi&&<p className="vi-help">Hãy chọn một gợi ý phù hợp, quay lại phần Main Practice để tự sửa và lưu phiên bản mới.</p>}
   <p className="muted">To revise, choose Edit my ideas below, then save a new version. Earlier versions stay in your history.</p>
  </div>}
  {message&&<p role="status" className="notice">{message}</p>}
 </article>;
}
