# v21 Course Architecture — deterministic acceptance matrix
Status: DESIGN / TEST CASES ONLY; these are NOT claims that application tests have run. Exact baseline: deployed Sites v20 source 7ffc690ba63461322eff7d259b483531c224e053; source-level GitHub PR #18 6da694b5223581e0bc81784defd16b714c58560f.

## A. Template, enrollment and learner isolation
| Test | Setup | Expected |
|---|---|---|
| C01 | Learner has no course enrollment and opens Dashboard. | YOUR JOURNEY prompts Choose a course, not fabricated Writing progress or 0% mastery. |
| C02 | Learner actively selects A1 Foundation, then merely browses a Writing lesson in free Catalog. | Active course remains A1 Foundation; no unexpected change to YOUR JOURNEY. |
| C03 | Learner selects Continue on Writing Coach; returns to Dashboard. | Active course is Writing Coach, showing the accurate published Week 1 step/progress. |
| C04 | Learner joins predefined A1 and Writing plus creates two custom courses. | All can coexist. A THIRD non-archived custom enrollment is rejected (including when earlier custom is paused). |
| C05 | Archive one custom course, then create another. | Slot becomes available; archived course remains auditable. Shared global attempts, reviews and skill evidence are unchanged. |
| C06 | Request enrollment/state by providing another learner's ID in body/query. | Server ignores client owner and uses trusted authenticated principal; cross-account data is inaccessible. |
| C07 | Repeat create/activate/archive request on retry or network timeout. | Idempotent operation, no duplicate enrollment/evidence, selection consistent. |
| C08 | Existing Writing Week 1 learner opens new UI before any migration. | Original state.week, stage, completed, drafts and prior Writing feedback remain accessible via compatibility adapter. No reset or automatic new D1 write during a read. |

## B. Versioned content, progress, shared Evidence
| Test | Setup | Expected |
|---|---|---|
| P01 | Same immutable GRA question appears in two courses. Submit one eligible attempt. | BOTH enrolled plans can gain completion, but global evidence event and overall practice denominator count this question attempt ONCE. |
| P02 | Submit a v1.4 attempt; content 1.5 adds new items. Open submitted v1.4 result. | Retains original keys, content version and read-only result; never retroactively regrade or rewrite. |
| P03 | Repeat same question ten times on ten attempts. | All-attempt accuracy has denominator ten; unique-question count is one; confidence is not inflated by correlated tags/retakes. |
| P04 | Submit a Writing extended response; human review still pending. | Submitted-step milestone shown; rubric/proficiency remains Pending Review, not auto-scored. |
| P05 | Complete Week 1, while Weeks 2–12 remain previews. | Reports Week 1 published completion and previews separately; NOT "12-week course 100% complete". |
| P06 | Approved new 1.5 content matches an existing A1 unit. | Suggest additions without modifying enrollment, revision, numerator/denominator or past completion. |
| P07 | Learner accepts optional extension in a not-started segment. | Creates new append-only revision, retains old revision; past completion not withdrawn. |
| P08 | Old identical question ID but answer or source version changed. | No accidental equivalence. Match exact source version unless an independently approved equivalence map exists. |
| P09 | A task has three instruction tags. | At most one overall attempt count; up to one observation per relevant tag, with source event IDs traceable. |
| P10 | Student has a failing score on a repeated question but high aggregate accuracy. | Recommendation distinguishes practice accuracy, unique coverage, repeated errors and independent transfer; never declares a certified CEFR. |

## C. Placement and generated courses
| Test | Setup | Expected |
|---|---|---|
| A01 | Learner chooses target A2, no assessment. | AI course creation disabled; show level-aligned placement requirement. Predefined/free lessons remain available. |
| A02 | Grammar/Vocabulary/Reading completed, Writing and genuine Listening not completed for a blueprint that requires them. | Placement remains pending or explicitly incomplete; cannot claim full overall CEFR readiness. |
| A03 | Completed blueprint, evidence and limitations shown; learner/parent confirms working level. | Creation gate opens only for sufficiently assessed, eligible domains. No formal certification message. |
| A04 | Enter 50 Grammar, 20 Vocabulary, 30 Reading. | Exactly 100, all selected domains validated and available, feasible estimated time. |
| A05 | Enter weights totaling 110, duplicate Grammar row, unsupported Speaking audio or a nonapproved source ID. | Generation/confirmation rejected with actionable explanation. |
| A06 | AI proposes items not in approved content library or skips explicit prerequisites. | Server validator rejects; AI prose alone cannot authorize an ID. |
| A07 | Learner opens AI preview but declines. | No enrollment or active-course selection created; no score/evidence mutation. |

## D. Navigation and Writing review
| Test | Setup | Expected |
|---|---|---|
| N01 | Latest attempt/revision server-confirmed clean; click Dashboard/Parent/skill/Catalog. | Immediate navigation, no redundant draft POST, no invented speed metric. |
| N02 | Save is in-flight when a second edit arrives and user switches tab. | Serial queue saves latest revision, waits for confirmation before unmount; restored last edit. |
| N03 | Dirty draft save fails or connectivity drops during switch. | Stays in original lesson and recording; clear Retry; no false "saved". |
| N04 | Rapid sidebar clicks during save. | Only validated latest destination is used, no overtaking/duplicate writes; accessible saving status. |
| N05 | Current lesson fetch fails after prefetch. | Old lesson and recording remain; retry allowed. |
| W01 | Legacy Writing submits with unavailable AI. | Original text persisted; Pending Review shown; no fabricated score. |
| W02 | Adult reviews Foundation Writing rubric, then student revises. | Original and revision stored separately; review attribution and criterion scores visible; course submission milestone distinct from quality evidence. |
| W03 | Writing skill practice accessed outside Writing 12 Weeks. | It does not switch active course unless learner explicitly requests it. |

## Mandatory release gates
- Design stage: this schema/matrix is documentation only. Do not run D1 migrations, import content, write learner records or deploy.
- Integration stage: add route/service tests for course scope, two-custom cap, plan snapshots, pending-review progression, versioned attempts, and clean/dirty/pending/failed draft navigation; production build must pass.
- Work browser preview identity can differ from owner identity. Do not claim authenticated staging QA if sign-in is blocked; owner checks production only after a separately authorized controlled release.
- Compare old and new user experience on same device/network; measure click→visible feedback and click→completed navigation rather than asserting a speedup from code review.
- A migration, even additive, needs a separately approved plan with rollback and safe backfill. Never delete or rename existing Writing fields, attempts, content versions or reviews.
