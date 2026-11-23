import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {StructuredGrammarNotes} from '../app/structured-grammar';
import type {SeedLesson} from '../domain/academic';
import approved from '../docs/reviews/grammar_40_approved_lesson_design.json';

/** Both current UI treatments mounted in one React page; synthetic question
 * represents the same Foundation DOM/classes. No scored or persistence API.
 * This is CSS-integration QA, not a browser test of real authenticated FoundationDemo.
 */
const args=new URL(location.href).searchParams;
const width=Number(args.get('width')??'960');
const root=document.getElementById('app')!;
const result=document.getElementById('sle-test-result')!;
const source=approved.lessons.find(x=>x.id==='GRA-A1-02');
if(!source)throw Error('NotebookLM-approved GRA-A1-02 design unavailable');
const [english,vietnamese]=source.approved_lesson_design_markdown.split(/### Vietnamese Support \([^\n]*?\)/);
if(!english||!vietnamese)throw Error('Approved bilingual source incomplete');
const lesson={id:'GRA-A1-02',title:source.title,module:'grammar',objectives:source.baseline_goals,
 explanation:{en:english.trim(),vi:vietnamese.trim()},activities:[]} as unknown as SeedLesson;
function Fixture(){
 const [showVi,setShowVi]=useState(false);
 const [choice,setChoice]=useState('');
 const [draft,setDraft]=useState('');
 return <section className="panel foundation-lesson foundation-focus" aria-label="Combined SLE UI fixture">
  <h2>Pronouns and possessive adjectives</h2>
  <button id="language" type="button" aria-pressed={showVi} onClick={()=>setShowVi(old=>!old)}>Vietnamese Support</button>
  <StructuredGrammarNotes lesson={lesson} showVi={showVi}/>
  <section aria-label="Synthetic practice panel" id="synthetic-practice">
   <fieldset className="foundation-question"><legend>1. Linh is my sister. ___ is kind.</legend>
    <div className="foundation-option-grid">
     {['He','She','They','It'].map(option=><label className="foundation-option" key={option}>
      <input type="radio" name="synthetic-gra-q" checked={choice===option} onChange={()=>setChoice(option)}/>{option}
     </label>)}
    </div>
    {choice&&<div className="exercise" role="status"><strong>{choice==='She'?'Correct':'Try again'}</strong><p>She refers to Linh.</p></div>}
   </fieldset>
   <fieldset className="foundation-question"><legend>2. Complete: ___ book is new.</legend>
    <label className="field">Answer format: missing word only.
     <textarea rows={2} value={draft} onChange={e=>setDraft(e.target.value)}/>
    </label>
   </fieldset>
   <details className="foundation-attempt-details"><summary>Attempt details</summary><p>TEST ONLY – no attempt saved.</p></details>
  </section>
 </section>;
}
function check(condition:unknown,message:string){if(!condition)throw Error('SLE_COMBINED_UI '+message)}
async function wait(predicate:()=>boolean,message:string){
 for(let i=0;i<150;i++){if(predicate())return;await new Promise(r=>setTimeout(r,35))}
 throw Error('timeout '+message);
}
(async()=>{
 check([375,768,960].includes(width),'invalid content width '+width);
 root.style.width=width+'px';root.style.maxWidth='100%';
 createRoot(root).render(<Fixture/>);
 await wait(()=>!!document.querySelector('.sle-gra02'),'real knowledge component mounted');
 const panel=document.querySelector('.foundation-focus') as HTMLElement;
 const knowledge=panel.querySelector('.sle-gra02') as HTMLElement;
 const practice=panel.querySelector('#synthetic-practice') as HTMLElement;
 check(knowledge!==null&&practice!==null,'both styles mount in same lesson');
 const rect=(el:Element)=>el.getBoundingClientRect();
 const options=[...practice.querySelectorAll('.foundation-option')] as HTMLElement[];
 check(options.length===4,'four MCQ options shown');
 const columns=getComputedStyle(practice.querySelector('.foundation-option-grid')!).gridTemplateColumns.trim().split(/\s+/);
 const gridWidth=rect(practice.querySelector('.foundation-option-grid')!).width;
 const expected=gridWidth>=728?2:1; // 2*360px + 8px gap; content narrower after panel padding
 check(columns.length===expected,'MCQ columns '+columns.length+' expected '+expected+' at '+width);
 for(const label of options){
  check(rect(label).height>=43.5,'44px option target');
  check(rect(label).right<=rect(panel).right+2,'practice option clipping');
 }
 const rows=knowledge.querySelectorAll('.sle-gra02-table-scroll tbody tr');
 check(rows.length===7,'seven pronoun pairs in combined layout');
 check(knowledge.querySelectorAll('[lang="vi"]').length===7,'English-first except Meaning');
 const table=knowledge.querySelector('.sle-gra02-table-scroll') as HTMLElement;
 check(rect(table).right<=rect(panel).right+2,'outer comparison table clipping');
 if(table.scrollWidth>table.clientWidth+2){
  table.scrollLeft=85;
  check(table.scrollLeft>0,'table must scroll internally');
 }
 check(knowledge.textContent?.includes('You have a ticket.'),'reviewed you/your example retained');
 (practice.querySelectorAll('input[type="radio"]')[1] as HTMLInputElement).click();
 await wait(()=>practice.textContent?.includes('Correct')??false,'chosen option feedback');
 check(options[1].querySelector('input')?.checked===true,'radio checked');
 const area=practice.querySelector('textarea') as HTMLTextAreaElement;
 area.value='My';area.dispatchEvent(new Event('input',{bubbles:true}));
 check(rect(area).height<90,'short answer compact');
 const button=panel.querySelector('#language') as HTMLButtonElement;
 button.click();
 await wait(()=>knowledge.querySelectorAll('[lang="vi"]').length>7,'VI support activates');
 check(knowledge.textContent?.includes('Mục tiêu bài học'),'Vietnamese heading appears when on');
 button.click();
 await wait(()=>knowledge.querySelectorAll('[lang="vi"]').length===7,'VI support deactivates');
 check(panel.scrollWidth<=panel.clientWidth+2,'combined lesson horizontal overflow');
 check(rect(knowledge).right<=rect(panel).right+2,'lesson knowledge overflow');
 check(rect(practice).right<=rect(panel).right+2,'lesson practice overflow');
 result.textContent='PASS_COMBINED_UI_'+width+'_COL'+expected;
})().catch(e=>{result.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,650)});
