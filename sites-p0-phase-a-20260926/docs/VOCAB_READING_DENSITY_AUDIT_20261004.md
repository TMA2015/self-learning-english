# Vocabulary + Reading Evidence Density Audit

Status: ACTIVE PLANNING  
Date: 2026-10-04  
Baseline: Curriculum 1.9.0

## Grammar milestone

Grammar roadmap is complete for the current scope:

- A1: 12 lessons
- A2: 16 lessons
- B1: 12 lessons
- Total Grammar: 40 lessons

Do not continue expanding Grammar by count alone.

## Vocabulary baseline

A1:
- 4 lessons
- 32 activities
- meaning-in-context evidence: 31
- collocation evidence: 19

A2:
- 3 lessons
- 31 activities
- meaning-in-context evidence: 19
- collocation evidence: 20

B1:
- 1 lesson
- 5 activities
- meaning-in-context evidence: 2
- collocation evidence: 2
- word-formation evidence: 1

### Vocabulary finding

B1 Vocabulary is materially under-observed.

The most severe gap is word formation: only one activity in the whole curriculum currently carries `vocabulary.word_formation`.

Priority:
1. B1 word families / affixes in context;
2. B1 collocations in realistic study, planning and problem-solving contexts;
3. keep meaning-in-context evidence balanced;
4. reuse reviewed canonical tags instead of inventing new ones.

## Reading baseline

A1:
- 4 lessons
- 32 activities
- gist: 4
- detail: 27
- inference: 1

A2:
- 4 lessons
- 39 activities
- gist: 3
- detail: 25
- inference: 11
- author purpose: 2

B1:
- 1 lesson
- 5 activities
- gist: 1
- detail: 0
- inference: 2
- author purpose: 1
- vocabulary in context: 1

### Reading finding

B1 Reading is also materially under-observed.

The most urgent gap is exact-detail evidence: B1 currently has zero `reading.detail` activities.

Vocabulary-in-context is also too thin across Reading overall.

Priority:
1. add B1 passages with exact detail retrieval;
2. preserve gist and inference;
3. increase vocabulary-in-context;
4. include author purpose only where the passage genuinely supports it;
5. use original, age-appropriate texts.

## Wave 1 recommendation

Create one mixed review packet on top of Curriculum 1.9.0:

- VOC-B1-02 — Word families for study and communication
- VOC-B1-03 — Collocations for plans, problems and decisions
- REA-B1-02 — Informative text with detail + vocabulary-in-context
- REA-B1-03 — Viewpoint text with detail + inference + purpose

Target:
- 4 lessons
- about 40 deterministic activities
- no new runtime tags
- next candidate after PASS: Curriculum 1.10.0

## Success criteria

Wave 1 should materially improve B1 evidence density without changing historical lessons.

Required release shape after PASS:
- existing Curriculum 1.9.0 lessons unchanged;
- new lessons only;
- deterministic scoring;
- NotebookLM academic PASS;
- full import-preview and GitHub-first runtime QA.
