# G3 — Firebase Hosting + Firebase AI Logic / Gemini

Status: **TECHNICAL FOUNDATION IN PROGRESS — NO FIREBASE PROJECT CONNECTED**

Date: 2026-10-04  
Baseline: Curriculum 1.11.0, G2 static/local checkpoint 10/10 PASS

## Decision

Keep GitHub as the private durable source of truth.

Use Firebase only for the optional runtime services that a static private GitHub repository cannot provide for free:

1. **Firebase Hosting** — static site runtime;
2. **Firebase AI Logic** — protected client access to Gemini;
3. **Firebase App Check** — abuse protection.

This avoids:
- making the source repository public;
- maintaining a custom AI proxy service;
- placing a Gemini Developer API key in browser JavaScript;
- requiring D1 or an account system for deterministic learning.

Core Grammar, Vocabulary, Reading, Listening, Diagnostic, progress, Skill Map, local backup and guided Writing remain usable when AI is unavailable.

## Why Firebase Hosting instead of a public deployment repository

GitHub Pages on GitHub Free requires a public repository.

The source repository is intentionally private. A separate public artifact repository is possible, but Firebase is already required for the preferred AI path and Firebase Hosting has a no-cost Spark allowance suitable for family use.

Therefore using Firebase Hosting avoids creating a second publication system merely for hosting.

## Project layout recommendation

Use the same Google/Firebase account but **two Firebase projects**:

- G Learning English
- G Learning Math

Reasons:
- Gemini Developer API quotas are project-level;
- App Check/domain configuration stays isolated;
- accidental prompt/config crossover is less likely;
- each site can be changed or disabled independently.

The applications still use the same G Learning AI adapter design and Gemini provider family. “Shared AI” means shared architecture/provider code, not shared learner data.

## Cost boundary

Preferred setup:
- Firebase Spark plan;
- Gemini Developer API free tier;
- Firebase AI Logic (no separate Firebase AI Logic charge);
- Firebase Hosting within no-cost quota;
- reCAPTCHA Enterprise / App Check within the no-cost assessment allowance.

If a no-cost quota is exhausted, AI must fail closed and learning must continue without AI. Do not silently switch the Firebase project to Blaze.

## Security boundary

### Allowed in browser configuration

Firebase Web configuration values are public-by-design when the Firebase API key is restricted to Firebase-related APIs:
- Firebase API key;
- auth domain;
- project ID;
- app ID;
- App Check site key;
- selected Gemini model name.

### Forbidden in browser/repository

Never commit or bundle:
- Gemini Developer API key;
- service-account JSON/private key;
- App Check debug token;
- OpenAI secret key;
- unrestricted Google Cloud API key.

Firebase App Check must be enforced for Firebase AI Logic.

The Firebase Web API key must NOT allow the Generative Language API. Firebase AI Logic uses its protected gateway; the direct Gemini Developer API credential remains server-side at Google/Firebase.

## Provider architecture

Existing domain boundary:
`AITutorProvider`

New infrastructure adapter:
`infrastructure/ai/firebase-ai-logic.ts`

The adapter:
- accepts the existing `TutorRequest`;
- preserves prompt registry ownership in the application;
- creates a Gemini model with the request system instruction;
- requests JSON output;
- caps instruction/input size;
- rejects unknown purposes;
- parses JSON strictly;
- fails closed to `null`;
- exposes no Firebase/Gemini vendor response shape to domain code.

The actual Firebase JS SDK is intentionally not installed yet. It will be wired only after the Firebase Web app/App Check configuration exists.

## Model policy

Do not hard-code a Gemini model in source.

Use:
`NEXT_PUBLIC_GEMINI_MODEL`

At each major release:
1. confirm the model is supported by Firebase AI Logic;
2. confirm it remains eligible for the intended free tier;
3. run structured-output regression tests;
4. update configuration only.

## Hosting build

Generic config:
`firebase.json`

Build profile:
- `STATIC_EXPORT=1`
- `NEXT_PUBLIC_LEARNING_RUNTIME=browser`
- empty `NEXT_PUBLIC_BASE_PATH`

Expected output:
`dist/client`

The GitHub Pages build remains as a portability gate, but Firebase production Hosting uses the root artifact.

## One-time Firebase Console work required later

For the English project:

1. Create/select a Firebase project on the Spark plan.
2. Register one Web app.
3. Enable Firebase Hosting.
4. Open Firebase AI Logic and choose the Gemini Developer API.
5. Keep the project without Cloud Billing while using the Gemini Developer API free tier.
6. Configure App Check for the Web app using reCAPTCHA Enterprise.
7. Enforce App Check for Firebase AI Logic.
8. Restrict the Firebase Web API key to Firebase-related APIs and the production web origin/referrer.
9. Copy the Firebase Web config and App Check site key.
10. Choose a currently supported free-tier Gemini model.

Repeat for Math when its AI integration is ready.

Do **not** provide or paste the Gemini Developer API key into this repository or chat workflow.

## Local development

When App Check is enforced, localhost/CI needs the App Check debug provider.

A debug token is sensitive local configuration:
- never commit it;
- never place it in a public build;
- register/revoke it in Firebase Console as needed.

## Next code step after Firebase config exists

1. install the official Firebase JS SDK with a locked version;
2. initialize Firebase + App Check;
3. create a `FirebaseAIModelFactory` using Firebase AI Logic;
4. inject it into `FirebaseAILogicProvider`;
5. connect the shared Writing evaluator;
6. test AI success / 429 quota / App Check rejection / network outage;
7. prove learner text is saved before every AI request;
8. preserve manual/adult review fallback.

## Official references

- https://firebase.google.com/docs/ai-logic
- https://firebase.google.com/docs/ai-logic/get-started?platform=web
- https://firebase.google.com/docs/ai-logic/app-check
- https://firebase.google.com/docs/ai-logic/pricing
- https://firebase.google.com/docs/projects/api-keys
- https://firebase.google.com/docs/hosting/usage-quotas-pricing
