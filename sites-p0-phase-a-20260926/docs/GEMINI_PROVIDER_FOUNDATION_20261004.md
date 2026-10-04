# Gemini Provider Foundation — 2026-10-04

Status: **CODE FOUNDATION ONLY — NO LIVE KEY / NO AI DEPLOYMENT**

## Goal

Add Gemini as a provider behind the existing provider-independent `AITutorProvider` boundary without changing curriculum, learner evidence, Writing validation, deterministic scoring, browser-local storage or the no-AI fallback.

This is a technical prerequisite for the owner's approved direction: one Gemini-capable AI layer can later serve Self-Learning English and Self-Learning Math while the learning applications remain usable without AI.

## What changed

- Added `infrastructure/ai/gemini-http.ts`.
- Added reusable `infrastructure/ai/provider-factory.ts`.
- Hosting composition still lives only in `infrastructure/ai/runtime.ts`.
- Existing OpenAI adapter remains available and backward compatible.
- New optional server values:
  - `AI_PROVIDER=gemini|openai`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL`
- Existing `OPENAI_API_KEY` / `AI_MODEL` remain supported.
- No provider SDK was added; the Gemini adapter uses HTTPS and the same neutral request/result contract.
- No learner schema, prompt registry, evidence rule or UI component was changed.

Default Gemini model in the example configuration is `gemini-3.8-flash`, but model selection is runtime configuration rather than domain/content policy.

## Security boundary

The Gemini API key is a server secret. It must never be:
- committed to GitHub;
- prefixed with `NEXT_PUBLIC_`;
- embedded in GitHub Pages JavaScript;
- stored in learner browser data.

The current GitHub-first architecture still requires automatic AI to sit behind a trusted server-side proxy. The provider factory in this milestone is reusable by that future shared proxy.

Firebase AI Logic is not required for this code foundation. It remains a possible alternative for direct browser-to-Gemini access, but that path requires Firebase project/app setup plus App Check and would create a different client-side integration boundary.

## Free-tier note

Official Google documentation checked on 2026-10-04 lists a free tier for current Gemini Flash-family models, including Gemini 3.8 Flash. Free-tier availability and quotas can change, so model/quota assumptions are configuration and operations concerns rather than hard-coded academic behavior.

Google's current pricing documentation also states that free-tier content may be used to improve Google's products. Therefore:
- do not send names, email addresses, account IDs or secrets in prompts;
- keep learner identity outside provider input;
- retain guided/non-AI fallback;
- review privacy suitability before enabling a live family deployment.

## Provider selection

1. If `AI_PROVIDER=gemini`, use Gemini.
2. If `AI_PROVIDER=openai`, use OpenAI.
3. If no explicit provider is set and only a Gemini key exists, use Gemini.
4. Otherwise preserve the historical OpenAI path.
5. With no usable key, AI remains unavailable and existing guided fallback continues.

## Validation

Automated tests use fake HTTP only. No live Gemini request and no credential is used in CI.

Required gate:
- Gemini request serialization;
- system instruction and JSON response mode;
- result normalization to `ProviderResult`;
- unavailable/error/malformed response fallback;
- explicit provider selection;
- historical OpenAI fallback;
- portable Writing tutor regressions;
- GitHub-first local runtime regressions;
- TypeScript;
- production build.

## Not included

- no live Gemini API key;
- no Firebase project creation;
- no production AI enablement;
- no Speaking evaluator;
- no pronunciation scoring;
- no AI-generated CEFR certification;
- no change to Curriculum 1.11.0.
