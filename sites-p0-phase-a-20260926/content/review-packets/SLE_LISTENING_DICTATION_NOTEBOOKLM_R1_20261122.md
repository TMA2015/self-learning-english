# Self-Learning English — Listening Dictation Academic Review R1

**PACKET_ID:** `SLE-INTERACTION-LISTEN-DICTATION-R1-20261122`  
**Project:** Self-Learning English (one unified SLE workflow)  
**Academic basis:** SLE-MASTER-001 v1.2.1, particularly §5.4 Listening, and the current permanent English NotebookLM reference sources  
**Review type:** New, reusable, **unscored post-submission listening practice**; NOT a review of existing scored Listening questions  
**Status:** Draft implementation + QA in progress; **NotebookLM verdict PENDING**; no merge, import, Firebase LIVE, or learner-data migration authorized

## A. Precise scope and learner experience

After a learner has **submitted and received a scored result** for an existing Listening attempt, the app can request the original transcript from the existing attempt-gated server endpoint. Only then may the learner choose **“Start fill-the-gaps listening practice.”** No transcript, answer token list, or blank key is statically bundled into the pre-submission browser JavaScript. Learners may separately choose “Read transcript after submission,” but opening Dictation hides the full visible transcript again, so the first cloze attempt is useful.

The existing approved and playable MP3 is reused, via a **separate practice audio element**, not new synthetic speech or a paid AI call. The learner selects Easy (about 10% masked), Medium (about 20%), or Challenge (about 30%); fills missing exact words; taps **Check exact words**; sees correct/missing spellings; and can clear and try again. The check is **orthographic/literal only**, not comprehension, sentence meaning, or Listening proficiency. All answers and results are volatile in this page; there is no new score, CEFR claim, grade, progress ledger, or automatic save. The previously submitted Listening score remains unchanged.

A button for **“One sentence at a time”** is present but currently DISABLED. Each source sentence's exact start/end timestamps must be obtained by verifying the original MP3 and matching asset SHA-256 before independent audio replay can be enabled. The code rejects absent/mismatched/out-of-bounds timestamps. No estimated audio positions and no browser text-to-speech stand-in are allowed. Word-level Karaoke and optional Shadowing are **future scope, not implemented**.

## B. Current cloze-selection algorithm — request for academic scrutiny

The cloze is generated locally from the **already-authorized transcript** for each scored attempt. It is deterministic for the same source and chosen difficulty. It segments text by source newlines and, where possible, punctuation; retains original speaker labels, spelling, contractions, punctuation, and layout. It considers English words with 4+ letters, excludes a short stopword list, spreads selected gaps to avoid adjacent missing words where possible, and targets approximately 10%, 20%, or 30% of spoken words. The computed number may be smaller if too few eligible tokens remain. It does **not** use AI to decide which words matter, so some words may be low educational value and some split points may be awkward in legacy single-line transcripts. Please assess whether this is suitable for an **optional unscored v1 pilot**, or whether additional lexical/semantic exclusions, age-level limits, stronger segmentation or manual authoring are REQUIRED before use.

Input matching ignores capitalization, leading/trailing punctuation and curly/straight apostrophe differences. It does **not** automatically accept synonyms, paraphrases, grammatical variants, different contractions or misspellings. This is legitimate only if the student is explicitly asked to transcribe the **exact word heard**; otherwise it would falsely treat appropriate alternatives as errors. The app must not describe this as a quality grade.

## C. Source fidelity examples — approved existing MP3/transcript metadata

The following are **existing SLE sources** used by the developer's source-level tests, NOT new audio scripts, NOT scored-question amendments, and NOT a request to re-review their original MCQ answers. Source text is presented here for independent review only; during active scored attempts the browser cannot access it through the new practice interface.

### Example A1: `LIS-A1-03` (food order)
- Approved MP3 path: `/foundation-audio/LIS-A1-03-v1.mp3`
- Manifest duration: `32.475 s`
- Manifest SHA-256: `7659ec83a5c67a483333304f59730c8061583051311d8fd7ac3e1145e9722f02`

> A: Good morning. What would you like today?  
> B: Two cheese rolls and one small apple pie, please.  
> A: I'm sorry. We only have one cheese roll left. We have fresh tomato sandwiches, though.  
> B: That's fine. I'll take one cheese roll and one tomato sandwich. No pie today.  
> A: Of course. Would you like a drink?  
> B: No, thank you. How much is that?  
> A: Five pounds altogether.  
> B: Here you are. I'm taking lunch to the park.  
> A: Thank you. Enjoy your lunch!

### Example A2: `LIS-A2-01` (library workshop)
- Approved MP3 path: `/foundation-audio/LIS-A2-01-v2.mp3`
- Manifest duration: `30.575 s`
- Manifest SHA-256: `3f2bfa2166dd3e1386e41b4337ae7526adc13c13a3207114aa35e2439bdc1478`

> Woman: Hello. Is the library workshop still open for registration?  
> Man: Yes. It is this Saturday at ten thirty in the morning.  
> Woman: Is it the workshop about growing herbs?  
> Man: That's right. Please bring a small container, but we will provide the seeds and soil.  
> Woman: Great. Is there a fee?  
> Man: No, it is free. Please arrive ten minutes early.  
> Woman: Thank you. I'll be there at ten twenty.

### Example B1: `LIS-B1-01` (commuting choices)
- Approved MP3 path: `/foundation-audio/LIS-B1-01-v2.mp3`
- Manifest duration: `47.6 s`
- Manifest SHA-256: `e14ebf40777dd8bc24ffde008c06ec1053089b9f7919c78c999be2a15e11de1e`

> Host: Today we're talking about commuting. A local survey suggests that people often choose a route based on reliability, not just speed.  
> Guest: Yes. A train that takes thirty minutes every day can be less stressful than a car journey that takes twenty minutes on a good day but forty-five when traffic is heavy.  
> Host: What about cycling?  
> Guest: It is an option for shorter journeys, although safe routes and weather matter. Employers can also help by offering secure bicycle parking or flexible start times.  
> Host: So there's no single best choice for everyone?  
> Guest: Exactly. The useful question is which option fits a person's needs and is practical most days.

**Media QA caveat:** The filenames, duration and SHA entries here are the GitHub manifest values; a successful runtime/device playback cannot be inferred merely from this source inventory. The source/asset integrity is independently tested by existing repository QA. No claim is made that sentence timecodes have been verified.

## D. Academic/evidence boundaries

- The default graded Listening test continues to require verified full real-audio playback for the **same scored attempt** before submission. Dictation never creates an `action:'play'` token, calls the attempt playback API or changes a scored result.
- The new practice appears only when `attempt.status==='scored'` and only after the server returns the authorized transcript for **that attempt**. A stale transcript response from a previous attempt is rejected by attempt ID.
- A scored retake returns to the pre-submission state and does not inherit any Dictation result or displayed transcript.
- No audio exists → no Dictation; no verified sentence timecodes → no per-sentence replay; missing/failed playback → no Listening proficiency claim.
- Completion of blank fields is **not** English comprehension proficiency, nor a certified CEFR result. Do not treat spelling checking as evidence of semantic understanding.
- No required AI, no microphone recording/upload, no learner-profile migration, no Math project changes, no LIVE deployment.

## E. Mandatory independent review questions

1. **Pedagogical fit:** Is post-submission listening Dictation valuable for A1/A2/B1 as a supplementary exercise rather than replacing comprehension assessment? Does it correctly support hearing word forms, detail, and repetition?
2. **Source and scored-lesson protection:** Does using the attempt-gated transcript only AFTER scored submission, and keeping audio-playback verification separate, protect the original Listening assessment? Identify any leakage or retake condition requiring changes.
3. **Cloze target selection:** Is the deterministic 4+-letter / stopword / ~10/20/30%-density strategy defensible for optional practice? Inspect A1/A2/B1 transcripts; list any MUST_FIX exclusions, spacing, segmentation and sentence-length constraints to improve educational quality.
4. **Literal answer checking:** Is exact transcription with case/punctuation normalization valid if labeled carefully? Identify common contractions, acceptable spelling variants, capitalization or speech phenomena that must not be falsely graded as proficiency errors.
5. **Scaffolding and accessibility:** Evaluate directions and difficulty descriptions for a self-directed learner, A1 versus B1, and iPad/small-screen input. Are there needed hint, retry, or line-level explanation improvements?
6. **Sentence mode honesty:** Confirm that per-sentence playback must remain disabled until exact start/end ranges are validated on matching audio assets; can the whole-track mode be reviewed independently without pretending the full two-mode goal is complete?
7. **Evidence honesty and storage:** Confirm that unscored practice, no AI calls and in-page-only state do not create false CEFR or progress claims. Identify any MUST_FIX labelling or recovery warnings.
8. **Eligibility for existing lessons:** May the reusable widget be offered on existing Listening lessons with matched real MP3 and gated transcript, subject to QA and age-level review? Should it first be limited to the three pilot lesson IDs for academic quality control?
9. **Alternative fix recommendations:** Provide exact replacement wording or rules for any must-fix shortcomings; distinguish strictly required corrections from optional future improvements.
10. **Overall academic verdict and release boundary:** Return a review verdict for the **current whole-track post-submit Dictation design**, independently of unfinished sentence timing, implementation, Firebase or live device testing.

## F. Required verdict format

```text
PACKET_ID: SLE-INTERACTION-LISTEN-DICTATION-R1-20261122
STANDARD_VERIFIED: <current version>
WHOLE_TRACK_DICTATION_ACADEMIC_VERDICT: PASS | PASS_WITH_CHANGES | REJECT
A1_A2_B1_PILOT_FIT: PASS | CHANGE | REJECT
CLOZE_SELECTION_ALGORITHM: PASS | CHANGE | REJECT
EXACT_WORD_CHECKING: PASS | CHANGE | REJECT
TRANSCRIPT_AND_ATTEMPT_BOUNDARY: PASS | CHANGE | REJECT
SENTENCE_AUDIO_GATE: PASS | CHANGE | REJECT
UNSCORED_EVIDENCE_BOUNDARY: PASS | CHANGE | REJECT
ROLLOUT_ELIGIBILITY: THREE_PILOTS_ONLY | ALL_ELIGIBLE_WITH_QA | RESTRICTED
MUST_FIX: NONE | <itemized exact corrections>
OPTIONAL: NONE | <itemized suggestions>
IMPLEMENTATION_QA: OUT_OF_SCOPE / NOT_TESTED
FIREBASE_LIVE: OUT_OF_SCOPE / NOT_AUTHORIZED
```

Provide answers to all ten questions, with evidence from these three source transcripts and the current permanent SLE standards. Be conservative: academic PASS cannot authorize technical QA, real iPad/Safari acceptance, MP3 time-alignment claims, PR merge, or Firebase LIVE deployment.

## G. NotebookLM source operation

**KEEP:** Current authoritative permanent English notebook sources and current SLE-MASTER-001 v1.2.1 (no duplicates).  
**REMOVE:** The previous temporary Reading EvidenceHighlighter packet (completed R1 PASS) and any prior completed batch packet.  
**ADD:** This **single Markdown file only**, `SLE_LISTENING_DICTATION_NOTEBOOKLM_R1_20261122.md`.

**Short NotebookLM chat instruction:**

> Review the current temporary Dictation packet against permanent English sources. Answer all ten questions and return the required verdict. Require exact changes where needed.