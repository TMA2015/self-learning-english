# SLE B2→C1 Bridge Batch 01 — machine candidate reconciliation

**Date:** 2026-11-21
**Source packet:** SLE-B2C1-BRIDGE-B01-R1-20261121 (owner-provided original Markdown, 8 lessons / 32 items)
**Independent NotebookLM:** ACADEMIC PASS, 32/32 audited, MUST_FIX NONE, GO_FOR_MACHINE_CANDIDATE (owner supplied verdict)
**Candidate:** `content/curriculum-1.29.0-candidate.json` (new **candidate artifact only**, **not** active Hosting/runtime content)
**Base:** v1.28.0 existing file SHA `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`, 176 lessons / 1,224 activities.

## Proposed additions

| Unit | Lesson IDs | Activities |
|---|---|---|
| B2-U07 | REA-B2-10, WRI-B2-08, WRI-B2-09 | 5 MCQ + 2 unscored Writing |
| C1-U01 | REA-C1-02, GRA-C1-01, WRI-C1-01 | 12 MCQ + 1 unscored Writing |
| C1-U02 | REA-C1-03, REA-C1-04 | 12 MCQ |
| **Total** | **8 lessons** | **29 MCQ + 3 unscored Writing** |

**Cumulative proposed:** 184 lessons / 1,256 activities. Existing 176 lessons, their sequence, IDs, activities and all prior rubrics are preserved byte-equivalently at the JSON object level by generation preflight.

## Academic / technical separation

1. **Academic PASS is not engineering validation.** Every new source and answer is transcribed from the independently reviewed Markdown packet. No edits required by NotebookLM.
2. All three extended Writing tasks remain `answer:null`, `evidence_weight:0`, `review_mode:assisted_ai_or_human`, `UNASSESSED`; B2 uses the existing unchanged `RUBRIC-WRITING-B2`.
3. A **candidate-only `RUBRIC-WRITING-C1`** is included with the six accepted qualitative dimensions, using the existing rubric shape. The **JSON schema, runtime behavior and grading UI have NOT been tested or approved**. Structural 0–4 compatibility is NOT an authorization for automatic numeric scoring.
4. **OPEN ENGINEERING BLOCKER — C1 discourse skill tags:** `grammar.discourse_reference`, `grammar.information_structure`, `grammar.concession` represent the three accurate concepts in GRA-C1-01 but are not yet in the app's `tagMap`. Intentionally do **not** mislabel them as unrelated grammar subskills. Technical integration must define validated mappings in an isolated Draft change, assess downstream evidence semantics, and rerun QA. **Do not import candidate until this is resolved.**
5. Before import: schema validation, key/option shuffle, original source parity, 176-lesson immutable audit, quota/attempt retention, topic Unit mapping and any cross-skill prerequisites, exact-head QA and owner physical Safari/desktop Preview acceptance.
6. No release marker, protected main changes, merge, LIVE deployment, import, learner-data mutation, Math Hosting or Firebase Auth alteration is authorized.

**Candidate status:** `AUTHORING_MACHINE_CANDIDATE_CREATED; ACADEMIC_PASS; TECHNICAL_INTEGRATION_PENDING; NO_MERGE; NO_DEPLOY`.

## Proposed unit map (future activation only)

```
B2-U07 → REA-B2-10, WRI-B2-08, WRI-B2-09
C1-U01 → REA-C1-02, GRA-C1-01, WRI-C1-01
C1-U02 → REA-C1-03, REA-C1-04
```

The older unmapped pilots REA-C1-01 and VOC-C2-01 remain untouched. This is not a claim of CEFR-level completion.
