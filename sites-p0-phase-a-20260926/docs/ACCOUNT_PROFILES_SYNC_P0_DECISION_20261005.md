# Account + learner profiles + optional cloud sync — P0 decision

Date: 2026-10-05  
Status: **OWNER-DIRECTION IMPLEMENTATION PLAN — NO RUNTIME CHANGE YET**

## Product goal

Keep Self-Learning English usable for free with no account, while making it simple to support:

1. one family using one account with several learner profiles;
2. a relative or family friend using their own separate account;
3. cross-device progress sync when an account is used;
4. continued learning if cloud sync or AI is unavailable.

The local/offline learning path remains first-class. Account creation is optional.

## Owner-facing experience

### Guest / no account

- Open the site and learn immediately.
- Create one or more **local learner profiles** on that device.
- Each profile has its own progress, attempts, Error Bank, Skill Map and active course.
- No email, Google login or account is required.
- Backup / restore remains available.

### Optional account

Use **email + password** for the first account version.

- It does **not** require Gmail. Any usable email address accepted by Firebase Authentication can be used.
- Google sign-in is optional and is not required for P0.
- Password recovery uses the account email.
- A family may share one account and create multiple learner profiles.
- A relative or friend can create a separate account and keep their data separate.

Do not implement a username-only/password account in P0. Standard Firebase password authentication is email/password. A true username-only system would require a custom authentication backend and its own password recovery/security work, which conflicts with the project's free/simple goal.

Official references checked 2026-10-05:
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/auth/web/start
- https://firebase.google.com/docs/auth

## Data-minimisation rules

Account identity:
- Firebase Auth stores the sign-in email and authentication identity.
- The learning database must never need the password.
- Do not copy the account email into learner progress documents.

Learner profile:
- required: generated profile ID;
- optional: preferred name / nickname;
- optional: school grade;
- optional: learning goal and preferred session length;
- no date of birth required;
- no home address, school address, phone number or legal name required.

The public website has no public profile directory.

## Storage model

### Local remains immediate source of learning continuity

Browser-local storage / IndexedDB remains responsible for immediate save and offline continuity.

A learner action should never wait for Firestore before the learner can continue.

### Firestore becomes optional sync, not a dependency

When signed in, sync selected profile data to Cloud Firestore.

Suggested namespace:

```text
englishUsers/{uid}
  settings/account
  profiles/{profileId}
    state/current
    course/current
    evidence/{evidenceId}
    assessments/{assessmentId}
    attempts/{attemptId}
```

Academic curriculum packages remain bundled/versioned content and are **not copied per user**.

The shared G-Learning Firebase project may use one Firestore database with subject-specific namespaces. Do not create a second billable database merely to separate English and Math.

Cloud Firestore currently provides a free quota for one database per project. The application must treat that quota as a ceiling, not an invitation to enable billing. If the free quota is exhausted or Firestore is unavailable, local learning continues and the UI shows **Sync paused**.

Official reference checked 2026-10-05:
- https://firebase.google.com/docs/firestore/pricing

## Security boundary

Every cloud learner document is scoped under the authenticated Firebase UID.

Conceptual Firestore rule:

```text
match /englishUsers/{uid}/{document=**} {
  allow read, write: if request.auth != null
                     && request.auth.uid == uid;
}
```

Production rules should be more specific by collection and validate allowed fields/sizes.

App Check should protect Firestore after browser testing is complete. Firebase Authentication and App Check solve different problems: authentication identifies the account; App Check reduces abuse from unauthorized clients.

## Profile model

One authenticated account owns zero or more learner profiles.

Suggested metadata:

```ts
type LearnerProfileRecord = {
  id: string;
  preferredName: string;
  grade?: string;
  goal?: string;
  minutes?: string;
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
}
```

Do not use the preferred name as an identifier. Profile IDs are generated random IDs.

The existing repository `Scope { ownerId, learnerId }` already matches this model:
- `ownerId` -> Firebase UID when signed in, local family ID when guest;
- `learnerId` -> profile ID.

## Sync rules

1. Save locally first.
2. Debounce/batch cloud writes.
3. Each synced record carries a monotonically increasing local revision and `updatedAt`.
4. On sign-in, compare local and cloud revisions before replacing data.
5. Never silently delete one side because the other side is newer.
6. If both sides changed independently, create a recoverable conflict snapshot and ask which version to keep.
7. Sign-out does not delete local data automatically.
8. Deleting an account/profile requires an explicit confirmation and is a later feature.


## Repository readiness audit — before P0-A coding

The current code already contains part of the right abstraction, but it is **not yet safe to add a profile switcher**.

### Ready

`LearningRepository` already accepts:

```ts
type Scope = { ownerId: string; learnerId: string }
```

Browser-local learner state, evidence, assessments and snapshots already use both values in their storage keys.

### Must be changed before multiple profiles are exposed

1. **Academic attempts are owner-only**
   - `AcademicRepository.attempts/start/saveDraft/finish/approve` currently take only `owner`.
   - Browser-local academic attempt keys are owner-scoped.
   - D1 academic SQL currently hard-codes `learner_id='primary'`.
   - If a profile switcher were added now, two learners in the same family could see the same Foundation attempts.

2. **Academic service hard-codes the primary learner**
   - `academicService(..., owner)` creates its learning store with `learnerId:'primary'`.
   - It must accept a full `Scope`.

3. **Course selection is owner-only**
   - Browser and D1 course-selection repositories key by owner only.
   - Different learner profiles would therefore share the same active course.
   - Course selection must become learner-scoped.

4. **Local runtime is fixed to one learner**
   - `LOCAL_OWNER_ID='local-family'`
   - `LOCAL_LEARNER_ID='primary'`
   - P0-A needs a local profile index plus a selected profile ID.

5. **Backup/restore currently assumes the primary local learner**
   - local backup reads the fixed local owner/learner constants;
   - academic records are exported by owner only;
   - course selection is exported by owner only.
   - P0-A must make backup/restore target an explicitly selected profile and preserve profile isolation.

6. **D1 learner state required a learner-scoped replacement**
   - Historical `learner_states` is keyed only by `user_id` and cannot safely hold several learner profiles.
   - P0-A now adds `learner_profile_states(owner_id, learner_id)`.
   - Reads prefer the learner-scoped table; the historical `learner_states` row is a read-only fallback for the `primary` learner.
   - First scoped write uses copy-on-write and leaves the historical row intact, so migration is reversible.
   - A non-primary learner never reads the historical owner-only row.

### Required implementation order

Do not begin with UI.

1. Make academic attempt storage learner-scoped.
2. Make course selection learner-scoped.
3. Make academic service accept full `Scope`.
4. Make backup/restore profile-aware.
5. Add local profile index + migration of existing `primary`.
6. Add profile switcher UI.
7. Run isolation tests with two profiles.
8. Only then add Firebase Authentication and Firestore sync.

This order prevents a UI that appears to switch learners while silently mixing their work.

## First sign-in / migration

When a guest signs in for the first time:

- show existing local profiles;
- offer **Keep local only** or **Sync this profile to my account**;
- never merge multiple profiles automatically;
- assign a stable cloud profile ID when a profile is linked;
- retain a local copy so a temporary network problem does not block learning.

## UI direction

Top-right account/profile area:

```text
[ Learner avatar / nickname ▾ ]

Switch learner
----------------
Cá
Parent / Adult
+ Add learner profile
----------------
Sign in to sync   (guest)
or
Account & sync    (signed in)
```

Account screens should be small:
- Create account: email, password, confirm password.
- Sign in: email, password.
- Forgot password: email.
- No mandatory Google button.
- No mandatory account before entering the course.

## Implementation phases

### P0-A — local profiles

- introduce a profile index;
- keep the current local learner as the first migrated profile;
- add profile switcher;
- scope local state, attempts and course selection by profile;
- preserve existing backups.

No Firebase Auth or Firestore is needed for this phase.

### P0-B — optional Firebase Auth

- enable Email/Password in Firebase Console;
- add sign-up / sign-in / sign-out / reset-password UI;
- keep guest mode available;
- do not enable Google sign-in unless later requested.

### P0-C — Firestore sync

- create one free Firestore database if the shared project does not already have one;
- deploy strict `englishUsers/{uid}` rules;
- add sync repository behind a provider-independent interface;
- migrate/link selected local profiles;
- add sync status: Local only / Syncing / Synced / Sync paused / Conflict.

### P0-D — owner QA

Test:
- guest learning with no account;
- two local profiles on one device stay separated;
- create email/password account with a non-Gmail address;
- password reset email;
- link one local profile;
- cross-device restore;
- family account with two profiles;
- separate second account cannot access first account data;
- offline learning and later resync;
- Firestore/App Check unavailable -> local learning still works.

## Explicit non-goals for P0

- username-only custom authentication;
- mandatory Gmail/Google login;
- social/public profiles;
- storing passwords ourselves;
- cloud-only learning;
- paid infrastructure;
- automatic live billing upgrade;
- merging Math and English learner records without an explicit future product decision.

## Gate

Do not enable Firestore or Authentication in production until P0-A local profile isolation is implemented and verified first.


## P0-A implementation checkpoint

Implemented on branch `account-profiles-p0-20261005`:

- learner-scoped browser state;
- learner-scoped browser academic attempts;
- learner-scoped browser course selection;
- learner-scoped D1 academic attempts;
- learner-scoped D1 course selection with primary legacy fallback;
- learner-scoped D1 learner state via `learner_profile_states`;
- migration `0006_learner_profile_states` plus Drizzle snapshot/journal metadata;
- local profile index with create/select/rename;
- local runtime resolves the selected learner profile;
- export/restore and local backup target the selected learner;
- browser and D1 two-profile isolation gates.

Source-level repository audit: **PASS**.

Executable QA remains pending because GitHub-hosted Actions is currently failing before runner assignment. Profile-switcher UI remains intentionally unexposed until that gate executes successfully.
