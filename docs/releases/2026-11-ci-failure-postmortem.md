# SLE GitHub Actions failure postmortem — 2026-11-03

Scope: read-only examination of GitHub Actions logs from 2026-11-01. A red workflow result identifies a failed job, **not** necessarily failed QA or an unsuccessful Firebase deployment. Use individual job/step logs for release decisions.

## Recorded failures and exact evidence

| Run (2026-11-01) | Failing step | Root cause supported by the log | Corrective measure |
| --- | --- | --- | --- |
| [41273723901](https://github.com/TMA2015/self-learning-english/actions/runs/41273723901) | consolidated QA | `github-first-g1-local-runtime.cjs` expected curriculum `1.15.0` while candidate reported `1.18.0` | Align current-candidate assertions to `1.18.0`, retain explicit immutable historical-version coverage. |
| [41273967960](https://github.com/TMA2015/self-learning-english/actions/runs/41273967960) | aggregate audit | Three audio tests failed with `spawnSync ffprobe ENOENT`; the runner lacked the FFmpeg tooling | Install FFmpeg before tests, and retain ffprobe in the QA prerequisite setup. |
| [41274256957](https://github.com/TMA2015/self-learning-english/actions/runs/41274256957) | post-setup cleanup | `setup-node` cache save errored: "Path Validation Error ... caching do(es) not exist" | Do not enable setup-node pnpm caching without a valid cache path; frozen install is sufficient for this project. |
| [41283969887](https://github.com/TMA2015/self-learning-english/actions/runs/41283969887) | full release QA | `content-density-wave6-audio.cjs` incorrectly asserted `LIS-A2-01` must be `PENDING`; actual rights register correctly had `APPROVED` after owner clearance and replacement | Update the test to verify APPROVED clearance, original source, replacement MP3 SHA and absence of the old binary. **Do not downgrade valid rights records to satisfy a stale test.** |
| [41286147462](https://github.com/TMA2015/self-learning-english/actions/runs/41286147462) | production HTTP smoke | Firebase action returned `status: success` for English Hosting, then `curl` received HTTP 404 on `LIS-A2-01-v2.mp3` immediately afterward | Distinguish deployed vs verified. Retry boundedly after edge propagation; verify actual MP3 codec, not only HTTP status. |

## Boundaries of these findings

- A single HTTP 404 immediately after Firebase success **does not prove** CDN propagation was the only cause. A missing file, misrouted Hosting target or outdated cache can also produce 404. Check the actual Hosting release and asset bytes before calling it verified.
- The 14:46 run **did deploy** according to the Firebase action, despite its final red status. It must not be described as "nothing was deployed".
- The historical green [41274557671](https://github.com/TMA2015/self-learning-english/actions/runs/41274557671) proves only the source and tests of that particular earlier commit, not the final v1.18.0 release commit.
- GitHub public visibility and public-runner eligibility do not eliminate test quality, branch governance, or production-safety obligations.
- The current release branch has updated version/rights assertions, FFmpeg installation, a disabled invalid pnpm cache, and HTTP retries. These changes are *fixes present in source*, not automatically a new final-commit QA PASS.

## Required prevention sequence for the next release

1. Verify the target branch, candidate version, complete source, audio hashes and owner-authorized rights records **before** expensive installation.
2. Run exact-commit, read-only PR QA using a standard Linux runner, with no Firebase secrets or deploy permissions.
3. For any failure: capture the **first failing step**, test assertion and source commit; fix the actual cause, rather than rerunning unchanged.
4. Once the full suite and static production build pass, inspect the generated HTML and expected English-only MP3 artifacts before production deployment.
5. Deploy to the isolated Firebase `english` target only after explicit release authorization; keep Math isolated.
6. Retry boundedly after deploy, checking the HTML page and decoding audio with `ffprobe` to reject SPA HTML fallbacks masquerading as HTTP 200.
7. Always record **separate** QA, Firebase deploy and live smoke outcomes. If deploy succeeded but smoke failed, report **DEPLOYED / UNVERIFIED** and investigate or roll back deliberately; never infer automatic rollback.
8. Confirm interactive Gemini behavior independently; an HTTP smoke test does not verify AI Tutor/Writing quality.

## Scope of associated PR

Workflow, policy and documentation only. No curriculum, test-answer content, application logic, learner data, Firebase credentials, or live deployment changed. The Stage 3 v1.18.1 pilot remains a separate academic and runtime acceptance gate.
