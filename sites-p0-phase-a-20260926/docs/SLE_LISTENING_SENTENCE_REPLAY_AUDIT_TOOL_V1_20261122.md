# Listening sentence replay — offline MP3 boundary audit tool (Phase 2A)

**Status:** source-only QA preparation, **NOT production**, no verified segment records yet.
**Dependency:** parent [Dictation Draft PR #215](https://github.com/TMA2015/self-learning-english/pull/215) at passing commit `d8418dba2a3763b4e90f98d0991a67ec6e6226fc`.
**Initial scope:** only `LIS-A1-03`, `LIS-A2-01`, `LIS-B1-01`.
**Approval:** no GitHub merge, no Firebase Preview/LIVE deployment or student scoring changes.

## Why this tool

The user wants learners to switch between **whole-track** and **sentence-by-sentence** replay during gap-fill practice. The original MP3 must be reused, not replaced with new TTS. Existing Dictation enforces the correct fail-closed gate: no segment replay is offered without original-asset SHA-verified timestamps. This tool prepares *candidate* metadata for that gate.

No automatic utterance alignment is claimed. Matching words or sentence counts to a waveform is not enough to establish exact start/end boundaries. The auditor therefore deliberately requires manual replay/verification using the actual original MP3 and protects against wrong recordings by checking SHA-256 and expected duration.

## Building the auditor (local/CI, non-deployed)

From `sites-p0-phase-a-20260926`:

```sh
node scripts/build-listening-segment-audit.cjs
```

The builder compares the bytes in `public/foundation-audio/` with the existing `content/foundation-audio.json` manifest and produces **three local HTML files**:

```text
.sites-runtime/listening-segment-audit/
  LIS-A1-03-offline-audit.html
  LIS-A2-01-offline-audit.html
  LIS-B1-01-offline-audit.html
```

The outputs are **not** committed, imported into curriculum, or copied into the deployed `public/` or `dist/client/` folder. They include source text to support offline QA only, so do not publish these files. The tool must be opened locally; select the matching original MP3 through the browser file picker. If browser `crypto.subtle` is unavailable on `file://`, serve the generated file on a local `127.0.0.1` HTTP server (not a third-party host).

## Audit procedure for each lesson

1. Choose the original MP3. The SHA-256 must equal the manifest entry; otherwise marking and export are blocked.
2. Select the first transcript line. Play the recording, mark the first spoken sound and last spoken sound with the buttons. Leave natural silence outside the boundary if it belongs between turns.
3. Press **Replay selected region** and verify the clip begins and ends on the correct spoken words. If it clips an initial/final sound, adjust and replay again.
4. Repeat for each transcript line; no overlaps, no reversed times and no past-duration positions. The app requires a replay check for every line.
5. Export the local candidate JSON. It is explicitly `status:"CANDIDATE_UNVERIFIED"`, `productionEnabled:false`; neither field authorizes use by the learner player.
6. Independent QA must review the boundaries, source SHA and all clips, then test iPad Safari seek/stop. Only a separately approved, immutable and correctly versioned segment manifest may be wired to the learner UI.

## Security and learning-boundary constraints

- **No transcript delivery during a started/scored-but-unsubmitted attempt**. A local QA artifact is **never** exposed through the site.
- The real Listening assessed player and its server playback proof are unchanged. Segment replay is a post-submission practice feature only and must not generate scored evidence.
- No TTS, AI provider, sound recording, audio upload, real account, Firebase or learner-data write is needed.
- Segment boundaries cannot be assumed to match a new file version. Any SHA/duration mismatch must disable sentence playback immediately.
- Sentence lines correspond to the **same `splitDictationLines()` function** used by the current Dictation widget, preventing mismatched UI indices.
- No claim of a finished sentence-replay feature, human audio QA or device QA until these independent steps pass.

## Automated checks

`tests/listening-segment-audit-tool.cjs` runs in the full no-deploy SLE QA suite. It checks actual MP3 SHA agreement for three pilots, local artifact output only, source line payloads, offline/no-service controls, JSON export remaining unverified and no `verifiedSegments` injected into the production player.

**Next checkpoint:** Collect genuine reviewed segment candidates from the original audio, validate them against the manifest, then run sentence replay in a Firebase Preview and physical iPad Safari **before** requesting LIVE authorization.
