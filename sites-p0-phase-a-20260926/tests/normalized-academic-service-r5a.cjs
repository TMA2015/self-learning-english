'use strict';
/**
 * R5a - real academicService against a lesson-scoped normalized reader.
 * Public curricula + artificial learner records ONLY. No actual browser data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/normalized-lesson-service-r5a';
const dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'application/academic-service.ts','application/academic-content-reader.ts',
 'domain/lesson-revision-plan.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {academicService}=require(path.join(dest,'application/academic-service.js'));
const {normalizedAcademicContentReader}=require(path.join(dest,'application/academic-content-reader.js'));
const {planLessonRevisions}=require(path.join(dest,'domain/lesson-revision-plan.js'));
const {
 BrowserLocalAcademicRepository,BrowserLocalLearningRepository
}=require(path.join(dest,'infrastructure/storage/browser-local-repositories.js'));
const old=require('../content/curriculum-1.18.0-candidate.json');
const latest=require('../content/curriculum-1.20.0-candidate.json');
const original=(v)=>({id:v.package_id,version:v.schema_version,
 digest:'original-validated-'+v.schema_version,source:v});
const clone=v=>JSON.parse(JSON.stringify(v));
const oldReading=old.lessons.find(l=>l.id==='REA-A1-01');
const currentReading=latest.lessons.find(l=>l.id==='REA-A1-01');
const oldWriting=old.lessons.find(l=>l.id==='WRI-A2-01');
const listening=old.lessons.find(l=>l.module==='listening');
const currentGrammar=latest.lessons.find(l=>l.module==='grammar'&&
 l.activities.length&&l.activities.every(q=>q.type!=='extended_response'));
assert(oldReading&&currentReading&&oldWriting&&listening&&currentGrammar);
assert.notDeepEqual(oldReading,currentReading,'The referenced old Reading lesson must really differ');
class BrowserStore {
 data=new Map();
 getItem(k){return this.data.get(k)??null}
 setItem(k,v){this.data.set(k,String(v))}
 removeItem(k){this.data.delete(k)}
}
class MockNormalizedVault {
 constructor(plan){
  this.active=clone(plan.active);
  this.blobs=clone(plan.blobs);
  this.aliases=clone(plan.aliases);
  this.pins=0;this.loads=0;
 }
 async manifest(){return clone(this.active)}
 async snapshot(){this.loads++;return clone({active:this.active,blobs:this.blobs,aliases:this.aliases})}
 async resolveCurrent(id){
  const x=this.active.lessons.find(x=>x.lessonId===id);
  if(!x)throw Error('Unknown current Lesson ID');
  return clone(this.blobs.find(b=>b.revision===x.revision));
 }
 async historicAlias(version,lessonId){
  return clone(this.aliases.find(x=>x.version===version&&x.lessonId===lessonId)??null);
 }
 async resolveHistoric(version,lessonId){
  const x=this.aliases.find(x=>x.version===version&&x.lessonId===lessonId);
  if(!x)throw Error('Missing attempt source alias');
  return clone(this.blobs.find(b=>b.revision===x.revision));
 }
 async pinCurrentForAttempt(version,id){
  if(version!==this.active.version)throw Error('Stale current curriculum');
  const item=this.active.lessons.find(x=>x.lessonId===id);
  if(!item)throw Error('Current lesson missing');
  if(!this.aliases.some(x=>x.version===version&&x.lessonId===id))
   this.aliases.push({version,lessonId:id,revision:item.revision,
    packageId:this.active.packageId,releaseDigest:this.active.releaseDigest});
  this.pins++;
 }
}
function correctAnswers(lesson){
 return Object.fromEntries(lesson.activities.map(q=>[q.id,
  q.type==='single_choice'?q.answer.correct_option_id:
  q.type==='short_answer'?q.answer.accepted_answers[0]:
  'My original self-written paragraph for practice.']));
}
function started(id,lesson,version,answers={}){
 return {id,rootId:id,packageId:old.package_id,version,
  lessonId:lesson.id,status:'started',answers,createdAt:1000,evidence:[]};
}
const tracked=[
 {id:'prior-reading',version:old.schema_version,lessonId:oldReading.id,
  packageId:old.package_id},
 {id:'prior-writing',version:old.schema_version,lessonId:oldWriting.id,
  packageId:old.package_id},
 {id:'prior-listening',version:old.schema_version,lessonId:listening.id,
  packageId:old.package_id},
];
(async()=>{
 const plan=await planLessonRevisions([original(old),original(latest)],tracked);
 const vault=new MockNormalizedVault(plan),reader=normalizedAcademicContentReader(vault);
 const storage=new BrowserStore(),repo=new BrowserLocalAcademicRepository(storage);
 let packageCalls=0,packageWrites=0;
 const attemptsOnly={
  packages:async()=>{packageCalls++;throw Error('R5 MUST NOT READ CUMULATIVE PACKAGES')},
  addPackage:async()=>{packageWrites++;throw Error('R5 MUST NOT WRITE CUMULATIVE PACKAGES')},
  attempts:repo.attempts.bind(repo),
  start:repo.start.bind(repo),saveDraft:repo.saveDraft.bind(repo),
  finish:repo.finish.bind(repo),approve:repo.approve.bind(repo),
 };
 const learning=new BrowserLocalLearningRepository(storage);
 const svc=()=>academicService(attemptsOnly,learning,'local-family',reader);
 const api=svc();
 const catalog=await api.catalog();
 assert.equal(catalog.version,'1.20.0');
 assert.equal(catalog.lessons.length,123);
 const historical=await api.lesson(oldReading.id,old.schema_version,old.package_id);
 const modern=await api.lesson(oldReading.id);
 assert.equal(historical.version,'1.18.0');
 assert.equal(modern.version,'1.20.0');
 assert.notDeepEqual(historical.lesson,modern.lesson,
  'The older prompt is not silently replaced with the latest prompt');
 assert.equal(await api.lesson(currentGrammar.id,latest.schema_version).then(x=>x.version),
  '1.20.0','An unpinned current catalog preview can use explicit version');
 await assert.rejects(api.lesson(oldReading.id,old.schema_version,'wrong-package'),
  /package ID mismatch/);

 // Existing old started Reading continues to use the exact old answer keys.
 const oldAttempt=started('old-reading-r5a-00001',oldReading,old.schema_version);
 await repo.start('local-family',oldAttempt);
 const originalView=await api.lesson(oldReading.id,old.schema_version,old.package_id);
 assert.equal(originalView.lesson.activities.length,oldReading.activities.length);
 await api.draft(oldAttempt.id,correctAnswers(oldReading));
 const gradedOld=await svc().submit(oldAttempt.id);
 assert.equal(gradedOld.version,old.schema_version);
 assert.equal(gradedOld.status,'scored');
 assert.equal(gradedOld.results.length,oldReading.activities.length);

 // Retake an old submitted attempt: keep the original source, not latest.
 const oldRetake=await svc().start(oldReading.id,'old-reading-retake-r5a-00002',oldAttempt.id);
 assert.equal(oldRetake.version,'1.18.0');
 assert.equal(oldRetake.packageId,old.package_id);
 assert.equal(vault.pins,0,'Retake of old attempt must not pin current revision');

 // New attempt: pin its exact current version BEFORE its learner write.
 const fresh=await svc().start(currentGrammar.id,'current-grammar-r5a-00003');
 assert.equal(fresh.version,'1.20.0');
 assert.equal(vault.pins,1);
 assert(vault.aliases.some(x=>x.version==='1.20.0'&&x.lessonId===currentGrammar.id));
 const currentAnswers=correctAnswers(currentGrammar);
 await api.draft(fresh.id,currentAnswers);
 const resume=(await svc().catalog()).attempts.find(x=>x.id===fresh.id);
 assert(resume&&resume.status==='started');
 assert.deepEqual(resume.answers,currentAnswers);
 const completed=await svc().submit(fresh.id);
 assert.equal(completed.status,'scored');
 assert.equal(completed.results.length,currentGrammar.activities.length);
 assert(completed.results.every(r=>r.correct===true),
  'Current deterministic academic-service grading must preserve original keys');

 // Original Writing rubric must survive a newer cumulative release.
 const essay=started('old-writing-r5a-00004',oldWriting,old.schema_version);
 await repo.start('local-family',essay);
 await svc().draft(essay.id,correctAnswers(oldWriting));
 const pending=await svc().submit(essay.id);
 assert.equal(pending.status,'pending_review');
 const review=(await svc().reviews()).find(x=>x.id===essay.id);
 assert(review&&review.rubric);
 const originalRubricId=oldWriting.activities.find(q=>q.type==='extended_response').rubric_id;
 assert.deepEqual(review.rubric,old.rubrics[originalRubricId]);
 const marks=Object.fromEntries(review.rubric.criteria.map(k=>[k,3]));
 const approved=await svc().approve(essay.id,'Academic review against original rubric',marks,true);
 assert.equal(approved.status,'approved');
 assert.equal(approved.review.scores[review.rubric.criteria[0]],3);

 // Historic submitted Listening transcript is from the original lesson,
 // not a newer asset. Live audio bytes need a separate provenance gate.
 const audioAttempt={...started('old-listening-r5a-00005',listening,old.schema_version),
  status:'scored',submittedAt:9000};
 await repo.start('local-family',audioAttempt);
 const transcript=await svc().transcript(audioAttempt.id);
 assert.equal(transcript.text,listening.audio_asset.source_text);

 // A missing historical alias must block grading and protect learner bytes.
 const unpinned=started('missing-old-source-r5a-00006',oldReading,'1.17.0');
 await repo.start('local-family',unpinned);
 const before=storage.getItem('g-learning:english:v1:owner:local-family:academic-attempts');
 await assert.rejects(svc().draft(unpinned.id,{}),/Original attempted lesson revision is missing/);
 assert.equal(storage.getItem('g-learning:english:v1:owner:local-family:academic-attempts'),
  before,'Invalid historical source may not rewrite attempts');

 // Import, package listing and preview are intentionally disabled in this
 // normalized prototype: the V2 importer is not compatible with IDB V3.
 await assert.rejects(api.preview(latest),/separately approved normalized importer/);
 await assert.rejects(api.packages(),/separately approved normalized importer/);
 assert.equal(packageCalls,0);
 assert.equal(packageWrites,0);
 assert.equal(storage.getItem('g-learning:english:v1:academic:packages'),null,
  'No repeated curriculum package ever written to localStorage');
 console.log(JSON.stringify({result:'PASS',gate:'R5a-targeted-academic-service',
  actualPublicCurricula:['1.18.0','1.20.0'],catalogLessons:catalog.lessons.length,
  historicalReadingUsedOriginal:true,currentReadingRemainsNew:true,
  savedDraftResumed:true,oldRetakePinnedToOriginal:true,
  newCurrentAttemptPinned:true,newCurrentDeterministicScore:true,
  WritingOriginalRubricReviewed:true,oldListeningTranscriptResolved:true,
  missingOriginalSourceFailsClosed:true,attemptsWithoutAnyPackageReads:true,
  packageCalls,packageWrites,realSafari:'NOT_TESTED',
  productionRuntime:'NOT_WIRED',productionWrites:0}));
})().catch(err=>{console.error(err);process.exitCode=1});
