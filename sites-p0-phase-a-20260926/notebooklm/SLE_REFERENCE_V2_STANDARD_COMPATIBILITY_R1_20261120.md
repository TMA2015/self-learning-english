# SLE Reference Library v2 — Standard v1.2.1 compatibility confirmation (R1)

**PACKET_ID:** `SLE-REF-V2-STD-COMPAT-R1-20261120`  
**REVIEW_TARGET:** `SLE_REFERENCE_V2_STANDARD_COMPATIBILITY_R1_20261120.md`  
**Status:** Targeted provenance and academic-compatibility review ONLY; no new entry authoring, code review or release authorization.  
**Canonical product:** Self-Learning English (SLE) GitHub + Firebase website; not the separate ChatGPT-in-chat tutor.  
**Normative source:** `SLE-MASTER-001 v1.2.1`, exact canonical GitHub path `sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md`; `main` at 2026-11-20, master file blob `31e5ce2c3dc6d3c462651e88e1cd77ee071a7e10`.  
**Historical comparison source:** `SLE-MASTER-001 v1.1.0` from GitHub commit `1da0f47e7b59459df4b7d2a46818992f219664c2`.  
**Tracking:** Issue #186; engineering Draft PR #187. DO NOT merge/deploy this packet.

## 1. Why this narrow recheck is required

Two independently reported NotebookLM academic verdicts were already supplied by the project owner:

| Existing packet | Prior verdict (preserve, do not overstate) | Content scope |
| --- | --- | --- |
| `SLE-REFERENCE-V2-W1-R1-20261120` | `PASS`, `38/38`, no mandatory corrections | 15 irregular verbs, 12 Writing connectors, 11 Frequency expressions |
| `SLE-REF-IRR-FULL-R1-20261120` | `PASS`, `185/185`, no mandatory corrections | All 185 full-corpus authored irregular verbs, including the original 15 Wave 1 verb IDs |

**Provenance issue:** BOTH reviewer introductions named `SLE-MASTER-001 v1.1.0` rather than today's authoritative `v1.2.1`. The review packet(s) and owner-reported verdicts remain academically valid within their examined source sets, but cannot be silently relabeled as having checked v1.2.1.

The 15 overlapping Wave 1 verbs are NOT a third set of independent lemmas; the full corpus reviews the 185 authored records literally. The original six `REF-IRR-01..06` remain immutable. Intended unified lookup content if later released: **191 verbs + 12 connectors + 11 frequency expressions + 20 other original pilot entries = 234 unique read-only reference records**.

**Review objective:** Determine whether the *changes in the normative SLE standard between v1.1.0 and v1.2.1* create ANY new mandatory academic correction, wording/presentation safeguard or source-integrity blocker for these already-reviewed reference records. Do **not** repeat a 185-item spelling/grammar audit when only compatibility is in question; require item-specific reconsideration if a substantive rule conflict is actually found.

## 2. Relevant standard-change crosswalk — verify against the current permanent source

This is a crosswalk, not a replacement normative document. The reviewer MUST read the **actual currently selected `SLE-MASTER-001 v1.2.1` permanent source**, and treat the following as comparison notes.

| Standard area | Difference identified by GitHub comparison | Proposed Reference Library treatment to check |
| --- | --- | --- |
| §0.1, §9 and §11: source authority, notebook discipline | Current version makes single canonical local standard explicit; maintain CURRENT permanent academic baselines and current temporary packet; outdated issues/old AI prohibition are not rules | Source-set should contain current v1.2.1, not simultaneous v1.1.0. Previously issued academic PASS remains historical evidence; engineering/release separately gated |
| §2.1: independent learning presentation (new in 1.2) | Meaning/strategy → form → use → when not to use, concise mobile hierarchy, clear error contrasts and suitable examples; this section explicitly governs **teaching content and rendered sequence** | The Reference Library is a **read-only lookup resource**, not a complete scored teaching lesson; review whether current forms, examples, exception/contrast notes meet proportionate lookup expectations. Do not impose lesson-specific four-stage scored activities or claim lookup proves mastery |
| §3, §4 and §6: clarity, rights, CEFR/evidence boundaries | Legible mobile tables, safe examples; CEFR labels are instructional suggestions, never certification; unreviewed free writing not scored | Full corpus Core/Extended is editorial grouping, NOT CEFR and not measured frequency; retain no invented A1–C2 labels, marks, grades, scores or proficiency evidence. Wave 1 suggested CEFR labels are navigation hints only |
| §7, §0.1: clarified AI modes in v1.2.1 | Opt-in Knowledge/Explain vs post-save Writing Review; no global AI ban, provider eligibility separately governed | Static Reference Library must remain freely readable without AI or login; reading a reference must not submit queries/drafts to Gemini; do not call provider-specific AI policy a project-wide academic NO_GO |
| §10.1: regression/recurrence prevention (new in 1.2) | Learner-facing defects require reproducible evidence, root cause, proportional regression test and honest browser acceptance | Technical implementation has separate exact-head tests for 26 legacy entries, unique IDs, variants, A–Z, 25-row paging, 320px layout and read-only behavior; technical PASS is **not** an academic verdict or verified physical Safari acceptance |
| §10: release gate | Technical QA, rights, browser and explicit owner authorization remain distinct | The full-corpus NotebookLM result explicitly says `ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED` and `PRODUCTION_RELEASE: NOT_AUTHORIZED`. These MUST remain true here |

### Pedagogical scope to evaluate (no extra user data)
- **Irregular verbs:** 191 distinct base lemmas with V1/V2/V3, allowed regional/contextual variants, original examples and cautions for `lie` vs `lay`, `read` pronunciation, `got/gotten`, `bear/born/borne`; 6 existing pilot plus 185 newly reviewed.
- **Writing connectors:** 12 reviewed entries distinguish `because` / `because of`, `although` / `despite`, `but` / `however`; give grammatical construction, punctuation, example and common error; not a formula for automatically better essays.
- **Frequency expressions:** 11 reviewed items (8 indefinite, 3 count/interval) use qualitative/context-dependent ordering; never invent universal percentages for `usually`, `often`, `sometimes`, etc.
- **Original pilot content:** 26 reviewed entries unchanged. No assessment keys, scores, Writing response generation, curriculum import, Listening pre-submit transcript, learner-data migration or required AI.

## 3. Targeted review questions — answer all

1. **SOURCE_FRESHNESS:** Can you actually confirm the currently selected permanent master is **v1.2.1** (not merely trusting this packet), and that the other selected permanent English academic sources are current? If not, return `SOURCE_FRESHNESS=NOT_VERIFIED` and `COMPATIBILITY_ADOPTION=CONDITIONAL`.
2. **NORMATIVE_DELTA:** Do sections 0.1, 2.1, 3, 4, 6, 7, 9, 10, 10.1 or 11 of the current master introduce *any* content constraint that would change the prior 38/38 or 185/185 decision? Give exact clause/topic and affected IDs if yes. Avoid inventing requirements from historical issues.
3. **LOOKUP_VS_LESSON:** Does the v2 read-only reference remain appropriately scoped as a reference resource, rather than a substitute for the mandatory four-core teaching lesson? Are a clear usage example, relevant contrast/error, and lookup search affordances adequate for the reference use case?
4. **SEMANTIC_INTEGRITY:** Any evidence of conflict with authoring originality, variants/grammar, writing connectors, frequency nuance, child/general-audience appropriateness, or unsupported CEFR/proficiency claims? Specify exact ID(s) only for actually supported conflicts; otherwise state NONE.
5. **BOUNDARIES:** Confirm whether academic compatibility can be assessed **without** making claims about TypeScript, real Chromium/Safari, current deployment, Firebase Auth/Math, AI provider eligibility, or learner data. Identify any essential academic vs technical distinction.
6. **VERDICT:** Is the prior approved academic content compatible with v1.2.1? If `PASS`, say the older verdicts are **compatible with current standard** but do NOT pretend the older reviews themselves used v1.2.1. If not, give the precise minimum correction and follow-up scope.

## 4. Required concise verdict format

```text
PACKET_ID: SLE-REF-V2-STD-COMPAT-R1-20261120
CURRENT_STANDARD_VERIFIED: v1.2.1 / NOT_VERIFIED
SOURCE_FRESHNESS: VERIFIED / NOT_VERIFIED / CONFLICT
COMPATIBILITY_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE
COMPATIBILITY_ADOPTION: GO / CONDITIONAL / NO_GO
PRIOR_ACADEMIC_VERDICTS: WAVE1_38_OF_38_PASS; FULL_CORPUS_185_OF_185_PASS (historical, not relabeled)
AFFECTED_ENTRY_IDS: NONE / exact IDs
MANDATORY_CORRECTIONS: NONE / exact clauses, IDs and corrected wording
OPTIONAL_IMPROVEMENTS: NONE / itemized
ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED
PHYSICAL_SAFARI_ACCEPTANCE: NOT_TESTED
PRODUCTION_RELEASE: NOT_AUTHORIZED
```

**Independent review discipline:** Do not give an unconditional `GO` without actually seeing the current permanent v1.2.1 source. If old v1.1.0 and new v1.2.1 are simultaneously selected, stop and ask for source replacement; do not hide a source-selection conflict. Do not re-grade Writing/CEFR or assert any live browser acceptance from static reference content. If the reviewer needs a source packet to inspect a disputed ID, request the exact prior full packet instead of filling gaps.

## 5. NotebookLM handoff (single new temporary file)

**KEEP:** The existing current permanent English academic sources and **the latest `SLE-MASTER-001 v1.2.1` only**. Refresh/replace the previous v1.1.0 source using the canonical GitHub document; remove the outdated permanent copy before the review.

**REMOVE / DESELECT:** Any old temporary Reference Library Wave 1/full-irregular review packet and any other finished temporary packets from the active source selection. Preserve archived records in GitHub.

**ADD:** Only this `SLE_REFERENCE_V2_STANDARD_COMPATIBILITY_R1_20261120.md` as the active temporary source.

**Short NotebookLM chat message (paste as-is):**
> Check this compatibility packet against the currently selected SLE-MASTER-001 v1.2.1. Answer all six questions and return the required verdict. If the current standard is not visible, do not approve.

## 6. Implementation status at packet creation

- Academic source packets reviewed as described above; the two earlier verdicts are owner-supplied evidence, not generated by this packet.
- Engineering Draft PR #187: exact-head GitHub CI `167/167 PASS` on commit `270c4a420e71a5011b404857fb96dff12473acea`, with 44 approved MP3s and curriculum v1.28.0 maintained; this is an engineering receipt only.
- Browser: real Chromium search and **two responsive test modes**: (a) fixed 320px content area under Chromium's 500px headless minimum viewport, and (b) **CDP-emulated true CSS viewports 320px and 768px with touch emulation**, which independently PASS. Neither is a verified physical Safari/iPad session.
- **No self-merge, no Firebase Hosting deploy, no learner-data changes**. Separate owner permission required for LIVE release and any Preview deployment.

**END — this packet is temporary evidence for one source-compatibility check, not a second SLE master standard.**
