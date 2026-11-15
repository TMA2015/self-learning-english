'use client';

import {useState} from 'react';
import {completeWeek,weekStructureCheck,writingWeek,type WeekScreen,type WeekWork} from '../domain/writing-course-v2-b';

/**
 * Writing Week 2 R1: three stable worked examples across four thinking moves.
 * Approved educational design: SLE-W2-COURSE-OWNER-VISUAL-R1-20261115.
 * UI assistance only: no network calls, AI, scoring, storage or data schema edits.
 */
type Example={
 id:'park'|'museum'|'library';title:string;task:string;
 analysis:readonly (readonly [string,string])[];
 ideas:readonly string[];
 fits:string;repair:string;offTopic:string;
 chosen:string;reason:string;detail:string;sentence:string;
};
const EXAMPLES:readonly Example[]=[
 {id:'park',title:'E1 · Park',
  task:'A neighbourhood park wants one simple weekend activity that families can join. Suggest an activity and explain why it would be suitable.',
  analysis:[['Topic','A neighbourhood park and families'],['Task','Suggest one weekend activity'],['Must include','Explain why the activity is suitable'],['Boundary','Families can take part in the activity']],
  ideas:['Family nature hunt','Drawing corner','Live music show','Change the bus fare'],
  fits:'Family nature hunt: families explore together. Drawing corner: visitors can make drawings.',
  repair:'Live music show: watching alone may not let families join. Repair it into a family sing-along or simple group-rhythm game.',
  offTopic:'Change the bus fare: this changes a transport price, not a park activity.',
  chosen:'Family nature hunt',reason:'Families can explore the park together.',detail:'Look for five different kinds of leaves.',
  sentence:'I would choose a family nature hunt because families can explore the park together.'},
 {id:'museum',title:'E2 · Museum',
  task:'A science museum wants one ten-minute activity visitors can try themselves. Suggest an activity and explain why visitors would enjoy it.',
  analysis:[['Topic','A science museum'],['Task','Suggest one ten-minute activity'],['Must include','Explain why visitors would enjoy it'],['Boundary','Visitors try the activity themselves']],
  ideas:['Magnet experiment','Build a paper bridge','Watch a science video','Repaint the entrance sign'],
  fits:'Magnet experiment: visitors test materials. Paper bridge: visitors build and try a bridge.',
  repair:'Watch a science video: watching alone is passive. Repair it by asking visitors to predict an outcome and then try a short experiment.',
  offTopic:'Repaint the entrance sign: this is building maintenance, not an activity visitors try.',
  chosen:'Magnet experiment',reason:'Visitors discover what magnets attract by testing objects themselves.',detail:'Test a paper clip and a wooden stick.',
  sentence:'I would choose a magnet experiment because visitors can learn by testing everyday objects.'},
 {id:'library',title:'E3 · Library',
  task:'A local library wants one Saturday activity to help children discover new books. Suggest an activity and explain how it would help.',
  analysis:[['Topic','A local library and children'],['Task','Suggest one Saturday activity'],['Must include','Explain how it helps children discover new books'],['Boundary','Children explore books; this is not a building upgrade']],
  ideas:['Book tasting table','Guess the book from its cover','Reading competition','Replace the library lights'],
  fits:'Book tasting table: children sample different stories. Cover guessing: children notice unfamiliar books.',
  repair:'Reading competition: it might focus only on speed or number read. Repair it by letting children try different genres and share one new title.',
  offTopic:'Replace the library lights: this changes the building, not an activity for exploring books.',
  chosen:'Book tasting table',reason:'Children can explore stories they might not normally choose.',detail:'Read the first page of a mystery, an adventure and a sports story.',
  sentence:'I would choose a book tasting table because children can try different kinds of stories.'}
];
const STEPS=[
 {title:'A1 · Understand',instruction:'Find the topic, the action requested, what your answer must include, and the limits of the task.',vi:'Tìm chủ đề, việc đề bài yêu cầu, phần cần giải thích và giới hạn của câu trả lời.',takeaway:'A clear task tells you which ideas can fit.'},
 {title:'A2 · Collect',instruction:'Jot down short possibilities. Do not judge, rank or write full sentences yet.',vi:'Ghi nhanh những ý tưởng có thể có, chưa đánh giá hoặc viết thành câu.',takeaway:'A rough idea list is your starting point, not your final paragraph.'},
 {title:'A3 · Check & repair',instruction:'Ask if each idea fits the task, needs a clearer activity, or answers a different question. Repair one that almost fits.',vi:'Xem ý tưởng phù hợp, cần làm rõ hoặc lạc đề; thử sửa ý tưởng gần phù hợp.',takeaway:'Some unclear ideas can be repaired. Off-topic ideas answer a different question.'},
 {title:'A4 · Choose & explain',instruction:'Choose one idea from your list. Give a specific reason; add a small example only when helpful.',vi:'Chọn một ý tưởng, nêu lý do cụ thể, thêm ví dụ nếu có ích.',takeaway:'A reason explains why; an example shows what the reason could look like.'}
] as const;
const cards={display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',gap:'0.75rem'} as const;
const separated={display:'grid',gap:'0.75rem'} as const;

function WorkedThinking({example,step}:{example:Example;step:number}){
 if(step===0)return <div style={cards}>{example.analysis.map(([label,value])=><section key={label} className="wcv2-card"><h4>{label}</h4><p>{value}</p></section>)}</div>;
 if(step===1)return <div><p>First thoughts — no labels yet:</p><ul style={cards}>{example.ideas.map(idea=><li key={idea} className="wcv2-card">{idea}</li>)}</ul></div>;
 if(step===2)return <div style={separated}>
  <section className="wcv2-card"><h4>Fits the task</h4><p>{example.fits}</p></section>
  <section className="wcv2-card"><h4>Needs explanation → Repair</h4><p>{example.repair}</p></section>
  <section className="wcv2-card"><h4>Off topic</h4><p>{example.offTopic}</p></section>
 </div>;
 return <div>
  <div style={cards}>
   <section className="wcv2-card"><h4>Idea (from A2)</h4><p>{example.chosen}</p></section>
   <section className="wcv2-card"><h4>Reason (why)</h4><p>{example.reason}</p></section>
   <section className="wcv2-card"><h4>Small example (optional)</h4><p>{example.detail}</p></section>
  </div>
  <p><strong>One possible sentence:</strong> {example.sentence}</p>
  <p className="muted">Idea → reason → example is a planning aid, not a fixed essay template.</p>
 </div>;
}

export function Week2CourseLearn({showVi}:{showVi:boolean}){
 const [step,setStep]=useState(0);
 const [exampleId,setExampleId]=useState<Example['id']>('park');
 const active=EXAMPLES.find(e=>e.id===exampleId)??EXAMPLES[0];
 const current=STEPS[step];
 return <section aria-label="Week 2: how to brainstorm">
  <article className="wcv2-card">
   <h3>How to brainstorm · Four thinking moves</h3>
   <p>Watch the same three examples grow from a task into a clear idea. Begin with Park; compare Museum and Library whenever you want.</p>
   <p className="muted">Step {step+1} of 4</p>
   <nav aria-label="Four thinking moves" style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
    {STEPS.map((s,i)=><button type="button" key={s.title} className={i===step?'primary-button':'secondary-button'} aria-current={i===step?'step':undefined} onClick={()=>setStep(i)}>{s.title}</button>)}
   </nav>
  </article>
  <article className="wcv2-card">
   <h3>{current.title} · What to do</h3>
   <p>{current.instruction}</p>
   {showVi&&<p className="vi-help">{current.vi}</p>}
  </article>
  <section className="wcv2-card" aria-label="Choose a worked example">
   <h3>Follow one example</h3>
   <div role="group" aria-label="Example selection" style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
    {EXAMPLES.map(e=><button type="button" key={e.id} className={e.id===exampleId?'primary-button':'secondary-button'} aria-pressed={e.id===exampleId} onClick={()=>setExampleId(e.id)}>{e.title}</button>)}
   </div>
   <article className="wcv2-card" aria-label="Example task">
    <h4>THE TASK · {active.title}</h4>
    <p>{active.task}</p>
   </article>
   <article className="wcv2-card" aria-label="Worked explanation">
    <h4>HOW THE THINKING WORKS</h4>
    <WorkedThinking example={active} step={step}/>
   </article>
   <details>
    <summary>Compare all three examples at this step</summary>
    <div style={cards}>{EXAMPLES.map(e=><article className="wcv2-card" key={e.id}>
     <h4>{e.title}</h4><p>{e.task}</p><WorkedThinking example={e} step={step}/>
    </article>)}</div>
   </details>
  </section>
  <article className="wcv2-card">
   <h4>Remember</h4><p>{current.takeaway}</p>
   {step===3&&<p><strong>Optional words:</strong> work together · share ideas · learn new skills · feel more confident.</p>}
  </article>
  <nav aria-label="Move through the worked lesson" style={{display:'flex',justifyContent:'space-between',gap:'0.75rem',flexWrap:'wrap'}}>
   <button type="button" className="secondary-button" disabled={step===0} onClick={()=>setStep(x=>Math.max(0,x-1))}>← Previous step</button>
   <button type="button" className="primary-button" disabled={step===3} onClick={()=>setStep(x=>Math.min(3,x+1))}>Next step →</button>
  </nav>
 </section>;
}

export function Week2CourseGuidedIntro({showVi}:{showVi:boolean}){
 const [notes,setNotes]=useState('');
 return <section aria-label="Guided Practice: understand and collect">
  <article className="wcv2-card">
   <h3>G1 · Understand the question</h3>
   <p>Use the same four questions you learned in A1. Here is the task you will practise:</p>
   <blockquote>Your class wants one activity for a rainy afternoon. Choose an activity and give one reason.</blockquote>
   <div style={cards}>{([
    ['Topic','Your class on a rainy afternoon'],
    ['Task','Choose one activity'],
    ['Must include','Give one reason'],
    ['Boundary','An activity your class can do on a rainy afternoon']
   ] as const).map(([label,value])=><div className="wcv2-card" key={label}><h4>{label}</h4><p>{value}</p></div>)}</div>
   {showVi&&<p className="vi-help">Đọc đề: lớp học cần một hoạt động cho buổi chiều mưa, kèm một lý do.</p>}
  </article>
  <article className="wcv2-card">
   <h3>G2 · Collect your own possibilities (optional)</h3>
   <p>Think of activities first. Short notes are fine. Don't judge them yet.</p>
   <label className="field"><span>My first ideas</span><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Your own activity notes..."/></label>
   <p className="muted">This scratchpad is not saved or graded. The four original questions are next.</p>
  </article>
  <h3>G3 · Check relevance · Four original questions</h3>
  <p>Choose an answer, check it, and read the explanation. The original retry rules still apply.</p>
 </section>;
}

export function Week2CourseGuidedBridge({showVi}:{showVi:boolean}){
 const [choice,setChoice]=useState('');
 const [reason,setReason]=useState('');
 const [repair,setRepair]=useState('');
 const [reveal,setReveal]=useState(false);
 return <section aria-label="Guided Practice: explain and repair">
  <article className="wcv2-card">
   <h3>G4 · Explain your own choice</h3>
   <p>For the rainy-afternoon task, think of an activity of your own and say why it is suitable. This is a short planning exercise.</p>
   {showVi&&<p className="vi-help">Chọn một hoạt động do em nghĩ ra và nêu một lý do phù hợp với đề.</p>}
   <label className="field"><span>My activity</span><input type="text" value={choice} onChange={e=>setChoice(e.target.value)} placeholder="One activity..."/></label>
   <label className="field"><span>My reason</span><textarea rows={2} value={reason} onChange={e=>setReason(e.target.value)} placeholder="This activity fits because..."/></label>
   <p className="muted">These short notes are not saved or scored. Main Practice uses a new prompt.</p>
  </article>
  <details className="wcv2-card">
   <summary>Need more practice? Repair an idea that misses the task</summary>
   <p><strong>New task:</strong> A recycling team wants a ten-minute activity visitors can join.</p>
   <p>“Buy more recycling bins” is not a visitor activity. How could you turn it into one?</p>
   <label className="field"><span>My repair</span><textarea rows={2} value={repair} onChange={e=>{setRepair(e.target.value);setReveal(false);}} placeholder="Visitors could..."/></label>
   <button type="button" className="secondary-button" disabled={!repair.trim()} onClick={()=>setReveal(x=>!x)}>{reveal?'Hide example':'Compare after my attempt'}</button>
   {reveal&&<p role="status">One possible repair: run a short sorting game in which visitors put clean paper, metal and plastic into the correct bins.</p>}
  </details>
 </section>;
}

type CourseActions={edit:(key:string,value:string)=>void;confirm:(checked:boolean)=>void;submit:()=>void;go:(screen:WeekScreen)=>void};
type CourseProps={work:WeekWork;busy:boolean;error:string;saved:boolean;showVi:boolean;actions:CourseActions};

export function Week2CourseMain({work,busy,error,saved,showVi,actions}:CourseProps){
 const definition=writingWeek(2);
 const steps=[
  {title:'1 · A2 Collect',help:'Write short after-school activity ideas, one per line. Do not judge them yet.'},
  {title:'2 · A3 Set aside',help:'Choose an idea you will not use. A short reason helps.'},
  {title:'3 · A4 Choose',help:'Pick one suitable activity from your list.'},
  {title:'4 · A4 Explain',help:'Why does your choice answer the prompt? Give a reason; a small example is optional.'}
 ];
 return <section aria-label="Week 2: write your own ideas">
  <article className="wcv2-card">
   <h3>YOUR WRITING TASK</h3>
   <p>{definition.prompt}</p>
   <p><strong>A1 · Understand:</strong> Suggest one after-school activity and give reasons it would be suitable. The answer must be an activity, not a policy change.</p>
   {showVi&&<p className="vi-help">Đề yêu cầu đề xuất một hoạt động sau giờ học và nêu lý do lựa chọn.</p>}
  </article>
  <article className="wcv2-card">
   <h3>YOUR IDEAS · WRITE HERE</h3>
   <p>Use the same four thinking moves you saw in Learn. These are your own notes, not a full essay.</p>
   <div style={separated}>{definition.fields.map((field,i)=><label key={field.key} className="field">
    <strong>{steps[i].title}</strong>
    <span>{field.label} · {field.required?'Required':'Optional'}</span>
    <p className="muted">{steps[i].help}</p>
    <textarea rows={3} name={'week-2-'+field.key} disabled={busy} value={work.fields[field.key]??''} onChange={e=>actions.edit(field.key,e.target.value)} placeholder="Write your own words..."/>
   </label>)}</div>
  </article>
  <article className="wcv2-card">
   <label className="wcv2-option"><input type="checkbox" disabled={busy} checked={work.confirmedOwnWork} onChange={e=>actions.confirm(e.target.checked)}/>I have checked my required parts. This is my own work. A basic check cannot judge meaning or language quality.</label>
   <button type="button" className="primary-button" disabled={busy||!completeWeek(2,work)} onClick={actions.submit}>{saved?'Save completed attempt again':'Save completed attempt & show basic check'}</button>
   <p role="status">{busy?'Saving — please wait.':error?'Save not confirmed. Keep this page open and retry.':saved?'Completed attempt saved.':'Current edits are not a completed saved attempt.'}</p>
   <button type="button" className="secondary-button" disabled={busy} onClick={()=>actions.go('feedback')}>Review my ideas →</button>
  </article>
 </section>;
}

function Week2CourseSelfCheck(){
 const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [aim,setAim]=useState('');
 const questions=[
  'My chosen activity answers the after-school task.',
  'I considered another idea and can explain why I set it aside.',
  'My explanation gives a specific reason for my choice.'
 ];
 return <article className="wcv2-card">
  <h3>CHECK YOUR THINKING</h3>
  <p>Decide for yourself; these answers do not become a score.</p>
  {questions.map((question,i)=><label key={question} className="wcv2-option"><input type="checkbox" checked={!!checks[String(i)]} onChange={e=>setChecks(x=>({...x,[String(i)]:e.target.checked}))}/>{question}</label>)}
  <label className="field"><span>What will I improve?</span><input type="text" value={aim} onChange={e=>setAim(e.target.value)} placeholder="e.g. explain my reason more clearly"/></label>
  <p className="muted">Self-checks are temporary and ungraded. Make changes in Main Practice and save again.</p>
 </article>;
}

export function Week2CourseFeedback({work,busy,error,saved,actions}:CourseProps){
 const definition=writingWeek(2);
 const checks=weekStructureCheck(2,work);
 return <section aria-label="Week 2: review and revise your ideas">
  <article className="wcv2-card">
   <h3>YOUR DRAFT · READ-ONLY</h3>
   <p>Read what you wrote. You are reviewing your own ideas here; use Main Practice to edit them.</p>
   <div style={separated}>{definition.fields.map(field=><section className="wcv2-card" key={field.key}>
    <h4>{field.label}</h4>
    <p style={{whiteSpace:'pre-wrap'}}>{work.fields[field.key]?.trim()||'Not written yet.'}</p>
   </section>)}</div>
  </article>
  <article className="wcv2-card">
   <h3>BASIC COMPLETION CHECK</h3>
   <p>This check only reports present or missing parts. It cannot grade your idea, reasoning, English level or IELTS performance.</p>
   {checks.map(item=><section key={item.label} className="wcv2-card">
    <h4>{item.label} · {item.present?'Present':'Missing'}</h4>
    <p>{item.detail}</p><p><strong>Next action:</strong> {item.nextAction}</p>
   </section>)}
  </article>
  <Week2CourseSelfCheck/>
  {error&&<p role="alert">Your latest save was not confirmed. Return to Main Practice and retry.</p>}
  <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
   <button type="button" className="primary-button" disabled={busy} onClick={()=>actions.go('main')}>Edit my ideas</button>
   <button type="button" className="secondary-button" disabled={busy||!saved} onClick={()=>actions.go('review')}>Continue to Review</button>
  </div>
  <p className="muted">{saved?'Your completed attempt is saved.':'Unsaved edits are not a completed attempt.'} No external AI is used for Week 2.</p>
 </section>;
}

export function Week2CourseTransfer(){
 const [notes,setNotes]=useState({ideas:'',reject:'',best:'',fit:''});
 const fields=[
  ['ideas','Possible activities'],['reject','One I would set aside'],
  ['best','My chosen activity'],['fit','Why it fits']
 ] as const;
 const attempted=Object.values(notes).some(x=>x.trim().length>0);
 return <details className="wcv2-card" aria-label="Optional independent transfer">
  <summary>Try the same four steps with a new task (optional)</summary>
  <article className="wcv2-card"><h3>NEW WRITING TASK</h3><p>A local community centre wants one short Saturday activity for newcomers. What activity should it offer? Explain your choice.</p></article>
  <p>Can you collect, check, choose and explain on a fresh prompt? Try on your own before using the reminder.</p>
  <div style={separated}>{fields.map(([key,label])=><label className="field" key={key}><span>{label}</span>
   <textarea rows={2} value={notes[key]} onChange={e=>setNotes(x=>({...x,[key]:e.target.value}))}/>
  </label>)}</div>
  {attempted?<details><summary>Show the four-step reminder</summary><p>Understand the task → collect possible activities → set one aside → choose one and explain why newcomers can join.</p></details>:<p className="muted">Write at least one note before opening a process reminder.</p>}
  <p className="notice">This optional scratchpad is NOT saved and does not affect course completion, grades or CEFR evidence.</p>
 </details>;
}
