"use client";
import {useEffect,useRef,useState} from 'react';
import {Sparkles,X} from 'lucide-react';
import {TeachingBlocks} from './teaching-blocks';
import {LatestTutorRequest} from '../domain/tutor-request-gate';
import {explainEnglishLessonAI} from '../infrastructure/browser/firebase-ai-browser';

const starters=[
 ['Explain simply','Explain this idea more simply. Use a short example.'],
 ['Another example','Give me one new example about this lesson, with a brief explanation.'],
 ['Why is it useful?','Why is this English skill useful in real life?'],
 ['Key points','What are the three key things I should remember?'],
] as const;

/* Mirrors the Math tutor's knowledge-page-only policy: no assessment,
 * quiz, Diagnostic or unsubmitted learner answers are sent to Gemini. */
export function EnglishLessonTutor({lesson,focus}:{lesson:string;focus?:string}){
 const [open,setOpen]=useState(false),[question,setQuestion]=useState('');
 const [answer,setAnswer]=useState(''),[error,setError]=useState('');
 const [model,setModel]=useState(''),[pending,setPending]=useState(false);
 const requestGate=useRef(new LatestTutorRequest());
 useEffect(()=>{
   requestGate.current.invalidate();
   setOpen(false);setQuestion('');setAnswer('');setError('');setModel('');setPending(false);
   return ()=>{requestGate.current.invalidate()};
 },[lesson]);
 async function ask(prompt:string){
   if(!prompt.trim()||pending)return;
   const ticket=requestGate.current.begin();
   setPending(true);setAnswer('');setError('');setModel('');
   // Lesson notes are passed explicitly from knowledge-only screens.
   // Never read arbitrary DOM selection, draft text or a hidden quiz answer.
   const safeFocus=(focus?.trim()||lesson).slice(0,1800);
   try{
     const result=await explainEnglishLessonAI({lesson,focus:safeFocus,question:prompt});
     if(!requestGate.current.isCurrent(ticket))return;
     if(result.status==='answered'){setAnswer(result.text);setModel(result.model)}
     else{setError(result.reason)}
   }catch{
     if(requestGate.current.isCurrent(ticket))setError('Gemini could not complete this request. Please try again.');
   }finally{
     if(requestGate.current.isCurrent(ticket))setPending(false);
   }
 }
 return <div className="english-lesson-ai">
  <button type="button" className="english-lesson-ai-launch" aria-expanded={open}
   aria-label={open?'Close AI English Tutor':'Open AI English Tutor'} onClick={()=>setOpen(v=>!v)}>
   <Sparkles size={20}/><span>AI Tutor</span>
  </button>
  {open&&<section className="english-lesson-ai-panel" aria-label="English lesson AI tutor">
   <header><div><strong>English AI Tutor</strong><small>Ask about what you are learning</small></div>
   <button aria-label="Close AI tutor" type="button" onClick={()=>setOpen(false)}><X size={19}/></button></header>
   <div className="english-lesson-ai-quick">{starters.map(([label,prompt])=>
    <button type="button" key={label} disabled={pending} onClick={()=>void ask(prompt)}>{label}</button>)}</div>
   <label htmlFor="english-lesson-ai-question">Your question</label>
   <textarea id="english-lesson-ai-question" value={question} onChange={e=>setQuestion(e.target.value.slice(0,300))}
    rows={3} placeholder="What would you like to understand better?"/>
   <button type="button" className="primary-button" disabled={pending||!question.trim()} onClick={()=>void ask(question)}>
    {pending?'Asking Gemini…':'Ask Gemini'}</button>
   {answer&&<article aria-live="polite"><strong>Gemini response · {model}</strong><div className="english-lesson-ai-answer"><TeachingBlocks text={answer}/></div></article>}
   {error&&<p role="status" className="notice">{error}</p>}
   <small>AI can make mistakes. Do not enter personal information. This tutor is for learning, not graded assessments. Your question is sent only when you ask.</small>
  </section>}
 </div>;
}
