'use client';
import {useState} from 'react';

/** Non-assessed, optional preparation. Nothing here is saved or sent to Gemini. */
export function SpeakingPreparationGuide(){
 const [notes,setNotes]=useState({problem:'',detail:'',request:''});
 const [selfReport,setSelfReport]=useState([false,false,false]);
 const toolkit=[
  ['Start politely','Excuse me. / Could I ask you something?'],
  ['State the problem',"I can't find… / I've forgotten… / I'm not sure where…"],
  ['Give a reason','because… / so…'],
  ['Ask for help','Could you please help me? / Could you show me…?'],
  ['Thank the person','Thank you for your help.']
 ];
 const checks=[
  'I tried to explain my problem clearly.',
  'I tried to make a polite request.',
  'I spoke from keywords rather than reading every word.'
 ];
 return <section className="foundation-learn" aria-label="Speaking preparation: unassessed practice">
  <div className="foundation-learn-block">
   <h3>Speaking · Prepare &amp; Practise</h3>
   <p><strong>Goal:</strong> Prepare ideas and polite expressions, then practise asking for help aloud.</p>
   <p className="muted">This is optional guided preparation, not a speaking test. No microphone, AI or account is required.</p>
  </div>
  <div className="foundation-learn-block">
   <h3>1. Situation</h3>
   <p>You have a small problem at school and need to ask an adult for help. A useful request explains the problem, adds one detail and asks politely.</p>
  </div>
  <div className="foundation-learn-block">
   <h3>2. Language toolkit</h3>
   <div className="gdp-table-scroll" role="region" aria-label="Useful speaking phrases" tabIndex={0}>
    <table><thead><tr><th scope="col">What you want to do</th><th scope="col">Useful English</th></tr></thead><tbody>
     {toolkit.map(([functionName,phrase])=><tr key={functionName}><td>{functionName}</td><td>{phrase}</td></tr>)}
    </tbody></table>
   </div>
   <details className="foundation-vi-help"><summary>Optional idea bank</summary><p>People: teacher, librarian, coach. Information: missing item, time, place. Link ideas with <strong>because</strong>, <strong>so</strong> or <strong>and</strong>.</p></details>
  </div>
  <div className="foundation-learn-block">
   <h3>3. Independent worked model</h3>
   <p><strong>Different situation:</strong> You lost your library card and need to borrow a book.</p>
   <details open><summary>Model response — close before you speak</summary>
    <blockquote>Excuse me, I can't find my library card. I need a book for homework, so could you tell me what to do? Thank you.</blockquote>
    <p><strong>Problem:</strong> I can't find my library card.</p>
    <p><strong>Useful detail:</strong> I need a book for homework.</p>
    <p><strong>Request:</strong> Could you tell me what to do?</p>
   </details>
   <p className="muted">The model explains a communication pattern; it is not an answer to the assessment questions.</p>
  </div>
  <div className="foundation-learn-block">
   <h3>4. Guided keyword planning</h3>
   <p><strong>New situation:</strong> You forgot your sports shoes. Ask the PE teacher what you should do before class.</p>
   {([['problem','Problem'],['detail','One useful detail'],['request','Polite request']] as const).map(([key,label])=>
    <label className="field" key={key}>{label} — keywords only
     <input type="text" maxLength={160} value={notes[key]} onChange={event=>setNotes(previous=>({...previous,[key]:event.target.value}))} placeholder="Write a few words, not a full script"/>
    </label>
   )}
   <p className="muted">These notes stay on this screen only and are not saved, submitted or scored.</p>
  </div>
  <div className="foundation-learn-block">
   <h3>5. Speak aloud without reading</h3>
   <p>Close the model, look only at your keywords and speak for about 20–40 seconds. Include the problem, a useful detail and a polite request. You may practise again.</p>
  </div>
  <div className="foundation-learn-block">
   <h3>6. Self-check (not assessed)</h3>
   {checks.map((text,index)=><label key={text} className="foundation-option">
    <input type="checkbox" checked={selfReport[index]} onChange={event=>setSelfReport(previous=>previous.map((value,i)=>i===index?event.target.checked:value))}/>
    {text}
   </label>)}
   {selfReport.some(Boolean)&&<p role="status">Self-Reported Practice (this screen only). This is <strong>not</strong> a speaking score. Pronunciation, fluency and CEFR level have not been assessed.</p>}
   <p className="muted">Tip: A good request says what is wrong, adds one useful detail and asks for help. If you wrote a script, reduce it to three keywords and try again.</p>
  </div>
 </section>;
}
