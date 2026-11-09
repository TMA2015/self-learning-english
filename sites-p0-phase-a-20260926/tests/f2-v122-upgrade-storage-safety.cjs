'use strict';
/**
 * F2 draft-only v1.21 -> v1.22 storage release-safety evidence.
 * All attempts are synthetic, assembled from public content. This does NOT
 * inspect Safari or any owner's real browser data, import, deploy or migrate.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/f2-v122-storage';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-runtime.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}
 =require(path.join(root,out,'infrastructure/storage/browser-local-repositories.js'));
const {academicService,sourceDigest}
 =require(path.join(root,out,'application/academic-service.js'));
const {validateSeed,mapSeed}=require(path.join(root,out,'domain/academic.js'));
const prev=require('../content/curriculum-1.21.0-candidate.json');
const next=require('../content/curriculum-1.22.0-candidate.json');
const owner='local-family',quota=5*1024*1024;
const size=store=>[...store.map].reduce((n,[k,v])=>n+2*(k.length+v.length),0);
class Storage{
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[]}
 get length(){return this.map.size}
 key(index){return [...this.map.keys()][index]??null}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const upcoming=new Map(this.map);upcoming.set(k,String(v));
  const bytes=[...upcoming].reduce((n,[key,val])=>n+2*(key.length+val.length),0);
  if(bytes>this.max){const e=Error('Browser quota exceeded');e.name='QuotaExceededError';throw e}
  this.map=upcoming;this.writes.push(k);
 }
 removeItem(){throw Error('No learner/browser data deletion allowed in F2 upgrade QA')}
}
(async()=>{
 assert.equal(prev.schema_version,'1.21.0');
 assert.equal(next.schema_version,'1.22.0');
 assert.deepEqual(validateSeed(next),[]);
 assert.deepEqual(next.lessons.slice(0,132),prev.lessons);
 const storage=new Storage(),repo=new BrowserLocalAcademicRepository(storage),
 learning=new BrowserLocalLearningRepository(storage),svc=academicService(repo,learning,owner);
 const src=(s,at)=>({id:s.package_id,version:s.schema_version,digest:'',source:s,bundle:mapSeed(s),at});
 const old=src(prev,1);old.digest=await sourceDigest(prev);
 await repo.addPackage(old);
 const historyLessonIds=['GRA-A1-04','LIS-A1-03','WRI-A1-05','VOC-A2-03','REA-A2-08'];
 const rows=[];
 // 52 submitted/scored and 21 drafts. Synthetic QA fixture, NOT owner/iPad rows.
 for(let i=0;i<73;i++){
  const lessonId=historyLessonIds[i%historyLessonIds.length];
  const original=prev.lessons.find(l=>l.id===lessonId);
  assert(original);
  const q=original.activities[0];
  const id='synthetic-f2-v122-'+String(i+1).padStart(3,'0');
  const scored=i<52;
  const row={
   id,rootId:id,packageId:prev.package_id,version:'1.21.0',
   lessonId,status:scored?'scored':'started',
   answers:{[q.id]:'qa-answer-'+i},createdAt:1700000000000+i,
   evidence:[],
   ...(scored?{submittedAt:1700000001000+i,results:[
    {id:q.id,correct:(i%2===0),explanation:'Historical feedback is immutable',tags:[...q.skill_tags]}
   ]}:{})
  };
  await repo.start(owner,row);rows.push(row);
 }
 const dataKey='g-learning:english:v1:owner:local-family:learner:primary:state';
 storage.setItem(dataKey,JSON.stringify({
  writing:'Preserve every original Writing draft, including incomplete text.',
  profile:{nickname:'SYNTHETIC QA ONLY'},
  completed:[1,2,3]
 }));
 assert.equal((await repo.attempts(owner)).length,73);
 const original=await repo.attempts(owner);
 const oldState=storage.getItem(dataKey);
 const before=new Map(storage.map),beforeSize=size(storage);
 const preview=await svc.preview(next);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:4,update:0,skip:132,conflict:0});

 // Failure is guaranteed: a strict quota only 128 bytes above the source.
 storage.max=beforeSize+128;storage.writes=[];
 const future=src(next,2);future.digest=await sourceDigest(next);
 await assert.rejects(()=>repo.addPackage(future),/no storage space|quota/i);
 assert.deepEqual([...storage.map],[...before],'Quota rejection changed previously stored bytes');
 assert.deepEqual(storage.writes,[],'Quota failure wrote browser storage');
 assert.deepEqual(await repo.attempts(owner),original,'Low-quota failed upgrade modified history');
 assert.equal(storage.getItem(dataKey),oldState,'Low-quota failed upgrade modified Writing');
 assert.deepEqual((await repo.packages()).map(p=>p.version),['1.21.0']);

 // Measure a representative 5MiB quota separately; report a FAIL-CLOSED
 // outcome as a safety PASS, not as evidence that every iPad can upgrade.
 storage.max=quota;storage.writes=[];
 let typicalFiveMiBUpgrade='BLOCKED_BY_QUOTA';
 try{
  await repo.addPackage(future);
  typicalFiveMiBUpgrade='FITS_SYNTHETIC_5MIB';
 }catch(e){
  assert.match(String(e),/no storage space|quota/i);
  assert.deepEqual([...storage.map],[...before]);
  assert.deepEqual(storage.writes,[]);
 }
 const afterFiveMiB=size(storage);
 // Unlimited storage tests the semantic version-pinned upgrade route.
 storage.max=Infinity;
 if(typicalFiveMiBUpgrade==='BLOCKED_BY_QUOTA')await repo.addPackage(future);
 assert.deepEqual((await repo.packages()).map(p=>p.version),['1.21.0','1.22.0']);
 assert.deepEqual(await repo.attempts(owner),original,'73 synthetic historical attempts changed');
 assert.equal(storage.getItem(dataKey),oldState,'Writing profile changed');
 const catalog=await svc.catalog();
 assert.equal(catalog.version,'1.22.0');
 assert.equal(catalog.lessons.length,136);
 for(const id of historyLessonIds){
  assert.equal((await svc.lesson(id,'1.21.0')).version,'1.21.0');
  assert.equal((await svc.lesson(id)).version,'1.22.0');
 }
 // Read-only retention PREVIEW, with both versions still present.
 const retention=await repo.previewRetention();
 assert.equal(retention.activeVersion,'1.22.0');
 assert.deepEqual(retention.retainedVersions,['1.21.0','1.22.0']);
 assert(retention.protectedLessonCount>=historyLessonIds.length);
 assert.equal((await repo.attempts(owner)).filter(a=>a.status==='scored').length,52);
 assert.equal((await repo.attempts(owner)).filter(a=>a.status==='started').length,21);
 console.log(JSON.stringify({
  result:'PASS',gate:'F2_V121_TO_V122_LOCALSTORAGE_SAFETY',
  preview:preview.counts,immutableHistoricalAttemptCount:73,
  scoredPreserved:52,draftsPreserved:21,originalWritingPreserved:true,
  lowQuotaFailClosed:true,storageDeletionCount:0,
  baselineBytes:beforeSize,simulatedQuotaBytes:quota,
  typicalFiveMiBUpgrade,afterFiveMiBBytes:afterFiveMiB,
  unlimitedUpgradePinsOldVersions:true,
  retentionPreviewOnly:true,
  projectedRetentionBytes:retention.estimatedAfterBytes,
  realIPadSafari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',
  productionImport:false,deploy:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
