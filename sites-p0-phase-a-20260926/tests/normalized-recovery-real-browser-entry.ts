import {planLessonRevisions,type ReleaseRecord} from '../domain/lesson-revision-plan';
import {browserLessonRevisionVault} from '../infrastructure/storage/indexeddb-lesson-revision-vault';
import {verifyRevisionRecoveryV3} from '../domain/lesson-revision-recovery-v3';
import {exportNormalizedBrowserRecoveryV3,previewNormalizedV3Restore,
 restoreNormalizedV3,RECOVERY_V3_MARKER} from '../infrastructure/browser/lesson-revision-portable-recovery';

const dom=document.querySelector('#sle-idb-result') as HTMLElement;
const phase=new URL(location.href).searchParams.get('phase');
const key='g-learning:english:v1:owner:local-family:academic-attempts';
const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
function check(v:unknown,msg:string){if(!v)throw Error(msg)}
function l(id:string,kind:'writing'|'grammar'|'reading'){
 return {id,title:'Synthetic '+id,activities:kind==='writing'?
  [{id:id+'-Q1',prompt:'Write a paragraph',type:'extended_response',
   rubric_id:'RUBRIC-WRITING-A2'}]:
  [{id:id+'-Q1',prompt:'Select an option',type:'single_choice',
   options:[{id:'a',text:'A'},{id:'b',text:'B'}],answer:{correct_option_id:'a'}}]};
}
const writing=l('WRI-A2-01','writing');
const grammar=l('GRA-A2-01','grammar');
const extra=Array.from({length:248},(_,i)=>l('GRA-B2-'+String(i+2).padStart(4,'0'),'grammar'));
function src(version:string,lessons:typeof writing[],rubric:string):ReleaseRecord{
 return {id:'fixture-foundation',version,digest:'trusted-'+version,
 source:{course:{id:'foundation',sequence:lessons.map(x=>x.id)},lessons,
  rubrics:{'RUBRIC-WRITING-A2':{criteria:['task'],guidance:rubric}}}};
}
const old=src('1.18.1',[writing,grammar],'Historic original rubric');
const current=src('1.20.0',[writing,grammar,...extra],'New current rubric');
const attempts=Array.from({length:73},(_,i)=>({
 id:'real-browser-synthetic-'+i,packageId:'fixture-foundation',
 version:i<35?'1.18.1':'1.20.0',
 lessonId:i%2===0?'WRI-A2-01':'GRA-A2-01',
 rootId:'real-browser-synthetic-'+i,
 status:i<52?'scored':'started',
 createdAt:10000+i,answers:{'Q1':'original answer '+i},
 evidence:[],...(i<52?{submittedAt:20000+i,
  results:[{id:'Q1',correct:true,explanation:'Original grading'}]}:{})
}));
const original=JSON.stringify(attempts);
const state=JSON.stringify({writingDraft:'Do not modify original Writing draft'});
const vault=browserLessonRevisionVault();

async function deleteTestVault(){
 return new Promise<void>((resolve,reject)=>{
  const req=indexedDB.deleteDatabase('g-learning-english-lesson-revisions-r2');
  req.onsuccess=()=>resolve();
  req.onerror=()=>reject(Error('Could not reset disposable test-only IDB profile'));
  req.onblocked=()=>reject(Error('Disposable IndexedDB profile remains open'));
 });
}
(async()=>{
 dom.textContent='RUNNING_'+String(phase);
 if(phase==='write'){
  const plan=await planLessonRevisions([old,current],attempts.map(a=>({
   version:a.version,lessonId:a.lessonId,packageId:a.packageId
  })));
  check(plan.active.lessons.length===250,'250 current synthetic lessons expected');
  await vault.install(plan);
  localStorage.setItem(key,original);
  localStorage.setItem(stateKey,state);
  const recovery=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-07T05:00:00.000Z');
  const checked=await verifyRevisionRecoveryV3(recovery.text);
  check(checked.attempts===73,'Complete V3 file should protect 73 attempts');
  check(checked.uniqueRevisions===251,'Current 250 plus one historic Writing revision');
  dom.textContent='EXPORT_CHECKSUM_VERIFIED';
  check(localStorage.getItem(key)===original,'Export cannot mutate the saved attempts');

  // Only this synthetic disposable browser profile is reset for QA.
  // This is NOT production Restore behavior and never touches the user's iPad.
  await deleteTestVault();
  localStorage.removeItem(key);
  localStorage.removeItem(stateKey);
  const empty=browserLessonRevisionVault();
  const preview=await previewNormalizedV3Restore(recovery.text,localStorage,empty);
  check(preview.valid&&preview.attempts===73,'Empty profile preview valid');
  const done=await restoreNormalizedV3(recovery.text,preview.token,true,
   localStorage,empty);
  check(done.attempts===73,'73 attempts restored');
  check(localStorage.getItem(key)===original,'Original answers/results restored byte-for-byte');
  check(localStorage.getItem(stateKey)===state,'Original Writing draft restored');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,'No interrupted marker after success');
  const historic=await empty.resolveHistoric('1.18.1','WRI-A2-01');
  const present=await empty.resolveCurrent('WRI-A2-01');
  check((historic.rubrics['RUBRIC-WRITING-A2'] as {guidance:string}).guidance==='Historic original rubric',
   'Exact old rubric still available after Restore');
  check(historic.revision!==present.revision,'Old and new Writing sources must differ');
  const saved=await empty.snapshot();
  check(saved.blobs.length===251&&saved.active?.lessons.length===250,
   'All required normalized source blobs are in real IDB');
  dom.textContent='PASS_WRITE';
 }else if(phase==='reload'){
  const loaded=browserLessonRevisionVault();
  const state=await loaded.snapshot();
  check(state.active?.version==='1.20.0'&&state.active.lessons.length===250,
   '250 current lessons persist across a separate Chromium process');
  check(state.blobs.length===251,'Old Writing rubric + current lessons persist');
  check(localStorage.getItem(key)===original,'73 exact attempt strings survive restart');
  check(localStorage.getItem(stateKey)===JSON.stringify({
   writingDraft:'Do not modify original Writing draft'}),'Writing draft survives restart');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Completed Restore must not be marked interrupted');
  const oldSource=await loaded.resolveHistoric('1.18.1','WRI-A2-01');
  check((oldSource.rubrics['RUBRIC-WRITING-A2'] as {guidance:string}).guidance==='Historic original rubric',
   'Version-pinned source survives process restart');
  dom.textContent='PASS_RELOAD';
 }else throw Error('Unknown normalized restore QA phase');
})().catch(err=>{
 dom.textContent='FAIL '+String(err)+' '+String((err as Error)?.stack).slice(0,700);
});
