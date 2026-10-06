'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','account-profile-isolation-p0');
fs.rmSync(out,{recursive:true,force:true});

const compilerOptions={module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true};
for(const [sourcePath,outPath] of [
  ['domain/course-p1.ts','domain/course-p1.js'],
  ['infrastructure/storage/browser-local-repositories.ts','infrastructure/storage/browser-local-repositories.js'],
  ['infrastructure/browser/local-profiles.ts','infrastructure/browser/local-profiles.js'],
]){
  const source=fs.readFileSync(path.join(root,sourcePath),'utf8');
  const built=ts.transpileModule(source,{compilerOptions}).outputText;
  const dest=path.join(out,outPath);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,built);
}
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

const {
  BrowserLocalLearningRepository,
  BrowserLocalAcademicRepository,
  BrowserLocalCourseSelectionRepository,
}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
const {
  ensureLocalProfiles,listLocalProfiles,selectedLocalProfile,createLocalProfile,
  selectLocalProfile,renameLocalProfile,localScope,LOCAL_OWNER_ID,
}=require(path.join(out,'infrastructure/browser/local-profiles.js'));
const {WRITING_COURSE_ID}=require(path.join(out,'domain/course-p1.js'));

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(k,String(v))}
  removeItem(k){this.map.delete(k)}
}

(async()=>{
  const storage=new MemoryStorage();
  const learning=new BrowserLocalLearningRepository(storage);
  const academic=new BrowserLocalAcademicRepository(storage);
  const courses=new BrowserLocalCourseSelectionRepository(storage);

  const initial=ensureLocalProfiles(storage,1000);
  assert.deepEqual(initial.map(p=>p.id),['primary']);
  assert.equal(selectedLocalProfile(storage).id,'primary');
  const primary=localScope(storage);
  assert.deepEqual(primary,{ownerId:LOCAL_OWNER_ID,learnerId:'primary'});

  await learning.writeState(primary,{writing:'Primary draft',week:1});
  await courses.select(primary,WRITING_COURSE_ID,0,'profile_req_0001');
  const baseAttempt={id:'shared-attempt-id',packageId:'pkg',version:'1.0.0',lessonId:'GRA-A1-01',rootId:'shared-attempt-id',status:'started',answers:{},createdAt:1,evidence:[]};
  await academic.start(primary,baseAttempt);

  const second=createLocalProfile(storage,'Cousin',{id:'learner_cousin',now:2000});
  assert.equal(second.id,'learner_cousin');
  assert.equal(selectedLocalProfile(storage).id,'learner_cousin');
  const secondScope=localScope(storage);
  assert.deepEqual(secondScope,{ownerId:LOCAL_OWNER_ID,learnerId:'learner_cousin'});

  assert.equal(await learning.readState(secondScope),null,'new learner must not inherit primary state');
  assert.equal((await academic.attempts(secondScope)).length,0,'new learner must not inherit primary attempts');
  assert.equal((await courses.read(secondScope)).activeCourseId,null,'new learner must not inherit primary course');

  await learning.writeState(secondScope,{writing:'Cousin draft',week:0});
  await courses.select(secondScope,WRITING_COURSE_ID,0,'profile_req_0002');
  await academic.start(secondScope,{...baseAttempt,lessonId:'VOC-A1-01'});

  assert.equal((await learning.readState(primary)).writing,'Primary draft');
  assert.equal((await learning.readState(secondScope)).writing,'Cousin draft');
  assert.equal((await academic.attempts(primary))[0].lessonId,'GRA-A1-01');
  assert.equal((await academic.attempts(secondScope))[0].lessonId,'VOC-A1-01');
  assert.equal((await courses.read(primary)).activeCourseId,WRITING_COURSE_ID);
  assert.equal((await courses.read(secondScope)).activeCourseId,WRITING_COURSE_ID);

  selectLocalProfile(storage,'primary');
  assert.equal(localScope(storage).learnerId,'primary');
  renameLocalProfile(storage,'primary','My learner',3000);
  assert.equal(selectedLocalProfile(storage).preferredName,'My learner');
  assert.equal(listLocalProfiles(storage).length,2);

  // Historical primary-only browser keys remain readable until the first scoped write.
  const legacyStorage=new MemoryStorage();
  legacyStorage.setItem('g-learning:english:v1:owner:local-family:academic-attempts',JSON.stringify([baseAttempt]));
  legacyStorage.setItem('g-learning:english:v1:owner:local-family:course-selection',JSON.stringify({courseV1:1,activeCourseId:WRITING_COURSE_ID,revision:1,lastRequestId:'legacy_req'}));
  const legacyAcademic=new BrowserLocalAcademicRepository(legacyStorage);
  const legacyCourses=new BrowserLocalCourseSelectionRepository(legacyStorage);
  assert.equal((await legacyAcademic.attempts(primary)).length,1,'primary academic data must remain readable');
  assert.equal((await legacyCourses.read(primary)).activeCourseId,WRITING_COURSE_ID,'primary course selection must remain readable');
  const legacyOther={ownerId:LOCAL_OWNER_ID,learnerId:'learner_other'};
  assert.equal((await legacyAcademic.attempts(legacyOther)).length,0,'legacy owner key must never leak into another learner');
  assert.equal((await legacyCourses.read(legacyOther)).activeCourseId,null,'legacy course key must never leak into another learner');

  console.log(JSON.stringify({
    result:'PASS',
    defaultProfileMigrated:true,
    sameOwnerTwoLearnersIsolated:true,
    academicAttemptsIsolated:true,
    courseSelectionIsolated:true,
    stateIsolated:true,
    legacyPrimaryReadable:true,
    legacyNeverLeaksToOtherLearner:true,
    accountRequired:false
  }));
})().catch(error=>{console.error(error);process.exit(1)});
