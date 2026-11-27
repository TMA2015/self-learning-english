'use client';
import {useEffect,useRef,useState} from 'react';
import {WritingGoal,WritingSteps,WritingNext,WritingText,WritingSelfCheck,WritingReviewAction} from './foundation-writing-ui';
import {EnglishLessonTutor} from './english-lesson-tutor';
import {TeachingBlocks} from './teaching-blocks';
import {browserTutorService} from '../infrastructure/browser/firebase-ai-browser';
import {FOUNDATION_U01_SOURCE as unit,emptyU01Work,exactSavedU01,
 eligibleU01Artifact,objectiveResult,u01Progress,u01Signature,type TaskMap,
 type U01Draft,type U01Work,type U01Artifact} from '../domain/foundation-writing-u01';

type Step='learn'|'cycleA'|'cycleB'|'transfer'|'extra';
type Review={summary:string;strengths:string[];improvements:string[];
 quotes:string[];questions:string[];nextAction:string;scores:null;level:null};
const roles=['Topic','Task','Must Include','Boundary'];
const fallback='AI review is currently unavailable. Your draft is saved locally; you can continue editing or finish the lesson.';

function MapEditor({scope,fields,value,edit}:{
 scope:string;fields:ReadonlyArray<{key:string;label:string;help:string}>;
 value:TaskMap;edit:(key:keyof TaskMap,text:string)=>void;
}){
 return <div className="fields">{fields.map(field=><label className="field" key={field.key}
  htmlFor={scope+'-'+field.key}>
  <strong>{field.label}</strong><span>{field.help}</span>
  <WritingText id={scope+'-'+field.key} name={scope+'-'+field.key}
   rows={2} maxLength={1400} value={value[field.key as keyof TaskMap]}
   onChange={e=>edit(field.key as keyof TaskMap,e.target.value)}
   placeholder="Your own words, not the demonstration answer..."/>
 </label>)}</div>;
}

export function FoundationWritingU01({work=emptyU01Work(),onEdit,onSave,onExit,showVi=false}:{
 work?:U01Work;onEdit:(draft:U01Draft)=>void;onSave:()=>Promise<boolean>;
 onExit:()=>void;showVi?:boolean;
}){
 const [step,setStep]=useState<Step>('learn'),[demoCount,setDemoCount]=useState(0);
 const [saving,setSaving]=useState(false),[saveMessage,setSaveMessage]=useState('');
 const [target,setTarget]=useState<U01Artifact>('cycleA');
 const [pending,setPending]=useState(false),[answer,setAnswer]=useState<{model:string;data:Review}|null>(null);
 const [reviewMessage,setReviewMessage]=useState('');
 const generation=useRef(0),mounted=useRef(true),latestSignature=useRef(''),latestTarget=useRef(target);
 const draft=work.draft,signature=u01Signature(draft);
 latestSignature.current=signature;latestTarget.current=target;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++}},[]);
 const saved=exactSavedU01(work);
 const reviewable=eligibleU01Artifact(work,target);
 const progress=u01Progress(work);
 function clearReview(){generation.current++;setPending(false);setAnswer(null);setReviewMessage('')}
 function edit(next:U01Draft){clearReview();setSaveMessage('');onEdit(next)}
 function editMap(which:'cycleAMap'|'transferMap',key:keyof TaskMap,text:string){
  edit({...draft,[which]:{...draft[which],[key]:text}});
 }
 function go(next:Step){clearReview();if(next==='cycleA'||next==='cycleB'||next==='transfer')setTarget(next);setStep(next)}
 async function save(exit=false){
  if(saving)return;
  setSaving(true);setSaveMessage('');
  try{
   const ok=await onSave();
   if(!mounted.current)return;
   if(!ok){setSaveMessage('Save failed. Your text remains on this page; retry before leaving.');return}
   setSaveMessage('Saved a version of Unit 01. Completion is practice evidence, not a language score.');
   if(exit)onExit();
  }catch{if(mounted.current)setSaveMessage('Save failed. Retry before leaving.')}
  finally{if(mounted.current)setSaving(false)}
 }
 async function ask(){
  const selected=eligibleU01Artifact(work,target);
  if(pending||!selected||!saved)return;
  const ticket=++generation.current,signatureAtRequest=signature,targetAtRequest=target;
  setPending(true);setAnswer(null);setReviewMessage('');
  try{
   const tutor=browserTutorService();
   const response=tutor.available?await tutor.coach('foundation-writing',selected.task,{
    unitId:'FW-U01',fixtureId:selected.fixtureId,text:selected.text,
   },{responseLanguage:showVi?'vi':'en'}):null;
   if(!mounted.current||ticket!==generation.current||latestSignature.current!==signatureAtRequest||
      latestTarget.current!==targetAtRequest)return;
   const result=response?.structuredResult as Review|undefined;
   if(response?.provider==='firebase-ai-logic'&&result&&result.scores===null&&result.level===null&&
      Array.isArray(result.quotes)&&result.quotes.every(q=>selected.text.includes(q))&&
      Array.isArray(result.strengths)&&result.strengths.length<=2&&
      Array.isArray(result.improvements)&&result.improvements.length<=2&&
      Array.isArray(result.questions)&&result.questions.length>=1&&result.questions.length<=2){
     setAnswer({model:response.model,data:result});
   }else setReviewMessage(fallback);
  }catch{if(ticket===generation.current&&mounted.current)setReviewMessage(fallback)}
  finally{if(ticket===generation.current&&mounted.current)setPending(false)}
 }
 return <section className="panel wcv2 fw-unit" aria-label="Foundation Writing Unit 01">
  <div className="foundation-unit-top-nav"><button type="button" className="secondary-button" onClick={onExit}>← Back to Foundation Writing</button></div>
  <div className="page-heading"><div><span className="eyebrow">Foundation Writing · Unit {String(1).padStart(2,'0')}</span>
   <h1>{unit.title}</h1><WritingGoal unit={1} showVi={showVi}/>
   <p className="muted">{unit.estimatedMinutes} · Learn and practice at your own pace. Your original writing can receive optional feedback after saving.</p>
  </div></div>
  <WritingSteps step={step} onStep={go} checked={progress.supplementalChecked} saved={!!saved}/>
  <p className="muted" role="status">{saved?'Saved version '+saved.version+'. Edit or change answers, then save again for AI Tutor.':
    'Your work is an editable draft. Save a version to enable optional AI Tutor review.'}
  </p>

  {step==='learn'&&<section aria-label="Read-only lessons">
   <h2>Micro-lesson 1 · The four jobs in a prompt</h2><p>{unit.demo.instruction}</p>
   <div className="wcv2-grid">{unit.concepts.map(c=><article className="wcv2-card" key={c.label}>
    <h3>{c.label}</h3><p>{c.explanation}</p><p className="muted">{c.caution}</p>
   </article>)}</div>
   <h2>Worked example</h2><blockquote>{unit.demo.prompt}</blockquote>
   <p><strong>Think first:</strong> {unit.demo.thinkQuestion}</p>
   <button type="button" className="secondary-button" disabled={demoCount===unit.demo.steps.length}
    onClick={()=>setDemoCount(i=>Math.min(i+1,unit.demo.steps.length))}>
    {demoCount?'Reveal the next thinking step':'Show the first thinking step'}
   </button>
   {demoCount>0&&<ol>{unit.demo.steps.slice(0,demoCount).map((v,i)=><li key={i}>
    <strong>{v.label}:</strong> {v.text}</li>)}</ol>}
   {demoCount===unit.demo.steps.length&&<div className="notice">
    <strong>What can go wrong?</strong> {unit.demo.expectedConcept}
    <p>{unit.demo.commonError}</p>
   </div>}
   <h2>Micro-lesson 2 · Apply the roles to a fresh prompt</h2>
   <p>In Practice A, sort exact phrases and explain the four roles in your OWN words. The example is never copied into your answer fields.</p>
   <details><summary>Optional A1 language help</summary><p>{unit.demo.a1}</p></details>
   <details><summary>Optional B1 stretch</summary><p>{unit.demo.b1}</p></details>
   <EnglishLessonTutor lesson="Foundation Writing · FW-U01 Understand the Writing Task"
    focus="Topic is the subject. Task is the communicative action. Must Include are explicit required details. Boundary is reader, time or context. Explain with an unrelated NEW example only. Do not reveal current practice keys."/>
   
  </section>}

  {step==='cycleA'&&<section aria-label="Practice A">
   <h2>Practice A</h2><blockquote>{unit.cycleA.prompt}</blockquote>
   <p>{unit.cycleA.instructions}</p>
   {unit.cycleA.chunks.map(chunk=><div className="field" key={chunk.id}>
    <label htmlFor={'u01-'+chunk.id}><strong>{chunk.id} · {chunk.text}</strong></label>
    <select id={'u01-'+chunk.id} name={chunk.id} value={draft.cycleALabels[chunk.id]??''}
     onChange={e=>edit({...draft,cycleALabels:{...draft.cycleALabels,[chunk.id]:e.target.value},revealCycleA:false})}>
     <option value="">Choose a direct role</option>{roles.map(role=><option key={role} value={role}>{role}</option>)}
    </select>
    {draft.revealCycleA&&<p className="muted" role="status">
     {draft.cycleALabels[chunk.id]===chunk.key?'Correct direct role. ':'Consider the role again. '}
     {chunk.rationale} Primary key: {chunk.key}.
    </p>}
   </div>)}
   <button type="button" className="secondary-button" onClick={()=>edit({...draft,revealCycleA:true})}>
    Check phrase labels and read explanations
   </button>
   <p className="muted">{unit.cycleA.clarification}</p>
   <h3>Your original Task Map</h3>
   <MapEditor scope="u01-a" fields={unit.cycleA.fields} value={draft.cycleAMap} edit={(k,v)=>editMap('cycleAMap',k,v)}/>
   <p>Writing meaning is not graded by exact keywords. Use your own language.</p>
   
  </section>}

  {step==='cycleB'&&<section aria-label="Practice B">
   <h2>Practice B</h2><blockquote>{unit.cycleB.prompt}</blockquote>
   <fieldset><legend>{unit.cycleB.question}</legend>
    {unit.cycleB.options.map(o=><label className="field wcv2-radio-option" key={o.id}>
     <input type="radio" name="u01-best-opening" value={o.id} checked={draft.cycleBChoice===o.id}
      onChange={()=>edit({...draft,cycleBChoice:o.id,revealCycleB:false})}/>
     <strong>{o.id}.</strong> {o.text}
     {draft.revealCycleB&&<p className="muted">{o.id===unit.cycleB.key?'Best opening. ':''}{o.rationale}</p>}
    </label>)}
   </fieldset>
   <button type="button" className="secondary-button" disabled={!draft.cycleBChoice}
    onClick={()=>edit({...draft,revealCycleB:true})}>Check opening and see all rationales</button>
   {draft.revealCycleB&&<p className="notice">{unit.cycleB.instruction}</p>}
   <label className="field" htmlFor="u01-repair"><strong>Your own repair</strong><span>{unit.cycleB.repairPrompt}</span>
    <WritingText id="u01-repair" rows={4} maxLength={1800} value={draft.repair}
     onChange={e=>edit({...draft,repair:e.target.value})}/></label>
   <label className="field" htmlFor="u01-reflection"><strong>Why you made this repair</strong>
    <span>{unit.cycleB.reflectionPrompt}</span>
    <WritingText id="u01-reflection" rows={3} maxLength={1400} value={draft.reflection}
     onChange={e=>edit({...draft,reflection:e.target.value})}/></label>
   <p className="muted">Different sensible materials can be correct. You can request individualized feedback after a successful save.</p>
   
  </section>}

  {step==='transfer'&&<section aria-label="Transfer task">
   <h2>New prompt</h2><blockquote>{unit.transfer.prompt}</blockquote>
   <p>{unit.transfer.instruction}</p>
   <MapEditor scope="u01-t" fields={unit.transfer.fields} value={draft.transferMap}
    edit={(k,v)=>editMap('transferMap',k,v)}/>
   
  </section>}

  {step==='extra'&&<section aria-label="Supplemental MCQs">
   <h2>Knowledge Check</h2>
   <p>Each option comes with specific feedback after you check. These choices do not certify writing skill.</p>
   {unit.supplemental.map(item=>{
    const chosen=draft.supplementalAnswers[item.id]??'';
    const checked=!!draft.revealSupplemental[item.id];
    const result=checked?objectiveResult(item.id,chosen):null;
    return <article className="wcv2-card" key={item.id}><h3>{item.title}</h3>
     <blockquote>{item.prompt}</blockquote>
     <fieldset><legend>{item.question}</legend>
      {item.options.map(o=><label className="field wcv2-radio-option" key={o.id}>
       <input type="radio" name={item.id} value={o.id} checked={chosen===o.id}
        onChange={()=>edit({...draft,supplementalAnswers:{...draft.supplementalAnswers,[item.id]:o.id},
         revealSupplemental:{...draft.revealSupplemental,[item.id]:false}})}/>
       <strong>{o.id}.</strong> {o.text}
       {checked&&<p className="muted">{o.id===item.key?'Correct option. ':''}{o.rationale}</p>}
      </label>)}
     </fieldset>
     <button className="secondary-button" type="button" disabled={!chosen}
      onClick={()=>edit({...draft,revealSupplemental:{...draft.revealSupplemental,[item.id]:true}})}>
      Check this question</button>
     {result&&<p role="status">{result.correct?'Correct choice.':'Try again after reading the reasons.'} Key: {result.key}.</p>}
    </article>;
   })}
   
  </section>}

  {(step==='cycleA'||step==='cycleB'||step==='transfer')&&<section className="fw-inline-ai" aria-label="AI Tutor Writing Review" key={step}>
   <h2>AI Writing Tutor</h2><p>Get feedback on this writing, then improve your answer here.</p>
   <WritingSelfCheck key={step} unit={1}/>
   <WritingReviewAction signature={signature} eligible={!!reviewable} busy={saving||pending}  onSave={onSave} onAsk={()=>void ask()}/>
   {reviewMessage&&<p role="status" className="notice">{reviewMessage}</p>}
   {answer&&<article className="wcv2-card" aria-live="polite">
    <h3>AI Tutor feedback · provisional · {answer.model}</h3>
    <TeachingBlocks text={answer.data.summary}/>
    {answer.data.strengths.length>0&&<><strong>Specific strengths</strong>
     <ul>{answer.data.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
    {answer.data.improvements.length>0&&<><strong>What to improve</strong>
     <ul>{answer.data.improvements.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
    {answer.data.quotes.length>0&&<><strong>Exact words from your writing</strong>
     <ul>{answer.data.quotes.map((s,i)=><li key={i}><q>{s}</q></li>)}</ul></>}
    <strong>Questions to guide your repair</strong><ul>{answer.data.questions.map((s,i)=><li key={i}>{s}</li>)}</ul>
    <p><strong>Next action:</strong> {answer.data.nextAction}</p>
    <p className="muted">No numeric score or CEFR level was recorded.</p>
   </article>}
  </section>}

  <div className="learning-choices fw-actions">
   <WritingNext step={step} onStep={go} onFinish={()=>void save(true)}/>
   <button type="button" className="secondary-button" disabled={saving} onClick={()=>void save()}>
    {saving?'Saving…':'Save work'}</button>
   <button type="button" className="secondary-button" disabled={saving} onClick={()=>void save(true)}>Save &amp; Exit</button>
   <button type="button" className="secondary-button" onClick={onExit}>Back to Foundation Writing</button>
  </div>
  {saveMessage&&<p role="status" className="notice">{saveMessage}</p>}
  {showVi&&<p className="vi-help">Đây là bài tự luyện: bài viết mở chỉ được lưu, không tự động chấm trình độ hoặc điểm CEFR.</p>}
 </section>;
}
