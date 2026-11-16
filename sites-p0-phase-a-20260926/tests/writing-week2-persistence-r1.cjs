'use strict';
// Synthetic integration of real state/API handlers, identity adapter, learning service
// and persistence adapter. NOT a live trusted dispatcher/D1/browser test.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-persistence-r1');
const ts=require('typescript');
cp.execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'application/learning-service.ts','application/writing-week2-ai-feedback.ts','infrastructure/auth/sites.ts','infrastructure/storage/browser-local-repositories.ts','app/writing-week2-ai-feedback.tsx',
 '--outDir',out,'--module','commonjs','--target','es2022','--jsx','react-jsx','--esModuleInterop','--resolveJsonModule','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const load=p=>require(path.join(out,p));
const d=load('domain/writing-course-v2-b.js'),service=load('application/writing-week2-ai-feedback.js');
const {learningService}=load('application/learning-service.js');
const {SitesAuthentication}=load('infrastructure/auth/sites.js');
const {BrowserLocalLearningRepository}=load('infrastructure/storage/browser-local-repositories.js');
const memory=new Map(),storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const repository=new BrowserLocalLearningRepository(storage,'synthetic-only-w2-r1');
const runtime={runtimeConfig:()=>({SLE_WEEK2_AI_FEEDBACK_ENABLED:'true'}),learnerStore:ownerId=>learningService(repository,{ownerId,learnerId:'primary'})};
for(const p of ['db/learning-store.ts','app/api/identity.ts','app/api/state/route.ts','app/api/writing-week2-ai/route.ts']){
 const target=path.join(out,p.replace(/\.ts$/,'.js'));fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,ts.transpileModule(fs.readFileSync(path.join(root,p),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
}
let providerCalls=0,onGenerate=async()=>{},unavailable=false;
const advice={strength:'You selected a club.',suggestions:['Explain how classmates can join.'],nextAction:'Add a reason in your own words.'};
const aliases={
 'next/server':{NextResponse:{json:(body,opts={})=>({body,status:opts.status??200})}},
 '@/infrastructure/auth/sites':{SitesAuthentication},
 '@/infrastructure/runtime':runtime,'../infrastructure/runtime':runtime,
 '@/application/writing-week2-ai-feedback':service,'@/domain/writing-course-v2-b':d,
 '@/infrastructure/ai/openai-http':{OpenAIHTTPProvider:class{available=true;async generate(){providerCalls++;await onGenerate();if(unavailable)throw Error('synthetic outage');return {provider:'synthetic',model:'none',result:advice}}}},
};
const original=Module._load;Module._load=function(n,...args){return aliases[n]??original.call(this,n,...args)};
const req=(body,id='alice')=>({headers:new Headers(id?{'oai-authenticated-user-id':id}:{}),json:async()=>body});
let passed=0;const ok=name=>{passed++;console.log('PASS '+name)};
(async()=>{try{
 aliases['@/db/learning-store']=load('db/learning-store.js');
 const state=load('app/api/state/route.js'),ai=load('app/api/writing-week2-ai/route.js');
 const fields={ideas:'Chess club\nDrawing club',reject:'',best:'Drawing club',fit:'We can share pencils.'};
 const work=d.submitWeek(2,{...d.emptyWeekWork(),fields,confirmedOwnWork:true},100);
 const payload=w=>({version:w.history.length,signature:w.submission.signature,fields:w.submission.fields});
 const savedBody=w=>({writingCourseV2B:{weeks:{2:w}},keepLegacy:'unchanged'});
 assert.equal((await ai.POST(req(payload(work),null))).status,401);
 assert.equal((await state.PUT(req(savedBody(work),null))).status,401);ok('Missing trusted synthetic identity rejects without writes');
 assert.equal((await ai.POST(req(payload(work)))).status,409);assert.equal(providerCalls,0);ok('Unsaved version rejected');
 assert.equal((await state.PUT(req(savedBody(work)))).status,200);
 const restored=(await state.GET(req(null))).body.state;
 assert.deepEqual(restored.writingCourseV2B.weeks[2],work);assert.equal(restored.keepLegacy,'unchanged');
 assert.equal((await ai.POST(req(payload(work)))).status,200);assert.equal(providerCalls,1);ok('Actual PUT -> persisted GET -> AI route, blank reject accepted');
 const before=JSON.stringify([...memory]);
 assert.equal((await ai.POST(req(payload(work),'bob'))).status,409);assert.equal(providerCalls,1);assert.equal(JSON.stringify([...memory]),before);ok('Other account cannot access Alice snapshot');
 const modified={...work,fields:{...fields,best:'Different current draft'}};
 await state.PUT(req(savedBody(modified)));assert.equal((await ai.POST(req(payload(work)))).status,409);ok('Mismatched current fields rejected even with retained old submission');
 const newer=d.submitWeek(2,{...d.editWeek(work,'fit','We can draw together.'),confirmedOwnWork:true},200);
 await state.PUT(req(savedBody(newer)));assert.equal((await ai.POST(req(payload(work)))).status,409);
 assert.equal((await ai.POST(req(payload(newer)))).status,200);ok('New saved version invalidates old request; history retained');
 const preserved=JSON.stringify([...memory]);unavailable=true;
 assert.equal((await ai.POST(req(payload(newer)))).status,503);assert.equal(JSON.stringify([...memory]),preserved);unavailable=false;ok('Provider unavailable preserves all persisted bytes');
 onGenerate=async()=>{await state.PUT(req(savedBody(d.editWeek(newer,'best','New draft during request'))))};
 assert.equal((await ai.POST(req(payload(newer)))).status,409);ok('Concurrent saved edit rejects stale advice response');
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),view=load('app/writing-week2-ai-feedback.js');
 const previous=process.env.NEXT_PUBLIC_LEARNING_RUNTIME;process.env.NEXT_PUBLIC_LEARNING_RUNTIME='browser';
 const html=renderToStaticMarkup(React.createElement(view.Week2OptionalAIReview,{work,saved:true,busy:false,error:'',showVi:false}));
 assert(html.includes('saved only on this device'));assert(html.includes('disabled=""'));
 if(previous===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=previous;
 ok('Browser-only save never enables server AI button');
 console.log(JSON.stringify({result:'PASS',tests:passed,realExternalRequests:0,trustedDispatcher:'NOT_TESTED',realD1:'NOT_TESTED',browser:'NOT_TESTED'}));
}finally{Module._load=original}})().catch(e=>{console.error(e);process.exitCode=1});
