# SLE Reading — controlled baseline wording correction R0
Packet ID: SLE-REA-BASELINE-WORDING-R0-20261126
Date: 2026-11-26 | PROPOSED ONLY — independent review pending. Frozen curriculum 1.28.0 Git blob 9d931a6930b8cd3ed918db1fa22e8708b7a9f884; SLE-MASTER-001 v1.2.1. Academic closure of Reading Knowledge v2.3: 99d85e4ecd77021f0cfb82280a3b7a7040a01b8a. Ten baseline defects previously identified and independently confirmed during Wave 4B/4C. This is a separate assessment maintenance scope, NOT a change to Reading Knowledge or UI. No production write, import, release, migration or historical mutation. Apply only to a separately versioned successor candidate after approval; never edit 1.28.0 in place. Preserve passage, lesson ID, item ID, type, all option IDs/text/order, correct option ID, evidence_weight, tags and historical attempts/results. One prompt correction and nine feedback explanation corrections. Explanations must identify meanings rather than shuffled answer positions; source names Text A/B and Source A/B are legitimate textual references.

## Proposed exact corrections and frozen context

### REA-B2-05 — Compare two accounts without inventing a winner

Frozen passage:
SOURCE A — Original source

The Brookgate Safe Routes group trialled a traffic-free lane outside one primary school on four Friday mornings. Volunteers recorded 11 vehicle conflicts at the crossing over four comparison Fridays before the trial and six over four Fridays during the trial. The group describes a conflict as a moment when a volunteer saw a vehicle and pedestrian approach the same crossing space and one changed course abruptly. It argues that the reduction is encouraging, but it has not measured total pedestrian traffic, traffic diversions to nearby roads, or whether the comparison periods had similar weather and school events. It recommends a longer monitored pilot rather than a permanent restriction immediately.

SOURCE B — Original source

A local shop association notes that some deliveries were delayed during the four trial mornings. Its short survey includes replies from nine of the 27 shops contacted; six respondents reported inconvenience, while three noticed no change. The association asks for clearer delivery windows and checks on nearby roads before any extension. It does not claim that the trial increased accidents, and it does not deny that the volunteers recorded fewer conflicts at the crossing. A joint meeting proposes testing fixed delivery slots and collecting both pedestrian counts and vehicle movements on surrounding streets. The two groups disagree about practical priorities but both favour gathering better information before making a permanent decision.

#### REA-B2-05-Q1
Prompt (frozen): What do the volunteer counts in Source C directly show?
- A. Traffic accidents fell to zero across the town.
- B. All vehicles took safer alternative routes.
- C. The recorded crossing conflicts fell from 11 to six across the comparison periods.
- D. The number of people walking to school doubled.
Frozen key: C | single_choice | evidence_weight 1 | reading.detail
Frozen feedback: The counts record one defined kind of conflict at one crossing over two sets of four Fridays. Misconception: Expanding a local count into a town-wide accident or exposure claim. Next step: Name the measured outcome and its denominator before interpreting it.
Field to change: prompt
Before: What do the volunteer counts in Source C directly show?
Proposed after: What do the volunteer counts in Source A directly show?
All other fields unchanged.

#### REA-B2-05-Q3
Prompt (frozen): Which claim about the shop association is supported?
- A. It states the trial caused more accidents.
- B. It denies that volunteers recorded fewer conflicts.
- C. It demands an immediate permanent ban on all deliveries.
- D. It asks for clearer delivery arrangements while recognising the recorded conflict result.
Frozen key: D | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: The association requests safeguards and does not deny the volunteers’ measured reduction. Misconception: Inventing an exaggerated opposition not present in Source D. Next step: Separate what the group disputes from what it accepts.
Field to change: feedback.explanation_en
Before: The association requests safeguards and does not deny the volunteers’ measured reduction. Misconception: Inventing an exaggerated opposition not present in Source D. Next step: Separate what the group disputes from what it accepts.
Proposed after: The association requests safeguards and does not deny the volunteers’ measured reduction. Misconception: Inventing an exaggerated opposition not present in Source B. Next step: Separate what the group disputes from what it accepts.
All other fields unchanged.

### REA-B2-06 — What do two sources actually show?

Frozen passage:
Text A — Bicycle parking trial: site count note.  
For four weeks, volunteers counted bicycles parked at the school's main entrance at 8:00 a.m. on each Wednesday. The average was 42 bicycles before a trial of additional parking stands and 65 during the trial. Volunteers used the same entrance and counting time, but did not record the weather, the number of students attending, or how the cyclists travelled to the school gate. The note says the counts increased while the trial was running. It does not claim that the stands alone caused the increase or that road accidents became less common.

Text B — Parent travel questionnaire: summary.  
A parent association invited families to answer an optional online questionnaire about journeys to school. Ninety parents responded. Of those respondents, 54 selected “a safer crossing near the gate” as their top improvement, while 23 selected “more bicycle stands”; the others selected different ideas. This was a preference questionnaire, not a count of bicycles or a study of accidents. Families who did not answer might have different views. The association recommended examining crossing safety before making another large spending decision.

Question format: Choose one best answer for each. Questions use only the two texts above. Options will be shuffled in the website; explanatory feedback must refer to *meaning*, not an option letter.

#### REA-B2-06-Q1
Prompt (frozen): Which statement describes the main relationship between the two sources?
- A. Both experimentally tested whether crossings prevent road accidents.
- B. Both concern school travel improvements, but one counts bicycles and the other reports preferences.
- C. Both surveyed exactly the same parents before and after the trial.
- D. They describe unrelated parts of the school curriculum.
Frozen key: B | single_choice | evidence_weight 1 | reading.gist
Frozen feedback: Text A records parked bicycles; Text B reports what respondents prefer. A and C invent methods; D misses the shared travel issue. Next step: Label the method beside each source.
Field to change: feedback.explanation_en
Before: Text A records parked bicycles; Text B reports what respondents prefer. A and C invent methods; D misses the shared travel issue. Next step: Label the method beside each source.
Proposed after: Text A records parked bicycles; Text B reports what respondents prefer. Neither source experimentally tests crossing safety or surveys the same parents before and after the trial. Both concern school travel, not unrelated curriculum topics. Next step: Label the method beside each source.
All other fields unchanged.

#### REA-B2-06-Q4
Prompt (frozen): Which conclusion would go beyond what either text can justify?
- A. There were more counted bicycles during the parking-stand trial.
- B. A majority of questionnaire respondents selected a safer crossing as their first improvement.
- C. The trial definitely reduced accidents because bicycle counts increased.
- D. The two sources address different aspects of travel to school.
Frozen key: C | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: Neither text contains accident measurements or a causal safety study. A, B and D are supported within their stated bounds. Next step: Underline the missing measurement in any claim containing “definitely.”
Field to change: feedback.explanation_en
Before: Neither text contains accident measurements or a causal safety study. A, B and D are supported within their stated bounds. Next step: Underline the missing measurement in any claim containing “definitely.”
Proposed after: Neither text contains accident measurements or a causal safety study. Higher bicycle counts, the majority preference among questionnaire respondents for a safer crossing, and the sources’ different aspects of school travel are supported within their stated bounds. Next step: Underline the missing measurement in any claim containing “definitely.”
All other fields unchanged.

#### REA-B2-06-Q5
Prompt (frozen): Which sentence best combines both sources without distorting them?
- A. Adding parking stands solved every travel problem, as all parents agreed.
- B. Increased bicycle counts during the stand trial suggest use rose, while an optional parent survey placed greater priority on a safer crossing; neither source establishes accident outcomes.
- C. The parent survey measured 65 cyclists and showed 42 road accidents.
- D. Since some parents preferred crossings, the bicycle counts in Text A must be inaccurate.
Frozen key: B | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: This attributes the sources separately and avoids inventing causation. A exaggerates, C combines incompatible numbers, and D assumes contradiction where none exists. Next step: Write a synthesis using “while” or “however” and a limitation.
Field to change: feedback.explanation_en
Before: This attributes the sources separately and avoids inventing causation. A exaggerates, C combines incompatible numbers, and D assumes contradiction where none exists. Next step: Write a synthesis using “while” or “however” and a limitation.
Proposed after: The supported synthesis attributes the sources separately and avoids inventing causation. The trial does not establish that every travel problem was solved or that all parents agreed. The survey did not count cyclists or road accidents; a preference for crossings does not invalidate the bicycle count. Next step: Write a synthesis using “while” or “however” and a limitation.
All other fields unchanged.

### REA-B2-07 — Synthesis without erasing a disagreement

Frozen passage:
Text A — Library service pilot log.  
For six weeks, the school library stayed open until 6 p.m. on Tuesdays and Thursdays. Staff recorded an average of 28 visits per extended afternoon, compared with 18 visits during the same weekday time slots in an earlier six-week period. These figures count visits rather than unique students. Staff frequently saw learners revising in small groups. The log does not record how many visitors would have studied elsewhere, whether grades changed, or whether the previous six weeks had the same examination timetable.

Text B — Student feedback form.  
A student committee collected 120 voluntary responses after the pilot. Seventy-three students marked “later hours helped me find study time,” and 31 marked “getting home later can be difficult.” Respondents could select more than one statement, so the groups may overlap. Sixteen selected “no strong view” as one of their responses. Several comments recommended publishing the bus timetable beside the opening times. The form measured reported experience and concerns, not the number of distinct visitors to the library.

#### REA-B2-07-Q4
Prompt (frozen): Which sentence preserves both an apparent benefit and a practical constraint?
- A. Later library hours guaranteed better examination results for the whole school.
- B. Because 31 students had transport concerns, nobody gained study time.
- C. Recorded visits were higher in the pilot period and many respondents found the hours useful, although transport concerns and limits in the comparisons remain.
- D. The committee proved that every student was counted once in both data sets.
Frozen key: C | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: C integrates both sources with appropriate caution. A and D claim unmeasured outcomes; B ignores the 73 reported benefits and potential overlap. Next step: Use an evidence-plus-limitation sentence.
Field to change: feedback.explanation_en
Before: C integrates both sources with appropriate caution. A and D claim unmeasured outcomes; B ignores the 73 reported benefits and potential overlap. Next step: Use an evidence-plus-limitation sentence.
Proposed after: The supported synthesis preserves higher recorded visits, reported usefulness, transport concerns and the limits of the comparison. Guaranteed examination gains and one-to-one counting across the data sets are not established. The claim that nobody gained study time ignores the 73 respondents reporting a benefit and possible overlap between response categories. Next step: Use an evidence-plus-limitation sentence.
All other fields unchanged.

### REA-B2-08 — Build an argument that answers a fair objection

Frozen passage:
For four weeks, one school trialled opening a supervised quiet study room at lunchtime, with 60 available seats. Daily entry counts ranged from 22 to 40; the counts did not identify repeat visitors. During the same month, recorded hallway noise complaints dropped from six to two, but other timetable changes occurred too. Ten staff members submitted comments; several thought the room was valuable, and some warned that reliable supervision would take time away from other duties. No comparison school or long-term outcomes were measured.

#### REA-B2-08-Q1
Prompt (frozen): Which claim is most defensible from this brief?
- A. A supervised lunchtime room may be useful to a group of students, provided staff time is planned.
- B. Every student wants the room every day.
- C. The room caused all hallway noise to disappear.
- D. Supervision has no cost because seats are available.
Frozen key: A | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: Some use is documented and a practical staffing concern is reported. B, C and D overstate or ignore the evidence. Next step: Align strength of claim to strength of data.
Field to change: feedback.explanation_en
Before: Some use is documented and a practical staffing concern is reported. B, C and D overstate or ignore the evidence. Next step: Align strength of claim to strength of data.
Proposed after: Some use is documented and a practical staffing concern is reported. The brief does not establish daily demand from every student, elimination of hallway noise caused by the room, or cost-free supervision. Next step: Align strength of claim to strength of data.
All other fields unchanged.

### REA-B2-09 — Qualify a claim without making it empty

Frozen passage:
Eight classes tried two approaches for four weeks. Four classes offered optional, structured peer comments on first drafts; four continued with teacher comments alone. Classes were not assigned at random. In the peer-comment group, 92% of students submitted a second draft, compared with 86% in the other group. These percentages do not measure draft quality. Teachers reported that some peer comments were specific and useful but others were too general. The peer-comment classes also had slightly different assignment deadlines. The school wants to decide whether to run another pilot, not declare a proven academic improvement.

#### REA-B2-09-Q1
Prompt (frozen): Which claim best matches the available evidence?
- A. Peer feedback guaranteed higher writing proficiency for every student.
- B. In this short, non-random pilot, second-draft submission was higher in the peer-comment group, but the result alone cannot show better writing quality or a causal effect.
- C. The second-draft figures measure the accuracy of every sentence written.
- D. The classes followed identical deadlines and conditions.
Frozen key: B | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: B preserves the observed comparison while naming key design limitations. A, C and D claim outcomes or controls not in the brief. Next step: Separate behaviour measured from ability not measured.
Field to change: feedback.explanation_en
Before: B preserves the observed comparison while naming key design limitations. A, C and D claim outcomes or controls not in the brief. Next step: Separate behaviour measured from ability not measured.
Proposed after: The supported claim preserves the observed submission-rate comparison while naming its design limitations. The figures do not establish improved writing proficiency or sentence accuracy, and the groups did not have identical deadlines and conditions. Next step: Separate behaviour measured from ability not measured.
All other fields unchanged.

#### REA-B2-09-Q2
Prompt (frozen): Which information most directly weakens a confident causal conclusion?
- A. There were eight classes in total.
- B. Both approaches involved comments on drafts.
- C. The classes were not randomly allocated and deadlines differed slightly.
- D. A second draft was submitted by some students in each group.
Frozen key: C | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: Group differences create alternative explanations for submission rates. A and D are factual but less diagnostic; B does not eliminate confounding. Next step: Look for important differences between comparison groups.
Field to change: feedback.explanation_en
Before: Group differences create alternative explanations for submission rates. A and D are factual but less diagnostic; B does not eliminate confounding. Next step: Look for important differences between comparison groups.
Proposed after: Non-random allocation and different deadlines create alternative explanations for submission rates. The number of classes and the fact that some students in both groups submitted a second draft are factual but less diagnostic. The presence of feedback in both approaches does not eliminate confounding. Next step: Look for important differences between comparison groups.
All other fields unchanged.

#### REA-B2-09-Q4
Prompt (frozen): Which sentence provides the fairest concession before recommending another trial?
- A. Although some peer comments were superficial and the pilot groups differed, a more carefully designed trial could test whether structured feedback improves revision quality.
- B. Peer comments were always perfect, so no further evidence is needed.
- C. Teachers who disliked the trial should not be allowed to comment.
- D. Because the pilot was imperfect, the school can never study peer feedback.
Frozen key: A | single_choice | evidence_weight 1 | reading.inference
Frozen feedback: It acknowledges a concrete weakness and proposes evidence to address it. B and C dismiss concerns; D wrongly rules out further inquiry. Next step: Make the concession relevant to your next recommendation.
Field to change: feedback.explanation_en
Before: It acknowledges a concrete weakness and proposes evidence to address it. B and C dismiss concerns; D wrongly rules out further inquiry. Next step: Make the concession relevant to your next recommendation.
Proposed after: The supported concession acknowledges concrete weaknesses and proposes evidence to address them. Claims of perfect peer comments or exclusion of critical teachers dismiss concerns without justification; ruling out any further inquiry also goes beyond the evidence. Next step: Make the concession relevant to your next recommendation.
All other fields unchanged.

## Required independent review
1. For each exact item ID, verify the frozen source and proposed field change. Confirm that the correct key remains uniquely defensible and its meaning is unchanged. Verify source labels and that new feedback is independent of display order. Check numerical facts, qualifiers and next steps. Reject any new ambiguity or incorrect explanation.
2. Verify exactly ten items, one prompt and nine feedback-only edits, no option/key/weight/tag/passage changes. Distinguish editorial corrections from changes in assessment construct. No historic data should be recalculated or rewritten. No engineering/release authorization.
3. Return only the following format; no other lessons or completion claims. Quote a short exact phrase from each proposed AFTER field to show that the actual proposed wording was reviewed.
PACKET_VERDICT: PASS / REVISE / FAIL
ITEM_VERDICTS: ten exact IDs; PASS/REVISE/FAIL; field; original key; exact phrase from proposed after; reason
KEYS_UNCHANGED: yes/no
SCOPE_UNCHANGED: yes/no
REQUIRED_CORRECTIONS:
ENGINEERING / PRODUCTION: NOT_TESTED / NOT_AUTHORIZED
