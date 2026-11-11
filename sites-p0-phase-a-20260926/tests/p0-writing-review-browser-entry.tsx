import React from 'react';
import {createRoot} from 'react-dom/client';
import {AnyTopicWritingReview} from '../app/any-topic-writing-review';

const prefix='g-learning:english:any-topic-writing:draft:v1';
const phase=new URL(location.href).searchParams.get('phase');
const out=document.getElementById('sle-test-result')!;
const report=(code:string,extra?:unknown)=>{out.textContent=code+(extra?' '+JSON.stringify(extra):'')};
const assert=(condition:unknown,message:string)=>{if(!condition)throw Error('BROWSER_QA: '+message)};
const wait=async(check:()=>boolean,message:string)=>{
 for(let i=0;i<300;i++){
  if(check())return;
  await new Promise(r=>setTimeout(r,40));
 }
 throw Error('Timeout '+message+' / '+document.body.innerText.slice(-500));
};
const find=(text:string)=>[...document.querySelectorAll('button')].find(b=>b.textContent?.includes(text)) as HTMLButtonElement|undefined;
const textarea=(name:string)=>document.querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement|null;
function write(t:HTMLTextAreaElement|null,value:string){
 assert(t,'Missing textarea');
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!;
 setter.call(t,value);
 t!.dispatchEvent(new Event('input',{bubbles:true}));
}
(async()=>{
 if(phase==='save')localStorage.removeItem(prefix);
 createRoot(document.getElementById('app')!).render(<AnyTopicWritingReview/>);
 await wait(()=>!!textarea('writing-topic')&&!!textarea('student-written-content'),'mount');
 const topic=textarea('writing-topic')!,writing=textarea('student-written-content')!;
 assert(topic.required&&writing.required,'Both fields required');
 assert(!!find('Open self-review checklist'),'checklist button exists');
 if(phase==='save'){
  assert(find('Open self-review checklist')?.disabled,'Empty input cannot review');
  write(topic,'Should students read every day? Give reasons.');
  write(writing,'Students should read every day. Reading builds vocabulary and helps them learn new ideas.');
  await wait(()=>!!find('Open self-review checklist')&&!find('Open self-review checklist')!.disabled,'controlled updates');
  find('Save draft')!.click();
  await wait(()=>JSON.parse(localStorage.getItem(prefix)??'{}').writing?.startsWith('Students should read'),'browser save');
  assert(!document.querySelector('[aria-label="Provisional self-review checklist"]'),'No review before action');
  report('PASS_SAVED',{saved:true,required:2});
 }else if(phase==='restore'){
  await wait(()=>textarea('writing-topic')!.value.includes('Should students read every day?'),'load saved topic');
  assert(textarea('student-written-content')!.value.includes('Reading builds vocabulary'),'restore saved work');
  find('Open self-review checklist')!.click();
  await wait(()=>!!document.querySelector('[aria-label="Provisional self-review checklist"]'),'checklist');
  const checklist=document.querySelector('[aria-label="Provisional self-review checklist"]')!.textContent??'';
  assert(/Task response|Organization|Language/.test(checklist),'Revision guidance displayed');
  assert(!/Your CEFR|CEFR B1|Score: 9/.test(checklist),'No invented score');
  write(textarea('student-written-content'),'Revised, shorter idea.');
  await wait(()=>!document.querySelector('[aria-label="Provisional self-review checklist"]'),'stale review hidden after edits');
  const confirmOriginal=window.confirm;
  window.confirm=()=>true;
  find('Clear local draft')!.click();
  window.confirm=confirmOriginal;
  await wait(()=>!localStorage.getItem(prefix)?.includes('Reading builds vocabulary'),'clear sensitive content');
  assert(textarea('writing-topic')!.value===''&&textarea('student-written-content')!.value==='','fields cleared');
  report('PASS_RESTORE_CLEAR',{restored:true,noStale:true,privacyClear:true});
 }else throw Error('Unknown phase');
})().catch(e=>report('FAIL',{error:String(e),stack:String((e as Error).stack).slice(0,1400)}));
