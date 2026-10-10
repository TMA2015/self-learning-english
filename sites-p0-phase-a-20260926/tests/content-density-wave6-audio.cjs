'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),batch=require('../content/batches/vocab-reading-listening-density-wave6.json'),manifest=require('../content/foundation-audio.json'),audit=require('../content/reviews/wave6-kokoro-audio-production.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let checks=0;const check=(name,f)=>{f();checks++;console.log('PASS '+name)};
check('exactly seven entries: five unchanged plus two new',()=>assert.deepEqual(Object.keys(manifest).sort(),[...Object.keys(audit.existing), 'LIS-A2-03','LIS-B1-04'].sort()));
check('existing five manifest entries and audio bytes unchanged',()=>{assert.equal(Object.keys(audit.existing).length,5);for(const [id,old] of Object.entries(audit.existing)){assert.deepEqual(manifest[id],old.manifest);assert.equal(hash(fs.readFileSync(path.join(root,'public',old.manifest.url))),old.sha256)}});
for(const l of batch.lessons.filter(l=>l.module==='listening')){
 const m=manifest[l.id],a=audit.generated[l.id],file=path.join(root,'public',m.url);
 check(l.id+' exact reviewed source and file mapping',()=>{assert.equal(m.source,l.audio_asset.source_text);assert.equal(m.url,'/foundation-audio/'+l.id+'-v1.mp3');assert.equal(a.script_sha256,hash(Buffer.from(m.source)));assert.equal(a.turns.map(t=>t.speaker+': '+t.text).join('\n\n'),m.source)});
 check(l.id+' valid non-empty MP3 and recorded hash',()=>{const b=fs.readFileSync(file);assert(b.length>10000);assert.equal(hash(b),a.sha256);const p=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,bit_rate:stream=codec_name,sample_rate,channels','-of','json',file]));assert.equal(p.streams[0].codec_name,'mp3');assert.equal(Number(p.streams[0].sample_rate),44100);assert(Math.abs(Number(p.format.duration)-m.duration)<0.05);assert(m.duration>30&&m.duration<150);assert(Number(p.format.bit_rate)>180000)});
 check(l.id+' decoded signal non-silent and no clipped samples',()=>{const b=execFileSync('ffmpeg',['-v','error','-i',file,'-f','f32le','-ac','1','-ar','24000','pipe:1'],{maxBuffer:30_000_000});let max=0,sum=0;for(let i=0;i<b.length;i+=4){const x=b.readFloatLE(i);assert(Number.isFinite(x));max=Math.max(max,Math.abs(x));sum+=x*x}assert(max>0.02&&max<1);assert(Math.sqrt(sum/(b.length/4))>0.001)});
 check(l.id+' playback/transcript guards and pending full human QA',()=>{assert(l.audio_asset.requires_real_playback);assert.equal(l.audio_asset.transcript_reveal,'after_submission');assert.equal(a.human_final_qa,'OWNER PENDING');assert.equal(a.model,'Kokoro-82M v1.0');assert.equal(a.package_version,'0.9.4');assert.equal(a.pause_seconds,0.28)});
}
check('Wave 6 still six lessons / 48 activities',()=>{assert.equal(batch.lessons.length,6);assert.equal(batch.lessons.flatMap(l=>l.activities).length,48)});
console.log(JSON.stringify({result:'PASS',checks,existingAssetsUnchanged:5,newMP3s:2,sourceParity:true,humanFinalQA:'OWNER PENDING',cloudTTS:false}));
