# SLE R2 — isolated normalized IndexedDB lesson vault

**Status:** ENGINEERING PROTOTYPE / NON-PRODUCTION / NO LEARNER-MIGRATION.  
**Date:** 2026-11-07  
**Upstream:** Issue #103, Draft R1 PR #104, Design RFC \`SLE_LESSON_REVISION_STORAGE_RFC_20261107.md\`.  
**Coordination:** Existing package-version IDB pilot PR #101 remains independent and must not be silently replaced on LIVE.

## Change
New \`infrastructure/storage/indexeddb-lesson-revision-vault.ts\`, stored in a **distinct** named database \`g-learning-english-lesson-revisions-r2\`, with stores:

- \`revision-blobs\`, keyed by the SHA-256 fingerprint of complete lesson plus referenced rubric.
- \`historic-aliases\`, keyed by \`[originalPackageVersion,lessonId]\`, containing the immutable original version/digest provenance and its revision pointer.
- \`active-manifest\`, a single current published release header + ordered \`lessonId -> revision\` map.

A single IDB readwrite transaction atomically adds any missing immutable blobs and aliases and advances the active manifest. Existing revision hash payload conflicts, conflicting old alias, same-version manifest mutation and version downgrade abort without partially committing. All candidate hashes are validated before writes. Resolve current or original history by one targeted blob; do not reconstruct all release documents for each lesson view.

The R2 vault has **no delete/clear API** and no read/write access to any learner localStorage key; runtime flag and production catalog are unchanged.

## Browser test
\`tests/lesson-revision-idb-browser.cjs\` and \`tests/lesson-revision-idb-browser-entry.ts\` use a disposable real Chromium profile. In the first browser process:

1. Write an artificial learner attempt key as a byte-exact sentinel.
2. Install a 2-lesson baseline, then a 3-lesson newer curriculum. The unchanged Grammar lesson is represented by one blob, while revised Writing rubric produces two distinct revisions.
3. Verify historic Writing rubric and active rubric resolve to their correct distinct original snapshots; new release does not change the saved learner key.
4. Prove same-release install is idempotent, input hash tampering fails closed, and older manifest cannot downgrade.
5. Import a **synthetic** 250-lesson version with 247 new lessons. The expected normalized store contains 251 blobs (250 current + 1 old Writing rubric) and 3 historical aliases — no full repeated cumulative source copies.
6. Attempt a conflicting historical alias; require whole-transaction rollback and no orphan blob.

In a **separate Chromium process**, verify the 250-lesson active manifest, original historic rubric, 251 blobs and exact unchanged localStorage key all persist. Missing old revisions must fail closed.

GitHub \`qa:core\`/full runs the browser gate. A green CI proves synthetic Chromium persistence **only**.

## Explicit missing gates
- Real iPad Safari / WebKit: **NOT_TESTED**.
- Schema-authenticated production source conversion and 73 real attempts: **NOT_TESTED**; protect private owner data.
- Full portable Recovery V3 with *both* IDB and learner state; V2 backward-compat restore; encrypted/imported histories; missing/changed audio provenance: **NOT_IMPLEMENTED**.
- Multi-owner orphan reachability, checksum-protected export/restore, transaction interruption and quota cases: **NOT_TESTED**.
- Full importer QA with 200/250 lessons, Content authoring/NotebookLM approvals, 150 lesson cap removal: **NOT_TESTED**.
- LIVE/production runtime wiring, mobile keyboard UX, Firebase release: **NOT_STARTED**.

**Release policy:** stay Draft and do not merge/deploy. Do not automatically delete any old curriculum source or learner data. R3 portable Recovery and R4 full integration + Safari acceptance must pass before any storage migration.
