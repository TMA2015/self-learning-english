# G Learning — Dated Project Status (2026-09-28)
Ephemeral checkpoint. Refresh GitHub and Sites before any release; never treat this progress record as a permanent master rule.

- Production: last Work-reported Site v20, actual deployed Sites source 7ffc690ba63461322eff7d259b483531c224e053 (requires fresh confirmation before deploy).
- Curriculum accepted/imported: version 1.4.0; 45 lessons, 323 activities; canonical SHA256 70eb0d13477a647ae2ab0ca5b11bfd1f52a99772f1ca206d701718d08ffb56da.
- Academic audit/Batch05 plan: Draft PR #19, separate from My Courses.
- Course Architecture: Draft PR #20, docs-only checkpoint af05a4d429647d906cb5f533294c7c5f4872c830.
- My Courses v21-P1: Draft PR #21, last observed GitHub head 25d5f41f4962c8913bee96a2289e7a6a4ad0a35c. Work reported saved, undeployed Sites v24, but exact staging/full GitHub synchronization needs verification. Dedicated CI last inspected FAILED due to missing v20 route Git blob 0d45ba9b9f4f3cb5826f874314405754b285e378; other four workflows passed. Do not claim production-build result in skipped dedicated job. Fix portable rollback fixture, rerun CI, verify source-only rollback and owner QA before separate release approval.
- Batch05 review-only Curriculum 1.5.0: 45 lessons / 359 activities, +36 (24 single-choice, 11 short-answer, 1 Writing). All 36 latest independent Gemini reviews PASS. Correct-option positions balanced A/B/C/D = 6 each with exact correct-answer text preserved. Canonical SHA256 9d8e2476f7083d94e6267d2b46e26c5ebbe210a5985b97a711d9a4d7d86b72f0. NOT imported, NOT authorized for Preview or deploy.

Next distinct gates: (1) P1 CI/rollback, stage/source reconciliation and owner QA; (2) Batch05 importer compatibility, separate owner Preview approval, then separate Import approval; (3) future content/coverage packets for Gemini. Do not merge PR19–21 or modify production while preparing governance documents.