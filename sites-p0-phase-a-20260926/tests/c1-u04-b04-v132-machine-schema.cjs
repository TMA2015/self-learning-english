'use strict';
// C1-U04 NotebookLM-approved source-only candidate. No runtime activation or LIVE.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const original=read('content/review-packets/SLE_C1_U04_LEXICAL_AUTHORING_NOTEBOOKLM_R1_20261122.md');
const verdict=read('content/review-packets/SLE_C1_U04_B04_NOTEBOOKLM_PASS_RECEIPT_20261122.md');
const staging=require('../content/review-packets/SLE_C1_U04_B04_APPROVED_STAGING_NOT_IMPORTABLE.json');
const old=require('../content/curriculum-1.31.0-candidate.json');
const next=require('../content/curriculum-1.32.0-candidate.json');
const map=require('../content/sle-unit-navigation-map-v1.json');
const expectedIds=['VOC-C1-01','VOC-C1-02','VOC-C1-03'];
const keys=['BACDBA','BCADDB','CADBAC'];
const digest=crypto.createHash('sha256').update(original).digest('hex');
assert.equal(digest,'1b98f0a32a64f6e0362ef849db1b2a670cae81fbd0c86115507266e16fa6e924');
assert.equal(staging.source_sha256,digest);
assert.equal(staging.format,'SLE_REVIEWED_SOURCE_STAGING_NOT_IMPORTABLE');
assert.equal(staging.packet_id,'SLE-C1-U04-B04-R1-20261122');
assert.equal(staging.academic_verdict,'PASS');
assert.deepEqual(staging.must_fix,[]);
assert.equal(staging.import_authorized,false);
assert.equal(staging.release_authorized,false);
assert.equal(staging.unscored_core4_tasks,3);
assert.match(verdict,/\*\*Academic verdict:\*\* \*\*PASS\*\*/);
assert.equal(old.schema_version,'1.31.0');
assert.equal(next.schema_version,'1.32.0');
assert.equal(old.lessons.length,193);
assert.equal(next.lessons.length,196);
assert.equal(old.lessons.flatMap(l=>l.activities).length,1291);
assert.equal(next.lessons.flatMap(l=>l.activities).length,1309);
assert.deepEqual(next.lessons.slice(0,193),old.lessons,'No prior lesson may change');
assert.deepEqual(next.course.sequence.slice(0,193),old.course.sequence,'Old course order immutable');
assert.deepEqual(next.rubrics,old.rubrics,'No rubric modification');
assert.deepEqual(next.lessons.slice(193),staging.lessons,'Only reviewed lesson source may be appended');
assert.deepEqual(next.lessons.slice(193).map(l=>l.id),expectedIds);
assert.deepEqual(next.course.sequence.slice(193),expectedIds);
assert.deepEqual(map.reviewed_v132,Object.fromEntries(expectedIds.map(id=>[id,'C1-U04'])));
assert.equal(new Set(next.lessons.map(l=>l.id)).size,196);
assert.equal(new Set(next.lessons.flatMap(l=>l.activities.map(a=>a.id))).size,1309);
for(let i=0;i<3;i++){
 const l=next.lessons[193+i];
 assert.equal(l.module,'vocabulary');assert.equal(l.cefr_target,'C1');
 assert(l.explanation.en.includes('CORE-1')&&l.explanation.en.includes('CORE-2')&&l.explanation.en.includes('CORE-3')&&l.explanation.en.includes('CORE-4'));
 assert(l.examples.some(x=>x.startsWith('INDEPENDENT WORKED MODEL')));
 assert.equal(l.activities.length,6);
 assert.equal(l.activities.map(q=>q.answer.correct_option_id).join(''),keys[i]);
 for(const q of l.activities){
  assert.equal(q.type,'single_choice');assert.equal(q.evidence_weight,1);
  assert.deepEqual(q.options.map(o=>o.id),['A','B','C','D']);
  assert.equal(q.skill_tags.length,1);
  assert(['vocabulary.collocations','vocabulary.meaning_in_context'].includes(q.skill_tags[0]));
  assert.match(q.feedback.explanation_en,/Misconception: .* Next action: /);
 }
}
const runtime=read('infrastructure/browser/local-runtime.ts');
assert(runtime.includes("from '../../content/curriculum-1.30.0-candidate.json'"));
assert(!runtime.includes("from '../../content/curriculum-1.32.0-candidate.json'"));
const manifest=require('../content/foundation-audio.json');
assert.equal(manifest['LIS-B2-01'],undefined,'B2-U10 Listening must remain media-held');
const out='.sites-runtime/c1-u04-b04-v132-source-machine-qa';
fs.rmSync(path.join(root,out),{recursive:true,force:true});fs.mkdirSync(path.join(root,out),{recursive:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts','domain/unit-guide-60.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed}=require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {unitGuideForCatalog}=require(path.join(root,out,'domain/unit-guide-60.js'));
assert.deepEqual(validateSeed(next),[],'Cumulative source schema');
assert.deepEqual(validateContent(mapSeed(next)),[],'Content model schema');
const lessons=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const guide=unitGuideForCatalog(lessons,next.course.sequence);
assert.equal(guide.units.length,60);
assert.equal(guide.mappedLessonCount,194);
assert.deepEqual(guide.unmappedLessons.map(l=>l.id).sort(),['REA-C1-01','VOC-C2-01']);
assert.deepEqual(guide.units.find(u=>u.id==='C1-U04').lessons.map(l=>l.id),expectedIds);
console.log(JSON.stringify({result:'PASS',gate:'C1_U04_B04_V132_SOURCE_ONLY',lessons:196,activities:1309,mapped:194,
 newLessons:3,newObjectiveItems:18,unscoredTransferTasks:3,academic:'PASS',schema:'PASS',runtime:'UNCHANGED_V130',
 media:'UNCHANGED',releaseAuthorized:false,physicalSafari:'NOT_TESTED'}));
