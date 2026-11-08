/**
 * Native Chrome full Home-app routing check, no shell-router substitution:
 * week 4 Main -> Learn -> Back/Forward -> Listening -> reload.
 * All state is in a throwaway localhost profile; never touches real learners.
 */
import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/home-client';
import {loadLearnerState} from '../infrastructure/browser/client-services';
const errors:string[]=[];
const writingMarker='SLE_ISSUE119_SAFE_WRITING_DRAFT_20261108';
window.addEventListener('error',e=>errors.push('window: '+String(e.error?.stack||e.message)));
window.addEventListener('unhandledrejection',e=>errors.push('unhandled: '+String(e.reason?.stack||e.reason)));
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
async function wait<T>(get:()=>T|Promise<T>|false|null|undefined,description:string,max=20000):Promise<T>{
 const start=Date.now();
 while(Date.now()-start<max){
  if(errors.length)throw Error('Browser JS: '+errors.join(' | '));
  const v=await get();if(v)return v as T;
  await sleep(80);
 }
 throw Error('Timeout '+description+' '+JSON.stringify({url:location.href,body:document.body.innerText.slice(-2000)}));
}
const report=(status:'PASS'|'FAIL',details:unknown)=>fetch('/__result',{
 method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,details})
}).catch(()=>{});
const q=(selector:string)=>document.querySelector<HTMLElement>(selector);
const activeNav=()=>document.querySelector<HTMLButtonElement>('aside nav button.nav-item.active')?.textContent?.trim();
function clickSidebar(label:string){
 const button=Array.from(document.querySelectorAll<HTMLButtonElement>('aside nav button.nav-item'))
 .find(b=>b.textContent?.trim()===label&&!b.disabled);
 if(!button)throw Error('No enabled sidebar '+label);
 button.click();
}
function checkWriting(screen:string){
 const heading=q('h1')?.textContent||'';
 if(!heading.includes('Week 4'))return false;
 return Array.from(document.querySelectorAll<HTMLButtonElement>('nav[aria-label="Week 4 learning steps"] button'))
  .some(b=>b.textContent?.trim()===screen&&b.getAttribute('aria-current')==='step');
}
async function run(){
 if(location.hostname!=='127.0.0.1')throw Error('Not a disposable localhost test');
 const phase=sessionStorage.getItem('__sle_nav_home_phase')||'start';
 if(phase==='start'){
  sessionStorage.clear();localStorage.clear();
  history.replaceState(null,'','#/writing-week/4/main');
  const root=createRoot(q('#app')!);root.render(React.createElement(Home));
  await wait(()=>checkWriting('Main Practice'),'Home hydrated deep link to Week 4 Main Practice');
  await wait(()=>document.body.innerText.includes('Saved on this device'),'Writing local profile loaded');
  const field=await wait(()=>document.querySelector<HTMLTextAreaElement>('textarea[name^="week-4-"]'),
   'Week 4 editable writing draft');
  const nativeSetter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
  if(!nativeSetter)throw Error('Native textarea setter unavailable');
  nativeSetter.call(field,writingMarker);
  field.dispatchEvent(new Event('input',{bubbles:true}));
  await wait(async()=>{
   const stored=await loadLearnerState();
   return JSON.stringify((stored.state as any)?.writingCourseV2B?.weeks?.['4']?.fields??{}).includes(writingMarker);
  },'durable Writing draft saved before navigation',20000);
  const learn=Array.from(document.querySelectorAll<HTMLButtonElement>('nav[aria-label="Week 4 learning steps"] button'))
   .find(b=>b.textContent?.trim()==='Learn');
  if(!learn)throw Error('Writing Week 4 Learn step missing');
  learn.click();
  await wait(()=>location.hash==='#/writing-week/4/learn'&&checkWriting('Learn'),'Writing Learn URL + UI');
  history.back();
  await wait(()=>location.hash==='#/writing-week/4/main'&&checkWriting('Main Practice'),'browser Back to Writing Main');
  await wait(()=>Array.from(document.querySelectorAll<HTMLTextAreaElement>('textarea[name^="week-4-"]'))
    .some(t=>t.value===writingMarker),'Writing draft intact on browser Back');
  history.forward();
  await wait(()=>location.hash==='#/writing-week/4/learn'&&checkWriting('Learn'),'browser Forward to Writing Learn');
  clickSidebar('Listening');
  await wait(()=>location.hash==='#/listening'&&activeNav()==='Listening','Home sidebar Listening');
  history.back();
  await wait(()=>location.hash==='#/writing-week/4/learn'&&checkWriting('Learn'),'Back Listening -> saved Writing step');
  history.forward();
  await wait(()=>location.hash==='#/listening'&&activeNav()==='Listening','Forward Writing -> Listening');
  sessionStorage.setItem('__sle_nav_home_phase','reload');
  location.reload();
  return;
 }
 if(phase==='reload'){
  if(location.hash!=='#/listening')throw Error('Full reload lost Listening URL: '+location.hash);
  const root=createRoot(q('#app')!);root.render(React.createElement(Home));
  await wait(()=>activeNav()==='Listening'&&document.body.innerText.includes('Listening lessons'),
   'Home restore Listening on full reload',22000);
  clickSidebar('Dashboard');
  await wait(()=>location.hash==='#/dashboard'&&activeNav()==='Dashboard','Navigate Dashboard with URL');
  history.back();
  await wait(()=>location.hash==='#/listening'&&activeNav()==='Listening','Back to Listening after reload');
  history.back();
  await wait(()=>location.hash==='#/writing-week/4/learn'&&checkWriting('Learn'),'Back to Writing after full reload');
  history.back();
  await wait(()=>location.hash==='#/writing-week/4/main'&&checkWriting('Main Practice'),'Back to Writing Main after reload');
  await wait(()=>Array.from(document.querySelectorAll<HTMLTextAreaElement>('textarea[name^="week-4-"]'))
   .some(t=>t.value===writingMarker),'saved Writing text recovered after full reload',20000);
  const info={
   suite:'ISSUE119_REAL_HOME_CHROME_NAVIGATION',
   nativeHomeComponent:true,week4DeepLink:true,
   writingMainToLearn:true,browserBack:true,browserForward:true,
   crossSkillNavigation:true,realFullReload:true,restoredListening:true,
   writingDraftPreservedAfterReload:true,
   noProductionData:true,noCurriculumMutation:true,safari:'NOT_TESTED'
  };
  await report('PASS',info);
  return;
 }
 throw Error('Unknown test phase '+phase);
}
run().catch(e=>report('FAIL',{error:String(e?.stack||e),errors,url:location.href,body:document.body.innerText.slice(-2300)}));
