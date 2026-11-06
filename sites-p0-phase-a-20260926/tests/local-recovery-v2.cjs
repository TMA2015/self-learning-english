'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/local-recovery-v2';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-recovery.ts',
 'infrastructure/storage/browser-local-repositories.ts',
 'application/academic-service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const {academicService}=require('../'+out+'/application/academic-service.js');
const old=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');
const prefix='g-learning:english:v1',key=prefix+':academic:packages',
 attemptKey=prefix+':owner:local-family:academic-attempts';
class Store{
 constructor(){this.items=new Map();this.failedKey='';this.failOnce=false;this.removed=[]}
 get length(){return this.items.size}
 key(i){return [...this.items.keys()][i]??null}
 getItem(k){return this.items.get(k)??null}
 setItem(k,v){
  if(this.failedKey===k&&this.failOnce){this.failOnce=false;throw Error('simulated browser write failure')}
  this.items.set(k,String(v));
 }
 removeItem(k){this.removed.push(k);this.items.delete(k)}
}
const use=store=>{global.window={localStorage:store}};
const asPackage=(src)=>({id:src.package_id,version:src.schema_version,
 digest:'hash-'+src.schema_version,at:1,source:src,bundle:{}});
const scored={id:'saved-real-attempt',packageId:old.package_id,version:old.schema_version,
 lessonId:'REA-A1-01',rootId:'saved-real-attempt',status:'scored',
 answers:{'REA-A1-01-Q1':'A'},results:[{id:'REA-A1-01-Q1',correct:true,
 explanation:'Original feedback',answer:'A',tags:[]}],createdAt:1,submittedAt:2,evidence:[]};
(async()=>{
 const source=new Store();use(source);
 const repo=new BrowserLocalAcademicRepository(source);
 await repo.addPackage(asPackage(old));
 await repo.start('local-family',scored);
 await repo.addPackage(asPackage(next));
 const proposed=await repo.previewRetention();
 await repo.compactRetention(proposed.token,true);
 source.setItem(prefix+':owner:local-family:learner:primary:state',JSON.stringify({writing:'Original draft'}));
 const data=await recovery.exportLocalRecoveryV2();
 assert.equal(data.attempts,1);
 // New/unknown local schema keys must not be silently omitted from a supposedly
 // complete backup. Keep them untouched and block export/cleanup until reviewed.
 const unknown=prefix+':owner:local-family:new-progress-schema';
 source.setItem(unknown,JSON.stringify({attempt:'hidden-work'}));
 await assert.rejects(()=>recovery.exportLocalRecoveryV2(),/Unrecognized English storage keys/);
 assert.deepEqual(JSON.parse(source.getItem(unknown)),{attempt:'hidden-work'});
 source.removeItem(unknown);
 const resumed=await recovery.exportLocalRecoveryV2();
 assert.equal(resumed.attempts,1);
 assert.equal(data.filename,recovery.RECOVERY_FILENAME);
 assert(data.bytes>1000&&data.bytes<recovery.RECOVERY_MAX_BYTES);
 const file=JSON.parse(data.text);
 assert.equal(file.schemaVersion,2);
 const verified=await recovery.verifyLocalRecoveryV2(data.text);
 assert.equal(verified.sha256,file.sha256);
 assert.equal(verified.attempts,1);
 assert.equal(file.entries.find(e=>e.key===key).value.includes('referenced-lessons'),true);
 // Recovery into an unoccupied device that has already bootstrapped current lessons.
 const target=new Store();use(target);
 const freshRepo=new BrowserLocalAcademicRepository(target);
 await freshRepo.addPackage(asPackage(next));
 const preview=await recovery.previewLocalRecoveryV2(data.text);
 assert.equal(preview.valid,true);
 assert.equal(preview.attempts,1);
 await assert.rejects(()=>recovery.restoreLocalRecoveryV2(data.text,'wrong',true),/Preview again/);
 const recovered=await recovery.restoreLocalRecoveryV2(data.text,preview.token,true);
 assert.equal(recovered.attempts,1);
 assert.equal(target.getItem(recovery.RECOVERY_MARKER),null);
 assert.deepEqual(await freshRepo.attempts('local-family'),[scored]);
 const oldContent=(await freshRepo.packages()).find(p=>p.version===old.schema_version);
 assert.equal(oldContent.source.lessons.length,1);
 assert(oldContent.source.lessons[0].activities.length>0);
 assert.equal(JSON.parse(target.getItem(prefix+':owner:local-family:learner:primary:state')).writing,'Original draft');

 // Regression: restore -> actual grading of a NEW current-version lesson ->
 // reload -> complete V2 export -> another fresh-browser restore.
 // All work uses disposable fake stores, never a real learner profile.
 const service=academicService(freshRepo,new BrowserLocalLearningRepository(target),'local-family');
 const lessonId='GRA-A1-01',newId='postrestore-graded-001';
 const lesson=next.lessons.find(l=>l.id===lessonId);
 assert(lesson&&lesson.module==='grammar');
 const answers=Object.fromEntries(lesson.activities.map(q=>[
  q.id,q.type==='single_choice'?q.answer.correct_option_id:
   q.type==='short_answer'?q.answer.accepted_answers[0]:'Complete response'
 ]));
 await service.start(lessonId,newId);
 await service.draft(newId,answers);
 const newlyScored=await service.submit(newId);
 assert.equal(newlyScored.status,'scored','New work must be graded through academicService');
 assert.equal(newlyScored.version,next.schema_version);
 assert(newlyScored.results.length>0&&newlyScored.results.every(r=>r.correct===true));
 const afterReload=new BrowserLocalAcademicRepository(target);
 const withNew=await afterReload.attempts('local-family');
 assert.equal(withNew.length,2,'Original and new scored attempts must survive a repository reload');
 assert.deepEqual(withNew.find(a=>a.id===scored.id),scored,'Original history must be immutable');
 assert.equal(withNew.find(a=>a.id===newId)?.status,'scored');
 const secondBackup=await recovery.exportLocalRecoveryV2();
 assert.equal(secondBackup.attempts,2,'Export after grading must include the new attempt');
 const secondVerified=await recovery.verifyLocalRecoveryV2(secondBackup.text);
 assert.equal(secondVerified.attempts,2);
 const secondTarget=new Store();use(secondTarget);
 await new BrowserLocalAcademicRepository(secondTarget).addPackage(asPackage(next));
 const secondPreview=await recovery.previewLocalRecoveryV2(secondBackup.text);
 assert.equal(secondPreview.valid,true);
 await recovery.restoreLocalRecoveryV2(secondBackup.text,secondPreview.token,true);
 const secondRepo=new BrowserLocalAcademicRepository(secondTarget);
 assert.deepEqual(await secondRepo.attempts('local-family'),withNew,
  'Re-export and second restore must preserve every original and new attempt');
 assert.equal((await secondRepo.packages()).find(p=>p.version===old.schema_version)
  .source.lessons[0].id,scored.lessonId,
  'Second restore must preserve historic lesson content');
 // A rejected new learner write cannot erase an existing graded record.
 const beforeQuota=JSON.stringify(await secondRepo.attempts('local-family'));
 secondTarget.failedKey=attemptKey;secondTarget.failOnce=true;
 const secondService=academicService(secondRepo,new BrowserLocalLearningRepository(secondTarget),'local-family');
 await assert.rejects(()=>secondService.start('GRA-A1-02','postrestore-quota-001'),
  /simulated browser write failure|no storage space/);
 assert.equal(JSON.stringify(await secondRepo.attempts('local-family')),beforeQuota);
 // Continue the original negative/recovery tests using their own independent stores.
 use(target);
 assert.equal((await recovery.previewLocalRecoveryV2(data.text)).valid,false,
  'Must not overwrite an occupied learner profile');
 // Checksum modification and unsupported learner-only backups are blocked before writes.
 const edited=JSON.parse(data.text);edited.entries[0].value+='tampered';
 await assert.rejects(()=>recovery.previewLocalRecoveryV2(JSON.stringify(edited)),/checksum mismatch/);
 await assert.rejects(()=>recovery.previewLocalRecoveryV2('{"schemaVersion":1}'),/Unsupported recovery file/);
 // A partial write must rollback to the original bootstrapped curriculum.
 const faulty=new Store();use(faulty);
 await new BrowserLocalAcademicRepository(faulty).addPackage(asPackage(next));
 const before=new Map(faulty.items);
 const okay=await recovery.previewLocalRecoveryV2(data.text);
 assert.equal(okay.valid,true);
 faulty.failedKey=attemptKey;faulty.failOnce=true;
 await assert.rejects(()=>recovery.restoreLocalRecoveryV2(data.text,okay.token,true),/Recovery failed/);
 assert.deepEqual(faulty.items,before,'Failed restore must revert every modified browser key');
 assert.equal(faulty.getItem(recovery.RECOVERY_MARKER),null);
 // An existing learning profile must not be overwritten, even with a valid recovery.
 faulty.setItem(prefix+':owner:local-family:academic-attempts',JSON.stringify([scored]));
 const occupied=await recovery.previewLocalRecoveryV2(data.text);
 assert.equal(occupied.valid,false);
 assert(occupied.errors.some(e=>/already contains learner data/.test(e)));
 // An unrelated recovery marker blocks files from other export sessions.
 faulty.setItem(recovery.RECOVERY_MARKER,'other-file-digest');
 assert.equal((await recovery.previewLocalRecoveryV2(data.text)).valid,false);
 // A matching marker resumes a partially completed transfer rather than
 // leaving an unusable learner profile after a browser crash.
 const interrupted=new Store();use(interrupted);
 interrupted.setItem(recovery.RECOVERY_MARKER,file.sha256);
 interrupted.setItem(key,file.entries.find(e=>e.key===key).value);
 const continued=await recovery.previewLocalRecoveryV2(data.text);
 assert.equal(continued.valid,true);
 const finished=await recovery.restoreLocalRecoveryV2(data.text,continued.token,true);
 assert.equal(finished.attempts,1);
 assert.equal(interrupted.getItem(recovery.RECOVERY_MARKER),null);
 assert.deepEqual(JSON.parse(interrupted.getItem(attemptKey)),[scored]);
 console.log(JSON.stringify({result:'PASS',gate:'local-recovery-v2',
  portableHistoricalLesson:true,checkedSHA256:true,freshBrowserRestore:true,
  protectedExistingLearner:true,rollbackOnWriteFailure:true,interruptedMarkerGuard:true,interruptedRecoveryResumable:true,
  remoteUpload:false,productionWrites:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
