# P0 Phase A — 2026-09-26 UTC

## Source and artifact
Reference: docs/P0_BUILD_ONLY.md at GitHub blob 30c88e8c217e4c64f7fea270b0ff52f49175ce4b.
Source baseline: GitHub snapshot 6e4688ab40357cf1ea2a457c7e8e33baf954a6d1, nested application directory. P0 source verified against its SHA-256 manifest. Production identity restored from snapshot; temporary QA routes moved to non-executable tests/p0-local-only fixtures; QA administrator configuration cleared. No instructional content, assessment engine or architecture changed.

Artifact: .sites-runtime/p0-phase-a-20260926.tar.gz
SHA-256: d60027d83f85bea2954b594763d28f7c9f814a482666ec47608351e796f1f446
Size: 1,132,027 bytes.
Built and packaged using bundled Sites build-site.mjs and package-site.mjs. No source push or saved/deployed Site version was created.

## Checks actually performed
- Clean production build succeeded; QA routes absent from route output.
- Archive inspection: Foundation API route and P0 diagnostic validation present; batch_a_role and batch-a-check absent from JavaScript.
- Both Foundation MP3 assets and additive migrations 0004/0005 included in archive (not applied).
- Managed preview started successfully. Its D1 configuration has placeholder database ID 00000000-0000-4000-8000-000000000000, no remote binding. Local-only Wrangler schema query confirmed existing isolated test tables, including academic and Assisted Review tables. No migrations needed or run during this task.
- Browser: Dashboard renders original Writing workflow and Foundation entry point. Opening Foundation displays Sign in to use your learning path.

## First blocker / incomplete checks
Trusted Sites identity is not supplied to this managed preview. The former synthetic cookie override has intentionally been removed. Therefore an authenticated learner flow cannot proceed in this environment as configured. Catalog count, Grammar answer/feedback/reload, Listening gate, and authenticated Assisted Review were NOT passed in this run. No replacement authentication bypass was introduced. Previous test results are not substituted for this run.
Preview stopped after blocker; package retained. Production D1 was not connected or queried, no production migrations or deployment occurred. Version 6 remains the prior rollback version, not a database backup. No claim is made about live Assessment HTTP 400 recovery.
