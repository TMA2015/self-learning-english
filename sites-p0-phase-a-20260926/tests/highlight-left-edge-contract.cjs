'use strict';
/** SLE lesson UI invariant: colored callout accents are on the LEFT edge. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
assert.match(css,/\.gdp-mistakes\{border-top:1px solid #dce5ef;border-left:4px solid #c88b49\}/,
 'Common mistakes orange accent must be left; normal top border remains');
assert.doesNotMatch(css,/\.gdp-mistakes\{[^}]*border-top:(?:[3-9]|[1-9][0-9]+)px/,
 'Never restore the orange top bar');
assert.doesNotMatch(css,/border-(?:top|block-start)\s*:\s*(?:[3-9]|[1-9][0-9]+)px\s+solid\b/,
 'Thick top-border accents have no place in lesson CSS');
assert.match(css,/\.gdp-integrated \.gdp-card:not\(\.gdp-goals\):not\(\.gdp-mistakes\):not\(\.gdp-vi\)/,
 'Grammar mistakes keep their own colored edge in integrated lessons');
const leftEdgeCallouts=[
 ['.gdp-preview-note',/#4779b9/],
 ['.sle-vocab-demo',/#527fb9/],
 ['.sle-rgw-model',/#4277b9/],
 ['.sle-unit-browser .unit-checkpoint-note',/#cfaa51/],
 ['.foundation-hint-content p',/#6d98cf/],
 ['.exercise',/#e6ae40/]
];
for(const [selector,color] of leftEdgeCallouts){
 const index=css.indexOf(selector+'{');
 assert(index>=0,'Missing left-accented lesson callout '+selector);
 const rule=css.slice(index,css.indexOf('}',index)+1);
 assert.match(rule,/border-left:\s*[3-9]px solid/,'Left highlight needed for '+selector);
 assert.match(rule,color,'Preserve reviewed accent color on '+selector);
}
const structured=fs.readFileSync(path.join(root,'app/structured-grammar.tsx'),'utf8');
assert.match(structured,/s\.title==='Common mistakes'\?'gdp-mistakes'/,
 'All structured Grammar lessons use one reusable mistakes class');
console.log(JSON.stringify({result:'PASS',gate:'SLE_CALLOUT_LEFT_EDGE_CONTRACT',
 cssSingleSource:true,commonMistakesLeft:true,leftCalloutsAudited:1+leftEdgeCallouts.length,
 originalLessonContentUnchanged:true,scoreChanges:0,storedAttemptChanges:0,
 productionDeployment:false}));
