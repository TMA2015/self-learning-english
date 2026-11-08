# Self-Learning English 1.21.0 — Unit 10 consolidated pre-release QA report

**Date:** 2026-11-07  
**Repository:** `TMA2015/self-learning-english`  
**Work branch:** `academic/unit10-v121-candidate-20261107`, Draft PR #117  
**Tested code HEAD:** `2a6c88db41bbf15c95247bd405e6ee2758ba6634`  
**GitHub Actions:** [SLE PR QA #226](https://github.com/TMA2015/self-learning-english/actions/runs/42387867077) — **SUCCESS**  
**Verdict:** **TECHNICAL CHROME QA PASS; PRODUCTION RELEASE NOT AUTHORIZED.** This report is a checkpoint, not permission to merge or deploy.

## 1. Candidate identity and academic preservation

- Baseline bundle **1.20.0: 123 lessons / 1,025 activities**, activated in the static production browser.
- Candidate **1.21.0: 132 lessons / 1,055 activities**; exactly **9 new Unit-10 lessons / 30 activities** across A1, A2 and B1. NotebookLM review adopted six corrected skill tags; existing 123 lesson objects, questions, answers, rubrics and ordering remain unchanged.
- Composer: `scripts/compose-unit10-v121-candidate.cjs`. It produces the candidate into ignored `.sites-runtime/unit10/`, never merges/imports/activates it.
- Candidate source is **not** activated by the current browser bundle. `infrastructure/browser/local-runtime.ts` still bundles approved **1.20.0**, intentionally. A production activation change requires a separate controlled release step.

## 2. Audio acceptance and rights

| Lesson | Exact canonical MP3 | SHA-256 | Owner listening | Scoped website use |
| --- | --- | --- | --- | --- |
| `LIS-A1-06` | `public/foundation-audio/LIS-A1-06-v1.mp3` | `91f736e9934476b44df0f4ab59eb2b381326bb144acd4475dcfa91e0fbe5bac6` | PASS | APPROVED |
| `LIS-A2-07` | `public/foundation-audio/LIS-A2-07-v1.mp3` | `04937096a911d5db09b470e97e459ded6e973c970a2ba388a6274883bf82064e` | PASS | APPROVED |
| `LIS-B1-08` | `public/foundation-audio/LIS-B1-08-v1.mp3` | `9082966b597522148eac25d618eff6e698990168a42305110ede1298f384ac82` | PASS | APPROVED |

- All **44 physical MP3 files** have per-SHA rights records and pass the strict owner-permission/integrity gate: `rightsApproved=44`, `rightsPending=0`.
- Owner's rights scope: three locally rendered Kokoro `bf_emma` MP3s, no external voice cloning, permission for **G Learning educational website use only**. Record: `docs/curriculum/SLE_UNIT10_OWNER_AUDIO_RIGHTS_DECISION_20261107.md`.
- No claim of independently hashing the locally installed Kokoro weight/voicepack binaries. Upstream licenses and the source-origin basis are documented.
- No prior MP3 bytes have been rewritten.

## 3. Automated QA evidence (exact tested HEAD)

**GitHub Actions #226: full SLE PR QA SUCCESS.** Relevant machine outputs:

- `UNIT10_1200_TO_1210_STORAGE_SAFETY`: **PASS**. Actual versioned repository and composer produce import preview `add=9 / update=0 / skip=123 / conflict=0`, with an old draft and Writing state preserved. Simulated quota failure is atomic, with no silent storage deletion. Under a conservative **5 MiB simulated cap**, the 1.20→1.21 upgrade fits in this fixture (`baselineBytes=1,567,168`, `autoUpgradeFitsTypicalQuota=true`). This is **not** a guarantee for populated long-term browser profiles or Safari quota behavior.
- `UNIT10_CHROME_AUDIO_CODEC_PLAY_TO_END`: **PASS** for all three unmodified MP3s using native Chrome and `HTMLAudioElement` in a disposable localhost profile.
- `UNIT10_MEDIA01_PRODUCT_CHROME`: **PASS** with the real `FoundationDemo` component, `AcademicService`, version 1.21.0 and locally served exact MP3s. Each of A1/A2/B1 tested: incomplete-answer block; answers-complete-but-unheard block; actual full playback; per-attempt verification; scored submit; transcript denied before and available after submission; independent retake with cleared audio verification and answers. A1 additionally exercises Save/Back/Resume. An unrelated existing lesson attempt fixture is retained byte-for-byte.
- Real Chrome storage and React backup/restore tests: PASS.
- `audio-rights-release-gate --require-clearance`: PASS (44 approved, 0 pending).
- `qa:full`: **93/93 PASS**; `qa:release`: **PASS**; TypeScript/static Firebase build/security checks: PASS.
- All tests were performed on PR code and disposable data; **no live Firebase/site content import, learner-data modification, merge or deployment**.

## 4. Outstanding independent requirements

**A. iPad/Safari:** **NOT TESTED**. Native Safari/iPad behavior cannot be inferred from Chrome. At least one real iPad Safari pass is required before the owner is asked for production release approval.

**B. Accessible preview:** **NOT PUBLISHED**. The successful localhost Chrome fixture is not a public/staging URL. Do not direct the learner to the production website to test Unit 10 because it still uses 1.20.0. Stage an isolated preview that bundles the reviewed 1.21.0 candidate only after review of its security/data-isolation configuration.

**C. Full browser version-upgrade path:** The repository and quota tests above are deterministic and safe, but they do not represent every existing household browser profile, especially profiles with many retained historical curriculum packages. Before release, validate upgrade/restore/retention with a realistic saved profile using **a disposable copy** and a verified backup. Never delete or reset actual learner data to solve quota problems.

**D. Explicit authorization:** Owner permission for MP3 website use **does not** approve merging PR #117, activating 1.21.0, importing into production, deploying or modifying learner records.

## 5. Minimum iPad Safari acceptance script (for a non-production preview only)

1. Open the dedicated **1.21.0 preview** on iPad Safari with a fresh disposable browser profile. Verify course shows 132 lessons and Unit-10 A1/A2/B1.
2. Open **A1-U10 Listening**, start practice. Verify transcript is not visible and unanswered questions cannot be submitted.
3. Answer the questions without audio: submission must remain blocked with an actionable message. Tap **Play full audio**, listen until completion, then submit. Verify result appears and transcript can be opened only afterward.
4. Tap **Retake lesson**. Verify previous result remains in history, answers reset and the new attempt requires fresh playback.
5. Start **A2-U10** and enter some answers; Save draft and reopen the same lesson. Verify answers persist. Complete audio and submit.
6. Repeat normal audio/play/submit on **B1-U10**. Test interruption/backgrounding once: audio must not be falsely counted as complete.
7. With a **disposable preview profile only**, simulate unavailable audio: no Listening score or mastery evidence may be given. Do not intentionally break the live production site.
8. Record screenshots/QA evidence and iOS/Safari version, timestamp, real audio completion and result state. Mark PASS only for steps actually observed.

## 6. Controlled launch and rollback plan (not executed)

- Freeze and hash the exact 1.21.0 candidate JSON generated by the composer; verify 132/1,055 and immutable old 123/1,025 content against 1.20.0. Current composer filename contains historical `NO-MEDIA` labeling even though physical media and owner rights are now present: this is a **legacy draft label**, not the current media status. Do not use labels as a substitute for gate evidence.
- Prepare a **preview-only** browser bundle using 1.21.0 with the same authenticated/local-browser storage and listening safeguards, but isolated from live learners. Run Chrome and native Safari/iPad QA there.
- Before any production activation: verify recoverable backups and historical attempt persistence, security/hosting QA and exact-head full CI, then request **separate owner release authorization**.
- On approved production launch: apply only reviewed content/static-code changes. Preserve immutable 1.20.0 package and all older attempt records; do not overwrite lesson IDs or purge localStorage.
- If problems occur: revert production code/static assets to the previous approved 1.20.0 build; **retain** any new 1.21.0 saved attempts/packages. Never "rollback" by deleting or replacing learner storage. Verify status with safe checks before resuming rollout.

## Final checkpoint

**ACADEMIC PASS · AUDIO 3/3 PASS · RIGHTS 44/44 APPROVED · CHROME MEDIA-01 PASS · FULL CI PASS · STORAGE UPGRADE PREFLIGHT PASS · SAFARI/iPAD PENDING · PRODUCTION NO-GO.**

Next release decision depends on real Safari/iPad preview QA, realistic saved-profile migration/backup evidence and explicit owner approval. **PR #117 remains Draft.**

## 7. Owner conditional release authorization — 2026-11-08

The project owner explicitly requested **“Tiếp tục. Phê duyệt phát hành nếu học liệu đủ điều kiện.”** This is authorization to follow **the existing protected-main English-only release path IF the current cumulative 1.21.0 package, exact-head CI, rights, compatibility and data-safety gates all PASS**. It is not authorization to overwrite or reset learner records, waive any zero-tolerance finding, deploy Math, change credentials/billing, or call an unverified LIVE website a success.

- Normative standard: `docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md` (SLE-MASTER-001 v1.1.0), Sections 8–10. It explicitly states **no separate Preview Hosting prerequisite**. Its limited UX exception permits a brief **post-release** real-device owner spot-check for a demonstrably backwards-compatible, non-destructive release after deterministic exact-head QA, with rollback retained. Safari/iPad remains `NOT_TESTED` until that real check is observed; do not mislabel it PASS.
- Newly materialized `content/curriculum-1.21.0-candidate.json` contains 132 lessons / 1,055 activities and preserves all first 123 v1.20.0 lesson objects exactly. `infrastructure/browser/local-runtime.ts` now imports it, with `tests/stage3-release-activation-gate.cjs` and browser upgrade/no-data-loss QA updated. Previous `content/curriculum-1.20.0-candidate.json` is immutable and stays available for saved attempts.
- `.github/workflows/english-manual-release-qa.yml` is updated to verify the 1.21.0 cumulative package and all three Unit10 live media files. Deployment remains gated behind **an approved squash merge to protected `main` with `[release-english]`**, full release QA and English-only Firebase credential verification. A commit to this Draft does not deploy.
- **Release decision checkpoint:** Conditional owner approval RECEIVED; **exact-head CI on the new runtime-activated code is REQUIRED before merge**. On FAIL, STOP and fix only the diagnosed issue in this PR, preserving the site. On PASS with no unresolved zero-tolerance blocker, proceed using the protected English-only release path, then record deployment and independent LIVE HTML/MP3/learner spot checks. Do not treat the pending real Safari check as PASS or a blocker by itself under the standard's explicit limited UX exception.
