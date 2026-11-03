# GitHub-first Free Platform Architecture — 2026-10-04

Status: **ACTIVE DIRECTION / MIGRATION FOUNDATION**

This document supersedes the earlier assumption that ChatGPT Sites is the long-term runtime center. The existing private Site remains the production reference until parity is proven, but new architecture work should optimize for a free, GitHub-first application that remains useful without accounts, server storage or AI.

## 1. Non-negotiable product goal

The platform exists first to help the owner's daughter and family learn English.

The minimum successful product is therefore not "multi-user SaaS". It is:

- free to host and operate for normal family study;
- usable from an ordinary browser;
- academically useful even when every AI provider is unavailable;
- deterministic for exercises that have answer keys;
- able to retain learner progress locally;
- able to export/import a portable backup;
- able to add AI later without rewriting curriculum or learner-model logic.

Accounts, cloud sync and public-scale infrastructure are optional upgrades.

## 2. Architecture decision

### 2.1 Durable source of truth

GitHub becomes the durable source of truth for:

- application source;
- curriculum JSON;
- answer keys and rubrics;
- skill metadata;
- static audio and images;
- prompt registry;
- tests and release gates;
- architecture and academic governance.

The existing Site/D1 deployment is a migration source and production reference, not the target dependency.

### 2.2 Runtime layers

Target runtime:

```
GitHub repository
  -> static application build
  -> GitHub Pages

Browser
  -> curriculum/content
  -> deterministic scorer
  -> learning model
  -> local persistence
  -> progress / Skill Map / Error Bank / Recent Work
  -> JSON backup/restore

Optional AI proxy
  -> Gemini/OpenAI/other provider
  -> Writing feedback
  -> future Speaking feedback
  -> optional explanations/recommendations
```

Core learning must continue to work if the optional AI proxy is down.

## 3. What can be fully local

The following modules should require no AI and no server once migrated:

| Area | Static/local behavior |
| --- | --- |
| Grammar | answer-key scoring, explanations, evidence |
| Vocabulary | answer-key scoring, explanations, evidence |
| Reading | deterministic questions, explanations, evidence |
| Listening | static audio + deterministic questions + playback safeguards |
| Diagnostic objective sections | deterministic scoring and learner-model update |
| My Courses | local course selection/progress |
| Skill Map | derived from local evidence |
| Error Bank | derived from local evidence |
| Recent Work | local attempts |
| Suggested Practice | deterministic/adaptive rules from evidence |
| Writing drafts | local autosave even without AI |
| Curriculum/catalog | versioned JSON/static assets |

Writing extended responses and future Speaking assessment may use AI, but submission text must be saved before any provider request.

## 4. Existing architecture we should keep

The current source already contains the correct portability seams:

- `domain/repository.ts` defines `LearningRepository`.
- `domain/academic.ts` defines `AcademicRepository`.
- `application/learning-service.ts` contains repository-independent state/evidence logic.
- `application/academic-service.ts` contains deterministic academic scoring.
- `AITutorProvider` isolates AI vendors.
- D1, Sites auth and OpenAI HTTP live in infrastructure adapters.

Therefore migration should replace adapters/composition roots, not fork academic logic.

## 5. Browser persistence decision

### Phase G1 — local storage adapter

Add a tested browser adapter for the existing repository contracts.

Purpose:

- prove that progress/evidence/attempts can persist without D1;
- allow development of client-side service wiring;
- preserve account isolation by local namespace;
- support deterministic modules quickly.

Limitations:

- localStorage is per browser/profile/device;
- storage quota is limited;
- it is not suitable for large recordings;
- clearing site data removes local records unless the learner has a backup.

No learner should be told that local storage is a cloud backup.

### Phase G2 — IndexedDB primary store

Before broad Speaking/audio support, move large browser persistence to IndexedDB.

IndexedDB should become the preferred store for:

- attempt history;
- Writing versions;
- larger evidence ledgers;
- recordings/blobs where needed.

The repository contracts should stay unchanged so the application layer does not care which browser backend is active.

### Phase G3 — optional sync

Only after local mode is complete should optional account/cloud sync be evaluated.

Cloud sync is not a prerequisite for the family-learning MVP.

## 6. Backup/restore contract

GitHub-only mode must provide learner-controlled backup.

Target file:

`g-learning-english-backup-v1.json`

Required properties:

- format identifier;
- schema version;
- exported timestamp;
- application/curriculum versions;
- learner state;
- evidence;
- diagnostic sessions;
- academic attempts;
- Writing submissions/evaluations;
- course selection/progress;
- review records where present.

Restore rules:

1. validate format/schema/size;
2. preview record counts before mutation;
3. do not trust identity from the file;
4. never silently replace newer data;
5. preserve immutable IDs and content versions;
6. report conflicts explicitly;
7. keep an automatic pre-restore backup.

The existing portable-export work should be reused instead of inventing a second learner model.

## 7. Static-hosting boundary

The current app uses server route handlers and Cloudflare/Sites runtime code. A static GitHub Pages build cannot execute those routes.

Next.js supports static export with `output: "export"`, but server-only features and runtime API routes must be removed from the static path.

Migration rule:

- do not turn on static export first and then fix dozens of breakages;
- first move deterministic flows behind client-callable services;
- then create a dedicated static-mode composition root;
- then enable a GitHub Pages build.

The Sites build can remain available in parallel until the static parity gate passes.

## 8. AI: what is and is not possible on pure GitHub Pages

### 8.1 Do not put Gemini keys in client code

Google's current Gemini API documentation explicitly says production web/mobile apps must not expose API keys client-side and recommends a backend proxy.

Therefore this design is rejected:

```
GitHub Pages browser -> Gemini API using a secret embedded in JavaScript
```

A key in a static bundle is extractable.

### 8.2 Free AI is still feasible

As of 2026-10-04:

- Gemini Developer API documentation still lists free-tier access for eligible models/usage.
- Cloudflare Workers has a $0 Free plan with a current documented request allowance sufficient for small family usage.

Therefore the preferred optional topology is:

```
Self-Learning English ---\
                          -> one small G Learning AI Proxy -> Gemini
Self-Learning Math ------/
```

The proxy should:

- keep the Gemini credential server-side;
- accept an explicit app/purpose identifier;
- allow only known operations;
- cap input/output sizes;
- validate structured responses;
- enforce rate limits;
- reject arbitrary model/prompt forwarding;
- send minimum learner data;
- return a clean "AI unavailable" state when quota/provider access fails.

One proxy can serve both English and Math. There is no need for two Gemini projects merely because there are two websites.

Free-tier availability and quotas are external policy and must be rechecked before each major release. The core app may never depend on them.

### 8.3 Manual fallback

The existing Assisted AI Review workflow remains valuable as a zero-infrastructure fallback.

If the proxy is unavailable:

- deterministic modules remain fully functional;
- Writing stays saved;
- adult/manual assisted review remains possible;
- no fake AI score is generated.

## 9. Writing unification remains required

The 2026-10-03 Writing audit identified two assessment paths:

- curriculum WRI extended response -> adult/manual rubric;
- older 12-week Writing Coach -> automatic AI when a provider exists.

GitHub-first migration does not remove this problem.

Target:

1. one provider-independent Writing evaluation service;
2. save original text locally before AI;
3. AI feedback is versioned/provisional;
4. lesson rubric maps to canonical Writing dimensions;
5. manual review remains fallback;
6. historical reviews are never rewritten.

Do not mass-expand Writing until this unified service exists.

## 10. Parallel P2B branch reconciliation

The P2B Suggested Practice branch and Curriculum 1.6.x release line currently diverge from a common version-aware baseline.

Do not solve this by copying UI files blindly.

Integration order:

1. establish browser/static storage boundary;
2. preserve Curriculum 1.6.1 and importer-capacity work;
3. rebase/reconcile P2B adaptive engine and UI;
4. run version-aware attempt tests;
5. run curriculum regression tests;
6. only then make the GitHub-first integration branch the new development baseline.

## 11. Migration phases

### G0 — architecture foundation — NOW

- GitHub-first direction documented.
- root README corrected.
- browser repository adapters added.
- standalone browser-storage QA added.
- no production deploy.
- no D1 migration/reset.

### G1 — deterministic client runtime

Move these flows away from server-only route dependence:

- state load/save;
- academic catalog/lesson/start/draft/submit;
- course selection;
- progress/evidence projections.

Acceptance:

- Grammar/Vocabulary/Reading run after static load with network disabled;
- refresh restores local progress;
- old/current curriculum version handling remains correct.

### G2 — backup + Pages build

- learner backup/export;
- safe previewed restore;
- `output: "export"` static mode;
- GitHub Actions Pages build/deploy;
- mobile QA.

Acceptance:

- clean browser -> import backup -> progress restored;
- no server route is required for deterministic learning;
- no secret appears in generated assets.

### G3 — optional AI proxy

- shared G Learning proxy;
- Gemini adapter behind existing provider contract;
- Writing integration;
- quotas/failure fallback;
- no client secret.

Acceptance:

- AI success and AI outage both leave learner work safe;
- English and Math can use the same proxy without cross-app prompt/data confusion.

### G4 — optional sync/account

Only if it materially improves family use.

Local-first mode remains supported.

## 12. Release gates

A GitHub-first release must prove:

- academic regression tests pass;
- version-aware attempts pass;
- curriculum validation passes;
- browser repository isolation/idempotency passes;
- static build passes;
- no provider secret in repository or bundle;
- offline deterministic lesson works;
- refresh restores progress;
- backup/restore works;
- mobile layout remains usable;
- old Site/D1 data is not mutated by static-mode QA.

## 13. Explicitly out of scope for G0

G0 does **not**:

- deploy GitHub Pages;
- merge or close the existing curriculum/P2B PR chain;
- delete Sites;
- reset/migrate D1;
- migrate production learner data;
- enable Gemini;
- promise cross-device sync.

Those are later gates.

## 14. Current external references

Verify again before release because pricing/security rules can change:

- Next.js static exports: https://nextjs.org/docs/app/guides/static-exports
- Gemini API key security: https://ai.google.dev/gemini-api/docs/api-key
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
