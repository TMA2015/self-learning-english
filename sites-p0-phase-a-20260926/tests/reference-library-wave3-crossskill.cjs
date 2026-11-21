'use strict';
/** Wave 3 exact Markdown↔JSON academic source fidelity + 294-item legacy lock.
 * Read-only static references. Academic PASS is not an implementation or LIVE gate.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=read('notebooklm/SLE_REF_W3_CROSS_SKILL_VOCAB_R1_20261121.md');
const verdict=read('notebooklm/SLE_REF_W3_CROSS_SKILL_VOCAB_R1_VERDICT_RECONCILIATION_20261121.md');
const pack=JSON.parse(read('content/reference-library-v3-cross-skill-reviewed.json'));
assert(src.includes('SLE-REF-W3-CROSS-SKILL-VOCAB-R1-20261121'),'Exact review packet ID must be retained.');
assert(verdict.includes('ACADEMIC_VERDICT: PASS')&&verdict.includes('NO_TOPIC_LINKS_AUTHORIZED'));
assert.equal(pack.review_status,'NOTEBOOKLM_PASS_35_OF_35');
assert.equal(pack.source_standard,'SLE-MASTER-001 v1.2.1');
assert.equal(pack.entries.length,35);
const kinds={PHR:'phrasal_verbs',COL:'collocations',WFM:'word_families',
 CNF:'confusable_words',IDI:'idioms',REA:'reading_strategies',LIS:'listening_strategies'};
const group=src.split('## 4. Thirty-five ORIGINAL academic candidates')[1]?.split('## 5. Numbered independent NotebookLM')[0];
assert(group,'Section 4 independent academic candidate text must be available.');
const blocks=group.split(/(?=^#### REF3-)/m).filter(s=>s.startsWith('####'));
assert.equal(blocks.length,35);
const unmd=s=>s.replace(/\*\*/g,'').replaceAll(String.fromCharCode(96),'').replace(/\*/g,'').trim();
const required=['Suggested level','Register / mode','Meaning or strategy','Pattern or procedure',
 'Independent illustration','Contrast or reasoning','Watch out or limits','Learner self-check','Search hints'];
function extract(block){
 const h=block.split('\n')[0].match(/^#### (REF3-([A-Z]{3})-\d{3}) — (.+)$/);
 assert(h&&kinds[h[2]],'Stable ID/heading for source section');
 const f={};
 for(const l of block.split('\n').filter(s=>s.startsWith('- **'))){
  for(const m of l.matchAll(/\*\*([^*]+):\*\*\s*(.*?)(?=\s*\*\*[^*]+:\*\*|$)/g)){
   assert.equal(f[m[1]],undefined,'Do not silently ignore duplicate authored fields');
   f[m[1]]=unmd(m[2]);
  }
 }
 for(const k of required)assert(f[k]?.length>0,h[1]+' missing field '+k);
 return {id:h[1],kind:kinds[h[2]],title:h[3],
  suggested_level:f['Suggested level'].replace(/\.$/,''),
  register_or_mode:f['Register / mode'].replace(/\.$/,''),
  meaning_or_strategy:f['Meaning or strategy'],
  pattern_or_procedure:f['Pattern or procedure'],
  independent_illustration:f['Independent illustration'],
  contrast_or_reasoning:f['Contrast or reasoning'],
  watch_out_or_limits:f['Watch out or limits'],
  learner_self_check:f['Learner self-check'],
  search_hints:f['Search hints'].replace(/\.$/,'').split(',').map(x=>x.trim())};
}
assert.deepEqual(pack.entries,blocks.map(extract),
 'Each of the 35 NotebookLM-reviewed entries must retain source parity for ALL teaching fields.');
for(const [prefix,kind] of Object.entries(kinds)){
 const sub=pack.entries.filter(e=>e.kind===kind);
 assert.equal(sub.length,5,kind+' reviewed count');
 assert(sub.every(e=>e.id.startsWith('REF3-'+prefix+'-')),kind+' stable ID family');
}
assert.equal(new Set(pack.entries.map(e=>e.id)).size,35);
for(const e of pack.entries){
 assert(e.search_hints.length>=3,'Useful search hints: '+e.id);
 assert(!('score' in e)&&!('lesson_id' in e)&&!('answer_key' in e)&&!('audio_src' in e),
 'Never embed a scored item or a lesson/audio transcript in Wave3');
}
// Git blob SHA-1 pins every preceding academic source, not only counts.
const originalFiles={
 'content/reference-library-pilot-v1.json':'789033dad2b99790b5b4dd3a98c4a3ce28ebeecc',
 'content/reference-library-v2-wave1-reviewed.json':'9ce5e56951da0bfb3e9d43c12240a1ebeb74ab16',
 'content/reference-library-v2-writing-connectors-wave2-reviewed.json':'465e75e5fe3720ea26ebec4ca51ca48c0cadbd34',
 'content/reference-library-v2-irregular-candidate.json':'4055186bbb56ba350f410bb3401b905ab8d29cef',
 'content/reference-library-v2-grammar-writing-reviewed.json':'9357263be6d500631431414e4604a01dfcf246e6'
};
for(const [file,expected] of Object.entries(originalFiles)){
 const bytes=Buffer.from(read(file),'utf8');
 const hash=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(hash,expected,'Reviewed source must remain byte-for-byte unchanged: '+file);
}
const pilot=JSON.parse(read('content/reference-library-pilot-v1.json'));
const w1=JSON.parse(read('content/reference-library-v2-wave1-reviewed.json'));
const w2c=JSON.parse(read('content/reference-library-v2-writing-connectors-wave2-reviewed.json'));
const verbs=JSON.parse(read('content/reference-library-v2-irregular-candidate.json'));
const w2g=JSON.parse(read('content/reference-library-v2-grammar-writing-reviewed.json'));
const previous=[...pilot.entries,...w1.entries.filter(e=>e.kind!=='irregular_verbs'),...w2c.entries,
 ...verbs.new_entries,...w2g.entries];
assert.equal(previous.length,294,'Preserve 264 previous Wave1 + 30 Wave2 entries.');
const previousIds=previous.map(e=>e.id);
assert.equal(new Set(previousIds).size,294);
const all=[...previous,...pack.entries];
assert.equal(all.length,329);
assert.equal(new Set(all.map(e=>e.id)).size,329,'Old and new IDs cannot collide.');
assert.equal(new Set(all.map(e=>(e.term??e.title??e.base).toLowerCase())).size,329,
 'No duplicated expressions or headwords across existing 294 and Wave3 new 35.');
for(const id of ['REF-PHR-01','REF-COL-01','REF-IDI-01','REF-MIS-03','REF-TIP-01','REF-TIP-02','REF2-GRM-001','REF2-WTK-010']){
 assert(previousIds.includes(id),'Legacy review protections remain present: '+id);
}
const ui=read('app/reference-library.tsx'),domain=read('domain/reference-library.ts'),css=read('app/globals.css');
assert(ui.includes('...GRAMMAR_WRITING_ENTRIES,...WAVE3_ENTRIES'),
 'Only append 35 approved specialist records after preserving 294 existing.');
assert(ui.includes('364 reviewed records')&&ui.includes('PASS 35/35'));
assert(ui.includes('Wave 3 vocabulary reading and listening references'));
assert(ui.includes('NO_TOPIC_LINKS_AUTHORIZED'));
const section=ui.slice(ui.indexOf('  {waveThreeGroups.length>0&&'),ui.indexOf('  {grammarComparisons.length>0&&'));
assert(section.includes('Pattern / procedure')&&section.includes('Check yourself:')&&section.includes('Watch out / limits'),
 'Every specialist card must show procedure, self-check, and caution.');
assert(!section.includes('<Related')&&!section.includes('onOpenLesson(')
 && !section.includes('setItem(')&&!section.includes('<audio')&&!section.includes('fetch('),
 'No new topic lesson links, storage mutation, player controls, or network calls.');
assert(section.includes('not audio transcripts, graded stimuli or hearing evidence'));
assert(css.includes('Reference Library Wave 3: compact, accessible 320px'));
const compiled=ts.transpileModule(domain,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const out=path.join(root,'.sites-runtime/reference-library-wave3-domain.cjs');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,compiled);
const {filterReferenceEntries,REFERENCE_KINDS,REFERENCE_V2_KINDS}=require(out);
assert.equal(REFERENCE_KINDS.length,6,'Do not mutate six original category kinds.');
assert.deepEqual(REFERENCE_V2_KINDS.slice(0,8).map(x=>x.id),[
 'writing_connectors','frequency_expressions','grammar_comparisons','writing_toolkit',
 'word_families','confusable_words','reading_strategies','listening_strategies'
]);
const convert=e=>{
 const skill=e.kind==='reading_strategies'?'reading':e.kind==='listening_strategies'?'listening':'vocabulary';
 const reg=e.register_or_mode.toLowerCase();
 const register=reg.startsWith('neutral to formal')?'neutral to formal':reg.startsWith('neutral')?'neutral':
  reg.startsWith('informal')?'informal':reg.startsWith('formal')?'formal':'not_tagged';
 return {...e,term:e.title,meaning:e.meaning_or_strategy,example:e.independent_illustration,
  note:e.watch_out_or_limits,skill,register,level:'not_tagged'};
};
const previousMap=[...pilot.entries,...w1.entries.filter(e=>e.kind!=='irregular_verbs'),...w2c.entries,
 ...verbs.new_entries.map(e=>({...e,term:e.base,kind:'irregular_verbs',level:'not_tagged',
  register:'not_tagged',skill:'grammar'})),
 ...w2g.entries.map(e=>({...e,term:e.title,level:'not_tagged',register:'not_tagged',
  skill:e.kind==='grammar_comparisons'?'grammar':'writing'}))];
const entries=[...previousMap,...pack.entries.map(convert)];
const filter=(q,kind='all',level='all',register='all')=>
 filterReferenceEntries(entries,{query:q,kind,level,register});
assert.equal(filter('').length,329);
for(const [kind,n] of [['phrasal_verbs',9],['collocations',10],['idioms',8],
 ['word_families',5],['confusable_words',5],['reading_strategies',5],['listening_strategies',5]]){
 assert.equal(filter('',kind).length,n,'Original kind + new specialist count: '+kind);
}
assert.equal(filter('look after','phrasal_verbs')[0]?.id,'REF3-PHR-001');
assert.equal(filter('put it off','phrasal_verbs')[0]?.id,'REF3-PHR-002');
assert.equal(filter('actually currently','confusable_words')[0]?.id,'REF3-CNF-005');
assert.equal(filter('transcript after submit','listening_strategies')[0]?.id,'REF3-LIS-005');
assert(filter('','listening_strategies','A1').some(e=>e.id==='REF3-LIS-001'),
 'A1–A2 navigation hint includes A1.');
assert(filter('','reading_strategies','B1').some(e=>e.id==='REF3-REA-005'));
assert(filter('','collocations').some(e=>e.id==='REF-COL-01'));
assert(filter('','grammar_comparisons').some(e=>e.id==='REF2-GRM-020'));
console.log(JSON.stringify({result:'PASS',gate:'reference-library-wave3-crossskill-35',
 sourceParity:35,legacyBlobsPinned:5,preserved:294,total:329,newKinds:4,
 reusedKinds:3,sourceVerified:'SLE-MASTER-001 v1.2.1',noTopicLinks:true,
 noTranscriptLeak:true,learnerWrites:0,release:'NOT_AUTHORIZED'}));
