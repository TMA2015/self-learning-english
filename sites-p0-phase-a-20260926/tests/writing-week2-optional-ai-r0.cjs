'use strict';
/** Academic PASS: SLE-W2-OPTIONAL-AI-FEEDBACK-R0-20261116 (Option A). */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const cp=require('node:child_process');
const ts=require(path.join(__dirname,'../node_modules/typescript'));
process.env.NEXT_PUBLIC_LEARNING_RUNTIME='server'; // Explicit Sites server UI configuration.
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-optional-ai-r0');
fs.rmSync(out,{recursive:true,force:true});
cp.execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'application/writing-week2-ai-feedback.ts','app/writing-week2-ai-feedback.tsx',
 '--module','commonjs','--target','es2022','--jsx','react-jsx',
 '--outDir',out,'--skipLibCheck','--esModuleInterop','--resolveJsonModule'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const relative=p=>path.join(out,p);
const domain=require(relative('domain/writing-course-v2-b.js'));
const service=require(relative('application/writing-week2-ai-feedback.js'));
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const view=require(relative('app/writing-week2-ai-feedback.js'));
const notes={ideas:'Chess club\nRobotics club\nTable tennis',best:'Chess club',fit:'We can practise strategy together.'};
const work=domain.submitWeek(2,{...domain.emptyWeekWork(),fields:notes,confirmedOwnWork:true},1111);
const input={version:1,signature:work.submission.signature,fields:{...work.submission.fields}};
const valid=service.validateWeek2SavedAIInput(input);
assert(valid);
assert.equal(valid.fields.reject,undefined,'Optional reject remains absent; no fabricated rejected idea');
assert.equal(Object.hasOwn(valid.fields,'reject'),false,'Do not invent optional reject key during normalization');
assert.deepEqual(service.validateWeek2SavedAIInput(valid),valid,'Normalized saved plan must validate a second time before provider call');
const blank={...notes,reject:''};
assert(service.validateWeek2SavedAIInput({version:1,signature:JSON.stringify(blank),fields:blank}));
assert.equal(service.validateWeek2SavedAIInput({...input,signature:'stale'}),null);
assert.equal(service.validateWeek2SavedAIInput({...input,fields:{...notes,fit:''}}),null);
assert.equal(service.validateWeek2SavedAIInput({...input,fields:{...notes,extra:'injected'}}),null);
assert.equal(service.validateWeek2SavedAIInput({...input,fields:{...notes,fit:'X'.repeat(2000)}}),null);

const feedback={
 strength:'The three activity ideas all fit the after-school club task.',
 suggestions:[
  'Explain why chess helps classmates learn together.',
  'You could compare chess with robotics, which is also a good option.',
 ],
 nextAction:'Add one concrete reason for choosing chess club over robotics.'
};
let calls=0;
const fakeProvider={available:true,generate:async(request)=>{
 calls++;assert.equal(request.purpose,'brainstorming-coaching');
 assert.equal(request.temperature,.2);
 assert(request.instructions.includes('An empty reject field is entirely valid'));
 assert(request.instructions.includes('Never output numeric grades'));
 assert.equal(request.input.planningNotes.reject,'');
 assert(request.input.planningNotes.ideas.includes('Robotics club'));
 return {provider:'test-ai',model:'synthetic',result:feedback};
}};
(async()=>{
 const result=await service.reviewWeek2SavedPlan(fakeProvider,input);
 assert.deepEqual(result,{...feedback,version:1,provider:'test-ai',model:'synthetic',
  provisional:true,evidence_weight:0});
 assert.equal(calls,1);
 assert.equal(await service.reviewWeek2SavedPlan(fakeProvider,{...input,signature:'stale'}),null);
 assert.equal(calls,1,'Never call provider for invalid snapshot');
 assert.equal(await service.reviewWeek2SavedPlan({...fakeProvider,available:false},input),null);
 assert.equal(calls,1);
 const bad=[
  {...feedback,scores:{task:8}},
  {...feedback,strength:'IELTS band 7'},
  {...feedback,suggestions:['A','B','C']},
  {...feedback,exercise:'write my essay',nextAction:''},
 ];
 for(const value of bad)assert.equal(service.validateWeek2AIAdvice(value),null);
 assert.equal(service.WEEK2_AI_UNAVAILABLE.includes('Your plan is saved'),true);
 const render=(props)=>renderToStaticMarkup(React.createElement(view.Week2OptionalAIReview,props));
 const noSave=render({work:domain.emptyWeekWork(),saved:false,busy:false,error:'',showVi:false});
 assert(noSave.includes('Check my saved plan with AI'));
 assert(/disabled=""/.test(noSave),'Cannot request AI before save');
 const savedMarkup=render({work,saved:true,busy:false,error:'',showVi:true});
 assert(savedMarkup.includes('Saved version 1'));
 assert(savedMarkup.includes('Pressing this button sends your saved notes'));
 assert(savedMarkup.includes('vi-help'));
 assert(!savedMarkup.includes('IELTS band'));
 assert(!savedMarkup.includes('Version 1 AI Review'),'No unrequested AI advice on first render');
 assert(!/disabled=""/.test(savedMarkup),'Button enabled only for stored version');
 const editing=domain.editWeek(work,'fit','Rewritten plan');
 assert(!editing.submission);
 assert(/disabled=""/.test(render({work:editing,saved:false,busy:false,error:'',showVi:false})));
 assert(/disabled=""/.test(render({work,saved:true,busy:true,error:'',showVi:false})));
 assert(/disabled=""/.test(render({work,saved:true,busy:false,error:'Save failed',showVi:false})));
 assert.deepEqual(work.history[0].fields,notes,'No data schema or learner notes mutation');
 assert.equal(work.history.length,1);

 // Execute the actual API route with in-process Next and D1/auth mocks.
 const routeSource=fs.readFileSync(path.join(root,'app/api/writing-week2-ai/route.ts'),'utf8');
 const routeJS=ts.transpileModule(routeSource,{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
 }).outputText;
 const routePath=relative('app/api/writing-week2-ai/route.js');
 fs.mkdirSync(path.dirname(routePath),{recursive:true});
 fs.writeFileSync(routePath,routeJS);
 let account='user:synthetic',serverState={writingCourseV2B:{weeks:{2:work}}};
 let policy={SLE_WEEK2_AI_FEEDBACK_ENABLED:'true',OPENAI_API_KEY:'SYNTHETIC_SERVER_KEY'};
 let serverCalls=0;
 const aliases={
  'next/server':{NextResponse:{json:(body,opts={})=>({body,status:opts.status??200,headers:opts.headers})}},
  '../identity':{learnerKey:()=>account},
  '@/db/learning-store':{readState:async()=>serverState},
  '@/infrastructure/runtime':{runtimeConfig:()=>policy},
  '@/infrastructure/ai/openai-http':{OpenAIHTTPProvider:class{
   available=true;
   async generate(request){serverCalls++;return {
    provider:'mock-server',model:'synthetic',result:feedback};
   }
  }},
  '@/application/writing-week2-ai-feedback':service,
  '@/domain/writing-course-v2-b':domain,
 };
 const original=Module._load;
 Module._load=function(name,...args){return aliases[name]??original.call(this,name,...args)};
 try{
  const route=require(routePath);
  const request=(body)=>({headers:new Headers(),json:async()=>body});
  account=null;
  assert.equal((await route.POST(request(input))).status,401);
  account='user:synthetic';
  assert.equal((await route.POST(request({...input,signature:'stale'}))).status,400);
  policy={SLE_WEEK2_AI_FEEDBACK_ENABLED:'false',OPENAI_API_KEY:'SYNTHETIC_SERVER_KEY'};
  assert.equal((await route.POST(request(input))).status,503);
  policy={SLE_WEEK2_AI_FEEDBACK_ENABLED:'true',OPENAI_API_KEY:'SYNTHETIC_SERVER_KEY'};
  serverState={writingCourseV2B:{weeks:{2:domain.emptyWeekWork()}}};
  assert.equal((await route.POST(request(input))).status,409,'Local-only work is not server-verified');
  serverState={writingCourseV2B:{weeks:{2:work}}};
  const allowed=await route.POST(request(input));
  assert.equal(allowed.status,200);
  assert.equal(allowed.body.feedback.version,1);
  assert.equal(allowed.body.feedback.evidence_weight,0);
  assert.equal(serverCalls,1,'Only one explicit request can reach provider');
  assert.equal(allowed.headers['Cache-Control'],'no-store');
 }finally{Module._load=original}

 const layout=fs.readFileSync(path.join(root,'app/writing-week2-course-simplified.tsx'),'utf8');
 assert(layout.includes('<Week2OptionalAIReview work={work} saved={saved}'));
 const dom=fs.readFileSync(path.join(root,'domain/writing-course-v2-b.ts'),'utf8');
 assert(!dom.includes('Week2AIAdvice'),'Canonical Week 2 domain contract must remain independent');
 console.log(JSON.stringify({result:'PASS',gate:'W2_OPTIONAL_AI_OPTION_A_R0',
  fakeProviderCalls:calls,serverFakeCalls:1,externalRequests:0,
  persistedSnapshotOnly:true,blankRejectValid:true,noAIScore:true,
  sourceStateAndHistoryUnchanged:true,noAiCompletionDependency:true,
  transparentSendDisclosure:true,showVi:true,realProviderQuality:'NOT_TESTED'}));
})().catch(e=>{console.error(e);process.exitCode=1});
