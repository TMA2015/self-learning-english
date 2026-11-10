'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),out=path.join(root,'.sites-runtime/browser-curriculum-upgrade');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','infrastructure/browser/local-runtime.ts','--outDir',out,'--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
class MemoryStorage{
 constructor(){this.map=new Map();this.writes=[]}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){this.writes.push(k);this.map.set(k,String(v))}
 removeItem(){throw new Error('Upgrade must not delete local data')}
}
(async()=>{
 const storage=new MemoryStorage();global.window={localStorage:storage};
 const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));
 const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
 const {academicService,sourceDigest}=require(path.join(out,'application/academic-service.js'));
 const {mapSeed}=require(path.join(out,'domain/academic.js'));
 const {WRITING_COURSE_ID}=require(path.join(out,'domain/course-p1.js'));
 const old=require('../content/curriculum-1.11.0-candidate.json'),baseline1180=require('../content/curriculum-1.18.0-candidate.json'),current=require('../content/curriculum-1.25.0-candidate.json');
 const academic=new BrowserLocalAcademicRepository(storage),learning=new BrowserLocalLearningRepository(storage);
 const pkg={id:old.package_id,version:old.schema_version,digest:await sourceDigest(old),source:old,bundle:mapSeed(old),at:1};
 await academic.addPackage(pkg);const persistedOldPackage=(await academic.packages())[0];
 const service=academicService(academic,learning,runtime.LOCAL_OWNER_ID);
 const grammar=old.lessons.find(l=>l.module==='grammar');
 await service.start(grammar.id,'old-scored-attempt');
 await service.draft('old-scored-attempt',Object.fromEntries(grammar.activities.map(q=>[q.id,q.answer.correct_option_id??q.answer.accepted_answers[0]])));
 const scored=await service.submit('old-scored-attempt');assert.equal(scored.status,'scored');
 await service.start('WRI-A2-01','old-writing-draft');await service.draft('old-writing-draft',{[old.lessons.find(l=>l.id==='WRI-A2-01').activities[0].id]:'Keep my own words'});
 const learner=await runtime.localLearningRuntime();await learner.service.saveState({writing:'Unchanged Writing draft',feedback:{note:'Saved feedback'},completed:[0]});
 const courses=await runtime.localCourseRuntime();await courses.select(WRITING_COURSE_ID,0,'upgrade-selection');
 // Family upgrade rehearsal: historical v1.11.0 work and a previously
 // imported v1.18.0 package/attempt must survive activation of v1.18.1.
 const package1180={id:baseline1180.package_id,version:baseline1180.schema_version,digest:await sourceDigest(baseline1180),source:baseline1180,bundle:mapSeed(baseline1180),at:2};
 await academic.addPackage(package1180);
 const historical1180=await service.start('REA-A1-01','historical-reading-1180');
 assert.equal(historical1180.version,'1.18.0');
 const oldReading1180=await service.lesson('REA-A1-01','1.18.0');
 const before=new Map(storage.map),oldAttempts=await academic.attempts(runtime.LOCAL_OWNER_ID),oldView=await service.lesson(grammar.id,'1.11.0');storage.writes=[];
 const upgraded=await runtime.localAcademicRuntime();const catalog=await upgraded.service.catalog();
 assert.equal(catalog.version,'1.25.0');assert.equal(catalog.lessons.length,154);
 assert.equal(current.lessons.reduce((n,l)=>n+l.activities.length,0),1125);
 assert.deepEqual(catalog.lessons.reduce((m,l)=>(m[l.module]=(m[l.module]??0)+1,m),{}),{grammar:40,vocabulary:18,reading:33,writing:31,listening:21,speaking:6,pronunciation:5});
 const packages=await upgraded.academic.packages();assert.equal(packages.length,3);assert.deepEqual(packages.find(p=>p.version==='1.11.0'),persistedOldPackage);assert.deepEqual(packages.find(p=>p.version==='1.18.0').source,baseline1180);assert.deepEqual(packages.find(p=>p.version==='1.25.0').source,current);
 const packageKey='g-learning:english:v1:academic:packages';assert.deepEqual(storage.writes,[packageKey]);
 for(const [k,v] of before)if(k!==packageKey)assert.equal(storage.getItem(k),v,'Learner key changed: '+k);
 assert.deepEqual([...storage.map.keys()].sort(),[...before.keys()].sort(),'No namespace change');
 assert.deepEqual(await academic.attempts(runtime.LOCAL_OWNER_ID),oldAttempts);
 assert.deepEqual(await upgraded.service.lesson(grammar.id,'1.11.0'),oldView);
 assert.deepEqual(await upgraded.service.lesson('REA-A1-01','1.18.0'),oldReading1180);
 assert((await upgraded.service.lesson('REA-A1-01')).lesson.examples.join(' ').includes('guitar group'));
 assert((await upgraded.service.lesson('VOC-A1-01')).lesson.examples.some(e=>e.includes('Noor buys a banana')));
 assert.deepEqual((await upgraded.service.catalog()).attempts.find(a=>a.id===scored.id).results,scored.results);
 assert(catalog.lessons.some(l=>l.id==='REA-C1-01')&&catalog.lessons.some(l=>l.id==='VOC-C2-01'));
 assert.deepEqual([...storage.map.keys()].sort(),[...before.keys()].sort(),'No learner storage keys added or removed by curriculum update');
 for(const id of ['PRO-A2-03','PRO-B1-02','LIS-A2-03','LIS-B1-04'])assert(catalog.lessons.some(l=>l.id===id));
 const manifest=require('../content/pronunciation-audio.json');for(const id of ['PRO-A2-03','PRO-B1-02'])assert.deepEqual((await upgraded.service.lesson(id)).pronunciationAudio,{url:manifest[id].url,duration:manifest[id].duration});
 // Reload: reuse persisted bytes, but force repository recreation with a new storage object.
 const reload=new MemoryStorage();reload.map=new Map(storage.map);global.window.localStorage=reload;
 const again=await runtime.localAcademicRuntime();assert.equal((await again.service.catalog()).version,'1.25.0');assert.deepEqual(reload.writes,[]);
 assert.deepEqual(await again.academic.attempts(runtime.LOCAL_OWNER_ID),oldAttempts);
 assert.equal((await (await runtime.localCourseRuntime()).load()).activeCourseId,WRITING_COURSE_ID);
 const revision=await again.service.start(grammar.id,'historical-revision',scored.id);assert.equal(revision.version,'1.11.0');assert.equal(revision.parentId,scored.id);
 const fresh=await again.service.start(grammar.id,'current-root-attempt');assert.equal(fresh.version,'1.25.0');assert.equal(fresh.parentId,undefined);
 assert.equal((await again.academic.attempts(runtime.LOCAL_OWNER_ID)).find(a=>a.id===historical1180.id).version,'1.18.0');
 assert.deepEqual((await again.academic.attempts(runtime.LOCAL_OWNER_ID)).filter(a=>oldAttempts.some(o=>o.id===a.id)),oldAttempts);
 await assert.rejects(()=>again.academic.addPackage({...pkg,digest:'conflict'}),/Immutable/);
 console.log('PASS: immutable 1.11 -> 1.18.0 -> 1.25.0 auto upgrade; 154/1125, historical draft/results/Reading notes preserved; one package key write; reload idempotent; course/state/evidence unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1});
