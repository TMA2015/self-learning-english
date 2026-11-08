'use strict';
/**
 * Unit-10 OWNER audio handoff stage helper — DRAFT ONLY.
 *
 * Usage:
 *   node scripts/stage-unit10-audio-handoff.cjs <EXTRACTED_HANDOFF_DIRECTORY>
 *   node scripts/stage-unit10-audio-handoff.cjs <EXTRACTED_HANDOFF_DIRECTORY> --apply
 *
 * Expected ZIP is SLE_Unit10_Final_A2_B1_Audio_Handoff_20261107.zip.
 * This helper does not commit, merge, deploy, import a curriculum, or alter attempts.
 * It intentionally stages ONLY the two owner-accepted A2/B1 replacements.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const positional = args.filter(x => x !== '--apply');
if (positional.length !== 1 || positional[0].startsWith('-')) {
  console.error('Usage: node scripts/stage-unit10-audio-handoff.cjs <EXTRACTED_HANDOFF_DIRECTORY> [--apply]');
  process.exit(2);
}
const inputDir = path.resolve(positional[0]);
const handoff = JSON.parse(fs.readFileSync(path.join(inputDir, 'AUDIO_ASSET_MANIFEST.json'),'utf8'));
const receipts = require('../content/batches/unit10-owner-audio-receipts-20261107.json');
const authored = require('../content/batches/unit10-a1a2b1-9-lessons-v121-draft.json');
const manifestPath = path.join(root, 'content/foundation-audio.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.equal(handoff.packet_id, 'SLE-UNIT10-A2B1-OWNER-QA-20261107');
assert.equal(handoff.release_status, 'DRAFT_ASSET_HANDOFF_ONLY_NOT_FOR_PRODUCTION');
const selected = ['LIS-A2-07', 'LIS-B1-08'];
assert.deepEqual(handoff.assets.map(x=>x.lesson_id),selected);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const staged = [];

for (const lessonId of selected) {
  const receipt = receipts.assets.find(a=>a.lesson_id===lessonId);
  const delivered = handoff.assets.find(a=>a.lesson_id===lessonId);
  const lesson = authored.lessons.find(l=>l.id===lessonId);
  assert(receipt && delivered && lesson && lesson.module==='listening');
  assert.equal(receipt.owner_audio_qa,'PASS');
  assert.equal(receipt.rights_clearance_for_new_assets,'APPROVED');
  assert.equal(receipt.owner_rights_attestation_on,'2026-11-07');
  assert.equal(receipt.sha256,delivered.sha256);
  assert.equal(receipt.canonical_asset_path,delivered.canonical_asset_path);
  assert.equal(receipt.source_text,delivered.source_text);
  assert.equal(lesson.audio_asset.source_text,delivered.source_text);
  assert.equal(receipt.byte_size,delivered.byte_size);
  assert.equal(receipt.decoded_seconds,delivered.duration_seconds_reported);
  assert.equal(receipt.tts_speed,delivered.tts_speed);
  assert.equal(receipt.pause_seconds,delivered.pause_seconds);
  const level = lessonId==='LIS-A2-07'?'A2':'B1';
  const sidecar = JSON.parse(fs.readFileSync(path.join(inputDir,'producer-sidecars',level+'-U10-v1.json'),'utf8'));
  assert.equal(sidecar.sha256,receipt.sha256);
  assert.equal(sidecar.source_text,receipt.source_text);
  assert.equal(sidecar.owner_audio_qa,'PASS');
  assert.equal(sidecar.generator.speed,receipt.tts_speed);
  assert.equal(sidecar.generator.pause_seconds,receipt.pause_seconds);
  // sidecar.generator.preset is intentionally NOT used to determine level.
  const relative = 'public/foundation-audio/'+lessonId+'-v1.mp3';
  assert.equal(delivered.canonical_asset_path,relative);
  const source = path.join(inputDir,relative);
  const bytes = fs.readFileSync(source);
  assert.equal(bytes.length,receipt.byte_size);
  assert.equal(sha256(bytes),receipt.sha256);
  const dest = path.join(root,relative);
  if (fs.existsSync(dest)) {
    assert.equal(sha256(fs.readFileSync(dest)),receipt.sha256,'Refuse to overwrite a different MP3: '+dest);
  }
  const proposed={
    source:receipt.source_text,
    url:'/foundation-audio/'+lessonId+'-v1.mp3',
    duration:receipt.decoded_seconds,
    sha256:receipt.sha256
  };
  if (manifest[lessonId]) assert.deepEqual(manifest[lessonId], proposed,
    'Refuse to silently replace an existing published manifest entry');
  staged.push({lessonId,source,dest,bytes,proposed});
}

// All checks must pass before any files are written.
if (apply) {
  const currentBranch = execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim();
  assert.equal(currentBranch,'academic/unit10-v121-candidate-20261107',
    'DRAFT ONLY: switch to the authorized PR #117 branch first');
  for (const a of staged) {
    fs.mkdirSync(path.dirname(a.dest),{recursive:true});
    fs.writeFileSync(a.dest,a.bytes,{flag:fs.existsSync(a.dest)?'r+':'wx'});
    assert.equal(sha256(fs.readFileSync(a.dest)),a.proposed.sha256);
    manifest[a.lessonId] = a.proposed;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2)+'\n');
}
console.log(JSON.stringify({
  outcome:apply?'STAGED_IN_LOCAL_DRAFT_WORKTREE':'HANDOFF_VERIFIED_NO_WRITES',
  selected:staged.map(a=>({lessonId:a.lessonId,sha256:a.proposed.sha256,size:a.bytes.length})),
  audioOwnerQA:'ALL_THREE_OWNER_PASS',
  A1FileStaged:false, rights:'OWNER_APPROVED_FOR_EXACT_THREE_SHA_ONLY', browserQA:'NOT_TESTED',
  commitsCreated:0, productionRelease:'NO_GO', learnerDataWrites:0
},null,2));
