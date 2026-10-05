# Free-tier GitHub Actions strategy — 2026-10-05

Status: **DRAFT — CI COST/QUOTA OPTIMIZATION, NO DEPLOYMENT CHANGE**

## Problem observed

The repository is private and accumulated many historical feature-specific pull-request workflows.

For the UX Teaching Polish PR, one ordinary code change triggered **12 separate GitHub-hosted jobs**. Most of those jobs repeated the same expensive setup:

- checkout;
- Node setup;
- pnpm setup;
- full `pnpm install --frozen-lockfile`;
- overlapping regression tests;
- often another full production build.

This is academically cautious but inefficient for a free-first private project.

## Current runner symptom

The last observed successful G3 Firebase Browser QA run started normally and completed checkout, install, tests, TypeScript and build.

A few minutes later, newly triggered jobs began completing with:

- `runner_id = 0`;
- no workflow steps;
- zero billable execution time;
- reruns fail in the same pre-runner state.

This proves the current failures are happening **before repository code executes**.

It is consistent with an Actions account/budget/quota block, but repository APIs do not expose enough billing information to confirm the owner's exact account state.

Official GitHub documentation checked 2026-10-05:
- private repositories consume the account's included GitHub-hosted Actions minutes;
- usage can be blocked after included quota/budget is exhausted;
- included minutes reset at the start of the billing cycle.

References:
- https://docs.github.com/en/actions/concepts/billing-and-usage
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/billing/reference/product-usage-included

## New policy

For ordinary code pull requests, run **one consolidated job**:

`.github/workflows/free-tier-pr-qa.yml`

The job:

1. installs dependencies once;
2. runs browser-local storage/backup/course tests;
3. runs Firebase AI + Writing tests;
4. runs Foundation/Listening/navigation UX regressions;
5. runs academic/curriculum/progress regressions;
6. runs TypeScript once;
7. performs one production-equivalent static build.

It also uses PR concurrency with `cancel-in-progress: true`, so a newer commit cancels an older in-progress run for the same PR.

## Historical workflows retained, but manual-only

Seventeen overlapping code/history workflows are **not deleted**. Their `pull_request` trigger is removed and `workflow_dispatch` remains available.

This keeps them usable for targeted release investigations without charging repeated minutes on every normal PR.

Manual-only set in this draft includes:

- Course v21 P1 QA
- Curriculum 1.3 / Batch04 Compatibility QA
- Curriculum 1.6.0 Grammar A1/A2 Milestone QA
- Focused Foundation player QA
- G Learning English brand QA
- GitHub-first Free Platform QA
- GitHub-first G1 Local Runtime QA
- GitHub-first G2 Backup QA
- GitHub-first G2 Static Export QA
- GitHub-first G3 Firebase AI Contract QA
- GitHub-first G3 Firebase Browser QA
- Importer Capacity 150 QA
- Learning Evidence v21 P2A QA
- v16 Listening Submit Feedback QA
- v17 Listening Retake Audio Readiness QA
- UX v20 Lesson IDs and Navigation QA
- Writing navigation and draft feedback QA

## What remains separate

Keep deployment or special-production workflows separate and manual.

Examples:
- Firebase Hosting preview;
- preview-to-live promotion;
- audio generation;
- narrowly scoped academic draft/release review workflows where a content-only PR should not pay for a full application build.

## Free-first rule

Do not solve CI quota exhaustion by enabling paid GitHub Actions automatically.

Preferred order:

1. consolidate duplicate jobs;
2. cancel obsolete in-progress PR runs;
3. keep historical gates manual;
4. run content-only validation without a production build where possible;
5. inspect GitHub billing/usage;
6. wait for included quota reset if the owner wants to remain strictly free.

## Merge gate

This CI optimization should be merged before the next large code phase (especially multi-profile repository isolation), so that one profile-related source change does not trigger many duplicate builds.
