# AI English Tutor — Curriculum Batch 02 handoff

**State:** Eight original A1/A2 lessons authored and source-checked on a separate branch. NOT deployed, imported, or verified in a learner browser. Do not interrupt the separately pinned Batch 01 deployment. The target private Site has not been independently checked from this document.

## Dependency / provenance

- Repository: `TMA2015/ai-english-tutor`.
- Branch: `curriculum-batch02-20260927`, based on the pinned Curriculum Batch 01 branch checkpoint `d491f8f39f977657fe6e23f2dca7df3aafdf5c57`.
- Nested application root: `sites-p0-phase-a-20260926/`.
- Cumulative candidate: `content/curriculum-1.2.0-candidate.json`.
- Prior candidate: `content/curriculum-1.1.0-candidate.json`.
- Exact Reading evidence map: `content/reviews/batch02-reading-evidence.json`.
- Repeatable checks: `tests/content-batch02.cjs`, `tests/curriculum-batch02.cjs`.
- Authoring standard: `docs/CONTENT_AUTHORING_STANDARD.md` inherited from Batch 01.

## Eight independently authored new lessons

| ID | Target | Learning object | New questions |
| --- | --- | --- | ---: |
| GRA-A1-04 | A1 | Indefinite articles, regular/selected irregular plurals | 10 |
| GRA-A1-05 | A1 | There is/are: statements, negatives, questions | 10 |
| GRA-A1-06 | A1 | Prepositions of place | 10 |
| VOC-A1-03 | A1 | Town places and simple directions | 8 |
| REA-A1-02 | A1 | Class trip notice: gist and precise time/detail | 8 |
| REA-A2-03 | A2 | Changed garden project: contrast and conditions | 8 |
| WRI-A1-02 | A1 | Friendly invitation: analyse, plan, write/review | 5 |
| WRI-A2-02 | A2 | Event email: plan, support, write/review | 5 |

Total new = 64 (48 single-choice, 14 short-answer, two review-only extended responses). Cumulative = **29 lessons / 190 tasks / seven existing domains**. All previous 21 lesson objects remain unchanged and a complete `course.sequence` orders all 29; no learner data inside content.

## Code scope

Four concept tags are added to `domain/academic.ts`: `grammar.articles`, `grammar.plural_nouns`, `grammar.there_is_are`, `grammar.prepositions_place`. These map into distinct internal error/mastery tags; no new D1 table, authentication behavior, AI scoring or importer extension is required beyond Batch 01 code.

No new pre-answer hints are claimed for these lessons: the existing two-level hints remain a narrow Grammar A2 pilot. The separate teacher-loop sidecar in Draft PR #3 must not be silently imported or presented as a live feature.

## Modular authoring, cumulative import

The actual **authoring increment** is `content/batches/batch02.json` (eight new lessons, insertion anchors and metadata). The current Site importer still accepts a cumulative package, so `scripts/compose-curriculum.mjs` produces and verifies `content/curriculum-1.2.0-candidate.json` deterministically:

```sh
node scripts/compose-curriculum.mjs --check content/curriculum-1.1.0-candidate.json content/batches/batch02.json content/curriculum-1.2.0-candidate.json
```

The composer guards version increase, stable IDs, complete ordering, 60-lesson and 1 MB limits, and avoids touching learner records. Source-level comparison confirmed that composing Batch 02 reproduces the committed 1.2.0 package exactly. This is **not** a live import or a replacement for tests/answer review. Future batches can be authored as small increment files while the application continues using a cumulative import until a dedicated modular package API is implemented.

## QA and release order

1. **Release and import Batch 01 first** using its pinned code and owner-confirmed `content 1.1.0`. If this hasn't happened, stop Batch 02 release, but content/editorial work may continue.
2. Independently review all 64 new tasks in context. For Reading, compare every item and correct option with the entire passage; the evidence map proves quote availability, not sole correctness. Check short-answer insertion and natural variants, Writing rubric and age relevance.
3. Run from the nested application root:
   ```sh
   node scripts/compose-curriculum.mjs --check content/curriculum-1.1.0-candidate.json content/batches/batch02.json content/curriculum-1.2.0-candidate.json
   node tests/content-quality.cjs
   node tests/content-batch02.cjs
   node tests/foundation-coaching.cjs
   node tests/curriculum.cjs
   node tests/curriculum-batch02.cjs
   node tests/run.cjs
   node tests/academic.cjs
   npm run build
   ```
4. After those checks, deploy code-only with four new tags. Do not migrate/reset/import during code deployment. The known Work managed-preview auth blocker should be reported, not bypassed.
5. Owner on authenticated live Site imports the full v1.2.0 JSON after Preview. **If v1.1.0 is the latest imported content, expected Add 8 / Update 0 / Skip 21 / Conflict 0.** If a different latest version is present, stop and compare exported content instead of trusting guessed counts.
6. Verify export v1.2.0 (29 lessons), each new skill tab/lesson, an original reading passage and one Writing pending-review attempt. Confirm Next step follows the full curriculum and skill-tab switches no longer show repeat loading after the initial fetch. Confirm earlier versions still readable. Do not infer a CEFR level from task scores.

## Rollback constraints

The old Site v9 does not understand all Batch 01/02 content; after importing v1.2.0, rollback must use a compatible code checkpoint, not blindly restore v9. A content mistake is corrected in a new immutable v1.2.1 or higher, never an in-place overwrite of v1.2.0. Existing learner records may be disposable for this pilot but avoid resets unless explicitly necessary and authorized.

## Next content batch, not a blocker

Write real A1/A2 Listening tracks only when a genuinely playable audio asset is available; expand Writing along the existing 12-week progression; then produce B1 content after A1/A2 foundations are useable. The content package remains cumulative only as a temporary bounded importer contract; plan a modular package index before 60 lessons / 1 MB.
