'use client';
import {useState} from 'react';
import type {SeedLesson} from '../domain/academic';
import reviewed from '../content/rwg-depth-pilot-r1.json';

/**
 * Owner-approved SLE Multi-Skill HTML v2 design applied to four specific
 * read-only instructional pilots. Source strategies and models come from
 * the existing NotebookLM-PASS RGW packet. Vocabulary A2 phrase cards reuse
 * the reviewed vocabulary-pilot source; Listening goals reuse the existing
 * lesson's versioned objectives. No graded activities, answer keys, attempts,
 * identity, audio or persistence paths are touched.
 *
 * Exact 1.28.0 pin deliberately prevents leaking new copy into old saved
 * attempts or a future curriculum version without a separate review.
 */
const targeted = new Set(['REA-B1-03','VOC-A2-01','WRI-B1-05','LIS-A2-03']);
export function multiskillKnowledgeV2Available(lesson:SeedLesson,version:string){
 return version==='1.28.0'&&targeted.has(lesson.id);
}
const lessonData=reviewed.lessons;
const vocabulary=[
 {phrase:'make breakfast / make the bed',meaning:'morning preparation and everyday routines',
  example:'On school days, Eva prepares breakfast before her family leaves.',
  contrast:'The verb belongs to the whole phrase, not to a word-for-word translation.'},
 {phrase:'catch / miss the bus',meaning:'get on in time / arrive too late',
  example:'The bus arrived early, so Tom needed to hurry to catch it.',contrast:''},
 {phrase:'take turns / take a break',meaning:'alternate a shared activity / pause to rest',
  example:'At the art club, Maya goes first and Omar goes next: they take turns.',
  contrast:'Take a turn describes one participant’s turn; take turns describes alternating.'},
 {phrase:'wash / do the dishes; set / lay the table',meaning:'accepted ways to describe home chores',
  example:'The family lays the table before eating and washes the dishes afterwards.',
  contrast:'Both wash/do the dishes and set/lay the table can be natural.'},
] as const;
const vocabModel='Ken is preparing ideas for a student council meeting. Should he make a plan or do a plan? Make a plan is the natural phrase. Check the noun together with its verb, not the translation of each word separately.';
const vocabRecall='Close the cards. Recall a phrase for letting people speak one after another in a discussion. Reopen the cards to self-check.';
const vocabTransfer='Your class is preparing a charity stall. Write two short routine sentences with two different chunks; do not copy the examples.';
function Head({n,title,vi,showVi}:{n:number;title:string;vi:string;showVi:boolean}){
 return <div className="sle-ms-head"><span aria-hidden="true">{n}</span><div><h3>{title}</h3>{showVi&&<p lang="vi">{vi}</p>}</div></div>;
}
function Intro({lesson,tag,goal}:{lesson:SeedLesson;tag:string;goal:string}){
 return <header className="sle-ms-intro"><div className="sle-ms-kicker">{lesson.id} · {tag} · {lesson.cefr_target}</div>
  <p className="sle-ms-goal"><strong>Learning goal</strong> {goal}</p></header>;
}
function Reading({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 const data=lessonData['REA-B1-03'];
 const [lens,setLens]=useState<'claim'|'qualification'|'inference'|null>(null);
 const sentences=[
  'A school garden can help pupils learn about plants.',
  'However, rainy days sometimes interrupt outdoor activities.',
  'Teachers may therefore need an indoor backup task.'
 ];
 return <section className="sle-ms sle-ms-reading" aria-label="Reading B1 knowledge">
  <Intro lesson={lesson} tag="READING" goal={data.goal}/>
  <section className="sle-ms-section"><Head n={1} title="Four ways to read with evidence" vi="Bốn cách đọc và tìm bằng chứng" showVi={showVi}/>
   <div className="sle-ms-grid">{data.cards.map((c,i)=><article className="sle-ms-card" key={c.title}>
    <b className="sle-ms-card-index">{['◎','⌕','↗','⇄'][i]}</b><h4>{c.title}</h4><p>{c.body}</p>
   </article>)}</div>
  </section>
  <section className="sle-ms-section"><Head n={2} title="Highlight the evidence" vi="Chọn một phần để xem cách tìm bằng chứng" showVi={showVi}/>
   <div className="sle-ms-panel"><p className="sle-ms-kicker">{data.model.title} · Select a reading lens</p>
    <div className="sle-ms-controls" role="group" aria-label="Evidence lenses">
     {([['claim','Main claim'],['qualification','Qualification'],['inference','Inference']] as const).map(([id,label])=>
      <button type="button" key={id} aria-pressed={lens===id} onClick={()=>setLens(x=>x===id?null:id)}>{label}</button>)}
    </div>
    <p className="sle-ms-passage">
     {sentences.map((s,i)=><span key={i} className={lens===['claim','qualification','inference'][i]?'sle-ms-highlight':''}>{s}{' '}</span>)}
    </p>
    <p className="sle-ms-hint" role="status">{lens==='claim'?'The opening sentence makes the positive claim.':lens==='qualification'?'However introduces a limitation to that claim.':lens==='inference'?'The last sentence gives a possible supported response, not an absolute rule.':'Select a lens to highlight the claim, qualification or possible inference.'}</p>
    <small>Independent model · Not an assessed passage</small>
   </div>
  </section>
  <section className="sle-ms-section"><Head n={3} title="Why this reading is justified" vi="Giải thích suy luận dựa trên bằng chứng" showVi={showVi}/>
   <article className="sle-ms-model"><strong>Model reasoning</strong><p>{data.model.thinking}</p></article>
   <details className="sle-ms-detail"><summary>{data.self_practice.title}</summary><p>{data.self_practice.description}</p><small>Not submitted or graded.</small></details>
  </section>
 </section>;
}
function Vocabulary({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 return <section className="sle-ms sle-ms-vocab" aria-label="Vocabulary A2 knowledge">
  <Intro lesson={lesson} tag="VOCABULARY" goal="Choose natural verb–noun phrases for routines and use one in a new situation."/>
  <p className="sle-ms-context"><strong>Context:</strong> A day includes morning tasks, travel, turns in class and helping at home.</p>
  <section className="sle-ms-section"><Head n={1} title="Learn meaningful phrases, not isolated words" vi="Học theo cụm từ và tình huống" showVi={showVi}/>
   <div className="sle-ms-grid sle-ms-vocab-grid">{vocabulary.map(chunk=><details className="sle-ms-vocab-card" key={chunk.phrase}>
    <summary><strong>{chunk.phrase}</strong><span>{chunk.meaning}</span><small>See usage and example</small></summary>
    <div className="sle-ms-vocab-expand"><p><strong>Example:</strong> {chunk.example}</p>{chunk.contrast&&<p><strong>Notice:</strong> {chunk.contrast}</p>}</div>
   </details>)}</div>
  </section>
  <section className="sle-ms-section"><Head n={2} title="See how to choose a phrase" vi="Ví dụ chọn cụm từ phù hợp" showVi={showVi}/>
   <article className="sle-ms-model"><strong>Worked example</strong><p>{vocabModel}</p></article>
  </section>
  <section className="sle-ms-section"><Head n={3} title="Recall and transfer" vi="Nhớ lại và sử dụng trong ngữ cảnh mới" showVi={showVi}/>
   <div className="sle-ms-grid"><article className="sle-ms-card"><h4>Recall</h4><p>{vocabRecall}</p></article>
    <article className="sle-ms-card"><h4>New situation</h4><p>{vocabTransfer}</p></article></div>
   <p className="sle-ms-hint">Optional self-practice is not submitted, graded or stored.</p>
  </section>
 </section>;
}
function Writing({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 const data=lessonData['WRI-B1-05'];
 const [note,setNote]=useState('');
 const outline=data.model.thinking.split('\n').filter(Boolean);
 return <section className="sle-ms sle-ms-writing" aria-label="Writing B1 knowledge">
  <Intro lesson={lesson} tag="WRITING" goal={data.goal}/>
  <section className="sle-ms-section"><Head n={1} title="Decode the writing task first" vi="Phân tích yêu cầu trước khi viết" showVi={showVi}/>
   <div className="sle-ms-grid">{data.cards.map(c=><article className="sle-ms-card" key={c.title}><h4>{c.title}</h4><p>{c.body}</p></article>)}</div>
  </section>
  <section className="sle-ms-section"><Head n={2} title="Five questions for your brainstorm" vi="Năm câu hỏi để phát triển ý tưởng" showVi={showVi}/>
   <ol className="sle-ms-brainstorm">{data.brainstorm?.map(s=><li key={s}>{s}</li>)}</ol>
  </section>
  <section className="sle-ms-section"><Head n={3} title="From ideas to an outline" vi="Từ ý tưởng đến dàn ý" showVi={showVi}/>
   <article className="sle-ms-model"><strong>{data.model.title}</strong><p>{data.model.situation}</p>
    <div className="sle-ms-outline">{outline.map((line,i)=><p key={i}>{line}</p>)}</div></article>
  </section>
  <section className="sle-ms-section"><Head n={4} title="Try planning an outline" vi="Ghi ý tưởng thử, không chấm điểm và không lưu" showVi={showVi}/>
   <div className="sle-ms-panel"><label htmlFor="sle-ms-writing-note"><strong>Your planning notes · optional</strong></label>
    <textarea id="sle-ms-writing-note" rows={6} value={note} onChange={e=>setNote(e.target.value)}
     placeholder="Position…\nReason 1…\nReason 2…\nSpecific example…\nA possible difficulty…\nConclusion…" />
    <div className="sle-ms-notebar"><small>Only in this open page · no autosave, no upload and no grading.</small>
     <button type="button" className="secondary-button" onClick={()=>setNote('')} disabled={!note}>Clear notes</button></div>
   </div>
   <details className="sle-ms-detail"><summary>{data.self_practice.title}</summary>
    <div className="sle-ms-checklist">{['I can state my position.','My reasons are distinct.','My example supports one reason.','I have addressed a difficulty.','I finish consistently.','I checked the actual task limits.'].map(x=><label key={x}><input type="checkbox"/>{x}</label>)}</div>
    <small>Unscored checklist · no submission.</small>
   </details>
  </section>
 </section>;
}
function Listening({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 const goals=lesson.objectives;
 return <section className="sle-ms sle-ms-listening" aria-label="Listening A2 knowledge">
  <Intro lesson={lesson} tag="LISTENING" goal="Understand the main purpose of a short everyday conversation, identify details and make a supported inference about the final choice."/>
  <div className="sle-ms-panel"><strong>Learning goals</strong><ul>{goals.map(g=><li key={g}>{g}</li>)}</ul></div>
  <p className="sle-ms-listening-notice" role="note"><strong>Audio safeguards:</strong> Full playback is required before scoring.
   If audio is unavailable, Listening remains unassessed. The transcript is not shown before submission.
   Use the actual audio player in the practice stage below; this panel does not simulate audio or scoring.</p>
  <section className="sle-ms-section"><Head n={1} title="A clear listening journey" vi="Quy trình học nghe rõ ràng, từng bước" showVi={showVi}/>
   <div className="sle-ms-grid">{[
    ['Before listening','Read the learning goals and know which kinds of information matter.'],
    ['Listen in full','Play the approved audio; full playback is required before scoring.'],
    ['Answer','Work from what was audible, not from a revealed transcript.'],
    ['Review','Only after submission, examine feedback and the permitted transcript.']
   ].map(([t,b],i)=><article className="sle-ms-card" key={t}><span className="sle-ms-card-index">{i+1}</span><h4>{t}</h4><p>{b}</p></article>)}</div>
  </section>
  <section className="sle-ms-section"><Head n={2} title="What to listen for" vi="Các thông tin cần chú ý khi nghe" showVi={showVi}/>
   <div className="sle-ms-grid">{[
    ['Main purpose','The overall reason for the conversation'],
    ['Useful details','Times, prices, equipment and conditions'],
    ['Final choice','An inference supported by what the speakers say']
   ].map(([t,b])=><article className="sle-ms-card" key={t}><h4>{t}</h4><p>{b}</p></article>)}</div>
  </section>
  <section className="sle-ms-section"><Head n={3} title="Listening player placement" vi="Vị trí trình phát âm thanh" showVi={showVi}/>
   <p className="sle-ms-hint">The real Listening player appears after you start practice. Original playback and scoring safeguards are unchanged.</p>
  </section>
 </section>;
}
export function MultiskillKnowledgeV2({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 if(lesson.id==='REA-B1-03')return <Reading lesson={lesson} showVi={showVi}/>;
 if(lesson.id==='VOC-A2-01')return <Vocabulary lesson={lesson} showVi={showVi}/>;
 if(lesson.id==='WRI-B1-05')return <Writing lesson={lesson} showVi={showVi}/>;
 if(lesson.id==='LIS-A2-03')return <Listening lesson={lesson} showVi={showVi}/>;
 return null;
}
