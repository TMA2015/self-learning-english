// Called only by the verified exact-tree LIVE workflow lane. Never substitutes for PR QA.
import {spawnSync} from 'node:child_process';
const pnpm=process.platform==='win32'?'pnpm.cmd':'pnpm';
function run(cmd,args,env=process.env){
 console.log('=== '+[cmd,...args].join(' ')+' ===');
 const result=spawnSync(cmd,args,{stdio:'inherit',env});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
for(const [name,args] of [
 ['stage3-release-activation-gate.cjs',[]],
 ['sle-release-safety.cjs',[]],
 ['current-curriculum-integrity.cjs',[]],
 ['current-curriculum-audio-readiness.cjs',[]],
 ['audio-rights-release-gate.cjs',['--require-clearance']],
 ['curriculum-v1281-import-history-quota.cjs',[]],
 ['browser-curriculum-upgrade.cjs',[]],
 ['automatic-curriculum-v120.cjs',[]],
 ['storage-retention-v2.cjs',[]],
 ['restore-v2-auto-retention-quota.cjs',[]],
])run(process.execPath,['tests/'+name,...args],{...process.env,QA_AGGREGATE:'1'});
run(pnpm,['exec','tsc','--noEmit','--incremental','false']);
const env={...process.env,STATIC_EXPORT:'1',NEXT_PUBLIC_LEARNING_RUNTIME:'browser',NEXT_PUBLIC_BASE_PATH:''};
run(pnpm,['run','build'],env);
run(process.execPath,['tests/firebase-hosting-static.cjs'],env);
console.log(JSON.stringify({result:'PASS',suite:'verified-pr-release-rebuild',fullRegressionExecutedHere:false}));
