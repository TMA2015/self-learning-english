# Curriculum 1.13.0 — Listening + Speaking + Pronunciation Density Wave 4

Status: **ACADEMIC PASS / CANDIDATE COMPOSED / EXECUTABLE TECHNICAL GATE PENDING**

Date: 2026-10-05

## Scope

Base: Curriculum 1.12.0  
Candidate: Curriculum 1.13.0

New lessons:
- LIS-A1-02 — A classroom change for Thursday
- LIS-B1-03 — Planning a study-group session
- SPE-A2-02 — Explain a simple problem and ask for help
- SPE-B1-02 — Compare two options and answer a follow-up
- PRO-A2-02 — Hear stress in common two-syllable words
- PRO-B1-01 — Use sentence stress to show the important idea

New content: **6 lessons / 40 activities**

Cumulative candidate:
- **90 lessons**
- **779 activities**
- **40 Grammar lessons**
- **12 Vocabulary lessons**
- **13 Reading lessons**
- **11 Writing lessons**
- **7 Listening lessons**
- **4 Speaking lessons**
- **3 Pronunciation lessons**

## Independent academic review

Wave 4A:
- Packet: `EN-LIS-SPE-DENSITY-W4A-20261005`
- Scope: 4 lessons / 29 activities
- Verdict: **PASS**
- Required corrections: **0**
- New runtime tags: **0**

Wave 4B:
- Packet: `EN-PRO-DENSITY-W4B-20261005`
- Scope: 2 lessons / 11 activities
- Verdict: **PASS**
- Required corrections: **0**
- New runtime tags: **0**

Both packets were independently reviewed against the five permanent Self-Learning English v2 baseline sources.

## Composition provenance

Cumulative reviewed batch:
`content/batches/listening-speaking-pronunciation-density-wave4.json`

Its six lesson objects must remain exactly equal to the union of:
- `content/batches/listening-speaking-density-wave4a.json`
- `content/batches/pronunciation-density-wave4b.json`

Candidate:
`content/curriculum-1.13.0-candidate.json`

Candidate composition checkpoint:
`0d962393f6d8a75532b345c055f9d61a195d7c7f`

Source-level composition confirmed:
- all 84 Curriculum 1.12.0 lesson objects are unchanged;
- exactly 6 independently reviewed lesson objects are added;
- every new lesson is placed once in course sequence;
- no duplicate lesson/activity IDs;
- cumulative lesson/activity counts equal 90 / 779;
- domain counts match the release totals above.

Raw and canonical SHA-256 values will be pinned only after the executable release-candidate gate runs successfully.

## Audio and production safeguards

Listening:
- `requires_real_playback = true`
- `transcript_reveal = after_submission`
- transcript-only completion does not earn Listening evidence.

Speaking:
- recording permission remains required;
- text planning notes are fallback only;
- text-only fallback does not count as Speaking evidence;
- no automatic pronunciation score is assigned.

Pronunciation:
- real audio-model playback is required before audio-based evidence;
- production tasks remain review-required.

All new Speaking/Pronunciation extended responses keep:
- `answer = null`
- `review_mode = assisted_ai_or_human`
- `evidence_weight = 0`

## Expected import preview

Because the candidate preserves all historical 1.12.0 lesson objects and adds six new stable IDs, expected dry-run preview is:

- Add: **6**
- Update: **0**
- Skip: **84**
- Conflict: **0**

Encoded in:
`tests/curriculum-1130-listening-speaking-pronunciation-density-wave4.cjs`

The executable gate checks:
- reproducible composition;
- actual `validateSeed`;
- portable `validateContent(mapSeed(...))`;
- historical-object preservation;
- split-review / combined-batch parity;
- audio and recording safeguards;
- actual importer preview;
- raw and canonical SHA-256.

## Technical gate status

The candidate and technical gate are committed, but the full Node/TypeScript/import-preview gate has not completed in GitHub Actions.

Recent GitHub-hosted Actions jobs for this private repository are still failing before a runner starts (`runner_id = 0`, no test step executed). This document does **not** claim a technical PASS from an unexecuted workflow.

Do not weaken release gates to work around that infrastructure limitation.

## Release boundary

Not authorized yet:
- production curriculum import;
- merge of the Wave 4 release PR;
- Firebase Hosting production deployment;
- D1/Firestore migration.

Next milestone:
1. execute the 1.13.0 release-candidate gate when a GitHub runner is available;
2. pin raw/canonical SHA-256 values;
3. verify import preview is exactly 6 add / 0 update / 84 skip / 0 conflict;
4. request owner authorization before controlled import/release.
