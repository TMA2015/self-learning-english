'use client';
import {useEffect,useRef,useState} from 'react';
import {WritingGoal,WritingReasons,WritingHeading,WritingMeta,WritingTask,WritingModel,WritingSteps,WritingNext,WritingText,WritingSelfCheck,WritingReviewAction} from './foundation-writing-ui';
import {EnglishLessonTutor} from './english-lesson-tutor';
import {TeachingBlocks} from './teaching-blocks';
import {browserTutorService} from '../infrastructure/browser/firebase-ai-browser';
import {REVIEWED_FOUNDATION_UNITS,blankIdea,blankChain,bankReady,eligibleNextArtifact,
 exactSavedNext,nextProgress,supplementalResult,exactSignature,
 type NextUnitId,type NextUnitWork,type NextDraft,type NextArtifact,
 type U02Draft,type U03Draft,type IdeaBank,type IdeaStatus,type Chain} from '../domain/foundation-writing-u02-u03';

type Step='learn'|'cycleA'|'cycleB'|'transfer'|'extra';
type Review={summary:string;strengths:string[];improvements:string[];quotes:string[];
 questions:string[];nextAction:string;scores:null;level:null};
const unavailable='AI review is currently unavailable. Your draft is saved locally; you can continue editing or finish the lesson.';

function OriginalField({name,label,value,help,onChange,rows=3}:{
 name:string;label:string;value:string;help?:string;rows?:number;onChange:(v:string)=>void;
}){
 return <label className="field" htmlFor={name}><strong>{label}</strong>{help&&<span>{help}</span>}
  <WritingText id={name} name={name} rows={rows} maxLength={1500} value={value}
   onChange={e=>onChange(e.target.value)} placeholder="Your own words, not the example answer..."/>
 </label>;
}
function BankEditor({unitId,bank,label,change}:{
 unitId:NextUnitId;bank:IdeaBank;label:string;change:(next:IdeaBank)=>void;
}){
 const options=['Fits','Needs clarification','Off-task'] as const;
 const selected=bank.chosenIndex;
 const editIdea=(index:number,field:'text'|'fit'|'fitReason',value:string)=>{
  const ideas=bank.ideas.map((v,i)=>i===index?{...v,[field]:value}:v);
  change({...bank,ideas});
 };
 return <div aria-label={label}>
  <h3>{label} · original idea bank</h3>
  <p>Start with three DIFFERENT possible activities. For each, choose a fit label and explain it briefly in your own words. All may fit; Off-task and optional rejection are not required.</p>
  {bank.ideas.map((idea,i)=><div className="wcv2-card" key={i}>
   <OriginalField name={unitId+'-'+label+'-idea-'+i} label={'Candidate '+(i+1)}
    value={idea.text} rows={2} help="Short note, not a whole paragraph"
    onChange={v=>editIdea(i,'text',v)}/>
   <label className="field" htmlFor={unitId+'-'+label+'-fit-'+i}>Your initial fit judgment
    <select id={unitId+'-'+label+'-fit-'+i} value={idea.fit}
     onChange={e=>editIdea(i,'fit',e.target.value as IdeaStatus)}>
     <option value="">Choose if useful</option>{options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
   </label>
   <OriginalField name={unitId+'-'+label+'-why-'+i}
    label="Your reason for this classification"
    help="Explain the activity's audience or resource fit in your own words; no automatic quality score."
    rows={2} value={idea.fitReason??''}
    onChange={v=>editIdea(i,'fitReason',v)}/>
  </div>)}
  <button type="button" className="secondary-button" disabled={bank.ideas.length>=8}
   onClick={()=>change({...bank,ideas:[...bank.ideas,blankIdea()]})}>Add candidate</button>
  {bank.ideas.length>3&&<button type="button" className="secondary-button"
   onClick={()=>{const ideas=bank.ideas.slice(0,-1);
    change({...bank,ideas,chosenIndex:Number(bank.chosenIndex)>=ideas.length?'':bank.chosenIndex})}}>
   Remove last candidate</button>}
  <label className="field" htmlFor={unitId+'-'+label+'-chosen'}><strong>One idea to develop</strong>
   <select id={unitId+'-'+label+'-chosen'} value={selected}
    onChange={e=>change({...bank,chosenIndex:e.target.value})}>
    <option value="">Choose a candidate</option>
    {bank.ideas.map((idea,i)=><option key={i} value={String(i)} disabled={!idea.text.trim()}>
     Candidate {i+1}{idea.text.trim()?': '+idea.text.trim().slice(0,58):' (enter a note first)'}
    </option>)}
   </select>
  </label>
  <OriginalField name={unitId+'-'+label+'-rationale'} label="Why this idea fits the task"
   help="Explain the real reader, setting or resource constraint in your own words."
   value={bank.rationale} onChange={v=>change({...bank,rationale:v})}/>
  <OriginalField name={unitId+'-'+label+'-setaside'} label="Optional set aside / trade-off"
   help="This can be EMPTY even when every idea is valid."
   value={bank.setAside} onChange={v=>change({...bank,setAside:v})}/>
  <OriginalField name={unitId+'-'+label+'-concrete'} label="Optional repair of a vague idea"
   help="Make one vague idea more specific; this is original writing, not automatically graded."
   value={bank.concrete} onChange={v=>change({...bank,concrete:v})}/>
  <p role="status" className="muted">
   {bankReady(bank)?'Your bank has three distinct notes, a selected idea and a reason. Save a version to record it.':
    'To complete this practice process, enter three distinct notes, select an existing one and add your reason. No semantic score is assigned.'}
  </p>
 </div>;
}
function ChainEditor({id,chain,edit}:{
 id:string;chain:Chain;edit:(field:keyof Chain,value:string)=>void;
}){
 return <div className="wcv2-card">
  <h3>{id}</h3>
  {(['claim','reason','detail'] as const).map(field=><OriginalField key={field}
   name={id+'-'+field} label={field==='claim'?'Claim — what I propose':
    field==='reason'?'Reason — why it may help':'Detail — how/when/for whom it may help'}
   rows={2} value={chain[field]} onChange={value=>edit(field,value)}/>)}
 </div>;
}
function U02Pane({step,d,edit,demoCount,setDemoCount}:{
 step:Step;d:U02Draft;edit:(v:U02Draft)=>void;demoCount:number;setDemoCount:(n:number)=>void;
}){
 const source=REVIEWED_FOUNDATION_UNITS['FW-U02'];
 if(step==='learn')return <section aria-label="U02 teacher explanations">
  <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1 · Generate, then judge</h3><p>{source.teaching.microLesson1}</p>
  <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{source.teaching.demo.prompt}</WritingModel>
  <button className="secondary-button" type="button"
   disabled={demoCount>=source.teaching.demo.steps.length}
   onClick={()=>setDemoCount(Math.min(demoCount+1,source.teaching.demo.steps.length))}>
   {demoCount?'Reveal next thinking step':'Reveal first thinking step'}
  </button>
  {demoCount>0&&<ol className="fw-demo-steps">{source.teaching.demo.steps.slice(0,demoCount).map((v,i)=>
   <li key={i}><strong>{v.label}:</strong> {v.text}</li>)}</ol>}
  <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2 · Choose with a real reason</h3>
  <p>{source.teaching.microLesson2}</p>
  <p className="notice"><strong>A tempting mistake:</strong> {source.teaching.commonMistake}</p>
  <details><summary>Optional A1 support</summary><p>{source.teaching.a1}</p></details>
  <details><summary>Optional B1 challenge</summary><p>{source.teaching.b1}</p></details>
  <EnglishLessonTutor lesson="Foundation Writing · FW-U02 Idea Generation and Selection"
   focus="Explain generate-first-filter-second, audience/resource fit, possible repair and why no idea must be rejected. Use a fresh unrelated example. Do not reveal practice fixture answer keys."/>
 </section>;
 if(step==='cycleA')return <section aria-label="U02 Practice A cards">
  <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{source.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
  <p>{source.cycleA.instructions}</p>
  {source.cycleA.cards.map(card=><div className="field fw-classify-row" key={card.id}>
   <label htmlFor={'u02-card-'+card.id}><strong>{card.id} · {card.text}</strong></label>
   <select id={'u02-card-'+card.id} value={d.cycleASorts[card.id]??''}
    onChange={e=>edit({...d,cycleASorts:{...d.cycleASorts,[card.id]:e.target.value},revealCycleA:false})}>
    <option value="">Choose the most direct role</option>
    {source.cycleA.buckets.map(b=><option key={b} value={b}>{b}</option>)}
   </select>
   {d.revealCycleA&&<p role="status" className="muted">
    {d.cycleASorts[card.id]===card.key?'Direct label correct. ':'Review the primary label. '}
    {card.rationale} (Key: {card.key})
   </p>}
  </div>)}
  <button className="secondary-button" type="button" onClick={()=>edit({...d,revealCycleA:true})}>
   Check all six cards and see explanations</button>
  <label className="field" htmlFor="u02-repair-card"><strong>Card to repair (A2 or A6)</strong>
   <select id="u02-repair-card" value={d.repairCard}
    onChange={e=>edit({...d,repairCard:e.target.value})}>
    <option value="">Choose one</option><option value="A2">A2</option><option value="A6">A6</option>
   </select></label>
  <OriginalField name="u02-repair" label="Your original improvement" help={source.cycleA.repairPrompt+' '+source.cycleA.cards.filter(c=>c.id===d.repairCard).map(c=>c.id+': '+c.text).join(' ')}
   value={d.repair} onChange={v=>edit({...d,repair:v})}/>
  <OriginalField name="u02-explanation" label="Your original classification explanation"
   help={source.cycleA.justificationPrompt} value={d.explanation}
   onChange={v=>edit({...d,explanation:v})}/>
  <p className="muted">Only fixed card selections are checked automatically; your new idea and explanation are not semantically scored.</p>
 </div>
  </section>;
 if(step==='cycleB')return <section aria-label="U02 Practice B idea bank">
  <WritingHeading number={1}>Practice B</WritingHeading><WritingTask>{source.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
  <p>{source.cycleB.instruction}</p>
  <BankEditor unitId="FW-U02" bank={d.cycleBBank} label="practice-b"
   change={bank=>edit({...d,cycleBBank:bank})}/>
 </div>
  </section>;
 if(step==='transfer')return <section aria-label="U02 independent transfer">
  <WritingHeading number={1}>Independent transfer</WritingHeading>
  <WritingTask>{source.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card"><p>{source.transfer.instruction}</p>
  <BankEditor unitId="FW-U02" bank={d.transferBank} label="transfer"
   change={bank=>edit({...d,transferBank:bank})}/>
 </div>
  </section>;
 return null;
}
function U03Pane({step,d,edit,demoCount,setDemoCount}:{
 step:Step;d:U03Draft;edit:(v:U03Draft)=>void;demoCount:number;setDemoCount:(n:number)=>void;
}){
 const source=REVIEWED_FOUNDATION_UNITS['FW-U03'];
 const chain=(field:'chainA'|'chainB'|'transferA'|'transferB',part:keyof Chain,value:string)=>
  edit({...d,[field]:{...d[field],[part]:value}});
 if(step==='learn')return <section aria-label="U03 three micro-lessons">
  <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1 · What counts as a real reason?</h3>
  <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{source.teaching.demo.prompt}</WritingModel>
  <button type="button" className="secondary-button" disabled={demoCount>=source.teaching.demo.steps.length}
   onClick={()=>setDemoCount(Math.min(demoCount+1,source.teaching.demo.steps.length))}>
   {demoCount?'Reveal next thinking step':'Reveal first thinking step'}</button>
  {demoCount>0&&<ol className="fw-demo-steps">{source.teaching.demo.steps.slice(0,demoCount).map((v,i)=>
   <li key={i}><strong>{v.label}:</strong> {v.text}</li>)}</ol>}
  <p><strong>Think for yourself:</strong> {source.teaching.miniCheck}</p>
  <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2 · Connect a reason to a real detail</h3>
  <p>{source.teaching.microLesson2.teacher}</p>
  <div className="wcv2-card"><p><strong>Claim:</strong> {source.teaching.microLesson2.claim}</p>
   <p><strong>Reason:</strong> {source.teaching.microLesson2.reason}</p>
   <p><strong>Detail:</strong> {source.teaching.microLesson2.detail}</p>
   <p>{source.teaching.microLesson2.why}</p>
   <p className="muted">Weak detail: {source.teaching.microLesson2.weakDetail}</p>
  </div>
  <p><strong>Think:</strong> {source.teaching.microLesson2.thinkPrompt}</p>
  <h2>Micro-lesson 3 · Two different chains</h2><p>{source.teaching.microLesson3}</p>
  <details><summary>Optional A1 bridge</summary><p>{source.teaching.a1}</p></details>
  <details><summary>Optional B1 challenge</summary><p>{source.teaching.b1}</p></details>
  <p className="muted">{source.teaching.noUnsupportedFacts}</p>
  <EnglishLessonTutor lesson="Foundation Writing · FW-U03 Claim Reason Detail"
   focus="Explain the difference among claim, actual benefit/reason and concrete supporting detail with an unrelated example. Explain circular reasoning. Never reveal current practice card keys or ghostwrite learner chains."/>
 </section>;
 if(step==='cycleA')return <section aria-label="U03 Practice A reasoning cards">
  <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{source.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
  <div className="wcv2-card" aria-label="Task strip">
   <strong>Topic:</strong> {source.cycleA.promptStrip.topic}
   <p><strong>Task:</strong> {source.cycleA.promptStrip.task}</p>
   <p><strong>Must Include:</strong> {source.cycleA.promptStrip.mustInclude}</p>
   <p><strong>Boundary:</strong> {source.cycleA.promptStrip.boundary}</p>
  </div><p>{source.cycleA.instruction}</p>
  {source.cycleA.cards.map(card=><div className="field fw-classify-row" key={card.id}>
   <label htmlFor={'u03-card-'+card.id}><strong>{card.id} · {card.text}</strong></label>
   <select id={'u03-card-'+card.id} value={d.cycleARoles[card.id]??''}
    onChange={e=>edit({...d,cycleARoles:{...d.cycleARoles,[card.id]:e.target.value},revealCycleA:false})}>
    <option value="">Choose the role / diagnosis</option>
    {source.cycleA.roles.map(x=><option key={x} value={x}>{x}</option>)}
   </select>
   {d.revealCycleA&&<p className="muted" role="status">
    {d.cycleARoles[card.id]===card.key?'Correct direct role. ':'Review this choice. '}
    {card.rationale} (Key: {card.key})
   </p>}
  </div>)}
  <button type="button" className="secondary-button" onClick={()=>edit({...d,revealCycleA:true})}>
   Check card roles and all explanations</button>
  <label htmlFor="u03-repair-card" className="field"><strong>Choose one weak card to repair</strong>
   <select id="u03-repair-card" value={d.repairCard} onChange={e=>edit({...d,repairCard:e.target.value})}>
    <option value="">Select X1 or X3</option><option value="X1">X1</option><option value="X3">X3</option>
   </select></label>
  <OriginalField name="u03-repair-a" label="Your original reason or detail" help={source.cycleA.repairPrompt}
   value={d.repairA} onChange={v=>edit({...d,repairA:v})}/>
  <p className="muted">{source.cycleA.caveat}</p>
 </div>
  </section>;
 if(step==='cycleB')return <section aria-label="U03 two original chains">
  <WritingHeading number={1}>Practice B</WritingHeading><WritingTask>{source.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card">
  <p>{source.cycleB.diagnoseInstruction}</p>
  {source.cycleB.weak.map(weak=><div className="field fw-classify-row" key={weak.id}>
   <label htmlFor={weak.id}><strong>{weak.id} · {weak.text}</strong></label>
   <select id={weak.id} value={d.cycleBDiagnoses[weak.id]??''}
    onChange={e=>edit({...d,cycleBDiagnoses:{...d.cycleBDiagnoses,[weak.id]:e.target.value},revealCycleB:false})}>
    <option value="">Diagnose this weakness</option>
    {source.cycleB.diagnosticRoles.map(o=><option key={o} value={o}>{o}</option>)}
   </select>
   {d.revealCycleB&&<p className="muted" role="status">
    {d.cycleBDiagnoses[weak.id]===weak.key?'Correct diagnosis. ':'Review the diagnosis. '}
    {weak.rationale}. {weak.repairInstruction} (Key: {weak.key})
   </p>}
  </div>)}
  <button className="secondary-button" type="button"
   onClick={()=>edit({...d,revealCycleB:true})}>Check three diagnoses and read explanations</button>
  <label htmlFor="u03-weak-choice" className="field"><strong>Which weak submission will you repair?</strong>
   <select id="u03-weak-choice" value={d.weakChoice}
    onChange={e=>edit({...d,weakChoice:e.target.value})}>
    <option value="">Choose one</option>
    {source.cycleB.weak.map(weak=><option key={weak.id} value={weak.id}>{weak.id}</option>)}
   </select></label>
  <OriginalField name="u03-weak-repair" label="Your own repair"
   help={source.cycleB.weakRepairPrompt} value={d.weakRepair}
   onChange={v=>edit({...d,weakRepair:v})}/>
  <p>{source.cycleB.chainInstruction}</p>
  <ChainEditor id="chainA" chain={d.chainA} edit={(field,v)=>chain('chainA',field,v)}/>
  <ChainEditor id="chainB" chain={d.chainB} edit={(field,v)=>chain('chainB',field,v)}/>
  <p><strong>Reader check:</strong> {source.cycleB.readerCheck} This is not an automatic quality verdict.</p>
 </div>
  </section>;
 if(step==='transfer')return <section aria-label="U03 independent transfer chains">
  <WritingHeading number={1}>Independent transfer</WritingHeading>
  <WritingTask>{source.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
   <div className="fw-practice-card"><p>{source.transfer.instruction}</p>
  <ChainEditor id="transferA" chain={d.transferA} edit={(field,v)=>chain('transferA',field,v)}/>
  <ChainEditor id="transferB" chain={d.transferB} edit={(field,v)=>chain('transferB',field,v)}/>
 </div>
  </section>;
 return null;
}
export function FoundationWritingNextUnit({unitId,work,onEdit,onSave,onExit,showVi=false}:{
 unitId:NextUnitId;work:NextUnitWork;onEdit:(v:NextDraft)=>void;onSave:()=>Promise<boolean>;
 onExit:()=>void;showVi?:boolean;
}){
 const source=REVIEWED_FOUNDATION_UNITS[unitId];
 const [step,setStep]=useState<Step>('learn'),[demoCount,setDemoCount]=useState(0);
 const [busy,setBusy]=useState(false),[saveMessage,setSaveMessage]=useState('');
 const [target,setTarget]=useState<NextArtifact>('cycleB'),[pending,setPending]=useState(false);
 const [review,setReview]=useState<{model:string;data:Review}|null>(null),[reviewStatus,setReviewStatus]=useState('');
 const ticket=useRef(0),mounted=useRef(true),latestSignature=useRef(''),latestTarget=useRef(target);
 const signature=exactSignature(work.draft);
 latestSignature.current=signature;latestTarget.current=target;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;ticket.current++}},[]);
 useEffect(()=>{ticket.current++;setPending(false);setReview(null);setReviewStatus('');
  setStep('learn');setTarget('cycleB');setDemoCount(0);},[unitId]);
 const saved=exactSavedNext(work),reviewable=eligibleNextArtifact(unitId,work,target);
 const progress=nextProgress(unitId,work);
 function clearReview(){ticket.current++;setPending(false);setReview(null);setReviewStatus('')}
 function edit(d:NextDraft){clearReview();setSaveMessage('');onEdit(d)}
 function navigate(to:Step){clearReview();if(to==='cycleA'||to==='cycleB'||to==='transfer')setTarget(to);setStep(to)}
 async function save(exit=false){
  if(busy)return false;
  setBusy(true);setSaveMessage('');
  try{const ok=await onSave();if(!mounted.current)return false;
   if(!ok){setSaveMessage('Save failed. Your text remains on this page; retry before leaving.');return false;}
   setSaveMessage('Saved a version of '+unitId+'. This records practice, not a language grade.');
   if(exit)onExit();return true;
  }catch{if(mounted.current)setSaveMessage('Save failed. Your text remains on this page; retry before leaving.');return false}
  finally{if(mounted.current)setBusy(false)}
 }
 async function ask(){
  const original=eligibleNextArtifact(unitId,work,target);
  if(!original||!saved||pending||busy)return;
  const currentTicket=++ticket.current,expected=signature,expectedTarget=target;
  setPending(true);setReviewStatus('');setReview(null);
  try{
   const tutor=browserTutorService();
   const result=tutor.available?await tutor.coach('foundation-writing',original.task,{
    unitId,fixtureId:original.fixtureId,text:original.text,
   },{responseLanguage:showVi?'vi':'en'}):null;
   if(!mounted.current||currentTicket!==ticket.current||expected!==latestSignature.current||
      expectedTarget!==latestTarget.current)return;
   const feedback=result?.structuredResult as Review|undefined;
   if(result?.provider==='firebase-ai-logic'&&feedback&&feedback.scores===null&&feedback.level===null&&
      Array.isArray(feedback.quotes)&&feedback.quotes.every(q=>original.text.includes(q))&&
      Array.isArray(feedback.strengths)&&feedback.strengths.length<=2&&
      Array.isArray(feedback.improvements)&&feedback.improvements.length<=2&&
      Array.isArray(feedback.questions)&&feedback.questions.length>=1&&feedback.questions.length<=2){
    setReview({model:result.model,data:feedback});
   }else setReviewStatus(unavailable);
  }catch{if(mounted.current&&currentTicket===ticket.current)setReviewStatus(unavailable)}
  finally{if(mounted.current&&currentTicket===ticket.current)setPending(false)}
 }
 return <section className="panel wcv2 fw-unit" aria-label={'Foundation Writing '+unitId}>
  <div className="foundation-unit-top-nav"><button type="button" className="secondary-button" onClick={onExit}>← Back to Foundation Writing</button><div className="fw-top-actions"><span className="muted">{saved?'Saved work available':'Editable draft'}</span><button type="button" className="secondary-button" disabled={busy} onClick={()=>void save(true)}>Save &amp; Exit</button></div></div>
  <div className="page-heading"><div><span className="eyebrow">Foundation Writing · Unit {String(Number(unitId.slice(-2))).padStart(2,'0')}</span>
   <h1>{source.title}</h1><WritingMeta unit={Number(unitId.slice(-2))}/>
   <p className="muted">{source.estimatedMinutes} · Learn at your own pace. Save your writing before requesting optional AI feedback.</p>
  </div></div>
  <WritingSteps step={step} onStep={navigate} checked={progress.extras} saved={!!saved}/>
  {step==='learn'&&<WritingGoal unit={Number(unitId.slice(-2))} showVi={showVi}/>}
  <p role="status" className="muted">{saved?'Version '+saved.version+' saved. Edits require a fresh save before AI review.':
   'Editing an unsaved draft. Save a version for optional personal AI Tutor review.'}
  </p>
  {unitId==='FW-U02'&&<U02Pane step={step} d={work.draft as U02Draft} edit={edit}
   demoCount={demoCount} setDemoCount={setDemoCount}/>}
  {unitId==='FW-U03'&&<U03Pane step={step} d={work.draft as U03Draft} edit={edit}
   demoCount={demoCount} setDemoCount={setDemoCount}/>}
  {step==='extra'&&<section aria-label={unitId+' supplemental objective items'}>
   <WritingHeading number={1}>Knowledge Check</WritingHeading>
   <p>Fixed answers can be checked; your original ideas and reasons are not given an invented score.</p>
   {source.supplemental.map(item=>{
    const picked=work.draft.supplementalAnswers[item.id]??'';
    const checked=!!work.draft.revealSupplemental[item.id];
    const result=checked?supplementalResult(unitId,item.id,picked):null;
    return <article className="wcv2-card" key={item.id}>
     <h3>{item.title}</h3><blockquote>{item.prompt}</blockquote>
     <fieldset><legend>{item.question}</legend>
      {item.options.map(o=><label className="field wcv2-radio-option" key={o.id}>
       <input type="radio" name={item.id} value={o.id} checked={picked===o.id}
        onChange={()=>edit({...work.draft,supplementalAnswers:{...work.draft.supplementalAnswers,[item.id]:o.id},
         revealSupplemental:{...work.draft.revealSupplemental,[item.id]:false}})}/>
       <strong>{o.id}.</strong> {o.text}

      </label>)}
     </fieldset>
     <button type="button" className="secondary-button" disabled={!picked}
      onClick={()=>edit({...work.draft,revealSupplemental:{...work.draft.revealSupplemental,[item.id]:true}})}>
      Check selection and all explanations</button>
     {result&&<div role="status" className={result.correct?'fw-answer fw-correct':'fw-answer fw-retry'}>{result.correct?'Correct choice.':'Consider the reasons and try again.'} Key: {result.key}.<p>{item.options.find(o=>o.id===picked)?.rationale}</p><WritingReasons options={item.options}/></div>}
    </article>;
   })}
   
  </section>}
  {(step==='cycleA'||step==='cycleB'||step==='transfer')&&<section className="fw-inline-ai" aria-label="AI Tutor Writing Review" key={unitId+'-'+step}>
   <h2>AI Writing Tutor</h2><p>Get feedback on this writing, then improve your answer here.</p>
   <WritingSelfCheck key={step} unit={Number(unitId.slice(-2))}/>
   <WritingReviewAction signature={signature} eligible={!!reviewable} busy={busy||pending}  onSave={()=>save()} onAsk={()=>void ask()}/>
   {reviewStatus&&<p className="notice" role="status">{reviewStatus}</p>}
   {review&&<article className="wcv2-card" aria-live="polite">
    <h3>AI Tutor feedback · provisional · {review.model}</h3>
    <TeachingBlocks text={review.data.summary}/>
    {review.data.strengths.length>0&&<><strong>Specific strengths</strong>
     <ul>{review.data.strengths.map((v,i)=><li key={i}>{v}</li>)}</ul></>}
    {review.data.improvements.length>0&&<><strong>Improvements to consider</strong>
     <ul>{review.data.improvements.map((v,i)=><li key={i}>{v}</li>)}</ul></>}
    {review.data.quotes.length>0&&<><strong>Exact phrases from your own writing</strong>
     <ul>{review.data.quotes.map((v,i)=><li key={i}><q>{v}</q></li>)}</ul></>}
    <strong>Questions for independent revision</strong>
    <ul>{review.data.questions.map((v,i)=><li key={i}>{v}</li>)}</ul>
    <p><strong>Next action:</strong> {review.data.nextAction}</p>
    <p className="muted">No score, CEFR level or mastery assessment was saved.</p>
   </article>}
  </section>}
  <div className="learning-choices fw-actions">
   <WritingNext step={step} onStep={navigate} onFinish={()=>void save(true)}/>
   <button type="button" className="secondary-button" disabled={busy}
    onClick={()=>void save()}>{busy?'Saving…':'Save work'}</button>
   
   <button type="button" className="secondary-button" onClick={onExit}>Back to Foundation Writing</button>
  </div>
  {saveMessage&&<p role="status" className="notice">{saveMessage}</p>}
  {showVi&&<p className="vi-help">Em có thể tự học và lưu tiến độ mà không dùng AI. AI Tutor chỉ nhận xét bài em chủ động yêu cầu sau khi đã lưu.</p>}
 </section>;
}
