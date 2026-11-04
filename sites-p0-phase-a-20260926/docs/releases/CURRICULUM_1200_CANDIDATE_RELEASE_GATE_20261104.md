# Self-Learning English — Curriculum v1.20.0 Release Gate

**Status:** ACADEMIC PASS / TECHNICAL FULL QA PENDING AT THIS DOCUMENT'S CREATION / PRODUCTION NO-GO. This is a dated release record, not another standard. **SLE-MASTER-001 v1.1.0** on `main` remains the only normative policy.

## Source and decision

- **Source of truth for earlier cumulative content:** `content/curriculum-1.19.0-candidate.json` (PR #83), 121 lessons / 1,009 activities, earlier independent NotebookLM Wave A/B verdicts both PASS. The v1.19.0 candidate is *not proven LIVE*. Its first 109 lesson objects and 913 prior activities remain exactly as in 1.18.1.
- **New academic review:** Owner-supplied NotebookLM packet verdict `PASS`, academic adoption `GO` for `REA-C1-01` and `VOC-C2-01`, zero required fixes; independent critique R1–R12. These are genuine advanced reading/pragmatic vocabulary *practice*, not a certified proficiency assessment.
- **Original authoring source:** `content/batches/v120-c1c2-first-pilot-draft.json` and complete temporary NotebookLM packet `content/review-packets/SLE_C1C2_FIRST_PILOT_NOTEBOOKLM_REVIEW_20261104.md`. The original pre-verdict status field in those audit sources remains `ACADEMIC_REVIEW_PENDING` as a historical source snapshot; this dated release gate records the owner's later PASS. The authored lesson prose, 16 keys, options and correct evidence tags were not revised after the supplied PASS.
- **New cumulative candidate:** `content/curriculum-1.20.0-candidate.json` on PR #83, 123 lessons / 1,025 activities, target only. Exactly 2 new IDs and 16 new deterministic objective items; all 121 prior lesson objects, answer keys, activity IDs, rubrics and historical stored attempts remain untouched.
- **Additional importer support:** existing `domain/academic.ts` C1/C2 target allowlist and ID regex extended, no new runtime JSON schema. CEFR domain type already included C1 and C2. MAX_CURRICULUM_LESSONS 150 >= 123.
- **Availability:** no Unit locks, no new C1/C2 certificate or automatic diagnostic claim; C1/C2 are optional advanced challenges after released and actually imported.

## Required technical and deployment gates

1. Run exact-head PR #83 `qa:release`. The C1/C2 tests `c1c2-importer-compat.cjs`, `c1c2-draft-source.cjs` and `c1c2-authored-content-schema.cjs` were already verified in earlier Draft PR #86 (78 tests PASS). For the cumulative package, **`tests/curriculum-1200-release.cjs` must pass on PR #83 latest head**. Do not reuse a 1.19 or PR #86 CI result as proof of the v1.20 cumulative importer.
2. Confirm `validateSeed`, `validateContent(mapSeed)` and `academicService.preview` of the real 1.20 package; expected 1.19→1.20 `Add 2 / Update 0 / Skip 121 / Conflict 0`. Verify 1.18→1.19→1.20 historical attempt preservation, versioned resume and actual browser-local quota on the simulated 5 MiB storage limit. If quota or expected diff fails, **NO-GO** and resolve without deleting historical data.
3. Check on a browser the new C1/C2 lesson cards, passage display, all eight questions, option shuffling, feedback and narrow-screen text. CI alone is not visual usability evidence.
4. Obtain explicit owner authorization for the **specific reviewed PR #83 candidate v1.20.0**. Only then follow protected-main squash merge with `[release-english]` trigger and verify actual English Firebase deploy. Do not deploy Math or change secrets/billing.
5. **Content import is separate from code deployment:** In actual Parent View, select the complete v1.20.0 JSON, Preview with the actual learner store, confirm the expected Add/Update/Skip counts, then explicitly authorize import. Local browser storage is per-device; no cross-browser automatic sync can be presumed.
6. Verify the learner's actual catalog contains **123 lessons**, including `REA-C1-01` and `VOC-C2-01`. Record independent flags `ACADEMIC PASS`, `CI PASS`, `WEBSITE DEPLOYED`, `CONTENT IMPORTED`, `LIVE CATALOG VERIFIED` with source IDs and timestamps.
7. **Release ordering:** v1.19.0 is a candidate, not a proven live migration. Do not require an extra destructive migration or create a second source. If the actual existing catalog is 1.18.1, cumulative importer may legitimately Preview `Add 14 / Update 0 / Skip 109 / Conflict 0` against the complete 1.20 package; verify that specific preview instead of silently claiming 1.19 was imported. Never modify saved attempts.

## Independent NotebookLM academic signoff

**REA-C1-01:** C1 reading requires interpreting a nuanced writer stance, the visitors-only survey limitation, metaphorical language and defensible inferences. Eight objective questions passed review.

**VOC-C2-01:** C2 Vocabulary practice covers scalar modifiers, conditional support, tactful criticism, stance preservation and degrees of certainty. Eight objective questions passed review.

**Zero mandatory corrections**; optional UI enhancement: meaningful "Advanced Challenge" label for C1/C2 cards and readable spacing on narrow mobile screens. Neither is a release-critical academic correction. These are academic target labels and learning-path indicators, not proof a student has attained C1/C2.

**Production status:** NOT AUTHORIZED / NOT IMPORTED / NOT LIVE at time of authoring.
