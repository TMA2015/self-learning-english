'use strict';
// One active release declaration; stable bundled JSON is a derived copy.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const validVersion=v=>typeof v==='string'&&/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v)&&v.split('.').map(Number).every(Number.isSafeInteger);
function verifyActiveRelease(){
 const m=JSON.parse(fs.readFileSync(path.join(root,'content/active-release.json'),'utf8'));
 assert.equal(m.schema,1);assert(validVersion(m.version),'Invalid active release version');
 assert.equal(m.sourcePath,'content/curriculum-'+m.version+'-candidate.json');
 for(const p of [m.reviewedPath,m.reviewReceiptPath])assert(typeof p==='string'&&/^content\/review-packets\/[A-Za-z0-9_.-]+$/.test(p)&&!p.endsWith('/..')&&!p.endsWith('/.'),'Invalid reviewed source path');
 for(const hash of [m.rawSha256,m.canonicalSha256,m.reviewReceiptSha256])assert(typeof hash==='string'&&/^[0-9a-f]{64}$/.test(hash),'Missing release digest');
 assert(Number.isSafeInteger(m.lessons)&&m.lessons>0&&m.lessons<=250);
 assert(Number.isSafeInteger(m.activities)&&m.activities>0&&m.activities<=m.lessons*24);
 assert.equal(new Date(m.bundledAt).toISOString(),m.bundledAt);
 const read=p=>fs.readFileSync(path.join(root,p));
 const bytes=read(m.sourcePath);
 assert.equal(sha(bytes),m.rawSha256,'Active versioned source digest mismatch');
 assert(bytes.equals(read(m.reviewedPath)),'Active source must be the independently reviewed candidate');
 assert(bytes.equals(read('content/active-curriculum.json')),'Bundled alias must be byte-identical to reviewed source');
 assert.equal(sha(read(m.reviewReceiptPath)),m.reviewReceiptSha256,'Review receipt digest mismatch');
 const source=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 assert.equal(source.schema_version,m.version);assert.equal(source.lessons.length,m.lessons);assert.equal(source.lessons.reduce((n,l)=>n+l.activities.length,0),m.activities);
 assert.equal(sha(JSON.stringify(canonical(source))),m.canonicalSha256,'Canonical source digest mismatch');
 const runtime=fs.readFileSync(path.join(root,'infrastructure/browser/local-runtime.ts'),'utf8');
 assert(runtime.includes("import activeCurriculum from '../../content/active-curriculum.json'"),'Runtime must bundle stable reviewed alias');
 assert(runtime.includes("import activeRelease from '../../content/active-release.json'"),'Runtime must use release metadata');
 assert(!/from ['"]\.\.\/\.\.\/content\/curriculum-\d+\.\d+\.\d+-candidate\.json['"]/.test(runtime),'Do not hardcode a second active curriculum');
 return {manifest:m,source};
}
module.exports={verifyActiveRelease};
if(require.main===module){const {manifest:m}=verifyActiveRelease();console.log(JSON.stringify({gate:'SLE_ACTIVE_RELEASE',result:'PASS',version:m.version,lessons:m.lessons,activities:m.activities,rawSha256:m.rawSha256}));}
