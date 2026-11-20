'use strict';
/** Reviewed SLE Reference Library v2 Wave 1 — source parity and no learner writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.join(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const old=JSON.parse(read('content/reference-library-pilot-v1.json'));
const w=JSON.parse(read('content/reference-library-v2-wave1-reviewed.json'));
const packet=read('notebooklm/SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.md');
const domain=read('domain/reference-library.ts');
const ui=read('app/reference-library.tsx');
const css=read('app/globals.css');
assert.equal(old.review_status,'NOTEBOOKLM_PASS_26_OF_26');
assert.equal(old.entries.length,26);
assert.equal(w.review_status,'NOTEBOOKLM_PASS_38_OF_38');
assert.equal(w.runtime_state,'DRAFT_NOT_LIVE');
assert.equal(w.entries.length,38);
assert.equal(new Set(w.entries.map(e=>e.id)).size,38);
const byKind={irregular_verbs:15,writing_connectors:12,frequency_expressions:11};
for(const [kind,n] of Object.entries(byKind))assert.equal(w.entries.filter(e=>e.kind===kind).length,n);
assert.equal(new Set([...old.entries,...w.entries].map(e=>e.id)).size,64);
assert.equal(new Set([...old.entries,...w.entries].map(e=>e.term.toLowerCase())).size,64);
for(const e of w.entries){
 assert(/^REF2-(IRR|LNK|FRQ)-\\d{3}$/.test(e.id),'stable new ID '+e.id);
 const mark='#### '+e.id+' — '+e.term;
 const start=packet.indexOf(mark),next=packet.indexOf('\n#### REF2-',start+mark.length);
 assert(start>=0,'missing review packet entry '+e.id);
 const section=packet.slice(start,next<0?packet.indexOf('\n## 4.',start):next);
 const f={};for(const m of section.matchAll(/^- \\*\\*([^*]+):\\*\\* (.+)$/gm))f[m[1]]=m[2];
 for(const [key,val] of [['Kind',e.kind],['Suggested level',e.level],
  ['Register',e.register],['Original example',e.example],['Usage guidance',e.note]]){
  assert.equal(f[key],val,e.id+': original review field diverged: '+key);
 }
 assert(typeof e.common_error==='string'&&e.common_error.length>6,e.id);
 assert(!('answer' in e)&&!('score' in e)&&!('correct_option_id' in e),'no live assessment content');
 if(e.kind==='irregular_verbs'){
  assert.equal(f['Meaning'],e.meaning);
  assert.equal(f['Pattern group'],e.pattern_group);
  assert.equal(f['Common error / contrast'],e.common_error);
  assert.equal(f['Three forms'],'base='+e.forms.base+'; past='+e.forms.past+'; past participle='+e.forms.participle);
 }else if(e.kind==='writing_connectors'){
  assert.equal(f['Function'],e.function);
  assert.equal(f['Grammatical type'],e.grammatical_type);
  assert.equal(f['Construction / punctuation pattern'],e.construction);
  assert.equal(f['Avoid / compare'],e.common_error);
 }else{
  assert.equal(f['Type'],e.frequency_type);
  assert.equal(f['Qualitative band'],e.qualitative_band);
  assert.equal(f['Default placement / pattern'],e.position_rule);
  assert.equal(f['Common error / qualification'],e.common_error);
 }
}
const transpiled=ts.transpileModule(domain,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const out=path.join(root,'.sites-runtime/reference-library-wave1-domain.cjs');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,transpiled);
const {REFERENCE_KINDS,REFERENCE_V2_KINDS,filterReferenceEntries}=require(out);
assert.equal(REFERENCE_KINDS.length,6,'preserve six reviewed pilot categories');
assert.equal(REFERENCE_V2_KINDS.length,2,'new connector/frequency categories');
const entries=[...old.entries,...w.entries],base={query:'',kind:'all',level:'all',register:'all'};
assert.equal(filterReferenceEntries(entries,base).length,64);
function find(query,kind='all'){return filterReferenceEntries(entries,{...base,query,kind}).map(e=>e.term)}
for(const [query,expected] of [['did','do'],['done','do'],['thought','think'],['despite','despite'],
 ['because','because'],['usually','usually'],['every other day','every other day']]){
 assert.equal(find(query)[0],expected,'exact lookup priority: '+query);
}
assert.deepEqual(find('', 'writing_connectors').length,12);
assert.deepEqual(find('', 'frequency_expressions').length,11);
assert.equal(w.entries.filter(e=>e.frequency_type==='indefinite_frequency').length,8);
assert.equal(w.entries.filter(e=>e.frequency_type==='definite_frequency').length,3);
assert(!w.entries.some(e=>/\\b(?:\\d+\\s*%|percentage=)\\b/i.test(e.note||'')),'no fictional fixed percentages');
assert(ui.includes('reference-library-v2-wave1-reviewed.json'));
assert(!ui.includes('reference-library-v2-irregular-candidate.json'),
 'The UNREVIEWED 191 corpus must remain isolated from the LIVE-facing reference UI');
assert(ui.includes('className="sle-ref-frequency-ladder"'));
assert(ui.includes('className="sle-ref-connector-group"'));
assert(css.includes('.sle-reference .sle-reference-scroll-cue'));
assert(css.includes('.sle-reference .sle-reference-table-scroll thead th'));
assert(!/\\blocalStorage\\.setItem\\s*\\(|\\bindexedDB\\.open\\s*\\(/.test(ui+domain));
console.log(JSON.stringify({result:'PASS',gate:'reference-library-v2-wave1-reviewed',
 reviewed:38,preservedPilot:26,aggregate:64,irregular:21,connectors:12,
 frequency:11,parity:true,academicSourceVersionReconciliation:'RELEASE_GATE',
 unreviewed191Live:false,productionWrites:0}));
