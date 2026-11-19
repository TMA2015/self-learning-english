'use client';
import {useEffect,useRef,useState} from 'react';
import {requestWritingAI,type OnDemandWritingFeedback} from '../infrastructure/browser/client-services';
import {TeachingBlocks,Inline} from './teaching-blocks';
import {CEFR_WRITING_CRITERIA,WRITING_STUDIO_CEFR_RUBRIC_VERSION,type WritingStudioReference} from '../domain/writing-studio-reference';

/** Independent learner-local feedback cache: never changes the underlying attempt grade.
 * The student must explicitly request AI before any writing is sent to Firebase. */
function fingerprint(value:string){
 let a=2166136261,b=2246822519;
 for(let i=0;i<value.length;i++){const c=value.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,2246822519);}
 return (a>>>0).toString(16)+(b>>>0).toString(16);
}
export function WritingAIReview({reviewId,task,fields,kind,enabled,sourceSample=false,responseLanguage='en',reviewMode='standard',reference={kind:'general'}}:{
 reviewId:string;task:string;fields:Record<string,string>;
 kind:'draft'|'planning'|'revision';enabled:boolean;sourceSample?:boolean;responseLanguage?:'en'|'vi';reviewMode?:'standard'|'any-topic';reference?:WritingStudioReference;
}){
 const signature=JSON.stringify([task,fields,kind,...(kind==='revision'?[responseLanguage]:[]),...(reviewMode==='any-topic'?[reviewMode,responseLanguage,'academic-r1',...(reference.kind==='cefr'?[reference.kind,reference.level,WRITING_STUDIO_CEFR_RUBRIC_VERSION]:[])]:[])]);
 const latestSignature=useRef(signature);
 latestSignature.current=signature;
 const currentlyEligible=useRef(enabled);
 currentlyEligible.current=enabled;
 // Prevent an in-flight provider response from restoring a cleared draft's
 // private AI feedback cache after this view has been unmounted.
 const mounted=useRef(false);
 useEffect(()=>{
   mounted.current=true;
   return ()=>{mounted.current=false};
 },[]);
 const storageKey='g-learning:english:ai-feedback:v1:'+reviewId.replace(/[^a-z0-9-]/gi,'')+':'+fingerprint(signature);
 const [feedback,setFeedback]=useState<OnDemandWritingFeedback|null>(null);
  const [feedbackSignature,setFeedbackSignature]=useState<string|null>(null);
 const [reason,setReason]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>{
   setFeedback(null);setFeedbackSignature(null);setReason('');
   if(!enabled)return; // Never reveal a cached result for an unsaved or ineligible draft.
   try{
     const stored=localStorage.getItem(storageKey);
     if(stored){
       const parsed=JSON.parse(stored) as OnDemandWritingFeedback;
       if(parsed.provider==='firebase-ai-logic'&&parsed.kind===kind&&typeof parsed.summary==='string'&&Array.isArray(parsed.strengths)&&
         ((kind!=='revision'&&reviewMode!=='any-topic')||(parsed.scores===null&&parsed.level===null))&&
          (reference.kind!=='cefr'||(parsed.targetCEFR===reference.level&&parsed.rubricVersion===WRITING_STUDIO_CEFR_RUBRIC_VERSION&&Array.isArray(parsed.criteria)))){
          setFeedback(parsed);setFeedbackSignature(signature);
        }
     }
   }catch{/* local storage can be blocked; feedback still works without it */}
 },[storageKey,enabled]);
 async function request(){
   if(busy||!enabled)return;
   setBusy(true);setReason('');
   const requestedSignature=signature;
   try{
     const result=await requestWritingAI(task,fields,kind,responseLanguage,reviewMode,reviewMode==='any-topic'&&reference.kind==='cefr'?reference.level:null);
     // The learner may edit or navigate while a request is in flight. Never
     // display an old response as an assessment of a newer draft.
     if(!mounted.current||!currentlyEligible.current||latestSignature.current!==requestedSignature)return;
     if(result.status==='validated'){
       if(reviewMode==='any-topic'&&(result.feedback.scores!==null||result.feedback.level!==null||
          (reference.kind==='cefr'&&(result.feedback.targetCEFR!==reference.level||!Array.isArray(result.feedback.criteria))))){
         setFeedback(null);setReason('Any Topic feedback must be unscored. Please try again later.');return;
       }
       setFeedback(result.feedback);setFeedbackSignature(signature);
       try{localStorage.setItem(storageKey,JSON.stringify(result.feedback))}catch{/* storage optional */}
     }else{setFeedback(null);setReason(result.reason)}
   }catch{if(mounted.current&&currentlyEligible.current&&latestSignature.current===requestedSignature)setReason('AI feedback could not be completed. Your saved work is unchanged.')}
   finally{if(mounted.current)setBusy(false)}
 }
 const visibleFeedback=enabled&&feedbackSignature===signature?feedback:null;
 return <section className="writing-ai-review" aria-label={reviewMode==='any-topic'?'AI Tutor Writing Review':'Optional Gemini writing feedback'}>
   <div className="writing-ai-review-heading"><strong>{reviewMode==='any-topic'?'✦ AI Tutor · Writing Review':'✦ Gemini AI Writing'}</strong><span>{visibleFeedback?'Provisional AI feedback':busy?'Checking your writing…':'Optional · On demand'}</span></div>
   {!visibleFeedback&&<p>{kind==='revision'?'Compare your saved original and revised text with Gemini. Get evidence-based feedback on actual changes and one next revision action; no grade or CEFR estimate is assigned.':'Get feedback on relevance, ideas, organization and language. This is separate from the saved exercise and is not an official CEFR score.'}</p>}
   {sourceSample&&<p>Sample-based revision is practice only; any AI feedback cannot assess your independent writing ability.</p>}
   {visibleFeedback?<div aria-live="polite">
     <p><strong>AI response received · {visibleFeedback.model}</strong> · Provisional educational feedback</p>
     {reviewMode==='any-topic'&&reference.kind==='cefr'&&<p className="muted">CEFR {reference.level} is your selected practice target, not your measured or certified proficiency.</p>}
      {(kind==='revision'||reviewMode==='any-topic')?<TeachingBlocks text={visibleFeedback.summary}/>:<p>{visibleFeedback.summary}</p>}
      {reviewMode==='any-topic'&&reference.kind==='cefr'&&visibleFeedback.criteria&&<section aria-label="CEFR target-referenced writing criteria">
        <h3>Feedback against CEFR {reference.level} writing expectations</h3>
        <p className="muted">Qualitative practice observations based on the Council of Europe CEFR Companion volume (2020); no scores or level certification.</p>
        {visibleFeedback.criteria.map((item,index)=><div className="criterion-feedback" key={item.criterion}>
          <h4>{CEFR_WRITING_CRITERIA[index]?.name??item.criterion}</h4>
          <p>{item.observation}</p>
          <p><strong>From your text: </strong>{item.evidence?<>“{item.evidence}”</>:'Not enough evidence in this sample.'}</p>
          <p><strong>Next step: </strong>{item.nextStep}</p>
        </div>)}
      </section>
     {visibleFeedback.strengths.length>0&&<><strong>What worked well</strong><ul>{visibleFeedback.strengths.map((s,i)=><li key={i}>{(kind==='revision'||reviewMode==='any-topic')?<Inline text={s}/>:s}</li>)}</ul></>}
     {visibleFeedback.improvements.length>0&&<><strong>What to improve</strong><ul>{visibleFeedback.improvements.map((s,i)=><li key={i}>{(kind==='revision'||reviewMode==='any-topic')?<Inline text={s}/>:s}</li>)}</ul></>}
     {visibleFeedback.scores&&kind!=='revision'&&reviewMode!=='any-topic'&&!sourceSample&&<div><strong>AI rubric observations · provisional (0–10)</strong><ul>{Object.entries(visibleFeedback.scores).map(([k,v])=><li key={k}>{k.replaceAll('-',' ')}: {v}/10</li>)}</ul></div>}
     {visibleFeedback.level&&kind!=='revision'&&reviewMode!=='any-topic'&&!sourceSample&&<p>Writing practice estimate: {visibleFeedback.level}.</p>}
     {visibleFeedback.corrections.length>0&&<><strong>Revision hints</strong><ul>{visibleFeedback.corrections.map((c,i)=><li key={i}>“{c.original}” — {reviewMode==='any-topic'?<Inline text={c.hint}/>:c.hint}</li>)}</ul></>}
     {(kind==='revision'||reviewMode==='any-topic')?<div><strong>Next practice:</strong><TeachingBlocks text={visibleFeedback.exercise}/></div>:<p><strong>Next practice:</strong> {visibleFeedback.exercise}</p>}
     <button type="button" className="secondary-button" disabled={busy||!enabled} onClick={()=>void request()}>Request updated AI feedback</button>
   </div>:<>
     <button type="button" className="secondary-button" disabled={!enabled||busy} onClick={()=>void request()}>{busy?'Checking with Gemini…':kind==='revision'?'Compare original & revision with Gemini':'Get AI feedback'}</button>
     <p className="muted">{kind==='revision'?'Only clicking this button sends your saved original text, revised version and revision notes to Gemini via Firebase AI Logic. This comparison is unscored.':'Only clicking this button sends your response to Firebase AI Logic. If AI fails, no AI score is assigned.'}</p>
     {reason&&<p role="status" className="notice">AI not available: {reason} {reviewMode==='any-topic'?'Your saved draft remains available to edit.':'Guided Check and saved work remain available.'}</p>}
   </>}
 </section>;
}

