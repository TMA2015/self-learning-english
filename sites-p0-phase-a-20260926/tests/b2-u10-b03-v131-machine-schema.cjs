'use strict';
/* Academic Batch03 v1.31 source candidate. Does NOT activate scored Listening or LIVE. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const stage=JSON.parse(read('content/review-packets/SLE_B2_U10_BATCH03_AUTHORING_STAGING_NOT_IMPORTABLE.json'));
const source=read('content/review-packets/SLE_B2_U10_BATCH03_NOTEBOOKLM_R1_20261122.md');
const sha=crypto.createHash('sha256').update(source).digest('hex');
assert.equal(sha,'f3d656a4a43c83c099c1dabdbc89ceed87e5baab5d83f5966112cf96ef08298a');
assert.equal(stage.academic_verdict,'PASS');
assert.equal(stage.import_authorized,false);
const prev=require('../content/curriculum-1.30.0-candidate.json');
const next=require('../content/curriculum-1.31.0-candidate.json');
const map=require('../content/sle-unit-navigation-map-v1.json');
assert.equal(prev.schema_version,'1.30.0');
assert.equal(next.schema_version,'1.31.0');
assert.deepEqual([prev.lessons.length,next.lessons.length],[190,193]);
assert.deepEqual([prev.lessons.flatMap(l=>l.activities).length,next.lessons.flatMap(l=>l.activities).length],[1278,1291]);
assert.deepEqual(next.lessons.slice(0,190),prev.lessons,'Every prior lesson, item, key and field must be immutable');
assert.deepEqual(next.course.sequence.slice(0,190),prev.course.sequence,'Old course order immutable');
assert.deepEqual(next.rubrics,prev.rubrics,'Preexisting rubrics immutable');
for(const field of ['package_id','language','support_language','integrated_journey','import_contract','review_policy'])
 assert.deepEqual(next[field],prev[field],field+' unchanged');
const ids=['REA-B2-15','LIS-B2-01','WRI-B2-12'];
assert.deepEqual(next.lessons.slice(190).map(l=>l.id),ids);
assert.deepEqual(next.course.sequence.slice(190),ids);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,193);
assert.equal(new Set(next.lessons.flatMap(l=>l.activities.map(q=>q.id))).size,1291);
assert.deepEqual(map.reviewed_v131,{'REA-B2-15':'B2-U10','LIS-B2-01':'B2-U10','WRI-B2-12':'B2-U10'});
const incoming=next.lessons.slice(190);
for(const lesson of incoming){
 assert.equal(lesson.cefr_target,'B2');
 assert(['reading','listening','writing'].includes(lesson.module));
 for(const core of ['CORE-1','CORE-2','CORE-3','CORE-4'])assert(lesson.explanation.en.includes(core),lesson.id+' '+core);
 assert(lesson.objectives?.length>0&&lesson.examples?.length>0);
 assert(!lesson.activities.some(q=>q.interaction||q.widget||q.semantic_score));
}
const r=incoming[0],l=incoming[1],w=incoming[2];
const normalize=s=>s.replace(/\*\*/g,'').replace(/^### /gm,'').trim();
const srcReading=stage.reading.approved_source_section;
const begin=srcReading.indexOf('### Source A'),end=srcReading.indexOf('**REA-B2-15-Q1**');
assert(begin>=0&&end>begin);
assert.equal(r.reading_asset.body,normalize(srcReading.slice(begin,end)),'Exact R1 assessed Reading sources');
assert.equal(r.reading_asset.display_to_learner,true);
function assertObjective(lesson,items,keys) {
 assert.equal(lesson.activities.length,6);
 assert.equal(lesson.activities.map(q=>q.answer.correct_option_id).join(''),keys);
 for(let i=0;i<6;i++){
  const q=lesson.activities[i],a=items[i];
  assert.equal(q.id,a.id);
  assert.equal(q.prompt,a.prompt);
  assert.deepEqual(q.options,a.options);
  assert.deepEqual(q.skill_tags,[a.skill_tag]);
  assert.equal(q.evidence_weight,1);
  assert.equal(q.type,'single_choice');
  assert.equal(q.feedback.explanation_en,a.rationale+' Misconception: '+a.misconception+' Next action: '+a.repair);
 }
}
assertObjective(r,stage.reading.approved_items,'BADCBA');
assertObjective(l,stage.held_listening.approved_items,'CADBCB');
assert.deepEqual(l.audio_asset.roles,['Mara, organizer','Jon, venue and volunteer coordinator']);
const transcript=stage.held_listening.production_turns.map(t=>t.speaker+': '+t.text).join('\n');
assert.equal(l.audio_asset.source_text,transcript,'Exact nine-turn approved A/B transcript');
assert.equal(l.audio_asset.transcript_reveal,'after_submission');
assert.equal(l.audio_asset.requires_real_playback,true);
assert.equal(l.audio_asset.id,'AUD-LIS-B2-01');
assert.match(l.audio_asset.fallback,/UNASSESSED/);
assert.equal(w.activities.length,1);
const q=w.activities[0];
assert.equal(q.id,'WRI-B2-12-Q1');
assert.equal(q.type,'extended_response');
assert.equal(q.prompt,stage.writing.approved_item.prompt);
assert.equal(q.answer,null);
assert.equal(q.evidence_weight,0);
assert.equal(q.rubric_id,'RUBRIC-WRITING-B2');
assert.equal(q.review_mode,'assisted_ai_or_human');
assert.deepEqual(q.word_range_guidance,{min:180,max:240,not_a_quality_score:true});
assert.match(q.feedback.pending_message,/UNASSESSED/);
assert(w.explanation.en.includes('Source A')&&w.explanation.en.includes('Source B'));
const runtime=read('infrastructure/browser/local-runtime.ts');
assert(runtime.includes("from '../../content/curriculum-1.30.0-candidate.json'"));
assert(!runtime.includes("from '../../content/curriculum-1.31.0-candidate.json'"));
const manifest=require('../content/foundation-audio.json');
assert.equal(manifest['LIS-B2-01'],undefined,'Unverified MP3 absent from active manifest');
assert.equal(fs.existsSync(path.join(root,'public/foundation-audio/LIS-B2-01-v1.mp3')),false,'No unverified MP3 in source-only branch');
const out='.sites-runtime/b2-u10-b03-v131-source-machine-qa';
fs.rmSync(path.join(root,out),{recursive:true,force:true});
fs.mkdirSync(path.join(root,out),{recursive:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts','domain/option-order.ts','domain/unit-guide-60.ts','--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed}=require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,out,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,out,'domain/unit-guide-60.js'));
assert.deepEqual(validateSeed(next),[],'Academic importer source schema');
assert.deepEqual(validateContent(mapSeed(next)),[],'Learning content model');
const catalog=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const unitIndex=unitGuideForCatalog(catalog,next.course.sequence);
assert.equal(unitIndex.units.length,60);
assert.equal(unitIndex.mappedLessonCount,191);
assert.deepEqual(unitIndex.unmappedLessons.map(x=>x.id).sort(),['REA-C1-01','VOC-C2-01']);
assert.deepEqual(unitIndex.units.find(u=>u.id==='B2-U10').lessons.map(l=>l.id),ids);
assert.equal(unitIndex.units.find(u=>u.id==='B2-U10').isCheckpoint,true);
for(const id of ids)assert.equal(primaryUnitForLessonId(id),'B2-U10');
const order=createOptionOrder([...r.activities,...l.activities],()=>0);
validateOptionOrder([...r.activities,...l.activities],{version:'1.31.0',optionOrder:order});
for(const item of [...r.activities,...l.activities]){
 const shuffled=orderedOptions(item,{optionOrder:order});
 assert.equal(shuffled.find(o=>o.id===item.answer.correct_option_id).text,
 item.options.find(o=>o.id===item.answer.correct_option_id).text);
}
console.log(JSON.stringify({result:'PASS',gate:'B2_U10_BATCH03_V131_SOURCE_ONLY',newLessons:3,newActivities:13,
 totalLessons:193,totalActivities:1291,readingItems:6,listeningScriptItems:6,unscoredWritingItems:1,
 mappedLessons:191,unmappedPilots:2,readingKeys:'BADCBA',listeningKeys:'CADBCB',
 independentAcademic:'PASS',schema:'PASS',audio:'NOT_BUNDLED',runtime:'UNCHANGED_V130',
 physicalSafari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',deploy:false}));
