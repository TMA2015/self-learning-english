# G3-C Firebase Web SDK bridge checkpoint — 2026-10-04

Status: **IMPLEMENTATION CHECKPOINT — NO PRODUCTION DEPLOY**

## Confirmed Firebase Console state

Shared Firebase project:
- G-Learning
- project ID: roadmap-toan-ai
- Spark / no billing

Web Apps:
- Self-Learning-Math
- Self-Learning-English

English Hosting:
- dedicated site: g-learning-english
- Self-Learning-English is linked to this site

App Check:
- Fraud Defense / reCAPTCHA Enterprise
- Self-Learning-English: Registered
- Firebase AI Logic API: Basic — Enforced
- production key domains: g-learning-english.web.app and g-learning-english.firebaseapp.com
- localhost is not added to the production key
- local development uses the App Check debug-provider flow only

Firebase AI Logic:
- Gemini Developer API
- Web modular SDK: firebase/app + firebase/app-check + firebase/ai
- backend: GoogleAIBackend
- model: gemini-3.8-flash
- JSON structured output
- no Gemini Developer API key in repository or browser bundle

## Browser Writing flow

1. learner work is persisted locally before an optional AI request;
2. App Check protects Firebase AI Logic;
3. valid AI output is passed through the existing tutor validation layer;
4. validated full-writing feedback may add Writing evidence;
5. unavailable, quota-limited, rejected, malformed, or timed-out AI falls back to deterministic guided feedback;
6. Grammar, Vocabulary, Reading, Listening, Diagnostic and ordinary progress remain independent of AI.

CI does not make a live Gemini request.

## Free-first boundaries

- do not enable Blaze automatically;
- do not add Firestore just for AI;
- do not replace browser-local learning storage with Firebase storage;
- keep Cloudflare Workers + D1 as an optional later account/sync layer.
