'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.13.0-candidate.json';
const batchPath='content/batches/speaking-pronunciation-density-wave5.json';
const candidatePath='content/curriculum-1.14.0-candidate.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-1140-density-wave5',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-1140-density-wave5/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-1140-density-wave5/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-1140-density-wave5/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-1140-density-wave5/application/academic-service.js');

const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=require('../'+candidatePath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));


assert.equal(base.schema_version,'1.13.0');
assert.equal(candidate.schema_version,'1.14.0');
assert.equal(base.lessons.length,90);
assert.equal(candidate.lessons.length,94);
assert.equal(base.lessons.flatMap(l=>l.activities).length,779);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,802);

assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='vocabulary').length,12);
assert.equal(candidate.lessons.filter(l=>l.module==='reading').length,13);
assert.equal(candidate.lessons.filter(l=>l.module==='writing').length,11);
assert.equal(candidate.lessons.filter(l=>l.module==='listening').length,7);
assert.equal(candidate.lessons.filter(l=>l.module==='speaking').length,6);
assert.equal(candidate.lessons.filter(l=>l.module==='pronunciation').length,5);

assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.13.0 lesson changed: '+old.id);
for(const lesson of batch.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);

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


assert.equal(batch.status,'academic_pass_audio_pass_candidate_only_no_import');
assert.equal(new Set(candidate.lessons.map(l=>l.id)).size,94);
assert.equal(new Set(candidate.lessons.flatMap(l=>l.activities.map(q=>q.id))).size,802);
assert.deepEqual(candidate.course.sequence.filter(id=>base.lessons.some(l=>l.id===id)),base.course.sequence);
const oldTags=new Set(base.lessons.flatMap(l=>l.activities.flatMap(q=>q.skill_tags??[])));
for(const l of batch.lessons)for(const q of l.activities)for(const tag of q.skill_tags??[])assert(oldTags.has(tag),'New runtime tag '+tag);
execFileSync(process.execPath,['tests/content-density-wave5-draft.cjs'],{stdio:'inherit'});
execFileSync(process.execPath,['tests/pronunciation-audio-wave5.cjs'],{stdio:'inherit'});

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
  const before=JSON.stringify(repo.p);
  preview=await service.preview(candidate);
  assert.equal(JSON.stringify(repo.p),before,'Preview must not write');
  assert.deepEqual(preview.errors,[]);
  assert.deepEqual(preview.counts,{add:4,update:0,skip:90,conflict:0});

  assert.deepEqual(preview.rows.filter(r=>r.action==='add').map(r=>r.id).sort(),batch.lessons.map(l=>l.id).sort());
  assert.deepEqual(preview.rows.filter(r=>r.action==='skip').map(r=>r.id).sort(),base.lessons.map(l=>l.id).sort());
  const text=fs.readFileSync(candidatePath,'utf8');
  const rawSha256=sha(text),canonicalSha256=canonicalHash(candidate);
  assert.equal(preview.digest,canonicalSha256);

  console.log(JSON.stringify({
    result:'PASS',
    version:'1.14.0',
    lessons:94,
    activities:802,
    grammarLessons:40,
    vocabularyLessons:12,
    readingLessons:13,
    writingLessons:11,
    listeningLessons:7,
    speakingLessons:6,
    pronunciationLessons:5,
    preservedBase:{version:'1.13.0',lessons:90,activities:779},
    newContent:{lessons:4,activities:23},
    academicReview:'PASS',
    ownerAudioQA:'PASS',
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
