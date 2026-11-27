'use client';
/**
 * Source-driven Wave 4 learner UI. Real learner-facing data is independently
 * validated against the exact NotebookLM-approved 68,935-byte manuscript.
 * Synthetic fixtures are confined to the isolated browser QA harness.
 */
import {useEffect,useRef,useState} from 'react';
import {WritingGoal,WritingHeading,WritingMeta,WritingTask,WritingModel,WritingSteps,WritingNext,WritingText,WritingSelfCheck,WritingReviewAction} from './foundation-writing-ui';
import {validateWave4Bundle,type Wave4Lesson,type TaskStrip,type OwnField} from '../domain/foundation-writing-wave4-content';
import {eligibleArtifact,type Wave4Id,type Wave4Draft,type Wave4Work,type Objective} from '../domain/foundation-writing-wave4-readiness';

type Screen='learn'|'cycleA'|'cycleB'|'transfer'|'extra';
type Review={summary:string;strengths:string[];improvements:string[];quotes:string[];
 questions:string[];nextAction:string;scores:null;level:null};
export type Wave4ReviewRequest={unitId:Wave4Id;fixtureId:string;task:string;text:string};
type Props={
 unitId:Wave4Id;approvedBundle:Wave4Lesson[];work:Wave4Work;
 onEdit:(draft:Wave4Draft)=>void;
 /** Must return true only after a durable write AND exact independent readback. */
 onSave:()=>Promise<boolean>;
 onExit:()=>void;
 originalDraftV1?:string;
 reviewer?:(payload:Wave4ReviewRequest)=>Promise<unknown>;
 showVi?:boolean;
};
const safeReview=(value:unknown,learnerText:string):Review|null=>{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const r=value as Record<string,unknown>;
 const strings=(k:string,max:number,min=0)=>Array.isArray(r[k])&&(r[k] as unknown[]).length<=max&&
  (r[k] as unknown[]).length>=min&&(r[k] as unknown[]).every(x=>typeof x==='string'&&x.trim().length>0);
 if(r.scores!==null||r.level!==null||r.canEstimateLevel!==false||
  typeof r.summary!=='string'||!r.summary.trim()||
  !strings('strengths',2)||!strings('improvements',2)||!strings('quotes',3)||
  !strings('questions',2,1)||typeof r.nextAction!=='string'||!r.nextAction.trim())return null;
 if((r.quotes as string[]).some(x=>!learnerText.includes(x)))return null;
 return r as Review;
};
function Strip({x}:{x:TaskStrip}){
 return <details className="wcv2-card" open aria-label="Task Map · four parts">
  <summary><strong>Task Map · Topic / Task / Must Include / Boundary</strong></summary>
  <dl><dt>Topic</dt><dd>{x.topic}</dd><dt>Task</dt><dd>{x.task}</dd>
   <dt>Must Include</dt><dd>{x.mustInclude}</dd><dt>Boundary</dt><dd>{x.boundary}</dd></dl>
 </details>;
}
function Field({unit,stage,field,value,onValue,locked=false}:{unit:Wave4Id;stage:string;field:OwnField;value:string;
 onValue:(v:string)=>void;locked?:boolean}){
 return <label className="field" htmlFor={unit+'-'+stage+'-'+field.key}>
  <strong>{field.label}</strong>
  <WritingText name={unit+'-'+stage+'-'+field.key} id={unit+'-'+stage+'-'+field.key}
   rows={4} maxLength={6000} value={value} readOnly={locked} onChange={e=>{if(!locked)onValue(e.target.value)}}
   placeholder="Write your own words. The teacher's example is a different task."/>
  {locked&&<span className="muted">Original V1 saved · read-only. Continue in the V2 field or record a justified keep decision.</span>}
 </label>;
}
export function FoundationWritingWave4({unitId,approvedBundle,work,onEdit,onSave,onExit,
 originalDraftV1,reviewer,showVi=false}:Props){
 const sourceAudit=validateWave4Bundle(approvedBundle);
 const src=sourceAudit.pass?approvedBundle.find(x=>x.id===unitId):undefined;
 const [tab,setTab]=useState<Screen>('learn'),[demo,setDemo]=useState(0);
 const [shown,setShown]=useState<Record<string,boolean>>({}),[saving,setSaving]=useState(false);
 const [status,setStatus]=useState(''),[reviewBusy,setReviewBusy]=useState(false);
 const [review,setReview]=useState<Review|null>(null);
 const [reviewError,setReviewError]=useState(''),[target,setTarget]=useState<'cycleB'|'transfer'>('cycleB');
 const token=useRef(0),live=useRef(true),signature=useRef('');
 signature.current=JSON.stringify(work.draft);
 useEffect(()=>{live.current=true;return()=>{live.current=false;token.current++}},[]);
 useEffect(()=>{token.current++;setTab('learn');setDemo(0);setShown({});
  setReview(null);setReviewError('');setTarget('cycleB');},[unitId]);
 if(!src)return <section className="panel wcv2" role="alert">
  <h2>Foundation Writing {unitId} is not ready</h2>
  <p>The original approved teaching source is missing or failed validation. No learner attempt will be created.</p>
 </section>;
 const draft=work.draft;
 const latest=work.versions.at(-1);
 const exact=!!latest&&latest.signature===JSON.stringify(draft);
 const selected=src[target];
 const payload=eligibleArtifact(unitId,work,selected.id,selected.fields.filter(f=>f.requiredForAI===true||
  (f.requiredForAI===undefined&&f.key==='draftV1')).map(f=>f.key));
 const change=(next:Wave4Draft)=>{token.current++;setReviewBusy(false);setReview(null);setReviewError('');
  setStatus('');onEdit(next)};
 const navigate=(next:Screen)=>{token.current++;setReviewBusy(false);setReview(null);setReviewError('');if(next==='cycleB'||next==='transfer')setTarget(next);setTab(next)};
 const choice=(q:Objective,which:'cycleAAnswers'|'extrasAnswers')=>{
  const answer=draft[which][q.id]??'',reveal=shown[q.id]===true;
  return <article className="wcv2-card" key={q.id} aria-label={q.id}>
   <h3>{q.id}</h3><p>{q.stem??'Choose the best answer to the fixed question.'}</p>
   <fieldset><legend>{q.id} · Choose the best answer</legend>
    {q.options.map(o=><label className="field wcv2-radio-option" key={o.id}>
     <input type="radio" name={q.id} value={o.id} checked={answer===o.id}
      onChange={()=>{setShown(v=>({...v,[q.id]:false}));change({...draft,
       [which]:{...draft[which],[q.id]:o.id}})}}/>
     <span>{o.id}. {o.text}</span>
     {reveal&&<p className={o.id===q.key?'fw-rationale fw-correct':'fw-rationale'}>{o.rationale}</p>}
    </label>)}
   </fieldset>
   <button type="button" className="secondary-button" disabled={!answer}
    onClick={()=>setShown(v=>({...v,[q.id]:true}))}>Check and explain</button>
   {reveal&&<p role="status" className={answer===q.key?'fw-answer fw-correct':'fw-answer fw-retry'}>{answer===q.key?'Correct. ':'Review your choice. '}Fixed key: {q.key}. This checks a choice, not your original writing.</p>}
  </article>;
 };
 const fieldEditor=(stage:'cycleB'|'transfer',key:string,value:string)=>
  change({...draft,[stage]:{...draft[stage],[key]:value}});
 async function save(exit=false){
  if(saving)return false;setSaving(true);setStatus('');
  try{
   const ok=await onSave();if(!live.current)return false;
   if(!ok){setStatus('Save failed or readback not confirmed. Retry before leaving. AI is disabled.');return false;}
   setStatus('Saved and verified. Practice completion is not a language grade.');
   if(exit)onExit();return true;
  }catch{if(live.current)setStatus('Save failed. Your draft remains on screen; retry.');return false}
  finally{if(live.current)setSaving(false)}
 }
 async function requestReview(){
  if(!reviewer||!payload||!exact||reviewBusy||saving)return;
  const request=++token.current,originalSig=signature.current;
  setReviewBusy(true);setReview(null);setReviewError('');
  try{
   const result=await reviewer({unitId,fixtureId:selected.id,task:selected.prompt,text:payload});
   if(!live.current||token.current!==request||signature.current!==originalSig)return;
   const value=safeReview(result,payload);
   if(!value){setReviewError('AI review unavailable or invalid. Your saved draft remains unchanged.');return;}
   setReview(value);
  }catch{if(live.current&&token.current===request)setReviewError('AI review unavailable; saved work is safe.')}
  finally{if(live.current&&token.current===request)setReviewBusy(false)}
 }
 return <section className="panel wcv2 fw-unit" aria-label={'Foundation Writing '+unitId}>
  <div className="foundation-unit-top-nav"><button type="button" className="secondary-button" onClick={onExit}>← Back to Foundation Writing</button><div className="fw-top-actions"><span className="muted">{exact?'Saved work available':'Editable draft'}</span><button type="button" className="secondary-button" disabled={saving} onClick={()=>void save(true)}>Save &amp; Exit</button></div></div>
  <div className="page-heading"><div>
   <span className="eyebrow">Foundation Writing · Unit {String(Number(unitId.slice(-2))).padStart(2,'0')}</span>
   <h1>{src.title}</h1><WritingMeta unit={Number(unitId.slice(-2))}/>
   <p className="muted">Independent teaching and practice · {src.minutes==='self-paced'?'self-paced, flexible timing':src.minutes+' minutes (flexible)'}.
    No automatic CEFR score.</p>
  </div></div>
  <WritingSteps step={tab} onStep={navigate} checked={src.extras.every(q=>!!draft.extrasAnswers[q.id]&&shown[q.id])} saved={!!exact}/>
  {tab==='learn'&&<WritingGoal unit={Number(unitId.slice(-2))} showVi={showVi}/>}
  <p role="status" className="muted">{exact?'Saved version '+latest.version+'.':
   'This draft is not yet saved exactly.'}</p>
  {originalDraftV1&&<details className="wcv2-card">
   <summary>Your original Unit 09 Draft V1 · read-only</summary>
   <blockquote>{originalDraftV1}</blockquote>
   <p className="muted">This copy is never rewritten by editing Units 10–12.</p>
  </details>}
  {tab==='learn'&&<section aria-label={unitId+' independent teaching'}>
   <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1</h3><p style={{whiteSpace:'pre-wrap'}}>{src.teaching.lessons[0]}</p>
   <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{src.teaching.demo.prompt}</WritingModel>
   <button className="secondary-button" type="button" disabled={demo>=src.teaching.demo.steps.length}
    onClick={()=>setDemo(x=>Math.min(x+1,src.teaching.demo.steps.length))}>
    {demo?'Reveal next reasoning step':'Reveal first reasoning step'}</button>
   {demo>0&&<ol className="fw-demo-steps">{src.teaching.demo.steps.slice(0,demo).map(([name,explain],i)=>
    <li key={i}><strong>{name}:</strong> {explain}</li>)}</ol>}
   <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2</h3><p style={{whiteSpace:'pre-wrap'}}>{src.teaching.lessons[1]}</p>
   <details><summary>Optional A1 bridge</summary><p>{src.teaching.a1}</p></details>
   <details><summary>Optional B1 extension</summary><p>{src.teaching.b1}</p></details>
  </section>}
  {tab==='cycleA'&&<section aria-label={unitId+' Practice A'}>
   <WritingHeading number={1}>Practice A</WritingHeading>
   <Strip x={src.cycleA.taskStrip}/><WritingTask>{src.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
   {src.cycleA.items.map(q=>choice(q,'cycleAAnswers'))}
   <h3>Your own explanation (not auto-graded)</h3>
   {src.cycleA.ownFields.map(f=><Field key={f.key} unit={unitId} stage="cycleA" field={f}
    value={draft.cycleAOwn?.[f.key]??''} onValue={value=>change({...draft,cycleAOwn:{...draft.cycleAOwn,[f.key]:value}})}/>)}
  </div>
  </section>}
  {(['cycleB','transfer'] as const).includes(tab as 'cycleB'|'transfer')&&
   (tab==='cycleB'||tab==='transfer')&&<section aria-label={unitId+' original '+tab}>
    <WritingHeading number={1}>{tab==='cycleB'?'Practice B':'Independent transfer'}</WritingHeading>
    <Strip x={src[tab].taskStrip}/><WritingTask>{src[tab].prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
    <div className="fw-draft-fields">{src[tab].fields.map(f=>{const original=/V1$/i.test(f.key)?work.versions.find(v=>!!v.draft[tab][f.key]?.trim())?.draft[tab][f.key]:undefined;return <div key={f.key} className={/V[12]$/i.test(f.key)?'fw-draft-half':'fw-draft-full'}><Field unit={unitId} stage={tab} field={f}
     value={original??draft[tab][f.key]??''} locked={!!original}
     onValue={value=>fieldEditor(tab,f.key,value)}/>{/V2$/i.test(f.key)&&!draft[tab][f.key]?.trim()&&(()=>{const first=src[tab].fields.find(x=>/V1$/i.test(x.key));const value=first&&work.versions.find(v=>!!v.draft[tab][first.key]?.trim())?.draft[tab][first.key];return value?<button type="button" className="secondary-button" onClick={()=>fieldEditor(tab,f.key,value)}>Copy saved V1 to V2</button>:null})()}</div>})}</div>
    {tab==='cycleB'&&<fieldset><legend>Your editing or retention decision</legend>
     {(['REVISION_SAVED','NO_CHANGE_JUSTIFIED','KEEP_V1_WITH_REASON'] as const).map(v=>
      <label className="field wcv2-radio-option" key={v}>
       <input type="radio" name={unitId+'-revision'} value={v} checked={draft.revisionDecision===v}
        onChange={()=>change({...draft,revisionDecision:v})}/>
       {v==='REVISION_SAVED'?'I made a meaningful revision':v==='NO_CHANGE_JUSTIFIED'?
        'No language change was needed and I can explain why':'I kept V1 and can justify the choice'}
      </label>)}
     <Field unit={unitId} stage="revision" field={{key:'reason',label:'Explain your decision in your own words'}}
      value={draft.revisionReason??''} onValue={value=>change({...draft,revisionReason:value})}/>
    </fieldset>}
   </div>
  </section>}
  {tab==='extra'&&<section aria-label={unitId+' supplementary questions'}>
   <WritingHeading number={1}>Knowledge Check</WritingHeading>
   <p>Choose a response, then read the explanation. These answers do not grade your original writing.</p>
   {src.extras.map(q=>choice(q,'extrasAnswers'))}
  </section>}
  {(tab==='cycleB'||tab==='transfer')&&<section className="fw-inline-ai" aria-label="AI Tutor Writing Review" key={unitId+'-'+tab}>
   <h2>AI Writing Tutor</h2><p>Get feedback on this writing, then improve your answer here.</p>
   <WritingSelfCheck key={tab} unit={Number(unitId.slice(-2))}/>
   <WritingReviewAction signature={signature.current} eligible={!!payload} busy={saving||reviewBusy} available={!!reviewer} onSave={()=>save()} onAsk={()=>void requestReview()}/>
   {reviewError&&<p role="status" className="notice">{reviewError}</p>}
   {review&&<article className="wcv2-card" aria-live="polite">
    <h3>Provisional feedback · no score or CEFR claim</h3><p>{review.summary}</p>
    <h4>Strengths</h4><ul>{review.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul>
    <h4>Priorities</h4><ul>{review.improvements.map((s,i)=><li key={i}>{s}</li>)}</ul>
    <h4>Your exact excerpts</h4><ul>{review.quotes.map((s,i)=><li key={i}><q>{s}</q></li>)}</ul>
    <h4>Questions</h4><ul>{review.questions.map((s,i)=><li key={i}>{s}</li>)}</ul>
    <p><strong>Next step:</strong> {review.nextAction}</p>
   </article>}
  </section>}
  <div className="learning-choices fw-actions">
   <WritingNext step={tab} onStep={navigate} onFinish={()=>void save(true)}/>
   <button type="button" className="secondary-button" disabled={saving}
    onClick={()=>void save()}>{saving?'Saving…':'Save work'}</button>
   
   <button type="button" className="secondary-button" onClick={onExit}>Back to Foundation Writing</button>
  </div>
  {status&&<p role="status" className="notice">{status}</p>}
  {showVi&&<p className="vi-help">Em có thể học và lưu bài mà không cần AI. Bản nháp đã lưu không bị tự động viết lại.</p>}
 </section>;
}
