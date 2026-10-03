'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const basePath='content/releases/curriculum-1.5.0-production-import.json';
const batchPath='content/batches/grammar-wave1a.json';
const candidatePath='content/curriculum-1.6.0-candidate.json';

execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--check',basePath,batchPath,candidatePath],{stdio:'inherit'});

execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts','--outDir','.sites-runtime/curriculum-160','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.mkdirSync('.sites-runtime/curriculum-160',{recursive:true});
fs.writeFileSync('.sites-runtime/curriculum-160/package.json','{"type":"commonjs"}');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-160/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-160/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-160/application/academic-service.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=require('../'+candidatePath);

const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(canonicalHash(base),'c4bef52f57238497b9c0529d94ef93736d266e1feaf1329a3c5b4d813848bcc1','verified 1.5.0 base must match imported production package');
assert.equal(candidate.schema_version,'1.6.0');
assert.equal(candidate.lessons.length,47);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,379);
assert.equal(batch.base_version,'1.5.0');
assert.equal(batch.target_version,'1.6.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['GRA-A2-07','GRA-A2-09']);
assert.deepEqual(batch.lessons.map(l=>l.activities.length),[10,10]);

assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const oldBy=new Map(base.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of oldBy)assert.deepEqual(candidate.lessons.find(l=>l.id===id),lesson,'existing lesson changed: '+id);
const oldActivityIds=base.lessons.flatMap(l=>l.activities.map(q=>q.id));
const preservedActivityIds=candidate.lessons.filter(l=>oldBy.has(l.id)).flatMap(l=>l.activities.map(q=>q.id));
assert.deepEqual(preservedActivityIds,oldActivityIds,'existing activity IDs/order changed');

for(const id of ['GRA-A2-07','GRA-A2-09']){
 const lesson=candidate.lessons.find(l=>l.id===id);assert.ok(lesson,id+' missing');
 assert.equal(Object.hasOwn(lesson,'prerequisite_lesson_ids'),false,'planning-only prerequisite metadata must not enter importer package');
 assert.equal(Object.hasOwn(lesson,'adaptive_concepts'),false,'planning-only adaptive metadata must not enter importer package');
}
const seq=candidate.course.sequence;
assert.equal(seq.length,47);assert.equal(new Set(seq).size,47);
assert.equal(seq[seq.indexOf('WRI-A1-04')+1],'GRA-A2-07');
assert.equal(seq[seq.indexOf('GRA-A2-02')+1],'GRA-A2-09');
assert(seq.indexOf('GRA-A2-07')<seq.indexOf('GRA-A2-01'),'present-continuous foundation should precede the contrast lesson');

const text=fs.readFileSync(candidatePath,'utf8');
assert(Buffer.byteLength(text,'utf8')<=1000000);
assert.equal(sha(text),'10d171f1c703e3be13085b0f3eee4ebc76494fb69a620a65508d1b5de3a20aff');
assert.equal(canonicalHash(candidate),'1d89087e01b742936a0ed9dad73c647365df4370b86ffd1b1812bac66866a10b');

class Repo{
 constructor(){this.p=[]}
 async packages(){return structuredClone(this.p)}
 async addPackage(v){const same=this.p.find(x=>x.version===v.version);if(same){assert.equal(same.digest,v.digest);return}this.p.push(structuredClone(v))}
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
 assert.deepEqual(preview.counts,{add:2,update:0,skip:45,conflict:0});
 assert.equal(preview.digest,'1d89087e01b742936a0ed9dad73c647365df4370b86ffd1b1812bac66866a10b');
 console.log(JSON.stringify({result:'PASS',version:'1.6.0',lessons:47,activities:379,preview:preview.counts,basePreserved:{lessons:45,activities:359},rawSha256:sha(text),canonicalSha256:preview.digest}));
})().catch(e=>{console.error(e);process.exitCode=1});
