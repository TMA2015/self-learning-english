# Milestone 3B — Assisted AI Review and Learning Content Foundation

Date: 25 September 2026. Existing AI English Tutor Site; private audience retained.
Baseline stable source: `a6d5c697c423737d708452aebeed3ccf8b903bdd`.
No learner reset, no schema removal, no paid API, no additional full course.

## Delivered workflow

1. Learner saves a Writing draft/revision. Without automatic AI it remains Pending Review.
2. Administrator opens **Parent View → Assisted AI Review → Pending Reviews**.
3. Open the submission; check/edit anonymized text and confirm authorized-adult review.
4. **Prepare AI Review**, then **Copy AI Review Packet**. If clipboard access is blocked,
   select/copy the visible packet manually. The adult sends it to a chosen assistant.
5. Paste the returned JSON or choose a JSON file, then **Import AI Feedback**.
6. Check the specific feedback, scores, quoted errors and hints. Confirm and **Approve
   Feedback**. Only this action exposes the review to the learner and adds evidence.
7. Learner opens Saved Writing & revisions, follows hints and independently revises.
   Each revision is retained as a new submission and can be reviewed again.

Imported feedback includes all six rubric criteria, relevance, strengths, priority
issues, exact quoted corrections/explanations/hints, revision instructions and a
short targeted exercise. Suggested corrections stay behind a reveal control. The
reviewed queue and revision history preserve previous work. One approved evaluation
per immutable submission prevents accidental replacement; revisions are the next step.

## Validation report

| Area | Result and evidence |
| --- | --- |
| Existing engine | Full `node tests/run.cjs` suite passes, including legacy assessment versions and 100 adaptive paths |
| Adaptive patterns | Weak 72 questions / A2→A1; mixed 82 / A2→B1→B2; strong 72 / A2→B1→B2. Existing policy unchanged |
| Existing Writing | Twelve controlled provider/failure/revision/idempotency cases still pass; fixtures are not live AI |
| Assisted review contracts | Packet privacy, exact-match binding, schema/range/tag/quote validation, duplicate imports, approval gate and locked reviews pass |
| Actual local D1/API | 23 checks pass using isolated synthetic accounts and the real routes/repositories |
| Persistence | Submission, packet, imported draft and approved review reload from D1; original workspace preserved |
| Account isolation | Anonymous 401, nonadmin 403, other-account import and parent-revision blocked; other queue empty |
| Concurrent approval | Two candidates approved simultaneously: one 200, one 409; exactly six evidence rows |
| Evidence/profile/plan | Imported draft adds zero evidence; approval adds reviewed Writing evidence, error tags, profile/plan and snapshot history |
| Browser review flow | Prepare, clipboard fallback, paste/import, adult approval gate, hidden correction reveal, reviewed queue and reload verified |
| Export | Administrator JSON includes both original/revised submissions, packet, approval, evaluations and evidence; older v1 sections retained |
| Content foundation | Twelve existing units, thirty-six lesson headings, two existing exercises; reference validation and admin export pass |

The 23 local checks cover: submission save, packet save, other-account import rejection,
nonadmin rejection, anonymous rejection, wrong submission rejection, invalid score
rejection, draft persistence, zero unapproved evidence, hidden imported draft, duplicate
import, competing approvals, repeat approval, exactly six evidence rows, approved-work
lock, feedback reload, profile/practice update, old workspace preservation, revision
history, cross-account revision rejection, isolated queue, learner export, content export.

## Limits and privacy

- No native runtime AI has been verified and no external provider is connected. This
  is a working adult-assisted import/approval workflow, not automatic AI generation.
- No assistant was contacted in validation. Pedagogical correctness of a real external
  review still requires the authorized adult's judgment. Provider/model are self-reported.
- Anonymization cannot reliably detect every school name, address or identifying story.
  The adult must inspect the packet before sharing it. Free-form learner goals are omitted.
- Approval is an educational review, not formal CEFR certification. Insufficient/sentence
  samples remain provisional. Listening, Speaking and Pronunciation are unchanged.
- Authentication isolates accounts, but a child using the same administrator sign-in has
  its privileges. Separate parent-child delegation is not implemented in this milestone.
- Local D1 reload/isolation tests supplement the user's previously passed cross-device
  test. A fresh two-physical-device test was not performed by the agent this milestone.
- Full bulk restore and large-library content authoring/import tools remain future work.
  The portable formats and transactional restore requirements are documented.
- Existing simultaneous draft edits remain last-save-wins; immutable submissions,
  evidence and approval locks protect reviewed records.

Implementation details, formats, repositories and migration instructions are in
`PORTABILITY.md`. All temporary QA routes and synthetic authentication must be removed
before packaging; test records remain only in the local development database.
