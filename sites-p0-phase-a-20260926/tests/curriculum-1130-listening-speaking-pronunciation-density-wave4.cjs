'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.12.0-candidate.json';
const batchPath='content/batches/listening-speaking-pronunciation-density-wave4.json';
const batchAPath='content/batches/listening-speaking-density-wave4a.json';
const batchBPath='content/batches/pronunciation-density-wave4b.json';
const candidatePath='content/curriculum-1.13.0-candidate.json';
const reviewAPath='content/reviews/EN-LIS-SPE-DENSITY-W4A-20261005-academic-review-v1.0.json';
const reviewBPath='content/reviews/EN-PRO-DENSITY-W4B-20261005-academic-review-v1.0.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-1130-density-wave4',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-1130-density-wave4/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-1130-density-wave4/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-1130-density-wave4/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-1130-density-wave4/application/academic-service.js');

const base=require('../'+basePath);
const batch=require('../'+batchPath);
const batchA=require('../'+batchAPath);
const batchB=require('../'+batchBPath);
const candidate=require('../'+candidatePath);
const reviewA=require('../'+reviewAPath);
const reviewB=require('../'+reviewBPath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(reviewA.final_verdict,'PASS');
assert.equal(reviewB.final_verdict,'PASS');
assert.equal(reviewA.new_runtime_tags.length,0);
assert.equal(reviewB.new_runtime_tags.length,0);

assert.equal(base.schema_version,'1.12.0');
assert.equal(candidate.schema_version,'1.13.0');
assert.equal(base.lessons.length,84);
assert.equal(candidate.lessons.length,90);
assert.equal(base.lessons.flatMap(l=>l.activities).length,739);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,779);

assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='vocabulary').length,12);
assert.equal(candidate.lessons.filter(l=>l.module==='reading').length,13);
assert.equal(candidate.lessons.filter(l=>l.module==='writing').length,11);
assert.equal(candidate.lessons.filter(l=>l.module==='listening').length,7);
assert.equal(candidate.lessons.filter(l=>l.module==='speaking').length,4);
assert.equal(candidate.lessons.filter(l=>l.module==='pronunciation').length,3);

assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.12.0 lesson changed: '+old.id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

const split=new Map([...batchA.lessons,...batchB.lessons].map(l=>[l.id,l]));
assert.equal(split.size,6);
for(const lesson of batch.lessons)assert.deepEqual(lesson,split.get(lesson.id),'combined batch differs from independently reviewed split packet: '+lesson.id);

for(const lesson of batch.lessons.filter(l=>l.module==='listening')){
  assert.equal(lesson.audio_asset?.requires_real_playback,true);
  assert.equal(lesson.audio_asset?.transcript_reveal,'after_submission');
}
for(const lesson of batch.lessons.filter(l=>l.module==='speaking')){
  assert.equal(lesson.recording?.requires_permission,true);
  assert.equal(lesson.recording?.no_auto_pronunciation_score,true);
}
for(const lesson of batch.lessons.filter(l=>l.module==='pronunciation')){
  assert.equal(lesson.audio_model?.requires_real_playback,true);
}
for(const lesson of batch.lessons){
  for(const q of lesson.activities.filter(q=>q.type==='extended_response')){
    assert.equal(q.answer,null);
    assert.equal(q.evidence_weight,0);
    assert.equal(q.review_mode,'assisted_ai_or_human');
    assert(candidate.rubrics[q.rubric_id],'missing rubric '+q.rubric_id);
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
  assert.deepEqual(preview.counts,{add:6,update:0,skip:84,conflict:0});

  const text=fs.readFileSync(candidatePath,'utf8');
  const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
  assert.equal(preview.digest,canonicalSha256);

  console.log(JSON.stringify({
    result:'PASS',
    version:'1.13.0',
    lessons:90,
    activities:779,
    grammarLessons:40,
    vocabularyLessons:12,
    readingLessons:13,
    writingLessons:11,
    listeningLessons:7,
    speakingLessons:4,
    pronunciationLessons:3,
    preservedBase:{version:'1.12.0',lessons:84,activities:739},
    newContent:{lessons:6,activities:40},
    academicReviews:{wave4A:'PASS',wave4B:'PASS'},
    preview:preview.counts,
    bytes:Buffer.byteLength(text,'utf8'),
    rawSha256,
    canonicalSha256,
    audioSafeguards:true,
    extendedResponseEvidenceWeight:0,
    newRuntimeTags:0,
    importAuthorized:false,
    deployAuthorized:false
  }));
})().catch(e=>{console.error(e);process.exitCode=1});
