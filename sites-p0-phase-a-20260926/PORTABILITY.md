# AI English Tutor — portability and architecture

Audit and refactor: 25 September 2026. This milestone preserves the existing private
Site, 12-week Writing curriculum, workflow, navigation, demo tracking and saved state.
No new skill courses, provider credentials or public access are introduced.

## Initial audit and disposition

| Existing dependency | Finding | Change / retained boundary |
| --- | --- | --- |
| OpenAI calls in evaluation routes | Routes constructed vendor messages, selected a model, parsed vendor responses; prompts were inline | Replaced by `AITutor` service and `AITutorProvider`; OpenAI HTTP details now live only in one adapter |
| Cloudflare D1 | Application functions mixed SQL, storage binding and mastery logic | `LearningRepository` port, injected learning service, D1 adapter, hosting composition root |
| Sites authentication | Trusted Sites user headers directly selected record keys | `AuthenticationAdapter` and Sites implementation; historical ID/email key format retained |
| Course/question content | Bank builders and course arrays were TypeScript, some lesson content JSX | Canonical JSON under `content/`; compatibility modules preserve import paths and question IDs/options |
| Learner state | JSON in `learner_states`; no dependency on conversation memory or provider sessions | Preserved without deletion; append-only evidence and assessment records added |
| Hosting | Vinext/Vite, Cloudflare Worker, Sites build and access controls | Still required for this deployment; isolated from domain and documented below |
| Administrator tooling | Earlier unfinished inspector checked sign-in only | Now server-side admin allowlist; export uses the same checks; no other-account selector |

Preserved: original `learner_states` keys/payload fields, Writing stages and drafts,
feedback, course position, diagnostic archives and demo history. Migrated by copying:
previously persisted evidence and completed assessments into account-scoped tables.
Renamed internally: domain/content modules, with compatibility re-exports in `app/`.
Replaced: direct provider calls and direct storage access in application logic.
No tables, learner records or courses were dropped. Schema changes are additive.

## Structure and boundaries

- `domain/`: TypeScript model, assessment selection/stopping, evidence estimation,
  profile/plan derivation, inspector replay, content types, repository/auth ports,
  provider-independent evaluation metadata and portable export types.
- `content/`: JSON question banks (versions 2–4), skill catalogs, CEFR ordinal mapping,
  Writing course/lesson/tasks/rubric and export JSON Schema. IDs and ordering are
  stable. Old banks remain available to resume old assessments.
- `application/learning-service.ts`: repository-injected backfill, model projection,
  state saving and snapshots. `application/export-learner.ts`: read-only export.
- `ai/contracts.ts`, `ai/service.ts`, `ai/validation.ts`: single Tutor API, structured
  requests, result validation, versioned prompts and normalized metadata.
- `ai/prompts/registry.json`: independently versioned writing evaluation, feedback,
  error explanation, plan recommendations, brainstorming and reserved speaking prompt.
  Unused future prompts do not imply a working evaluator. Speaking stays disabled.
- `infrastructure/storage/d1-repository.ts`: all live persistence SQL and D1 calls.
- `infrastructure/auth/sites.ts`: trusted-dispatcher identity and configured admin role.
- `infrastructure/ai/openai-http.ts`: HTTP/provider serialization, timeout, model/key.
- `infrastructure/runtime.ts`, `infrastructure/ai/runtime.ts`: server composition roots.
- `app/`: React views and HTTP controllers; compatible module entry points remain.
- `db/schema.ts`, `drizzle/`: schema and additive migrations. `db/learning-store.ts`
  is a compatibility facade; it contains no SQL or scoring algorithm.

Domain and content import no React, Next, Cloudflare, OpenAI or Sites SDK. `node
 tests/run.cjs` compiles and executes them outside the hosting runtime. An in-memory
repository and independent AI fixture exercise replacement boundaries. These tests
are not a claim that PostgreSQL, Supabase or Gemini are already connected.

## Database schema and storage semantics

| Table | Identity | Stored data |
| --- | --- | --- |
| `learner_states` | `user_id` PK | Original complete JSON state, `updated_at` epoch ms |
| `learners` | `(owner_id, learner_id)` PK | Creation timestamp; one-time `legacy_imported` marker |
| `learning_evidence` | `(owner_id, learner_id, event_id)` PK | Skill, source, normalized JSON event, timestamp |
| `assessment_sessions` | `(owner_id, learner_id, session_id)` PK | Validated completed assessment JSON and timestamp |
| `mastery_snapshots` | `(owner_id, learner_id, snapshot_id)` PK | Derived model JSON, engine version, timestamp |

Evidence and snapshot indexes cover owner/learner/time. Events and sessions use
conflict-ignore insertion, making retries idempotent. Raw responses are retained
separately from the derived current mastery. Every live repository call receives
server-authenticated owner scope. Evidence is never accepted from arbitrary client
state updates; server activity routes validate and record it. Legacy backfill reads
only a previously persisted state record, never a newly posted client evidence array.

Migrations `0001` and `0002` add tables/columns; `0000` remains unchanged. The initial
state has one learner per account, internally `primary`. The new ledger keys support
multiple learners, but the legacy state adapter explicitly rejects non-primary
learners. A future multi-learner UI needs a scoped state table migration first.

Incomplete assessment, Writing text and UI state remain in `learner_states` and are
autosaved to D1. A completed assessment is persisted before its API response; the
profile can recover from its canonical evidence if the later state save fails.
A reload can recompute mastery. Essential state is not held in a model conversation,
provider session, browser storage or ChatGPT memory. No R2/audio storage is used.

Current limitations: the legacy JSON draft is last-save-wins across simultaneous
writers; there is no optimistic revision token. Evidence rows remain append-only.
Multi-step D1 operations are not one global transaction, but retry/backfill is
idempotent and canonical assessment recovery is tested. Export reads several tables
without a snapshot transaction: pause editing during a migration export. Large-scale
operation will need database pagination, retention and consistent snapshot export.

## Authentication and administrator access

Sites supplies trusted `oai-authenticated-user-id` / email headers. To preserve
existing records, the adapter uses `user:<id>` when present, otherwise the historical
`email:<lowercase email>` key. It does not take owner/learner IDs from request JSON.
A change in the upstream availability of these headers needs an explicit verified
identity mapping, not a blind merge. Do not rename or mass-update existing keys.

`ADMIN_EMAILS` is a server allowlist. Missing config grants no administrator role.
`/api/debug` and `/api/admin/export` return 401 without identity and 403 without the
admin role. Export is restricted to that administrator's own account/primary learner;
it is not a platform-wide data browser. The Site owner's verified email is configured
in hosted server settings. The private Site audience is owner-only.

Outside Sites, replace this adapter with verified sessions/OIDC/Auth.js or another
server authentication mechanism. Never expose an origin that trusts client-supplied
Sites headers. Map new verified user subjects to existing account keys during the
migration. Admin roles must also come from trusted server policy. Family members
sharing one sign-in share its role; separate parent/child accounts are future work.

## AI interface and secrets

`AITutor.evaluateWriting(text, task)` returns validated `WritingRating | null`.
`AITutor.coach(stage, task, answer)` returns normalized evaluation metadata or null.
`AITutorProvider.generate(TutorRequest)` accepts schemaVersion, purpose, promptVersion,
instructions, structured input and temperature; returns provider/model/result JSON.
The service validates before any proficiency contribution is generated. The current
adapter uses OpenAI HTTP; no provider SDK is required.

To add Gemini or another HTTP provider:
1. Implement `AITutorProvider` in a new server adapter, translating the neutral
   request to that provider's HTTP format and normalizing its response to `result`.
2. Inject it in `infrastructure/ai/runtime.ts`. Keep prompts and scoring contracts.
3. Run the shared validation/fixture tests and provider-specific HTTP failure tests.
4. Configure its key through server secrets, then validate real samples. No changes
   to learner records, content, profile calculation or components are required.

Each accepted evaluation stores `provider`, `model`, `promptId`, `promptVersion`,
`timestamp` (ISO UTC), and `structuredResult`. Writing ratings carry this metadata;
evidence rows and diagnostic reviews retain it. Vendor response/session objects,
tokens and API keys are discarded. Older evaluations lack metadata and remain
untouched; the application does not invent historical provider information.

| Server value | Purpose |
| --- | --- |
| `DB` | D1 binding supplied by Sites; replace with another repository's connection |
| `OPENAI_API_KEY` | Optional server secret; absent/failed call means provisional Writing |
| `AI_MODEL` | Optional model configuration, defaults to existing `gpt-4.1-mini` |
| `ADMIN_EMAILS` | Comma-separated trusted administrator emails; empty disables admin tools |

`.env.example` has empty keys; real local `.env` is ignored. Production values use
Sites runtime settings. Never use a `NEXT_PUBLIC_` provider key or send secrets to
components. No live AI credential is configured or required for guided Writing.

## Export/import format and procedure

Parent View → Administrator / developer tools → **Export learner data (JSON)**.
The server returns an attachment named `ai-english-tutor-learner.json`, UTF-8 JSON,
format `ai-english-tutor.learner`, schemaVersion 1. It includes full state, profile,
assessment evidence, skill mastery, attempts, Writing submissions/feedback/revisions,
error history, vocabulary if present, current plan, course progress, completed
assessments and mastery snapshots. Empty vocabulary is explicit; no data is invented.
Unknown legacy state fields survive. No access grants or credentials are exported.

`content/learner-export.schema.json` documents the open envelope and evidence fields.
`domain/portable-data.ts` provides an envelope guard, not a complete untrusted-file
security validator. Authoritative restore records are `state`, `assessments`,
`evidence` and `snapshots`. The named summary sections are projections and may repeat
records; do not import them as additional evidence. Current plan and historical
mastery snapshots are included; plans never stored historically cannot be recovered.

A future restore tool should:
1. Authenticate the administrator, choose a verified target account, back up its data,
   and stop concurrent edits. Never trust ownership or roles supplied in the file.
2. Validate schema version, sizes, timestamps, IDs, field types, finite score ranges,
   known skill/source tags, and assessment question versions. Reject malformed data.
3. Stage a dry-run: counts, conflicts and identity mapping. Preserve unknown legacy
   fields. Merge immutable evidence by ID; conflicting payloads require review.
4. In a target database transaction, restore full state and append canonical sessions,
   evidence and snapshots under the explicitly mapped target scope. Restore the
   legacy-import marker only after complete successful backfill.
5. Recompute current projections with a recorded engine version; compare counts,
   Writing text, next assessment question, and account-isolation checks before cutover.

No destructive upload/import endpoint is enabled in this milestone. The import
format and a fixture round-trip to a fresh repository are tested; a production bulk
restoration UI/tool, conflict policy and transaction adapter are future work.

## Moving to ordinary JavaScript/TypeScript hosting

1. Export learner data and copy this source repository, `content/`, prompt registry
   and immutable migration history. Keep the original private deployment available.
2. Retain the React views with Next.js/another React host. Replace the Sites/Vinext
   build and Cloudflare Worker entry with the target host's server build.
3. Implement `LearningRepository` against SQLite/PostgreSQL/Supabase. SQLite can use
   the existing SQL schema; other databases may use JSON/JSONB and equivalent compound
   unique keys. Cloudflare Sites only supports HTTP external clients; a conventional
   Node host can use its normal database driver. Do not change event IDs or content IDs.
4. Replace the runtime composition root and authentication adapter. Preserve verified
   account mappings and fail-closed administrator policy. Add CSRF/session protection
   appropriate to the replacement auth stack; never pass through arbitrary headers.
5. Inject the chosen AI adapter and server secrets. Leave it disabled until a real
   language-evaluation smoke test passes. Keep provisional fallback behavior.
6. Restore staged exports, run `node tests/run.cjs`, TypeScript/build checks, repository
   isolation/resume tests and real two-device saves on the new host. Validate old
   assessment versions and the complete Writing flow before switching traffic.

Known remaining Sites-specific files: `.openai/hosting.json`, Sites helper scripts,
Vite/Vinext/Cloudflare build configuration, `cloudflare-env.d.ts`, runtime composition
root, D1 adapter and Sites authentication adapter. Domain, JSON content, prompts and
stored learner payloads do not depend on these. A migration is a documented, bounded
adapter/hosting change, not a claim of one-click deployment to every provider.

## Milestone 3 addendum — Writing teaching loop

`domain/writing.ts` adds a separate `WritingRepository` port, submission/evaluation
records, neutral learner context and teaching rubric. `application/writing-tutor.ts`
retrieves learner context, saves immutable text before inference, claims evaluation
attempts and records only validated Writing evidence. The D1 implementation is in
`infrastructure/storage/d1-writing-repository.ts`; composition is in
`infrastructure/writing-runtime.ts`. All generation still goes through `AITutor` /
`AITutorProvider`, now with `teachWriting`. No new provider or secret is enabled.

Migration0003 adds `writing_submissions` (owner/learner/id, task_id, payload, at) and
`writing_evaluations` (owner/learner/id, submission_id, status, payload, at). Parent/root
IDs and original text live in submission payloads; evaluations contain attempt status,
normalized rating/metadata and corresponding evidence IDs. Attempts are claimed
atomically; finishing updates only a pending attempt. History is retained on retry.

Export v1 gains optional `writingRecords: {submissions, evaluations}`. Future importers
must restore these authoritative records as well as the original state/evidence/
assessment/snapshot sections, applying the same verified target scope and duplicate-ID
checks. Old v1 exports lacking `writingRecords` remain valid. A full production import
endpoint is still not enabled. See `MILESTONE_3.md` for the unconnected-provider gate.

## Milestone 3B — assisted review and content foundation

`application/assisted-review.ts` is a provider-independent review coordinator. It uses
`LearningRepository`, `WritingRepository` and the new `AssistedReviewRepository` port.
It does not call an AI provider. The existing `AITutor` / `AITutorProvider` interfaces
remain the automatic integration boundary; both routes normalize feedback through
`validateTeachingRating` into `TeachingRating`. The versioned `assisted-review` prompt
is in the registry, outside components. No paid API or new credential is activated.

Migration `0004` adds only:

| Table | Primary key | Purpose |
| --- | --- | --- |
| `assisted_review_packets` | owner, learner, packet ID | Immutable anonymized packet, digest and internal submission binding |
| `writing_approvals` | owner, learner, submission ID | One winning evaluation, reviewer account and approval time |

New evaluation statuses are `awaiting_approval` and `approved`. They are distinct from
`validated` automatic results. Imported feedback remains invisible to learner history
and contributes no evidence until adult approval. A D1 batch atomically acquires the
unique approval, saves the approved evaluation and inserts six evidence rows guarded
by that approval. Competing candidates cannot overwrite the winner. Repeated imports
and approvals are idempotent. Other database adapters must implement this operation
as a transaction with the same uniqueness/isolation semantics.

Source (`assisted-ai`), review status, packet ID, provider/model labels, prompt version,
server timestamp and normalized result are preserved. Provider/model labels from an
external assistant are self-reported, not authenticated. An adult must check factual
and pedagogical accuracy; JSON validation cannot establish it. Sentence reviews and
samples with `canEstimateLevel=false` cannot establish CEFR. Reviewed evidence remains
separate from deterministic diagnostic scores. Existing projection rules and evidence
history apply; no diagnostic answer is overwritten.

`/api/admin/reviews` uses the existing administrator policy, restricted to the signed-in
administrator's own account. It does not create a parent-child delegation mechanism.
Packets omit account identifiers, names, emails and free-form personal goals. Basic
redaction helps with known names, emails, links and phones; the adult must remove any
remaining identifying detail before copying. Original text stays in account storage.
The Site never sends packets to an external assistant. That interaction and the choice
of external service are the authorized adult's responsibility.

Export v1 additionally contains optional `assistedRecords: {packets, approvals}`.
Restore these together with `writingRecords`, evidence and snapshots. Map reviewer
and owner identities under trusted administration; verify every packet's submission,
evaluation reference and approval uniqueness. Never restore an unapproved candidate
as approved, or infer approvals from an imported provider's scores. Retain the original
IDs/digests and immutable payloads. Older v1 files without these sections remain valid.
`content/learner-export.schema.json` documents the additive fields/statuses. The export
recomputes profile/plan projections read-only from the ledger while preserving the
original stored state. There is still no unrestricted bulk import endpoint.

`domain/content-model.ts` defines Course → Unit → Lesson → Exercise, learning objectives,
CEFR targets, skill tags, prerequisite skills, answers/explanations and evidence rules.
`content/learning-content.json` is a portable UTF-8 JSON v1 bundle. Parent View's admin
section exports it via `/api/admin/content-export`. It maps the existing twelve weeks
and thirty-six lesson headings, with two executable existing exercises. Later lesson
content remains explicitly planned; this is not a claim of twelve fully authored units.
The existing curriculum display/workflow is preserved. The relevance practice answer
now comes from the structured content. Rubric-reviewed work cannot award CEFR directly.
No learner state or credentials are included in the content export.

A content importer should validate the `ai-english-tutor.content` format/version,
unique IDs, references, supported CEFR targets/tags, answer/rubric references and
non-negative evidence rules before staging a version. Content IDs used in learner
history must not be reassigned. Content types and `validateContent` provide the initial
contract, not an untrusted upload endpoint. Copy this JSON with the other content and
prompt files during migration. See `MILESTONE_3B.md` for validation and limitations.

### Foundation source content and attempts (previously unpublished Academic batch)

`domain/academic.ts` maps the supplied portable seed to the existing ContentBundle; the seed is not the learner data model. `application/academic-service.ts` uses AcademicRepository, with the current D1 adapter in `infrastructure/storage/d1-academic.ts`. Content is immutable per package/version/digest in `academic_packages`; `academic_attempts` has `(owner_id, learner_id, id)` keys and retains original answers, revisions and review status. No provider sessions are required.

Admin-only `/api/admin/content-import` supports dry-run, confirmation and exact JSON source export. `/api/admin/export` includes `academicRecords` in the existing portable learner export. To migrate, restore content versions before their scoped attempts; preserve IDs, parent/root references and evidence IDs, then recompute projections. Importing content never imports learner records. Migrations 0004/0005 add tables; 0005 contains one conflict-safe initial source package, not learner state. The source file remains `content/academic-seed-v1.json`. Static MP3s and exact-source manifest live under `public/foundation-audio` and `content/foundation-audio.json`; move these with the web assets. No audio-provider credentials are used.
