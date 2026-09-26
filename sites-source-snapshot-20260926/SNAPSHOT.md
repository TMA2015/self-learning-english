# Sites application source snapshot — 2026-09-26

This is the current working source, including unfinished P0 recovery and the previously unpublished Academic batch. It is a backup, not a completed or deployed repair. No build, application test, refactor or deployment was performed for this backup.

The GitHub repository's existing root files, academic content and docs are preserved. This application lives in a separate snapshot directory on branch `sites-source-snapshot-20260926`.

Includes application source, lockfile, portable content, original 12-week Writing curriculum, schema, all migrations, provider interfaces, review code and technical documentation. Read P0_RECOVERY.md for unfinished work; it documents activity before this backup request. Deployment-related descriptions there are intent, not proof of deployment.

Privacy exclusions: runtime .env files, secrets, tokens, Git metadata/history, runtime caches/logs, local D1/SQLite databases and learner records, recordings, build artifacts, dependencies and tsconfig.tsbuildinfo. .env.example contains empty credentials only. Static Foundation MP3 files are instructional synthetic audio, not learner recordings. The migration INSERT is instructional content only.

Local-only P0 UI/API fixtures are preserved verbatim as non-executable `.fixture.txt` files under tests/p0-local-only. The temporary identity override is retained there as identity.fixture.txt; app/api/identity.ts uses the existing trusted identity implementation from the saved source baseline. No working checkout files were changed by this backup. Other product source includes all current uncommitted changes.

Baseline Sites source commit: 99aeccfb03320dc128ec040a4987de264f36b246. Working changes are included in this snapshot; the baseline alone is not the snapshot.
