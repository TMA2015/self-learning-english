'use strict';
/* R2 academic PASS; source-only machine QA, NOT a website activation. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'content/review-packets/SLE_B2_U08_U09_BATCH02_INTERACTION_REVIEW_R2_20261121.md'),'utf8');
const digest=crypto.createHash('sha256').update(source).digest('hex');
assert.equal(digest,'89592061e2349441e94fb6d82b343a511d45f50b7a1a09199ffc127026a65438');
const prev=require('../content/curriculum-1.29.0-candidate.json');
const next=require('../content/curriculum-1.30.0-candidate.json');
const map=require('../content/sle-unit-navigation-map-v1.json');
const ids=['REA-B2-11','REA-B2-12','WRI-B2-10','REA-B2-13','REA-B2-14','WRI-B2-11'];
const units={'REA-B2-11':'B2-U08','REA-B2-12':'B2-U08','WRI-B2-10':'B2-U08','REA-B2-13':'B2-U09','REA-B2-14':'B2-U09','WRI-B2-11':'B2-U09'};
assert.equal(prev.schema_version,'1.29.0');assert.equal(next.schema_version,'1.30.0');
assert.deepEqual([prev.lessons.length,next.lessons.length],[184,190]);
assert.deepEqual([prev.lessons.flatMap(x=>x.activities).length,next.lessons.flatMap(x=>x.activities).length],[1256,1278]);
assert.deepEqual(next.lessons.slice(0,184),prev.lessons,'All 184 previous lessons immutable');
assert.deepEqual(next.course.sequence.slice(0,184),prev.course.sequence,'Prior order immutable');
assert.deepEqual(next.rubrics,prev.rubrics,'All reviewed rubrics immutable');
for(const f of ['package_id','language','support_language','integrated_journey','import_contract','review_policy'])
 assert.deepEqual(next[f],prev[f],f+' must remain unchanged');
assert.deepEqual(next.lessons.slice(184).map(x=>x.id),ids);
assert.deepEqual(next.course.sequence.slice(184),ids);
assert.equal(next.course.sequence.length,190);
assert.equal(new Set(next.lessons.map(x=>x.id)).size,190);
assert.equal(new Set(next.course.sequence).size,190);
assert.equal(new Set(next.lessons.flatMap(x=>x.activities.map(a=>a.id))).size,1278);
const clean=s=>s.replace(/^\s*>\s?/gm,'').replace(/\*\*/g,'').replace(/(?<!\w)\*(?=\w)|(?<=\w)\*(?!\w)/g,'').replace(/`/g,'').trim();
const hs=[...source.matchAll(/^## ([1-6])\. ((?:REA|WRI)-B2-\d+) — ([^\n]+?) \(`(B2-U\d{2})`\)$/gm)];
assert.equal(hs.length,6);
const keys={'REA-B2-11':'BACDB','REA-B2-12':'BCADB','REA-B2-13':'CABDC','REA-B2-14':'DACBD'};
let objectives=0,writing=0,reading=0,optionCount=0;
for(let i=0;i<6;i++){
 const h=hs[i],id=h[2],lesson=next.lessons[184+i];
 assert.equal(lesson.id,id);assert.equal(lesson.title,h[3]);assert.equal(h[4],units[id]);
 assert.equal(lesson.cefr_target,'B2');
 const section=source.slice(h.index+h[0].length,hs[i+1]?.index??source.indexOf('\n## A2.'));
 const qs=[...section.matchAll(/^\*\*((?:REA|WRI)-B2-\d+-Q\d+)(?: \(extended response; UNSCORED\))?\.\*\*\s*(.+)$/gm)];
 assert.equal(qs.length,lesson.activities.length,id+' source question count');
 for(const core of ['CORE-1','CORE-2','CORE-3','CORE-4'])assert(lesson.explanation.en.includes(core),id+' '+core);
 assert(lesson.objectives.length>0&&lesson.examples.length>0);
 const sourceStart=section.search(/^\*\*CORE-3:/m),sourceEnd=qs[0].index;
 assert(sourceStart>=0&&sourceEnd>sourceStart);
 const sourceBody=clean(section.slice(sourceStart,sourceEnd).trim().replace(/^\*\*CORE-3:[^\n]+/,''));
 if(lesson.module==='reading'){
  assert.equal(lesson.reading_asset.body,sourceBody,id+' passage must match R2 exactly');
  assert.equal(lesson.reading_asset.display_to_learner,true);
  assert.equal(lesson.reading_asset.id,'SRC-'+id);reading++;
 }else{
  assert(lesson.explanation.en.includes('Source A')&&lesson.explanation.en.includes('Source B'));
 }
 assert.equal(lesson.activities.filter(q=>q.type==='single_choice').map(q=>q.answer.correct_option_id).join(''),keys[id]??'');
 for(let j=0;j<qs.length;j++){
  const m=qs[j],q=lesson.activities[j],chunk=section.slice(m.index+m[0].length,qs[j+1]?.index??section.length);
  assert.equal(q.id,m[1]);assert.equal(q.prompt,clean(m[2]),q.id+' prompt parity');
  if(lesson.module==='reading'){
   const options=[...chunk.matchAll(/^([A-D])\. ([^\n]+)$/gm)].map(y=>({id:y[1],text:clean(y[2])}));
   assert.deepEqual(q.options,options,q.id+' four options parity');assert.equal(options.length,4);
   const fb=chunk.match(/\*\*Key:\*\* ([A-D])\. \*\*Rationale:\*\* ([^\n]*?) \*\*(?:Likely misconception|Misconception):\*\* ([^\n]*?) \*\*Repair:\*\* ([^\n]*)/);
   assert(fb,q.id+' rationale/repair missing');assert.equal(q.answer.correct_option_id,fb[1]);
   assert.equal(q.feedback.explanation_en,clean(fb[2])+' Misconception: '+clean(fb[3])+' Next action: '+clean(fb[4]));
   assert.equal(q.evidence_weight,1);assert.equal(q.skill_tags.length,1);
   objectives++;optionCount+=options.length;
  }else{
   assert.equal(q.type,'extended_response');assert.equal(q.answer,null);
   assert.equal(q.evidence_weight,0);assert.equal(q.rubric_id,'RUBRIC-WRITING-B2');
   assert.equal(q.review_mode,'assisted_ai_or_human');
   assert.equal(q.word_range_guidance?.not_a_quality_score,true);
   assert.match(q.feedback.pending_message,/UNASSESSED/);writing++;
  }
 }
}
assert.deepEqual([objectives,writing,reading,optionCount],[20,2,4,80]);
assert(!next.lessons.slice(184).some(l=>l.activities.some(a=>a.interaction||a.widget||a.semantic_score)));
const reviewedAssignments={
 'REA-B2-11':'B2-U08','REA-B2-12':'B2-U08','WRI-B2-10':'B2-U08',
 'REA-B2-13':'B2-U09','REA-B2-14':'B2-U09','WRI-B2-11':'B2-U09'
};
assert.deepEqual(map.reviewed_v130,reviewedAssignments,'Only reviewed B2 U08/U09 links may be added');
const runtime=fs.readFileSync(path.join(root,'infrastructure/browser/local-runtime.ts'),'utf8');
assert(runtime.includes("from '../../content/curriculum-1.30.0-candidate.json'"),'Staged v1.30 runtime must bundle exact reviewed candidate');
assert(!runtime.includes("from '../../content/curriculum-1.29.0-candidate.json'"));
const out='.sites-runtime/b2-u08u09-v130-schema';
fs.rmSync(path.join(root,out),{recursive:true,force:true});fs.mkdirSync(path.join(root,out),{recursive:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts','domain/option-order.ts','domain/unit-guide-60.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022','--resolveJsonModule',
 '--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}=require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,out,'domain/option-order.js'));
assert.equal(MAX_CURRICULUM_LESSONS,250);
assert.deepEqual(validateSeed(next),[],'Real importer rejects source-only candidate');
assert.deepEqual(validateContent(mapSeed(next)),[],'Mapped content rejects source-only candidate');
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,out,'domain/unit-guide-60.js'));
const unitCatalog=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const unitIndex=unitGuideForCatalog(unitCatalog,next.course.sequence);
assert.equal(unitIndex.units.length,60);
assert.equal(unitIndex.mappedLessonCount,188,'6 new reviewed links must be in correct B2 units');
assert.deepEqual(unitIndex.unmappedLessons.map(l=>l.id).sort(),['REA-C1-01','VOC-C2-01']);
for(const [id,unit] of Object.entries(reviewedAssignments))assert.equal(primaryUnitForLessonId(id),unit);
for(const [unit,lessonIds] of [['B2-U08',['REA-B2-11','REA-B2-12','WRI-B2-10']],['B2-U09',['REA-B2-13','REA-B2-14','WRI-B2-11']]]){
 const actual=unitIndex.units.find(u=>u.id===unit);
 assert.deepEqual(actual?.lessons.map(l=>l.id),lessonIds,unit+' exact ordered lesson mapping');
 assert.equal(actual.available,true,unit+' must be available when v1.30 candidate catalog is supplied');
}
let shuffled=0;
for(const lesson of next.lessons.slice(184)){
 const order=createOptionOrder(lesson.activities,()=>0);
 validateOptionOrder(lesson.activities,{version:'1.30.0',optionOrder:order});
 for(const q of lesson.activities.filter(a=>a.type==='single_choice')){
  const arranged=orderedOptions(q,{optionOrder:order});
  assert.equal(arranged.find(a=>a.id===q.answer.correct_option_id).text,
   q.options.find(a=>a.id===q.answer.correct_option_id).text);
  shuffled++;
 }
}
assert.equal(shuffled,20);
console.log(JSON.stringify({result:'PASS',gate:'B2_U08U09_B02_V130_MACHINE_CANDIDATE',sourceSha256:digest,
  totalLessons:190,totalActivities:1278,newLessons:6,objectives,writing,optionCount,reading,
  sourceFidelity:'22/22',shuffled,previous184Immutable:true,mappedLessons:188,unmappedPilots:2,reviewedUnitLinks:6,
  interactionStatus:'PASS_CONCEPT_ONLY',runtime:'v1.29 UNCHANGED',realLearnerData:'NOT_TOUCHED',deploy:false}));
