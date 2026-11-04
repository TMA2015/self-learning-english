# SLE Curriculum v1.19.0 — Cumulative Candidate Review & Release Gate (2026-11-04)

**Status:** ACADEMIC PASS / CANDIDATE-SPECIFIC CI PASS (exact PR #83 head `6cba419bb6fa07293eccdf1c52ca93daaeb36a4d`) / PRODUCTION NOT DEPLOYED / ADMIN CONTENT IMPORT NOT PERFORMED. This report is evidence and release-specific state, **not** a second active rulebook. The single governing standard is `SLE-MASTER-001 v1.1.0` on `main`.

## 1. Source-of-truth and verdicts

- Base immutable curriculum: `sites-p0-phase-a-20260926/content/curriculum-1.18.1-candidate.json`, Git blob `7c4a9f1186fd11c47b8e1ee2951e5aad908102a3`, 109 lessons / 913 activities, 7 domains.
- Writing Wave A review: `content/v119-writing-wavea-20261103:sites-p0-phase-a-20260926/content/review-packets/SLE_V119_WRITING_WAVE_A_NOTEBOOKLM_REVIEW_20261103.md`. Owner-supplied NotebookLM **PASS**, 6 Writing lessons, 48 activities (42 objective, 6 original `extended_response`); no required corrections.
- Vocabulary + Reading Wave B review: `content/v119-writing-wavea-20261103:sites-p0-phase-a-20260926/content/review-packets/SLE_V119_VOC_REA_WAVE_B_NOTEBOOKLM_REVIEW_20261104.md`. Owner-supplied NotebookLM **PASS**, 6 lessons/48 objective activities (42 `single_choice`, 6 `short_answer`), no mandatory fixes. The original packet metadata remains `ACADEMIC_REVIEW_PENDING` because it was prepared before the independent verdict. The latest user-provided verdict supersedes that **review status only**, not source text/keys.
- Exact Wave B authoring sources: `content/v119-writing-wavea-20261103:sites-p0-phase-a-20260926/content/batches/v119-waveb-vocabulary-draft.json` and `v119-waveb-reading-draft.json`.
- This PR contains the cumulative machine-readable **candidate only** at `content/curriculum-1.19.0-candidate.json`. It does not perform an import or deploy.

## 2. Source transformation and scope

| Group | IDs | Count | New activities | Independent verdict |
|---|---|---:|---:|---|
| Writing A2 | WRI-A2-05, WRI-A2-06 | 2 | 16 | PASS |
| Writing B1 | WRI-B1-04 through WRI-B1-07 | 4 | 32 | PASS |
| Vocabulary A2/B1/B2 | VOC-A2-06, VOC-B1-06, VOC-B2-01 | 3 | 24 | PASS |
| Reading A2/B1/B2 | REA-A2-07, REA-B1-06, REA-B2-01 | 3 | 24 | PASS |

**Expected candidate:** 121 lessons and 1009 activities. The six Writing extended responses retain `review_mode: assisted_ai_or_human`, `answer: null`, `evidence_weight: 0`, existing `RUBRIC-WRITING-A2/B1` and pending feedback. Word ranges are guidance, not quality grades. The other 90 new activities carry deterministic objective evidence only and no CEFR certification.

**Stable conversion:** Wave A Markdown lesson objectives, independent teaching explanations and worked models, 42 MCQ answer letters, rationales and Next steps, and six original tasks are transformed into the existing importer schema. Wave B draft JSON `stem`, 0-based answer index, original four options, `tag`, rationales and `next` are mapped to source `prompt`, stable option IDs `A/B/C/D`, `skill_tags` and position-neutral explanations. Six short answers use existing accepted-answer normalization.

**No unsupported fields:** advisory lesson `prerequisites` remain in academic documentation; not added as a new JSON import field. The package retains only known existing importer fields. Candidate source review and the actual runtime importer must be treated separately.

## 3. Structural evidence already verified before PR QA

- All existing **109 lesson objects and 913 activity objects** are identical to the 1.18.1 source when compared as parsed JSON; original course sequence first 109 entries unchanged.
- Exactly 12 new lesson IDs, 96 new activities with unique IDs; no collisions with previous lessons or questions.
- 90 scored objectives; six unassessed Writing prompts; Reading passages are learner-visible, original and self-contained as reviewed.
- Candidate follows the original bounded `academic-seed-v1.json` nested field shape; no unknown lesson/answer/feedback fields were introduced. File length approximately 1.2 MB, below the historical 5 MB interface guard.
- Optional issue #75 `REA-A1-01-Q7` re-tagging **deferred** in this release to preserve all 913 historical activity objects exactly. This is a non-blocking optional change from the Wave B verdict; historical saved attempt records remain out of scope.

## 4. QA evidence and remaining release gates

Verified on exact Draft PR #83 head `6cba419bb6fa07293eccdf1c52ca93daaeb36a4d`: [GitHub Actions QA job](https://github.com/TMA2015/self-learning-english/actions/runs/41801452201/job/126477939647). The test log **does invoke** `tests/curriculum-1190-release.cjs` and emits:

```json
{"result":"PASS","gate":"v1.19.0-cumulative-release-preflight","lessons":121,"activities":1009,"oldObjectsPreserved":109,"preview":{"add":12,"update":0,"skip":109,"conflict":0},"newObjectiveItems":90,"unassessedWriting":6,"shuffledItems":84,"historyUnchanged":true,"browserQuotaBytes":2866330,"browserQuotaLimit":5242880,"productionWrites":0,"actualBrowserGUI":"NOT_TESTED"}
```

| Gate | Recorded disposition | Reason |
|---|---|---|
| Writing Wave A and Vocabulary/Reading Wave B | **PASS (academic)** | Two owner-supplied independent NotebookLM verdicts, zero mandatory fixes |
| 109 old lessons / 913 activities preserved | **PASS** | Exact JSON source comparison, immutable old attempts and 121/1009 candidate |
| Actual importer/schema validation | **PASS (CI simulation)** | `validateSeed`, `validateContent(mapSeed)` and academic import preview |
| Versioned attempt recovery | **PASS (CI simulation)** | History remains linked to earlier content version |
| Real option order and answer keys | **PASS (CI)** | 84 shuffled single-choice items exercised, identity preserved |
| Browser-local quota simulation | **PASS (CI)** | 2,866,330 / 5,242,880 bytes; **not** a promise all real devices have available quota |
| Exact-head PR `qa` | **PASS** | Check run completed successfully on above SHA |
| Owner release decision for PR #83 | **PENDING** | No approval or `[release-english]` merge of the specific PR has occurred |
| Firebase English LIVE action | **NOT_STARTED** | No deployment of this candidate |
| Admin content import of v1.19.0 into **actual learner store** | **NOT_STARTED** | Important: a GitHub code/docs merge or Firebase deploy **does not** itself import this file |
| Post-deploy source/catalog verification | **NOT_TESTED** | Confirm imported version 1.19.0, 121 lessons, 12 new IDs visible in the right actual account/browser |
| Real device/browser usability spot-check | **NOT_TESTED** | May follow low-risk authorized release under SLE-MASTER-001; not implied by CLI tests |

## 5. Exact production handoff: deployment and content import are distinct

The existing SLE app uses `ContentImporter` inside **Parent View**. It accepts a local .json file, validates a **Preview import** result, then requires an explicit confirmation before it writes the versioned content package. It does not watch the repository and it does not fetch a newly merged candidate automatically.

Consequently, a release of the website code with `[release-english]` alone may leave the learner's existing catalog at **1.18.1 / 109 lessons**. Do **not** report v1.19.0 content as LIVE until BOTH its production delivery and the relevant store's content-import result are confirmed.

**Conditional owner-authorized release steps under SLE-MASTER-001 (NOT yet executed):**
1. Recheck exact-current PR head and full `qa`. Obtain explicit owner authorization for **this** release PR and any live content import. Use the existing protected-main and `[release-english]` process only.
2. Confirm the correct raw `content/curriculum-1.19.0-candidate.json` is downloadable and matches the approved candidate; it contains instructional content only, not learner records.
3. Perform approved site release, then use authenticated Parent View's **Curriculum content importer** on the intended browser/account: select JSON, Preview, verify `Add 12 / Update 0 / Skip 109 / Conflict 0` and version `1.19.0`, then explicitly confirm import. If a different legitimate prior version is installed, **STOP** to reconcile its preview, never guess or override.
4. Verify the actual learner catalog reports version 1.19.0, **121 lessons** including the 12 new IDs; check one Writing and one Reading/Vocabulary task, real draft restore, pending Writing review and a brief narrow-screen view. Do not assume that a successful import in one browser automatically updates any other browser's local package store.
5. Record separately: `CI PASS`, `DEPLOYED`, `IMPORTED`, `LIVE CATALOG VERIFIED`. Retain rollback path. Do not claim actual Gemini review, spoken proficiency or device checks until independently observed.

**Scope protection:** no Math Firebase target, billing, secrets, historical attempt regrading, bulk account data import or automatic syllabus rewrite. A failed preview or unexpected storage state means **NO-GO**, not a forced import.

**Document control:** This file records current evidence and a handoff for the already governed release process; it is not a second SLE release policy. The authoritative source remains `SLE-MASTER-001` on `main`.
