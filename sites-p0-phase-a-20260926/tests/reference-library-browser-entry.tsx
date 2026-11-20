import React from 'react';
import {createRoot} from 'react-dom/client';
import {ReferenceLibrary} from '../app/reference-library';
import type {Catalog} from '../app/foundation';
const phase=new URL(location.href).searchParams.get('phase');
const out=document.getElementById('sle-test-result')!;
const fail=(s:string)=>{throw Error('REFERENCE_BROWSER '+s)};
const report=(s:string)=>out.textContent=s;
const assert=(value:unknown,label:string)=>{if(!value)fail(label)};
const wait=async(fn:()=>boolean,label:string)=>{
 for(let i=0;i<400;i++){
  if(fn())return;
  await new Promise(r=>setTimeout(r,25));
 }
 fail('Timeout '+label+' / '+document.getElementById('app')?.innerText.slice(0,350));
};
const select=(label:string,value:string)=>{
 const e=document.querySelector('select[aria-label="'+label+'"]') as HTMLSelectElement|null;
 assert(e,'Missing selector '+label);
 e!.value=value;e!.dispatchEvent(new Event('change',{bubbles:true}));
};
const search=(value:string)=>{
 const e=document.querySelector('input[aria-label="Search reference entries"]') as HTMLInputElement|null;
 assert(e,'Missing search');
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
 setter.call(e,value);e!.dispatchEvent(new Event('input',{bubbles:true}));
};
const getCount=()=>{
 const status=document.querySelector('.sle-reference-search-summary [role="status"]')
  ??document.querySelector('.sle-reference-search-summary');
 return status?.textContent??'';
};
const catalog={
 version:'TEST',imported:phase!=='missing',
 lessons:[
  {id:'GRA-A1-01',title:'Grammar practice',module:'grammar',cefr:'A1',minutes:18},
  {id:'VOC-A2-03',title:'Vocabulary practice',module:'vocabulary',cefr:'A2',minutes:20}
 ],attempts:[],journey:{steps:[],title:'Test'},course:{sequence:[]}
} as unknown as Catalog;
let selection='';
(async()=>{
 createRoot(document.getElementById('app')!).render(
  <ReferenceLibrary catalog={catalog} onCatalog={()=>fail('Unnecessary catalog fetch')}
   onOpenLesson={(id,skill)=>{selection=id+' '+skill;report('PASS_LINK '+selection)}}/>
 );
 await wait(()=>getCount().includes('234 reference entries'),'26 pilot + 23 reviewed phrases + 185 reviewed corpus verbs');
 assert(document.querySelectorAll('.sle-reference-table-scroll tbody tr').length===25,'191 reviewed verbs paginated 25 per page');
 assert(document.querySelectorAll('.sle-reference-card').length===20,'20 phrase/strategy cards');
 assert(!!document.querySelector('input[type="search"]'),'search is native search input');
 assert(document.querySelectorAll('.sle-reference-category-filter').length===9,
  'Eight text-labelled category buttons plus All');
 if(phase==='search'){
  const badge=(kind:string)=>document.querySelector('.sle-reference-category-filter.is-'+kind) as HTMLButtonElement|null;
  assert(!!badge('idioms'),'Idioms category exists');
  badge('idioms')!.click();
  await wait(()=>badge('idioms')?.getAttribute('aria-pressed')==='true','category selected');
  assert(badge('phrasal_verbs')?.getAttribute('aria-pressed')==='false','other category not selected');
  await wait(()=>getCount().includes('3 reference entries'),'idioms filter');
  search('ice');
  await wait(()=>getCount().includes('1 reference entry'),'term search');
  assert(document.getElementById('app')?.textContent?.includes('break the ice'),'expected idiom shown');
  badge('phrasal_verbs')!.click();
  await wait(()=>badge('phrasal_verbs')?.getAttribute('aria-pressed')==='true','other category selected');
  search('DECLINE');
  await wait(()=>getCount().includes('1 reference entry'),'local synonym indexed');
  assert(document.getElementById('app')?.textContent?.includes('turn down'),'decline finds turn down');
  select('Reference type','idioms');
  await wait(()=>getCount().includes('0 reference entries'),'synonym respects category filter');
  search('this-never-matches-any-entry');
  await wait(()=>document.getElementById('app')?.textContent?.includes('No matching entries')??false,'honest empty state');
  const clear=[...document.querySelectorAll('button')].find(x=>x.textContent?.includes('Clear filters'));
  clear?.click();
  await wait(()=>getCount().includes('234 reference entries'),'clear filters');
  report('PASS_SEARCH_FILTERS');
 }else if(phase==='v2'){
  select('Reference type','writing_connectors');
  await wait(()=>getCount().includes('12 reference entries'),'12 reviewed connectors');
  assert(document.querySelectorAll('.sle-ref-connector-card').length===12,'connector cards');
  search('because');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='because','exact because ranked first across related matches');
  assert(document.querySelector('.sle-ref-connector-card h4')?.textContent==='because',
   'Exact connector match should rank before because of');
  search('despite');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='despite',
   'despite rule visible before indirect mentions');
  assert(document.getElementById('app')?.textContent?.includes('noun phrase / -ing phrase'),
   'despite must require noun/-ing construction');
  search('');select('Reference type','frequency_expressions');
  await wait(()=>getCount().includes('11 reference entries'),'eleven reviewed frequency expressions');
  assert(document.querySelectorAll('.sle-ref-frequency-item').length===8,'qualitative ladder eight');
  assert(document.querySelectorAll('.sle-ref-counted-frequency .sle-ref-connector-card').length===3,
   'three counted/interval expressions separate from ladder');
  const freqRegion=document.querySelector('[aria-label="Frequency expressions"]');
  assert(!!freqRegion,'frequency section rendered');
  assert(freqRegion!.querySelectorAll('progress,meter,[data-fixed-percentage]').length===0,
   'No invented numerical percentage chart');
  assert(freqRegion!.textContent?.includes('not fixed numerical percentages'),
   'Teach why an indefinite adverb cannot be assigned fixed percentages');
  search('usually');
  await wait(()=>document.querySelector('.sle-ref-frequency-item strong')?.textContent==='usually',
   'search adverb + position guidance');
  search('did');select('Reference type','irregular_verbs');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='do',
   'search by historical V2 form did');
  search('gotten');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='get',
   'American participle gotten finds get');
  search('learnt');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='learn',
   'British variant learnt finds learn');
  search('');
  await wait(()=>document.querySelectorAll('.sle-reference-table-scroll tbody tr').length===25,
   'reset to first page of 191 verbs');
  const pag=document.querySelector('[aria-label="Irregular verb pages"]') as HTMLElement|null;
  assert(!!pag,'191 verbs require page navigation');
  const next=[...pag!.querySelectorAll('button')].find(b=>b.textContent?.includes('Next'));
  assert(!!next,'Next page button must exist');
  next!.click();
  await wait(()=>pag!.textContent?.includes('Page 2 / 8')??false,'25-row paging moves to page 2');
  const w=[...document.querySelectorAll('[aria-label="Filter irregular verbs by initial letter"] button')]
   .find(b=>b.textContent==='W') as HTMLButtonElement|undefined;
  assert(!!w,'A–Z letter W available');w!.click();
  await wait(()=>w!.getAttribute('aria-pressed')==='true','A–Z letter selection');
  assert([...document.querySelectorAll('.sle-reference-table-scroll tbody th')]
   .every(th=>th.textContent?.toLowerCase().startsWith('w')),'W filter must show W verbs');
  report('PASS_V2_REVIEWED_REFERENCE_191');
 }else if(phase==='catalog'){
  const first=document.querySelector('.sle-reference-table-scroll .sle-reference-practice button') as HTMLButtonElement|null;
  assert(first,'available real catalog lesson should show button');
  first!.click();
  await wait(()=>selection==='GRA-A1-01 grammar','catalog-grounded callback');
  assert(!document.getElementById('app')?.textContent?.includes('CEFR certification awarded'),'no fake badge');
  report('PASS_CATALOG_LINK');
 }else if(phase==='missing'){
  assert(document.querySelectorAll('.sle-reference-practice button').length===0,'no false links on missing catalog');
  assert((document.getElementById('app')?.textContent??'').includes('not imported on this device'),'clear missing catalog reason');
  report('PASS_MISSING_CATALOG');
 }else fail('unknown phase');
})().catch(e=>report('FAIL '+String(e)+' '+String((e as Error).stack).slice(0,800)));
