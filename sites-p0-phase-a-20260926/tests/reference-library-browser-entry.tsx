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
 await wait(()=>getCount().includes('26 reference entries'),'initial 26 items');
 assert(document.querySelectorAll('.sle-reference-table-scroll tbody tr').length===6,'six verb rows');
 assert(document.querySelectorAll('.sle-reference-card').length===20,'20 phrase/strategy cards');
 assert(!!document.querySelector('input[type="search"]'),'search is native search input');
 assert(document.querySelectorAll('.sle-reference-category-filter').length===7,
  'Six text-labelled category buttons plus All');
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
  await wait(()=>getCount().includes('26 reference entries'),'clear filters');
  report('PASS_SEARCH_FILTERS');
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
