# P2B Adaptive Learning / Suggested Practice v2 — Core design

Status: architecture plan only. No production code, schema migration, curriculum import or learner-data mutation.

Production reference:
- Sites v29
- Curriculum 1.5.0
- 45 lessons / 359 activities
- Grammar: 15 current lessons / approximately 158 activities
- P2A already provides saved objective accuracy, skill/tag tallies, distinct-question counts, repeated mistakes and up to three basic suggestions.

## Purpose

P2B should turn saved evidence into a small, explainable self-study loop:

**saved answers -> weak concept -> appropriate current lesson -> targeted practice -> new evidence -> refreshed recommendation**

P2B is not a CEFR placement engine and must not invent proficiency claims.

## What P2B Core should do first

### 1. Keep evidence version-safe

Use saved submitted objective results only.

Identity remains:
`package_id + content_version + question_id`

Never:
- regrade an old answer with a new answer key;
- treat a historical question as the current question merely because the ID is similar;
- overwrite attempts;
- include started drafts or unassessed responses in accuracy.

Adult-reviewed open responses can remain separately visible but are not required for Grammar P2B Core.

### 2. Use canonical concepts, not only broad skill names

A recommendation should be about a concept such as:
- question formation
- present simple
- present continuous
- countability
- quantifiers
- past simple
- present perfect
- comparison

not merely:
- Grammar

Current activity source tags continue to map through the stable tag map. Planned Grammar lessons add concept metadata in `content/grammar-roadmap-v1.json`.

### 3. Use conservative evidence states

Suggested initial deterministic states:

- **Not enough evidence**
  - fewer than 2 distinct questions OR fewer than 3 submitted observations.
- **Needs practice**
  - enough evidence and accuracy below 70%.
- **Developing**
  - 70–84% with enough evidence.
- **Stable for now**
  - at least 85%, at least 5 distinct questions and evidence from at least 2 attempts.

Do not call any of these states “mastered” or use them as CEFR certification.

### 4. Rank weak concepts without overreacting

Internal ranking may consider:
- lower accuracy first;
- number of distinct questions;
- repeated mistakes on the same immutable question;
- number of separate attempts.

P2B Core should remain deterministic and auditable.

Do not add runtime AI scoring or opaque recommendation generation.

### 5. Check prerequisites before recommending a lesson

For a weak concept:
1. locate its current remediation lesson;
2. inspect declared prerequisite lessons/concepts;
3. if a prerequisite also has clear weak evidence, recommend the prerequisite first;
4. otherwise recommend the direct lesson.

Example:
- weak evidence in present-simple-vs-present-continuous;
- present continuous foundation is weak/unobserved;
- after GRA-A2-07 exists, P2B may recommend GRA-A2-07 before GRA-A2-01.

Unobserved prerequisite evidence should not automatically block learning. It may be shown as “foundation check recommended” rather than treated as failure.

### 6. Always route to current content

A Suggested Practice action must open/create practice on the CURRENT curriculum package.

Historical results remain readable on their original versions.

Do not route a learner back into an old-version draft merely because it is the latest historical evidence source.

### 7. Explain every suggestion

A learner-facing recommendation should contain:
- concept name;
- short reason based on saved evidence;
- lesson title;
- one clear action.

Example:

> Practice question formation next. You answered 4 of 8 saved questions correctly across 5 different questions, with one repeated mistake. Review “Question words and basic question order”.

Avoid exposing an internal weakness score.

### 8. Limit recommendation volume

Show at most 3 priority suggestions.

Prefer:
1. prerequisite/foundation gaps;
2. repeated mistakes;
3. weak concepts with broader distinct evidence.

Do not flood the learner with every low-performing tag.

## P2B Core UI scope

First release:
- upgrade Suggested Practice cards;
- show reason + evidence summary;
- direct button to open current lesson;
- clearly distinguish “not enough evidence” from poor performance;
- no automatic course switching;
- no forced unlocks;
- no generated exercises.

Later, after Grammar expansion:
- optional targeted practice sets of 4–6 activities selected from reviewed content;
- spaced review / cooldown logic;
- “improving” trend;
- more precise remediation paths.

## Metadata strategy

Do NOT expand the curriculum importer schema yet.

Use sidecar planning/runtime metadata, versioned separately:
- `content/grammar-roadmap-v1.json`
- later: `content/adaptive-map-v1.json`

This keeps immutable curriculum packages portable and avoids migrations while the adaptive model is still evolving.

A future adaptive map should contain, per concept:
- canonical concept ID;
- source tags;
- primary remediation lesson;
- optional alternate lessons;
- prerequisites;
- minimum evidence rule;
- active/current status.

## Parallel Grammar strategy

P2B and Grammar expansion proceed together.

Current Grammar:
- 15 lessons
- A1: 8
- A2: 6
- B1: 1

Working roadmap target:
- 40 lessons
- A1: 12
- A2: 16
- B1: 12

The number 40 is a planning target, not a content quota or claim of complete CEFR coverage.

### First authoring wave after P2B metadata is ready

Six planned lessons:
- GRA-A1-09 — This, that, these and those
- GRA-A1-10 — Object pronouns and possessive pronouns
- GRA-A1-11 — Imperatives and everyday instructions
- GRA-A1-12 — Prepositions of time: at, on and in
- GRA-A2-07 — Present continuous: form and use
- GRA-A2-09 — Present perfect: experiences with ever and never

Highest structural priorities are GRA-A2-07 and GRA-A2-09 because existing GRA-A2-01 and GRA-B1-01 currently rely on knowledge that deserves explicit foundational teaching.

Each new Grammar batch must:
1. use stable IDs;
2. declare concepts and prerequisites;
3. contain guided -> independent -> transfer practice;
4. include clear answer instructions;
5. pass structural/key/rationale checks;
6. receive independent academic review via the established NotebookLM workflow;
7. enter production only through Preview -> owner approval -> immutable version import.

## Recommended implementation sequence

### P2B-0 — metadata foundation
- Freeze Grammar roadmap v1.
- Add adaptive concept mapping for the CURRENT 15 Grammar lessons.
- No UI change yet.

### P2B-1 — recommendation engine
- Refactor P2A suggestion logic into deterministic concept/prerequisite ranking.
- Keep all routes read-only.
- Add unit tests for version safety, insufficient evidence, repeated errors and prerequisites.

### P2B-2 — learner UI
- Replace basic Suggested Practice with explainable cards and a direct current-content action.
- Owner QA on desktop/mobile.

### Grammar Wave 1
- Author/review/import the six foundation-gap lessons above.
- Update adaptive metadata.
- Verify P2B begins using them without redesign.

### Next
- Continue Grammar waves in small batches toward the 40-lesson roadmap.
- Delay large Batch06 expansion in other domains until P2B + Grammar Wave 1 establish the reusable pattern.

## Release boundary

This document does not authorize:
- production code deployment;
- curriculum import;
- D1 migration;
- learner-state rewrite;
- automatic AI grading;
- a CEFR mastery claim.
