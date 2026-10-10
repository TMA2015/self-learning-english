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

## Browser bundled curriculum upgrade

Starting checkpoint: 8bd593cf2ffa3f0c1dcdb058ea119be1d684700b.
The browser-local bundle now uses the approved 1.15.0 candidate (100 lessons / 850 activities). No remote import is performed. The existing immutable package repository appends 1.15.0 and retains stored 1.11.0; current content is selected by semantic version. No storage namespace or learner-data schema changes.

The focused browser-curriculum-upgrade test seeds real 1.11.0 package data, a scored attempt with evidence, a Writing draft, saved Writing state and course selection. It checks that upgrade writes only the package storage key, preserves every other existing key byte-for-byte, retains the complete old package, reads old results/content unchanged, remains idempotent after reload, binds revisions to 1.11.0 and new roots to 1.15.0. It also verifies exact domain totals and new Listening/Pronunciation IDs and model audio resolution. All operations use isolated in-memory storage.

Upgrade validation: frozen install PASS; focused upgrade and pronunciation runtime PASS; Listening token/full-playback/transcript regressions PASS; qa:core 16/16 PASS; qa:full 52/52 PASS; qa:release PASS including TypeScript, Firebase static build and static/security QA. Candidate raw/canonical hashes and all nine committed MP3 bytes are unchanged. Build reports non-blocking large-chunk and duplicate configuration-source warnings; no build configuration change made. Owner browser QA remains pending; no deployment/import performed.
