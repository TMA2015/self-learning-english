# NotebookLM disposition — A2-U10 checkpoint R1

**Source:** Owner-supplied independent NotebookLM audit text on 2026-11-12, packet `SLE-A2U10-CHK-R1-20261112`, review scope `AUTHORED_CONTENT_ITEM_LEVEL`. This file is an exact *decision reconciliation*, not a substitute for the complete reviewer response or a new source of academic policy.

## Verdict and selected route

- `ACADEMIC_VERDICT: PASS_WITH_REQUIRED_CHANGES`
- `RECOMMENDED_DESIGN: B (existing transfer lessons + summary only)`
- `ACADEMIC_ADOPTION: NO-GO` for any **mandatory new A2-U10 lesson/question set**: the proposed Young Makers Weekend/Leo/Poster Studio cases repeat the pedagogical function of Mia/Repair Café.
- `ENGINEERING_IMPLEMENTATION: NO-GO` for **the proposed new media-based assessment**: its own MP3 does not exist, media rights/hash/playback and importer schema are not validated.
- `AUDIO_MEDIA_READINESS: NOT READY` for the **new** `AUD1` script. This is not a retrospective verdict on the existing approved `LIS-A2-07` audio.
- R01–R03, L01–L03, X01–X02, W01 were judged academically sound at item level, but they are **not** adopted for the primary Unit-10 path.

## Required changes adopted for this decision

1. **Discard the proposed mandatory new A2-U10 checkpoint.** Do not add the proposal's three hypothetical lessons to the cumulative curriculum or create a duplicate Unit-10 assessment, even though individual questions received an academic PASS.
2. **Keep the canonical reviewed original transfer lessons unchanged:** `REA-A2-08` (Reading), `LIS-A2-07` (Listening plus cross-source), `WRI-A2-07` (unscored Writing awaiting trusted review). No ID, key, audio, rubric or historical attempt may be overwritten.
3. **Do not create / use `AUD1`** for the selected B path, or fabricate media SHA-256, durations, rights receipts or MEDIA-01 pass. The new script remains an unused, unapproved optional-practice candidate.
4. **Do not create `WRI-A2-08` as a new assessed lesson.** The review's gating table uses that tentative ID for W01, not an authorized runtime ID. Any future independent Writing submission must remain unscored/pending trusted review.
5. **Implement Option B, if desired, as a purely read-only summary inside the existing UnitBrowser.** Derive its states from the currently imported three Lesson IDs and already saved versioned attempt records. Do not infer independent mastery, change grades, award CEFR badges, activate an AI provider, or add new persistence. Current player and its Listening safeguards are the authoritative place to open/resume each lesson.
6. **Treat visual/UX and technical verification separately.** The audit's statement about >=320px readability of a proposed Markdown notice is not evidence of real Safari/iPad rendering. Require exact-current-head PR QA plus device acceptance or duly authorized low-risk release exception.

## Scope reconciliation

The report contains a repeated copy of the verdict and question answers. This duplication does not represent two separate academic reviews or twice the evidence.

The original R1 packet remains available for historical provenance and optional bank research, but its `NOTEBOOKLM VERDICT PENDING` status is superseded by this review. **Keep Option-B read-only UI implementation in a separate Draft PR**, so an academically rejected duplicate content proposal cannot accidentally be imported through a code PR.

**Technical status of this file:** decision recorded; Option-B engineering QA and owner acceptance are tracked separately. **NO MERGE / NO DEPLOY** by virtue of this verdict.
