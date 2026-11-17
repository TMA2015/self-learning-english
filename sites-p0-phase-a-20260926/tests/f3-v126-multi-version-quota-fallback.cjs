'use strict';
/**
 * v1.26.0 two-version long-history quota boundary, SYNTHETIC data only.
 * A single stored v1.25.0 source fits a representative 5 MiB mock quota
 * when adding v1.26.0; two retained cumulative versions may not.
 * This test never activates v1.26.0 in the browser runtime, compacts,
 * restores, deletes, migrates, touches a real learner, or deploys.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/f3-v126-multi-version-quota';
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
const old=[
 require('../content/curriculum-1.24.0-candidate.json'),
 require('../content/curriculum-1.25.0-candidate.json'),
];
const next=require('../content/curriculum-1.26.0-candidate.json');
const owner='local-family',limit=5*1024*1024;
const size=map=>[...map].reduce((n,[key,value])=>n+2*(key.length+value.length),0);
class Storage{
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[];this.deletions=0}
 get length(){return this.map.size}
 key(i){return [...this.map.keys()][i]??null}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const future=new Map(this.map);future.set(k,String(v));
  if(size(future)>this.max){const error=Error('Browser quota exceeded');error.name='QuotaExceededError';throw error}
  this.map=future;this.writes.push(k);
 }
 removeItem(){this.deletions++;throw Error('Forbidden deletion during v1.26.0 preflight')}
}
(async()=>{
 assert.deepEqual(old.map(p=>p.schema_version),['1.24.0','1.25.0']);
 assert.equal(next.schema_version,'1.26.0');
 assert.deepEqual(validateSeed(next),[]);
 assert.deepEqual(next.lessons.slice(0,154),old[1].lessons);
 const storage=new Storage(),repo=new BrowserLocalAcademicRepository(storage),
 learning=new BrowserLocalLearningRepository(storage),svc=academicService(repo,learning,owner);
 const record=async(s,at)=>({id:s.package_id,version:s.schema_version,
  digest:await sourceDigest(s),source:s,bundle:mapSeed(s),at});
 for(let i=0;i<old.length;i++)await repo.addPackage(await record(old[i],i+1));
 const lessonIds=['GRA-A1-01','LIS-A1-03','WRI-A1-05','VOC-A2-03','REA-A2-08'];
 for(let i=0;i<73;i++){
  const src=old[i%old.length],lessonId=lessonIds[i%lessonIds.length];
  const lesson=src.lessons.find(l=>l.id===lessonId);
  assert(lesson,'Missing synthetic source '+lessonId+' at '+src.schema_version);
  const q=lesson.activities[0],scored=i<52;
  const id='synthetic-f3-longhistory-'+String(i+1).padStart(3,'0');
  await repo.start(owner,{
   id,rootId:id,packageId:src.package_id,version:src.schema_version,
   lessonId,status:scored?'scored':'started',
   answers:{[q.id]:'protected-answer-'+i},createdAt:1700000000000+i,
   evidence:[{id:'synthetic-evidence-'+i,at:1700000000000+i,tag:'mock'}],
   ...(scored?{submittedAt:1700000001000+i,results:[{
    id:q.id,correct:i%2===0,explanation:'Immutable historical feedback',
    tags:[...q.skill_tags]}]}:{})
  });
 }
 const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
 storage.setItem(stateKey,JSON.stringify({
  writing:'Preserve all saved Writing drafts',reviews:[{id:'synthetic-review',text:'Keep'}],
  completed:[1,2,3]
 }));
 const before=new Map(storage.map),beforeBytes=size(before),
 attempts=await repo.attempts(owner),oldState=storage.getItem(stateKey);
 assert.equal(attempts.length,73);
 assert.equal(attempts.filter(a=>a.status==='scored').length,52);
 assert.equal(attempts.filter(a=>a.status==='started').length,21);
 assert(beforeBytes<limit,'Fixture must fit before importing v1.26.0');
 const preview=await svc.preview(next);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:12,update:0,skip:154,conflict:0});
 const incoming=await record(next,3);
 async function verifyFailedImport(){
  assert.deepEqual([...storage.map],[...before],'Failed import changed localStorage bytes');
  assert.deepEqual(storage.writes,[],'Failed import wrote a key');
  assert.equal(storage.deletions,0,'A storage key was deleted');
  assert.deepEqual(await repo.attempts(owner),attempts,'Failed import changed 73 attempts');
  assert.equal(storage.getItem(stateKey),oldState,'Writing or reviews were changed');
  assert.deepEqual((await repo.packages()).map(p=>p.version),['1.24.0','1.25.0']);
  const catalog=await svc.catalog();
  assert.equal(catalog.version,'1.25.0','Failed import must retain current catalog');
  for(const version of ['1.24.0','1.25.0'])
   assert.equal((await svc.lesson('GRA-A1-01',version)).version,version);
 }
 storage.max=beforeBytes+128;storage.writes=[];
 await assert.rejects(()=>repo.addPackage(incoming),/no storage space|quota/i);
 await verifyFailedImport();
 storage.max=limit;storage.writes=[];
 await assert.rejects(()=>repo.addPackage(incoming),/no storage space|quota/i);
 await verifyFailedImport();
 const retention=await repo.previewRetention();
 assert.equal(retention.activeVersion,'1.25.0');
 assert.deepEqual([...storage.map],[...before],'Read-only retention preview changed storage');
 storage.max=Infinity;storage.writes=[];
 await repo.addPackage(incoming);
 assert.equal((await svc.catalog()).version,'1.26.0');
 assert.deepEqual(await repo.attempts(owner),attempts,'Unlimited successful import altered history');
 assert.equal(storage.getItem(stateKey),oldState);
 for(const version of ['1.24.0','1.25.0'])
  assert.equal((await svc.lesson('GRA-A1-01',version)).version,version);
 console.log(JSON.stringify({
  result:'PASS',gate:'F3_V126_TWO_VERSION_LONG_HISTORY_QUOTA_FAIL_CLOSED',
  retainedVersionsBefore:['1.24.0','1.25.0'],attemptedVersion:'1.26.0',
  syntheticHistory:73,scoredPreserved:52,draftsPreserved:21,
  beforeBytes,simulatedQuotaBytes:limit,fiveMiBResult:'BLOCKED_BY_QUOTA',
  noWritesOnFailedUpgrade:true,storageDeletions:0,
  originalWritingAndReviewsPreserved:true,retentionPreviewOnly:true,
  versionPinnedHistory:true,unlimitedImportWorks:true,
  realSafari:'NOT_TESTED',realLearnerData:'NOT_ACCESSED',
  productionActivation:false,migration:false,deploy:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
