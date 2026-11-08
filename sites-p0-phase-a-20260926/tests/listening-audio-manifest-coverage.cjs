'use strict';
// Issue #65: validate the current curriculum, never a historical Listening subset.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const pkg=require('../content/curriculum-1.18.1-candidate.json');
const manifest=require('../content/foundation-audio.json');
const lessons=pkg.lessons.filter(l=>l.module==='listening');
assert.equal(lessons.length,18,'Current curriculum requires eighteen Listening lessons');
const staged=require('./helpers/staged-listening-manifest.cjs')(manifest,lessons);
assert.equal(Object.keys(manifest).length,18+staged.length,'Current plus strictly validated staged coverage');
for(const lesson of lessons){
 const entry=manifest[lesson.id];
 assert(entry,lesson.id+' missing manifest entry');
 assert.equal(entry.source,lesson.audio_asset?.source_text,lesson.id+' source-text parity');
 assert.equal(lesson.audio_asset?.requires_real_playback,true);
 assert.equal(lesson.audio_asset?.transcript_reveal,'after_submission');
 assert(Number.isFinite(entry.duration)&&entry.duration>5,lesson.id+' invalid duration');
 const audioVersion=['LIS-A2-01','LIS-B1-01','LIS-A1-01','LIS-A2-02','LIS-B1-02'].includes(lesson.id)?'v2':'v1';
 assert.equal(entry.url,'/foundation-audio/'+lesson.id+'-'+audioVersion+'.mp3');
 const file=path.join(root,'public',entry.url.slice(1));
 assert(fs.existsSync(file),lesson.id+' missing real MP3');
 const bytes=fs.readFileSync(file);
 assert(bytes.length>10000,lesson.id+' MP3 unexpectedly small');
 assert(bytes.subarray(0,3).toString('ascii')==='ID3'||(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0),lesson.id+' invalid MP3 header');
 if(entry.sha256)assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,lesson.id+' MP3 integrity');
}
console.log(JSON.stringify({result:'PASS',curriculum:'1.18.1',listeningLessons:lessons.length,fullCoverage:true}));