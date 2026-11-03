'use strict';
// Regression for owner-reported three low-naturalness eSpeak items.
// This tests script/source/role mapping WITHOUT generating audio or changing LIVE.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const data=require('../content/curriculum-1.18.1-candidate.json');
const byId=new Map(data.lessons.map(l=>[l.id,l]));
const roleSets={
 'LIS-A1-01':['Teacher'],
 'LIS-A2-02':['Emma','Ben','Emma','Ben','Emma','Ben','Emma'],
 'LIS-B1-02':['Maya','Leo','Maya','Leo','Maya','Leo','Maya','Leo','Maya']
};
for(const [id,roles] of Object.entries(roleSets)){
 const lesson=byId.get(id);
 assert(lesson&&lesson.module==='listening',`${id}: missing real lesson`);
 assert.equal(lesson.audio_asset.source_text,manifest[id].source,`${id}: script parity`);
 assert.equal(lesson.audio_asset.transcript_reveal,'after_submission');
 const labels=[...manifest[id].source.matchAll(/\b(Teacher|Emma|Ben|Maya|Leo):\s*/g)].map(x=>x[1]);
 assert.deepEqual(labels,roles,`${id}: speaker turns must be preserved`);
}
const script=path.join(root,'scripts/generate-kokoro-legacy-replacements.py');
const dry=execFileSync('python3',[script,'--dry-run'],{cwd:root,encoding:'utf8',timeout:10000});
assert.match(dry,/TRANSCRIPT_VERIFIED LIS-A1-01 turns 1 /);
assert.match(dry,/TRANSCRIPT_VERIFIED LIS-A2-02 turns 7 /);
assert.match(dry,/TRANSCRIPT_VERIFIED LIS-B1-02 turns 9 /);
assert.match(dry,/DRY_RUN_PASS/);
assert(!/GENERATED|STAGED_UPLOAD_ZIP/.test(dry),'Dry-run must not generate an audio asset');
const scriptText=fs.readFileSync(script,'utf8');
assert(scriptText.includes('SLE_KOKORO_LEGACY3_REPAIR.zip'));
assert(scriptText.includes('FileExistsError'),'Must not silently overwrite an already-reviewed MP3');
assert(!/public\/foundation-audio\/LIS-A1-01-v2/.test(scriptText),'Script must stage, not publish');
console.log(JSON.stringify({result:'PASS',test:'legacy-kokoro-repair-preflight',
 exactSources:3,expectedSpeakerTurns:[1,7,9],
 newKokoroMP3s:'NOT_GENERATED',liveWebsite:'NOT_CHANGED',ownerListeningQA:'PENDING'}));
