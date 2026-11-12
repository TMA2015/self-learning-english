import React from 'react';
import {createRoot} from 'react-dom/client';
import {A2WritingSourceGuide} from '../app/a2-writing-source-guide';
const phase=new URL(location.href).searchParams.get('phase');
const out=document.getElementById('sle-test-result')!;
const check=(ok:unknown,msg:string)=>{if(!ok)throw Error('WRI_SOURCE_BROWSER '+msg)};
const wait=async(test:()=>boolean,msg:string)=>{
 for(let i=0;i<240;i++){
  if(test())return;
  await new Promise(resolve=>setTimeout(resolve,35));
 }
 throw Error('Timeout '+msg);
};
const select=(id:string)=>[...document.querySelectorAll('button')].find(x=>x.textContent?.includes(id)) as HTMLButtonElement|undefined;
const opened:string[]=[];
if(phase==='missing'){
 const originalFetch=window.fetch.bind(window);
 window.fetch=(input,init)=>{
  if(typeof input==='string'&&input.includes('/api/foundation?lesson='))
   return originalFetch(input+'&phase=missing',init);
  return originalFetch(input,init);
 };
}
(async()=>{
 createRoot(document.getElementById('app')!).render(
  <A2WritingSourceGuide version="1.25.0"
   readingAvailable={phase!=='unavailable'}
   listeningAvailable={phase!=='unavailable'}
   disabled={false} onOpenSource={id=>opened.push(id)}/>
 );
 await wait(()=>!!document.querySelector('[aria-label="Required sources for WRI-A2-07"]'),
  'source guide mount');
 check(document.body.innerText.includes('voice message, not a written letter'),
  'spoken source must be labeled, not imaginary Mia letter');
 check(!!select('REA-A2-08')&&!!select('LIS-A2-07'),
  'links to BOTH canonical original lessons');
 if(phase==='ok'){
  await wait(()=>!!document.querySelector('[aria-label="Original community event notice"]'),'canonical notice loaded');
  const notice=document.querySelector('[aria-label="Original community event notice"]')!.textContent??'';
  check(notice.includes('Repair Café')&&notice.includes('cannot guarantee'),
   'unchanged original Reading notice is visible in Writing');
  check(!document.body.innerText.includes('MIA_PRIVATE_TRANSCRIPT'),
   'Never render Listening transcript stored in service response');
  select('REA-A2-08')!.click();select('LIS-A2-07')!.click();
  check(opened.join(',')==='REA-A2-08,LIS-A2-07','both lesson links use original callbacks');
  out.textContent='PASS_SOURCES_VISIBLE';
 }else if(phase==='missing'){
  await wait(()=>!!document.body.innerText.includes('Could not load the written notice'),'missing source alert');
  check(!document.body.innerText.includes('MIA_PRIVATE_TRANSCRIPT'),
   'Missing source still cannot leak transcript');
  check(!!select('REA-A2-08')&&!select('REA-A2-08')!.disabled,'fallback navigation available');
  out.textContent='PASS_SOURCE_FAIL_CLOSED';
 }else if(phase==='unavailable'){
  await wait(()=>!!document.body.innerText.includes('not imported on this device'),'missing catalog warning');
  check(select('REA-A2-08')!.disabled&&select('LIS-A2-07')!.disabled,'no false source buttons');
  out.textContent='PASS_MISSING_CATALOG';
 }else throw Error('Unexpected browser test phase '+phase);
})().catch(error=>{
 out.textContent='FAIL '+String(error)+' '+String((error as Error).stack).slice(0,900);
});
