'use strict';
/**
 * B2 -> C1 Batch01 v1.29 candidate ONLY.
 * The LIVE runtime remains pinned to 1.28.0. No learner, hosting or Firebase writes.
 * Academic review verdict is owner-provided; this checks machine fidelity and semantics.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'content/review-packets/SLE_B2_C1_BRIDGE_BATCH01_NOTEBOOKLM_R1_20261121.md'),'utf8');
const digest=crypto.createHash('sha256').update(source).digest('hex');
assert.equal(digest,'7f77a4be005209a529ffe42bcf368a484ac5a2b7aac79df6b775e57ef5d182da','Author-reviewed source must remain immutable');
const previous=require('../content/curriculum-1.28.0-candidate.json');
const candidate=require('../content/curriculum-1.29.0-candidate.json');
const nav=require('../content/sle-unit-navigation-map-v1.json');
const newAssignments={
  'REA-B2-10':'B2-U07','WRI-B2-08':'B2-U07','WRI-B2-09':'B2-U07',
  'REA-C1-02':'C1-U01','GRA-C1-01':'C1-U01','WRI-C1-01':'C1-U01',
  'REA-C1-03':'C1-U02','REA-C1-04':'C1-U02'
};
assert.deepEqual(nav.reviewed_v129,newAssignments);
assert.equal(previous.schema_version,'1.28.0');
assert.equal(candidate.schema_version,'1.29.0');
assert.deepEqual([previous.lessons.length,candidate.lessons.length],[176,184]);
assert.deepEqual([previous.lessons.flatMap(x=>x.activities).length,candidate.lessons.flatMap(x=>x.activities).length],[1224,1256]);
assert.deepEqual(candidate.lessons.slice(0,176),previous.lessons,'Old 176 lessons/activities immutable');
assert.deepEqual(candidate.course.sequence.slice(0,176),previous.course.sequence,'Old teaching order immutable');
for(const [k,v] of Object.entries(previous.rubrics))assert.deepEqual(candidate.rubrics[k],v,'Old rubric remains unchanged: '+k);
for(const field of ['package_id','language','support_language','integrated_journey'])assert.deepEqual(candidate[field],previous[field],field+' immutable');
assert.equal(candidate.course.sequence.length,184);
assert.equal(new Set(candidate.course.sequence).size,184);
assert.equal(new Set(candidate.lessons.map(x=>x.id)).size,184);
assert.equal(new Set(candidate.lessons.flatMap(x=>x.activities.map(q=>q.id))).size,1256);
const expectedOrder=Object.keys(newAssignments);
assert.deepEqual(candidate.lessons.slice(176).map(x=>x.id),expectedOrder);
assert.deepEqual(candidate.course.sequence.slice(176),expectedOrder);
const rubric=candidate.rubrics['RUBRIC-WRITING-C1'];
assert(rubric);
assert.equal(rubric.criteria.length,6);
assert.deepEqual(rubric.scale,{min:0,max:4});
assert.match(rubric.guidance,/NOT|pending|no automatic/i);
const clean=s=>s.replace(/\*\*/g,'').replace(/(?<!\w)\*([^\n*]+)\*/g,'$1').replace(/[ \t]+$/gm,'').trim();
const headers=[...source.matchAll(/^## ([1-8])\. ([A-Z]{3}-(?:B2|C1)-\d+) — (.+?) \(`((?:B2|C1)-U\d{2})`\)$/gm)];
assert.equal(headers.length,8);
const expectedKeys={
 'REA-B2-10':'BCADB','REA-C1-02':'BAC CBA'.replace(/ /g,''),
 'GRA-C1-01':'CABAAB','REA-C1-03':'CABCDA','REA-C1-04':'BACCCB'
};
let objective=0,writing=0,optionsCount=0,shuffled=0,reading=0;
for(let i=0;i<headers.length;i++){
 const h=headers[i],id=h[2],lesson=candidate.lessons[176+i];
 assert.equal(lesson.id,id);assert.equal(lesson.title,h[3]);
 assert.equal(nav.reviewed_v129[id],h[4]);
 assert(lesson.explanation.en.includes('CORE-1')&&lesson.explanation.en.includes('CORE-2')
  &&lesson.explanation.en.includes('CORE-3')&&lesson.explanation.en.includes('CORE-4'));
 assert(lesson.objectives.length>0&&lesson.examples.length>0);
 const section=source.slice(h.index,headers[i+1]?.index??source.indexOf('\n## 9.'));
 const qs=[...section.matchAll(/^\*\*((?:REA|WRI|GRA)-(?:B2|C1)-\d+-Q\d+)(?: \(extended response; UNSCORED\))?\.\*\*\s*(.+)$/gm)];
 assert.equal(qs.length,lesson.activities.length,id+' source/item count mismatch');
 const keys=lesson.activities.filter(q=>q.type==='single_choice').map(q=>q.answer.correct_option_id).join('');
 if(expectedKeys[id])assert.equal(keys,expectedKeys[id],id+' independently reviewed answer sequence');
 const core3=(section.match(/^\*\*CORE-3[^\n]*\*\*\s*([\s\S]*?)(?=^\*\*(?:REA|WRI|GRA)-(?:B2|C1)-\d+-Q\d+)/m)||[])[1]||'';
 if(lesson.module==='reading'){
  const text=clean(core3.replace(/^> /gm,'').replace(/Choose exactly one best answer per item\./g,''));
  assert.equal(lesson.reading_asset.body,text,id+' reading text must match reviewed source exactly (excluding Markdown)');
  assert.equal(lesson.reading_asset.display_to_learner,true);
  reading++;
 } else if(lesson.module==='writing'){
  assert(lesson.explanation.en.includes('Source A')||lesson.explanation.en.includes('six'),id+' assessed source must be in lesson teaching');
 }
 for(let j=0;j<qs.length;j++){
  const m=qs[j],q=lesson.activities[j];
  assert.equal(q.id,m[1]);
  assert.equal(q.prompt,clean(m[2]),q.id+' prompt source parity');
  const next=qs[j+1]?.index??(section.indexOf('**CORE-4',m.index)>0?section.indexOf('**CORE-4',m.index):section.length);
  const chunk=section.slice(m.index,next);
  if(q.type==='single_choice'){
   const opts=[...chunk.matchAll(/^([A-D])\. (.+?)\s*$/gm)].map(x=>({id:x[1],text:clean(x[2])}));
   assert.deepEqual(q.options,opts,q.id+' all 4 reviewed options');
   assert.equal(opts.length,4);
   const key=(chunk.match(/\*\*Key:\*\*\s*([A-D])\./)||[])[1];
   assert.equal(q.answer.correct_option_id,key);
   const fb=(chunk.match(/\*\*(?:Explanation|Feedback):\*\*\s*(.+)/)||[])[1];
   assert(fb&&q.feedback.explanation_en===clean(fb),q.id+' reviewed feedback including next action');
   assert.equal(q.evidence_weight,1);
   optionsCount+=opts.length;objective++;
  }else{
   assert.equal(q.type,'extended_response');assert.equal(q.answer,null);
   assert.equal(q.evidence_weight,0);
   assert.equal(q.review_mode,'assisted_ai_or_human');
   assert.equal(q.rubric_id,id.startsWith('WRI-C1')?'RUBRIC-WRITING-C1':'RUBRIC-WRITING-B2');
   assert.match(q.feedback.pending_message,/UNASSESSED/);
   assert(!q.word_range_guidance||q.word_range_guidance.not_a_quality_score===true);
   writing++;
  }
 }
}
assert.deepEqual([objective,writing,optionsCount,reading],[29,3,116,4]);
const out='.sites-runtime/b2-c1-v129-candidate-schema',dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts',
 'domain/option-order.ts','domain/unit-guide-60.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS,tagMap}=require(path.join(dest,'domain/academic.js'));
const {validateContent}=require(path.join(dest,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(dest,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(dest,'domain/unit-guide-60.js'));
assert.equal(MAX_CURRICULUM_LESSONS,250);
assert.deepEqual(validateSeed(candidate),[],'Candidate must pass real importer schema');
assert.deepEqual(validateContent(mapSeed(candidate)),[],'Candidate must pass real content mapping schema');
assert.deepEqual([tagMap['grammar.discourse_reference'],tagMap['grammar.information_structure'],tagMap['grammar.concession']],
 ['discourse-reference','information-structure','concession']);
const invalid=structuredClone(candidate);
invalid.lessons.at(-4).activities[0].skill_tags=['grammar.unreviewed_unsupported'];
assert(validateSeed(invalid).length>0,'Unknown C1 tags must still be rejected');
const catalog=candidate.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const units=unitGuideForCatalog(catalog,candidate.course.sequence);
assert.equal(units.units.length,60);
assert.equal(units.mappedLessonCount,182);
assert.deepEqual(units.unmappedLessons.map(x=>x.id).sort(),['REA-C1-01','VOC-C2-01']);
for(const [id,unit] of Object.entries(newAssignments))assert.equal(primaryUnitForLessonId(id),unit);
for(const l of candidate.lessons.slice(176)){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:'1.29.0',optionOrder:order});
 for(const q of l.activities.filter(x=>x.type==='single_choice')){
  const arranged=orderedOptions(q,{optionOrder:order});
  const original=q.options;
  assert.equal(arranged.find(x=>x.id===q.answer.correct_option_id).text,original.find(x=>x.id===q.answer.correct_option_id).text);
  if(arranged.map(x=>x.id).join('')!==original.map(x=>x.id).join(''))shuffled++;
 }
}
assert.equal(shuffled,29);
console.log(JSON.stringify({result:'PASS',gate:'B2_C1_B01_V129_MACHINE_CANDIDATE',
 sourceSha256:digest,newLessons:8,objective,writing,optionsCount,reading,
 totalLessons:184,totalActivities:1256,mapped:182,unmappedPilots:2,
 sourceFidelity:'ALL_32_ITEMS',taxonomy:'C1_THREE_TAGS_VALIDATED',
 rubricC1:'STRUCTURE_ONLY_HUMAN_REVIEW_NOT_ACTIVATED',
 imported:false,realLearnerData:'NOT_ACCESSED',merge:false,deploy:false}));
