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
