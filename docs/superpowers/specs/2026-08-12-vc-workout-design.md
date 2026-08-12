# VC Workout Design Specification

**Status:** Approved product and interaction design; written implementation gate

**Date:** 2026-08-12

**Mode:** Operate

**Build path:** Code-led

## 1. Product Definition

VC Workout is a private, mobile-first strength-training log for one approved user. It is optimized for fast one-handed use on Android Chrome at the gym. The primary loop is: choose a reusable routine, log completed sets with kilograms, reps, and optional RIR, finish the workout, and review history and progress.

The application is a client-rendered React SPA hosted on Netlify. Firebase Authentication provides Google sign-in and Cloud Firestore stores all user data. It does not require a custom application server.

### Success criteria

- The approved user can move from the home screen to their first set with minimal navigation.
- Previous performance, current targets, numeric entry, completion, and rest timing coexist in one focused workout screen.
- An interrupted active workout can be recovered after refresh or an accidental browser close.
- Completed history remains internally consistent when a workout is edited or deleted.
- The interface feels deliberate at 360–430px widths and remains usable with one hand.

## 2. Information Architecture

### Authentication

- `/login` contains the VC Workout identity, a short private-app explanation, and Google redirect sign-in.
- Any authenticated UID other than the configured approved UID is signed out and shown a neutral access-denied state.
- All application routes are protected independently of Firestore Security Rules.

### Primary shell

The authenticated mobile shell has four bottom destinations:

1. **Home** — resume state, start-workout action, routines, and the most recent session.
2. **Routines** — create, edit, duplicate, archive, and start reusable routines.
3. **History** — reverse-chronological completed sessions and session details.
4. **Progress** — exercise search, personal records, volume, and estimated 1RM trends.

Settings opens from the profile control. The exercise library is available from routine editing and Settings rather than consuming a fifth tab.

### Supporting routes

- Routine create and edit
- Completed workout detail and correction
- Exercise library and custom exercise editor
- Per-exercise progress detail
- Settings
- Full-screen active workout

The active-workout route replaces the primary shell. Bottom navigation is hidden to prevent accidental navigation during set logging.

## 3. Core Workflows

### First authenticated use

1. Observe Firebase authentication state and validate the UID.
2. Create the user settings document if it does not exist.
3. Idempotently seed the 36 starter exercises using stable identifiers and a catalog version.
4. Show a useful empty Home state with a direct route to create the first routine.

### Routine management

A routine has a name, optional note, and ordered exercise prescriptions. Each prescription selects an exercise and defines 1–10 target sets, a valid minimum/maximum rep range, and rest duration from 0–600 seconds. The default rest duration is 90 seconds.

Starting a routine creates a workout draft containing snapshots of the routine name, exercise names, instructions needed during the session, target sets, rep ranges, and rest settings. Later edits to the routine or exercise catalog must not rewrite active or completed sessions.

### Live workout

- If an active draft exists, Home prioritizes **Resume workout** over starting a new one.
- Each exercise shows its name, target, concise instructions, and the most recent completed performance.
- Each set row provides large controls for kilograms, reps, optional RIR, and completion.
- Tapping a value opens a numeric entry sheet with the correct mobile input mode and clear confirm/cancel actions.
- Completing a set records its completion timestamp and starts that exercise's rest timer.
- The timer derives remaining time from an absolute end timestamp so tab suspension cannot make it drift.
- The user may edit earlier sets, add or remove a set, move between exercises, or open instructions.
- Cancelling requires confirmation and removes the active cloud and local drafts without creating history.
- Finishing shows duration, completed sets, total volume, and newly achieved records before final confirmation.

### Draft recovery and conflicts

The active draft is saved to `users/{uid}/activeWorkouts/current` and mirrored to versioned browser storage. Both copies include a revision and update timestamp.

- If only one copy exists, restore it.
- If both are identical, resume normally.
- If they differ, propose the newest copy and allow the user to inspect and restore the other.
- A failed cloud write leaves the local draft intact, marks the screen as pending, and exposes retry.
- Finishing is not reported as successful until the Firestore batch commits.

### Completion, correction, and deletion

Finishing a workout uses a Firestore batch to:

1. Create the self-contained completed workout snapshot.
2. Create one deterministic performance document per exercise in that session.
3. Delete the active cloud draft.

The local active draft is removed only after the batch succeeds. Editing a completed workout rewrites its performance documents in the same atomic operation. Deleting a workout removes the session and its deterministic performance documents atomically.

## 4. Domain Model and Persistence

All data is nested beneath `users/{uid}`.

### Collections

- `settings/app` — catalog version, default rest duration, units, and timestamps.
- `exercises/{exerciseId}` — name, equipment, primary muscle, original numbered instructions, origin, archive state, and timestamps.
- `routines/{routineId}` — routine metadata and ordered exercise prescriptions.
- `activeWorkouts/current` — the sole cloud workout draft.
- `workouts/{workoutId}` — completed session snapshot with ordered exercises and sets.
- `exercisePerformances/{workoutId_exerciseId}` — derived per-session/per-exercise metrics used by progress views.

### Public domain types

- `Exercise`
- `Routine` and `RoutineExercise`
- `CompletedSet`
- `WorkoutExercise`
- `WorkoutDraft`
- `WorkoutSession`
- `ExercisePerformance`
- `UserSettings`

Firebase SDK calls must remain behind typed repository interfaces for exercises, routines, active workouts, history, progress, and settings. Route components and visual components do not import Firestore directly.

### Validation and calculations

- Kilograms are finite and non-negative.
- Completed repetitions are whole numbers greater than zero.
- RIR is absent or a whole number from 0 through 5.
- Total volume is the sum of `weightKg × reps` for completed sets.
- Estimated 1RM uses the Epley formula, `weightKg × (1 + reps / 30)`, for loaded completed sets of 1–12 reps.
- Personal records are the highest completed weight and highest eligible estimated 1RM per exercise.
- RIR is recorded but does not affect first-version analytics.

### Exercise catalog

The starter catalog contains 36 common exercises distributed across squat, hinge, horizontal push, vertical push, horizontal pull, vertical pull, unilateral legs, arms, calves, and core. Each item uses stable IDs, equipment and muscle metadata, and original 2–4-step instructions. No images, videos, external content calls, or copied MuscleWiki prose are included.

Users can add custom exercises and edit or archive their own entries. Seed upgrades add missing stable IDs without overwriting user changes.

## 5. Security and Hosting

- Google sign-in uses Firebase's redirect flow for the mobile-primary interface.
- The client checks `VITE_APPROVED_FIREBASE_UID` before entering protected routes.
- Firestore rules independently require authentication, an exact match between `request.auth.uid` and the user path, and equality with the approved UID configured in the rules source.
- Unauthorized and anonymous read/write attempts are denied even if the client route guard is bypassed.
- Firebase web configuration is supplied through Netlify environment variables. Authorization never depends on those public client values alone.
- `netlify.toml` builds with `pnpm build`, publishes `dist`, and rewrites `/*` to `/index.html` with status 200.
- Security headers must remain compatible with Firebase Auth and Firestore connections.
- The Netlify production/custom domain must be added to Firebase Authentication's authorized domains.

## 6. Visual and Interaction Direction

### Visual authority

The user-supplied mobile screenshots pin the world: a true-black canvas, quiet charcoal controls, cool periwinkle action surfaces, pale-cyan informational light, sparing warm-peach record highlights, large rounded numeric controls, and a shallow bottom bar. The product uses this language rather than copying the screenshots' banking content.

The physical scene is a user checking their phone between sets in a gym with variable light. The interface therefore uses a restrained color strategy, high contrast, short labels, tabular numerals, and light only where it communicates focus, progress, completion, or a record.

### Interaction thesis

The live workout should feel like a purpose-built training instrument, not a dashboard made from repeated cards. The dominant visual object is the current exercise and its set ledger. Previous values sit adjacent to current inputs, and the rest timer becomes the single luminous state change after set completion.

### Visual rules

- True black is the page field; charcoal separates raised controls without glass effects.
- Periwinkle owns primary actions and active focus.
- Pale cyan signals informational/rest states.
- Warm peach is reserved for records and rare meaningful milestones.
- Glow and luminous borders appear only on active, focused, pending, or record states.
- Use a system/Roboto-first sans stack and tabular numerals for weights, reps, times, and charts.
- Primary touch targets are at least 48px, with Android safe-area handling and thumb-reachable actions.
- Motion is brief and functional: set completion, timer transition, numeric sheet, route transition, and chart reveal.
- Reduced-motion preferences remove nonessential transforms and reveals.
- No light theme, glassmorphism, pervasive neon, bodybuilding imagery, gamified streaks, trophy clutter, or generic icon-card grids.

### Responsive boundary

The deliberately designed range is 360–430px wide in current Android Chrome. Modern iPhone Safari remains functional. Larger screens display a centered phone-sized application surface; there is no separate desktop information architecture in the first version.

## 7. States and Error Handling

Every major surface must include loading, empty, success, and recoverable failure states. Authentication additionally includes redirect-in-progress, denied-account, and sign-in failure states. Data screens distinguish first-use emptiness from load failure.

The active workout includes:

- clean, locally pending, saving, save-failed, finishing, and finish-failed states;
- local/cloud draft conflict resolution;
- guarded cancel and finish actions;
- recovery after refresh;
- timer continuation after tab suspension;
- clear validation at the field and attempted-action level.

Errors use plain language and a direct next action. Destructive actions identify what will be removed before confirmation.

## 8. Testing and Acceptance

### Unit tests

- Domain validation and normalization
- Routine-to-draft snapshot creation
- Volume, estimated 1RM, and record calculations
- Timer timestamp behavior
- Local/cloud draft comparison
- Derived-performance rebuild after corrections

### Component tests

- Numeric entry sheet and keyboard behavior
- Set completion and editing
- Rest-timer states
- Pending and failed save presentation
- Resume, restore, discard, and empty states
- Accessible labels, focus, and reduced motion

### Firebase Emulator tests

- Approved UID can access only its user subtree.
- Different authenticated and anonymous users are denied.
- Repository queries match required indexes.
- Finish, correction, and deletion batches keep sessions and derived performance data consistent.

### Playwright mobile flows

- Google-authenticated first run and idempotent exercise seeding
- Denied account
- Routine creation and editing
- Start, log, refresh, resume, finish, and cancel workout
- Local pending write and retry
- Historical correction and deletion
- Progress record and chart updates

### Release gate

The implementation must pass lint, typecheck, unit/component tests, Firebase Emulator tests, mobile Playwright tests, and a production build. The first production build must preserve the Impeccable direction contract in emitted markup. The UI then receives one bounded mobile/desktop screenshot review, the Impeccable detector, the shipped finish review, and final design-system documentation.

## 9. Explicit Non-Goals

- Public registration or multiple users
- Social, coaching, sharing, or subscriptions
- PWA installation or general offline browsing
- Body weight, measurements, or progress photos
- Supersets, circuits, warm-up/drop/failure set types, tempo, distance, or duration logging
- Hosted exercise imagery or video
- Data export
- Background timer notifications
- Desktop-specific layouts

## 10. Implementation Sequence

1. Commit this product record and specification, then complete the written-spec review gate.
2. Run Impeccable's required direction seed now that `PRODUCT.md` exists; the user-pinned visual world and approved product flow remain authoritative.
3. Scaffold the typed Vite/TanStack/Firebase foundation and tests.
4. Implement domain types, calculations, local draft persistence, repositories, rules, indexes, and emulator tests.
5. Implement authentication, routing, first-run seeding, and the mobile shell.
6. Implement routines, exercise library, live workout, history correction, and progress.
7. Complete the code-led visual system, motion, accessibility, and responsive containment.
8. Run the complete verification and Impeccable finish workflow, then record the shipped system in `DESIGN.md`.
