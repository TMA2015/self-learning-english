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
const select=(id:string)=>[...document.querySelectorAll('button')].find(x=>
 x.textContent?.includes(id)) as HTMLButtonElement|undefined;
const opened:string[]=[];
if(phase!=='ok'&&phase!=='unavailable'){
 const originalFetch=window.fetch.bind(window);
 window.fetch=(input,init)=>{
  if(typeof input==='string'&&input.includes('/api/foundation?lesson='))
   return originalFetch(input+'&phase='+encodeURIComponent(phase??''),init);
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
  'source guide mounted');
 check(document.body.innerText.includes('voice message, not a written letter'),
  'Mia must be a spoken source, not an invented letter');
 const titles=[...document.querySelectorAll('.a2-writing-source-step h4')]
  .map(e=>e.textContent?.trim());
 check(titles.length===3&&
  titles[0]?.startsWith('1. Read')&&titles[1]?.startsWith('2. Listen')&&
  titles[2]?.startsWith('3. Write'),'single page must lead Read → Listen → Write');
 const details=document.querySelector('.a2-writing-optional-lessons') as HTMLDetailsElement;
 check(!!details&&!details.open&&opened.length===0,
  'Original separate lessons optional, not forced navigation');
 check(!!select('REA-A2-08')&&!!select('LIS-A2-07'),
  'Original lessons still available when explicitly requested');
 check(!document.body.innerText.includes('MIA_PRIVATE_TRANSCRIPT'),
  'Never display the protected original Listening transcript');
 if(phase==='ok'){
  await wait(()=>!!document.querySelector('[aria-label="Original community event notice"]'),
   'canonical notice loaded');
  await wait(()=>!!document.querySelector('[aria-label="Mia\'s original spoken message"]'),
   'original audio loaded');
  const notice=document.querySelector('[aria-label="Original community event notice"]')!.textContent??'';
  const audio=document.querySelector('audio[aria-label="Mia\'s original spoken message"]') as HTMLAudioElement;
  check(notice.includes('Repair Café')&&notice.includes('cannot guarantee'),
   'must render approved notice rather than invented lesson text');
  check(audio.controls&&audio.preload==='none','inline accessible audio player with controls');
  check(audio.getAttribute('src')==='/foundation-audio/LIS-A2-07-v1.mp3',
   'must use original validated Audio URL');
  check(document.body.innerText.includes('does not complete or grade'),
   'inline listening reference must not grant Listening assessment credit');
  check(opened.length===0,'Writing sources must be usable without navigation');
  details.open=true;
  select('REA-A2-08')!.click();select('LIS-A2-07')!.click();
  check(opened.join(',')==='REA-A2-08,LIS-A2-07','optional canonical navigation preserved');
  out.textContent='PASS_INLINE_READ_LISTEN_WRITE';
 }else if(phase==='missing'){
  await wait(()=>document.body.innerText.includes('Could not load the written notice'),
   'missing Reading alert');
  await wait(()=>document.body.innerText.includes('Could not load Mia'),
   'missing Listening alert');
  check(!document.querySelector('audio')&&!!select('REA-A2-08')&&!select('REA-A2-08')!.disabled,
   'missing sources must fail closed with optional navigation');
  out.textContent='PASS_SOURCE_FAIL_CLOSED';
 }else if(phase==='audioMissing'||phase==='audioWrongUrl'){
  await wait(()=>!!document.querySelector('[aria-label="Original community event notice"]'),
   'valid Reading still available');
  await wait(()=>document.body.innerText.includes('Could not load Mia'),
   'missing/bad audio warning');
  check(!document.querySelector('audio'),'no invalid audio player may render');
  out.textContent='PASS_AUDIO_FAIL_CLOSED';
 }else if(phase==='unavailable'){
  await wait(()=>document.body.innerText.includes('not imported on this device'),
   'missing catalog warning');
  check(!document.querySelector('audio')&&!document.querySelector('.foundation-passage'),
   'no media or passage from missing catalog');
  check(select('REA-A2-08')!.disabled&&select('LIS-A2-07')!.disabled,
   'no false navigation buttons');
  out.textContent='PASS_MISSING_CATALOG';
 }else throw Error('Unexpected browser test phase '+phase);
})().catch(error=>{
 out.textContent='FAIL '+String(error)+' '+String((error as Error).stack).slice(0,900);
});
