import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {StructuredGrammarNotes} from '../app/structured-grammar';
import curriculum from '../content/curriculum-1.28.0-candidate.json';
import data from '../content/grammar-knowledge-v23-wave1.json';
import type {SeedLesson} from '../domain/academic';
const params=new URL(location.href).searchParams,id=params.get('lesson')??'GRA-A1-02',width=Number(params.get('width')??375);
const shell=document.getElementById('app')!,output=document.getElementById('sle-test-result')!;
const lesson=curriculum.lessons.find(l=>l.id===id) as unknown as SeedLesson;
const entries=data.lessons as Record<string,{sections:{quiz?:{options:{correct:boolean}[]}[]}[]}>;
const checks=entries[id].sections.flatMap(s=>s.quiz??[]);
function Fixture(){const [showVi,setShowVi]=useState(false);return <main className="foundation-lesson"><button id="vi-toggle" onClick={()=>setShowVi(x=>!x)}>Vietnamese Support</button><StructuredGrammarNotes lesson={lesson} version="1.28.0" showVi={showVi}/></main>}
const check=(yes:unknown,label:string)=>{if(!yes)throw Error(id+' '+width+' '+label)};
const wait=async(f:()=>boolean,label:string)=>{for(let i=0;i<220;i++){if(f())return;await new Promise(r=>setTimeout(r,30))}throw Error('Timeout '+label)};
(async()=>{
 shell.style.width=width+'px';shell.style.maxWidth='100%';createRoot(shell).render(<Fixture/>);
 await wait(()=>!!shell.querySelector('[data-grammar-knowledge="v2.3"]'),'mount');
 const root=shell.querySelector<HTMLElement>('.sle-grammar-v23')!;
 check(root.querySelectorAll('.sle-gra02-section').length===entries[id].sections.length,'all sections');
 check(!root.querySelector('.sle-gra02-feedback'),'no blank feedback space');
 const questions=[...root.querySelectorAll<HTMLElement>('.sle-gra02-question')];check(questions.length===checks.length,'quiz count');
 for(let i=0;i<checks.length;i++){const opts=[...questions[i].querySelectorAll<HTMLButtonElement>('button')],wrong=checks[i].options.findIndex(o=>!o.correct),right=checks[i].options.findIndex(o=>o.correct);check(opts.length===checks[i].options.length,'options count');opts[wrong].click();await wait(()=>!!questions[i].querySelector('.is-wrong'),'wrong feedback');opts[right].click();await wait(()=>!!questions[i].querySelector('.is-correct'),'retry correct');}
 const toggle=shell.querySelector<HTMLButtonElement>('#vi-toggle')!;toggle.click();await wait(()=>!!root.querySelector('p[lang=vi]'),'Vietnamese on');toggle.click();await wait(()=>!root.querySelector('p[lang=vi]'),'Vietnamese off');
 check(root.querySelectorAll('.is-correct').length===checks.length,'keep quick-check choice on language toggle');
 if(id==='GRA-A1-06'){check(root.querySelectorAll('.place-compact svg').length===7,'7 place diagrams');check(root.querySelectorAll('.transport-card').length===3,'3 transport cards');check(root.querySelector('.place-compact')!.getBoundingClientRect().height<950,'compact guide');}
 if(id==='GRA-A1-12')check(!!root.querySelector('.pyramid-wrap svg'),'pyramid');
 if(id==='GRA-A2-08'||id==='GRA-B1-01')check(root.querySelectorAll('svg').length>=2,'timelines');
 if(id==='GRA-B1-08')check(root.querySelectorAll('.sentence-flow').length===2,'transformation');
 for(const el of root.querySelectorAll('.sle-gra02-section,.module-card,.diagram,.transport-card,.compact-table,.sle-gra02-quiz'))check(el.getBoundingClientRect().right<=shell.getBoundingClientRect().right+2,'overflow '+el.className);
 check(root.scrollWidth<=root.clientWidth+2,'no external horizontal overflow');
 output.textContent='PASS_SLE_GRAMMAR_V23_'+id+'_'+width;
})().catch(e=>{output.textContent='FAIL '+String(e)});
