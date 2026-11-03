'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.8.0-candidate.json';
const batchPath='content/batches/grammar-b1-wave2c.json';
const candidatePath='content/curriculum-1.9.0-candidate.json';
const reviewPath='content/reviews/EN-GRA-B1-W2C-20261004-academic-review-v1.0.json';
const adaptivePath='content/adaptive-map-v1.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-190-b1-wave2c',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-190-b1-wave2c/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed,tagMap}=require('../.sites-runtime/curriculum-190-b1-wave2c/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-190-b1-wave2c/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-190-b1-wave2c/application/academic-service.js');
const base=require('../'+basePath),batch=require('../'+batchPath),candidate=require('../'+candidatePath),review=require('../'+reviewPath),adaptive=require('../'+adaptivePath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(review.final_verdict,'PASS');
assert.equal(candidate.schema_version,'1.9.0');
assert.equal(base.lessons.length,67);
assert.equal(candidate.lessons.length,70);
assert.equal(base.lessons.flatMap(l=>l.activities).length,579);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,609);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const oldBy=new Map(base.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of oldBy)assert.deepEqual(candidate.lessons.find(l=>l.id===id),lesson,'1.8.0 lesson changed: '+id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

const approved={
  'grammar.non_defining_relative_clauses':'non-defining-relative-clauses',
  'grammar.gerund_infinitive':'gerund-infinitive',
  'grammar.indirect_questions':'indirect-questions',
  'grammar.question_tags':'question-tags'
};
for(const [tag,mapped] of Object.entries(approved))assert.equal(tagMap[tag],mapped);
const conceptIds=new Set(adaptive.concepts.map(x=>x.id));
for(const id of ['non-defining-relative-clauses','gerund-infinitive','indirect-questions','question-tags'])assert(conceptIds.has(id),'adaptive concept missing: '+id);

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
 assert.deepEqual(preview.counts,{add:3,update:0,skip:67,conflict:0});
 const text=fs.readFileSync(candidatePath,'utf8');
 const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
 assert.equal(preview.digest,canonicalSha256);
 assert.equal(rawSha256,'46f7e361925aae3494066bfe0ecd9e382e3a42ff2109bc2016432123aa6fc097');
 assert.equal(canonicalSha256,'1a7cae7a63ef2303e41a98f4715a1bb66aa818e61a5b489f364f98f878770d63');
 console.log(JSON.stringify({
   result:'PASS',version:'1.9.0',lessons:70,activities:609,grammarLessons:40,
   preservedBase:{version:'1.8.0',lessons:67,activities:579},
   newContent:{lessons:3,activities:30},
   preview:preview.counts,bytes:Buffer.byteLength(text,'utf8'),rawSha256,canonicalSha256,
   grammarRoadmapComplete:true,academicReview:'PASS',importAuthorized:false,deployAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
