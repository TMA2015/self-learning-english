# G3 Firebase architecture amendment — 2026-10-04

Owner-approved decision:

- Use one Firebase project: **G-Learning**.
- Existing project ID remains **roadmap-toan-ai**.
- Existing Web App: **Self-Learning-Math**.
- Add a second Web App: **Self-Learning-English**.
- Keep Math and English Web App configuration and App Check registration separate.
- Keep learner/application data separated by explicit subject namespaces or collections.
- Treat AI as optional. Shared project quota exhaustion must not block deterministic/local learning.
- Keep the source repository private.
- Prefer Firebase Hosting for the English static artifact on the no-cost/Spark path; a public GitHub Pages artifact repository is not required when Firebase Hosting is used.
- Local IndexedDB/browser storage and backup/restore remain the primary no-server learning path.
- Cloudflare Workers + D1 remain compatible as an optional later account/sync backend.

This amendment supersedes any earlier G3 text that recommends separate Firebase projects for English and Math.
