'use strict';
/**
 * Receipt parity: all three exact MP3s are committed.
 * MEDIA-01 remains BLOCKED until all required media and independent
 * actual browser playback are verified.
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
assert.equal(r.status,'ALL_THREE_COMMITTED_RELEASE_GATES_PENDING');
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
 assert.equal(item.owner_audio_qa,item.lesson_id==='LIS-A1-06'?'PENDING':'PASS');
 if(item.owner_audio_qa==='PASS'){
  assert.equal(item.pause_seconds,0.4038);
  assert(['LIS-A2-07','LIS-B1-08'].includes(item.lesson_id));
  assert.match(item.supersedes_sha256,/^[0-9a-f]{64}$/);
  assert.notEqual(item.sha256,item.supersedes_sha256);
 }
 assert.equal(item.browser_playback,'NOT_TESTED');
 assert.equal(item.rights_clearance_for_new_assets,'PENDING');
 assert.equal(item.canonical_asset_path,
  'public/foundation-audio/'+item.lesson_id+'-v1.mp3');
 assert.equal(item.in_git_tree,true);
 const f=path.join(root,item.canonical_asset_path);
 if(item.in_git_tree)assert(fs.existsSync(f),'Committed audio missing: '+item.lesson_id);
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
 humanHearing:'A2_B1_OWNER_PASS_A1_PENDING',newAssetRights:'PENDING',
 realBrowserPlayback:'NOT_TESTED',
 productionRelease:'NO_GO'}));
