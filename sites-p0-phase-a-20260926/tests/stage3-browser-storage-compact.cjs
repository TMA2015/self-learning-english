'use strict';
// Stage 3 storage migration: preserve historical packages/attempts while
// avoiding redundant mapped bundles in persistent browser localStorage.
// Real adapter + real curriculum inputs; no production browser/network used.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'.sites-runtime','stage3-storage-compact');
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'infrastructure/storage/browser-local-repositories.ts',
 'domain/academic.ts',
 '--outDir','.sites-runtime/stage3-storage-compact',
 '--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const {BrowserLocalAcademicRepository}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
const {mapSeed}=require(path.join(out,'domain/academic.js'));
const old=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');
const key='g-learning:english:v1:academic:packages';
const ownerKey='g-learning:english:v1:owner:family:academic-attempts';
const quota=5*1024*1024; // conservative 2-byte/code-unit simulated browser limit
class QuotaStorage{
 constructor(){this.map=new Map();this.writes=[]}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const attempt=new Map(this.map);attempt.set(k,String(v));
  const units=[...attempt].reduce((n,[name,value])=>n+name.length+value.length,0);
  if(units*2>quota){const e=new Error('Local storage quota exceeded');e.name='QuotaExceededError';throw e}
  this.map=attempt;this.writes.push(k);
 }
 removeItem(){throw Error('Historical local data must never be deleted')}
}
const asPackage=source=>({id:source.package_id,version:source.schema_version,
 digest:'a'.repeat(64),source,bundle:mapSeed(source),at:100});
(async()=>{
 const historical=asPackage(old),candidate=asPackage(next);
 assert(JSON.stringify([historical,candidate]).length*2>quota,
  'Test must reproduce the pre-fix two-version quota pressure');
 const storage=new QuotaStorage(),repo=new BrowserLocalAcademicRepository(storage);
 const legacyRaw=JSON.stringify([historical]);
 storage.setItem(key,legacyRaw);
 const historicAttempt={id:'historic-01',version:'1.18.0',lessonId:'REA-A1-01',status:'scored',answers:{},results:[{id:'x',correct:true}],evidence:[]};
 const attemptBytes=JSON.stringify([historicAttempt]);
 storage.setItem(ownerKey,attemptBytes);
 const before=await repo.packages();
 assert.deepEqual(before,[historical],'Legacy full package must remain readable');
 const oldDigest=before[0].digest;
 const startWrites=storage.writes.length;
 await repo.addPackage(candidate);
 assert.equal(storage.writes.length,startWrites+1,'One atomic package write only');
 assert.deepEqual(JSON.parse(storage.getItem(ownerKey)),[historicAttempt],'Historical attempt must remain intact');
 const stored=JSON.parse(storage.getItem(key));
 assert.deepEqual(stored.map(x=>x.version),['1.18.0','1.18.1']);
 assert(stored.every(x=>!Object.hasOwn(x,'bundle')),'Derived bundle must not be persisted twice');
 assert(storage.getItem(key).length*2<quota,'Two immutable source versions must fit simulated 5 MiB');
 const fresh=new BrowserLocalAcademicRepository(storage);
 const restored=await fresh.packages();
 assert.deepEqual(restored[0],historical,'Historical bundle must rehydrate identically');
 assert.deepEqual(restored[1],candidate,'Candidate bundle must rehydrate identically');
 restored[0].bundle.lessons[0].title='MUTATED IN CALLER';
 const readAgain=await fresh.packages();
 assert.deepEqual(readAgain[0],historical,'A caller must not mutate a cached historical bundle');
 assert.deepEqual(readAgain[1],candidate,'A caller must not mutate the other package');
 assert.equal(restored[0].digest,oldDigest);
 assert.deepEqual(restored.map(x=>x.source),[old,next],'Immutable historical source must be preserved');
 const size=storage.getItem(key).length;
 await fresh.addPackage(candidate);
 assert.equal(storage.getItem(key).length,size,'Reimport must not change stored bytes');
 assert.equal(storage.writes.length,startWrites+1,'Reimport must not write');
 await assert.rejects(()=>fresh.addPackage({...candidate,digest:'not-the-original'}),/Immutable curriculum version conflict/);
 // Failure path: existing compact historic package plus other local learning
 // data leaves insufficient quota. Reject the update, preserve the last good.
 const limited=new QuotaStorage();
 limited.setItem(key,JSON.stringify([{id:old.package_id,version:old.schema_version,digest:'a'.repeat(64),source:old,at:100}]));
 limited.setItem('other-family-data','x'.repeat(1_700_000));
 const priorSnapshot=new Map(limited.map);
 await assert.rejects(()=>new BrowserLocalAcademicRepository(limited).addPackage(candidate),
  /Could not save: this browser has no storage space available/);
 assert.deepEqual([...limited.map],[...priorSnapshot],'Failed upgrade must leave all prior local data unchanged');
 console.log(JSON.stringify({result:'PASS',gate:'stage3-browser-compact-storage',twoVersionCodeUnits:size,
  equivalentBundles:true,historicalAttemptPreserved:true,quotaFailureAtomic:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
