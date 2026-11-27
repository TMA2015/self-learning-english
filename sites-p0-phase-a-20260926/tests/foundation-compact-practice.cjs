'use strict';
// Source-level safety regression for a presentation-only compact Foundation player.
// Browser/physical iPad QA must be completed separately before release.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app/foundation.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app/foundation-practice-compact.css'), 'utf8');
const previous = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');

assert.ok(source.includes("import './foundation-practice-compact.css';"), 'compact CSS loaded by Foundation player');
assert.equal((source.match(/className="foundation-option-grid"/g) || []).length, 1, 'one shared MCQ option grid');
assert.ok(source.includes("orderedOptions(q,attempt)?.map(o=><label className=\"foundation-option\" key={o.id}>"),
  'ordered option list and stable option keys retained');
assert.ok(source.includes("name={q.id} value={o.id} checked={answers[q.id]===o.id}"),
  'radio choice is still bound to the original answer field');
assert.ok(source.includes("onChange={()=>{setSubmitError('');markDraftChanged();setAnswers(s=>({...s,[q.id]:o.id}))}}"),
  'choice interaction still updates the draft and retains autosave');
assert.ok(source.includes("textarea rows={q.type==='short_answer'?2:7}"),
  'two-row short and seven-row extended response semantics remain');
assert.ok(source.includes("const result=attempt.results?.find(r=>r.id===q.id)"),
  'result-to-question association is unchanged');
assert.ok(source.includes("className={'foundation-question'+(lesson.module==='listening'"),
  'unanswered Listening warning state remains present');
assert.ok(source.includes("listeningSubmitHint(listeningProgress)"),
  'Listening completeness feedback remains present');
assert.ok(!source.includes('<details className="foundation-attempt-details">'),
  'learner practice does not expose technical attempt metadata');
assert.ok(css.includes('grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr))'),
  'responsive grid with safe one-column fallback');
assert.ok(css.includes('min-height: 44px'), 'touch targets remain at least 44px');
assert.ok(css.includes('.foundation-focus .foundation-question.is-unanswered'),
  'compact card does not visually suppress unanswered Listening warnings');
assert.ok(css.includes('.foundation-focus .foundation-option-grid .foundation-option:focus-within'),
  'keyboard focus is visible');
assert.ok(css.includes('textarea[rows="2"]') && css.includes('textarea[rows="7"]'),
  'only short response is compact; long-form editor remains');
assert.ok(!css.includes('.sle-turn-'), 'post-submit Dictation styles are not overridden');
assert.ok(!css.includes('display: none') && !css.includes('visibility: hidden'),
  'no existing text, feedback or warnings hidden to make cards smaller');
assert.ok(previous.includes('.foundation-question'), 'existing global practice styling retained underneath the override');
console.log('PASS: compact Foundation layout, original answer semantics, Listening and draft safety retained.');

assert.ok(source.includes('<AdaptivePracticeGrid className="foundation-option-grid">'),'shared adaptive MCQ is wired in the actual player');
assert.ok(source.includes('shortPracticeMode(q.prompt,answers[q.id]??\'\')'),'gap choice uses visible prompt and existing draft only');
assert.ok(source.includes('setAnswers(s=>({...s,[q.id]:value}))'),'inline and compact inputs update the same original draft answer key');
assert.ok(source.includes("shortMode&&shortMode.kind!=='textarea'"),'complex and multiline formats keep original textarea');
assert.ok(css.includes('repeat(var(--practice-columns, 1), minmax(0, 1fr))'),'adaptive grid override');
assert.ok(css.includes('width: 100px') && css.includes('height: 44px') && css.includes('width: min(100%, 180px)'),'approved gap dimensions');
