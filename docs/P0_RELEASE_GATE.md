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
