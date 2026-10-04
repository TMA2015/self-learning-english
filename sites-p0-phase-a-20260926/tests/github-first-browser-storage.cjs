const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');

const outDir=path.join(__dirname,'../.sites-runtime/github-first-browser-storage');
fs.rmSync(outDir,{recursive:true,force:true});
fs.mkdirSync(path.join(outDir,'infrastructure/storage'),{recursive:true});
fs.mkdirSync(path.join(outDir,'domain'),{recursive:true});

const compilerOptions={
  module:ts.ModuleKind.CommonJS,
  target:ts.ScriptTarget.ES2022,
  esModuleInterop:true,
};
for(const [sourcePath,outPath] of [
  ['../domain/course-p1.ts','domain/course-p1.js'],
  ['../infrastructure/storage/browser-local-repositories.ts','infrastructure/storage/browser-local-repositories.cjs'],
]){
  const source=fs.readFileSync(path.join(__dirname,sourcePath),'utf8');
  const built=ts.transpileModule(source,{compilerOptions}).outputText;
  fs.writeFileSync(path.join(outDir,outPath),built);
}
fs.writeFileSync(path.join(outDir,'package.json'),'{"type":"commonjs"}\n');
const outFile=path.join(outDir,'infrastructure/storage/browser-local-repositories.cjs');
const {BrowserLocalLearningRepository,BrowserLocalAcademicRepository,browserLocalRepositories}=require(outFile);

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(key){return this.map.has(key)?this.map.get(key):null}
  setItem(key,value){this.map.set(key,String(value))}
  removeItem(key){this.map.delete(key)}
}

(async()=>{
  const storage=new MemoryStorage();
  const learning=new BrowserLocalLearningRepository(storage);
  const scopeA={ownerId:'family-a',learnerId:'primary'};
  const scopeB={ownerId:'family-b',learnerId:'primary'};

  assert.equal(await learning.readState(scopeA),null);
  await learning.writeState(scopeA,{draft:'hello',unknownLegacyField:{kept:true}});
  assert.deepEqual(await learning.readState(scopeA),{draft:'hello',unknownLegacyField:{kept:true}});
  assert.equal(await learning.readState(scopeB),null,'owner namespaces must be isolated');

  const event={id:'e1',skill:'Grammar',source:'exercise',score:1,max:1,at:10};
  await learning.appendEvidence(scopeA,[event,event]);
  await learning.appendEvidence(scopeA,[{...event,score:0},{id:'e2',skill:'Reading',source:'exercise',score:1,max:1,at:20}]);
  const evidence=await learning.readEvidence(scopeA);
  assert.equal(evidence.length,2,'evidence IDs must be idempotent');
  assert.equal(evidence[0].score,1,'first write must win like D1 ON CONFLICT DO NOTHING');

  const assessment={sessionId:'d1',startedAt:100,finishedAt:200,result:{done:true}};
  await learning.appendAssessment(scopeA,assessment);
  await learning.appendAssessment(scopeA,{...assessment,result:{done:false}});
  assert.equal((await learning.readAssessments(scopeA)).length,1,'assessment session IDs must be idempotent');

  assert.equal(await learning.legacyImported(scopeA),false);
  await learning.markLegacyImported(scopeA);
  assert.equal(await learning.legacyImported(scopeA),true);

  const snapshot={model:{skills:{}},engineVersion:'test',at:300};
  await learning.appendSnapshot(scopeA,'s1',snapshot);
  await learning.appendSnapshot(scopeA,'s1',{...snapshot,at:400});
  assert.equal((await learning.readSnapshots(scopeA)).length,1,'snapshot IDs must be idempotent');
  assert.equal((await learning.readSnapshots(scopeA))[0].at,300,'first snapshot write must win');

  const academic=new BrowserLocalAcademicRepository(storage);
  const pkg={id:'pkg',version:'1.0.0',digest:'abc',source:{},bundle:{},at:1};
  await academic.addPackage(pkg);
  await academic.addPackage({...pkg});
  assert.equal((await academic.packages()).length,1,'curriculum version import must be idempotent');
  await assert.rejects(()=>academic.addPackage({...pkg,digest:'different'}),/Immutable curriculum version conflict/);

  const attempt={
    id:'attempt-0001',packageId:'pkg',version:'1.0.0',lessonId:'GRA-A1-01',rootId:'attempt-0001',
    status:'started',answers:{},createdAt:1,evidence:[]
  };
  await academic.start('family-a',attempt);
  await academic.start('family-a',attempt);
  assert.equal((await academic.attempts('family-a')).length,1,'attempt start must be idempotent');
  assert.equal((await academic.attempts('family-b')).length,0,'academic attempts must be owner-isolated');

  await academic.saveDraft('family-a',attempt.id,{answers:{q1:'A'}});
  assert.equal((await academic.attempts('family-a'))[0].answers.q1,'A');

  const finished={...(await academic.attempts('family-a'))[0],status:'scored',submittedAt:2};
  await academic.finish('family-a',finished);
  assert.equal((await academic.attempts('family-a'))[0].status,'scored');

  await assert.rejects(
    ()=>academic.saveDraft('family-a',attempt.id,{audio:{type:'audio/webm',data:'AAAA'}}),
    /IndexedDB/
  );

  const factory=browserLocalRepositories('family-c','primary',storage);
  assert.equal(factory.scope.ownerId,'family-c');
  assert.ok(factory.learning&&factory.academic);

  console.log('github-first browser storage: PASS');
})().catch(error=>{console.error(error);process.exit(1)});
