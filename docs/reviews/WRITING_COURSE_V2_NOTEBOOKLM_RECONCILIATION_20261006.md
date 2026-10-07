# NotebookLM Review Reconciliation — Writing Course v2

Review verdict: **PASS-WITH-CHANGES**

The independent review approved the overall architecture and required five academic changes before implementation.

## Required changes accepted

1. **Reorder the 12-week progression**
   - merge Relevance + Brainstorming;
   - move sentence foundations before outlining/paragraph aggregation;
   - add Guided Multi-Paragraph Challenge in Week 11;
   - retain independent writing in Week 12.

2. **Simplify prompt-analysis terminology**
   - replace Scope/Limit with Boundary / Stay on Target;
   - use Topic / Task / Must Include / Boundary.

3. **Lock full model answers until final Review**
   - no full model during Guided Practice, Main Practice or Feedback/Revision;
   - active-work help capped at explanation, hint, sentence starter, short example piece.

4. **Bound deterministic fallback**
   - label Guided Check (Basic Structure);
   - explicit limitation disclaimer;
   - no semantic quality, grammar correctness or CEFR claims from rule-based checks.

5. **Separate evidence types**
   - objective Guided Practice: evidence weight 1;
   - free-form planning/writing: automated proficiency weight 0 and provisional until valid review.

## Optional improvements accepted for design

- weekly content may be split into two short sessions;
- Vietnamese Support micro-glosses for abstract planning terms;
- Off-Topic Spotter is recommended for Week 2.

## Product reconciliation note

The review text contains both “15–30 minutes” and a 25–35 minute weekly-module recommendation. The reconciled product copy will use:
- **25–35 minutes total per weekly module**, with
- **two short sessions supported**.

This avoids implying that the complete weekly module must fit inside a single 15-minute session.

## Implementation authorization

WCV2-A may proceed using:
`docs/WRITING_COURSE_V2_RECONCILED_20261006.md`

Do not implement from the unreconciled original packet.
