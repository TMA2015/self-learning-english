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
import {verifyRevisionRecoveryV3} from '../domain/lesson-revision-recovery-v3';
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
 }else throw Error('Unsupported R4c browser phase');
})().catch(e=>{
 dom.textContent='FAIL '+String(e)+' '+String((e as Error)?.stack).slice(0,1100);
});
