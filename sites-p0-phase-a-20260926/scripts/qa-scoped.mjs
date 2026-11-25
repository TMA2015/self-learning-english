import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const tier=process.env.SLE_QA_TIER,skills=(process.env.SLE_QA_SKILLS||'').split(',');
assert(['1','2'].includes(tier),'Explicit scoped tier required');
const groups={vocabulary:['vocabulary-knowledge-v23.cjs','vocabulary-knowledge-v23-browser.cjs'],grammar:['grammar-knowledge-v23.cjs','grammar-knowledge-v23-browser.cjs']};
assert(skills.length&&skills.every(s=>Object.hasOwn(groups,s)),'Unknown scope; full QA required');
const pnpm=process.platform==='win32'?'pnpm.cmd':'pnpm';
function run(cmd,args,env=process.env){
 console.log('=== '+[cmd,...args].join(' ')+' ===');
 const r=spawnSync(cmd,args,{stdio:'inherit',env});
 if(r.error)throw r.error;
 if(r.status!==0)process.exit(r.status??1);
}
const tests=['sle-release-safety.cjs','stage3-release-activation-gate.cjs','stage3-multiversion-storage-gate.cjs','nov-2026-content-preflight.cjs',...skills.flatMap(s=>groups[s])];
if(tier==='2')tests.push('version-aware-attempt-ux.cjs','foundation-results-ux.cjs','foundation-compact-practice.cjs','foundation-compact-browser.cjs','storage-retention-v2.cjs','sle-combined-ui-browser.cjs');
for(const test of [...new Set(tests)])run(process.execPath,['tests/'+test]);
run(process.execPath,['tests/audio-rights-release-gate.cjs','--require-clearance']);
run(pnpm,['exec','tsc','--noEmit','--incremental','false']);
const env={...process.env,STATIC_EXPORT:'1',NEXT_PUBLIC_LEARNING_RUNTIME:'browser',NEXT_PUBLIC_BASE_PATH:''};
run(pnpm,['run','build'],env);
run(process.execPath,['tests/firebase-hosting-static.cjs'],env);
console.log(JSON.stringify({result:'PASS',suite:'scoped-release',tier,skills,tests:[...new Set(tests)],fullRegression:false}));
