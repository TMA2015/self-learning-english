# Grammar Full Integration — local owner review

Status: focused automated validation PASS; Windows/mobile owner browser QA PENDING. No release or remote import performed.

## Recovered inputs
- Pilot source ZIP SHA-256: afc7be760cb920b1e7462d5ba56216b18a23295f5a6ce41ad54cdd0400429e8c (507 internal checksums PASS).
- Approved academic ZIP SHA-256: 2b9a710670ed8d652991b8274ef4b3512f07477c45bde46d946fc36e352ec97f (2 internal checksums PASS).
- Source-only continuation; no new Git commit or authentic main-ancestry claim.
- Unfinished work was preserved in a separate recovery ZIP before continuing. Original input extraction remains untouched.

## Implementation
- New immutable `content/curriculum-1.16.0-candidate.json`: 100 lessons / 850 activities; 40 Grammar lesson explanations updated, 60 other lesson objects identical.
- Domains: Grammar 40, Vocabulary 14, Reading 15, Writing 11, Listening 9, Speaking 6, Pronunciation 5.
- All 40 approved IDs, baseline lesson hashes and goals verified. Exact reviewed EN/VI teaching prose retained, except the three non-learner editorial fragments already omitted in the accepted pilot, enumerated in GRAMMAR_FULL_PROVENANCE.json. No new rules/examples/assessment content authored.
- Original review packets are not separately included in the supplied integration package. Their recorded hashes/PASS provenance are retained; no claim of independently rerunning NotebookLM review.
- Structured teaching notes now appear in the normal Grammar overview for loaded content version 1.16.0, rather than only the three-lesson preview. Goals, core meaning, usage/worked examples, adaptive formulas/comparisons, mistakes and optional Vietnamese support use shared safe text rendering.
- Combined usage/worked-example sections remain combined where approved; no duplicate legacy examples are appended. Paragraph/list/table hierarchy, wrapping and mobile table scrolling retained.
- Older content versions use their original lesson notes. Browser startup adds 1.16.0 immutably and selects it for new roots; old attempts and revisions keep their original version. No deletion, relabeling or regrading.
- Existing assessment activities, answers, grading, Error Bank, progress, Writing, audio, Gemini and Issue #64 behavior preserved. Renderer reads goals/explanation only; no activity/answer inventory rendered in notes.

## Local validation
PASS:
- grammar-curriculum-upgrade: isolated 1.15 -> 1.16; old drafts/results/revisions intact; learner/course/evidence bytes unchanged; only academic package key added; reload idempotent; conflicting immutable package rejected.
- browser-curriculum-upgrade: isolated 1.11 -> 1.16 with the same historical and course-selection safeguards.
- grammar-full-integration: exact reviewed prose parity for all40; 60 unchanged lessons; all850 activities unchanged; 80 EN/VI server renders; schema/content validation; no assessment IDs; version gate and responsive CSS contracts.
- grammar-design-pilot: existing 3-lesson pilot and 6 EN/VI renders still pass.
- q2a-shared-ux; v20-route-draft-safety; attempt-navigation-ui; issue64-task-b.
- content-quality; curriculum; academic.
- pronunciation-runtime-audio; listening-submit-feedback; listening-retake-audio-readiness.
- g3e-firebase-reliability with fake transports only.
- TypeScript --noEmit --incremental false.
- Local Firebase static production build (STATIC_EXPORT=1, browser runtime).
- firebase-hosting-static: all14 audio assets byte-identical, required pages/assets present, public Firebase key allowlist retained, secret-shape scan PASS, no direct Gemini Developer API endpoint.

This was focused validation, not the unrelated 60-command aggregate suite. No browser visual or authenticated QA is claimed.

## Candidate identity and dry-run
Local in-memory importer preview: Add 0 / Update 40 / Skip 60 / Conflict 0. No import/write performed by this preview.

- Candidate raw SHA-256: `a030ff32387b500745fa3f646b6c68fe8bb329ae64c0323ffe6e3a3960c78c29`
- Canonical/importer SHA-256: `b4ae3c295df4932e30a2d229bb64b0c73cbf369e3dc802f703b9ffeea0c504cb`
- Byte size: 1000722
- Curriculum 1.15.0 raw SHA-256 unchanged: `981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426`
- Curriculum 1.15.0 canonical SHA-256 unchanged: `66663bb61cf60b266d25e8abd890e81ad27398d3ebee9b7cd5cd211de878b1e8`

## Remaining gates / rollback limits
- Owner Windows desktop/mobile review of the full normal learning flow remains PENDING. Use an isolated browser profile and do not request AI feedback.
- Existing local storage quota limits remain. Adding an immutable package consumes more storage; Issue #64 honest write-failure handling and disabled restore remain intact. No automatic cleanup/migration added.
- A source-only rollback to the pilot does not remove an already-added 1.16.0 local package: the existing service selects the highest stored version. Keep preview data isolated; do not delete production learner data as rollback.
- Rights clearance and authentic main ancestry remain separate release gates from the inherited project lineage.
- No Actions, commits, pushes, merges, Firebase deployment/configuration, billing, real AI calls or production mutations occurred.

## Owner Windows QA checklist
1. Extract build ZIP; run START_WINDOWS.cmd (Python launcher `py` required); open http://127.0.0.1:8765/ in an isolated profile. Do not double-click index.html.
2. Confirm normal Grammar catalog offers 40 lessons within 100 lessons / 850 activities.
3. Inspect A1/A2/B1, especially GRA-A1-01, GRA-A2-11, GRA-B1-10, then remaining lessons: headings, formulas/tables, comparisons, examples and common mistakes; toggle Vietnamese Support.
4. Narrow viewport/mobile: readable text, no page overflow, table scrolling where needed.
5. Start a practice attempt: no answer key before submission; existing grading behavior unchanged. Save/edit/back via same-skill sidebar, reopen and verify latest draft.
6. In a separate existing test-data profile only, confirm historical 1.15 attempt retains its original notes/version; Start current practice creates 1.16 root. Do not overwrite real learner work for QA.
7. Check audio, Writing and course selection still behave normally. Do not trigger AI.
8. Confirm no console errors/missing assets. Report defects before any release authorization.

## Changed files
- `sites-p0-phase-a-20260926/docs/reviews/GRAMMAR_FULL_PROVENANCE.json`
- `sites-p0-phase-a-20260926/content/curriculum-1.16.0-candidate.json`
- `sites-p0-phase-a-20260926/infrastructure/browser/local-runtime.ts`
- `sites-p0-phase-a-20260926/app/structured-grammar.tsx`
- `sites-p0-phase-a-20260926/app/teaching-blocks.tsx`
- `sites-p0-phase-a-20260926/app/globals.css`
- `sites-p0-phase-a-20260926/app/foundation.tsx`
- `sites-p0-phase-a-20260926/app/grammar-design-preview/preview.tsx`
- `sites-p0-phase-a-20260926/tests/grammar-curriculum-upgrade.cjs`
- `sites-p0-phase-a-20260926/tests/grammar-full-integration.cjs`
- `sites-p0-phase-a-20260926/tests/browser-curriculum-upgrade.cjs`
- `sites-p0-phase-a-20260926/tests/grammar-design-pilot.cjs`
- `sites-p0-phase-a-20260926/tests/issue64-task-b.cjs`
- `sites-p0-phase-a-20260926/tests/firebase-hosting-static.cjs`

Additional deliverable-only reports/manifests are included; generated dependencies/build caches are excluded from source.
