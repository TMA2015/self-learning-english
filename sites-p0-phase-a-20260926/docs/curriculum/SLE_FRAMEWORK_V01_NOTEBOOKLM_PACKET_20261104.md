# SLE — Integrated Master Curriculum Framework / Programme Architecture Review
**Packet ID:** SLE-FRAMEWORK-INTEGRATED-20261104-R2
**Source class:** ONE TEMPORARY NotebookLM review source. Supersedes the earlier preliminary Framework packet in the active NotebookLM source set. No raw curriculum JSON is required for this review.
**Review target:** the complete integrated A1–B2 curriculum architecture, *including all 109 existing 1.18.1 lessons* placed into proposed Units. **DO NOT RE-REVIEW** the 109 lessons' historical item-level answer keys, spelling or content unless a global structural issue specifically requires a focused subsequent audit.
**Permanent sources to KEEP:** the latest selected `00_NOTEBOOK_ENGLISH_PERMANENT_v2.md` through `04_GRAMMAR_ADAPTIVE_ROADMAP_v2.md` and `SLE-MASTER-001 v1.1.0` (current authorized version).
**Temporary sources to REMOVE / DESELECT:** the old preliminary Framework packet before adding this replacement; outdated temporary batch packets whose review verdict has already been captured. **Exception:** do not discard an open/unrecorded Wave B verdict; complete and record that pending review separately first.
**Temporary source to ADD:** THIS Markdown document only.
**Reviewer's remit:** comment on levels, Unit sequence, prerequisites, total skill coverage, lesson-to-Unit placement, gaps and proposed new instructional targets. Separate verified existing content from hypotheses. Do not infer mastery, CEFR certification or active live import from a title or ID. This is an ACADEMIC ARCHITECTURE review, not a technical QA or production release.
**Authoritative basis:** project permanent academic sources and current SLE-MASTER-001. When those sources do not justify a specific curriculum level or claim, flag it as `INSUFFICIENT_EVIDENCE`. No duplicate active standards.
**Mandatory output:**
1. `FRAMEWORK_ARCHITECTURE_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL | INSUFFICIENT_EVIDENCE`.
2. `FRAMEWORK_ADOPTION: GO | NO-GO`, independent from `PRODUCTION_RELEASE: NOT_REQUESTED`.
3. Programme-wide coverage gaps by A1/A2/B1/B2 and across receptive/productive/interaction/mediation dimensions; **do not calculate fake CEFR coverage %**.
4. Required correction table: `ID | Unit(s) | Source basis | Exact wording/placement/prerequisite change | Why blocking | Retest`.
5. Placement audit: identify any misplaced existing lesson ID and proposed primary/secondary Unit(s). A mapped lesson does not imply the Unit is complete.
6. Structured proposed additions: genuinely missing knowledge/skills (not assumed from just missing a primary lesson) and suggested priority ordering.
7. Optional suggestions separated from blocking changes.
8. Evidence limits: what cannot be determined without inspecting source passages/audio/answers or runtime.
**Short chat prompt:** `Review the current integrated SLE curriculum Framework against the permanent sources. Assess Unit sequence, existing lesson placement, coverage gaps and prerequisites—not old question banks. Return the required verdict and exact corrections.`
---
## Integrated curriculum framework — full attached source
# Self-Learning English — Master Curriculum Framework (Integrated Draft v0.1, revision 2)
**Status: DESIGN / TOTAL-PROGRAM ACADEMIC REVIEW PENDING / NOT RELEASED.**
**Owner direction (2026-11-04):** review the full curriculum architecture, **not** re-audit previously reviewed individual lessons. This revision **replaces the earlier disconnected overview** in this same draft file by embedding the full existing lesson catalog in its proposed Unit structure.
**Source of existing lessons:** GitHub `main`, `sites-p0-phase-a-20260926/content/curriculum-1.18.1-candidate.json`, immutable Git blob `7c4a9f1186fd11c47b8e1ee2951e5aad908102a3` (109 lessons / 913 activities). Released status is recorded in repository release evidence, but this document does not independently inspect every learner account's live import state.
**Authority:** `SLE-MASTER-001 v1.1.0` remains the only governing SLE standard; this is an integrated descriptive planning document. Historical published lessons and learner attempts remain immutable. No production import, merge or Firebase change is requested.

## 1. Read this first: what is already in SLE and what is new
- **EXISTING:** all 109 baseline lesson IDs and titles shown in Unit sections below are already in source version 1.18.1. They are **not** being proposed for replacement, deletion, or re-review of their old question banks. They may serve multiple learning goals via future secondary links, without duplicating stored evidence.
- **PROVISIONAL PLACEMENT:** each existing lesson is listed under exactly one *primary* Unit in this planning draft. The title/objective match is provisional: it does not prove the Unit is taught sufficiently or that prerequisites are enforced. Secondary relationships and competency-level coverage still require expert mapping.
- **PROPOSED:** Unit outcomes, integrations, missing-coverage hypotheses, transfer tasks, cross-Unit checkpoints, B2 units and all future lesson suggestions are **new curriculum design** for independent architecture review.
- **REVIEWED BUT UNRELEASED:** Writing Wave A has independent NotebookLM Academic PASS (6 lessons/48 items: WRI-A2-05, WRI-A2-06, WRI-B1-04…07). Do not list those as current baseline lessons. Vocabulary/Reading Wave B (6 lessons/48 items) has no verified independent verdict; keep it separate and do not infer released B2 content from it.
- **STRICT DISTINCTIONS:** curriculum Unit ≠ individual imported lesson; existence of tagged item ≠ competence coverage; completion/score ≠ certified CEFR. Speaking preparation and unreviewed Writing are not validated production proficiency. No fabricated 100% coverage claims.

## 2. Baseline and design snapshot
| CEFR target | Existing lessons | Existing activities | Proposed integrated Units |
|---|---:|---:|---:|
| A1 | 30 | 249 | 10 (draft) |
| A2 | 42 | 359 | 10 (draft) |
| B1 | 37 | 305 | 10 (draft) |
| B2 | 0 | 0 | 10 (draft) |
| **Total** | **109** | **913** | **40 (draft)** |
### Existing baseline by module
| Module | A1 | A2 | B1 | Total |
|---|---:|---:|---:|---:|
| grammar | 12 | 16 | 12 | 40 |
| vocabulary | 4 | 5 | 5 | 14 |
| reading | 4 | 6 | 5 | 15 |
| listening | 5 | 6 | 7 | 18 |
| writing | 4 | 4 | 3 | 11 |
| speaking | 1 | 2 | 3 | 6 |
| pronunciation | 0 | 3 | 2 | 5 |
**Instructional principle:** retain approved content, make an actual cross-skill sequence, use rigorous academic review for **new** syllabus claims, missing competencies, redundancy and prerequisites. Do not blanket-reassess released old item-level content.

## 3. Integrated programme atlas: 40 provisional Units containing all 109 existing lessons
**Field reading:** the **existing lesson list** is sourced from curriculum 1.18.1 (ID, exact title, module, activity count). Unit learning outcome/scope, prerequisites and placement are draft proposals. `Review next` is a *hypothesis/check*, not a confirmed defect; `Transfer outcome` is a recommended future integrated assignment and not currently assumed deployed. Priority P0/P1 is provisional. A Unit with zero primary assignments may still reuse lessons from earlier Units.

### Level A1: programme-level intended progression
Everyday identity → school/home → times/routines → locations, practical notices and short messages → integrated A1 transfer.

#### A1-U01 — People and first exchanges
- **Role / learning outcome:** Introduce oneself safely, identify people and ask/answer simple personal questions.
- **Core content and skill connections:** be; subject/possessive pronouns; greetings; name and country; simple listening/turn-taking.
- **Proposed prerequisite(s):** none; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **4** (provisional primary placement; grammar 2, writing 1, speaking 1).
  - **GRA-A1-01 — Be: am, is and are** [grammar; A1; 10 activities]. Source outcome: Use am, is and are with the right subject.
  - **GRA-A1-02 — Pronouns and possessive adjectives** [grammar; A1; 10 activities]. Source outcome: Use I, you, he, she, it, we and they as subjects.
  - **WRI-A1-01 — Introduce yourself in a short paragraph** [writing; A1; 5 activities]. Source outcome: Identify what a short self-introduction must include.
  - **SPE-A1-01 — Introduce yourself and ask a simple question** [speaking; A1; 5 activities]. Source outcome: Give a short introduction using basic personal information chosen by the learner.
- **What to check / proposed future additions:** Check greeting response and short personal-profile listening/reading across existing lessons; propose a two-turn dialogue if not covered. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Identify self-introduction in an unfamiliar scenario and produce a safe, short original response. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U02 — Family and descriptions
- **Role / learning outcome:** Describe family/friends with basic attributes and understand short personal profiles.
- **Core content and skill connections:** possessives; this/that; family, adjectives; picture descriptions; short factual reading.
- **Proposed prerequisite(s):** A1-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **5** (provisional primary placement; writing 1, vocabulary 1, grammar 2, listening 1).
  - **WRI-A1-03 — Describe a familiar person or place** [writing; A1; 5 activities]. Source outcome: Identify the reader and required points in a short description.
  - **VOC-A1-04 — Family, rooms and everyday belongings** [vocabulary; A1; 8 activities]. Source outcome: Understand common family relationships from short statements.
  - **GRA-A1-09 — This, that, these and those** [grammar; A1; 10 activities]. Source outcome: Choose this/that for one thing and these/those for more than one thing.
  - **GRA-A1-10 — Object pronouns and possessive pronouns** [grammar; A1; 10 activities]. Source outcome: Use me/you/him/her/it/us/them after verbs and prepositions.
  - **LIS-A1-04 — My New Neighbour** [listening; A1; 6 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check short family descriptions, adjectives in reading/listening and possessive reference; avoid re-teaching pronouns. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Recognise whom a short profile describes and independently describe a fictional family member. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U03 — School, time and routines
- **Role / learning outcome:** Read a schedule and state school-day times and recurring actions.
- **Core content and skill connections:** present simple; time prepositions; school chunks; timetable reading; listening for detail.
- **Proposed prerequisite(s):** A1-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; vocabulary 1, grammar 1).
  - **VOC-A1-01 — School places and classroom language** [vocabulary; A1; 8 activities]. Source outcome: Understand useful school expressions from their context.
  - **GRA-A1-12 — Prepositions of time: at, on and in** [grammar; A1; 10 activities]. Source outcome: Use at with clock times and selected fixed times such as night.
- **What to check / proposed future additions:** Check timetable comprehension across reading/audio; teaching time-of-day chunks and asking schedule questions. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Use an unfamiliar class timetable to identify when and where an activity occurs. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U04 — Daily life and frequency
- **Role / learning outcome:** Write and understand a short account of an ordinary day, including frequency.
- **Core content and skill connections:** present simple questions/negatives; frequency; routine collocations; descriptive paragraph.
- **Proposed prerequisite(s):** A1-U03; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 1, vocabulary 1, writing 1).
  - **GRA-A1-03 — Present simple: everyday routines** [grammar; A1; 10 activities]. Source outcome: Describe repeated habits using the present simple.
  - **VOC-A1-02 — Daily activities and frequency** [vocabulary; A1; 8 activities]. Source outcome: Name common actions in a school-day routine.
  - **WRI-A1-04 — Write about a typical school day** [writing; A1; 5 activities]. Source outcome: Identify four required details in a routine-writing prompt.
- **What to check / proposed future additions:** Check frequency questions, genuine new-context retrieval and paragraph structure, not simply choosing present-simple forms. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Read a new daily routine and write a short ordered fictional routine independently. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U05 — Food, objects and quantities
- **Role / learning outcome:** Request familiar items and understand simple shopping/menu information.
- **Core content and skill connections:** articles/plurals; quantities foundations; food nouns; polite functional requests; prices.
- **Proposed prerequisite(s):** A1-U01; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; grammar 1, listening 1).
  - **GRA-A1-04 — A, an and regular plurals** [grammar; A1; 10 activities]. Source outcome: Choose a or an before a singular countable noun from its starting sound.
  - **LIS-A1-03 — The Bakery Order** [listening; A1; 6 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check food/price chunks, requesting quantities and real menu comprehension; assess whether A1 quantities need bridging. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Read a simple menu and choose a suitable item within a fictional budget. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U06 — Home, town and directions
- **Role / learning outcome:** Describe where people/things are and follow simple location instructions.
- **Core content and skill connections:** there is/are; place prepositions; map/notice reading; location listening.
- **Proposed prerequisite(s):** A1-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 2, vocabulary 1).
  - **GRA-A1-05 — There is and there are** [grammar; A1; 10 activities]. Source outcome: Use there is for one item and there are for several items.
  - **GRA-A1-06 — Prepositions of place** [grammar; A1; 10 activities]. Source outcome: Use in, on and under to describe simple positions.
  - **VOC-A1-03 — Places in town and simple directions** [vocabulary; A1; 8 activities]. Source outcome: Recognise familiar town places from their purpose.
- **What to check / proposed future additions:** Check maps, place references and spoken location instructions with verified audio. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Follow a simple two-step direction on an unfamiliar map. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U07 — Hobbies, ability and invitations
- **Role / learning outcome:** Express ability and preferences, understand simple invitations.
- **Core content and skill connections:** can/can't; likes; hobby chunks; brief dialogue; short reply.
- **Proposed prerequisite(s):** A1-U04; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; writing 1, grammar 1).
  - **WRI-A1-02 — Write a friendly invitation message** [writing; A1; 5 activities]. Source outcome: Identify the recipient and the details requested in a short invitation.
  - **GRA-A1-07 — Can, can't and basic requests** [grammar; A1; 10 activities]. Source outcome: Express simple present ability using can and can't.
- **What to check / proposed future additions:** Check invitation replies, preference language and can/can't transfer in short listening or messages. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Reply to a new invitation using ability/preferences and one relevant detail. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U08 — Questions and everyday instructions
- **Role / learning outcome:** Ask for missing information and act on common instructions.
- **Core content and skill connections:** wh- questions; imperatives; scanning notices; gist vs factual detail.
- **Proposed prerequisite(s):** A1-U01, A1-U03; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; grammar 2).
  - **GRA-A1-08 — Question words and basic question order** [grammar; A1; 14 activities]. Source outcome: Choose who, what, where, when, why or how according to the information needed.
  - **GRA-A1-11 — Imperatives and everyday instructions** [grammar; A1; 10 activities]. Source outcome: Use the base verb for positive instructions.
- **What to check / proposed future additions:** Check varied question forms, imperative understanding and student-friendly help requests. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Extract a missing fact and ask the correct simple question. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U09 — Messages, notices and evidence
- **Role / learning outcome:** Interpret a notice or short message using gist and explicitly stated details.
- **Core content and skill connections:** reading gist/detail vs inference; vocabulary in context; short listening notices.
- **Proposed prerequisite(s):** A1-U03, A1-U08; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **7** (provisional primary placement; reading 4, listening 3).
  - **REA-A1-01 — A new art club at school** [reading; A1; 8 activities]. Source outcome: Understand the main purpose of a short school notice.
  - **REA-A1-02 — A class visit to the science museum** [reading; A1; 8 activities]. Source outcome: Understand the main purpose of a simple trip notice.
  - **REA-A1-03 — A message about an art-club visit** [reading; A1; 8 activities]. Source outcome: Identify the sender's purpose in a short personal message.
  - **REA-A1-04 — Friday timetable and a room change** [reading; A1; 8 activities]. Source outcome: Read a simple school notice for times, places and instructions.
  - **LIS-A1-01 — A school club announcement** [listening; A1; 10 activities]. Source outcome: Understand the main purpose of a short school announcement.
  - **LIS-A1-02 — A classroom change for Thursday** [listening; A1; 8 activities]. Source outcome: Understand the main purpose of a short school announcement.
  - **LIS-A1-05 — The Missing Hat** [listening; A1; 6 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check independent reading types; distinguish obvious detail from genuine inference in A1 notices; fix tag classification only prospectively if reviewed. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Read an unfamiliar notice, identify gist and factual details, then explain evidence. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A1-U10 — A1 integrated task and self-check
- **Role / learning outcome:** Use several familiar situations in new texts/audio and produce a simple message.
- **Core content and skill connections:** comprehension practice; safe self-check; unassessed original writing; foundational pronunciation exposure.
- **Proposed prerequisite(s):** A1-U01…A1-U09; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** Integrate existing A1 lessons into an optional cross-skill checkpoint; a Unit can have no primary lesson while still reusing multiple IDs. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Complete short text+audio comprehension and draft a personal-style message; label any open response unassessed. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

### Level A2: programme-level intended progression
Present/past/future choices → everyday transactions and explanations → experience and practical source comparison → organised A2 writing → integrated transfer.

#### A2-U01 — Actions now versus routines
- **Role / learning outcome:** Explain actions in progress and contrast them with habits.
- **Core content and skill connections:** present continuous; simple/continuous choices; routine vs temporary context; listening for situation.
- **Proposed prerequisite(s):** A1-U04; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **4** (provisional primary placement; grammar 2, vocabulary 1, speaking 1).
  - **GRA-A2-01 — Present simple or present continuous?** [grammar; A2; 10 activities]. Source outcome: Decide whether a sentence describes a routine, an action happening now or a temporary arrangement.
  - **VOC-A2-01 — Daily routines and useful phrases** [vocabulary; A2; 11 activities]. Source outcome: Understand common routine phrases
  - **SPE-A2-01 — Talk about your routine** [speaking; A2; 2 activities]. Source outcome: Give a short connected response
  - **GRA-A2-07 — Present continuous: form and use** [grammar; A2; 10 activities]. Source outcome: Build present-continuous statements with am, is or are plus verb-ing.
- **What to check / proposed future additions:** Check concept demonstration of routines vs now, including stative-verb limits and new situations. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Select tense based on meaning across an unfamiliar daily schedule and observation. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U02 — Past events and simple stories
- **Role / learning outcome:** Understand and describe finished events in clear sequence.
- **Core content and skill connections:** past simple; past continuous introduction; timelines; short event reading/listening.
- **Proposed prerequisite(s):** A2-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; grammar 2).
  - **GRA-A2-02 — Past simple forms, negatives and questions** [grammar; A2; 10 activities]. Source outcome: Use regular and common irregular verbs for finished past events.
  - **GRA-A2-08 — Past continuous and interrupted actions** [grammar; A2; 10 activities]. Source outcome: Build past-continuous statements with was/were + verb-ing.
- **What to check / proposed future additions:** Check independent narration of past events and when past continuous adds background/interruption. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Read/listen to a short event account and order events using time cues. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U03 — Shopping, food and quantities
- **Role / learning outcome:** Compare quantities/prices, ask practical questions and resolve a small purchase issue.
- **Core content and skill connections:** countable/uncountable; some/any, much/many; functional chunks; roleplay preparation.
- **Proposed prerequisite(s):** A1-U05; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 1, vocabulary 2).
  - **GRA-A2-03 — Countability, some/any, much/many** [grammar; A2; 10 activities]. Source outcome: Distinguish common countable and uncountable nouns in everyday contexts.
  - **VOC-A2-03 — Shopping, prices and polite requests** [vocabulary; A2; 12 activities]. Source outcome: Understand common shop vocabulary such as price, receipt, size and refund.
  - **VOC-A2-05 — Food preparation and simple instructions** [vocabulary; A2; 8 activities]. Source outcome: understand common food-preparation verbs in everyday instructions;
- **What to check / proposed future additions:** Check quantity language, transactions, politeness and accurate varied price/amount responses. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Resolve a fictional shopping problem by extracting quantities and polite requests. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U04 — Choices, comparisons and reasons
- **Role / learning outcome:** Compare places/activities and make a short reasoned choice.
- **Core content and skill connections:** comparative/superlative; criteria; explanatory connectors; brief recommendation.
- **Proposed prerequisite(s):** A2-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; grammar 1, listening 1).
  - **GRA-A2-04 — Comparatives and superlatives** [grammar; A2; 10 activities]. Source outcome: Use comparative forms with than for two people or things.
  - **LIS-A2-03 — Choosing a class at the sports centre** [listening; A2; 8 activities]. Source outcome: understand the main purpose of a short everyday conversation;
- **What to check / proposed future additions:** Check comparison for a reader's needs, not just adjective forms; link to decisions/recommendations. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Recommend one of two clubs with two source-supported reasons. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U05 — Plans, arrangements and predictions
- **Role / learning outcome:** Distinguish intentions, arrangements and simple predictions.
- **Core content and skill connections:** going to; will; present continuous for arrangements; dates and planning messages.
- **Proposed prerequisite(s):** A2-U01; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 2, listening 1).
  - **GRA-A2-05 — Future intentions with be going to** [grammar; A2; 14 activities]. Source outcome: Express a simple future intention using be going to plus a base verb.
  - **GRA-A2-11 — Choosing future forms: will, going to and present continuous** [grammar; A2; 10 activities]. Source outcome: Use will for spontaneous decisions and simple predictions.
  - **LIS-A2-02 — A changed plan for Saturday** [listening; A2; 10 activities]. Source outcome: Understand the purpose of a short conversation about a changed plan.
- **What to check / proposed future additions:** Check future intentions, predictions and fixed arrangements across email/listening genres. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Interpret a changed plan and explain why a chosen future expression fits. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U06 — Rules, problems and advice
- **Role / learning outcome:** Explain a rule, obligation or simple problem and propose a solution.
- **Core content and skill connections:** must/have to; should; polite requests; service messages; practical dialogue.
- **Proposed prerequisite(s):** A1-U07; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **7** (provisional primary placement; grammar 4, vocabulary 1, speaking 1, listening 1).
  - **GRA-A2-06 — Rules: must, must not and have to** [grammar; A2; 14 activities]. Source outcome: Identify required, forbidden and optional actions from everyday notices.
  - **GRA-A2-12 — Advice with should and shouldn't** [grammar; A2; 10 activities]. Source outcome: Give simple advice with should + base verb.
  - **GRA-A2-13 — Possibility with may, might and could** [grammar; A2; 10 activities]. Source outcome: Use may/might/could + base verb to express present or future possibility.
  - **GRA-A2-14 — Zero and first conditionals** [grammar; A2; 10 activities]. Source outcome: Use the zero conditional for general results with present simple in both clauses.
  - **VOC-A2-04 — Feelings, reactions and useful adjective pairs** [vocabulary; A2; 8 activities]. Source outcome: Use common adjective–preposition combinations for feelings and reactions.
  - **SPE-A2-02 — Explain a simple problem and ask for help** [speaking; A2; 5 activities]. Source outcome: State a simple problem clearly.
  - **LIS-A2-06 — Repairing a Bicycle** [listening; A2; 7 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check rules/advice distinctions, lack of obligation and options for a real-world problem. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Suggest a safe, realistic solution after reading a short rule notice. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U07 — Experiences and recent changes
- **Role / learning outcome:** Ask about life experience and distinguish completed past from present relevance.
- **Core content and skill connections:** present perfect ever/never, just/already/yet; interview and short narratives.
- **Proposed prerequisite(s):** A2-U02; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; grammar 2).
  - **GRA-A2-09 — Present perfect: experiences with ever and never** [grammar; A2; 10 activities]. Source outcome: Build present-perfect experience statements with have or has plus a past participle.
  - **GRA-A2-10 — Present perfect: just, already and yet** [grammar; A2; 10 activities]. Source outcome: Use just and already with the present perfect in common positions.
- **What to check / proposed future additions:** Check the boundary between definite past time and present relevance; vary discourse tasks. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Describe a fictional experience and answer follow-up questions with appropriate tense. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U08 — Travel and community information
- **Role / learning outcome:** Extract practical detail and infer simple implications across two sources.
- **Core content and skill connections:** travel/event collocations; scanning; multiple-message comparison; listening for key decisions.
- **Proposed prerequisite(s):** A2-U02, A2-U04; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **12** (provisional primary placement; reading 6, listening 3, vocabulary 1, grammar 2).
  - **REA-A2-02 — A class book exchange** [reading; A2; 8 activities]. Source outcome: Find the purpose and details of a short event announcement.
  - **REA-A2-01 — A garden for everyone** [reading; A2; 11 activities]. Source outcome: Identify a text’s main idea
  - **LIS-A2-01 — A workshop at the library** [listening; A2; 5 activities]. Source outcome: Understand key details in a short conversation
  - **REA-A2-03 — A garden project changes its plan** [reading; A2; 8 activities]. Source outcome: Identify the main purpose of a school project update.
  - **VOC-A2-02 — Travel and event collocations in context** [vocabulary; A2; 8 activities]. Source outcome: Recognise frequent travel and event word partnerships in context.
  - **REA-A2-04 — An event update: compare plans and conditions** [reading; A2; 12 activities]. Source outcome: Read an updated message for purpose and revised arrangements.
  - **GRA-A2-15 — Common verb patterns: to-infinitive and -ing** [grammar; A2; 10 activities]. Source outcome: Use to-infinitive after common verbs such as want, plan, hope and decide.
  - **GRA-A2-16 — Defining relative clauses: who, which and that** [grammar; A2; 10 activities]. Source outcome: Use who or that to identify a person with a defining relative clause.
  - **REA-A2-05 — Two club updates: compare practical details** [reading; A2; 8 activities]. Source outcome: Find practical details in two short school notices.
  - **REA-A2-06 — Which club fits you?** [reading; A2; 8 activities]. Source outcome: find key details across short club notices;
  - **LIS-A2-04 — Changing Trains After a Delay** [listening; A2; 7 activities]. Source outcome: Understand the main purpose of a short spoken recording.
  - **LIS-A2-05 — An Art Exhibition Reminder** [listening; A2; 7 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check multiple text genres plus audio, simple inference and combined relevant facts. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Choose an event/travel option using details from two independent notices. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U09 — Relevant ideas, messages and paragraphs
- **Role / learning outcome:** Analyze task requirements, brainstorm relevant support and write a usable message.
- **Core content and skill connections:** 4-part prompt model; idea filtering; paragraph/email conventions; rubric self-check.
- **Proposed prerequisite(s):** A1-U10, A2-U04; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **4** (provisional primary placement; writing 4).
  - **WRI-A2-01 — Write a helpful email** [writing; A2; 7 activities]. Source outcome: Respond to every part of a practical prompt
  - **WRI-A2-02 — Describe a school event in an email** [writing; A2; 5 activities]. Source outcome: Identify the audience and three content requirements of an email task.
  - **WRI-A2-03 — Recommend a club with reasons** [writing; A2; 5 activities]. Source outcome: Identify the audience, choice and two requested reasons.
  - **WRI-A2-04 — Reply to a message and solve a small problem** [writing; A2; 7 activities]. Source outcome: Identify every practical point in a short message task.
- **What to check / proposed future additions:** Integrate approved but unreleased Wave A strategy lessons only when independently accepted exact sources are available; audit existing email/paragraph work. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Analyse a new task, select ideas, draft and self-revise without assuming automatic semantic grading. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### A2-U10 — A2 integrated transfer checkpoint
- **Role / learning outcome:** Use reading/listening evidence to select solutions and draft a short original text.
- **Core content and skill connections:** comprehension across genres; unassessed free response; pronunciation hearing vs speech distinction.
- **Proposed prerequisite(s):** A2-U01…A2-U09; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; pronunciation 3).
  - **PRO-A2-01 — Hear and practise /iː/ and /ɪ/** [pronunciation; A2; 3 activities]. Source outcome: Notice a common vowel contrast
  - **PRO-A2-02 — Hear stress in common two-syllable words** [pronunciation; A2; 5 activities]. Source outcome: Notice which syllable is stronger in common two-syllable words.
  - **PRO-A2-03 — Hear the three common -ed endings** [pronunciation; A2; 6 activities]. Source outcome: Recognise the common /t/, /d/ and /ɪd/ pronunciations of regular past-tense -ed.
- **What to check / proposed future additions:** Design a cross-domain practical task reusing A2 lessons; verify audio and no duplicate learner scoring. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Use a short audio and text to choose a practical solution, then write a brief unassessed reply. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

### Level B1: programme-level intended progression
Connected narrative and inference → evidence-based views → interpreting discussion and digital claims → connected written arguments → integrated transfer.

#### B1-U01 — Connected narratives and experiences
- **Role / learning outcome:** Tell a coherent past story with time relationships and relevant detail.
- **Core content and skill connections:** past perfect/continuous; used to; sequencing; narrative gist and inference.
- **Proposed prerequisite(s):** A2-U02, A2-U07; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **4** (provisional primary placement; grammar 4).
  - **GRA-B1-01 — Past simple and present perfect** [grammar; B1; 6 activities]. Source outcome: Use past simple with a finished past time
  - **GRA-B1-02 — Present perfect simple or continuous?** [grammar; B1; 10 activities]. Source outcome: Choose present perfect simple when a completed result or number is important.
  - **GRA-B1-03 — Past perfect and narrative order** [grammar; B1; 10 activities]. Source outcome: Use had + past participle for an action completed before another past time or action.
  - **GRA-B1-04 — Past habits with used to and would** [grammar; B1; 10 activities]. Source outcome: Use used to for past states or repeated actions that are no longer true.
- **What to check / proposed future additions:** Check whether existing narrative Grammar supports coherent reading and independent retelling; include contextual genre breadth. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Reconstruct a short narrative and explain time relations and key causes. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U02 — Opinions, claims and evidence
- **Role / learning outcome:** Identify claim/reason/example and build a supported recommendation.
- **Core content and skill connections:** evidence-supported paragraphs; relevance; stance vocabulary; comparison.
- **Proposed prerequisite(s):** A2-U04, A2-U09; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; speaking 1, vocabulary 1).
  - **SPE-B1-01 — Explain and support an opinion** [speaking; B1; 2 activities]. Source outcome: Give an opinion with reasons
  - **VOC-B1-04 — Verbs for explaining evidence and change** [vocabulary; B1; 8 activities]. Source outcome: Use common B1 verbs for describing evidence, causes and changes.
- **What to check / proposed future additions:** Integrate existing B1 recommendation units with approved Wave A Claim–Reason–Example method after release gates, avoiding duplicate content. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Distinguish assertion from evidence and write a paragraph supporting a defensible choice. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U03 — Reading between lines
- **Role / learning outcome:** Differentiate stated facts, inferences, author purpose and text structure.
- **Core content and skill connections:** reading inference/purpose/context vocabulary; evidence-limited interpretations.
- **Proposed prerequisite(s):** A1-U09, A2-U08; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 1, reading 2).
  - **GRA-B1-10 — Defining and non-defining relative clauses** [grammar; B1; 10 activities]. Source outcome: Distinguish defining relative clauses from non-defining clauses that add extra information.
  - **REA-B1-04 — Why some study breaks work better** [reading; B1; 10 activities]. Source outcome: Identify the writer's main claim and supporting contrast.
  - **REA-B1-05 — Can short breaks help you learn?** [reading; B1; 8 activities]. Source outcome: identify the main claim of a balanced informational text;
- **What to check / proposed future additions:** Check genuine inference, genre variety, author purpose and evidence limits in each B1 Reading passage. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Explain both an explicit point and a text-grounded implied conclusion. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U04 — Listening to viewpoints and intentions
- **Role / learning outcome:** Follow discussion gist, speaker intention, detail and changes of plan.
- **Core content and skill connections:** multi-speaker audio; stance, agreement/disagreement, inference; playback safeguards.
- **Proposed prerequisite(s):** A2-U10; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **4** (provisional primary placement; listening 4).
  - **LIS-B1-01 — Choosing a reliable journey** [listening; B1; 5 activities]. Source outcome: Understand speaker attitude and comparisons
  - **LIS-B1-02 — Discussing a group-project problem** [listening; B1; 10 activities]. Source outcome: Identify the main problem and proposed solution in a planning conversation.
  - **LIS-B1-03 — Planning a study-group session** [listening; B1; 10 activities]. Source outcome: Identify the main problem and agreed solution in a planning conversation.
  - **LIS-B1-04 — Planning a student podcast episode** [listening; B1; 8 activities]. Source outcome: identify the main problem and proposed compromise in a planning discussion;
- **What to check / proposed future additions:** Verify physical audio, transcript gating and speaker-intention/inference differences across recordings. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Summarise a discussion's contrasting views and reasons using actual audio. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U05 — Hypotheticals and responsible advice
- **Role / learning outcome:** Express possibility, conditions and consequences accurately.
- **Core content and skill connections:** conditionals; modal deduction; wishes; problem solving.
- **Proposed prerequisite(s):** A2-U06; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **3** (provisional primary placement; grammar 3).
  - **GRA-B1-05 — Modal deduction: must, might and can't** [grammar; B1; 10 activities]. Source outcome: Use must for a strong positive deduction based on present evidence.
  - **GRA-B1-06 — Second conditional: imaginary situations** [grammar; B1; 10 activities]. Source outcome: Use if + past simple and would + base verb for imaginary or unlikely present/future situations.
  - **GRA-B1-07 — Wish and if only for present situations** [grammar; B1; 10 activities]. Source outcome: Use wish + past form to express that a present situation is different from what you want.
- **What to check / proposed future additions:** Check conditionals, modal deduction and hypothetical claims in coherent situations, not stand-alone form drills. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Give qualified advice about an imaginary choice and justify the likely consequence. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U06 — Community, environment and information
- **Role / learning outcome:** Understand and explain causes/consequences using coherent facts.
- **Core content and skill connections:** topic collocations; compare sources; reason-result chains; solution pitches.
- **Proposed prerequisite(s):** B1-U02, B1-U03; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **6** (provisional primary placement; vocabulary 1, reading 2, grammar 1, listening 2).
  - **VOC-B1-01 — Talking about sustainable choices** [vocabulary; B1; 5 activities]. Source outcome: Use common environmental collocations
  - **REA-B1-01 — What makes practice effective?** [reading; B1; 5 activities]. Source outcome: Distinguish the writer’s claim from a qualification
  - **GRA-B1-08 — Passive voice in the present and past** [grammar; B1; 10 activities]. Source outcome: Form the present simple passive with am/is/are + past participle.
  - **REA-B1-02 — A repair café comes to school** [reading; B1; 10 activities]. Source outcome: Identify the main purpose of an informative school text.
  - **LIS-B1-05 — A Library of Things** [listening; B1; 8 activities]. Source outcome: Understand the main purpose of a short spoken recording.
  - **LIS-B1-06 — What We Learned from a Pop-Up Sale** [listening; B1; 8 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check cause–effect/topic lexicon, problem/solution transfer and information reliability. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Explain a community problem from sources and propose one evidence-supported response. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U07 — Digital information and critical reading
- **Role / learning outcome:** Distinguish trustworthy statements, misleading assumptions and source limits.
- **Core content and skill connections:** author purpose; opinion/fact; inference limits; safe media literacy.
- **Proposed prerequisite(s):** B1-U03; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **2** (provisional primary placement; reading 1, listening 1).
  - **REA-B1-03 — Should study apps plan every session?** [reading; B1; 10 activities]. Source outcome: Identify the writer's balanced main claim in a viewpoint text.
  - **LIS-B1-07 — Checking a Photo Before Sharing** [listening; B1; 8 activities]. Source outcome: Understand the main purpose of a short spoken recording.
- **What to check / proposed future additions:** Check bias, unverifiable assumptions, source checking and speaker purpose in age-appropriate media scenarios. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Distinguish a claim, a verified detail and an unsupported inference. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U08 — Functional conversations and mediation
- **Role / learning outcome:** Prepare explanations, clarifications and simple summaries for another person.
- **Core content and skill connections:** functional chunks; negotiation; note-taking; speaking self-practice, not graded oral ability.
- **Proposed prerequisite(s):** B1-U02, B1-U04; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **8** (provisional primary placement; grammar 2, vocabulary 2, speaking 2, pronunciation 2).
  - **GRA-B1-09 — Reported statements and questions** [grammar; B1; 10 activities]. Source outcome: Report basic statements after a past reporting verb using an appropriate backshift.
  - **GRA-B1-12 — Indirect questions and question tags** [grammar; B1; 10 activities]. Source outcome: Use statement word order after an indirect-question opener.
  - **VOC-B1-03 — Collocations for plans, problems and decisions** [vocabulary; B1; 10 activities]. Source outcome: Use common B1 collocations connected with plans, decisions and problem solving.
  - **SPE-B1-02 — Compare two options and answer a follow-up** [speaking; B1; 6 activities]. Source outcome: Compare two options using relevant criteria.
  - **PRO-B1-01 — Use sentence stress to show the important idea** [pronunciation; B1; 6 activities]. Source outcome: Notice that content words often carry stronger sentence stress.
  - **SPE-B1-03 — Explain a problem and propose a practical solution** [speaking; B1; 6 activities]. Source outcome: Describe a practical problem clearly.
  - **PRO-B1-02 — Use intonation to ask, check and confirm** [pronunciation; B1; 6 activities]. Source outcome: Notice common rising and falling intonation patterns in short questions.
  - **VOC-B1-05 — Learning goals, progress and feedback** [vocabulary; B1; 8 activities]. Source outcome: understand common B1 collocations used to talk about learning and improvement;
- **What to check / proposed future additions:** Check functional language and note/summarise tasks; speaking remains self-reported, not proficiency-scored. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Prepare and rehearse a response that explains options and handles one clarification request. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U09 — Opinion writing, structure and revision
- **Role / learning outcome:** Plan, draft and improve connected paragraphs with reasons and appropriate links.
- **Core content and skill connections:** outlining; cohesion; tone; 3-pass editing; provisional writing review.
- **Proposed prerequisite(s):** B1-U02, A2-U09; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **5** (provisional primary placement; writing 3, grammar 1, vocabulary 1).
  - **WRI-B1-01 — Develop an opinion paragraph** [writing; B1; 3 activities]. Source outcome: State a clear opinion
  - **GRA-B1-11 — Gerunds and infinitives after common verbs** [grammar; B1; 10 activities]. Source outcome: Use -ing forms after common verbs such as enjoy, avoid, finish and suggest.
  - **VOC-B1-02 — Word families for study and communication** [vocabulary; B1; 10 activities]. Source outcome: Recognize common noun, verb, adjective and adverb forms in familiar word families.
  - **WRI-B1-02 — Build a clear opinion paragraph** [writing; B1; 10 activities]. Source outcome: Analyse an opinion prompt and choose relevant ideas.
  - **WRI-B1-03 — Compare two options and recommend one** [writing; B1; 9 activities]. Source outcome: Select relevant comparison criteria from a practical brief.
- **What to check / proposed future additions:** Integrate currently released opinion tasks and Wave A organisation/cohesion/revision strategies only if later released. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Plan and revise a structured view with reason/example, caveat and clearer cohesion. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** PARTIALLY_MAPPED (not independently audited for Unit outcome). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B1-U10 — B1 integrated transfer checkpoint
- **Role / learning outcome:** Understand mixed-source arguments and communicate a substantiated position.
- **Core content and skill connections:** independent reading/listening; written response; evidence and progress separated.
- **Proposed prerequisite(s):** B1-U01…B1-U09; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** Construct mixed-source checkpoint with authentic B1 Listening/Reading and original writing, but no invented mastery. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Summarise two views and write a justified recommendation; status of free responses honest. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

### Level B2: programme-level intended progression
Nuanced language and source analysis → extended audio and synthesis → counterarguments and academic-style writing → mediated explanation and integrated transfer.

#### B2-U01 — Complex time, modality and nuance
- **Role / learning outcome:** Interpret and use nuanced tense/aspect, modality and complex clauses in context.
- **Core content and skill connections:** advanced grammar contrasts; conditional meaning; register.
- **Proposed prerequisite(s):** B1-U01, B1-U05; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson exists; plan advanced-meaning contrasts only after B1 prerequisite mastery is evidenced. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Interpret the nuance of two alternative complex constructions and select appropriate register. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U02 — Precision vocabulary and register
- **Role / learning outcome:** Select suitable collocations, stance/hedging chunks and topic-specific lexis.
- **Core content and skill connections:** register; connotation; word formation; retrieval and new-context transfer.
- **Proposed prerequisite(s):** B1-U06, B1-U09; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan lexical precision, hedging, word-family/collocation retrieval and topical range. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Choose and justify nuanced stance language in a new formal text. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U03 — Analytical reading and source evaluation
- **Role / learning outcome:** Identify line of argument, unstated assumptions, qualifications and credibility.
- **Core content and skill connections:** longer original texts; purpose; inference; competing interpretations.
- **Proposed prerequisite(s):** B1-U03, B1-U07; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan argument structure, assumptions, qualifications and conflicting evidence. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Evaluate a longer original text and explain why an inference is warranted or not. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U04 — Lecture and discussion listening
- **Role / learning outcome:** Follow an extended explanation and distinguish supporting points and attitude.
- **Core content and skill connections:** linked real audio; note selection; speaker stance; detail/inference.
- **Proposed prerequisite(s):** B1-U04; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson or confirmed audio assets; plan rights-cleared extended discussion and lecture recordings. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Identify stance shifts and supporting evidence from real extended audio. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U05 — Comparing and synthesising sources
- **Role / learning outcome:** Combine relevant ideas from two texts while preserving evidence boundaries.
- **Core content and skill connections:** synthesis, paraphrase, fact/opinion, source comparison; mediation planning.
- **Proposed prerequisite(s):** B2-U03, B2-U04; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan reading-to-writing synthesis with attribution and no invented source claims. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Synthesize two independent short source positions without distortion. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U06 — Argument, counterargument and qualification
- **Role / learning outcome:** Build a defensible position while acknowledging alternative views.
- **Core content and skill connections:** thesis, evidence, counterpoint/rebuttal, hedging, logical paragraph progression.
- **Proposed prerequisite(s):** B1-U09, B2-U03; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan counterargument, qualification and credible evidence rather than connector-count. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Produce an outline that fairly compares a claim and counterclaim. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U07 — Academic-style organised writing
- **Role / learning outcome:** Plan, draft, revise and source-check a multi-paragraph argument or report.
- **Core content and skill connections:** task interpretation; coherent development; varied register; trusted review, not automatic CEFR.
- **Proposed prerequisite(s):** B2-U05, B2-U06; **priority:** P0. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan extended writing process and trusted reviewed rubric. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Plan, draft, inspect and revise a structured report/argument; do not invent AI proficiency grade. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U08 — Explaining and facilitating discussions
- **Role / learning outcome:** Prepare clear explanations, compare perspectives and summarise disagreement.
- **Core content and skill connections:** functional mediation; listening-to-speak transfer; oral preparation UNASSESSED.
- **Proposed prerequisite(s):** B2-U04, B2-U06; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan mediation and prepared spoken summaries, without unvalidated oral score. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Prepare a balanced spoken summary for another fictional audience and self-check. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U09 — Society, technology and global challenges
- **Role / learning outcome:** Evaluate well-supported viewpoints in contextual topic-rich tasks.
- **Core content and skill connections:** environment, digital ethics, science and education; evidence/claims; authentic-style texts.
- **Proposed prerequisite(s):** B2-U02, B2-U03; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; plan topic-based source evaluation (technology, environment, education). This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Compare evidence and limitations across texts on a contemporary issue. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

#### B2-U10 — B2 synthesis checkpoint and exam transfer
- **Role / learning outcome:** Complete integrated reading/listening/writing practice with explicit evidence limits.
- **Core content and skill connections:** multi-source task; error repair; exam strategy as optional overlay; score/proficiency separation.
- **Proposed prerequisite(s):** B2-U01…B2-U09; **priority:** P1. Dependencies are conceptual, not demonstrated runtime locks.
- **Current mapped source lessons:** **0** (provisional primary placement; none).
  - None directly mapped from 1.18.1. **Do not** infer no reusable content exists in earlier Units.
- **What to check / proposed future additions:** No baseline B2 lesson; design optional integrated checkpoint and future exam transfer, not certification. This is not a claim the current lesson is faulty or that a specific subskill is definitely absent.
- **Unit-level independent transfer target:** Use reading, listening and writing in a multi-source task and review error evidence. Status: **PROPOSED**, not an already released scored activity.
- **Coverage verdict now:** NO_PRIMARY_LESSON_MAPPED (not a verified syllabus gap). Require review of actual explanatory text, passage/audio, comprehension type, independent examples and evidence before assigning an academic completion judgment.

## 4. Programme-wide curriculum coherence and gaps requiring architecture review
1. **Prerequisite progression:** existing A1/A2 Grammar may support foundational skills, but full non-Grammar dependencies are not documented as enforceable. Unit prerequisite graph is proposed for NotebookLM review before adoption.
2. **Cross-skill connections:** the same communicative theme can combine skills without forcing all seven domains per Unit. Across each CEFR level, inspect gist/detail/inference/purpose in reading; gist/detail/speaker-intention in listening; productive writing, register, lexical retrieval and pronunciation awareness.
3. **Learning evidence:** current baseline has many objective items and few original response items. Contextual transfer tasks are *proposed*; scoring of open response is review-required and CEFR is instructional target only.
4. **B2 absence:** no B2 lesson is in 1.18.1. B2 Unit descriptions are development targets only. A1-U10 and B1-U10 are integrative checkpoints, so zero primary assignments do not imply zero supporting content.
5. **Gaps vs defects:** a subskill not visible in source titles/primary mapping is a candidate coverage question, *not* grounds to rewrite or deprecate a previously approved lesson. Review only whether additional Units/tasks are needed, or whether cross-referencing current material suffices.
6. **Previously approved incremental content:** 6 Writing Wave A lessons may become source after separate release gates; 6 Vocabulary/Reading Wave B lessons remain externally unverified; neither was silently counted in the 109/913.
7. **Open structural quality point:** 24 legacy lessons have `examples` array empty, which is a format-level observation and not proof their explanations lack models. If a need emerges, inspect only the affected teaching gap; don't blanket-review old banks.

## 5. Development stages after global architecture verdict
**Stage F0:** review integrated Unit catalogue (this document) against permanent academic sources; fix structural problems and freeze Framework v1.0. This requires no re-release of old lessons.
**Stage F1:** verify each existing lesson's *coverage placement* (source ID → primary/secondary Unit → relevant learning goal), prioritising uncertain mappings and authentic source variety. Preserve original texts and review history.
**Stage F2:** create a gap register **only** for competencies not sufficiently covered by existing lessons; prioritise A1→A2 prerequisites and Writing/Reading/Listening transfer as indicated by review.
**Stage F3:** author genuinely new lesson content in small approved batches with CORE-1…4, NotebookLM academic review, one PR QA, immutable cumulative package and owner release authorisation.
**Stage F4:** expand B1 and B2, audio and advanced Writing carefully; enrich optional exam-preparation overlays after general competence pathways are credible.

## 6. Architecture review questions (NOT a request to regrade old lessons)
1. Does the overall A1–B2 Unit progression make sense given the five permanent English academic sources and SLE-MASTER-001?
2. Which essential themes, linguistic functions and skill subcompetencies are missing from the *proposed* Unit outcomes?
3. Are existing 109 lessons placed into the most relevant Units and what precise placements or secondary links should change? Name IDs, but do not audit old individual answer keys.
4. Which Unit prerequisites are incorrect, overly demanding or cyclic? Propose corrected dependencies.
5. Are ten Units per level too few, too many, or suitable? Suggest merges/splits only with curriculum reasons.
6. Is the A1/A2→B1→B2 transition defensible without claiming CEFR completion based only on mapped lesson count?
7. How should cross-skill/transfer checkpoints and authentic reading/audio/writing genres be added without duplicating historical assessments?
8. Distinguish *genuine* gaps from mapped-content uncertainty, and rank additional new Units/lessons by educational benefit and dependencies.
9. Are Speaking self-practice, pronunciation and open writing evidence distinguished correctly from validated proficiency?
10. Propose specific revisions to integrated Framework v1.0, separate must-fix structural defects from optional improvements, and give an achievable sequence.

## 7. External review decision format
Return `FRAMEWORK_ARCHITECTURE_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE`, `ACADEMIC_ADOPTION: GO/NO-GO`, `PRODUCTION: NOT_REQUESTED`, (i) Unit-level changes with exact IDs and reasons, (ii) placement corrections, (iii) missing outcomes / prerequisite corrections, (iv) overall level coverage caveats, (v) optional ideas, (vi) proposed sequence and evidence limitations. **Do not issue new per-item content verdicts.**

**Permanent reference:** SLE-MASTER-001 v1.1.0; append the approved curriculum outcomes as descriptive architecture, not a competing governing rulebook. **End of integrated draft.**

---
## End of review packet
**Remember:** the 109 baseline lessons stay. Only the global architecture and additional curriculum plan are under review here.
