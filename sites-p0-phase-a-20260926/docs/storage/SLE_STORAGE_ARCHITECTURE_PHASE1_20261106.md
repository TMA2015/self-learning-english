# SLE browser storage redesign — P0 design and staged acceptance (2026-11-06)

**Status:** ENGINEERING DESIGN + NON-PRODUCTION INDEXEDDB PILOT — not an approved runtime migration or release.
**Authority:** SLE-MASTER-001 v1.2.0 (GitHub main), especially correctness, original attempt versioning, learner data preservation, immutable source, QA and transparent release states.
**Live incident:** On iPad Safari, a complete 3-content-version V2 Recovery (73 attempts, 52 scored/21 started) verified but failed at storage write; a separate verified compact V2 archive retaining the same 73 attempts and 2 content versions restored successfully. Never commit either actual private recovery file to GitHub. The live site auto-updates v1.20.0 (123 lessons) only when localStorage has headroom. Do not ask the family to clear browser data again.

## Actual storage boundary (as found in source)

| Data | Currently stored | Growth/recovery issue |
|---|---|---|
| Official current and old full curriculum package sources | `g-learning:english:v1:academic:packages` in synchronous `localStorage` | Large repeated serialized curriculum bodies compete with attempts for a small shared quota |
| Submitted and in-progress `AcademicAttempt` objects | Owner-scoped `localStorage` key(s) | Must remain immutable/version-pinned, needs accurate Save/Resume/Retake |
| Evidence, diagnostic, writing state, snapshots | Owner/learner-scoped `localStorage` | Must never be overwritten/deleted by curriculum updates |
| Complete Recovery V2 | Checksum-protected file exporting `localStorage` keys | Portable only if all source lessons needed by attempts are included; restore previously exceeded iPad quota |
| New IndexedDB prototype | Separate `g-learning-english-curriculum-vault-v1` database / `packages` store | **Not wired to the live runtime**, no attempt writes or automatic migrations |

The effective runtime is **NOT** using IndexedDB for student learning at the time of this document, regardless of outdated independent reviews that assert otherwise.

## Architecture

1. **Separate content from learner data.** Persist immutable curriculum source documents, not their repeatedly derived `ContentBundle`, in IndexedDB by `version` with digest conflict guard. Preserve localStorage learner attempts/state until an independently safe migration is approved.
2. **No destructive migration.** Before reading or removing any legacy package key, require a complete V2 Recovery export that has passed verification. Copy legacy packages to IndexedDB, read back original version/digest and referenced lesson IDs, and pass an exact old-attempt-to-source cross-check **across all owner-scoped keys**. The first stage retains legacy localStorage untouched; any later removal requires an explicit preview, consent and a verifiable portable Recovery containing IDB packages.
3. **Automatic content update:** Once the read-through adapter and backup export are integrated, place new approved cumulative versions in the vault. The site's current catalog chooses the highest valid imported/bundled version. Keep each saved attempt pinned to its original version; never regrade old attempts with new keys.
4. **Portable Recovery is mandatory:** An updated V2/V3-compatible export must gather both stores, include the exact historic lesson source for every versioned attempt, compute a checksum over the full record set, and verify the file before any cleanup. Restore into an otherwise unoccupied profile through a resumable marker/transaction strategy. On quota/transaction error, preserve original data and report a specific cause. Never silently report a partial recovery as success.
5. **Failure mode:** IndexedDB may be unavailable, transiently rejected, evicted by a browser or disabled in a private tab. The app must fail closed with actionable state and keep localStorage learner keys untouched. A content vault is not a substitute for offline backup or cloud sync.
6. **Scalability:** The existing **150-lesson validator cap** and **5,000,000-byte source limit** are separate P0/P1 gates; do not raise blindly. Test real 200/250-lesson synthetic seeds for schema, UI, grading, V2/V3 export/restore, mobile memory and audio. The pilot currently only proves that a standalone IndexedDB vault can hold synthetic 200/250-lesson content; it does **not** validate the importer, CEFR quality or real iPad quota.

## Phase gates, in order

| Gate | Pass evidence | Must not claim before gate |
|---|---|---|
| S0 — Incident backup | Owner's compacted file restored 73/73 visible attempts; original saved | History byte-for-byte compared on device; Safari quota measured |
| S1 — Isolated vault prototype | Real Chromium version writes, immutable digest, repeat/reload, nine versions and 250 synthetic lessons; zero localStorage learner-key mutations | Production adapter, migration, backup or iPad acceptance |
| S2 — Legacy read-through & one-way import | Exact historic attempt source resolution, zero deletions, crash/two-tab behavior, fallback when IDB blocked | Safe automatic removal of localStorage packages |
| S3 — Full portable recovery across stores | Real Chromium Safari-like quota failure and roundtrip for 73-attempt-shaped **synthetic fixture**, checksum, empty-profile restore, interrupted marker, real save/reload | Real iPad user-data acceptance |
| S4 — Real iPad browser QA | Owner privately exports and verifies a fresh backup, tests Save/Resume/new Submit, 123 catalog and restoring to a separate disposable empty test profile (never destructive) | End-to-end LIVE_VERIFIED/RECONCILED |
| S5 — Future 200/250 release | New schema/cap decisions, authored material QA, content manifest, right audio, storage stress, owner approval | 200+ lessons import-ready |

## Explicit current scope

This Draft PR contains only the IndexedDB immutable **content-only** vault and non-production Chromium QA. It MUST NOT be merged as a migration, does NOT read or write real student information, does NOT delete/compact any `localStorage` keys and does NOT change the deployed SLE catalog. The separately scoped PR #100 makes quota error messages truthful and regression-protects rollback; Issue #89 remains open until at least S4.

## Parallel academic work

Continue independent NotebookLM review of the four original Reading/Listening lesson enhancements on Draft PR #99 under SLE-MASTER-001 v1.2.0, and B2–C2 content development as drafts only. Do not merge an unreviewed packet or expand the live catalog while the storage migration/recovery gates are incomplete.
