'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/p2b-adaptive-test');
fs.mkdirSync(path.join(out,'domain'),{recursive:true});fs.mkdirSync(path.join(out,'content'),{recursive:true});
fs.writeFileSync(path.join(out,'domain/adaptive-recommendations.js'),ts.transpileModule(fs.readFileSync(path.join(root,'domain/adaptive-recommendations.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true}}).outputText);
fs.copyFileSync(path.join(root,'content/adaptive-map-v1.json'),path.join(out,'content/adaptive-map-v1.json'));
fs.writeFileSync(path.join(out,'package.json'),'{}');
const {deriveAdaptiveGrammarProgress}=require(path.join(out,'domain/adaptive-recommendations.js'));

const lessons=[
 {id:'GRA-A1-01',module:'grammar',title:'Be current',activities:[]},
 {id:'GRA-A1-03',module:'grammar',title:'Present simple current',activities:[]},
 {id:'GRA-A1-08',module:'grammar',title:'Questions current',activities:[]},
 {id:'GRA-A2-01',module:'grammar',title:'Present contrast current',activities:[]},
 {id:'GRA-A2-02',module:'grammar',title:'Past simple current',activities:[]},
 {id:'GRA-B1-01',module:'grammar',title:'Past vs present perfect current',activities:[]}
];
const current={id:'pkg',version:'1.5.0',at:200,source:{lessons}};
const old={id:'pkg',version:'1.4.0',at:100,source:{lessons:lessons.map(l=>({...l,title:l.title.replace(' current',' old')}))}};
const row=(id,tag,correct)=>({id,correct,tags:[tag]});
const attempt=(id,version,lessonId,results,createdAt)=>({id,packageId:'pkg',version,lessonId,status:'scored',createdAt,submittedAt:createdAt,results});
const attempts=[
 attempt('be1','1.5.0','GRA-A1-01',[row('GRA-A1-01-Q1','grammar.be_forms',false)],1),
 attempt('be2','1.5.0','GRA-A1-01',[row('GRA-A1-01-Q1','grammar.be_forms',false)],2),
 attempt('be3','1.5.0','GRA-A1-01',[row('GRA-A1-01-Q2','grammar.be_forms',true)],3),

 attempt('qf1','1.4.0','GRA-A1-08',[row('GRA-A1-08-Q1','grammar.question_formation',false)],4),
 attempt('qf2','1.5.0','GRA-A1-08',[row('GRA-A1-08-Q1','grammar.question_formation',false)],5),
 attempt('qf3','1.5.0','GRA-A1-08',[row('GRA-A1-08-Q2','grammar.question_formation',false)],6),

 attempt('pc1','1.5.0','GRA-A2-01',[row('GRA-A2-01-Q1','grammar.present_continuous',false)],7),
 attempt('pc2','1.5.0','GRA-A2-01',[row('GRA-A2-01-Q2','grammar.present_continuous',true)],8),

 attempt('pp1','1.5.0','GRA-B1-01',[row('GRA-B1-01-Q1','grammar.present_perfect',false)],9),
 attempt('pp2','1.5.0','GRA-B1-01',[row('GRA-B1-01-Q2','grammar.present_perfect',false)],10),
 attempt('pp3','1.5.0','GRA-B1-01',[row('GRA-B1-01-Q2','grammar.present_perfect',true)],11),

 attempt('ps1','1.5.0','GRA-A1-03',[
  row('GRA-A1-03-Q1','grammar.present_simple',true),
  row('GRA-A1-03-Q2','grammar.present_simple',true),
  row('GRA-A1-03-Q3','grammar.present_simple',true)
 ],12),
 attempt('ps2','1.5.0','GRA-A1-03',[
  row('GRA-A1-03-Q4','grammar.present_simple',true),
  row('GRA-A1-03-Q5','grammar.present_simple',true)
 ],13),
 {...attempt('draft','1.5.0','GRA-A1-01',[row('GRA-A1-01-Q9','grammar.be_forms',false)],14),status:'started'},
 {...attempt('unassessed','1.5.0','GRA-A1-01',[row('GRA-A1-01-Q10','grammar.be_forms',false)],15),status:'unassessed'}
];
const snapshot=JSON.stringify(attempts);
const result=deriveAdaptiveGrammarProgress(attempts,[old,current]);
const concept=id=>result.concepts.find(x=>x.conceptId===id);

assert.equal(result.currentContentVersion,'1.5.0');
assert.equal(concept('be-forms').state,'needs_practice');
assert.equal(concept('be-forms').correct,1);
assert.equal(concept('be-forms').total,3,'draft and unassessed work must be excluded');
assert.equal(concept('be-forms').distinctQuestions,2);
assert.equal(concept('be-forms').repeatedQuestions,1);

assert.equal(concept('question-formation').distinctQuestions,3,'same question ID in two immutable content versions stays distinct');
assert.equal(concept('question-formation').state,'needs_practice');

assert.equal(concept('present-continuous').state,'not_enough_evidence','two observations are not enough for a weakness claim');
assert.equal(concept('past-simple').state,'not_enough_evidence','unobserved prerequisite is not treated as failure');
assert.equal(concept('present-perfect').state,'needs_practice');
assert.equal(concept('present-simple').state,'stable_for_now');
assert.equal(concept('present-simple').distinctQuestions,5);
assert.equal(concept('present-simple').attempts,2);

const foundation=result.recommendations.find(x=>x.recommendedConceptId==='be-forms');
assert.ok(foundation,'weak prerequisite should produce an actionable foundation recommendation');
assert.equal(foundation.prerequisiteFirst,true);
assert.equal(foundation.prerequisiteFor,'question-formation');
assert.equal(foundation.lessonId,'GRA-A1-01');
assert.equal(foundation.lessonTitle,'Be current','recommendation must route to the current package lesson');

const pp=result.recommendations.find(x=>x.recommendedConceptId==='present-perfect');
assert.ok(pp,'an unobserved prerequisite must not block direct practice');
assert.equal(pp.prerequisiteFirst,false);
assert.equal(pp.lessonId,'GRA-B1-01');
assert.equal(pp.lessonTitle,'Past vs present perfect current');
assert.ok(result.recommendations.length<=3);
assert.equal(JSON.stringify(attempts),snapshot,'adaptive projection must not mutate saved attempts');
assert.match(result.note,/never regraded/);
console.log('PASS: P2B Grammar concepts are version-safe, conservative, prerequisite-aware, current-content routed and read-only.');
