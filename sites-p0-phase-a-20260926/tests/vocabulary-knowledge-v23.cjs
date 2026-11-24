'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {VocabularyKnowledgeV23,vocabularyKnowledgeV23Available,normalizeVocabularyRecall}=require('../app/vocabulary-knowledge-v23.tsx');
const data=require('../content/vocabulary-knowledge-v23.json'),base=require('../content/curriculum-1.28.0-candidate.json');
const expected=base.lessons.filter(x=>x.module==='vocabulary').map(x=>x.id).sort();
assert.deepEqual(Object.keys(data.lessons).sort(),expected);assert.equal(expected.length,22);
let cards=0,recall=0,quick=0,renders=0,deterministic=0,open=0;
for(const id of expected){
 const d=data.lessons[id],lesson=base.lessons.find(l=>l.id===id);
 assert(vocabularyKnowledgeV23Available(lesson,'1.28.0'));
 for(const version of ['1.25.0','1.27.0','1.29.0','1.32.0'])assert(!vocabularyKnowledgeV23Available(lesson,version));
 assert(!vocabularyKnowledgeV23Available({...lesson,module:'grammar'},'1.28.0'));
 assert.deepEqual(d.deck.map(x=>x.cardId),d.cards.map(x=>x.id));
 assert.deepEqual(d.groups.flatMap(x=>x.cardIds),d.cards.map(x=>x.id));
 assert(d.cards.every(c=>c.speech.length===2&&c.speech[1]===c.exampleEn));
 assert.equal(d.recalls.length,2);assert.equal(d.quickChecks.length,2);
 for(const r of d.recalls){if(r.accepted){deterministic++;assert.equal(r.mode,'DETERMINISTIC_UNSCORED');assert(r.accepted.includes(r.model.en)||r.accepted.length>1)}else{open++;assert.equal(r.mode,'OPEN_UNSCORED')}}
 for(const q of d.quickChecks){assert.equal(q.options.length,3);assert.equal(q.options.filter(o=>o.id===q.key).length,1);assert(q.options.every(o=>o.feedbackEn&&o.feedbackVi))}
 for(const showVi of [false,true]){
 const html=renderToStaticMarkup(React.createElement(VocabularyKnowledgeV23,{lesson,version:'1.28.0',showVi}));renders++;
 assert(html.includes('Vocabulary Knowledge v2.3'));assert.equal((html.match(/class="sle-ms-card sle-voc-card"/g)||[]).length,d.cards.length);
 assert.equal(html.includes('lang="vi"'),showVi);
 assert(!html.includes('correct_option_id')&&!html.includes('accepted_answers')&&!html.includes('Compare with the target phrase')&&!html.includes('Self-comparison · no automatic grading'));
 assert(!html.includes('Hide model'));assert(!html.includes('Correct choice'));
 }
 cards+=d.cards.length;recall+=d.recalls.length;quick+=d.quickChecks.length;
}
assert.deepEqual([cards,recall,quick,deterministic,open,renders],[255,44,44,23,21,44]);
assert.equal(normalizeVocabularyRecall('  ON   BALANCE! '),'on balance');
assert.notEqual(normalizeVocabularyRecall('on balances'),'on balance');
const code=fs.readFileSync('app/vocabulary-knowledge-v23.tsx','utf8'),foundation=fs.readFileSync('app/foundation.tsx','utf8');
assert(!/fetch\(|localStorage|sessionStorage|foundationRequest\(|\.getVoices\(|\.voice\s*=/.test(code));
assert(code.includes("utterance.lang='en-GB'")&&code.includes('utterance.rate=0.92')&&code.includes('speechSynthesis.cancel()'));
assert(foundation.includes('vocabularyKnowledgeV23Available(lesson,loadedLessonVersion.current)?<VocabularyKnowledgeV23'));
console.log(JSON.stringify({gate:'VOCABULARY_V23_SOURCE_SSR',result:'PASS',lessons:22,cards,recall,quick,deterministic,open,renders,scope:'unscored version pinned'}));
