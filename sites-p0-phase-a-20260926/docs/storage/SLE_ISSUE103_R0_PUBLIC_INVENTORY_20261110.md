# Issue #103 — R0 read-only public curriculum inventory

**Date:** 2026-11-10  
**Status:** RESEARCH ONLY / SYNTHETIC SOURCE INVENTORY / NO RELEASE  
**Authority:** SLE-MASTER-001 on `main`; this is supporting technical evidence, not a new project policy.  
**Tracking:** Issue #103; non-production Draft PRs #104–#111; academic candidate PR #127 remains separate and unmerged.

## Goal and scope

Measure how much identical lesson and rubric content is repeated across public, cumulative curriculum sources `1.23.0`, `1.24.0`, `1.25.0`, and estimate the *serialization* footprint of three representations before authorizing any normalized-store rollout.

Run `node scripts/storage-r0-public-inventory.cjs` from the existing application directory. The program reads **only committed public curriculum JSON files**, creates 73 synthetic attempt references (52 scored, 21 drafts), and writes a JSON report **to standard output only**. `tests/storage-r0-public-inventory.cjs` checks source immutability, hash stability, original rubric sensitivity and failure when a rubric is missing.

## Three representations (the values are estimates, not actual device usage)

1. **Three full cumulative sources:** all three unchanged source objects with version metadata; equivalent JSON projection without runtime bundle caches.
2. **Reference-aware V2 projection:** the latest full source and five synthetic historical Lesson IDs per earlier version, retaining the original older release headers and full rubric dictionaries. This is a *projection of the current V2 format*, not a call to production compaction.
3. **Normalized revision projection:** latest release header + ordered `lessonId -> revision` manifest, unique canonical SHA-256 blobs containing the complete lesson and referenced rubric, and historical `(version,lessonId,packageId,digest)` aliases. This mirrors the proposed R1 concept without importing its unmerged code.

The `*Utf16` counters calculate `2 × JSON.stringify(value).length`, an approximate raw JavaScript string footprint. They do not include per-key browser metadata, IndexedDB database pages, quota accounting, browser eviction, runtime cache duplication, backup-file bytes, MP3 bodies or any learner keys. A **negative V2 delta is valid** and must be reported rather than hidden: small histories can make normalization metadata more expensive than V2.

Hash identity matches the R1 design: SHA-256 of canonical `{lesson, rubrics: referencedRubrics}`, where JSON keys are recursively sorted and the full authored lesson, keys, feedback and available source metadata are retained. This is not yet proof of historical **binary audio** identity. Real audio SHA/media provenance remains a separate release gate.

## Fixture and preservation limits

The synthetic fixture deliberately distributes 73 attempts across 3 source versions and five existing Lesson IDs; it does not reflect the family’s actual old version distribution. The inventory never opens real Recovery V2/V3 files, Safari/Chromium profiles, IndexedDB, localStorage, Firebase, hosting or learner records. It never writes or deletes curriculum. The reporter’s 73 references are not real history or CEFR evidence.

Validation must ensure: 73 attempts/52 scored/21 drafts; 15 distinct `(version,Lesson ID)` aliases in this fixture; original committed curriculum bytes unchanged; nonzero duplicates across cumulative versions; changed prompt/rubric changes a revision hash; missing original rubric fails closed; all reported size deltas are explicit and signed.

## Release boundary / next steps

R0 is evidence only, not permission for R1–R5 migration. Before any normalized runtime switch, reconcile the stacked Drafts #104–#111, close source-level audio identity gaps, finish V2→V3 portable Recovery including interrupted-write and rollback safety, test true Safari/IDB quota and mixed-version history in disposable profiles, and secure owner approval.

**Do not merge, import, deploy, change LIVE, clear any device history, or upload the family’s private Recovery.** Candidate v1.26.0 in Draft #127 is intentionally excluded from this main-based R0 inventory; it can be measured in a later separately reconciled revision after the candidate is accepted.
