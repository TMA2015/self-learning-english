# SLE public-repository GitHub Actions policy — 2026-11-03

## Context and decision

SLE was private until 2026-11-03. October 2026 CI exhausted private-repository Actions allowances because many push/PR workflows repeated installs and builds. The repository is now public, so standard GitHub-hosted runners can be used for eligible public-repository jobs. The no-paid-runners and explicit-production-deploy boundaries remain in force.

## Approved workflows (exactly two)

1. `.github/workflows/english-pr-qa.yml` — automatic **pull_request** checks targeting `main` only. One bounded job; superseded runs cancelled. `permissions: contents: read`, no repository secrets, no Firebase deployment, no `pull_request_target`. Policy verification always runs; full `pnpm qa:release` and static build run only when a complete application tree with `package.json` and `pnpm-lock.yaml` is present. The current default branch contains only the baseline/governance tree, so documentation-only PRs receive policy checks rather than a misleading application QA PASS.
2. `.github/workflows/english-manual-release-qa.yml` — **workflow_dispatch only** on the explicitly authorized release branch, with existing release-confirmation gate. This workflow retains the only Firebase production deploy action; it checks the English-only Hosting target and must run QA before LIVE deployment.

Forbidden: push/schedule/workflow_run/pull_request_target triggers; third-party paid/self-hosted runners; publishing preview or production from PR QA; secrets in PR QA; automatic production deployments.

## QA and change controls

- `.github/workflows/` must contain exactly the approved two files. `node scripts/verify-actions-policy.cjs` enforces the trigger separation and PR secret/deployment boundaries.
- Full application PR QA uses Node 24, pnpm 11.25.0, `pnpm install --frozen-lockfile`, FFmpeg, `pnpm qa:release`. No live Firebase credentials are needed for PR QA.
- PR QA is not proof of live browser AI functionality or learner-data preservation. Firebase deployment, App Check and live smoke tests remain separate acceptance gates.
- Avoid duplicate CI on every push; review PRs against `main`. Do not turn on required status checks until the new PR workflow has produced a successful status for the target branch.
- Carefully inspect `.github/workflows` changes when promoting older development branches. Never blindly merge workflows from historical PRs.

## Rollout record

- Public visibility verified 2026-11-03. Existing releases and site data were not changed by the visibility transition.
- This policy and PR workflow are staged through a PR: automatic PR QA becomes authoritative only when that PR is merged into the default branch.
- Branch protection and rulesets are repository Settings operations; configure them separately, without requiring unavailable status checks or allowing silent bypass.
- No curriculum import, Firebase deploy, secret rotation or learner data change is part of this policy migration.

## Historical note

The prior `2026-11-ci-quota-policy.md` was a **private-repository** manual-only rule. Its historical quota issue remains documented here; its prohibition on PR QA is superseded by this narrowly scoped public workflow.
