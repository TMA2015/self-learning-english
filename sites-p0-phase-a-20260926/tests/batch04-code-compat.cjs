'use strict';
// Batch04 additive application-code compatibility. No import, D1 access, or Site deployment.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','application/academic-service.ts','--outDir','.sites-runtime/batch04-academic-tests','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,'.sites-runtime/batch04-academic-tests/package.json'),'{"type":"commonjs"}\n');
const {tagMap,validateSeed,mapSeed}=require('../.sites-runtime/batch04-academic-tests/domain/academic.js');
const seed=require('../content/academic-seed-v1.json');
// Frozen pre-Batch04 mappings: prevent remapping, renaming or deleting historical skill evidence.
const previous={
  "grammar.be_forms": "be-forms",
  "grammar.pronouns": "pronouns",
  "grammar.possessives": "possessives",
  "grammar.articles": "articles",
  "grammar.plural_nouns": "plural-nouns",
  "grammar.there_is_are": "there-is-are",
  "grammar.prepositions_place": "place-prepositions",
  "grammar.modals_can": "modals-can",
  "grammar.countability": "countability",
  "grammar.quantifiers": "quantifiers",
  "grammar.comparison": "comparison",
  "grammar.present_simple": "tense-and-aspect",
  "grammar.present_continuous": "tense-and-aspect",
  "grammar.subject_verb_agreement": "subject-verb-agreement",
  "grammar.stative_verbs": "tense-and-aspect",
  "grammar.past_simple": "tense-and-aspect",
  "grammar.present_perfect": "tense-and-aspect",
  "vocabulary.collocations": "collocation",
  "vocabulary.meaning_in_context": "meaning-in-context",
  "vocabulary.word_formation": "word-formation",
  "reading.gist": "gist",
  "reading.detail": "detail",
  "reading.inference": "inference",
  "reading.author_purpose": "inference",
  "reading.vocabulary_in_context": "vocabulary-in-context",
  "listening.gist": "gist",
  "listening.detail": "detail",
  "listening.inference": "speaker-intention",
  "listening.speaker_intention": "speaker-intention",
  "writing.task_understanding": "task-understanding",
  "writing.register": "vocabulary",
  "writing.organization": "organization",
  "writing.grammar": "grammar-accuracy",
  "writing.vocabulary": "vocabulary",
  "writing.idea_development": "idea-development",
  "writing.cohesion": "organization",
  "speaking.organization": "task-response",
  "speaking.task_response": "task-response",
  "speaking.fluency": "fluency",
  "speaking.intelligibility": "pronunciation-intelligibility",
  "speaking.idea_development": "task-response",
  "speaking.vocabulary": "vocabulary",
  "pronunciation.sound_awareness": "sound-awareness",
  "pronunciation.intelligibility": "intelligibility"
};
const additions={
  "grammar.question_formation": "question-formation",
  "grammar.future_plans": "future-plans",
  "grammar.modals_obligation": "modals-obligation"
};
for(const [tag,slug] of Object.entries(previous))assert.equal(tagMap[tag],slug,'historical tag mapping changed: '+tag);
assert.equal(Object.keys(tagMap).length,Object.keys(previous).length+Object.keys(additions).length,'unreviewed tag addition/removal');
assert.deepEqual(validateSeed(seed),[],'baseline importer must remain valid');
for(const [tag,slug] of Object.entries(additions)){
 assert.equal(tagMap[tag],slug,'new exact mapping missing: '+tag);
 const candidate=structuredClone(seed),original=candidate.lessons.find(l=>l.module==='grammar');
 original.activities[0].skill_tags=[tag];
 assert.deepEqual(validateSeed(candidate),[],'importer rejected valid Batch04 tag '+tag);
 const mapped=mapSeed(candidate).exercises.find(e=>e.id===original.activities[0].id);
 assert.deepEqual(mapped.subskillTags,[slug],'content map changed subskill '+tag);
}
const unknown=structuredClone(seed);unknown.lessons.find(l=>l.module==='grammar').activities[0].skill_tags=['grammar.unknown_batch04'];
assert.ok(validateSeed(unknown).some(x=>x.includes('invalid prompt/tags')),'unknown tag must be rejected');
console.log('PASS: historical tag map unchanged; three Batch04 tags accepted/mapped; unknown tag rejected; no learner-state writes.');
