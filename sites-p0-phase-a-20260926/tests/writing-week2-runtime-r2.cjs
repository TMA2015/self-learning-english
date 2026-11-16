'use strict';
// Real component handlers with synthetic hooks/fetch. Separate from HomeClient browser QA.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-runtime-r2');
cp.execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),'app/writing-week2-ai-feedback.tsx','--outDir',out,'--module','commonjs','--target','es2022','--jsx','react-jsx','--esModuleInterop','--resolveJsonModule','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const React=require('react'),{Week2OptionalAIReview}=require(path.join(out,'app/writing-week2-ai-feedback.js'));
const d=require(path.join(out,'domain/writing-course-v2-b.js'));
const work=d.submitWeek(2,{...d.emptyWeekWork(),confirmedOwnWork:true,fields:{ideas:'Art club',reject:'',best:'Art',fit:'We share pencils.'}},100);
const walk=e=>!e||typeof e!=='object'?[]:[e,...React.Children.toArray(e.props?.children).flatMap(walk)];
const original={useState:React.useState,useRef:React.useRef,useEffect:React.useEffect,fetch:global.fetch,mode:process.env.NEXT_PUBLIC_LEARNING_RUNTIME};
let calls=0,resolveRequest;
function harness(){let cells=[],index=0,effects=[];
 React.useState=initial=>{const i=index++;if(!(i in cells))cells[i]=initial;return [cells[i],v=>{cells[i]=typeof v==='function'?v(cells[i]):v}]};
 React.useRef=value=>{const i=index++;return cells[i]??(cells[i]={current:value})};
 React.useEffect=(fn,deps)=>{const i=index++;if(!cells[i]||deps.some((v,n)=>v!==cells[i][n])){cells[i]=deps;effects.push(fn)}};
 return (w=work,saved=true)=>{index=0;let tree=Week2OptionalAIReview({work:w,saved,busy:false,error:'',showVi:false});while(effects.length)effects.shift()();index=0;return Week2OptionalAIReview({work:w,saved,busy:false,error:'',showVi:false})};
}
const button=t=>walk(t).find(e=>e.type==='button');
const advice=v=>({ok:true,json:async()=>({feedback:{version:v,evidence_weight:0,provisional:true,strength:'Synthetic strength',suggestions:[],nextAction:'Synthetic action'}})});
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{try{
 const matrix=[];
 for(const mode of ['browser','server',undefined,'','browesr','SERVER']){
  if(mode===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=mode;
  const render=harness();calls=0;global.fetch=async()=>{calls++;return advice(1)};
  const tree=render();assert.equal(button(tree).props.disabled,mode!=='server');
  button(tree).props.onClick();await settle();assert.equal(calls,mode==='server'?1:0);
  matrix.push({runtime:mode??'UNSET',requests:calls});
 }
 process.env.NEXT_PUBLIC_LEARNING_RUNTIME='server';
 let render=harness();calls=0;global.fetch=async()=>{calls++;return advice(1)};
 button(render(work,false)).props.onClick();await settle();assert.equal(calls,0,'Unsaved server work cannot request');
 render=harness();global.fetch=()=>new Promise(resolve=>{calls++;resolveRequest=resolve});
 button(render()).props.onClick();
 const newer=d.submitWeek(2,{...d.editWeek(work,'fit','We learn drawing.'),confirmedOwnWork:true},200);
 render(newer);resolveRequest(advice(1));await settle();
 assert(!JSON.stringify(render(newer)).includes('Synthetic strength'),'Stale response must not appear');
 global.fetch=async()=>advice(2);button(render(newer)).props.onClick();await settle();
 assert(JSON.stringify(render(newer)).includes('Synthetic strength'),'Current configured server response displays');
 console.log(JSON.stringify({result:'PASS',gate:'W2_RUNTIME_FAIL_CLOSED_R2',matrix,unsavedRequests:0,staleResponseDiscarded:true,currentServerResponse:true,externalRequests:0,browser:'NOT_TESTED'}));
}finally{Object.assign(React,{useState:original.useState,useRef:original.useRef,useEffect:original.useEffect});global.fetch=original.fetch;if(original.mode===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=original.mode}})().catch(e=>{console.error(e);process.exitCode=1});
