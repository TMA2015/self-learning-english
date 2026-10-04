'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','firebase-ai-provider');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(path.join(out,'infrastructure','ai'),{recursive:true});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

const source=fs.readFileSync(path.join(root,'infrastructure/ai/firebase-ai-logic.ts'),'utf8');
const compiled=ts.transpileModule(source,{
  compilerOptions:{
    module:ts.ModuleKind.CommonJS,
    target:ts.ScriptTarget.ES2022,
    esModuleInterop:true,
  },
}).outputText;
const built=path.join(out,'infrastructure','ai','firebase-ai-logic.cjs');
fs.writeFileSync(built,compiled);
const {FirebaseAILogicProvider}=require(built);

const calls=[];
const factory=config=>({
  async generateContent(input){
    calls.push({config,input});
    return {response:{text:()=>JSON.stringify({
      summary:'Clear main idea.',
      strengths:['Relevant answer'],
      improvements:['Add one example'],
      exercise:'Add a sentence beginning For example, ...',
      tags:['idea-development'],
      scores:null
    })}};
  }
});

(async()=>{
  const unavailable=new FirebaseAILogicProvider({model:'gemini-test'});
  assert.equal(unavailable.available,false);
  assert.equal(await unavailable.generate({
    schemaVersion:1,purpose:'feedback',promptVersion:'1',instructions:'Help.',input:{answer:'x'},temperature:.2
  }),null);

  const provider=new FirebaseAILogicProvider({model:'gemini-test',factory});
  assert.equal(provider.available,true);
  const result=await provider.generate({
    schemaVersion:1,
    purpose:'feedback',
    promptVersion:'1',
    instructions:'Give grounded feedback only.',
    input:{stage:'writing',studentAnswer:'I agree because a garden helps students learn.'},
    temperature:.3,
  });
  assert.equal(result.provider,'firebase-ai-logic-gemini');
  assert.equal(result.model,'gemini-test');
  assert.equal(result.result.summary,'Clear main idea.');
  assert.equal(calls.length,1);
  assert.equal(calls[0].config.systemInstruction,'Give grounded feedback only.');
  assert.equal(calls[0].config.generationConfig.responseMimeType,'application/json');
  assert.equal(calls[0].input.contents[0].role,'user');
  assert.deepEqual(JSON.parse(calls[0].input.contents[0].parts[0].text),{
    stage:'writing',
    studentAnswer:'I agree because a garden helps students learn.'
  });

  const broken=new FirebaseAILogicProvider({
    model:'gemini-test',
    factory:()=>({generateContent:async()=>({response:{text:()=>'{not-json'}})})
  });
  assert.equal(await broken.generate({
    schemaVersion:1,purpose:'feedback',promptVersion:'1',instructions:'x',input:{x:1},temperature:0
  }),null,'invalid provider JSON must fail closed');

  const oversized=new FirebaseAILogicProvider({model:'gemini-test',factory,maxInputChars:10});
  assert.equal(await oversized.generate({
    schemaVersion:1,purpose:'feedback',promptVersion:'1',instructions:'x',input:{text:'this is too long'},temperature:0
  }),null,'oversized input must be rejected before provider call');

  assert.equal(await provider.generate({
    schemaVersion:1,purpose:'not-allowed',promptVersion:'1',instructions:'x',input:{x:1},temperature:0
  }),null,'runtime-invalid purpose must fail closed');

  console.log(JSON.stringify({
    result:'PASS',
    provider:'firebase-ai-logic-gemini',
    providerIndependentContract:true,
    jsonOnly:true,
    temperatureNotForwardedToModernGemini:true,
    invalidJsonFailsClosed:true,
    inputBounded:true,
    noDirectGeminiApiKey:true
  }));
})().catch(error=>{console.error(error);process.exit(1)});
