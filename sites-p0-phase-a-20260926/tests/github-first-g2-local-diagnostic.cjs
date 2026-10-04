'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','github-first-g2-diagnostic');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/browser/local-diagnostic.ts',
  'infrastructure/browser/local-runtime.ts',
  'infrastructure/browser/client-services.ts',
  'domain/learning-model.ts',
  'domain/core-listening.ts',
  '--outDir','.sites-runtime/github-first-g2-diagnostic',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(key){return this.map.has(key)?this.map.get(key):null}
  setItem(key,value){this.map.set(key,String(value))}
  removeItem(key){this.map.delete(key)}
}
global.window={localStorage:new MemoryStorage(),location:{origin:'https://example.test'}};

(async()=>{
  const model=require(path.join(out,'domain/learning-model.js'));
  const {coreListening}=require(path.join(out,'domain/core-listening.js'));
  const {finishLocalDiagnostic}=require(path.join(out,'infrastructure/browser/local-diagnostic.js'));
  const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));

  let attempts=[];
  let question;
  let guard=0;
  while((question=model.nextQuestion(attempts,4))){
    attempts=model.recordAnswer(attempts,question,question.correct);
    if(++guard>90)throw new Error('Adaptive diagnostic exceeded maximum question budget');
  }
  assert(attempts.length>0&&attempts.length<=90);

  const words='I enjoy learning English because it helps me understand new ideas and communicate with other people. For example, I read short articles, write notes, and practise new words every week. I also check my mistakes carefully and try to use the corrected language in another sentence. This routine helps me become more confident and independent.';
  assert(words.trim().split(/\s+/).length>=40);
  const listening=coreListening.map(q=>({id:q.id,answer:q.correct,played:true}));
  const session={
    version:4,
    sessionId:'g2-local-diagnostic-0001',
    attempts,
    writing:words,
    writing2:words+' I would like to keep improving step by step.',
    listening,
    startedAt:1000,
  };

  const first=await finishLocalDiagnostic(session);
  assert.equal(first.writingAI,false);
  assert.equal(first.result.estimates.Writing.level,'Not assessed');
  assert(first.result.evidence.some(e=>e.tag==='writing-review-pending'&&e.provisional===true));
  assert(first.result.listening);
  assert.equal(first.result.listening.correct,coreListening.length);
  assert(first.result.evidence.some(e=>e.skill==='Listening'));

  const local=await runtime.localLearningRuntime();
  const assessments=await local.service.readAssessments();
  assert.equal(assessments.length,1);
  assert.equal(assessments[0].sessionId,session.sessionId);
  const evidence=await local.service.readEvidence();
  const count=evidence.length;
  assert(count>attempts.length,'Diagnostic must persist objective plus pending-writing/listening evidence');

  // Retry returns the immutable recorded result and does not duplicate evidence.
  const second=await finishLocalDiagnostic(session);
  assert.equal(second.result.at,first.result.at);
  assert.equal((await local.service.readAssessments()).length,1);
  assert.equal((await local.service.readEvidence()).length,count);

  const short={...session,sessionId:'g2-short',writing:'too short'};
  await assert.rejects(()=>finishLocalDiagnostic(short),/Writing sample 1 has/);
  assert.equal((await local.service.readAssessments()).length,1,'invalid diagnostic must not persist');

  const badSequence={...session,sessionId:'g2-bad-sequence',attempts:[{...attempts[0],id:'wrong-id'}]};
  await assert.rejects(()=>finishLocalDiagnostic(badSequence),/does not match assessment version/);
  assert.equal((await local.service.readAssessments()).length,1);

  const notPlayed={...session,sessionId:'g2-not-played',listening:listening.map((x,i)=>i?x:{...x,played:false})};
  await assert.rejects(()=>finishLocalDiagnostic(notPlayed),/Finish all Listening questions/);
  assert.equal((await local.service.readAssessments()).length,1);

  const routePage=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
  const page=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
  assert(routePage.includes('<HomeClient/>'),'root route must delegate Diagnostic UI to HomeClient');
  const component=fs.readFileSync(path.join(root,'app/diagnostic-assessment.tsx'),'utf8');
  const clients=fs.readFileSync(path.join(root,'infrastructure/browser/client-services.ts'),'utf8');
  assert(!page.includes('fetch("/api/diagnostic"'),'main page must not call Diagnostic route directly');
  assert(!page.includes('fetch("/api/capabilities"'),'main page must not call capabilities directly');
  assert(!component.includes('fetch("/api/capabilities"'),'Diagnostic UI must use browser-aware capability service');
  assert(page.includes('finishDiagnosticAssessment(diagnosticV2)'));
  assert(clients.includes("return jsonFetch('/api/diagnostic'"),'Sites diagnostic route fallback must remain');
  assert(clients.includes("if(browserLearningEnabled())return finishLocalDiagnostic(value)"),'browser diagnostic must remain local');

  console.log(JSON.stringify({
    result:'PASS',
    adaptiveAnswers:attempts.length,
    assessments:1,
    localEvidence:count,
    writingAI:false,
    writingLevel:'Not assessed',
    listeningPlayedRequired:true,
    retryIdempotent:true,
    directDiagnosticApiDependency:false,
    sitesFallbackPreserved:true
  }));
})().catch(error=>{console.error(error);process.exit(1)});
