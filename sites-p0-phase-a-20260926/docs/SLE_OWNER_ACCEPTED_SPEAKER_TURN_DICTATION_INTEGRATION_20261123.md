# SLE Listening Dictation: owner-accepted A/B-turn integration

**Date:** 2026-11-23  
**Status:** engineering Draft, original-MP3 turn replay and compact cloze; no release or LIVE deployment.

## Product decisions grounded in owner testing

The owner confirmed that the offline **v2 "SLE Dictation — A/B Turn"** plays all three original Listening recordings correctly when the button plays one whole **speaker turn**, not one punctuation-separated sentence. The A1/A2/B1 interactions have 9/7/6 source dialogue turns. The user also approved the compact SLE-style interface and found the former 10% / 20% / 30% word-density control too heavy for computer/iPad entry.

- A1-03: 9 A/B turns, Light **5** missing words, Extra **9**.
- A2-01: 7 Woman/Man turns, Light **4**, Extra **7**.
- B1-01: 6 Host/Guest turns, Light **4**, Extra **6**.
- One button per **whole speaker turn**, even if it contains 2–3 sentences.
- Only one gap per chosen turn. The answer word is picked **from the gated after-scoring transcript in browser memory**, never hard-coded into a public bundle. Literal Word Match is an unscored spelling aid, not Listening/CEFR evidence.
- Blue/white G Learning styling, 14px reading text, small responsive inputs, Enter to next blank. No new AI use.

## Preserved release and academic boundaries

The existing `FoundationDemo` gate remains: only `attempt.status==='scored'` can request `/api/foundation?transcript=<attempt.id>`; stale attempts are rejected before rendering Dictation. No transcript, answer keys or answer-bearing HTML is added to production `public`. The same original MP3 URL from the scored lesson is passed to the Dictation component.

The original MP3 SHA-256 identity, filename, approved duration and turn count are allowlisted for **three** pilots; client fetches/decodes the MP3 **only after** the post-submit practice UI is mounted. In-browser RMS silence detection and monotonic candidate selection mirror the owner-accepted **offline v2**. If SHA, duration, source speaker count, decoder or silence count fails, A/B turn play controls **stay disabled** and the full original recording is still playable. Computed cuts are a playback convenience for owner-tested pilots, not externally certified timings or a newly issued scored playback ticket. Safari audio decoding and its actual turn boundaries still require Preview acceptance.

Do not merge this into `main`, publish transcripts before submit, add firebase LIVE deployment or change math/auth/learner records. Add a full no-deploy Actions gate and a separate owner-controlled Preview/iPad test before release.

## QA

- Core `tests/listening-turn-compact.cjs`: 3 source transcripts, 9/7/6 lines, 5/4/4 vs 9/7/6 gaps, no masked speakers, source reconstruction, original SHA parity, fail-closed silent media.
- Updated `tests/listening-dictation-contract.cjs`: preserve scored transcript gating and no-score-write/privacy rules, remove obsolete sentence-mode expectations.
- Updated native Chromium synthetic React UI: speaker-turn rows, 5 light gaps, Enter focus, literal grading, extra 9 gaps, no independent audio on wrong fixture MP3, zero writes.
- Full repository regression, TypeScript/build and static-hosting contract must PASS on the **exact implementation HEAD** before owner Preview.

**Status distinctions:** Previous offline owner listening PASS is evidence for three original MP3s in v2. It does **not** certify this new React integration, Safari/iPad timing, an authenticated Preview or any LIVE deploy.
