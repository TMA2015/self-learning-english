'use strict';
/**
 * One-time REVIEW-ONLY build/export for a public synthetic HTML page.
 * This script belongs to an isolated throwaway Draft PR, never to main or PR #153.
 * It emits JSON-escaped HTML chunks to the PUBLIC GitHub Actions log so that the
 * reviewed artifact can be copied into a separate review branch without CI write
 * credentials, a new workflow or any Firebase/production deployment.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');

const root=path.resolve(__dirname,'..');
const proc=cp.spawnSync(process.execPath,['scripts/build-w2-review-preview.cjs'],{
  cwd:root,encoding:'utf8',timeout:100_000,maxBuffer:10_000_000
});
if(proc.error)throw proc.error;
if(proc.status!==0)throw Error('Preview build failed: '+(proc.stderr||proc.stdout).slice(-1800));
const file=path.join(root,'.sites-runtime/w2-review-artifact/index.html');
const input=fs.readFileSync(file,'utf8');
assert(input.startsWith('<!doctype html>'));
assert(input.includes('Writing Week 2')||input.includes('Writing Coach'));
assert(input.includes('No login, no Gemini calls, no cloud saving'));
assert(input.includes('React'));
assert(!/<script[^>]*\bsrc\s*=/i.test(input),'all JS must be inline');
assert(!/<link[^>]*\bhref\s*=/i.test(input),'all styles must be inline');
assert(!/\bhttps?:\/\/[\w.-]+\/(?:api|v1|rpc)\//i.test(input),'no API endpoints in portable preview');
const csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-src 'none'";
const meta='<meta http-equiv="Content-Security-Policy" content="'+csp+'">';
const html=input.replace('</head>',meta+'</head>');
assert(html.includes("connect-src 'none'"));
const chars=Array.from(html);
const chunks=[];
for(let i=0;i<chars.length;i+=3000)chunks.push(chars.slice(i,i+3000).join(''));
const sha=crypto.createHash('sha256').update(html).digest('hex');
console.log('SLE_W2_PREVIEW_BEGIN '+JSON.stringify({
 chunks:chunks.length,chars:chars.length,bytes:Buffer.byteLength(html,'utf8'),
 sha256:sha,snapshot:'SLE-W2-R1-PR153',source:process.env.GITHUB_SHA||'synthetic PR merge',
 network:'BLOCKED',production:'NOT TOUCHED'
}));
for(let i=0;i<chunks.length;i++)console.log('SLE_W2_PREVIEW_CHUNK '+i+' '+JSON.stringify(chunks[i]));
console.log('SLE_W2_PREVIEW_END '+sha);
console.log('PASS standalone Week 2 preview exported without secrets, accounts, backend, Firebase or deployment');
