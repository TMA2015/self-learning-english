import React from 'react';
import {createRoot} from 'react-dom/client';
import {OfflineLessonReview} from '../app/offline-lesson-review';
import type {PriorAttempt} from '../domain/post-lesson-review';

const q=new URL(location.href).searchParams;
const phase=q.get('phase')??'wrong';
const contentWidth=Number(q.get('width')??'320');
const target=document.getElementById('app')!;
const out=document.getElementById('sle-test-result')!;
const lesson={id:'VOC-A2-01',module:'vocabulary',title:'Daily routines and useful phrases'};
const results=[
 ...Array.from({length:10},(_,i)=>({id:'VOC-A2-01-Q'+(i+1),correct:true,explanation:'Correct answer.'})),
 {id:'VOC-A2-01-Q11',correct:false,explanation:'Set and lay both fit this context.'}
];
const attempt:PriorAttempt={status:phase==='started'?'started':'scored',version:'1.25.0',results:phase==='allcorrect'?
 results.map(x=>({...x,correct:true})):results};
let jumped='';
const check=(ok:unknown,message:string)=>{if(!ok)throw Error('RESULTS_UX '+phase+' '+message);};
const wait=async(test:()=>boolean)=>{
 for(let n=0;n<150;n++){if(test())return;await new Promise(resolve=>setTimeout(resolve,25));}
 throw Error('React fixture did not mount');
};
(async()=>{
 target.style.width=contentWidth+'px';target.style.maxWidth='100%';
 createRoot(target).render(<OfflineLessonReview lesson={lesson} attempt={attempt}
  onReviewQuestion={id=>{jumped=id;}}/>);
 await wait(()=>phase==='started'?!!target:!!document.querySelector('.foundation-offline-review'));
 if(phase==='started'){
  check(!document.querySelector('.foundation-offline-review'),'No before-submit advice'); 
  out.textContent='PASS_RESULT_NOT_SHOWN_BEFORE_SUBMIT';return;
 }
 const card=document.querySelector('.foundation-offline-review') as HTMLElement;
 check(!!card,'review card visible');
 check(card.textContent?.includes('What to practise next'),'single review heading');
 check(!card.textContent?.includes('10/11'),'no duplicated score');
 check(!/certified|proficiency|CEFR level|not a measure/i.test(card.textContent??''),'no generic warning');
 check(!card.querySelector('small'),'no tiny disclaimer inside advice');
 if(phase==='wrong'){
  check(card.textContent?.includes('set the table and lay the table'),'question-specific action');
  check(!card.textContent?.includes('a place, an object'),'generic A1 advice not shown');
  const button=card.querySelector('button') as HTMLButtonElement;
  check(button?.textContent?.includes('Go to question'),'visible action button');
  button.click();check(jumped==='VOC-A2-01-Q11','jump to actual missed question id');
 }else{
  check(card.textContent?.includes('All objective answers were correct'),'positive success note');
  check(!card.querySelector('button'),'no missed-question CTA on full score');
 }
 const bodyText=card.querySelector('p') as HTMLElement;
 check(!!bodyText&&getComputedStyle(bodyText).fontSize==='16px','16px body text');
 check(getComputedStyle(card).fontSize==='16px','card font consistent');
 const bounds=card.getBoundingClientRect(),shell=target.getBoundingClientRect();
 check(bounds.right-shell.left<=contentWidth+2,'no right overflow at '+contentWidth+'px');
 out.textContent='PASS_RESULT_'+phase.toUpperCase()+'_'+contentWidth;
})().catch(e=>{out.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,900);});
