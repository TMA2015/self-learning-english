# Checks

Self-Learning English uses a **CI-free-first** QA model for the private repository.

Run from `sites-p0-phase-a-20260926/`:

```sh
pnpm qa:core
pnpm qa:full
pnpm qa:release
```

- `qa:core` runs the high-value daily regression set without building.
- `qa:full` runs the preserved historical/current regression set without GitHub-hosted Actions.
- `qa:release` runs full QA, TypeScript, a Firebase Hosting static build, audio/static-asset checks, and browser-bundle secret/direct-Gemini-call checks.

Individual tests remain available under `tests/`. Retiring a historical workflow does **not** retire its underlying tests.

`run.cjs` still compiles domain/application/provider contracts into ignored local test output and runs adaptive simulations and portability contracts without the Sites runtime.

Administrator tools: Parent View → Administrator / developer tools.
Missing `ADMIN_EMAILS` grants no administrator access. The production owner is configured separately in server environment settings; no role is granted by UI state.
