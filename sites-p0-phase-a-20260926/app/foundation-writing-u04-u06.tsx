'use client';
import {useEffect,useRef,useState} from 'react';
import {WritingGoal,WritingHeading,WritingMeta,WritingTask,WritingModel,WritingSteps,WritingNext,WritingText,WritingSelfCheck,WritingReviewAction} from './foundation-writing-ui';
import {EnglishLessonTutor} from './english-lesson-tutor';
import {TeachingBlocks} from './teaching-blocks';
import {browserTutorService} from '../infrastructure/browser/firebase-ai-browser';
import {
 WAVE2_UNITS,blankRole,eligibleWave2Artifact,exactSavedWave2,fourFilled,quoteWithin,
 wave2ObjectiveResult,wave2Progress,wave2Signature,
 type U04Draft,type U05Draft,type U06Draft,type Wave2Draft,type Wave2Work,
 type Wave2Id,type Wave2Artifact,type Sentences,type Outline,type OutlineRole
} from '../domain/foundation-writing-u04-u06';

type Step='learn'|'cycleA'|'cycleB'|'transfer'|'extra';
type Review={summary:string;strengths:string[];improvements:string[];
 quotes:string[];questions:string[];nextAction:string;scores:null;level:null};
const unavailable='AI review is currently unavailable. Your draft is saved locally; you can continue editing or finish the lesson.';

function OriginalField({name,label,value,help,onChange,rows=3}:{
 name:string;label:string;value:string;help?:string;rows?:number;onChange:(v:string)=>void;
}){
 return <label className="field" htmlFor={name}><strong>{label}</strong>
  {help&&<span>{help}</span>}
  <WritingText id={name} name={name} rows={rows} maxLength={1800} value={value}
   onChange={e=>onChange(e.target.value)} placeholder="Write in your own words..."/>
 </label>;
}
function PromptStrip({strip}:{strip:{topic:string;task:string;mustInclude:string;boundary:string}}){
 return <details className="wcv2-card" open>
  <summary><strong>Task Map — Topic / Task / Must Include / Boundary</strong></summary>
  <dl><dt><strong>Topic</strong></dt><dd>{strip.topic}</dd>
   <dt><strong>Task</strong></dt><dd>{strip.task}</dd>
   <dt><strong>Must Include</strong></dt><dd>{strip.mustInclude}</dd>
   <dt><strong>Boundary</strong></dt><dd>{strip.boundary}</dd>
  </dl>
  <p className="muted">Read-only task reference; these are not prefilled student responses.</p>
 </details>;
}
function FourSentences({name,value,edit}:{name:string;value:Sentences;
 edit:(key:keyof Sentences,val:string)=>void}){
 return <div aria-label={name+' four original sentences'}>
  {(['s1','s2','s3','s4'] as const).map((key,index)=><OriginalField
   key={key} name={name+'-'+key} label={'Sentence '+(index+1)} rows={2}
   help="One purposeful sentence; no required connector quota."
   value={value[key]} onChange={val=>edit(key,val)}/>)}
 </div>;
}
function OutlineEditor({unitName,name,outline,onEdit}:{
 unitName:string;name:string;outline:Outline;onEdit:(next:Outline)=>void;
}){
 function roleEdit(i:number,field:keyof OutlineRole,value:string){
  onEdit({...outline,roles:outline.roles.map((r,j)=>i===j?{...r,[field]:value}:r)});
 }
 return <section aria-label={name+' learner keyword outline'}>
  <h3>{name==='cycleB'?'Your original makers’ fair outline':'Your independent shelter outline'}</h3>
  <p>Choose three or four distinct reader jobs. Enter keyword notes, not a finished essay. Three roles may cover the entire task.</p>
  {outline.roles.map((r,i)=><div className="wcv2-card" key={i}>
   <OriginalField name={unitName+'-'+name+'-job-'+i}
    label={'P'+(i+1)+' — Reader job'} rows={2}
    help="What new purpose does this paragraph serve for its reader?"
    value={r.job} onChange={v=>roleEdit(i,'job',v)}/>
   <OriginalField name={unitName+'-'+name+'-notes-'+i}
    label={'P'+(i+1)+' — Keywords or short phrases'} rows={3}
    help="Short, concrete notes. Usually 3–8 notes, but no fixed count or word score."
    value={r.notes} onChange={v=>roleEdit(i,'notes',v)}/>
  </div>)}
  {outline.roles.length===3?
   <button type="button" className="secondary-button"
    onClick={()=>onEdit({...outline,roles:[...outline.roles,blankRole()]})}>Add optional fourth role</button>:
   <button type="button" className="secondary-button"
    onClick={()=>onEdit({...outline,roles:outline.roles.slice(0,3)})}>Use three roles instead</button>}
  <OriginalField name={unitName+'-'+name+'-order'} label="Why is this order useful to the reader?"
   value={outline.orderRationale} onChange={v=>onEdit({...outline,orderRationale:v})}/>
  <OriginalField name={unitName+'-'+name+'-overlap'} label="Check whether two roles repeat the same job"
   help="If they overlap, say how you will clarify them; if not, explain why."
   value={outline.overlapCheck} onChange={v=>onEdit({...outline,overlapCheck:v})}/>
  <p className="muted">Saved notes are practice evidence, never a score or CEFR placement. An alternative coherent structure is allowed.</p>
 </section>;
}
function U04Panel({step,d,edit,count,reveal}:{
 step:Step;d:U04Draft;edit:(v:U04Draft)=>void;count:number;reveal:(n:number)=>void;
}){
 const x=WAVE2_UNITS['FW-U04'];
 if(step==='learn')return <section aria-label="U04 micro-lessons">
  <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1 · Say the relationship you mean</h3><p>{x.teaching.lesson1}</p>
  <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{x.teaching.demo.prompt}</WritingModel>
  <button type="button" className="secondary-button" disabled={count>=x.teaching.demo.steps.length}
   onClick={()=>reveal(Math.min(count+1,x.teaching.demo.steps.length))}>
   {count?'Reveal next thinking step':'Reveal first thinking step'}</button>
  {count>0&&<ol className="fw-demo-steps">{x.teaching.demo.steps.slice(0,count).map((v,i)=>
   <li key={i}><strong>{v.label}:</strong> {v.text}</li>)}</ol>}
  <p><strong>Concept:</strong> {x.teaching.concept}</p>
  <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2 · Who did what?</h3><p>{x.teaching.lesson2}</p>
  <blockquote>{x.teaching.ambiguity.ambiguous}</blockquote>
  <p>{x.teaching.ambiguity.question}</p>
  <details><summary>Show two legitimate clarified meanings</summary>
   <ul>{x.teaching.ambiguity.repairs.map((r,i)=><li key={i}>{r}</li>)}</ul>
  </details>
  <p><strong>Mini-check:</strong> {x.teaching.ambiguity.miniCheck}</p>
  <details><summary>Optional A1 support</summary><p>{x.teaching.a1}</p></details>
  <details><summary>Optional B1 extension</summary><p>{x.teaching.b1}</p></details>
  <EnglishLessonTutor lesson="Foundation Writing · U04 Meaningful linkers and reference clarity"
   focus="Explain cause/result/contrast and how to repair ambiguous pronouns using a fresh unrelated example. No decorative connector quotas. Do not reveal active exercise answers."/>
 </section>;
 if(step==='cycleA')return <section aria-label="U04 Practice A">
  <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{x.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <h3>Identify the relationship between ideas</h3>
  {x.cycleA.relations.map(v=><div className="field fw-classify-row" key={v.id}>
   <label htmlFor={'u04-'+v.id}><strong>{v.id} · {v.text}</strong></label>
   <select id={'u04-'+v.id} value={d.relationAnswers[v.id]??''}
    onChange={e=>edit({...d,relationAnswers:{...d.relationAnswers,[v.id]:e.target.value},relationReveal:false})}>
    <option value="">Choose relation</option>
    {['CAUSE_TO_RESULT','CONTRAST','RESULT_WITH_REASON'].map(r=><option key={r} value={r}>{r}</option>)}
   </select>
   {d.relationReveal&&<p role="status" className="muted">
    {d.relationAnswers[v.id]===v.key?'Correct relation. ':'Reconsider the relation. '}
    {v.rationale} (Key: {v.key})</p>}
  </div>)}
  <button className="secondary-button" type="button"
   onClick={()=>edit({...d,relationReveal:true})}>Check relation keys and explanations</button>
  <h3>Combine clauses with the intended meaning</h3>
  {x.cycleA.choices.map(q=><div className="wcv2-card" key={q.id}>
   <strong>{q.id}</strong><p>{q.stem}</p>
   <fieldset><legend>Choose the best connector</legend>
    {q.options.map(opt=><label className="field wcv2-radio-option" key={opt.id}>
     <input type="radio" name={q.id} value={opt.id}
      checked={d.comboAnswers[q.id]===opt.id}
      onChange={()=>edit({...d,comboAnswers:{...d.comboAnswers,[q.id]:opt.id},comboReveal:false})}/>
     {opt.text}{d.comboReveal&&<p className="muted">{opt.id===q.key?'Correct key. ':''}{opt.rationale}</p>}
    </label>)}
   </fieldset>
  </div>)}
  <button type="button" className="secondary-button"
   onClick={()=>edit({...d,comboReveal:true})}>Check all joins and explanations</button>
  <OriginalField name="u04-explain-join" label="Explain one chosen join in your own words"
   help={x.cycleA.explainPrompt} value={d.explainJoin}
   onChange={v=>edit({...d,explainJoin:v})}/>
  <OriginalField name="u04-no-link" label="Your own rewrite without an explicit linker"
   help={x.cycleA.noLinkPrompt} value={d.noLink}
   onChange={v=>edit({...d,noLink:v})}/>
  <p className="muted">The objective items have fixed keys. Your explanations and rewrites are not graded by keywords.</p>
 </section>;
 if(step==='cycleB')return <section aria-label="U04 original school workshop notice">
  <WritingHeading number={1}>Practice B</WritingHeading><WritingTask>{x.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <ol>{x.cycleB.steps.map((v,i)=><li key={i}>{v}</li>)}</ol>
  <FourSentences name="u04-notice" value={d.notice}
   edit={(key,v)=>edit({...d,notice:{...d.notice,[key]:v}})}/>
  <h3>Repair an ambiguous agent</h3><blockquote>{x.cycleB.ambiguous}</blockquote>
  <label className="field" htmlFor="u04-agent"><strong>Who do YOU intend sent the message?</strong>
   <select id="u04-agent" value={d.repairAgent}
    onChange={e=>edit({...d,repairAgent:e.target.value})}>
    <option value="">Choose intended agent</option>
    {x.cycleB.intendedAgents.map(a=><option key={a} value={a}>{a}</option>)}
   </select></label>
  <OriginalField name="u04-repair-revised" label="Your clarified sentence"
   value={d.repairRevised} onChange={v=>edit({...d,repairRevised:v})}/>
  <OriginalField name="u04-repair-why" label="Why this wording makes your intended meaning clearer"
   value={d.repairWhy} onChange={v=>edit({...d,repairWhy:v})}/>
  <p className="muted">{x.cycleB.note}</p>
  <details><summary>Optional A1 support</summary><p>{x.cycleB.a1}</p></details>
  <details><summary>Optional B1 stretch</summary><p>{x.cycleB.b1}</p></details>
 </section>;
 if(step==='transfer')return <section aria-label="U04 independent public notice transfer">
  <WritingHeading number={1}>Independent transfer</WritingHeading><WritingTask>{x.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <p>{x.transfer.instruction}</p>
  <FourSentences name="u04-transfer" value={d.transfer}
   edit={(key,v)=>edit({...d,transfer:{...d.transfer,[key]:v}})}/>
  <OriginalField name="u04-transfer-relation" label="What genuine relationship did you express, and why?"
   value={d.transferRelation} onChange={v=>edit({...d,transferRelation:v})}/>
 </section>;
 return null;
}
function U05Panel({step,d,edit,count,reveal}:{
 step:Step;d:U05Draft;edit:(v:U05Draft)=>void;count:number;reveal:(n:number)=>void;
}){
 const x=WAVE2_UNITS['FW-U05'];
 if(step==='learn')return <section aria-label="U05 micro-lessons">
  <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1 · One paragraph, one main job</h3><p>{x.teaching.lesson1}</p>
  <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{x.teaching.demo.prompt}</WritingModel>
  <button type="button" className="secondary-button" disabled={count>=x.teaching.demo.steps.length}
   onClick={()=>reveal(Math.min(count+1,x.teaching.demo.steps.length))}>
   {count?'Reveal next thinking step':'Reveal first thinking step'}</button>
  {count>0&&<ol className="fw-demo-steps">{x.teaching.demo.steps.slice(0,count).map((v,i)=>
   <li key={i}><strong>{v.label}:</strong> {v.text}</li>)}</ol>}
  {count===x.teaching.demo.steps.length&&<blockquote>{x.teaching.demo.paragraph}</blockquote>}
  <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2 · Inspect sentence functions</h3><p>{x.teaching.lesson2}</p>
  <details><summary>Optional A1 bridge</summary><p>{x.teaching.a1}</p></details>
  <details><summary>Optional B1 stretch</summary><p>{x.teaching.b1}</p></details>
  <EnglishLessonTutor lesson="Foundation Writing · U05 Paragraph Unity"
   focus="Explain the job of each sentence: point, reason, example, further detail. Use a fresh topic; do not prewrite current student paragraph or disclose practice keys. No fixed sentence/word-count rules."/>
 </section>;
 if(step==='cycleA')return <section aria-label="U05 Practice A ordering">
  <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{x.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <p>{x.cycleA.instruction}</p>
  {x.cycleA.cards.map(card=><div className="field fw-classify-row" key={card.id}>
   <label htmlFor={'u05-card-'+card.id}><strong>{card.id} · {card.text}</strong></label>
   <select id={'u05-card-'+card.id} value={d.positions[card.id]??''}
    onChange={e=>edit({...d,positions:{...d.positions,[card.id]:e.target.value},orderReveal:false})}>
    <option value="">Choose position / remove</option>
    {x.cycleA.positions.map(p=><option key={p} value={p}>{p==='REMOVE'?'Remove as off-task':'Position '+p}</option>)}
   </select>
   {d.orderReveal&&<p role="status" className="muted">
    {d.positions[card.id]===card.key?'Correct for this instructed order. ':'Review the specified order. '}
    {card.role}: {card.rationale} (Key: {card.key})</p>}
  </div>)}
  <button type="button" className="secondary-button"
   onClick={()=>edit({...d,orderReveal:true})}>Check the specified model order</button>
  <OriginalField name="u05-order-why" label="Explain why your chosen order helps the reader"
   help={x.cycleA.orderWhyPrompt} value={d.orderWhy}
   onChange={v=>edit({...d,orderWhy:v})}/>
  <OriginalField name="u05-repair-x1" label="Original replacement for off-topic X1"
   help={x.cycleA.repairPrompt} value={d.cycleARepair}
   onChange={v=>edit({...d,cycleARepair:v})}/>
  <OriginalField name="u05-reflection" label="What job does S3 perform that S1 does not?"
   help={x.cycleA.reflectionPrompt} value={d.cycleAReflection}
   onChange={v=>edit({...d,cycleAReflection:v})}/>
  <p className="muted">You may explain a different coherent order; no semantic error is inferred solely from ordering.</p>
 </section>;
 if(step==='cycleB')return <section aria-label="U05 own unified paragraph">
  <WritingHeading number={1}>Practice B</WritingHeading><WritingTask>{x.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <PromptStrip strip={x.cycleB.strip}/>
  <ol>{x.cycleB.steps.map((v,i)=><li key={i}>{v}</li>)}</ol>
  {(['point','reason','detail'] as const).map(key=><OriginalField key={key}
   name={'u05-plan-'+key} label={'Your '+key+' note'} rows={2} value={d.plan[key]}
   onChange={v=>edit({...d,plan:{...d.plan,[key]:v}})}/>)}
  <OriginalField name="u05-paragraph" label="Your ORIGINAL unified paragraph"
   help={x.cycleB.suggestedLength} rows={6} value={d.paragraph}
   onChange={v=>edit({...d,paragraph:v})}/>
  <OriginalField name="u05-sentence-quote" label="Copy an exact sentence FROM your paragraph"
   help="The app checks only whether it literally appears in your paragraph, not what the sentence means."
   value={d.sentenceJobQuote} onChange={v=>edit({...d,sentenceJobQuote:v})}/>
  <label className="field" htmlFor="u05-job-role"><strong>What job does that sentence perform?</strong>
   <select id="u05-job-role" value={d.sentenceJobRole}
    onChange={e=>edit({...d,sentenceJobRole:e.target.value})}>
    <option value="">Choose a role</option>
    {x.cycleB.roles.map(role=><option key={role} value={role}>{role}</option>)}
   </select></label>
  <OriginalField name="u05-job-why" label="Why does this sentence perform that job?"
   value={d.sentenceJobWhy} onChange={v=>edit({...d,sentenceJobWhy:v})}/>
  {d.sentenceJobQuote.trim()&&!quoteWithin(d.paragraph,d.sentenceJobQuote)&&
   <p role="status" className="notice">The quoted text does not appear verbatim in your own paragraph. Select a real sentence from it.</p>}
  <details><summary>Optional A1/B1 support</summary><p>{x.cycleB.a1}</p><p>{x.cycleB.b1}</p></details>
 </section>;
 if(step==='transfer')return <section aria-label="U05 independent bicycle repair transfer">
  <WritingHeading number={1}>Independent transfer</WritingHeading><WritingTask>{x.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <p>{x.transfer.instruction}</p>
  <OriginalField name="u05-transfer-paragraph" label="Your new original recommendation paragraph" rows={6}
   value={d.transferParagraph} onChange={v=>edit({...d,transferParagraph:v})}/>
  <OriginalField name="u05-transfer-quote" label="Quote one exact sentence serving as a supporting detail"
   value={d.transferDetailQuote} onChange={v=>edit({...d,transferDetailQuote:v})}/>
  {d.transferDetailQuote.trim()&&!quoteWithin(d.transferParagraph,d.transferDetailQuote)&&
   <p className="notice" role="status">Copy a real sentence from your transfer paragraph; the quotation is not found.</p>}
 </section>;
 return null;
}
function U06Panel({step,d,edit,count,reveal}:{
 step:Step;d:U06Draft;edit:(v:U06Draft)=>void;count:number;reveal:(n:number)=>void;
}){
 const x=WAVE2_UNITS['FW-U06'];
 if(step==='learn')return <section aria-label="U06 micro-lessons">
  <WritingHeading number={2}>Understand the concept</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 1 · Plan jobs, not sentences</h3><p>{x.teaching.lesson1}</p>
  <WritingHeading number={3}>See how it works</WritingHeading><WritingModel>{x.teaching.demo.prompt}</WritingModel>
  <button type="button" className="secondary-button" disabled={count>=x.teaching.demo.steps.length}
   onClick={()=>reveal(Math.min(count+1,x.teaching.demo.steps.length))}>
   {count?'Reveal next thinking step':'Reveal first thinking step'}</button>
  {count>0&&<ol className="fw-demo-steps">{x.teaching.demo.steps.slice(0,count).map((v,i)=>
   <li key={i}><strong>{v.label}:</strong> {v.text}</li>)}</ol>}
  <WritingHeading number={4}>Apply what you learned</WritingHeading><h3 className="fw-teaching-subtitle">Micro-lesson 2 · Distinct reader jobs</h3><p>{x.teaching.lesson2}</p>
  <details><summary>Optional A1 support</summary><p>{x.teaching.a1}</p></details>
  <details><summary>Optional B1 challenge</summary><p>{x.teaching.b1}</p></details>
  <EnglishLessonTutor lesson="Foundation Writing · U06 Keyword Outline"
   focus="Explain how a keyword outline differs from a full essay, how paragraph reader jobs differ, and flexible 3/4-role plans. Use an unrelated example and do not prefill active practice."/>
 </section>;
 if(step==='cycleA')return <section aria-label="U06 role matching">
  <WritingHeading number={1}>Practice A</WritingHeading><WritingTask>{x.cycleA.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <PromptStrip strip={x.cycleA.strip}/>
  <p>Match these notes to the stated jobs for THIS three-role task. A different coherent independent outline is not automatically wrong.</p>
  {x.cycleA.cards.map(card=><div className="field fw-classify-row" key={card.id}>
   <label htmlFor={'u06-card-'+card.id}><strong>{card.id} · {card.text}</strong></label>
   <select id={'u06-card-'+card.id} value={d.roleAnswers[card.id]??''}
    onChange={e=>edit({...d,roleAnswers:{...d.roleAnswers,[card.id]:e.target.value},roleReveal:false})}>
    <option value="">Select role or issue</option>
    {x.cycleA.labels.map(label=><option key={label} value={label}>{label}</option>)}
   </select>
   {d.roleReveal&&<p className="muted" role="status">
    {d.roleAnswers[card.id]===card.key?'Correct for this model task. ':'Review the model role. '}
    {card.rationale} (Key: {card.key})</p>}
  </div>)}
  <button type="button" className="secondary-button"
   onClick={()=>edit({...d,roleReveal:true})}>Check all card roles and explanations</button>
  <label className="field" htmlFor="u06-repair-card"><strong>Choose a duplicate to repair</strong>
   <select id="u06-repair-card" value={d.repairCard}
    onChange={e=>edit({...d,repairCard:e.target.value})}>
    <option value="">Select X1 or X3</option><option value="X1">X1</option><option value="X3">X3</option>
   </select>
  </label>
  <OriginalField name="u06-repair" label="Your original replacement role note"
   help={x.cycleA.repairPrompt} value={d.repairNote}
   onChange={v=>edit({...d,repairNote:v})}/>
  <OriginalField name="u06-repair-why" label="Why is the repaired job distinct?"
   help={x.cycleA.whyPrompt} value={d.repairWhy}
   onChange={v=>edit({...d,repairWhy:v})}/>
 </section>;
 if(step==='cycleB')return <section aria-label="U06 makers fair original outline">
  <WritingHeading number={1}>Practice B</WritingHeading><WritingTask>{x.cycleB.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <PromptStrip strip={x.cycleB.strip}/><p>{x.cycleB.instruction}</p>
  <OutlineEditor unitName="u06" name="cycleB" outline={d.outline}
   onEdit={value=>edit({...d,outline:value})}/>
  <details><summary>Optional A1/B1 support</summary><p>{x.cycleB.a1}</p><p>{x.cycleB.b1}</p></details>
 </section>;
 if(step==='transfer')return <section aria-label="U06 shelter letter transfer">
  <WritingHeading number={1}>Independent transfer</WritingHeading><WritingTask>{x.transfer.prompt}</WritingTask>
   <WritingHeading number={2}>Your practice</WritingHeading>
  <p>{x.transfer.instruction}</p>
  <OutlineEditor unitName="u06" name="transfer" outline={d.transferOutline}
   onEdit={value=>edit({...d,transferOutline:value})}/>
 </section>;
 return null;
}
export function FoundationWritingWave2({unitId,work,onEdit,onSave,onExit,showVi=false}:{
 unitId:Wave2Id;work:Wave2Work;onEdit:(next:Wave2Draft)=>void;
 onSave:()=>Promise<boolean>;onExit:()=>void;showVi?:boolean;
}){
 const source=WAVE2_UNITS[unitId];
 const [step,setStep]=useState<Step>('learn'),[count,setCount]=useState(0);
 const [saveBusy,setSaveBusy]=useState(false),[saveStatus,setSaveStatus]=useState('');
 const [target,setTarget]=useState<Wave2Artifact>('cycleB');
 const [pending,setPending]=useState(false),[feedback,setFeedback]=useState<{model:string;data:Review}|null>(null);
 const [reviewStatus,setReviewStatus]=useState('');
 const mounted=useRef(true),ticket=useRef(0),latestSig=useRef(''),latestTarget=useRef(target);
 const sig=wave2Signature(work.draft);latestSig.current=sig;latestTarget.current=target;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;ticket.current++}},[]);
 useEffect(()=>{ticket.current++;setPending(false);setFeedback(null);setReviewStatus('');
  setStep('learn');setCount(0);setTarget('cycleB');},[unitId]);
 const saved=exactSavedWave2(work),selected=eligibleWave2Artifact(unitId,work,target);
 const progress=wave2Progress(unitId,work);
 function invalidate(){ticket.current++;setPending(false);setFeedback(null);setReviewStatus('')}
 function edit(next:Wave2Draft){invalidate();setSaveStatus('');onEdit(next)}
 function go(s:Step){invalidate();if(s==='cycleA'||s==='cycleB'||s==='transfer')setTarget(s);setStep(s)}
 async function save(exit=false){
  if(saveBusy)return false;setSaveBusy(true);setSaveStatus('');
  try{const ok=await onSave();if(!mounted.current)return false;
   if(!ok){setSaveStatus('Save failed. Your work remains on this page. Retry before leaving.');return false;}
   setSaveStatus('Saved '+unitId+' as a version of your work. This is not a language proficiency score.');
   if(exit)onExit();return true;
  }catch{if(mounted.current)setSaveStatus('Save failed. Retry before leaving.');return false}
  finally{if(mounted.current)setSaveBusy(false)}
 }
 async function ask(){
  const own=eligibleWave2Artifact(unitId,work,target);
  if(!saved||!own||pending||saveBusy)return;
  const current=++ticket.current,fromSig=sig,fromTarget=target,fromUnit=unitId;
  setPending(true);setFeedback(null);setReviewStatus('');
  try{
   const tutor=browserTutorService();
   const result=tutor.available?await tutor.coach('foundation-writing',own.task,{
    unitId:fromUnit,fixtureId:own.fixtureId,text:own.text,
   },{responseLanguage:showVi?'vi':'en'}):null;
   if(!mounted.current||ticket.current!==current||latestSig.current!==fromSig||
    latestTarget.current!==fromTarget)return;
   const data=result?.structuredResult as Review|undefined;
   if(result?.provider==='firebase-ai-logic'&&data&&data.scores===null&&data.level===null&&
    typeof data.summary==='string'&&typeof data.nextAction==='string'&&
    Array.isArray(data.quotes)&&data.quotes.every(q=>typeof q==='string'&&own.text.includes(q))&&
    Array.isArray(data.strengths)&&data.strengths.length<=2&&
    Array.isArray(data.improvements)&&data.improvements.length<=2&&
    Array.isArray(data.questions)&&data.questions.length>=1&&data.questions.length<=2){
    setFeedback({model:result.model,data});
   }else setReviewStatus(unavailable);
  }catch{if(mounted.current&&ticket.current===current)setReviewStatus(unavailable)}
  finally{if(mounted.current&&ticket.current===current)setPending(false)}
 }
 return <section className="panel wcv2 fw-unit" aria-label={'Foundation Writing '+unitId}>
  <div className="foundation-unit-top-nav fw-topnav"><button type="button" className="secondary-button" onClick={onExit}>← Back to Foundation Writing</button><div className="fw-top-actions"><span className="muted">{saved?'Saved work available':'Not started'}</span><button type="button" className="secondary-button" disabled={saveBusy} onClick={()=>void save(true)}>Save &amp; Exit</button></div></div>
  <div className="page-heading"><div><span className="eyebrow">Foundation Writing · Unit {String(Number(unitId.slice(-2))).padStart(2,'0')}</span>
   <h1>{source.title}</h1><WritingMeta unit={Number(unitId.slice(-2))}/>
   <p className="muted">{source.minutes} · Learn at your own pace. Your own writing is not automatically graded.</p>
  </div></div>
  <WritingSteps step={step} onStep={go} checked={progress.extras} saved={!!saved}/>
  {step==='learn'&&<WritingGoal unit={Number(unitId.slice(-2))} showVi={showVi}/>}
  <p className="muted" role="status">
   {saved?'Saved version '+saved.version+'. Edits need a fresh save for AI review.':
    'Your edited draft is not the last saved version. Save before requesting optional AI review.'}</p>
  {unitId==='FW-U04'&&<U04Panel step={step} d={work.draft as U04Draft} edit={edit} count={count} reveal={setCount}/>}
  {unitId==='FW-U05'&&<U05Panel step={step} d={work.draft as U05Draft} edit={edit} count={count} reveal={setCount}/>}
  {unitId==='FW-U06'&&<U06Panel step={step} d={work.draft as U06Draft} edit={edit} count={count} reveal={setCount}/>}
  {step==='extra'&&<section aria-label={unitId+' extra objective practice'}>
   <WritingHeading number={1}>Knowledge Check</WritingHeading>
   <p>Only these fixed-choice items have known keys. All your original writing remains unscored.</p>
   {source.supplemental.map(item=>{
    const chosen=work.draft.supplementalAnswers[item.id]??'';
    const checked=!!work.draft.supplementalReveal[item.id];
    const result=checked?wave2ObjectiveResult(unitId,item.id,chosen):null;
    return <article className="wcv2-card" key={item.id}>
     <h3>{item.title}</h3><blockquote>{item.prompt}</blockquote>
     <fieldset><legend>{item.question}</legend>
      {item.options.map(option=><label className="field wcv2-radio-option" key={option.id}>
       <input type="radio" name={item.id} value={option.id} checked={chosen===option.id}
        onChange={()=>edit({...work.draft,supplementalAnswers:{...work.draft.supplementalAnswers,[item.id]:option.id},
         supplementalReveal:{...work.draft.supplementalReveal,[item.id]:false}})}/>
       <strong>{option.id}.</strong> {option.text}
       {checked&&<p className={option.id===item.key?'fw-rationale fw-correct':'fw-rationale'}>{option.id===item.key?'Correct key. ':''}{option.rationale}</p>}
      </label>)}
     </fieldset>
     <button type="button" className="secondary-button" disabled={!chosen}
      onClick={()=>edit({...work.draft,supplementalReveal:{...work.draft.supplementalReveal,[item.id]:true}})}>
      Check answer and read all explanations</button>
     {result&&<p role="status" className={result.correct?'fw-answer fw-correct':'fw-answer fw-retry'}>{result.correct?'Correct selection.':'Review the reasons and try again.'} Key: {result.key}</p>}
    </article>;
   })}
   
  </section>}
  {(step==='cycleA'||step==='cycleB'||step==='transfer')&&<section className="fw-inline-ai" aria-label="AI Tutor Writing Review" key={unitId+'-'+step}>
   <h2>AI Writing Tutor</h2><p>Get feedback on this writing, then improve your answer here.</p>
   <WritingSelfCheck key={step} unit={Number(unitId.slice(-2))}/>
   <WritingReviewAction signature={sig} eligible={!!selected} busy={saveBusy||pending}  onSave={()=>save()} onAsk={()=>void ask()}/>
   {reviewStatus&&<p className="notice" role="status">{reviewStatus}</p>}
   {feedback&&<article className="wcv2-card" aria-live="polite">
    <h3>AI Tutor feedback · provisional · {feedback.model}</h3>
    <TeachingBlocks text={feedback.data.summary}/>
    {feedback.data.strengths.length>0&&<><strong>Specific strengths</strong><ul>
     {feedback.data.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
    {feedback.data.improvements.length>0&&<><strong>Improvement opportunities</strong><ul>
     {feedback.data.improvements.map((s,i)=><li key={i}>{s}</li>)}</ul></>}
    {feedback.data.quotes.length>0&&<><strong>Exact excerpts from your saved writing</strong><ul>
     {feedback.data.quotes.map((s,i)=><li key={i}><q>{s}</q></li>)}</ul></>}
    <strong>Questions to guide your own revision</strong>
    <ul>{feedback.data.questions.map((s,i)=><li key={i}>{s}</li>)}</ul>
    <p><strong>Next action:</strong> {feedback.data.nextAction}</p>
    <p className="muted">No CEFR level, numeric score or ghostwritten replacement was stored.</p>
   </article>}
  </section>}
  <div className="learning-choices fw-actions">
   <WritingNext step={step} onStep={go} onFinish={()=>void save(true)}/>
   <button type="button" className="secondary-button" disabled={saveBusy} onClick={()=>void save()}>
    {saveBusy?'Saving…':'Save work'}</button>
   
   <button type="button" className="secondary-button" onClick={onExit}>Back to Foundation Writing</button>
  </div>
  {saveStatus&&<p className="notice" role="status">{saveStatus}</p>}
  {showVi&&<p className="vi-help">Em có thể hoàn thành bài học mà không sử dụng AI. Bài viết tự do chỉ lưu minh chứng học tập, không tự động chấm trình độ CEFR.</p>}
 </section>;
}
