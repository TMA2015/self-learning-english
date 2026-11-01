# AI English Tutor — objective result summary and fast skill-tab UX

**Release state:** Fixes authored in a separate draft branch. No new Sites deployment or D1 mutation has occurred in this branch. Owner reports production Site v10 and academic content 1.1.0 (21 lessons) successfully imported; v9 code is NOT a safe default rollback after that content import.

## Real learner QA that motivated this change

After submitting Grammar, the learner can read per-item correctness, but there is no aggregate `correct/total` result. Reading has the eight imported questions, and the new Writing self-introduction shows Analyse / Brainstorm / Plan / Model. Returning to Grammar from another skill still briefly shows `Loading your course` (approximately one second) even though an initial parent-level cache was introduced.

## Root cause and targeted change

The existing page rendered `<FoundationDemo key={view} ...>`, forcing the complete Foundation player to unmount/remount with every skill view. Even with a parent catalog cache, component-local state and effects were restarted. The fix renders **one stable player component** for Foundation, Grammar, Vocabulary, Reading, Listening, Speaking, Pronunciation and the Foundation section of Writing. The component retains catalog state across skill changes and does not refetch the catalog merely for tab navigation. The first authenticated catalog load is still required; explicit Start/Submit/Import and a new browser session may legitimately fetch data.

On a skill change, an active draft is saved before clearing the old selected lesson. If saving fails, the warning remains; no silent success claim. Audio playback is stopped; an interrupted unsaved recording is discarded with a generation guard, avoiding recording data leaking into another skill. Parent in-memory account-scoped catalog is still reused upon returning from other views.

The result panel reads `attempt.results` already checked and persisted by the server; it **does not regrade**. It shows `8/10 · 80%`, correct/incorrect counts and a native progress indicator at the top of a submitted attempt, including when opening a historic scored attempt. If a Writing unit has 4 objective checks and 1 open response, show `3/4 · 75%` for **objective questions only** and mark the open response as pending/reviewed separately. Empty/unassessed attempts do not show a fake score. There is no CEFR estimate from this card.

## Files and test gate

- `domain/foundation-summary.ts` — deterministic presentation summary over server results.
- `app/foundation.tsx`, `app/page.tsx`, `app/globals.css` — one persistent tab player, safe draft/audio transition and responsive score panel.
- `tests/foundation-results-ux.cjs` — 8/10, 10/10, 0/10, mixed objective + open, empty/unassessed tests and source-level remount/caching/recording guards.

Before release, run from the nested application directory:

```sh
node tests/foundation-results-ux.cjs
node tests/foundation-coaching.cjs
node tests/content-quality.cjs
node tests/curriculum.cjs
node tests/run.cjs
node tests/academic.cjs
npm run build
```

Tests and build in Work are NOT yet verified for this branch. The authenticated Work-preview blocker is known; do not weaken authentication.

## Release and rollback

The target is the **existing private Site**, currently v10 with 1.1.0 academic content. Compare the actual deployed v10 source commit `7b29f48efbd37c51de990d43f822b7128a4c9d3f` to this branch before deploy. The GitHub source includes the independently synced two question clarifications in the JSON candidate, which may not be byte-identical to Work's Sites source. The curriculum is already imported into D1; do not reimport or rewrite that immutable 1.1.0, and do not accidentally downgrade its contents.

If the actual change set is limited to this targeted UI/helper/test update and release checks pass, deploy **code-only**, preserving the same D1 binding and versioned academic content. No migrations, reimports, reset, schema changes, auth bypass or merging PRs just to release.

Keep **v10** as the compatible code rollback checkpoint. Do NOT automatically roll back to v9 after 1.1.0 import. The current work does not change any academic API, scoring logic or saved attempts.

## Owner acceptance after code deployment

1. Open Grammar A1 `GRA-A1-01` and open the already submitted attempt or submit a new disposable one. A visible `X/10 · Y%` summary appears above item-level correction; score equals the number of server-marked correct answers.
2. Open Reading and Grammar repeatedly: after the first catalog load, there is no repeated `Loading your course` placeholder on these tab changes. No wrong-skill lesson should linger in another tab.
3. Return to an in-progress lesson after switching away: previous draft remains saved. If a save fails, show a clear warning.
4. Writing open response remains pending adult review and is excluded from the objective score; historical attempts still open.
5. Check laptop and narrow/mobile rendering.

If browser acceptance fails, report the exact screen/state. Stop without declaring QA complete. Roll back application code to compatible v10 if a severe regression occurs; do not restore or rewrite D1.
