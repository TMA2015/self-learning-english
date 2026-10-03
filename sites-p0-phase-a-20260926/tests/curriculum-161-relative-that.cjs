'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');

const livePath='content/curriculum-1.6.0-candidate.json';
const candidatePath='content/curriculum-1.6.1-candidate.json';

execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts','application/learning-service.ts','application/academic-service.ts','--outDir','.sites-runtime/curriculum-161','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.mkdirSync('.sites-runtime/curriculum-161',{recursive:true});
fs.writeFileSync('.sites-runtime/curriculum-161/package.json','{"type":"commonjs"}');

const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-161/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-161/domain/content-model.js');
const {academicService}=require('../.sites-runtime/curriculum-161/application/academic-service.js');

const live=require('../'+livePath);
const candidate=require('../'+candidatePath);
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonicalHash=v=>sha(JSON.stringify(canonical(v)));

assert.equal(live.schema_version,'1.6.0');
assert.equal(candidate.schema_version,'1.6.1');
assert.equal(live.lessons.length,59);
assert.equal(candidate.lessons.length,59);
assert.equal(live.lessons.flatMap(l=>l.activities).length,499);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,499);
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);

const liveBy=new Map(live.lessons.map(l=>[l.id,l]));
const candidateBy=new Map(candidate.lessons.map(l=>[l.id,l]));
const changed=[];
for(const [id,oldLesson] of liveBy){
 const nextLesson=candidateBy.get(id);
 if(JSON.stringify(oldLesson)!==JSON.stringify(nextLesson))changed.push(id);
}
assert.deepEqual(changed,['GRA-A2-16'],'only GRA-A2-16 may change');

const old16=liveBy.get('GRA-A2-16');
const new16=candidateBy.get('GRA-A2-16');
assert.equal(old16.activities.length,10);
assert.equal(new16.activities.length,10);
for(const oldQ of old16.activities){
 const nextQ=new16.activities.find(q=>q.id===oldQ.id);
 assert.ok(nextQ,'missing activity '+oldQ.id);
 if(oldQ.id!=='GRA-A2-16-Q5')assert.deepEqual(nextQ,oldQ,'unexpected activity change '+oldQ.id);
}
const q5=new16.activities.find(q=>q.id==='GRA-A2-16-Q5');
assert.deepEqual(q5.answer.accepted_answers,['who','that']);
assert(q5.feedback.explanation_en.includes('both who and that are valid'));
assert(new16.objectives[0].includes('who or that'));
assert(new16.explanation.en.includes('Use who or that for people in defining clauses'));

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
 let preview=await service.preview(live);
 assert.deepEqual(preview.errors,[]);
 await service.importPackage(live,preview.token,true);
 preview=await service.preview(candidate);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:0,update:1,skip:58,conflict:0});
 const text=fs.readFileSync(candidatePath,'utf8');
 console.log(JSON.stringify({
   result:'PASS',
   version:'1.6.1',
   lessons:59,
   activities:499,
   changedLessons:changed,
   preview:preview.counts,
   rawSha256:sha(text),
   canonicalSha256:canonicalHash(candidate)
 }));
})().catch(e=>{console.error(e);process.exitCode=1});
