'use client';
import {useEffect,useState} from 'react';
import {WritingAIReview} from './writing-ai-review';

/**
 * Independent any-topic Writing: local draft and deterministic self-check first,
 * plus optional Gemini feedback for the successfully saved text on explicit click.
 * No grade writes, Foundation attempt changes, or certified CEFR result.
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
  const [savedSignature,setSavedSignature]=useState<string|null>(null);

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

  // Local autosave only. Gemini is never requested on load, edits or save.
  // A matching successful save is required before the optional AI control is enabled.
  useEffect(()=>{
    if(!ready)return;
    try{
      if(!topic&&!writing){
        localStorage.removeItem(DRAFT_KEY);
        setSavedSignature(null);
        return;
      }
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,updatedAt:Date.now()} satisfies Draft));
      setSavedSignature(JSON.stringify([topic,writing]));
      setSaveStatus('Draft saved on this browser only.');
    }catch{
      setSavedSignature(null);
      setSaveStatus('Could not save on this browser. Copy your text before leaving.');
    }
  },[topic,writing,ready]);

  function save():boolean{
    try{
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,updatedAt:Date.now()} satisfies Draft));
      setSavedSignature(JSON.stringify([topic,writing]));
      setSaveStatus('Draft saved on this browser only.');
      return true;
    }catch{
      setSavedSignature(null);
      setSaveStatus('Save failed. Copy your text before leaving.');
      return false;
    }
  }
  function clear(){
    if(!window.confirm('Clear the local Writing Review draft on this browser? This cannot be undone.'))return;
    try{localStorage.removeItem(DRAFT_KEY)}catch{/* In-memory clear remains possible. */}
    setTopic('');setWriting('');setReviewed(null);setSavedSignature(null);
    setSaveStatus('Local draft cleared in this view.');
  }
  const valid=!!topic.trim()&&!!writing.trim();
  const currentReview=reviewed?.topic===topic&&reviewed?.writing===writing?reviewed:null;
  const draftSaved=!!currentReview&&savedSignature===JSON.stringify([topic,writing]);
  const aiEligible=ready&&draftSaved&&writing.trim().length>=8&&writing.length<=7000;
  return <section className="panel any-topic-writing-review" aria-label="Independent Writing Review">
    <div className="page-heading"><div>
      <h1>Writing Draft &amp; Self-Check · Any Topic</h1>
      <p>Write about a topic of your choice, save a draft, check your revision steps and optionally ask Gemini for personal writing feedback. This space is separate from English Writing Coach · 12 Weeks and graded Foundation lessons.</p>
    </div></div>
    <p className="notice"><strong>Your choice:</strong> the self-check is always available without AI. After saving, you may explicitly ask Gemini to review this draft. Gemini feedback is provisional advice, never an official grade or certified CEFR result.</p>
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
      <p><strong>Next revision:</strong> Choose the most important item above, revise the draft yourself, and open the checklist again. The checklist itself does not evaluate or correct your sentences.</p>
      <h3>Optional Gemini Writing feedback</h3>
      {!draftSaved&&<p className="notice">AI review requires a successfully saved copy of this exact draft. Save again after any editing.</p>}
      {writing.length>7000&&<p className="notice">Your full draft is saved. For Gemini feedback, use a shorter draft of up to 7,000 characters. Your longer text remains available for self-review.</p>}
      <WritingAIReview reviewId="any-topic-writing" task={topic} fields={{draft:writing}} kind="draft" enabled={aiEligible}/>
    </section>}
  </section>;
}
