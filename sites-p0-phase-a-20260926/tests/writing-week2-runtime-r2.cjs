'use strict';
// Real Week 2 React handlers with mock Gemini/browser and server endpoints.
// Unknown runtime still fails closed; saved Firebase plans can request Gemini.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-runtime-r2');
cp.execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'app/writing-week2-ai-feedback.tsx','--outDir',out,'--module','commonjs',
 '--target','es2022','--jsx','react-jsx','--esModuleInterop','--resolveJsonModule','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');

let geminiCalls=0,geminiHandler=async input=>feedback(input.version);
const originalLoad=Module._load;
Module._load=function(name,...args){
 if(name==='../infrastructure/browser/firebase-ai-browser')return {
  reviewWeek2PlanWithGemini:async input=>{geminiCalls++;return geminiHandler(input)}
 };
 return originalLoad.call(this,name,...args);
};
const React=require('react');
let Week2OptionalAIReview;
try{({Week2OptionalAIReview}=require(path.join(out,'app/writing-week2-ai-feedback.js')))}
finally{Module._load=originalLoad}
const d=require(path.join(out,'domain/writing-course-v2-b.js'));
const work=d.submitWeek(2,{...d.emptyWeekWork(),confirmedOwnWork:true,
 fields:{ideas:'Art club',reject:'',best:'Art',fit:'We share pencils.'}},100);
const feedback=version=>({version,evidence_weight:0,provisional:true,
 strength:'Synthetic strength',suggestions:['Synthetic suggestion'],nextAction:'Synthetic action',
 provider:'mock-gemini',model:'mock-model'});
const walk=e=>!e||typeof e!=='object'?[]:[e,...React.Children.toArray(e.props?.children).flatMap(walk)];
const original={useState:React.useState,useRef:React.useRef,useEffect:React.useEffect,fetch:global.fetch,mode:process.env.NEXT_PUBLIC_LEARNING_RUNTIME};
let fetchCalls=0,resolveServer,resolveGemini;
function harness(){
 let cells=[],index=0,effects=[];
 React.useState=initial=>{const i=index++;if(!(i in cells))cells[i]=initial;return[cells[i],v=>{cells[i]=typeof v==='function'?v(cells[i]):v}]};
 React.useRef=value=>{const i=index++;return cells[i]??(cells[i]={current:value})};
 React.useEffect=(fn,deps)=>{const i=index++;if(!cells[i]||deps.some((v,n)=>v!==cells[i][n])){cells[i]=deps;effects.push(fn)}};
 return (w=work,saved=true)=>{index=0;Week2OptionalAIReview({work:w,saved,busy:false,error:'',showVi:false});
  while(effects.length)effects.shift()();index=0;return Week2OptionalAIReview({work:w,saved,busy:false,error:'',showVi:false})};
}
const button=t=>walk(t).find(e=>e.type==='button');
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{try{
 const matrix=[];
 for(const mode of ['browser','server',undefined,'','browesr','SERVER']){
  if(mode===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=mode;
  let render=harness();fetchCalls=0;geminiCalls=0;geminiHandler=async input=>feedback(input.version);
  global.fetch=async()=>{fetchCalls++;return{ok:true,json:async()=>({feedback:feedback(1)})}};
  const tree=render(),allowed=mode==='browser'||mode==='server';
  assert.equal(button(tree).props.disabled,!allowed,'Only configured runtimes can offer review');
  button(tree).props.onClick();await settle();
  assert.equal(fetchCalls,mode==='server'?1:0,'Server API only called in server mode');
  assert.equal(geminiCalls,mode==='browser'?1:0,'Gemini only called in browser mode');
  matrix.push({runtime:mode??'UNSET',serverRequests:fetchCalls,geminiRequests:geminiCalls});
 }
 for(const mode of ['browser','server']){
  process.env.NEXT_PUBLIC_LEARNING_RUNTIME=mode;
  let render=harness();fetchCalls=0;geminiCalls=0;global.fetch=async()=>{fetchCalls++;throw Error('unsaved')};
  button(render(work,false)).props.onClick();await settle();
  assert.equal(fetchCalls,0);assert.equal(geminiCalls,0,'Unsaved work cannot trigger AI');
 }
 // Edits after starting a request must invalidate the in-flight Gemini response.
 process.env.NEXT_PUBLIC_LEARNING_RUNTIME='browser';
 let render=harness();geminiCalls=0;geminiHandler=()=>new Promise(resolve=>{resolveGemini=resolve});
 button(render()).props.onClick();
 const newer=d.submitWeek(2,{...d.editWeek(work,'fit','We learn drawing.'),confirmedOwnWork:true},200);
 render(newer);resolveGemini(feedback(1));await settle();
 assert(!JSON.stringify(render(newer)).includes('Synthetic strength'),'Old Gemini response must not be shown');
 geminiHandler=async input=>feedback(input.version);
 button(render(newer)).props.onClick();await settle();
 assert(JSON.stringify(render(newer)).includes('Synthetic strength'),'Current Gemini feedback must display');
 assert.equal(geminiCalls,2);
 // The same stale-response guard is preserved for authenticated server mode.
 process.env.NEXT_PUBLIC_LEARNING_RUNTIME='server';
 render=harness();fetchCalls=0;global.fetch=()=>new Promise(resolve=>{fetchCalls++;resolveServer=resolve});
 button(render()).props.onClick();render(newer);
 resolveServer({ok:true,json:async()=>({feedback:feedback(1)})});await settle();
 assert(!JSON.stringify(render(newer)).includes('Synthetic strength'));
 console.log(JSON.stringify({result:'PASS',gate:'W2_GEMINI_BROWSER_ON_DEMAND_R3',matrix,
  unsavedRequests:0,staleGeminiDiscarded:true,staleServerDiscarded:true,
  realExternalRequests:0,browser:'MOCK_HANDLERS_ONLY'}));
}finally{
 Object.assign(React,{useState:original.useState,useRef:original.useRef,useEffect:original.useEffect});
 global.fetch=original.fetch;
 if(original.mode===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;
 else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=original.mode;
}})().catch(e=>{console.error(e);process.exitCode=1});
