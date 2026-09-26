# Site handoff — 2026-09-26

## Verified from project conversation / Work's latest report (not independently verified against live source)
- Existing private Site: https://english-writing-coach.giangrr.chatgpt.site
- Existing 12-week Writing and Assisted Review must be preserved.
- Academic MVP seed contains 13 lessons / 55 activities across 7 skill groups.
- Work reported: the deployed Site was older than its working code; Foundation migrations were not live, and skill navigation still pointed to placeholders.
- Work reported that the development preview allowed Grammar, Vocabulary and Reading exercise/feedback and checked Listening audio gating.
- A real learner's Assessment submission returned HTTP 400. Work's test accounts submitted successfully; the real-account root cause remains unknown.
- Latest P0 work stopped before verified deployment. **Do not claim the live Site is fixed.**
- Runtime AI evaluation is not confirmed; Writing must remain provisional or in approved Assisted Review, never synthetic-scored.

## Smallest next Work task
Deploy already-written P0 recovery changes to the **existing private Site**, apply only the required approved migrations, and verify from the actual learner-facing deployed URL that Foundation lessons open. Preserve learner records. If blocked, stop and report the blocker; do not branch into unrelated work.

Then address the real learner's HTTP 400 in a separate targeted task with safe server-side diagnostics. Do not put personally identifiable data or raw student submissions into logs or this repo.

## Source sync
This repository does NOT yet contain the application's Sites source. After a stable deployment, export/commit the Site source and migration definitions to a separate snapshot branch, compare with GitHub content, and merge deliberately. Never overwrite this repository blindly from a stale Site snapshot.

## Content package contract
- Source: `content/packages/ai_english_tutor_academic_seed_v1.json`
- IDs and content versions must remain stable and attempts retain both.
- Versioned idempotent import; dry-run add/update/skip/conflict; no duplication on rerun.
- Map portable seed fields to the **existing** Site entities. Do not replace the app's data model.
- Never overwrite learner profiles, attempts, Writing course or human-reviewed feedback.
- Objective items: deterministic grading, relevant feedback and validated evidence.
- Open responses: Pending Review until approved.
- Listening: no audio evidence if playback unavailable/not completed; hide transcript until submission.
- CEFR seed labels are content targets, **not learner placement**.
- Verify the complete learner journey at the deployed URL, not merely unit tests or imported row counts.

## Work-saving policy
Each Work batch = one change, one acceptance test, no broad refactor or repeated 100-run assessment simulation. Produce curriculum, test cases and question packages outside Work. Save a stable version before migrations. Avoid full-site testing unless a cross-cutting change warrants it.

## Security and backups
GitHub stores code, curriculum and documentation; Sites remains the running application. Learner data and DB backup are separate restricted artifacts. Never commit API keys, `.env`, auth tokens, recordings, identifiable learner work or exported account data.
