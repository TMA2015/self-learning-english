# CI-FREE-FIRST architecture — 2026-10-06

Status: implementation checkpoint.

## Owner policy

Self-Learning English remains a private GitHub repository on GitHub Free.
Do not add a paid Actions budget or upgrade GitHub solely for CI.

GitHub-hosted Actions are not the default development QA environment.

## Default development flow

1. Work/local edits.
2. Focused tests while editing.
3. `pnpm qa:core` for routine checkpoints.
4. `pnpm qa:full` when a broad regression pass is warranted.
5. `pnpm qa:release` before a release candidate.
6. Commit/PR after the local/Work gate is green.

This consumes zero GitHub Actions minutes.

## GitHub workflows

Only three active workflows remain:

1. `english-release-gate.yml` — manual-only consolidated release QA.
2. `g3-d-firebase-hosting-preview.yml` — manual-only QA + Firebase preview deploy.
3. `g3-d-promote-preview-live.yml` — manual-only exact preview-to-live clone.

There are no pull-request or ordinary push triggers in these workflows.

## Historical workflows

Milestone and feature-specific workflow wrappers were removed from `.github/workflows`.
Their underlying tests remain in `tests/` and are included in the local consolidated suites where relevant.
Git history preserves the retired YAML definitions.

## Static hosting

Firebase Hosting is the active static-hosting target.
GitHub-Pages-specific staging, project-base-path rewriting, `.nojekyll`, routine artifact upload, and 30-day artifact retention are no longer part of the release gate.

The release suite verifies the actual Firebase artifact at `dist/client`, including:
- application entry point;
- branding assets;
- all five Listening MP3 files;
- English Firebase Hosting target;
- browser-local Writing contracts;
- public Firebase Web API-key allowlist;
- no direct Gemini Developer API key;
- no direct browser call to the Gemini REST endpoint.

## Safety boundaries

This refactor must not change:
- Curriculum 1.11.0;
- lesson/activity content;
- Listening audio;
- learner data;
- local-storage behavior;
- Firebase project/Web App configuration;
- App Check;
- Gemini provider behavior;
- current production Hosting content.

No deployment or merge is implied by this document.
