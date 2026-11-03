# Wave 5 pronunciation audio assets

Base: d6c3b947d9c3dc6270ecfd2fb1c0dad219ff158e, PR #50.

The two versioned MP3s are byte-identical copies of the complete owner-approved review files. No generation, prosody search or new resynthesis occurred during this asset-finalization task. Academic lesson objects are unchanged. The dedicated `content/pronunciation-audio.json` records exact reviewed text, hashes, measured durations, provenance and QA state.

PRO-A2-03: Kokoro-82M v1.0, kokoro 0.9.4, bf_emma, speed 0.95, CPU; 0.5-second pauses. Native 24 kHz MP3, measured 160 kbps.

PRO-B1-02: Parler-TTS Mini v1 revision 0392b9451a601e528fd863bbb0598431fee810d9, Laura seeds 11/33/11. Only sentence 2 has the owner-approved local Praat PSOLA edit. PitchTier 1.040–1.200 s, waveform blend 1.030–1.250 s, 10-ms edge fades; no duration/formant/global-pitch changes. Sentences 1 and 3 were not altered. 0.4-second pauses; 44.1 kHz / 192 kbps.

Owner sample QA: PASS for both. Owner final-file listening QA: PASS by inheritance for both: committed MP3 bytes match the exact owner-approved complete review files. No redundant listening is required under the owner's explicit rule. Technical signal checks do not constitute human acoustic approval.

Run locally:

```
PRAAT_PYTHON=/path/to/python-with-numpy-and-praat-parselmouth node tests/pronunciation-audio-wave5.cjs
```

Requires ffmpeg and ffprobe. The Python test measures decoded final MP3s, using Praat autocorrelation (10-ms step, 75–450 Hz), median F0 200–300 ms before the last voiced frame versus the final 100 ms. Gates: sentence 1 < -1 st; sentences 2 and 3 > +1 st. Recorded results: -5.1698 / +2.0837 / +2.0099 st.

This is an asset/metadata/test-only change. The dedicated manifest is staged for later pronunciation-player integration; this commit does not connect it to the Listening manifest or change runtime scoring/playback. Existing review-only/no-audio-evidence boundaries remain unchanged. Curriculum 1.14.0 has not been composed, imported or deployed.
