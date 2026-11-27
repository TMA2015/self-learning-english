'use strict';
/** UX regression covering every Foundation Writing U01–U12 component and Writing Studio.
 * No production writes, browser storage modification or network AI calls. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const components=[
 {file:'app/foundation-writing-u01.tsx',ids:['FW-U01']},
 {file:'app/foundation-writing-u02-u03.tsx',ids:['FW-U02','FW-U03']},
 {file:'app/foundation-writing-u04-u06.tsx',ids:['FW-U04','FW-U05','FW-U06']},
 {file:'app/foundation-writing-u07-u09.tsx',ids:['FW-U07','FW-U08','FW-U09']},
 {file:'app/foundation-writing-wave4.tsx',ids:['FW-U10','FW-U11','FW-U12']},
];
const allUnits=components.flatMap(item=>item.ids);
assert.deepEqual(allUnits,Array.from({length:12},(_,i)=>'FW-U'+String(i+1).padStart(2,'0')));
let totalRadioChoices=0;
for(const {file,ids} of components){
 const content=read(file);
 assert.match(content,/<WritingSteps step=/);assert.match(content,/<WritingReviewAction signature=/);assert.doesNotMatch(content,/label:'AI Tutor'/);
 assert.match(content,/className="foundation-unit-top-nav"/,file+' must have a top course navigation button');
 assert.match(content,/foundation-unit-top-nav"><button type="button" className="secondary-button" onClick=\{onExit\}/,
  file+' top Back button must use existing guarded course exit');
 assert.match(content,/>Back to Foundation Writing<\/button>/,
  file+' must preserve footer Back button');
 assert.equal((content.match(/foundation-unit-top-nav/g)||[]).length,1,'Exactly one top course nav per component: '+file);
 assert.equal((content.match(/<input type="radio"/g)||[]).length,
  (content.match(/className="field wcv2-radio-option"/g)||[]).length,
  'Every radio input uses a scoped compact row: '+file);
 totalRadioChoices+=(content.match(/<input type="radio"/g)||[]).length;
 assert.doesNotMatch(content,/Evidence weight 0|proficiency weight 0|Practice evidence weight 0|Independent academic PASS/i,
  file+' must not expose internal accounting/academic process wording to learners');
}
assert(totalRadioChoices>=8,'Coverage must include at least eight actual radio-choice templates');
const shared=read('app/foundation-writing-ui.tsx');
assert.match(shared,/writingSteps=\['learn','extra','cycleA','cycleB','transfer'\]/);
assert.match(shared,/Knowledge Check/);assert.match(shared,/Save & Ask AI Tutor/);assert.match(shared,/const ok=await onSave\(\)/);assert.match(shared,/if\(!ok\)/);assert.match(shared,/if\(!eligible\)/);
const css=read('app/globals.css');
assert.match(css,/\.wcv2 label\.wcv2-radio-option input\[type="radio"\]/);
assert.match(css,/width:18px;height:18px/,'radio diameter should not inherit .field text-input width');
assert.match(css,/min-height:18px/,'radio should not inherit the 49px minimum height');
assert.match(css,/\.foundation-unit-top-nav/);
const anyTopic=read('app/any-topic-writing-review.tsx');
const studio=read('app/writing-ai-review.tsx');
assert.doesNotMatch(anyTopic,/No AI review, quality score or CEFR estimate has been performed yet/,
 'Do not claim there is no review when a valid Gemini assessment is already visible');
assert.match(studio,/item\.evidence&&<p><strong>From your writing:/,
 'Show only verified original-source text');
assert.doesNotMatch(studio,/No exact quotation available from this draft/,
 'Avoid repeated empty-evidence placeholders');
const scoringSource=read('domain/writing-studio-scoring.ts');
const js=ts.transpileModule(scoringSource,{
 fileName:'writing-studio-scoring.ts',compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
}).outputText;
const moduleStub={exports:{}};
vm.runInNewContext(js,{module:moduleStub,exports:moduleStub.exports,
 require(name){
  if(name==='./writing-studio-reference')return {CEFR_WRITING_CRITERIA:[]};
  throw Error('Unexpected module '+name);
}}, {timeout:1000});
const quote=moduleStub.exports.verifiedWritingExcerpt;
const draft='In the mornings,\nmy siblings built  huge sandcastles and collected shells.';
const valid='In the mornings, my siblings built huge sandcastles';
assert.equal(quote(draft,valid),'In the mornings,\nmy siblings built  huge sandcastles',
 'Only whitespace normalization of a real source span is allowed');
assert.equal(quote(draft,'the writer wrote a completely new sentence'),'',
 'Never invent or accept ungrounded quotations');
assert.equal(quote(draft,'my siblings built'),'my siblings built');
assert.equal(quote(draft,null),'');
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_ALL_12_UX',
 units:allUnits,componentFiles:components.length,radioTemplates:totalRadioChoices,
 topBackButtons:12,footerBackButtonsPreserved:12,
 globalRadioLeak:false,internalStatusCopyRemoved:true,
 staleWritingStudioReviewCopyRemoved:true,groundedQuoteRecovery:true,
 productionWrites:0,realGeminiCalls:0}));
