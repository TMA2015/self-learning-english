'use strict';
// Issue #65 — data-derived coverage of current curriculum, no hard-coded subset-only PASS.
// Place in sites-p0-phase-a-20260926/tests and run with `node tests/current-curriculum-audio-readiness.cjs`.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {source:curriculum,manifest:activeRelease}=require('../scripts/active-release.cjs').verifyActiveRelease();
const rights=require('../content/audio-rights-register.json');
const rightsByPath=new Map(rights.entries.map(e=>[e.asset_path,e]));
const listeningManifest = require('../content/foundation-audio.json');
const pronunciationManifest = require('../content/pronunciation-audio.json');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(curriculum.schema_version,activeRelease.version);
assert.equal(curriculum.lessons.length,activeRelease.lessons);
const listening = curriculum.lessons.filter(l => l.module === 'listening');
const pronunciation = curriculum.lessons.filter(l => l.module === 'pronunciation');
assert(listening.length>0&&pronunciation.length>0,'Active audio domains must be represented');
function validateAudio(lesson, entry, family, expectedSource) {
  assert(entry, `${lesson.id} missing ${family} manifest entry`);
  const currentSource = family === 'Listening' ? entry.source : entry.source_text;
  assert.deepEqual(currentSource, expectedSource, `${lesson.id} source mismatch`);
  assert(Number.isFinite(entry.duration) && entry.duration > 0, `${lesson.id} missing duration`);
  assert.equal(lesson.module, family.toLowerCase());
  const expectedPrefix = family === 'Listening' ? 'foundation-audio' : 'pronunciation-audio';
  const prefix='/'+expectedPrefix+'/'+lesson.id+'-v';
  assert(entry.url.startsWith(prefix)&&/^[1-9][0-9]*\.mp3$/.test(entry.url.slice(prefix.length)),`${lesson.id} invalid audio path`);
  const asset = path.join(root, 'public', entry.url.slice(1));
  assert(fs.existsSync(asset), `${lesson.id} MP3 not found`);
  const bytes = fs.readFileSync(asset);
  assert(bytes.length >= (family==='Listening'?10000:4000), `${lesson.id} MP3 too short`);
  assert(bytes.subarray(0,3).toString('ascii') === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0), `${lesson.id} invalid MP3 header`);
  const record=rightsByPath.get('public'+entry.url);
  assert(record&&record.release_clearance==='APPROVED',`${lesson.id} missing audio rights`);
  assert.equal(sha256(bytes),record.sha256,`${lesson.id} audio differs from rights record`);
  if (entry.sha256) {
    assert.match(entry.sha256, /^[a-f0-9]{64}$/, `${lesson.id} invalid sha256 format`);
    assert.equal(sha256(bytes), entry.sha256, `${lesson.id} bytes differ from manifest sha256`);
  }
}
for (const lesson of listening) {
  assert.equal(lesson.audio_asset?.requires_real_playback, true, `${lesson.id}: playback requirement changed`);
  assert.equal(lesson.audio_asset?.transcript_reveal, 'after_submission', `${lesson.id}: transcript must remain protected`);
  validateAudio(lesson, listeningManifest[lesson.id], 'Listening', lesson.audio_asset.source_text);
}
for (const lesson of pronunciation) {
  assert.equal(lesson.audio_model?.requires_real_playback, true, `${lesson.id}: playback requirement changed`);
  assert(Array.isArray(lesson.audio_model?.text), `${lesson.id}: invalid ordered model text`);
  validateAudio(lesson, pronunciationManifest[lesson.id], 'Pronunciation', lesson.audio_model.text);
}
// A released manifest must cover exactly the active lessons. Future staged
// media can be integrated only with the separately reviewed candidate, not
// by allowing an unexplained extra entry in this active release gate.
assert.deepEqual(Object.keys(listeningManifest).sort(),listening.map(l=>l.id).sort());
assert.deepEqual(Object.keys(pronunciationManifest).sort(),pronunciation.map(l=>l.id).sort());
console.log(JSON.stringify({result:'PASS',curriculum:curriculum.schema_version,listening:listening.length,pronunciation:pronunciation.length,allRequiredAudioVerified:true}));