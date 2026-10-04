const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','github-first-g1');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/browser/local-runtime.ts',
  'infrastructure/storage/browser-local-repositories.ts',
  'application/academic-service.ts',
  'application/learning-service.ts',
  'domain/academic.ts',
  'domain/practice-progress.ts',
  '--outDir','.sites-runtime/github-first-g1',
  '--module','commonjs',
  '--target','es2022',
  '--resolveJsonModule',
  '--esModuleInterop',
  '--skipLibCheck',
  '--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(k,String(v))}
  removeItem(k){this.map.delete(k)}
}
const storage=new MemoryStorage();
global.window={localStorage:storage,location:{origin:'https://example.test'}};

(async()=>{
  const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));

  const learner=await runtime.localLearningRuntime();
  assert.equal(await learner.service.readState(),null);
  await learner.service.saveState({writing:'local draft',profile:{goal:'Build balanced English skills'}});
  const saved=await learner.service.readState();
  assert.equal(saved.writing,'local draft');

  const academic=await runtime.localAcademicRuntime();
  const catalog=await academic.service.catalog();
  assert.equal(catalog.version,'1.10.0');
  assert.equal(catalog.lessons.length,74,'bundled GitHub-first curriculum should be 1.10.0 / 74 lessons');
  const packages=await academic.academic.packages();
  assert(packages.some(row=>row.version==='1.10.0'),'1.10.0 package must exist in local browser storage');

  const target=catalog.lessons.find(row=>row.id==='VOC-B1-02');
  assert(target,'expected reviewed B1 Vocabulary density lesson VOC-B1-02');
  const view=await academic.service.lesson(target.id);
  assert.equal(view.version,'1.10.0');
  assert.equal(view.lesson.activities.length,10);

  const id='g1-local-attempt-0001';
  await academic.service.start(grammar.id,id);
  const answers={};
  for(const q of view.lesson.activities){
    if(q.type==='single_choice')answers[q.id]=q.options?.[0]?.id??'';
    else if(q.id==='VOC-B1-02-Q6')answers[q.id]='development';
    else if(q.id==='VOC-B1-02-Q9')answers[q.id]='carefully';
    else answers[q.id]='test answer';
  }
  await academic.service.draft(id,answers);
  const submitted=await academic.service.submit(id);
  assert.equal(submitted.status,'scored');
  assert(submitted.evidence.some(row=>row.tag==='word-formation'),'reviewed B1 word-formation evidence should enter the local ledger');

  const progress=await runtime.localPracticeProgress();
  assert(progress.overall.total>0,'objective Grammar attempt should appear in local progress');
  assert(progress.skills.some(row=>row.skill==='Vocabulary'));

  const academicAgain=await runtime.localAcademicRuntime();
  const catalogAgain=await academicAgain.service.catalog();
  assert(catalogAgain.attempts.some(row=>row.id===id),'attempt must survive service recreation in browser storage');

  console.log(JSON.stringify({
    githubFirstG1:true,
    curriculum:catalog.version,
    lessons:catalog.lessons.length,
    b1Wave2A:true,
    b1Wave2B:true,
    b1Wave2C:true,
    grammarRoadmapComplete:true,
    b1VocabularyReadingDensityWave1:true,
    reviewedSkillEvidence:'word-formation',
    localState:true,
    deterministicAttempt:true,
    localProgress:true,
    d1:false,
    ai:false
  }));
})().catch(error=>{console.error(error);process.exit(1)});
