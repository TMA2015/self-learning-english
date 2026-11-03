# Self-Learning English

**G Learning · Learn · Grow · Go**

Self-Learning English (SLE) is a browser-based English self-study project. The source repository is **public**. The learner-facing application continues to use **Firebase Hosting**; public GitHub does not require a move to GitHub Pages.

## Current architecture

- **Source and review:** [TMA2015/self-learning-english](https://github.com/TMA2015/self-learning-english), including curriculum candidates, tests, code and release evidence.
- **Firebase project:** `roadmap-toan-ai` (G-Learning).
- **English-only Hosting target:** `english`, mapped to `g-learning-english`; site: https://g-learning-english.web.app/.
- **Math separation:** Self-Learning Math may share the Firebase project, but English deployments must never target the Math Hosting site or overwrite Math data.
- **Learning flow:** deterministic scoring for suitable objective tasks; optional Firebase AI Logic assistance for supported Writing/Tutor experiences. AI answers are not automatic CEFR certification.
- **Learner records:** browser-local progress and backup/restore are supported by the application; any optional cloud access is governed by deployed Firebase access controls, not GitHub repository visibility.

## Repository layout and release status

- `main` currently contains repository governance, workflow configuration and baseline content. It is **not** a complete application checkout.
- The application source is maintained under `sites-p0-phase-a-20260926/` on development/release branches.
- [Release PR #67](https://github.com/TMA2015/self-learning-english/pull/67) tracks the v1.18.0 source candidate; it must not be mistaken for a verified live release merely because it exists in Git.
- [Stage 3 PR #72](https://github.com/TMA2015/self-learning-english/pull/72) is a separate draft integration based on the v1.18.0 release branch.
- Promotion to Firebase production remains an explicit, QA-gated operation.

## Learning areas

Grammar, Vocabulary, Reading, Listening, Writing, Speaking, Pronunciation, Diagnostic Assessment, Skill Map, Error Bank, Suggested Practice and My Courses. These are website/app features; this project is separate from the ChatGPT-in-chat **English Tutor** project.

## Quality assurance and deployment

- **Pull request QA:** the public-repository workflow checks repository policy on PRs targeting `main`. When a complete application checkout is present, it runs frozen-dependency full release QA and a static build, **without deploying**.
- **Manual production release:** `.github/workflows/english-manual-release-qa.yml` runs only on explicit dispatch with the exact protected release input and approved release branch. The release workflow alone may access its configured Firebase deployment secret.
- Only GitHub-hosted standard Linux runners are permitted; no paid runners, scheduled checks, or broad push-triggered build storms.
- Current CI rules and rollout constraints are in [`docs/releases/2026-11-ci-quota-policy.md`](docs/releases/2026-11-ci-quota-policy.md).

## Security, licensing and academic review

- Never commit service-account credentials, private tokens, student records or personal backups.
- Firebase **Web API keys** and App Check **site keys** are public browser configuration, **not** Firebase Admin credentials. Protect backend access using Firebase Security Rules, App Check where applicable, API restrictions and authorized domains.
- Public repository visibility does not itself grant unrestricted reuse rights to third-party assets. Respect source licenses and the project's recorded audio release clearances.
- NotebookLM is the independent **academic reviewer**, not an implementation or deployment tool. Maintain distinct permanent baseline sources and temporary per-batch review sources; keep full review instructions in human-readable packets, with short NotebookLM prompts.

## Contributing

Propose changes through a PR; do not merge unreviewed historical branches, reset learner evidence or trigger a production deployment as part of routine QA.
