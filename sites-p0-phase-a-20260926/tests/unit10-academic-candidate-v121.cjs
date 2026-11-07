'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const original=require('../content/curriculum-1.20.0-candidate.json');
const authored=require('../content/batches/unit10-a1a2b1-9-lessons-v121-draft.json');
const {composeUnit10,unitMap}=require('../scripts/compose-unit10-v121-candidate.cjs');
const pack=composeUnit10();
const oldItems=original.lessons.flatMap(l=>l.activities);
const newItems=pack.lessons.slice(123).flatMap(l=>l.activities);
assert.deepEqual([pack.schema_version,pack.lessons.length,newItems.length],['1.21.0',132,30]);
assert.equal(pack.lessons.flatMap(l=>l.activities).length,1055);
assert.deepEqual(pack.lessons.slice(0,123),original.lessons);
assert.deepEqual(pack.course.sequence.slice(0,123),original.course.sequence);
assert.deepEqual(pack.rubrics,original.rubrics);
assert.equal(new Set(pack.lessons.map(l=>l.id)).size,132);
assert.equal(new Set(pack.lessons.flatMap(l=>l.activities.map(a=>a.id))).size,1055);
assert.equal(authored.lessons.filter(l=>l.module==='listening').length,3);
assert.equal(authored.lessons.filter(l=>l.module==='writing').length,3);
const corrections={
 'A2U10-R03':'reading.detail','A2U10-R04':'reading.detail',
 'A2U10-L01':'listening.gist','B1U10-R03':'reading.inference',
 'B1U10-R04':'reading.inference','B1U10-L04':'listening.speaker_intention'
};
for(const [id,tag] of Object.entries(corrections)){
 const record=authored.review_id_mapping[id],item=newItems.find(q=>q.id===record.item_id);
 assert(record&&item&&item.skill_tags.includes(tag),
  'Independent NotebookLM required tag correction '+id);
 assert.equal(authored.required_normalizations[id].to,tag);
}
for(const [unit,ids] of Object.entries(unitMap)){
 assert.equal(ids.length,3,unit);
 assert.deepEqual(ids.map(id=>pack.lessons.find(l=>l.id===id).module),
  ['reading','listening','writing']);
 assert.equal(ids.map(id=>pack.lessons.find(l=>l.id===id).activities.length).join(','),'4,5,1');
 const reading=pack.lessons.find(l=>l.id===ids[0]);
 const listening=pack.lessons.find(l=>l.id===ids[1]);
 const writing=pack.lessons.find(l=>l.id===ids[2]);
 assert(listening.reading_asset&&listening.reading_asset.body===reading.reading_asset.body,
  'Cross-source item must show a real written source in Listening player');
 assert(listening.audio_asset.requires_real_playback);
 assert.equal(listening.audio_asset.transcript_reveal,'after_submission');
 assert.equal(listening.activities.length,5);
 assert(listening.activities.every(q=>q.evidence_weight===1));
 const w=writing.activities[0];
 assert(w.type==='extended_response'&&w.answer===null&&w.evidence_weight===0);
 assert.equal(w.rubric_id,'RUBRIC-WRITING-'+unit.split('-')[0]);
 assert.equal(w.word_range_guidance.not_a_quality_score,true);
}
assert.equal(authored.production,'NO_GO_AUDIO_NOT_PRODUCED');
const manifest=require('../content/foundation-audio.json');
for(const id of ['LIS-A1-06','LIS-A2-07','LIS-B1-08']){
 assert(!manifest[id],id+' must NOT have a fake audio manifest entry');
 assert(!fs.existsSync(path.join(root,'public/foundation-audio',id+'-v1.mp3')),
  id+' must NOT be declared produced');
}
const out='.sites-runtime/unit10-ts-schema';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'domain/academic.ts','domain/content-model.ts','domain/option-order.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed}=require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {createOptionOrder,orderedOptions,validateOptionOrder}=require(path.join(root,out,'domain/option-order.js'));
assert.deepEqual(validateSeed(pack),[],
 'Exact production shape and canonical taxonomy must validate');
assert.deepEqual(validateContent(mapSeed(pack)),[],
 'Converted 132-lesson bundle must validate');
let shuffled=0;
for(const l of pack.lessons.slice(123)){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:pack.schema_version,optionOrder:order});
 for(const q of l.activities)if(q.type==='single_choice'){
  const displayed=orderedOptions(q,{optionOrder:order});
  assert.equal(new Set(displayed.map(x=>x.id)).size,4);
  assert.equal(displayed.find(x=>x.id===q.answer.correct_option_id).text,
   q.options.find(x=>x.id===q.answer.correct_option_id).text);
  if(JSON.stringify(displayed.map(x=>x.id))!==JSON.stringify(q.options.map(x=>x.id)))shuffled++;
  assert(!/correct answer is [A-D]|option [A-D] is correct/i.test(q.feedback.explanation_en),
   'Option-neutral explanations are mandatory');
 }
}
assert(shuffled>0,'At least one scoring key must survive option shuffling');
assert.equal(oldItems.length,1025);
console.log(JSON.stringify({result:'PASS',gate:'UNIT10-ACADEMIC-RECONCILIATION-V121',
 sourcePacket:authored.packet_id,normalizedTags:Object.keys(corrections).length,
 lessonCount:pack.lessons.length,activityCount:pack.lessons.flatMap(l=>l.activities).length,
 newUnitCount:3,newLessons:9,newObjective:27,newUnassessedWriting:3,
 historicalLessonsUnchanged:true,realSchemaPassed:true,shuffleCases:shuffled,
 listeningPhysicalMP3:'NOT_PRODUCED',med01:'NO_GO',
 realSafariQA:'NOT_TESTED',productionImport:'BLOCKED',learnerWrites:0}));
