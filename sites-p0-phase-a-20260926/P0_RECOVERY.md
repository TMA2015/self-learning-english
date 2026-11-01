# P0 learner recovery — 2026-09-26

## Findings and scope

The live deployment was version 6 (commit a6d5c697c423737d708452aebeed3ccf8b903bdd). Saved version 7 (99aeccfb03320dc128ec040a4987de264f36b246) had no deployment. Live D1 inspection confirmed the academic content/attempt tables and Assisted Review tables were absent. Therefore previous local import/test results did not establish a working deployed course. This release delivers the existing, previously unpublished Academic implementation; it does not generate new instructional content.

The Dashboard had no Foundation entry and six skill navigation items still rendered ModulePlaceholder. They now open the same Foundation repository/player filtered by skill. Writing retains its original module first, followed by imported Writing lessons. Catalog exposes all 13 existing seed lessons and the seven-step path.

Live logs show POST /api/diagnostic HTTP 400. The exact failing learner draft could not be retrieved in full through the bounded live database viewer. Both a browser-generated v4 completed draft (82 responses) and a v3 completed draft (60 responses) successfully submitted through the learner UI before the fix. **The reported account-specific Assessment failure is not reproduced or confirmed fixed.** Do not claim otherwise.

Assessment validation now reports specific sample word counts, invalid answer position/version, and incomplete evidence. Completion uses the unchanged nextQuestion engine instead of a separate fixed-count precondition. Missing/invalid question sequences are still rejected and rescored on the server. The UI explains why Finish is disabled. No calibration, question bank, or adaptive stopping changes were made.

## Data safety and delivery

Version 7 remains a saved rollback source/archive. Existing learner records are not reset. Migrations 0004 and 0005 are additive tables. Migration 0005 installs the exact validated source package with a package/version primary key and ON CONFLICT DO NOTHING; no duplicate learner import or assessment writes occur. The initial content digest is d6ea79b27f703e2fa178c1f11bf9f51a41bc8f0d9c4663872fbe28267d09f056. Existing Writing JSON and adaptive engine are unchanged.

Temporary synthetic identity fixtures, QA routes, and QA administrator email are removed before packaging. Hosting identity and account-scoped repositories remain authoritative. No API provider or billing integration was added.

## Focused validation

Browser tests run against the managed preview using isolated synthetic accounts and actual learner components/API/D1. This is not a live-user or physical-iPad test.

- Dashboard → Foundation; seven skill navigation entries; all 13 A2/B1 lesson screens opened. Six B1 lessons rendered their own questions; they were not all completed.
- Grammar, Vocabulary and Reading answered through radio/text inputs, submitted, and received answer-specific explanations.
- Listening A2: Submit disabled before playback; real MP3 completed (24.715 seconds); answers submitted, feedback saved, transcript revealed only afterwards. Reload restored results.
- Writing and Speaking submitted and displayed Pending Review; Pronunciation saved as optional unassessed practice. No proficiency scores assigned to these unreviewed responses.
- Full seven-step demo path showed seven saved attempts after reload.
- Assessment v4 and v3 submissions saved results; Learner Profile retained evidence after reload. Invalid-answer fixture produced a visible position/version error without deleting the draft.
- tests/academic.cjs: 13 lessons / 7 domains / 1 path, repeat import 0 added / 13 skipped, version conflict/update, deterministic scoring, submission idempotence, retake, account isolation, no-playback/no-score, transcript gate, revisions, no unreviewed Writing/Speaking proficiency — passed.
- Earlier focused actual D1/API harness: 29 checks passed (import validation/roles, duplicate import, lesson catalog, drafts, objective scoring, idempotence, account separation, retake, listening gate, reviewed evidence, preserved old Writing, source and learner export compatibility).
- A saved v4 draft resumed at question 82; its final answer was entered through the learner UI, Finish submitted successfully, and reload retained B1− / moderate 64% confidence.
- TypeScript and whitespace checks passed. No 100-pattern assessment simulations were run.

## Source locations

P0 repairs: app/api/diagnostic/route.ts, app/diagnostic-assessment.tsx, app/page.tsx, app/foundation.tsx.

Previously unpublished content functionality delivered with this repair: app/api/foundation/route.ts; app/api/admin/content-import/route.ts; app/api/admin/foundation-reviews/route.ts; app/api/admin/export/route.ts; app/core-panels.tsx; app/globals.css; application/academic-service.ts; application/export-learner.ts; application/learning-service.ts; domain/academic.ts; domain/content-model.ts; domain/portable-data.ts; infrastructure/academic-runtime.ts; infrastructure/storage/d1-academic.ts; db/schema.ts; drizzle/0005_lonely_kitty_pryde.sql and metadata; content/academic-seed-v1.json; content/foundation-audio.json; content/learner-export.schema.json; public/foundation-audio/; tests/academic.cjs.

## Remaining limitations

The actual learner's Assessment HTTP 400 remains an unresolved account-specific reproduction. The improved error must be observed on that saved attempt to identify its precise failure, without clearing or restarting it. Managed preview cannot navigate the deployed private Sites URL; native deployment status and live database inspection are separate from browser testing. No real second-device or physical iPad test is claimed. Microphone recording is unavailable in the HTTP test environment. Pronunciation word-model audio is absent and explicitly labelled; pronunciation remains unassessed. Runtime AI is not connected.
