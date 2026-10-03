# Grammar Wave 1B — A1/A2 Completion Build Plan

Status: authoring/review plan only. No curriculum import or production deployment.

## Goal

Use one substantial content wave to complete the current A1 and A2 Grammar roadmap before beginning the B1 expansion.

Already academically approved in Wave 1A:
- GRA-A2-07 — Present continuous: form and use
- GRA-A2-09 — Present perfect: experiences with ever and never

Wave 1B adds 12 lessons / 120 activities, split into three independent review packets of 4 lessons / 40 activities each.

If Wave 1A + Wave 1B are all approved and later assembled with production Curriculum 1.5.0:
- total curriculum would be 59 lessons;
- total activities would be approximately 499;
- Grammar would reach 29 lessons:
  - A1: 12 / 12 roadmap lessons
  - A2: 16 / 16 roadmap lessons
  - B1: 1 / 12 roadmap lessons

This is a meaningful content milestone: A1 and A2 Grammar become a coherent program rather than scattered samples.

## Packet A — A1 Completion

1. GRA-A1-09 — This, that, these and those
2. GRA-A1-10 — Object pronouns and possessive pronouns
3. GRA-A1-11 — Imperatives and everyday instructions
4. GRA-A1-12 — Prepositions of time: at, on and in

40 activities total.

## Packet B — A2 Core Expansion

1. GRA-A2-08 — Past continuous and interrupted actions
2. GRA-A2-10 — Present perfect: just, already and yet
3. GRA-A2-11 — Choosing future forms: will, going to and present continuous
4. GRA-A2-12 — Advice with should and shouldn't

40 activities total.

## Packet C — A2 Completion

1. GRA-A2-13 — Possibility with may, might and could
2. GRA-A2-14 — Zero and first conditionals
3. GRA-A2-15 — Common verb patterns: to-infinitive and -ing
4. GRA-A2-16 — Defining relative clauses: who, which and that

40 activities total.

## Review strategy

Do not send all 120 activities to NotebookLM in one audit.

Review independently:
- Packet A -> reconcile -> PASS
- Packet B -> reconcile -> PASS
- Packet C -> reconcile -> PASS

Each packet review must inspect all 40 activities individually and all four lesson explanations/examples.

Only after all three packets pass:
1. extend runtime tag/adaptive mappings for the approved new source tags;
2. assemble one cumulative release that includes Wave 1A + Wave 1B;
3. run structural/content/regression gates;
4. run one authenticated Preview;
5. request owner approval for one import.

## Planned release implication

The current two-lesson Curriculum 1.6.0 candidate remains a validated pilot checkpoint but should not be imported merely because it passed Preview.

After Wave 1B approval, build a new larger cumulative candidate from the still-live Curriculum 1.5.0 baseline.

Because 45 production lessons + 14 approved new lessons = 59, the full A1/A2 Grammar milestone still fits the current 60-lesson application guardrail. Before adding the B1 Grammar wave, increase and stress-test the importer capacity.

## Source-tag strategy

Wave 1B introduces planned fine-grained Grammar source tags. They are authoring/review metadata until runtime tagMap and adaptive-map integration is completed.

Packet A:
- grammar.demonstratives
- grammar.object_pronouns
- grammar.possessive_pronouns
- grammar.imperatives
- grammar.instructions
- grammar.prepositions_time

Packet B:
- grammar.past_continuous
- grammar.past_simple
- grammar.present_perfect
- grammar.will_future
- grammar.future_plans
- grammar.present_continuous
- grammar.should_advice

Packet C:
- grammar.modal_possibility
- grammar.conditionals
- grammar.verb_patterns
- grammar.relative_clauses

Do not weaken concept granularity merely to reuse broad legacy reporting tags. Runtime compatibility should be updated after academic approval.
