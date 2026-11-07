'use strict';
// Node-only release gate. A matching SHA proves integrity, not copyright clearance.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const register=require('../content/audio-rights-register.json');
const strict=process.argv.includes('--require-clearance');
// Do not treat a nonempty placeholder as verified tool/voice provenance.
const hasVerifiedDescriptor=value=>{
  if(typeof value!=='string'||!value.trim())return false;
  return !/(?:\bUNVERIFIED\b|\bNOT CONFIRMED\b|\bNOT VERIFIED\b|\bUNKNOWN\b|\bPENDING\b|\bTBD\b|^\s*(?:N\/A|NONE)\s*$)/i.test(value);
};
const folders=['foundation-audio','diagnostic-audio','pronunciation-audio'];
const actual=[];
for(const folder of folders){
  for(const name of fs.readdirSync(path.join(root,'public',folder))){
    if(name.toLowerCase().endsWith('.mp3')) actual.push('public/'+folder+'/'+name);
  }
}
actual.sort();
assert.equal(register.schema_version,1);
assert.equal(register.release,'1.18.1','Keep the original rights-cleared baseline pinned');
const draft=register.unit10_draft_assets||null;
const baselineCount=41;
let newAudio=[];
if(draft){
 assert.equal(draft.candidate_version,'1.21.0');
 assert.equal(draft.parent_clearance_release,'1.18.1');
 assert.equal(draft.prior_rights_cleared_count,baselineCount);
 assert.equal(draft.status,'3_REGISTERED_PENDING_RIGHTS_AND_MEDIA01_NOT_CLEARED');
 const receipts=require('../content/batches/unit10-owner-audio-receipts-20261107.json');
 assert.deepEqual(draft.ids,['LIS-A1-06','LIS-A2-07','LIS-B1-08']);
 assert.equal(receipts.assets.length,3);
 newAudio=receipts.assets;
 assert.deepEqual(draft.ids,newAudio.map(x=>x.lesson_id));
 assert.deepEqual(draft.paths,newAudio.map(x=>x.canonical_asset_path));
 for(const a of newAudio){
  assert.equal(a.in_git_tree,true,a.lesson_id+' binary must be present');
  assert.equal(a.source_parity,'PASS');
  const match=register.entries.filter(x=>x.asset_path===a.canonical_asset_path);
  assert.equal(match.length,1,a.lesson_id+' must have exactly one rights record');
  assert.equal(match[0].sha256,a.sha256,a.lesson_id+' rights record must pin exact audio');
  assert.equal(match[0].unit10_lesson_id,a.lesson_id);
  assert.equal(match[0].owner_audio_qa,a.owner_audio_qa);
 }
}
const expectedCount=baselineCount+newAudio.length;
assert.equal(actual.length,expectedCount,'All historical and explicitly staged media must be accounted for');
assert.equal(register.entries.length,expectedCount,'Every physical MP3 needs a per-SHA rights record');
const recorded=register.entries.map(x=>x.asset_path).sort();
assert.deepEqual(recorded,actual,'Rights register must cover every MP3, with no extra or duplicate paths');
const missing=[];
for(const entry of register.entries){
  const file=path.join(root,entry.asset_path);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(entry.sha256,hash,'Audio fingerprint changed: '+entry.asset_path);
  assert(['PENDING','APPROVED','REJECTED'].includes(entry.release_clearance),'Invalid clearance status: '+entry.asset_path);
  if(entry.release_clearance!=='APPROVED'||entry.source_originality!=='VERIFIED'||
     !entry.approved_by?.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(entry.approved_on||'')||
     !entry.provenance_evidence?.trim()||
     !hasVerifiedDescriptor(entry.model_or_engine)||
     !hasVerifiedDescriptor(entry.voice_or_processing)){
    missing.push(entry.asset_path);
  }
}
const summary={audioIntegrity:'PASS',total:actual.length,rightsApproved:register.entries.length-missing.length,rightsPending:missing.length,mode:strict?'release-clearance':'integrity-only'};
console.log(JSON.stringify(summary));
if(strict&&missing.length){
  console.error('AUDIO_RIGHTS_BLOCKED: approval and provenance incomplete for '+missing.length+' assets. First: '+missing.slice(0,8).join(', '));
  process.exit(1);
}