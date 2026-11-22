# SLE Dictation R1 — Independent Academic Review Receipt

**Received from owner:** 2026-11-22
**PACKET_ID:** `SLE-INTERACTION-LISTEN-DICTATION-R1-20261122`
**STANDARD_VERIFIED:** SLE-MASTER-001 v1.2.1
**WHOLE_TRACK_DICTATION_ACADEMIC_VERDICT:** **PASS**, with **2 MUST_FIX** required before adoption
**A1_A2_B1_PILOT_FIT:** PASS
**CLOZE_SELECTION_ALGORITHM:** PASS subject to explicit speaker-label exclusion
**EXACT_WORD_CHECKING:** PASS subject to clear literal-match labeling
**TRANSCRIPT_AND_ATTEMPT_BOUNDARY:** PASS
**SENTENCE_AUDIO_GATE:** PASS (sentence mode remains DISABLED until original MP3-aligned, SHA-verified timing metadata)
**UNSCORED_EVIDENCE_BOUNDARY:** PASS
**ROLLOUT_ELIGIBILITY:** THREE_PILOTS_ONLY (`LIS-A1-03`, `LIS-A2-01`, `LIS-B1-01`)
**IMPLEMENTATION_QA:** OUT_OF_SCOPE / NOT_TESTED by NotebookLM
**FIREBASE_LIVE:** OUT_OF_SCOPE / NOT_AUTHORIZED

## MUST_FIX and engineering reconciliation

1. **CLOZE_ALGORITHM**: Exclude all speaker labels from gap selection (examples `A:`, `B:`, `Woman:`, `Man:`, `Host:`, `Guest:`). Applied in `domain/listening-dictation.ts`: explicit anchored speaker-label recognition, structural tokens excluded from eligible gaps **and** audible-word denominator, including adjacent-colon form. Added regression cases covering all six named labels, plus other speaker labels and no-space cases in `tests/listening-dictation-contract.cjs`.
2. **UI_LABELING**: Display **"Type the exact word spoken in the recording"** and classify feedback as **"Literal Word Match"**. Applied in `app/listening-dictation.tsx` and enforced by `tests/listening-dictation-contract.cjs` plus Chromium interaction tests. Orthographic checking is explicitly not comprehension/proficiency grading.

**Additional browser regression repair (not NotebookLM):** Difficulty changes now clear previous check result and entered answers **synchronously**, not only from a subsequent effect; resolves the native Chromium CI failure observed in run #45042718932.

## OPTIONAL suggestions (not release requirements)
- A1/A2 optional *Show first letter* hint after incorrect retry: not adopted in this correction pass; would need separate review of UI/accessibility/privacy behavior.
- Protect proper names from auto-masking for A1/A2: not adopted yet; may be added later with explicit reviewed matching rules.

## Reviewer answers to 10 questions (condensed, preserving scope)
1. **Pedagogical fit PASS:** Post-submission listening dictation supports A1/A2/B1 bottom-up decoding and sound–spelling mapping after listening comprehension has been assessed.
2. **Source/attempt protection PASS:** Transcript obtained through attempt-scored gated endpoint, not bundled pre-submission; retake resets practice, graded full-playback remains separate.
3. **Cloze algorithm PASS subject to MUST_FIX #1:** Deterministic four-plus-character, stopword-aware, spaced masks with 10/20/30% tiers are appropriate for an unscored aid.
4. **Literal checking PASS subject to MUST_FIX #2:** Case, punctuation and apostrophe normalization appropriate only with explicit instruction to reproduce exact spoken words.
5. **Scaffolding/accessibility PASS:** Tiered challenge and touch-friendly entry; optional first-letter hint for less experienced learners.
6. **Sentence-audio gate PASS:** No independent per-sentence replay before exact matching-MP3 timing, duration and SHA verification. Whole-track may proceed independently.
7. **Evidence honesty PASS:** Volatile in-page practice; no score, CEFR credit, AI or user-storage write.
8. **Rollout PASS for three pilots only:** Do not activate every Listening lesson from manifest without separate matching-media validation.
9. **MUST_FIX:** Explicitly block speaker-label masking and enforce exact-word/literal-match UI labels; two optional suggestions listed above.
10. **Adoption verdict PASS (academic only):** Implementation, device/media QA, Firebase Preview and LIVE are separately gated.

## Engineering/release boundaries
PASS is not a claim of test completion or deployment authorization. Exact final-head CI must be verified independently. No Math/Auth operations, existing scored question changes, production write, or automatic oral/hearing proficiency inferences.
