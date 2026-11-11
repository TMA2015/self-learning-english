/**
 * R4c — public V2 Recovery -> verified V3 -> REAL Chromium IndexedDB Restore.
 * Completely disposable test origin and Chrome profile. No production UI,
 * no private Recovery, no migration and NO deletion of real learner data.
 */
import curriculum1180 from '../content/curriculum-1.18.0-candidate.json';
import curriculum1181 from '../content/curriculum-1.18.1-candidate.json';
import curriculum1200 from '../content/curriculum-1.20.0-candidate.json';
import {convertVerifiedV2ToRevisionV3} from '../infrastructure/browser/v2-to-lesson-revision-v3';
import {verifyLocalRecoveryV2} from '../infrastructure/browser/local-recovery';
import {verifyRevisionRecoveryV3,createRevisionRecoveryV3} from '../domain/lesson-revision-recovery-v3';
import {canonicalLessonJSON} from '../domain/lesson-revision-plan';
import {browserLessonRevisionVault} from '../infrastructure/storage/indexeddb-lesson-revision-vault';
import {previewNormalizedV3Restore,restoreNormalizedV3,
 exportNormalizedBrowserRecoveryV3,RECOVERY_V3_MARKER,LEARNER_WRITE_V3_MARKER
} from '../infrastructure/browser/lesson-revision-portable-recovery';

const dom=document.querySelector('#sle-idb-result') as HTMLElement;
const phase=new URL(location.href).searchParams.get('phase');
const versions=[curriculum1180,curriculum1181,curriculum1200] as unknown as Array<{
 schema_version:string;package_id:string;
 lessons:Array<{id:string;activities:Array<{
  id:string;skill_tags:string[];rubric_id?:string;
 }>}>;rubrics:Record<string,unknown>;
}>;
const prefix='g-learning:english:v1';
const attemptKey=prefix+':owner:synthetic-family:academic-attempts';
const writingKey=prefix+':owner:synthetic-family:learner:primary:state';
const packageKey=prefix+':academic:packages';
const extraKey=prefix+':owner:synthetic-family:course-selection';
const permanentTestValues={
 writing:JSON.stringify({writingDraft:'Keep all original synthetic essay text.',
  reviews:[{id:'test-review',feedback:'Preserve original examiner comment'}],
  completed:[1,2,3]}),
 course:JSON.stringify({activeCourseId:'writing',currentIndex:2})
};
function check(value:unknown,message:string){if(!value)throw Error(message)}
function source(v:string){
 const found=versions.find(p=>p.schema_version===v);
 if(!found)throw Error('Missing original public source '+v);
 return found;
}
async function digest(text:string){
 const result=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
 return Array.from(new Uint8Array(result),b=>b.toString(16).padStart(2,'0')).join('');
}
function makeAttempts(){
 return Array.from({length:73},(_,i)=>{
  const s=i<20?versions[0]:i<40?versions[1]:versions[2];
  const explicit=i===0?'VOC-A1-01':i===1?'REA-A1-01':i===2?'WRI-A2-01':undefined;
  const lesson=s.lessons.find(l=>l.id===(explicit??s.lessons[i%s.lessons.length].id));
  check(!!lesson,'Synthetic original lesson missing');
  const q=lesson!.activities[0],id='verified-v2-v3-browser-'+String(i+1).padStart(3,'0');
  return {id,rootId:id,packageId:s.package_id,version:s.schema_version,
   lessonId:lesson!.id,status:i<52?'scored':'started',
   createdAt:1700000000000+i,
   answers:{[q.id]:'verbatim-synthetic-answer-'+i},
   evidence:[{id:'evidence-'+i,at:1700000000000+i,tag:'synthetic'}],
   ...(i<52?{submittedAt:1700000001000+i,
    results:[{id:q.id,correct:i%2===0,
     explanation:'Original synthetic feedback must survive unmodified',
     tags:[...q.skill_tags]}]}:{})
  };
 });
}
async function fixture(){
 const attempts=makeAttempts();
 const records=await Promise.all(versions.map(async(s,i)=>({
  id:s.package_id,version:s.schema_version,
  digest:await digest(canonicalLessonJSON(s)),source:s,at:i+1
 })));
 const rows=[
  {key:packageKey,value:JSON.stringify({schema:2,retention:true,records})},
  {key:attemptKey,value:JSON.stringify(attempts)},
  {key:writingKey,value:permanentTestValues.writing},
  {key:extraKey,value:permanentTestValues.course}
 ].sort((a,b)=>a.key.localeCompare(b.key));
 const v2=JSON.stringify({
  format:'g-learning-english.recovery',schemaVersion:2,
  exportedAt:'2026-11-10T09:00:00.000Z',
  entries:rows,sha256:await digest(JSON.stringify(rows))
 },null,2)+'\n';
 return {v2,rows,attempts};
}
/** R4h test-only helpers. The deployed SLE app does NOT use these locks. */
function r4hRequiredString(value:string|null,label:string):string{
 if(value===null)throw Error('R4h required original data missing: '+label);
 return value;
}
const R4H_LOCK='sle-issue103-r4h-disposable-learner-writes';
const R4H_CHANNEL='sle-issue103-r4h-two-page-learner-writes';
const R4H_SCRATCH='__sle_issue103_r4h_naive_collision_scratch__';
function r4hAnswer(raw:string,index:number,value:string){
 const entries=JSON.parse(raw) as Array<{answers:Record<string,string>}>;
 check(entries.length===73&&entries[index]?.answers,
  'R4h must keep all 73 original synthetic attempt records');
 const answerId=Object.keys(entries[index].answers)[0];
 check(!!answerId,'R4h synthetic attempt answer key missing');
 entries[index].answers[answerId]=value;
 return JSON.stringify(entries);
}
function r4hReview(raw:string,id:string){
 const source=JSON.parse(raw) as {reviews:Array<{id:string;feedback:string}>};
 check(Array.isArray(source.reviews)&&source.reviews.length>=1,
  'R4h must preserve the original synthetic Writing review');
 source.reviews.push({id,feedback:'R4h synthetic feedback from '+id});
 return JSON.stringify(source);
}
function r4hAssertMerged(
 original:string,attemptsRaw:string,writingRaw:string
){
 const originalEntries=JSON.parse(original) as Array<{answers:Record<string,string>}>;
 const actual=JSON.parse(attemptsRaw) as Array<{answers:Record<string,string>}>;
 check(actual.length===73,'R4h merged attempt cardinality changed');
 for(let i=0;i<73;i++){
  if(i===71||i===72)continue;
  check(JSON.stringify(actual[i])===JSON.stringify(originalEntries[i]),
   'R4h changed an unrelated original attempt at '+i);
 }
 const a=Object.keys(actual[71].answers)[0],b=Object.keys(actual[72].answers)[0];
 check(actual[71].answers[a]==='R4H_OWNER_DRAFT_EDIT'&&
  actual[72].answers[b]==='R4H_WORKER_DRAFT_EDIT',
  'R4h concurrent owner/worker answer edits were not both retained');
 const writing=JSON.parse(writingRaw) as {reviews:Array<{id:string;feedback:string}>};
 check(writing.reviews.length===3&&writing.reviews[0].id==='test-review'&&
  writing.reviews[1].id==='r4h-owner-review'&&
  writing.reviews[2].id==='r4h-worker-review',
  'R4h lost or reordered the original and two new Writing reviews');
}


/**
 * R4o — ISOLATED research-only two-value atomic transaction proof.
 * This database is never opened by the production academic service.
 * No original learner/profile key is written by this helper.
 */
const R4O_DB='sle-issue103-r4o-test-atomic-learner-pair';
type R4OPair={attempts:string;writing:string;sequence:number;checksum:string};
async function r4oOpenDB():Promise<IDBDatabase>{
 return await new Promise((resolve,reject)=>{
  const req=indexedDB.open(R4O_DB,1);
  req.onupgradeneeded=()=>{
   const db=req.result;
   if(!db.objectStoreNames.contains('paired'))
    db.createObjectStore('paired');
  };
  req.onerror=()=>reject(req.error??Error('R4o could not open isolated IDB'));
  req.onblocked=()=>reject(Error('R4o test-only IDB open blocked'));
  req.onsuccess=()=>resolve(req.result);
 });
}
async function r4oRaw(db:IDBDatabase){
 return await new Promise<{attempts:unknown;writing:unknown;commit:unknown}>(
  (resolve,reject)=>{
   const tx=db.transaction(['paired'],'readonly');
   const store=tx.objectStore('paired');
   const a=store.get('attempts'),w=store.get('writing'),
    c=store.get('commit');
   tx.oncomplete=()=>resolve({
    attempts:a.result,writing:w.result,commit:c.result
   });
   tx.onabort=()=>reject(tx.error??Error('R4o IDB read aborted'));
   tx.onerror=()=>reject(tx.error??Error('R4o IDB read failed'));
  });
}
async function r4oPair(db:IDBDatabase):Promise<R4OPair>{
 const raw=await r4oRaw(db);
 check(typeof raw.attempts==='string'&&typeof raw.writing==='string'&&
  !!raw.commit&&typeof raw.commit==='object',
  'R4o missing a committed IDB paired snapshot: FAIL CLOSED');
 const meta=raw.commit as {sequence?:number;checksum?:string};
 check(Number.isSafeInteger(meta.sequence)&&typeof meta.checksum==='string',
  'R4o missing committed IDB sequence/checksum: FAIL CLOSED');
 const actual=await digest(canonicalLessonJSON({
  attempts:raw.attempts,writing:raw.writing,sequence:meta.sequence
 }));
 check(actual===meta.checksum,
  'R4o IDB paired snapshot does not match commit digest: FAIL CLOSED');
 return {attempts:raw.attempts,writing:raw.writing,
  sequence:meta.sequence!,checksum:meta.checksum!};
}
async function r4oWritePair(
 db:IDBDatabase,attempts:string,writing:string,sequence:number,
 abortDeliberately:boolean
):Promise<'ABORTED'|'COMMITTED'>{
 const checksum=await digest(canonicalLessonJSON({
  attempts,writing,sequence
 }));
 return await new Promise((resolve,reject)=>{
  // Strict is a durability HINT, not a machine-power-loss guarantee.
  const tx=db.transaction(['paired'],'readwrite',{durability:'strict'});
  if(tx.durability!=='strict'){
   try{tx.abort()}catch{}
   reject(Error('R4o native IDB strict durability option unavailable'));
   return;
  }
  const store=tx.objectStore('paired');
  store.put(attempts,'attempts');
  store.put(writing,'writing');
  store.put({sequence,checksum},'commit');
  tx.oncomplete=()=>abortDeliberately?
   reject(Error('R4o expected abort but transaction committed')):
   resolve('COMMITTED');
  tx.onabort=()=>abortDeliberately?resolve('ABORTED'):
   reject(tx.error??Error('R4o unexpected IDB write abort'));
  tx.onerror=()=>{if(!abortDeliberately)
   reject(tx.error??Error('R4o unexpected IDB write failure'))};
  if(abortDeliberately)tx.abort();
 });
}
async function r4oTamperOneTestKey(db:IDBDatabase,value:string){
 await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction(['paired'],'readwrite',{durability:'strict'});
  tx.objectStore('paired').put(value,'attempts');
  tx.oncomplete=()=>resolve();
  tx.onabort=()=>reject(tx.error??Error('R4o test-only corrupt write aborted'));
  tx.onerror=()=>reject(tx.error??Error('R4o test-only corrupt write failed'));
 });
}

const vault=browserLessonRevisionVault();
(async()=>{
 dom.textContent='RUNNING_'+phase;
 if(phase==='write'){
  check(localStorage.length===0,'R4c requires a fresh disposable browser profile');
  const initial=await vault.snapshot();
  check(initial.active===null&&initial.aliases.length===0&&initial.blobs.length===0,
   'R4c requires an initially empty disposable IndexedDB');
  const {v2,rows,attempts}=await fixture();
  const originalV2Bytes=new TextEncoder().encode(v2).length;
  const v2Verified=await verifyLocalRecoveryV2(v2);
  check(v2Verified.attempts===73&&v2Verified.versions===3,
   'Original complete V2 checksum/source closure failed');
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(v3.originalV2Sha256===v2Verified.sha256,
   'Converted V3 lost exact original V2 checksum');
  check(verified.attempts===73&&verified.file.active.version==='1.20.0',
   'Converted V3 does not have expected current curriculum or attempts');
  check(v3.v3Bytes<v3.v2Bytes,
   'Three full cumulative V2 versions must compress in this fixture');
  check(new TextEncoder().encode(v2).length===originalV2Bytes,
   'Original V2 text changed during conversion');
  check(verified.file.entries.every(e=>rows.some(r=>r.key===e.key&&r.value===e.value))
   &&verified.file.entries.length===rows.length-1,
   'Learner values must be byte-identical; old package key must be removed');
  check(!verified.file.entries.some(e=>e.key===packageKey),
   'V3 may not restore legacy cumulative package key');

  // A populated browser must NOT accept restore: block before any write.
  localStorage.setItem(writingKey,'occupied-profile-sentinel');
  const occupied=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(!occupied.valid,'Restore into occupied profile must be blocked');
  check(localStorage.getItem(writingKey)==='occupied-profile-sentinel',
   'Rejected preview must not overwrite learner state');
  localStorage.removeItem(writingKey); // TEST-ONLY disposable sentinel

  // A changed V2 file without a rebuilt checksum may not convert.
  const tampered=JSON.parse(v2);
  const row=tampered.entries.find((e:{key:string})=>e.key===writingKey);
  row.value='unapproved-change';
  let tamperRejected=false;
  try{await convertVerifiedV2ToRevisionV3(JSON.stringify(tampered))}
  catch{tamperRejected=true}
  check(tamperRejected,'Tampered original V2 checksum must be rejected');
  check(localStorage.length===0,'Read-only conversion changed browser storage');

  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid&&preview.attempts===73&&!preview.resuming,
   'Empty-profile V3 restore preview must PASS');
  const restored=await restoreNormalizedV3(v3.text,preview.token,true,localStorage,vault);
  check(restored.attempts===73,'Restore failed to commit all 73 attempts');
  check(localStorage.getItem(attemptKey)===rows.find(e=>e.key===attemptKey)!.value,
   'Saved answers, statuses and feedback not restored byte-identically');
  check(localStorage.getItem(writingKey)===permanentTestValues.writing,
   'Original writing and reviews not restored byte-identically');
  check(localStorage.getItem(extraKey)===permanentTestValues.course,
   'Original course state not restored byte-identically');
  check(localStorage.getItem(packageKey)===null,
   'Legacy V2 packages must not be re-created during normalized V3 restore');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Completed V3 restore has interrupted marker');
  const oldVocabulary=await vault.resolveHistoric('1.18.0','VOC-A1-01');
  const oldReading=await vault.resolveHistoric('1.18.0','REA-A1-01');
  for(const [id,blob] of [
   ['VOC-A1-01',oldVocabulary],['REA-A1-01',oldReading]
  ] as const){
   const actual=source('1.18.0').lessons.find(l=>l.id===id);
   check(canonicalLessonJSON(blob.lesson)===canonicalLessonJSON(actual),
    'Historic original content changed for '+id);
   const latest=await vault.resolveCurrent(id);
   check(blob.revision!==latest.revision,
    'Original revised lesson was incorrectly mapped to latest: '+id);
  }
  const originalWriting=source('1.18.0').lessons.find(l=>l.id==='WRI-A2-01');
  check(!!originalWriting,'Expected old Writing lesson missing');
  const writingBlob=await vault.resolveHistoric('1.18.0','WRI-A2-01');
  check(canonicalLessonJSON(writingBlob.lesson)===canonicalLessonJSON(originalWriting),
   'Original Writing lesson changed during restore');
  const rubricId=originalWriting!.activities.find(q=>q.rubric_id)?.rubric_id;
  check(!!rubricId,'Historical Writing has no referenced rubric');
  check(canonicalLessonJSON(writingBlob.rubrics[rubricId!])===
   canonicalLessonJSON(source('1.18.0').rubrics[rubricId!]),
   'Original Writing rubric lost');
  const browserBackup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T09:20:00.000Z');
  const exported=await verifyRevisionRecoveryV3(browserBackup.text);
  check(exported.attempts===73&&exported.file.active.version==='1.20.0',
   'Browser re-export after real restore incomplete');
  check(exported.file.entries.find(e=>e.key===attemptKey)?.value===
   JSON.stringify(attempts),'Re-export modified original attempt bytes');
  check((await vault.snapshot()).active?.lessons.length===123,
   'Restored current public 1.20.0 catalog incorrect');
  dom.textContent='PASS_WRITE '+JSON.stringify({
   v2Bytes:v3.v2Bytes,v3Bytes:v3.v3Bytes,
   historicalVersions:3,attempts:73,
   savedAttemptsByteIdentical:true,
   oldWritingRubricPinned:true,
   realIndexedDBRestore:true,reexportVerified:true,
   corruptedV2Blocked:true,occupiedProfileBlocked:true
  });
 }else if(phase==='reload'){
  const {rows}=await fixture();
  const saved=await vault.snapshot();
  check(saved.active?.version==='1.20.0'&&saved.active.lessons.length===123,
   'Current manifest did not survive Chromium process restart');
  const expectedAttempts=rows.find(e=>e.key===attemptKey)!.value;
  const storedAttempts=localStorage.getItem(attemptKey);
  if(storedAttempts!==expectedAttempts){
   const firstMismatch=storedAttempts===null?-1:[...expectedAttempts].findIndex(
    (c,i)=>storedAttempts[i]!==c);
   throw Error('History changed across restart '+JSON.stringify({
    actualLength:storedAttempts?.length??-1,
    expectedLength:expectedAttempts.length,
    actualDigest:storedAttempts===null?'MISSING':await digest(storedAttempts),
    expectedDigest:await digest(expectedAttempts),
    firstMismatch,
    storageKeys:Array.from({length:localStorage.length},(_,i)=>localStorage.key(i))
   }));
  }
  check(localStorage.getItem(writingKey)===permanentTestValues.writing,
   'Writing and reviews changed across restart');
  check(localStorage.getItem(extraKey)===permanentTestValues.course,
   'Course state changed across restart');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Unexpected unfinished V3 restore after restart');
  check((await vault.resolveHistoric('1.18.0','WRI-A2-01')).lesson.id==='WRI-A2-01',
   'Old rubric source did not survive browser restart');
  check((await vault.resolveHistoric('1.18.0','VOC-A1-01')).revision!==
   (await vault.resolveCurrent('VOC-A1-01')).revision,
   'Historically revised Vocabulary content was lost across restart');
  const verified=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T09:40:00.000Z');
  check((await verifyRevisionRecoveryV3(verified.text)).attempts===73,
   'Recovered browser could not export another complete V3');
  dom.textContent='PASS_RELOAD';
 }else if(phase==='interrupted'){
  // Disposable profile only. Native IndexedDB is real; the injected quota
  // failure in the localStorage adapter is synthetic, not a Safari quota test.
  check(localStorage.length===0,'Interrupted fixture must start empty');
  check((await vault.snapshot()).active===null,'Interrupted fixture IDB must start empty');
  const {v2}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(verified.attempts===73,'Interrupt fixture must have 73 attempts');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid&&!preview.resuming,'Fresh interrupted preview not valid');
  let injected=false;
  const failingStorage={
   get length(){return localStorage.length},
   key:(i:number)=>localStorage.key(i),
   getItem:(key:string)=>localStorage.getItem(key),
   removeItem:(key:string)=>localStorage.removeItem(key),
   setItem:(key:string,value:string)=>{
    // The file entries sort attempts before course selection. Force failure
    // after the large 73-attempt key has been written, to prove rollback.
    if(key===extraKey&&!injected){
     injected=true;
     check(localStorage.getItem(attemptKey)!==null,
      'Fault must occur after the first attempt payload write');
     const failure=new Error('R4d synthetic quota interruption');
     failure.name='QuotaExceededError';
     throw failure;
    }
    localStorage.setItem(key,value);
   }
  };
  let blocked=false;
  try{await restoreNormalizedV3(v3.text,preview.token,true,failingStorage,vault)}
  catch(e){blocked=/restore incomplete|interrupted marker preserved/i.test(String(e))}
  check(injected&&blocked,'Injected localStorage write failure must fail closed');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===verified.file.sha256,
   'Interrupted marker must pin the same V3 archive');
  check(localStorage.getItem(attemptKey)===null,
   'Newly written 73-attempt payload must be rolled back');
  check(localStorage.getItem(extraKey)===null&&
   localStorage.getItem(writingKey)===null,
   'No incomplete original learner keys may remain');
  check(localStorage.length===1,'Only recovery marker may survive rollback');
  const partial=await vault.snapshot();
  check(partial.active?.version==='1.20.0'&&
   partial.active.lessons.length===123&&partial.aliases.length>0,
   'Atomic indexedDB source install must be preserved for same-file resume');
  let exportBlocked=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T10:01:00.000Z')}
  catch(e){exportBlocked=/interrupted Recovery blocks new exports/i.test(String(e))}
  check(exportBlocked,'Incomplete restore must not be exported as a full backup');
  const alternate=await createRevisionRecoveryV3({
   active:verified.file.active,aliases:verified.file.aliases,blobs:verified.file.blobs
  },verified.file.entries,'2026-11-10T11:01:00.000Z');
  const wrong=await previewNormalizedV3Restore(alternate.text,localStorage,vault);
  check(!wrong.valid&&wrong.errors.some(x=>/different Recovery V3 file/.test(x)),
   'Pending marker must reject a different but checksum-valid backup');
  dom.textContent='PASS_INTERRUPTED '+JSON.stringify({
   syntheticQuotaInjected:true,attemptsRolledBack:true,
   markerRetained:true,realIDBContentsPreserved:true,
   partialExportBlocked:true,wrongValidFileBlocked:true
  });
 }else if(phase==='resume'){
  // New Chromium process, same disposable profile and exact original V2.
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(localStorage.getItem(RECOVERY_V3_MARKER)===verified.file.sha256,
   'Interrupted marker did not persist over graceful Chrome restart');
  check(localStorage.getItem(attemptKey)===null,
   'Failed first restore must not leave partial attempts');
  const before=await vault.snapshot();
  check(before.active?.version==='1.20.0'&&before.active.lessons.length===123,
   'Previous IDB source transaction did not persist');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid&&preview.resuming&&preview.attempts===73,
   'Same-file restore must be resumable after Chromium restart');
  const restored=await restoreNormalizedV3(
   v3.text,preview.token,true,localStorage,vault);
  check(restored.attempts===73,'Resumed restore did not finish all attempts');
  check(localStorage.getItem(attemptKey)===
   rows.find(x=>x.key===attemptKey)!.value,'Resumed attempts differ byte-for-byte');
  check(localStorage.getItem(extraKey)===permanentTestValues.course,
   'Course selection changed after resume');
  check(localStorage.getItem(writingKey)===permanentTestValues.writing,
   'Writing/reviews changed after resume');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Successful resume must clear interrupted marker');
  const history=await vault.resolveHistoric('1.18.0','WRI-A2-01');
  const sourceWriting=source('1.18.0').lessons.find(l=>l.id==='WRI-A2-01');
  check(canonicalLessonJSON(history.lesson)===canonicalLessonJSON(sourceWriting),
   'Original Writing source changed during resumed restore');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T11:12:00.000Z');
  check((await verifyRevisionRecoveryV3(backup.text)).attempts===73,
   'Completed resume cannot export full verified V3');
  dom.textContent='PASS_RESUME '+JSON.stringify({
   resumingMarkerVerified:true,idbReinstallIdempotent:true,
   restoredAttempts:73,originalWritingSourcePinned:true,
   resumedBackupVerified:true
  });
 }else if(phase==='resume-reload'){
  const {rows}=await fixture();
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Second restart must have no pending marker');
  check(localStorage.getItem(attemptKey)===
   rows.find(x=>x.key===attemptKey)!.value,
   'Resumed original attempt payload not durable across second restart');
  check(localStorage.getItem(extraKey)===permanentTestValues.course&&
   localStorage.getItem(writingKey)===permanentTestValues.writing,
   'Writing/course learner entries lost after second restart');
  const snapshot=await vault.snapshot();
  check(snapshot.active?.lessons.length===123,
   'Original normalized current source not retained after resumed restart');
  check((await vault.resolveHistoric('1.18.0','REA-A1-01')).lesson.id==='REA-A1-01',
   'Historical source disappeared after resumed restart');
  dom.textContent='PASS_RESUME_RELOAD';
 }else if(phase==='native-quota'){
  // Real Chromium localStorage QuotaExceededError, not a fake adapter.
  // The scratch key is not part of the English learner namespace.
  const paddingKey='__sle_issue103_r4e_disposable_quota_padding__';
  check(localStorage.length===0,'Native quota test requires empty disposable Chrome profile');
  check((await vault.snapshot()).active===null,
   'Native quota test requires empty disposable IndexedDB');
  const {v2}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(verified.attempts===73,'Native quota test must protect 73 synthetic attempts');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid&&!preview.resuming,'Empty profile preview must validate before scratch padding');
  // Measure actual browser quota by overwriting the same scratch key.
  // Bounds are deliberate; if Chromium's policy is different, fail,
  // do not silently convert this into a synthetic quota test.
  let low=0,high=8_000_000,nativeExceeded=false;
  while(low+256<high){
   const mid=Math.floor((low+high)/2);
   try{localStorage.setItem(paddingKey,'x'.repeat(mid));low=mid}
   catch(e){
    check((e as Error)?.name==='QuotaExceededError',
     'Unexpected native Chromium storage error during quota measurement');
    nativeExceeded=true;high=mid;
   }
  }
  check(nativeExceeded&&low>=1_000_000&&high<8_000_000,
   'Native quota boundary was not measured inside required range');
  const headroom=4096;
  check(low>headroom,'Measured native quota is too small');
  localStorage.setItem(paddingKey,'x'.repeat(low-headroom));
  check(localStorage.getItem(paddingKey)?.length===low-headroom,
   'Actual near-quota filler could not be stored');
  // Recompute preview AFTER adding only a non-English test-owned key.
  // The preview is tied to browser-visible learner/source state.
  const ready=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(ready.valid&&ready.attempts===73,'Quota padding must not alter learner state');
  let nativeFailure='';
  try{await restoreNormalizedV3(v3.text,ready.token,true,localStorage,vault)}
  catch(e){nativeFailure=String(e)}
  check(nativeFailure.includes('QuotaExceededError')&&
   nativeFailure.includes('interrupted marker preserved'),
   'Native Chromium quota must reject restore and preserve interruption marker: '+
    nativeFailure.slice(0,240));
  check(localStorage.getItem(RECOVERY_V3_MARKER)===verified.file.sha256,
   'Native quota failure must retain correct V3 checksum marker');
  check(localStorage.getItem(attemptKey)===null&&
   localStorage.getItem(extraKey)===null&&
   localStorage.getItem(writingKey)===null,
   'Native quota failure may not leave partial learner history');
  check(localStorage.getItem(paddingKey)?.length===low-headroom,
   'Failure must not unexpectedly delete test quota filler');
  check((await vault.snapshot()).active?.lessons.length===123,
   'Original revision data must survive native quota failure in IndexedDB');
  let failedBackup=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T12:00:00.000Z')}
  catch(e){failedBackup=/interrupted Recovery blocks new exports/i.test(String(e))}
  check(failedBackup,'Incomplete quota-blocked profile may not export a backup');
  dom.textContent='PASS_NATIVE_QUOTA '+JSON.stringify({
   nativeQuotaExceeded:true,measuredAcceptedPaddingChars:low,
   headroomChars:headroom,restoredAttempts:0,
   original73HistoryNotPartiallyWritten:true,
   pendingMarkerRetained:true,realIDBStillComplete:true
  });
 }else if(phase==='native-quota-resume'){
  const paddingKey='__sle_issue103_r4e_disposable_quota_padding__';
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(localStorage.getItem(RECOVERY_V3_MARKER)===verified.file.sha256,
   'Native quota interruption marker lost over Chrome restart');
  check(localStorage.getItem(paddingKey)!==null,
   'Quota padding was not persisted over graceful Chrome restart');
  check(localStorage.getItem(attemptKey)===null,
   'Native quota failure wrote a partial attempt before recovery');
  const current=await vault.snapshot();
  check(current.active?.lessons.length===123&&current.aliases.length>0,
   'Historic IndexedDB source disappeared after native quota restart');
  // Remove ONLY the uniquely named scratch padding key from a disposable
  // Chromium profile. Never touch real user or owner-scoped keys.
  localStorage.removeItem(paddingKey);
  check(localStorage.getItem(paddingKey)===null,
   'Test-only quota padding was not removed');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid&&preview.resuming&&preview.attempts===73,
   'Only matching original verified V3 may resume after quota recovery');
  const restored=await restoreNormalizedV3(
   v3.text,preview.token,true,localStorage,vault);
  check(restored.attempts===73,
   'Native quota recovered profile did not restore 73 attempts');
  check(localStorage.getItem(attemptKey)===
   rows.find(x=>x.key===attemptKey)!.value,
   'Native quota recovery modified serialized attempt/grade history');
  check(localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'Native quota recovery modified original Writing/course state');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Completed native quota recovery must clear interrupted marker');
  const historic=await vault.resolveHistoric('1.18.0','WRI-A2-01');
  const oldWriting=source('1.18.0').lessons.find(l=>l.id==='WRI-A2-01');
  check(canonicalLessonJSON(historic.lesson)===canonicalLessonJSON(oldWriting),
   'Native quota resume changed historical Writing source');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T12:30:00.000Z');
  check((await verifyRevisionRecoveryV3(backup.text)).attempts===73,
   'Recovered native quota profile does not export complete V3');
  dom.textContent='PASS_NATIVE_QUOTA_RESUME';
 }else if(phase==='native-quota-reload'){
  const {rows}=await fixture();
  const paddingKey='__sle_issue103_r4e_disposable_quota_padding__';
  check(localStorage.getItem(paddingKey)===null,
   'Disposal test padding reappeared after resumed recovery');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Quota recovered profile remained marked incomplete after restart');
  check(localStorage.getItem(attemptKey)===
   rows.find(x=>x.key===attemptKey)!.value,
   'Recovered 73-attempt bytes lost after second Chromium restart');
  check(localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'Writing/course source changed after quota recovery restart');
  const current=await vault.snapshot();
  check(current.active?.lessons.length===123,'Current lessons vanished on restart');
  check((await vault.resolveHistoric('1.18.0','REA-A1-01')).lesson.id==='REA-A1-01',
   'Historical Reading source missing after quota recovery');
  dom.textContent='PASS_NATIVE_QUOTA_RELOAD';
 }else if(phase==='idb-blocked-upgrade'){
  // R4f: real native IndexedDB versionchange/onblocked, one disposable
  // profile only. Simulates an uncooperative older connection (e.g. old
  // document holding v1 open). Does not prove actual Safari multi-tab races.
  const dbName='g-learning-english-lesson-revisions-r2';
  check(localStorage.length===0,'R4f requires a completely empty disposable profile');
  check((await vault.snapshot()).active===null,
   'R4f requires an initially empty disposable IDB');
  const {v2,rows}=await fixture();
  const normalized=await convertVerifiedV2ToRevisionV3(v2);
  const complete=await verifyRevisionRecoveryV3(normalized.text);
  check(complete.attempts===73,'R4f requires 73 checksum-verified synthetic attempts');
  const preview=await previewNormalizedV3Restore(normalized.text,localStorage,vault);
  check(preview.valid&&!preview.resuming,'Initial empty-profile preview failed');
  const restored=await restoreNormalizedV3(
   normalized.text,preview.token,true,localStorage,vault);
  check(restored.attempts===73,'Initial R4f restore did not preserve 73 attempts');
  const before=await vault.snapshot();
  check(before.active?.lessons.length===123&&before.blobs.length>=123,
   'Initial normalized content snapshot incomplete');
  const expectedAttempts=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===expectedAttempts,
   'Original R4f history unexpectedly changed before versionchange');

  // Hold a native v1 handle open even when it receives "versionchange".
  const held=await new Promise<IDBDatabase>((resolve,reject)=>{
   const request=indexedDB.open(dbName,1);
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
  check(held.version===1,'Unexpected original research vault version');
  let versionchangeSeen=false,upgradeBlocked=false,upgradeComplete=false;
  held.onversionchange=()=>{versionchangeSeen=true;/* deliberate old-handle hold */};
  const upgraded:{connection?:IDBDatabase}={};
  let upgradeFailure='';
  const finished=new Promise<void>(resolve=>{
   const request=indexedDB.open(dbName,2);
   request.onblocked=()=>{upgradeBlocked=true};
   request.onupgradeneeded=()=>{}; // Never change/remove the three data stores.
   request.onsuccess=()=>{
    upgraded.connection=request.result;upgradeComplete=true;resolve();
   };
   request.onerror=()=>{
    upgradeFailure=String(request.error);resolve();
   };
  });
  try{
   await new Promise<void>(resolve=>setTimeout(resolve,250));
   check(versionchangeSeen&&upgradeBlocked&&!upgradeComplete,
    'Native IndexedDB onblocked/versionchange was not observed while v1 open');
   check(localStorage.getItem(attemptKey)===expectedAttempts&&
    localStorage.getItem(writingKey)===permanentTestValues.writing,
    'Native blocked upgrade changed original learner bytes');
  }finally{
   held.close(); // Only close disposable raw test connection, never delete IDB.
  }
  await Promise.race([
   finished,
   new Promise<never>((_,reject)=>setTimeout(
    ()=>reject(Error('Native blocked upgrade never completed after closing v1')),5000))
  ]);
  check(!upgradeFailure&&upgradeComplete&&upgraded.connection?.version===2,
   'Native versionchange did not complete after test handle release: '+upgradeFailure);
  upgraded.connection!.close();

  // The version-1-only R2 vault MUST reject an unexpected newer IDB schema;
  // do not treat a missing source as permission to load the latest lesson.
  let rejectedRead=false;
  try{await vault.snapshot()}catch(e){
   rejectedRead=/Cannot open lesson revision database/.test(String(e));
  }
  check(rejectedRead,'Research V3 reader must fail closed on unknown IDB version');
  let rejectedBackup=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T14:00:00.000Z')}
  catch(e){rejectedBackup=/Cannot open lesson revision database/.test(String(e))}
  check(rejectedBackup,'An unknown IDB version may not create an incomplete V3 backup');
  let rejectedRestore=false;
  try{await previewNormalizedV3Restore(normalized.text,localStorage,vault)}
  catch(e){rejectedRestore=/Cannot open lesson revision database/.test(String(e))}
  check(rejectedRestore,'An unknown IDB version must block Restore preview');
  check(localStorage.getItem(attemptKey)===expectedAttempts&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'Blocked version upgrade unexpectedly modified learner storage');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Unknown schema cannot create a false interrupted Restore marker');

  // Read the same raw IndexedDB v2 stores without using the v1-only adapter:
  // this verifies content preservation, NOT runtime compatibility.
  const latest=await new Promise<IDBDatabase>((resolve,reject)=>{
   const request=indexedDB.open(dbName);
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
  check(latest.version===2,'IndexedDB did not persist upgraded test schema');
  const sourceAfter=await new Promise<{
   manifest:unknown;blobs:unknown[];aliases:unknown[]
  }>((resolve,reject)=>{
   const tx=latest.transaction(
    ['active-manifest','revision-blobs','historic-aliases'],'readonly');
   const mr=tx.objectStore('active-manifest').get('current');
   const bs=tx.objectStore('revision-blobs').getAll();
   const as=tx.objectStore('historic-aliases').getAll();
   tx.oncomplete=()=>resolve({
    manifest:mr.result,blobs:bs.result,aliases:as.result
   });
   tx.onabort=()=>reject(tx.error??Error('Raw IndexedDB verification aborted'));
   tx.onerror=()=>reject(tx.error??Error('Raw IndexedDB verification failed'));
  });
  latest.close();
  const activeValue=(sourceAfter.manifest as {value?:unknown})?.value;
  check(canonicalLessonJSON(activeValue)===canonicalLessonJSON(before.active)&&
   sourceAfter.blobs.length===before.blobs.length&&
   sourceAfter.aliases.length===before.aliases.length,
   'Native schema versionchange altered the immutable source inventory');
  dom.textContent='PASS_IDB_BLOCKED '+JSON.stringify({
   actualNativeVersionchange:true,actualNativeBlockedEvent:true,
   heldV1Connection:true,upgradeCompletedOnlyAfterHandleClosed:true,
   unknownV2SchemaRejectedByV1Adapter:true,unsafeBackupBlocked:true,
   unsafeRestorePreviewBlocked:true,syntheticAttemptsUnchanged:73,
   rawBlobsPreserved:sourceAfter.blobs.length,
   rawAliasesPreserved:sourceAfter.aliases.length
  });
 }else if(phase==='idb-blocked-reload'){
  const {rows}=await fixture();
  const original=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===original&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'Original synthetic learner data lost across upgraded IndexedDB restart');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Blocked IDB versionchange left a false partial Restore marker');
  let rejected=false;
  try{await vault.resolveHistoric('1.18.0','WRI-A2-01')}
  catch(e){rejected=/Cannot open lesson revision database/.test(String(e))}
  check(rejected,'Version-1-only research reader wrongly accepted newer IDB after restart');
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const req=indexedDB.open('g-learning-english-lesson-revisions-r2');
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>reject(req.error);
  });
  check(db.version===2&&db.objectStoreNames.contains('revision-blobs')&&
   db.objectStoreNames.contains('historic-aliases')&&
   db.objectStoreNames.contains('active-manifest'),
   'Raw immutable IndexedDB stores missing after upgraded-profile restart');
  const current=await new Promise<{value?:{lessons?:unknown[]}}|undefined>((resolve,reject)=>{
   const tx=db.transaction('active-manifest','readonly');
   const req=tx.objectStore('active-manifest').get('current');
   tx.oncomplete=()=>resolve(req.result);
   tx.onabort=()=>reject(tx.error??Error('Raw manifest read aborted'));
  });
  db.close();
  check(current?.value?.lessons?.length===123,
   'Original current curriculum not preserved after blocked upgrade restart');
  dom.textContent='PASS_IDB_BLOCKED_RELOAD';
 }else if(phase==='multi-owner'){
  // R4g: TWO genuine independent Chromium page targets, same origin/profile.
  // Owner page holds v1; second page must encounter native blocked upgrade.
  const dbName='g-learning-english-lesson-revisions-r2';
  const channelName='sle-r4g-two-page-native-versionchange';
  check(localStorage.length===0,'R4g requires new disposable browser profile');
  check((await vault.snapshot()).active===null,'R4g requires empty test IndexedDB');
  const {v2,rows}=await fixture();
  const normalized=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(normalized.text);
  check(verified.attempts===73,'R4g synthetic V2 source count wrong');
  const preview=await previewNormalizedV3Restore(normalized.text,localStorage,vault);
  check(preview.valid&&!preview.resuming,'R4g first restore preview must pass');
  const done=await restoreNormalizedV3(normalized.text,preview.token,true,localStorage,vault);
  check(done.attempts===73,'R4g must restore 73 synthetic attempts before contention');
  const original=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===original,
   'R4g initial synthetic answers have changed');
  const sourceBefore=await vault.snapshot();
  check(sourceBefore.active?.lessons.length===123&&sourceBefore.aliases.length>0,
   'R4g requires historical source aliases before launching another page');
  const held=await new Promise<IDBDatabase>((resolve,reject)=>{
   const req=indexedDB.open(dbName,1);
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>reject(req.error??Error('Cannot open old-tab v1 connection'));
  });
  check(held.version===1,'Owner page must hold actual version 1 IndexedDB');
  let versionchangeSeen=false,workerReady=false,workerBlocked=false;
  let releaseGranted=false,workerCompleted=false;
  held.onversionchange=()=>{versionchangeSeen=true};
  const channel=new BroadcastChannel(channelName);
  const failure=(value:unknown)=>{
   dom.textContent='FAIL_R4G_OWNER '+String(value);
  };
  channel.onmessage=async event=>{
   try{
    const msg=event.data as {type?:string;rawBlobs?:number;rawAliases?:number;
     attempts?:number;workerTab?:boolean;unknownSchemaBlocked?:boolean;
     message?:string};
    if(msg.type==='WORKER_READY'){
     check(!workerReady,'Duplicate R4g worker readiness');
     workerReady=true;channel.postMessage({type:'BEGIN_UPGRADE'});
    }else if(msg.type==='WORKER_BLOCKED'){
     check(workerReady&&!workerBlocked&&!releaseGranted,
      'Upgrade did not report the expected blocked order');
     check(versionchangeSeen,'Actual old-tab versionchange event missing');
     check(localStorage.getItem(attemptKey)===original,
      'Historical attempt payload changed during native cross-tab blocking');
     check(localStorage.getItem(writingKey)===permanentTestValues.writing,
      'Writing source changed while another tab is blocked');
     workerBlocked=true;
     dom.textContent='READY_R4G_TWO_TABS_BLOCKED';
    }else if(msg.type==='WORKER_DONE'){
     check(workerBlocked&&releaseGranted&&!workerCompleted,
      'Upgrade completed without waiting for separate-page release');
     check(msg.workerTab&&msg.unknownSchemaBlocked&&msg.attempts===73,
      'Second page did not validate fail-closed recovery and 73 attempts');
     check(msg.rawBlobs===sourceBefore.blobs.length&&
      msg.rawAliases===sourceBefore.aliases.length,
      'Second page lost original revision/alias inventory');
     check(localStorage.getItem(attemptKey)===original&&
      localStorage.getItem(writingKey)===permanentTestValues.writing&&
      localStorage.getItem(extraKey)===permanentTestValues.course,
      'Cross-tab IndexedDB upgrade modified original learner bytes');
     let failClosed=false;
     try{await vault.snapshot()}catch(e){
      failClosed=/Cannot open lesson revision database/.test(String(e));
     }
     check(failClosed,'First page failed to reject unexpectedly upgraded schema');
     check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
      'Cross-tab contention produced false incomplete Recovery marker');
     workerCompleted=true;
     dom.textContent='PASS_R4G_OWNER '+JSON.stringify({
      nativeTwoPageVersionchange:versionchangeSeen,
      separateWorkerTargetConfirmedByDriver:true,
      nativeSecondTabOnblocked:workerBlocked,
      upgradeWaitedForFirstTabClose:true,
      completedWorkerOriginalSources:true,
      originalSyntheticAttempts:73,
      rawOriginalBlobs:sourceBefore.blobs.length,
      rawHistoricalAliases:sourceBefore.aliases.length,
      versionOneAdapterRejectedVersionTwo:true
     });
     channel.close();
    }else if(msg.type==='WORKER_ERROR')failure(msg.message);
   }catch(e){failure(e)}
  };
  (window as Window&{__sleR4gRelease?:()=>string}).__sleR4gRelease=()=>{
   check(workerReady&&workerBlocked&&versionchangeSeen,
    'Owner cannot release until actual other-page onblocked event');
   check(!releaseGranted,'R4g old-tab connection already released');
   check(localStorage.getItem(attemptKey)===original,
    'Original learner bytes changed before releasing old-tab connection');
   releaseGranted=true;
   held.close(); // ONLY the throwaway test-held native connection
   return 'RELEASED_R4G_OLD_CONNECTION';
  };
  dom.textContent='READY_R4G_OWNER';
  const other=window.open(location.origin+'/?phase=multi-worker',
   '_blank',''); // Test-only flag disables popup blocking in this profile.
  check(other!==null&&other!==window,
   'Could not create independent second Chromium page target');
 }else if(phase==='multi-worker'){
  // Second distinct browser document, not a second handle in the owner tab.
  const dbName='g-learning-english-lesson-revisions-r2';
  check(window.opener!==null&&window.opener!==window,
   'Second page must be opened by the independent owner tab');
  const channel=new BroadcastChannel('sle-r4g-two-page-native-versionchange');
  let requested=false,blocked=false,upgradeSeen=false;
  const error=(value:unknown)=>{
   const message=String(value);
   dom.textContent='FAIL_R4G_WORKER '+message;
   channel.postMessage({type:'WORKER_ERROR',message});
  };
  channel.onmessage=event=>{
   if(event.data?.type!=='BEGIN_UPGRADE')return;
   try{
    check(!requested,'Worker may request upgrade exactly once');
    requested=true;
    const request=indexedDB.open(dbName,2);
    request.onblocked=()=>{
     blocked=true;
     dom.textContent='READY_R4G_WORKER_BLOCKED';
     channel.postMessage({type:'WORKER_BLOCKED'});
    };
    request.onupgradeneeded=()=>{
     upgradeSeen=true;
     // NO store mutation; this test only upgrades schema metadata.
    };
    request.onerror=()=>error(request.error??'Native worker upgrade failed');
    request.onsuccess=async()=>{
     const db=request.result;
     try{
      check(blocked&&upgradeSeen&&db.version===2,
       'Worker upgraded without actual native cross-page block/release');
      const raw=await new Promise<{
       active:unknown;blobs:unknown[];aliases:unknown[]
      }>((resolve,reject)=>{
       const tx=db.transaction(
        ['active-manifest','revision-blobs','historic-aliases'],'readonly');
       const current=tx.objectStore('active-manifest').get('current');
       const bs=tx.objectStore('revision-blobs').getAll();
       const as=tx.objectStore('historic-aliases').getAll();
       tx.oncomplete=()=>resolve({
        active:(current.result as {value?:unknown}|undefined)?.value,
        blobs:bs.result as unknown[],aliases:as.result as unknown[]
       });
       tx.onabort=()=>reject(tx.error??Error('Worker raw read aborted'));
       tx.onerror=()=>reject(tx.error??Error('Worker raw read errored'));
      });
      const {v2,rows}=await fixture();
      const v3=await convertVerifiedV2ToRevisionV3(v2);
      const verified=await verifyRevisionRecoveryV3(v3.text);
      const byRevision=new Map((raw.blobs as Array<{revision:string}>)
       .map(b=>[b.revision,b]));
      check(canonicalLessonJSON(raw.active)===
       canonicalLessonJSON(verified.file.active),
       'Worker raw manifest changed from verified original source');
      check(raw.blobs.length===verified.file.blobs.length&&
       verified.file.blobs.every(b=>canonicalLessonJSON(byRevision.get(b.revision))===
        canonicalLessonJSON(b)),
       'Worker found a changed or missing original content-addressed blob');
      const aliases=new Map((raw.aliases as Array<{
       key:string;version:string;lessonId:string
      }>).map(a=>[a.key,a]));
      check(raw.aliases.length===verified.file.aliases.length,
       'Worker historical alias cardinality changed');
      for(const a of verified.file.aliases){
       const stored=aliases.get(JSON.stringify([a.version,a.lessonId]));
       check(!!stored,'Worker missing original historic alias');
       const {key:_key,...withoutKey}=stored!;
       check(canonicalLessonJSON(withoutKey)===canonicalLessonJSON(a),
        'Worker found changed historic alias source');
      }
      check(localStorage.getItem(attemptKey)===
       rows.find(x=>x.key===attemptKey)!.value&&
       localStorage.getItem(writingKey)===permanentTestValues.writing&&
       localStorage.getItem(extraKey)===permanentTestValues.course,
       'Other Chromium tab changed original learner record bytes');
      let readerRejected=false,backupRejected=false;
      try{await vault.snapshot()}catch(e){
       readerRejected=/Cannot open lesson revision database/.test(String(e));
      }
      try{await exportNormalizedBrowserRecoveryV3(
       localStorage,vault,'2026-11-10T15:00:00.000Z')}
      catch(e){
       backupRejected=/Cannot open lesson revision database/.test(String(e));
      }
      check(readerRejected&&backupRejected,
       'Old adapter in second tab must reject newer IDB and unsafe V3 export');
      dom.textContent='PASS_R4G_WORKER';
      channel.postMessage({type:'WORKER_DONE',workerTab:true,
       unknownSchemaBlocked:true,attempts:73,
       rawBlobs:raw.blobs.length,rawAliases:raw.aliases.length});
     }catch(e){error(e)}
     finally{db.close()}
    };
   }catch(e){error(e)}
  };
  channel.postMessage({type:'WORKER_READY'});
  dom.textContent='READY_R4G_WORKER';
 }else if(phase==='multi-reload'){
  // Fresh Chrome process after two independent same-origin page contexts.
  const {v2,rows}=await fixture();
  const verified=await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text);
  check(localStorage.getItem(attemptKey)===
   rows.find(x=>x.key===attemptKey)!.value&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'Historical synthetic attempts/writing/course were lost across Chrome restart');
  check(localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'Cross-tab upgrade left a false partial Restore marker');
  let incompatibleVersionRejected=false;
  try{await vault.snapshot()}catch(e){
   incompatibleVersionRejected=/Cannot open lesson revision database/.test(String(e));
  }
  check(incompatibleVersionRejected,
   'Unexpected version 2 schema was incorrectly accepted after browser restart');
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const req=indexedDB.open('g-learning-english-lesson-revisions-r2');
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>reject(req.error);
  });
  check(db.version===2,'Two-tab schema update did not persist after restart');
  const read=await new Promise<{active?:{lessons?:unknown[]};blobs:unknown[];
   aliases:unknown[]}>((resolve,reject)=>{
   const tx=db.transaction(['active-manifest','revision-blobs','historic-aliases'],'readonly');
   const active=tx.objectStore('active-manifest').get('current');
   const bs=tx.objectStore('revision-blobs').getAll();
   const as=tx.objectStore('historic-aliases').getAll();
   tx.oncomplete=()=>resolve({
    active:(active.result as {value?:{lessons?:unknown[]}}|undefined)?.value,
    blobs:bs.result as unknown[],aliases:as.result as unknown[]
   });
   tx.onabort=()=>reject(tx.error??Error('Restart source read aborted'));
  });
  db.close();
  check(read.active?.lessons?.length===123&&
   read.blobs.length===verified.file.blobs.length&&
   read.aliases.length===verified.file.aliases.length,
   'Original source inventory changed after two-tab test and Chrome restart');
  dom.textContent='PASS_R4G_RELOAD';
 }else if(phase==='write-race-owner'){
  // True two-page test. No production learner profile is used. Demonstrate
  // naive lost update on a SCRATCH key, never overwrite baseline learner keys.
  check(localStorage.length===0,'R4h requires a fresh disposable Chrome profile');
  check((await vault.snapshot()).active===null,'R4h requires empty test IDB');
  check(typeof navigator.locks?.request==='function'&&
   typeof navigator.locks?.query==='function',
   'Native Chromium Web Locks API is required; cannot fake R4h gate');
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(v3.text);
  check(verified.attempts===73,'R4h original V2 archive must be checksum-valid');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid,'R4h initial verified V3 empty-profile preview failed');
  check((await restoreNormalizedV3(v3.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4h initial source/history restore failed');
  const baselineA=rows.find(r=>r.key===attemptKey)!.value;
  const baselineW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===baselineA&&
   localStorage.getItem(writingKey)===baselineW,
   'R4h original learner source differs from verified V2');
  localStorage.setItem(R4H_SCRATCH,JSON.stringify({
   attempts:baselineA,writing:baselineW
  }));
  const baselineSource=await vault.snapshot();
  check(baselineSource.active?.lessons.length===123&&baselineSource.aliases.length>0,
   'R4h original historical source not present');
  let workerReady=false,rawPrepared=false,rawLost=false;
  let ownerHoldingLock=false,workerLockPending=false,releaseGranted=false;
  let staleRejected=false,workerMerged=false;
  const release:{go?:()=>void}={};
  const channel=new BroadcastChannel(R4H_CHANNEL);
  const failure=(v:unknown)=>{dom.textContent='FAIL_R4H_OWNER '+String(v)};
  channel.onmessage=async event=>{
   try{
    const msg=event.data as {type?:string;message?:string;
     baselineDigest?:string;writingDigest?:string};
    if(msg.type==='WORKER_READY'){
     check(!workerReady,'Duplicate second-page R4h init');
     check(msg.baselineDigest===await digest(baselineA)&&
      msg.writingDigest===await digest(baselineW),
      'Two tabs did not start with identical learner snapshots');
     workerReady=true;
     channel.postMessage({type:'START_RAW'});
    }else if(msg.type==='RAW_PREPARED'){
     check(workerReady&&!rawPrepared,'Naive worker was not ready');
     rawPrepared=true;
     const scratch=JSON.parse(localStorage.getItem(R4H_SCRATCH)!);
     scratch.attempts=r4hAnswer(scratch.attempts,71,'R4H_OWNER_DRAFT_EDIT');
     scratch.writing=r4hReview(scratch.writing,'r4h-owner-review');
     localStorage.setItem(R4H_SCRATCH,JSON.stringify(scratch));
     channel.postMessage({type:'RAW_OWNER_WRITTEN'});
    }else if(msg.type==='RAW_WORKER_OVERWROTE'){
     check(rawPrepared&&!rawLost,'Naive collision ordering invalid');
     const naive=JSON.parse(localStorage.getItem(R4H_SCRATCH)!);
     const first=JSON.parse(naive.attempts) as Array<{answers:Record<string,string>}>;
     const firstKey=Object.keys(first[71].answers)[0];
     const secondKey=Object.keys(first[72].answers)[0];
     check(first[71].answers[firstKey]!== 'R4H_OWNER_DRAFT_EDIT'&&
      first[72].answers[secondKey]==='R4H_WORKER_DRAFT_EDIT',
      'Actual native localStorage scratch overwrite failed to show lost update');
     const reviews=(JSON.parse(naive.writing) as {
      reviews:Array<{id:string}>
     }).reviews;
     check(!reviews.some(x=>x.id==='r4h-owner-review')&&
      reviews.some(x=>x.id==='r4h-worker-review'),
      'Naive scratch collision did not lose owner Writing feedback');
     check(localStorage.getItem(attemptKey)===baselineA&&
      localStorage.getItem(writingKey)===baselineW,
      'Naive scratch test accidentally changed protected learner data');
     localStorage.removeItem(R4H_SCRATCH); // only disposable scratch
     rawLost=true;
     channel.postMessage({type:'START_GUARDED'});
    }else if(msg.type==='GUARDED_WORKER_READY'){
     check(rawLost&&!ownerHoldingLock,'Guarded initialization not ordered');
     // Hold real cross-tab exclusive Web Lock until driver checks that
     // second page is ACTUALLY waiting. Test-only lock, no live code path.
     const task=navigator.locks.request(R4H_LOCK,{mode:'exclusive'},async()=>{
      ownerHoldingLock=true;
      channel.postMessage({type:'OWNER_LOCK_HELD'});
      await new Promise<void>(resolve=>{release.go=resolve});
      check(localStorage.getItem(attemptKey)===baselineA&&
       localStorage.getItem(writingKey)===baselineW,
       'Guarded owner snapshot already changed while lock held');
      localStorage.setItem(attemptKey,r4hAnswer(
       baselineA,71,'R4H_OWNER_DRAFT_EDIT'));
      localStorage.setItem(writingKey,r4hReview(
       baselineW,'r4h-owner-review'));
     });
     task.catch(failure);
    }else if(msg.type==='WORKER_LOCK_REQUESTED'){
     check(ownerHoldingLock&&!releaseGranted,
      'Second-tab write must begin while first tab holds Web Lock');
     let actuallyPending=false;
     for(let i=0;i<30;i++){
      const status=await navigator.locks.query();
      actuallyPending=(status.pending??[]).some(x=>x.name===R4H_LOCK);
      if(actuallyPending)break;
      await new Promise(resolve=>setTimeout(resolve,25));
     }
     check(actuallyPending,'Actual Chrome Web Locks queue never showed other tab pending');
     workerLockPending=true;
     dom.textContent='READY_R4H_LOCK_QUEUE';
    }else if(msg.type==='STALE_REJECTED'){
     check(workerLockPending&&releaseGranted&&!staleRejected,
      'Stale second-tab write was not serialized after owner release');
     staleRejected=true;
     check(localStorage.getItem(attemptKey)===
      r4hAnswer(baselineA,71,'R4H_OWNER_DRAFT_EDIT')&&
      localStorage.getItem(writingKey)===
      r4hReview(baselineW,'r4h-owner-review'),
      'Stale queued writer modified winner or original Writing feedback');
     channel.postMessage({type:'REFRESH_RETRY'});
    }else if(msg.type==='WORKER_MERGED'){
     check(staleRejected&&!workerMerged,'Worker retried without conflict detection');
     const actualA=localStorage.getItem(attemptKey)!;
     const actualW=localStorage.getItem(writingKey)!;
     r4hAssertMerged(baselineA,actualA,actualW);
     check(localStorage.getItem(extraKey)===permanentTestValues.course,
      'Concurrent test modified original course selection');
     check(localStorage.getItem(R4H_SCRATCH)===null&&
      localStorage.getItem(RECOVERY_V3_MARKER)===null,
      'Concurrent writer left test scratch or interrupted Recovery marker');
     const after=await vault.snapshot();
     check(canonicalLessonJSON(after)===canonicalLessonJSON(baselineSource),
      'Concurrent learner edits modified historical content-addressed source');
     const exported=await exportNormalizedBrowserRecoveryV3(
      localStorage,vault,'2026-11-10T16:30:00.000Z');
     const confirm=await verifyRevisionRecoveryV3(exported.text);
     check(confirm.attempts===73&&
      confirm.file.entries.find(x=>x.key===attemptKey)?.value===actualA&&
      confirm.file.entries.find(x=>x.key===writingKey)?.value===actualW,
      'Completed guarded edits cannot be fully re-exported with exact learner bytes');
     workerMerged=true;
     dom.textContent='PASS_R4H_OWNER '+JSON.stringify({
      twoPageTargetsVerifiedExternally:true,
      nativeNaiveScratchLostOwnerAttemptAndReview:true,
      nativeWebLockQueueObserved:true,
      staleWorkerWriteRejected:true,
      refreshAndMergeRetainedBothAttemptsAndReviews:true,
      protectedOriginalAttempts:73,
      historicSourceFullyUnchanged:true,
      fullV3ExportVerified:true
     });
     channel.close();
    }else if(msg.type==='WORKER_ERROR')failure(msg.message);
   }catch(e){failure(e)}
  };
  (window as Window&{__sleR4hRelease?:()=>string}).__sleR4hRelease=()=>{
   check(ownerHoldingLock&&workerLockPending&&!!release.go&&!releaseGranted,
    'R4h driver must prove second page is queued before releasing native lock');
   releaseGranted=true;release.go!();
   return 'RELEASED_R4H_NATIVE_WEB_LOCK';
  };
  dom.textContent='READY_R4H_OWNER';
  const second=window.open(location.origin+'/?phase=write-race-worker','_blank','');
  check(second!==null&&second!==window,
   'R4h requires two separate real Chromium page targets');
 }else if(phase==='write-race-worker'){
  check(window.opener!==null&&window.opener!==window,
   'R4h worker must be a separate Chrome tab opened by owner');
  check(typeof navigator.locks?.request==='function',
   'R4h worker lacks native Web Locks');
  const expectedA=r4hRequiredString(localStorage.getItem(attemptKey),'attempts');
  const expectedW=r4hRequiredString(localStorage.getItem(writingKey),'Writing');
  const scratch=r4hRequiredString(localStorage.getItem(R4H_SCRATCH),'scratch');
  check(expectedA!==null&&expectedW!==null&&scratch!==null,
   'Worker must snapshot real original attempt, Writing and scratch bytes');
  const rawCached=JSON.parse(scratch) as {attempts:string;writing:string};
  check(rawCached.attempts===expectedA&&rawCached.writing===expectedW,
   'Second-tab initial scratch/source mismatch');
  const channel=new BroadcastChannel(R4H_CHANNEL);
  const failure=(v:unknown)=>{
   const message=String(v);
   dom.textContent='FAIL_R4H_WORKER '+message;
   channel.postMessage({type:'WORKER_ERROR',message});
  };
  let rawDone=false,guardRequested=false,staleRejected=false;
  channel.onmessage=async event=>{
   try{
    const msg=event.data as {type?:string};
    if(msg.type==='START_RAW'){
     channel.postMessage({type:'RAW_PREPARED'});
    }else if(msg.type==='RAW_OWNER_WRITTEN'){
     check(!rawDone,'Worker raw scratch write repeated');
     const naive={
      attempts:r4hAnswer(rawCached.attempts,72,'R4H_WORKER_DRAFT_EDIT'),
      writing:r4hReview(rawCached.writing,'r4h-worker-review')
     };
     // Native browser localStorage: last writer wins, no compare-and-swap.
     localStorage.setItem(R4H_SCRATCH,JSON.stringify(naive));
     rawDone=true;
     channel.postMessage({type:'RAW_WORKER_OVERWROTE'});
    }else if(msg.type==='START_GUARDED'){
     check(rawDone&&!guardRequested,'Guard must run after native naive collision');
     guardRequested=true;
     channel.postMessage({type:'GUARDED_WORKER_READY'});
    }else if(msg.type==='OWNER_LOCK_HELD'){
     check(guardRequested&&!staleRejected,'Owner lock arrived unexpectedly');
     const queued=navigator.locks.request(R4H_LOCK,{mode:'exclusive'},async()=>{
      // Both keys are guarded by the SAME lock. Compare exact expected
      // snapshots and fail closed on stale values; never silently overwrite.
      if(localStorage.getItem(attemptKey)!==expectedA||
         localStorage.getItem(writingKey)!==expectedW)return 'STALE';
      const updatedA=r4hAnswer(expectedA,72,'R4H_WORKER_DRAFT_EDIT');
      const updatedW=r4hReview(expectedW,'r4h-worker-review');
      localStorage.setItem(attemptKey,updatedA);
      localStorage.setItem(writingKey,updatedW);
      return 'UNEXPECTED_STALE_ACCEPT';
     });
     dom.textContent='READY_R4H_WORKER_LOCK_PENDING';
     channel.postMessage({type:'WORKER_LOCK_REQUESTED'});
     const result=await queued;
     check(result==='STALE',
      'Stale second-tab writer must refuse to overwrite owner attempt/review');
     staleRejected=true;
     channel.postMessage({type:'STALE_REJECTED'});
    }else if(msg.type==='REFRESH_RETRY'){
     check(staleRejected,'Cannot retry before genuine stale-write rejection');
     const freshA=localStorage.getItem(attemptKey)!;
     const freshW=localStorage.getItem(writingKey)!;
     const result=await navigator.locks.request(R4H_LOCK,{mode:'exclusive'},async()=>{
      check(localStorage.getItem(attemptKey)===freshA&&
       localStorage.getItem(writingKey)===freshW,
       'Refreshed learner state changed before merged write');
      const updatedA=r4hAnswer(freshA,72,'R4H_WORKER_DRAFT_EDIT');
      const updatedW=r4hReview(freshW,'r4h-worker-review');
      localStorage.setItem(attemptKey,updatedA);
      localStorage.setItem(writingKey,updatedW);
      return 'MERGED';
     });
     check(result==='MERGED','Refreshed cross-tab write failed');
     dom.textContent='PASS_R4H_WORKER';
     channel.postMessage({type:'WORKER_MERGED'});
     channel.close();
    }
   }catch(e){failure(e)}
  };
  channel.postMessage({type:'WORKER_READY',
   baselineDigest:await digest(expectedA),
   writingDigest:await digest(expectedW)});
  dom.textContent='READY_R4H_WORKER';
 }else if(phase==='write-race-reload'){
  const {v2,rows}=await fixture();
  const baselineA=rows.find(x=>x.key===attemptKey)!.value;
  const actualA=r4hRequiredString(localStorage.getItem(attemptKey),'restarted attempts');
  const actualW=r4hRequiredString(localStorage.getItem(writingKey),'restarted Writing');
  r4hAssertMerged(baselineA,actualA,actualW);
  check(localStorage.getItem(R4H_SCRATCH)===null&&
   localStorage.getItem(RECOVERY_V3_MARKER)===null&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4h restart has scratch, pending marker or changed course selection');
  const original=(await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text)).file;
  const source=await vault.snapshot();
  check(canonicalLessonJSON(source.active)===canonicalLessonJSON(original.active)&&
   source.blobs.length===original.blobs.length&&
   source.aliases.length===original.aliases.length,
   'R4h restart changed original source inventory');
  check((await vault.resolveHistoric('1.18.0','WRI-A2-01')).lesson.id===
   'WRI-A2-01','R4h historic Writing source missing after restart');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T16:40:00.000Z');
  const verified=await verifyRevisionRecoveryV3(backup.text);
  check(verified.attempts===73&&
   verified.file.entries.find(x=>x.key===attemptKey)?.value===actualA&&
   verified.file.entries.find(x=>x.key===writingKey)?.value===actualW,
   'R4h recovery export after browser restart lost merged edits');
  dom.textContent='PASS_R4H_RELOAD';
 }else if(phase==='paired-write-pending'){
  // R4i: deliberately stop AFTER the first real localStorage learner-key
  // write, BEFORE the paired Writing key. This is a controlled synthetic
  // interruption, NOT a genuine SIGKILL, disk power loss or Safari test.
  const journalKey='__sle_issue103_r4i_disposable_write_journal__';
  const lockName='sle-issue103-r4i-disposable-pair-lock';
  check(localStorage.length===0,'R4i requires a completely disposable empty Chrome profile');
  check((await vault.snapshot()).active===null,'R4i IndexedDB must initially be empty');
  check(typeof navigator.locks?.request==='function',
   'R4i requires real Chromium navigator.locks; do not substitute a fake lock');
  const {v2,rows}=await fixture();
  const normalized=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(normalized.text);
  check(verified.attempts===73,'R4i requires exactly 73 fabricated attempts');
  const preview=await previewNormalizedV3Restore(normalized.text,localStorage,vault);
  check(preview.valid,'R4i original checksum-verified V3 must preview on empty browser');
  check((await restoreNormalizedV3(normalized.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4i source/original attempt installation failed');
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW,
   'R4i original attempt/Writing bytes differ from verified V2');
  const intendedA=r4hAnswer(beforeA,71,'R4I_PENDING_FIRST_KEY_ONLY');
  const intendedW=r4hReview(beforeW,'r4i-unfinished-second-key');
  const journal={kind:'R4I_DISPOSABLE_TEST_ONLY',
   beforeA,beforeW,intendedA,intendedW,
   beforeAHash:await digest(beforeA),beforeWHash:await digest(beforeW)};
  const token=await digest(JSON.stringify(journal));
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   // The snapshot journal is deliberately stored outside the English
   // learner namespace; the blocker marker is inside the V3 safety scope.
   localStorage.setItem(journalKey,JSON.stringify(journal));
   localStorage.setItem(LEARNER_WRITE_V3_MARKER,token);
   localStorage.setItem(attemptKey,intendedA);
   // Interrupt intentionally: do NOT write intendedW or clean the marker.
  });
  check(localStorage.getItem(attemptKey)===intendedA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===token,
   'R4i failed to stage exactly the intended half-written learner transaction');
  let exportRejected=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T17:30:00.000Z')}
  catch(e){exportRejected=/incomplete paired learner write blocks Recovery/i.test(String(e))}
  check(exportRejected,'Half-written learner and Writing state must NOT export as a valid V3');
  const unsafePreview=await previewNormalizedV3Restore(
   normalized.text,localStorage,vault);
  check(!unsafePreview.valid&&
   unsafePreview.errors.some(x=>/incomplete paired learner write/i.test(x)),
   'V3 restore preview must explicitly reject pending paired learner write');
  const originalSource=await vault.snapshot();
  check(originalSource.active?.lessons.length===123&&originalSource.aliases.length>0,
   'Half-written learner transaction changed original IndexedDB source');
  dom.textContent='PASS_R4I_PENDING '+JSON.stringify({
   realChromiumLocalStorage:true,nativeExclusiveWebLock:true,
   actualFirstLearnerKeyWritten:true,secondWritingKeyNotWritten:true,
   pendingWriteMarkerPersistable:true,journalPreparedWithOriginalSHA256:true,
   incompleteV3ExportBlocked:true,restorePreviewBlocked:true,
   original73SyntheticAttemptsPresent:true
  });
 }else if(phase==='paired-write-recover'){
  // New browser process, SAME disposable profile, checksum-pinned journal.
  // Recover the old pair before allowing export or a new paired write.
  const journalKey='__sle_issue103_r4i_disposable_write_journal__';
  const lockName='sle-issue103-r4i-disposable-pair-lock';
  const {v2,rows}=await fixture();
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  const encoded=r4hRequiredString(localStorage.getItem(journalKey),
   'pending paired-write journal after restart');
  const journal=JSON.parse(encoded) as {
   kind:string;beforeA:string;beforeW:string;
   intendedA:string;intendedW:string;
   beforeAHash:string;beforeWHash:string;
  };
  check(journal.kind==='R4I_DISPOSABLE_TEST_ONLY',
   'R4i refuses an unknown interrupted journal');
  check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===
   await digest(JSON.stringify(journal)),
   'R4i mismatched pending write marker; cannot recover an unverified journal');
  check(journal.beforeA===beforeA&&journal.beforeW===beforeW&&
   journal.beforeAHash===await digest(beforeA)&&
   journal.beforeWHash===await digest(beforeW),
   'R4i journal does not contain the authentic synthetic original snapshots');
  check(localStorage.getItem(attemptKey)===journal.intendedA&&
   localStorage.getItem(writingKey)===journal.beforeW,
   'R4i interrupted profile differs from the one-key staged state');
  let blocked=true;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T17:40:00.000Z');blocked=false}
  catch(e){check(/incomplete paired learner write blocks Recovery/i.test(String(e)),
   'R4i export rejected for an unexpected reason')}
  check(blocked,'Pending paired write must remain export-blocked after Chrome restart');
  const recoveredV2=await fixture();
  const previewWhilePending=await previewNormalizedV3Restore(
   (await convertVerifiedV2ToRevisionV3(recoveredV2.v2)).text,localStorage,vault);
  check(!previewWhilePending.valid&&
   previewWhilePending.errors.some(x=>/incomplete paired learner write/i.test(x))&&
   !previewWhilePending.token,
   'Restarted half-written profile must never receive a valid Restore preview token');
  await navigator.locks.request(lockName,{mode:'exclusive'},async()=>{
   // No blind overwrite: the current bytes MUST be the journal's known
   // half-write state. Any different bytes leave both marker and journal.
   check(localStorage.getItem(attemptKey)===journal.intendedA&&
    localStorage.getItem(writingKey)===journal.beforeW&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)!==null,
    'Unsafe or concurrent change while trying to roll back paired write');
   localStorage.setItem(attemptKey,journal.beforeA);
   localStorage.setItem(writingKey,journal.beforeW);
   check(localStorage.getItem(attemptKey)===journal.beforeA&&
    localStorage.getItem(writingKey)===journal.beforeW,
    'R4i paired-write recovery did not restore exact original bytes');
   // Clear the blocking marker only AFTER exact byte verification.
   localStorage.removeItem(LEARNER_WRITE_V3_MARKER);
   localStorage.removeItem(journalKey);
  });
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem(journalKey)===null,
   'R4i original two-key data was not recovered cleanly');
  const reverted=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T17:50:00.000Z');
  const revertedVerified=await verifyRevisionRecoveryV3(reverted.text);
  check(revertedVerified.attempts===73&&
   revertedVerified.file.entries.find(x=>x.key===attemptKey)?.value===beforeA&&
   revertedVerified.file.entries.find(x=>x.key===writingKey)?.value===beforeW,
   'Recovered backup did not preserve exact 73 original attempts and Writing');

  // Test successful two-key writing with the same journal, marker and lock.
  const committedA=r4hAnswer(beforeA,71,'R4I_COMMITTED_DRAFT_EDIT');
  const committedW=r4hReview(beforeW,'r4i-committed-writing-review');
  const commitJournal={kind:'R4I_DISPOSABLE_TEST_ONLY',
   beforeA,beforeW,intendedA:committedA,intendedW:committedW,
   beforeAHash:await digest(beforeA),beforeWHash:await digest(beforeW)};
  const commitToken=await digest(JSON.stringify(commitJournal));
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   check(localStorage.getItem(attemptKey)===beforeA&&
    localStorage.getItem(writingKey)===beforeW,
    'R4i cannot commit over unexpected learner state');
   localStorage.setItem(journalKey,JSON.stringify(commitJournal));
   localStorage.setItem(LEARNER_WRITE_V3_MARKER,commitToken);
   localStorage.setItem(attemptKey,committedA);
   localStorage.setItem(writingKey,committedW);
   check(localStorage.getItem(attemptKey)===committedA&&
    localStorage.getItem(writingKey)===committedW,
    'R4i pair completion verification failed');
   localStorage.removeItem(LEARNER_WRITE_V3_MARKER);
   localStorage.removeItem(journalKey);
  });
  check(localStorage.getItem(attemptKey)===committedA&&
   localStorage.getItem(writingKey)===committedW,
   'R4i successful paired commit changed unexpectedly');
  const original=JSON.parse(beforeA) as unknown[];
  const completed=JSON.parse(committedA) as unknown[];
  check(original.length===73&&completed.length===73&&
   original.every((x,i)=>i===71||canonicalLessonJSON(x)===canonicalLessonJSON(completed[i])),
   'R4i changed any attempt other than the intended synthetic draft');
  const w=JSON.parse(committedW) as {reviews:Array<{id:string}>};
  check(w.reviews.length===2&&w.reviews[0].id==='test-review'&&
   w.reviews[1].id==='r4i-committed-writing-review',
   'R4i successful pair lost the historical original Writing review');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T18:00:00.000Z');
  const completedBackup=await verifyRevisionRecoveryV3(backup.text);
  check(completedBackup.attempts===73&&
   completedBackup.file.entries.find(x=>x.key===attemptKey)?.value===committedA&&
   completedBackup.file.entries.find(x=>x.key===writingKey)?.value===committedW,
   'R4i completed paired write cannot export verified V3 with original history');
  check((await vault.resolveHistoric('1.18.0','WRI-A2-01')).lesson.id==='WRI-A2-01',
   'R4i historical Writing source changed after paired write recovery');
  dom.textContent='PASS_R4I_RECOVER '+JSON.stringify({
   interruptedMarkerSurvivedRestart:true,
   sha256PinnedJournalVerified:true,
   interruptedV3ExportBlockedAfterRestart:true,
   recovered73OriginalSyntheticAttemptsByteExact:true,
   originalWritingReviewRestored:true,
   completedJournaledPairedWrite:true,
   completeV3ExportVerified:true,
   historicWritingSourcePinned:true
  });
 }else if(phase==='paired-write-reload'){
  // Third independent normal browser process verifies completed pair.
  const journalKey='__sle_issue103_r4i_disposable_write_journal__';
  const {v2,rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const expectedA=r4hAnswer(originalA,71,'R4I_COMMITTED_DRAFT_EDIT');
  const expectedW=r4hReview(
   permanentTestValues.writing,'r4i-committed-writing-review');
  check(localStorage.getItem(attemptKey)===expectedA&&
   localStorage.getItem(writingKey)===expectedW&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4i completed paired synthetic write was lost on restart');
  check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem(journalKey)===null,
   'R4i restart found an incomplete pending write marker or journal');
  const source=await vault.snapshot();
  const restored=await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text);
  check(canonicalLessonJSON(source.active)===
   canonicalLessonJSON(restored.file.active)&&
   source.blobs.length===restored.file.blobs.length&&
   source.aliases.length===restored.file.aliases.length,
   'R4i immutable original source inventory changed after restart');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T18:10:00.000Z');
  const verified=await verifyRevisionRecoveryV3(backup.text);
  check(verified.attempts===73&&
   verified.file.entries.find(x=>x.key===attemptKey)?.value===expectedA&&
   verified.file.entries.find(x=>x.key===writingKey)?.value===expectedW,
   'R4i completed paired edits do not survive a new Chromium process');
  dom.textContent='PASS_R4I_RELOAD';
 }else if(phase==='native-writing-quota'){
  // R4j: real Chromium native quota failure on the SECOND learner key,
  // not an injected error. Scratch padding is disposable test-owned data.
  const journalKey='__sle_issue103_r4j_quota_pair_journal__';
  const paddingKey='__sle_issue103_r4j_native_quota_padding__';
  const lockName='sle-issue103-r4j-disposable-learner-pair';
  check(localStorage.length===0,'R4j requires an empty disposable Chrome profile');
  check((await vault.snapshot()).active===null,'R4j requires empty disposable IDB');
  check(typeof navigator.locks?.request==='function',
   'R4j requires actual Chromium native Web Locks');
  const {v2,rows}=await fixture();
  const transformed=await convertVerifiedV2ToRevisionV3(v2);
  const verified=await verifyRevisionRecoveryV3(transformed.text);
  check(verified.attempts===73,'R4j must start with 73 invented attempts');
  const preview=await previewNormalizedV3Restore(transformed.text,localStorage,vault);
  check(preview.valid&&!preview.resuming,'R4j empty-profile V3 preview must validate');
  check((await restoreNormalizedV3(transformed.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4j initial verified V3 restore did not preserve 73 attempts');
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW,
   'R4j initial learner/assessment strings mismatch original V2');
  const afterA=r4hAnswer(beforeA,71,'R4J_NATIVE_SECOND_KEY_QUOTA');
  // Make the SECOND key large enough to exceed native headroom, while
  // keeping an independently parseable Writing JSON and the old review.
  const expanded=JSON.parse(r4hReview(beforeW,'r4j-writing-quota')) as {
   reviews:Array<{id:string;feedback:string}>
  };
  expanded.reviews[1].feedback='R4j native quota payload '+('Q'.repeat(32_768));
  const intendedW=JSON.stringify(expanded);
  const journal={kind:'R4J_QUOTA_TEST_ONLY',beforeA,beforeW,
   intendedA:afterA,intendedW,
   beforeAHash:await digest(beforeA),beforeWHash:await digest(beforeW)};
  const token=await digest(JSON.stringify(journal));
  let nativeQuotaExceeded=false,low=0,high=8_000_000;
  const headroom=1024;
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   localStorage.setItem(journalKey,JSON.stringify(journal));
   localStorage.setItem(LEARNER_WRITE_V3_MARKER,token);
   localStorage.setItem(attemptKey,afterA);
   // Fill ONLY the disposable scratch namespace after first-key write.
   // Find Chrome's actual capacity; no mocked QuotaExceededError allowed.
   while(low+256<high){
    const mid=Math.floor((low+high)/2);
    try{localStorage.setItem(paddingKey,'q'.repeat(mid));low=mid}
    catch(e){
     check((e as Error)?.name==='QuotaExceededError',
      'R4j quota boundary must come from native Chromium');
     nativeQuotaExceeded=true;high=mid;
    }
   }
   check(nativeQuotaExceeded&&low>=1_000_000&&high<8_000_000,
    'No real Chromium quota boundary found with second key still unwritten');
   // Leave native storage almost full, so the second learner key must
   // trigger native quota rather than a simulated/monkey-patched throw.
   check(low>headroom,'R4j native quota headroom is invalid');
   localStorage.setItem(paddingKey,'q'.repeat(low-headroom));
   check(localStorage.getItem(paddingKey)?.length===low-headroom,
    'R4j scratch padding not retained at measured native quota');
   let secondWriteRejected=false;
   try{localStorage.setItem(writingKey,intendedW)}
   catch(e){
    check((e as Error)?.name==='QuotaExceededError',
     'R4j second Writing key failed for a reason other than native quota');
    secondWriteRejected=true;
   }
   check(secondWriteRejected,'R4j must observe native QuotaExceededError on Writing key');
   check(localStorage.getItem(attemptKey)===afterA&&
    localStorage.getItem(writingKey)===beforeW&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)===token,
    'Native quota may not erase original Writing or pending journal marker');
  });
  let exportBlocked=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T19:00:00.000Z')}
  catch(e){
   exportBlocked=/incomplete paired learner write blocks Recovery/i.test(String(e));
  }
  check(exportBlocked,'Native second-key quota may not produce a falsely complete V3');
  const pending=await previewNormalizedV3Restore(
   transformed.text,localStorage,vault);
  check(!pending.valid&&!pending.token&&
   pending.errors.some(x=>/incomplete paired learner write/i.test(x)),
   'Native second-key quota must also block V3 Restore preview');
  check((await vault.snapshot()).active?.lessons.length===123,
   'Native quota unexpectedly altered normalized academic source');
  dom.textContent='PASS_R4J_NATIVE_QUOTA '+JSON.stringify({
   realNativeChromiumQuotaExceededOnSecondLearnerKey:true,
   nativePaddingChars:low-headroom,
   firstLearnerKeyWritten:true,originalWritingSecondKeyPreserved:true,
   fullPreimageJournalAndPendingMarkerPresent:true,
   blockedV3Export:true,blockedV3RestorePreview:true,
   original73SyntheticAttemptsCount:73
  });
 }else if(phase==='native-writing-quota-recover'){
  const journalKey='__sle_issue103_r4j_quota_pair_journal__';
  const paddingKey='__sle_issue103_r4j_native_quota_padding__';
  const lockName='sle-issue103-r4j-disposable-learner-pair';
  const {v2,rows}=await fixture();
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  const encoded=r4hRequiredString(localStorage.getItem(journalKey),
   'R4j native quota journal after Chromium restart');
  const journal=JSON.parse(encoded) as {
   kind:string;beforeA:string;beforeW:string;
   intendedA:string;intendedW:string;
   beforeAHash:string;beforeWHash:string
  };
  check(journal.kind==='R4J_QUOTA_TEST_ONLY'&&
   journal.beforeA===beforeA&&journal.beforeW===beforeW&&
   journal.beforeAHash===await digest(beforeA)&&
   journal.beforeWHash===await digest(beforeW),
   'R4j pending quota journal fails original byte/sha256 verification');
  check(journal.intendedA===r4hAnswer(beforeA,71,'R4J_NATIVE_SECOND_KEY_QUOTA'),
   'R4j interrupted journal first-key plan does not match verified test intent');
  const plannedW=JSON.parse(journal.intendedW) as {
   reviews:Array<{id:string;feedback:string}>
  };
  check(plannedW.reviews.length===2&&
   plannedW.reviews[0].id==='test-review'&&
   plannedW.reviews[1].id==='r4j-writing-quota'&&
   plannedW.reviews[1].feedback==='R4j native quota payload '+('Q'.repeat(32_768)),
   'R4j interrupted journal Writing plan is missing original review or quota payload');
  const token=await digest(JSON.stringify(journal));
  check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===token&&
   localStorage.getItem(attemptKey)===journal.intendedA&&
   localStorage.getItem(writingKey)===beforeW&&
   (localStorage.getItem(paddingKey)?.length??0)>1_000_000,
   'R4j quota-interrupted first-key state or native scratch was lost on restart');
  let exportBlocked=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T19:10:00.000Z')}
  catch(e){
   exportBlocked=/incomplete paired learner write blocks Recovery/i.test(String(e));
  }
  check(exportBlocked,'R4j reopened native-quota profile must reject incomplete backup');
  const normalized=await convertVerifiedV2ToRevisionV3(v2);
  const preview=await previewNormalizedV3Restore(normalized.text,localStorage,vault);
  check(!preview.valid&&!preview.token&&
   preview.errors.some(x=>/incomplete paired learner write/i.test(x)),
   'R4j native-quota Restore preview still must fail after restart');
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===token&&
    localStorage.getItem(attemptKey)===journal.intendedA&&
    localStorage.getItem(writingKey)===journal.beforeW,
    'R4j refuses rollback over an unexpected modified learner pair');
   // Restoring the original first key reduces storage usage under quota.
   localStorage.setItem(attemptKey,journal.beforeA);
   check(localStorage.getItem(attemptKey)===journal.beforeA&&
    localStorage.getItem(writingKey)===journal.beforeW,
    'R4j native quota rollback cannot prove original two-key bytes');
   localStorage.removeItem(LEARNER_WRITE_V3_MARKER);
   localStorage.removeItem(journalKey);
   // Remove ONLY the test-owned native quota padding AFTER exact rollback.
   localStorage.removeItem(paddingKey);
  });
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(paddingKey)===null&&
   localStorage.getItem(journalKey)===null&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null,
   'R4j rollback left incomplete learner state or scratch data');
  const oldBackup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T19:20:00.000Z');
  const oldVerified=await verifyRevisionRecoveryV3(oldBackup.text);
  check(oldVerified.attempts===73&&
   oldVerified.file.entries.find(x=>x.key===attemptKey)?.value===beforeA&&
   oldVerified.file.entries.find(x=>x.key===writingKey)?.value===beforeW,
   'R4j rollback did not produce exact complete historical V3 backup');
  // After removing only disposable quota filler, commit the same intended
  // second-key Writing revision, under a fresh test-owned journal+Web Lock.
  const committedA=r4hAnswer(beforeA,71,'R4J_NATIVE_QUOTA_RECOVERED');
  const committedW=r4hReview(beforeW,'r4j-post-quota-writing-review');
  const commitJournal={kind:'R4J_QUOTA_TEST_ONLY',beforeA,beforeW,
   intendedA:committedA,intendedW:committedW,
   beforeAHash:await digest(beforeA),beforeWHash:await digest(beforeW)};
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   check(localStorage.getItem(attemptKey)===beforeA&&
    localStorage.getItem(writingKey)===beforeW,
    'R4j paired commit cannot overwrite unexpected source');
   localStorage.setItem(journalKey,JSON.stringify(commitJournal));
   localStorage.setItem(LEARNER_WRITE_V3_MARKER,
    'verified-'+commitJournal.kind);
   localStorage.setItem(attemptKey,committedA);
   localStorage.setItem(writingKey,committedW);
   check(localStorage.getItem(attemptKey)===committedA&&
    localStorage.getItem(writingKey)===committedW,
    'R4j complete pair did not persist both keys');
   localStorage.removeItem(LEARNER_WRITE_V3_MARKER);
   localStorage.removeItem(journalKey);
  });
  const parsedOriginal=JSON.parse(beforeA) as unknown[];
  const parsedCommit=JSON.parse(committedA) as unknown[];
  check(parsedOriginal.length===73&&parsedCommit.length===73&&
   parsedOriginal.every((a,i)=>i===71||
    canonicalLessonJSON(a)===canonicalLessonJSON(parsedCommit[i])),
   'R4j modified a non-target original attempt after quota recovery');
  const writing=JSON.parse(committedW) as {reviews:Array<{id:string}>};
  check(writing.reviews.length===2&&writing.reviews[0].id==='test-review'&&
   writing.reviews[1].id==='r4j-post-quota-writing-review',
   'R4j successful paired write lost the original Writing review');
  const completed=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T19:30:00.000Z');
  const complete=await verifyRevisionRecoveryV3(completed.text);
  check(complete.attempts===73&&
   complete.file.entries.find(x=>x.key===attemptKey)?.value===committedA&&
   complete.file.entries.find(x=>x.key===writingKey)?.value===committedW,
   'R4j successful post-quota pair is missing from verified complete V3');
  check((await vault.resolveHistoric('1.18.0','WRI-A2-01')).lesson.id===
   'WRI-A2-01','R4j original historic Writing source/rubric lost');
  dom.textContent='PASS_R4J_RECOVER '+JSON.stringify({
   genuineQuotaInterruptedJournalSurvivedRestart:true,
   incompleteRecoveryExportBlockedAfterRestart:true,
   original73AttemptsAndOriginalReviewRecoveredByteForByte:true,
   onlyTestPaddingRemovedAfterExactRollback:true,
   newPairedWriteSucceededWithoutQuotaPadding:true,
   historyAndCompleteV3ExportVerified:true
  });
 }else if(phase==='native-writing-quota-reload'){
  const {v2,rows}=await fixture();
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const expectedA=r4hAnswer(beforeA,71,'R4J_NATIVE_QUOTA_RECOVERED');
  const expectedW=r4hReview(
   permanentTestValues.writing,'r4j-post-quota-writing-review');
  check(localStorage.getItem(attemptKey)===expectedA&&
   localStorage.getItem(writingKey)===expectedW&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4j completed post-quota learner/Writing pair lost across Chrome restart');
  check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem('__sle_issue103_r4j_quota_pair_journal__')===null&&
   localStorage.getItem('__sle_issue103_r4j_native_quota_padding__')===null,
   'R4j successful restart retained pending marker or quota scratch');
  const verifiedSource=await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text);
  const source=await vault.snapshot();
  check(canonicalLessonJSON(source.active)===
   canonicalLessonJSON(verifiedSource.file.active)&&
   source.blobs.length===verifiedSource.file.blobs.length&&
   source.aliases.length===verifiedSource.file.aliases.length,
   'R4j native quota experience changed original immutable source inventory');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T19:40:00.000Z');
  const output=await verifyRevisionRecoveryV3(backup.text);
  check(output.attempts===73&&
   output.file.entries.find(x=>x.key===attemptKey)?.value===expectedA&&
   output.file.entries.find(x=>x.key===writingKey)?.value===expectedW,
   'R4j completed learner edits are not recoverable after second restart');
  dom.textContent='PASS_R4J_RELOAD';
 }else if(phase==='journal-preflight'){
  // R4k: genuine Chromium storage quotas BEFORE a learner write. No
  // synthetic quota wrapper, no storage clear, and no changes to real data.
  const journalKey='__sle_issue103_r4k_disposable_preimage_journal__';
  const paddingKey='__sle_issue103_r4k_native_preflight_padding__';
  const lockName='sle-issue103-r4k-journal-preflight';
  check(localStorage.length===0,'R4k must start with empty throwaway Chrome profile');
  check((await vault.snapshot()).active===null,'R4k needs initially empty test IDB');
  check(typeof navigator.locks?.request==='function',
   'R4k requires a real native Chromium exclusive Web Lock');
  const {v2,rows}=await fixture();
  const converted=await convertVerifiedV2ToRevisionV3(v2);
  check((await verifyRevisionRecoveryV3(converted.text)).attempts===73,
   'R4k fixture must contain 73 authentic-shape synthetic attempts');
  const preview=await previewNormalizedV3Restore(converted.text,localStorage,vault);
  check(preview.valid,'R4k checksum-verified V3 must preview on empty browser');
  check((await restoreNormalizedV3(converted.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4k requires complete initial 73 synthetic attempt restore');
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  const beforeCourse=permanentTestValues.course;
  const sourceBefore=await vault.snapshot();
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(extraKey)===beforeCourse&&
   sourceBefore.active?.lessons.length===123,
   'R4k original learner/course/content reference mismatched V2');
  const afterA=r4hAnswer(beforeA,71,'R4K_SHOULD_NEVER_BE_WRITTEN');
  const afterW=r4hReview(beforeW,'r4k-should-never-be-written');
  const journal={kind:'R4K_PREFLIGHT_TEST_ONLY',
   beforeA,beforeW,intendedA:afterA,intendedW:afterW,
   beforeAHash:await digest(beforeA),beforeWHash:await digest(beforeW)};
  const serialized=JSON.stringify(journal);
  const token=await digest(serialized);
  check(serialized.length>10_000,'R4k should test an authentic full preimage journal');
  let journalNativeQuota=false,markerNativeQuota=false;
  let journalBoundary=0,markerBoundary=0;
  // Maximize ONLY non-English padding; native Storage.setItem determines
  // capacity. The required native QuotaExceededError is never faked.
  function saturateNativeScratch(){
   let low=0,high=8_000_000,nativeBoundary=false;
   while(low+1<high){
    const mid=Math.floor((low+high)/2);
    try{localStorage.setItem(paddingKey,'p'.repeat(mid));low=mid}
    catch(e){
     check((e as Error)?.name==='QuotaExceededError',
      'R4k scratch capacity probe failed for a non-quota reason');
     nativeBoundary=true;high=mid;
    }
   }
   check(nativeBoundary&&low>1_000_000&&high<8_000_000,
    'R4k did not establish actual Chromium quota boundary');
   localStorage.setItem(paddingKey,'p'.repeat(low));
   check(localStorage.getItem(paddingKey)?.length===low,
    'R4k scratch data did not reach measured native capacity');
   return low;
  }
  await navigator.locks.request(lockName,{mode:'exclusive'},async()=>{
   // Scenario A: no journal can be written. Abort before even attempting
   // marker and learner writes. A safe complete old V3 remains exportable.
   journalBoundary=saturateNativeScratch();
   try{localStorage.setItem(journalKey,serialized)}
   catch(e){
    check((e as Error)?.name==='QuotaExceededError',
     'R4k preimage journal must fail with genuine Chromium quota');
    journalNativeQuota=true;
   }
   check(journalNativeQuota,'R4k journal unexpectedly fit under native quota');
   check(localStorage.getItem(journalKey)===null&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
    localStorage.getItem(attemptKey)===beforeA&&
    localStorage.getItem(writingKey)===beforeW,
    'R4k journal quota failure modified original learner records or left a marker');
   // Removing only our scratch padding is necessary before scenario B.
   localStorage.removeItem(paddingKey);

   // Scenario B: journal fits and is persisted, but setting the marker
   // must FAIL natively. Abort and remove only this test-owned journal;
   // do NOT touch either learner value. No orphan marker may survive.
   localStorage.setItem(journalKey,serialized);
   check(localStorage.getItem(journalKey)===serialized,
    'R4k cannot test marker failure without a complete preimage journal');
   markerBoundary=saturateNativeScratch();
   try{localStorage.setItem(LEARNER_WRITE_V3_MARKER,token)}
   catch(e){
    check((e as Error)?.name==='QuotaExceededError',
     'R4k marker failure must be native Chromium quota');
    markerNativeQuota=true;
   }
   check(markerNativeQuota,'R4k marker unexpectedly fit with native quota full');
   check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
    localStorage.getItem(journalKey)===serialized&&
    localStorage.getItem(attemptKey)===beforeA&&
    localStorage.getItem(writingKey)===beforeW,
    'R4k failed to protect old learner values during blocked marker write');
   localStorage.removeItem(journalKey);
   check(localStorage.getItem(journalKey)===null&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null,
    'R4k failed to safely discard abandoned journal after native quota');
   localStorage.removeItem(paddingKey);
  });
  check(journalNativeQuota&&markerNativeQuota&&
   journalBoundary>1_000_000&&markerBoundary>1_000_000&&
   localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(extraKey)===beforeCourse&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem(journalKey)===null&&
   localStorage.getItem(paddingKey)===null,
   'R4k failed to restore a clean unmodified original profile');
  check(canonicalLessonJSON(await vault.snapshot())===
   canonicalLessonJSON(sourceBefore),
   'R4k native journal/marker failures changed immutable original IDB content');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T20:00:00.000Z');
  const complete=await verifyRevisionRecoveryV3(backup.text);
  check(complete.attempts===73&&
   complete.file.entries.find(x=>x.key===attemptKey)?.value===beforeA&&
   complete.file.entries.find(x=>x.key===writingKey)?.value===beforeW,
   'R4k failed to export complete unchanged prior V3 after safe early abort');
  dom.textContent='PASS_R4K_PREFLIGHT '+JSON.stringify({
   nativeChromiumJournalQuotaError:journalNativeQuota,
   nativeChromiumMarkerQuotaError:markerNativeQuota,
   journalBoundaryChars:journalBoundary,markerBoundaryChars:markerBoundary,
   bothLearnerKeysUntouched:true,original73SyntheticAttemptsExact:true,
   originalWritingAndCourseStateExact:true,entireNormalizedIDBUnchanged:true,
   abandonedJournalSafelyCleared:true,fullOriginalV3BackupStillValid:true
  });
 }else if(phase==='journal-preflight-reload'){
  const {v2,rows}=await fixture();
  const beforeA=rows.find(x=>x.key===attemptKey)!.value;
  const beforeW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===beforeA&&
   localStorage.getItem(writingKey)===beforeW&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4k early quota abort lost synthetic data on normal Chrome restart');
  check(localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem('__sle_issue103_r4k_disposable_preimage_journal__')===null&&
   localStorage.getItem('__sle_issue103_r4k_native_preflight_padding__')===null,
   'R4k restart left a dangerous pending marker or test-owned scratch record');
  const normalized=await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text);
  const current=await vault.snapshot();
  check(canonicalLessonJSON(current.active)===
   canonicalLessonJSON(normalized.file.active)&&
   current.blobs.length===normalized.file.blobs.length&&
   current.aliases.length===normalized.file.aliases.length,
   'R4k original historical source closure changed across Chromium processes');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T20:15:00.000Z');
  const complete=await verifyRevisionRecoveryV3(backup.text);
  check(complete.attempts===73&&
   complete.file.entries.find(x=>x.key===attemptKey)?.value===beforeA&&
   complete.file.entries.find(x=>x.key===writingKey)?.value===beforeW,
   'R4k preserved old backups but lost exact learner values on restart');
  dom.textContent='PASS_R4K_RELOAD';
 }else if(phase==='hard-crash-baseline'){
  // R4l only: create a verified baseline with NORMAL browser shutdown
  // before the SIGKILL experiment. Never expose family data to this gate.
  check(localStorage.length===0,'R4l requires a new disposable Chromium profile');
  check((await vault.snapshot()).active===null,
   'R4l requires a new empty disposable normalized IndexedDB');
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  check((await verifyRevisionRecoveryV3(v3.text)).attempts===73,
   'R4l must verify the real-format V2 fixture with 73 fake attempts');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid,'R4l empty-profile preview invalid');
  check((await restoreNormalizedV3(v3.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4l baseline restore missed fake attempts');
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===originalA&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4l clean baseline learner bytes differ from verified V2');
  check((await vault.snapshot()).active?.lessons.length===123,
   'R4l original historical sources missing before crash');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T21:00:00.000Z');
  check((await verifyRevisionRecoveryV3(backup.text)).attempts===73,
   'R4l clean baseline backup failed checksum verification');
  dom.textContent='PASS_R4L_BASELINE';
 }else if(phase==='hard-crash-stage'){
  // Driver executes real Linux SIGKILL against the entire Chromium process
  // group AFTER it has observed the staged state. No Browser.close call.
  const journalKey='__sle_issue103_r4l_crash_preimage_journal__';
  const lockName='sle-issue103-r4l-hard-crash-pair';
  check(typeof navigator.locks?.request==='function',
   'R4l requires real Chromium native Web Locks');
  const {rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===originalA&&
   localStorage.getItem(writingKey)===originalW&&
   localStorage.getItem(extraKey)===permanentTestValues.course&&
   localStorage.getItem(journalKey)===null&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null,
   'R4l crash must start from precisely the clean, previously closed browser');
  const intendedA=r4hAnswer(originalA,71,'R4L_KILLED_AFTER_FIRST_KEY');
  const intendedW=r4hReview(originalW,'r4l-unwritten-writing-review');
  const journal={kind:'R4L_SIGKILL_RESEARCH_ONLY',
   beforeA:originalA,beforeW:originalW,intendedA,intendedW,
   beforeAHash:await digest(originalA),beforeWHash:await digest(originalW)};
  const token=await digest(JSON.stringify(journal));
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   localStorage.setItem(journalKey,JSON.stringify(journal));
   localStorage.setItem(LEARNER_WRITE_V3_MARKER,token);
   localStorage.setItem(attemptKey,intendedA);
   // Deliberately DO NOT write the second Writing key.
   check(localStorage.getItem(attemptKey)===intendedA&&
    localStorage.getItem(writingKey)===originalW&&
    localStorage.getItem(journalKey)===JSON.stringify(journal)&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)===token,
    'R4l cannot arm SIGKILL without exact stage marker and half-write bytes');
  });
  let blocked=false;
  try{await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T21:10:00.000Z')}
  catch(e){blocked=/incomplete paired learner write blocks Recovery/i.test(String(e))}
  check(blocked,'R4l incomplete paired write must block recovery export before crash');
  dom.textContent='PASS_R4L_KILL_ARMED '+JSON.stringify({
   original73FakeAttemptsStaged:true,
   preimageJournalAndMarkerReadableBeforeKill:true,
   actualFirstKeyWritten:true,writingStillOriginal:true,
   recoveryExportBlockedWhilePending:true
  });
 }else if(phase==='hard-crash-inspect'){
  // First distinct Chromium process AFTER SIGKILL; do not blindly repair.
  // Classify the *actually durable* bytes rather than assuming synchronous
  // localStorage.setItem guarantees fsync durability under an OS signal.
  const journalKey='__sle_issue103_r4l_crash_preimage_journal__';
  const lockName='sle-issue103-r4l-hard-crash-pair';
  const {v2,rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  const intendedA=r4hAnswer(originalA,71,'R4L_KILLED_AFTER_FIRST_KEY');
  const intendedW=r4hReview(originalW,'r4l-unwritten-writing-review');
  const journal={kind:'R4L_SIGKILL_RESEARCH_ONLY',
   beforeA:originalA,beforeW:originalW,intendedA,intendedW,
   beforeAHash:await digest(originalA),beforeWHash:await digest(originalW)};
  const expectedJournal=JSON.stringify(journal);
  const expectedToken=await digest(expectedJournal);
  const actualA=localStorage.getItem(attemptKey);
  const actualW=localStorage.getItem(writingKey);
  const actualJournal=localStorage.getItem(journalKey);
  const actualMarker=localStorage.getItem(LEARNER_WRITE_V3_MARKER);
  check(localStorage.getItem(extraKey)===permanentTestValues.course,
   'R4l SIGKILL lost original course selection: unsafe crash outcome');
  const source=await vault.snapshot();
  const original=(await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text)).file;
  check(canonicalLessonJSON(source.active)===canonicalLessonJSON(original.active)&&
   source.blobs.length===original.blobs.length&&
   source.aliases.length===original.aliases.length,
   'R4l SIGKILL damaged original immutable revision source: FAIL CLOSED');
  const noLearnerChange=actualA===originalA&&actualW===originalW;
  const exactlyHalfWritten=actualA===intendedA&&actualW===originalW;
  const fullJournal=actualJournal===expectedJournal;
  const fullMarker=actualMarker===expectedToken;
  const allPending=fullJournal&&fullMarker;
  const noPending=actualJournal===null&&actualMarker===null;
  // IMPORTANT: If any changed learner byte survived but either protective
  // key was lost, we have demonstrably unsafe torn persistence. HARD FAIL.
  check(noLearnerChange||exactlyHalfWritten,
   'R4l UNSAFE hard-crash storage state: learner keys are neither original nor recoverable intended half-write');
  if(exactlyHalfWritten){
   check(allPending,
    'R4l UNSAFE SIGKILL: changed learner attempt survived without BOTH SHA-pinned journal and marker');
  }else if(!noPending){
   check(fullJournal&&(fullMarker||actualMarker===null),
    'R4l UNSAFE SIGKILL: orphan or incorrect recovery marker/journal');
  }
  let outcome:'ORIGINAL_ALL_ABSENT'|
   'ORIGINAL_WITH_VERIFIED_JOURNAL'|'PENDING_PAIR_VERIFIED'='ORIGINAL_ALL_ABSENT';
  if(exactlyHalfWritten){
   outcome='PENDING_PAIR_VERIFIED';
   let exportBlocked=false;
   try{await exportNormalizedBrowserRecoveryV3(
    localStorage,vault,'2026-11-10T21:20:00.000Z')}
   catch(e){exportBlocked=/incomplete paired learner write blocks Recovery/i.test(String(e))}
   check(exportBlocked,'R4l marker survived crash but invalid mixed backup was not blocked');
   const blockedPreview=await previewNormalizedV3Restore(
    (await convertVerifiedV2ToRevisionV3(v2)).text,localStorage,vault);
   check(!blockedPreview.valid&&!blockedPreview.token&&
    blockedPreview.errors.some(x=>/incomplete paired learner write/i.test(x)),
    'R4l SIGKILL pending pair incorrectly allowed Recovery V3 Restore token');
  }else if(!noPending){
   outcome='ORIGINAL_WITH_VERIFIED_JOURNAL';
   if(fullMarker){
    let blocked=false;
    try{await exportNormalizedBrowserRecoveryV3(
     localStorage,vault,'2026-11-10T21:21:00.000Z')}
    catch(e){blocked=/incomplete paired learner write blocks Recovery/i.test(String(e))}
    check(blocked,'R4l signed pending marker did not block backup after crash');
   }
  }
  await navigator.locks.request(lockName,{mode:'exclusive'},()=>{
   check(localStorage.getItem(attemptKey)===actualA&&
    localStorage.getItem(writingKey)===actualW&&
    localStorage.getItem(journalKey)===actualJournal&&
    localStorage.getItem(LEARNER_WRITE_V3_MARKER)===actualMarker,
    'R4l learner data changed between hard-crash inspection and recovery');
   if(exactlyHalfWritten)localStorage.setItem(attemptKey,originalA);
   check(localStorage.getItem(attemptKey)===originalA&&
    localStorage.getItem(writingKey)===originalW,
    'R4l cannot prove exact original learner pair after SIGKILL');
   if(!noPending){
    localStorage.removeItem(LEARNER_WRITE_V3_MARKER);
    localStorage.removeItem(journalKey);
   }
  });
  check(localStorage.getItem(attemptKey)===originalA&&
   localStorage.getItem(writingKey)===originalW&&
   localStorage.getItem(journalKey)===null&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null,
   'R4l did not recover clean original two-key state after hard SIGKILL');
  const restored=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T21:30:00.000Z');
  const verified=await verifyRevisionRecoveryV3(restored.text);
  check(verified.attempts===73&&
   verified.file.entries.find(x=>x.key===attemptKey)?.value===originalA&&
   verified.file.entries.find(x=>x.key===writingKey)?.value===originalW,
   'R4l verified Recovery V3 does not preserve all 73 original fake attempts');
  dom.textContent='PASS_R4L_INSPECT '+JSON.stringify({
   actualDurabilityOutcome:outcome,
   unchangedOriginalPair:noLearnerChange,
   fullyVerifiedPendingMarker:allPending,
   noOrphanUnverifiableMarker:true,
   original73FakeLearnerAttemptsRestoredExact:true,
   originalWritingReviewAndCourseUnchanged:true,
   historicalSourceAndRubricIntact:true,
   originalVerifiedV3BackupAvailable:true
  });
 }else if(phase==='hard-crash-reload'){
  const {v2,rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===originalA&&
   localStorage.getItem(writingKey)===originalW&&
   localStorage.getItem(extraKey)===permanentTestValues.course&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem('__sle_issue103_r4l_crash_preimage_journal__')===null,
   'R4l second restart after hard crash lost exact original learner values');
  const previous=await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text);
  const source=await vault.snapshot();
  check(canonicalLessonJSON(source.active)===
   canonicalLessonJSON(previous.file.active)&&
   source.blobs.length===previous.file.blobs.length&&
   source.aliases.length===previous.file.aliases.length,
   'R4l second browser restart damaged historic revisions');
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-10T21:40:00.000Z');
  const full=await verifyRevisionRecoveryV3(backup.text);
  check(full.attempts===73&&
   full.file.entries.find(x=>x.key===attemptKey)?.value===originalA&&
   full.file.entries.find(x=>x.key===writingKey)?.value===originalW,
   'R4l verified learner data does not survive a second independent restart');
  dom.textContent='PASS_R4L_RELOAD';
 }else if(phase==='r4n-markerless-stage'){
  // Negative control: deliberately torn SYNTHETIC pair without journal/marker.
  // This is NOT a real crash or an edit to a real learner profile.
  check(localStorage.length===0,'R4n requires disposable empty profile');
  check((await vault.snapshot()).active===null,'R4n requires empty IDB');
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  check((await verifyRevisionRecoveryV3(v3.text)).attempts===73,
   'R4n fixture must have exactly 73 fabricated learner records');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid,'R4n empty-profile preview failed');
  check((await restoreNormalizedV3(v3.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4n synthetic baseline restore failed');
  const original=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===original&&
   localStorage.getItem(writingKey)===permanentTestValues.writing,
   'R4n original fabricated learner bytes missing');
  const changed=r4hAnswer(original,71,'R4N_UNPROTECTED_FIRST_KEY_CHANGE');
  check(changed!==original,'R4n requires a changed synthetic first key');
  localStorage.setItem(attemptKey,changed);
  check(localStorage.getItem(attemptKey)===changed&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'R4n did not construct the controlled markerless torn state');
  dom.textContent='PASS_R4N_NEGATIVE_STAGE';
 }else if(phase==='r4n-markerless-inspect'){
  // A fresh real Chromium process after GRACEFUL shutdown, not SIGKILL.
  const {v2,rows}=await fixture();
  const original=rows.find(x=>x.key===attemptKey)!.value;
  const changed=r4hAnswer(original,71,'R4N_UNPROTECTED_FIRST_KEY_CHANGE');
  check(localStorage.getItem(attemptKey)===changed&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null&&
   localStorage.getItem(RECOVERY_V3_MARKER)===null,
   'R4n markerless torn pair not durable over normal restart');
  const base=(await verifyRevisionRecoveryV3(
   (await convertVerifiedV2ToRevisionV3(v2)).text)).file;
  const current=await vault.snapshot();
  check(canonicalLessonJSON(current.active)===canonicalLessonJSON(base.active)&&
   current.blobs.length===base.blobs.length&&
   current.aliases.length===base.aliases.length,
   'R4n original historical lesson content lost');
  // Expected negative result: checksummed backup can include mismatched pair.
  const backup=await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-11T08:10:00.000Z');
  const verified=await verifyRevisionRecoveryV3(backup.text);
  check(verified.attempts===73&&
   verified.file.entries.find(x=>x.key===attemptKey)?.value===changed&&
   verified.file.entries.find(x=>x.key===writingKey)?.value===
   permanentTestValues.writing,
   'R4n did not reproduce false-complete markerless V3 backup');
  check(verified.file.entries.find(x=>x.key===attemptKey)?.value!==original,
   'R4n backup must demonstrably differ from the known original V2');
  // Cleanup is restricted to the fictional disposable learner value.
  localStorage.setItem(attemptKey,original);
  const clean=await verifyRevisionRecoveryV3((await exportNormalizedBrowserRecoveryV3(
   localStorage,vault,'2026-11-11T08:12:00.000Z')).text);
  check(clean.attempts===73&&clean.file.entries.find(x=>x.key===attemptKey)
   ?.value===original,'R4n failed to restore original fabricated values');
  dom.textContent='PASS_R4N_VULNERABILITY_REPRODUCED '+JSON.stringify({
   scriptedMarkerlessTornState:true,actualSIGKILLProducedThisState:false,
   persistedAcrossNormalBrowserRestart:true,
   checksumValidYetInconsistentPairedSnapshot:true,
   original73FabricatedAttemptsRecovered:true,
   originalHistoricalLessonAndRubricPreserved:true,
   securityVerdict:'BLOCKER_NOT_FIXED',productionWriterTouched:false,
   realLearnerData:'NOT_TOUCHED'
  });
 }else if(phase==='r4n-markerless-reload'){
  const {rows}=await fixture();
  const original=rows.find(x=>x.key===attemptKey)!.value;
  check(localStorage.getItem(attemptKey)===original&&
   localStorage.getItem(writingKey)===permanentTestValues.writing&&
   localStorage.getItem(extraKey)===permanentTestValues.course&&
   localStorage.getItem(LEARNER_WRITE_V3_MARKER)===null,
   'R4n after-cleanup restart lost original fictional learner bytes');
  const exported=await verifyRevisionRecoveryV3((await
   exportNormalizedBrowserRecoveryV3(
    localStorage,vault,'2026-11-11T08:20:00.000Z')).text);
  check(exported.attempts===73&&exported.file.entries.find(x=>x.key===attemptKey)
   ?.value===original&&(await vault.snapshot()).active?.lessons.length===123,
   'R4n complete synthetic backup not preserved after another restart');
  dom.textContent='PASS_R4N_CLEAN_RELOAD';
 }else if(phase==='r4o-atomic-baseline-abort'){
  check(localStorage.length===0,'R4o must use a fresh throwaway profile');
  check((await vault.snapshot()).active===null,
   'R4o must not touch an occupied lesson vault');
  const {v2,rows}=await fixture();
  const v3=await convertVerifiedV2ToRevisionV3(v2);
  check((await verifyRevisionRecoveryV3(v3.text)).attempts===73,
   'R4o must load 73 fictional attempts and original public source');
  const preview=await previewNormalizedV3Restore(v3.text,localStorage,vault);
  check(preview.valid,'R4o synthetic V3 restore preview invalid');
  check((await restoreNormalizedV3(v3.text,preview.token,true,localStorage,vault))
   .attempts===73,'R4o synthetic V3 restore failed');
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  check(localStorage.getItem(attemptKey)===originalA&&
   localStorage.getItem(writingKey)===originalW,
   'R4o source baseline must preserve original invented learner values');
  const db=await r4oOpenDB();
  try{
   check((await r4oWritePair(db,originalA,originalW,0,false))==='COMMITTED',
    'R4o initial IDB paired fixture not committed');
   const old=await r4oPair(db);
   check(old.attempts===originalA&&old.writing===originalW&&old.sequence===0,
    'R4o original committed IDB pair differs from fabricated history');
   const newA=r4hAnswer(originalA,71,'R4O_ATOMIC_DRAFT_EDIT');
   const newW=r4hReview(originalW,'r4o-atomic-writing-review');
   check((await r4oWritePair(db,newA,newW,1,true))==='ABORTED',
    'R4o scripted native IndexedDB transaction was not aborted');
   const after=await r4oPair(db);
   check(after.attempts===originalA&&after.writing===originalW&&
    after.sequence===0,'R4o aborted IDB transaction leaked one learner change');
   check(localStorage.getItem(attemptKey)===originalA&&
    localStorage.getItem(writingKey)===originalW,
    'R4o research illegally touched original synthetic localStorage pair');
  }finally{db.close()}
  dom.textContent='PASS_R4O_ATOMIC_ABORT';
 }else if(phase==='r4o-atomic-commit'){
  // Fresh Chromium PROCESS after a normal close. The prior abort must be
  // truly durable as the original all-or-nothing state.
  const {rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  const newA=r4hAnswer(originalA,71,'R4O_ATOMIC_DRAFT_EDIT');
  const newW=r4hReview(originalW,'r4o-atomic-writing-review');
  const db=await r4oOpenDB();
  try{
   const before=await r4oPair(db);
   check(before.sequence===0&&before.attempts===originalA&&
    before.writing===originalW,
    'R4o aborted transaction did not survive browser restart atomically');
   check((await r4oWritePair(db,newA,newW,1,false))==='COMMITTED',
    'R4o strict native IDB paired transaction did not commit');
   const after=await r4oPair(db);
   check(after.sequence===1&&after.attempts===newA&&after.writing===newW,
    'R4o committed paired attempts and Writing did not match');
   check(localStorage.getItem(attemptKey)===originalA&&
    localStorage.getItem(writingKey)===originalW,
    'R4o test IDB write must not alter existing synthetic localStorage');
  }finally{db.close()}
  dom.textContent='PASS_R4O_ATOMIC_COMMIT';
 }else if(phase==='r4o-atomic-verify'){
  // A THIRD Chrome process proves the new IDB pair can be read and verified
  // as one committed version after graceful shutdown and restart.
  const {v2,rows}=await fixture();
  const originalA=rows.find(x=>x.key===attemptKey)!.value;
  const originalW=permanentTestValues.writing;
  const newA=r4hAnswer(originalA,71,'R4O_ATOMIC_DRAFT_EDIT');
  const newW=r4hReview(originalW,'r4o-atomic-writing-review');
  const db=await r4oOpenDB();
  try{
   const pair=await r4oPair(db);
   check(pair.sequence===1&&pair.attempts===newA&&pair.writing===newW,
    'R4o pair not durable after second normal Chromium restart');
   const source=await vault.snapshot();
   const verifiedOriginal=(await verifyRevisionRecoveryV3(
    (await convertVerifiedV2ToRevisionV3(v2)).text)).file;
   check(canonicalLessonJSON(source.active)===
    canonicalLessonJSON(verifiedOriginal.active)&&
    source.aliases.length===verifiedOriginal.aliases.length&&
    source.blobs.length===verifiedOriginal.blobs.length,
    'R4o source/rubrics or normalized aliases were lost');
   // Read a consistent verified IDB pair; build an illustrative V3 archive
   // with the existing V3 serializer, NOT the current LIVE/adapter exporter.
   const entries=rows.filter(x=>x.key!==packageKey).map(x=>({
    key:x.key,value:x.key===attemptKey?pair.attempts:
     x.key===writingKey?pair.writing:x.value
   }));
   const archived=await createRevisionRecoveryV3({
    active:source.active!,aliases:source.aliases,blobs:source.blobs
   },entries,'2026-11-11T11:00:00.000Z');
   const complete=await verifyRevisionRecoveryV3(archived.text);
   check(complete.attempts===73&&
    complete.file.entries.find(x=>x.key===attemptKey)?.value===newA&&
    complete.file.entries.find(x=>x.key===writingKey)?.value===newW,
    'R4o demonstration V3 serialization did not include the committed IDB pair');
   // Adversarial out-of-transaction tamper ONLY in throwaway research DB;
   // the checksum-linked reader must fail CLOSED rather than bless new A+old W.
   await r4oTamperOneTestKey(db,originalA);
   let corruptBlocked=false;
   try{await r4oPair(db)}
   catch(e){corruptBlocked=/does not match commit digest/i.test(String(e))}
   check(corruptBlocked,'R4o untracked one-key edit was not rejected');
   check((await r4oWritePair(db,newA,newW,1,false))==='COMMITTED',
    'R4o test-only pair was not restored atomically after tamper');
   check((await r4oPair(db)).attempts===newA,
    'R4o restored test-only committed pair invalid');
   check(localStorage.getItem(attemptKey)===originalA&&
    localStorage.getItem(writingKey)===originalW,
    'R4o must not switch existing V2/localStorage LIVE representation');
  }finally{db.close()}
  dom.textContent='PASS_R4O_ATOMIC_VERIFY '+JSON.stringify({
   realNativeIndexedDB:true,strictDurabilityHintAccepted:true,
   abortedTwoKeyTransactionAllOrNothing:true,
   committedTwoKeyPairSurvivedNormalRestart:true,
   untrackedOneKeyTamperFailsClosed:true,
   syntheticV3ArchiveFromCommittedPairVerified:true,
   original73InventedAttemptsUsed:true,
   oldLocalStorageRouteUnchanged:true,productionIntegration:false,
   sigkillOrPowerLoss:'NOT_TESTED',safari:'NOT_TESTED',
   realLearnerData:'NOT_TOUCHED'
  });
 }else throw Error('Unsupported R4c browser phase');
})().catch(e=>{
 dom.textContent='FAIL '+String(e)+' '+String((e as Error)?.stack).slice(0,1100);
});
