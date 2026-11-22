'use strict';
// Experimental QA only. No real learner data, no real browser or Firebase.
// Compare raw vs production codec on deterministic synthetic 5-MiB quota.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime','v130-quota-matrix');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','infrastructure/browser/local-runtime.ts','--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const {BrowserLocalAcademicRepository}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
const {englishLosslessStore}=require(path.join(out,'infrastructure/browser/lossless-browser-storage.js'));
const {retainReferencedLessons}=require(path.join(out,'domain/storage-retention.js'));
const {mapSeed}=require(path.join(out,'domain/academic.js'));
const {sourceDigest}=require(path.join(out,'application/academic-service.js'));
const versions=['1.11.0','1.18.0','1.25.0','1.28.0','1.29.0','1.30.0'];
const sources=versions.map(v=>require('../content/curriculum-'+v+'-candidate.json'));
const ns='g-learning:english:v1:',packageKey=ns+'academic:packages',quota=5*1024*1024;
const key=owner=>ns+'owner:'+owner+':academic-attempts';
const cost=map=>[...map].reduce((sum,[k,v])=>sum+2*(k.length+v.length),0);
class Store{
 constructor(){this.map=new Map();this.limit=Infinity;this.writes=[]}
 get length(){return this.map.size}
 key(i){return [...this.map.keys()][i]??null}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){const next=new Map(this.map);next.set(k,String(v));if(cost(next)>this.limit){const e=Error('quota exceeded');e.name='QuotaExceededError';throw e}this.map=next;this.writes.push(k)}
 removeItem(){throw Error('Deletion prohibited in QA')}
}
function syntheticAttempts(pkgs,count){
 const owners=['qa-synthetic-a','qa-synthetic-b'],byOwner=new Map(owners.map(o=>[o,[]]));
 for(let i=0;i<count;i++){
  const p=pkgs[i%pkgs.length];const ls=p.source.lessons;
  const l=ls[(Math.floor(i/pkgs.length)*17+3)%ls.length];
  const q=l.activities[0];const id='qa-'+i;
  const isWriting=q.type==='extended_response';
  const scored=!isWriting&&i%3!==0;
  const answer=isWriting?Array.from({length:70},(_,n)=>['A test idea','an example','a different reason','a limitation','a possible next step'][(n+i)%5]+' '+(i*71+n)).join('. '):'synthetic-choice-'+i;
  const row={id,rootId:id,lessonId:l.id,packageId:p.id,version:p.version,status:scored?'scored':'started',answers:{[q.id]:answer},createdAt:i+1,evidence:[],...(scored?{submittedAt:count+i+1,results:[{id:q.id,correct:false,explanation:'Synthetic fixture; no measured proficiency',tags:[]}]}:{})};
  byOwner.get(owners[i%2]).push(row);
 }
 return byOwner;
}
// Independent proof of concept. This document format is NOT read by the app.
// Share byte-identical lesson objects only, never match by lesson ID alone.
const sha=s=>require('node:crypto').createHash('sha256').update(s,'utf8').digest('hex');
function packFullHistory(records){
 const pool=[],lookup=new Map();
 const versions=records.map(p=>{
  const references=p.source.lessons.map(lesson=>{
   const key=JSON.stringify(lesson);
   if(lookup.has(key))return lookup.get(key);
   const index=pool.length;lookup.set(key,index);pool.push(lesson);return index;
  });
  return {...p,source:{...p.source,lessons:references}};
 });
 return {experiment:'SLE_DEDUP_POC_ONLY',sourceHash:sha(JSON.stringify(records)),pool,versions};
}
function unpackFullHistory(doc){
 assert.equal(doc.experiment,'SLE_DEDUP_POC_ONLY');
 assert(Array.isArray(doc.pool)&&Array.isArray(doc.versions));
 const restored=doc.versions.map(p=>({...p,source:{...p.source,lessons:p.source.lessons.map(index=>{
  assert(Number.isInteger(index)&&index>=0&&index<doc.pool.length,'Invalid lesson reference');
  return doc.pool[index];
 })}}));
 assert.equal(sha(JSON.stringify(restored)),doc.sourceHash,'Full history digest mismatch');
 return restored;
}
function measureDedup(records,nativeBefore,history,quota){
 const original=JSON.stringify(records),packed=packFullHistory(records);
 assert.equal(JSON.stringify(unpackFullHistory(JSON.parse(JSON.stringify(packed)))),original);
 const badRef=JSON.parse(JSON.stringify(packed));
 badRef.versions[0].source.lessons[0]=badRef.pool.length;
 assert.throws(()=>unpackFullHistory(badRef),/Invalid lesson reference/);
 const badText=JSON.parse(JSON.stringify(packed));
 badText.pool[0].title+=' CORRUPTED';
 assert.throws(()=>unpackFullHistory(badText),/digest mismatch/);
 // Demonstrate same-ID changed content does not alias to an older object.
 const variant=JSON.parse(JSON.stringify(records[0]));
 variant.version='synthetic-variant';
 variant.source.lessons[0].title+=' independent changed version';
 const both=packFullHistory([records[0],variant]);
 assert.notEqual(both.versions[0].source.lessons[0],both.versions[1].source.lessons[0]);
 assert.equal(JSON.stringify(unpackFullHistory(both)),JSON.stringify([records[0],variant]));
 const native=new Store();native.map=new Map(nativeBefore);
 const codec=englishLosslessStore(native);
 codec.setItem(packageKey,JSON.stringify(packed));
 const totalBytes=cost(native.map);
 const decoded=unpackFullHistory(JSON.parse(codec.getItem(packageKey)));
 assert.equal(JSON.stringify(decoded),original);
 for(const [k,v] of nativeBefore)if(k!==packageKey)assert.equal(native.getItem(k),v);
 for(const [owner,list] of history)assert.deepEqual(JSON.parse(codec.getItem(key(owner))),list);
 // Test atomic failure of writing the experimental document to a fake store.
 const blocked=new Store();blocked.map=new Map(nativeBefore);blocked.limit=0;
 assert.throws(()=>englishLosslessStore(blocked).setItem(packageKey,JSON.stringify(packed)),/quota exceeded/);
 assert.deepEqual(blocked.map,nativeBefore);assert.deepEqual(blocked.writes,[]);
 return {totalBytes,headroomBytes:quota-totalBytes,fits:totalBytes<=quota,originalLessonCopies:records.reduce((n,p)=>n+p.source.lessons.length,0),uniqueExactLessonObjects:packed.pool.length,fullVersionsPreserved:records.length,originalPackageDigestVerified:true,corruptRefBlocked:true,corruptContentBlocked:true,sameIdChangedContentSeparated:true};
}
(async()=>{
 const packs=[];
 for(const s of sources)packs.push({id:s.package_id,version:s.schema_version,digest:await sourceDigest(s),source:s,at:packs.length+1});
 const next=packs.at(-1);
 const rows=[];
 for(const [oldCount,attemptCount] of [[1,73],[3,300],[5,600]]){
  const old=packs.slice(-oldCount-1,-1);
  const history=syntheticAttempts(old,attemptCount);
  const attempts=[...history.values()].flat();
  const projection=retainReferencedLessons([...old,next],attempts);
  assert.equal(projection.activeVersion,'1.30.0');
  for(const a of attempts){
   const before=old.find(p=>p.version===a.version),after=projection.records.find(p=>p.version===a.version);
   assert(before&&after);
   assert.deepEqual(after.source.lessons.find(l=>l.id===a.lessonId),before.source.lessons.find(l=>l.id===a.lessonId),'Pinned lesson changed');
   assert.deepEqual(after.source.rubrics,before.source.rubrics,'Pinned rubric changed');
  }
  for(const compressed of [false,true]){
   const native=new Store(),storage=compressed?englishLosslessStore(native):native;
   storage.setItem(packageKey,JSON.stringify(old));
   for(const [owner,list] of history)storage.setItem(key(owner),JSON.stringify(list));
   const stateKey=ns+'owner:qa-synthetic-a:learner:primary:state';
   storage.setItem(stateKey,JSON.stringify({writing:'Synthetic unfinished writing; keep unchanged.',completed:[0,1]}));
   const before=new Map(native.map),initial=cost(before),baselineWrites=native.writes.length;
   const repo=new BrowserLocalAcademicRepository(storage);
   // Read-only preview of the existing history must never mutate native bytes.
   const preview=await repo.previewRetention();
   assert.equal(preview.activeVersion,'1.29.0');
   assert.deepEqual(native.map,before);assert.equal(native.writes.length,baselineWrites);
   // Measure the exact encoded projection using a separate disposable fake store.
   // Do not invoke compactRetention — this is a hypothetical projection, not consent.
   const projectionNative=new Store();projectionNative.map=new Map(before);
   const projectionStore=compressed?englishLosslessStore(projectionNative):projectionNative;
   projectionStore.setItem(packageKey,JSON.stringify({schema:2,retention:true,records:projection.records}));
   const projectedBytes=cost(projectionNative.map);
   const projected=JSON.parse(projectionStore.getItem(packageKey));
   assert.deepEqual(projected.records,projection.records);
   for(const [k,v] of before)if(k!==packageKey)assert.equal(projectionNative.getItem(k),v);
   const fullNative=new Store();fullNative.map=new Map(before);
   const fullStorage=compressed?englishLosslessStore(fullNative):fullNative;
   fullStorage.setItem(packageKey,JSON.stringify([...old,next]));
   const fullBytes=cost(fullNative.map);
   native.limit=quota;native.writes=[];
   let outcome='BASELINE_ALREADY_OVER_SIMULATED_LIMIT';
   if(initial<=quota){
    try{await repo.addPackage({...next,bundle:mapSeed(next.source)});outcome='FITS';}
    catch(e){assert.match(String(e),/no storage space|quota/i);outcome='BLOCKED_ATOMIC';}
    if(outcome==='BLOCKED_ATOMIC'){assert.deepEqual(native.map,before);assert.deepEqual(native.writes,[]);assert(fullBytes>quota);}
    else{assert(fullBytes<=quota);assert.deepEqual(native.writes,[packageKey]);assert.equal(cost(native.map),fullBytes);assert.equal((await repo.packages()).at(-1).version,'1.30.0');}
   }else{assert.deepEqual(native.map,before);assert.deepEqual(native.writes,[]);}
   for(const [k,v] of before)if(k!==packageKey)assert.equal(native.getItem(k),v,'Existing learner bytes modified');
   for(const [owner,list] of history)assert.deepEqual(await repo.attempts(owner),list);
   const row={oldVersions:old.map(p=>p.version),attemptCount,owners:2,mode:compressed?'PRODUCTION_CODEC':'RAW',quotaBytes:quota,baselineBytes:initial,fullUpgradeBytes:fullBytes,fullHeadroomBytes:quota-fullBytes,outcome,retentionProjectionBytes:projectedBytes,retentionHeadroomBytes:quota-projectedBytes,protectedVersionLessonPairs:projection.protectedLessonCount};
   rows.push(row);console.log('V130_QUOTA_SCENARIO '+JSON.stringify(row));
   if(compressed){const dedup=measureDedup([...old,next],before,history,quota);console.log('V130_DEDUP_SCENARIO '+JSON.stringify({attemptCount,priorVersions:oldCount,baselineCodecFullBytes:fullBytes,...dedup,bytesSaved:fullBytes-dedup.totalBytes,prototypeOnly:true}));}
  }
 }
 assert.equal(rows.length,6);
 for(let i=0;i<rows.length;i+=2){assert(rows[i+1].fullUpgradeBytes<=rows[i].fullUpgradeBytes);assert(rows[i+1].retentionProjectionBytes<=rows[i].retentionProjectionBytes);}
 console.log(JSON.stringify({result:'PASS',gate:'V130_MULTIVERSION_QUOTA_MATRIX',scenarios:rows.length,quotaAccounting:'SYNTHETIC_UTF16',productionCodec:true,retentionProjectionOnly:true,allPinnedLessonsPreserved:true,allAttemptRowsPreserved:true,storageDeletions:0,actualSafari:'NOT_TESTED',actualLearnerData:'NOT_TOUCHED',release:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
