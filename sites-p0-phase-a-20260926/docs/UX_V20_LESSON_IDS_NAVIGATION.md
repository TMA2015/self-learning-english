# UX v20 — lesson identifiers and safer, quicker navigation

Status: Draft PR only; application code and QA, **not** Site deployment, data import or migration.

## Source and release boundary
- Baseline: Batch04 code-compatible GitHub PR #17 checkpoint `70f11c4a4396c606c854f2e014c42326b0507fde`.
- Existing Site: v19, deployed Sites source `49014a57a37a6ab75da7eb2fe6394affa8ab5e85`.
- Live curriculum baseline: 1.4.0, 45 lessons/323 activities, digest `70eb0d13477a647ae2ab0ca5b11bfd1f52a99772f1ca206d701718d08ffb56da`.
- Deployed Site source is not this GitHub branch. **Work must reconcile only this PR's UX delta onto actual v19 source before any v20 release.** Do not copy whole branch or merge unrelated PRs.

## Learner-facing changes
1. Show source IDs in both Catalog layouts, Recent Work and the Lesson Overview/Practice header; preserve human titles, status, grouped skill navigation and independent CEFR filter.
2. Prefetch only the versioned instructional lesson view on pointer hover or keyboard focus; keep a bounded in-memory session cache (max 12, retry after failed fetch). No attempts, answers, results, audio recordings or playback evidence are cached. Historical attempts request their exact content version.
3. Show a visible, accessible `Opening <ID>…` status while waiting on a lesson fetch.
4. Reuse the already loaded lesson when starting an attempt on that same version, rather than immediately requesting it again.
5. A required draft save still completes before opening another lesson or changing skills. A separate catalog / recent-work refresh no longer blocks the transition. On background refresh failure, display an error without misreporting the draft as unsaved.

## Regression gates
- No content JSON, tag mapping, D1/schema, auth, learner-record or evidence changes.
- Existing latest-attempt selection, read-only submitted result, revision history, draft restoration and manual retry remain intact.
- Listening playback guard, transcript reveal rule, recording and microphone safety unchanged.
- No unnecessary async route changes or optimistic claims that an unconfirmed save succeeded.
- Check desktop and phone. Measure navigation time from tap to first visible feedback and to overview; compare v19 and v20 on the same session/network, including existing draft and submitted result.
- A failed draft save must block leaving the lesson via its in-player controls. Direct sidebar transitions must not silently discard a draft.

## Release
This is code-only. Do not merge PRs merely to deploy, change Site identity/URL/auth, import content or reset/migrate D1. No deployment until owner approval; then owner browser QA before accepting v20.
