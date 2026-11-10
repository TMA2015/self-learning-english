'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),out='.sites-runtime/auto-curriculum-v120';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'infrastructure/browser/local-runtime.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
class Storage {
 constructor(){this.map=new Map();this.max=Infinity;this.writes=[]}
 getItem(key){return this.map.get(key)??null}
 setItem(key,value){
  const text=String(value);
  const other=[...this.map].reduce((n,[k,v])=>n+(k===key?0:(k.length+v.length)*2),0);
  if(other+(key.length+text.length)*2>this.max){
   const error=new Error('quota reached');error.name='QuotaExceededError';throw error;
  }
  this.writes.push(key);this.map.set(key,text);
 }
 removeItem(){throw new Error('No learner data must be deleted by an update')}
}
(async()=>{
 const storage=new Storage();global.window={localStorage:storage};
 const browser=require('../'+out+'/infrastructure/browser/local-runtime.js');
 const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
 const {academicService,sourceDigest}=require('../'+out+'/application/academic-service.js');
 const {mapSeed}=require('../'+out+'/domain/academic.js');
 const old=require('../content/curriculum-1.18.1-candidate.json');
 const latest=require('../content/curriculum-1.25.0-candidate.json');
 const repo=new BrowserLocalAcademicRepository(storage);
 await repo.addPackage({id:old.package_id,version:old.schema_version,digest:await sourceDigest(old),source:old,bundle:mapSeed(old),at:1});
 const svc=academicService(repo,new BrowserLocalLearningRepository(storage),'local-family');
 const oldLesson=old.lessons.find(l=>l.id==='GRA-A1-04');
 const q=oldLesson.activities[0];
 const saved=await svc.start(oldLesson.id,'historic-local-001');
 await svc.draft(saved.id,{[q.id]:q.answer.correct_option_id??q.answer.accepted_answers[0]});
 storage.setItem('g-learning:english:v1:owner:local-family:learner:primary:state',JSON.stringify({writing:'Do not erase this draft'}));
 const backup=new Map(storage.map);const savedAttempt=(await repo.attempts('local-family'))[0];
 // Low-quota negative case: addition must fail closed without rewriting or
 // clearing ANY key. The UI should remain usable with its previous catalog.
 storage.max=[...storage.map].reduce((n,[k,v])=>n+(k.length+v.length)*2,0)+256;
 storage.writes=[];
 const blocked=await browser.localAcademicRuntime();
 assert.equal((await blocked.service.catalog()).version,'1.18.1');
 assert((blocked.warning||'').includes('automatic English lesson update was paused'));
 assert.deepEqual(storage.map,backup,'Quota rejection changed existing on-device data');
 assert.deepEqual(storage.writes,[],'Quota failure should not write any storage key');
 assert.deepEqual((await repo.attempts('local-family'))[0],savedAttempt);
 // Once enough space is available, the same installed app updates the device
 // without choosing a JSON file or invoking a Recovery restore.
 storage.max=Infinity;
 const upgraded=await browser.localAcademicRuntime();
 const catalog=await upgraded.service.catalog();
 assert.equal(catalog.version,'1.25.0');
 assert.equal(catalog.lessons.length,154);
 assert(catalog.lessons.some(l=>l.id==='REA-C1-01'));
 assert(catalog.lessons.some(l=>l.id==='VOC-C2-01'));
 assert.equal(upgraded.warning,undefined);
 assert.deepEqual(storage.writes,['g-learning:english:v1:academic:packages'],'Only the curriculum key may change');
 for(const [key,value] of backup){
  if(key!=='g-learning:english:v1:academic:packages')
   assert.equal(storage.getItem(key),value,'Learner data changed: '+key);
 }
 assert.deepEqual((await repo.attempts('local-family'))[0],savedAttempt);
 assert.equal((await upgraded.service.lesson(oldLesson.id,'1.18.1')).version,'1.18.1');
 assert.equal((await upgraded.service.lesson(oldLesson.id)).version,latest.schema_version);
 // Idempotence: a later visit does NOT rewrite any key.
 storage.writes=[];
 const again=await browser.localAcademicRuntime();
 assert.equal((await again.service.catalog()).version,'1.25.0');
 assert.deepEqual(storage.writes,[]);
 console.log(JSON.stringify({result:'PASS',gate:'automatic-v125-curriculum-upgrade',previous:109,current:154,protectedOldAttempt:true,quotaFailClosed:true,storageDeletions:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
