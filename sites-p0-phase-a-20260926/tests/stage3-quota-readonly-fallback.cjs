'use strict';
// Stage 3 regression: an insufficient-space curriculum upgrade must preserve
// access to a saved older course, and must NOT pretend that v1.18.1 was installed.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/stage3-upgrade-quota-fallback';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-runtime.ts','--outDir',out,
 '--module','commonjs','--target','es2022','--resolveJsonModule',
 '--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {BrowserLocalAcademicRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
const {mapSeed}=require('../'+out+'/domain/academic.js');
const runtime=require('../'+out+'/infrastructure/browser/local-runtime.js');
const old=require('../content/curriculum-1.18.0-candidate.json');
const key='g-learning:english:v1:academic:packages',owner='local-family';
const quota=5*1024*1024;
class Storage{
 constructor(){this.map=new Map();this.writes=0}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const next=new Map(this.map);next.set(k,String(v));
  const units=[...next].reduce((sum,[name,value])=>sum+name.length+value.length,0);
  if(units*2>quota){const error=Error('quota');error.name='QuotaExceededError';throw error}
  this.map=next;this.writes++;
 }
 removeItem(){throw Error('No automatic deletion of learner data')}
}
(async()=>{
 const store=new Storage(),academic=new BrowserLocalAcademicRepository(store);
 await academic.addPackage({id:old.package_id,version:old.schema_version,digest:'a'.repeat(64),
  source:old,bundle:mapSeed(old),at:1});
 const historic={id:'stage3-legacy-001',packageId:old.package_id,version:'1.18.0',
  lessonId:'REA-A1-01',rootId:'stage3-legacy-001',status:'started',
  answers:{},createdAt:1,evidence:[]};
 await academic.start(owner,historic);
 const currentUnits=[...store.map].reduce((sum,[name,value])=>sum+name.length+value.length,0);
 const remaining=Math.floor(quota/2)-currentUnits-2048;
 assert(remaining>0);
 store.setItem('other-learning-records','x'.repeat(remaining-22));
 const before=new Map(store.map);
 global.window={localStorage:store};
 const result=await runtime.localAcademicRuntime();
 const catalog=await result.service.catalog();
 assert.equal(catalog.version,'1.18.0','Do not claim v1.18.1 was installed');
 assert.match(result.warning??'',/could not be saved/i);
 assert.match(result.warning??'',/New saves may also fail/i);
 assert.deepEqual((await result.academic.packages()).map(x=>x.version),['1.18.0']);
 assert.deepEqual(await result.academic.attempts(owner),[historic]);
 assert.deepEqual([...store.map],[...before],'Failed upgrade must write/delete nothing');
 const ui=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
 const client=fs.readFileSync(path.join(root,'infrastructure/browser/client-services.ts'),'utf8');
 assert(ui.includes('catalog?.warning&&<p className="notice" role="alert">'));
 assert(client.includes('warning?{warning}:{}'));
 // With no previously available curriculum, do NOT suppress the storage error.
 const empty=new Storage(),filler=Math.floor(quota/2)-500;
 empty.setItem('other-learning-records','x'.repeat(filler-22));
 global.window.localStorage=empty;
 await assert.rejects(()=>runtime.localAcademicRuntime(),/Could not save:.*no storage space/i);
 console.log(JSON.stringify({result:'PASS',gate:'stage3-quota-readonly-fallback',
  previouslySavedCourseReadable:true,attemptsIntact:true,
  noFalseUpgrade:true,noAutomaticDeletion:true,emptyBrowserFailsClosed:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
