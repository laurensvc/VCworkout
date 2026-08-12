# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React and TypeScript on Vite, using TanStack Router, TanStack Query, and Tailwind CSS. The production frontend is hosted on Netlify. Firebase Authentication provides Google sign-in and Cloud Firestore stores application data.

## Users

VC Workout is initially for one approved user. They use an Android phone at the gym and need to record strength-training sets quickly, often one-handed and between exercises.

## Product Purpose

VC Workout makes reusable strength routines easy to start, complete, and review. Success means the user can log kilograms, reps, and optional reps in reserve with very little friction, recover an interrupted workout, and understand progress from reliable history and basic trends.

## Positioning

VC Workout is a private, routine-first training log whose live set entry keeps prior performance, the current target, and the rest timer in one focused mobile flow.

## Operating Context

- The user selects a saved routine, adjusts it during the session, and saves an independent completed-workout snapshot.
- The live workout is used in a gym, under variable lighting, with short attention windows and intermittent connectivity.
- Previous values and large numeric controls reduce typing and memory demands.
- Completed sessions feed history, exercise trends, estimated one-rep max, volume, and personal records.

## Capabilities and Constraints

- English-only and kilograms-only in the first version.
- One approved Google account; there is no public registration or invite flow.
- Reusable routines, a starter exercise library, custom exercises, concise original text instructions, live set logging, a rest timer, workout history, historical corrections, and useful progress basics are included.
- Sets record kilograms, whole-number reps, optional RIR from 0 to 5, completion state, and completion time.
- An active workout is stored in Firestore and mirrored locally for refresh and accidental-close recovery. This recovery mechanism is not a commitment to general offline support.
- The primary target is current Android Chrome at phone widths. Larger screens contain the phone-sized interface rather than introducing a desktop product.
- Netlify hosts the SPA. Firebase Authentication and Firestore provide identity and persistence.
- Body tracking, advanced set types, supersets, hosted exercise media, exports, subscriptions, multi-user collaboration, PWA installation, and general offline mode are outside the first version.

## Brand Commitments

- The visible product name is **VC Workout**.
- The app is dark-only and code-led.
- User-supplied reference screenshots establish a true-black mobile interface with charcoal controls, restrained cool periwinkle and pale-cyan illumination, sparing warm-peach highlights, large rounded controls, and shallow bottom navigation.
- Glow communicates an active or meaningful state; it is not decorative chrome applied to every surface.
- The product must not use gamified streaks, trophy clutter, bodybuilding imagery, glassmorphism, or pervasive neon.

## Evidence on Hand

- Two user-supplied mobile banking interface screenshots in the originating Codex task are the visual reference. They are inspiration for hierarchy, contrast, touch targets, color restraint, and navigation—not for product content.
- MuscleWiki was identified as a reference for short numbered exercise-instruction structure. VC Workout will use original text and will not depend on or copy MuscleWiki content or its API.
- There are no testimonials, commercial claims, benchmarks, production usage data, logos, or licensed media assets to fabricate.

## Product Principles

1. Make set logging faster than recalling or writing the same information elsewhere.
2. Protect an in-progress workout before adding broader platform features.
3. Let light, color, and motion communicate state rather than decoration.
4. Keep historical calculations reproducible and consistent after corrections.
5. Prefer a focused private tool over speculative multi-user complexity.

## Accessibility & Inclusion

The interface uses semantic controls, visible focus states, high contrast, at least 48-pixel primary touch targets, safe-area handling, reduced-motion support, and labels that do not rely on color alone. Current Android Chrome is primary, while modern iPhone Safari remains functionally usable.
