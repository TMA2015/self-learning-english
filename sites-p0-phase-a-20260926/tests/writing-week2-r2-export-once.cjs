'use strict';
/** Disposable read-only log export from a previously-built R2 prototype HTML. */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'.sites-runtime/w2-r2-review/index.html');
if(!fs.existsSync(file)){
 const run=cp.spawnSync(process.execPath,['scripts/build-w2-r2-review.cjs'],{cwd:root,encoding:'utf8',timeout:120000});
 if(run.error)throw run.error;
 if(run.status!==0)throw Error((run.stderr||run.stdout).slice(-1200));
}
const html=fs.readFileSync(file,'utf8');
if(!html.startsWith('<!doctype html>')||!html.includes("connect-src 'none'")||!html.includes('Writing Coach'))
 throw Error('Unsafe or incomplete R2 review HTML');
const chars=Array.from(html),sha=crypto.createHash('sha256').update(html).digest('hex');
const n=2800,total=Math.ceil(chars.length/n);
console.log('SLE_W2_R2_BEGIN '+JSON.stringify({chunks:total,chars:chars.length,bytes:Buffer.byteLength(html,'utf8'),sha256:sha,network:'BLOCKED',origin:'R2 UX only'}));
for(let i=0;i<total;i++)console.log('SLE_W2_R2_CHUNK '+i+' '+JSON.stringify(chars.slice(i*n,i*n+n).join('')));
console.log('SLE_W2_R2_END '+sha);
console.log('PASS R2 one-off exporter: no credentials, no deployment, no learner data');
