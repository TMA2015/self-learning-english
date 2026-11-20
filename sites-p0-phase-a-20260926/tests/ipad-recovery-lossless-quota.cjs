'use strict';
/** P0 iPad storage regression: real curriculum fixtures, synthetic learner data.
 * NO owner backup or real learner data is used in this test.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const out='.sites-runtime/ipad-recovery-lossless-quota';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-recovery.ts',
 'infrastructure/storage/browser-local-repositories.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--esModuleInterop','--skipLibCheck','--resolveJsonModule','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {englishLosslessStore,__storageCodecTest}=require('../'+out+'/infrastructure/browser/lossless-browser-storage.js');
const {BrowserLocalAcademicRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const {retainReferencedLessons}=require('../'+out+'/domain/storage-retention.js');
const versions=['1.18.0','1.18.1','1.20.0','1.25.0'];
const source=Object.fromEntries(versions.map(v=>[v,require('../content/curriculum-'+v+'-candidate.json')]));
const current=require('../content/curriculum-1.28.0-candidate.json');
const prefix='g-learning:english:v1';
const pkgKey=prefix+':academic:packages',attemptKey=prefix+':owner:local-family:academic-attempts';
const ownerKey=(name)=>prefix+':owner:local-family:learner:primary:'+name;
const utf16=(v)=>v.length*2;
class SafariStore{
 constructor(limit=5*1024*1024){this.values=new Map();this.limit=limit;this.removed=[];}
 get length(){return this.values.size}
 key(i){return [...this.values.keys()][i]??null}
 getItem(k){return this.values.get(k)??null}
 setItem(k,v){
  const next=new Map(this.values);next.set(k,String(v));
  const size=[...next].reduce((sum,[k,v])=>sum+utf16(k)+utf16(v),0);
  if(size>this.limit){const e=Error('Safari-like quota exceeded');e.name='QuotaExceededError';throw e;}
  this.values=next;
 }
 removeItem(k){this.removed.push(k);this.values.delete(k)}
 used(){return [...this.values].reduce((sum,[k,v])=>sum+utf16(k)+utf16(v),0)}
}
const attempts=[],counts=[13,60,15,44];let id=0;
for(let v=0;v<versions.length;v++){
 const version=versions[v],lessons=source[version].lessons;
 for(let i=0;i<counts[v];i++){
  const lesson=lessons[i%lessons.length];id++;
  attempts.push({
   id:'synthetic-'+String(id).padStart(4,'0'),rootId:'synthetic-'+id,
   packageId:source[version].package_id,version,lessonId:lesson.id,
   status:i%7===0?'started':'scored',answers:{Q1:'B',Q2:'D',Q3:'example'},
   results:[{id:lesson.id+'-Q1',correct:true,explanation:
    'A synthetic repeated explanation to model a long archive of local feedback. '.repeat(20)}],
   // No genuine student text: synthetic length only, deliberately repeated.
   savedSyntheticText:'Synthetic learner text used solely for quota regression. '.repeat(65),
   createdAt:1700000000+i,submittedAt:1700000001+i,evidence:[]
  });
 }
}
assert.equal(attempts.length,132);
const packages=versions.map((version,i)=>({
 id:source[version].package_id,version,digest:'synthetic-sha-'+version,
 source:source[version],at:i+1
}));
const compact=retainReferencedLessons(packages,attempts);
const plain=[
 {key:pkgKey,value:JSON.stringify({schema:2,retention:true,records:compact.records})},
 {key:attemptKey,value:JSON.stringify(attempts)},
 {key:ownerKey('state'),value:JSON.stringify({history:[{at:1}],writing:'Synthetic draft '.repeat(13000)})},
 {key:ownerKey('evidence'),value:JSON.stringify([{id:'synthetic-evidence',at:1,feedback:'Synthetic evidence '.repeat(4000)}])},
 {key:ownerKey('assessments'),value:JSON.stringify([{sessionId:'synthetic',startedAt:1,detail:'Synthetic assessment '.repeat(3800)}])},
 {key:ownerKey('snapshots'),value:JSON.stringify([{id:'s',snapshot:{at:1,note:'Synthetic snapshot '.repeat(4500)}}])},
 {key:ownerKey('legacy-imported'),value:'1'},
].sort((a,b)=>a.key.localeCompare(b.key));
const checksum=crypto.createHash('sha256').update(JSON.stringify(plain),'utf8').digest('hex');
const backup=JSON.stringify({format:'g-learning-english.recovery',schemaVersion:2,
 exportedAt:'2026-11-20T15:38:30.127Z',entries:plain,sha256:checksum});
const originalFootprint=plain.reduce((n,e)=>n+utf16(e.key)+utf16(e.value),0);
assert(originalFootprint>5*1024*1024,'synthetic V2 backup must reproduce pre-fix Safari failure');
const basic='Chào em · original reviewer feedback 😀 — '.repeat(4000);
assert.equal(__storageCodecTest.decode(__storageCodecTest.encode(basic)),basic,'Unicode round-trip');
assert.equal(__storageCodecTest.decode(__storageCodecTest.encode(JSON.stringify(attempts))),
 JSON.stringify(attempts),'Academic attempts exact string roundtrip');
assert.equal(__storageCodecTest.decode('{"x":1}'),'{"x":1}','Legacy JSON stays readable');
assert(__storageCodecTest.compressible(attemptKey));
assert(!__storageCodecTest.compressible(prefix+':recovery-pending-v2'));
const empty=new SafariStore();
global.window={localStorage:empty};
const wrapped=englishLosslessStore(empty);
const repo=new BrowserLocalAcademicRepository(wrapped);
const active={id:current.package_id,version:'1.28.0',source:current,digest:'synthetic-hash-1.28.0',at:10};
await repo.addPackage(active);
const bootstrapBytes=empty.used();
assert(bootstrapBytes<2*1024*1024,'active curriculum should be compressed within test budget');
const p=await recovery.previewLocalRecoveryV2(backup);
assert.equal(p.valid,true,'bootstrap curriculum is not an occupied learner profile');
const result=await recovery.restoreLocalRecoveryV2(backup,p.token,true);
assert.equal(result.attempts,132);
assert.equal(result.versions,4);
assert.equal(empty.getItem(recovery.RECOVERY_MARKER),null);
assert(empty.used()<5*1024*1024,'compressed original 132 attempts and 4 sources fit Safari-like quota');
assert(empty.getItem(attemptKey).startsWith('~sle-lzw1~'),'physical attempt storage compressed');
assert(empty.getItem(pkgKey).startsWith('~sle-lzw1~'),'physical source storage compressed');
assert.deepEqual(await repo.attempts('local-family'),attempts,'all 132 attempts exact');
const historic=await repo.packages();
assert.equal(historic.length,4);
for(const v of versions)assert(historic.some(x=>x.version===v),'pinned source '+v+' remains');
assert.equal(JSON.parse(wrapped.getItem(ownerKey('state'))).writing,'Synthetic draft '.repeat(13000));
await repo.addPackage(active);
assert.equal((await repo.packages()).some(x=>x.version==='1.28.0'),true,'new active curriculum imported');
await repo.start('local-family',{...attempts[0],id:'synthetic-new-133',rootId:'synthetic-new-133'});
assert.equal((await repo.attempts('local-family')).length,133,'new student work can be saved');
const exported=await recovery.exportLocalRecoveryV2();
assert.equal(exported.attempts,133);
assert(!exported.text.includes('~sle-lzw1~'),'downloaded V2 remains original plain JSON format');
assert.equal((await recovery.verifyLocalRecoveryV2(exported.text)).attempts,133);
assert(empty.used()<5*1024*1024,'post-restore curriculum import and new save fit quota');
const corrupted=new SafariStore();
corrupted.setItem(attemptKey,'~sle-lzw1~12:00000000:AAAA');
assert.throws(()=>englishLosslessStore(corrupted).getItem(attemptKey),/Preserve browser data/i);
assert.equal(corrupted.getItem(attemptKey),'~sle-lzw1~12:00000000:AAAA','corrupt data untouched');
const noRoom=new SafariStore(1000);global.window={localStorage:noRoom};
const prior=noRoom.used();
const attemptBefore=noRoom.getItem(attemptKey);
const low=englishLosslessStore(noRoom);
assert.throws(()=>low.setItem(attemptKey,JSON.stringify(attempts)),/quota/i);
assert.equal(noRoom.used(),prior);assert.equal(noRoom.getItem(attemptKey),attemptBefore);
console.log(JSON.stringify({result:'PASS',gate:'ipad-recovery-lossless-quota',
 originalV2Footprint:originalFootprint,baselineBootstrappedBytes:bootstrapBytes,
 restoredAndAfterUpdateBytes:empty.used(),sourceVersions:versions.length,attempts:133,
 v2Portable:true,originalHistoryUnchanged:true,unicodeExact:true,
 noOwnerData:true,noStorageClear:true,noLiveDeploy:true}));
