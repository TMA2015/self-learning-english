import React from 'react';
import {createRoot} from 'react-dom/client';
import {VocabularyKnowledgeV23} from '../app/vocabulary-knowledge-v23';
import data from '../content/vocabulary-knowledge-v23.json';
import type {SeedLesson} from '../domain/academic';
const params=new URL(location.href).searchParams,id=params.get('lesson')??'VOC-A1-01',width=Number(params.get('width')??375);
const output=document.getElementById('sle-test-result')!,shell=document.getElementById('app')!;
const lesson={id,module:'vocabulary',cefr_target:id.split('-')[1],title:id} as SeedLesson;
const d=data.lessons[id as keyof typeof data.lessons];
const pause=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function wait(fn:()=>boolean,label:string){for(let i=0;i<160;i++){if(fn())return;await pause(30)}throw Error(label)}
function check(ok:unknown,label:string){if(!ok)throw Error(label)}
(async()=>{
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 const root=createRoot(shell);
 const spoken:{text:string;lang:string;rate:number}[]=[];
 let cancels=0;
 Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel:()=>{cancels++},speak:(u:SpeechSynthesisUtterance)=>spoken.push({text:u.text,lang:u.lang,rate:u.rate})}});
 root.render(<VocabularyKnowledgeV23 lesson={lesson} version="1.28.0" showVi={false}/>);
 await wait(()=>!!shell.querySelector('.sle-voc-v23'),'mount');
 const panel=shell.querySelector('.sle-voc-v23') as HTMLElement;
 check(panel.querySelectorAll('.sle-voc-card').length===d.cards.length,'card count');
 check(!panel.querySelector('[lang="vi"]'),'English first');
 const speakers=panel.querySelectorAll<HTMLButtonElement>('.sle-voc-card .sle-voc-speaker');
 speakers[0].click();speakers[1].click();await wait(()=>spoken.length>=2,'two speech invocations');
 // SpeechSynthesisUtterance.rate is a WebIDL float; native getters may round to float32.
 // Compare its observed value with the expected native representation, not JS double equality.
 check(cancels===2&&spoken.length===2&&spoken.every((u,i)=>u.text===d.cards[0].speech[i]&&u.lang==='en-GB'&&(u.rate===0.92||u.rate===Math.fround(0.92))),'exact TTS invocation: '+JSON.stringify({cancels,spoken,expected:d.cards[0].speech,expectedRate:Math.fround(0.92)}));
 const flip=panel.querySelector<HTMLButtonElement>('.sle-voc-flip')!;
 flip.click();await wait(()=>flip.getAttribute('aria-pressed')==='true','flip');
 check(flip.textContent?.includes(d.cards[0].meaningEn),'flashcard back');
 (Array.from(panel.querySelectorAll('button')).find(b=>b.textContent==='Next') as HTMLButtonElement).click();
 await wait(()=>flip.getAttribute('aria-pressed')==='false'&&!!flip.textContent?.includes(d.deck[1].front),'next deck card');
 const task=panel.querySelector<HTMLTextAreaElement>('#'+d.recalls[0].id)!;
 const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!;
 set.call(task,'  '+d.recalls[0].accepted![0].toUpperCase()+'! ');task.dispatchEvent(new Event('input',{bubbles:true}));
 const checkButton=Array.from(panel.querySelectorAll('button')).find(b=>b.textContent==='Check phrase')!;
 await wait(()=>!checkButton.disabled,'recall edit');checkButton.click();
 await wait(()=>!!panel.textContent?.includes('Matches the target phrase'),'exact recall');
 const openTask=d.recalls.find(r=>r.mode==='OPEN_UNSCORED');
 if(openTask){const box=panel.querySelector<HTMLTextAreaElement>('#'+openTask.id)!;set.call(box,'My own sentence.');box.dispatchEvent(new Event('input',{bubbles:true}));const b=Array.from(panel.querySelectorAll('button')).find(x=>x.textContent==='Compare with model')!;await wait(()=>!b.disabled,'open response');b.click();await wait(()=>!!panel.textContent?.includes('Self-comparison · no automatic grading'),'unscored open');}
 const qc=panel.querySelector('fieldset')!;const option=qc.querySelectorAll<HTMLButtonElement>('.sle-voc-options button')[0];option.click();await wait(()=>!!qc.querySelector('[role="status"]'),'QC feedback');check(qc.textContent?.includes(d.quickChecks[0].options[0].feedbackEn),'option feedback');
 const modelButton=Array.from(panel.querySelectorAll('button')).find(b=>b.textContent==='Show model')!;check(modelButton.getAttribute('aria-expanded')==='false','hidden transfer');modelButton.click();await wait(()=>modelButton.getAttribute('aria-expanded')==='true','reveal transfer');
 root.render(<VocabularyKnowledgeV23 lesson={lesson} version="1.28.0" showVi={true}/>);await wait(()=>!!panel.querySelector('[lang="vi"]'),'Vietnamese support');
 check(panel.scrollWidth<=panel.clientWidth+2,'horizontal overflow');
 root.render(<VocabularyKnowledgeV23 lesson={lesson} version="1.25.0" showVi={true}/>);await wait(()=>!shell.querySelector('.sle-voc-v23'),'historical guard');
 output.textContent='PASS_SLE_VOCABULARY_'+id+'_'+width;
})().catch(e=>{output.textContent='FAIL '+String(e)});
