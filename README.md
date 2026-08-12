# VC Workout

A private, mobile-first strength-training log built with React, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, Firebase, and Netlify.

## Local development

Requirements: Node.js 24 and pnpm 10.

```bash
pnpm install
pnpm dev
```

When Firebase variables are absent, development uses a clearly labelled local preview repository in browser storage. Production never enables this fallback.

## Firebase setup

1. Create a Firebase project and web application.
2. Enable Google as an Authentication provider.
3. Create a Cloud Firestore database.
4. Copy `.env.example` to `.env.local` and add the Firebase web values.
5. Sign in once or locate the intended account in Firebase Authentication, then set `VITE_APPROVED_FIREBASE_UID` to its UID.
6. Replace `REPLACE_WITH_APPROVED_UID` in `firestore.rules` with the same UID. The placeholder intentionally denies all production access until replaced.
7. Add the Netlify production/custom domain to Firebase Authentication's authorized domains.
8. Test and deploy the rules and indexes:

```bash
pnpm test:rules
pnpm exec firebase deploy --only firestore:rules,firestore:indexes
```

The rules test uses the Firebase Emulator Suite and requires Java on the local PATH.

## Netlify setup

Import this repository into Netlify. `netlify.toml` supplies the build command (`pnpm build`), publish directory (`dist`), SPA rewrite, asset caching, and baseline security headers.

Add every value from `.env.example` in Netlify project environment variables. Firebase web configuration is public client configuration; authorization is enforced independently by the exact-UID Firestore rule.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:rules
pnpm test:e2e
pnpm build
```

Install Playwright Chromium once with `pnpm exec playwright install chromium` if it is not already present.

## Product documentation

- `PRODUCT.md` records durable product truth and constraints.
- `docs/superpowers/specs/2026-08-12-vc-workout-design.md` records the approved implementation design.
- `DESIGN.md` records the shipped visual system after the finish review.
