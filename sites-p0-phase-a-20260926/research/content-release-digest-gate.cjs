'use strict';
// #251 isolated engineering gate. Not registered, not runtime authorization.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash,webcrypto}=require('node:crypto');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const hex=(algorithm,bytes)=>createHash(algorithm).update(bytes).digest('hex');
const gitBlob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const canonicalBytes=v=>Buffer.from(JSON.stringify(canonical(v)),'utf8');
async function digestBoth(bytes){
 const node=hex('sha256',bytes), browser=Buffer.from(await webcrypto.subtle.digest('SHA-256',bytes)).toString('hex');
 assert.equal(node,browser,'Node/WebCrypto mismatch');return node;
}
async function verify(bytes,pin){
 assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,pin.byteLength,'length');
 assert.equal(gitBlob(bytes),pin.gitBlob,'Git blob');
 assert.equal(await digestBoth(bytes),pin.rawSha256,'raw SHA-256');
 if(pin.version){
  const parsed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  assert.equal(parsed.schema_version,pin.version,'version');
  assert.equal(parsed.lessons.length,pin.lessons,'lesson count');
  assert.equal(parsed.lessons.reduce((n,l)=>n+l.activities.length,0),pin.activities,'activity count');
  assert.equal(await digestBoth(canonicalBytes(parsed)),pin.canonicalSha256,'canonical SHA-256');
 }
}
async function selfTest(){
 const src={schema_version:'1.28.1',lessons:[{id:'L1',activities:[{id:'Q1',prompt:'Café — học tiếng Anh'}]}]};
 const bytes=Buffer.from(JSON.stringify(src,null,2)+'\n');
 const pin={byteLength:bytes.length,gitBlob:gitBlob(bytes),rawSha256:await digestBoth(bytes),version:'1.28.1',lessons:1,activities:1,canonicalSha256:await digestBoth(canonicalBytes(src))};
 assert.equal(await digestBoth(Buffer.from('abc')),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 await verify(bytes,pin);
 const changed=Buffer.from(bytes);changed[changed.indexOf('Q1')+1]=50;
 const cases=[['truncated',bytes.subarray(0,-1),pin],['same-length tamper',changed,pin],['wrong raw',bytes,{...pin,rawSha256:'0'.repeat(64)}],['wrong canonical',bytes,{...pin,canonicalSha256:'0'.repeat(64)}],['wrong version',bytes,{...pin,version:'1.28.2'}],['wrong lesson count',bytes,{...pin,lessons:2}],['wrong activity count',bytes,{...pin,activities:2}]];
 for(const [name,data,expected] of cases)await assert.rejects(()=>verify(data,expected),undefined,name);
 return 9;
}
async function main(){
 const self=await selfTest();
 if(process.argv.includes('--self-test')){console.log(JSON.stringify({selfTest:self+'/'+self,exactReviewedSources:'NOT_TESTED'}));return;}
 const root=path.resolve(__dirname,'..'),fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'content-release-exact-digest-fixture.json'),'utf8'));
 const expected={base:['content/curriculum-1.28.0-candidate.json','9d931a6930b8cd3ed918db1fa22e8708b7a9f884'],successor:['content/curriculum-1.28.1-candidate.json','ef69d4a9d4ed13fb3de7702ce6600e062c1039f2'],reviewPatch:['content/review-packets/SLE_REA_BASELINE_WORDING_PATCH_20261126.json','ab8c7d187164a2576ffcebb54506dc221d0eb249'],reviewReceipt:['content/review-packets/SLE_REA_BASELINE_WORDING_PASS_RECEIPT_20261126.md','819f1e2f2ada34097bfd40165f15641696d12d95']};
 for(const [name,[file,blob]] of Object.entries(expected)){
  const pin=fixture[name];assert.equal(pin.path,file);assert.equal(pin.gitBlob,blob);
  if(name==='base'||name==='successor'){assert.equal(pin.version,name==='base'?'1.28.0':'1.28.1');assert.equal(pin.lessons,176);assert.equal(pin.activities,1224);assert.match(pin.canonicalSha256,/^[a-f0-9]{64}$/);}
  await verify(fs.readFileSync(path.join(root,file)),pin);
 }
 console.log(JSON.stringify({selfTest:self+'/'+self,exactReviewedSources:'4/4',nodeWebCrypto:'MATCH',authorization:'SEPARATE_OWNER_GATED_CI',runtime:'NOT_TESTED'}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
