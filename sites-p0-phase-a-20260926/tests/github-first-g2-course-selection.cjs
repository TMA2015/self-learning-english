'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','github-first-g2-course');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/browser/local-runtime.ts',
  'infrastructure/storage/browser-local-repositories.ts',
  'domain/course-p1.ts',
  '--outDir','.sites-runtime/github-first-g2-course',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(key){return this.map.has(key)?this.map.get(key):null}
  setItem(key,value){this.map.set(key,String(value))}
  removeItem(key){this.map.delete(key)}
}
const storage=new MemoryStorage();
global.window={localStorage:storage,location:{origin:'https://example.test'}};

(async()=>{
  const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));
  const {WRITING_COURSE_ID}=require(path.join(out,'domain/course-p1.js'));
  const {service}=await runtime.localLearningRuntime();
  await service.saveState({week:0,stage:0,completed:[0],writing:'Draft survives course selection'});

  const courses=await runtime.localCourseRuntime();
  let data=await courses.load();
  assert.equal(data.activeCourseId,null);
  assert.equal(data.selectionRevision,0);
  assert.equal(data.courses[0].id,WRITING_COURSE_ID);

  const first=await courses.select(WRITING_COURSE_ID,0,'request_0001');
  assert.equal(first.revision,1);
  assert.equal(first.activeCourseId,WRITING_COURSE_ID);
  assert.deepEqual(await courses.select(WRITING_COURSE_ID,0,'request_0001'),first,'same request must be idempotent');
  await assert.rejects(()=>courses.select(null,0,'request_0002'),/Course selection changed/);

  data=await courses.load();
  assert.equal(data.activeCourseId,WRITING_COURSE_ID);
  assert.equal(data.selectionRevision,1);

  // Broad learner-state autosave cannot overwrite the isolated course key.
  const previous=await service.readState();
  await service.saveState({...previous,writing:'New autosaved draft'});
  const afterAutosave=await courses.load();
  assert.equal(afterAutosave.activeCourseId,WRITING_COURSE_ID);
  assert.equal(afterAutosave.selectionRevision,1);
  assert.equal((await service.readState()).writing,'New autosaved draft');

  const cleared=await courses.select(null,1,'request_0003');
  assert.equal(cleared.revision,2);
  assert.equal((await courses.load()).activeCourseId,null);

  // Browser recreation over the same localStorage keeps the selection.
  const coursesAgain=await runtime.localCourseRuntime();
  assert.equal((await coursesAgain.load()).selectionRevision,2);

  const routePage=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
  const page=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
  assert(routePage.includes('<HomeClient/>'),'root route must delegate interactive UI to HomeClient');
  const clients=fs.readFileSync(path.join(root,'infrastructure/browser/client-services.ts'),'utf8');
  assert(!page.includes("fetch('/api/course'"),'page must not directly depend on /api/course');
  assert(page.includes('loadMyCourses()')&&page.includes('selectMyCourse('));
  assert(clients.includes("if(!browserLearningEnabled())return jsonFetch<ReturnType<typeof myCourses>>('/api/course')"),'Sites path must remain available');
  assert(clients.includes('const runtime=await localCourseRuntime()'),'browser mode must use local course runtime');

  console.log(JSON.stringify({
    result:'PASS',
    browserCourseSelection:true,
    isolatedFromLearnerAutosave:true,
    idempotentRequest:true,
    staleRevisionBlocked:true,
    survivesRuntimeRecreation:true,
    directPageApiDependency:false,
    sitesFallbackPreserved:true
  }));
})().catch(error=>{console.error(error);process.exit(1)});
