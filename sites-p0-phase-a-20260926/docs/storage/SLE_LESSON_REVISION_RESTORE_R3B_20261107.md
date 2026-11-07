# SLE Recovery R3b — disconnected empty-profile restore and interrupted-write protocol

**Date:** 2026-11-07  
**Status:** NON-PRODUCTION SYNTHETIC PROTOCOL RESEARCH.  
**Depends on:** Issue #103, R1 #104, R2 #105, V3a #106. **Not** connected to deployed Recovery UI or real iPad.

## Implemented research adapter
\`infrastructure/browser/lesson-revision-portable-recovery.ts\` exposes:

- \`exportNormalizedBrowserRecoveryV3\`: read-only, double-samples all English localStorage keys and normalized IDB vault, verifies those views did not change before/after export, creates a V3 source-complete checksum file. Rejects pending V2/V3 interrupted-restore markers. **Does not download or save files for the user**.
- \`previewNormalizedV3Restore\`: checks checksum and self-contained original grade source, requires an *empty* learner profile or an **identical verified file** matching a pending interrupted marker; rejects other saved user keys. Returns a state-bound preview token without writing.
- \`restoreNormalizedV3\`: requires explicit confirmation and current token; writes a marker first; atomically installs normalized source in IDB; then writes each learner key as its **original raw string**; verifies all keys and complete source closure; removes the marker only after verified success. On quota/IDB failure attempts to roll back newly written learner keys and deliberately **retains the marker** so a later verified retry does not falsely claim success.

These API functions are **not wired to production and not called from the website**. They are acceptance prototypes for the eventual V3 restore UI.

### Why we cannot simply overwrite all old versions
Even in normalized storage, old grading remains tied to the precise original lesson revision, including question/answer keys, referenced rubric and original release provenance. A saved score may not be reinterpreted using an updated lesson. The normalized format deduplicates identical lesson bodies without deleting historical evidence.

## Synthetic QA
\`tests/lesson-revision-restore-v3b.cjs\` builds 73 fake attempts (52 scored + 21 drafts), old/new Writing rubrics and source aliases, a fake localStorage with simulated quota, a fake atomic IDB vault, and tests:

1. Complete source export and checksum validation without mutating owner bytes.
2. Preview/confirm into an isolated empty profile, preserving attempt data exactly.
3. Reject an already occupied profile.
4. Quota failure during restore: no false success; marker persists; exact-file retry succeeds after space becomes available.
5. IDB failure during restore: marker persists; exact-file retry succeeds.
6. Reject edited archives before applying data.

## Still required before production (NO-GO)
- Actual disposable **browser** restore using real Chromium IndexedDB and Safari, not mocks. No public website writes.
- Interrupted restore with process termination and two-tab contention; atomicity across IDB and localStorage is impossible, so the live UX must not show partial success.
- Existing V2 Recovery imports, checksum verification and a proven V2→V3 conversion path without deleting original V2 files.
- Real historical audio provenance and source asset verification.
- Stable owner-scoped backup download + reselect/checksum/restore on a separate empty profile. Then 73/73 actual real iPad attempts and all scores/drafts verified without manual Safari cleanup.
- Actual importer QA for the 200/250-lesson cap and 5-MB source limit; approved SLE-MASTER and content review.
- App service integration using targeted Lesson ID resolution and progress grouping, full release QA, mobile visual QA and explicit authorized English-only production release.

**Safety:** Never merge/deploy an R3b research prototype alone. Keep all R1/R2/R3 Drafts separate until reviewed/reconciled; old V2 remains the LIVE backup mechanism.
