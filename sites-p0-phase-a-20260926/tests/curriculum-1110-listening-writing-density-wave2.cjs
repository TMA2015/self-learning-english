'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.10.0-candidate.json';
const batchPath='content/batches/listening-writing-density-wave2.json';
const candidatePath='content/curriculum-1.11.0-candidate.json';
const reviewPath='content/reviews/EN-LIS-WRI-DENSITY-W2-20261004-academic-review-v1.0.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-1110-listening-writing',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-1110-listening-writing/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-1110-listening-writing/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-1110-listening-writing/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-1110-listening-writing/application/academic-service.js');
const base=require('../'+basePath),batch=require('../'+batchPath),candidate=require('../'+candidatePath),review=require('../'+reviewPath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(review.final_verdict,'PASS');
assert.equal(review.new_runtime_tags.length,0);
assert.equal(base.schema_version,'1.10.0');
assert.equal(candidate.schema_version,'1.11.0');
assert.equal(base.lessons.length,74);
assert.equal(candidate.lessons.length,78);
assert.equal(base.lessons.flatMap(l=>l.activities).length,649);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,689);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='listening').length,5);
assert.equal(candidate.lessons.filter(l=>l.module==='writing').length,9);
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.10.0 lesson changed: '+old.id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

for(const lesson of batch.lessons.filter(l=>l.module==='listening')){
  assert.equal(lesson.audio_asset.requires_real_playback,true);
  assert.equal(lesson.audio_asset.transcript_reveal,'after_submission');
  assert(/no listening score|mark listening unassessed/i.test(lesson.audio_asset.fallback));
}
const wri=batch.lessons.find(l=>l.id==='WRI-B1-02');
const ext=wri.activities.find(q=>q.type==='extended_response');
assert(ext);
assert.equal(ext.evidence_weight,0);
assert.equal(ext.review_mode,'assisted_ai_or_human');

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
 assert.deepEqual(preview.counts,{add:4,update:0,skip:74,conflict:0});
 const text=fs.readFileSync(candidatePath,'utf8');
 const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
 assert.equal(preview.digest,canonicalSha256);
 assert.equal(rawSha256,'26a742adf8748b589b3ad864721fda14d597e73fb2cca6ac20bf7fb608527b62');
 assert.equal(canonicalSha256,'1777cbc8d4657aaf19b1ac1fcd1da3aa8797d4ff13122278cbfb8489d7a4bba2');
 console.log(JSON.stringify({
   result:'PASS',version:'1.11.0',lessons:78,activities:689,
   grammarLessons:40,listeningLessons:5,writingLessons:9,
   preservedBase:{version:'1.10.0',lessons:74,activities:649},
   newContent:{lessons:4,activities:40},
   preview:preview.counts,bytes:Buffer.byteLength(text,'utf8'),
   rawSha256,canonicalSha256,
   academicReview:'PASS',
   listeningRequiresRealPlayback:true,
   transcriptOnlyListeningCredit:false,
   writingExtendedResponseEvidenceWeight:0,
   newRuntimeTags:0,
   importAuthorized:false,deployAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
