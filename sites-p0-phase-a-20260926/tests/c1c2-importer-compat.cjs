'use strict';
// Isolated schema/runtime compatibility check for future C1/C2 sources.
// No academically unreviewed C-level lessons are imported or deployed.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.18.1-candidate.json');
const out='.sites-runtime/c1c2-compat-check';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed}=require('../'+out+'/domain/academic.js');
const {validateContent}=require('../'+out+'/domain/content-model.js');
const candidate=structuredClone(base);
candidate.schema_version='1.19.99';
const specs=[
 {source:'REA-B1-01',id:'REA-C1-01',module:'reading',level:'C1'},
 {source:'VOC-B1-01',id:'VOC-C2-01',module:'vocabulary',level:'C2'}
];
for(const spec of specs){
 const original=base.lessons.find(x=>x.id===spec.source);
 assert(original,'Missing baseline fixture '+spec.source);
 const lesson=structuredClone(original);
 lesson.id=spec.id;
 lesson.cefr_target=spec.level;
 lesson.title='Fixture for importer compatibility only (not an authored lesson)';
 lesson.activities=lesson.activities.map((q,i)=>({...q,id:spec.id+'-Q'+(i+1)}));
 candidate.lessons.push(lesson);
 candidate.course.sequence.push(spec.id);
}
assert.equal(candidate.lessons.length,111);
assert.deepEqual(validateSeed(candidate),[],'The cumulative importer must accept legitimate C1/C2 records');
assert.deepEqual(validateContent(mapSeed(candidate)),[],'Portable mapped bundle must accept C1/C2');
assert.deepEqual(candidate.lessons.slice(0,109),base.lessons,'Existing lesson objects must stay unmodified');
assert(candidate.lessons.every(x=>x.module==='reading'||x.module==='vocabulary'||x.cefr_target!=='C1'&&x.cefr_target!=='C2'));
for(const spec of specs){
 const row=candidate.lessons.find(x=>x.id===spec.id);
 assert.equal(row.cefr_target,spec.level);
 assert.equal(mapSeed(candidate).lessons.find(x=>x.id===spec.id+'-unit'),undefined,
   'The mapped lesson ID must remain the actual source ID, not the generated Unit ID');
}
const illegal=structuredClone(candidate);
illegal.lessons.at(-1).cefr_target='C3';
assert(validateSeed(illegal).length>0,'Importer must still reject unknown CEFR levels');
const badPrefix=structuredClone(candidate);
badPrefix.lessons.at(-1).id='VOC-C3-01';
badPrefix.course.sequence[badPrefix.course.sequence.length-1]='VOC-C3-01';
assert(validateSeed(badPrefix).length>0,'Unknown level in lesson ID must be rejected');
const wrongDomain=structuredClone(candidate);
wrongDomain.lessons.at(-1).module='reading';
assert(validateSeed(wrongDomain).length>0,'Mismatched module prefix must still fail');
console.log(JSON.stringify({
 result:'PASS',gate:'C1-C2-importer-compatibility',
 baselineLessons:109,fixtureLessons:2,targets:['C1','C2'],
 oldLessonObjectsUnchanged:true,portableMapValid:true,invalidLevelsRejected:true,
 releaseOrImportPerformed:false,academicVerdict:'NOT_TESTED',realBrowser:'NOT_TESTED'
}));
