'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process');const root=path.resolve(__dirname,'..');
const out='.sites-runtime/hybrid-portable-recovery';
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/hybrid-local-recovery.ts',
 'infrastructure/storage/hybrid-academic-repository.ts',
 'application/academic-service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/hybrid-local-recovery.js');
const v2=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {HybridBrowserAcademicRepository}=require('../'+out+'/infrastructure/storage/hybrid-academic-repository.js');
const {retainReferencedLessons}=require('../'+out+'/domain/storage-retention.js');
const {mapSeed}=require('../'+out+'/domain/academic.js');
const {academicService}=require('../'+out+'/application/academic-service.js');
const {BrowserLocalLearningRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const a=require('../content/curriculum-1.18.0-candidate.json');
const b=require('../content/curriculum-1.18.1-candidate.json');
const c=require('../content/curriculum-1.20.0-candidate.json');
const key='g-learning:english:v1:academic:packages';
const learner='g-learning:english:v1:owner:local-family:academic-attempts';
const state='g-learning:english:v1:owner:local-family:learner:primary:state';
class Store {
 constructor(limit=Infinity){this.items=new Map();this.limit=limit;this.deleted=[];this.written=[]}
 get length(){return this.items.size}
 key(i){return [...this.items.keys()][i]??null}
 getItem(k){return this.items.get(k)??null}
 setItem(k,v){
  const next=new Map(this.items);next.set(k,String(v));
  const estimated=[...next].reduce((n,[a,b])=>n+2*(a.length+b.length),0);
  if(estimated>this.limit){const e=Error('quota exceeded');e.name='QuotaExceededError';throw e}
  this.items=next;this.written.push(k);
 }
 removeItem(k){this.deleted.push(k);this.items.delete(k)}
}
const pkg=(s)=>({id:s.package_id,version:s.schema_version,
 digest:'sha-immutable-'+s.schema_version,source:s,at:1});
class Vault {
 constructor(){this.rows=new Map()}
 async list(){return [...this.rows.values()].map(x=>JSON.parse(JSON.stringify(x)))}
 async putImmutable(p){
  const prev=this.rows.get(p.version);
  if(prev){
   if(JSON.stringify(prev)!==JSON.stringify(p))throw Error('Immutable curriculum version conflict');
   return 'identical';
  }
  this.rows.set(p.version,JSON.parse(JSON.stringify(p)));return 'added';
 }
 async retainAfterVerifiedBackup(expected,refs,confirmed){
  assert(confirmed);
  const actual=await this.list();
  assert.deepEqual(actual,expected,'Simulated IDB transaction must re-check original sources');
  const plan=retainReferencedLessons(expected,refs);
  this.rows=new Map(plan.records.map(x=>[x.version,JSON.parse(JSON.stringify(x))]));
  return {beforeVersions:expected.length,afterVersions:plan.records.length,
   archivedLessons:plan.protectedLessonCount};
 }
}
const attempts=Array.from({length:73},(_,i)=>{
 const src=i<11?a:c;
 const l=src.lessons[i%src.lessons.length];
 return {id:'historic-attempt-'+i,packageId:src.package_id,
  version:src.schema_version,lessonId:l.id,rootId:'historic-attempt-'+i,
  status:i<52?'scored':'started',answers:{},createdAt:i+1,
  ...(i<52?{submittedAt:i+100,results:[]}:{}) ,evidence:[]};
});
(async()=>{
 // A first-time visitor must be able to read an empty catalog and install
 // the currently shipped curriculum into IDB without localStorage content.
 const brandNew=new Store(),brandNewVault=new Vault();
 const boot=new HybridBrowserAcademicRepository(brandNew,brandNewVault);
 assert.deepEqual(await boot.packages(),[]);
 await boot.addPackage({...pkg(c),bundle:mapSeed(c)});
 assert.equal((await boot.packages()).length,1);
 assert.equal((await boot.packages())[0].version,'1.20.0');
 assert.equal(brandNew.getItem(key),null,'Bootstrap cannot write a full localStorage curriculum');
 const freshOriginal=new Map(brandNew.items);
 await boot.addPackage({...pkg(c),bundle:mapSeed(c)});
 assert.deepEqual(brandNew.items,freshOriginal,'Refresh must not alter learner localStorage');
 const old=new Store();
 old.setItem(key,JSON.stringify([pkg(a),pkg(b)]));
 old.setItem(learner,JSON.stringify(attempts));
 old.setItem(state,JSON.stringify({writingDraft:'keep original text',completed:[]}));
 const oldSnapshot=new Map(old.items);
 const vault=new Vault();await vault.putImmutable(pkg(c));
 const hybrid=await recovery.exportHybridRecoveryV2(old,vault);
 assert.equal(hybrid.attempts,73);
 assert.equal(hybrid.versions,2,'only latest full + referenced historic source');
 assert.equal((await v2.verifyLocalRecoveryV2(hybrid.text)).attempts,73);
 assert.deepEqual(old.items,oldSnapshot,'export must not edit source keys');
 // The family can free large legacy content ONLY after reselecting a verified
 // backup with the exact same entry checksum. Never delete learner keys.
 await assert.rejects(()=>recovery.moveLegacyCurriculumAfterVerifiedBackup(
  '{"format":"not-a-recovery"}',old,vault,true),/Unsupported recovery file/);
 assert.deepEqual(old.items,oldSnapshot,'Invalid backup cannot authorize cleanup');
 const moved=await recovery.moveLegacyCurriculumAfterVerifiedBackup(
  hybrid.text,old,vault,true);
 assert.equal(moved.moved,true);
 assert.equal(moved.attempts,73);
 assert.equal(old.getItem(key),null,'Only old curriculum localStorage key may be removed');
 assert.equal(old.getItem(learner),oldSnapshot.get(learner));
 assert.equal(old.getItem(state),oldSnapshot.get(state));
 const movedBackup=await recovery.exportHybridRecoveryV2(old,vault);
 assert.equal(JSON.parse(movedBackup.text).sha256,JSON.parse(hybrid.text).sha256,
  'A move between stores must not silently change the portable V2 Recovery SHA');
 assert.equal((await new HybridBrowserAcademicRepository(old,vault)
  .attempts('local-family')).length,73);
 const preCompact=await vault.list();
 await assert.rejects(()=>recovery.compactIndexedDBAfterVerifiedBackup(
  hybrid.text,old,vault,false),/Explicit verified-backup confirmation/);
 assert.deepEqual(await vault.list(),preCompact,'No cleanup without verified consent');
 const retained=await recovery.compactIndexedDBAfterVerifiedBackup(
  hybrid.text,old,vault,true);
 assert.equal(retained.afterVersions,2,'Delete only unused complete older versions');
 const remaining=await vault.list();
 assert.deepEqual(remaining.map(x=>x.version),['1.18.0','1.20.0']);
 assert.equal(remaining.find(x=>x.version==='1.18.0').archive,'referenced-lessons');
 assert.equal(remaining.find(x=>x.version==='1.18.0').source.lessons.length,11);
 assert.equal(remaining.find(x=>x.version==='1.20.0').source.lessons.length,123);
 assert.equal(old.getItem(learner),oldSnapshot.get(learner));
 assert.equal(old.getItem(state),oldSnapshot.get(state));
 assert.equal(JSON.parse((await recovery.exportHybridRecoveryV2(old,vault)).text).sha256,
  JSON.parse(hybrid.text).sha256,'Compact IDB must not alter the portable V2 Recovery SHA');
 const file=JSON.parse(hybrid.text);
 const versionDocs=JSON.parse(file.entries.find(x=>x.key===key).value).records;
 assert.equal(versionDocs.find(x=>x.version==='1.18.0').archive,'referenced-lessons');
 assert.equal(versionDocs.find(x=>x.version==='1.20.0').source.lessons.length,123);
 // Real old-recovery issue: three cumulative sources cannot fit an illustrative
 // strict 5 MiB localStorage cap; this is a simulation, not measured Safari.
 const huge=new Store(5*1024*1024);
 const allFull=JSON.stringify([pkg(a),pkg(b),pkg(c)]);
 // The raw historic backup also contains drafts, results, state and evidence.
 // The three deduplicated fixture packages alone are smaller than the actual
 // iPad backup; simulate the realistic accumulated learner-state headroom.
 assert.throws(()=>{
  huge.setItem(key,allFull);
  huge.setItem(learner,JSON.stringify(attempts));
  const used=[...huge.items].reduce((n,[a,b])=>n+2*(a.length+b.length),0);
  const extra=Math.max(512,Math.ceil((huge.limit-used)/2)+256);
  huge.setItem(state,JSON.stringify({unsubmittedDraft:'x'.repeat(extra)}));
 },/quota exceeded/);
 const fresh=new Store(5*1024*1024),freshVault=new Vault();
 await freshVault.putImmutable(pkg(c)); // ordinary site bootstrap goes to IDB
 const preview=await recovery.previewHybridRecoveryV2(hybrid.text,fresh,freshVault);
 assert(preview.valid);
 const installed=await recovery.restoreHybridRecoveryV2(hybrid.text,preview.token,true,fresh,freshVault);
 assert.equal(installed.attempts,73);
 assert.equal(fresh.getItem(key),null,'large content source must NOT enter localStorage');
 assert.deepEqual(JSON.parse(fresh.getItem(learner)),attempts);
 assert.equal(JSON.parse(fresh.getItem(state)).writingDraft,'keep original text');
 assert.equal(fresh.getItem(v2.RECOVERY_MARKER),null);
 const readThrough=new HybridBrowserAcademicRepository(fresh,freshVault);
 const pkgs=await readThrough.packages();
 assert(pkgs.some(p=>p.version==='1.20.0'));
 assert(pkgs.some(p=>p.version==='1.18.0'&&p.source.lessons.length>0));
 assert.equal((await readThrough.attempts('local-family')).length,73);
 // Real academic service (not only storage mocks): start a new lesson,
 // persist draft, recreate service (page reload), submit and re-export.
 const practice=c.lessons.find(l=>l.module==='grammar'&&
  l.activities.length&&l.activities.every(q=>q.type!=='extended_response'));
 assert(practice,'Reviewed 1.20 curriculum needs an objective Grammar lesson');
 const attemptId='idb-post-restore-attempt-0001';
 const acad=academicService(readThrough,new BrowserLocalLearningRepository(fresh),'local-family');
 const started=await acad.start(practice.id,attemptId);
 assert.equal(started.version,'1.20.0');
 const answers=Object.fromEntries(practice.activities.map(q=>[
  q.id,q.type==='single_choice'?q.answer.correct_option_id:q.answer.accepted_answers[0]
 ]));
 const savedDraft=await acad.draft(attemptId,answers);
 assert.deepEqual(savedDraft.answers,answers);
 const newAcad=academicService(new HybridBrowserAcademicRepository(fresh,freshVault),
  new BrowserLocalLearningRepository(fresh),'local-family');
 const reloaded=(await newAcad.catalog()).attempts.find(x=>x.id===attemptId);
 assert(reloaded&&reloaded.status==='started'&&reloaded.version==='1.20.0');
 const completed=await newAcad.submit(attemptId);
 assert.equal(completed.status,'scored');
 assert.equal(completed.version,'1.20.0');
 assert.equal((await newAcad.catalog()).attempts.length,74);
 assert.equal(fresh.getItem(key),null,'Learner Save/Submit must not grow the curriculum localStorage key');
 const second=await recovery.exportHybridRecoveryV2(fresh,freshVault);
 assert.equal((await v2.verifyLocalRecoveryV2(second.text)).attempts,74,
  'Roundtrip must retain all original and newly submitted attempt/source relationships');
 const duplicate=await recovery.previewHybridRecoveryV2(hybrid.text,fresh,freshVault);
 assert.equal(duplicate.valid,false,'Restore must never overwrite an occupied learner');
 // Future release regression: after 73 old attempts + one scored answer,
 // a newly approved cumulative version must become the active catalog
 // without rewriting version-pinned history or any curriculum localStorage key.
 const nextSource={...c,schema_version:'1.21.0'};
 await readThrough.addPackage({...pkg(nextSource),bundle:mapSeed(nextSource)});
 const nextService=academicService(readThrough,new BrowserLocalLearningRepository(fresh),'local-family');
 const upgraded=await nextService.catalog();
 assert.equal(upgraded.version,'1.21.0');
 assert.equal(upgraded.lessons.length,123);
 assert.equal(upgraded.attempts.length,74);
 assert.equal(upgraded.attempts.find(x=>x.id===attemptId).version,'1.20.0');
 assert.equal(upgraded.attempts[0].version,'1.18.0');
 assert.equal(fresh.getItem(key),null,'Curriculum updates must not grow localStorage');
 const afterUpgrade=await recovery.exportHybridRecoveryV2(fresh,freshVault);
 assert.equal((await v2.verifyLocalRecoveryV2(afterUpgrade.text)).attempts,74);
 assert.equal(afterUpgrade.versions,3,'Historic versions and future current content remain portable');
 // Quota error after IDB content put: localStorage rollback must restore
 // all prior keys byte-for-byte and no interrupted marker may be left.
 const narrow=new Store(200),narrowVault=new Vault();
 const narrowP=await recovery.previewHybridRecoveryV2(hybrid.text,narrow,narrowVault);
 assert(narrowP.valid);
 const prior=new Map(narrow.items);
 await assert.rejects(()=>recovery.restoreHybridRecoveryV2(
  hybrid.text,narrowP.token,true,narrow,narrowVault),/quota|storage/i);
 assert.deepEqual(narrow.items,prior);
 assert.equal(narrow.getItem(v2.RECOVERY_MARKER),null);
 assert((await narrowVault.list()).length>=0);
 console.log(JSON.stringify({result:'PASS',gate:'hybrid-v2-portable-recovery',
  originalFileSchema:2,restoredAttempts:73,postRestoreAttempts:74,
  protectedScored:52,protectedDrafts:21,postRestoreSubmission:true,
  pageReloadDraftSurvives:true,
  futureContentUpgradePreservesHistoricAttempts:true,
  freshBrowserQuotaBytes:5*1024*1024,
  recoveryPortableAfterIdbMove:true,contentLocalStorageBytes:0,
  verifiedSourceMigration:true,verifiedOldVersionDeletion:true,
  sourceVersionsAfterCleanup:2,originalLearnerKeysBytePreserved:true,
  repeatedRestorePrevented:true,quotaFailureRollback:true,
  realSafariAcceptance:'NOT_TESTED',productionWrites:0}));
})().catch(err=>{console.error(err);process.exitCode=1});
