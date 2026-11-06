'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/local-recovery-v2';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-recovery.ts',
 'infrastructure/storage/browser-local-repositories.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {BrowserLocalAcademicRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
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
 // Safari/iPad quota: the recovery file may verify correctly but storage
 // cannot hold all historical curriculum sources. The restore must give the
 // real cause, keep the original keys untouched, and never mask as success.
 const quota=new Store();use(quota);
 await new BrowserLocalAcademicRepository(quota).addPackage(asPackage(next));
 const quotaBaseline=new Map(quota.items);
 const quotaPreview=await recovery.previewLocalRecoveryV2(data.text);
 const oldSet=quota.setItem.bind(quota);
 quota.setItem=(key,value)=>{
  if(key===attemptKey){const error=Error('storage is full');error.name='QuotaExceededError';throw error}
  return oldSet(key,value);
 };
 await assert.rejects(()=>recovery.restoreLocalRecoveryV2(data.text,quotaPreview.token,true),
  /Recovery could not fit in this browser storage \(quota exceeded\)/);
 assert.deepEqual(quota.items,quotaBaseline,'Quota failure must rollback all changed keys');
 assert.equal(quota.getItem(recovery.RECOVERY_MARKER),null);
 assert.equal((await recovery.verifyLocalRecoveryV2(data.text)).attempts,1,
  'Quota failure must not modify the original recovery source');
 use(faulty); // Restore the original test browser profile after quota simulation.
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
