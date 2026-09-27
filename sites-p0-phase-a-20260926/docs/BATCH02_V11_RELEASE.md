# Self-Learning English — Curriculum Batch 02 on v11 (controlled handoff)

**Source status:** Integrates the original Batch 02 content into the exact GitHub branch that produced v11, preserving v11 result summaries and persistent skill-tab player. This is a GitHub candidate, **not** an existing Site release. The user already renamed the current private Site and its URL; never create a new Site, guess the new URL or replace the project ID.

## Exact dependencies

- Private repository: `TMA2015/ai-english-tutor`.
- Integrating feature branch: `curriculum-batch02-on-v11-20260927`.
- Base: `foundation-results-fast-tabs-20260927` at `52fc35e1e7702506199e4460bab0d8b155d726aa` (reported v11 deploy used this exact GitHub checkpoint).
- Actual deployed Sites source commit reported by Work: `1b30e19f917a0b11c36eb8c002bea7e690ea9fb3`.
- Nested application root: `sites-p0-phase-a-20260926/`.
- Current production: Site v11, academic content v1.1.0, **21 lessons**, with owner-confirmed score summaries and fast tab navigation. The earlier stale tab issue was resolved by reloading the browser.
- Compatible pre-import code rollback: Site v11. Do **not** use v9.
- Historical PR #4 only authored Batch 02 relative to the pre-v11 source; **do not deploy PR #4 directly**. This branch is the v11-integrated release source.

## Content scope

`content/batches/batch02.json` is the incremental authoring unit. `scripts/compose-curriculum.mjs` reproduces `content/curriculum-1.2.0-candidate.json` deterministically over the corrected `1.1.0` base. Adds eight original A1/A2 lessons / 64 tasks: articles & plurals, there is/are, place prepositions, town directions, a museum notice, a changed garden project, an A1 invitation and an A2 event email. Cumulative release: **29 lessons / 190 tasks**. All 21 earlier lesson objects must remain byte-equivalent in parsed JSON. The first 1.1.0 two-question editorial corrections are carried forward.

The only new content-engine code is four grammar skill-tag mappings in `domain/academic.ts`. No database schema, auth, scoring, learner ownership or content-import contract changes are needed. The existing v11 importer already supports up to 60 cumulative lessons / 1 MB.

Separate `content/curriculum-coverage-v1.json` marks known gaps and advisory prerequisites; these are not live CEFR certification, unlocks or mastery rules. Do not silently include the unshipped teacher-loop sidecar from Draft PR #3.

## User branding

The owner renamed the existing Site and URL, and has requested app-level alignment with **Self-Learning English**. The candidate changes only `app/layout.tsx` metadata title/description and `app/page.tsx` visible brand, plus a legacy Foundation Demo accessibility label. **Do not modify** `.openai/hosting.json`, Site identity/project ID, URL/slug, auth, D1 binding or data. Confirm the actual renamed Site in the user's Sites dashboard; do not assume the previous URL remains canonical.

## Required checks BEFORE code release

From the nested root:

```sh
node scripts/compose-curriculum.mjs --check content/curriculum-1.1.0-candidate.json content/batches/batch02.json content/curriculum-1.2.0-candidate.json
node tests/content-quality.cjs
node tests/content-batch02.cjs
node tests/curriculum-coverage.cjs
node tests/batch02-v11-release.cjs
node tests/foundation-results-ux.cjs
node tests/foundation-coaching.cjs
node tests/curriculum.cjs
node tests/curriculum-batch02.cjs
node tests/run.cjs
node tests/academic.cjs
npm run build
```

Independently review every new question, accepted free-text variant, distractor, passage-evidence link, Writing task/rubric, age suitability and language level. Do not treat static schema lint as independent educational review. If an academic error requires changing Batch 02 data, fix `content/batches/batch02.json`, recompose a new candidate and recheck consistency rather than hand-editing only cumulative JSON.

Source-level consistency checks performed during preparation: 1.1.0 previous 21 lessons unchanged; modular 1.2.0 composition matches cumulative candidate; v11 summary/tab/cache code preserved; brand and new skill tags present. **Actual Node suites and new build have not been run during preparation.**

## Source-reconciliation and deployment

1. Discover the **existing renamed private Site** and confirm that its active code is Site v11 from Sites source `1b30e19f917a0b11c36eb8c002bea7e690ea9fb3` with content v1.1.0. Compare actual Site source against the integrating GitHub checkout; do not silently overwrite v11-specific fixes or deploy an old PR4 build. Retain the same `DB` binding and `.openai/hosting.json` project ID.
2. If all checks pass, deploy **APPLICATION CODE ONLY** using the supported Sites workflow. Do not merge PR merely to deploy. Do not import v1.2.0, run any production migration, restore/reset/reseed D1, or reimport v1.1.0 during code release. The owner has accepted the previously documented managed-preview auth exception; do not bypass auth or claim browser QA passed.
3. Report actual renamed production URL and new Site version, exact integrated GitHub checkpoint, deployed Sites source commit, test/build outcomes and any source/content corrections. Keep v11 code available for rollback **before importing 1.2.0**.

## Separate owner-confirmed content import

After code release, the parent downloads **this branch's** `content/curriculum-1.2.0-candidate.json` and uses the actual signed-in Parent View importer, Preview first.

**Only if the live latest content is still the corrected v1.1.0 package, expect `Add 8 · Update 0 · Skip 21 · Conflict 0`.** These are source-derived expected counts, not proof of live preview. If the actual preview differs, STOP; export 1.1.0 from live Site and compare exactly. Do not confirm an unexpected update/conflict or overwrite a stored immutable package. Confirm once, then verify portable export v1.2.0 / 29 lessons.

Owner browser acceptance: A1 articles/plurals, Reading museum text, Writing invitation pending review, prior scored attempt and displayed X/10 summary, fast tabs, and absence of demo-only misleading labels. Opening from a browser left running across releases may require reload; do not confuse stale JS with newly deployed artifact.

**Rollback after content import:** Site v11 lacks newly added Batch 02 concept tags; do not automatically roll application code back to v11 after 1.2.0 is stored. Use a compatible corrective code release. D1 is never auto-restored or rewritten.

## Next work

Continue text-first A1/A2 academic content and the separate teacher-loop pilot after this batch. Real Listening/Speaking/Pronunciation scoring needs playable audio and/or recorded evidence; do not infer speech proficiency from planning text. Curriculum targets A1–B1 do not certify a learner's overall CEFR level.
