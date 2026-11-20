'use strict';
// The Stage 3 content package can be academically sound while the browser
// runtime still bundles an earlier curriculum. Fail closed before release QA
// can report a misleading PASS for an unactivated candidate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const candidate=require('../content/curriculum-1.28.0-candidate.json');
const released=require('../content/curriculum-1.25.0-candidate.json');
assert.equal(released.schema_version,'1.25.0');
assert.equal(released.lessons.length,154);
assert.equal(released.lessons.reduce((n,l)=>n+l.activities.length,0),1125);
assert.equal(candidate.schema_version,'1.28.0');
assert.equal(candidate.lessons.length,176);
assert.equal(candidate.lessons.reduce((n,l)=>n+l.activities.length,0),1224);
assert.deepEqual(candidate.lessons.slice(0,released.lessons.length),released.lessons,
 'v1.28.0 must not modify any of the 154 released v1.25 lessons');
assert.deepEqual(candidate.course.sequence.slice(0,released.course.sequence.length),released.course.sequence,
 'v1.28.0 must preserve the exact released v1.25 course sequence');
for(const [id,oldRubric] of Object.entries(released.rubrics))
 assert.deepEqual(candidate.rubrics[id],oldRubric,'Released rubric modified: '+id);
assert.deepEqual(Object.keys(candidate.rubrics).filter(id=>!Object.hasOwn(released.rubrics,id)).sort(),
 ['RUBRIC-WRITING-B2'],'Only reviewed B2 Writing rubric may be newly added');
const runtime=fs.readFileSync(path.join(root,'infrastructure/browser/local-runtime.ts'),'utf8');
const upgrade=fs.readFileSync(path.join(root,'tests/browser-curriculum-upgrade.cjs'),'utf8');
const coreRunner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
const requiredName='curriculum-'+candidate.schema_version+'-candidate.json';
const bundled=[...runtime.matchAll(/^\s*import\s+\w+\s+from\s+['"]\.\.\/\.\.\/content\/(curriculum-\d+\.\d+\.\d+-candidate\.json)['"];?/gm)].map(m=>m[1]);
assert.deepEqual(bundled,[requiredName],
 'STAGE3 NO-GO: the browser local runtime must explicitly bundle '+requiredName+'; uploading a candidate JSON alone does not activate it.');
assert(upgrade.includes(requiredName)&&upgrade.includes('curriculum-1.18.0-candidate.json'),
 'STAGE3 NO-GO: browser migration QA must cover both existing v1.18.0 and new '+candidate.schema_version+' packages.');
assert(upgrade.includes("catalog.version,'"+candidate.schema_version+"'"),
 'STAGE3 NO-GO: browser migration QA must assert the newly activated catalog version.');
assert(coreRunner.includes('"automatic-curriculum-v120.cjs"'),
 'RELEASE NO-GO: automatic on-device 1.20 update and no-data-loss quota tests must run.');
assert(coreRunner.includes('"stage3-import-preview.cjs"'),
 'STAGE3 NO-GO: real importer regression test must remain registered in qa:core.');
console.log(JSON.stringify({result:'PASS',gate:'stage3-bundled-curriculum-activation',target:candidate.schema_version,requiresFullQa:true}));
