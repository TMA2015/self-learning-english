'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const old=require('../content/curriculum-1.17.0-candidate.json');
const current=require('../content/curriculum-1.18.0-candidate.json');
const lessons=current.lessons;
const audio=require('../content/foundation-audio.json');
const diagnostic=require('../content/diagnostic-audio-manifest.json');
const tasks=require('../content/listening-v4.json');
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(current.schema_version,'1.18.0');
assert.equal(lessons.length,109);
assert.equal(lessons.flatMap(x=>x.activities).length,913);
assert.deepEqual(lessons.slice(0,100),old.lessons,'100 baseline lessons changed');
assert.equal(new Set(lessons.map(x=>x.id)).size,109);
assert.equal(new Set(lessons.flatMap(x=>x.activities.map(q=>q.id))).size,913);
const listening=lessons.filter(x=>x.module==='listening');
assert.equal(listening.length,18);
assert.equal(Object.keys(audio).length,listening.length);
for(const l of listening){
 const m=audio[l.id];assert(m,l.id+' audio manifest missing');
 assert.equal(m.source,l.audio_asset.source_text,l.id+' script mismatch');
 assert.equal(l.audio_asset.requires_real_playback,true);
 assert.equal(l.audio_asset.transcript_reveal,'after_submission');
 const f=path.join(root,'public',m.url.replace(/^\//,''));
 assert(fs.existsSync(f),l.id+' MP3 missing');
 assert.equal(sha256(f),m.sha256,l.id+' MP3 differs');
}
assert.equal(tasks.length,15);
assert.equal(Object.keys(diagnostic).length,15);
for(const q of tasks){
 const m=diagnostic[q.id];assert(m,q.id+' diagnostic mapping missing');
 const f=path.join(root,'public',m.url.replace(/^\//,''));
 assert(fs.existsSync(f),q.id+' diagnostic MP3 missing');
 assert.equal(sha256(f),m.sha256,q.id+' diagnostic audio differs');
}
const newcomers=lessons.slice(100);
assert.equal(newcomers.length,9);
assert.equal(newcomers.flatMap(x=>x.activities).length,63);
for(const l of newcomers)for(const q of l.activities){
 assert.equal(q.type,'single_choice');
 assert.equal(q.options.length,4);
 assert(q.options.some(x=>x.id===q.answer.correct_option_id));
 assert.equal(q.evidence_weight,1);
}
console.log(JSON.stringify({result:'PASS',version:'1.18.0',lessons:109,activities:913,listening:18,diagnostic:15,baseUnchanged:true,newMp3:24}));