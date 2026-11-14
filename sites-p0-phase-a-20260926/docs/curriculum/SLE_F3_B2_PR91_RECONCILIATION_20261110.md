# F3 B2 Bulk12 v1.26.0 — reconciliation against earlier Draft PR #91

**Date:** 2026-11-10  
**Status:** MACHINE DRAFT / ACADEMIC PASS / PRODUCTION NOT AUTHORISED  
**Canonical academic source:** `content/review-packets/SLE_B2_BULK12_U01_U03_NOTEBOOKLM_R1_20261110.md`  
**Source SHA-256:** `dbf432cd788b865a55ca8c0e6c03321374968743c1b0af12ebfc2a647a6a07b9`  
**Authoritative baseline:** curriculum v1.25.0 (154 lessons / 1,125 activities), `main` commit `2ea55b5986bb042631ef39187781dba8cff105db`.

## Exact lesson ID conflict

Draft PR **#91** includes proposed `GRA-B2-01` (10 objective items, **NotebookLM academic review still pending**); it was authored against older v1.18.1/v1.20.0 assumptions and SLE-MASTER-001 v1.1.0. **No content from PR #91 has been merged into production**. The newer independently reviewed F3 authored packet proposes a DIFFERENT original `GRA-B2-01` (7 objective items with independent examples and individual reviewer-verified keys **B,C,A,D,B,C,D**) and that ID is absent from LIVE v1.25.0. NotebookLM B2 Bulk12 independent verdict: **PASS, 62/62 AUTHORED_CONTENT_ITEM_LEVEL, zero required fixes**, conflict decision `SUPERSEDE_AFTER_RECONCILIATION`.

**Resolution:** F3 B2 Bulk12 `GRA-B2-01` from the verified 2026-11-10 packet is the sole proposed lesson for that ID in machine candidate v1.26.0. Do not cherry-pick, import or merge PR #91's conflicting 10-item draft. Preserve PR #91 Git history as provenance only, mark it superseded rather than treating the older pilot as approved or rewriting it in place. The two existing B2 lessons `VOC-B2-01` and `REA-B2-01`, and all other 152 historic lessons, remain byte/JSON-object identical.

## Rubric and importer reconciliation

NotebookLM accepted **Appendix A** for `RUBRIC-WRITING-B2`. The schema requires a six-criterion `criteria` array and `scale: {min:0,max:4}`. The candidate appends the approved qualitative dimensions. The structural scale **does not authorise automatic numeric scores**; `WRI-B2-01/02/03` use `answer:null`, `evidence_weight:0`, and `review_mode:assisted_ai_or_human`; score and B2 mastery remain pending actual trusted qualitative review. Anchor-calibrated numeric bands are a future separate academic/technical decision.

NotebookLM's historical "150 lesson cap" note is obsolete: main `domain/academic.ts` has **MAX_CURRICULUM_LESSONS = 250**, validated in v1.25.0. Candidate v1.26.0 (166 lessons) is within that upper bound, subject to real importer/schema QA and browser quota checks.

## Release boundary

Source and machine draft are staged on an **isolated Draft branch only**; 44 existing audio files, all old lesson IDs/answer keys/attempts and live Firebase English v1.25.0 are unchanged. A passing academic verdict **does not** authorise activation in runtime, merge/deploy, compaction, migration or learner record changes. Full candidate QA and storage/Save/Resume rehearsal, owner-controlled English-only release approval, protected-main QA and LIVE checks are separate gates.
