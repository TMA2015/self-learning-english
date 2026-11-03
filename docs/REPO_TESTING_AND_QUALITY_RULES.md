> **ARCHIVED / HISTORICAL — 2026-11-03.** This is NOT an active SLE rulebook. Use only [SLE-MASTER-001](../sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md). Historical commands, older branches and old quota restrictions below may be obsolete; do not treat them as current instructions.

# AI English Tutor — repository, testing and quality rules

## Where the application actually runs

- The **private** GitHub repository `TMA2015/ai-english-tutor` stores source, immutable content candidates, test scripts and handoff documents. The current `main` root holds academic package data and documentation, **not** the application entry point.
- The clean P0 full-stack source is checkpointed under `sites-p0-phase-a-20260926/` on branch `sites-p0-phase-a-20260926` (commit `2c9bcc0ccdfb0b266134613d4c268abbde3ab8c3`). It includes `app/`, `package.json`, API routes, Cloudflare D1 adapters, migrations and tests.
- The actual private learner Site is `https://english-writing-coach.giangrr.chatgpt.site/`. Deployment and its managed database are separate from GitHub source commits.
- GitHub Pages is static hosting and cannot be treated as a drop-in replacement for the Sites-hosted API, authenticated account state and D1. Publishing GitHub Pages could expose a public website even when repository is private. No Pages publishing workflow/entrypoint is present in the checked `main` tree; this is not a claim that the repository setting itself was queried.
- A full app test requires a supported Sites runtime or a correctly configured local/isolated environment with authentication and local D1. Simply browsing GitHub source is not a learner-facing functional test.

## Tests that can run from GitHub source

On branch `foundation-content-p1-a-20260927`, the **content-only** check needs Node.js and no network services:
```sh
node scripts/check_foundation_grammar_pilot.mjs
```
It checks immutable versioning, expected schema shape, 13 lesson IDs, the 10-question Grammar A2 pilot, answer fields, preserved other lessons and known corrections. This does **not** prove successful Sites import or real learner UI.

The full application source contains `tests/run.cjs` and `tests/academic.cjs` under the nested P0 source folder, plus a `package.json` and lockfile. Run their documented commands only after setting up the matching project dependencies/runtime. Local *portable loopback* development has a built-in restricted sign-in; the managed preview and production must use real Sites authentication.

There is currently no checked-in workflow under `.github/workflows/` on `main`; GitHub does not automatically run this check merely because a JSON file is committed. A future manually triggered CI workflow can run it without hosting a public application. For a private repository, hosted Actions consumes the owner's plan allowance; confirm billing/usage settings before enabling automated runs.

## Division of responsibilities

- **Content reviewer:** original, accurate English; age-appropriate examples; CEFR values are targets, not certified learner levels; prerequisites and meaningful errors.
- **Teacher:** explain decisions step by step, design graduated practice, distinguish incomplete work from low ability, propose independent revision.
- **Engineer/QA:** preserve old content versions and learner attempts; check schema, answer insertion, score boundaries, UI persistence and auth; report actual tests and blockers.
- **Owner:** approves content import and deployment. No hidden work on private learner records.

A role instruction helps focus the response but does not grant credentials, teaching experience, tools or factual correctness. Every change should identify the source of evidence, what has been checked, what remains inferred, and the expected user-facing outcome. Require independent tests instead of accepting “expert” or “fully tested” as a self-description.

## Immediate pilot status

- Live application: P0 Site version 8 and academic package `1.0.0` according to last deployment and user checks.
- Candidate `1.0.2` on branch `foundation-content-p1-a-20260927`: Grammar A2 expanded to ten tasks; Grammar B1 has corrected accepted-answer fields; old package `1.0.0` unchanged.
- Next step: manual administrator **Preview import** of the candidate on the private Site; check `Add 0 / Update 2 / Skip 11 / Conflict 0` if latest package remains `1.0.0`. Do not import if preview differs; inspect actual current package. A preview is read-only. Actual import is a separate confirmation.
- Learner's paused Diagnostic v4 draft must not be reset to test content. A separate learner attempt should be used for the pilot.
