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
 assert.equal(draft.release_authorized,false,'Owner cleared only audio rights, not production release');
 assert.equal(draft.owner_rights_confirmed_on,'2026-11-07');
 assert.equal(draft.owner_rights_decision_ref,'docs/curriculum/SLE_UNIT10_OWNER_AUDIO_RIGHTS_DECISION_20261107.md');
 assert.equal(draft.status,'3_OWNER_RIGHTS_APPROVED_MEDIA01_NOT_CLEARED');
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
  assert.equal(a.rights_clearance_for_new_assets,'APPROVED');
  assert.equal(match[0].release_clearance,'APPROVED');
  assert.equal(match[0].source_originality,'VERIFIED');
  assert.equal(match[0].approved_on,'2026-11-07');
  assert.match(match[0].approved_by,/Project owner/);
  assert.equal(match[0].rights_decision_ref,draft.owner_rights_decision_ref);
  assert.match(match[0].source_originality_basis,/owner attestation/i);
 }
}
// Keep every previously cleared recording intact; additional media must satisfy
// exactly the same per-asset hash, provenance and approval checks below.
const clearedBaseline=[
  [
    "public/foundation-audio/LIS-A1-01-v1.mp3",
    "7f7b514e30f1239d29cde08fe4e7b2ee2a448460dc392b4d4f390690adb9ae34"
  ],
  [
    "public/foundation-audio/LIS-A1-02-v1.mp3",
    "d12a2d350f04199ddfe918cdd5072bfcaf5489171aaab4738c8d74da1d3af23d"
  ],
  [
    "public/foundation-audio/LIS-A1-03-v1.mp3",
    "7659ec83a5c67a483333304f59730c8061583051311d8fd7ac3e1145e9722f02"
  ],
  [
    "public/foundation-audio/LIS-A1-04-v1.mp3",
    "dd339af00334eb78d6474b6f83a839830d0afa646e86eaeb4cfa21a8e042c59f"
  ],
  [
    "public/foundation-audio/LIS-A1-05-v1.mp3",
    "f97d2a280d3800b70f45fd99e32de2d0a5a01c0cb541f48d9cfc5443ea75f109"
  ],
  [
    "public/foundation-audio/LIS-A2-01-v2.mp3",
    "3f2bfa2166dd3e1386e41b4337ae7526adc13c13a3207114aa35e2439bdc1478"
  ],
  [
    "public/foundation-audio/LIS-A2-02-v1.mp3",
    "3cbe8e37ab59d454f97852eb45e6db8a60cd5bc61aad47ce732a1eecbc898b14"
  ],
  [
    "public/foundation-audio/LIS-A2-03-v1.mp3",
    "9142946715f6108c8b8ea7bca13f0d253cbe4f4770d87edad9d0905b2f17aaef"
  ],
  [
    "public/foundation-audio/LIS-A2-04-v1.mp3",
    "7bdc3f53e355e3bb5d2c630277a90fe8c8a2d8ec0d93ee23dd851e42e81795b9"
  ],
  [
    "public/foundation-audio/LIS-A2-05-v1.mp3",
    "efa886aaa4e9b952e318d35b34035436a4fb2787a017333773472733f43cf894"
  ],
  [
    "public/foundation-audio/LIS-A2-06-v1.mp3",
    "3196ce810efbaf5d15e2472e2eac41e2d87ba6ba25ee607713fcb12b94485494"
  ],
  [
    "public/foundation-audio/LIS-B1-01-v2.mp3",
    "e14ebf40777dd8bc24ffde008c06ec1053089b9f7919c78c999be2a15e11de1e"
  ],
  [
    "public/foundation-audio/LIS-B1-02-v1.mp3",
    "24c0c59ba28b1b87a4cba4a6f862a197f3f9d7cafd96b1516f734ac531b7dbe0"
  ],
  [
    "public/foundation-audio/LIS-B1-03-v1.mp3",
    "7d8bb350809371746697c804356c5ccf1f868d005a931725096e04290af07aeb"
  ],
  [
    "public/foundation-audio/LIS-B1-04-v1.mp3",
    "4f515a56283db80d5342f4b6ce408b65d7a1888db6dad5b39d6c046d1c28511d"
  ],
  [
    "public/foundation-audio/LIS-B1-05-v1.mp3",
    "104a38b181fa7588ccab4619e0655cdbc513494f7c0e925e52b6bfaf8ae2eea1"
  ],
  [
    "public/foundation-audio/LIS-B1-06-v1.mp3",
    "5a94108f77bbebb7f196daf3c6a89cb91fbaf5ea101a9f84a525d1ce87a4517d"
  ],
  [
    "public/foundation-audio/LIS-B1-07-v1.mp3",
    "e601704b3e7579a4880b490f4b07b6b10092415cdd25fa238384cec37e89b435"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-01-v1.mp3",
    "5bbb1a2765671524e511a04495ec78ddb62ffda37b8c50f723ca7f4d87ece3e3"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-02-v1.mp3",
    "9089df5528e2751e1e0a243180b45f564755e2cb4bacd4d977d3319a84428a6d"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-03-v1.mp3",
    "d4ce29e4b339a2889c9f01f61dbe9cea1e3530bef553c135e96806e94dc7f791"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-04-v1.mp3",
    "61ae474f0f69d3dcf244462abe49dfbd141fad071f534b11dddc7de9dd5f1889"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-05-v1.mp3",
    "8767372e2b413430bddcf612435091740ba61c89d79cbf2a9795c30b8d35f52f"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-06-v1.mp3",
    "c3159ae2fc08cc45a2b6979f626adb7ed4ef998583ea7fe76dd0d141a247110a"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-07-v1.mp3",
    "f13af239abb3fd6e4f969bd9b0f718517611e4cd8dcf4f3392f8d69340d8ef48"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-08-v1.mp3",
    "7cc8c8e197aa441f3046952d9681633d75faf2ead36573216a42bf03bc65acd3"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-09-v1.mp3",
    "87047a3a60943ec0c64cfcddc1ce330dae562b8e0d0282314c18e4103aa14c78"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-10-v1.mp3",
    "cdc6313befc3a7f43a958eb6852e5e97b3c09fd61d180f0ae0f8ffd0a4584837"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-11-v1.mp3",
    "7053e1e3b8bbaac6a9afb9d495e431307eec6af4a254e13071ca9df861c924e0"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-12-v1.mp3",
    "aa481eaf8f5eec27946b31af42be20a579245acd888417a3d05d300e0abb29b4"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-13-v1.mp3",
    "e517f70ff9d4420ae0abc8d62aa7e1686779b2bb01b2b335faabd8342f085e8f"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-14-v1.mp3",
    "6b2c326c7b28b98c18ab61a16343b23d0b7d17f7af204bf69def8778e3d30146"
  ],
  [
    "public/diagnostic-audio/DIAG-LIS-15-v1.mp3",
    "e316426de8fac9a873b1a6e9379d54ad3a5b5f99bc8eed31040998d611fc9682"
  ],
  [
    "public/pronunciation-audio/PRO-A2-01-v1.mp3",
    "d1da4f1793c2bd13df72072fc22c035be8c309003bc05b0f3490b0bdb58a389a"
  ],
  [
    "public/pronunciation-audio/PRO-A2-02-v1.mp3",
    "f0f13ae2d7343966d2eb94b0c86fc6f39db16fca7c7bfd5bafafb76fd4aaee19"
  ],
  [
    "public/pronunciation-audio/PRO-A2-03-v1.mp3",
    "4047089c8461ed41d7ff0cd57632940ad57e9ce64713304a55b67d49ec4d9e00"
  ],
  [
    "public/pronunciation-audio/PRO-B1-01-v1.mp3",
    "f32c5c2fee17707acf216bdad7af69a455d98137ce9210ed2e0afcb44935ab08"
  ],
  [
    "public/pronunciation-audio/PRO-B1-02-v1.mp3",
    "f5c75299bb8772fa0240e5b218a1110e7eb8192f3bb8acb8eeb5a1c324656c7c"
  ],
  [
    "public/foundation-audio/LIS-A1-01-v2.mp3",
    "99e89bc0ec02c91732b3b265447012841199b52da84db79615f33576bc73dd29"
  ],
  [
    "public/foundation-audio/LIS-A2-02-v2.mp3",
    "dc8ddb20211e05be2fdc86ffdb419582268255861f67aeb6f96dd1892b4671e3"
  ],
  [
    "public/foundation-audio/LIS-B1-02-v2.mp3",
    "92a7b222b8cf08591f49ac9ad54c6aabf47ab3755af86460a2635ea8efbb011d"
  ],
  [
    "public/foundation-audio/LIS-A1-06-v1.mp3",
    "91f736e9934476b44df0f4ab59eb2b381326bb144acd4475dcfa91e0fbe5bac6"
  ],
  [
    "public/foundation-audio/LIS-A2-07-v1.mp3",
    "04937096a911d5db09b470e97e459ded6e973c970a2ba388a6274883bf82064e"
  ],
  [
    "public/foundation-audio/LIS-B1-08-v1.mp3",
    "9082966b597522148eac25d618eff6e698990168a42305110ede1298f384ac82"
  ]
];
const byPath=new Map(register.entries.map(e=>[e.asset_path,e]));
for(const [asset,sha256] of clearedBaseline){const record=byPath.get(asset);assert(record,asset+' historical rights record missing');assert.equal(record.sha256,sha256,asset+' historical audio fingerprint changed');}
assert.equal(register.entries.length,actual.length,'Every physical MP3 needs a per-SHA rights record');
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