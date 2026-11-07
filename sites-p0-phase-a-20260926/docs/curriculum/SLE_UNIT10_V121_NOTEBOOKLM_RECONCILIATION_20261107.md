# SLE Unit-10 A1/A2/B1 — NotebookLM disposition and candidate engineering

**Review packet:** `SLE-UNIT10-A1A2B1-TRANSFER-20261107-R1`  
**NotebookLM verdict supplied by owner 2026-11-07:** `PASS_WITH_REQUIRED_CHANGES`.  
**Academic adoption:** GO after required six canonical skill-tag corrections.  
**Technical candidate:** New source-only bundle derived from **v1.20.0 (123 lessons / 1025 activities)**; **v1.21.0 candidate = 132 lessons / 1055 activities**.  
**Production:** NO-GO. No MP3s for the three new Listening lessons; no real playback/browser acceptance or authorized media release. No commit `[release-english]`.

## Exact mandatory reconciliations

| NotebookLM item ID | Incorrect tag | Canonical replacement | Immutable candidate item ID |
| --- | --- | --- | --- |
| A2U10-R03 | `reading.inference/detail distinction` | `reading.detail` | `REA-A2-08-Q3` |
| A2U10-R04 | `reading.detail/condition` | `reading.detail` | `REA-A2-08-Q4` |
| A2U10-L01 | `listening.gist/detail` | `listening.gist` | `LIS-A2-07-Q1` |
| B1U10-R03 | `reading.inference/evidence limit` | `reading.inference` | `REA-B1-07-Q3` |
| B1U10-R04 | `reading.evidence_limits` | `reading.inference` | `REA-B1-07-Q4` |
| B1U10-L04 | `listening.stance` | `listening.speaker_intention` | `LIS-B1-08-Q4` |

All other scholarly item meanings, keys and new scenarios remain unchanged. An original review ID maps to a runtime ID because `validateSeed()` requires each question ID to start with its canonical Lesson ID.

## New content and Unit assignment

| Unit | Reading | Listening (MP3 BLOCKED) | Writing (0 weight) |
| --- | --- | --- | --- |
| A1-U10 | `REA-A1-05` (4 MCQs) | `LIS-A1-06` (4 audio + 1 cross-source MCQ) | `WRI-A1-05` (1 extended) |
| A2-U10 | `REA-A2-08` (4 MCQs) | `LIS-A2-07` (4 audio + 1 cross-source MCQ) | `WRI-A2-07` (1 extended) |
| B1-U10 | `REA-B1-07` (4 MCQs) | `LIS-B1-08` (4 audio + 1 cross-source MCQ) | `WRI-B1-08` (1 extended) |

One primary Unit per newly authored Lesson ID. Existing current Unit map `content/sle-unit-navigation-map-v1.json` is **not** changed while media blocks import. At eventual release, add exactly these nine mappings and retest 60-Unit UI. No historical lesson or scored answer is rewritten.

The X01 cross-source activity is placed inside its Unit's Listening lesson and assigned a canonical `listening.inference` tag. Its **original written stimulus** is also displayed by that player through the existing `reading_asset` field; the clip and transcript must remain playback-gated. Reusing a reading text on two lesson views is not a second score/attempt for the same question. Full cross-source interaction requires a real browser test.

## Audio production blockers

These are **scripts only**: `LIS-A1-06`, `LIS-A2-07`, `LIS-B1-08` do not have real MP3 assets or entries in `content/foundation-audio.json`.

**Never** score these four Listening questions + X01 per level before: (1) voice/rendering and rights provenance, (2) source transcript vs decoded audio human verification, (3) measured duration and physical SHA-256 manifest, (4) real browser play-to-completion, (5) subsequent independent scored submit gate test and owner release authorization. Missing audio is NOT a learner error, and must NOT become numeric zero. The scripts' `Speaker(...):` labels were converted into separate speaker roles; `source_text` contains the words actually to be recorded.

**Writing:** the three responses use `answer:null`, `evidence_weight:0`, `rubric_id:RUBRIC-WRITING-A1/A2/B1`, and existing schema-compatible `review_mode:'assisted_ai_or_human'`. The NotebookLM wording `human_or_verified_optional_AI` is preserved as the **meaning** (trusted review required), not added as a new unsupported runtime enum. Automatic semantic scores, Unit mastery and CEFR certifications are prohibited.

## Files and technical gates

- `content/batches/unit10-a1a2b1-academic-packet-r1.md`: exact original submitted packet, held as review evidence (six original tags remain visible there; they are NOT the machine candidate).
- `content/batches/unit10-a1a2b1-9-lessons-v121-draft.json`: machine-readable nine-lesson source with all six corrections, exact review-ID→runtime-ID mapping and explicit media NO-GO.
- `scripts/compose-unit10-v121-candidate.cjs`: additive, non-importing composer from the unchanged 1.20.0 source to a 1.21.0 candidate in `.sites-runtime/unit10/`; no public package JSON is written or imported automatically.
- `tests/unit10-academic-candidate-v121.cjs`: validates real schema and converted content, 132/1055 counts, 1.20.0 immutable prefix, all six canonical tags, 3×U10, option order and **absence** of fabricated MP3 assets. Integrated in the existing full PR QA.

Run `node scripts/compose-unit10-v121-candidate.cjs` for review-only local generation. Do not use the resulting `.sites-runtime` JSON in a learner browser or production import: it contains audio-dependent items for which media is unverified.

## Unmet release gates

- [x] Academic review returned by owner.
- [x] Six required tag string normalizations applied in draft source.
- [ ] Real TS `validateSeed` and `validateContent` on full 132-lesson candidate — CI evidence pending.
- [ ] Exact-head full PR QA, TypeScript and build — CI evidence pending.
- [ ] Physical MP3 generation, legal clearance and alignment, SHA, verified playback — NOT TESTED.
- [ ] Browser/iPhone learner-flow QA with Unit 10, cross-source and Writing pending state — NOT TESTED.
- [ ] Owner explicit production authorization and Firebase English-only publish — NOT GRANTED.

Do not merge this Draft content PR automatically. Keep Site live curriculum at approved 1.20.0 until every applicable gate passes. This working note is evidence, not a second project standard.
