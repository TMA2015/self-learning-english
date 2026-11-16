'use strict';
/**
 * SLE Issue #114: server-side (OpenAIHTTPProvider) policy fail-closed contract.
 * All credentials/payloads in this suite are synthetic. No remote HTTP.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const ts=require(path.join(__dirname,'../node_modules/typescript'));

const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/issue114-server-gate');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/ai/openai-http.ts','ai/service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const compiled=p=>path.join(out,p);
const gate=require(compiled('domain/learner-external-ai-gate.js'));
const {OpenAIHTTPProvider}=require(compiled('infrastructure/ai/openai-http.js'));
const {createTutorService}=require(compiled('ai/service.js'));
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
const previous=process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED;
process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED='1';
assert.equal(gate.learnerExternalAiEnabled(),false,'Build-time or env variable must not open policy gate');
if(previous===undefined)delete process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED;
else process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED=previous;
const request={
 schemaVersion:1,purpose:'feedback',promptVersion:'test',
 instructions:'No real instructions',input:{studentWriting:'SYNTHETIC_PRIVATE_TEXT'},
 temperature:0
};
let outboundCalls=0;
const forbiddenFetch=async()=>{outboundCalls++;throw Error('Network request must never be made')};
const provider=new OpenAIHTTPProvider('SYNTHETIC_TEST_KEY','not-a-real-model',forbiddenFetch);
assert.equal(provider.available,false,'Even a configured server credential must not enable provider');
assert.equal((new OpenAIHTTPProvider(undefined,'unused',forbiddenFetch)).available,false);
// Transpile the actual server composition using a synthetic runtimeConfig
// fixture; Cloudflare Workers and D1 types are covered by the full app build.
const serverRuntimeSource=load('infrastructure/ai/runtime.ts');
const serverRuntimeJs=ts.transpileModule(serverRuntimeSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
fs.mkdirSync(compiled('infrastructure/ai'),{recursive:true});
fs.writeFileSync(compiled('infrastructure/ai/runtime.js'),serverRuntimeJs);
fs.mkdirSync(compiled('infrastructure'),{recursive:true});
fs.writeFileSync(compiled('infrastructure/runtime.js'),"exports.runtimeConfig=()=>({OPENAI_API_KEY:'SYNTHETIC_SERVER_KEY',AI_MODEL:'fake-test-model'});");
(async()=>{
 try{
  assert.equal(await provider.generate(request),null,'Server provider must fail closed before HTTP call');
  const service=createTutorService(provider);
  assert.equal(service.available,false,'No AI capability should be advertised to server routes');
  assert.equal(await service.coach('analysis','Synthetic prompt',{answer:'SYNTHETIC_PRIVATE_TEXT'}),null);
  assert.equal(await service.evaluateWriting('SYNTHETIC_PRIVATE_TEXT','task'),null);
  assert.equal(await service.teachWriting('SYNTHETIC_PRIVATE_TEXT','task',{}),null);
  assert.equal(outboundCalls,0,'Server tutor must never call external provider');

  // Real server composition root; only the Cloudflare hosting adapter is fake.
  const {tutorService}=require(compiled('infrastructure/ai/runtime.js'));
  const providerService=tutorService();
  assert.equal(providerService.available,false,'Server composition must not expose AI');
  assert.equal(await providerService.evaluateWriting('SYNTHETIC_PRIVATE_TEXT','task'),null);
  assert.equal(await providerService.coach('analysis','task',{answer:'SYNTHETIC_PRIVATE_TEXT'}),null);
  assert.equal(outboundCalls,0,'No server request made despite synthetic configured secret');

  // Routes and services must use the shared gated server tutor root.
  const serverRoot=load('infrastructure/ai/runtime.ts');
  const providerSource=load('infrastructure/ai/openai-http.ts');
  assert(serverRoot.includes('learnerExternalAiEnabled()?config.OPENAI_API_KEY:undefined'));
  assert(providerSource.includes('if(!learnerExternalAiEnabled()||!this.available)return null'));
  for(const file of ['infrastructure/writing-runtime.ts','app/api/writing-review.ts',
                     'app/api/evaluate/route.ts']){
   assert(load(file).includes('tutorService'),'Expected server-side tutor reference: '+file);
  }
  assert(load('app/api/diagnostic/route.ts').includes('reviewWriting'),
   'Diagnostic must use shared gated writing review');
  assert(load('app/api/writing/route.ts').includes('learnerWriting'),
   'Server writing must use shared writingTutor composition');

  console.log(JSON.stringify({result:'PASS',gate:'ISSUE114_SERVER_PROVIDER_DEFAULT_CLOSED',
   runtimeWithSyntheticKey:'UNAVAILABLE',providerConfiguredButUnavailable:true,
   serverWritingEvaluation:'AI_PROVIDER_UNAVAILABLE',serverDiagnosticAIRatings:'AI_PROVIDER_UNAVAILABLE',
   externalHttpCalls:outboundCalls,realLearnerData:'NOT_ACCESSED',realAPIRequests:0}));
 }finally{/* Isolated test files removed on the next run. */}
})().catch(e=>{console.error(e);process.exitCode=1});
