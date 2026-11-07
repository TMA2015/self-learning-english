# SLE R4b — real Chromium disposable V3 export, restore and restart

**Date:** 2026-11-07  
**Scope:** REAL Chromium (disposable synthetic QA profile); **NO live SLE deploy, NO real iPad data**.  
**Tracking:** Issue #103; research Drafts R1 #104, R2 #105, V3a #106, V3b #107, verified V2 converter #108.

## Acceptance scenario

\`tests/normalized-recovery-real-browser-entry.ts\` runs inside a real Chromium browser (not a fake IDB implementation), bundled by the existing Vite test harness \`tests/normalized-recovery-real-browser.cjs\`:

1. Construct an entirely synthetic 250-lesson current curriculum, one older Writing revision and **73 synthetic learner attempts** (52 submitted scores, 21 drafts). No family data is opened or committed.
2. Run \`planLessonRevisions\` and write normalized blobs/aliases to real IndexedDB; store raw fake attempt strings and Writing state in localStorage.
3. Execute the V3 browser exporter with cross-store readback, verify SHA-256 and original-source closure, confirm originals are unchanged.
4. **Only in this disposable test profile**, delete its synthetic test IDB database and two test localStorage values, simulating a separate brand-new profile. This is NOT product code, not user instructions and never targets a real learner profile.
5. Call the actual V3 empty-profile preview/restore adapter using the same verified JSON archive. Verify 73 original attempt strings, Writing text and precise historic rubric; no pending marker after success; 250 latest lessons + one historic Writing blob in IDB.
6. Shut down Chromium, start a **new separate Chromium process** with the same disposable profile. Verify source persistence, exact old rubric, scores/draft bytes and absence of interrupted marker.

Synthetic quota/blocked IDB failure simulations remain in R3b tests. Missing source, missing legacy package ID, tampered backups and hash collisions remain blocked by R1–R4a tests.

## Not established

- True Safari/iPad behavior, real storage budget, WebKit eviction or real family attempt data.
- V2→V3 conversion + Restore in one fully integrated browser flow (the V2 adapter is tested separately with real public curriculum and synthetic attempt records).
- A real application content service reading targeted lesson revisions for Submit/Retake/Listening/Review instead of reconstructing cumulative historical packages.
- Historical audio media hash/rights and renderer fidelity. 
- 200/250 actual full importer (currently capped at 150), 5-MB source gate and mobile memory.
- Real backed-up iPad acceptance with original downloaded/reselected Recovery file and owner permission for any eventual cleanup.

**Release gate remains NO-GO.** Keep all changes in non-production Drafts. The prototype's test-only IndexedDB deletion is permitted exclusively because the profile holds throwaway synthetic records and is never connected to the SLE website or real user browser data.
