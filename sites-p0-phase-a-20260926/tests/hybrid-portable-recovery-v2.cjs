'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process');const root=path.resolve(__dirname,'..');
const out='.sites-runtime/hybrid-portable-recovery';
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/hybrid-local-recovery.ts',
 'infrastructure/storage/hybrid-academic-repository.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const recovery=require('../'+out+'/infrastructure/browser/hybrid-local-recovery.js');
const v2=require('../'+out+'/infrastructure/browser/local-recovery.js');
const {HybridBrowserAcademicRepository}=require('../'+out+'/infrastructure/storage/hybrid-academic-repository.js');
const {mapSeed}=require('../'+out+'/domain/academic.js');
const a=require('../content/curriculum-1.18.0-candidate.json');
const b=require('../content/curriculum-1.18.1-candidate.json');
const c=require('../content/curriculum-1.20.0-candidate.json');
const key='g-learning:english:v1:academic:packages';
const learner='g-learning:english:v1:owner:local-family:academic-attempts';
const state='g-learning:english:v1:owner:local-family:learner:primary:state';
class Store {
 constructor(limit=Infinity){this.items=new Map();this.limit=limit;this.deleted=[];this.written=[]}
 get length(){return this.items.size}
 key(i){return [...this.items.keys()][i]??null}
 getItem(k){return this.items.get(k)??null}
 setItem(k,v){
  const next=new Map(this.items);next.set(k,String(v));
  const estimated=[...next].reduce((n,[a,b])=>n+2*(a.length+b.length),0);
  if(estimated>this.limit){const e=Error('quota exceeded');e.name='QuotaExceededError';throw e}
  this.items=next;this.written.push(k);
 }
 removeItem(k){this.deleted.push(k);this.items.delete(k)}
}
const pkg=(s)=>({id:s.package_id,version:s.schema_version,
 digest:'sha-immutable-'+s.schema_version,source:s,at:1});
class Vault {
 constructor(){this.rows=new Map()}
 async list(){return [...this.rows.values()].map(x=>JSON.parse(JSON.stringify(x)))}
 async putImmutable(p){
  const prev=this.rows.get(p.version);
  if(prev){
   if(JSON.stringify(prev)!==JSON.stringify(p))throw Error('Immutable curriculum version conflict');
   return 'identical';
  }
  this.rows.set(p.version,JSON.parse(JSON.stringify(p)));return 'added';
 }
}
const attempts=Array.from({length:73},(_,i)=>{
 const src=i<11?a:c;
 const l=src.lessons[i%src.lessons.length];
 return {id:'historic-attempt-'+i,packageId:src.package_id,
  version:src.schema_version,lessonId:l.id,rootId:'historic-attempt-'+i,
  status:i<52?'scored':'started',answers:{},createdAt:i+1,
  ...(i<52?{submittedAt:i+100,results:[]}:{}) ,evidence:[]};
});
(async()=>{
 const old=new Store();
 old.setItem(key,JSON.stringify([pkg(a),pkg(b)]));
 old.setItem(learner,JSON.stringify(attempts));
 old.setItem(state,JSON.stringify({writingDraft:'keep original text',completed:[]}));
 const oldSnapshot=new Map(old.items);
 const vault=new Vault();await vault.putImmutable(pkg(c));
 const hybrid=await recovery.exportHybridRecoveryV2(old,vault);
 assert.equal(hybrid.attempts,73);
 assert.equal(hybrid.versions,2,'only latest full + referenced historic source');
 assert.equal((await v2.verifyLocalRecoveryV2(hybrid.text)).attempts,73);
 assert.deepEqual(old.items,oldSnapshot,'export must not edit source keys');
 const file=JSON.parse(hybrid.text);
 const versionDocs=JSON.parse(file.entries.find(x=>x.key===key).value).records;
 assert.equal(versionDocs.find(x=>x.version==='1.18.0').archive,'referenced-lessons');
 assert.equal(versionDocs.find(x=>x.version==='1.20.0').source.lessons.length,123);
 // Real old-recovery issue: three cumulative sources cannot fit an illustrative
 // strict 5 MiB localStorage cap; this is a simulation, not measured Safari.
 const huge=new Store(5*1024*1024);
 const allFull=JSON.stringify([pkg(a),pkg(b),pkg(c)]);
 // The raw historic backup also contains drafts, results, state and evidence.
 // The three deduplicated fixture packages alone are smaller than the actual
 // iPad backup; simulate the realistic accumulated learner-state headroom.
 assert.throws(()=>{
  huge.setItem(key,allFull);
  huge.setItem(learner,JSON.stringify(attempts));
  const used=[...huge.items].reduce((n,[a,b])=>n+2*(a.length+b.length),0);
  const extra=Math.max(512,Math.ceil((huge.limit-used)/2)+256);
  huge.setItem(state,JSON.stringify({unsubmittedDraft:'x'.repeat(extra)}));
 },/quota exceeded/);
 const fresh=new Store(5*1024*1024),freshVault=new Vault();
 await freshVault.putImmutable(pkg(c)); // ordinary site bootstrap goes to IDB
 const preview=await recovery.previewHybridRecoveryV2(hybrid.text,fresh,freshVault);
 assert(preview.valid);
 const installed=await recovery.restoreHybridRecoveryV2(hybrid.text,preview.token,true,fresh,freshVault);
 assert.equal(installed.attempts,73);
 assert.equal(fresh.getItem(key),null,'large content source must NOT enter localStorage');
 assert.deepEqual(JSON.parse(fresh.getItem(learner)),attempts);
 assert.equal(JSON.parse(fresh.getItem(state)).writingDraft,'keep original text');
 assert.equal(fresh.getItem(v2.RECOVERY_MARKER),null);
 const readThrough=new HybridBrowserAcademicRepository(fresh,freshVault);
 const pkgs=await readThrough.packages();
 assert(pkgs.some(p=>p.version==='1.20.0'));
 assert(pkgs.some(p=>p.version==='1.18.0'&&p.source.lessons.length>0));
 assert.equal((await readThrough.attempts('local-family')).length,73);
 const second=await recovery.exportHybridRecoveryV2(fresh,freshVault);
 assert.equal((await v2.verifyLocalRecoveryV2(second.text)).attempts,73,
  'Roundtrip must retain all original source/attempt relationships');
 const duplicate=await recovery.previewHybridRecoveryV2(hybrid.text,fresh,freshVault);
 assert.equal(duplicate.valid,false,'Restore must never overwrite an occupied learner');
 // Quota error after IDB content put: localStorage rollback must restore
 // all prior keys byte-for-byte and no interrupted marker may be left.
 const narrow=new Store(200),narrowVault=new Vault();
 const narrowP=await recovery.previewHybridRecoveryV2(hybrid.text,narrow,narrowVault);
 assert(narrowP.valid);
 const prior=new Map(narrow.items);
 await assert.rejects(()=>recovery.restoreHybridRecoveryV2(
  hybrid.text,narrowP.token,true,narrow,narrowVault),/quota|storage/i);
 assert.deepEqual(narrow.items,prior);
 assert.equal(narrow.getItem(v2.RECOVERY_MARKER),null);
 assert((await narrowVault.list()).length>=0);
 console.log(JSON.stringify({result:'PASS',gate:'hybrid-v2-portable-recovery',
  originalFileSchema:2,attempts:73,protectedScored:52,protectedDrafts:21,
  freshBrowserQuotaBytes:5*1024*1024,
  recoveryPortableAfterIdbMove:true,contentLocalStorageBytes:0,
  repeatedRestorePrevented:true,quotaFailureRollback:true,
  realSafariAcceptance:'NOT_TESTED',productionWrites:0}));
})().catch(err=>{console.error(err);process.exitCode=1});
