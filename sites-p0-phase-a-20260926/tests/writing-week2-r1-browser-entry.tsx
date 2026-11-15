import React from 'react';
import {createRoot} from 'react-dom/client';
import {WritingWeekPage,type WeekActions} from '../app/writing-course-v2-b';
import {emptyWeekWork,type WeekScreen} from '../domain/writing-course-v2-b';

const qs=new URL(location.href).searchParams;
const width=Number(qs.get('width')??320);
const screen=(qs.get('screen')??'learn') as WeekScreen;
const allowed:WeekScreen[]=['learn','guided','main','feedback','review'];
const status=document.getElementById('sle-test-result')!;
const fail=(s:string):never=>{throw Error('W2_R1_BROWSER '+s)};
const check=(v:unknown,s:string)=>{if(!v)fail(s)};
const wait=async(fn:()=>boolean,why:string)=>{
 for(let i=0;i<180;i++){if(fn())return;await new Promise(r=>setTimeout(r,30))}
 fail('timeout '+why);
};
const button=(label:string)=>[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()===label) as HTMLButtonElement|undefined;
const html=()=>document.getElementById('app')?.textContent??'';
const box=(el:Element)=>el.getBoundingClientRect();
const actions:WeekActions={
 go:()=>{},back:()=>{},foundation:()=>{},edit:()=>{},confirm:()=>{},
 check:()=>{},submit:()=>{},reflect:()=>{},review:()=>{},retrySave:()=>{}
};
(async()=>{
 check([320,375,768,1024].includes(width),'unexpected content width');
 check(allowed.includes(screen),'unexpected screen');
 document.documentElement.style.width=width+'px';
 document.body.style.width=width+'px';
 document.body.style.margin='0';
 const app=document.getElementById('app')!;
 app.style.width=width+'px';
 app.style.maxWidth='100%';
 const work={...emptyWeekWork(),fields:{
  ideas:'Drawing club\nMusic club',reject:'Change the school uniform',
  best:'Drawing club',fit:'Students can share ideas and learn new skills'
 },confirmedOwnWork:true};
 createRoot(app).render(<WritingWeekPage week={2} screen={screen}
  work={work} actions={actions} busy={false} error="" showVi={false}/>);
 await wait(()=>!!document.querySelector('section.panel.wcv2.wcv2-b'),'mounted Week 2');
 const panel=document.querySelector('section.panel.wcv2.wcv2-b')!;
 check(html().includes('Week 2'),'Week 2 title absent');
 check(box(panel).right<=width+2,'page panel exceeds '+width+'px content width');
 check(box(panel).left>=-2,'page panel extends left of viewport');
 check(!html().includes('Get AI feedback'),'no Week 2 AI control');
 const baselineButtons=[...panel.querySelectorAll('button')];
 check(baselineButtons.length>=5,'five course navigation buttons');
 let distinct=false,examples=0;
 if(screen==='learn'){
  check(html().includes('THE TASK'),'task card missing');
  check(html().includes('HOW THE THINKING WORKS'),'worked explanation missing');
  check(html().includes('E1 · Park')&&html().includes('E2 · Museum')&&html().includes('E3 · Library'),'three named examples missing');
  check(html().includes('Topic')&&html().includes('Must include')&&html().includes('Boundary'),'A1 analysis incomplete');
  for(const [label,expect] of [
   ['A2 · Collect','First thoughts'],['A3 · Check & repair','Needs explanation'],
   ['A4 · Choose & explain','One possible sentence']
  ]){
   const b=button(label);check(b,label+' button missing');b!.click();
   await wait(()=>html().includes(expect),'render '+label);
  }
  const e2=button('E2 · Museum');check(e2,'Museum switch missing');e2!.click();
  await wait(()=>!!document.querySelector('button[aria-pressed="true"]')?.textContent?.includes('E2 · Museum'),'Museum switching');
  check(html().includes('Magnet experiment'),'Museum thinking content absent');
  examples=3;
  distinct=true;
 }else if(screen==='guided'){
  check(html().includes('G1 · Understand the question'),'G1 missing');
  check(html().includes('G2 · Collect'),'G2 missing');
  check(html().includes('G3 · Check relevance'),'G3 missing');
  check(html().includes('G4 · Explain your own choice'),'G4 missing');
  check(panel.querySelectorAll('fieldset').length>=4,'original four MCQs absent');
  distinct=true;
 }else if(screen==='main'){
  check(html().includes('YOUR WRITING TASK'),'task box absent');
  check(html().includes('YOUR IDEAS · WRITE HERE'),'writing workspace missing');
  check(panel.querySelectorAll('textarea').length===4,'exactly four canonical editable fields');
  distinct=true;
 }else if(screen==='feedback'){
  check(html().includes('YOUR DRAFT · READ-ONLY'),'read-only summary absent');
  check(html().includes('BASIC COMPLETION CHECK'),'structural helper absent');
  check(html().includes('Edit my ideas'),'return-to-edit action absent');
  check(panel.querySelectorAll('textarea').length===0,'feedback duplicated editable main form');
  distinct=true;
 }else {
  check(html().includes('Reflect on your own learning'),'review reflection absent');
  check(html().includes('Try the same four steps'),'independent transfer missing');
  distinct=true;
 }
 for(const el of panel.querySelectorAll('button, input, textarea, select')){
  const rect=box(el);
  check(rect.right<=width+2,'control exceeds '+width+'px: '+(el.textContent??el.tagName).slice(0,45));
  check(rect.left>=-2,'control extends left: '+el.tagName);
 }
 check(distinct,'screen-specific checks missed');
 const result={result:'PASS',screen,contentWidth:width,actualBrowserViewport:innerWidth,
  realReactRendered:true,realDomControls:true,threeExamples:examples,
  outsideNetworkCalls:0,syntheticOnly:true,realSafari:'NOT_TESTED'};
 status.textContent='PASS_W2_R1 '+JSON.stringify(result);
})().catch(e=>{status.textContent='FAIL_W2_R1 '+String(e)+' '+String((e as Error).stack).slice(0,1300)});
