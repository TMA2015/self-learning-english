// QA-only audit harness: collect ALL test failures in one bounded runner job.
// This is not a release approval or a substitute for pnpm qa:release.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=process.cwd();
const source=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
function list(name){
  const m=source.match(new RegExp('const '+name+'=\\[([\\s\\S]*?)\\];'));
  if(!m)throw Error('Cannot parse '+name+' from QA runner');
  return JSON.parse('['+m[1]+']');
}
const tests=[...new Set([...list('coreTests'),...list('fullRegressionTests')])];
const results=[];
const starting=Date.now();
function check(label,command,args,env=process.env,timeout=120000){
  const begun=Date.now();
  const x=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout,env,maxBuffer:10*1024*1024});
  const output=((x.stdout||'')+'\n'+(x.stderr||'')).trim();
  const ok=x.status===0&&!x.error;
  const matching=output.split(/\r?\n/).filter(line=>/AssertionError|Error:|error TS|FAIL|ELIFECYCLE|ERR_|Cannot find|Unexpected|SyntaxError|^not ok|^\s*at\s/i.test(line));
  const detail=ok?output.split(/\r?\n/).slice(-1).join(''):matching.slice(0,14).join(' | ')||output.slice(-1800);
  const result={label,pass:ok,exit:x.status,seconds:Math.round((Date.now()-begun)/1000),detail:detail.slice(0,2300)};
  results.push(result);
  console.log(JSON.stringify(result));
  return ok;
}
check('1.18 content/audio integrity',process.execPath,['tests/nov-2026-content-preflight.cjs']);
check('all 38 MP3 fingerprints and rights inventory (not clearance)',process.execPath,['tests/audio-rights-release-gate.cjs']);
for(const test of tests)check('test:'+test,process.execPath,['tests/'+test]);
const pnpm=process.platform==='win32'?'pnpm.cmd':'pnpm';
check('typescript-check',pnpm,['exec','tsc','--noEmit','--incremental','false'],process.env,240000);
const staticEnv={...process.env,STATIC_EXPORT:'1',NEXT_PUBLIC_LEARNING_RUNTIME:'browser',NEXT_PUBLIC_BASE_PATH:''};
const built=check('firebase-static-build',pnpm,['run','build'],staticEnv,360000);
if(built)check('firebase-static-contract',process.execPath,['tests/firebase-hosting-static.cjs'],staticEnv);
const failed=results.filter(x=>!x.pass);
const summary={qa:'1.18-aggregate-audit',tested:results.length,passed:results.length-failed.length,failed:failed.length,seconds:Math.round((Date.now()-starting)/1000),failedTests:failed.map(x=>x.label),status:failed.length?'FAIL':'PASS'};
fs.mkdirSync('docs/qa',{recursive:true});
fs.writeFileSync('docs/qa/nov1180-aggregate-audit.json',JSON.stringify({summary,results},null,2)+'\n');
console.log('FINAL_AGGREGATE_AUDIT '+JSON.stringify(summary));
if(failed.length)process.exitCode=1;
