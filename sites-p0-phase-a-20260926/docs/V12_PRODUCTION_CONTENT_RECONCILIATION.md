# Self-Learning English v12 — production content reconciliation (2026-09-27)

## Status and provenance
- Existing private Site, no new Site or environment.
- Owner-confirmed successful **Parent View content-only import** of the corrected curriculum v1.2.0.
- Browser result: **Add 8 · Update 0 · Skip 21 · Conflict 0** and `Export Foundation source v1.2.0 · 29 lessons` available.
- The importer reported: `Learner records were not changed.`
- The user-supplied live v1.1.0 export was the reconciliation baseline.
- The **exact local import file** was `curriculum-1.2.0-safe-import.json`, SHA-256 `90c18620233ca1dce0e1b68ec7801d41134a6d8f14cf8ae2529b12d8df4b8aa5`.
- This repository stores its corresponding normalized JSON content as `content/releases/curriculum-1.2.0-production-import.json`.
- Source branch checkpoint: `edc1bcdf372ef82df5c38c8a5393ae1bff104c63`; reported deployed Sites source commit: `0fca4ceacd6aedc407bbb497d6cbfb4d9a176e10`. GitHub and Sites source commit identities are distinct.

## Why the original upload was stopped
The first `curriculum-1.2.0-candidate.json` downloaded from the deployed Site had SHA-256 `11bbd94f82f3d96483eaba3736c55124e47a13e3f357203974eedebf9c7f261b`.
Its live preview returned Add 8 / Update 2 / Skip 19 / Conflict 0.
The unexpected update actions were `VOC-A1-02` and `REA-A2-02` because five text fields in two questions differed from the live corrected v1.1.0 lessons:
- `VOC-A1-02-Q6`: prompt, option B, explanatory feedback.
- `REA-A2-02-Q2`: prompt, explanatory feedback.

The corrected import file preserved all 21 live v1.1.0 lessons and all eight new candidate lessons, including the actual `WRI-A2-02` example beginning `MODEL · Hi Sam! Last Friday`.
The integrated GitHub checkpoint already has the two previous lesson corrections, but its cumulative candidate uses `MODEL · Hi Sam, Last Friday` for that new writing example. For that reason, the original candidate is **not** the complete source-of-truth for the package actually imported; the release snapshot is.

## Content release invariant
- Content version: `1.2.0`; 29 lessons; 190 activities.
- Preserve stable IDs, the 21 previous live lessons, all eight new lessons, and the Writing example in the actual imported package.
- This snapshot is content only; it carries no learner profiles, answers, attempts, assessments or D1 data.
- Future Batch 03 / 1.3.0 authoring MUST start from the production release snapshot, **not** the historical Sites download or the source checkpoint candidate, and MUST independently check inherited lesson equality.
- Do not reimport a different payload under the immutable version `1.2.0`. Changes after this release require a new content version.
- Do not overwrite `content/curriculum-1.2.0-candidate.json` as a way to retroactively change an already deployed candidate; retain source provenance.
- No D1 reset, import, migration, auth change or Site deployment is authorized by this source-only reconciliation.

## Outstanding acceptance
- Owner may export live v1.2.0 and compare parsed content with the snapshot (file formatting may differ).
- Perform authenticated learner-path browser QA: new A1 Grammar, museum Reading, invitation Writing pending review, existing scored attempt and X/10 summary, and fast skill tabs.
- Browser confirmation of successful import is not a full independent audit of every D1 record.
