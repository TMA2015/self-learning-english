# SLE — v1.19.0 12-Lesson Unit Placement Overlay (proposed)
**Status:** CANDIDATE-MAPPING ONLY / NOT IN THE LIVE PATH. Built 2026-11-04 against main's accepted 109-lesson crosswalk and Draft PR #83; no change to canonical source mapping or curriculum JSON.
**Purpose:** keep the existing 109 primary placements immutable, then append exactly 12 proposed primary placements for the *academically PASS and CI PASS* cumulative v1.19.0 content candidate. The 12 entries are **not available to learners** until the actual importer and production release are approved and verified. The 60-Unit framework remains the programme architecture; source lesson presence does not prove CEFR outcome coverage.

## A. Exactly 12 provisional primary placements
| Draft lesson ID | Primary Unit | Suggested secondary relevance (not a second scored assignment) | Pedagogical rationale |
|---|---|---|---|
| `WRI-A2-05` | `A2-U09` | `B1-U09` | Task analysis and audience awareness for meaningful short writing |
| `WRI-A2-06` | `A2-U09` | `B1-U09` | Brainstorm relevant answers before writing |
| `WRI-B1-04` | `B1-U09` | `B1-U02` | Reason-example scaffolding for an opinion paragraph |
| `WRI-B1-05` | `B1-U09` | `B1-U02` | Outline the structure of a reasoned opinion |
| `WRI-B1-06` | `B1-U09` | `B1-U08` | Use cohesion for linked ideas without mechanical connectors |
| `WRI-B1-07` | `B1-U09` | `B1-U02` | Revise draft content, clarity and audience register |
| `VOC-A2-06` | `A2-U06` | `A2-U09` | Cause/reason language and practical polite suggestions |
| `VOC-B1-06` | `B1-U02` | `B1-U09` | Evidence-limited claims and conditional trial recommendations |
| `VOC-B2-01` | `B2-U02` | `B2-U03` | Precise evidence-aware lexis and reporting stance |
| `REA-A2-07` | `A2-U08` | `A2-U09` | Compare updated notices and follow the latest instructions |
| `REA-B1-06` | `B1-U02` | `B1-U03` | Separate a recommendation from its supporting evidence |
| `REA-B2-01` | `B2-U03` | `B2-U05` | Evaluate competing school-policy claims, bias and caveats |

**Notes:** Secondary links are possible navigation support only; avoid counting the same attempt/evidence twice. These are suggested mappings from approved lesson objectives and the current Framework, **not** an independently reviewed CEFR coverage or Unit mastery verdict. Confirmation of two B2 source lessons never equals a complete B2 programme.

## B. Counts after proposed overlay (NOT live inventory)
| Level | Existing 1.18.1 lessons | New v1.19.0 candidate lessons | Candidate total | Unit(s) with any primary lesson |
|---|---:|---:|---:|---|
| A1 | 30 | 0 | 30 | 9 / 10 |
| A2 | 42 | 4 | 46 | 9 / 10 |
| B1 | 37 | 6 | 43 | 9 / 10 |
| B2 | 0 | 2 | 2 | 2 / 10 (`B2-U02`, `B2-U03`) |
| C1 | 0 | 0 | 0 | 0 / 10 |
| C2 | 0 | 0 | 0 | 0 / 10 |
| **TOTAL** | **109** | **12** | **121** | **29 / 60** |

**Integrity check at authoring:** 109 unique original primary IDs retained, +12 unique candidate IDs, no lesson-ID collision, each new lesson has one proposed primary Unit. 29 units with a primary lesson is just a mapping-density statement; not 29 Units completed, mastered or released.

## C. Activation and evidence guard
1. Only map lesson IDs contained in the **currently imported and verified** catalog version. The public website remains at 1.18.1 until v1.19.0 is explicitly released and live-verified; never surface draft lessons as clickable published content.
2. Keep distinct states: candidate reviewed, importer/CI passed, explicit owner release approved, live deployment succeeded, learner catalog actually contains the lesson.
3. Reconcile any meaningful placement changes via the normal academic process; edit mapping documents rather than released scored lesson payloads.
4. Do not use the overlay to implement hard learning locks, automatic B1/B2 classification, or regrade historical attempts.

**Relationship to pilot:** `SLE_LEARNING_PATH_PILOT_v0.1_20261104.md` derives read-only Today recommendations from real catalog plus mapping; the overlay is inactive for unavailable lessons.
