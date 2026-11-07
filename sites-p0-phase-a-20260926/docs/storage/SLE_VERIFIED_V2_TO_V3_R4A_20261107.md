# SLE R4a — Verified V2 → V3 offline Recovery conversion

**Date:** 2026-11-07  
**Status:** PURE READ-ONLY CONVERTER AND SYNTHETIC TEST; no live app/owner iPad change.  
**Tracking:** Issue #103; R1 #104, R2 #105, V3a #106, Restore V3b #107.

## Rationale
The present 73 family attempts are backed by V2 complete Recovery archives. A production architecture that keeps only Lesson ID + content revision hashes must offer **a verifiable path from those V2 files**, not just make new V3 backups. Do not repeat manual Safari Restore, delete site history, or upload private attempts into GitHub.

## Design
\`infrastructure/browser/v2-to-lesson-revision-v3.ts\` is a read-only function:

1. Verify the supplied **original complete V2** using the current production \`verifyLocalRecoveryV2\` checksum, trusted key allow-list and exact historical lesson availability.
2. Read only the V2 \`academic:packages\` content record; accept full or reference-retained historic source objects; reject duplicate or missing original sources.
3. Enumerate all owner-scoped attempts; require explicit original \`packageId,version,lessonId\` to avoid inventing old grading provenance. If old legacy attempts lack packageId, **stop** for a separately reviewed compatibility adapter.
4. Run the R1 normalized source converter: SHA-256 of each complete authored lesson and referenced grading rubrics. Identical lesson bodies across release versions share one blob; truly revised old lessons retain distinct hashes and old-grade aliases.
5. Create a self-contained V3 portable JSON with current manifest, required historical aliases and unique revisions, plus byte-identical learner entry values; verify V3 checksum and every original attempt.
6. Return both original V2 and new V3 checksum/dimensions. The input V2 text is **never altered or deleted**. No browser writes, no remote upload and no automatic download.

## Reproducible QA
\`tests/verified-v2-to-v3-conversion.cjs\` uses the repository's actual approved **public curriculum sources** v1.18.0, v1.18.1, v1.20.0 together with 73 **synthetic** attempt rows (52 scored/21 started). It checks:
- Source revisions \`VOC-A1-01\` and \`REA-A1-01\` changed in 1.18.1 compared with 1.18.0, so their old original revisions must **not** be relinked to the new answer/explanation source.
- The 1.18.1 → 1.20.0 cumulative release added 14 lessons but left all previous 109 lesson objects intact; dedup should avoid their redundant copies.
- All synthetic answers, scores, review state and learner state values remain byte-identical.
- Real V2 checksum validation protects the original, and corrupted/missing-provenance backups fail closed.
- Measure actual V2/V3 serialized archive byte size and unique content revision count. These are a test fixture, **not an iPad Safari quota measurement**.

## Still NO-GO for production
- Browser import/download and disposable empty-profile Restore on **real Chromium** using real IDB transactions, then WebKit/iPad Safari.
- Prove backup re-selection and checksum verification, readback and 73/73 genuine attempts on owner's iPad; no forced restore to an occupied profile.
- V2 legacy attempts missing packageId require a conservative manual reconciliation plan, not silent assumption.
- Historical Listening audio asset digests and continuous revision-aware playback.
- R4 source-service adapter: move catalog/start/draft/submit/review from \`packages()\` to targeted \`lessonId,revisionHash\` resolution, while preserving old \`AcademicAttempt.version\` provenance.
- UI constraints, browser storage health, 200/250 actual importer (150-lesson cap and 5-MB upload gate), owner authorization and protected English-only deploy policy.

**Never merge this research PR or clear browser storage without all remaining acceptance gates.**
