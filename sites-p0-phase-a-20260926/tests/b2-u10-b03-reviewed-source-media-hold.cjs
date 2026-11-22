'use strict';
/* Batch03 NotebookLM PASS. This gate verifies the reviewed source and holds
 * active Listening until exact MP3/provenance/player/device evidence exists.
 * No byte-level MP3 or actual device assertion is made by this test. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const packetPath=path.join(root,'content/review-packets/SLE_B2_U10_BATCH03_NOTEBOOKLM_R1_20261122.md');
const stagePath=path.join(root,'content/review-packets/SLE_B2_U10_BATCH03_AUTHORING_STAGING_NOT_IMPORTABLE.json');
const src=fs.readFileSync(packetPath,'utf8'),stage=JSON.parse(fs.readFileSync(stagePath,'utf8'));
const hex=s=>crypto.createHash('sha256').update(s).digest('hex');
const expectedHash='f3d656a4a43c83c099c1dabdbc89ceed87e5baab5d83f5966112cf96ef08298a';
assert.equal(hex(src),expectedHash,'Reviewed academic source must be byte-exact');
assert.equal(stage.packet_id,'SLE-B2-U10-B03-R1-20261122');
assert.equal(stage.source_sha256,expectedHash);
assert.equal(stage.academic_verdict,'PASS');
assert.equal(stage.unit,'B2-U10');
assert.equal(stage.format,'SLE_AUTHORING_STAGING_NOT_IMPORTABLE');
assert.equal(stage.import_authorized,false);
assert.equal(stage.release_authorized,false);
assert.match(stage.media_gate,/BLOCKED/);
assert(src.includes(stage.reading.approved_source_section),'Reading source section mismatch');
assert(src.includes(stage.held_listening.approved_source_section),'Listening source section mismatch');
assert(src.includes(stage.writing.approved_source_section),'Writing source section mismatch');
function review(items,id,keys) {
 assert.equal(items.length,6,id+' six independently reviewed items');
 assert.equal(items.map(x=>x.id).join(','),Array.from({length:6},(_,i)=>id+'-Q'+(i+1)).join(','));
 assert.equal(items.map(x=>x.approved_key).join(''),keys,id+' approved key sequence');
 for(const item of items){
  assert(item.skill_tag.startsWith(id.startsWith('REA')?'reading.':'listening.'),item.id+' skill category');
  assert.equal(item.options.length,4,item.id+' must have four options');
  assert.deepEqual(item.options.map(x=>x.id),['A','B','C','D']);
  assert(item.options.every(x=>typeof x.text==='string'&&x.text.length>5),item.id+' nonempty distractors');
  const expectedHeading='**'+item.id+'** ('+item.skill_tag+'). '+item.prompt;
  assert(src.includes(expectedHeading),item.id+' exact source question/skill tag missing');
  assert(src.includes('**Key:** '+item.approved_key+'. **Rationale:** '+item.rationale),
   item.id+' rationale/key must match');
  assert(item.misconception.length>12&&item.repair.length>10,item.id+' complete authored repair');
  for(const opt of item.options)
   assert(src.includes(opt.id+'. '+opt.text),item.id+' option text not in approved packet');
 }
}
review(stage.reading.approved_items,'REA-B2-15','BADCBA');
review(stage.held_listening.approved_items,'LIS-B2-01','CADBCB');
assert.equal(stage.held_listening.id,'LIS-B2-01');
assert.equal(stage.held_listening.status,'SCRIPT_ONLY_NOT_ASSESSED');
assert.equal(stage.held_listening.scoring_authorized,false);
assert.equal(stage.held_listening.verified_media,null);
assert.equal(stage.held_listening.required_mp3,'LIS-B2-01-v1.mp3');
const sourceTurns=stage.held_listening.approved_source_section.split('\n')
 .filter(line=>line.startsWith('> **')&&line.includes(':** '))
 .map(line=>({text:line.slice(line.indexOf(':** ')+4),isMara:line.includes('(Mara)')||line.startsWith('> **Mara:')}));
assert.equal(sourceTurns.length,9,'Nine approved source dialogue turns');
assert.equal(stage.held_listening.production_turns.length,9);
sourceTurns.forEach((m,i)=>{
 const expected=stage.held_listening.production_turns[i];
 assert.equal(expected.text,m.text,'Turn '+(i+1)+' text must be exact');
 assert.equal(m.isMara,i%2===0,'Turn '+(i+1)+' role order');
 assert.equal(expected.speaker,i%2===0?'A':'B');
 assert.equal(expected.role,i%2===0?'Mara':'Jon');
});
assert.equal(stage.writing.id,'WRI-B2-12');
const w=stage.writing.approved_item;
assert.equal(w.id,'WRI-B2-12-Q1');
assert.equal(w.answer,null);
assert.equal(w.evidence_weight,0);
assert.equal(w.rubric_id,'RUBRIC-WRITING-B2');
assert.deepEqual([w.word_range_guidance.min,w.word_range_guidance.max],[180,240]);
assert.equal(w.word_range_guidance.not_a_quality_score,true);
assert(src.replace(/\*\*/g,'').includes(w.prompt),'Writing prompt must match approved source after Markdown emphasis normalization');
const content=require('../content/curriculum-1.30.0-candidate.json');
assert.equal(content.schema_version,'1.30.0');
assert.deepEqual([content.lessons.length,content.lessons.flatMap(l=>l.activities).length],[190,1278]);
const candidates=['REA-B2-15','LIS-B2-01','WRI-B2-12'];
for(const id of candidates){
 assert(!content.lessons.some(l=>l.id===id),'Unreviewed import collision '+id);
 assert(!content.course.sequence.includes(id),'No activation in current curriculum '+id);
 assert(!content.lessons.some(l=>l.activities.some(a=>a.id.startsWith(id+'-'))),
  'No activity-ID collision '+id);
}
assert(content.rubrics['RUBRIC-WRITING-B2'],'Existing reviewed Writing rubric');
const manifest=require('../content/foundation-audio.json');
assert.equal(manifest['LIS-B2-01'],undefined,'Unverified audio must not enter production manifest');
assert.equal(fs.existsSync(path.join(root,'public/foundation-audio/LIS-B2-01-v1.mp3')),false,
 'Until provenance and media gates, no binary may activate on this Draft');
const runtime=fs.readFileSync(path.join(root,'infrastructure/browser/local-runtime.ts'),'utf8');
assert(runtime.includes("from '../../content/curriculum-1.30.0-candidate.json'"));
assert(!runtime.includes("from '../../content/curriculum-1.31.0-candidate.json'"));
const receipt=fs.readFileSync(path.join(root,'content/review-packets/SLE_LIS_B2_01_MEDIA_INTAKE_RECEIPT_20261122.md'),'utf8');
assert(receipt.includes('995521c99ec8715758cd295a4de04a1788b8772a9e73d703cc72dd977b415056'));
assert(/WORD_PARITY_PENDING|spoken.word|word.for.word/i.test(receipt),'Exact audio-to-script parity still pending');
assert(/VOICE_RIGHTS_PENDING|voice license/i.test(receipt),'Voice rights still pending');
console.log(JSON.stringify({
 result:'PASS',gate:'B2_U10_BATCH03_REVIEWED_SOURCE_AND_MEDIA_HOLD',sourceSha256:expectedHash,
 academic:'PASS',readingItems:6,listeningScriptItems:6,unscoredWritingItems:1,
 reviewOptions:48,dialogueTurns:9,baselineLessons:190,baselineActivities:1278,
 idCollisions:0,media:'HELD',safari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',deploy:false
}));
