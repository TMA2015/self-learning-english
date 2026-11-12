'use strict';
/** Corpus-wide "no missing source inside Writing" gate.
 * This test intentionally audits ALL imported 1.25.0 lessons, not a few Unit10
 * screenshots. Reading/Listening evidence must be canonical and versioned.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const curriculum=JSON.parse(read('content/curriculum-1.25.0-candidate.json'));
const contracts=JSON.parse(read('content/writing-source-contracts-v1.json'));
const unitParts=JSON.parse(read('content/sle-unit-navigation-map-v1.json'));
const manifest=JSON.parse(read('content/foundation-audio.json'));
const unitMap=Object.assign({},unitParts.baseline,unitParts.conditional_v119,
 unitParts.confirmed_v121,unitParts.confirmed_v122,
 unitParts.confirmed_v123,unitParts.confirmed_v124,unitParts.confirmed_v125);
const lessons=curriculum.lessons;
const unique=new Map(lessons.map(l=>[l.id,l]));
assert.equal(unique.size,lessons.length,'Duplicated imported lesson IDs');
const byModule=mod=>lessons.filter(l=>l.module===mod);
const readings=byModule('reading'),listenings=byModule('listening');
const writings=byModule('writing');
assert.equal(contracts.schema,'sle-writing-source-contracts-v1');
assert.equal(contracts.curriculumVersion,'1.25.0',
 'Source contracts must be reviewed each time a new curriculum version imports');
assert.equal(lessons.length,154,'Audit scope must be updated if the catalog changes');
assert.equal(readings.length,33);
assert.equal(listenings.length,21);
assert.equal(writings.length,31);
for(const l of readings){
 assert(l.reading_asset?.display_to_learner&&l.reading_asset?.body?.trim(),
  l.id+' missing its own learner-visible Reading passage');
}
for(const l of listenings){
 assert(l.audio_asset?.source_text?.trim()&&l.audio_asset?.requires_real_playback,
  l.id+' missing Listening media and full-playback policy');
 assert.equal(manifest[l.id]?.source,l.audio_asset.source_text,
  l.id+' audio manifest must match the imported source before playback');
 assert(/^\/foundation-audio\/LIS-[AB][12]-\d+-v\d+\.mp3$/.test(manifest[l.id]?.url||''),
  l.id+' lacks the canonical public MP3 path');
}
const sourceDependent=writings.filter(w=>readings.some(r=>unitMap[r.id]===unitMap[w.id]));
const mappedIds=Object.keys(contracts.lessons);
assert.equal(sourceDependent.length,14,'Investigate any newly imported cross-source Writing lesson');
assert.deepEqual(mappedIds.slice().sort(),sourceDependent.map(w=>w.id).sort(),
 'ALL Writing lessons with a Reading source in the same Unit must have reviewed source contracts');
const sourceRows=[];
for(const w of sourceDependent){
 const x=contracts.lessons[w.id],r=unique.get(x.readingLessonId);
 assert(unitMap[w.id]&&x.unit===unitMap[w.id],w.id+' source Unit mismatch');
 assert(r&&r.module==='reading'&&unitMap[r.id]===x.unit,
  w.id+' source Reading lesson outside its Unit');
 assert.equal(r.reading_asset?.id,x.readingAssetId,w.id+' wrong original reading asset');
 assert(r.reading_asset.display_to_learner,w.id+' reading material may not be visible yet');
 assert(!w.reading_asset&&!w.audio_asset,
  'Versioned imported Writing activity must remain unchanged: '+w.id);
 let audio=null;
 if(x.listeningLessonId){
  const lis=unique.get(x.listeningLessonId);
  assert(lis&&lis.module==='listening'&&unitMap[lis.id]===x.unit,
   w.id+' linked audio must be from its original Unit');
  assert(manifest[lis.id]?.source===lis.audio_asset?.source_text,
   w.id+' linked audio must match the original manifest');
  audio=x.listeningLessonId;
 }
 sourceRows.push({writing:w.id,unit:x.unit,reading:r.id,audio});
}
const standalone=writings.filter(w=>!contracts.lessons[w.id]);
assert.equal(standalone.length,17);
for(const w of standalone){
 assert(!readings.some(r=>unitMap[r.id]===unitMap[w.id]),
  w.id+' possibly depends on an unlinked Reading lesson');
 assert(w.activities.some(a=>a.type==='extended_response'&&a.prompt?.trim().length>40),
  w.id+' lacks a usable independent Writing prompt');
}
const guide=read('app/writing-source-bundle.tsx');
const player=read('app/foundation.tsx');
const css=read('app/globals.css');
assert(guide.includes('readingAssetId')&&guide.includes('result.version!==version'),
 'Reading references must be validated against the attempt version');
assert(guide.includes('listeningLessonId')&&guide.includes('Number.isFinite(original.duration)'),
 'Optional Listening source must use a validated MP3 and duration');
assert(guide.includes('<audio controls preload="none" src={sourceAudio.url}'),
 'Reference audio must be available directly inside the Writing task');
assert(guide.includes('source.body')&&guide.includes('source.display_to_learner!==true'),
 'Read source from canonical Reading view, not duplicated lesson text');
assert(guide.includes('writing-source-optional-lessons'),
 'Graded source lessons remain OPTIONAL, not required page changes');
assert(!guide.includes('audio_asset.source_text')&&!guide.includes("action:'play'")&&
 !guide.includes("action:'submit'")&&!guide.includes("action:'start'")&&
 !guide.includes('transcript='),
 'Do not reveal protected transcript or credit a scored Listening attempt');
assert(!/localStorage|setItem\(|score\s*=|saveAttempt|Gemini API|requestWritingAI/.test(guide),
 'The source panel is read-only, with no new AI or student-data writes');
assert.equal((player.match(/<WritingSourceBundle/g)||[]).length,2,
 'Shared sources must appear in lesson overview AND actual Writing practice');
assert(player.includes("lesson.module==='writing'"),'Feature must work for ALL mapped Writing lessons');
assert(player.includes('onOpenSource={id=>void open(id)}')&&
 player.includes("if(attempt?.status==='started')")&&player.includes('await saveDraft()'),
 'Optional lesson navigation must use the existing draft-safe route');
assert(player.includes('Play the full audio for this attempt before submitting.'),
 'Keep original scored Listening audio readiness gate');
assert(css.includes('.writing-source-bundle')&&css.includes('max-width:100%'),
 'Shared sources need responsive mobile layout');
console.log(JSON.stringify({
 result:'PASS',gate:'SLE-1.25.0-ALL-LESSONS-CROSS-SOURCE-FLOW',
 importedLessons:lessons.length,reading:readings.length,listening:listenings.length,
 writing:writings.length,sourceDependent:sourceRows.length,
 sourceWithAudio:sourceRows.filter(x=>x.audio).length,
 sourceWithReadingOnly:sourceRows.filter(x=>!x.audio).length,
 standaloneWriting:standalone.length,
 otherModules:lessons.length-readings.length-listenings.length-writings.length,
 originalAudioManifestVerified:true,sourceRows,
 noTranscriptBeforeSubmission:true,scoreWrites:0,productionWrites:0}));
