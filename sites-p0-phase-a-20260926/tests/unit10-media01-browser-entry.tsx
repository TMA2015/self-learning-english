/**
 * Draft MEDIA-01: real FoundationDemo learner UI, immutable Unit-10 candidate
 * and real browser-local AcademicService. Disposable localhost Chrome only.
 * Does not modify the deployed runtime or any production learner data.
 */
import React from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationDemo} from '../app/foundation';
import candidate from '../.sites-runtime/unit10/curriculum-1.21.0-CANDIDATE-NO-MEDIA.json';
import {BrowserLocalAcademicRepository} from '../infrastructure/storage/browser-local-repositories';
import {localAcademicRuntime,LOCAL_OWNER_ID} from '../infrastructure/browser/local-runtime';
import {mapSeed,validateSeed,type Seed} from '../domain/academic';
import {sourceDigest} from '../application/academic-service';

type Attempt=Awaited<ReturnType<Awaited<ReturnType<typeof localAcademicRuntime>>['academic']['attempts']>>[number];
const ids=['LIS-A1-06','LIS-A2-07','LIS-B1-08'] as const;
const errors:string[]=[];
window.addEventListener('error',e=>errors.push('window: '+String(e.error?.stack||e.message)));
window.addEventListener('unhandledrejection',e=>errors.push('unhandled: '+String(e.reason?.stack||e.reason)));
const assert=(value:unknown,message:string)=>{if(!value)throw Error(message)};
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
async function wait<T>(f:()=>T|Promise<T>|undefined|null|false,message:string,ms=15000):Promise<T>{
 const start=Date.now();
 while(Date.now()-start<ms){
  if(errors.length)throw Error('JavaScript error: '+errors.join(' | '));
  const value=await f();if(value)return value as T;
  await sleep(70);
 }
 throw Error('UI timeout: '+message+'; UI: '+document.body.innerText.slice(-1800));
}
const app=document.getElementById('app')!;
const report=(status:'PASS'|'FAIL',details:unknown)=>fetch('/__result',{
 method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({status,details})
}).catch(()=>{});
const buttons=()=>Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
function button(label:string){
 return buttons().find(b=>b.textContent?.trim()===label && !b.disabled);
}
async function click(label:string){
 const b=await wait(()=>button(label),'button '+label);
 b.click();return b;
}
const excerpt=()=>document.body.innerText.slice(-2200);
async function recordOf(academic:BrowserLocalAcademicRepository,id:string,status?:string):Promise<Attempt|undefined>{
 const at=await academic.attempts(LOCAL_OWNER_ID);
 const subset=at.filter(x=>x.lessonId===id && (!status||x.status===status));
 return subset.sort((a,b)=>b.createdAt-a.createdAt)[0];
}
function lessonButton(id:string):HTMLButtonElement|undefined{
 return Array.from(document.querySelectorAll<HTMLButtonElement>('.foundation-catalog button'))
  .find(b=>b.querySelector('.foundation-lesson-id')?.textContent?.trim()===id && !b.disabled);
}
async function openLesson(id:string){
 await wait(()=>lessonButton(id),'catalog lesson '+id);
 lessonButton(id)!.click();
 await wait(()=>document.querySelector('.foundation-lesson')?.textContent?.includes(id),'opening '+id);
 await wait(()=>button('Start practice')||button('Continue saved draft')||button('View saved result'),'lesson overview '+id);
}
function chooseAnswers(expected:number){
 const fieldsets=Array.from(document.querySelectorAll<HTMLFieldSetElement>('.foundation-lesson fieldset.foundation-question'));
 assert(fieldsets.length===expected,'Unit10 question count mismatch: expected '+expected+', actual '+fieldsets.length);
 for(const field of fieldsets){
  const radio=field.querySelector<HTMLInputElement>('input[type="radio"]');
  if(radio){radio.click();continue;}
  const textarea=field.querySelector<HTMLTextAreaElement>('textarea');
  if(!textarea)throw Error('No usable input for a Unit10 question');
  const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
  if(!setter)throw Error('No native textarea setter');
  setter.call(textarea,'test response');
  textarea.dispatchEvent(new Event('input',{bubbles:true}));
 }
}
async function waitAnswersComplete(){
 return wait(()=>document.querySelector('.foundation-listening-completion')?.textContent?.includes('All questions answered.'),'answer completion');
}
async function startPractice(){
 await click('Start practice');
 await wait(()=>document.querySelector('.foundation-lesson audio')&&button('Play full audio'),'real Listening player visible');
}
function selectTranscriptNotVisible(){
 assert(!buttons().some(b=>/Read transcript after submission/i.test(b.textContent||'')),'Transcript leaked before submission');
 assert(!document.querySelector('.foundation-result-summary'),'Premature scored results shown');
}
async function run(){
 assert(location.hostname==='127.0.0.1','Browser test must only run on localhost');
 localStorage.clear(); // unique disposable browser profile from runner
 const src=candidate as Seed;
 assert(src.schema_version==='1.21.0','QA should use the reviewed candidate, never bundled production 1.20.0');
 assert(src.lessons.length===132,'Wrong 1.21.0 lesson count');
 assert(validateSeed(src).length===0,'Reviewed candidate invalid');
 const academic=new BrowserLocalAcademicRepository(localStorage);
 await academic.addPackage({id:src.package_id,version:src.schema_version,
  digest:await sourceDigest(src),source:src,bundle:mapSeed(src),at:Date.now()});
 // A baseline OLD lesson attempt remains in the isolated profile through
 // the entire Unit10 QA flow; no synthetic production data is imported.
 const oldLesson=src.lessons.find(l=>l.id==='LIS-A1-01')!;
 const historicId='qa-existing-attempt-20261107';
 await academic.start(LOCAL_OWNER_ID,{id:historicId,packageId:src.package_id,
  version:src.schema_version,lessonId:oldLesson.id,rootId:historicId,
  status:'started',answers:{'LIS-A1-01-Q1':'test-preserved-old-answer'},
  createdAt:1,evidence:[]});
 const before=JSON.stringify((await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.id===historicId));
 assert(before,'Historical attempt fixture missing');
 const root=createRoot(app);
 root.render(React.createElement(FoundationDemo,{skill:'listening'}));
 await wait(()=>lessonButton(ids[0]),'real listening catalog for candidate');
 const runtime=await localAcademicRuntime();
 assert((await runtime.service.catalog()).version==='1.25.0','Actual browser AcademicService must serve latest v1.25 while preserving the reviewed Unit10 lessons');
 const summary:{id:string,played:boolean,answered:boolean,submitted:boolean,retake:boolean}[]=[];
 for(const id of ids){
  await openLesson(id);
  await startPractice();
  selectTranscriptNotVisible();
  const started=await wait(async()=>recordOf(academic,id,'started'),'new attempt registered');
  const startedId=(await recordOf(academic,id,'started'))!.id;
  // Server denies transcript even if someone bypasses UI.
  let denied=false;
  try{await runtime.service.transcript(startedId)}catch{denied=true}
  assert(denied,id+' transcript backend leaked early');
  // Incomplete answers cannot submit.
  await click('Submit my work');
  await wait(()=>document.querySelector('.foundation-submit-warning')?.textContent?.includes('Please answer all questions'),'incomplete answer notice');
  assert((await recordOf(academic,id,'started'))?.status==='started','Incomplete Listening scored');
  const expectedItems=src.lessons.find(l=>l.id===id)!.activities.length;
  chooseAnswers(expectedItems);
  await waitAnswersComplete();
  // Complete answers without playback still cannot submit.
  await click('Submit my work');
  await wait(()=>document.body.innerText.includes('Play the full audio for this attempt before submitting.'),'unheard audio blocked');
  let attempt=(await recordOf(academic,id,'started'))!;
  assert(attempt.status==='started'&&attempt.playbackCompleted!==true,'Scoring before real playback');
  // First lesson also exercises real Save / Back / Resume through the component.
  if(id===ids[0]){
   await click('Save draft');
   await wait(async()=>{const a=(await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.id===startedId);return a&&Object.keys(a.answers).length===expectedItems;},'draft persisted in browser repo');
   await click('← Back to lessons');
   await wait(()=>lessonButton(id),'catalog after save');
   await openLesson(id);
   await click('Continue saved draft');
   await wait(()=>button('Play full audio'),'resumed Listening player');
   attempt=(await recordOf(academic,id,'started'))!;
   assert(attempt.id===startedId,'Save/Resume switched attempt');
   await waitAnswersComplete();
   selectTranscriptNotVisible();
  }
  await click('Play full audio');
  const duration=(await runtime.service.lesson(id)).audio?.duration??0;
  assert(duration>15&&duration<45,'Invalid original MP3 duration '+id);
  await wait(()=>document.body.innerText.includes('Audio completed and verified for this attempt.'),id+' full genuine playback',Math.ceil(duration*1000+25000));
  attempt=(await recordOf(academic,id,'started'))!;
  assert(attempt.playbackCompleted===true,id+' server did not verify genuine playback');
  await click('Submit my work');
  await wait(async()=>!!(await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.id===startedId&&x.status==='scored'),id+' scored attempt',12000);
  const saved=(await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.id===startedId)!;
  assert(saved.playbackCompleted===true,id+' submitted without verified playback');
  assert(saved.results?.length===expectedItems,id+' wrong result count');
  await wait(()=>button('Read transcript after submission'),id+' transcript button after scoring');
  await click('Read transcript after submission');
  const source=src.lessons.find(l=>l.id===id)?.audio_asset?.source_text||'';
  await wait(()=>document.body.innerText.includes(source.slice(0,55)),id+' transcript after submit');
  await click('Retake lesson');
  await wait(async()=>{const all=await academic.attempts(LOCAL_OWNER_ID);return all.filter(x=>x.lessonId===id&&x.status==='started'&&x.id!==startedId).length===1;},id+' retake started');
  const again=(await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.lessonId===id&&x.status==='started'&&x.id!==startedId)!;
  assert(again.playbackCompleted!==true,id+' retake reused old verified audio');
  assert(Object.keys(again.answers).length===0,id+' retake copied old answers');
  assert((await academic.attempts(LOCAL_OWNER_ID)).some(x=>x.id===startedId&&x.status==='scored'),id+' original scored history disappeared');
  selectTranscriptNotVisible();
  await click('← Back to lessons');
  await wait(()=>lessonButton(ids[0]),'catalog after retake');
  summary.push({id,played:true,answered:true,submitted:true,retake:true});
 }
 const after=JSON.stringify((await academic.attempts(LOCAL_OWNER_ID)).find(x=>x.id===historicId));
 assert(before===after,'Historical attempt changed during candidate MEDIA-01 QA');
 const at=await academic.attempts(LOCAL_OWNER_ID);
 assert(summary.length===3,'Not all lessons tested');
 report('PASS',{suite:'UNIT10_MEDIA01_REAL_FOUNDATION_CHROME',lessons:summary,
  olderAttemptPreserved:true,attempts:at.length,
  transientBrowserProfile:true,liveLearnerDataTouched:false,productionImport:false,
  media01ChromeProductPlayer:'PASS',safariIpad:'NOT_TESTED',releaseAuthorized:false});
}
run().catch(e=>{
 report('FAIL',{error:String(e?.stack||e),jsErrors:errors,html:excerpt()});
});
