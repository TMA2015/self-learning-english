/**
 * Issue #119 native Chrome test: real FoundationDemo + real academic localStorage
 * with actual reload and Back/Forward, never against production learner data.
 */
import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationDemo} from '../app/foundation';
import {parseBrowserRoute,browserRouteHash,type BrowserRoute} from '../domain/browser-route';
import {BrowserLocalAcademicRepository} from '../infrastructure/storage/browser-local-repositories';
import {mapSeed,validateSeed,type Seed} from '../domain/academic';
import {sourceDigest} from '../application/academic-service';
import {createOptionOrder} from '../domain/option-order';
import curriculum from '../content/curriculum-1.21.0-candidate.json';
const id='LIS-A1-06',attemptId='issue119-preserved-draft';
const firstAnswer=(q:{options?:{id:string}[]})=>q.options?.[0]?.id??'qa-restored-answer';
const errors:string[]=[];
window.addEventListener('error',e=>errors.push(String(e.error?.stack||e.message)));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason?.stack||e.reason)));
const assert=(v:unknown,m:string)=>{if(!v)throw Error(m)};
const sleep=(n:number)=>new Promise<void>(resolve=>setTimeout(resolve,n));
async function wait<T>(fn:()=>T|Promise<T>|undefined|null|false,name:string,limit=14000):Promise<T>{
 const start=Date.now();
 while(Date.now()-start<limit){
  if(errors.length)throw Error('Browser JavaScript: '+errors.join(' | '));
  const x=await fn();if(x)return x as T;
  await sleep(80);
 }
 throw Error('Timeout waiting '+name+': '+JSON.stringify({url:location.href,notices:Array.from(document.querySelectorAll('[role="alert"],[role="status"]')).map(el=>el.textContent).slice(0,12),lesson:!!document.querySelector('.foundation-lesson'),text:document.body.innerText.slice(-1050)}));
}
const repo=new BrowserLocalAcademicRepository(localStorage);
const app=document.getElementById('app')!;
let renderRoot:ReturnType<typeof createRoot>;
function Shell(){
 const [route,setRoute]=useState<BrowserRoute>(()=>parseBrowserRoute(window.location.hash));
 useEffect(()=>{
  const pop=()=>setRoute(parseBrowserRoute(window.location.hash));
  window.addEventListener('popstate',pop);
  return()=>window.removeEventListener('popstate',pop);
 },[]);
 return React.createElement(FoundationDemo,{
  skill:'listening',browserRoute:route,
  onBrowserRoute:(next:BrowserRoute)=>{
   if(browserRouteHash(next)!==window.location.hash)
    history.pushState({issue119:next},'',browserRouteHash(next));
   setRoute(next);
  }
 });
}
async function restored(){
 await wait(()=>document.querySelector('.foundation-lesson')?.textContent?.includes(id),'target lesson open');
 await wait(()=>Array.from(document.querySelectorAll('button')).some(b=>b.textContent?.trim()==='Play full audio'),'saved Listening practice restored');
 const a=(await repo.attempts('local-family')).filter(a=>a.lessonId===id);
 assert(a.length===1,'Route restoration duplicated an academic attempt');
 assert(a[0].id===attemptId&&a[0].status==='started','Wrong saved attempt restored');
 assert(a[0].playbackCompleted!==true,'Refresh forged verified audio playback');
 assert(!Array.from(document.querySelectorAll('button')).some(b=>b.textContent?.includes('Read transcript after submission')),'Transcript appeared before submission');
 return a[0];
}
async function run(){
 assert(location.hostname==='127.0.0.1','Must run only on local browser test');
 const stage=sessionStorage.getItem('__sle_issue119_phase')||'start';
 if(stage==='start'){
  localStorage.clear();sessionStorage.clear();
  const seed=curriculum as Seed;
  assert(seed.schema_version==='1.21.0'&&seed.lessons.length===132);
  assert(validateSeed(seed).length===0);
  await repo.addPackage({id:seed.package_id,version:seed.schema_version,digest:await sourceDigest(seed),source:seed,bundle:mapSeed(seed),at:Date.now()});
  const lesson=seed.lessons.find(l=>l.id===id)!;
  await repo.start('local-family',{
   id:attemptId,rootId:attemptId,packageId:seed.package_id,version:seed.schema_version,
   lessonId:id,status:'started',optionOrder:createOptionOrder(lesson.activities,n=>0),
   answers:{[lesson.activities[0].id]:firstAnswer(lesson.activities[0])},
   evidence:[],createdAt:Date.now()
  });
  history.replaceState({issue119:true},'',browserRouteHash({view:'listening',lessonId:id,screen:'practice'}));
  renderRoot=createRoot(app);renderRoot.render(React.createElement(Shell));
  await restored();
  const backButton=await wait(()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()==='← Back to lessons'),'Back to lessons');
  backButton.click();
  await wait(()=>location.hash==='#/listening'&&!!document.querySelector('.foundation-catalog'),'skill catalog route');
  history.back();
  await wait(()=>location.hash.endsWith('/lesson/'+id+'/practice'),'browser Back restored URL');
  await restored();
  history.forward();
  await wait(()=>location.hash==='#/listening','browser Forward restored catalog URL');
  history.back();
  await wait(()=>location.hash.endsWith('/lesson/'+id+'/practice'),'restore deep-link for full reload');
  await restored();
  sessionStorage.setItem('__sle_issue119_phase','verify-reload');
  location.reload(); // genuine reload on same localhost profile
  return;
 }
 if(stage==='verify-reload'){
  assert(location.hash==='#/listening/lesson/'+id+'/practice','Reload lost deep-link URL');
  renderRoot=createRoot(app);renderRoot.render(React.createElement(Shell));
  const a=await restored();
  const lesson=curriculum.lessons.find(l=>l.id===id)!;
  assert(a.answers[lesson.activities[0].id]===firstAnswer(lesson.activities[0]),'Saved answer was changed on browser reload');
  assert((await repo.packages()).length===1,'Reload installed extra content versions');
  const result={suite:'ISSUE119_CHROME_ROUTE_REFRESH_BACK_FORWARD',savedAttempt:attemptId,
   realBrowserBack:true,realBrowserForward:true,actualLocationReload:true,
   canonicalPlayer:true,retakeNotCreated:true,transcriptConcealed:true,
   playbackVerificationPreserved:true,curriculum:'1.21.0',
   learnerDataTouched:false,liveSiteTouched:false,safari:'NOT_TESTED'};
  await fetch('/__result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'PASS',details:result})});
  return;
 }
 throw Error('Unexpected test phase');
}
run().catch(e=>fetch('/__result',{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({status:'FAIL',details:{error:String(e?.stack||e),jsErrors:errors,html:document.body.innerText.slice(-1500)}})}));
