'use strict';
/**
 * Manual source intake preflight; source is NOT copied into the repository by this script.
 * Usage: node scripts/verify-foundation-writing-wave4-source.cjs path/to/original.md
 * Extract .md from the original owner archive without changing line endings.
 */
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const name='SLE_FOUNDATION_WRITING_AUTHORING_WAVE4_U10-U12_DRAFT_20261118.md';
const wanted='cca51171781dc535c6a4080107b0204561b850cfcaf33e089fce2eb184468083';
const bytes=68935;
const candidate=process.argv[2];
if(!candidate){console.error('SOURCE_NOT_FOUND: provide the exact original Markdown path. NO RELEASE.');process.exit(2)}
if(path.basename(candidate)!==name){console.error('WRONG_SOURCE_NAME: '+path.basename(candidate));process.exit(2)}
let raw;
try{raw=fs.readFileSync(candidate)}catch{console.error('SOURCE_NOT_READABLE. NO RELEASE.');process.exit(2)}
const actual=crypto.createHash('sha256').update(raw).digest('hex');
if(raw.length!==bytes||actual!==wanted){
 console.error(JSON.stringify({status:'SOURCE_MISMATCH',expectedBytes:bytes,actualBytes:raw.length,
  expectedSha256:wanted,actualSha256:actual,release:'NO_GO'}));
 process.exit(1);
}
console.log(JSON.stringify({status:'PASS',source:name,bytes,sha256:actual,
 contentReadyForMapping:true,contentMappedOrUITested:false,release:'NOT_YET_AUTHORIZED'}));
