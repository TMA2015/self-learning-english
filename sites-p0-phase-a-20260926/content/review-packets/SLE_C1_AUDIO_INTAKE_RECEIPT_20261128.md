# C1 audio intake and owner hearing acceptance — 2026-11-28
Exact baseline 6cc65e91c091b8261dedaedbd6b2a59c404d0c40; B08 approved staging 8de1d7f9c1cc1b7c398cf8365d53e8fc6bde0025 and B14 518721efbbdf4d87f7e32f0bc553c1fde3aa5a4c. Owner-uploaded SLE_C1_Audio_6_scripts(1).zip, exactly 6 MP3+6 JSON. Owner “đã test: pass.” Owner hearing acceptance recorded; no independent ASR/forced alignment asserted.

| Asset | Sidecar duration s | Decoded PCM duration s | Bytes | MP3 SHA-256 | Delivered script SHA-256 (trimmed UTF-8) | Turns | Peak dBFS |
|---|---:|---:|---:|---|---|---:|---:|
| C1-U03-TRANSFER-01 | 125.807 | 125.81 | 926520 | 1c0440e3c12bd8ef64f29d63468daf58887076b4f023a3ec2371244f3a511128 | 38a1512734518abd21aa9f04691e4ca4966e9bfb3660c186726c596364a3ab52 | 6 | -3.63 |
| C1-U10-TRANSFER-01 | 83.929 | 83.954 | 610824 | a80eed5d52c6e881c4761583c596f6313f14b0f6f15c6fa083a1593ae6eacd58 | 85ef21027039272846479de7aa36381e4120de66c9e9eba41f8a6b65598f3db2 | 4 | -2.44 |
| LIS-C1-01 | 126.625 | 126.65 | 918288 | c679c9c20308f7b7eacfe3f53207e981c55f308548d6551d3555560bfbf3e13c | 04300a8b56297349b50cb465882c17473c62537b2a1c7ad7ec048fa6ceb002de | 1 | -3.27 |
| LIS-C1-02 | 138.525 | 138.53 | 1015320 | 6e03dd7fc035b61447011666e561e7305d3af2d8fcadad332b00e7766569658a | 63842470cf4f9343eeec3e0b0fe041cbce99b6493070b25a9cb79f62751ce905 | 7 | -3.22 |
| LIS-C1-03 | 143.512 | 143.522 | 1037928 | f1481659dc47e4089b00a10d95a9f87e44283133e92026224972f65e79e3b50f | e18ede5832cc93efce078b799c339e8f9de77aff57725d9fdce896f2803e031e | 10 | -4.17 |
| LIS-C1-04 | 144.657 | 144.674 | 1049568 | b5ebcb3967481079fda19713fb38cfd72b9083e9467ba16952d1de04c18e8fec | e09cf30b771d88a882d41e9b01c4bde449150a31898a362e41f3befedfc776ad | 6 | -4.97 |

All six original MP3 hashes equal metadata. Complete ffmpeg decoding and ffprobe MP3 mono 24kHz verified, no clipping. Original sidecar durations differ from pipe-decoded sample durations at most .025s; retained both, no artificial duration edits. Each original metadata source_text and reconstructed turns matches the delivered script under whitespace normalization. Kokoro 0.9.4 local, GUI 1.2; speed 1.0017; pause .3500–.3514s; balance false; preset label Listening A2 not actual CEFR. LIS-C1-01 single bf_emma; five dialogues bf_emma/bm_fable. Source script provenance exact prior C1 pack from GitHub. Original files unchanged, rights/manifest/player and device QA pending, no binary committed here. Total 11/17 recorded/owner-accepted; 6 C2 remaining, four multi-speaker assets need distinct 3/4 voices (not collapsed A/B). No release or runtime change.
