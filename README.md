# Self-Learning English

GitHub-first, free-to-run learning platform for the G Learning family project.

> **Direction changed on 2026-10-04.** GitHub is now the durable source of truth and the target home for a self-contained learning application. The existing private ChatGPT Site remains a valuable production reference and migration source, but it is no longer the architectural center of the project.

## Product goal

Build a platform that the family can actually learn with at zero required hosting cost:

- Grammar, Vocabulary, Reading and suitably designed Listening work without AI.
- Deterministic exercises are scored from versioned content and answer keys.
- Learner progress can be stored in the browser without an account or server.
- Export/import backup remains possible so browser-only data is not trapped on one device.
- AI is optional. Writing and future Speaking can use a provider when configured, but core study must remain usable when AI is unavailable.
- No API key, learner record, recording or personal response is committed to GitHub.

## Current repository shape

The most complete application source currently lives under:

`sites-p0-phase-a-20260926/`

The source already has useful portability boundaries:

- `domain/` — scoring, learning model and repository contracts.
- `application/` — use cases independent of D1/OpenAI.
- `content/` — versioned curriculum and academic assets.
- `infrastructure/` — replaceable storage/auth/AI adapters.
- `app/` — current UI and HTTP controllers.
- `tests/` — portable academic/application regression gates.

The current Sites runtime uses D1 plus trusted Sites identity. The GitHub-first path replaces those hosting adapters rather than rewriting the academic core.

## GitHub-first migration

The canonical architecture decision is documented in:

`sites-p0-phase-a-20260926/docs/GITHUB_FIRST_FREE_PLATFORM_20261004.md`

Initial migration order:

1. Preserve the current curriculum, IDs, attempts and learner-model contracts.
2. Add browser persistence adapters and test them independently.
3. Route deterministic learning flows to browser services instead of server API routes.
4. Produce a static build suitable for GitHub Pages.
5. Add JSON backup/restore for browser data.
6. Add AI only through a server-side proxy; never expose provider secrets in GitHub Pages.
7. Reconcile the parallel P2B adaptive-learning branch after the storage/static-host boundary is stable.

## AI boundary

The project keeps the existing provider-independent `AITutorProvider` contract.

A public static site must **not** embed a Gemini/OpenAI API key in client JavaScript. If automatic AI is enabled, both Self-Learning English and Self-Learning Math should use one small shared server-side proxy with per-app routing, validation and quota controls. Manual assisted review remains a no-secret fallback.

## Source-of-truth policy

- GitHub: application source, curriculum, schemas, tests, prompts, release docs and migration decisions.
- Browser storage: learner-local attempts/progress when using the free static mode.
- Optional backend: only for features that truly require a secret, shared sync or server trust.
- Existing Sites/D1: migration reference until the GitHub-first app passes parity gates.
- Never rewrite immutable content versions or historical learner evidence in place.

## Security

Repository is private. Do not commit:

- `.env` files or API keys;
- database dumps with learner data;
- learner writing, recordings or personal profile data;
- production auth tokens.

Provider keys belong only in server-side secret storage.
