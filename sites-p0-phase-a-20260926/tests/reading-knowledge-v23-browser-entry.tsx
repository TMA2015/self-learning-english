import historical from '../content/curriculum-1.18.1-candidate.json';
import historical125 from '../content/curriculum-1.25.0-candidate.json';
import historical127 from '../content/curriculum-1.27.0-candidate.json';
import baseline128 from '../content/curriculum-1.28.0-candidate.json';
import successor1281 from '../content/review-packets/curriculum-1.28.1-wording-candidate.json';
import {mapSeed,type Seed,type AcademicAttempt} from '../domain/academic';
import {sourceDigest} from '../application/academic-service';
import {BrowserLocalAcademicRepository} from '../infrastructure/storage/browser-local-repositories';
import {localAcademicRuntime,LOCAL_OWNER_ID} from '../infrastructure/browser/local-runtime';
import {FoundationDemo,type Catalog} from '../app/foundation';
import {createOptionOrder} from '../domain/option-order';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {ReadingKnowledgeV23} from '../app/reading-knowledge-v23';
import data from '../content/reading-knowledge-v23.json';
import type {SeedLesson} from '../domain/academic';
const params=new URL(location.href).searchParams,id=params.get('lesson')??'REA-A1-01',width=Number(params.get('width')??375);
const output=document.getElementById('sle-test-result')!,shell=document.getElementById('app')!;
const lesson={id,module:'reading',cefr_target:id.split('-')[1],title:id} as SeedLesson;
const d=data.lessons[id as keyof typeof data.lessons];
const pause=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function wait(fn:()=>boolean,label:string){for(let i=0;i<160;i++){if(fn())return;await pause(30)}throw Error(label)}
function check(ok:unknown,label:string){if(!ok)throw Error(label)}
async function historicalPlayerRoute(){
 const route=params.get('route'),draft=route==='historical-draft',old=route==='historical'||draft;
 const version=params.get('version')??'1.18.1',successor=params.get('current')==='1.28.1',currentVersion=successor?'1.28.1':'1.28.0';
 check(!successor||version==='1.28.0','successor fixture baseline');
 const source=({'1.18.1':historical,'1.25.0':historical125,'1.27.0':historical127,'1.28.0':baseline128} as Record<string,unknown>)[version] as Seed;
 const archive=source?.lessons.find(l=>l.id===id) as SeedLesson|undefined;
 check(location.hostname==='127.0.0.1'&&(!old||!!archive),'isolated fixture and existing archive');
 const saved:AcademicAttempt|null=old?{
  id:'synthetic-rea-archive',rootId:'synthetic-rea-archive',packageId:source.package_id,
  version,lessonId:id,status:draft?'started':'scored',
  answers:{[archive!.activities[0].id]:'B'},createdAt:1,evidence:[],
  ...(draft?{}:{submittedAt:2,results:[{id:archive!.activities[0].id,correct:true,explanation:'Synthetic saved Reading result',tags:[]}]}),
  optionOrder:createOptionOrder(archive!.activities,()=>0)
 }:null;
 if(saved){
  const academic=new BrowserLocalAcademicRepository(localStorage);
  await academic.addPackage({id:source.package_id,version:source.schema_version,digest:await sourceDigest(source),source,bundle:mapSeed(source),at:1});
  await academic.start(LOCAL_OWNER_ID,saved);
 }
 const runtime=await localAcademicRuntime();
 if(successor){
  const beforeImport=JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID));
  const preview=await runtime.service.preview(successor1281);
  check(preview.errors.length===0&&preview.counts.update===5&&preview.counts.skip===171&&preview.counts.add===0,'exact wording-only import preview');
  await runtime.service.importPackage(successor1281,preview.token,true);
  check(JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID))===beforeImport,'import preserves historical attempts');
 }
 const catalog=await runtime.service.catalog() as unknown as Catalog;
 check(catalog.version===currentVersion,'current browser curriculum');
 const before=JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID));
 const packagesBefore=JSON.stringify((await runtime.academic.packages()).map(p=>({id:p.id,version:p.version,digest:p.digest})));
 let requests=0;window.fetch=async()=>{requests++;throw Error('Unexpected network in isolated Reading fixture')};
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<FoundationDemo skill="reading" sharedCatalog={catalog} requestedLessonId={id}/>);
 const overlay=()=>shell.querySelector('.sle-rea-v23');
 const find=(label:string)=>Array.from(shell.querySelectorAll<HTMLButtonElement>('button')).find(b=>b.textContent?.trim().startsWith(label));
 await wait(()=>!!overlay(),'current Reading overlay without starting a new attempt');
 check(overlay()?.textContent?.includes(d.title),'correct lesson');
 if(old){
  check((await runtime.service.lesson(id,version)).version===version&&(await runtime.service.lesson(id,currentVersion)).version===currentVersion,'both immutable versions available');
  check(shell.textContent?.includes('Current lesson notes · v'+currentVersion),'current notes label');
  find('View archived notes')!.click();await wait(()=>!!find('View current lesson notes')&&(successor?!!overlay():!overlay()),'archive notes');
  check(shell.textContent?.includes('Archived lesson notes · v'+version),'archive label');
  find('View current lesson notes')!.click();await wait(()=>!!overlay(),'current notes restored');
  find(draft?'Continue saved draft':'View saved result')!.click();
  await wait(()=>!!shell.querySelector('input[name="'+archive!.activities[0].id+'"]'),'historical practice');
  const field=shell.querySelector<HTMLInputElement>('input[name="'+archive!.activities[0].id+'"][value="B"]')!;
  check(field?.checked&&field.matches(':disabled')===!draft,'original answer and editability');
  check(shell.textContent?.includes('content '+version),'historical practice version');
  if(!draft)check(shell.textContent?.includes('Synthetic saved Reading result'),'original feedback');
  if(successor){
   const oldPrompt=archive!.activities[0].prompt;
   const newPrompt=(await runtime.service.lesson(id,currentVersion)).lesson.activities[0].prompt;
   check(oldPrompt!==newPrompt&&shell.textContent?.includes(oldPrompt)&&!shell.textContent?.includes(newPrompt),'historical question wording remains pinned');
  }
  find('View lesson notes')!.click();await wait(()=>!!overlay(),'current notes after practice/result');
  check(shell.textContent?.includes('Current lesson notes · v'+currentVersion),'current notes label after returning');
 }
 if(draft)await pause(1250);
 check(JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID))===before,'saved attempts byte-equivalent; no new attempt');
 check(JSON.stringify((await runtime.academic.packages()).map(p=>({id:p.id,version:p.version,digest:p.digest})))===packagesBefore,'packages unchanged');
 if(successor){
  // Explicitly start an independent current attempt only after read-only assertions.
  find('Start current practice')!.click();
  const newPrompt=(await runtime.service.lesson(id,currentVersion)).lesson.activities[0].prompt;
  await wait(()=>!!shell.textContent?.includes(newPrompt)&&!!shell.textContent?.includes('content '+currentVersion),'fresh current Practice wording');
  const after=await runtime.academic.attempts(LOCAL_OWNER_ID);
  check(JSON.stringify(after.filter(a=>a.id===saved!.id))===JSON.stringify(JSON.parse(before).filter((a:AcademicAttempt)=>a.id===saved!.id)),'historical attempt immutable after new root');
  check(after.length===JSON.parse(before).length+1&&after.some(a=>a.version===currentVersion&&a.status==='started'&&!a.parentId),'independent fresh attempt');
 }
 check(requests===0,'no network request');
 output.textContent='PASS_SLE_READING_'+id+'_'+width;
}
(async()=>{
 if(params.has('route')){await historicalPlayerRoute();return}
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 const root=createRoot(shell);
 root.render(<ReadingKnowledgeV23 lesson={lesson} version="1.28.0" showVi={false}/>);
 await wait(()=>!!shell.querySelector('.sle-rea-v23'),'mount');
 const panel=shell.querySelector('.sle-rea-v23') as HTMLElement;
 check(!panel.querySelector('[lang="vi"]'),'English first');
 check(!panel.querySelector('.sle-rea-highlight')&&!panel.querySelector('[role="status"]'),'no preselected lens or feedback');
 const lens=panel.querySelectorAll<HTMLButtonElement>('[aria-label="Sentence lenses"] button');
 check(lens.length===d.lenses.length,'lens count');
 for(let i=0;i<lens.length;i++){
  lens[i].click();await wait(()=>lens[i].getAttribute('aria-pressed')==='true','select lens');
  check(panel.querySelectorAll('.sle-rea-highlight').length===d.lenses[i].refs.length,'exact sentence highlighting');
  check(panel.querySelector('[role="status"]')?.textContent?.includes(d.lenses[i].en),'selected lens feedback');
 }
 lens[lens.length-1].click();await wait(()=>!panel.querySelector('.sle-rea-highlight'),'clear selection');
 for(const q of d.checks){
  const card=panel.querySelector('[data-quick-id="'+q.id+'"]')!;
  const options=card.querySelectorAll<HTMLButtonElement>('[role="group"] button');
  check(options.length===3&&!card.querySelector('[role="status"]'),'three options, no initial feedback');
  for(let i=0;i<options.length;i++){
   options[i].click();await wait(()=>options[i].getAttribute('aria-pressed')==='true','choice');
   const status=card.querySelector('[role="status"]');
   check(status?.textContent?.includes(q.options[i].feedback.en),'selected-only feedback');
   check(q.options.filter((_,j)=>j!==i).every(o=>!status?.textContent?.includes(o.feedback.en)),'other feedback hidden');
  }
  card.querySelector<HTMLButtonElement>('[role="status"] button')!.click();
  await wait(()=>!card.querySelector('[role="status"]'),'reset QC');
 }
 const find=(label:string)=>Array.from(panel.querySelectorAll<HTMLButtonElement>('button')).find(b=>b.textContent===label)!;
 check(!panel.textContent?.includes(d.transfer.model.en),'transfer model initially absent');
 find('Compare with model').click();await wait(()=>!!panel.textContent?.includes(d.transfer.model.en),'reveal model');
 find('Hide model').click();await wait(()=>!panel.textContent?.includes(d.transfer.model.en),'hide model');
 root.render(<ReadingKnowledgeV23 lesson={lesson} version="1.28.0" showVi={true}/>);
 await wait(()=>!!panel.querySelector('[lang="vi"]'),'Vietnamese support');
 check(panel.scrollWidth<=panel.clientWidth+2,'responsive panel overflow');
 check(Array.from(panel.querySelectorAll('button')).every(b=>b.getBoundingClientRect().height>=43),'touch target');
 root.render(<ReadingKnowledgeV23 lesson={lesson} version="1.29.0" showVi={false}/>);
 await wait(()=>!shell.querySelector('.sle-rea-v23'),'future version guard');
 output.textContent='PASS_SLE_READING_'+id+'_'+width;
})().catch(e=>{output.textContent='FAIL '+(e instanceof Error?e.message:String(e));console.error(e)});
