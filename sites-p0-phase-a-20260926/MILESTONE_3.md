# Milestone 3 — Writing Tutor integration readiness

25 September 2026. **Live AI activation and live quality validation are blocked.**
No runtime AI provider is connected; no new billing or subscription was enabled.
The Site remains owner-private. This report must not be read as a claim that
simulated test feedback is a real deployed AI evaluation.

## Stable baseline and capability audit

The stable rollback point is saved Site version 5, source commit
`93369564ba9fa4c25bde6cba078340283bb9adee`, successfully deployed with an archive.
`PORTABILITY.md` and `VALIDATION.md` were reviewed before implementation.
The administrator export was exercised locally through the actual API handler before
feature changes: authorized200 with JSON attachment and required sections,
non-administrator403, anonymous401. This is not a fresh production account download.

The installed Sites capability documentation describes hosting, trusted authentication
and D1/R2 storage, but exposes no supported native inference binding or visitor-callable
AI endpoint. The hosting instructions instead describe a separately configured
`OPENAI_API_KEY`. The current Site runtime settings contain only the administrator
allowlist. No provider key or inference binding is configured.

| Capability | Status |
| --- | --- |
| AI in ChatGPT Work used to author this Site | Available to the builder; not a deployed application service |
| Supported native Sites runtime AI for visitors | Not exposed in the available documented capabilities |
| Existing OpenAI HTTP adapter | Implemented behind the Tutor service; inactive without credentials |
| Gemini/other hosted/local model | Possible through another adapter; not connected or tested live |
| ChatGPT subscription as app API access | Not used or assumed to authorize runtime inference |

An external provider would need separately authorized credentials, network access and
its own usage terms/billing arrangement. No paid dependency was activated and no API
subscription is requested here. Native runtime integration can be reconsidered if an
explicitly supported capability becomes available. Builder tools must never be used
as an undocumented runtime relay for deployed visitors.

## Implemented without a live provider

- Existing Writing submissions use the provider-independent Tutor service. A new
  `teachWriting` contract covers six existing criteria plus explicit relevance.
- Versioned prompt `writing-teaching@1.0.0`: text-grounded feedback, at most three
  priorities/corrections, hints, independent revision, comparison with previous text
  and a targeted follow-up exercise. No essay rewrite. Correct writing need not have
  artificial errors. Length does not determine CEFR.
- Before a model request, the server retrieves the account-scoped learner profile,
  Writing subskills, prior error tags, recent evidence, goals and recent revisions.
  It sends no account ID, email or learner name. Learner-authored text can still
  contain personal information, so provider activation needs an explicit privacy review.
- Durable original submission is written before model invocation. Evaluations are
  separate records with `pending`, `validated`, `unavailable` or `failed` status.
- Structured output validation checks rubric bounds, required fields and exact quoted
  error spans. It discards malformed responses. Schema validation is not independent
  proof that an AI judgment is pedagogically correct.
- Hints appear before an optional correction reveal. Learners can save a sentence /
  exercise revision or a complete revised draft. Full drafts can contribute reviewed
  evidence; sentence revisions never establish a Writing CEFR estimate.
- Saved Writing/revision history is loaded from the server and appears within the
  existing Feedback step. Old draft and feedback fields remain untouched.
- Exact repeated submissions reuse their saved evaluation. A database claim prevents
  concurrent identical requests from invoking a provider twice. Explicit retries of
  unavailable/failed evaluations retain prior attempt history; pending attempts may
  be retried after 60 seconds. A crashed/slow attempt can still cause a later retry;
  provider-level idempotency and usage quotas are future hardening.
- Validated results add only Writing evidence; deterministic Grammar/Vocabulary/
  Reading response scores are not overwritten. A Writing-only partial profile is
  possible before diagnostic completion, while overall CEFR remains unassessed.
- Original, revision, rubric, error tags, normalized provider/model/prompt version,
  timestamp and evaluation status are included in administrator JSON export.

## Data compatibility

Migration `0003_dusty_jubilee.sql` only adds two tables and their indexes:
`writing_submissions` and `writing_evaluations`, both keyed by owner, learner and ID.
Original text is immutable; parent/root IDs link revisions. Evaluation attempts carry
submission IDs and normalized results. Existing tables/migrations are not changed.
No learner record is reset or overwritten as part of migration. The legacy Writing
workspace remains compatible with the same `/api/evaluate` entry point.

An unavailable evaluation stores the submission and status but generates **no AI
score or invented error evidence**. It displays:
**Provisional – AI language evaluation unavailable**.
Retry controls are disabled when no provider is configured. Learning plans and
objective diagnostic scoring remain deterministic. Listening, Speaking and
Pronunciation capabilities are unchanged.

## Validation performed

`node tests/run.cjs` passes existing adaptive/portability tests plus 12 Writing cases:

| Case | Controlled provider contract test | Live AI quality test |
| --- | --- | --- |
| Correct writing | Validated fixture, no fabricated correction required | Blocked |
| Off-topic writing | Distinct relevance/task results preserved | Blocked |
| Weak idea development | Idea-development feedback/tag retained | Blocked |
| Grammar errors | Exact quote and hint preserved | Blocked |
| Vocabulary errors | Collocation feedback/tag retained | Blocked |
| Mixed errors | Multiple priorities retained within limit | Blocked |
| Revised full draft | Parent context and comparison retained | Blocked |
| Sentence revision | Provisional, excluded from CEFR evidence | Blocked |
| Empty submission | Rejected before provider invocation | Not applicable |
| Provider unavailable | Text/status retained, no AI evidence | Verified unavailable path |
| Provider failure | Failed status retained, no AI evidence | Simulated failure only |
| Repeated submission | Cached response reused; no second call | Provider billing not tested |

The contract fixtures deliberately return known responses. They prove validation,
context passing, persistence contracts and UI behavior; they do **not** prove that a
live model gives different relevant feedback. That requirement remains open.

Local D1 integration through real API handlers verified ten different submissions:
all saved with unavailable status. One sentence revision brought the total to11.
Fresh history requests restored all11 submissions/evaluation statuses. Other accounts
saw no records and could not reference a different account's parent submission.
The earlier legacy draft/revision/demo history stayed byte-for-byte unchanged.
Repeated submission reused a record; empty input rejected400; old Writing API200;
no invented proficiency evidence. Administrator export200 included all11 records,
and unauthorized requests remained401/403.

Browser fixture check: exact quoted span, explanation and hint visible initially;
corrected text hidden until “Show a possible correction” was clicked. Seven rubric
fields, limited-sample warning and targeted exercise were visible. The fixture was
prominently labeled NOT LIVE AI and was removed before deployment.

## Remaining activation gate

To complete the real-AI part of Milestone3, an explicitly authorized runtime provider
must be connected through the adapter. Then rerun at least ten real submissions,
review feedback relevance/accuracy and revision quality, verify real feedback reload
and account isolation, and measure failure behavior, latency and usage. No further
courses are needed before this gate passes. No credential should be pasted into
browser code or a learner-facing setting.

Other limits: draft autosave still uses last-save-wins for concurrent edits; exports
are not a transactional database snapshot; model output can be wrong even when its
schema is valid; there are no configured provider usage quotas; the single account
still maps to the primary learner. Private access is not a substitute for these
future production controls.
