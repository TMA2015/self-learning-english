'use client';
import {useEffect,useState} from 'react';
import type {SeedLesson} from '../domain/academic';
import raw from '../content/vocabulary-knowledge-v23.json';

type Pair={en:string;vi:string};
type Card={id:string;term:string;kind?:string;meaningEn:string;meaningVi:string;exampleEn:string;exampleVi?:string;speech:string[]};
type Recall={id:string;mode:string;accepted:string[]|null;prompt:string;hint:string;model:Pair;criteria:string;vi:string};
type Quick={id:string;prompt:string;key:string;options:{id:string;text:string;feedbackEn:string;feedbackVi:string}[]};
type Notes={goal:Pair;context:Pair;notice:Pair;worked:Pair;diagram?:Pair;groups:{heading:string;cardIds:string[]}[];cards:Card[];deck:{cardId:string;front:string}[];recalls:Recall[];quickChecks:Quick[];transfer:{prompt:Pair;criteria:string;model:Pair}};
const lessons:Record<string,Notes>=raw.lessons;
export function vocabularyKnowledgeV23Available(lesson:SeedLesson,version:string){
 return (version===raw.version||(raw.version==='1.28.0'&&version==='1.28.1'))&&lesson.module==='vocabulary'&&Object.prototype.hasOwnProperty.call(lessons,lesson.id);
}
export function normalizeVocabularyRecall(s:string){
 return s.trim().toLocaleLowerCase('en-GB').replace(/ß/g,'ss').replace(/\s+/g,' ').replace(/[.!?]+$/g,'').trim();
}
function Text({value,showVi}:{value:Pair;showVi:boolean}){
 return <><p className="sle-voc-copy">{value.en}</p>{showVi&&value.vi&&<p className="sle-voc-vi" lang="vi">{value.vi}</p>}</>;
}
function Header({n,en,vi,showVi}:{n:number;en:string;vi:string;showVi:boolean}){
 return <div className="sle-ms-head"><span aria-hidden="true">{n}</span><div><h3>{en}</h3>{showVi&&<p lang="vi">{vi}</p>}</div></div>;
}
function RecallTask({task,showVi,worked}:{task:Recall;showVi:boolean;worked:Pair}){
 const [answer,setAnswer]=useState(''),[revealed,setRevealed]=useState(false),[hint,setHint]=useState(false);
 const match=!!task.accepted?.some(k=>normalizeVocabularyRecall(k)===normalizeVocabularyRecall(answer));
 return <article className="sle-ms-panel sle-voc-task"><label htmlFor={task.id}><strong>{task.prompt}</strong></label>
 <textarea id={task.id} rows={task.accepted?1:3} value={answer} onChange={e=>{setAnswer(e.target.value);setRevealed(false)}}/>
 <div className="sle-ms-controls">{task.hint&&<button type="button" onClick={()=>setHint(x=>!x)} aria-expanded={hint}>Hint</button>}
 <button type="button" onClick={()=>setRevealed(true)} disabled={!answer.trim()||revealed}>{task.accepted?'Check phrase':'Compare with model'}</button>
 <button type="button" onClick={()=>{setAnswer('');setHint(false);setRevealed(false)}}>Try again</button></div>
 {hint&&<p>{task.hint}</p>}{revealed&&<div role="status" className="sle-voc-feedback">
 {task.accepted?<><strong>{match?'Matches the target phrase':'Compare with the target phrase'}</strong><Text value={task.model} showVi={showVi}/></>:<><strong>Self-comparison · no automatic grading</strong>{task.criteria&&<p>{task.criteria}</p>}<Text value={task.model.en?task.model:worked} showVi={showVi}/></>}
 {showVi&&task.vi&&<p lang="vi">{task.vi}</p>}</div>}</article>;
}
function QuickTask({task,showVi}:{task:Quick;showVi:boolean}){
 const [choice,setChoice]=useState<string|null>(null);
 const option=task.options.find(o=>o.id===choice);
 return <fieldset className="sle-ms-panel sle-voc-task"><legend>{task.prompt}</legend>
 <div className="sle-voc-options">{task.options.map(o=><button key={o.id} type="button" aria-pressed={choice===o.id} onClick={()=>setChoice(o.id)}>{o.text}</button>)}</div>
 {option&&<div className="sle-voc-feedback" role="status"><strong>{option.id===task.key?'Correct choice':'Review this choice'}</strong><p>{option.feedbackEn}</p>{showVi&&<p lang="vi">{option.feedbackVi}</p>}</div>}
 {choice&&<button type="button" className="secondary-button" onClick={()=>setChoice(null)}>Try again</button>}</fieldset>;
}
function VocabularyBody({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 const d=lessons[lesson.id];
 const [speechMessage,setSpeechMessage]=useState(''),[index,setIndex]=useState(0),[flipped,setFlipped]=useState(false),[draft,setDraft]=useState(''),[showModel,setShowModel]=useState(false);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel()},[]);
 function speak(text:string){
  if(typeof window==='undefined'||!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){setSpeechMessage('Speech playback is unavailable in this browser. You can still read the example.');return}
  try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';utterance.rate=0.92;utterance.onerror=()=>setSpeechMessage('Speech playback is unavailable or interrupted.');window.speechSynthesis.speak(utterance);setSpeechMessage('');}catch{setSpeechMessage('Speech playback is unavailable.')}
 }
 const speaker=(c:Card,i:number)=><button type="button" className="sle-voc-speaker" aria-label={'Play '+(i===0?'word or phrase: ':'example: ')+c.term} onClick={()=>speak(c.speech[i])}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M3 9v6h4l5 4V5L7 9H3Z"/><path d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/></svg></button>;
 const deck=d.deck[index],card=d.cards.find(c=>c.id===deck.cardId)!;
 const move=(n:number)=>{setIndex((index+n+d.deck.length)%d.deck.length);setFlipped(false)};
 return <section className="sle-ms sle-voc-v23" aria-label="Vocabulary Knowledge v2.3">
 <header className="sle-ms-intro"><div className="sle-ms-kicker">{lesson.id} · VOCABULARY · {lesson.cefr_target}</div><strong>Learning goal</strong><Text value={d.goal} showVi={showVi}/><strong>Context</strong><Text value={d.context} showVi={showVi}/></header>
 <p role="status" className="sle-voc-copy">{speechMessage}</p>
 <section className="sle-ms-section"><Header n={1} en="Words and phrases in context" vi="Từ và cụm từ trong ngữ cảnh" showVi={showVi}/>
 {d.groups.map((g,i)=><section key={i}>{g.heading&&<h4>{g.heading.split(/ \/ | (?=Nơi chốn|Đồ vật|Hỏi lại|Buổi sáng|Học tập|Cụm từ|Họ từ|Mở rộng)/)[0]}{showVi&&<span lang="vi" className="sle-voc-vi">{g.heading.includes(' / ')?' · '+g.heading.split(' / ')[1]:g.heading.replace(g.heading.split(/ (?=Nơi chốn|Đồ vật|Hỏi lại|Buổi sáng|Học tập|Cụm từ|Họ từ|Mở rộng)/)[0],' ·')}</span>}</h4>}<div className="sle-ms-grid sle-voc-grid">{g.cardIds.map(id=>{const c=d.cards.find(x=>x.id===id)!;return <article key={id} className="sle-ms-card sle-voc-card"><h4>{c.term} {speaker(c,0)}</h4>{c.kind&&<small>{c.kind}</small>}<p>{c.meaningEn}</p>{showVi&&<p lang="vi" className="sle-voc-vi">{c.meaningVi}</p>}<p><strong>Example:</strong> {c.exampleEn} {speaker(c,1)}</p>{showVi&&c.exampleVi&&<p lang="vi" className="sle-voc-vi">{c.exampleVi}</p>}</article>})}</div></section>)}
 {d.diagram&&<div className="sle-ms-panel"><Text value={d.diagram} showVi={showVi}/></div>}
 <article className="sle-ms-panel"><strong>Notice</strong><Text value={d.notice} showVi={showVi}/></article></section>
 <section className="sle-ms-section"><Header n={2} en="Worked example" vi="Ví dụ có hướng dẫn" showVi={showVi}/><article className="sle-ms-model"><Text value={d.worked} showVi={showVi}/></article></section>
 <section className="sle-ms-section"><Header n={3} en="Mini flashcards" vi="Thẻ ôn từ" showVi={showVi}/>
 <div className="sle-ms-panel"><p className="sle-ms-kicker">Card {index+1} / {d.deck.length}</p><button className="sle-voc-flip" type="button" aria-pressed={flipped} onClick={()=>setFlipped(v=>!v)}>{flipped?<>{card.meaningEn}<br/>{card.exampleEn}{showVi&&<><br/>{card.meaningVi}{card.exampleVi&&<><br/>{card.exampleVi}</>}</>}</>:deck.front}<small>{flipped?'Show phrase':'Reveal meaning and example'}</small></button>
 <div className="sle-ms-controls"><button type="button" onClick={()=>move(-1)}>Previous</button>{speaker(card,0)}{flipped&&speaker(card,1)}<button type="button" onClick={()=>move(1)}>Next</button></div></div></section>
 <section className="sle-ms-section"><Header n={4} en="Active recall" vi="Tự nhớ không nhìn đáp án" showVi={showVi}/>{d.recalls.map(t=><RecallTask key={t.id} task={t} showVi={showVi} worked={d.worked}/>)}</section>
 <section className="sle-ms-section"><Header n={5} en="Quick self-check" vi="Tự kiểm tra nhanh" showVi={showVi}/>{d.quickChecks.map(t=><QuickTask key={t.id} task={t} showVi={showVi}/>)}</section>
 <section className="sle-ms-section"><Header n={6} en="Use it in a new situation" vi="Vận dụng vào ngữ cảnh mới" showVi={showVi}/><article className="sle-ms-panel"><Text value={d.transfer.prompt} showVi={showVi}/><label htmlFor="sle-voc-transfer">Your response · optional</label><textarea id="sle-voc-transfer" rows={4} value={draft} onChange={e=>{setDraft(e.target.value);setShowModel(false)}}/><strong>Self-check criteria</strong><p className="sle-voc-copy">{d.transfer.criteria}</p><button type="button" className="secondary-button" onClick={()=>setShowModel(x=>!x)} aria-expanded={showModel}>{showModel?'Hide model':'Show model'}</button>{showModel&&<Text value={d.transfer.model} showVi={showVi}/>}</article></section>
 <p className="sle-ms-hint">Optional self-practice only · no score, no submission, no saved learner record. Speech uses the browser’s available voice.</p>
 </section>;
}
export function VocabularyKnowledgeV23({lesson,version,showVi}:{lesson:SeedLesson;version:string;showVi:boolean}){
 if(!vocabularyKnowledgeV23Available(lesson,version))return null;
 return <VocabularyBody key={lesson.id+'@'+version} lesson={lesson} showVi={showVi}/>;
}
