import React from 'react';
import {createRoot} from 'react-dom/client';
import {MultiskillKnowledgeV2} from '../app/multiskill-knowledge-v2';
import type {SeedLesson} from '../domain/academic';
const params=new URL(location.href).searchParams;
const id=params.get('lesson')??'REA-B1-03',width=Number(params.get('width')??375);
const output=document.getElementById('sle-test-result')!;
const shell=document.getElementById('app')!;
const modules:Record<string,[string,string]>={
 'REA-B1-03':['reading','B1'],
 'VOC-A2-01':['vocabulary','A2'],
 'WRI-B1-05':['writing','B1'],
 'LIS-A2-03':['listening','A2'],
};
const spec=modules[id];if(!spec)throw Error('No approved pilot: '+id);
const lesson={id,module:spec[0],cefr_target:spec[1],title:id,
 objectives:['understand the main purpose of a short everyday conversation;',
 'identify times, prices, equipment and conditions;',
 'make a simple inference about a final choice.']} as unknown as SeedLesson;
const pause=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function wait(predicate:()=>boolean,label:string){
 for(let i=0;i<220;i++){if(predicate())return;await pause(35)}
 throw Error('Timeout '+label);
}
function check(condition:unknown,label:string){if(!condition)throw Error('SLE_MS_V2 '+id+' '+width+' '+label)}
(async()=>{
 check([375,768,960].includes(width),'Unexpected width');
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<MultiskillKnowledgeV2 lesson={lesson} showVi={false}/>);
 await wait(()=>!!document.querySelector('.sle-ms'),'React mounted');
 const root=document.querySelector('.sle-ms') as HTMLElement;
 check(root.querySelectorAll('.sle-ms-section').length>=3,'sections missing');
 check(root.querySelectorAll('.sle-ms-card,.sle-ms-vocab-card').length>=3,'cards missing');
 check(!root.querySelector('[lang="vi"]'),'English-first default');
 const right=shell.getBoundingClientRect().right;
 for(const el of root.querySelectorAll('.sle-ms-section,.sle-ms-card,.sle-ms-vocab-card,.sle-ms-panel,.sle-ms-model,.sle-ms-outline,.sle-ms-passage')){
  check(el.getBoundingClientRect().right<=right+2,'card overflows viewport: '+el.className);
 }
 if(id==='REA-B1-03'){
  const buttons=root.querySelectorAll<HTMLButtonElement>('.sle-ms-controls button');
  check(buttons.length===3,'evidence lenses');
  buttons[1].click();
  await wait(()=>root.querySelectorAll('.sle-ms-highlight').length===1,'qualification highlighted');
  check(root.querySelector('.sle-ms-highlight')?.textContent?.includes('However'),'correct sentence highlighted');
  buttons[2].click();
  await wait(()=>root.querySelector('.sle-ms-highlight')?.textContent?.includes('therefore')??false,'inference highlighted');
 }
 if(id==='VOC-A2-01'){
  const cards=root.querySelectorAll<HTMLDetailsElement>('details.sle-ms-vocab-card');
  check(cards.length===4,'four reviewed phrase cards');
  check(!cards[0].open,'initially collapsed');
  cards[0].querySelector('summary')?.click();
  await wait(()=>cards[0].open,'expand phrase');
  check(cards[0].textContent?.includes('On school days'),'reviewed usage example');
 }
 if(id==='WRI-B1-05'){
  check(root.querySelectorAll('.sle-ms-brainstorm li').length===5,'five questions');
  const textarea=root.querySelector('textarea') as HTMLTextAreaElement;
  check(!!textarea&&textarea.disabled===false,'transient textarea is editable');
  textarea.focus();
  const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
  check(!!setter,'native textarea setter');
  setter!.call(textarea,'A possible school-art exhibition idea.');
  textarea.dispatchEvent(new Event('input',{bubbles:true}));
  await wait(()=>!(root.querySelector('.sle-ms-notebar button') as HTMLButtonElement).disabled,'note is local state');
  (root.querySelector('.sle-ms-notebar button') as HTMLButtonElement).click();
  await wait(()=>textarea.value==='','clear local note');
 }
 if(id==='LIS-A2-03'){
  check(!root.querySelector('audio,video'),'not a fake audio test');
  check(root.textContent?.includes('Listening remains unassessed'),'correct audio fallback');
  check(root.textContent?.includes('transcript is not shown before submission'),'transcript safety');
 }
 check(root.scrollWidth<=root.clientWidth+2,'horizontal scroll outside internal region');
 output.textContent='PASS_SLE_MULTISKILL_'+id+'_'+width;
})().catch(e=>{output.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,900)});
