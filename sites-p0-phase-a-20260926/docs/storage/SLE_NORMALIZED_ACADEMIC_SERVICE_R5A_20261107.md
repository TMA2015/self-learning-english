# SLE R5a — Opt-in lesson-scoped content reader for the actual academic service

**Date:** 2026-11-07  
**Status:** NON-PRODUCTION CODE PATH + SYNTHETIC QA; original LIVE runtime remains legacy.  
**Tracking:** Issue #103, Draft R1 #104, R2 #105, Recovery V3a #106, R3b #107, V2 converter #108 and actual Chromium Recovery R4b #109.

## Verified architectural problem

The legacy \`academicService\` repeatedly resolves \`getPackage(attempt.version)\` for Save, Resume, lesson display, Submit, Writing review, retake, transcript, and grading. Even with content-addressed IDB backing, materializing entire historical packages would undermine the goal of storing/retrieving only the lesson required.

## R5a changes

- \`application/academic-content-reader.ts\` adds a **targeted per-lesson** \`AcademicContentReader\` interface: \`catalog()\`, \`current(lessonId)\`, \`original(version,lessonId,packageId?)\`, \`pinCurrentForAttempt(version,lessonId)\`.
- **Legacy default:** \`legacyAcademicContentReader\` implements precisely the existing package-based behavior; all original callers of \`academicService(repo,learning,owner)\` are unaffected.
- **Opt-in normalized reader:** \`normalizedAcademicContentReader(vault)\` verifies the latest manifest header, lesson ordering and exact content revision. Historical reads require a previously pinned immutable alias and verify the saved attempt's original package ID; no silent fallback to latest. An unpinned explicit active version is allowed only for *catalog preview* with no saved attempt context.
- \`infrastructure/storage/indexeddb-lesson-revision-vault.ts\`: adds targeted read-only \`historicAlias(version,lessonId)\`; no deletion or learner-key writes.
- \`application/academic-service.ts\`: optional fourth \`contentReader\` argument. Catalog and lesson view use the targeted reader. Every existing saved attempt resolves an **original pinned revision** for Draft/Format, Listen/playback, Submit, Skip, Transcript, Writing approval and review. A new start first pins its active revision **before** writing a learner attempt (avoids two-store cross-transaction lost provenance). A retake of an old submitted attempt retains the **original** version/source.
- When the normalized reader is active, package-level legacy \`preview\`, \`importPackage\` and \`packages\` fail closed with an explicit error. This does **not** authorize importer changes and prevents pretending full cumulative package operations are still supported.
- All saved attempt field layouts and owner-scoped localStorage keys remain unchanged, as do existing submission results and source-version-dependent option ordering.

## QA using real public SLE source + synthetic attempts

\`tests/normalized-academic-service-r5a.cjs\` calls the **actual** \`academicService\` with normalized content reader, real curriculum sources 1.18.0 and 1.20.0, a strict attempts-only BrowserLocal repository that throws if \`packages()\` or \`addPackage()\` is called, and synthetic owner data. It checks:

1. 123-lesson active catalog and separate real \`REA-A1-01\` old/new content versions.
2. Save/Resume/Submit of historical Reading with its old keys, result history and old-version retake (never silently retargeting).
3. New current Grammar attempt pins the original source, survives simulated service reload, submits correct deterministic answers.
4. Historical Writing review + approval against its original rubric; historical Listening transcript tied to original lesson text.
5. Missing old alias fails closed with learner state untouched, wrong package ID fails closed.
6. Legacy package importer remains explicitly disabled only for normalized mode; **zero** cumulative package reads/writes.

The test intentionally uses a mock normalized vault because real IDB transactions and actual Chromium browser Recovery are separately exercised by R2 and R4b. It does not prove iPad.

## Known limitations and NO-GO production gate

- **Not wired to LIVE:** \`infrastructure/browser/local-runtime.ts\` continues to instantiate the legacy repository and call the default 3-argument academic service. No feature flag is enabled, no Firebase deploy or browser user-data migration.
- Catalog currently builds a metadata projection from a verified normalized IDB snapshot. Profile and cache this for large catalogs; optimize targeted metadata index and abort on races before production. No repeated *stored* cumulative release source is constructed.
- Real Listening historical audio asset identities must be verified (asset hash/manifest), not just transcript text. The current audio-manifest logic is retained for compatibility but **not** approved as historical audio proof. Preserve playback guard.
- V2 original recovery, checksum and V3 empty-profile restore must be integrated and verified in the real learner-facing app. Actual Safari/iPad acceptance still required; 73 original family attempts not accessed here.
- \`derivePracticeProgress(attempts,packages)\` still assumes cumulative packages; update to normalized revision/source read-only progress in a later R5 gate. Do not mark full R5 complete yet.
- 150 lesson validator cap and 5-MB cumulative file limit are separate gates: 250-lesson IDB fixture does **not** prove true importer/service scaling or pedagogy approval.
- Security/semantics: package \`digest\` values come from trusted upstream content; content hash detects corruption, not deliberate forgery. Preserve SLE-MASTER-001 and NotebookLM academic review authority.

**Acceptance:** exact-head PR QA must pass, including original \`academic.cjs\` and \`version-aware-attempt-ux.cjs\`; keep Draft, do NOT merge/deploy until full application and real iPad Recovery gates pass.
