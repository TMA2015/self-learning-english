'use client';
import {useEffect,useState} from 'react';
import {WritingAIReview} from './writing-ai-review';
import {CEFR_WRITING_LEVELS,normalizeWritingStudioReference,type WritingStudioReference,type CEFRWritingLevel} from '../domain/writing-studio-reference';

/**
 * Independent any-topic Writing: local draft and deterministic self-check first,
 * plus optional Gemini feedback for the successfully saved text on explicit click.
 * Practice writing scores stay in the local feedback cache; no Foundation grade writes or learner-level certification.
 */
const DRAFT_KEY='g-learning:english:any-topic-writing:draft:v1';
const ANY_TOPIC_AI_CACHE_PREFIX='g-learning:english:ai-feedback:v1:any-topic-writing:';

/** Clear only the Any Topic draft and its optional Gemini feedback.
 * Never delete Foundation Writing or other skills' feedback. */
export function clearAnyTopicBrowserData(storage:Pick<Storage,'length'|'key'|'removeItem'>):void{
 const feedbackKeys:string[]=[];
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(key?.startsWith(ANY_TOPIC_AI_CACHE_PREFIX))feedbackKeys.push(key);
 }
 storage.removeItem(DRAFT_KEY);
 for(const key of feedbackKeys)storage.removeItem(key);
}
type Draft={topic:string;writing:string;updatedAt:number;reference?:WritingStudioReference};
type Snapshot=Draft;
export function AnyTopicWritingReview({showVi=false}:{showVi?:boolean}){
  const [topic,setTopic]=useState('');
  const [writing,setWriting]=useState('');
  const [reference,setReference]=useState<WritingStudioReference>({kind:'general'});
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
          setReference(normalizeWritingStudioReference(parsed.reference));
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
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,reference,updatedAt:Date.now()} satisfies Draft));
      setSavedSignature(JSON.stringify([topic,writing]));
      setSaveStatus('Draft saved on this browser only.');
    }catch{
      setSavedSignature(null);
      setSaveStatus('Could not save on this browser. Copy your text before leaving.');
    }
  },[topic,writing,reference,ready]);

  function save():boolean{
    try{
      localStorage.setItem(DRAFT_KEY,JSON.stringify({topic,writing,reference,updatedAt:Date.now()} satisfies Draft));
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
    if(!window.confirm('Delete the Any Topic draft and its cached Gemini feedback from this browser? Other course records remain. This cannot be undone.'))return;
    let cleared=true;
    try{clearAnyTopicBrowserData(localStorage)}catch{cleared=false}
    setTopic('');setWriting('');setReference({kind:'general'});setReviewed(null);setSavedSignature(null);
    setSaveStatus(cleared
      ?'Any Topic draft and its Gemini feedback cleared from this browser.'
      :'Draft cleared from this view, but some browser data could not be deleted. Clear site data in browser settings.');
  }
  const valid=!!topic.trim()&&!!writing.trim();
  const currentReview=reviewed?.topic===topic&&reviewed?.writing===writing?reviewed:null;
  const draftSaved=!!currentReview&&savedSignature===JSON.stringify([topic,writing]);
  const aiEligible=ready&&draftSaved&&writing.trim().length>=8&&writing.length<=7000;
  return <section className="panel any-topic-writing-review" aria-label="Independent Writing Review">
    <div className="page-heading"><div>
      <h1>Writing Studio · Any Topic</h1>
      <p>Write about a topic of your choice, save a draft locally, and ask AI Tutor for personal Writing feedback when you choose. This workspace is separate from Foundation Writing and the independent Writing skill catalog; this feedback does not change assessment records.</p>
    </div></div>
    <p className="notice"><strong>Your choice:</strong> Save and revise locally without AI. After saving, you may explicitly ask Gemini to review this draft through AI Tutor. Feedback includes a project-defined writing practice score (six criteria, 0–5 each), never an official exam score or certified CEFR result.</p>
    <div className="learning-choices" role="group" aria-label="Writing Studio reference">
      <label className="field" htmlFor="writing-studio-framework">
        <span>Feedback reference</span>
        <select id="writing-studio-framework" value={reference.kind} onChange={event=>
          setReference(event.target.value==='cefr'?{kind:'cefr',level:'B1'}:{kind:'general'})}>
          <option value="general">General Writing (no level)</option>
          <option value="cefr">CEFR — selected practice target</option>
        </select>
      </label>
      {reference.kind==='cefr'&&<label className="field" htmlFor="writing-studio-cefr-level">
        <span>Target CEFR level</span>
        <select id="writing-studio-cefr-level" value={reference.level} onChange={event=>
          setReference({kind:'cefr',level:event.target.value as CEFRWritingLevel})}>
          {CEFR_WRITING_LEVELS.map(level=><option value={level} key={level}>{level}</option>)}
        </select>
      </label>}
    </div>
    <p className="muted">{reference.kind==='cefr'?
      'CEFR '+reference.level+' sets the writing expectations for six 0–5 criterion scores and a total /30. This does not assess your personal CEFR level.':
      'General Writing scores this response against the task and genre on the same six criteria, without a CEFR target.'}</p>
    <form onSubmit={event=>{
      event.preventDefault();
      if(!valid)return;
      // Open Writing AI Tutor only after this exact draft is saved.
      if(save())setReviewed({topic,writing,updatedAt:Date.now()});
      else setReviewed(null);
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
      <p className="muted">Saved only in this browser, not synchronized across devices. On a shared computer, other browser users may see this draft and cached Gemini feedback. Clear local draft also deletes this workspace’s cached AI responses; it does not delete other course records.</p>
      <div className="learning-choices">
        <button className="primary-button" type="submit" disabled={!ready||!valid}>Save &amp; open AI Tutor</button>
        <button className="secondary-button" type="button" disabled={!ready} onClick={save}>Save draft</button>
        <button className="secondary-button" type="button" disabled={!ready} onClick={clear}>Clear local draft</button>
      </div>
    </form>
    {currentReview&&<section className="panel" aria-label="AI Tutor writing review" aria-live="polite">
      <h2>AI Tutor · Writing Review</h2>
      {!draftSaved&&<p className="notice">AI review requires a successfully saved copy of this exact draft. Save again after any editing.</p>}
      {writing.length>7000&&<p className="notice">Your full draft is saved. For Gemini feedback, use a shorter draft of up to 7,000 characters. Your longer text remains available for self-review.</p>}
      <WritingAIReview reviewId="any-topic-writing" task={topic} fields={{draft:writing}} kind="draft" enabled={aiEligible} reviewMode="any-topic" reference={reference} responseLanguage={showVi ? 'vi' : 'en'}/>
    </section>}
  </section>;
}
