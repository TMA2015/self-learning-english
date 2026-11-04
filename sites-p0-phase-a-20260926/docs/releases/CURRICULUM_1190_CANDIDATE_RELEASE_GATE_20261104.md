# SLE Curriculum v1.19.0 — Cumulative Candidate Review & Release Gate (2026-11-04)

**Status:** TECHNICAL QA PENDING / PRODUCTION NO-GO. This report is evidence and release-specific state, **not** a second active rulebook. The single governing standard is `SLE-MASTER-001 v1.1.0` on `main`.

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

## 4. Remaining mandatory gates

| Gate | Status at drafting | Evidence required |
|---|---|---|
| Two academic packets | **PASS** | Wave A and Wave B independent NotebookLM verdicts provided by owner |
| Source shape / version diff | **PASS (static source level)** | 121/1009, 109 old lessons untouched, no ID collisions |
| `validateSeed` and `validateContent(mapSeed)` actual runtime | **NOT_TESTED** | Execute `tests/curriculum-1190-release.cjs` on repo dependencies |
| Academic importer Preview and historical attempt invariants | **NOT_TESTED** | Real `academicService.preview`: add 12 / update 0 / skip 109 / conflict 0; import simulation pinned attempts |
| Browser-local storage quota / source version recovery | **NOT_TESTED** | Exercise real `BrowserLocalAcademicRepository` with 1.18.1 then 1.19.0, preserve prior attempts |
| MCQ deterministic shuffle / answer identity | **NOT_TESTED** | Execute actual `domain/option-order.ts` regression for new 90 objective activities |
| Existing PR `qa` exact head | **PENDING** | Automatic full release QA and static build |
| Production deployment and live smoke | **NO-GO** | Only after importer/CI/rights gates and explicit owner release approval, merge with `[release-english]` |
| Manual actual mobile/browser UX | **NOT_TESTED** | One compact post-release owner check only if low-risk backwards-compatible under SLE-MASTER-001 |

**Test fixture note:** `tests/curriculum-1190-release.cjs` has been authored and committed to the PR, but is **not automatically added to the existing `qa:full` test manifest**. Do **not** call candidate-specific technical QA PASS solely because the generic PR check succeeds. The test needs to be invoked and pass, or incorporated into the existing test runner through an authorized reviewable change.

This PR is the **candidate staging PR**, not a release marker PR. No Firebase deploy, learner import, Math changes, credentials, or stored attempt changes are authorized by this document.
