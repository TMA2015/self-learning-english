'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','g3-firebase-provider');
fs.rmSync(out,{recursive:true,force:true});

execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/ai/firebase-ai-logic-provider.ts',
  'ai/contracts.ts',
  'ai/service.ts',
  'ai/validation.ts',
  'ai/teaching-validation.ts',
  'domain/ai-metadata.ts',
  '--outDir','.sites-runtime/g3-firebase-provider',
  '--module','commonjs',
  '--target','es2022',
  '--resolveJsonModule',
  '--esModuleInterop',
  '--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

const {FirebaseAILogicProvider}=require(path.join(out,'infrastructure/ai/firebase-ai-logic-provider.js'));
const {createTutorService}=require(path.join(out,'ai/service.js'));

(async()=>{
  let calls=0;
  let lastInput=null;
  const transport={
    available:true,
    model:'gemini-free-tier-test-model',
    async generateJSON(input){
      calls++;
      lastInput=structuredClone(input);
      return {
        summary:'You answered the task clearly.',
        strengths:['Your main idea is easy to understand.'],
        improvements:['Add one specific example.'],
        exercise:'Write one example sentence beginning with For example,',
        tags:['idea-development'],
        corrections:[],
        scores:null,
      };
    }
  };

  const provider=new FirebaseAILogicProvider(transport);
  assert.equal(provider.available,true);

  const direct=await provider.generate({
    schemaVersion:1,
    purpose:'feedback',
    promptVersion:'1.0.0',
    instructions:'SYSTEM-RULES',
    input:{studentAnswer:{idea:'A school garden helps science lessons.'}},
    temperature:0.3,
  });
  assert.equal(direct.provider,'firebase-ai-logic');
  assert.equal(direct.model,'gemini-free-tier-test-model');
  assert.equal(calls,1);
  assert.deepEqual(lastInput,{
    systemInstruction:'SYSTEM-RULES',
    userPayload:{studentAnswer:{idea:'A school garden helps science lessons.'}},
    temperature:0.3,
    responseMimeType:'application/json',
  });

  const tutor=createTutorService(provider);
  assert.equal(tutor.available,true);
  const coached=await tutor.coach(
    'analysis',
    'Should the school have a garden?',
    {topic:'school garden',task:'agree or disagree'},
    {estimatedCEFR:'A2'}
  );
  assert(coached);
  assert.equal(coached.provider,'firebase-ai-logic');
  assert.equal(coached.model,'gemini-free-tier-test-model');
  assert.equal(coached.structuredResult.summary,'You answered the task clearly.');
  assert.deepEqual(coached.structuredResult.tags,['idea-development']);
  assert.equal(calls,2);

  let disabledCalls=0;
  const disabled=new FirebaseAILogicProvider({
    available:false,
    model:'disabled',
    async generateJSON(){disabledCalls++;throw new Error('must not call')}
  });
  assert.equal(disabled.available,false);
  assert.equal(await disabled.generate({
    schemaVersion:1,
    purpose:'feedback',
    promptVersion:'1.0.0',
    instructions:'x',
    input:{},
    temperature:0,
  }),null);
  assert.equal(disabledCalls,0);
  assert.equal(createTutorService(disabled).available,false);

  const malformedTutor=createTutorService(new FirebaseAILogicProvider({
    available:true,
    model:'malformed',
    async generateJSON(){return {summary:123,strengths:'bad'}}
  }));
  const malformed=await malformedTutor.coach('analysis','task',{answer:'x'});
  assert.equal(malformed,null,'existing tutor validation must reject malformed provider output');

  const providerSource=fs.readFileSync(path.join(root,'infrastructure/ai/firebase-ai-logic-provider.ts'),'utf8');
  assert(!providerSource.includes('firebase/app'));
  assert(!providerSource.includes('firebase/ai'));
  assert(!providerSource.includes('projectId'));
  assert(!providerSource.includes('apiKey'));
  assert(providerSource.includes('FirebaseAILogicTransport'));

  console.log(JSON.stringify({
    result:'PASS',
    provider:'firebase-ai-logic',
    sharedTransportContract:true,
    tutorServiceCompatible:true,
    unavailableFallsBack:true,
    malformedOutputRejected:true,
    firebaseSdkRequired:false,
    liveFirebaseCalls:0
  }));
})().catch(error=>{console.error(error);process.exit(1)});
