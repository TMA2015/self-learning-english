# SLE NotebookLM independent review packet — standard v1.2.0-rc1

**Packet ID:** SLE-STD-PRESENTATION-QA-20261106
**Review only:** Proposed amendment to `SLE-MASTER-001` on draft GitHub PR #95, **NOT active**; currently effective standard is **v1.1.0 on main**.
**Target:** Is the proposed student-facing instructional presentation contract and recurring-defect prevention loop academically sound, teachable, technically honest and consistent with the existing one-standard governance?
**Release state:** The separate curriculum v1.20.0 (123 lessons, 1,025 activities) and A2 Unit pilot are deployed. The owner's 2026-11-06 live browser screenshot shows 19 Submitted, 22 In progress, 0 Saved/unassessed, 82 Not started (123 total). This demonstrates visible 123-course activation, **not** a complete record-by-record Recovery reconciliation, CEFR certification, or Unit pedagogical acceptance. A1–C2 work continues. These facts DO NOT imply that the proposed standard has already been approved, implemented or released.

## Source handling (one temporary file)
**KEEP:** The existing permanent English academic sources, particularly the **effective SLE-MASTER-001 v1.1.0 on main**, the approved A1–C2 10-unit Framework v1.0, and the current seven-skill educational baselines. Keep only current authoritative versions.
**REMOVE / deselect:** Previous temporary batch or superseded draft review packets; do not deselect permanent baseline content.
**ADD:** This single Markdown review packet. Do **not** add a raw curriculum JSON, GitHub CI logs or screenshots as NotebookLM review sources.

## Proposed amendment A — instructional presentation (full proposed text)

## 2.1. Instructional presentation for independent learning (PROPOSED MUST, pending adoption)

**Objective:** A learner must be able to understand *how* to use new knowledge without an adult translating long paragraphs or AI supplying the actual lesson. This subsection governs **teaching content and its rendered sequence**, not a mandatory new site theme or identical UI for all seven skills.

- **Orient first:** A lesson begins with a short learner-facing goal, a familiar meaningful situation, and any genuinely needed prerequisite. State how a successful attempt differs from simply viewing the lesson. Avoid dumping all objectives, rules and optional help onto one screen without hierarchy.
- **Explain in digestible steps:** Present concepts in coherent order (**meaning/strategy → form or method → when to use → when *not* to use**); use concise headings and small chunks that can be read on a phone. Complex B2–C2 ideas may require depth; do not impose a universal word/paragraph limit or over-simplify genuine nuance.
- **Show the thinking:** An **independent** worked example must visibly explain one decision or inference and why common alternatives fail, not merely provide a model answer. The example cannot reproduce active scored stems, reading-passage facts, listening transcript clues, or correct options. Supporting visuals/tables are optional and must be accessible.
- **Contrast likely mistakes:** Offer a short comparison, counterexample or common misconception when educationally useful. Make the conceptual distinction explicit (e.g., meaning vs grammar form, reading evidence vs assumption, actual hearing vs transcript, recognition vs productive use).
- **Make practice a conscious transition:** Label the move from guided teaching to independent scored practice; give exact response-format instructions. Preserve active item/key secrecy and provide save/resume only when supported.
- **Repair and continue:** After submit, show a brief evidence-based explanation for correct or wrong answers, one realistic next action, and optional targeted remediation/retry. Do not call an unreviewed Writing, Speaking or Pronunciation productively "mastered".
- **Use appropriate presentation per skill:** Grammar uses meaning/contrast/form; Vocabulary uses contextual chunks, retrieval and new-context use; Reading separates gist, detail and defensible inference with a distinct model text; Listening foregrounds genuine audio with gist/detail phases but no pre-submit transcript or key cues; Writing explicitly demonstrates prompt analysis, brainstorming, outlining, drafting and revision; Speaking preparation and Pronunciation distinguish preparation/awareness from actually verified hearing or oral performance.
- **Control cognitive load without artificial gates:** Default to one clear primary action per study stage, subordinate optional tips/translation/hints, readable typography, keyboard access, semantic headings/lists and safe Markdown rendering. Do not force every learner through more screens, audio replays or arbitrary durations to earn completion.
- **Observable acceptance:** Review the actual rendered lesson (not just text length or the presence of JSON `examples`) for correct hierarchy, an independent explanatory model, task clarity, feedback and next action. Test at least one representative lesson of each materially different renderer and the current content version; legacy versioned attempts must retain their original educational data. A missing optional field alone is not a teaching-quality FAIL.

**Scope / compatibility:** These are prospective authoring and rendering checks. They never authorize silently changing already scored items, legacy attempts, answer keys or imported packages. A new lesson revision uses the normal immutable content/release gates.

## Proposed amendment B — defect learning and recurrence prevention (full proposed text)

## 10.1. Defect learning and recurrence prevention (PROPOSED MUST, pending adoption)

Use the **existing** GitHub Issue/PR, source tests and standard; do not create a duplicate defect database or a separate governance document.

For any learner-affecting defect involving wrong teaching, scoring, rendering, media, saving or release:
1. **Record reproducible evidence and impact:** affected lesson/skill/version, safe steps or screenshot, expected vs actual behavior, observed learner impact, severity, source commit and whether data were touched. Never publish private responses, learner identity or credentials.
2. **Identify a demonstrated root cause:** distinguish a confirmed code/content cause from a hypothesis. If not established, label `ROOT_CAUSE_UNVERIFIED` rather than invent certainty.
3. **Repair minimally and protect history:** name changed files, old-version compatibility, possible content/attempt/media effects and rollback. Wrong keys, answer leakage, data loss and unverified real audio remain zero-tolerance blockers.
4. **Add a proportional reproducible regression check:** unit/contract/real render/audio or storage test that fails for the old issue and passes for the fix. A visual problem requires a real UI spot-check after the production deployment, even if React/server tests pass.
5. **Close only on evidence:** link test/CI on the exact relevant commit, authorized release/deploy when applicable, and the real learner-facing verification or an explicit `NOT_TESTED` limitation. Distinguish `FIXED_IN_CODE` from `DEPLOYED` and `LIVE_VERIFIED`.
6. **Feed back one preventive lesson:** when a failure reveals a general weakness (stale version allowlist, absent media provenance, overloaded explanation, unsafe storage migration), incorporate a narrow test/checklist or propose a versioned amendment to **this** standard—never a standalone competing rulebook.

Avoid blame-based or verbose incident reports for cosmetic/non-recurrent issues; one brief Issue/PR checklist suffices. Closure must never conceal a known blocker or claim a corrected learning outcome without actual evidence.

## Other targeted clarifications in proposed v1.2
- The official CEFR coverage is **A1–C2 as an instructional target**, not an automatic proficiency certification. Previously narrow A1/A2/B1/B2 authoring wording is broadened; age/grade and CEFR must not be equated.
- The v1.18.1 (109/913) historical checkpoint is not the active learner content count for every device. Reviewed v1.20.0 (123/1025) was deployed separately, but **source on GitHub, Firebase release, per-browser imported catalog and saved attempts are distinct states**. A policy revision may never alter a curriculum's immutable package, historical answers or stored attempts.
- Governance remains **exactly one** active authoritative SLE-MASTER-001. The proposed subclauses do not create a parallel pedagogical/UI standards document, secondary defect register, or an automatic user-data migration.
- The mandatory academic content review still uses independent NotebookLM; technical PR QA and owner LIVE acceptance are separate gates. A candidate standard is not active because its draft PR exists.

## Independent review questions
**Q1.** Are the seven skill-specific teaching flows in proposed Section 2.1 pedagogically justified (Grammar, Vocabulary, Reading, Listening, Writing, Speaking preparation, Pronunciation), and what exact changes are *required* rather than merely optional?
**Q2.** Does the learner-facing method teach the reasoning of a worked example and support independent transfer without leaking active quiz answers, full Listening transcript or unreviewed proficiency scores?
**Q3.** Are the learning sequence, cognitive-load and accessibility requirements implementable on small screens without an arbitrary number of forced screens, unnecessary repetition, or a single rigid template across A1–C2?
**Q4.** Does proposed Section 10.1 correctly distinguish FIXED_IN_CODE, CI_PASS, DEPLOYED, LIVE_VERIFIED and historical learner-data reconciliation? Is its severity/traceability proportionate for a small free family-learning website?
**Q5.** Are any parts of Sections 2.1 and 10.1 inconsistent with currently effective Sections 0, 2, 3, 4, 5, 7, 9, 10 or 11 of SLE-MASTER-001 v1.1.0, or the approved A1–C2 Framework? Cite the conflicting source precisely and provide replacement sentences.
**Q6.** Are additional safeguards required for versioned lesson content, legacy scores, device-local storage and transparent progress states? Check that a visible 123-lesson count is not incorrectly presented as a full Recovery audit or proof of mastery.
**Q7.** Are the extra claims that official authoring covers A1–C2 and that source/hosting/browser-import versions are separate both accurate and appropriately scoped as policy without inventing a cloud account or compulsory manual JSON import?
**Q8.** Give a minimal, observable acceptance checklist for the new teaching-presentation rule using one independently rendered exemplar per materially distinct teaching flow, without changing any old scored keys.
**Q9.** Identify any ambiguous, premature, outdated or unenforceable **MUST** provisions. For every required change, provide section, exact wording to replace, replacement text and priority.

## Required verdict
Return **PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE**, followed by:
1. Evidence-based overall judgment, with source identifiers and limits.
2. Numbered Q1–Q9 answers.
3. **Required** corrections with exact text and severity, distinct from **optional** improvements.
4. **ACADEMIC ADOPTION: GO / NO-GO**, separate from **ENGINEERING IMPLEMENTATION: GO / NO-GO**.
5. Any acceptance gates that must remain **NOT_TESTED** until actual implementation.

**Do not** assume that proposed clauses are deployed. A review verdict neither authorizes a GitHub merge nor imports or changes a learner's local content. Do not create a second standard. No personal learner answers are included in this packet.
