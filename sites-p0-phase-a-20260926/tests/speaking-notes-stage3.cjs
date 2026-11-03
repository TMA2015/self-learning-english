'use strict';
// Stage 3: note-only Speaking must not imply speech evaluation, but historical
// v1.18.0 attempts must retain their original persisted status and scores.
// Real compiled academicService and cumulative import data, in-memory store only.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const old=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');
const root=path.resolve(__dirname,'..');
const out='.sites-runtime/stage3-speaking-notes-check';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts',
 'application/learning-service.ts','application/academic-service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {academicService}=require('../'+out+'/application/academic-service.js');
class Memory{
 packagesList=[]; attemptRows=new Map(); snapshots=[];
 async packages(){return structuredClone(this.packagesList)}
 async addPackage(p){this.packagesList.push(structuredClone(p))}
 async attempts(owner){return structuredClone(this.attemptRows.get(owner)??[])}
 async start(owner,p){const rows=this.attemptRows.get(owner)??[];rows.push(structuredClone(p));this.attemptRows.set(owner,rows)}
 async saveDraft(owner,id,patch){const p=this.attemptRows.get(owner)?.find(x=>x.id===id);if(p?.status==='started')Object.assign(p,structuredClone(patch))}
 async finish(owner,record){const p=this.attemptRows.get(owner)?.find(x=>x.id===record.id);assert(p);assert.equal(p.status,'started');Object.assign(p,structuredClone(record));return structuredClone(p)}
 async approve(owner,record){return this.finish(owner,record)}
 async readState(){return null}
 async readEvidence(){return []}
 async appendEvidence(){}
 async readAssessments(){return []}
 async legacyImported(){return true}
 async markLegacyImported(){}
 async appendSnapshot(){}
}
async function complete(svc,id,label){
 const attempt=await svc.start('SPE-A2-02',id);
 const packet=attempt.version==='1.18.0'?old:next;
 const lesson=packet.lessons.find(x=>x.id==='SPE-A2-02');
 const answers=Object.fromEntries(lesson.activities.map(q=>[q.id,
    q.type==='extended_response'?'keywords: cannot find the room; starts in ten minutes; could you help?':q.answer.correct_option_id]));
 await svc.draft(id,answers);
 return svc.submit(id);
}
(async()=>{
 const store=new Memory(),svc=academicService(store,store,'stage3-speaking-fixture');
 let p=await svc.preview(old);assert.deepEqual(p.errors,[]);await svc.importPackage(old,p.token,true);
 const legacy=await complete(svc,'stage3-legacy-speaking-1180','legacy');
 assert.equal(legacy.version,'1.18.0');
 assert.equal(legacy.status,'pending_review','Historical behavior must not be retroactively changed');
 assert.equal(legacy.evidence.length,0);
 const historic=JSON.stringify(legacy);
 p=await svc.preview(next);assert.deepEqual(p.errors,[]);await svc.importPackage(next,p.token,true);
 const current=await complete(svc,'stage3-current-speaking-1181','current');
 assert.equal(current.version,'1.18.1');
 assert.equal(current.status,'unassessed','New note-only Speaking must be unassessed');
 assert.equal(current.evidence.length,0);
 assert(current.results.length>0);
 assert(current.results.some(q=>q.correct===true),'Objective language knowledge still represented in practice results');
 assert(current.results.some(q=>q.correct===null),'Open task remains unassessed');
 assert.equal(JSON.stringify((await store.attempts('stage3-speaking-fixture')).find(a=>a.id===legacy.id)),historic,'Existing version-pinned result must be immutable');
 assert.equal((await svc.submit(current.id)).status,'unassessed','Resubmit must be idempotent');
 const ui=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
 assert(ui.includes('Your notes were saved as unassessed practice. No oral Speaking or CEFR score was awarded.'));
 assert(ui.includes("Language preparation knowledge · Objective practice"));
 console.log(JSON.stringify({result:'PASS',lesson:'SPE-A2-02',oldStatus:legacy.status,newStatus:current.status,
  unchangedHistorical:true,oralEvidenceAdded:0,languageKnowledgeScorePreserved:true}));
})().catch(err=>{console.error(err);process.exitCode=1});
