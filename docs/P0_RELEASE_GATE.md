> **ARCHIVED / HISTORICAL — 2026-11-03.** This is NOT an active SLE rulebook. Use only [SLE-MASTER-001](../sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md). Historical commands, older branches and old quota restrictions below may be obsolete; do not treat them as current instructions.

> **Current release instruction (supersedes the earlier sequence below):** A full live D1 backup is NOT available in the current Sites toolset. Separate offline build/managed-preview from production release. Build and test the P0 artifact now **without touching live D1 or publishing**. Production migration/deploy is a later explicit decision after a risk/backup review. See [P0_BUILD_ONLY.md](./P0_BUILD_ONLY.md). Do not mistake a source/version rollback for a database backup.

# P0 release gate — preserve learner data

Status: **source snapshot verified, live release NOT verified**.
Reference branch: `sites-source-snapshot-20260926`, commit `6e4688ab40357cf1ea2a457c7e8e33baf954a6d1`.
App source lives under `sites-source-snapshot-20260926/` within that branch; the repository root contains the separately maintained academic package and handoff docs.

## Source-level findings (read-only)
- The current source routes Foundation/Course Catalog and Grammar, Vocabulary, Reading, Listening, Speaking and Pronunciation to `FoundationDemo`; the existing Writing course remains first in the Writing view.
- `app/api/foundation/route.ts` exposes authenticated catalog/lesson, attempt, draft, playback and submit paths. `application/academic-service.ts` uses versioned content and preserves submitted attempts.
- `drizzle/0005_lonely_kitty_pryde.sql` creates `academic_packages` and `academic_attempts` and inserts the initial Foundation seed with `ON CONFLICT DO NOTHING`. `0004_jittery_wendell_vaughn.sql` holds the prior Assisted Review extension.
- `app/api/diagnostic/route.ts` checks answer sequence, both Writing samples, and optional Listening evidence. It returns HTTP 400 with distinct codes for invalid answers, short Writing, question-sequence mismatch and incomplete assessment. **The real learner's earlier HTTP 400 cannot be attributed to one of these causes without seeing the new error response.**
- The snapshot's `P0_RECOVERY.md` reports preview tests passing, but does not certify an actual private Site deployment or real-account submission.
- Source is not runtime data. GitHub backup does not apply migrations or publish the Site.

## One-task Work release instruction
On the EXISTING private AI English Tutor Site, deploy the already-saved P0 recovery implementation. Preserve all existing account records, drafts, Writing content and Assisted Review. Apply only pending additive migrations required by that exact implementation, in order, using the Sites-supported migration/publish flow. Do not replay completed migrations, create a new Site, clear data or reimport duplicate content. Verify the actual deployed URL (not only managed preview). If blocked, stop and identify the precise blocker; do not redesign or extend scope.

## Required deployed smoke check
1. Authenticated learner opens Course Catalog and sees **13** lessons, seven domains and the seven-step demo.
2. Open one Grammar item, submit an objective answer, see specific feedback and reload to verify saved result.
3. Open Listening, verify audio is playable and submission remains gated until playback; no score without audio.
4. Existing 12-week Writing and Assisted Review remain accessible and previous learner records remain intact.
5. Record deployed Site version/source identifier and migration status.
6. Ask the affected adult account to retry its **saved** Diagnostic draft, preserving the original answers. If submission still fails, capture only HTTP status, response `code`, `assessmentVersion` and `questionNumber` plus UI error text; never include answer text, user identity or full request body in a report.

## Separate subsequent task
Fix the specific Diagnostic failure once the response code for the existing learner draft is known. Avoid relaxing server-side answer checks, deleting the draft, or rebuilding the assessment engine.

## No-go
Do not report P0 as complete merely because source files, local tests, seed SQL or a GitHub commit exist. The deployed private URL and genuine learner flow must pass.

## Release blocker update — 2026-09-26
Work confirmed that production is still Site version 6 (`a6d5c697c423737d708452aebeed3ccf8b903bdd`), with neither migration 0004 nor 0005 applied. The available version 7/M3B package predates P0. No deployable P0 build artifact currently exists. The earlier “do not rebuild” instruction was overrestrictive: **a build of the already implemented P0 source is REQUIRED and explicitly allowed**. Do not deploy the old version 7/M3B artifact.

### Correct minimal sequence
1. Confirm that the active Sites checkout contains the complete P0 source already saved to GitHub snapshot commit `6e4688ab40357cf1ea2a457c7e8e33baf954a6d1`, including its current working changes. Do not replace a newer Sites checkout blindly with the nested GitHub archive.
2. Preserve the current live version 6 rollback and take a restricted pre-migration data backup via the supported Sites flow. Preserve existing learner records and credentials. No learner records go to GitHub.
3. **Build/package that exact P0 working source**, using supported Sites build tooling. This is packaging, not a feature rewrite. If build fails, report the first concrete failing command and diagnostic, then stop; do not branch into general refactoring.
4. Run only necessary build/manifest and managed-preview checks. Verify that the artifact includes P0 route/UI changes, academic seed and audio assets.
5. Apply only pending additive production migrations **0004 then 0005** through the supported publish/migration flow, once each, with explicit target verification. Never replay earlier migrations or clear the database. If a migration fails, stop and report the status, preserving a recovery point.
6. Publish the new P0 artifact to the existing private Site; retain the rollback artifact/version.
7. Verify deployment status/source version, migration presence, 13 lesson catalog and a minimal authenticated learner flow using supported checks. If the managed browser cannot open the private live URL, explicitly state that limitation and request a short manual live verification by the owner instead of claiming an automated live browser pass.
8. Keep the real-account Assessment HTTP 400 investigation separate. On retry of the preserved real draft, collect only safe error metadata (`code`, version, question position), never response text or identity.

**Prohibited:** use of stale version 7/M3B artifact; full application redesign; new features/content; assessment recalibration; arbitrary migration replay; data reset; unverifiable “deployed and tested live” claims.
