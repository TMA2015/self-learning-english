# Pronunciation model-audio runtime integration

Base: feca1c17a3ceb4b609dfe21d26826920d5f06db1. Branch: pronunciation-runtime-audio-20261010. Target: content-density-wave6-draft-20261008.

Service lesson responses add pronunciationAudio (URL/duration only), separate from Listening audio. Resolution requires pronunciation module, manifest ID and exact ordered source_text / audio_model.text equality. Historical versions use their own lesson text; mismatch fails closed.

Foundation practice displays native model-audio controls without play-token, completion or evidence callbacks. Missing/mismatched models show awareness-only fallback. Recording, adult review, objective scoring, Listening timing/token/transcript logic and CEFR behavior are unchanged.

Local QA: frozen install PASS; pronunciation-runtime-audio PASS; pronunciation-audio-wave5 PASS; listening-submit-feedback and listening-retake-audio-readiness PASS; content-quality, curriculum, academic PASS; TypeScript noEmit PASS; pnpm build PASS.

Local QA orchestration reconciled from 5d23e23fa7dba57f3a7c1db27cc51026bac5e35d without replaying workflows or unrelated application changes. Restored qa:core, qa:full, qa:release and their two runner scripts; adapted Firebase static/security checks to all seven Listening and two Pronunciation assets and pinned Curriculum 1.15.0 raw/canonical hashes. qa:core PASS (15 commands); qa:full PASS (51 commands); qa:release PASS (full suite, TypeScript, Firebase static production build and static/security QA). The existing public Firebase browser-key allowlist is unchanged.

The static-path check exposed one runtime defect: pronunciation model URLs did not use publicPath in the browser service adapter. They now use the same base-path helper as Listening URLs; the separate pronunciation response, non-scoring playback and Listening token/completion paths remain unchanged. No GitHub workflow changes.

The prior pronunciation asset test pinned the entire pre-Wave-6 Listening manifest. It now checks each of the five original manifest entries against the committed audit and retains byte-hash checks for all five original MP3s, allowing the already-approved Wave 6 additions. No content/audio edits.

Curriculum 1.15.0 raw SHA-256: 981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426.
Canonical SHA-256: 66663bb61cf60b266d25e8abd890e81ad27398d3ebee9b7cd5cd211de878b1e8.

Browser QA pending: open PRO-A2-03 and PRO-B1-02 in practice, play/pause/seek model audio; verify recording still works and requires review; verify missing model fallback; confirm Listening still requires full verified playback. Native audio carries no automatic proficiency evidence.

No deployment, import, merge, audio regeneration, AI request, GitHub Actions, Firebase/security/billing change authorized or performed.
