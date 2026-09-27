import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = name => JSON.parse(readFileSync(new URL('../content/packages/' + name, import.meta.url), 'utf8'));
const seed = read('ai_english_tutor_academic_seed_v1.json');
const previous = read('ai_english_tutor_academic_seed_v1_0_1_candidate.json');
const pilot = read('ai_english_tutor_academic_seed_v1_0_2_grammar_pilot.json');

// Mirror the existing importer's allowed-field/type check against seed 1.0.0.
const shapeErrors = [];
function shape(value, samples, path = 'source') {
  const matching = samples.filter(x => Array.isArray(value) ? Array.isArray(x) :
    value === null ? x === null : typeof x === typeof value && x !== null && !Array.isArray(x));
  if (!matching.length) { shapeErrors.push(path + ': unexpected type'); return; }
  if (Array.isArray(value)) {
    const items = matching.flat();
    for (const item of value) {
      if (items.length) shape(item, items, path + '[]');
      else if (typeof item !== 'string') shapeErrors.push(path + ': unexpected array item');
    }
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const candidates = matching.filter(x => Object.hasOwn(x, key)).map(x => x[key]);
      if (!candidates.length) shapeErrors.push(path + '.' + key + ': unknown field');
      else shape(child, candidates, path + '.' + key);
    }
  }
}
shape(pilot, [seed]);
assert.deepEqual(shapeErrors, [], 'Candidate has fields or types the current importer rejects');

assert.equal(pilot.schema_version, '1.0.2');
assert.equal(pilot.package_id, seed.package_id);
assert.equal(pilot.lessons.length, 13);
assert.deepEqual(pilot.course.sequence, seed.course.sequence);
assert.deepEqual(pilot.integrated_journey, seed.integrated_journey);
assert.deepEqual(pilot.rubrics, seed.rubrics);
assert.deepEqual(pilot.lessons.map(l => l.id), previous.lessons.map(l => l.id));

const oldGrammar = previous.lessons.find(l => l.id === 'GRA-A2-01');
const grammar = pilot.lessons.find(l => l.id === 'GRA-A2-01');
assert.equal(grammar.activities.length, 10);
assert.deepEqual(grammar.activities.slice(0, 6).map(q => q.id), oldGrammar.activities.map(q => q.id));
for (let i = 0; i < 6; i++) assert.deepEqual(grammar.activities[i].answer, oldGrammar.activities[i].answer);
assert.deepEqual(grammar.activities.slice(6).map(q => q.id),
  ['GRA-A2-01-Q7','GRA-A2-01-Q8','GRA-A2-01-Q9','GRA-A2-01-Q10']);

for (const lesson of previous.lessons.filter(l => l.id !== 'GRA-A2-01')) {
  assert.deepEqual(pilot.lessons.find(l => l.id === lesson.id), lesson,
    'An out-of-scope lesson was modified: ' + lesson.id);
}
const questions = pilot.lessons.flatMap(l => l.activities);
assert.equal(questions.length, 59);
assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
for (const lesson of pilot.lessons) {
  assert(lesson.activities.length > 0 && lesson.activities.length <= 10);
  for (const q of lesson.activities) {
    assert(q.id.startsWith(lesson.id + '-'));
    assert(q.skill_tags.length && q.skill_tags.every(t => t.startsWith(lesson.module + '.')));
    if (q.type === 'single_choice') {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
      assert(q.options.some(o => o.id === q.answer.correct_option_id));
    } else if (q.type === 'short_answer') {
      assert(q.answer.accepted_answers.length > 0);
      assert(q.answer.accepted_answers.every(v => v.trim().length > 0));
    } else {
      assert.equal(q.type, 'extended_response');
      assert.equal(q.answer, null);
      assert.equal(q.evidence_weight, 0);
      assert(pilot.rubrics[q.rubric_id]);
    }
    if (q.type !== 'extended_response') {
      assert.equal(q.evidence_weight, 1);
      assert(q.feedback.explanation_en?.trim());
    }
  }
}
const answer = id => pilot.lessons.flatMap(l => l.activities).find(q => q.id === id)?.answer.accepted_answers;
assert.deepEqual(answer('GRA-A2-01-Q5'), ['is raining']);
assert.deepEqual(answer('GRA-B1-01-Q3'), ['have never tried']);
assert.deepEqual(answer('GRA-B1-01-Q6'), ['has finished']);
assert.deepEqual(answer('GRA-A2-01-Q8'), ['are you wearing']);
assert.deepEqual(answer('GRA-A2-01-Q10'), ["don't work", 'do not work']);

console.log('PASS: schema compatibility, immutable versioning, 13 lessons, 59 activities, four new pilot questions, answers, existing lesson isolation.');
