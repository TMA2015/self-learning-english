# Curriculum 1.0 — complete original audio recovery and persistent archive receipt
2026-11-28. Draft #210 baseline ba3ea657feb16c7ec37238dfbfc58589dfd07520. Owner rights decision 92e397dd83a49b379027ad6caa20db9540eb6af8. Supersedes the earlier 1/17 recovery and Library raw-byte blocker for this archive. Owner reattached three ZIPs after prior retrieval failure; LIS-B2-01 MP3 from preceding upload was also available. Do not request further uploads, repeat production, owner rights confirmation or owner listening for this set.

## Actual technical verification
17/17 original MP3 SHA-256 values matched the approved scope (12 lesson + 5 transfer); aggregate MP3 bytes 14,958,480. Original ZIP integrity, unique safe filenames and 16 MP3/JSON pairings verified. 17/17 FFprobe MP3 mono 24kHz; FFmpeg full decode from extracted files with -xerror, no clipped signed 16-bit PCM samples. 16/16 producer sidecars matched MP3 hash, lesson ID and canonical filename; exact original sidecar bytes preserved. Source_text trimmed UTF-8 SHA matches prior receipt scope for all 16; C2 sidecar source_text_sha256 also matches actual source text. Historical LIS-B2-01 script SHA and exact audio identity from prior receipt; original producer sidecar unavailable, exact individual voice IDs not invented. Local model/voicepack binary hashes remain unknown. Actual file-input PCM decode durations measured separately from prior pipe/metadata/container figures: C1 prior small differences are measurement-context differences on identical hashes, not evidence of changed MP3; preserve both historical receipts and current verification JSON, do not silently rewrite durations. No new word-level forced alignment or browser/device QA.

Original three ZIPs received (actual SHA-256):
| Input | SHA-256 |
|---|---|
| SLE_B2_Audio_Pilot_5_scripts(2).zip | 133c3da9be8ae3bd4f2a1fd8c09f1a4867714d771cbf3c83d6f28e46f68ed1f1 |
| SLE_C1_Audio_6_scripts(2).zip | 5fa0e5a389d3585f7f121f4f93653e758e65a9b44d2e260c4e305af474673356 |
| SLE_C2_Audio_6_scripts(2).zip | fc41d600b6bc89d850d749a89e036242db0a10ec117cfeea9d944cb75d5c9cb6 |
All 17 MP3 fingerprints match the following immutable approved scope, not new rights:
| Asset | Decoded s (historical receipt) | Bytes | MP3 SHA-256 | Production script SHA-256 (receipt convention) | Reported voice(s) |
|---|---|---|---|---|---|
| LIS-B2-01 | 119.448 | 853944 | 995521c99ec8715758cd295a4de04a1788b8772a9e73d703cc72dd977b415056 | d3ff29610866c42649b41abfb4922b796ac6c1c6325366cb710941904a7f201d | A/B exact voice IDs UNKNOWN |
| LIS-B2-02 | 86.375 | 623688 | 425467d684e15d064f7b712c2b8a0ad1da4dfab81139ccc2bfdd1a72bddffa99 | 430150a2a0c35d16361883a3249ef2f68b53ed738f8eff3a716756d69f854a36 | bf_emma |
| LIS-B2-03 | 100.425 | 726432 | 4263987d6ae97ad3165280424a3f446bf9a51de85860385e155b581bbfd9110a | 51651485fcbe04169273af24881c76ed75669112703032d0bdab11580376591e | bf_emma |
| LIS-B2-04 | 113 | 808584 | f8530881abbb6c7c3cb924e924028318d01051f481735a22466fde46aa1c5592 | 50b67561cc05c1c0439eb2c09db44bb34866715a59a60f1a57a7a39949b1c947 | bf_emma / bm_fable |
| B2-U04-TRANSFER-01 | 97.125 | 695376 | 262b34276f1426f7309a0266158bab9aec8ce4d4a732548b07377bff03db605b | 55c1090cd3b7cb013830bc934739c352d84eb8575f1e704d35b8cbe0a62452e9 | bf_emma / bm_fable |
| C1-U03-TRANSFER-01 | 125.81 | 926520 | 1c0440e3c12bd8ef64f29d63468daf58887076b4f023a3ec2371244f3a511128 | 38a1512734518abd21aa9f04691e4ca4966e9bfb3660c186726c596364a3ab52 | bf_emma / bm_fable |
| C1-U10-TRANSFER-01 | 83.954 | 610824 | a80eed5d52c6e881c4761583c596f6313f14b0f6f15c6fa083a1593ae6eacd58 | 85ef21027039272846479de7aa36381e4120de66c9e9eba41f8a6b65598f3db2 | bf_emma / bm_fable |
| LIS-C1-01 | 126.65 | 918288 | c679c9c20308f7b7eacfe3f53207e981c55f308548d6551d3555560bfbf3e13c | 04300a8b56297349b50cb465882c17473c62537b2a1c7ad7ec048fa6ceb002de | bf_emma |
| LIS-C1-02 | 138.53 | 1015320 | 6e03dd7fc035b61447011666e561e7305d3af2d8fcadad332b00e7766569658a | 63842470cf4f9343eeec3e0b0fe041cbce99b6493070b25a9cb79f62751ce905 | bf_emma / bm_fable |
| LIS-C1-03 | 143.522 | 1037928 | f1481659dc47e4089b00a10d95a9f87e44283133e92026224972f65e79e3b50f | e18ede5832cc93efce078b799c339e8f9de77aff57725d9fdce896f2803e031e | bf_emma / bm_fable |
| LIS-C1-04 | 144.674 | 1049568 | b5ebcb3967481079fda19713fb38cfd72b9083e9467ba16952d1de04c18e8fec | e09cf30b771d88a882d41e9b01c4bde449150a31898a362e41f3befedfc776ad | bf_emma / bm_fable |
| LIS-C2-01 | 164.35 | 1188648 | 63cb7e3032a72338d964037b509ca7dba499ffc8d4585b7fc07457c3d3ca5fff | 2b7f52de6e4863c672f29cade0584abdbd36bea422325613e6878d3e53dba505 | A=bf_emma |
| LIS-C2-02 | 118.925 | 806064 | 33c2b00cc4e5299cd32fa3e65f11fc495881bdcc27b1010e89b58c6cf3dbacbf | b0115dc064355993d2947c319a43c5fe19123fc6a867c8950d7a929df006b9e1 | Nia=bf_emma; Owen=bm_fable; Priya=bf_isabella |
| LIS-C2-03 | 176.8 | 1289952 | a450b3ed2594e77741b89550d12ba9fa83b3d3b10394f1fd341a9b646c4e9e3c | 8a7a4686343b9bf080c1c310d21087bf04e824e3a59302faf9167cab40b43dfb | Moderator=bm_fable; Leena=bf_emma; Tomas=bm_lewis; Ruth=bf_isabella |
| LIS-C2-04 | 148.6 | 1073208 | 942b76702a147123fd221b3dab636dd8bf8e546b79bf3423d3d5235f7b342579 | 87ddf59967de912eb2a0bd3768906705ac2b330b80ae037e7988f91ea06e8474 | Chair=bm_fable; Ecologist=bf_emma; Historian=bm_lewis |
| C2-U03-TRANSFER-01 | 103.275 | 757656 | e2447d2915e8a2838d95e0804da13afa85228b070cb7f5f8e50503614df8ef84 | f448b3cc7dd15f946ccded7b269036ebd0418c414a169c612b3ca32e0a34f7d0 | Eva=bf_emma; Farid=bm_fable; June=bf_isabella |
| C2-U10-TRANSFER-01 | 79.075 | 576480 | df3513ef0ef64cbc0022c6083bf6625ea5d26816cb2bbf7f2abca08548df44c7 | f31a06d123a56458efe64194a825aa684f42de8949f05ebb7065cdf9a85b9837 | A=bf_emma; B=bm_fable |

## Persistent storage AND verified readback
Consolidated 17 exact original MP3s under canonical names + 16 byte-identical original JSON sidecars + VERIFICATION.json (actual decoded/container durations, hashes, Git blob fingerprints, generator metadata and evidence limitations). No audio re-encoding or source rewrite. Archive not intended for public serving.
- Library path: /SLE/SLE_CURRICULUM1_AUDIO17_VERIFIED_ORIGINALS_20261128.zip
- Persistent library_file_id: libfile_c9dc43110db0819198ff8c1a36a85890
- Exact uploaded file_id: file_000000006414821183b962f17290e768
- Archive bytes: 14,676,500
- Archive SHA-256: 80980e6d0f5382eab72a76d3eb86adc7f92f106c71da72ef6e9d688c46cb9a52
- Archive Git blob SHA-1 (locally calculated, not an uploaded Git object): 0bf3cf2d69acc0c97a9423ba3d740dfcb60ff6c3
- Library upload succeeded. Actual independent raw-file materialization from exact new file_id into separate workspace directory succeeded. Byte-for-byte cmp and SHA-256 matched original archive, ZIP integrity and each of 17 MP3/16 sidecar SHA checked again after readback. PERSISTENT ARCHIVE READBACK PASS. This is a verified Library copy, not a claim that the audio is already stored in GitHub or Firebase; future session access must still be checked.
- Resume by materializing exact archive file_id and checking archive SHA plus all contents against VERIFICATION.json and this decision; no need to ask owner for previously received originals again. Keep private, do not place JSON source scripts in public. If future access changes, investigate via stored Library reference before proceeding, do not claim recovery without bytes.

## Gates
Production/owner hearing 17/17 PASS; scoped owner website-use permission 17/17 APPROVED; binary recovery and Library archive readback 17/17 PASS. Git binary staging 0/17: current GitHub connector accepts literal base64, not direct container path; separate file-capable integration needed, do not fake commit. Existing 44 historical MP3s, rights ledger, 21 foundation mappings and working 228/1471 unchanged. Next integrate exact binary assets and private metadata on existing Draft #210 with controlled manifest, rights gate expansion and route mapping, preserve historical assets and learner records, then actual MEDIA-01/encoded alignment and device QA per #257/#251. No CI initiated now; no import, merge, deploy or activation. C2 Writing independent reviewer gate remains HOLD. Historical LIS-B2-01 source/voice limitations retained; optional portable metadata bundle not required for MP3 recovery.
