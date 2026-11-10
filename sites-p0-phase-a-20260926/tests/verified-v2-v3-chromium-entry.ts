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
 exportNormalizedBrowserRecoveryV3,RECOVERY_V3_MARKER
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
     attempts?:number;workerTab?:boolean;unknownSchemaBlocked?:boolean};
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
  const other=window.open(location.origin+'/?phase=multi-worker',
   '_blank',''); // Test-only flag disables popup blocking in this profile.
  check(other!==null&&other!==window,
   'Could not create independent second Chromium page target');
  dom.textContent='READY_R4G_OWNER';
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
 }else throw Error('Unsupported R4c browser phase');
})().catch(e=>{
 dom.textContent='FAIL '+String(e)+' '+String((e as Error)?.stack).slice(0,1100);
});
