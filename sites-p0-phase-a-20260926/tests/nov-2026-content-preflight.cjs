'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),old=require('../content/curriculum-1.17.0-candidate.json'),next=require('../content/curriculum-1.18.0-candidate.json'),manifest=require('../content/foundation-audio.json'),diagnostic=require('../content/diagnostic-audio-manifest.json'),tasks=require('../content/listening-v4.json');
const sha=x=>crypto.createHash('sha256').update(fs.readFileSync(x)).digest('hex');
assert.equal(next.schema_version,'1.18.0');assert.equal(next.lessons.length,109);assert.equal(next.lessons.flatMap(l=>l.activities).length,913);assert.deepEqual(next.lessons.slice(0,100),old.lessons);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,109);assert.equal(new Set(next.lessons.flatMap(l=>l.activities.map(q=>q.id))).size,913);
assert.equal(next.course.sequence.length,109);assert.equal(new Set(next.course.sequence).size,109);assert(next.course.sequence.every(x=>next.lessons.some(l=>l.id===x)));
const listening=next.lessons.filter(l=>l.module==='listening');assert.equal(listening.length,18);
for(const l of listening){const m=manifest[l.id];assert(m,`Missing audio mapping: ${l.id}`);assert.equal(m.source,l.audio_asset.source_text,`Source mismatch: ${l.id}`);assert.equal(l.audio_asset.transcript_reveal,'after_submission');assert.equal(l.audio_asset.requires_real_playback,true);const p=path.join(root,'public',m.url.replace(/^\//,''));assert(fs.existsSync(p),`Missing audio file: ${l.id}`);if(m.sha256)assert.equal(m.sha256,sha(p),`Changed audio: ${l.id}`);}
assert.equal(tasks.length,15);assert.equal(Object.keys(diagnostic).length,15);for(const q of tasks){const m=diagnostic[q.id];assert(m,`Missing diagnostic audio: ${q.id}`);const p=path.join(root,'public',m.url.replace(/^\//,''));assert.equal(sha(p),m.sha256,`Changed diagnostic audio: ${q.id}`);}
const newcomers=next.lessons.slice(100);assert.equal(newcomers.length,9);assert.equal(newcomers.reduce((n,l)=>n+l.activities.length,0),63);
for(const l of newcomers){for(const q of l.activities){assert.equal(q.type,'single_choice');assert.equal(q.options.length,4);assert(q.options.some(o=>o.id===q.answer.correct_option_id));assert.equal(q.evidence_weight,1);}}
console.log(JSON.stringify({result:'PASS',version:next.schema_version,lessons:109,activities:913,listening:18,diagnostic:15,baseUnchanged:true,newMP3:24}));
