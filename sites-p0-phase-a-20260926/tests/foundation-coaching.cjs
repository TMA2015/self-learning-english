const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const ui = read('app/foundation.tsx');
const hints = read('app/foundation-pilot-hints.ts');
const css = read('app/globals.css');

// Static source-level QA. Full TypeScript, app build and browser tests are separate gates.
const matches = [...hints.matchAll(/'GRA-A2-01-Q(10|[1-9])':\s*\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]/g)];
const ids = matches.map(match => Number(match[1])).sort((a, b) => a - b);
assert.deepEqual(ids, [1,2,3,4,5,6,7,8,9,10], 'exactly ten question-specific hint pairs');
assert(matches.every(match => match[2].length > 15 && match[3].length > 15), 'two meaningful hints each');

const forbidden = {
  1: ['volunteers'], 2: ['are reading'], 3: ['studies'],
  4: ['I am staying with my aunt this week'], 5: ['is raining'],
  6: ['she knows the answer'], 7: ['walks / is taking'],
  8: ['are you wearing'], 9: ["she doesn't play tennis on mondays"],
  10: ["don't work", 'do not work'],
};
for (const match of matches) {
  const prose = (match[2] + ' ' + match[3]).toLowerCase();
  for (const answer of forbidden[Number(match[1])]) {
    assert(!prose.includes(answer.toLowerCase()), `Hint leaks full correct answer to Q${match[1]}`);
  }
}

assert(ui.includes("editable&&lesson.id==='GRA-A2-01'&&['1.0.2','1.1.0'].includes(attempt?.version??'')"), 'only active supported 1.0.2/1.1.0 pilot');
assert(ui.includes('setHintSteps({});setTranscript'), 'reset on lesson change');
assert(ui.includes("setHintSteps({});try{const a=await api({action:'start'"), 'reset on new attempt');
assert(ui.includes('Hints guide your thinking; they do not check your answer or add a score.'), 'accurate unscored messaging');
assert(ui.includes('Learning goals') && ui.includes('Understand the rule') && ui.includes('Worked examples'), 'structured teaching sections');
assert(ui.includes('hasLabel?e.slice(divider+3):e'), 'unlabeled legacy examples supported');
assert(css.includes('@media(max-width:760px){.foundation-example-grid{grid-template-columns:1fr}'), 'responsive example cards');
assert(css.includes('.foundation-hint-content'), 'hint panel styles');

console.log('PASS: Foundation coaching source guards, ten two-level hints, no exact answer leakage, readable responsive teaching layout.');
