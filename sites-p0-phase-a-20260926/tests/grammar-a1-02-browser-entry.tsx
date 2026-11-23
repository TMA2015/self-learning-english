import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {StructuredGrammarNotes} from '../app/structured-grammar';
import type {SeedLesson} from '../domain/academic';
import approved from '../docs/reviews/grammar_40_approved_lesson_design.json';

/** Synthetic, read-only real-React browser QA. Nothing is submitted or saved. */
const params=new URL(location.href).searchParams;
const width=Number(params.get('width')??'960');
const output=document.getElementById('sle-test-result')!;
const shell=document.getElementById('app')!;
const review=approved.lessons.find(l=>l.id==='GRA-A1-02');
if(!review)throw Error('Canonical NotebookLM-reviewed lesson not found');
const [en,vi]=review.approved_lesson_design_markdown.split(/### Vietnamese Support \([^\n]*?\)/);
if(!en||!vi)throw Error('Canonical authored EN/VI source incomplete');
const lesson={
 id:'GRA-A1-02',title:review.title,module:'grammar',objectives:review.baseline_goals,
 explanation:{en:en.trim(),vi:vi.trim()},activities:[]
} as unknown as SeedLesson;
function Fixture(){
 const [showVi,setShowVi]=useState(false);
 return <main className="foundation-lesson" aria-label="Synthetic GRA-A1-02 layout">
   <button id="vi-toggle" type="button" aria-pressed={showVi} onClick={()=>setShowVi(x=>!x)}>Vietnamese Support</button>
   <StructuredGrammarNotes lesson={lesson} showVi={showVi}/>
 </main>;
}
const check=(yes:unknown,reason:string)=>{if(!yes)throw Error('GRA-A1-02 Browser: '+reason)};
const wait=async(test:()=>boolean,why:string)=>{
 for(let i=0;i<180;i++){if(test())return;await new Promise(r=>setTimeout(r,30))}
 throw Error('Timeout: '+why);
};
const right=(el:Element)=>el.getBoundingClientRect().right;
(async()=>{
 check([375,768,960].includes(width),'unexpected fixture width');
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<Fixture/>);
 await wait(()=>!!document.querySelector('.sle-gra02'),'React mount');
 const panel=document.querySelector('.sle-gra02') as HTMLElement;
 check(!!panel,'actual pilot component is rendered');
 check(panel.querySelectorAll('.sle-gra02-section').length===7,'all 7 teaching sections render');
 const table=panel.querySelector('.sle-gra02-table-scroll') as HTMLElement;
 check(!!table,'comparison table exists');
 const rows=[...table.querySelectorAll('tbody tr')];
 check(rows.length===7,'seven person/possessive pairs');
 check(rows[0].textContent?.includes('I have a bag.')&&rows[0].textContent?.includes('My bag is new.'),
   'I/my full example pair');
 check(rows[1].textContent?.includes('You have a ticket.')&&rows[1].textContent?.includes('Your ticket is here.'),
   'NotebookLM-corrected you/your full example pair');
 check(table.querySelectorAll('thead th').length===4,'four explicit columns');
 check(panel.querySelectorAll('.sle-gra02-example').length===4,'four authored worked examples');
 check(panel.querySelectorAll('.sle-gra02-mistake').length===2,'two canonical wrong/right contrasts');
 check(panel.querySelectorAll('.sle-gra02-mistake .sle-gra02-rule').length===2,
   'reasons are separate from the green correct example');
 check(panel.querySelectorAll('[lang="vi"]').length===7,'only 7 Meaning cells in default English-first mode');
 const headings=[...panel.querySelectorAll('.sle-gra02-heading h3')].map(x=>x.textContent?.trim());
 check(headings.includes('7 Pairs to Know')&&headings.includes('Quick Self-Check'),
   'English-first headings');
 check(!panel.textContent?.includes('Mục tiêu bài học'),'no Vietnamese section label when support OFF');
 const card=panel.querySelector('.sle-gra02-example')!;
 check(getComputedStyle(card).fontFamily.includes('Arial'),'SLE typography is kept');
 const appRight=right(shell);
 for(const el of panel.querySelectorAll('.sle-gra02-section,.sle-gra02-example,.sle-gra02-table-scroll,.sle-gra02-quiz')){
  check(right(el)<=appRight+2,'outer content overflow at '+width+'px: '+(el as HTMLElement).className);
 }
 if(table.scrollWidth>table.clientWidth+2){
  table.scrollLeft=100;
  check(table.scrollLeft>0,'wide table must scroll inside its own container');
 }
 const options=[...panel.querySelectorAll('.sle-gra02-answer')] as HTMLButtonElement[];
 check(options.length===4,'two optional quiz items each have two choices');
 check(panel.textContent?.includes('unscored')&&panel.textContent?.includes('not saved'),'evidence boundary visible');
 options[0].click(); // Incorrect Q1 "They"
 await wait(()=>!!panel.querySelector('.sle-gra02-answer.is-wrong'),'wrong answer feedback');
 check(panel.textContent?.includes('Try again.'),'constructive wrong answer guidance');
 options[1].click(); // Correct Q1 "Their"
 options[2].click(); // Correct Q2 "He"
 await wait(()=>panel.querySelectorAll('.sle-gra02-answer.is-correct').length===2,'correct selections');
 check(panel.textContent?.includes('Their comes before the noun mother'),'correct reasoning visible');
 const toggle=document.getElementById('vi-toggle') as HTMLButtonElement;
 toggle.click();
 await wait(()=>panel.querySelectorAll('[lang="vi"]').length>7,'Vietnamese Support ON');
 check(toggle.getAttribute('aria-pressed')==='true','language toggle state');
 check(panel.textContent?.includes('Mục tiêu bài học'),'translated heading appears only ON');
 toggle.click();
 await wait(()=>panel.querySelectorAll('[lang="vi"]').length===7,'Vietnamese Support OFF again');
 check(toggle.getAttribute('aria-pressed')==='false','toggle reset state');
 check(!panel.textContent?.includes('Mục tiêu bài học'),'translated heading hidden again');
 output.textContent='PASS_GRA_A1_02_BROWSER_'+width+'_'+rows.length+'PAIRS';
})().catch(e=>{output.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,700)});
