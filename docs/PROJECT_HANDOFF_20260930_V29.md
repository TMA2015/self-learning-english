# Self-Learning English — Project Handoff — 2026-09-30 — Sites v29

## Current production baseline

- Existing private Site: same Site and URL.
- Sites version: **v29**
- Deployed Sites source: `d31f43d2e4383f218697705d96a6ab1334a90798`
- Deployment ID: `appgdep_6abd28e108448191a4ec593abe22efc5`
- GitHub implementation reference:
  - Draft PR #25
  - Branch: `fix/version-aware-current-practice-20260930`
  - Checkpoint: `f890d2322986b978bc5601ce7aec9e6b10f5c7c5`
- PR #25 remains unmerged.

## Curriculum baseline

- Curriculum version: **1.5.0**
- Lessons: **45**
- Activities: **359**
- 323 original activities preserved with IDs/order.
- Batch05 added 36 activities across 8 existing lessons.
- No new lesson IDs were added in 1.5.0.

Known Batch05 expanded lessons:
- GRA-A1-08: 10 -> 14
- GRA-A2-05: 10 -> 14
- GRA-A2-06: 10 -> 14
- VOC-A2-01: 5 -> 11
- VOC-A2-03: 8 -> 12
- REA-A2-01: 5 -> 11
- REA-A2-04: 8 -> 12
- WRI-A2-01: 3 -> 7

## Version-aware attempt UX hotfix

Problem discovered during owner QA:
- WRI-A2-01 historical work was bound to content 1.0.0 and therefore correctly showed only 3 activities.
- The old UI did not clearly provide a separate path to start the latest 1.5.0 lesson while preserving the historical attempt.

Implemented behavior in v29:
- Historical attempts remain bound to their stored content version.
- Historical Writing revisions keep their `parentId` chain and old content version.
- Old-version attempts disclose their stored version and the current curriculum version.
- Separate **Start current practice · v1.5.0** action creates a new root attempt on the current curriculum with no `parentId`.
- Attempt/revision history displays stored content versions.
- Same-version attempts retain the simpler existing UX.
- Existing started draft is saved before creation of a separate current root attempt.

No backend version-binding semantics were changed.

## Validation completed

- Five GitHub workflows: PASS.
- Previous 16 local test commands: PASS.
- TypeScript: PASS.
- Production build: PASS.
- Focused version-aware test: PASS again before deployment.
- Production smoke checks: Dashboard, 45-lesson Catalog, Writing and Parent View PASS.
- No application errors observed in captured logs; browser-extension errors were present and treated as unrelated.

## Data safety / release boundaries

The v29 release did NOT perform:
- curriculum import,
- D1 migration,
- D1 reset,
- historical attempt mutation,
- historical regrading,
- learner attempt creation by Work,
- authentication change,
- Site identity change.

Curriculum remains 1.5.0 and learner history remains version-bound.

## Owner QA still pending

Run on the real authenticated learner account:

1. Open historical WRI-A2-01.
2. Confirm it still shows **content 1.0.0**.
3. Confirm the historical path still has **3 activities** and existing answers/history remain intact.
4. Confirm version notice appears.
5. Confirm **Start current practice · v1.5.0** is available.
6. Start current practice and confirm it creates a new root attempt.
7. Confirm the new WRI-A2-01 attempt shows **content 1.5.0** and exactly **7 activities**.
8. Confirm Attempt & revision history shows stored content versions.
9. Confirm historical revision behavior remains on the original version.
10. Sanity check:
   - VOC-A2-01 = **11 activities**
   - REA-A2-01 = **11 activities**
11. Repeat core control visibility on mobile/iPad if practical.

No submission of the new Writing QA attempt is required.

## Recovery points

Code-only rollback:
- Sites v27 source: `0a84b8f889102192eed0f3f29958d8fea0d40fb4`

Rollback must preserve:
- Curriculum 1.5.0
- learner data
- historical attempts/results
- Writing data
- course selection

Do not roll back curriculum or learner records as part of a code rollback.

## Next planned step

Do not begin P2B or Batch06 until the owner QA above is complete.

After owner QA passes:
1. close the v29 hotfix checkpoint;
2. treat Curriculum 1.5.0 + Sites v29 as the new production baseline;
3. proceed to **P2B Adaptive Learning / Suggested Practice v2** before further large content expansion.

P2B target loop:
**Evidence -> detect weakness -> suggest targeted practice -> learner practices -> update mastery -> refresh recommendations.**
