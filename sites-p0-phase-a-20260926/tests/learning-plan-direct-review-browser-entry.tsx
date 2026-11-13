import React from 'react';
import {createRoot} from 'react-dom/client';
import {LearningPlan} from '../app/core-panels';
import type {FoundationPracticeCatalog} from '../domain/foundation-practice-plan';

const args=new URL(location.href).searchParams;
const scenario=args.get('case')??'review';
const width=Number(args.get('width')??320);
const root=document.getElementById('app')!;
const status=document.getElementById('sle-test-result')!;
let visited='';let broad='';
const base:FoundationPracticeCatalog={
 imported:scenario!=='notimported',
 lessons:[
  {id:'VOC-A2-01',title:'Daily routines and useful phrases',module:'vocabulary'},
  {id:'GRA-B1-05',title:'Modal deduction',module:'grammar'}
 ],
 attempts:[
  {id:'voc-old-incorrect',lessonId:'VOC-A2-01',status:'scored',createdAt:10,
   results:[{id:'VOC-A2-01-Q1',correct:false},{id:'VOC-A2-01-Q2',correct:true}]},
  {id:'voc-new-draft',lessonId:'VOC-A2-01',status:'started',createdAt:20,results:[]}
 ]
};
if(scenario==='cleared')base.attempts.push({
 id:'voc-newer-correct',lessonId:'VOC-A2-01',status:'scored',createdAt:30,
 results:[{id:'VOC-A2-01-Q1',correct:true},{id:'VOC-A2-01-Q2',correct:true}]
});
if(scenario==='pending')base.attempts.push({
 id:'voc-newer-pending',lessonId:'VOC-A2-01',status:'pending_review',createdAt:30,
 results:[{id:'VOC-A2-01-Q1',correct:false}]
});
function App(){
 return <LearningPlan choice="ai" plan={undefined} model={undefined}
  foundationCatalog={base} onDiagnostic={()=>{}} onWriting={()=>{}}
  onNavigate={v=>{broad=v;}}
  onOpenLesson={scenario==='noCallback'?undefined:(id,module)=>{visited=id+'|'+module;}}
 />;
}
async function run(){
 root.style.width=width+'px';root.style.maxWidth='100%';
 createRoot(root).render(<App/>);
 for(let n=0;n<150;n++){
  if(root.querySelector('h1')?.textContent==='Your learning plan')break;
  await new Promise(resolve=>setTimeout(resolve,25));
 }
 await new Promise(resolve=>setTimeout(resolve,30));
 const check=(pass:unknown,label:string)=>{if(!pass)throw Error('PLAN_BROWSER '+scenario+': '+label)};
 const buttons=[...root.querySelectorAll('button')];
 const direct=buttons.find(b=>b.textContent?.includes('Review this lesson'));
 const explore=buttons.find(b=>b.textContent?.includes('Browse Vocabulary Library'));
 if(['review','noCallback'].includes(scenario)){
  check(!!direct,'review CTA needed');
  check(!!explore,'broad fallback needed');
  check(root.textContent?.includes('VOC-A2-01'),'real imported lesson ID');
  check(root.textContent?.includes('Daily routines and useful phrases'),'real original title');
  if(scenario==='review'){
   check(!direct!.disabled,'review CTA enabled');
   direct!.click();
   check(visited==='VOC-A2-01|vocabulary','clicked exact skill and lesson ID');
   explore!.click();
   check(broad==='vocabulary','existing library fallback');
  }else{
   check(!!direct!.disabled,'button disabled without callback');
  }
 }else{
  check(!direct,'no recommendation from cleared/pending/unimported evidence');
  check(root.textContent?.includes('No missed answers to review'),'positive empty state');
 }
 check(!root.textContent?.includes('not a proficiency estimate'),'no repeated negative caveat');
 check(!root.textContent?.includes('not a generative AI'),'no repeated AI caveat');
 check(!root.textContent?.includes('not a formal CEFR'),'single Dashboard-level explanation policy');
 status.textContent='PASS_PLAN_'+scenario.toUpperCase()+'_'+width;
}
run().catch(error=>{status.textContent='FAIL '+String(error)+' '+String((error as Error).stack).slice(0,500);});
