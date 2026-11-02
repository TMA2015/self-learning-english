'use strict';
// Stage 3 release preflight using real compiled importer, not a fabricated
// source-only Add/Update/Skip count. No browser, Firebase or user data accessed.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const old=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');
const root=path.resolve(__dirname,'..');
const out='.sites-runtime/stage3-import-check';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'domain/content-model.ts','domain/academic.ts',
 'application/learning-service.ts','application/academic-service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed}=require('../'+out+'/domain/academic.js');
const {validateContent}=require('../'+out+'/domain/content-model.js');
const {academicService}=require('../'+out+'/application/academic-service.js');
assert.deepEqual(validateSeed(old),[]);
assert.deepEqual(validateSeed(next),[]);
assert.deepEqual(validateContent(mapSeed(next)),[]);
class Store{
 p=[]; a=new Map(); e=new Map();
 async packages(){return structuredClone(this.p)}
 async addPackage(v){if(this.p.some(x=>x.version===v.version))throw Error('Duplicate content version');this.p.push(structuredClone(v))}
 async attempts(owner){return structuredClone(this.a.get(owner)??[])}
 async start(owner,record){const rows=this.a.get(owner)??[];rows.push(structuredClone(record));this.a.set(owner,rows)}
 async saveDraft(owner,id,payload){const row=this.a.get(owner)?.find(r=>r.id===id);if(row?.status==='started')Object.assign(row,structuredClone(payload))}
 async finish(owner,record){return record}
 async approve(owner,record){return record}
 async readState(){return null}
 async readEvidence(){return []}
 async appendEvidence(){}
 async readAssessments(){return []}
 async legacyImported(){return true}
 async markLegacyImported(){}
 async appendSnapshot(){}
}
(async()=>{
 const storage=new Store(),svc=academicService(storage,storage,'stage3-owner');
 let preview=await svc.preview(old);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:109,update:0,skip:0,conflict:0});
 await svc.importPackage(old,preview.token,true);
 const attempt=await svc.start('REA-A1-01','qa-stage3-old-reading-attempt');
 assert.equal(attempt.version,'1.18.0');
 const oldNotes=(await svc.lesson('REA-A1-01',attempt.version)).lesson.examples;
 assert(!oldNotes.join(' ').includes('guitar group'));
 preview=await svc.preview(next);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:0,update:2,skip:107,conflict:0});
 assert.deepEqual(preview.rows.filter(x=>x.action==='update').map(x=>x.id).sort(),['REA-A1-01','VOC-A1-01']);
 await assert.rejects(()=>svc.importPackage(next,preview.token,false),/confirm/);
 await svc.importPackage(next,preview.token,true);
 const current=await svc.lesson('REA-A1-01');
 assert(current.lesson.examples.join(' ').includes('guitar group'));
 const historic=await svc.lesson('REA-A1-01',attempt.version);
 assert.deepEqual(historic.lesson.examples,oldNotes);
 const unchangedAttempt=(await storage.attempts('stage3-owner')).find(x=>x.id===attempt.id);
 assert.equal(unchangedAttempt.version,'1.18.0');
 assert.equal(unchangedAttempt.status,'started');
 assert.equal(storage.p.length,2);
 console.log(JSON.stringify({result:'PASS',gate:'actual-importer-preview',versions:storage.p.map(p=>p.version),preview:{add:0,update:2,skip:107,conflict:0},historicalAttemptPreserved:true}));
})().catch(err=>{console.error(err);process.exitCode=1});
