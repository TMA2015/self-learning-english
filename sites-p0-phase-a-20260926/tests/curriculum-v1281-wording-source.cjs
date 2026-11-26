'use strict';
// Source-only successor preflight. This is not activation, migration or release QA.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),ts=require('typescript');
const blob=p=>{const b=fs.readFileSync(p);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')};
const basePath='content/curriculum-1.28.0-candidate.json';
const nextPath='content/review-packets/curriculum-1.28.1-wording-candidate.json';
const patchPath='content/review-packets/SLE_REA_BASELINE_WORDING_PATCH_20261126.json';
assert.equal(blob(basePath),'9d931a6930b8cd3ed918db1fa22e8708b7a9f884');
assert.equal(blob(nextPath),'ef69d4a9d4ed13fb3de7702ce6600e062c1039f2');
assert.equal(blob(patchPath),'ab8c7d187164a2576ffcebb54506dc221d0eb249');
const base=JSON.parse(fs.readFileSync(basePath)),next=JSON.parse(fs.readFileSync(nextPath)),patch=JSON.parse(fs.readFileSync(patchPath));
assert.equal(base.schema_version,'1.28.0');assert.equal(next.schema_version,'1.28.1');
assert.equal(next.lessons.length,176);assert.equal(next.lessons.flatMap(l=>l.activities).length,1224);
assert.deepEqual(patch.metadata_changes,['schema_version','status']);
assert.equal(patch.changes.length,10);
assert.equal(new Set(patch.changes.map(c=>c.item_id)).size,10);
assert.equal(patch.changes.filter(c=>c.field==='prompt').length,1);
assert.equal(patch.changes.filter(c=>c.field==='feedback.explanation_en').length,9);
const reversed=structuredClone(next);
for(const c of patch.changes){
 const l=reversed.lessons.find(x=>x.id===c.lesson_id),old=base.lessons.find(x=>x.id===c.lesson_id);
 assert(l&&old&&l.module==='reading');
 const a=l.activities.find(x=>x.id===c.item_id),b=old.activities.find(x=>x.id===c.item_id);
 assert(a&&b&&a.answer&&b.answer);
 assert.equal(a.answer.correct_option_id,c.key);assert.equal(b.answer.correct_option_id,c.key);
 if(c.field==='prompt'){assert.equal(a.prompt,c.after);assert.equal(b.prompt,c.before);a.prompt=c.before;}
 else {assert.equal(c.field,'feedback.explanation_en');assert.equal(a.feedback.explanation_en,c.after);assert.equal(b.feedback.explanation_en,c.before);a.feedback.explanation_en=c.before;}
}
reversed.schema_version=base.schema_version;reversed.status=base.status;
assert.deepEqual(reversed,base,'Only the independently reviewed wording and version/status may change');
require.extensions['.ts']=(mod,name)=>mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText,name);
const {validateSeed,mapSeed}=require('../domain/academic.ts');
const {validateContent}=require('../domain/content-model.ts');
assert.deepEqual(validateSeed(next),[]);
assert.deepEqual(validateContent(mapSeed(next)),[]);
const runtime=fs.readFileSync('infrastructure/browser/local-runtime.ts','utf8');
assert(runtime.includes("import curriculum1280 from '../../content/curriculum-1.28.0-candidate.json'"));
assert(!runtime.includes('1.28.1'),'Successor must remain source-only until separately approved activation');
console.log(JSON.stringify({gate:'SLE_V1281_WORDING_SOURCE_ONLY',result:'PASS',lessons:176,activities:1224,approvedWording:10,keysChanged:0,otherContentChanged:0,activeRuntime:'1.28.0',activation:'NOT_TESTED'}));
