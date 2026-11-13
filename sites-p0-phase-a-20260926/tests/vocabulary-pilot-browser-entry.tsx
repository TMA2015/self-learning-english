import React from 'react';
import {createRoot} from 'react-dom/client';
import {VocabularyPilotTeaching,VocabularyPilotRepair} from '../app/vocabulary-pilot';

const args=new URL(location.href).searchParams;
const lessonId=args.get('lesson')??'VOC-A2-01';
const version=args.get('version')??'1.25.0';
const phase=args.get('phase')??'teaching';
const requestedWidth=Number(args.get('width')??'320');
const out=document.getElementById('sle-test-result')!;
const check=(condition:unknown,message:string)=>{
 if(!condition)throw Error('VOC_PILOT_BROWSER '+lessonId+' '+phase+' '+message);
};
const delay=()=>new Promise(resolve=>setTimeout(resolve,25));
const wait=async(test:()=>boolean,label:string)=>{
 for(let i=0;i<200;i++){if(test())return;await delay();}
 throw Error('Timed out waiting for '+label);
};
const makeData=()=>{
 if(phase==='a2wrong')return {itemId:'VOC-A2-01-Q1',correct:false,chosen:'A',outcome:'incorrect'};
 if(phase==='a2correct')return {itemId:'VOC-A2-01-Q1',correct:true,chosen:'B',outcome:'correct'};
 if(phase==='b1wrong')return {itemId:'VOC-B1-01-Q2',correct:false,chosen:'C',outcome:'incorrect'};
 if(phase==='format')return {itemId:'VOC-A2-01-Q9',correct:false,chosen:'mystery',outcome:'format-only'};
 if(phase==='shortwrong')return {itemId:'VOC-A2-01-Q9',correct:false,chosen:'strange',outcome:'incorrect'};
 if(phase==='variant')return {itemId:'VOC-A2-01-Q11',correct:true,chosen:'lay',outcome:'correct'};
 return {itemId:'VOC-A2-01-Q1',correct:false,chosen:'C',outcome:'incorrect'};
};
const data=makeData();
const resultPhases=new Set(['a2wrong','a2correct','b1wrong','format','shortwrong','variant','otherwrong']);
function Fixture(){
 return <main className="foundation-learn" aria-label="Synthetic vocabulary preview" style={{width:'100%',maxWidth:'920px'}}>
  <VocabularyPilotTeaching lessonId={lessonId} version={version}/>
  {resultPhases.has(phase)&&<section id="synthetic-result" aria-label="Synthetic post-submit result">
   <VocabularyPilotRepair itemId={data.itemId} version={version}
    correct={data.correct} outcome={data.outcome} chosen={data.chosen}/>
  </section>}
 </main>;
}
(async()=>{
 const shell=document.getElementById('app')!;
 shell.style.width=requestedWidth+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<Fixture/>);
 await wait(()=>!!document.querySelector('.foundation-learn'),'mounted React fixture');
 await delay();
 const teaching=document.querySelector('.sle-vocab-pilot');
 if(version!=='1.25.0'){
  check(!teaching&&!document.querySelector('.sle-vocab-repair'),'old versions must not receive new material');
  out.textContent='PASS_VERSION_GUARD';return;
 }
 check(!!teaching,'reviewed teaching card required');
 const chunkCards=[...document.querySelectorAll('.sle-vocab-card')];
 check(chunkCards.length>=2,'natural collocation card coverage');
 check(!!document.querySelector('.sle-vocab-demo'),'independent worked example required');
 const opt=document.querySelector('.sle-vocab-self-practice') as HTMLDetailsElement;
 check(!!opt&&!opt.open,'original sentences optional and collapsed by default');
 check((opt.textContent??'').includes('Optional practice is not submitted or graded'),'unscored practice must be clear');
 check(!document.querySelector('input, textarea'),'unscored original writing is not collected');
 check(!document.body.innerText.includes('You have mastered'),'no unsupported proficiency claim');
 check(!document.body.innerText.includes('correct_option_id'),'no hidden scored key leak');
 if(lessonId==='VOC-A2-01'){
  check(document.body.innerText.includes('make a plan'),'reviewed independent A2 worked model');
 }else if(lessonId==='VOC-B1-01'){
  check(document.body.innerText.includes('fewer sheets'),'B1 careful evidence framing');
 }else if(lessonId==='VOC-A1-01'){
  check(document.body.innerText.includes('handing in'),'A1 minimal new model');
 }
 const repair=document.querySelector('.sle-vocab-repair');
 if(['teaching','format','otherwrong','a2correct','variant'].includes(phase)){
  check(!repair,'No repeated feedback for correct/unsupported cases');
 }else{
  check(!!repair,'reviewed result should receive a specific repair');
  const text=repair!.textContent??'';
  if(phase==='a2wrong')check(text.includes('Do breakfast is not the standard phrase'),'known wrong option ID must map correctly');
  if(phase==='b1wrong')check(text.includes('does not say the object is made'),'known wrong B1 option ID must map correctly');
  if(phase==='shortwrong')check(text.includes('does not tell us why'),'unknown short-answer intent not invented');
 }
 const maxRight=Math.max(...[...document.querySelectorAll('.sle-vocab-card,.sle-vocab-demo,.sle-vocab-self-practice')]
   .map(el=>(el as HTMLElement).getBoundingClientRect().right));
 const start=shell.getBoundingClientRect().left;
 check(maxRight-start<=requestedWidth+2,'cards overflow '+requestedWidth+'px container');
 out.textContent='PASS_VOCABULARY_'+lessonId.replaceAll('-','_')+'_'+phase.toUpperCase();
})().catch(e=>{out.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,650);});
