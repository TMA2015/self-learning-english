# Gemini Relay Protocol v1.0 — G Learning
Date 2026-09-28. Independent academic review with no assumed cross-chat memory.

## Source and message rules
Keep a frozen owner/Work archive with actual 1.4 baseline, 1.5 candidate, manifest and raw independent reviews. DO NOT send the whole archive to Gemini: long extracted JSON has been truncated in earlier rounds. Each Gemini message gets ONE self-contained task packet with the relevant project miniature context, source version and canonical SHA, exact target IDs, original comparison, full Reading passage or Writing rubric when needed, target new items, explicit task and result schema. If even one packet gets truncated, split by item without truncating its necessary source.

## Task fields
packet_id; context_version; source_manifest {version, canonical_sha256, status}; scope {expected_item_ids, expected_count}; lesson_context; target_activities; relevant_existing_activities; source_text/rubric if applicable; review_instructions; expected_output. The supplied key is a hypothesis, not ground truth.

## Result fields
For EACH exact target ID: id, verdict PASS|REVISION_REQUIRED|REVIEW_INCOMPLETE|INSUFFICIENT_EVIDENCE, independent_answer (null for open Writing), source-specific rationale, exact_correction (null if PASS). Plus packet ID, reviewed IDs, missing IDs and limitations. Source anchors should quote exact local passage/option/rubric criteria, not made-up external citation tokens.

## Workflow
ChatGPT builds packet against exact latest source/digest → Gemini independently answers and reviews → ChatGPT checks completeness and changes ONLY targeted new items → changed items receive new SHA and independent retest → structural+semantic/option-key checks → owner-approved Preview → separate owner Import/deploy gates. Gemini neither edits GitHub/Site nor authorizes release. Archive prior review rounds and mark old packet SHA SUPERSEDED. If no data, state INSUFFICIENT_EVIDENCE; never invent mastery or academic PASS.

## Prompt for ONE packet
Independently review ONLY the attached JSON. Re-solve every ID in expected_item_ids without trusting the supplied answers. Check target age/level, context, key, plausible distractors, valid short-answer alternatives, full Reading passage or Writing rubric. Return structured item-by-item JSON with source evidence and exact corrections. If attachment is truncated, return REVIEW_INCOMPLETE and name missing IDs/data. Academic review only: no import, deploy or learner record changes.

## Review modes
- Item semantic QA: one question/compact coherent set, includes full actual source.
- Content/coverage planning: brief actual lesson metadata; MAY suggest gaps/prerequisites, but cannot certify every question from metadata alone.
- Technical checks, importer compatibility, account data and browser QA remain ChatGPT/Work/owner responsibilities, not inferred from Gemini PASS.