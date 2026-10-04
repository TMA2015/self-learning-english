const assert=require('node:assert/strict');
const {GeminiHTTPProvider}=require('../.sites-runtime/portable-tests/infrastructure/ai/gemini-http.js');
const {OpenAIHTTPProvider}=require('../.sites-runtime/portable-tests/infrastructure/ai/openai-http.js');
const {createAIProvider}=require('../.sites-runtime/portable-tests/infrastructure/ai/provider-factory.js');

(async()=>{
  let seenUrl='',seenInit;
  const fakeFetch=async(url,init)=>{
    seenUrl=String(url);seenInit=init;
    return {
      ok:true,
      async json(){return {candidates:[{content:{parts:[{text:JSON.stringify({summary:'Useful feedback',strengths:['Clear idea'],improvements:['Add one example'],exercise:'Write one example sentence.',tags:['idea-development']})}]}}]}}
    };
  };
  const provider=new GeminiHTTPProvider('test-secret','gemini-test-model',fakeFetch);
  assert.equal(provider.available,true);
  const request={
    schemaVersion:1,
    purpose:'feedback',
    promptVersion:'1.0.0',
    instructions:'Return structured JSON only.',
    input:{studentWriting:'I like reading.',task:'Give an opinion.'},
    temperature:0.3
  };
  const result=await provider.generate(request);
  assert.equal(result.provider,'google-gemini');
  assert.equal(result.model,'gemini-test-model');
  assert.equal(result.result.summary,'Useful feedback');
  assert(seenUrl.endsWith('/models/gemini-test-model:generateContent'));

  const init=seenInit;
  assert.equal(init.method,'POST');
  assert.equal(init.headers['x-goog-api-key'],'test-secret');
  assert.equal(init.headers['Content-Type'],'application/json');
  const body=JSON.parse(init.body);
  assert.equal(body.systemInstruction.parts[0].text,request.instructions);
  assert.equal(body.contents[0].role,'user');
  assert.deepEqual(JSON.parse(body.contents[0].parts[0].text),request.input);
  assert.equal(body.generationConfig.temperature,0.3);
  assert.equal(body.generationConfig.responseMimeType,'application/json');

  const unavailable=new GeminiHTTPProvider(undefined,'gemini-test-model',async()=>{throw Error('must not call')});
  assert.equal(unavailable.available,false);
  assert.equal(await unavailable.generate(request),null);

  const failed=new GeminiHTTPProvider('key','gemini-test-model',async()=>({ok:false,json:async()=>({})}));
  assert.equal(await failed.generate(request),null);

  const malformed=new GeminiHTTPProvider('key','gemini-test-model',async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:'not-json'}]}}]})}));
  assert.equal(await malformed.generate(request),null);

  const explicitGemini=createAIProvider({AI_PROVIDER:'gemini',GEMINI_API_KEY:'g-key',GEMINI_MODEL:'g-model'});
  assert(explicitGemini instanceof GeminiHTTPProvider);
  assert.equal(explicitGemini.available,true);

  const explicitOpenAI=createAIProvider({AI_PROVIDER:'openai',OPENAI_API_KEY:'o-key',AI_MODEL:'o-model'});
  assert(explicitOpenAI instanceof OpenAIHTTPProvider);
  assert.equal(explicitOpenAI.available,true);

  const geminiOnly=createAIProvider({GEMINI_API_KEY:'g-key'});
  assert(geminiOnly instanceof GeminiHTTPProvider);

  const legacyDefault=createAIProvider({OPENAI_API_KEY:'o-key'});
  assert(legacyDefault instanceof OpenAIHTTPProvider);

  const disabledDefault=createAIProvider({});
  assert(disabledDefault instanceof OpenAIHTTPProvider);
  assert.equal(disabledDefault.available,false);

  console.log(JSON.stringify({
    geminiProvider:true,
    serverSecretOnly:true,
    structuredJson:true,
    providerContractUnchanged:true,
    explicitProviderSelection:true,
    legacyOpenAIFallbackPreserved:true,
    liveNetworkCall:false
  }));
})().catch(e=>{console.error(e);process.exitCode=1});
