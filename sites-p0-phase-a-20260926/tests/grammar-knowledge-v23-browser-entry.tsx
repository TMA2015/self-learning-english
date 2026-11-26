import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {StructuredGrammarNotes,structuredGrammarAvailable} from '../app/structured-grammar';
import curriculum from '../content/curriculum-1.28.0-candidate.json';
import data from '../content/grammar-knowledge-v23-wave1.json';
import wave2 from '../content/grammar-knowledge-v23-wave2-a1.json';
import wave3b from '../content/grammar-knowledge-v23-wave3b-a2.json';
import wave3a from '../content/grammar-knowledge-v23-wave3a-a2.json';
import wave4a from '../content/grammar-knowledge-v23-wave4a-b1.json';
import wave4b from '../content/grammar-knowledge-v23-wave4b-b1-b2.json';
import {mapSeed,type Seed,type SeedLesson,type AcademicAttempt} from '../domain/academic';
import {sourceDigest} from '../application/academic-service';
import {BrowserLocalAcademicRepository} from '../infrastructure/storage/browser-local-repositories';
import {localAcademicRuntime,LOCAL_OWNER_ID} from '../infrastructure/browser/local-runtime';
import {FoundationDemo,type Catalog} from '../app/foundation';
import historical from '../content/curriculum-1.18.1-candidate.json';
import {createOptionOrder} from '../domain/option-order';
const params=new URL(location.href).searchParams,id=params.get('lesson')??'GRA-A1-02',width=Number(params.get('width')??375);
const shell=document.getElementById('app')!,output=document.getElementById('sle-test-result')!;
const lesson=curriculum.lessons.find(l=>l.id===id) as unknown as SeedLesson;
const entries={...data.lessons,...wave2.lessons,...wave3b.lessons,...wave3a.lessons,...wave4a.lessons,...wave4b.lessons} as Record<string,{sections:{quiz?:{options:{correct:boolean}[]}[]}[]}>;
const checks=entries[id].sections.flatMap(s=>s.quiz??[]);
function Fixture(){const [showVi,setShowVi]=useState(false);return <main className="foundation-lesson"><button id="vi-toggle" onClick={()=>setShowVi(x=>!x)}>Vietnamese Support</button>{structuredGrammarAvailable(lesson,'1.28.0')?<StructuredGrammarNotes lesson={lesson} version="1.28.0" showVi={showVi}/>:<div data-legacy-fallback>Legacy lesson notes</div>}</main>}
const check=(yes:unknown,label:string)=>{if(!yes)throw Error(id+' '+width+' '+label)};
const wait=async(f:()=>boolean,label:string)=>{for(let i=0;i<220;i++){if(f())return;await new Promise(r=>setTimeout(r,30))}throw Error('Timeout '+label)};
async function playerRoute(){
 const route=params.get('route'),draft=route==='historical-draft',old=route==='historical'||draft;
 const archive=historical.lessons.find(l=>l.id===id) as unknown as SeedLesson|undefined;
 if(old&&!archive)throw Error('historical lesson missing');
 // Match Firebase's real browser-local service. Each runner profile is
 // disposable localhost storage, never the owner's profile or account.
 check(location.hostname==='127.0.0.1','isolated localhost only');
 const saved:AcademicAttempt|null=old?{
  id:'synthetic-archive',rootId:'synthetic-archive',packageId:historical.package_id,
  version:'1.18.1',lessonId:id,status:draft?'started':'scored',
  answers:{[archive!.activities[0].id]:'B'},createdAt:1,evidence:[],
  ...(draft?{}:{submittedAt:2,results:[{id:archive!.activities[0].id,correct:true,explanation:'Synthetic saved result',tags:[]}]}),
  optionOrder:createOptionOrder(archive!.activities,()=>0)
 }:null;
 if(saved){
  const academic=new BrowserLocalAcademicRepository(localStorage);
  const src=historical as unknown as Seed;
  await academic.addPackage({id:src.package_id,version:src.schema_version,digest:await sourceDigest(src),source:src,bundle:mapSeed(src),at:1});
  await academic.start(LOCAL_OWNER_ID,saved);
 }
 const runtime=await localAcademicRuntime();
 const catalog=await runtime.service.catalog() as unknown as Catalog;
 check(catalog.version==='1.28.1','current browser curriculum');
 const before=JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID));
 const packagesBefore=JSON.stringify((await runtime.academic.packages()).map(p=>({id:p.id,version:p.version,digest:p.digest})));
 let requests=0;
 window.fetch=async()=>{requests++;throw Error('Unexpected network request in browser-local Grammar fixture')};
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<FoundationDemo skill="grammar" sharedCatalog={catalog} requestedLessonId={id}/>);
 const overlay=()=>shell.querySelector('[data-grammar-knowledge="v2.3"]');
 await wait(()=>!!overlay(),'actual Foundation lesson overlay');
 check(overlay()?.getAttribute('data-lesson-id')===id,'correct lesson');
 const find=(label:string)=>[...shell.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent?.trim().startsWith(label));
 if(old){
  check((await runtime.service.lesson(id,'1.18.1')).version==='1.18.1'&&(await runtime.service.lesson(id,'1.28.1')).version==='1.28.1','both immutable historical and current source available');
  check(shell.textContent?.includes('Current lesson notes · v1.28.1'),'current notes label');
  find('View archived notes')!.click();await wait(()=>!overlay()&&!!find('View current lesson notes'),'archived notes toggle');
  check(shell.textContent?.includes('Archived lesson notes · v1.18.1'),'archive label');
  find('View current lesson notes')!.click();await wait(()=>!!overlay(),'current notes restored');
  find(draft?'Continue saved draft':'View saved result')!.click();await wait(()=>!!shell.querySelector('input[name="'+archive!.activities[0].id+'"]'),'historical practice');
  check(shell.querySelector<HTMLInputElement>('input[name="'+archive!.activities[0].id+'"][value="B"]')?.checked,'historical selected answer');
  check(shell.textContent?.includes('content 1.18.1'),'historical practice version');
  const field=shell.querySelector<HTMLInputElement>('input[name="'+archive!.activities[0].id+'"][value="B"]')!;
  check(field.matches(':disabled')===!draft,'submitted is read-only, draft remains editable');
  if(!draft)check(shell.textContent?.includes('Synthetic saved result'),'original scored feedback displayed');
  find('View lesson notes')!.click();await wait(()=>!!overlay(),'current notes after result');
  if(!draft)check(shell.textContent?.includes('Current lesson notes · v1.28.1'),'current knowledge after saved result');
 }
 // Let the ordinary same-answer draft autosave settle, then compare real
 // persisted records, not just an in-memory fixture object.
 if(draft)await new Promise(r=>setTimeout(r,1250));
 check(JSON.stringify(await runtime.academic.attempts(LOCAL_OWNER_ID))===before,'all saved attempts byte-equivalent; no new attempt');
 check(JSON.stringify((await runtime.academic.packages()).map(p=>({id:p.id,version:p.version,digest:p.digest})))===packagesBefore,'immutable packages unchanged');
 check(requests===0,'no network request');
 output.textContent='PASS_SLE_GRAMMAR_V23_'+id+'_'+width;
}
(async()=>{
 if(params.has('route')){await playerRoute();return}
 shell.style.width=width+'px';shell.style.maxWidth='100%';createRoot(shell).render(<Fixture/>);
 await wait(()=>!!shell.querySelector('[data-grammar-knowledge="v2.3"]'),'mount');
 const root=shell.querySelector<HTMLElement>('.sle-grammar-v23')!;
 check(root.querySelectorAll('.sle-gra02-section').length===entries[id].sections.length,'all sections');
 check(!root.querySelector('.sle-gra02-feedback'),'no blank feedback space');
 if(id in wave3b.lessons){
  const heads=[...root.querySelectorAll('.sle-gra02-step')].map(el=>el.textContent);
  check(heads.every((v,i)=>v===String(i+1)),'continuous numbered headings');
  check(root.querySelectorAll('.sle-gra02-remember').length===1&&!root.querySelector('.sle-gra02-remember .sle-gra02-step'),'unnumbered Remember');
  check(root.querySelectorAll('table').length===1,'reviewed comparison table');
  check(root.querySelectorAll('svg').length=== (['GRA-A2-14','GRA-A2-16'].includes(id)?1:0),'reviewed diagrams');
 }
 const questions=[...root.querySelectorAll<HTMLElement>('.sle-gra02-question')];check(questions.length===checks.length,'quiz count');
 for(let i=0;i<checks.length;i++){const opts=[...questions[i].querySelectorAll<HTMLButtonElement>('button')],wrong=checks[i].options.findIndex(o=>!o.correct),right=checks[i].options.findIndex(o=>o.correct);check(opts.length===checks[i].options.length,'options count');opts[wrong].click();await wait(()=>!!questions[i].querySelector('.is-wrong'),'wrong feedback');opts[right].click();await wait(()=>!!questions[i].querySelector('.is-correct'),'retry correct');}
 const toggle=shell.querySelector<HTMLButtonElement>('#vi-toggle')!;toggle.click();await wait(()=>!!root.querySelector('p[lang=vi]'),'Vietnamese on');toggle.click();await wait(()=>!root.querySelector('p[lang=vi]'),'Vietnamese off');
 check(root.querySelectorAll('.is-correct').length===checks.length,'keep quick-check choice on language toggle');
 if(id in wave3a.lessons){
  const heads=[...root.querySelectorAll('.sle-gra02-step')].map(el=>el.textContent);
  check(heads.every((v,i)=>v===String(i+1)),'continuous numbered headings');
  check(root.querySelectorAll('.sle-gra02-remember').length===1&&!root.querySelector('.sle-gra02-remember .sle-gra02-step'),'unnumbered Remember');
  check(root.querySelectorAll('table').length>=1,'reviewed comparison table');
  check(root.querySelectorAll('svg').length=== (['GRA-A2-01','GRA-A2-04','GRA-A2-07'].includes(id)?1:0),'reviewed diagrams');
 }
 if(id in wave4a.lessons){
  const heads=[...root.querySelectorAll('.sle-gra02-step')].map(el=>el.textContent);
  check(heads.every((v,i)=>v===String(i+1)),'continuous numbered headings');
  check(root.querySelectorAll('.sle-gra02-remember').length===1&&!root.querySelector('.sle-gra02-remember .sle-gra02-step'),'unnumbered Remember');
  check(root.querySelectorAll('table').length>=1,'reviewed comparison table');
  check(root.querySelectorAll('svg').length=== (['GRA-B1-03','GRA-B1-06'].includes(id)?1:0),'reviewed diagrams');
 }
 if(id in wave4b.lessons){
  const heads=[...root.querySelectorAll('.sle-gra02-step')].map(el=>el.textContent);
  check(heads.every((v,i)=>v===String(i+1)),'continuous numbered headings');
  check(root.querySelectorAll('.sle-gra02-remember').length===1&&!root.querySelector('.sle-gra02-remember .sle-gra02-step'),'unnumbered Remember');
  check(root.querySelectorAll('table').length>=1,'reviewed comparison table');
  check(root.querySelectorAll('svg').length=== (['GRA-B1-10','GRA-B2-01','GRA-B2-02'].includes(id)?1:0),'reviewed diagrams');
 }
 for(const svg of root.querySelectorAll<SVGSVGElement>('.diagram:not(.pyramid-wrap) svg')){
  const wide=svg.getAttribute('viewBox')?.startsWith('0 0 520 '),rect=svg.getBoundingClientRect();
  check(rect.width<=(wide?520:360)+2&&rect.height<=152,'compact diagram bounds');
  check(rect.width>0&&rect.height>0,'diagram visible');
  for(const label of svg.querySelectorAll('text')){
   const ctm=label.getScreenCTM();
   check(!!ctm,'label transform');
   const pixels=parseFloat(getComputedStyle(label).fontSize)*Math.hypot(ctm!.a,ctm!.b);
   check(pixels>=9&&pixels<=15,'proportionate label '+pixels);
  }
 }
 if(id==='GRA-A1-06'){check(root.querySelectorAll('.place-compact svg').length===7,'7 place diagrams');check(root.querySelectorAll('.transport-card').length===3,'3 transport cards');check(root.querySelector('.place-compact')!.getBoundingClientRect().height<950,'compact guide');}
 if(id==='GRA-A1-12')check(!!root.querySelector('.pyramid-wrap svg'),'pyramid');
 if(id==='GRA-A2-08'||id==='GRA-B1-01')check(root.querySelectorAll('svg').length>=2,'timelines');
 if(id==='GRA-B1-08')check(root.querySelectorAll('.sentence-flow').length===2,'transformation');
 if(['GRA-A1-03','GRA-A1-05','GRA-A1-09'].includes(id))check(!!root.querySelector('svg'),'reviewed visual diagram');
 if(['GRA-A1-01','GRA-A1-04','GRA-A1-08','GRA-A1-10'].includes(id))check(!!root.querySelector('table'),'reviewed comparison table');
 for(const el of root.querySelectorAll('.sle-gra02-section,.module-card,.diagram,.transport-card,.compact-table,.sle-gra02-quiz'))check(el.getBoundingClientRect().right<=shell.getBoundingClientRect().right+2,'overflow '+el.className);
 check(root.scrollWidth<=root.clientWidth+2,'no external horizontal overflow');
 output.textContent='PASS_SLE_GRAMMAR_V23_'+id+'_'+width;
})().catch(e=>{output.textContent='FAIL '+String(e)});
