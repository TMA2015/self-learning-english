# Self-Learning English

**G Learning · Learn · Grow · Go**

Free-to-run, GitHub-first English learning platform designed for practical family self-study.

## Current direction

GitHub is the durable source of truth for application code, curriculum, answer keys, skill metadata, tests and release documentation.

The project is moving from the existing private ChatGPT Site runtime toward a self-contained browser application that can be hosted on GitHub Pages.

Core learning should remain usable without AI, without a paid backend and without a mandatory account.

## Learning areas

- Grammar
- Vocabulary
- Reading
- Listening
- Writing
- Speaking
- Pronunciation
- Diagnostic assessment
- Skill Map
- Error Bank
- Suggested Practice
- My Courses

Objective exercises are scored deterministically from versioned content and answer keys. Learner evidence can feed progress, subskills, repeated mistakes and practice recommendations.

Practice accuracy is not automatically treated as CEFR certification.

## GitHub-first architecture

Target runtime:

```
GitHub repository
  -> static application
  -> GitHub Pages

Browser
  -> versioned curriculum
  -> deterministic scoring
  -> learner evidence
  -> Skill Map / Error Bank / Progress
  -> local persistence
  -> backup / restore

Optional AI
  -> Writing feedback
  -> future Speaking feedback
  -> optional explanations / recommendations
```

AI is an enhancement layer, not a dependency for ordinary Grammar, Vocabulary, Reading or appropriately designed Listening practice.

## Current application source

The most complete application source currently lives under:

`sites-p0-phase-a-20260926/`

That source already separates:

- `domain/` — learning model and scoring contracts;
- `application/` — provider/storage-independent use cases;
- `content/` — versioned curriculum and academic assets;
- `infrastructure/` — storage/auth/AI adapters;
- `app/` — UI and controllers;
- `tests/` — academic and application regression gates.

The GitHub-first migration replaces hosting adapters rather than rewriting the academic core.

## Data and privacy

Browser-local mode is intended to support learner progress without a server account.

No learner writing, recordings, personal profiles, API keys, database dumps or production credentials belong in this repository.

Historical curriculum IDs, content versions and learner evidence are immutable.

## AI boundary

Do not embed Gemini/OpenAI secrets in a GitHub Pages bundle.

Future automatic AI should remain provider-independent and use a protected service path such as Firebase AI Logic or another server-side proxy. Self-Learning English and Self-Learning Math may share the same architectural AI layer while keeping project configuration isolated when useful.

## Academic review

NotebookLM is used as an independent academic-review tool for curriculum batches.

Permanent project/rule sources are kept separate from temporary per-batch review sources. New skill tags remain closed to runtime use until they are independently reviewed and explicitly approved.

## Status

The existing private Site remains a migration/reference runtime until GitHub-first parity gates pass. Do not reset or rewrite historical learner data during the migration.
