'use strict';
// Draft media is additional coverage, never a replacement for current lessons.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
module.exports=function validateStaged(manifest,currentLessons,read=fs.readFileSync,exists=fs.existsSync){
 const receipts=require('../../content/batches/unit10-owner-audio-receipts-20261107.json');
 const batch=require('../../content/batches/unit10-a1a2b1-9-lessons-v121-draft.json');
 const current=new Set(currentLessons.map(l=>l.id));
 const allowed=['LIS-A1-06','LIS-A2-07','LIS-B1-08'];
 assert.deepEqual(receipts.assets.map(a=>a.lesson_id),allowed);
 for(const id of current)assert(manifest[id],id+' current audio missing');
 const extras=Object.keys(manifest).filter(id=>!current.has(id));
 for(const id of extras)assert(allowed.includes(id),'Unknown staged audio '+id);
 for(const a of receipts.assets){
  assert(!current.has(a.lesson_id),'Draft/current overlap');
  const entry=manifest[a.lesson_id],file=path.join(root,a.canonical_asset_path);
  assert.equal(Boolean(entry),exists(file),'Staged file/manifest parity '+a.lesson_id);
  if(!entry)continue;
  const lesson=batch.lessons.find(l=>l.id===a.lesson_id);
  assert.equal(lesson.module,'listening');
  assert.equal(a.source_text,lesson.audio_asset.source_text);
  assert.equal(lesson.audio_asset.requires_real_playback,true);
  assert.equal(lesson.audio_asset.transcript_reveal,'after_submission');
  assert.deepEqual(entry,{source:a.source_text,url:'/foundation-audio/'+a.lesson_id+'-v1.mp3',duration:a.decoded_seconds,sha256:a.sha256});
  const bytes=read(file);
  assert.equal(bytes.length,a.byte_size);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);
 }
 assert.equal(Object.keys(manifest).length,current.size+extras.length);
 return extras;
};
