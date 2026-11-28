'use strict';
// Reuse only a successful same-repository full PR QA on the exact deployed tree.
// No artifact execution/download, no user-selected run, no fallback to a stale PASS.
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const hex=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x);
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:8*1024*1024}).trim();
const prPath='.github/workflows/english-pr-qa.yml';
const receiptStep='Record exact full PR QA receipt';
const qaStep='Full application release QA and static build (NO DEPLOY)';
const workflowStep='Verify approved workflow and trigger policy';
const safeId=x=>Number.isSafeInteger(x)&&x>0;
function environment(){return {node:process.version,pnpm:cp.execFileSync('pnpm',['--version'],{encoding:'utf8'}).trim(),os:process.env.RUNNER_OS,arch:process.env.RUNNER_ARCH,imageOS:process.env.ImageOS,imageVersion:process.env.ImageVersion};}
function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function checkReceipt(v,e){
 assert(v&&v.schema===1&&v.suite==='full');
 for(const key of ['repo','pr','base','head','tree','run','attempt'])assert.equal(v[key],e[key],key);
 assert(hex(v.checkout)&&hex(v.tree)&&hex(v.base)&&hex(v.head));
 assert(safeId(v.pr)&&safeId(v.run)&&safeId(v.attempt));
 assert(Object.values(e.env).every(x=>typeof x==='string'&&x.length),'Incomplete current runner identity');
 assert(eq(v.env,e.env),'Different toolchain/runner image');
 return v.checkout;
}
function parseReceipt(log){
 const found=log.split(/\r?\n/).map(x=>x.match(/^\d{4}-\d\d-\d\dT\S+ SLE_FULL_QA_RECEIPT_V1 (\{.*\})\s*$/)).filter(Boolean);
 assert.equal(found.length,1,'Missing/ambiguous exact QA receipt');
 return JSON.parse(found[0][1]);
}
function checkCommit(commit,checkout,e){
 assert.equal(commit.sha,checkout);
 assert.equal(commit.tree?.sha,e.tree);
 assert.deepEqual(commit.parents?.map(x=>x.sha),[e.base,e.head]);
}
function selfTest(){
 const a='a'.repeat(40),b='b'.repeat(40),c='c'.repeat(40),d='d'.repeat(40);
 const e={repo:'owner/repo',pr:9,base:a,head:b,tree:c,run:100,attempt:1,env:{node:'v24.1.0',pnpm:'11.25.0',os:'Linux',arch:'X64',imageOS:'ubuntu24',imageVersion:'v1'}};
 const v={...e,schema:1,suite:'full',checkout:d};
 assert.equal(checkReceipt(v,e),d);
 checkCommit({sha:d,tree:{sha:c},parents:[{sha:a},{sha:b}]},d,e);
 const log='2026-11-27T12:00:00.000Z SLE_FULL_QA_RECEIPT_V1 '+JSON.stringify(v);
 assert.deepEqual(parseReceipt(log),v);
 for(const key of ['repo','pr','base','head','tree','run','attempt','suite','env','checkout'])assert.throws(()=>checkReceipt({...v,[key]:null},e),undefined,key);
 assert.throws(()=>parseReceipt(log+'\n'+log));
 assert.throws(()=>parseReceipt('no receipt'));
 assert.throws(()=>checkCommit({sha:d,tree:{sha:a},parents:[{sha:a},{sha:b}]},d,e));
 assert.throws(()=>checkCommit({sha:d,tree:{sha:c},parents:[{sha:b},{sha:a}]},d,e));
 console.log('EXACT_PR_QA_RECEIPT_SELF_TEST_PASS');
}
function emit(){
 assert.equal(process.env.GITHUB_EVENT_NAME,'pull_request');
 const checkout=git('rev-parse','HEAD'),base=process.env.SLE_PR_BASE,head=process.env.SLE_PR_HEAD;
 assert.equal(checkout,process.env.GITHUB_SHA);
 assert.deepEqual(git('show','-s','--format=%P',checkout).split(' '),[base,head]);
 assert(hex(base)&&hex(head));
 const receipt={schema:1,suite:'full',repo:process.env.GITHUB_REPOSITORY,pr:Number(process.env.SLE_PR_NUMBER),base,head,tree:git('rev-parse','HEAD^{tree}'),checkout,run:Number(process.env.GITHUB_RUN_ID),attempt:Number(process.env.GITHUB_RUN_ATTEMPT),env:environment()};
 checkReceipt(receipt,receipt);
 console.log('SLE_FULL_QA_RECEIPT_V1 '+JSON.stringify(receipt));
}
async function verify(){
 const base=process.env.SLE_QA_BASE,head=process.env.GITHUB_SHA,repo=process.env.GITHUB_REPOSITORY,token=process.env.SLE_ACTIONS_READ_TOKEN;
 assert(process.env.GITHUB_EVENT_NAME==='push'&&process.env.GITHUB_REF==='refs/heads/main');
 assert(hex(base)&&hex(head)&&base!==head&&git('rev-parse','HEAD')===head);
 assert.equal(git('show','-s','--format=%P',head),base,'Not one squash commit on exact base');
 assert(git('log','-1','--format=%B',head).includes('[release-english]'));
 assert(/^[\w.-]+\/[\w.-]+$/.test(repo)&&token);
 // New QA/workflow policy must first be proven via the existing full lane.
 for(const path of ['.github/workflows','scripts', 'sites-p0-phase-a-20260926/scripts/qa-release.mjs','sites-p0-phase-a-20260926/scripts/qa-free-first.mjs','sites-p0-phase-a-20260926/scripts/qa-scoped.mjs']){
  assert(!git('diff','--name-only',base,head,'--',path),'QA policy/runner changed');
 }
 const api='https://api.github.com/repos/'+repo;
 async function get(path,asText=false){
  const response=await fetch(api+path,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(10000)});
  assert(response.ok,'GitHub evidence unavailable: '+response.status);
  return asText?await response.text():await response.json();
 }
 const prs=await get('/commits/'+head+'/pulls?per_page=100');
 const candidates=prs.filter(p=>p.merged_at&&p.merge_commit_sha===head&&p.base?.ref==='main'&&p.base?.repo?.full_name===repo&&p.head?.repo?.full_name===repo&&hex(p.head?.sha)&&safeId(p.number));
 assert.equal(candidates.length,1,'No unique same-repository merged PR');
 const pr=candidates[0];
 const list=await get('/actions/workflows/english-pr-qa.yml/runs?event=pull_request&head_sha='+pr.head.sha+'&status=success&per_page=20');
 const tree=git('rev-parse','HEAD^{tree}'),env=environment();
 for(const run of list.workflow_runs??[]){
  try{
   assert(run.event==='pull_request'&&run.status==='completed'&&run.conclusion==='success'&&run.head_sha===pr.head.sha&&run.head_repository?.full_name===repo&&run.repository?.full_name===repo);
   assert(run.path===prPath||run.path===prPath+'@refs/pull/'+pr.number+'/merge');
   assert(safeId(run.id)&&safeId(run.run_attempt));
   const jobs=await get('/actions/runs/'+run.id+'/attempts/'+run.run_attempt+'/jobs?per_page=100');
   const selected=(jobs.jobs??[]).filter(j=>j.name==='qa'&&j.conclusion==='success'&&j.run_id===run.id&&safeId(j.id)&&[workflowStep,qaStep,receiptStep].every(name=>j.steps?.some(s=>s.name===name&&s.conclusion==='success')));
   assert.equal(selected.length,1,'Full QA job/steps not successful');
   const v=parseReceipt(await get('/actions/jobs/'+selected[0].id+'/logs',true));
   const expected={repo,pr:pr.number,base,head:pr.head.sha,tree,run:run.id,attempt:run.run_attempt,env};
   const checkout=checkReceipt(v,expected);
   checkCommit(await get('/git/commits/'+checkout),checkout,expected);
   return {run:run.id,attempt:run.run_attempt,checkout,tree,pr:pr.number};
  }catch(e){console.log('PR_QA_REUSE_REJECTED: '+e.message);}
 }
 throw Error('No exact full PR QA receipt matched');
}
async function main(){
 selfTest();
 if(process.argv.includes('--self-test'))return;
 if(process.argv.includes('--emit'))return emit();
 assert(process.argv.includes('--verify'),'Explicit verification mode required');
 let evidence;
 try{evidence=await verify();}catch(e){console.log('PR_QA_REUSE_FALLBACK_FULL: '+e.message);}
 if(evidence)console.log('PR_QA_REUSE_VERIFIED: '+JSON.stringify(evidence));
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'verified='+(evidence?'true':'false')+'\nrun_id='+(evidence?.run??'')+'\n');
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,evidence?'\nExact full PR QA reused: run '+evidence.run+', checkout '+evidence.checkout+', tree '+evidence.tree+'. Rebuild and mandatory release gates remain.\n':'\nExact PR QA reuse unavailable; existing selected QA remains mandatory.\n');
}
main().catch(e=>{console.error(e);process.exitCode=1});
