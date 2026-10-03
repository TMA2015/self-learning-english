# Importer Capacity 150 — Architecture Change

## Goal

Remove temporary curriculum-size ceilings that are already blocking content-first development while preserving safety checks for IDs, schema, immutable versions, preview-before-import and learner-state isolation.

## Raised ceilings

- cumulative curriculum lessons: **60 -> 150**
- course sequence validation: **100 -> 150 entries**
- lesson numeric suffix: **2 digits -> 2 or 3 digits**
- cumulative curriculum package: **1 MB -> 5 MB**
- admin import request envelope: **~1.2 MB -> 6 MB**
- browser file selector: **1 MB -> 5 MB**

## Safeguards deliberately retained

These are not content-development bottlenecks and protect learning/data quality:

- content-only importer; learner/account/state fields rejected;
- immutable semantic versions and Preview token;
- explicit administrator confirmation before Import;
- no downgrade/conflicting version import;
- stable unique lesson/activity IDs;
- module/ID consistency;
- current maximum **24 activities per lesson**;
- valid answer/rubric requirements;
- seven-domain integrity;
- base curriculum remains present;
- learner attempts remain version-aware and immutable after submission.

The 24-activity lesson ceiling remains because current Reading/Writing plans target well below it and excessively long single lessons would degrade learner UX. Revisit only if a concrete pedagogical design needs more than 24 activities.

## Stress test

The capacity gate generates a TEST-ONLY curriculum from production 1.6.1 with:

- 150 lessons;
- a three-digit ID (`GRA-B2-107`);
- package size deliberately >1 MB;
- existing 59 lessons preserved;
- 91 synthetic additions;
- full schema/content validation;
- Preview expected: Add 91 / Update 0 / Skip 59 / Conflict 0;
- import into an in-memory repository;
- catalog load at 150 lessons;
- retrieval of the three-digit lesson.

The synthetic package is never a production curriculum and must never be imported to the live Site.

## Next production gate

After CI PASS:
1. code-only Site deployment;
2. verify production curriculum remains 1.6.1 / 59 / 499;
3. no D1 migration/reset;
4. optionally run a non-importing authenticated stress Preview only if a realistic 150-lesson test package is deliberately staged;
5. author B1/Reading/Writing content in parallel.

No content import is part of this architecture change.
