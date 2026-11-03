'use strict';
// Owner supplied three v2 Kokoro recordings via G Learning Audio Production v1.2.
// Verify exact script, immutable old v1, MP3 bytes, audio properties and mapping.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const candidate=require('../content/curriculum-1.18.1-candidate.json');
const manifest=require('../content/foundation-audio.json');
const rights=require('../content/audio-rights-register.json');
const evidence=require('../../docs/releases/2026-11-kokoro-3-listening-repair-evidence.json');
const original=require('../content/reviews/wave6-kokoro-audio-production.json').existing;
const ids=['LIS-A1-01','LIS-A2-02','LIS-B1-02'];
assert.deepEqual(evidence.assets.map(e=>e.id),ids);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const roles={
 'LIS-A1-01':['Teacher'],
 'LIS-A2-02':['Emma','Ben','Emma','Ben','Emma','Ben','Emma'],
 'LIS-B1-02':['Maya','Leo','Maya','Leo','Maya','Leo','Maya','Leo','Maya']
};
for(const id of ids){
 const lesson=candidate.lessons.find(l=>l.id===id);
 assert(lesson&&lesson.module==='listening',id+' source missing');
 const m=manifest[id],e=evidence.assets.find(x=>x.id===id),o=original[id];
 assert.equal(m.source,lesson.audio_asset.source_text,id+' transcript mismatch');
 assert.equal(m.source,o.manifest.source,id+' historical transcript changed');
 assert.equal(lesson.audio_asset.transcript_reveal,'after_submission');
 assert.equal(lesson.audio_asset.requires_real_playback,true);
 assert.deepEqual([...m.source.matchAll(/\b(Teacher|Emma|Ben|Maya|Leo):\s*/g)].map(x=>x[1]),roles[id]);
 assert.equal(m.url,'/foundation-audio/'+id+'-v2.mp3');
 assert.equal(m.sha256,e.sha256,id+' manifest hash');
 const fresh=path.join(root,'public','foundation-audio',id+'-v2.mp3');
 const old=path.join(root,'public','foundation-audio',id+'-v1.mp3');
 assert.equal(fs.statSync(fresh).size,e.size_bytes);
 assert.equal(sha(fs.readFileSync(fresh)),e.sha256);
 assert.equal(sha(fs.readFileSync(old)),o.sha256,id+' historical eSpeak bytes were altered');
 const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_name,sample_rate,channels:format=duration','-of','json',fresh]));
 assert.equal(info.streams[0].codec_name,'mp3');
 assert.equal(Number(info.streams[0].sample_rate),24000);
 assert.equal(Number(info.streams[0].channels),1);
 assert(Math.abs(Number(info.format.duration)-m.duration)<0.1,id+' duration vs playback guard');
 assert.equal(e.owner_audio_qa,'PENDING','Never claim a listening-quality PASS without owner hearing verification');
 const license=rights.entries.find(x=>x.asset_path==='public'+m.url);
 assert(license&&license.sha256===e.sha256&&license.release_clearance==='APPROVED');
}
assert.deepEqual(candidate.lessons.filter(x=>x.module==='listening').length,18);
console.log(JSON.stringify({result:'PASS',test:'owner-kokoro-three-audio-integrity',
 ids,originalVersionsPreserved:true,sourceParity:true,speakerTurns:[1,7,9],
 uploadedMp3sIdentical:true,ownerPerceptualHearing:'PENDING',liveDeployment:'NOT_IMPLIED'}));
