'use client';

import {useState} from 'react';

/**
 * Week 2 instructional-only components.
 * No network, storage, grading, AI calls, or writes to canonical WeekWork.
 * Academic source: SLE-W2-COURSE-SIMPLIFY-R0-20261115 (NotebookLM PASS).
 */
const PARK_TASK='A neighbourhood park wants one simple weekend activity that families can join. Suggest an activity and explain why it would be suitable.';
const PARK_IDEAS=['Drawing corner','Family nature hunt','Shared music game','Change the bus fare'];
const ANALYSIS=[
 ['Topic','A neighbourhood park'],
 ['Task','Suggest one weekend activity'],
 ['Must include','Explain why the activity is suitable'],
 ['Boundary','Families need to be able to join the activity']
];
const LESSON_STEPS=['A1 · Read the task','A2 · Collect ideas','A3 · Check relevance','A4 · Choose & explain'];
const gridStyle={display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',gap:'0.75rem'} as const;

export function Week2CourseLearn(){
 const [step,setStep]=useState(0);
 const [showFilter,setShowFilter]=useState(false);
 const [museumChoice,setMuseumChoice]=useState('');
 const [museumWhy,setMuseumWhy]=useState('');
 const [museumRevealed,setMuseumRevealed]=useState(false);
 return <section aria-label="Week 2 step-by-step brainstorming lesson">
  <article className="wcv2-card">
   <h3>How to brainstorm: think first, write later</h3>
   <p>First understand the task. Then jot down ideas without judging them. Next check which ideas answer the task. Finally choose one and explain why.</p>
   <nav aria-label="Four small brainstorming lessons" style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
    {LESSON_STEPS.map((label,i)=><button key={label} type="button" className={step===i?'primary-button':'secondary-button'} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}>{label}</button>)}
   </nav>
  </article>
  <article className="wcv2-card">
   <p><strong>Worked example (not a test question):</strong> {PARK_TASK}</p>
   {step===0&&<div>
    <h3>A1 · What does the question ask?</h3>
    <p>Look for the topic, the action you must take, what you must include, and what would go outside the task.</p>
    <div style={gridStyle}>{ANALYSIS.map(([title,detail])=><div className="wcv2-card" key={title}><strong>{title}</strong><p>{detail}</p></div>)}</div>
    <details><summary>Optional Vietnamese help</summary><p>Đọc đề để tìm chủ đề, yêu cầu cần làm, nội dung bắt buộc và giới hạn của câu trả lời.</p></details>
   </div>}
   {step===1&&<div>
    <h3>A2 · Write quick notes without judging</h3>
    <p>Here are four first thoughts. They are notes, not full sentences. Nothing has been marked right or wrong yet.</p>
    <ul>{PARK_IDEAS.map(idea=><li key={idea}>{idea}</li>)}</ul>
    <p>Try writing your own short notes on paper. Save the judging for the next step.</p>
   </div>}
   {step===2&&<div>
    <h3>A3 · Ask: does each idea answer this task?</h3>
    <p>An idea can fit, need explanation, or be off topic. Think about your own decision before comparing.</p>
    <button type="button" className="secondary-button" onClick={()=>setShowFilter(x=>!x)} aria-expanded={showFilter}>{showFilter?'Hide the worked decisions':'Show one possible set of decisions'}</button>
    {showFilter&&<ul>
     <li><strong>Fits:</strong> Drawing corner; family nature hunt. Families can join these activities.</li>
     <li><strong>Needs explanation:</strong> Shared music game. How would families take part together?</li>
     <li><strong>Off topic:</strong> Change the bus fare. A transport price is not a park activity.</li>
    </ul>}
    <p>These are explained examples, not automatic judgments about your own ideas. You can also repair an unclear idea.</p>
   </div>}
   {step===3&&<div>
    <h3>A4 · Choose an idea you can explain</h3>
    <div style={gridStyle}>
     <div className="wcv2-card"><strong>Idea</strong><p>Family nature hunt</p></div>
     <div className="wcv2-card"><strong>Reason</strong><p>Families can explore the park together.</p></div>
     <div className="wcv2-card"><strong>Optional example</strong><p>They can look for five different leaves.</p></div>
    </div>
    <p><strong>One simple sentence:</strong> I would choose a family nature hunt <strong>because</strong> families can explore the park together.</p>
    <p><strong>Improve a weak reason:</strong> “It is good because it is good” → “It helps families work together outdoors.”</p>
    <p>Idea → Reason → Example is a planning aid, not a rigid rule for all writing.</p>
    <p><strong>Useful language (optional):</strong> work together · share ideas · learn new skills · feel more confident.</p>
   </div>}
   <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'0.5rem'}}>
    <button type="button" className="secondary-button" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Previous idea</button>
    <button type="button" className="primary-button" disabled={step===3} onClick={()=>setStep(s=>Math.min(3,s+1))}>Next small step →</button>
   </div>
  </article>
  <details className="wcv2-card">
   <summary>Optional extra check · Science museum (unscored)</summary>
   <p>A science museum wants an activity that visitors can join. Which is closer to the task?</p>
   <fieldset><legend>Choose an activity</legend>
    <label className="wcv2-option"><input type="radio" name="w2-museum-choice" checked={museumChoice==='magnet'} onChange={()=>{setMuseumChoice('magnet');setMuseumRevealed(false);}}/> A hands-on magnet experiment</label>
    <label className="wcv2-option"><input type="radio" name="w2-museum-choice" checked={museumChoice==='sign'} onChange={()=>{setMuseumChoice('sign');setMuseumRevealed(false);}}/> Change the entrance sign</label>
   </fieldset>
   <label className="field"><span>Why did you choose it?</span><textarea value={museumWhy} onChange={e=>{setMuseumWhy(e.target.value);setMuseumRevealed(false);}} rows={2} placeholder="Write your own reason before comparing."/></label>
   <button type="button" className="secondary-button" disabled={!museumChoice||!museumWhy.trim()} onClick={()=>setMuseumRevealed(true)}>Compare with a worked explanation</button>
   {museumRevealed&&<p role="status">One defensible answer: visitors can take part in the hands-on magnet experiment. Changing a sign does not describe an activity they can join. Compare the reasoning with your own words; there is no score.</p>}
  </details>
 </section>;
}

const ART_CARDS=[
 {id:'mural',text:'Visitors add a drawing to a shared mural',sample:'Fits: visitors join by drawing together.'},
 {id:'map',text:'Print a larger map of the building entrance',sample:'Needs explanation: a map helps visitors find places but does not yet describe an activity.'},
 {id:'lunch',text:'Change school lunch prices',sample:'Off topic: lunch prices do not answer an exhibition activity task.'},
 {id:'collage',text:'Invite visitors to choose a community collage theme',sample:'Fits: visitors take part by choosing a theme.'}
] as const;

export function Week2CourseRepair(){
 const [attempt,setAttempt]=useState('');
 const [reveal,setReveal]=useState(false);
 const [sort,setSort]=useState<Record<string,string>>({});
 const [compareSort,setCompareSort]=useState(false);
 return <section aria-label="Week 2 optional practice after the four canonical questions">
  <article className="wcv2-card">
   <h3>Repair one idea · practice only</h3>
   <p>A recycling team needs a ten-minute activity for visitors. “Buy more recycling bins” is not an activity visitors can join. How could you change it?</p>
   <label className="field"><span>My repaired activity</span><textarea value={attempt} rows={2} onChange={e=>{setAttempt(e.target.value);setReveal(false);}} placeholder="Visitors could..."/></label>
   <button type="button" className="secondary-button" disabled={!attempt.trim()} onClick={()=>setReveal(x=>!x)}>{reveal?'Hide the example':'Compare after my attempt'}</button>
   {reveal&&<p role="status"><strong>One possible repair:</strong> Run a short sorting game where visitors put clean paper, plastic and metal items in the correct bins. They can participate, not just watch.</p>}
   <p className="muted">Ungraded. This does not change your four Guided Practice answers.</p>
  </article>
  <details className="wcv2-card">
   <summary>Optional: practise sorting four more ideas</summary>
   <p>A community art exhibition needs an activity visitors can join. Choose a category for each idea before reading one possible explanation.</p>
   {ART_CARDS.map(c=><label className="field" key={c.id}><span>{c.text}</span>
    <select aria-label={'Category for '+c.text} value={sort[c.id]??''} onChange={e=>{setSort(old=>({...old,[c.id]:e.target.value}));setCompareSort(false);}}>
     <option value="">Choose a category</option>
     <option value="fit">Fits</option><option value="explain">Needs explanation</option><option value="off">Off topic</option>
    </select>
   </label>)}
   <button type="button" className="secondary-button" disabled={!ART_CARDS.every(c=>sort[c.id])} onClick={()=>setCompareSort(x=>!x)}>{compareSort?'Hide explanations':'Compare my reasoning'}</button>
   {compareSort&&<ul>{ART_CARDS.map(c=><li key={c.id}><strong>{c.text}:</strong> My category: {sort[c.id]}. One defensible reading: {c.sample}</li>)}</ul>}
   <p className="muted">These choices are local to this practice. No semantic score is calculated or saved.</p>
  </details>
 </section>;
}

export function Week2CourseMainGuide(){
 return <article className="wcv2-card" aria-label="Four steps for your own brainstorming notes">
  <h3>Your turn · Four small writing moves</h3>
  <ol>
   <li><strong>Collect:</strong> List possible after-school activities. Short notes are fine; do not judge yet.</li>
   <li><strong>Set aside:</strong> Which idea will you reject? Why is it less suitable?</li>
   <li><strong>Choose:</strong> Select the one activity you want your school to add.</li>
   <li><strong>Explain:</strong> How does this activity answer the question? Use your own reason.</li>
  </ol>
  <details><summary>Need one small hint?</summary><p>Ask yourself: What would students do in this activity, and why might it help them?</p></details>
  <p className="muted">Use the four original fields below. Your notes are yours; no automatic relevance grading.</p>
 </article>;
}

export function Week2CourseSelfCheck(){
 const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [revision,setRevision]=useState('');
 const questions=[
  'My chosen activity answers the after-school activity task.',
  'I considered another idea and explained why I set it aside.',
  'I can explain why my chosen activity fits.'
 ];
 return <article className="wcv2-card" aria-label="Learner-controlled self-check">
  <h3>Check my thinking · not a grade</h3>
  <p>These are questions for you to answer, not judgments made by the computer.</p>
  {questions.map((question,i)=><label className="wcv2-option" key={question}><input type="checkbox" checked={!!checks[String(i)]} onChange={e=>setChecks(x=>({...x,[String(i)]:e.target.checked}))}/>{question}</label>)}
  <label className="field"><span>What one part will I improve?</span><input type="text" value={revision} onChange={e=>setRevision(e.target.value)} placeholder="e.g., make my reason clearer"/></label>
  <p className="muted">Self-check notes here are temporary and ungraded. Revise your original four fields above, then use the existing Save button.</p>
 </article>;
}

export function Week2CourseTransfer(){
 const [notes,setNotes]=useState({ideas:'',reject:'',best:'',fit:''});
 const prompts=[
  ['ideas','Possible activities'],
  ['reject','One I would set aside'],
  ['best','My chosen activity'],
  ['fit','Why it fits']
 ] as const;
 return <details className="wcv2-card" aria-label="Optional independent transfer practice">
  <summary>Optional new task · Try brainstorming independently</summary>
  <p><strong>Fresh task:</strong> A local community centre wants one short Saturday activity for newcomers. What activity should it offer? Explain your choice.</p>
  <p>Try writing your own ideas before asking for help. This task is separate from the scored rainy-afternoon questions and your after-school Main Practice.</p>
  {prompts.map(([key,label])=><label className="field" key={key}><span>{label}</span><textarea rows={2} value={notes[key]} onChange={e=>setNotes(x=>({...x,[key]:e.target.value}))}/></label>)}
  <details><summary>Optional process reminder after an attempt</summary><p>Understand the task → collect a few activities → set one aside → choose one → explain why newcomers can join.</p></details>
  <p className="notice">Temporary scratchpad: these notes are NOT saved and do not affect course completion or proficiency evidence.</p>
  <p>G Learning Writing Lab · Idea Explorer is being built as an optional separate practice space. You do not need it to finish Week 2.</p>
 </details>;
}
