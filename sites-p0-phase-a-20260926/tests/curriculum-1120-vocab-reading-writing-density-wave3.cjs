'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.11.0-candidate.json';
const batchPath='content/batches/vocab-reading-writing-density-wave3.json';
const batchAPath='content/batches/vocab-reading-density-wave3a.json';
const batchBPath='content/batches/reading-writing-density-wave3b.json';
const candidatePath='content/curriculum-1.12.0-candidate.json';
const reviewAPath='content/reviews/EN-VOC-REA-DENSITY-W3A-20261005-academic-review-v1.0.json';
const reviewBPath='content/reviews/EN-REA-WRI-DENSITY-W3B-20261005-academic-review-v1.0.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-1120-density-wave3',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-1120-density-wave3/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-1120-density-wave3/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-1120-density-wave3/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-1120-density-wave3/application/academic-service.js');
const base=require('../'+basePath),batch=require('../'+batchPath),batchA=require('../'+batchAPath),batchB=require('../'+batchBPath),candidate=require('../'+candidatePath),reviewA=require('../'+reviewAPath),reviewB=require('../'+reviewBPath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(reviewA.final_verdict,'PASS');
assert.equal(reviewB.final_verdict,'PASS');
assert.equal(reviewA.new_runtime_tags.length,0);
assert.equal(reviewB.new_runtime_tags.length,0);
assert.equal(base.schema_version,'1.11.0');
assert.equal(candidate.schema_version,'1.12.0');
assert.equal(base.lessons.length,78);
assert.equal(candidate.lessons.length,84);
assert.equal(base.lessons.flatMap(l=>l.activities).length,689);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,739);

assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='vocabulary').length,12);
assert.equal(candidate.lessons.filter(l=>l.module==='reading').length,13);
assert.equal(candidate.lessons.filter(l=>l.module==='writing').length,11);
assert.equal(candidate.lessons.filter(l=>l.module==='listening').length,5);
assert.equal(candidate.lessons.filter(l=>l.module==='speaking').length,2);
assert.equal(candidate.lessons.filter(l=>l.module==='pronunciation').length,1);

assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.11.0 lesson changed: '+old.id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

const split=new Map([...batchA.lessons,...batchB.lessons].map(l=>[l.id,l]));
assert.equal(split.size,6);
for(const lesson of batch.lessons)assert.deepEqual(lesson,split.get(lesson.id),'combined batch differs from independently reviewed split packet: '+lesson.id);

for(const lesson of batch.lessons.filter(l=>l.module==='writing')){
  const extended=lesson.activities.filter(q=>q.type==='extended_response');
  assert(extended.length>0,'Writing lesson needs extended response '+lesson.id);
  for(const q of extended){
    assert.equal(q.answer,null);
    assert.equal(q.evidence_weight,0);
    assert.equal(q.review_mode,'assisted_ai_or_human');
  }
}

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
 assert.deepEqual(preview.counts,{add:6,update:0,skip:78,conflict:0});
 const text=fs.readFileSync(candidatePath,'utf8');
 const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
 assert.equal(preview.digest,canonicalSha256);
 console.log(JSON.stringify({
   result:'PASS',version:'1.12.0',lessons:84,activities:739,
   grammarLessons:40,vocabularyLessons:12,readingLessons:13,writingLessons:11,
   listeningLessons:5,speakingLessons:2,pronunciationLessons:1,
   preservedBase:{version:'1.11.0',lessons:78,activities:689},
   newContent:{lessons:6,activities:50},
   academicReviews:{wave3A:'PASS',wave3B:'PASS'},
   preview:preview.counts,bytes:Buffer.byteLength(text,'utf8'),
   rawSha256,canonicalSha256,
   writingExtendedResponseEvidenceWeight:0,
   newRuntimeTags:0,
   importAuthorized:false,deployAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
