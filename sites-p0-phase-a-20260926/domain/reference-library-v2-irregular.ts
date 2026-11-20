/**
 * Reference Library v2 irregular-verb CANDIDATE selectors.
 * The 185 additional records passed independent NotebookLM content review; release remains NOT authorized.
 * Pure operations: no scoring, network, learner state or storage.
 */
export type ReviewState='PILOT_REVIEWED'|'CORPUS_REVIEWED';
export type VerbPriority='core'|'extended';
export type IrregularVerbRow={
 id:string;
 base:string;
 past:string;
 participle:string;
 meaning:string;
 example:string;
 usageNote:string;
 priority:VerbPriority;
 reviewState:ReviewState;
 searchTerms:readonly string[];
};
export type ExistingPilotVerb={
 id:string;
 kind:string;
 term:string;
 meaning:string;
 example:string;
 note:string;
 forms?:{base:string;past:string;participle:string};
};
export type StagedVerb={
 id:string;
 kind:'irregular_verbs';
 base:string;
 past:string;
 participle:string;
 meaning:string;
 example:string;
 usage_note:string;
 tier:VerbPriority;
 review_status:'NOTEBOOKLM_PASS';
 search_terms:string[];
};
const normalize=(v:string)=>v.normalize('NFKC').toLocaleLowerCase('en').trim();
function variants(text:string){return text.split(' / ').map(normalize)}
export function buildIrregularRows(pilot:readonly ExistingPilotVerb[],staged:readonly StagedVerb[]):IrregularVerbRow[]{
 const existing=pilot.filter(x=>x.kind==='irregular_verbs').map(x=>{
  if(!x.forms)throw Error('Missing released three forms: '+x.id);
  return {
   id:x.id,base:x.forms.base,past:x.forms.past,participle:x.forms.participle,
   meaning:x.meaning,example:x.example,usageNote:x.note,priority:'core' as const,
   reviewState:'PILOT_REVIEWED' as const,
   searchTerms:[x.forms.base,...variants(x.forms.past),...variants(x.forms.participle)],
  };
 });
 const incoming=staged.map(x=>({
  id:x.id,base:x.base,past:x.past,participle:x.participle,
  meaning:x.meaning,example:x.example,usageNote:x.usage_note,priority:x.tier,
  reviewState:'CORPUS_REVIEWED' as const,
  searchTerms:[...x.search_terms],
 }));
 const result=[...existing,...incoming];
 if(new Set(result.map(e=>normalize(e.base))).size!==result.length)
  throw Error('Duplicate irregular base lemma');
 if(new Set(result.map(e=>e.id)).size!==result.length)
  throw Error('Duplicate irregular ID');
 return result.sort((a,b)=>a.base.localeCompare(b.base,'en'));
}
export type IrregularVerbSearch={query:string;priority:'all'|VerbPriority;initial:'all'|string};
export function searchIrregularRows(rows:readonly IrregularVerbRow[],filters:IrregularVerbSearch):IrregularVerbRow[]{
 const tokens=normalize(filters.query).split(/\s+/).filter(Boolean);
 const match=rows.filter(row=>{
  if(filters.priority!=='all'&&row.priority!==filters.priority)return false;
  if(filters.initial!=='all'&&!normalize(row.base).startsWith(normalize(filters.initial)))return false;
  const content=[row.base,row.past,row.participle,row.meaning,row.example,
   row.usageNote,...row.searchTerms].join(' ').toLocaleLowerCase('en');
  return tokens.every(t=>content.includes(t));
 });
 // An exact lookup of V1/V2/V3 should beat incidental mentions in examples.
 const rank=(row:IrregularVerbRow)=>{
  if(!tokens.length)return 0;
  const forms=[row.base,...variants(row.past),...variants(row.participle)].map(normalize);
  const full=normalize(filters.query);
  if(forms.includes(full))return 0;
  if(forms.some(f=>f.startsWith(full)))return 1;
  if(forms.some(f=>f.includes(full)))return 2;
  return 3;
 };
 return match.sort((a,b)=>rank(a)-rank(b)||a.base.localeCompare(b.base,'en'));
}
export function pageIrregularRows(rows:readonly IrregularVerbRow[],page:number,size=25){
 const safeSize=Math.max(1,Math.min(50,Math.trunc(size)||25));
 const totalPages=Math.max(1,Math.ceil(rows.length/safeSize));
 const current=Math.max(1,Math.min(totalPages,Math.trunc(page)||1));
 return {rows:rows.slice((current-1)*safeSize,current*safeSize),page:current,
  totalPages,totalRows:rows.length,size:safeSize};
}
