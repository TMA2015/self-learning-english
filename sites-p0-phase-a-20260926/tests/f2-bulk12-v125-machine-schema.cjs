'use strict';
/** Reviewed MD -> additive v1.25 source parity / real importer / Unit navigation QA. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),runtime='.sites-runtime/f2-v125-schema';
const packet=path.join(root,'content/review-packets/SLE_BULK12_A1A2B1_NOTEBOOKLM_R1_20261109.md');
const authored=path.join(root,'content/batches/f2-bulk12-a1a2b1-12-lessons-v125-draft.json');
const base=path.join(root,'content/curriculum-1.24.0-candidate.json');
const {checkPacket,validateAuthored,compose,expected,unitMap}
 =require('../scripts/stage-f2-bulk12-v125-candidate.cjs');
const hash=checkPacket(packet),md=fs.readFileSync(packet,'utf8');
const payload=require('../content/batches/f2-bulk12-a1a2b1-12-lessons-v125-draft.json');
const old=require('../content/curriculum-1.24.0-candidate.json');
const committed=require('../content/curriculum-1.25.0-candidate.json');
const counts=validateAuthored(payload),next=compose(packet,authored,base).next;
assert.deepEqual(committed,next,'Committed v1.25 MUST equal source-verified composer result');
assert.equal(hash,payload.source_packet_sha256);
assert.equal(next.schema_version,'1.25.0');
assert.deepEqual([next.lessons.length,next.lessons.flatMap(l=>l.activities).length],[154,1125]);
assert.deepEqual(next.lessons.slice(0,142),old.lessons);
assert.deepEqual(next.course.sequence.slice(0,142),old.course.sequence);
assert.deepEqual(next.rubrics,old.rubrics);
const oldIds=new Set(old.lessons.map(l=>l.id)),oldQIds=new Set(old.lessons.flatMap(l=>l.activities.map(q=>q.id)));
const fresh=next.lessons.slice(142),activities=fresh.flatMap(l=>l.activities);
assert.deepEqual(fresh.map(l=>l.id),expected.map(x=>x[1]));
assert(fresh.every(l=>!oldIds.has(l.id)));
assert(activities.every(q=>!oldQIds.has(q.id)));
assert.equal(new Set(fresh.map(l=>l.id)).size,12);
assert.equal(new Set(activities.map(q=>q.id)).size,40);
let objective=0,writing=0,verifiedOptions=0,sourceTextVerified=0;
for(const l of fresh){
 const match=expected.find(x=>x[1]===l.id);
 assert(match,l.id+': missing reviewed inventory');
 const [unit,id,mod,cefr,keys]=match;
 assert.deepEqual(payload.unit_assignments[unit].includes(id),true);
 assert(l.explanation.en.includes('CORE-1')&&l.explanation.en.includes('CORE-4'));
 assert(!/Answer key:/i.test(l.explanation.en+' '+l.examples.join(' ')),'Pre-submit answer leakage: '+id);
 assert(l.examples.some(s=>s.includes('INDEPENDENT MODEL')));
 if(mod==='reading'){
  const sources=[...md.matchAll(/\*\*(SOURCE [AB] — [^\n]+?) \(learner-visible `reading_asset` body\)\*\*\n```text\n(.*?)\n```/gs)];
  assert(l.reading_asset?.display_to_learner===true);
  assert(l.reading_asset.body.includes('SOURCE A —')&&l.reading_asset.body.includes('SOURCE B —'));
  // Compare exact title and full learner-visible text for both authoring code fences.
  const section=md.split('### '+unit+': '+id+' — ')[1]?.split('\n### ')[0];
  assert(section,id+': missing authored section');
  const blocks=[...section.matchAll(/\*\*(SOURCE [AB] — [^\n]+?) \(learner-visible `reading_asset` body\)\*\*\n```text\n(.*?)\n```/gs)];
  assert.equal(blocks.length,2);
  assert.equal(l.reading_asset.body,blocks.map(x=>x[1]+'\n\n'+x[2]).join('\n\n'));
  sourceTextVerified++;
  for(let j=0;j<l.activities.length;j++){
   const q=l.activities[j],heading='**'+q.id+' — '+q.prompt+'**';
   const st=section.indexOf(heading);assert(st>=0,q.id+': prompt changed');
   const nextMark='**'+id+'-Q'+(j+2)+' —';
   let ed=section.indexOf(nextMark,st+heading.length);
   if(ed<0)ed=section.indexOf('**CORE-4 — Feedback/revision principle:',st);
   const block=section.slice(st,ed<0?undefined:ed);
   for(const opt of q.options){assert(block.includes('- **'+opt.id+'.** '+opt.text),q.id+': option text mismatch '+opt.id);verifiedOptions++}
   assert(block.includes('**Answer key:** `'+keys[j]+'`'),q.id+': academic key mismatch');
   assert(block.includes('**tag:** `skill_tags:['+q.skill_tags[0]+']`'),q.id+': skill tag drift');
   assert(block.includes(q.feedback.explanation_en.replace('Next step:','**Next step:**')),q.id+': feedback drift');
   assert.equal(q.evidence_weight,1);objective++;
  }
 }else{
  const q=l.activities[0];
  assert(md.includes('> '+q.prompt),q.id+': task text changed');
  assert.equal(q.answer,null);assert.equal(q.evidence_weight,0);
  assert.equal(q.review_mode,'assisted_ai_or_human');
  assert.equal(q.rubric_id,'RUBRIC-WRITING-'+cefr);
  // A standalone Writing lesson must expose the same factual source as paired Reading.
  const linked=fresh.find(a=>a.id===payload.unit_assignments[unit][0]);
  assert(linked?.reading_asset?.body);
  assert(l.explanation.en.includes(linked.reading_asset.body),id+': source text not accessible in Writing');
  writing++;
 }
}
assert.deepEqual([objective,writing,verifiedOptions,sourceTextVerified],[34,6,136,6]);
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'domain/academic.ts','domain/content-model.ts','domain/option-order.ts','domain/unit-guide-60.ts',
 '--outDir',runtime,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,runtime,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}=require(path.join(root,runtime,'domain/academic.js'));
const {validateContent}=require(path.join(root,runtime,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,runtime,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,runtime,'domain/unit-guide-60.js'));
assert.equal(MAX_CURRICULUM_LESSONS,250);
assert.deepEqual(validateSeed(next),[],'Real importer source validation');
assert.deepEqual(validateContent(mapSeed(next)),[],'Real domain content validation');
let shuffled=0;
for(const l of fresh){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:next.schema_version,optionOrder:order});
 for(const q of l.activities.filter(q=>q.type==='single_choice')){
  const opts=orderedOptions(q,{optionOrder:order});
  assert.equal(opts.find(o=>o.id===q.answer.correct_option_id).text,
   q.options.find(o=>o.id===q.answer.correct_option_id).text);
  if(opts.map(x=>x.id).join(',')!==q.options.map(x=>x.id).join(','))shuffled++;
 }
}
assert(shuffled>0);
const catalog=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const units=unitGuideForCatalog(catalog,next.course.sequence);
assert.equal(units.units.length,60);
assert.equal(units.mappedLessonCount,152);
assert.deepEqual(units.unmappedLessons.map(l=>l.id).sort(),['REA-C1-01','VOC-C2-01']);
for(const [unit,ids] of Object.entries(unitMap))for(const id of ids)
 assert.equal(primaryUnitForLessonId(id),unit,'Wrong Unit mapping: '+id);
console.log(JSON.stringify({result:'PASS',gate:'F2_BULK12_V125_REVIEWED_SOURCE_PARITY_SCHEMA',
 sourceSha256:hash,lessons:154,activities:1125,originalLessonsImmutable:142,
 readingObjective:objective,writingUnscored:writing,sourceBlocksVerified:sourceTextVerified,
 optionTextsChecked:verifiedOptions,shuffles:shuffled,mappedLessons:152,
 unmappedAdvancedPilots:2,maxLessons:MAX_CURRICULUM_LESSONS,
 actualSafari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',productionImport:false,deploy:false}));
