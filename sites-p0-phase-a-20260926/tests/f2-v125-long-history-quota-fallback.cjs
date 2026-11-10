'use strict';
/**
 * v1.25.0 long-history capacity boundary, SYNTHETIC data only.
 * 1.22 + 1.23 + 1.24 cumulative packages are an important counterexample to
 * one-version and two-version "fits 5MiB" tests. No Safari or real owner state.
 * Proves fail-closed runtime warning and exact historical attempt immutability
 * under an attempted *additive* 1.25.0 import; never compacts or deletes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='.sites-runtime/f2-v125-long-history';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-runtime.ts','--outDir',dir,'--module','commonjs',
 '--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck',
 '--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,dir,'package.json'),'{"type":"commonjs"}\n');
const runtime=require(path.join(root,dir,'infrastructure/browser/local-runtime.js'));
const {BrowserLocalAcademicRepository}=require(path.join(root,dir,'infrastructure/storage/browser-local-repositories.js'));
const {sourceDigest}=require(path.join(root,dir,'application/academic-service.js'));
const {mapSeed}=require(path.join(root,dir,'domain/academic.js'));
const old=[
 require('../content/curriculum-1.22.0-candidate.json'),
 require('../content/curriculum-1.23.0-candidate.json'),
 require('../content/curriculum-1.24.0-candidate.json'),
];
const next=require('../content/curriculum-1.25.0-candidate.json');
const owner='local-family',limit=5*1024*1024;
const size=map=>[...map].reduce((n,[k,v])=>n+2*(k.length+v.length),0);
class Storage{
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[];this.deletions=0}
 get length(){return this.map.size}
 key(i){return [...this.map.keys()][i]??null}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const future=new Map(this.map);future.set(k,String(v));
  if(size(future)>this.max){const e=Error('quota');e.name='QuotaExceededError';throw e}
  this.map=future;this.writes.push(k);
 }
 removeItem(){this.deletions++;throw Error('Curriculum upgrade must never delete browser data')}
}
(async()=>{
 assert.deepEqual(old.map(p=>p.schema_version),['1.22.0','1.23.0','1.24.0']);
 assert.equal(next.schema_version,'1.25.0');
 assert.deepEqual(next.lessons.slice(0,142),old[2].lessons);
 const store=new Storage(),repo=new BrowserLocalAcademicRepository(store);
 for(let i=0;i<old.length;i++){
  const p=old[i];
  await repo.addPackage({id:p.package_id,version:p.schema_version,
   digest:await sourceDigest(p),source:p,bundle:mapSeed(p),at:i+1});
 }
 const lessonIds=['GRA-A1-01','LIS-A1-03','WRI-A1-05','VOC-A2-03','REA-A2-08'];
 for(let i=0;i<73;i++){
  const version=old[i%old.length],id='synthetic-history-v125-'+String(i+1).padStart(3,'0');
  const lesson=version.lessons.find(l=>l.id===lessonIds[i%lessonIds.length]);
  assert(lesson,'Historical test lesson must exist in '+version.schema_version);
  const q=lesson.activities[0],scored=i<52;
  await repo.start(owner,{
   id,rootId:id,packageId:version.package_id,version:version.schema_version,
   lessonId:lesson.id,status:scored?'scored':'started',
   answers:{[q.id]:'protected-answer-'+i},createdAt:1700000000000+i,
   evidence:[{id:'synthetic-evidence-'+i,at:1700000000000+i,tag:'mock'}],
   ...(scored?{submittedAt:1700000001000+i,results:[{
    id:q.id,correct:i%2===0,explanation:'Original scoring snapshot remains unchanged',
    tags:[...q.skill_tags]}]}:{})
  });
 }
 const stateKey='g-learning:english:v1:owner:local-family:learner:primary:state';
 store.setItem(stateKey,JSON.stringify({writing:'Historical draft must remain intact',
  reviews:[{id:'synthetic-review',note:'Do not alter'}],completed:[1,2,3]}));
 const before=new Map(store.map),beforeBytes=size(before);
 const attempts=await repo.attempts(owner),state=store.getItem(stateKey);
 assert.equal(attempts.length,73);
 assert.equal(attempts.filter(a=>a.status==='scored').length,52);
 assert.equal(attempts.filter(a=>a.status==='started').length,21);
 // Always force quota failure, even if available simulated 5MiB varies.
 store.max=beforeBytes+128;store.writes=[];global.window={localStorage:store};
 const blocked=await runtime.localAcademicRuntime();
 const catalog=await blocked.service.catalog();
 assert.equal(catalog.version,'1.24.0','Failed v1.25 must not report new curriculum');
 assert.equal(catalog.lessons.length,142);
 assert.match(blocked.warning??'',/automatic English lesson update was paused/i);
 assert.match(blocked.warning??'',/New saves may also fail/i);
 assert.deepEqual([...store.map],[...before],'Quota failure changed any localStorage key');
 assert.deepEqual(store.writes,[],'Quota failure performed a successful write');
 assert.equal(store.deletions,0);
 assert.deepEqual(await repo.attempts(owner),attempts,'No scored/draft evidence changes');
 assert.equal(store.getItem(stateKey),state,'Writing/reviews/state must remain unchanged');
 for(const p of old)assert.equal((await blocked.service.lesson('GRA-A1-01',p.schema_version)).version,p.schema_version);
 const retention=await repo.previewRetention(); // read-only; never call compactRetention
 assert.equal(retention.activeVersion,'1.24.0');
 assert.deepEqual(retention.beforeVersions,old.map(p=>p.schema_version));
 assert.deepEqual([...store.map],[...before],'Read-only retention preview wrote storage');
 // Optional representative 5MiB attempt on SAME synthetic state.
 let fiveMiBResult='PREEXISTING_HISTORY_EXCEEDS_5MIB';
 let afterFiveMiBBytes=beforeBytes;
 if(beforeBytes<limit){
  store.max=limit;store.writes=[];
  const maybe=await runtime.localAcademicRuntime();
  const v=(await maybe.service.catalog()).version;
  assert(['1.24.0','1.25.0'].includes(v));
  fiveMiBResult=v==='1.25.0'?'FITS_SYNTHETIC_5MIB':'BLOCKED_BY_QUOTA';
  if(v==='1.24.0'){
   assert.match(maybe.warning??'',/storage space/i);
   assert.deepEqual([...store.map],[...before],'5MiB failure must be atomic');
   assert.deepEqual(store.writes,[]);
  }
  afterFiveMiBBytes=size(store.map);
  assert.deepEqual(await repo.attempts(owner),attempts);
  assert.equal(store.getItem(stateKey),state);
 }
 console.log(JSON.stringify({
  result:'PASS',gate:'F2_V125_THREE_VERSION_LONG_HISTORY_FAIL_CLOSED',
  historicalPackageVersions:old.map(p=>p.schema_version),
  attemptedVersion:'1.25.0',historicalAttemptCount:73,
  scoredPreserved:52,draftsPreserved:21,
  beforeBytes,syntheticQuotaBytes:limit,fiveMiBResult,afterFiveMiBBytes,
  forcedLowQuotaFallback:true,userFacingWarning:true,
  retainedOldCatalogVersion:'1.24.0',historicalVersionsAccessible:true,
  immutableLearnerEvidence:true,writingAndReviewsPreserved:true,
  noWritesOnFailedUpgrade:true,storageDeletions:0,
  retentionPreviewOnly:true,realIPadSafari:'NOT_TESTED',
  realLearnerData:'NOT_ACCESSED',migration:false,productionDeploy:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
