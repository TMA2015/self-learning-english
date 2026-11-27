'use strict';
// The Stage 3 content package can be academically sound while the browser
// runtime still bundles an earlier curriculum. Fail closed before release QA
// can report a misleading PASS for an unactivated candidate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const candidate=require('../content/curriculum-1.28.1-candidate.json');
const released=require('../content/curriculum-1.25.0-candidate.json');
const crypto=require('node:crypto');
const candidateBytes=fs.readFileSync(path.join(root,'content/curriculum-1.28.1-candidate.json'));
assert.equal(crypto.createHash('sha1').update('blob '+candidateBytes.length+'\0').update(candidateBytes).digest('hex'),'ef69d4a9d4ed13fb3de7702ce6600e062c1039f2');
assert(candidateBytes.equals(fs.readFileSync(path.join(root,'content/review-packets/curriculum-1.28.1-wording-candidate.json'))),'Activated bytes must equal independently reviewed candidate');
assert.equal(released.schema_version,'1.25.0');
assert.equal(released.lessons.length,154);
assert.equal(released.lessons.reduce((n,l)=>n+l.activities.length,0),1125);
assert.equal(candidate.schema_version,'1.28.1');
assert.equal(candidate.lessons.length,176);
assert.equal(candidate.lessons.reduce((n,l)=>n+l.activities.length,0),1224);
assert.deepEqual(candidate.lessons.slice(0,released.lessons.length),released.lessons,
 'v1.28.1 must not modify any of the 154 released v1.25 lessons');
assert.deepEqual(candidate.course.sequence.slice(0,released.course.sequence.length),released.course.sequence,
 'v1.28.1 must preserve the exact released v1.25 course sequence');
for(const [id,oldRubric] of Object.entries(released.rubrics))
 assert.deepEqual(candidate.rubrics[id],oldRubric,'Released rubric modified: '+id);
assert.deepEqual(Object.keys(candidate.rubrics).filter(id=>!Object.hasOwn(released.rubrics,id)).sort(),
 ['RUBRIC-WRITING-B2'],'Only reviewed B2 Writing rubric may be newly added');
const {manifest:active,source}=require('../scripts/active-release.cjs').verifyActiveRelease();
const versionParts=v=>v.split('.').map(Number);
const oldParts=versionParts(candidate.schema_version),newParts=versionParts(active.version);
const firstDifference=newParts.findIndex((n,i)=>n!==oldParts[i]);
assert(firstDifference===-1||newParts[firstDifference]>oldParts[firstDifference],'Active release cannot downgrade the last reviewed baseline');
assert.deepEqual(source.lessons.slice(0,candidate.lessons.length),candidate.lessons,'Current accumulation milestone preserves released lessons; reviewed corrections require explicit change-specific gate');
assert.deepEqual(source.course.sequence.slice(0,candidate.course.sequence.length),candidate.course.sequence,'Current milestone preserves released sequence');
for(const [id,rubric] of Object.entries(candidate.rubrics))assert.deepEqual(source.rubrics[id],rubric,'Historical rubric modified: '+id);
const coreRunner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
assert(coreRunner.includes('"automatic-curriculum-v120.cjs"'),
 'RELEASE NO-GO: automatic on-device 1.20 update and no-data-loss quota tests must run.');
assert(coreRunner.includes('"stage3-import-preview.cjs"'),
 'STAGE3 NO-GO: real importer regression test must remain registered in qa:core.');
console.log(JSON.stringify({result:'PASS',gate:'stage3-bundled-curriculum-activation',target:active.version,requiresFullQa:true}));
