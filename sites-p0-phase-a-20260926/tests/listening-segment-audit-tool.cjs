'use strict';
/**
 * Tests the offline (NOT shipped) manual MP3 boundary review tool.
 * No auto-estimated offsets or verified segments can reach the learner player.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const ids=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const output=cp.execFileSync(process.execPath,['scripts/build-listening-segment-audit.cjs',...ids],
 {cwd:root,encoding:'utf8'});
const receipt=JSON.parse(output);
assert.equal(receipt.result,'PASS');
assert.equal(receipt.verifiedSegmentCount,0);
assert.equal(receipt.productionEnabled,false);
assert.equal(receipt.noFirebaseWrites,true);
assert.deepEqual(receipt.outputs.map(x=>x.lessonId),ids);
for(const id of ids){
 const target=path.join(root,'.sites-runtime/listening-segment-audit',id+'-offline-audit.html');
 assert(fs.existsSync(target),id+' HTML output missing');
 assert(!target.includes('/public/')&&!target.includes('/dist/client/'));
 const html=fs.readFileSync(target,'utf8');
 const match=html.match(/const auditData=(\{[\s\S]*?\});/);
 assert(match,id+' payload was not embedded');
 const data=JSON.parse(match[1]),meta=manifest[id];
 assert.equal(data.lessonId,id);
 assert.equal(data.sha256,meta.sha256);
 assert.equal(data.duration,meta.duration);
 assert.equal(data.url,meta.url);
 assert.equal(data.lines.length,receipt.outputs.find(x=>x.lessonId===id).lines);
 assert.equal(data.lines.join(' ').replace(/\s+/g,' ').length>40,true);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'public',data.url.slice(1)))).digest('hex'),data.sha256);
 assert.match(html,/crypto\.subtle\.digest\("SHA-256"/);
 assert.match(html,/CANDIDATE_UNVERIFIED/);
 assert.match(html,/productionEnabled:false/);
 assert.match(html,/replayChecked/);
 assert.match(html,/actualDuration/);
 assert.match(html,/rows\[i\]\.startMs<rows\[i-1\]\.endMs/);
 assert.match(html,/STOP_AT_THIS_DOES_NOT_EXIST|stopAt/);
 assert.match(html,/Offline engineering tool/);
 assert(!/firebase\.google\.com|\/api\/foundation|\bfetch\(|XMLHttpRequest|sendBeacon/.test(html),
  'Offline audit must not fetch/post source or change learner records');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new vm.Script(scripts[0][1],{filename:id+'.offline-audit.js'}));
}
const production=fs.readFileSync(path.join(root,'app/listening-dictation.tsx'),'utf8');
assert(!production.includes('CANDIDATE_UNVERIFIED'));
assert(!production.includes('build-listening-segment-audit'));
assert(!production.includes('listening-segment-audit.template'));
assert(!production.includes('verifiedSegments={['),
 'Production must not embed guessed or unverified timing metadata');
const runner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
assert(runner.includes('listening-segment-audit-tool.cjs'));
console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_OFFLINE_SEGMENT_AUDITOR',
 lessons:ids,sourceFiles:3,sha256Verified:3,proposedSegments:0,
 learnerPlayerChanges:0,productionEnabled:false,noExternalRequests:true}));
