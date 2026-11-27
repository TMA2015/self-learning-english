'use client';
import {useEffect,useRef,useState} from 'react';
import {WritingGoal,WritingHeading,WritingMeta,WritingTask,WritingModel,WritingSteps,WritingNext,WritingText,WritingSelfCheck,WritingReviewAction} from './foundation-writing-ui';
import {TeachingBlocks} from './teaching-blocks';
import {EnglishLessonTutor} from './english-lesson-tutor';
import {browserTutorService} from '../infrastructure/browser/firebase-ai-browser';
import {WAVE3_UNITS,cycleAWave3Result,coverWave3Result,eligibleWave3Artifact,
 exactSavedWave3,supplementalWave3Result,wave3Progress,wave3Signature,
 type Wave3Id,type Wave3Work,type Wave3Draft,type Wave3Artifact
} from '../domain/foundation-writing-u07-u09';

type Screen='learn'|'cycleA'|'cycleB'|'transfer'|'extra';
type Review={summary:string;strengths:string[];improvements:string[];
 quotes:string[];questions:string[];nextAction:string;scores:null;level:null};
const fallback='AI review is currently unavailable. Your draft remains here. Only a confirmed successful save can make it reviewable.';
function OwnField({id,label,value,onChange,rows=3,help}:{
 id:string;label:string;value:string;onChange:(v:string)=>void;rows?:number;help?:string
}){
 return <label htmlFor={id} className="field"><strong>{label}</strong>
  {help&&<span className="muted">{help}</span>}
  <WritingText name={id} id={id} rows={rows} maxLength={6000}
   value={value} onChange={e=>onChange(e.target.value)}
   placeholder="Write your own answer; teacher examples are not prefilled."/>
 </label>;
}
function Strip({strip}:{strip:{topic:string;task:string;mustInclude:string;boundary:string}}){
 return <details className="wcv2-card" open aria-label="Four-part task map">
  <summary><strong>Task Map (read-only) · Topic / Task / Must Include / Boundary</strong></summary>
  <dl><dt>Topic</dt><dd>{strip.topic}</dd>
   <dt>Task</dt><dd>{strip.task}</dd>
   <dt>Must Include</dt><dd>{strip.mustInclude}</dd>
   <dt>Boundary</dt><dd>{strip.boundary}</dd>
  </dl>
 </details>;
}
export function FoundationWritingWave3({unitId,work,onEdit,onSave,onExit,showVi=false}:{
 unitId:Wave3Id;work:Wave3Work;onEdit:(draft:Wave3Draft)=>void;
 onSave:()=>Promise<boolean>;onExit:()=>void;showVi?:boolean
}){
 const src=WAVE3_UNITS[unitId],d=work.draft;
 const [screen,setScreen]=useState<Screen>('learn');
 const [demoCount,setDemoCount]=useState(0),[busy,setBusy]=useState(false);
 const [saveStatus,setSaveStatus]=useState(''),[target,setTarget]=useState<Wave3Artifact>('cycleB');
 const [pending,setPending]=useState(false),[review,setReview]=useState<{model:string;data:Review}|null>(null);
 const [reviewStatus,setReviewStatus]=useState('');
 const mounted=useRef(true),ticket=useRef(0),currentSig=useRef(''),currentTarget=useRef(target);
 const signature=wave3Signature(d);
 currentSig.current=signature;currentTarget.current=target;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;ticket.current++}},[]);
 useEffect(()=>{ticket.current++;setPending(false);setReview(null);setReviewStatus('');
  setScreen('learn');setDemoCount(0);setTarget('cycleB');},[unitId]);
 const saved=exactSavedWave3(work);
 const eligible=eligibleWave3Artifact(unitId,work,target);
 const progress=wave3Progress(unitId,work);
 function invalidate(){ticket.current++;setPending(false);setReview(null);setReviewStatus('')}
 function edit(next:Wave3Draft){invalidate();setSaveStatus('');onEdit(next)}
 function go(next:Screen){invalidate();if(next==='cycleA'||next==='cycleB'||next==='transfer')setTarget(next);setScreen(next)}
 async function save(exit=false){
  if(busy)return false;
  setBusy(true);setSaveStatus('');
  try{
   const ok=await onSave();
   if(!mounted.current)return false;
   if(!ok){setSaveStatus('Save failed. Do not exit; retry the save. AI is disabled for changes not successfully saved.');return false;}
   setSaveStatus('Saved '+unitId+' version successfully. This records practice, not a language grade.');
   if(exit)onExit();return true;
  }catch{if(mounted.current)setSaveStatus('Save failed. Your text remains on this page; retry.');return false}
  finally{if(mounted.current)setBusy(false)}
 }
 async function ask(){
  const artifact=eligibleWave3Artifact(unitId,work,target);
  if(!artifact||!saved||pending||busy)return;
  const request=++ticket.current,expected=signature,requestedTarget=target;
  setPending(true);setReview(null);setReviewStatus('');
  try{
   const tutor=browserTutorService();
   const response=tutor.available?await tutor.coach('foundation-writing',artifact.task,{
    unitId,fixtureId:artifact.fixtureId,text:artifact.text
   },{responseLanguage:showVi?'vi':'en'}):null;
   if(!mounted.current||ticket.current!==request||currentSig.current!==expected||
    currentTarget.current!==requestedTarget)return;
   const data=response?.structuredResult as Review|undefined;
   if(response?.provider==='firebase-ai-logic'&&data&&data.scores===null&&data.level===null&&
    typeof data.summary==='string'&&typeof data.nextAction==='string'&&
    Array.isArray(data.strengths)&&data.strengths.length<=2&&
    Array.isArray(data.improvements)&&data.improvements.length<=2&&
    Array.isArray(data.questions)&&data.questions.length>=1&&data.questions.length<=2&&
    Array.isArray(data.quotes)&&data.quotes.length<=3&&
    data.quotes.every(q=>typeof q==='string'&&artifact.text.includes(q))){
    setReview({model:response.model,data});
   }else setReviewStatus(fallback);
  }catch{if(mounted.current&&ticket.current===request)setReviewStatus(fallback)}
  finally{if(mounted.current&&ticket.current===request)setPending(false)}
 }
 const commonEdit=(kind:'cycleAOwn'|'cycleB'|'transfer',key:string,value:string)=>
  edit({...d,[kind]:{...d[kind],[key]:value}});
 const ownSection=(kind:'cycleAOwn'|'cycleB'|'transfer',
  fields:readonly {key:string;label:string}[])=>fields.map(f=>
   <OwnField key={f.key} id={unitId+'-'+kind+'-'+f.key} label={f.label}
    rows={f.key==='draftV1'||f.key==='draftV1Transfer'||f.key==='response'||f.key==='problem'?6:3}
    value={d[kind][f.key]??''} onChange={v=>commonEdit(kind,f.key,v)}/>);
 const objectiveItem=(q:{id:string;prompt:string;question:string;key:string;
  options:readonly {id:string;text:string;rationale:string}[]},extra=false)=>{
  const answers=extra?d.extrasAnswers:d.cycleAAnswers;
  const revealed=extra?!!d.extrasReveal[q.id]:d.cycleAReveal;
  return <article className="wcv2-card" key={q.id}>
   <h3>{q.id}</h3><blockquote>{q.prompt}</blockquote><fieldset>
    <legend>{q.question}</legend>
    {q.options.map(o=><label className="field wcv2-radio-option" key={o.id}>
     <input type="radio" name={q.id} value={o.id} checked={answers[q.id]===o.id}
      onChange={()=>extra?
       edit({...d,extrasAnswers:{...d.extrasAnswers,[q.id]:o.id},
        extrasReveal:{...d.extrasReveal,[q.id]:false}}):
       edit({...d,cycleAAnswers:{...d.cycleAAnswers,[q.id]:o.id},cycleAReveal:false})}/>
     <strong>{o.id}.</strong> {o.text}
     {revealed&&<p className={o.id===q.key?'fw-rationale fw-correct':'fw-rationale'}>{o.id===q.key?'Correct fixed key. ':''}{o.rationale}</p>}
    </label>)}
   </fieldset>
   {extra&&<button className="secondary-button" type="button" disabled={!answers[q.id]}
     onClick={()=>edit({...d,extrasReveal:{...d.extrasReveal,[q.id]:true}})}>
     Check this answer and all explanations</button>}
   {revealed&&<p role="status" className={answers[q.id]===q.key?'fw-answer fw-correct':'fw-answer fw-retry'}>{answers[q.id]===q.key?'Correct. ':'Review your choice. '}Fixed key: {q.key}. Original writing is not automatically graded.</p>}
  </article>;
 };
 return <section className="panel wcv2 fw-unit" aria-label={'Foundation Writing '+unitId}>
  <div className="foundation-unit-top-nav"><button type="button" className="secondary-button" onClick={onExit}>← Back to Foundation Writing</button><div className="fw-top-actions"><span className="muted">{saved?'Saved work available':'Editable draft'}</span><button type="button" className="secondary-button" disabled={busy} onClick={()=>void save(true)}>Save &amp; Exit</button></div></div>
  <div className="page-heading"><div>
   <span className="eyebrow">Foundation Writing · Unit {String(Number(unitId.slice(-2))).padStart(2,'0')}</span>
   <h1>{src.title}</h1><WritingMeta unit={Number(unitId.slice(-2))}/>
   <p className="muted">{src.minutes} · Learn at your own pace. Your independent writing remains yours.</p>
  </div></div>
  <WritingSteps step={screen} onStep={go} checked={progress.extras} saved={!!saved}/>
  {screen==='learn'&&<WritingGoal unit={Number(unitId.slice(-2))} showVi={showVi}/>}
  <p role="status" className="muted">
   {saved?'Saved version '+saved.version+'; any new edit requires saving again.':
    'Current work is not exactly saved. AI will not review it until you successfully save.'}
  </p>

  {screen==='learn'&&<section aria-label={unitId+' teacher demonstrations'}>
   <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1</h3><p>{src.teaching.lessons[0]}</p>
   <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{src.teaching.demo.prompt}</WritingModel>
   <button type="button" className="secondary-button"
    disabled={demoCount>=src.teaching.demo.steps.length}
    onClick={()=>setDemoCount(Math.min(demoCount+1,src.teaching.demo.steps.length))}>
    {demoCount?'Reveal next reasoning step':'Reveal first reasoning step'}</button>
   {demoCount>0&&<ol className="fw-demo-steps">{src.teaching.demo.steps.slice(0,demoCount).map((p,i)=>
    <li key={i}><strong>{p[0]}:</strong> {p[1]}</li>)}</ol>}
   <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2</h3><p>{src.teaching.lessons[1]}</p>
   {unitId==='FW-U07'&&<><blockquote>{WAVE3_UNITS['FW-U07'].teaching.ambiguity}</blockquote>
    <p>{WAVE3_UNITS['FW-U07'].teaching.ambiguityNote}</p></>}
   <details><summary>Optional A1 bridge</summary><p>{src.teaching.a1}</p></details>
   <details><summary>Optional B1 extension</summary><p>{src.teaching.b1}</p></details>
   <EnglishLessonTutor lesson={'Foundation Writing · '+unitId}
    focus={'Explain '+src.title+' with a new independent example, not answers to current Cycle A/B/transfer; no ghostwritten student text.'}/>
  </section>}

  {screen==='cycleA'&&<section aria-label={unitId+' Practice A'}>
   <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{src.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
   {unitId==='FW-U09'?
    <Strip strip={WAVE3_UNITS['FW-U09'].cycleA.taskStrip}/>:
    unitId==='FW-U07'?<><p>Provided P1:</p><blockquote>{WAVE3_UNITS['FW-U07'].cycleA.paragraph1}</blockquote>
     <p>Provided P2:</p><blockquote>{WAVE3_UNITS['FW-U07'].cycleA.paragraph2}</blockquote></>:null}
   {unitId==='FW-U09'?
    WAVE3_UNITS['FW-U09'].cycleA.cards.map(card=><div className="field fw-classify-row" key={card.id}>
     <label htmlFor={unitId+'-card-'+card.id}><strong>{card.id} · {card.text}</strong></label>
     <select id={unitId+'-card-'+card.id} value={d.cycleAAnswers[card.id]??''}
      onChange={e=>edit({...d,cycleAAnswers:{...d.cycleAAnswers,[card.id]:e.target.value},cycleAReveal:false})}>
      <option value="">Choose role / diagnosis</option>
      {WAVE3_UNITS['FW-U09'].cycleA.labels.map(o=><option key={o} value={o}>{o}</option>)}
     </select>
     {d.cycleAReveal&&<p className="muted" role="status">
      {cycleAWave3Result(unitId,card.id,d.cycleAAnswers[card.id]??'')?.correct?'Correct fixed role. ':'Review the supplied role. '}
      {card.rationale} (Key: {card.key})</p>}
    </div>):
    (unitId==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.objective:
     WAVE3_UNITS['FW-U08'].cycleA.objective).map(q=>objectiveItem(q))}
   <button className="secondary-button" type="button"
    onClick={()=>edit({...d,cycleAReveal:true})}>Check fixed Cycle A decisions</button>
   {unitId==='FW-U09'?<div className="wcv2-card" aria-label="U09 requirement coverage">
    <h3>{WAVE3_UNITS['FW-U09'].cycleA.cover.id} · task coverage</h3>
    {WAVE3_UNITS['FW-U09'].cycleA.cover.labels.map(x=><label className="field" key={x.id}>
     <input type="checkbox" checked={d.cycleACover.includes(x.id)}
      onChange={e=>edit({...d,cycleACover:e.target.checked?[...d.cycleACover,x.id]:
       d.cycleACover.filter(id=>id!==x.id),cycleACoverReveal:false})}/>
     {x.text}</label>)}
    <button type="button" className="secondary-button"
     onClick={()=>edit({...d,cycleACoverReveal:true})}>Check task coverage</button>
    {d.cycleACoverReveal&&<p role="status">All four requirements must be represented in C1–C4.
     {coverWave3Result(unitId,d.cycleACover)?.correct?' Correct set.':' Reconsider any missing item.'}</p>}
    <blockquote>{WAVE3_UNITS['FW-U09'].cycleA.falseOpening}</blockquote>
   </div>:<div className="wcv2-card">
    <h3>{unitId==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.order.id:WAVE3_UNITS['FW-U08'].cycleA.order.id}</h3>
    <label className="field" htmlFor={unitId+'-order'}>Fixed relationship
     <select id={unitId+'-order'} value={d.cycleAOrder}
      onChange={e=>edit({...d,cycleAOrder:e.target.value,cycleAOrderReveal:false})}>
      <option value="">Choose a role / meaning</option>
      {(unitId==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.order.options:
       WAVE3_UNITS['FW-U08'].cycleA.order.options).map(v=>
       <option key={v.id} value={v.id}>{v.text}</option>)}
     </select></label>
    <button type="button" className="secondary-button"
     onClick={()=>edit({...d,cycleAOrderReveal:true})}>Check role/intent</button>
    {d.cycleAOrderReveal&&<p role="status">Key: {unitId==='FW-U07'?
     WAVE3_UNITS['FW-U07'].cycleA.order.key:WAVE3_UNITS['FW-U08'].cycleA.order.key}.
     {(unitId==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.order.options:
      WAVE3_UNITS['FW-U08'].cycleA.order.options).find(x=>x.id===d.cycleAOrder)?.rationale}</p>}
   </div>}
   <h3>Your original explanation and repair (not auto-graded)</h3>
   {src.cycleA.ownFields.map(f=><OwnField key={f.key} id={unitId+'-a-'+f.key}
    label={f.label} value={d.cycleAOwn[f.key]??''}
    onChange={v=>commonEdit('cycleAOwn',f.key,v)}/>)}
  </div>
  </section>}

  {screen==='cycleB'&&<section aria-label={unitId+' original Cycle B'}>
   <WritingHeading number={1}>Practice B</WritingHeading>
   {unitId==='FW-U08'?<Strip strip={WAVE3_UNITS['FW-U08'].cycleB.taskStrip}/>:
    unitId==='FW-U09'?<Strip strip={WAVE3_UNITS['FW-U09'].cycleB.taskStrip}/>:null}
   <WritingTask>{src.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
   {ownSection('cycleB',src.cycleB.fields)}
   {unitId==='FW-U09'&&<p className="muted">
    Suggested 90–130 words are examples, NOT a pass/fail cutoff.
    {work.firstDraftV1?' The first saved Draft V1 is retained immutably at version '+
     work.firstDraftV1.version+'.':' The first complete saved Draft V1 will be retained for later editing practice.'}
   </p>}
  </div>
  </section>}

  {screen==='transfer'&&<section aria-label={unitId+' independent transfer'}>
   <WritingHeading number={1}>Independent transfer</WritingHeading><WritingTask>{src.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
   {ownSection('transfer',src.transfer.fields)}
  </div>
  </section>}
  {screen==='extra'&&<section aria-label={unitId+' supplementary questions'}>
   <WritingHeading number={1}>Knowledge Check</WritingHeading>
   <p>The fixed-choice keys are reviewed. Your original drafts are never scored by connector, phrase or length counts.</p>
   {src.extras.map(q=>objectiveItem(q,true))}
  </section>}
  {(screen==='cycleA'||screen==='cycleB'||screen==='transfer')&&<section className="fw-inline-ai" aria-label="AI Tutor Writing Review" key={unitId+'-'+screen}>
   <h2>AI Writing Tutor</h2><p>Get feedback on this writing, then improve your answer here.</p>
   <WritingSelfCheck key={screen} unit={Number(unitId.slice(-2))}/>
   <WritingReviewAction signature={signature} eligible={!!eligible} busy={busy||pending}  onSave={()=>save()} onAsk={()=>void ask()}/>
   {reviewStatus&&<p className="notice" role="status">{reviewStatus}</p>}
   {review&&<article className="wcv2-card" aria-live="polite">
    <h3>Provisional AI Tutor feedback · {review.model}</h3>
    <TeachingBlocks text={review.data.summary}/>
    {review.data.strengths.length>0&&<><strong>Specific strengths</strong>
     <ul>{review.data.strengths.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {review.data.improvements.length>0&&<><strong>Improvements to consider</strong>
     <ul>{review.data.improvements.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {review.data.quotes.length>0&&<><strong>Verbatim learner excerpts</strong>
     <ul>{review.data.quotes.map((x,i)=><li key={i}><q>{x}</q></li>)}</ul></>}
    <strong>Questions for your own revision</strong>
    <ul>{review.data.questions.map((x,i)=><li key={i}>{x}</li>)}</ul>
    <p><strong>Next action:</strong> {review.data.nextAction}</p>
    <p className="muted">No numeric score, CEFR placement or full ghostwritten replacement.</p>
   </article>}
  </section>}
  <div className="learning-choices fw-actions">
   <WritingNext step={screen} onStep={go} onFinish={()=>void save(true)}/>
   <button className="primary-button" type="button" disabled={busy}
    onClick={()=>void save()}>{busy?'Saving…':'Save work'}</button>
   
   <button className="secondary-button" type="button" onClick={onExit}>Back to Foundation Writing</button>
  </div>
  {saveStatus&&<p className="notice" role="status">{saveStatus}</p>}
  {showVi&&<p className="vi-help">Em có thể học và lưu bài mà không cần AI. AI chỉ nhận xét khi em yêu cầu sau khi lưu thành công.</p>}
 </section>;
}
