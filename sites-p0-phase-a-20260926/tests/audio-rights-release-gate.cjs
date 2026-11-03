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
assert.equal(register.release,'1.18.1');
assert.equal(actual.length,41,'Expected 38 original + 3 versioned Kokoro replacement MP3s');
assert.equal(register.entries.length,41,'Every original and replacement MP3 requires a record');
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
const summary={audioIntegrity:'PASS',total:38,rightsApproved:38-missing.length,rightsPending:missing.length,mode:strict?'release-clearance':'integrity-only'};
console.log(JSON.stringify(summary));
if(strict&&missing.length){
  console.error('AUDIO_RIGHTS_BLOCKED: approval and provenance incomplete for '+missing.length+' assets. First: '+missing.slice(0,8).join(', '));
  process.exit(1);
}