import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AdaptivePracticeGrid,ShortPracticeResponse,shortPracticeMode} from '../app/adaptive-practice';
const out=document.getElementById('sle-test-result')!;
const width=Number(new URL(location.href).searchParams.get('width')??375);
const shell=document.getElementById('app')!;
shell.style.width=width+'px';shell.style.maxWidth='100%';
const rows=[
 ['He','She','They','It'],
 ['I am a student.','My bag is blue.','She is happy.','They play tennis.'],
 ['The students are preparing their classroom for a group presentation.','The students are preparing they classroom for a group presentation.','The students are preparing them classroom for a group presentation.','The students are preparing we classroom for a group presentation.']
];
const prompt='Nam and I are friends. ___ walk to school together.';
const phrase='Complete with a phrase: Mia ___ every evening.';
const check=(v:unknown,msg:string)=>{if(!v)throw Error(msg)};
function Fixture(){
 const [answers,setAnswers]=useState<Record<string,string>>({gap:'We'});
 return <section className="foundation-lesson foundation-focus" style={{width:'100%',margin:0,padding:0}}>
 {rows.map((options,i)=><fieldset className="foundation-question" key={i}><legend>Question {i+1}</legend><AdaptivePracticeGrid className="foundation-option-grid">{options.map((text,j)=><label key={j} className="foundation-option"><input type="radio" name={'q'+i} value={String(j)} checked={answers['q'+i]===String(j)} onChange={()=>setAnswers(s=>({...s,['q'+i]:String(j)}))}/><span className="foundation-option-text">{text}</span></label>)}</AdaptivePracticeGrid></fieldset>)}
 {[prompt,phrase].map((p,i)=>{const id=i?'phrase':'gap',mode=shortPracticeMode(p,answers[id]??'');if(mode.kind==='textarea')throw Error('Unexpected fallback');return <fieldset className="foundation-question" key={id}><legend>Fill in the blank.</legend><ShortPracticeResponse mode={mode} prompt={p} id={id} value={answers[id]??''} onChange={value=>setAnswers(s=>({...s,[id]:value}))}/></fieldset>})}
 <fieldset className="foundation-question"><legend>Extended writing</legend><label className="field">Your response<textarea rows={7}/></label></fieldset>
 <output id="answer-state">{JSON.stringify(answers)}</output>
 </section>;
}
const wait=async(f:()=>boolean,label:string)=>{for(let i=0;i<200;i++){if(f())return;await new Promise(r=>setTimeout(r,30))}throw Error('Timeout '+label)};
(async()=>{
 createRoot(shell).render(<Fixture/>);
 await wait(()=>document.querySelectorAll('[data-practice-columns]').length===3,'measured options');
 const grids=[...shell.querySelectorAll<HTMLElement>('.foundation-option-grid')];
 const expected=width===375?[2,2,1]:width===650?[4,4,1]:[4,4,1];
 for(let i=0;i<3;i++){
  const count=getComputedStyle(grids[i]).gridTemplateColumns.trim().split(/\s+/).length;
  check(count===expected[i],'columns '+width+' '+i+': '+count+' expected '+expected[i]);
  for(const label of grids[i].querySelectorAll('label'))check(label.getBoundingClientRect().height>=43.5,'touch height');
 }
 const radio=grids[0].querySelectorAll<HTMLInputElement>('input')[1];radio.click();
 await wait(()=>JSON.parse(document.querySelector('#answer-state')!.textContent!).q0==='1','same radio value');
 const gap=shell.querySelector<HTMLInputElement>('input[name="gap"]')!;
 const phraseInput=shell.querySelector<HTMLInputElement>('input[name="phrase"]')!;
 check(gap.value==='We','restored draft value');
 check(!gap.hasAttribute('placeholder'),'blank has no placeholder');
 check(Math.abs(gap.getBoundingClientRect().height-44)<1,'gap height');
 check(Math.abs(gap.getBoundingClientRect().width-100)<1,'gap width');
 check(phraseInput.getBoundingClientRect().width>gap.getBoundingClientRect().width,'phrase wider');
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
 setter.call(gap,'They');gap.dispatchEvent(new Event('input',{bubbles:true}));
 await wait(()=>JSON.parse(document.querySelector('#answer-state')!.textContent!).gap==='They','same short answer draft value');
 check(shell.querySelector('textarea')!.getBoundingClientRect().height>=145,'Writing retained');
 check(shell.scrollWidth<=shell.clientWidth+2,'no outer overflow');
 // Recompute on a container change without a window resize.
 shell.style.width='375px';
 await wait(()=>getComputedStyle(grids[0]).gridTemplateColumns.trim().split(/\s+/).length===2,'container resize');
 check(gap.value==='They','answer kept through resize');
 out.textContent='PASS_ADAPTIVE_PRACTICE_'+width;
})().catch(e=>{out.textContent='FAIL '+String(e)});
