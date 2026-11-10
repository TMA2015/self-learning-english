# SLE Issue #103 — R4c cross-format V2→V3 browser recovery acceptance

**Status:** research QA only, Draft; no release, no migration  
**Date:** 2026-11-10  
**Authority:** Current SLE-MASTER-001 on `main`. This file is evidence, not an additional active standard.

## Why this test is necessary

Draft #108 proves original-format V2→V3 transformation with public curriculum and 73 synthetic attempts in Node. Draft #109 independently proves normalized V3 export/restore with real Chromium IndexedDB using a generated synthetic source. Neither individually demonstrates an end-to-end restore **starting with an original-format V2 backup** inside a real browser.

R4c exercises that missing boundary. It is based on the unmerged research branch #111 and shares its earlier R1–R5b experimental code. This PR is therefore **stacked research**, not a direct main-ready change; never merge the combined diff into production without separate reconciliation.

## Exact scope

- Uses *committed public* curriculum sources `1.18.0`, `1.18.1`, `1.20.0`; derives deterministic source checksums. No real user file is accessed.
- Constructs an authentic **V2 file-format** checksum from 3 cumulative public versions and exactly **73 synthetic attempts**: 52 marked scored, 21 started. It includes invented Writing state/reviews and course-selection state; this is **not a real V2 export from an iPad**.
- Verifies original V2 archive with the existing production-format parser; converts via the unmerged read-only V2→V3 adapter; verifies resulting V3 checksum and original values byte-for-byte.
- Uses real throwaway localhost Chromium profile and IndexedDB, initially empty. Proves invalid original V2 checksum is rejected; occupied-profile restore preview is rejected without overwriting the synthetic sentinel.
- Performs confirmed restore only into empty **disposable** profile. Checks the exact serialized attempts, Writing/review and course-state entries; requires the old cumulative package key is not recreated.
- Reads original historic Vocabulary, Reading and Writing lesson/rubric content from IndexedDB aliases; distinguishes original changed lessons from the latest revision; re-exports a verified complete V3.
- Fully closes/reopens a separate Chromium process and checks that 123 active public lessons, historical aliases, serialized attempts and verified V3 export remain available.

The test is registered as one additional test under the existing `qa:core`/`qa:full`. It does not create workflows, alter web app runtime, change current LIVE curriculum, enable background migration, or touch Firebase.

## Explicit non-claims / blockers

- SHA verifies integrity of archived JSON, but it is **not a cryptographic signature proving the real provenance of the original learner data**.
- Real **MP3 binary digests and source-specific audio provenance** are not verified by this test. Transcript persistence is not evidence of actual audio playback.
- No true iPad/Safari quota, IDB eviction, blocked-versionchange, Safari lifecycle, multitab race or recovery from interleaved dual-store failures is proved here.
- No private family Recovery V2 or original 73 iPad attempt records were opened. The generated 73 rows and feedback are fake.
- No production UI entrypoint to V3, no owner acceptance, no approval for source deletion or auto-migration.

**Release status stays NO_GO.** Maintain the existing V2 route, original media, learner data and v1.25 LIVE. Reconcile the stacked research code and complete media, Safari, interruption and owner-device gates before considering LIVE changes.
