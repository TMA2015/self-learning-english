# AI English Tutor

Portable academic content and source-backup home for the existing **AI English Tutor** ChatGPT Site.

> **Status:** This repository currently contains the academic seed and coordination documents only. The live Site's application source, database migrations and learner data have **not** been synced here yet. Do not treat this repository as a deployable copy of the Site.

## Existing Site
- Private Site: https://english-writing-coach.giangrr.chatgpt.site
- Preserve the existing Site, learner accounts, assessment evidence, the 12-week Writing course, Assisted Review, and cross-device storage.
- Continue development on the existing Site; do not create a replacement Site.

## Source of truth
- GitHub: authored content packages, curriculum, schemas, test fixtures, documentation, and reviewed source snapshots.
- Sites: deployed application and learner records.
- Learner data: export and back up separately using restricted access. Never commit personal learner records.

## First content package
`content/packages/ai_english_tutor_academic_seed_v1.json` is a proposed **portable seed schema**, not a Site-native format. It contains 13 sample lessons at A2–B1 across 7 skill groups. Import requires the existing Site's versioned, idempotent admin importer. The seed must not overwrite user data or the existing 12-week Writing course.

## Development workflow
1. Author, review and version content on GitHub.
2. Import only approved versions into the **existing** Site; run dry-run and a single end-to-end learner test.
3. After a Sites change, sync Site source into a dedicated branch or snapshot; review the diff before merging.
4. Keep environment secrets, database credentials and learner records outside Git.
5. Do not overwrite the latest GitHub content with an older Sites snapshot.

See `docs/SITE_HANDOFF.md` for the current blocker and minimal next Work tasks.

## Security
Repository is private. No `.env`, tokens, database dumps containing personal information, learner responses or real recordings belong here.
