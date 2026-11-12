'use client';
import {useEffect,useState} from 'react';

/**
 * Issue #131: independent, local-only any-topic Writing Review shell.
 * This does NOT contact any AI provider, issue a grade, modify Foundation attempts,
 * or claim a CEFR result. A later authorized provider integration is a separate gate.
 */
const DRAFT_KEY='g-learning:english:any-topic-writing:draft:v1';
type Draft={topic:string;writing:string;updatedAt:number};
type Snapshot=Draft&{words:number;paragraphs:number};

function words(value:string):number{
  const trimmed=value.trim();
  return trimmed?trimmed.split(/\s+/u).length:0;
}
export function AnyTopicWritingReview(){
  const [topic,setTopic]=useState('');
  const [writing,setWriting]=useState('');
  const [ready,setReady]=useState(false);
  const [saveStatus,setSaveStatus]=useState('Loading browser draft…');
  const [reviewed,setReviewed]=useState<Snapshot|null>(null);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(DRAFT_KEY);
      if(raw){
        const parsed=JSON.parse(raw) as Partial<Draft>;
        if(typeof parsed.topic==='string'&&typeof parsed.writing==='string'){
          setTopic(parsed.topic.slice(0,2000));
          setWriting(parsed.writing.slice(0,20000));
          setSaveStatus('Previous draft restored from this browser.');
        }else setSaveStatus('No usable saved draft. Start a new one.');
      }else setSaveStatus('No saved draft on this browser.');
    }catch{
      setSaveStatus('Browser draft storage is unavailable. Copy your text before leaving.');
    }finally{setReady(true)}
  },[]);

  // Local autosave only. No network call, remote SDK, account history write,
  // AI request, or alteration of existing graded attempts.
  useEffect(()=>{
    if(!ready)return;
    try{
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,updatedAt:Date.now()} satisfies Draft));
      setSaveStatus('Draft saved on this browser only.');
    }catch{
      setSaveStatus('Could not save on this browser. Copy your text before leaving.');
    }
  },[topic,writing,ready]);

  function save(){
    try{
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,updatedAt:Date.now()} satisfies Draft));
      setSaveStatus('Draft saved on this browser only.');
    }catch{setSaveStatus('Save failed. Copy your text before leaving.')}
  }
  function clear(){
    if(!window.confirm('Clear the local Writing Review draft on this browser? This cannot be undone.'))return;
    try{localStorage.removeItem(DRAFT_KEY)}catch{/* In-memory clear remains possible. */}
    setTopic('');setWriting('');setReviewed(null);
    setSaveStatus('Local draft cleared in this view.');
  }
  const valid=!!topic.trim()&&!!writing.trim();
  const currentReview=reviewed?.topic===topic&&reviewed?.writing===writing?reviewed:null;
  return <section className="panel any-topic-writing-review" aria-label="Independent Writing Review">
    <div className="page-heading"><div>
      <h1>Writing Draft &amp; Self-Check · Any Topic</h1>
      <p>Write about a topic of your choice, save a draft and check your own revision steps. This space is separate from English Writing Coach · 12 Weeks and graded Foundation lessons. No AI or teacher analyses the text you enter here.</p>
    </div></div>
    <p className="notice"><strong>Static self-check only:</strong> no AI submission or automatic scoring is enabled. These general questions are the same for every draft. They do not assess your specific ideas, correct grammar, or provide a CEFR judgment.</p>
    <form onSubmit={event=>{
      event.preventDefault();
      if(!valid)return;
      setReviewed({topic,writing,updatedAt:Date.now(),words:words(writing),
        paragraphs:writing.trim().split(/\n\s*\n/u).filter(Boolean).length});
      save();
    }}>
      <label className="field" htmlFor="any-topic-writing-topic">Writing topic <span aria-hidden="true">*</span>
        <textarea id="any-topic-writing-topic" name="writing-topic" rows={3} required
          maxLength={2000} value={topic} onChange={e=>setTopic(e.target.value)}
          placeholder="Paste the complete task or write your own topic."/>
      </label>
      <label className="field" htmlFor="any-topic-writing-content">Your writing <span aria-hidden="true">*</span>
        <textarea id="any-topic-writing-content" name="student-written-content" rows={12} required
          maxLength={20000} value={writing} onChange={e=>setWriting(e.target.value)}
          placeholder="Write your own response here."/>
      </label>
      <p role="status" aria-live="polite">{saveStatus}</p>
      <p className="muted">Saved only in this browser, not synchronized across devices. On a shared computer, other browser users may see this draft. You can clear it at any time.</p>
      <div className="learning-choices">
        <button className="primary-button" type="submit" disabled={!ready||!valid}>Open self-review checklist</button>
        <button className="secondary-button" type="button" disabled={!ready} onClick={save}>Save draft</button>
        <button className="secondary-button" type="button" disabled={!ready} onClick={clear}>Clear local draft</button>
      </div>
    </form>
    {currentReview&&<section className="panel" aria-label="Provisional self-review checklist" aria-live="polite">
      <h2>Self-revision checklist · not individual feedback</h2>
      <p>Your draft has {currentReview.words} words across {currentReview.paragraphs} text block(s). These counts describe length only; they do not measure writing quality or CEFR proficiency.</p>
      <ol>
        <li><strong>Task response:</strong> Re-read your exact topic. Underline the task verb and check whether every required part is addressed.</li>
        <li><strong>Ideas:</strong> Identify your main point and at least one specific supporting reason or example. Add evidence if needed.</li>
        <li><strong>Organization:</strong> Check the order of ideas, paragraph breaks and whether the conclusion follows from the response.</li>
        <li><strong>Language:</strong> Read each sentence aloud and check verb forms, agreement, word choice, punctuation and unclear references.</li>
      </ol>
      <p><strong>Next revision:</strong> Choose the most important item above, revise the draft yourself, and open the checklist again. Your sentences have not been evaluated or corrected by AI or a teacher.</p>
    </section>}
  </section>;
}
