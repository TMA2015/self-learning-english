# Writing Assessment and AI — Current State and Target Direction (2026-10-03)

## Why this document exists

The project was moved to ChatGPT Sites partly to support an interactive learner experience with persistent data and AI-assisted feedback. The current implementation has strong persistence/versioning, but Writing assessment is split across two different paths and the curriculum Writing path is not yet automatically AI-scored. This should be corrected before large Writing expansion.

## Current path A — curriculum Writing lessons (WRI-* in the shared course)

Objective activities:
- single-choice / short-answer items are scored deterministically by the server;
- they contribute question-level evidence.

Extended-response activities:
- have `answer: null`, `evidence_weight: 0` and a rubric;
- submission becomes `pending_review`;
- no automatic AI call is made from `academicService.submit()`;
- Parent View requires an authorized adult to enter feedback and every rubric criterion score manually;
- curriculum rubrics currently use **0–4** scales;
- only after adult approval does the reviewed Writing evidence enter the learner model.

Therefore the shared curriculum Writing lessons are currently **human-review-first**, despite carrying `review_mode: assisted_ai_or_human` metadata.

## Current path B — separate 12-week Writing Coach

The older Writing Coach uses `writingTutor()`.

When a live AI provider is available:
- the submitted original text is saved first;
- the server calls the AI tutor;
- feedback is schema-validated;
- six criteria are scored **0–10**:
  - task-understanding
  - idea-development
  - organization
  - grammar-accuracy
  - vocabulary
  - sentence-quality
- the evaluator can return a provisional Pre-A1/A1/A2/B1/B2 estimate;
- validated evidence can update the learner model automatically;
- revisions remain separate and versioned.

When a live provider is unavailable:
- the submission is preserved;
- no proficiency score is added;
- the UI shows automatic AI as unavailable.

## Assisted AI Review fallback

Parent View has a separate manual workflow:
1. adult checks/anonymizes the learner text;
2. Site prepares an AI review packet;
3. adult copies it to an external AI assistant;
4. adult pastes returned JSON back into the Site;
5. Site validates the JSON;
6. adult approves it;
7. only then does it affect learner evidence.

This is safe and portable, but too manual for the intended everyday self-learning experience.

## Current provider implementation

The domain/application layer is mostly provider-independent through `AITutorProvider`.

The runtime currently instantiates only:
- `OpenAIHTTPProvider`

It requires:
- `OPENAI_API_KEY`
- optional `AI_MODEL`

Without a configured key, automatic Writing AI is unavailable.

A ChatGPT subscription does not automatically provide API usage to the deployed app; API billing/authentication is separate. The app therefore needs an explicit server-side model provider.

## Main design problem

There are currently **two Writing assessment systems**:

1. curriculum Writing: manual adult rubric, 0–4;
2. Writing Coach: automatic AI when available, six criteria 0–10.

This creates inconsistent learner experience and makes curriculum Writing much less capable than intended.

## Target direction

Before mass-expanding Writing content:

1. Create one provider-independent Writing evaluation service used by BOTH curriculum WRI lessons and the 12-week Writing Coach.
2. Keep the existing six evidence dimensions as the canonical internal Writing dimensions.
3. Allow a curriculum lesson rubric to map onto those dimensions without losing the lesson-specific task rubric.
4. After an extended response is submitted:
   - save learner text first;
   - call the configured AI provider;
   - validate grounded feedback against exact learner text;
   - show formative feedback immediately;
   - store AI evidence as provisional/versioned evidence;
   - keep an adult-review fallback if the provider is unavailable or evaluation fails.
5. Preserve historical 0–4 adult reviews as historical evidence; do not rewrite old scores.
6. Add a second provider adapter (for example Gemini) without changing domain/content code.
7. Keep provider selection in runtime configuration, not content files.
8. Never place provider API keys in GitHub or client-side JavaScript.

## Provider choice

For family/testing use, the project can support both OpenAI and Gemini and choose by environment configuration.

If using a provider free tier, review that provider's current data-use terms before sending learner writing. Prefer sending only the minimum text/task/rubric context required for feedback and avoid unnecessary personal profile data.

## Success criterion

A learner should be able to:

Write -> Submit -> Receive grounded AI feedback/scores -> Revise -> Receive comparison feedback -> Have the learner model update,

without an adult copying JSON between tools during normal operation.

Manual assisted review remains a fallback, not the primary workflow.
