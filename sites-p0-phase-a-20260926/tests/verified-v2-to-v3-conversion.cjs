'use strict';
/** Public authored source + fake historic attempts. NEVER owner backup data. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/verified-v2-to-v3';
const dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/browser/v2-to-lesson-revision-v3.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs',
 '--target','es2022','--resolveJsonModule','--esModuleInterop',
 '--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {convertVerifiedV2ToRevisionV3}=
 require(path.join(dest,'infrastructure/browser/v2-to-lesson-revision-v3.js'));
const {verifyRevisionRecoveryV3}=
 require(path.join(dest,'domain/lesson-revision-recovery-v3.js'));
const {verifyLocalRecoveryV2}=
 require(path.join(dest,'infrastructure/browser/local-recovery.js'));
const versions=['1.18.0','1.18.1','1.20.0'];
const sources=versions.map(v=>require('../content/curriculum-'+v+'-candidate.json'));
const sourceRows=sources.map(s=>({
 id:s.package_id,version:s.schema_version,digest:'verified-test-source-'+s.schema_version,
 source:s,at:1
}));
const attempt=(i)=>{
 const s=i<20?sources[0]:i<40?sources[1]:sources[2];
 const lesson=(i===0?s.lessons.find(x=>x.id==='VOC-A1-01'):
  i===1?s.lessons.find(x=>x.id==='REA-A1-01'):s.lessons[i%s.lessons.length]);
 assert(lesson);
 return {id:'synthetic-v2-attempt-'+i,packageId:s.package_id,
  version:s.schema_version,lessonId:lesson.id,
  rootId:'synthetic-v2-attempt-'+i,status:i<52?'scored':'started',
  answers:{[lesson.activities[0].id]:'a'},evidence:[],
  createdAt:1000+i,...(i<52?{submittedAt:2000+i,
   results:[{id:lesson.activities[0].id,correct:true,explanation:'Original synthetic feedback'}]}:{})
 };
};
const attempts=Array.from({length:73},(_,i)=>attempt(i));
const key='g-learning:english:v1:academic:packages';
const progressKey='g-learning:english:v1:owner:local-family:academic-attempts';
const learnerState='g-learning:english:v1:owner:local-family:learner:primary:state';
const entries=[
 {key,value:JSON.stringify({schema:2,retention:true,records:sourceRows})},
 {key:progressKey,value:JSON.stringify(attempts)},
 {key:learnerState,value:JSON.stringify({writingDraft:'Keep original work'})}
].sort((a,b)=>a.key.localeCompare(b.key));
async function hash(s){const v=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
 return Buffer.from(v).toString('hex')}
async function makeV2(entryRows){
 return JSON.stringify({format:'g-learning-english.recovery',schemaVersion:2,
  exportedAt:'2026-11-07T04:00:00.000Z',entries:entryRows,
  sha256:await hash(JSON.stringify(entryRows))},null,2)+'\n';
}
(async()=>{
 const v2=await makeV2(entries);
 const old=(await verifyLocalRecoveryV2(v2));
 assert.equal(old.attempts,73);assert.equal(old.versions,3);
 const originalBytes=Buffer.from(v2);
 const transformed=await convertVerifiedV2ToRevisionV3(v2);
 const check=await verifyRevisionRecoveryV3(transformed.text);
 assert.equal(transformed.originalV2Sha256,old.sha256);
 assert.equal(transformed.attempts,73);
 assert.equal(transformed.currentLessons,123);
 assert.equal(check.attempts,73);
 assert.equal(transformed.uniqueLessonRevisions,check.uniqueRevisions);
 assert(transformed.uniqueLessonRevisions>=123&&transformed.uniqueLessonRevisions<=130,
  'Only actually changed historic lessons may add unique revision blobs');
 assert(transformed.v3Bytes<transformed.v2Bytes,
  'Converting 3 full historic versions should reduce portable content size');
 assert.deepEqual(Buffer.from(v2),originalBytes,'Original Recovery V2 must be unchanged');
 assert.equal(check.file.entries.find(x=>x.key===progressKey).value,
  entries.find(x=>x.key===progressKey).value,
  'All original 73 attempt records must remain byte-identical');
 assert.equal(check.file.entries.find(x=>x.key===learnerState).value,
  entries.find(x=>x.key===learnerState).value);
 assert.equal(check.file.entries.some(x=>x.key===key),false,
  'V3 must not embed old full academic package source arrays');
 const originals=check.file.aliases.filter(x=>x.version==='1.18.0');
 const current=check.file.active.lessons;
 for(const id of ['VOC-A1-01','REA-A1-01']){
  const historic=originals.find(x=>x.lessonId===id);
  const active=current.find(x=>x.lessonId===id);
  assert(historic&&active);
  assert.notEqual(historic.revision,active.revision,
   'A genuinely modified original lesson may not be mapped to the latest');
 }
 const edited=JSON.parse(v2);
 const row=edited.entries.find(x=>x.key===progressKey);
 row.value=JSON.stringify([{id:'forged-history'}]);
 await assert.rejects(convertVerifiedV2ToRevisionV3(JSON.stringify(edited)),
  /checksum mismatch/i);
 // An old attempt with insufficient provenance must fail rather than invent
 // a matching packageId, even when its V2 checksum is correctly rebuilt.
 const unverifiable=JSON.parse(v2);
 const fileAttempts=JSON.parse(unverifiable.entries.find(x=>x.key===progressKey).value);
 delete fileAttempts[0].packageId;
 unverifiable.entries.find(x=>x.key===progressKey).value=JSON.stringify(fileAttempts);
 const updated=await makeV2(unverifiable.entries);
 assert.equal((await verifyLocalRecoveryV2(updated)).attempts,73);
 await assert.rejects(convertVerifiedV2ToRevisionV3(updated),
  /lacks original version\/lesson\/package provenance/);
 console.log(JSON.stringify({result:'PASS',gate:'verified-V2-to-V3-normalized-conversion',
  actualPublicSources:versions,originalFullSourceVersions:3,
  currentLessons:transformed.currentLessons,uniqueLessonRevisions:check.uniqueRevisions,
  syntheticAttempts:73,scored:52,drafts:21,
  v2Bytes:transformed.v2Bytes,v3Bytes:transformed.v3Bytes,
  percentSourceArchiveReduction:Number((100*(1-transformed.v3Bytes/transformed.v2Bytes)).toFixed(1)),
  savedLearnerValuesIdentical:true,changedOldLessonsPinned:true,
  malformedV2Rejected:true,originalV2Kept:true,
  actualFamilyFile:'NOT_TESTED',productionWrites:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
