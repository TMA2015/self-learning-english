'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.resolve(__dirname,'..');
const runtime=path.join(root,'.sites-runtime','capacity-150');
fs.mkdirSync(runtime,{recursive:true});

const live=require('../content/curriculum-1.6.1-candidate.json');
assert.equal(live.lessons.length,59);
assert.equal(live.lessons.flatMap(l=>l.activities).length,499);

const template=live.lessons.find(l=>l.id==='GRA-A1-01');
assert(template&&template.activities.length>0);
const newLessons=[];
for(let n=17;n<=107;n++){
  const id='GRA-B2-'+String(n);
  const lesson=JSON.parse(JSON.stringify(template));
  lesson.id=id;
  lesson.cefr_target='B2';
  lesson.title='Capacity stress lesson '+n;
  lesson.objectives=lesson.objectives.map((x,i)=>'Capacity stress objective '+n+'.'+(i+1)+': '+x);
  lesson.activities=lesson.activities.map((q,i)=>({...q,id:id+'-Q'+(i+1)}));
  newLessons.push(lesson);
}
assert.equal(newLessons.length,91);
assert.equal(newLessons.at(-1).id,'GRA-B2-107');

const batch={
  format:'ai-english-tutor.curriculum-batch',
  schema_version:1,
  batch_id:'CAPACITY-150-STRESS-ONLY',
  base_version:'1.6.1',
  target_version:'9.9.9',
  status:'TEST_ONLY_NEVER_IMPORT',
  metadata:{
    status:'TEST_ONLY_NEVER_IMPORT',
    course_title:live.course.title,
    course_description:live.course.description,
    curriculum_principle:live.curriculum_outline.principle
  },
  insert_after:[{after:live.course.sequence.at(-1),ids:newLessons.map(l=>l.id)}],
  lessons:newLessons
};
const batchPath=path.join(runtime,'batch.json');
const outPath=path.join(runtime,'candidate.json');
fs.writeFileSync(batchPath,JSON.stringify(batch,null,2)+'\n');

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',path.relative(root,path.join(root,'content/curriculum-1.6.1-candidate.json')),path.relative(root,batchPath),path.relative(root,outPath)],{cwd:root,stdio:'inherit'});
const candidate=JSON.parse(fs.readFileSync(outPath,'utf8'));
const bytes=fs.statSync(outPath).size;
assert.equal(candidate.lessons.length,150);
assert.equal(candidate.course.sequence.length,150);
assert.equal(new Set(candidate.course.sequence).size,150);
assert(bytes>1_000_000,'stress package must prove the old 1 MB ceiling is exceeded');
assert(bytes<=5_000_000,'stress package must fit the new 5 MB package ceiling');

execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts','--outDir','.sites-runtime/capacity-150-js','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.mkdirSync(path.join(root,'.sites-runtime/capacity-150-js'),{recursive:true});
fs.writeFileSync(path.join(root,'.sites-runtime/capacity-150-js/package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}=require('../.sites-runtime/capacity-150-js/domain/academic.js');
const {validateContent}=require('../.sites-runtime/capacity-150-js/domain/content-model.js');
const {academicService}=require('../.sites-runtime/capacity-150-js/application/academic-service.js');

// This legacy regression still imports exactly 150 lessons; the separate
// capacity preflight exercises 151, 200, 250 and rejects 251.
assert.equal(MAX_CURRICULUM_LESSONS,250,'Bounded importer cap must be 250 on this QA branch');
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

class Repo{
 constructor(){this.p=[]}
 async packages(){return JSON.parse(JSON.stringify(this.p))}
 async addPackage(v){this.p.push(JSON.parse(JSON.stringify(v)))}
 async attempts(){return []}
 async start(){}
 async saveDraft(){}
 async finish(v){return v}
 async approve(v){return v}
}
(async()=>{
  const repo=new Repo(),service=academicService(repo,{},'capacity-test');
  let p=await service.preview(live);
  assert.deepEqual(p.errors,[]);
  await service.importPackage(live,p.token,true);
  const started=Date.now();
  p=await service.preview(candidate);
  const previewMs=Date.now()-started;
  assert.deepEqual(p.errors,[]);
  assert.deepEqual(p.counts,{add:91,update:0,skip:59,conflict:0});
  await service.importPackage(candidate,p.token,true);
  const catalog=await service.catalog();
  assert.equal(catalog.lessons.length,150);
  const high=await service.lesson('GRA-B2-107');
  assert.equal(high.lesson.id,'GRA-B2-107');

  const route=fs.readFileSync(path.join(root,'app/api/admin/content-import/route.ts'),'utf8');
  const ui=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
  assert(route.includes('MAX_IMPORT_REQUEST_CHARS=6_000_000'));
  assert(route.includes('smaller than 6 MB'));
  assert(ui.includes('f.size>5000000'));
  assert(ui.includes('smaller than 5 MB'));

  console.log(JSON.stringify({
    result:'PASS',
    lessons:candidate.lessons.length,
    activities:candidate.lessons.flatMap(l=>l.activities).length,
    bytes,
    exceedsOld1MB:bytes>1_000_000,
    maxLessons:MAX_CURRICULUM_LESSONS,
    highestThreeDigitLesson:'GRA-B2-107',
    preview:p.counts,
    previewMs,
    catalogLessons:catalog.lessons.length
  }));
})().catch(e=>{console.error(e);process.exitCode=1});
