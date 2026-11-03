# Self-Learning English

**G Learning · Learn · Grow · Go**

Self-Learning English (SLE) is a browser-based English self-study application. Public source repository: `TMA2015/self-learning-english`. Official Firebase Hosting: https://g-learning-english.web.app/ (project `roadmap-toan-ai`, **English** target only).

## One authoritative standard

**[SLE-MASTER-001 — Content, NotebookLM, QA, Release](sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md)** is the **only current rules document**. Update this one file when policies change. Old `*_STANDARD`, dated `*_QA`, `*_RELEASE` and CI quota reports are historical evidence, never parallel rulebooks.

## Simple working process

1. Prepare source/educational material in one PR; use NotebookLM review when pedagogy, content meaning, answer keys, rubrics or evidence change. Keep permanent review sources and only the current temporary packet.
2. GitHub Actions automatically runs **one `qa` check** on PRs targeting protected `main`; no Firebase Preview or manual QA button is needed.
3. After applicable checks PASS, the owner explicitly authorizes a release by squash-merging a reviewed PR into `main` with `[release-english]` in the commit title. The single release workflow reruns QA and deploys **English Firebase LIVE only**, then checks the HTML and MP3s.
4. Make a brief real-world spot check on the actual website (Reading/Vocabulary, Listening, feedback, saved draft, optional Gemini and mobile). Do not claim untested AI behavior, CEFR levels or offline capability.

## Important boundaries

- Application source: `sites-p0-phase-a-20260926/`. The Stage 3 v1.18.1 candidate contains 109 lessons and 913 activities with 38 currently authorized baseline MP3 assets.
- Curriculum packages and historical attempts are version-pinned and must not be rewritten or regraded.
- Browser progress uses localStorage, separate by origin. Do not clear existing learner browser data.
- Keep Firebase service-account secrets, individual learner records and personal backups outside this public repo.
- This website is separate from the ChatGPT-in-chat English Tutor project.

A successful Git merge is source integration, **not** proof of completed LIVE Firebase deployment.
