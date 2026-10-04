# G3 — Shared Gemini via Firebase AI Logic

Status: **G3-A PROVIDER CONTRACT PASS / NO LIVE FIREBASE PROJECT YET**

Date: 2026-10-04  
Parent checkpoint: G2 / Curriculum 1.11.0

## Goal

Add optional AI feedback to Self-Learning English without making AI a dependency of the learning platform.

The deterministic platform must continue to work when:
- Firebase is not configured;
- Gemini free quota is exhausted;
- App Check rejects a request;
- the model is unavailable;
- the model returns invalid structured output.

The same Firebase AI Logic adapter design should be reusable by Self-Learning Math.

## Current official Firebase direction

For web apps, Firebase AI Logic supports the Gemini Developer API through the Firebase JavaScript SDK.

The current official web API uses:
- `firebase/app`;
- `firebase/ai`;
- `getAI()`;
- `GoogleAIBackend`;
- `getGenerativeModel()`.

For Gemini Developer API free tier:
- Firebase AI Logic itself is free-of-charge;
- a Firebase project may stay on Spark/no-cost without a payment method for free-tier-eligible Gemini models/features;
- quotas are applied at project level;
- Firebase AI Logic can also apply per-user quota controls.

Security changed in mid-2026:
- Firebase AI Logic no longer requires placing a standard Gemini API key in the web app for Gemini Developer API authorization;
- Google-managed service-account authorization is handled by Firebase;
- App Check should be enforced before a public web app uses AI.

For new web App Check integrations, prefer **reCAPTCHA Enterprise**:
- it is invisible/score-based for normal users;
- Firebase documents up to 10,000 assessments/month at no cost;
- Spark/no-cost projects can use the reduced score set needed for App Check;
- the default 0.5 risk threshold remains appropriate for most cases;
- local/CI development must use App Check's debug provider rather than adding localhost to the production key.

## Project layout decision

Recommended account layout:

One Google/Firebase account
- Firebase project A: Self-Learning English AI
- Firebase project B: Self-Learning Math AI

Reasons:
- one owner/account is simple to administer;
- quotas and failures are isolated per project;
- English and Math cannot accidentally consume one another's entire project quota;
- each public web app gets its own App Check registration;
- the adapter code and prompt/evaluation architecture remain shared.

This is preferable to putting both websites in one Firebase project even though that is technically possible.

## Provider-independent boundary

Existing core:
`AITutorProvider -> createTutorService() -> validation -> learner evidence`

G3 adds:
`FirebaseAILogicTransport -> FirebaseAILogicProvider -> existing AITutorProvider`

The transport contract contains only:
- model name;
- availability;
- system instruction;
- user JSON payload;
- temperature;
- JSON response expectation.

No Firebase object, SDK response type, project ID or credential is allowed into domain/application code.

## Why the SDK bridge is not added yet

The project does not yet have:
- a Firebase project ID;
- a registered Firebase web app;
- App Check configuration.

Adding live SDK wiring before those exist would create untestable configuration branches and invite accidental insecure fallbacks.

Therefore G3 is staged:

### G3-A — provider contract — PASS
- Firebase AI Logic provider adapter added;
- existing tutor service compatibility proven with a fake transport;
- unavailable-provider fallback proven;
- malformed structured output rejection proven;
- current OpenAI server provider unchanged;
- no Firebase SDK dependency or account change.

### G3-B — owner creates Firebase projects
For each of English and Math:
1. create one Firebase project under the same account;
2. keep Spark/no-cost;
3. enable Firebase AI Logic with Gemini Developer API;
4. register the web app;
5. configure/enforce App Check for the real public domain;
6. record only the public Firebase web config needed by the SDK.

No Gemini API key is copied into GitHub.

### G3-C — web SDK bridge
- install the official `firebase` package;
- implement the transport using `firebase/app` + `firebase/ai`;
- select a currently free-tier-eligible Gemini Flash model;
- use structured JSON output;
- fail closed to deterministic/guided feedback;
- add client cooldown and request-size limits;
- add quota/429 UX;
- test with App Check.

### G3-D — English feature rollout
Order:
1. 12-week Writing Coach feedback;
2. curriculum Writing extended responses;
3. explain-this-answer / targeted hints;
4. Speaking feedback only after microphone/recording path is ready.

Do not use Gemini for Grammar/Vocabulary/Reading scoring that is already deterministic.

## Privacy / minimum-data rule

Normal AI requests should send only what the model needs:
- task;
- learner text/answer;
- rubric or teaching instructions;
- small non-identifying learning context such as CEFR estimate/error tags when useful.

Do not send:
- learner name;
- email/account ID;
- local backup;
- full historical profile;
- unrelated diagnostic data;
- device identifiers.

## Free-tier protection

AI is optional and quota-aware.

Required safeguards before live enablement:
- App Check enforcement;
- one in-flight request per learner interaction;
- no automatic retry storm on 429/5xx;
- bounded learner-text length;
- short structured output;
- per-user Firebase AI Logic quota set to a family-scale value;
- visible “AI unavailable — your work is saved” fallback;
- deterministic learning continues normally.

## Writing evidence rule

AI feedback is not trusted merely because the provider returned JSON.

Existing validation remains mandatory:
- schema validation;
- grounded corrections tied to learner text;
- task/rubric checks;
- versioned evaluation metadata;
- no evidence write if validation fails.

For curriculum extended responses:
- text is saved first;
- AI evaluation is attempted second;
- invalid/unavailable AI leaves the attempt pending review;
- no proficiency score is invented.

## Shared English / Math principle

Share:
- Firebase transport interface;
- provider adapter pattern;
- App Check setup convention;
- timeout/quota/error handling;
- request telemetry without learner identity.

Do not share:
- prompts;
- rubrics;
- subject-specific validation;
- learner evidence schemas unless intentionally standardized later.

## Publication dependency

Firebase configuration should not be activated until the final public site URL is known because App Check should protect the actual deployed origin.

Therefore G2 publication choice and G3 live Firebase activation remain separate steps.
