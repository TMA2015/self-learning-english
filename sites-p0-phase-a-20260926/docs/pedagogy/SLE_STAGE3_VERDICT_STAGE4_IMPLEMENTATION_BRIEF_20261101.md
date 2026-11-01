# Self-Learning English — Stage 3 Verdict and Stage 4 Integration Brief

**ID:** SLE-STAGE3-VERDICT-STAGE4-20261101  
**Date:** 2026-11-01  
**Repository:** TMA2015/self-learning-english  
**Source branch/checkpoint:** `release/nov2026-content-v1.18.0`, head at handoff `29b9895803ff19372610faae2f542719f5c37067`  
**Purpose:** One GitHub-hosted source of truth for the approved teaching design, remaining blockers and next controlled engineering work.  
**Status:** Documentation/authoring only. No curriculum import, code deployment, audio creation, user-data change, Math deployment or billing change.

## Project-specific file and review policy — Owner direction (2026-11-01)

- Keep intermediate engineering documents, draft source files, technical manifests, review verdicts and implementation notes **in GitHub**, not as a series of user downloads.
- For NotebookLM academic review, hand off **exactly one complete, human-readable Markdown review packet** when a new academic decision genuinely needs review. That packet must contain the relevant evidence, questions, proposed text and required verdict format. Do not make the parent assemble multiple files. Do not provide ZIPs for routine handoff. Do not upload raw JSON to NotebookLM.
- Maintain NotebookLM permanent baseline sources separately from one current temporary review source. Each handoff says KEEP / REMOVE / ADD and provides a very short pasteable prompt.
- Staging and implementation files stay on a dedicated non-production GitHub branch. Do not silently modify release/main, curriculum history, Firebase Math settings or learner attempts.
- Do not start another NotebookLM round merely to repeat a verdict already approved. Use academic review for substantively new authored material or required unresolved academic changes.

## Stage 3 independent verdict received from owner

**Review ID:** SLE-STAGE3-TECH-AUTHORING-20261101-R1.  
**Verdict:** `PASS_WITH_REQUIRED_CHANGES`.  
**Academic GO:** yes — five-lesson self-learning design and evidence safeguards approved in principle.  
**Production GO:** **NO** — implementation, audio and physical browser validation are pending.  
**Base curriculum:** `1.18.0` — 109 lessons, 913 activities, 38 MP3s. The published package and existing records stay immutable.

| Module | Academic review finding | Mandatory next action |
| --- | --- | --- |
| `REA-A1-01` Reading | New *Guitar Group* model avoids revealing existing art-club quiz answers | Replace, never append, legacy learner-visible examples in a new version; keep original passage, eight QIDs/keys |
| `VOC-A1-01` Vocabulary | New *School Chunks* toolkit teaches useful natural expressions without leaking existing quiz items | Replace legacy example blocks in a new version; retain eight existing QIDs/keys |
| `LIS-A1-01` Listening | Canonical answer IDs may stay all A because per-attempt option shuffling is implemented | Browser QA: two new attempts, varying displayed order, correct mapping, saved-order restore, real playback and transcript safeguards |
| `SPE-A2-02` Speaking Preparation | Historical objective MCQs test preparation/language knowledge, not performed speech | Project historical Q1–Q4 read-only as `language_preparation_knowledge`; all new oral preparation/self-checks have oral proficiency weight 0 |
| `PRO-A2-01` Pronunciation | Proposed new minimal-pair hearing tasks are not assessable without new audio | Produce/validate isolated `feet`, `fit`, `beat`, `bit` MP3s, verify rights, human listening QA, runtime mapping; leave new hearing tasks UNASSESSED/weight 0 until ready |

**Additional academic note:** Existing `REA-A1-01-Q7` tag `reading.inference` probably describes a near-explicit detail. A future reviewed package may change the tag, but no old attempt may be rewritten or regraded.

## Approved field-level content for future version — do not import this document

The following authored instructional text should replace the corresponding **learner-visible** lesson explanations/examples only in a newly versioned, reviewed cumulative curriculum. Existing learner attempts must continue to resolve their recorded content version. These excerpts are implementation source proposals, not a valid importer JSON package.

### REA-A1-01 — worked explanation replacement

Goal: Read a notice once for its purpose, again for details; recognize conditions and grounded inference. Evidence highlighting is optional and is **not** a grading gate.

**English explanation:** Read a short notice once to understand its purpose. Read again to answer practical questions: when, where, what to bring and what to do. Check the full phrase, including words such as *if*, *before* and *only*. For an inference, combine clues carefully; the text may suggest something without saying it word for word. Highlighting text is an optional helper, not a requirement for answering.

**Independent model (not the quiz passage):** The guitar group meets on Tuesdays at lunchtime. Come to Music Room 3. Bring your guitar if you have one. Beginners are welcome.

**Worked steps:** (1) Gist: this is an invitation/information about a guitar group. (2) Detail: Music Room 3 is the venue; Tuesday lunchtime is the time. (3) Condition: "if you have one" means owning a guitar is not required by that sentence. (4) Inference: "Beginners are welcome" supports that someone new to guitar can join; it does not guarantee private lessons.

**Critical integration rule:** Do not display legacy art-club example cards beside these cards. The scored passage `PASS-REA-A1-01` and `REA-A1-01-Q1…Q8` remain unchanged.

### VOC-A1-01 — worked explanation replacement

Goal: Recognize language chunks, use them in context and recall them without always relying on four visible options.

**English explanation:** Words are more useful when learned in chunks: a verb together with the words that normally follow it. Decide what action the situation requires before choosing an expression. For example, checking a schedule, asking how to reach a place, and giving a completed form are three different actions. Practise recalling the missing word later without looking at a list; any review schedule is only a suggestion.

| Language chunk | Meaning | Independent model sentence |
| --- | --- | --- |
| check the timetable | look at the plan for classes | I check the timetable before my next class. |
| ask for directions | ask how to reach a place | At a new school, I ask for directions. |
| hand in a form | give a completed paper | I hand in a form at the school office. |
| join a school club | become a member | I want to join a club this term. |

**Worked strategy:** First identify the action in a situation, then choose the verb-noun chunk expressing that intention. A timetable is for checking a schedule; a form is for handing in.

**Critical integration rule:** Replace all learner-visible legacy library/repeat/ruler examples; retain `VOC-A1-01-Q1…Q8`, original source keys and history. New open-ended learner sentences must be `UNASSESSED` unless independently reviewed.

## Speaking evidence — forward-only contract

- Historical `SPE-A2-02-Q1…Q4` currently have source `evidence_weight=1` (objective preparation questions), while Q5 has 0. The Foundation evidence ingestion code in `application/academic-service.ts` currently creates skill-map evidence for **Grammar, Vocabulary, Reading and Listening only**. Do not claim these older Speaking MCQs inflated the Skill Map without other evidence.
- Future read-only display projection key: `{lessonId,contentVersion,questionId}`, displayCategory `language_preparation_knowledge`, `oralProficiencyWeight=0`; preserve original saved question correctness and raw records.
- Future practice label: **Speaking · Prepare & Practise**. Learner plans, speaking-aloud steps and checkboxes are `Self-Reported Practice`, with oral competence weight 0. Recording or a text plan alone does not prove oral level or CEFR.
- If adding new runtime metadata, check the academic schema validator, model mapping, storage adapter, UI and versioned export before editing data. Do **not** insert unvalidated keys in the current importer.

## Pronunciation audio production plan (NOT PRODUCED)

The existing `PRO-A2-01-v1.mp3` covers sheep/ship and leave/live; **it does not contain the planned feet/fit and beat/bit isolated trials**. The four proposed new asset slots are:

| Draft asset ID | Target | IPA | Proposed path | Duration / SHA-256 |
| --- | --- | --- | --- | --- |
| PRO-A2-01-FEET-R1 | feet | /fiːt/ | `/pronunciation-audio/pilot/PRO-A2-01-feet-r1.mp3` | TBD / TBD |
| PRO-A2-01-FIT-R1 | fit | /fɪt/ | `/pronunciation-audio/pilot/PRO-A2-01-fit-r1.mp3` | TBD / TBD |
| PRO-A2-01-BEAT-R1 | beat | /biːt/ | `/pronunciation-audio/pilot/PRO-A2-01-beat-r1.mp3` | TBD / TBD |
| PRO-A2-01-BIT-R1 | bit | /bɪt/ | `/pronunciation-audio/pilot/PRO-A2-01-bit-r1.mp3` | TBD / TBD |

**Production targets, not measured facts:** owner-original/rights-cleared, consistent accent/voice, mono MP3, 24 kHz and approximately 160 kbps; original voice metadata, source text, license/rights record, duration, checksum, decoding/non-silence analysis, phonetic contrast and human hearing signoff. Distinguish headphone/audio discrimination from written IPA recognition.

- `PILOT-PRO-01` (hear feet versus fit) and `PILOT-PRO-02` (hear beat versus bit / same-different) remain `UNASSESSED`, evidence weight 0 until real aligned audio, hidden-key safeguards, balanced trials and independent review. Never show filename/alt text/key revealing audio identity before answer.
- Existing pronunciation-audio manifest has source metadata whose rights state should be reconciled with the authoritative rights register before reuse; do not presume either clearance or violation.

## AI Tutor corrections — exact code boundaries

Files:
- `app/english-lesson-tutor.tsx`: current plain `<p>{answer}</p>` displays literal `**bold**`. Use an allowlisted text/React Markdown subset supporting paragraphs, bold and lists; escape arbitrary HTML; never use `dangerouslySetInnerHTML`.
- `infrastructure/browser/firebase-ai-browser.ts`: current system instruction literally says "Answer in clear, age-appropriate English." It must match the learner's question language (Vietnamese question => Vietnamese explanation with English sample language, English question => English), including reasonable handling of unaccented Vietnamese. Keep bounded lesson context, no hidden graded answers, privacy and direct-click-only calls.

QA: bold/list/newline rendering, malicious HTML inert, 300-character question cap, response limits, mobile overflow, Vietnamese + unaccented Vietnamese + English prompts, no network/fallback, and no result/diagnostic/answer disclosure.

## Listening option randomization and audio gate

Verified code:
- `domain/option-order.ts` uses Fisher–Yates random permutation from crypto for content versions `>=1.17.0`; IDs are preserved per attempt.
- `application/academic-service.ts` saves order on new attempt.
- `app/foundation.tsx` displays `orderedOptions(q, attempt)`.
- Audio playback completion and transcript post-submission gate remain mandatory.

**Needed manual QA:** two independent v1.18.0 attempts in the browser, verify visible order changes and persistence, correct-option ID mapping, final score and retake/reload; verify complete playback and no pre-submission transcript. An old historical version must retain its saved ordering. A text-only transfer script is never counted as Listening performance.

## Offline capability — independent NOT READY engineering gate

Static Firebase Hosting, a non-required AI Tutor and local browser storage are **not evidence of true offline operation**. Verify that the actual deployed app, pre-cached bundles, original MP3s and attempt store can function and persist in airplane mode with real mobile hardware (including reload, local grading and recovery after reconnect). If this is not implemented, report `OFFLINE NOT READY`, preserve the usable online non-AI learning flow and do not claim 100% offline.

## Sequencing, release boundaries and acceptance

1. Freeze and preserve current approved v1.18.0 content and historical attempts; stage technical work only in a separate branch.
2. Create an immutable **new candidate curriculum** by deriving a full package from v1.18.0. Replace REA/VOC examples in that new package; preserve existing items and checksums; do not directly import field-level changes.
3. Review scheme for prospective Speaking metadata and optional `REA-A1-01-Q7` classification; old content remains untouched.
4. Generate the four new Pronunciation MP3s as separate assets, record exact provenance/durations/hashes, perform owner hearing QA.
5. Implement and test AI Tutor Markdown + language matching without changing assessment or student drafts.
6. Run focused QA for Listening options + genuine audio, then all project release gates, mobile/desktop UX and historical save/restore.
7. Physically verify offline requirement **or keep OFFLINE NOT READY / no offline claim**; distinguish academic GO from production NO-GO.
8. Obtain explicit owner release authorization and tested rollback before an English-only deployment; keep Math, Firebase security, billing and historical learner data unaffected.

**Current decision:** Academic authoring may proceed. **Production release remains NO-GO** until the Stage 3 prerequisites are resolved and independently verified.
