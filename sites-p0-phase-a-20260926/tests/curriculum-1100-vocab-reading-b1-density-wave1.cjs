'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.9.0-candidate.json';
const batchPath='content/batches/vocab-reading-b1-density-wave1.json';
const candidatePath='content/curriculum-1.10.0-candidate.json';
const reviewPath='content/reviews/EN-VOC-REA-B1-DENSITY-W1-20261004-academic-review-v1.0.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-1100-density-wave1',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-1100-density-wave1/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-1100-density-wave1/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-1100-density-wave1/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-1100-density-wave1/application/academic-service.js');
const base=require('../'+basePath),batch=require('../'+batchPath),candidate=require('../'+candidatePath),review=require('../'+reviewPath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(review.final_verdict,'PASS');
assert.equal(review.new_runtime_tags.length,0);
assert.equal(base.schema_version,'1.9.0');
assert.equal(candidate.schema_version,'1.10.0');
assert.equal(base.lessons.length,70);
assert.equal(candidate.lessons.length,74);
assert.equal(base.lessons.flatMap(l=>l.activities).length,609);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,649);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='vocabulary').length,10);
assert.equal(candidate.lessons.filter(l=>l.module==='reading').length,11);
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const oldBy=new Map(base.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of oldBy)assert.deepEqual(candidate.lessons.find(l=>l.id===id),lesson,'1.9.0 lesson changed: '+id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

const newActivities=batch.lessons.flatMap(l=>l.activities);
const count=tag=>newActivities.filter(q=>q.skill_tags.includes(tag)).length;
assert.equal(count('vocabulary.word_formation'),9);
assert.equal(count('reading.detail'),9);
assert.equal(count('reading.vocabulary_in_context'),4);

class Repo{
 constructor(){this.p=[]}
 async packages(){return JSON.parse(JSON.stringify(this.p))}
 async addPackage(v){const same=this.p.find(x=>x.version===v.version);if(same){assert.equal(same.digest,v.digest);return}this.p.push(JSON.parse(JSON.stringify(v)))}
 async attempts(){return []}
 async start(){}
 async saveDraft(){}
 async finish(v){return v}
 async approve(v){return v}
}
(async()=>{
 const repo=new Repo(),service=academicService(repo,{},'candidate-check');
 let preview=await service.preview(base);
 assert.deepEqual(preview.errors,[]);
 await service.importPackage(base,preview.token,true);
 preview=await service.preview(candidate);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:4,update:0,skip:70,conflict:0});
 const text=fs.readFileSync(candidatePath,'utf8');
 const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
 assert.equal(preview.digest,canonicalSha256);
 console.log(JSON.stringify({
   result:'PASS',version:'1.10.0',lessons:74,activities:649,
   grammarLessons:40,vocabularyLessons:10,readingLessons:11,
   preservedBase:{version:'1.9.0',lessons:70,activities:609},
   newContent:{lessons:4,activities:40},
   densityGain:{wordFormation:9,readingDetail:9,readingVocabularyInContext:4},
   preview:preview.counts,bytes:Buffer.byteLength(text,'utf8'),rawSha256,canonicalSha256,
   academicReview:'PASS',newRuntimeTags:0,importAuthorized:false,deployAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
