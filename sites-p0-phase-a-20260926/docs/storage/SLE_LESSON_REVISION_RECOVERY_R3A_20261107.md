# SLE Recovery V3a — complete normalized lesson source export/verify prototype

**Status:** R3a PURE-DOMAIN PROTOTYPE, NOT AN APP BACKUP BUTTON, NOT A RESTORE.  
**Date:** 2026-11-07  
**Tracking:** Issue #103; R1 Draft PR #104; R2 Draft PR #105; independent release-version vault PR #101.  
**Safety:** Keep 73 real iPad attempts and original Recovery V2 files intact. This work never reads them.

## Why this is needed

The family's old iPad Recovery V2 failed to restore while carrying multiple large curriculum packages. Current source retention V2 trims old unused lesson versions but repeats unchanged lessons across release versions. R1 deduplicates exact lesson+rubric bodies. R2 persists them in IndexedDB in a separate non-production database. **Without a portable complete recovery format, merely moving content to IndexedDB could make all graded and draft history impossible to restore elsewhere.**

## Proposed self-contained V3 format

A canonical JSON document with:
- \`format = g-learning-english.lesson-revision-recovery\`, \`schemaVersion = 3\`, \`exportedAt\`;
- one latest active curriculum manifest (ordered Lesson ID → immutable revision hash);
- each historical \`(originalPackageVersion,lessonId)\` alias actually referenced by **any** saved attempt across all owners;
- every immutable revision blob reachable from the active manifest or historical aliases, stored **once**, each with the complete original lesson and referenced rubric;
- original owner-scoped learner entries, as byte-identical strings, including scored results, drafts, Writing state, learning evidence and course selections;
- SHA-256 over the canonical sorted JSON payload. This detects accidental modification/corruption, **not** cryptographic authenticity if someone intentionally replaces both content and checksum.

No old cumulative \`academic:packages\` payload is embedded. Each unchanged lesson is reused by hash. Source completeness is verified by traversing every saved attempt and matching its original \`packageId, version, lessonId\` to a valid alias and revision. Corruption, missing original grade source, unknown learner keys, duplicate owner keys, duplicate aliases and mismatched hashes **fail closed**.

The pure-domain R3a functions \`createRevisionRecoveryV3\`, \`verifyRevisionRecoveryV3\`, and \`verifiedRecoveryToPlan\` do not read, alter, delete or restore browser data.

### Automated synthetic QA
\`tests/lesson-revision-recovery-v3.cjs\` exercises:
1. Three curriculum release versions up to a 250-lesson **synthetic** active catalog.
2. **73 synthetic primary attempts** (52 scored, 21 started), plus two synthetic attempts belonging to a second owner.
3. Byte-identical saved answers, scores, Writing drafts and evidence across export/verification.
4. Differentiation between Writing rubrics where the same Lesson ID's scoring rules changed.
5. Verify checksum rejects a changed answer; a missing old alias or edited hash-identified lesson fails closed.
6. Detect a forbidden old full curriculum key and duplicate learner key.
7. Verify no-history archives keep only the 250 active revisions rather than irrelevant old rubrics.

**No real user files are committed.**

## Gates still required before real use (R3b/R4/R5)

- Read actual localStorage and IndexedDB under a stable concurrent-storage snapshot; guarantee all owner records and permitted keys are included; retry if either store changes.
- V2-to-V3 offline conversion of actual previously exported V2 Recovery files: must not modify original, must verify SHA and source completeness first. Backward compatibility must not disappear.
- A separately verified V3 file can be restored **only to an empty/disposable profile**. Specify an interruption marker and two-store commit protocol; IDB commit and localStorage set are not one transaction, so a partial failure must remain recoverable and can never appear successful.
- Export, **download and manually reselect** a portable archive; verify checksum/readback before any destructive legacy source cleanup. Preserve every existing score, attempt ID, answers, drafts, rubric, evidence, option order, audio source and date. No automatic Safari clear/reset.
- Real browser import/restore, exhausted quota, blocked IndexedDB, reloading interrupted restore, two tabs, content version upgrade and Save/Resume/new Submit with 73+ attempts synthetic; compare original learner strings byte-for-byte.
- Listening's historical audio asset must have verifiable media/source identity; transcript metadata alone does not prove audio is the same. Make a media-provenance plan before V3 is called fully portable.
- 200/250 full importer + application QA, iPad Safari validation and explicit owner production approval.

**R3a is never permission to migrate or deploy.** V2 is the sole LIVE Recovery pathway until V3b and subsequent release gates pass.
