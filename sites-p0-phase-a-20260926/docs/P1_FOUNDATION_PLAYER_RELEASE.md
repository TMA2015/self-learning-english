# P1 Foundation player UX / hint pilot — controlled release

**State:** GitHub draft PR #1. This document is a handoff, not proof of a finished deployment. Production Site remains v8; Foundation content v1.0.2 is already imported and user-verified. No migrations or further content imports are required for this UI-only release.

## Source of truth
- Repo: `TMA2015/ai-english-tutor`.
- Feature branch: `foundation-player-ux-p1-20260927`.
- App source root inside branch: `sites-p0-phase-a-20260926/`.
- Base P0 checkpoint: branch `sites-p0-phase-a-20260926`, commit `2c9bcc0ccdfb0b266134613d4c268abbde3ab8c3`.
- Draft PR: https://github.com/TMA2015/ai-english-tutor/pull/1.

## Scope

1. Restructure the existing Foundation teaching notes into learning goals, rule and worked examples. Responsive CSS; generic example labels for lessons without the new labeled examples.
2. Exactly ten `GRA-A2-01` activities of content `1.0.2` receive two manually written, optional pre-answer hints each. This is an intentionally narrow **client-side, unscored pilot**. Hints are not AI-generated or adaptive; they are not persisted. Do not expose the final correct answer in the hint.
3. Do not change any API, auth, data model, D1 migration, answer key, grading, review workflow or content import format. Do not reset/rekey learner data.

## Verification required in supported Sites Work/preview environment

From the feature checkout's nested source root, with the established Sites environment/profile and dependencies:

```bash
node tests/foundation-coaching.cjs
node tests/run.cjs
node tests/academic.cjs
npm run build
```

The first script checks source-level guards, hint coverage and responsive markup but does not substitute for TypeScript/build/browser tests. If existing tests fail, report the exact failure, root cause and whether source/infra-related; don't describe them as passing.

Browser test at authorized preview (use disposable attempts and current owner account):

- Grammar A2 newly started `content 1.0.2`: eight labeled example cards, 10 questions, two optional hints for each. Hints visible only while started. Check in particular Q3, Q5, Q8 and Q10 that hints do not simply print the answer.
- Original Grammar `1.0.0` completed attempt: remains readable with correct historical answers, no v1.0.2 hints, and `Retake lesson` starts latest `1.0.2`.
- Vocabulary A2 or Reading A2: unlabeled content renders as numbered worked examples where provided, and passages/audio functionality is unchanged.
- Existing Writing pending review and Diagnostic paused state remain present on live after any release; do not reopen/replace the old attempts for QA.
- Desktop and narrow/mobile width: no clipped examples, horizontal overflow, broken button or lost Vietnamese support.
- Check save, submit and reload with one new disposable Grammar attempt; no hint action should write attempt data or fake a proficiency score.

## Deployment gate

Use the standard Sites supported preview/build/deployment path; do not copy source into GitHub Pages or overwrite D1. Only deploy if all required tests, preview and version checks pass, and the owner authorizes release. Keep current v8 available for code rollback. Report new Site version, artifact digest if one is produced, and separately record the user-verified data checks. Neither this document nor GitHub merging performs a Sites deploy.

## Next academic slice (not included in this PR)

Design portable, schema-validated `hint_tiers` and mistake-specific `followup_item_id` in versioned lesson content. Provide one distinct analogous remediation question when a submitted item is wrong. Store both original attempt and new follow-up evidence, never rewrite a scored answer or mark a hint as mastery. Pilot with one grammar lesson first.
