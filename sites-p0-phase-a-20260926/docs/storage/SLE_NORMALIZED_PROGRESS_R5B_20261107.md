# SLE R5b — source-correct, Lesson-ID-grouped practice progress

**Date:** 2026-11-07  
**Status:** NON-PRODUCTION READ-ONLY PROJECTION + SYNTHETIC QA.  
**Depends on:** R5a Draft #110, R1–R4b drafts, Issue #103.

## Owner requirement

Lesson IDs are stable between content releases. The same lesson should appear as one learning unit in progress. However revised answer keys, questions or rubrics must not retroactively change past grades. Current \`derivePracticeProgress(attempts,packages)\` requires cumulative curriculum packages and counts distinct questions by \`packageId + releaseVersion + questionId\`, which can count identical questions twice when a curriculum release merely adds unrelated lessons.

## R5b implementation

- \`domain/practice-progress.ts\` preserves the existing default behavior and all old call sites; it adds a **fifth optional question-identity callback**. The default remains \`packageId/version/questionId\`.
- \`domain/revision-practice-progress.ts\` accepts a previously **verified** normalized IndexedDB snapshot (latest manifest, immutable historical aliases, hash-identified original lessons) and original saved \`AcademicAttempt[]\`. It constructs only **transient metadata** needed for practice summaries: lesson IDs, titles, module and activity skill tags. No cumulative legacy package contents or answer keys are persisted or read.
- Every saved attempt must resolve its immutable \`(packageId,version,lessonId) -> revisionHash\`. Absent or altered original sources fail closed; no invisible substitution with current lesson.
- Aggregation counts saved results exactly as before, with distinct/repeated question identity \`lessonId + revisionHash + questionId\`. Thus an unchanged question across two cumulative releases remains one distinct original question; changed lesson revisions remain separate.
- Additional \`lessonProgress\` rows group attempts under one stable Lesson ID, showing counts for started/submitted, correct/total, revision count and last source/version; this is **practice history**, not CEFR mastery.
- Original scoring, Writing review status, older history, timestamps, stored answer strings and course progression are never changed.

## Test

\`tests/revision-practice-progress-r5b.cjs\` uses actual publicly versioned curriculum 1.18.0 and 1.20.0 and fake attempt results:

- Grammar \`GRA-A1-01\` is identical across both versions; two wrong answers to the same question create two answers but **one** distinct source revision and one repeated-mistake group.
- Reading \`REA-A1-01\` genuinely changed; its identical question ID in old and new releases is **not** incorrectly conflated.
- One Writing draft appears in the same Lesson ID grouping without being counted as submitted or graded.
- Missing/wrong historical aliases cause a safe error; saved attempts are byte-identical before/after.
- Legacy \`derivePracticeProgress\` remains compatible with all existing tests and default call sites.

## NO-GO gates still open

1. Wire the normalized academic service + this projection into a separately gated application runtime after full V2↔V3 backup and Safari acceptance. This Draft does not change LIVE route \`localPracticeProgress()\`.
2. Optimize metadata access for 250+ lessons (avoid repeatedly loading every authored blob for only catalog/progress metadata).
3. Real browser correctness, two-tab races, iPad Safari, real family 73/73 scores/backups and free-first offline behavior.
4. Source-specific audio identity for historical Listening; 150-lesson importer cap and 5-MB file gate; Academic NotebookLM approval on future content changes.

**Never merge/deploy this Draft by itself.**
