'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/releases/curriculum-1.5.0-production-import.json';
const batchPath='content/batches/grammar-a1-a2-milestone.json';
const candidatePath='content/curriculum-1.6.0-candidate.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});

execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts','--outDir','.sites-runtime/curriculum-160-a1a2','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.mkdirSync('.sites-runtime/curriculum-160-a1a2',{recursive:true});
fs.writeFileSync('.sites-runtime/curriculum-160-a1a2/package.json','{"type":"commonjs"}');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-160-a1a2/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-160-a1a2/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-160-a1a2/application/academic-service.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=require('../'+candidatePath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(canonicalHash(base),'c4bef52f57238497b9c0529d94ef93736d266e1feaf1329a3c5b4d813848bcc1','verified 1.5.0 base must match imported production package');
assert.equal(candidate.schema_version,'1.6.0');
assert.equal(candidate.lessons.length,59);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,499);
assert.equal(batch.base_version,'1.5.0');
assert.equal(batch.target_version,'1.6.0');
assert.equal(batch.lessons.length,14);
assert.equal(batch.lessons.reduce((n,l)=>n+l.activities.length,0),140);

const expectedNew=[
 'GRA-A1-09','GRA-A1-10','GRA-A1-11','GRA-A1-12',
 'GRA-A2-07','GRA-A2-08','GRA-A2-09','GRA-A2-10','GRA-A2-11','GRA-A2-12','GRA-A2-13','GRA-A2-14','GRA-A2-15','GRA-A2-16'
];
assert.deepEqual(batch.lessons.map(l=>l.id),expectedNew);
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const oldBy=new Map(base.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of oldBy)assert.deepEqual(candidate.lessons.find(l=>l.id===id),lesson,'existing lesson changed: '+id);
const oldActivityIds=base.lessons.flatMap(l=>l.activities.map(q=>q.id));
const preservedActivityIds=candidate.lessons.filter(l=>oldBy.has(l.id)).flatMap(l=>l.activities.map(q=>q.id));
assert.deepEqual(preservedActivityIds,oldActivityIds,'existing activity IDs/order changed');

for(const id of expectedNew){
 const lesson=candidate.lessons.find(l=>l.id===id);
 assert.ok(lesson,id+' missing');
 assert.equal(Object.hasOwn(lesson,'prerequisite_lesson_ids'),false,'planning-only prerequisite metadata must not enter importer package');
 assert.equal(Object.hasOwn(lesson,'adaptive_concepts'),false,'planning-only adaptive metadata must not enter importer package');
 assert.equal(lesson.activities.length,10,id+' must have 10 activities');
}

const grammarSeq=candidate.course.sequence.filter(id=>id.startsWith('GRA-'));
assert.deepEqual(grammarSeq,[
 'GRA-A1-01','GRA-A1-02','GRA-A1-03','GRA-A1-04','GRA-A1-05','GRA-A1-06','GRA-A1-07','GRA-A1-08','GRA-A1-09','GRA-A1-10','GRA-A1-11','GRA-A1-12',
 'GRA-A2-07','GRA-A2-01','GRA-A2-02','GRA-A2-08','GRA-A2-09','GRA-A2-10','GRA-A2-03','GRA-A2-04','GRA-A2-05','GRA-A2-11','GRA-A2-06','GRA-A2-12','GRA-A2-13','GRA-A2-14','GRA-A2-15','GRA-A2-16',
 'GRA-B1-01'
]);

const text=fs.readFileSync(candidatePath,'utf8');
assert(Buffer.byteLength(text,'utf8')<=1000000,'candidate exceeds current 1 MB composer guard');
const rawSha256=sha(text);
const canonicalSha256=canonicalHash(candidate);

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
 assert.deepEqual(preview.counts,{add:14,update:0,skip:45,conflict:0});
 assert.equal(preview.digest,canonicalSha256);
 console.log(JSON.stringify({
   result:'PASS',
   version:'1.6.0',
   lessons:59,
   activities:499,
   grammarLessons:29,
   preview:preview.counts,
   basePreserved:{lessons:45,activities:359},
   newContent:{lessons:14,activities:140},
   bytes:Buffer.byteLength(text,'utf8'),
   rawSha256,
   canonicalSha256
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
