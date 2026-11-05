'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const out='.sites-runtime/storage-retention-v2';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'domain/storage-retention.ts','infrastructure/storage/browser-local-repositories.ts',
 'application/academic-service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {retainReferencedLessons,decodePackageDocument}=require('../'+out+'/domain/storage-retention.js');
const {BrowserLocalAcademicRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const {academicService}=require('../'+out+'/application/academic-service.js');
const {BrowserLocalLearningRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const old=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');
const asPackage=(src,at)=>({id:src.package_id,version:src.schema_version,digest:'digest-'+src.schema_version,source:src,at});
const oldPkg=asPackage(old,1),newPkg=asPackage(next,2);
const historicalAttempt={id:'legacy-001',packageId:old.package_id,version:old.schema_version,
 lessonId:'REA-A1-01',rootId:'legacy-001',status:'started',answers:{},createdAt:1,evidence:[]};
const otherOwner={...historicalAttempt,id:'other-001',lessonId:'GRA-A1-01',rootId:'other-001'};
const snapshot=retainReferencedLessons([oldPkg,newPkg],[historicalAttempt,otherOwner]);
assert.equal(snapshot.activeVersion,next.schema_version);
assert.equal(snapshot.records.length,2);
assert.equal(snapshot.records[0].archive,'referenced-lessons');
assert.deepEqual(snapshot.records[0].source.lessons.map(l=>l.id),['GRA-A1-01','REA-A1-01']);
assert.deepEqual(snapshot.records[1].source.lessons, next.lessons);
assert(snapshot.estimatedAfterBytes<snapshot.estimatedBeforeBytes);
assert.throws(()=>retainReferencedLessons([oldPkg,newPkg],[{version:old.schema_version,lessonId:'MISSING'}]),/missing original/);
assert.throws(()=>retainReferencedLessons([oldPkg,newPkg],[{version:'0.0.1',lessonId:'REA-A1-01'}]),/missing original/);
assert.deepEqual(retainReferencedLessons([oldPkg,newPkg],[]).records.map(r=>r.version),[next.schema_version]);
assert.throws(()=>decodePackageDocument({schema:5,records:[]}),/Unknown/);
class BrowserStore{
 constructor(limit=Infinity){this.items=new Map();this.limit=limit;this.writes=0;this.deletions=0}
 get length(){return this.items.size}
 key(index){return [...this.items.keys()][index]??null}
 getItem(k){return this.items.get(k)??null}
 setItem(k,v){
  const copy=new Map(this.items);copy.set(k,String(v));
  const size=[...copy].reduce((sum,[a,b])=>sum+2*(a.length+b.length),0);
  if(size>this.limit){const e=Error('quota');e.name='QuotaExceededError';throw e}
  this.items=copy;this.writes++;
 }
 removeItem(k){this.deletions++;this.items.delete(k)}
}
(async()=>{
 const storage=new BrowserStore(),repo=new BrowserLocalAcademicRepository(storage);
 await repo.addPackage({...oldPkg,bundle:{}});
 await repo.start('local-family',historicalAttempt);
 await repo.start('family-friends',otherOwner);
 await repo.addPackage({...newPkg,bundle:{}});
 const p=await repo.previewRetention();
 assert.equal(p.protectedLessonCount,2);
 assert.equal(p.retainedVersions.length,2);
 assert.equal(storage.deletions,0);
 const before=storage.getItem('g-learning:english:v1:academic:packages');
 const wrong='wrong-token';
 await assert.rejects(()=>repo.compactRetention(wrong,true),/Preview again/);
 assert.equal(storage.getItem('g-learning:english:v1:academic:packages'),before);
 await repo.compactRetention(p.token,true);
 assert.equal(storage.deletions,0);
 const after=JSON.parse(storage.getItem('g-learning:english:v1:academic:packages'));
 assert.equal(after.schema,2);
 assert.equal(after.records[0].source.lessons.length,2);
 assert.equal(after.records[1].source.lessons.length,next.lessons.length);
 assert.equal((await repo.attempts('local-family')).length,1);
 assert.equal((await repo.attempts('family-friends')).length,1);
 const fresh=new BrowserLocalAcademicRepository(storage);
 const history=(await fresh.packages()).find(x=>x.version===old.schema_version);
 assert.equal(history.source.lessons.length,2);
 const service=academicService(fresh,new BrowserLocalLearningRepository(storage),'local-family');
 const view=await service.lesson('REA-A1-01',old.schema_version);
 assert.equal(view.version,old.schema_version);
 await service.draft('legacy-001',{});
 assert.equal((await fresh.attempts('local-family'))[0].status,'started');
 const pAgain=await fresh.previewRetention();
 await fresh.compactRetention(pAgain.token,true);
 assert.equal(storage.deletions,0,'Compaction must never remove browser keys');
 const stale=await fresh.previewRetention();
 await fresh.start('local-family',{...historicalAttempt,id:'legacy-002',rootId:'legacy-002',lessonId:'GRA-A1-01'});
 await assert.rejects(()=>fresh.compactRetention(stale.token,true),/Preview again/);
 // Future updates preserve retention when imported; older full versions are not piled up.
 const future={...newPkg,version:'1.19.0',digest:'future-digest',at:3};
 await fresh.addPackage({...future,bundle:{}});
 const updated=JSON.parse(storage.getItem('g-learning:english:v1:academic:packages'));
 assert.equal(updated.records.filter(x=>!x.archive).length,1);
 assert.equal(updated.records.at(-1).version,'1.19.0');
 assert.equal(updated.records.at(-1).source.lessons.length,next.lessons.length);
 const beforeCorrupt=storage.getItem('g-learning:english:v1:academic:packages');
 storage.setItem('g-learning:english:v1:owner:local-family:academic-attempts','{bad-json');
 await assert.rejects(()=>fresh.previewRetention(),/corrupted|invalid|JSON/i);
 assert.equal(storage.getItem('g-learning:english:v1:academic:packages'),beforeCorrupt);
 console.log(JSON.stringify({result:'PASS',gate:'storage-retention-v2',
  latestFull:1,referencedHistoricLessons:2,unreferencedVersionsNotRetained:true,
  multiOwnerAttemptProtection:true,tokenGuards:true,historyResume:true,
  contentWritesAtomic:true,automaticFutureRetention:true,productionWrites:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
