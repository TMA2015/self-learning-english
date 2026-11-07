'use strict';
/** Disposable synthetic V3b backup/restore protocol. NO real browser profile. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/lesson-revision-restore-v3b';
const dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/lesson-revision-plan.ts','domain/lesson-revision-recovery-v3.ts',
 'infrastructure/browser/lesson-revision-portable-recovery.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {planLessonRevisions}=require(path.join(dest,'domain/lesson-revision-plan.js'));
const {verifyRevisionRecoveryV3}=require(path.join(dest,'domain/lesson-revision-recovery-v3.js'));
const {
 exportNormalizedBrowserRecoveryV3,previewNormalizedV3Restore,restoreNormalizedV3,
 RECOVERY_V3_MARKER
}=require(path.join(dest,'infrastructure/browser/lesson-revision-portable-recovery.js'));
const clone=x=>JSON.parse(JSON.stringify(x));
class Store {
 constructor(limit=Infinity){this.data=new Map();this.limit=limit;this.deleted=[]}
 get length(){return this.data.size}
 key(i){return [...this.data.keys()][i]??null}
 getItem(k){return this.data.get(k)??null}
 setItem(k,v){
  const copy=new Map(this.data);copy.set(k,String(v));
  const used=[...copy].reduce((n,[a,b])=>n+(a.length+b.length)*2,0);
  if(used>this.limit){const e=Error('QuotaExceededError');e.name='QuotaExceededError';throw e}
  this.data=copy;
 }
 removeItem(k){this.deleted.push(k);this.data.delete(k)}
}
class Vault {
 constructor(snapshot={active:null,blobs:[],aliases:[]}){this.rows=clone(snapshot);this.failNext=false}
 async snapshot(){return clone(this.rows)}
 async install(plan){
  if(this.failNext){this.failNext=false;throw Error('Simulated blocked IndexedDB');}
  if(this.rows.active&&this.rows.active.version!==plan.active.version)
   throw Error('Current manifest mismatch');
  const blobs=new Map(this.rows.blobs.map(x=>[x.revision,x]));
  for(const b of plan.blobs){
   if(blobs.has(b.revision))assert.deepEqual(blobs.get(b.revision),b);
   else blobs.set(b.revision,clone(b));
  }
  const by=new Map(this.rows.aliases.map(x=>[x.version+'|'+x.lessonId,x]));
  for(const a of plan.aliases){
   const k=a.version+'|'+a.lessonId;
   if(by.has(k))assert.deepEqual(by.get(k),a);
   else by.set(k,clone(a));
  }
  this.rows={active:clone(plan.active),blobs:[...blobs.values()],aliases:[...by.values()]};
 }
}
const writing={id:'WRI-A2-01',title:'Opinion writing',
 activities:[{id:'WRI-A2-01-Q1',prompt:'Explain your thoughts',
  type:'extended_response',rubric_id:'RUBRIC-WRITING-A2'}]};
const grammar={id:'GRA-A2-01',title:'Grammar',
 activities:[{id:'GRA-A2-01-Q1',prompt:'Choose the correct verb',
  type:'single_choice',options:[{id:'a',text:'A'},{id:'b',text:'B'}],
  answer:{correct_option_id:'a'}}]};
const reading={id:'REA-A2-01',title:'Reading',
 activities:[{id:'REA-A2-01-Q1',prompt:'Find the main idea',
  type:'single_choice',options:[{id:'a',text:'A'},{id:'b',text:'B'}],
  answer:{correct_option_id:'a'}}]};
const make=(version,lessons,advice)=>({
 id:'foundation',version,digest:'upstream-validated-'+version,
 source:{course:{id:'foundation'},lessons,rubrics:{
 'RUBRIC-WRITING-A2':{criteria:['task'],guidance:advice}
 }}
});
const older=make('1.18.1',[writing,grammar],'Original Writing rubric');
const latest=make('1.20.0',[writing,grammar,reading],'Updated Writing rubric');
const attempts=Array.from({length:73},(_,i)=>({
 id:'synthetic-attempt-'+i,rootId:'synthetic-attempt-'+i,
 packageId:'foundation',version:i<20?older.version:latest.version,
 lessonId:i%3===0?'WRI-A2-01':'GRA-A2-01',
 status:i<52?'scored':'started',
 answers:{Q1:'original user text '+i},createdAt:100+i,evidence:[],
 ...(i<52?{submittedAt:200+i,results:[{id:'Q1',correct:true,explanation:'Original result'}]}:{})
}));
const key='g-learning:english:v1:owner:local-family:academic-attempts';
const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
const original=JSON.stringify(attempts);
(async()=>{
 const source=await planLessonRevisions([older,latest],attempts);
 const sourceStore=new Store(),sourceVault=new Vault({
  active:source.active,aliases:source.aliases,blobs:source.blobs
 });
 sourceStore.setItem(key,original);
 sourceStore.setItem(stateKey,JSON.stringify({writingDraft:'Original paragraph; do not rewrite'}));
 const savedKeys=new Map(sourceStore.data);
 const exported=await exportNormalizedBrowserRecoveryV3(
  sourceStore,sourceVault,'2026-11-07T04:00:00.000Z');
 const file=(await verifyRevisionRecoveryV3(exported.text)).file;
 assert.equal((await verifyRevisionRecoveryV3(exported.text)).attempts,73);
 assert.equal(file.entries.find(x=>x.key===key).value,original);
 assert.deepEqual(sourceStore.data,savedKeys,'Export cannot change owner records');
 assert.equal(sourceStore.getItem(RECOVERY_V3_MARKER),null,'Export cannot mark a restore');

 const empty=new Store(),targetVault=new Vault();
 const preview=await previewNormalizedV3Restore(exported.text,empty,targetVault);
 assert(preview.valid);
 assert.equal(preview.attempts,73);
 const restored=await restoreNormalizedV3(exported.text,preview.token,true,empty,targetVault);
 assert.equal(restored.attempts,73);
 assert.equal(empty.getItem(key),original);
 assert.equal(empty.getItem(stateKey),savedKeys.get(stateKey));
 assert.equal(empty.getItem(RECOVERY_V3_MARKER),null);
 assert.equal((await targetVault.snapshot()).active.version,latest.version);
 assert.equal((await targetVault.snapshot()).blobs.length,file.blobs.length);
 const refused=await previewNormalizedV3Restore(exported.text,empty,targetVault);
 assert.equal(refused.valid,false,'Never restore over an occupied learner profile');
 assert(refused.errors.some(x=>/occupied/.test(x)));

 // Interrupted quota after source install: rollback new learner entries only;
 // marker stays so later *identical file* can safely complete.
 const constrained=new Store(250),quotaVault=new Vault();
 const pv=await previewNormalizedV3Restore(exported.text,constrained,quotaVault);
 assert(pv.valid);
 await assert.rejects(
  restoreNormalizedV3(exported.text,pv.token,true,constrained,quotaVault),
  /incomplete/);
 assert.equal(constrained.getItem(key),null,'No partially restored attempted answers');
 assert.equal(constrained.getItem(RECOVERY_V3_MARKER),file.sha256,
  'An interrupted restore must not be mistaken for success');
 const retry=await previewNormalizedV3Restore(exported.text,constrained,quotaVault);
 assert(retry.valid&&retry.resuming,'Only identical verified backup may resume');
 const altered=JSON.parse(exported.text);altered.entries[0].value='[]';
 await assert.rejects(previewNormalizedV3Restore(JSON.stringify(altered),
  constrained,quotaVault),/Checksum mismatch/);
 constrained.limit=Infinity;
 const done=await restoreNormalizedV3(exported.text,retry.token,true,
  constrained,quotaVault);
 assert.equal(done.attempts,73);
 assert.equal(constrained.getItem(key),original);
 assert.equal(constrained.getItem(RECOVERY_V3_MARKER),null);

 // Content failure before learner writes also leaves an honest marker.
 const blocked=new Store(),blockedVault=new Vault();
 blockedVault.failNext=true;
 const before=await previewNormalizedV3Restore(exported.text,blocked,blockedVault);
 await assert.rejects(restoreNormalizedV3(exported.text,before.token,true,
  blocked,blockedVault),/incomplete/);
 assert.equal(blocked.getItem(key),null);
 assert.equal(blocked.getItem(RECOVERY_V3_MARKER),file.sha256);
 const again=await previewNormalizedV3Restore(exported.text,blocked,blockedVault);
 const recovered=await restoreNormalizedV3(exported.text,again.token,true,
  blocked,blockedVault);
 assert.equal(recovered.attempts,73);
 assert.equal(blocked.getItem(RECOVERY_V3_MARKER),null);

 // Existing data must not be altered by a mismatched restore file.
 const taken=new Store(),takenVault=new Vault();
 taken.setItem(key,'already-existing-learner-data');
 const takenSnapshot=new Map(taken.data);
 const blockedPreview=await previewNormalizedV3Restore(exported.text,taken,takenVault);
 assert.equal(blockedPreview.valid,false);
 assert.deepEqual(taken.data,takenSnapshot);
 console.log(JSON.stringify({result:'PASS',gate:'lesson-revision-restore-v3b-synthetic',
  primaryAttempts:73,scored:52,drafts:21,
  originalAttemptBytesPreserved:true,emptyProfileOnly:true,
  quotaRollback:true,interruptedMarkerPersisted:true,
  identicalBackupRetrySucceeded:true,
  blockedIdbRetrySucceeded:true,occupiedProfileRejected:true,
  browserIntegration:'NOT_TESTED',Safari:'NOT_TESTED',
  V2Compatibility:'NOT_IMPLEMENTED',productionWrites:0}));
})().catch(err=>{console.error(err);process.exitCode=1});
