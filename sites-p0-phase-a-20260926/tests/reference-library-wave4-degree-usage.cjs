'use strict';
/** Academic Markdown→JSON source parity, all 329 old references immutable,
 * 364 current UI entries, unscored Listening/Reading/Writing safeguards.
 * Academically PASS ≠ engineering or LIVE deployment authorization.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const source=read('notebooklm/SLE_REF_W4_DEGREE_USAGE_CROSSSKILL_R1_20261121.md');
const verdict=read('notebooklm/SLE_REF_W4_DEGREE_USAGE_CROSSSKILL_R1_VERDICT_RECONCILIATION_20261121.md');
const pack=JSON.parse(read('content/reference-library-v4-degree-usage-reviewed.json'));
assert(source.includes('SLE-REF-W4-DEGREE-USAGE-CROSSSKILL-R1-20261121'));
assert(verdict.includes('ACADEMIC_VERDICT: PASS')&&verdict.includes('NO_TOPIC_LINKS_AUTHORIZED'));
assert.equal(pack.source_standard,'SLE-MASTER-001 v1.2.1');
assert.equal(pack.review_status,'NOTEBOOKLM_PASS_35_OF_35');
assert.equal(pack.release_status,'STAGED_DRAFT_NOT_RELEASED');
const kinds={DEG:'degree_expressions',PRE:'preposition_patterns',
 WFN:'writing_functions',REA:'reading_strategies',LIS:'listening_strategies'};
const section=source.split('## 4. Thirty-five ORIGINAL academic candidates')[1]?.split('\n## 5.')[0];
assert(section,'Missing all 35 independently reviewed authored sections');
const blocks=section.split(/(?=^#### REF4-)/m).filter(x=>x.startsWith('####'));
assert.equal(blocks.length,35);
const clean=x=>x.replace(/\*\*/g,'').replaceAll(String.fromCharCode(96),'').replace(/\*/g,'').trim();
const fields=['Suggested navigation level','Register / mode','Meaning or strategy','Pattern or micro-procedure',
 'Independent illustration','Contrast or reasoning','Watch out or limits','Learner self-check','Search hints'];
function parseCard(block){
 const m=block.split('\n')[0].match(/^#### (REF4-([A-Z]{3})-\d{3}) — (.+)$/);
 assert(m&&kinds[m[2]],'A reviewed card must have a Wave4 family and stable ID');
 const f={};for(const line of block.split('\n').filter(x=>x.startsWith('- **'))){
  for(const h of line.matchAll(/\*\*([^*]+):\*\*\s*(.*?)(?=\s*\*\*[^*]+:\*\*|$)/g)){
   assert.equal(f[h[1]],undefined,'No duplicated source field in '+m[1]+':'+h[1]);
   f[h[1]]=clean(h[2]);
  }
 }
 for(const name of fields)assert(typeof f[name]==='string'&&f[name].length>0,m[1]+' missing '+name);
 return {id:m[1],kind:kinds[m[2]],title:m[3],
  suggested_level:f['Suggested navigation level'].replace(/\.$/,''),
  register_or_mode:f['Register / mode'].replace(/\.$/,''),
  meaning_or_strategy:f['Meaning or strategy'],
  pattern_or_procedure:f['Pattern or micro-procedure'],
  independent_illustration:f['Independent illustration'],
  contrast_or_reasoning:f['Contrast or reasoning'],
  watch_out_or_limits:f['Watch out or limits'],
  learner_self_check:f['Learner self-check'],
  search_hints:f['Search hints'].replace(/\.$/,'').split(',').map(x=>x.trim())};
}
assert.deepEqual(pack.entries,blocks.map(parseCard),'Every approved authored field must match Markdown exactly');
assert.equal(pack.entries.length,35);
assert.equal(new Set(pack.entries.map(x=>x.id)).size,35);
for(const [prefix,kind] of Object.entries(kinds)){
 const n=(prefix==='DEG'||prefix==='PRE')?10:5;
 const rows=pack.entries.filter(e=>e.kind===kind);
 assert.equal(rows.length,n);
 assert(rows.every(e=>e.id.startsWith('REF4-'+prefix+'-')));
}
for(const e of pack.entries){
 assert(!('answer_key' in e)&&!('lesson_id' in e)&&!('score' in e)&&!('audio_src' in e),
 'Reference cards must contain zero graded keys, unverified lesson links, or media sources');
 assert(e.search_hints.length>=3&&e.suggested_level,'Card search/level metadata');
}
// Hash-lock SIX source files from the accepted 329-entry live release (Git object SHA1).
const SHA={
 'content/reference-library-pilot-v1.json':'789033dad2b99790b5b4dd3a98c4a3ce28ebeecc',
 'content/reference-library-v2-wave1-reviewed.json':'9ce5e56951da0bfb3e9d43c12240a1ebeb74ab16',
 'content/reference-library-v2-writing-connectors-wave2-reviewed.json':'465e75e5fe3720ea26ebec4ca51ca48c0cadbd34',
 'content/reference-library-v2-irregular-candidate.json':'4055186bbb56ba350f410bb3401b905ab8d29cef',
 'content/reference-library-v2-grammar-writing-reviewed.json':'9357263be6d500631431414e4604a01dfcf246e6',
 'content/reference-library-v3-cross-skill-reviewed.json':'74cbe17b2586e9bb17fd67335365c0b53fb170d8'
};
for(const [p,expected] of Object.entries(SHA)){
 const bytes=Buffer.from(read(p),'utf8');
 assert.equal(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),
 expected,'Original reviewed source changed unexpectedly: '+p);
}
const pilot=JSON.parse(read('content/reference-library-pilot-v1.json'));
const w1=JSON.parse(read('content/reference-library-v2-wave1-reviewed.json'));
const link=JSON.parse(read('content/reference-library-v2-writing-connectors-wave2-reviewed.json'));
const verbs=JSON.parse(read('content/reference-library-v2-irregular-candidate.json'));
const w2=JSON.parse(read('content/reference-library-v2-grammar-writing-reviewed.json'));
const w3=JSON.parse(read('content/reference-library-v3-cross-skill-reviewed.json'));
const old=[...pilot.entries,...w1.entries.filter(e=>e.kind!=='irregular_verbs'),
 ...link.entries,...verbs.new_entries,...w2.entries,...w3.entries];
assert.equal(old.length,329);
assert.equal(new Set(old.map(e=>e.id)).size,329);
const all=[...old,...pack.entries];
assert.equal(all.length,364);
assert.equal(new Set(all.map(e=>e.id)).size,364);
assert.equal(new Set(all.map(e=>(e.term??e.title??e.base).toLocaleLowerCase('en'))).size,364);
const ui=read('app/reference-library.tsx'),domain=read('domain/reference-library.ts'),css=read('app/globals.css');
assert(ui.includes('...WAVE3_ENTRIES,...WAVE4_ENTRIES'),'Append, do not regenerate 329 prior cards');
assert(ui.includes('364 reviewed records')&&ui.includes('Wave 4 Degree/Preposition/Writing/Reading/Listening guides'));
const start=ui.indexOf('  {waveFourGroups.length>0&&'),end=ui.indexOf('  {waveThreeGroups.length>0&&');
assert(start>=0&&end>start);
const specialist=ui.slice(start,end);
for(const label of ['Meaning / strategy:','Pattern / procedure:','Independent illustration:',
 'Compare / why:','Watch out / limits:','Check yourself:']){
 assert(specialist.includes(label),'Every card must display: '+label);
}
assert(specialist.includes('not actual audio, scored listening results, transcripts'));
assert(!specialist.includes('onOpenLesson(')&&!specialist.includes('<Related')&&
 !specialist.includes('<audio')&&!specialist.includes('setItem(')&&!specialist.includes('fetch('),
 'Academic NO_TOPIC_LINKS_AUTHORIZED / READ_ONLY_REFERENCE_ONLY');
assert(css.includes('Reference Library Wave 4 static academic card groups'));
const code=ts.transpileModule(domain,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const target=path.join(root,'.sites-runtime/reference-library-wave4-domain.cjs');
fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,code);
const {filterReferenceEntries,REFERENCE_V2_KINDS}=require(target);
assert.deepEqual(REFERENCE_V2_KINDS.slice(-3).map(x=>x.id),
 ['degree_expressions','preposition_patterns','writing_functions']);
assert.equal(REFERENCE_V2_KINDS.length,11,'Old eight extension kinds, plus three new');
const asRow=e=>{
 const reg=e.register_or_mode.toLowerCase();
 const register=reg.startsWith('neutral to formal')?'neutral to formal'
  :reg.startsWith('neutral')?'neutral':reg.startsWith('informal')?'informal'
  :reg.startsWith('formal')?'formal':'not_tagged';
 const skill=e.kind==='reading_strategies'?'reading':e.kind==='listening_strategies'?'listening'
  :e.kind==='writing_functions'?'writing':e.kind==='preposition_patterns'?'grammar':'vocabulary';
 return {...e,term:e.title,meaning:e.meaning_or_strategy,example:e.independent_illustration,
  note:e.watch_out_or_limits,level:'not_tagged',register,skill};
};
const rows=[...pilot.entries,...w1.entries.filter(e=>e.kind!=='irregular_verbs'),
 ...link.entries,...verbs.new_entries.map(e=>({...e,term:e.base,kind:'irregular_verbs',
  level:'not_tagged',register:'not_tagged',skill:'grammar'})),
 ...w2.entries.map(e=>({...e,term:e.title,level:'not_tagged',register:'not_tagged',
  skill:e.kind==='grammar_comparisons'?'grammar':'writing'})),
 ...w3.entries.map(asRow),...pack.entries.map(asRow)];
const get=(query='',kind='all',level='all')=>
 filterReferenceEntries(rows,{query,kind,level,register:'all'});
assert.equal(get().length,364);
for(const [kind,n] of [['degree_expressions',10],['preposition_patterns',10],
 ['writing_functions',5],['reading_strategies',10],['listening_strategies',10]])assert.equal(get('',kind).length,n);
assert.equal(get('too heavy','degree_expressions')[0]?.id,'REF4-DEG-001');
assert.equal(get('look forward to meeting','preposition_patterns')[0]?.id,'REF4-PRE-009');
assert.equal(get('discuss about','preposition_patterns')[0]?.id,'REF4-PRE-007');
assert.equal(get('hedging','writing_functions')[0]?.id,'REF4-WFN-003');
assert.equal(get('problem solution','reading_strategies').find(e=>e.id.startsWith('REF4-'))?.id,'REF4-REA-001');
assert.equal(get('at least at most','listening_strategies').find(e=>e.id.startsWith('REF4-'))?.id,'REF4-LIS-004');
assert(get('','preposition_patterns','A1').some(e=>e.id==='REF4-PRE-002'),
 'A1–A2 instructional level range contains A1');
assert(get('','degree_expressions','B2').some(e=>e.id==='REF4-DEG-005'));
assert(get('','irregular_verbs').some(e=>e.id==='REF-IRR-01'));
assert(get('','writing_connectors').some(e=>e.id==='REF2-LNK-042'));
console.log(JSON.stringify({result:'PASS',gate:'reference-library-wave4-degree-usage-35',
 sourceParity:35,immutableOriginalBlobs:6,preserved:329,total:364,
 newKinds:3,reusedKinds:2,noTopicLinks:true,noAudioOrTranscriptLeak:true,
 learnerWrites:0,release:'NOT_AUTHORIZED'}));
