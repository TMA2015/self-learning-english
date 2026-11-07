'use strict';
/**
 * Draft v1.20.0 -> v1.21.0 real browser-storage repository upgrade preflight.
 * Uses the actual versioned candidate and production storage algorithms, but
 * runs only in an isolated in-memory quota-enforced store. Never alters users.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/unit10-real-upgrade';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','infrastructure/browser/local-runtime.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}
 =require(path.join(root,out,'infrastructure/storage/browser-local-repositories.js'));
const {academicService,sourceDigest}
 =require(path.join(root,out,'application/academic-service.js'));
const {mapSeed,validateSeed}=require(path.join(root,out,'domain/academic.js'));
const {composeUnit10}=require('../scripts/compose-unit10-v121-candidate.cjs');
const oldSource=require('../content/curriculum-1.20.0-candidate.json');
const candidate=composeUnit10();
assert.deepEqual(validateSeed(candidate),[],'Candidate must use unchanged production schema');
assert.equal(candidate.schema_version,'1.21.0');
assert.equal(candidate.lessons.length,132);
assert.deepEqual(candidate.lessons.slice(0,123),oldSource.lessons);
class Storage{
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[];}
 getItem(key){return this.map.get(key)??null;}
 setItem(key,value){
  const data=String(value);
  const other=[...this.map].reduce((n,[k,v])=>n+(k===key?0:2*(k.length+v.length)),0);
  if(other+2*(key.length+data.length)>this.max){
   const e=Error('Browser quota exceeded');e.name='QuotaExceededError';throw e;
  }
  this.map.set(key,data);this.writes.push(key);
 }
 removeItem(){throw Error('No silent deletion of learner storage is allowed');}
}
const size=s=>[...s.map].reduce((n,[k,v])=>n+(k.length+v.length)*2,0);
const snapshot=s=>new Map(s.map);
const quota=5*1024*1024;
const candidatePackage=async()=>({
 id:candidate.package_id,version:candidate.schema_version,digest:await sourceDigest(candidate),
 source:candidate,bundle:mapSeed(candidate),at:Date.parse('2026-11-07T00:00:00.000Z')
});
(async()=>{
 const store=new Storage();
 const repo=new BrowserLocalAcademicRepository(store);
 const learner=new BrowserLocalLearningRepository(store);
 const service=academicService(repo,learner,'local-family');
 await repo.addPackage({
  id:oldSource.package_id,version:'1.20.0',
  digest:await sourceDigest(oldSource),source:oldSource,
  bundle:mapSeed(oldSource),at:1
 });
 const id='old-1200-learner-attempt-unit10';
 const lesson=oldSource.lessons.find(l=>l.id==='GRA-A1-04');
 assert(lesson&&lesson.activities?.length>0);
 const started=await service.start(lesson.id,id);
 const answers=Object.fromEntries(lesson.activities.map(q=>[
  q.id,q.answer?.correct_option_id??q.answer?.accepted_answers?.[0]??'test'
 ]));
 await service.draft(started.id,answers);
 const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
 store.setItem(stateKey,JSON.stringify({writing:'Preserve my original writing draft',profile:{name:'QA'}}));
 const preserved=(await repo.attempts('local-family')).find(a=>a.id===id);
 assert.deepEqual(preserved?.answers,answers);
 const baselineSnapshot=snapshot(store);
 const baselineSize=size(store);
 const preview=await service.preview(candidate);
 assert.deepEqual(preview.counts,{add:9,update:0,skip:123,conflict:0});
 assert.deepEqual(preview.errors,[]);

 // Guaranteed low-quota failure: no document may be partially overwritten.
 store.max=baselineSize+64;
 store.writes=[];
 await assert.rejects(async()=>repo.addPackage(await candidatePackage()),
  /no storage space|quota/i,'New candidate must reject quota instead of deleting history');
 assert.deepEqual(store.map,baselineSnapshot,'Quota failure changed old browser bytes');
 assert.deepEqual(store.writes,[],'Quota failure must not write any storage key');
 assert.deepEqual((await repo.attempts('local-family')).find(a=>a.id===id),preserved);
 let automaticUnder5MiB=false,retentionApprovedUnder5MiB=false,remainingUnder5MiB=false;
 const baselineFits=baselineSize<quota;
 let preRetentionBytes=baselineSize,postRetentionBytes=null;
 // Estimate typical browser localStorage budget conservatively. This is a
 // reproducible simulation, not a guarantee of browser-specific quotas.
 store.max=quota;
 if(baselineFits){
  try{await repo.addPackage(await candidatePackage());automaticUnder5MiB=true}
  catch(e){
   assert.match(String(e),/no storage space|quota/i);
   assert.deepEqual(store.map,baselineSnapshot,'Realistic quota fail changed prior attempts');
   const plan=await repo.previewRetention();
   assert.equal(plan.activeVersion,'1.20.0');
   store.max=Infinity; // User-confirmed retention is a separate transaction.
   await repo.compactRetention(plan.token,true);
   postRetentionBytes=size(store);
   store.max=quota;
   if(postRetentionBytes<=quota){
    try{await repo.addPackage(await candidatePackage());retentionApprovedUnder5MiB=true}
    catch(e){assert.match(String(e),/no storage space|quota/i);remainingUnder5MiB=true;}
   }else remainingUnder5MiB=true;
  }
 }
 // Model unlimited space only to check historical-version pinning and
 // algorithmic migration; do not imply infinite real browser storage.
 store.max=Infinity;
 if(!(automaticUnder5MiB||retentionApprovedUnder5MiB))
  await repo.addPackage(await candidatePackage());
 const packages=await repo.packages();
 assert.deepEqual(packages.map(x=>x.version).sort(),['1.20.0','1.21.0']);
 const oldAttempt=(await repo.attempts('local-family')).find(x=>x.id===id);
 assert.deepEqual(oldAttempt,preserved,'Versioned old attempt changed');
 assert.equal(store.getItem(stateKey),baselineSnapshot.get(stateKey),'Old writing data changed');
 assert.equal((await service.lesson(lesson.id,'1.20.0')).version,'1.20.0');
 assert.equal((await service.lesson(lesson.id)).version,'1.21.0');
 assert.equal((await service.catalog()).lessons.length,132);
 const oldVersion=packages.find(x=>x.version==='1.20.0');
 assert(oldVersion?.source.lessons.some(l=>l.id===lesson.id),
  'Archived old lesson missing despite saved attempt');
 assert.equal(candidate.lessons.slice(0,123).length,123);
 console.log(JSON.stringify({
  result:'PASS',gate:'UNIT10_1200_TO_1210_STORAGE_SAFETY',
  preview:preview.counts,oldAttemptPreserved:true,oldWritingPreserved:true,
  oldVersionPinned:true,noAutomaticDeletion:true,quotaFailureAtomic:true,
  baselineBytes:baselineSize,afterRetentionBytes:postRetentionBytes,
  simulatedQuotaBytes:quota,
  autoUpgradeFitsTypicalQuota:automaticUnder5MiB,
  explicitRetentionThenUpgradeFitsTypicalQuota:retentionApprovedUnder5MiB,
  stillInsufficientAfterRetention:remainingUnder5MiB,
  trueBrowserQuotaVaries:true,
  localTestOnly:true,productionImport:false,releaseAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1;});
