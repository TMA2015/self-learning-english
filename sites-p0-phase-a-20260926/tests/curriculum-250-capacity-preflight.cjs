'use strict';
/**
 * Isolated v1.24 -> synthetic 250-lesson importer capacity preflight.
 * No source import/deploy; never touches private learner or Safari storage.
 * Synthetic lessons are clones ONLY to exercise bounds, never academic content.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),target='.sites-runtime/curriculum-250-bound';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','infrastructure/browser/local-runtime.ts',
 '--outDir',target,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,target,'package.json'),'{"type":"commonjs"}\n');
const {MAX_CURRICULUM_LESSONS,validateSeed,mapSeed}
 =require(path.join(root,target,'domain/academic.js'));
const {validateContent}=require(path.join(root,target,'domain/content-model.js'));
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}
 =require(path.join(root,target,'infrastructure/storage/browser-local-repositories.js'));
const {academicService,sourceDigest}
 =require(path.join(root,target,'application/academic-service.js'));
const baseline=require('../content/curriculum-1.24.0-candidate.json');
assert.equal(MAX_CURRICULUM_LESSONS,250,'Ceiling must remain explicitly bounded at 250');
assert.equal(baseline.schema_version,'1.24.0');
assert.deepEqual([baseline.lessons.length,baseline.lessons.flatMap(l=>l.activities).length],[142,1085]);
assert.deepEqual(validateSeed(baseline),[],'Current released source must remain valid');
const originalIds=new Set(baseline.lessons.map(l=>l.id));
const prototype=baseline.lessons.find(l=>l.id==='REA-A1-07');
assert(prototype?.activities.length>=5);
const make=(number)=>{
 assert(number>=142&&number<=251);
 const next=structuredClone(baseline);
 next.schema_version='1.25.0';
 next.status='SYNTHETIC_CAPACITY_QA_ONLY_NOT_FOR_RELEASE';
 for(let i=0;i<number-142;i++){
  const id='REA-A1-'+String(i+100);
  assert(!originalIds.has(id));
  const l=structuredClone(prototype);
  l.id=id;l.title='Synthetic capacity fixture '+id;
  for(let j=0;j<l.activities.length;j++)l.activities[j].id=id+'-Q'+(j+1);
  next.lessons.push(l);next.course.sequence.push(id);
 }
 assert.equal(new Set(next.lessons.map(l=>l.id)).size,number);
 return next;
};
const bytes=s=>[...s.map].reduce((sum,[k,v])=>sum+2*(k.length+v.length),0);
class Storage{
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[]}
 get length(){return this.map.size}
 key(i){return [...this.map.keys()][i]??null}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const next=new Map(this.map);next.set(k,String(v));
  if([...next].reduce((total,[a,b])=>total+2*(a.length+b.length),0)>this.max){
   const err=Error('Browser quota exceeded');err.name='QuotaExceededError';throw err;
  }
  this.map=next;this.writes.push(k);
 }
 removeItem(){throw Error('Deleting stored records is forbidden in capacity QA')}
}
(async()=>{
 const accepted={};
 for(const n of [150,151,200,250]){
  const seed=make(n);
  assert.deepEqual(validateSeed(seed),[],n+'-lesson source must satisfy all existing checks');
  assert.deepEqual(validateContent(mapSeed(seed)),[],n+'-lesson bundle must pass content-model validation');
  assert.deepEqual(seed.lessons.slice(0,142),baseline.lessons);
  accepted[n]={lessons:n,activities:seed.lessons.flatMap(l=>l.activities).length};
 }
 const rejected=make(251),invalid=validateSeed(rejected);
 assert(invalid.some(s=>/250 lessons|Course sequence/.test(s)), '251 must fail BEFORE storage');
 const corrupted=make(151);corrupted.lessons[150].activities[0].evidence_weight=2;
 assert(validateSeed(corrupted).length>0,'Invalid evidence weight must still fail');
 const duplicate=make(151);duplicate.lessons[150].id=duplicate.lessons[149].id;
 assert(validateSeed(duplicate).length>0,'Duplicate IDs must still fail');
 const oversized=make(151);oversized.lessons[150].activities=Array.from({length:25},(_,i)=>({...oversized.lessons[150].activities[0],id:oversized.lessons[150].id+'-EX'+i}));
 assert(validateSeed(oversized).length>0,'25 activities per lesson must still fail');
 const secret=make(151);secret.lessons[150].profile={studentId:'FAKE'};
 assert(validateSeed(secret).length>0,'Learner fields must remain forbidden');

 const store=new Storage(),repo=new BrowserLocalAcademicRepository(store);
 const source=(s,at,digest)=>({id:s.package_id,version:s.schema_version,digest,source:s,bundle:mapSeed(s),at});
 const old=source(baseline,1,await sourceDigest(baseline));
 await repo.addPackage(old);
 // 73 synthetic attempts, not the owner's private device or backup.
 for(let i=0;i<73;i++){
  const l=baseline.lessons[i%baseline.lessons.length],q=l.activities[0],id='capacity-synthetic-'+String(i).padStart(3,'0');
  await repo.start('local-family',{
   id,rootId:id,packageId:baseline.package_id,version:'1.24.0',
   lessonId:l.id,status:i<52?'scored':'started',
   answers:{[q.id]:'unchanged-'+i},evidence:[],createdAt:1700000000000+i,
   ...(i<52?{submittedAt:1700000001000+i,results:[{id:q.id,correct:i%2===0,explanation:'Unchanged',tags:[...q.skill_tags]}]}:{})
  });
 }
 const history=await repo.attempts('local-family');
 const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
 store.setItem(stateKey,JSON.stringify({writing:'Keep original Writing draft for all releases'}));
 const originalState=store.getItem(stateKey),before=new Map(store.map),beforeSize=bytes(store);
 const candidate=make(250),svc=academicService(repo,new BrowserLocalLearningRepository(store),'local-family');
 const preview=await svc.preview(candidate);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:108,update:0,skip:142,conflict:0});
 const next=source(candidate,2,await sourceDigest(candidate));
 store.max=beforeSize+128;store.writes=[];
 await assert.rejects(repo.addPackage(next),/no storage space|quota/i);
 assert.deepEqual([...store.map],[...before],'Quota failed transaction must be completely atomic');
 assert.deepEqual(store.writes,[],'Quota failure must make zero local writes');
 assert.deepEqual(await repo.attempts('local-family'),history);
 assert.equal(store.getItem(stateKey),originalState);
 assert.deepEqual((await repo.packages()).map(p=>p.version),['1.24.0']);
 // A 5 MiB quota is only a portable simulation, NOT actual Safari capacity.
 store.max=5*1024*1024;store.writes=[];
 let simulated5MiB='BLOCKED_BY_QUOTA';
 try{
  await repo.addPackage(next);
  simulated5MiB='FITS_SYNTHETIC_5MIB';
 }catch(e){
  assert.match(String(e),/no storage space|quota/i);
  assert.deepEqual([...store.map],[...before]);
  assert.deepEqual(store.writes,[]);
 }
 const after5MiB=bytes(store);
 if(simulated5MiB==='BLOCKED_BY_QUOTA'){
  store.max=Infinity;
  await repo.addPackage(next);
 }
 assert.deepEqual((await repo.packages()).map(p=>p.version),['1.24.0','1.25.0']);
 assert.deepEqual(await repo.attempts('local-family'),history);
 assert.equal(store.getItem(stateKey),originalState);
 assert.equal((await svc.catalog()).lessons.length,250);
 assert.equal((await svc.lesson('REA-A1-07','1.24.0')).version,'1.24.0');
 const retention=await repo.previewRetention();
 assert.equal(retention.activeVersion,'1.25.0');
 assert(retention.retainedVersions.includes('1.24.0'));
 assert(retention.retainedVersions.includes('1.25.0'));
 console.log(JSON.stringify({
  result:'PASS',gate:'CURRICULUM_250_CAP_NONDESTRUCTIVE_PREFLIGHT',
  releasedBaseline:142,maxLessonBound:MAX_CURRICULUM_LESSONS,accepted,
  rejects251:true,invalidEvidenceRejected:true,invalidLessonActivitiesRejected:true,
  duplicateIdRejected:true,learnerStateRejected:true,
  immutableOldLessons:true,syntheticAttemptCount:73,scoredPreserved:52,draftsPreserved:21,
  simulated5MiB,baselineBytes:beforeSize,after5MiBBytes:after5MiB,
  lowQuotaFailClosed:true,zeroDeletion:true,versionPinnedHistory:true,
  previewOnlyRetention:true,realSafari:'NOT_TESTED',realLearnerData:'NOT_ACCESSED',
  curriculumProductionImport:false,deploy:false
 }));
})().catch(err=>{console.error(err);process.exitCode=1});
