'use strict';
/**
 * Receipt parity only. User MP3 binaries currently live in the conversation
 * handoff ZIP, NOT this Git branch. MEDIA-01 remains BLOCKED until copied and
 * independently listened to in an actual browser.
 *
 * Use --require-media in the integration step to fail closed until all
 * original bytes have actually been committed.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const draft=require('../content/batches/unit10-a1a2b1-9-lessons-v121-draft.json');
const r=require('../content/batches/unit10-owner-audio-receipts-20261107.json');
const requireMedia=process.argv.includes('--require-media');
assert.equal(r.schema,'sle-unit10-uploaded-audio-receipts-v1');
assert.equal(r.assets.length,3);
assert.equal(r.status,'LOCAL_ASSETS_UPLOADED_TO_CHAT_AND_HASHED_NOT_IN_GIT');
assert.equal(r.acceptance,'NOT_FOR_PRODUCTION');
const expected=['LIS-A1-06','LIS-A2-07','LIS-B1-08'];
assert.deepEqual(r.assets.map(x=>x.lesson_id),expected);
let present=0;
for(const item of r.assets){
 assert.equal(item.unit,item.lesson_id.startsWith('LIS-A1')?'A1-U10':
  item.lesson_id.startsWith('LIS-A2')?'A2-U10':'B1-U10');
 const lesson=draft.lessons.find(x=>x.id===item.lesson_id);
 assert(lesson&&lesson.module==='listening');
 assert.equal(lesson.audio_asset.source_text,item.source_text);
 assert.equal(item.source_parity,'PASS');
 assert.match(item.sha256,/^[0-9a-f]{64}$/);
 assert.equal(item.engine,'Kokoro');
 assert.equal(item.engine_package,'0.9.4');
 assert.equal(item.owner_audio_qa,'PENDING');
 assert.equal(item.browser_playback,'NOT_TESTED');
 assert.equal(item.rights_clearance_for_new_assets,'PENDING');
 assert.equal(item.canonical_asset_path,
  'public/foundation-audio/'+item.lesson_id+'-v1.mp3');
 const f=path.join(root,item.canonical_asset_path);
 if(fs.existsSync(f)){
  const bytes=fs.readFileSync(f);
  assert.equal(bytes.length,item.byte_size);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
  present++;
 }else if(requireMedia)throw Error('MEDIA-01 BLOCKED: physically absent '+item.canonical_asset_path);
}
if(requireMedia)assert.equal(present,3);
console.log(JSON.stringify({result:'PASS_METADATA_AND_SOURCE_ONLY',
 gate:'UNIT10-OWNER-AUDIO-RECEIPTS',
 originalScriptsMatchReviewedSource:true,
 audioHashesRecorded:3,
 actualAudioFilesInRepository:present,
 requireMedia,media01:present===3?'BYTES_PRESENT_PLAYBACK_UNVERIFIED':'BLOCKED',
 humanHearing:'PENDING',newAssetRights:'PENDING',
 realBrowserPlayback:'NOT_TESTED',
 productionRelease:'NO_GO'}));
