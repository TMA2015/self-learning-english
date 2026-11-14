'use client';

import {useState} from 'react';
import type {WeekWork} from '../domain/writing-course-v2-b';

/**
 * Week 2 teaching checkpoints and remedial scaffolds, not graded evidence.
 * Independent examples do not reuse the guided rainy-afternoon item set,
 * the existing lunchtime-club example, or Main Practice after-school task.
 */
export function Week2ThinkBeforeReveal(){
  const [selected,setSelected]=useState('');
  const [reason,setReason]=useState('');
  const [revealed,setRevealed]=useState(false);
  return <section className="wcv2-card" aria-label="Predict and explain before seeing a model">
    <h3>Pause and think · Explain your prediction</h3>
    <p><strong>New situation:</strong> A science museum wants one short activity that children can try themselves in 15 minutes. Which idea is more relevant?</p>
    <fieldset className="w2-reflection-choice">
      <legend>Choose one idea, then explain your thinking.</legend>
      <label className="wcv2-option"><input type="radio" name="w2-predict" value="magnet" checked={selected==='magnet'} onChange={()=>{setSelected('magnet');setRevealed(false);}}/> A small magnet experiment that children can try</label>
      <label className="wcv2-option"><input type="radio" name="w2-predict" value="sign" checked={selected==='sign'} onChange={()=>{setSelected('sign');setRevealed(false);}}/> A new sign for the museum entrance</label>
    </fieldset>
    <label className="field"><span>Why did you choose it? Name one detail from the task.</span>
      <textarea rows={2} value={reason} onChange={e=>{setReason(e.target.value);setRevealed(false);}} placeholder="I chose this because the task asks for ..."/>
    </label>
    <button type="button" className="secondary-button" disabled={!selected||!reason.trim()}
      onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide the reasoning':'Compare my reasoning'}</button>
    {revealed&&<div className="notice" role="status">
      <p><strong>One defensible choice:</strong> The magnet experiment.</p>
      <p>The task asks for an activity children can <em>try themselves</em> in 15 minutes. Making a new sign changes the building, but does not yet give the children an activity. Did your explanation identify the action and time limit?</p>
      <p>Another safe, short, hands-on museum experiment could also fit. We are comparing reasons, not awarding a grade.</p>
    </div>}
    <p className="muted">Think → explain → compare. The comparison stays hidden until you provide your own reasoning. Your response is not saved or scored.</p>
  </section>;
}

export function Week2RepairBridge(){
  const [repair,setRepair]=useState('');
  const [why,setWhy]=useState('');
  const [hint,setHint]=useState(false);
  const [example,setExample]=useState(false);
  const attempted=Boolean(repair.trim()&&why.trim());
  return <section className="wcv2-card" aria-label="Bridge from classifying given ideas to repairing your own">
    <h3>Bridge challenge · Repair a nearly relevant idea</h3>
    <p>Next, move beyond choosing a label. Try improving an idea before creating your own in Main Practice.</p>
    <blockquote>A school recycling team wants a ten-minute activity that helps visitors learn to sort everyday waste.</blockquote>
    <p><strong>Weak idea:</strong> “Buy more recycling bins.” This might be useful, but it does not yet describe an activity visitors can do.</p>
    <label className="field"><span>Rewrite it as one activity visitors can actually do.</span>
      <textarea rows={2} value={repair} onChange={e=>{setRepair(e.target.value);setExample(false);}} placeholder="Visitors could ..."/>
    </label>
    <label className="field"><span>Why would your revised idea fit this task?</span>
      <textarea rows={2} value={why} onChange={e=>{setWhy(e.target.value);setExample(false);}} placeholder="This fits because ..."/>
    </label>
    <div className="learning-choices">
      <button type="button" className="secondary-button" onClick={()=>setHint(v=>!v)}>{hint?'Hide the hint':'Need a hint?'}</button>
      <button type="button" className="secondary-button" disabled={!attempted}
        onClick={()=>setExample(v=>!v)}>{example?'Hide a possible repair':'Compare with one possible repair'}</button>
    </div>
    {hint&&<div className="notice" role="status">
      Think about three constraints: what visitors will <strong>do</strong>, what they will <strong>learn</strong>, and how it can fit in <strong>ten minutes</strong>. Do not copy the weak idea unchanged.
    </div>}
    {example&&<div className="notice" role="status">
      <p><strong>One possible repair:</strong> “Visitors play a quick sorting game using pictures of clean packaging, then check which items go in each bin.”</p>
      <p><strong>Why:</strong> Visitors take part in sorting, and the game could be completed in ten minutes. Your own activity can be different if it meets the task.</p>
      <p>Compare your attempt with the three constraints. This is worked feedback, <strong>not an automatic assessment of your answer</strong>.</p>
    </div>}
    <p className="muted">Optional, unscored practice. These notes are temporary. The four original Guided MCQs and their scoring are unchanged.</p>
  </section>;
}

const SELF_CRITERIA=[
  {id:'topic',label:'The chosen activity answers the exact task',action:'Re-read the prompt. Circle the requested activity, audience and reason. Replace or adapt an unrelated option.'},
  {id:'alternatives',label:'I considered possible alternatives before selecting',action:'Try one more possible after-school activity, then compare how easily you can explain it.'},
  {id:'filter',label:'I can explain why one idea needs rejection or repair',action:'Describe what requirement the weaker idea misses. If possible, rewrite it to fit.'},
  {id:'reason',label:'My explanation connects the choice to the task',action:'Replace a vague reason such as “because it is good” with one concrete way students can participate.'}
] as const;

export function Week2RevisionCoach({work}:{work:WeekWork}){
  const [ratings,setRatings]=useState<Record<string,string>>({});
  const [focus,setFocus]=useState('');
  const [plan,setPlan]=useState('');
  const incomplete=['ideas','reject','best','fit'].filter(k=>!work.fields[k]?.trim());
  const chosen=SELF_CRITERIA.find(x=>x.id===focus);
  return <section className="wcv2-card" aria-label="Week 2 revision and self-evaluation">
    <h3>Review your thinking before revising</h3>
    <p>Start with your own task, not a model answer. Rate each statement using your judgement. The software checks only whether fields have text; it cannot determine idea quality or relevance.</p>
    {incomplete.length>0&&<p className="notice"><strong>Required parts still empty:</strong> {incomplete.join(', ')}. Complete your notes before saving a finished attempt.</p>}
    {SELF_CRITERIA.map(item=><label className="field" key={item.id}>
      <span>{item.label}</span>
      <select value={ratings[item.id]??''} onChange={e=>setRatings(prev=>({...prev,[item.id]:e.target.value}))}>
        <option value="">Choose your own judgement</option>
        <option value="not yet">Not yet — I need to work on this</option>
        <option value="uncertain">Not sure — I should check this</option>
        <option value="can explain">I can explain how I did this</option>
      </select>
    </label>)}
    <label className="field"><span>Choose one part to improve in your original text fields above.</span>
      <select value={focus} onChange={e=>setFocus(e.target.value)}>
        <option value="">Select a revision focus</option>
        {SELF_CRITERIA.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </label>
    {chosen&&<div className="notice" role="status"><strong>Try this next:</strong> {chosen.action}</div>}
    <label className="field"><span>My next revision action (a private, unsaved note)</span>
      <textarea rows={2} value={plan} onChange={e=>setPlan(e.target.value)} placeholder="I will revise ... because ..."/>
    </label>
    <p><strong>Revision loop:</strong> Edit the original answer fields → save another completed attempt → compare the two saved versions. Do not treat the number of filled fields as a Writing score.</p>
    <p className="muted">The ratings and revision plan are learner self-reports only. They are not stored as grades, proficiency or evidence.</p>
  </section>;
}
