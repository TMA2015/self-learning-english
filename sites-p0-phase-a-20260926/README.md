# Self-Learning English — current application source

**Current architecture (GitHub + Firebase Hosting, 2026-11-17):**

- Official English site: https://g-learning-english.web.app/
- GitHub repository: `TMA2015/self-learning-english` (`main`).
- Firebase project: `roadmap-toan-ai` (shared organizational project with Math).
- **English-only** Firebase Hosting target: `english` (`g-learning-english`); static output: `dist/client`.
- English and Math must retain separate web-app configuration, App Check identity, subject namespaces and releases.
- This is **not** a ChatGPT Sites publication or the independent ChatGPT-in-chat English Tutor.

The canonical product/release documentation lives in the [repository root README](../README.md) and [SLE-MASTER-001](docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md) on `main`. Those sources override old issue descriptions, closed PRs, legacy docs and historical folder names.

## Development and release boundary

- Work in this application directory: `sites-p0-phase-a-20260926/`. Its *historical directory name* is not the active hosting platform.
- Static browser learning is selected by `NEXT_PUBLIC_LEARNING_RUNTIME=browser` for the Firebase build. Some old Next/Cloudflare/Sites API implementation still exists in the source tree for historical compatibility; it is **not evidence** that the live site runs on ChatGPT Sites.
- The current browser AI integration is in `infrastructure/browser/firebase-ai-browser.ts`, using Firebase AI Logic and App Check. Lesson Tutor, Writing Review and other AI flows must be checked on the actual Firebase deployment before claiming that a real request succeeded. Academic/mock QA does not prove live model output.
- Preserve versioned curriculum, learner attempts, local backups, audio rights/integrity, Math isolation and English Firebase configuration.
- Use the root README's protected-`main` PR/owner-approved release process. Source commits alone do not deploy. Do not independently merge or deploy for documentation cleanup.

## QA

From this directory, use the existing `pnpm run qa:core`, `pnpm run qa:full`, `pnpm run qa:release` and build scripts as appropriate to the exact change. Treat historical `docs/*RELEASE*.md` and Site-era migration plans as archival evidence, **not active operating instructions**.

**Historical tooling note:** The application originated from a Sites/vinext starter. Its starter package name and some server-side adapters remain in source for compatibility and tests. The official hosting and product authority are as stated above; consult Git history for superseded starter instructions.
