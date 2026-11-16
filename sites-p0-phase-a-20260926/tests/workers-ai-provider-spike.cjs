'use strict';
// Isolated Cloudflare Workers AI provider test. Synthetic data, mock bindings,
// no real Cloudflare account, no live inference and no third-party HTTP.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const ts=require(path.join(__dirname,'../node_modules/typescript'));
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/workers-ai-spike');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/ai/workers-ai-provider.ts','infrastructure/ai/openai-http.ts','ai/service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--skipLibCheck','--resolveJsonModule','--esModuleInterop'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const {WorkersAIProvider,SLE_WORKERS_AI_WRITING_MODEL}=require(path.join(out,'infrastructure/ai/workers-ai-provider.js'));
const {createTutorService}=require(path.join(out,'ai/service.js'));
assert.equal(SLE_WORKERS_AI_WRITING_MODEL,'@cf/meta/llama-3.3-70b-instruct-fp8-fast');
assert.equal(new WorkersAIProvider().available,false,'Absent binding must disable provider');
const output={summary:'The idea fits the task, but give a clearer reason.',
 strengths:['The main idea answers the activity question.'],
 improvements:['Explain why the activity suits the people in the prompt.'],
 exercise:'Add one reason and a concrete example.',tags:['reason-development']};
let calls=0;
const binding={run:async(model,payload)=>{
 calls++;
 assert.equal(model,SLE_WORKERS_AI_WRITING_MODEL);
 assert.deepEqual(payload.response_format,{type:'json_object'});
 assert.equal(payload.stream,false);
 assert(payload.max_tokens<=1800);
 assert.equal(payload.messages[0].role,'system');
 assert.equal(payload.messages[1].role,'user');
 assert(payload.messages[1].content.includes('SYNTHETIC_BRAINSTORM'));
 return {response:JSON.stringify(output)};
}};
const provider=new WorkersAIProvider(binding);
assert.equal(provider.available,true);
const task={schemaVersion:1,purpose:'feedback',promptVersion:'test',
 instructions:'Return structured feedback.',input:{studentWriting:'SYNTHETIC_BRAINSTORM'},
 temperature:.2};
(async()=>{
 const raw=await provider.generate(task);
 assert.deepEqual(raw,{provider:'cloudflare-workers-ai',model:SLE_WORKERS_AI_WRITING_MODEL,result:output});
 assert.equal(calls,1);

 const feedback=await createTutorService(provider).coach('analysis','Task',
  {ideas:'SYNTHETIC_BRAINSTORM'});
 assert.equal(feedback?.provider,'cloudflare-workers-ai');
 assert.equal(feedback?.structuredResult.summary,output.summary);
 assert.equal(calls,2);

 assert.equal(await provider.generate({...task,input:{text:'X'.repeat(13000)}}),null);
 assert.equal(await provider.generate({...task,instructions:'A'.repeat(16001)}),null);
 assert.equal(calls,2);
 assert.equal(await new WorkersAIProvider({run:async()=>({response:'not JSON'})}).generate(task),null);
 assert.equal(await new WorkersAIProvider({run:async()=>({response:'[1,2]'})}).generate(task),null);
 assert.equal(await new WorkersAIProvider({run:async()=>{throw Error('SECRET_NEVER_LOGGED')}}).generate(task),null);
 const alt=await new WorkersAIProvider({run:async()=>({
  choices:[{message:{content:JSON.stringify(output)}}],
 })}).generate(task);
 assert.equal(alt?.provider,'cloudflare-workers-ai');

 // Compile the actual server composition file, stub only the Cloudflare env.
 const src=fs.readFileSync(path.join(root,'infrastructure/ai/runtime.ts'),'utf8');
 const js=ts.transpileModule(src,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 fs.mkdirSync(path.join(out,'infrastructure/ai'),{recursive:true});
 fs.writeFileSync(path.join(out,'infrastructure/ai/runtime.js'),js);
 fs.mkdirSync(path.join(out,'infrastructure'),{recursive:true});
 fs.writeFileSync(path.join(out,'infrastructure/runtime.js'),
  "let config={};\nexports.runtimeConfig=()=>config;\nexports.setConfig=value=>{config=value;};\n");
 const host=require(path.join(out,'infrastructure/runtime.js'));
 const selected=require(path.join(out,'infrastructure/ai/runtime.js'));
 host.setConfig({SLE_WRITING_AI_PROVIDER:'cloudflare-workers-ai',AI:binding,
  OPENAI_API_KEY:'SYNTHETIC_BILLABLE_KEY'});
 assert.equal(selected.selectWritingAIProvider(host.runtimeConfig()).available,true);
 const viaServer=await selected.tutorService().coach('analysis','Task',
  {ideas:'SYNTHETIC_BRAINSTORM'});
 assert.equal(viaServer?.provider,'cloudflare-workers-ai');
 assert.equal(calls,3);

 host.setConfig({SLE_WRITING_AI_PROVIDER:'cloudflare-workers-ai',
  OPENAI_API_KEY:'SYNTHETIC_BILLABLE_KEY'});
 assert.equal(selected.tutorService().available,false,
  'Explicit binding mode must NOT fall back to potentially paid OpenAI');
 host.setConfig({OPENAI_API_KEY:'SYNTHETIC_LEGACY_KEY'});
 assert.equal(selected.tutorService().available,true,
  'Old server OpenAI behaviour must remain unchanged by default');
 host.setConfig({});
 assert.equal(selected.tutorService().available,false);
 assert.equal(calls,3);

 console.log(JSON.stringify({result:'PASS',gate:'SLE_WORKERS_AI_FREE_FIRST_SPIKE',
  syntheticCalls:calls,realExternalCalls:0,
  bindingRequired:true,noSilentPaidFallback:true,legacyOpenAIDefaultPreserved:true,
  strictJsonRequired:true,schemaValidated:true,realCloudflareInference:'NOT_TESTED',
  privacyData:'SYNTHETIC_ONLY',productionDeployment:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
