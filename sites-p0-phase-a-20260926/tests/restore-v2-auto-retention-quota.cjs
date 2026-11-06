'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/recovery-auto-retention';
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-recovery.ts','--outDir',out,
 '--module','commonjs','--target','es2022','--resolveJsonModule',
 '--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {retainReferencedLessons}=require('../'+out+'/domain/storage-retention.js');
const source1=require('../content/curriculum-1.11.0-candidate.json');
const source2=require('../content/curriculum-1.18.0-candidate.json');
const source3=require('../content/curriculum-1.18.1-candidate.json');
const prefix='g-learning:english:v1',contentKey=prefix+':academic:packages';
const attemptsKey=prefix+':owner:local-family:academic-attempts';
const otherKey=prefix+':owner:family-friends:academic-attempts';
const stateKey=prefix+':owner:local-family:learner:primary:state';
const stored=(s)=>({id:s.package_id,version:s.schema_version,
 digest:'verified-source-'+s.schema_version,source:s,at:1});
const packages=[stored(source1),stored(source2),stored(source3)];
class Store{
 constructor(limit=Infinity){this.items=new Map();this.limit=limit;this.removed=[]}
 get length(){return this.items.size}
 key(i){return [...this.items.keys()][i]??null}
 getItem(key){return this.items.get(key)??null}
 setItem(key,value){
  const next=new Map(this.items);next.set(key,String(value));
  const size=[...next].reduce((n,[a,b])=>n+2*(a.length+b.length),0);
  if(size>this.limit){const e=Error('quota');e.name='QuotaExceededError';throw e}
  this.items=next;
 }
 removeItem(key){this.removed.push(key);this.items.delete(key)}
}
const ids=(s)=>s.lessons.map(l=>l.id);
const lessons=ids(source2);
const attempts=Array.from({length:73},(_,i)=>{
 const version=i<12?source2.schema_version:source3.schema_version;
 const lessonId=lessons[i%lessons.length];
 return {id:'saved-'+i,rootId:'saved-'+i,packageId:version,
  version,lessonId,status:i<52?'scored':'started',
  answers:{},evidence:[],createdAt:i+1,
  ...(i<52?{submittedAt:100+i,results:[{id:lessonId+'-Q1',
   correct:true,explanation:'Keep explanation',tags:[]}]}:{})};
});
const entries=[
 {key:contentKey,value:JSON.stringify(packages)},
 {key:attemptsKey,value:JSON.stringify(attempts.slice(0,50))},
 {key:otherKey,value:JSON.stringify(attempts.slice(50))},
 {key:stateKey,value:JSON.stringify({writing:'Persist draft as originally written'})},
].sort((a,b)=>a.key.localeCompare(b.key));
function used(e){return e.reduce((n,x)=>n+2*(x.key.length+x.value.length),0)}
(async()=>{
 const checksum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',
   new TextEncoder().encode(JSON.stringify(entries))))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const file={format:'g-learning-english.recovery',schemaVersion:2,
  exportedAt:'2026-11-06T14:43:27.261Z',entries,sha256:checksum};
 const text=JSON.stringify(file);
 assert.equal((await recovery.verifyLocalRecoveryV2(text)).attempts,73);
 const compact=retainReferencedLessons(packages,attempts);
 const compactEntries=entries.map(x=>x.key===contentKey?{...x,value:JSON.stringify({
  schema:2,retention:true,records:compact.records})}:x);
 const before=used(entries),after=used(compactEntries);
 assert(after<before,'Source retention must materially reduce footprint');
 const cap=Math.floor((before+after)/2);
 const oldBehavior=new Store(cap);
 assert.throws(()=>entries.forEach(e=>oldBehavior.setItem(e.key,e.value)),/quota/,
  'Old restore would fail in this realistic near-quota simulation');
 const target=new Store(cap);global.window={localStorage:target};
 const p=await recovery.previewLocalRecoveryV2(text);
 assert.equal(p.valid,true);
 const result=await recovery.restoreLocalRecoveryV2(text,p.token,true);
 assert.equal(result.attempts,73);
 assert.equal(result.versions,2,'Only protected old source and full active should remain');
 assert.equal(target.getItem(recovery.RECOVERY_MARKER),null);
 const saved=JSON.parse(target.getItem(contentKey));
 assert.equal(saved.schema,2);assert.equal(saved.retention,true);
 assert.deepEqual(saved.records.map(x=>x.version),['1.18.0','1.18.1']);
 assert.equal(saved.records[0].archive,'referenced-lessons');
 assert.deepEqual(JSON.parse(target.getItem(attemptsKey)),attempts.slice(0,50));
 assert.deepEqual(JSON.parse(target.getItem(otherKey)),attempts.slice(50));
 assert.equal(JSON.parse(target.getItem(stateKey)).writing,
  'Persist draft as originally written');
 assert.equal((await recovery.verifyLocalRecoveryV2(text)).sha256,checksum,
  'Original unmodified Recovery checksum must still verify after restore');
 const exported=await recovery.exportLocalRecoveryV2();
 assert.equal(exported.attempts,73);
 assert.equal(exported.versions,2);
 assert.equal((await recovery.verifyLocalRecoveryV2(exported.text)).attempts,73);
 assert.equal((await recovery.previewLocalRecoveryV2(text)).valid,false,
  'Repeated Restore must never overwrite real learner work');
 console.log(JSON.stringify({result:'PASS',gate:'restore-auto-retention-quota',
 originalVersions:3,restoredVersions:2,attempts:73,
 scored:52,drafts:21,originalEstimatedBytes:before,
 restoredEstimatedBytes:after,simulatedQuotaBytes:cap,
 sourceSHA256Unchanged:true,learnerKeysBytePreserved:true,
 failedRestoreAvoided:true,realIPadSafari:'NOT_TESTED'}));
})().catch(e=>{console.error(e);process.exitCode=1});
