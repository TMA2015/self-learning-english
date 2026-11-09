'use strict';
/** Source-first fail-closed QA only: no reviewed packet or user history required. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {PACKET,SHA256,PACKET_ID,expected,unitMap,checkPacket,validateAuthored}
 =require('../scripts/stage-f2-bulk12-v125-candidate.cjs');
assert.equal(PACKET,'SLE_BULK12_A1A2B1_NOTEBOOKLM_R1_20261109.md');
assert.equal(PACKET_ID,'SLE-F2-BULK12-A1A2B1-AUTHORED-20261109-R1');
assert.equal(SHA256,'5de3c0c2b7f85420a804f5c6201b07912776501584bb598e0446fd26301da5c9');
assert.equal(expected.length,12);
assert.equal(new Set(expected.map(x=>x[1])).size,12);
assert.equal(expected.filter(x=>x[2]==='reading').reduce((n,x)=>n+x[4].length,0),34);
assert.equal(expected.filter(x=>x[2]==='writing').length,6);
assert.equal(Object.keys(unitMap).length,6);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sle-v125-intake-'));
try{
 assert.throws(()=>checkPacket(path.join(dir,'missing.md')),/SOURCE_MISSING/);
 const fake=path.join(dir,PACKET);fs.writeFileSync(fake,'not the reviewed Markdown source\n');
 assert.throws(()=>checkPacket(fake),/SOURCE_SHA_MISMATCH/);
 assert.throws(()=>validateAuthored({packet_id:PACKET_ID,source_packet_sha256:SHA256,
  review_scope:'AUTHORED_CONTENT_ITEM_LEVEL',academic_disposition:'GO_FOR_MACHINE_SCHEMA_DRAFT',
  production:'NO_GO_PENDING_TECHNICAL_CI_AND_OWNER_RELEASE',unit_assignments:unitMap,lessons:[]}),
  /deep-equal/,'Empty candidate cannot pass');
 const script=path.join(__dirname,'../scripts/stage-f2-bulk12-v125-candidate.cjs');
 let code=null;try{execFileSync(process.execPath,[script],{stdio:'pipe'})}catch(e){code=e.status}
 assert.equal(code,2,'Missing source flags must be blocking');
 console.log(JSON.stringify({result:'PASS',gate:'F2_V125_SOURCE_INTEGRITY_INTAKE',
  lessons:12,activities:40,objectiveReading:34,unscoredWriting:6,
  sourceTamperRejected:true,missingPacketRejected:true,emptyDraftRejected:true,
  producedCandidate:false,productionImport:false,deploy:false}));
}finally{fs.rmSync(dir,{recursive:true,force:true})}
