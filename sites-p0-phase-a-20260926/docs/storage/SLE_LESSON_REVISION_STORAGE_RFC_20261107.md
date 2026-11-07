# SLE storage RFC — stable Lesson ID + content-addressed revision store (R1)

**Date:** 2026-11-07  
**Status:** PROPOSAL + TESTABLE PURE-DOMAIN PROTOTYPE; not production-integrated, not migrated, not owner iPad verified.  
**Tracking:** Issue #103; coordinate P0 Issue #89 and existing non-production hybrid IndexedDB Draft PR #101.  
**Normative baseline:** Effective SLE-MASTER-001, explicit owner approvals, V2 Recovery and learner-data protections remain authoritative. This RFC does not amend them.

## Owner question and verified diagnosis

The owner asks why many old curriculum versions remain and correctly proposes one stable ID per lesson. The current actual architecture is cumulative-package-oriented:

- \`domain/academic.ts\` stores \`AcademicAttempt{packageId,version,lessonId,...}\`; old grades, draft answers, option orders and evidence are tied to the original release version.
- \`application/academic-service.ts\` uses \`getPackage(a.version)\` to resolve old questions, answer keys, Writing rubrics, Listening transcripts and review. Merely replacing with the latest lesson would change the meaning of an old scored answer.
- \`domain/storage-retention.ts\` V2 is already reference-aware: it does **not** always retain every full old release. It keeps the latest full package and only old versioned lessons with saved attempts. However repeated **identical lesson objects** under different source release versions are still repeated, as are release metadata and references.
- Moving these full/reduced packages from localStorage to IndexedDB helps Safari quota, but does not normalize the source representation. Issue #89 has a separate 150-lesson validator cap and 5-MB input cap.
- The family's restored 73 attempts are confidential device data. No raw Recovery file belongs in GitHub or QA fixtures.

## Options compared

| Option | Benefit | Critical problem | Decision |
|---|---|---|---|
| A. Retain every cumulative release | Easy exact history | Duplicates most lessons with every release | Reject long term |
| B. Retain latest package + old referenced lessons (current V2) | Preserves old grading; already deployed | Cross-version identical lesson and release headers remain duplicated | Short-term bridge |
| C. Store just latest Lesson ID | Minimum content size | Breaks old drafts/graded source and historical rubric semantics | Reject |
| D. IndexedDB keyed by curriculum version (Draft #101) | Less constrained than localStorage; staged safety | Does not remove cross-version duplication | Keep as temporary staging |
| E. Network-only content from hosting/CDN | No large browser copy | Offline failures, historical disappearing content, unreliable portable backup | Optional delivery, not source of truth |
| F. **Lesson ID + immutable content hash + version aliases** | Actual dedup, old grade integrity, incremental updates | More complex resolver/backup/migration | **Preferred target** |

## Semantic model: identity ≠ immutable revision

- **Lesson ID**: stable curricular identity. A new, genuinely different lesson receives a new ID. Same ID can have subsequent approved revisions.
- **Activity ID**: stable only while the assessed item remains meaningfully the same. Material content/answer changes require a new revision of the enclosing lesson, and may require a new activity ID under content-authoring rules.
- **Lesson revision fingerprint**: SHA-256 of canonical JSON of **the complete authored lesson PLUS every referenced rubric**. This includes activities, answer keys, explanations, reading passages, source audio transcript/metadata, and relevant scoring rubric. *Hash a validated source, not an untrusted edit.* Different grading rubric for the same Lesson ID **must create a different revision**.
- **Active catalog**: lightweight metadata for the latest approved release, including its original course ordering and a mapping \`lessonId -> revisionHash\`. Only one current full manifest.
- **Historical aliases**: minimal entries \`{oldReleaseVersion,lessonId,originalPackageId,originalDigest,revisionHash}\` for versions actually referenced by saved attempts; no other old lesson bodies need be retained once backup-gated cleanup is proved.
- **Unique revision blobs**: one complete content blob for each unique revision, even if 12 curriculum releases reference it.
- **Attempts**: retain existing \`version\`, \`packageId\`, \`lessonId\`, \`id\`, \`rootId\`, answers, scored results, original option order, playback state, Writing review, evidence and timestamps byte-identically. The alias resolver maps the old identity to the original blob, without having to rewrite learner records.
- **New work**: a new attempt uses the currently published revision; an already started attempt resumes its original revision. A retake of a previous submitted attempt must define/label explicit *original-version retake* vs *new-current-revision attempt* instead of silently changing the previous source. No historical auto-regrading.

### Example (illustrative, not actual family data)

Releases v1, v2, v3 each include \`GRA-A2-01\`; the actual lesson body never changed. All three aliases resolve to **one** blob. Release v3 adds \`REA-B1-07\`: only that new blob is added. Later a Writing rubric changes for \`WRI-A2-01\`: one *new* revision is saved, and old attempts continue resolving to their original rubric.

### Data shapes (conceptual)

- \`activeManifest\`: current release version, package digest, metadata, ordered \`[{lessonId,revisionHash}]\`.
- \`revisions[revisionHash]\`: validated \`{lesson,referencedRubrics}\` snapshot.
- \`aliases[version+lessonId]\`: revision hash and immutable original release provenance; only for referenced past attempts.
- \`attempts\`: unchanged owner-scoped durable learner records until a separately approved data-storage migration.
- \`recoveryV3\`: content blobs + active manifest + aliases + learner records + checksums, self-contained offline; V2 import supported.

## R1 implementation in this Draft PR

Files: \`domain/lesson-revision-plan.ts\` (pure converter), \`tests/lesson-revision-plan.cjs\` (synthetic test), registered in the existing \`qa:core\`/full list.

R1 deliberately:

1. Accepts only **already reconciled/trusted release records** (source authentication remains upstream of the converter).
2. Builds SHA-256 for each current lesson, storing identical bodies once. Includes referenced rubrics in the hash and blob.
3. Records only old \`(version,lessonId)\` aliases needed by actual attempt references.
4. Fails on missing source, duplicate version/lesson, old package-ID mismatch, missing referenced rubric, invalid latest archive or collision.
5. Never mutates source packages or attempt objects; never accesses localStorage/IDB.
6. Does not assert compression numbers from the actual iPad; reduction is content-dependent and must be measured before rollout.

R1 is **NOT** a complete browser repository, an exporter, a historical-grade migration or a LIVE deployment. The current V2 path remains unchanged.

## Mandatory future gates (do in this order)

**R2 — normalized IDB storage & resolver**  
Keep the existing Draft #101 as a non-destructive bridge. Implement IDB object stores for blobs, active manifest and aliases. Atomic readback checks, hash-on-read verification, quota/blocked/eviction failure, cross-tab contention and rollback. No historical source deletion in this step. Old \`getPackage(version)\` semantics must be preserved by a compatibility resolver; do not copy full reconstructed historic packages back into localStorage.

**R3 — complete portable Recovery**  
Build V3 SHA-verified export/preview/restore spanning both storage systems. Proof that *all* owner-scoped saved attempts resolve to original full lesson+rubric+audio provenance. Retain V2 compatibility and deny incomplete backups. Use a 73-attempt-shaped **synthetic** fixture including scored/started attempts, Writing rubric and Listening sources. Restore only to disposable empty profile; cover interrupted transaction, quota and stale backup detection. Do not depend on external network content for offline restore.

**R4 — safe migration**  
Two-phase additive copy first. Reconcile V2 source union, compute hashes/aliases; check old and new resolvers for every saved \`(version,lessonId)\`. Download and reselect a complete backup, confirm SHA, verify full restore in disposable profile, and **only with explicit owner acceptance** retire old redundant source keys. No automatic clearing of learner data. Never assume atomicity across IDB and localStorage; implement interruption markers and idempotent recovery.

**R5 — product QA & scaling**  
Check Save/Resume/Submit, retakes, prior explanations, rubric-based adult approvals, audio transcript provenance, progress grouped by Lesson ID, and the 123-lesson catalog. Test synthetic 200/250 cumulative lessons independently of the 150-lesson validator + 5-MB upload caps; fix those caps only with evidenced importer/UI/memory QA. Then real iPad Safari tests and authorized release.

## Important limits and follow-ups

- The fingerprint uses **full authored lesson + referenced rubric**, so cosmetic edits also yield a new revision. This is conservative and safe. Later optional semantic/content splitting needs separate academic rules; never manually declare materially different answer keys equivalent.
- Historical media integrity requires either bundled immutable audio assets or a verified content/media manifest; text transcript alone is **not** proof of the original audio. Add media hashes before R3.
- Release provenance remains useful for grading-related code that checks old \`version\` values. Never rewrite or synthesize historical \`AcademicAttempt.version\`.
- Current \`AcademicRepository.packages()\` exposes whole cumulative packages. A future revision resolver must avoid repeated full-package reconstruction in memory on every access; migrate service APIs deliberately and test all call sites.
- Browser storage, including IndexedDB, may be evicted; portable backup and a clearly displayed last verified backup status remain mandatory. No claims of guaranteed permanence or free unlimited storage.
- This is technical redesign, not an academic assertion: NotebookLM stays the independent academic review authority for changed teaching content, not for browser storage transaction correctness.

**R1 verdict required:** PASS only when the exact PR-head QA proves all synthetic source-integrity cases, with Safari and LIVE explicitly marked NOT_TESTED. No merge into production, no release marker.
