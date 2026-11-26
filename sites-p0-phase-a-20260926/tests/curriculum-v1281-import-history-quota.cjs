'use strict';
// Exercise actual importer and repository on isolated simulated storage; no runtime activation.
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=require('../infrastructure/storage/browser-local-repositories.ts');
const {academicService,sourceDigest}=require('../application/academic-service.ts');
const {mapSeed}=require('../domain/academic.ts');
const base=require('../content/curriculum-1.28.0-candidate.json'),next=require('../content/review-packets/curriculum-1.28.1-wording-candidate.json');
const key='g-learning:english:v1:academic:packages',owner='local-family',lessonId='REA-B2-05';
class Store{
 constructor(){this.map=new Map();this.writes=[];this.limit=Infinity}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){const copy=new Map(this.map);copy.set(k,String(v));if([...copy].reduce((n,[k,v])=>n+2*(k.length+v.length),0)>this.limit){const e=Error('quota');e.name='QuotaExceededError';throw e}this.map=copy;this.writes.push(k)}
 removeItem(){throw Error('No automatic learner data deletion')}
}
(async()=>{
 const store=new Store(),repo=new BrowserLocalAcademicRepository(store),learning=new BrowserLocalLearningRepository(store);
 const service=academicService(repo,learning,owner);
 await repo.addPackage({id:base.package_id,version:base.schema_version,digest:await sourceDigest(base),source:base,bundle:mapSeed(base),at:1});
 const lesson=base.lessons.find(l=>l.id===lessonId),answers=Object.fromEntries(lesson.activities.map(q=>[q.id,q.answer.correct_option_id]));
 await service.start(lessonId,'historical-score-1280');await service.draft('historical-score-1280',answers);
 const scored=await service.submit('historical-score-1280');assert.equal(scored.status,'scored');
 await service.start(lessonId,'historical-draft-1280');await service.draft('historical-draft-1280',{[lesson.activities[0].id]:'C'});
 const attempts=await repo.attempts(owner),oldView=await service.lesson(lessonId,'1.28.0'),before=new Map(store.map);
 const preview=await service.preview(next);assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:0,update:5,skip:171,conflict:0});
 await assert.rejects(()=>service.importPackage(next,preview.token,false),/confirm/i);
 assert.deepEqual([...store.map],[...before]);
 // Force insufficient space at the existing usage plus 128 bytes; do not claim an actual Safari quota.
 store.limit=[...before].reduce((n,[k,v])=>n+2*(k.length+v.length),0)+128;
 await assert.rejects(()=>service.importPackage(next,preview.token,true),/no storage space/i);
 assert.deepEqual([...store.map],[...before],'failed import must be atomic');
 assert.equal((await service.catalog()).version,'1.28.0');assert.deepEqual(await repo.attempts(owner),attempts);
 store.limit=Infinity;store.writes=[];
 await service.importPackage(next,preview.token,true);
 assert.deepEqual(store.writes,[key],'one curriculum key write');
 for(const [k,v] of before)if(k!==key)assert.equal(store.getItem(k),v,'learner key unchanged '+k);
 assert.deepEqual(await repo.attempts(owner),attempts);
 assert.equal((await service.catalog()).version,'1.28.1');assert.equal((await service.catalog()).lessons.length,176);
 assert.deepEqual(await service.lesson(lessonId,'1.28.0'),oldView);
 const freshView=await service.lesson(lessonId);assert.equal(freshView.lesson.activities[0].prompt,'What do the volunteer counts in Source A directly show?');
 assert.equal(oldView.lesson.activities[0].prompt,'What do the volunteer counts in Source C directly show?');
 const reload=academicService(new BrowserLocalAcademicRepository(store),new BrowserLocalLearningRepository(store),owner);
 assert.deepEqual(await reload.submit(scored.id),scored,'old score never recomputed');
 const revision=await reload.start(lessonId,'historical-revision-1280',scored.id);assert.equal(revision.version,'1.28.0');
 const fresh=await reload.start(lessonId,'fresh-root-1281');assert.equal(fresh.version,'1.28.1');assert.equal(fresh.parentId,undefined);
 assert.deepEqual((await repo.attempts(owner)).filter(a=>attempts.some(b=>a.id===b.id)),attempts);
 await assert.rejects(()=>reload.lesson(lessonId,'1.28.2'),/version not found/i);
 assert((await reload.preview({...next,status:'conflicting-content'})).errors.length>0,'same version conflict');
 console.log(JSON.stringify({gate:'SLE_V1281_IMPORT_HISTORY_QUOTA',result:'PASS',updates:5,unchanged:171,atomicQuotaFailure:true,oldAttemptsPreserved:true,independentCurrentRoot:true,activation:'NOT_TESTED',physicalSafari:'NOT_TESTED'}));
})().catch(e=>{console.error(e);process.exitCode=1});
