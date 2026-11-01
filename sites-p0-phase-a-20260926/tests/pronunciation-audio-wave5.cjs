'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.join(__dirname,'..'),batch=require('../content/batches/speaking-pronunciation-density-wave5.json'),manifest=require('../content/pronunciation-audio.json');
const wave5Ids=['PRO-A2-03','PRO-B1-02'];
assert.equal(Object.keys(manifest).length,5,'Expanded pronunciation manifest must contain all five model audio files');
for(const id of wave5Ids)assert(manifest[id],id+' missing from expanded manifest');
assert.equal(batch.lessons.length,4);assert.equal(batch.lessons.flatMap(l=>l.activities).length,23);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(batch.lessons)).digest('hex'),'217d05b47fe4c83199987df2b23e6ec05e6d68c28d7781fe652beb388d096b14');
for(const [id,m] of Object.entries(manifest).filter(([id])=>wave5Ids.includes(id))){
 const l=batch.lessons.find(l=>l.id===id);assert.equal(m.lesson_id,id);assert.deepEqual(m.source_text,l.audio_model.text);assert.equal(l.audio_model.requires_real_playback,true);assert.match(l.audio_model.fallback,/no playback means no audio-based skill evidence/i);
 assert.equal(m.url,`/pronunciation-audio/${id}-v1.mp3`);assert.equal(m.owner_sample_qa,'PASS');assert.equal(m.owner_final_qa,'PASS');assert.equal(m.owner_approved_review_sha256,m.sha256);assert.equal(m.local_inference,true);
 const file=path.join(root,'public',m.url),bytes=fs.readFileSync(file);assert(bytes.length>10000);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),m.sha256);
 const p=JSON.parse(cp.execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file]));assert.equal(p.streams[0].codec_name,'mp3');assert(Math.abs(+p.format.duration-m.duration)<.001);assert.equal(+p.streams[0].sample_rate,m.sample_rate);assert.equal(+p.streams[0].bit_rate,m.bitrate);
 const pcm=cp.execFileSync('ffmpeg',['-v','error','-i',file,'-f','s16le','-ac','1','-']);let sum=0,peak=0;for(let i=0;i<pcm.length;i+=2){const v=pcm.readInt16LE(i);sum+=v*v;peak=Math.max(peak,Math.abs(v));}assert(Math.sqrt(sum/(pcm.length/2))>100);assert(peak>1000);
 for(const q of l.activities.filter(q=>q.type==='extended_response')){assert.equal(q.evidence_weight,0);assert.equal(q.review_mode,'assisted_ai_or_human');assert.equal(q.answer,null);}
}
// Preserve hashes of the three unchanged historical recordings only. The other two
// historical recordings were replaced (not silently rewritten) with approved Kokoro v2.
const originalListening={"public/foundation-audio/LIS-A1-01-v1.mp3": "50e06a68c158f45a2f7a3e66380836ed50b3857a", "public/foundation-audio/LIS-A2-02-v1.mp3": "ca7c2131a9dac3ac9365fa8e1f08e1e24a740347", "public/foundation-audio/LIS-B1-02-v1.mp3": "a92c5b6075758457d1c718ffeba4b9f60cd00f29"};
const listeningAudit=require('../content/reviews/wave6-kokoro-audio-production.json');
const listeningManifest=require('../content/foundation-audio.json');
const replacements=new Set(['LIS-A2-01','LIS-B1-01']);
const rights=require('../content/audio-rights-register.json');
for(const [id,old] of Object.entries(listeningAudit.existing)){
 if(!replacements.has(id)){assert.deepEqual(listeningManifest[id],old.manifest);continue;}
 const current=listeningManifest[id];
 assert.equal(current.source,old.manifest.source,id+' reviewed transcript must remain unchanged');
 assert.equal(current.url,'/foundation-audio/'+id+'-v2.mp3');
 assert(!fs.existsSync(path.join(root,'public','foundation-audio',id+'-v1.mp3')),id+' superseded MP3 must not ship');
 const record=rights.entries.find(e=>e.asset_path==='public'+current.url);
 assert(record&&record.release_clearance==='APPROVED'&&record.source_originality==='VERIFIED',id+' rights gate');
 const payload=fs.readFileSync(path.join(root,'public',current.url));
 assert.equal(crypto.createHash('sha256').update(payload).digest('hex'),record.sha256,id+' new MP3 fingerprint');
}
for(const [file,sha] of Object.entries(originalListening)){
 const bytes=fs.readFileSync(path.join(root,file));
 assert.equal(crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),sha,`Unchanged Listening file changed: ${file}`);
}
const service=fs.readFileSync(path.join(root,'application/academic-service.ts'),'utf8');assert.match(service,/Planning notes are not audio evidence/);assert.match(service,/l.module==='writing'\?Object.entries\(scores\)/);
cp.execFileSync(process.env.PRAAT_PYTHON||'python3',[path.join(__dirname,'pronunciation-audio-wave5.py')],{stdio:'inherit'});
console.log('PASS: Wave 5 pronunciation files, source parity, hash/duration, decoded audio/F0, review-only safeguards; 4 lessons / 23 activities.');