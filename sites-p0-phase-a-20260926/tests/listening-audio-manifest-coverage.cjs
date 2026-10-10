'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const curriculum=require('../content/curriculum-1.11.0-candidate.json');
const manifest=require('../content/foundation-audio.json');
const existing=curriculum.lessons.filter(l=>l.module==='listening');
const wave6=require('../content/batches/vocab-reading-listening-density-wave6.json');
const listening=[...existing,...wave6.lessons.filter(l=>l.module==='listening')];

assert.equal(existing.length,5,'Curriculum 1.11.0 should retain its five Listening lessons');
assert.equal(listening.length,7,'Five existing plus two staged Wave 6 audio entries');
for(const lesson of listening){
  const entry=manifest[lesson.id];
  assert(entry,lesson.id+' must have a real audio manifest entry');
  assert.equal(entry.source,lesson.audio_asset?.source_text,lesson.id+' manifest source must match reviewed source text exactly');
  assert.equal(lesson.audio_asset?.requires_real_playback,true,lesson.id+' must require real playback');
  assert.equal(lesson.audio_asset?.transcript_reveal,'after_submission',lesson.id+' transcript must remain hidden until submission');
  assert.equal(typeof entry.duration,'number');
  assert(entry.duration>5,lesson.id+' duration must be plausible');
  assert.match(entry.url,/^\/foundation-audio\/[A-Z0-9-]+-v\d+\.mp3$/);
  const file=path.join(root,'public',entry.url.replace(/^\//,''));
  assert(fs.existsSync(file),lesson.id+' MP3 is missing: '+file);
  const bytes=fs.readFileSync(file);
  assert(bytes.length>10000,lesson.id+' MP3 is unexpectedly small');
  const hasId3=bytes.subarray(0,3).toString('ascii')==='ID3';
  const frameSync=bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0;
  assert(hasId3||frameSync,lesson.id+' does not look like an MP3');
}
for(const id of ['LIS-A1-01','LIS-A2-02','LIS-B1-02'])assert(manifest[id],id+' new Wave 2 audio must exist');
console.log(JSON.stringify({
  result:'PASS',
  curriculum:'1.11.0',
  stagedWave6Audio:2,
  listeningLessons:listening.length,
  manifestEntries:listening.map(l=>({id:l.id,duration:manifest[l.id].duration,url:manifest[l.id].url})),
  realPlaybackRequired:true,
  transcriptAfterSubmission:true
}));
