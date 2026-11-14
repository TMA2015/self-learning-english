'use client';

import {useState} from 'react';
import type {WeekWork} from '../domain/writing-course-v2-b';
import {Week2IdeaMap} from './writing-week2-idea-map';
import {addWeek2Idea, editWeek2Idea, moveWeek2Idea, readIdeaLines, removeWeek2Idea} from '../domain/writing-week2-interactive';

const ART_PROMPT = 'A community art exhibition wants one weekend activity that helps visitors join in.';
const ART_CARDS = [
  {
    text: 'Visitors add a small drawing to a shared mural',
    expected: 'Fits',
    why: 'Visitors can directly take part by adding a drawing to a shared artwork.'
  },
  {
    text: 'Print a larger map of the building entrance',
    expected: 'Needs explanation',
    why: 'A map could help visitors find the entrance, but it is not yet clearly an activity in which visitors participate.'
  },
  {
    text: 'Change the price of school lunches',
    expected: 'Off topic',
    why: 'School lunch prices do not answer a community exhibition request.'
  },
  {
    text: 'Invite visitors to help choose a theme for a community collage',
    expected: 'Fits',
    why: 'Visitors join in by choosing the theme for a shared art project.'
  }
] as const;

const SORT_CHOICES = ['Fits', 'Needs explanation', 'Off topic'] as const;

export function Week2InteractiveLearn() {
  return <section className="wcv2-card" aria-label="Brainstorming strategy and demonstration">
    <h3>Brainstorm first; judge second</h3>
    <p>Collect several possible answers before choosing the strongest. Do not dismiss an idea just because it needs a little explanation. Your final choice must still answer the actual task.</p>
    <h4>1. Read the task in four parts</h4>
    <ul>
      <li><strong>Topic:</strong> What situation or subject is discussed?</li>
      <li><strong>Task:</strong> Must you suggest, explain, compare, or give an opinion?</li>
      <li><strong>Must include:</strong> What reasons, details, or examples are required?</li>
      <li><strong>Boundary:</strong> What audience, place, time, or purpose limits your answer?</li>
    </ul>
    <h4>2. Generate before evaluating</h4>
    <p>Write a few possible activities or answers as short phrases. A vocabulary list may help you find words, but isolated words are not yet complete ideas.</p>
    <h4>3. Filter, repair and choose</h4>
    <p>Ask: Does the idea answer the task? Can I give a clear reason? Could a nearly relevant idea be revised? Several different choices can be valid.</p>
    <h4>4. Make a one-line bridge</h4>
    <p>Selected idea → one reason → one concrete detail. Later weeks will develop reasons, examples, and a complete outline.</p>
    <details>
      <summary>Worked example: how to think through a new task</summary>
      <p><strong>Different practice prompt:</strong> A neighbourhood park wants to run one weekend activity for local families. Recommend an activity and explain why it suits families.</p>
      <ol>
        <li><strong>Analyse:</strong> Suggest a weekend park activity; it must suit local families, and I must explain why.</li>
        <li><strong>Generate:</strong> Outdoor treasure hunt; family nature walk; picnic games; repaint nearby road signs; short child-friendly litter-pick.</li>
        <li><strong>Filter:</strong> A walk and treasure hunt fit. Road-sign painting does not fit as stated. A litter-pick might become suitable if it is safe, short, and has family roles.</li>
        <li><strong>Choose:</strong> A family nature walk: adults and children can explore together at different walking speeds.</li>
        <li><strong>Add a detail:</strong> Give families a simple picture checklist for spotting leaves or birds.</li>
      </ol>
      <p>Another well-supported family activity could work. The reasoning, not a particular model answer, is what you should learn.</p>
    </details>
    <p><strong>Common mistakes:</strong> Choosing an unrelated but interesting topic; listing only vocabulary; never comparing alternatives; repeating a choice as its own reason.</p>
  </section>;
}

export function Week2PracticeSort() {
  const [answers,setAnswers] = useState<Record<number,string>>({});
  const [revealed,setRevealed] = useState(false);
  return <section className="wcv2-card" aria-label="Unscored community art idea sorting">
    <h3>Optional activity · Sort the ideas</h3>
    <p><strong>Different practice prompt:</strong> {ART_PROMPT}</p>
    <p>Choose where each idea belongs: Fits, Needs explanation, or Off topic. This is exploratory practice, not a graded test. Different interpretations can be defended with reasons.</p>
    {ART_CARDS.map((card,i)=><div key={card.text} className="wcv2-card">
      <label className="field">
        <span>{i+1}. {card.text}</span>
        <select value={answers[i]??''} onChange={e=>{setAnswers(a=>({...a,[i]:e.target.value}));setRevealed(false);}}>
          <option value="">Choose a category</option>
          {SORT_CHOICES.map(choice=><option key={choice} value={choice}>{choice}</option>)}
        </select>
      </label>
      {revealed&&<div role="status">
        <p><strong>One defensible reading: {card.expected}.</strong> {card.why}</p>
        <p>Your choice: {answers[i]||'Not selected'}. A different answer needs a task-grounded explanation; this activity does not award a score.</p>
      </div>}
    </div>)}
    <button type="button" className="secondary-button" onClick={()=>setRevealed(value=>!value)}>{revealed?'Hide explanations':'Compare with reviewed explanations'}</button>
  </section>;
}

function Week2IdeaEditor({idea,onSave,disabled,index}:{idea:string;onSave:(value:string)=>void;disabled:boolean;index:number}) {
  const [draft,setDraft]=useState(idea);
  return <div>
    <label className="field"><span>Idea {index+1}</span>
      <input type="text" value={draft} disabled={disabled} onChange={e=>setDraft(e.target.value)} aria-label={`Edit idea ${index+1}`}/>
    </label>
    <button type="button" disabled={disabled||!draft.trim()||draft.trim()===idea||/[\r\n]/.test(draft)} onClick={()=>onSave(draft.trim())}>Apply edit</button>
  </div>;
}

type MainProps = {work:WeekWork; onEdit:(key:string,value:string)=>void; disabled:boolean};

export function Week2IdeaWorkspace({work,onEdit,disabled}:MainProps) {
  const ideas = work.fields.ideas??'';
  const parsed = readIdeaLines(ideas);
  const [newIdea,setNewIdea] = useState('');
  const [message,setMessage] = useState('');
  // Optional, non-graded reflection labels. Never stored as proficiency evidence.
  const [sessionLabels,setSessionLabels] = useState<Record<string,string>>({});
  function apply(change:()=>string, description:string) {
    try {
      onEdit('ideas',change());
      setMessage(description+' Draft changed; follow the usual save/submit status.');
    } catch (error) {
      setMessage(error instanceof Error?error.message:'Could not change this idea.');
    }
  }
  return <section className="wcv2-card" aria-label="Interactive brainstorming workspace">
    <h3>Build your own idea bank</h3>
    <p>First read the Main Practice prompt above. Check it using these questions: <strong>Topic</strong> — what is it about? <strong>Task</strong> — what must I suggest? <strong>Must include</strong> — what explanation is requested? <strong>Boundary</strong> — where, when, or for whom must the idea work?</p>
    <p>Generate a few ideas before choosing one. Two to four ideas are a suggestion, not a requirement. The original four text fields below remain your saved work.</p>
    <p><strong>Use the map while you think:</strong> Add an idea below and watch it appear here. Compare options before choosing; the map does not choose or grade for you.</p>
    <Week2IdeaMap work={work} ideas={parsed.safe?parsed.lines:null}
      provisionalLabels={sessionLabels} disabled={disabled}
      onSelect={idea=>{onEdit('best',idea);setMessage('Main idea selected from the map. Add your explanation below.');}} />
    {parsed.safe ? <ol>
      {parsed.lines.map((idea,i)=><li key={i}>
        <Week2IdeaEditor key={`edit-${i}:${idea}`} idea={idea} index={i} disabled={disabled} onSave={value=>apply(()=>editWeek2Idea(ideas,i,value),'Idea edited')}/>
        <label className="field"><span>My provisional judgement (this visit only, not saved)</span>
          <select disabled={disabled} aria-label={`My tentative classification for idea ${i+1}`} value={sessionLabels[idea]??''}
            onChange={e=>setSessionLabels(v=>({...v,[idea]:e.target.value}))}>
            <option value="">Not classified</option>
            <option value="Promising">Promising</option>
            <option value="Needs explanation">Needs explanation</option>
            <option value="Maybe off topic">Maybe off topic</option>
          </select>
        </label>
        <div className="learning-choices">
          <button type="button" disabled={disabled||i===0} onClick={()=>apply(()=>moveWeek2Idea(ideas,i,-1),'Idea moved up')}>Move up</button>
          <button type="button" disabled={disabled||i===parsed.lines.length-1} onClick={()=>apply(()=>moveWeek2Idea(ideas,i,1),'Idea moved down')}>Move down</button>
          <button type="button" disabled={disabled} onClick={()=>{onEdit('best',idea);setMessage('Main idea selected. Explain why it fits in the field below.');}}>Choose as best</button>
          <button type="button" disabled={disabled} onClick={()=>apply(()=>removeWeek2Idea(ideas,i),'Idea removed')}>Remove</button>
        </div>
      </li>)}
    </ol> : <p className="notice" role="status">This draft has complex or historical formatting. It is preserved exactly in the original “My possible ideas” text field below; automatic card rewriting is disabled. You can still append a new idea or edit your original notes there.</p>}
    <label className="field">
      <span>Another possible idea</span>
      <input value={newIdea} disabled={disabled} onChange={e=>setNewIdea(e.target.value)} placeholder="Write one short activity idea" />
    </label>
    <button type="button" className="secondary-button" disabled={disabled||!newIdea.trim()||/[\r\n]/.test(newIdea)} onClick={()=>{
      apply(()=>addWeek2Idea(ideas,newIdea),'Idea added');
      setNewIdea('');
    }}>Add idea card</button>
    <p role="status" aria-live="polite">{message}</p>
    <p><strong>Filter:</strong> Which idea is unrelated or needs to change? Record the idea and why in “One idea I will reject”. <strong>Select:</strong> Choose the best idea and explain its fit using the existing fields below.</p>
    <details><summary>Process coach · What can I try next?</summary>
      <ul>
        {parsed.safe&&parsed.lines.length<2&&<li>Could you think of another possible activity before deciding? Two ideas are a suggestion, not a requirement.</li>}
        {!work.fields.reject?.trim()&&<li>After comparing ideas, identify one weaker option and explain your decision.</li>}
        {!work.fields.best?.trim()&&<li>Choose an idea that you can support with at least one clear reason.</li>}
        {!work.fields.fit?.trim()&&<li>Write a short explanation of how your selected idea meets the task.</li>}
        <li>Check relevance yourself: the software cannot infer whether an original idea is genuinely on topic from its length or a label.</li>
      </ul>
    </details>
    {work.fields.best&&<p><strong>Current selected idea:</strong> {work.fields.best}</p>}
    {work.fields.best?.trim()&&parsed.safe&&parsed.lines.length>0&&!parsed.lines.some(idea=>idea.trim().toLocaleLowerCase()===work.fields.best.trim().toLocaleLowerCase())&&
      <p className="notice" role="status">Your selected idea does not exactly match a current idea card. You may have expanded its wording, or changed the cards after selecting. Check that your choice and its reason still fit the task. Your saved selection has not been changed automatically.</p>}
    <details><summary>Self-check before submitting</summary><ul>
      <li>Did I name at least one actual activity, not only isolated words?</li>
      <li>Did I compare an alternative, if I could think of one?</li>
      <li>Can I explain why I rejected or revised a weaker idea?</li>
      <li>Does my selected idea answer this precise task?</li>
    </ul><p>These questions guide you; they do not automatically score the meaning of your notes.</p></details>
  </section>;
}

export function Week2SavedVersionComparison({work}: {work:WeekWork}) {
  const history = work.history??[];
  const [left,setLeft] = useState<number|null>(null);
  const [right,setRight] = useState<number|null>(null);
  const [reflection,setReflection] = useState('');
  if (!history.length) return <p className="notice">There are no completed saved versions to compare yet.</p>;
  if (history.length===1) return <section className="wcv2-card" aria-label="Prepare a second saved version">
    <h3>One saved version so far</h3>
    <p>Your first completed version is preserved. Review a weaker part, revise the original answer fields, then save another completed attempt to compare two real versions.</p>
    <p>Comparison requires two completed saves. No second version is invented from an unsaved draft.</p>
  </section>;
  const validLeft = Math.min(Math.max(left??history.length-2,0),history.length-1);
  const validRight = Math.min(Math.max(right??history.length-1,0),history.length-1);
  const fields = [['ideas','Possible ideas'],['reject','Rejected idea and reason'],['best','Best idea'],['fit','Why this idea fits']] as const;
  const changedFields = fields.filter(([key])=>history[validLeft].fields[key]!==history[validRight].fields[key]).map(([,label])=>label);
  const view = (index:number) => <article className="wcv2-card">
    <h4>Saved version {index+1}</h4>
    {fields.map(([key,label])=><p key={key}><strong>{label}:</strong> <span style={{whiteSpace:'pre-wrap'}}>{history[index].fields[key]||'—'}</span></p>)}
  </article>;
  return <section className="wcv2-card" aria-label="Compare saved Week 2 versions">
    <h3>Compare your own saved versions</h3>
    <p>Past submissions are read-only. Comparing a version does not rewrite history or assign a Writing grade.</p>
    <div className="wcv2-grid">
      <label className="field"><span>Earlier version</span><select value={validLeft} onChange={e=>{setLeft(Number(e.target.value));setReflection('');}}>{history.map((_,i)=><option key={i} value={i}>Version {i+1}</option>)}</select></label>
      <label className="field"><span>Later version</span><select value={validRight} onChange={e=>{setRight(Number(e.target.value));setReflection('');}}>{history.map((_,i)=><option key={i} value={i}>Version {i+1}</option>)}</select></label>
    </div>
    <div className="wcv2-grid">{view(validLeft)}{view(validRight)}</div>
    <p role="status"><strong>Changed sections:</strong> {changedFields.length?changedFields.join(' · '):'No text changes between these versions.'}</p>
    <p><strong>Think beyond the text difference:</strong> Which change makes the answer more relevant, clearer or easier to explain? A changed word is not automatically an improvement.</p>
    <label className="field"><span>My explanation of one improvement (optional, unsaved reflection)</span>
      <textarea rows={2} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="I changed ... because it now answers the task more clearly by ..."/>
    </label>
    <p className="muted">The comparison shows factual changes only. Your written judgement is not saved or graded. If the change did not help, return to your Main Practice notes and revise again.</p>
  </section>;
}

export function Week2TransferPractice() {
  const [candidates,setCandidates] = useState('');
  const [chosen,setChosen] = useState('');
  const [reason,setReason] = useState('');
  const [showHints,setShowHints] = useState(false);
  const [selfChecks,setSelfChecks] = useState<Record<string,boolean>>({});
  const attempted=Boolean(candidates.trim()&&chosen.trim()&&reason.trim());
  const checkItems=[
    ['activity','I described an actual activity rather than a general change.'],
    ['place','It makes sense at a community centre on Saturday.'],
    ['people','It helps newcomers participate, not only watch others.'],
    ['explain','My reason explains how or why it suits newcomers.']
  ] as const;
  return <section className="wcv2-card" aria-label="Optional independent transfer">
    <h3>Optional independent transfer · New situation</h3>
    <p>A local community centre would like one short Saturday activity for newcomers. Suggest an activity and explain why it helps newcomers take part.</p>
    <p><strong>Try independently first:</strong> Analyse the task, generate alternatives, select an idea and justify your choice without copying the earlier examples.</p>
    <p>Try two ideas, select one, and add a short reason. This is unscored self-practice. <strong>These optional scratchpad notes are not saved</strong>; use your own notebook if you want to keep them.</p>
    <label className="field"><span>Two possible activities</span><textarea rows={3} value={candidates} onChange={e=>{setCandidates(e.target.value);setShowHints(false);}}/></label>
    <label className="field"><span>My selected activity</span><textarea rows={2} value={chosen} onChange={e=>{setChosen(e.target.value);setShowHints(false);}}/></label>
    <label className="field"><span>Why it helps newcomers take part</span><textarea rows={2} value={reason} onChange={e=>{setReason(e.target.value);setShowHints(false);}}/></label>
    <button type="button" className="secondary-button" disabled={!attempted} onClick={()=>setShowHints(v=>!v)}>
      {showHints?'Hide optional process help':'Check my process after attempting'}
    </button>
    {showHints&&<div className="notice" role="status"><p>Consider the <strong>audience</strong> (newcomers), the <strong>setting</strong> (Saturday, community centre), and what participants will <strong>do</strong>. Can you name one concrete reason that connects your idea to their participation?</p>
    <p>This is a process reminder, not an answer key. Several activities can fit.</p></div>}
    <fieldset className="w2-reflection-choice"><legend>My own transfer checklist (self-reported, not scored)</legend>
      {checkItems.map(([key,label])=><label className="wcv2-option" key={key}>
        <input type="checkbox" checked={!!selfChecks[key]} onChange={e=>setSelfChecks(prev=>({...prev,[key]:e.target.checked}))}/>{label}
      </label>)}
    </fieldset>
    <p className="muted">Checking a box does not prove mastery. If you need support, return to the Learn or Guided Practice steps, then try another new task later.</p>
  </section>;
}
