'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.6.1-candidate.json';
const batchPath='content/batches/grammar-b1-wave2a.json';
const candidatePath='content/curriculum-1.7.0-candidate.json';
const reviewPath='content/reviews/EN-GRA-B1-W2A-20261004-academic-review-v1.0.json';
const adaptivePath='content/adaptive-map-v1.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});
execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc',
  'domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts',
  '--outDir','.sites-runtime/curriculum-170-b1-wave2a',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.mkdirSync('.sites-runtime/curriculum-170-b1-wave2a',{recursive:true});
fs.writeFileSync('.sites-runtime/curriculum-170-b1-wave2a/package.json','{"type":"commonjs"}\n');

const {validateSeed,mapSeed,tagMap}=require('../.sites-runtime/curriculum-170-b1-wave2a/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-170-b1-wave2a/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-170-b1-wave2a/application/academic-service.js');

const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=require('../'+candidatePath);
const review=require('../'+reviewPath);
const adaptive=require('../'+adaptivePath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(review.final_verdict,'PASS');
assert.equal(review.packet_id,'EN-GRA-B1-W2A-20261004');
assert.equal(review.scope.lessons,4);
assert.equal(review.scope.activities,40);
assert.equal(review.release_boundary.import_authorized,false);
assert.equal(review.release_boundary.deploy_authorized,false);

assert.equal(base.schema_version,'1.6.1');
assert.equal(candidate.schema_version,'1.7.0');
assert.equal(base.lessons.length,59);
assert.equal(candidate.lessons.length,63);
assert.equal(base.lessons.flatMap(l=>l.activities).length,499);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,539);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,33);
assert.equal(batch.lessons.length,4);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,40);

assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const oldBy=new Map(base.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of oldBy){
  assert.deepEqual(candidate.lessons.find(l=>l.id===id),lesson,'1.6.1 lesson changed: '+id);
}
const oldActivityIds=base.lessons.flatMap(l=>l.activities.map(q=>q.id));
const preservedActivityIds=candidate.lessons.filter(l=>oldBy.has(l.id)).flatMap(l=>l.activities.map(q=>q.id));
assert.deepEqual(preservedActivityIds,oldActivityIds,'historical activity IDs/order changed');

for(const lesson of batch.lessons){
  assert.deepEqual(candidate.lessons.find(l=>l.id===lesson.id),lesson,'new lesson differs from reviewed batch: '+lesson.id);
}
const grammarSeq=candidate.course.sequence.filter(id=>id.startsWith('GRA-'));
const at=grammarSeq.indexOf('GRA-B1-01');
assert.deepEqual(grammarSeq.slice(at,at+5),['GRA-B1-01','GRA-B1-02','GRA-B1-03','GRA-B1-04','GRA-B1-05']);

const approvedTags={
  'grammar.present_perfect_continuous':'tense-and-aspect',
  'grammar.past_perfect':'tense-and-aspect',
  'grammar.narrative_order':'tense-and-aspect',
  'grammar.used_to':'tense-and-aspect',
  'grammar.would_past_habit':'tense-and-aspect',
  'grammar.modal_deduction':'modal-deduction'
};
for(const [tag,mapped] of Object.entries(approvedTags))assert.equal(tagMap[tag],mapped);

const conceptIds=new Set(adaptive.concepts.map(x=>x.id));
for(const id of ['present-perfect-continuous','past-perfect','narrative-order','used-to','would-past-habit','modal-deduction'])assert(conceptIds.has(id),'adaptive concept missing: '+id);

const byId=new Map(candidate.lessons.flatMap(l=>l.activities).map(q=>[q.id,q]));
assert.deepEqual(byId.get('GRA-B1-02-Q5').answer.accepted_answers,['has been working',"'s been working",'’s been working']);
assert.equal(byId.get('GRA-B1-02-Q7').prompt,'Write the missing words: How long ___ English? (you / learn)');
assert.deepEqual(byId.get('GRA-B1-02-Q7').answer.accepted_answers,['have you been learning']);
assert.deepEqual(byId.get('GRA-B1-02-Q9').answer.accepted_answers,['have been waiting',"'ve been waiting",'’ve been waiting']);
assert.deepEqual(byId.get('GRA-B1-03-Q3').answer.accepted_answers,['had left',"'d left",'’d left']);
assert.equal(byId.get('GRA-B1-03-Q8').prompt,'Complete the sentence: She ___ snow before she visited Korea. (never / see)');
assert.deepEqual(byId.get('GRA-B1-03-Q8').answer.accepted_answers,['had never seen',"'d never seen",'’d never seen']);

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
 assert.deepEqual(preview.counts,{add:4,update:0,skip:59,conflict:0});

 const text=fs.readFileSync(candidatePath,'utf8');
 const rawSha256=sha(text);
 const canonicalSha256=canonicalHash(candidate);
 assert.equal(preview.digest,canonicalSha256);

 console.log(JSON.stringify({
   result:'PASS',
   version:'1.7.0',
   lessons:63,
   activities:539,
   grammarLessons:33,
   preservedBase:{version:'1.6.1',lessons:59,activities:499},
   newContent:{lessons:4,activities:40},
   preview:preview.counts,
   bytes:Buffer.byteLength(text,'utf8'),
   rawSha256,
   canonicalSha256,
   academicReview:'PASS',
   importAuthorized:false,
   deployAuthorized:false
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
