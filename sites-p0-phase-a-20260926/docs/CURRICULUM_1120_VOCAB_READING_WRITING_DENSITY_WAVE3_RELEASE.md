# Curriculum 1.12.0 — Vocabulary + Reading + Writing Density Wave 3

Status: **ACADEMIC PASS / CANDIDATE COMPOSED / EXECUTABLE TECHNICAL GATE PENDING**

Date: 2026-10-05

## Scope

Base: Curriculum 1.11.0  
Candidate: Curriculum 1.12.0

New lessons:
- VOC-A2-04 — Feelings, reactions and useful adjective pairs
- VOC-B1-04 — Verbs for explaining evidence and change
- REA-A2-05 — Two club updates: compare practical details
- REA-B1-04 — Why some study breaks work better
- WRI-A2-04 — Reply to a message and solve a small problem
- WRI-B1-03 — Compare two options and recommend one

New content: **6 lessons / 50 activities**

Cumulative candidate:
- **84 lessons**
- **739 activities**
- **40 Grammar lessons**
- **12 Vocabulary lessons**
- **13 Reading lessons**
- **11 Writing lessons**
- **5 Listening lessons**
- **2 Speaking lessons**
- **1 Pronunciation lesson**

## Independent academic review

Wave 3A:
- Packet: `EN-VOC-REA-DENSITY-W3A-20261005`
- Scope: 3 lessons / 24 activities
- Verdict: **PASS**
- Required corrections: **0**
- New runtime tags: **0**

Wave 3B:
- Packet: `EN-REA-WRI-DENSITY-W3B-20261005`
- Scope: 3 lessons / 26 activities
- Verdict: **PASS**
- Required corrections: **0**
- New runtime tags: **0**

Both packets were independently reviewed against the five permanent Self-Learning English v2 baseline sources.

## Composition provenance

The cumulative reviewed batch is:
`content/batches/vocab-reading-writing-density-wave3.json`

Its six lesson objects were checked to be exactly equal to the union of the two independently reviewed split batches:
- `content/batches/vocab-reading-density-wave3a.json`
- `content/batches/reading-writing-density-wave3b.json`

Candidate:
`content/curriculum-1.12.0-candidate.json`

Candidate composition checkpoint:
`bfde46c0c187720cb3d06d57d6514efddda85e53`

Candidate Git blob:
`ce24d5787ab02036404b5aae2c3da6673d9efdc7`

Source-level composition checks confirmed:
- all 78 Curriculum 1.11.0 lesson objects are unchanged;
- exactly 6 new reviewed lesson objects are appended to the cumulative lesson set;
- every new lesson is placed once in course sequence;
- no duplicate lesson ID or activity ID;
- sequence length equals lesson count;
- module totals equal the release counts above;
- cumulative size remains well below the bounded 5 MB importer ceiling.

Raw and canonical SHA-256 values will be pinned after the executable technical gate runs successfully.

## Writing safeguards

The two new extended responses remain review-required:
- `WRI-A2-04-Q7`
- `WRI-B1-03-Q9`

For both:
- `answer = null`
- `review_mode = assisted_ai_or_human`
- `evidence_weight = 0`

Objective scaffolding may be scored deterministically. Extended writing does not change automated proficiency evidence until qualified AI or human review.

## Expected import preview

Because the candidate preserves all historical lesson objects and adds six new stable IDs, the expected 1.11.0 → 1.12.0 dry run is:

- Add: **6**
- Update: **0**
- Skip: **78**
- Conflict: **0**

This expectation is encoded in:
`tests/curriculum-1120-vocab-reading-writing-density-wave3.cjs`

The executable test also runs:
- reproducible composition check;
- actual `validateSeed`;
- portable `validateContent(mapSeed(...))`;
- exact historical-object preservation;
- split-review / combined-batch parity;
- extended-writing safeguards;
- actual importer preview;
- raw and canonical SHA-256 calculation.

## Technical gate status

The candidate and regression gate are committed, but the full Node/TypeScript/import-preview gate has not yet completed in GitHub Actions.

Recent GitHub-hosted Actions jobs for the project have been failing before a runner starts (`runner_id = 0`, no executed steps), so this document does **not** claim a technical PASS from an unexecuted workflow.

Do not weaken tests to bypass that infrastructure condition.

## Release boundary

Not authorized yet:
- production curriculum import;
- merge of the Wave 3 release PR;
- Firebase Hosting production deployment;
- Sites/D1 import or migration.

Next technical milestone:
1. run the 1.12.0 executable release-candidate gate when a GitHub runner is available;
2. pin raw/canonical SHA-256 values;
3. verify dry-run preview is exactly 6 add / 0 update / 78 skip / 0 conflict;
4. then request owner authorization for controlled import/release.
