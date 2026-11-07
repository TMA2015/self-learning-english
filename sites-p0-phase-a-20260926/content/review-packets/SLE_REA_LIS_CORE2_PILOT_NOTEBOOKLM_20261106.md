# Self-Learning English — A2/B1 Reading & Listening teaching-density academic review

**Packet ID:** SLE-REA-LIS-CORE2-PILOT-20261106  
**Academic status:** DRAFT / NOTEBOOKLM NOT YET REVIEWED / NOT IMPORT-READY  
**Scope:** Proposed instructional enhancement to exactly four pre-existing lessons: REA-A2-01, REA-B1-01, LIS-A2-01 and LIS-B1-01; **no change** to scored questions, answers, source passages, scripts, recordings, grading, attempt IDs or historical packages  
**Source checkpoint:** the owner's complete V2 Recovery held immutable original curriculum package **1.18.1**. Current application has released cumulative **1.20.0** (123 lessons / 1025 activities) and the owner has visually confirmed 123 catalog entries. Exact lesson-object equality between the immutable 1.18.1 source and current 1.20.0 source has now been verified for these four IDs by `tests/reading-listening-pilot-source-immutability.cjs` in PR #99's exact-head CI (run 42244208709, PASS). This compares parsed source objects, not original serialized bytes, browser imports, playback or student attempts; retain all separate runtime/release gates.  
**Authority:** effective SLE-MASTER-001 **v1.2.0** on GitHub `main` (approved PR #95, commit `ebf85390271fe0bd3773b47c655552b2b98ea227`); approved 6-level / 60-Unit Framework v1.0. The new presentation and defect-prevention rules are normative for prospective changes; the existing 1.18.1/1.20.0 lesson packages remain immutable.  
**Mapping from approved Unit guide:** REA-A2-01 and LIS-A2-01 → A2-U08; REA-B1-01 → B1-U06; LIS-B1-01 → B1-U04.  
**Independence:** all proposed *worked-text* examples below are newly written, separate from graded passages and audio scripts. A text-only listening strategy example **must not be counted as hearing evidence**.  
**Release constraint:** no runtime/importer modification or production deploy before academic disposition, schema/renderer tests, original source comparison, media checks and owner release authorization.

## A. Existing teaching assessment: evidence, not assumptions

All four original lessons have lesson objectives, a brief English strategy explanation, real passage or scripted-audio source, scored questions and per-question explanation strings. All four have an empty \`examples\` collection. Empty \`examples\` alone is not proof of academic failure, but these four source explanations lack a distinct *demonstration of how to think through the skill* before scored practice. Each has a meaningful practice text or scripted dialogue. Their existing feedback usually restates the right evidence but rarely identifies a misleading competing explanation or a next learning action. These are **pedagogical enhancement findings**, not confirmed wrong scoring keys.

| Lesson | Existing skill focus | What must be preserved unchanged |
|---|---|---|
| REA-A2-01, *A garden for everyone* | gist, detail, simple inference, vocabulary in context; **11** MCQs | original community-garden passage; Q1–Q11 and all keys |
| REA-B1-01, *What makes practice effective?* | main claim vs qualification, purpose, inference, vocabulary in context; **5** MCQs | original purposeful-practice argument text; Q1–Q5 and all keys |
| LIS-A2-01, *A workshop at the library* | conversational gist, time, bring-vs-provided, fee, arrival; **5** MCQs | real validated playback requirement, library dialogue, transcript embargo and Q1–Q5 |
| LIS-B1-01, *Choosing a reliable journey* | gist, contrast, inference and speaker conclusion; **5** MCQs | real validated playback requirement, commute dialogue, transcript embargo and Q1–Q5 |

**Question/key overlap checklist (reviewer-only):**
- **REA-A2-01:** Q1 community garden connects neighbours; Q2 six volunteers initially; Q3 food bank; Q4 reading corner illustrates another use; Q5 beginners welcome; Q6 last spring; Q7 tank beside gate; Q8 Saturday vs after work; Q9 herbs in small spaces; Q10 inexperienced neighbour can join; Q11 harvest = collected produce. The new art-room demonstration must NOT answer any of these.
- **REA-B1-01:** Q1 purposeful and regular practice, not duration alone; Q2 mention of long sessions qualifies the central claim; Q3 memory explanation then checking; Q4 sustained attention = long-term focus; Q5 breaks can help when concentration falls. The new library-hours demonstration must NOT provide specific assessment responses.
- **LIS-A2-01:** Q1 workshop growing herbs; Q2 Saturday 10:30; Q3 bring a small container; Q4 free; Q5 arrive 10:20. **Nothing in new pre-submit teaching may reveal these audio details.**
- **LIS-B1-01:** Q1 reliability of journey; Q2 predictability; Q3 weather/safe cycling routes; Q4 secure cycle parking; Q5 choice depends on person. **Nothing in new pre-submit teaching may reveal these audio details.**

## B. Proposed enhancement: REA-A2-01 — *A garden for everyone*

**CORE1 / learner goal:** "I can read a short text, find its overall message, locate a specific detail, and make a simple inference based on clues." This is a lesson goal, not a reading proficiency certification.

**CORE2 / new student-facing strategy, before scored questions**

> **Read for meaning, then for evidence.** First, read the whole passage without answering. Ask: *What is it mainly about?* Second, go back to the relevant sentence for a detail. For an inference, combine only clues the text actually provides—do not invent information.
>
> **Independent worked mini-text (not the graded passage):** "On Wednesdays, the school art room opens before the first lesson. Pupils who leave early for sports can finish a painting in the morning. The new timetable is posted on the classroom door."
>
> **Step 1 — Gist:** This mini-text is chiefly about an art room's earlier opening time and why it helps some pupils, not about the location of a poster. A main-idea answer must cover the *whole* message.
>
> **Step 2 — Detail:** If asked *On which day does it open early?*, find the word "Wednesdays" in the first sentence. This is direct evidence, not an inference.
>
> **Step 3 — Inference:** We can reasonably infer that the timetable helps pupils with activities after school. We **cannot** infer that every pupil must leave school early; the text does not say that.
>
> **Common trap:** A choice can repeat one word from the passage and still misrepresent the point. Check the *meaning*, not just matching words.

**CORE3:** Retain the original 11 independently graded garden-passage MCQs, original passage and every key; the art-room worked example must remain unscored.

**CORE4 / post-submit micro-repair:** On a wrong gist answer: "Can your chosen summary cover the whole passage, not just one fact? Return to the first and final ideas, then try one sentence summarising the text." On a wrong detail: "Point to the exact sentence before choosing again." On an unsupported inference: "Which clue proves this, and what are you assuming?" Avoid inventing a recorded adaptive score or claiming that a retake equals mastery.

**Transfer (unscored):** "Read a new two-sentence school notice and write one direct fact and one reasonable inference. Mark which is which." The next separate notice must be authored or selected independently and cannot reuse the scored garden passage.

## C. Proposed enhancement: REA-B1-01 — *What makes practice effective?*

**CORE1 / learner goal:** Distinguish a writer's main position from a limitation, example or counterpoint; support inference without replacing a qualified argument with an absolute claim.

**CORE2 / new student-facing strategy**

> **Find the claim, then the limit.** Writers may make a useful general claim and add a qualification: "may", "sometimes", "although", "this does not mean". Ask: *What is the overall position? What does the writer refuse to claim?*
>
> **Independent worked mini-text (not the graded passage):** "Keeping the town library open later could help people who work evening shifts. However, electricity and staffing costs would increase. This does not mean that every local library should use the same opening hours."
>
> **Step 1 — Claim:** Longer opening hours **could help** some people. "Could" leaves room for uncertainty and differences.
>
> **Step 2 — Qualification:** Costs increase; the writer explicitly rejects a single schedule for all libraries.
>
> **Step 3 — Fair summary:** "Later hours may be useful in some libraries, but their costs and local needs matter." An answer saying "All libraries should always stay open late" overstates the text.
>
> **Step 4 — Writer's purpose:** The concession is there to make a balanced argument, not necessarily to cancel the central claim.
>
> **Common trap:** The strongest-sounding choice is often less faithful than the carefully qualified one.

**CORE3:** Keep all original B1 purposeful-practice reading material and 5 MCQs unchanged.

**CORE4 / post-submit micro-repair:** If a learner picks an absolute conclusion, locate the writer's qualifier and rewrite the claim using "some", "may", or "not always" without altering its meaning. If the learner mistakes an illustrative example for the central argument, explain what the example *supports*, then restate the broader point. If vocabulary inference is wrong, read surrounding words before choosing a dictionary-like meaning.

**Transfer (unscored):** Give the learner a different three-sentence opinion on a community issue. Ask for one sentence identifying both the claim and the limitation, explicitly not a proficiency score.

## D. Proposed enhancement: LIS-A2-01 — *A workshop at the library*

**CORE1 / learner goal:** First catch the situation of a short conversation, then identify the requested details in a second purposeful listen—**only with verified audio**.

**CORE2 / new student-facing strategy BEFORE the graded audio**

> **First listening = situation.** Without stopping to write every number, notice who seems to be speaking and why they are talking.
>
> **Next listening = your selected question.** Read the questions, then listen again for one relevant category at a time. For instance, a question may ask for a *place*, an *object* or a *reason*; do not treat all words you recognise as the answer.
>
> **Unscored strategy demonstration (text instruction only, NOT listening evidence):** Imagine hearing an announcement about a school display. On the first listen, your note could be "school display announcement", which records the gist. On a later listen, you might check the **type of detail asked** rather than try to copy every word. This illustration does not claim that you heard a model recording or award listening credit.
>
> **Common trap:** If you miss an unfamiliar word, do not guess an answer only because a written option sounds plausible. Use the replay control where available, and listen for the full phrase.

**CORE3:** Preserve the original library-workshop recording requirements, dialogue, five graded questions, answer keys, and \`transcript_reveal=after_submission\`. Do not add any exact workshop facts to this pre-submit guidance. Playback unavailable or unverified = Listening **UNASSESSED**.

**CORE4 / post-submit micro-repair:** Show the verified audio/transcript *after* submission only. For wrong gist, identify how the conversation topic was established; for wrong detail, replay the short relevant part and compare it with the transcript; distinguish a stated detail from a guess based on a familiar option. Do not change existing runtime replay controls or claim precise clip-seek capability unless verified.

**Transfer (unscored):** In the next distinct verified audio, make one gist note and one detail note, explicitly labelled practice rather than tested proficiency. Do not simulate hearing through text alone.

## E. Proposed enhancement: LIS-B1-01 — *Choosing a reliable journey*

**CORE1 / learner goal:** Follow a speaker's overall attitude despite examples, concessions, comparative details, or a change in emphasis; distinguish direct claims from inferred intention.

**CORE2 / new student-facing strategy BEFORE the graded audio**

> **Listen for the sentence that changes the direction.** Words such as "but", "although", "however" and "even so" can change how you interpret the speaker's position. The speaker's final view may be more qualified than the first positive or negative example.
>
> **Unscored language demonstration, deliberately not a recording:** "I like the design, although the instructions are confusing." The first clause is positive; the second limits that praise. It would be inaccurate to summarise this speaker as saying that the design and instructions are both excellent. This is a printed language demonstration; it does not provide verified listening evidence.
>
> **Step 1:** On the first real listen, identify the broad issue being discussed.
>
> **Step 2:** On a repeat, notice where the speaker agrees, disagrees, or adds a condition. Do not equate the first example with the final conclusion.
>
> **Step 3:** Before selecting an inference, ask whether the speaker actually supported it or whether you have supplied an unstated opinion.

**CORE3:** Preserve original commute recording, source script, five MCQs, keys, speaker identity roles and transcript embargo. No new content in the lesson may pre-reveal journey-specific evidence or the final correct option. A text-only demo cannot be scored as listening.

**CORE4 / post-submit micro-repair:** After scored submission and verified playback, let the learner examine the transcript/replay and identify (a) the example, (b) the qualification, and (c) the speaker's actual conclusion. Where a wrong answer overgeneralises, explain why a tempting "always/never" distractor may be unsupported; do not show the key before submit.

**Transfer (unscored):** With a separate approved genuine recording, note one position and one qualification; if no new verified audio is available, defer rather than award a listening outcome.

## F. Academic and engineering boundaries

- **Source identity:** The proposed notes are human-readable teaching proposals; they are not a valid machine-format curriculum JSON. Later adaptation must respect the exact seeded \`explanation\`/\`examples\` schema and supported renderer. Markdown in a string must not be displayed raw; test the real Reading and Listening player, not only a Markdown preview.
- **No version mutation:** All original 1.18.1 content and saved attempts remain readable. The four lesson objects have passed a source-object equality check against *actual* v1.20.0 in PR #99 CI; before importing any new version, prepare a forward-only change log and assign a new cumulative immutable version, with separate runtime, historical-attempt and browser verification. Do not overwrite v1.20.0, re-use a source version with a different digest, or silently alter answers.
- **Audio acceptance:** Full actual playback, asset/manifest alignment, transcript timing, shuffling/key mapping and device audio QA must retain their existing gates. This review packet does not certify that every specific MP3 was listened to on an end device.
- **Scope:** This pilot neither blocks unrelated approved lesson releases nor authorises a new lesson count above the active 150-lesson importer cap. No third-party content or personal learner information is required.
- **Unit integrity:** Keep the established A2-U08 pairing and B1-U04 / B1-U06 mapping. Do not invent completion/mastery for Units from a submitted tick.

## G. Questions for independent NotebookLM academic reviewer

1. For each of four lessons, distinguish existing CORE1, CORE2, CORE3 and CORE4 evidence. Is **IMPROVEMENT_REQUIRED** an appropriate *source-level* finding, without falsely claiming a wrong original scored key?
2. Is each new worked mini-text independent of the graded text, question stem, answer clue and distractor themes? Flag any accidental overlap by exact lesson and quotation.
3. Is the independent Reading demonstration A2/B1-appropriate, free of unsupported inferences and genuinely teaching a transfer strategy rather than giving away graded responses?
4. Does each Listening teaching scaffold respect the **audio-first**, real-playback and post-submit transcript requirements, without pretending that a text demonstration is hearing evidence?
5. Would genuine independent demo audio be an academic **MUST** for either proposed Listening enhancement? If yes, identify exact requirements and evidence needed before import; do not invent or assume playable audio.
6. Are feedback and repair actions specific enough to change learner behaviour, without assuming unimplemented timers, replay-by-segment controls, adaptive scoring, AI judgment or mandatory CEFR gates?
7. Are age suitability, proficiency claims, original content rights, Reading and Listening evidence validity and questions/answers preservation satisfactory?
8. Which proposed text might render poorly in the currently supported lesson UI? Identify a minimum user-visible acceptance test for each skill, including safe formatting on mobile and no active answer leakage.
9. What changes are **required** before any new immutable content version, and what is merely optional? Distinguish academic adoption from runtime/schema/importer/release permission.

## H. Required verdict format

\`ACADEMIC_VERDICT = PASS | PASS_WITH_REQUIRED_CHANGES | FAIL | INSUFFICIENT_EVIDENCE\`  
\`LESSON_DISPOSITIONS = {REA-A2-01, REA-B1-01, LIS-A2-01, LIS-B1-01}: PASS | IMPROVEMENT_REQUIRED | NOT_VERIFIED\`  
\`REQUIRED_CHANGES = [lesson ID, exact text/problem, precise correction]\`  
\`OPTIONAL_IMPROVEMENTS = [...]\`  
\`WORKED_EXAMPLE_INDEPENDENCE = PASS | FAIL | INSUFFICIENT_EVIDENCE\`  
\`AUDIO_EVIDENCE = NOT_VERIFIED_FOR_DEVICE\` unless the reviewer independently received verified audio evidence  
\`CONTENT_IMPORT_READY = NO\` (until subsequent schema, QA and owner release gates)  
\`ACADEMIC_ADOPTION = GO | NO-GO\`  
\`PRODUCTION_AUTHORIZATION = NO\`

Be conservative about any claim that depends on a source file not supplied. Do **not** mark any lesson, Unit or learner as mastered.

## I. NotebookLM source operations for the *next* review round

The v1.2 SLE-MASTER review is now complete and approved on GitHub. This is the **next** independent review round. Before activating this packet, synchronize NotebookLM's permanent SLE-MASTER source to **v1.2.0**, and remove the superseded temporary v1.2-review packet:

**KEEP:** current permanent authoritative English sources, including updated **SLE-MASTER-001 v1.2.0** (replace the old v1.1.0 permanent source rather than keeping both selected), the approved Framework v1.0 and durable academic baselines.  
**REMOVE:** previously selected temporary SLE-MASTER review packet and earlier batch temporary source(s).  
**ADD:** only this one Markdown four-lesson review packet; never import source JSON directly into NotebookLM.

**Short NotebookLM chat prompt:** "Review the current temporary A2/B1 Reading and Listening teaching packet against permanent English sources. Answer all numbered questions and provide the required verdict. Require changes for any unsupported claims."
