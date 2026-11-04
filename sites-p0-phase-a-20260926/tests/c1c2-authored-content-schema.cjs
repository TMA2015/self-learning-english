'use strict';
// Technical dry run of the REAL authored C1/C2 data, without adopting or importing it.
// Academic verdict is explicitly still pending NotebookLM review.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const draft=require('../content/batches/v120-c1c2-first-pilot-draft.json');
const baseline=require('../content/curriculum-1.18.1-candidate.json');
const candidate=structuredClone(baseline);
candidate.schema_version='1.19.99';
candidate.status='QA_FIXTURE_ONLY_NOT_AN_ACADEMIC_RELEASE';
const originalLessons=structuredClone(baseline.lessons);
for(const l of draft.lessons){
 const activities=l.questions.map((q,i)=>({
  id:l.id+'-Q'+(i+1),type:q.type,prompt:q.stem,
  options:q.options.map((x,j)=>({id:'ABCD'[j],text:x})),
  answer:{correct_option_id:'ABCD'[q.answer]},
  feedback:{explanation_en:q.why+' Next step: '+q.next},
  skill_tags:[q.tag],evidence_weight:1
 }));
 const mapped={id:l.id,module:l.module,cefr_target:l.cefr_target,title:l.title,
  estimated_minutes:l.estimated_minutes,objectives:l.objectives,
  explanation:l.explanation,examples:l.examples,activities};
 if(l.reading_asset)mapped.reading_asset={...l.reading_asset,display_to_learner:true};
 candidate.lessons.push(mapped);
 candidate.course.sequence.push(l.id);
}
assert.equal(candidate.lessons.length,111);
assert.equal(candidate.lessons.reduce((s,l)=>s+l.activities.length,0),929);
assert.deepEqual(candidate.lessons.slice(0,109),originalLessons);
const out='.sites-runtime/c1c2-authored-dryrun';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'domain/academic.ts','domain/content-model.ts','domain/option-order.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed}=require('../'+out+'/domain/academic.js');
const {validateContent}=require('../'+out+'/domain/content-model.js');
const {createOptionOrder,validateOptionOrder,orderedOptions}=require('../'+out+'/domain/option-order.js');
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);
let shuffled=0;
for(const lesson of candidate.lessons.slice(109)){
 const order=createOptionOrder(lesson.activities,()=>0);
 validateOptionOrder(lesson.activities,{version:candidate.schema_version,optionOrder:order});
 for(const question of lesson.activities){
  const seen=orderedOptions(question,{optionOrder:order});
  assert.equal(seen.length,4);
  assert.equal(new Set(seen.map(x=>x.id)).size,4);
  assert.equal(seen.find(x=>x.id===question.answer.correct_option_id).text,
   question.options.find(x=>x.id===question.answer.correct_option_id).text);
  if(JSON.stringify(seen.map(x=>x.id))!==JSON.stringify(question.options.map(x=>x.id)))shuffled++;
 }
}
assert(shuffled>0);
console.log(JSON.stringify({result:'PASS',gate:'C1C2-draft-authoring-technical-dryrun',
  fixtureBase:109,fixturePlus:2,fixtureActivities:929,shuffled,
  historicalLessonsUnchanged:true,realImportedCandidate:'NONE',
  academicVerdict:'NOT_TESTED',productionWrites:0}));
