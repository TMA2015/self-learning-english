# Stage 3 v1.18.1 — Real Browser & Mobile Preview QA

**State:** QA instructions only; **no preview deployment is implied by this file**. PR #72 remains Draft and SLE production remains unchanged.

## Where the candidate is available

- Source: `integration/sle-stage3-pilot-v1181-20261102`, [PR #72](https://github.com/TMA2015/self-learning-english/pull/72). The latest exact-commit PR QA must PASS.
- Existing official English Hosting: `https://g-learning-english.web.app/` — do **not** use this LIVE URL to QA Stage 3 until a separate production release has been explicitly authorized.
- An optional, isolated Firebase Hosting **preview channel** can be created from the existing **manual** GitHub workflow using branch `integration/sle-stage3-pilot-v1181-20261102` and exact input `PREVIEW_STAGE3_1181`. The workflow must complete full release QA before it deploys anything.
- Preview Hosting target: project `roadmap-toan-ai`, target `english` → site `g-learning-english`, channel `sle-stage3-1181-qa`, maximum expiry 7 days. `LIVE` and Math targets are never invoked by the preview path.
- The preview URL is not known in advance. Once the manual workflow succeeds, obtain it from **Run Summary → Stage 3 Preview URL** or Firebase Hosting preview channels. **Never guess a preview link.**
- Preview URLs are public and share the **real Firebase project backend**. Use fictional QA data only. Browser localStorage is origin-scoped; progress from the LIVE site is *not* copied automatically to the preview. Do not clear LIVE browser data.
- Firebase App Check/reCAPTCHA Enterprise may block Gemini on a new preview hostname unless that specific host is authorized. An HTTP smoke PASS does not prove Gemini works. Do not weaken App Check or make broad `*.web.app` domain exceptions.

## Manual acceptance matrix — one clean browser profile / fictional learner

| ID | Device / path | Action | Expected result / evidence |
| --- | --- | --- | --- |
| WEB-01 | Desktop Chrome/Edge, clean preview origin | Open Stage 3 preview; view Learning Path and REA-A1-01 | v1.18.1 teaching: Guitar Group model, Art Club practice separate; no answer reveal before Submit; save one screenshot (no names). |
| WEB-02 | Desktop | Choose an intentionally incorrect Reading answer, Submit, inspect feedback | Original explanation remains, plus specific **Next step**. No pre-submit hints and no automatic grade changes. Then correct answer is shown *after submission only*. |
| WEB-03 | Desktop | Repeat in VOC-A1-01 with incorrect Q3/Q8 | Vocabulary-specific Next step, short-answer normalizations remain fair; no CEFR claim. |
| WEB-04 | Desktop | SPE-A2-02 (lesson overview) | Model expanded before practice; click **Start speaking practice — hide the model**; model closes, rehearsal notice appears. Reopen model; rehearsal ends. No recording, grading, AI or speaking proficiency label. |
| WEB-05 | Desktop | Start a short attempt, type answer without submitting, save/exit, reload same preview URL | Draft restored with exact typed answer and lesson version. Save history intact; do not use existing LIVE learner data. |
| LIS-01 | Desktop and mobile | Open LIS-A1-01, play to completion, answer after audio and Submit | No answer leakage before Submit; option-order stable under re-open/retake, and grade uses canonical answer IDs. Record if audio playback unblocks completion correctly. |
| AI-01 | Desktop, ONLY after App Check preview host authorization | In lesson overview, ask one English and one Vietnamese/diacritic-free Vietnamese question | Gemini replies in expected language, no graded quiz answer/score invented, proper Markdown formatting, no request for personal details. If unavailable, show graceful message and record error class, **do not paste credentials or child's input**. |
| AI-02 | Desktop | Send question then navigate to another lesson before answer returns; simulate loss of network | Previous reply must not appear in new lesson. Error or offline case should not freeze UI nor imply answer was graded. |
| MOB-01 | iPhone/iPad Safari or Chrome, including narrow emulation (~320–375px) | REA-A1-01/VOC-A1-01 teaching cards and Speaking guide | No clipped content/buttons, clear readable text, no horizontal screen scrolling, keyboard/touch controls accessible. |
| DAT-01 | Mobile same preview origin | Save a synthetic attempt, close browser/reopen same URL | Existing attempt restored; no data wipe on update. **This tests browser localStorage, not IndexedDB.** |
| OFF-01 | Physical browser only if offline support is being claimed | Open cached preview in airplane mode then cold restart, test assets | Record observed behavior; **do not claim 100% offline** unless service worker/media caching and data persistence have been demonstrated. |

## Acceptance and blocking conditions

- Collect short PASS/FAIL per ID and a screenshot only when needed. Do not export/save personal learner data or secrets.
- If preview static smoke fails, check first failed step. A successful preview deploy followed by failed HTTP smoke means **preview exists but unverified**; LIVE is not affected.
- A FAIL in a scored answer key, offline/identity claim, API gating, attempt preservation or audio verification blocks release. Note findings on [PR #72](https://github.com/TMA2015/self-learning-english/pull/72).
- NotebookLM academic verdict is `PASS_WITH_REQUIRED_CHANGES`; production remains `NO-GO` until browser/AI/media gates and explicit owner decision are reconciled. Four provisional pronunciation minimal pairs remain outside production and `UNASSESSED`.

## Workflow/manual operation boundary

The existing connector cannot dispatch a secret-bearing GitHub Actions workflow. This is a **one-time preview creation**, not the regular PR QA (which runs automatically). Selecting preview requires explicit authorized manual invocation. Afterward, testing is conducted by opening the preview link on desktop/mobile; no GitHub knowledge is needed for each individual test.
