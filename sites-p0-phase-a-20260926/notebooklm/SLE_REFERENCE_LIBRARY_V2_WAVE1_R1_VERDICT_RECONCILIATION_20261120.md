# SLE Reference Library v2 Wave 1 — NotebookLM owner-supplied verdict reconciliation

**Recorded:** 2026-11-20  
**Packet:** `SLE-REFERENCE-V2-W1-R1-20261120`  
**Source packet:** `SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.md` (GitHub academic branch)  
**Issue:** #186 — English Reference Library v2  
**Review evidence:** Owner pasted full item-level NotebookLM review transcript in this conversation on 2026-11-20. This file records the verdict and exact boundaries; it does not impersonate a new independent review.

## Verbatim high-level decision

- `ACADEMIC_VERDICT: PASS`
- `ACADEMIC_ADOPTION: GO`
- `ENTRY_AUDIT_COUNTS: Irregular Verbs 15/15 PASS; Writing Connectors 12/12 PASS; Frequency Expressions 11/11 PASS (38/38 PASS)`
- `MANDATORY_CORRECTIONS: NONE`
- `OPTIONAL_IMPROVEMENTS: NONE`
- `ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED`
- `PRODUCTION_RELEASE: NOT_AUTHORIZED`

Review recommended: 320px mobile horizontally scrollable tables with visible scroll cue and sticky table headings; offline client-only search with no external API search calls.

## Exact data scope

These **38** reviewed source entries are `REF2-IRR-001..015`, `REF2-LNK-001..012`, and `REF2-FRQ-001..011`, as authored in the source packet. All **26** previously reviewed pilot entries are unchanged.

Separately, the academic authoring branch now also contains an isolated **191-lemma irregular verb candidate corpus**: six original pilot verbs + **185** separately authored candidates. The Wave 1's 15 verbs are part of those 185 by lemma/ID, but the **candidate corpus's authored examples, usage notes and variants may differ**. Therefore the Wave 1 PASS does **NOT** magically certify any full-corpus entry where its literal text differs from the reviewed Wave 1 source, and does not certify the remaining **170** new corpus entries. The full corpus `SLE_REFERENCE_LIBRARY_V2_IRREGULAR_FULL_R1_20261120.md` needs its **own NotebookLM item-level review**. Until then, the 191-corpus candidate component is not connected to SLE live navigation or included in `app/reference-library.tsx`.

## Source-version and citation anomalies — preserve transparently

1. Reviewer introduction cites **`SLE-MASTER-001 v1.1.0`**, but the authoritative GitHub `main` document inspected after SLE v1.28.0 release is **`SLE-MASTER-001 v1.2.1`**. This is a **source-selection/provenance discrepancy** that must be reconciled against the actual permanent NotebookLM sources before claiming fully current-standard adoption or production approval. The academic item-level PASS is retained as owner-supplied evidence; not silently reclassified.
2. Reviewer text calls **"#186 a Draft PR"**, but GitHub #186 is actually the focused **Issue**, not a PR at review time.
3. Reviewer mentions `REVIEW_TARGET: SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.txt`; source packet in the repository is **.md** with identical packet ID. The review target is identified by `PACKET_ID`, not guessed solely from file extension.
4. An item-level PASS on the original Wave 1 source does not establish real browser QA, nor imply a current LIVE installation has 64 references.

## Implementation staging

A typed machine JSON mirror `content/reference-library-v2-wave1-reviewed.json` is derived directly from the 38 source-packet entries, preserving authoring text and specialist fields. Reference search and UI are being staged on a Draft PR; the unreviewed 191-candidate content remains excluded from the live-facing component. Neither reviewed Wave 1 nor full corpus may be deployed without QA, provenance reconciliation and separate explicit owner release authorization.

**NotebookLM Source operations for future full-corpus review:** KEEP current permanent English academic baselines, **replace** superseded `SLE-MASTER-001` with v1.2.1; REMOVE old temporary Wave 1 from active selection after archiving; ADD ONLY `SLE_REFERENCE_LIBRARY_V2_IRREGULAR_FULL_R1_20261120.md` as the next temporary review source. If reviewing more than one new source, bundle in one ZIP. Keep NotebookLM chat prompt short as per project workflow.
