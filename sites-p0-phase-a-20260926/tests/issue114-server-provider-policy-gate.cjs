'use strict';
/** Regression: configured server provider remains available with synthetic requests only. */
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
const {OpenAIHTTPProvider}=require(compiled('infrastructure/ai/openai-http.js'));
const {createTutorService}=require(compiled('ai/service.js'));
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
let mockCalls=0,realCalls=0;
const mockFetch=async(url,options)=>{
 mockCalls++;
 assert.equal(url,'https://api.openai.com/v1/chat/completions');
 assert.equal(options.headers.Authorization,'Bearer SYNTHETIC_TEST_KEY');
 const body=JSON.parse(options.body);
 assert.equal(body.model,'synthetic-test-model');
 assert.equal(body.messages.length,2);
 assert.equal(body.messages[1].content.includes('SYNTHETIC_WRITING'),true);
 return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({
  summary:'Example only',strengths:[],improvements:[],exercise:'Add a reason',tags:[],
 })}}]}),{status:200,headers:{'Content-Type':'application/json'}});
};
const provider=new OpenAIHTTPProvider('SYNTHETIC_TEST_KEY','synthetic-test-model',mockFetch);
assert.equal(provider.available,true,'Server AI must not be blocked globally when configured');
const unavailable=new OpenAIHTTPProvider(undefined,'unused',async()=>{realCalls++;throw Error('Never called')});
assert.equal(unavailable.available,false,'No-key server remains unavailable');
(async()=>{
 const result=await provider.generate({
  schemaVersion:1,purpose:'feedback',promptVersion:'synthetic',
  instructions:'Never log learner data',input:{studentWriting:'SYNTHETIC_WRITING'},temperature:0,
 });
 assert.equal(result.provider,'openai');
 assert.equal(result.result.summary,'Example only');
 assert.equal(mockCalls,1);
 assert.equal(await unavailable.generate({
  schemaVersion:1,purpose:'feedback',promptVersion:'synthetic',
  instructions:'',input:{studentWriting:'SYNTHETIC_WRITING'},temperature:0,
 }),null);
 assert.equal(realCalls,0);
 const service=createTutorService(provider);
 assert.equal(service.available,true);

 // Execute the ACTUAL server composition root with a fake hosting adapter,
 // not an actual Cloudflare environment or network.
 const source=load('infrastructure/ai/runtime.ts');
 const compiledSource=ts.transpileModule(source,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
 }}).outputText;
 fs.mkdirSync(compiled('infrastructure/ai'),{recursive:true});
 fs.writeFileSync(compiled('infrastructure/ai/runtime.js'),compiledSource);
 fs.mkdirSync(compiled('infrastructure'),{recursive:true});
 fs.writeFileSync(compiled('infrastructure/runtime.js'),
  "exports.runtimeConfig=()=>({OPENAI_API_KEY:'SYNTHETIC_TEST_KEY',AI_MODEL:'synthetic-test-model'});");
 const originalFetch=global.fetch;
 try{
  global.fetch=mockFetch;
  const {tutorService}=require(compiled('infrastructure/ai/runtime.js'));
  const configured=tutorService();
  assert.equal(configured.available,true,'Server OpenAI Writing capability restored');
  const advice=await configured.coach('analysis','Practice topic',{answer:'SYNTHETIC_WRITING'});
  assert(advice,'Synthetic OpenAI server Writing coach should return valid structured guidance');
  assert.equal(advice.structuredResult.summary,'Example only');
  assert.equal(mockCalls,2);
 }finally{global.fetch=originalFetch}

 assert(load('infrastructure/ai/runtime.ts').includes('config.OPENAI_API_KEY'));
 assert(!load('infrastructure/ai/openai-http.ts').includes('learnerExternalAiEnabled'));
 assert(!load('infrastructure/browser/firebase-ai-browser.ts').includes('learnerExternalAiEnabled'),
   'Gemini browser provider should not have a blanket deny function');
 for(const file of ['infrastructure/writing-runtime.ts','app/api/writing-review.ts',
  'app/api/evaluate/route.ts']){
  assert(load(file).includes('tutorService'),'Shared Writing server provider missing: '+file);
 }
 console.log(JSON.stringify({result:'PASS',gate:'SLE_GENERAL_AUDIENCE_SERVER_AI_AVAILABLE',
  configuredServerOpenAI:true,unconfiguredOpenAI:false,geminiSeparateHold:false,
  mockedOpenAIRequests:mockCalls,realOpenAIRequests:realCalls,
  syntheticDataOnly:true,productionDeployment:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
