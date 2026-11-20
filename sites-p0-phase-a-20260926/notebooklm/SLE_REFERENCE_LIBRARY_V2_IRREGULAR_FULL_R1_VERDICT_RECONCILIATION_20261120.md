# SLE Reference Library v2 — Full irregular verbs corpus R1, owner-supplied NotebookLM verdict

**Received:** 2026-11-20  
**PACKET_ID:** `SLE-REF-IRR-FULL-R1-20261120`  
**Review source:** `notebooklm/SLE_REFERENCE_LIBRARY_V2_IRREGULAR_FULL_R1_20261120.md`  
**Verdict provided by owner from independent NotebookLM audit; this reconciliation is not a fresh academic review.**

## Exact academic decision

- `ACADEMIC_VERDICT: PASS`
- `ITEM_COVERAGE: 185 / 185 reviewed; 185 PASS / 0 REQUIRES_CORRECTION`
- `MANDATORY_CORRECTIONS: NONE`
- `OPTIONAL_IMPROVEMENTS: NONE`
- `MISSING_HIGH_PRIORITY_VERBS: NONE`
- `ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED`
- `PRODUCTION_RELEASE: NOT_AUTHORIZED`

**Scope approved academically:** 185 original candidate records (including the 15 Wave 1 IDs, with full-corpus source wording) + six immutable pilot verbs = **191 unique base lemmas**. Source review judged principal parts, variants, meaning/context examples, usage cautions, core/extended editorial tiers, and separation of `lie/lay`, `hang/hung/hanged`, `get/got/gotten`, `read` pronunciation, `bear/bore/borne/born`, `strike`, `weave`, and `bid` within reviewed meanings. This scope is **read-only reference**, never a grade, quiz key, proficiency assessment or machine score.

## Engineering/source mirror cross-check

The authored GitHub Markdown packet contains exactly **185 candidate table rows**, all unique IDs. For each ID the machine JSON `content/reference-library-v2-irregular-candidate.json` matched the table **exactly** in: tier, base, past, participle, gloss and original example (185/185, zero mismatches). Source notes/variants remain as authored; their academic verdict is owner-reported. The 6 original pilot items retain their own earlier reviewed IDs and data.

All 15 original Wave 1 verbs in the other reviewed packet are already INCLUDED in the 185 candidate records, not additional lemmas. Corpus wording and Wave 1 wording may differ: render the newly approved **full-corpus** records for all 185, retain original Wave 1 for the separate 12 Writing connectors and 11 Frequency expressions. Do not double-count or combine literal examples as if the same item had been reviewed once only.

## Provenance discrepancy — DO NOT HIDE

The NotebookLM review introduction again states the reviewer used **SLE-MASTER-001 v1.1.0**. The authoritative GitHub `main` standard is **SLE-MASTER-001 v1.2.1**. Treat this as a **review-source freshness issue** needing a controlled check of the permanent NotebookLM source selection (replace superseded copies). Do not describe the academic verdict as audited against current v1.2.1, and do not claim full release readiness until reconciled. Reviewer also called #186 a Draft PR; GitHub #186 is the tracking Issue and **#187 is the engineering Draft PR**. The pasted review target extension was `.txt`; GitHub source is `.md` with matching packet ID.

## Implementation and release boundary

- The owner supplied a **content PASS**, not owner consent to merge, deploy, activate catalog, or alter learner data.
- Candidate source may be marked `NOTEBOOKLM_PASS_185_OF_185`, still `DRAFT_NOT_LIVE` until separate release authorization.
- Technical acceptance needs exact-head GitHub PR CI, unchanged original 26 pilot entries, fast variant search including `gotten` and `learnt`, useful 25-row A–Z pagination, 320px phone/iPad/desktop browser checks, and zero changes to curriculum v1.28.0, 44 MP3, Math, Auth, scoring or learner records.
- Keep Flashcards and Notes deferred; continue Reference Library v2 implementation first.

**Next academic follow-up:** Reconcile the permanent standard version in the NotebookLM source set. This documentation does not certify any browser/device or deployment result.
