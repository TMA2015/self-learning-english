'use strict';
// Issue #65 — data-derived coverage of current curriculum, no hard-coded subset-only PASS.
// Place in sites-p0-phase-a-20260926/tests and run with `node tests/current-curriculum-audio-readiness.cjs`.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const curriculum = require('../content/curriculum-1.18.1-candidate.json');
const listeningManifest = require('../content/foundation-audio.json');
const pronunciationManifest = require('../content/pronunciation-audio.json');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(curriculum.schema_version, '1.18.1');
assert.equal(curriculum.lessons.length, 109, 'Unexpected lesson count; update checkpoint only after review');
const listening = curriculum.lessons.filter(l => l.module === 'listening');
const pronunciation = curriculum.lessons.filter(l => l.module === 'pronunciation');
assert.equal(listening.length, 18, 'Unexpected Listening count; do not conceal a missing lesson');
assert.equal(pronunciation.length, 5, 'Unexpected Pronunciation count; do not conceal a missing lesson');
function validateAudio(lesson, entry, family, expectedSource) {
  assert(entry, `${lesson.id} missing ${family} manifest entry`);
  const currentSource = family === 'Listening' ? entry.source : entry.source_text;
  assert.deepEqual(currentSource, expectedSource, `${lesson.id} source mismatch`);
  assert(Number.isFinite(entry.duration) && entry.duration > 0, `${lesson.id} missing duration`);
  assert.equal(lesson.module, family.toLowerCase());
  const expectedPrefix = family === 'Listening' ? 'foundation-audio' : 'pronunciation-audio';
  const audioVersion = family === 'Listening' && ['LIS-A2-01','LIS-B1-01','LIS-A1-01','LIS-A2-02','LIS-B1-02'].includes(lesson.id) ? 'v2' : 'v1';
  assert.equal(entry.url, `/${expectedPrefix}/${lesson.id}-${audioVersion}.mp3`, `${lesson.id} wrong path`);
  const asset = path.join(root, 'public', entry.url.slice(1));
  assert(fs.existsSync(asset), `${lesson.id} MP3 not found`);
  const bytes = fs.readFileSync(asset);
  assert(bytes.length >= 4000, `${lesson.id} MP3 too short`);
  assert(bytes.subarray(0,3).toString('ascii') === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0), `${lesson.id} invalid MP3 header`);
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
const required = new Set([...listening, ...pronunciation].map(l=>l.id));
for (const id of [...Object.keys(listeningManifest), ...Object.keys(pronunciationManifest)]) {
  assert(required.has(id), `Manifest has obsolete/unknown lesson id ${id}`);
}
console.log(JSON.stringify({result:'PASS',curriculum:curriculum.schema_version,listening:listening.length,pronunciation:pronunciation.length,allRequiredAudioVerified:true}));