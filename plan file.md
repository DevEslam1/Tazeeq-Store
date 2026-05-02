# Tazeeq Production Plan

Updated: 2026-04-30

Purpose: turn the current Expo app into a real production-grade mobile product that is strong enough for a CV/portfolio case study, while also creating a safe and maintainable path for Gemini integration.

## Current repo audit

This is what is already confirmed in the codebase today:

- `npx tsc --noEmit` fails because `SettingsScreen` reads `isDark`, but the theme context only exposes `mode`.
- `npx expo-doctor` reports an Expo package mismatch: `react-native-maps` is behind the version expected by Expo SDK 55.
- Most commerce flows still depend on `src/data/products.ts`; `src/services/productService.ts` exists but is not actually driving the storefront.
- Email auth is real, but phone OTP is mocked and guest login is only anonymous auth without a real product flow around it.
- Locale and RTL behavior are inconsistent:
  - `src/i18n/index.ts` forces Arabic at startup.
  - `ThemeProvider` changes local state but does not call `i18n.changeLanguage(...)`.
  - `useRTL()` always returns `row`, so direction handling is partially hardcoded.
- Google Maps and Firebase credentials are hardcoded in app code and app config.
- Navigation is weakly typed because many screens and helpers use `any`, which allows route mistakes to slip through.
- Some navigation calls already look unsafe, for example `HomeScreen` pushes `ProductList` without the required `categoryId`.
- Cart, orders, wishlist, and search are mostly local/demo logic, not durable backend-driven product flows.
- There is no lint setup, no test suite, no CI pipeline, no crash reporting, no analytics, no release automation, and no environment strategy.
- There is no Gemini integration in the repo yet, so AI support is a new feature track, not a small bug fix.

## Target outcome

The finished app should be:

- stable enough to ship to Android production builds
- backed by real catalog, user, address, and order data
- secure in how it handles keys, auth, and backend access
- measurable with logs, analytics, and crash reporting
- tested with basic automated coverage and release checks
- polished enough to present as a portfolio project with a clear architecture story

## Gemini note

As of 2026-04-30, Google's official model docs list:

- `gemini-3-flash` as a preview-class target
- `gemini-2.5-flash` as the stable production-friendly fallback

For production, do not hardcode a preview-only model into the client. Start with a server-controlled model selector:

- staging/experiments: `gemini-3-flash`
- production default: `gemini-2.5-flash`

If Google promotes Gemini 3 Flash to stable later, the backend selector can switch without a mobile release.

## Execution order

### Phase 0: Stabilize the app shell

Priority: immediate

Goals:

- fix all current TypeScript errors
- align Expo package versions with SDK 55
- remove obvious runtime route bugs
- stop hardcoded direction/theme state from fighting each other

Tasks:

- Fix `SettingsScreen` to use `mode === 'dark'` or expose a proper `isDark` field from theme context.
- Replace `any` navigation props with typed stack/tab props.
- Audit all `navigation.navigate(...)` calls against `src/navigation/types.ts`.
- Fix bad route payloads such as `ProductList` calls without `categoryId`.
- Upgrade `react-native-maps` to the Expo-compatible version.
- Add a `typecheck` script and make it mandatory before commits.

Definition of done:

- `npx tsc --noEmit` passes
- `npx expo-doctor` passes cleanly
- core navigation no longer depends on untyped route guesses

### Phase 1: Fix state, locale, and auth foundations

Priority: critical

Goals:

- make language switching real
- make auth session hydration real
- stop local UI state from diverging from app state

Tasks:

- Move locale/theme preferences into persisted storage.
- Wire `setLocale(...)` to `i18n.changeLanguage(...)`.
- Stop forcing RTL globally regardless of selected language.
- Add `onAuthStateChanged(...)` bootstrap logic so the app restores the signed-in session on launch.
- Normalize guest mode: either keep it as an explicit limited mode or remove it.
- Replace mocked phone login with either:
  - real Firebase phone auth, or
  - email-only auth until phone auth is fully supported

Definition of done:

- app reopens in the correct theme and language
- English mode is truly LTR
- login state survives app restart
- no auth path is fake in production builds

### Phase 2: Replace demo catalog logic with a real data layer

Priority: critical

Goals:

- remove `products.ts` as the source of truth
- make catalog, pricing, stock, and search backend-driven

Tasks:

- Create a proper repository layer for products, categories, inventory, featured items, and promotions.
- Decide the backend source:
  - Firebase Firestore only, if scope stays moderate
  - or a dedicated API if future scale or admin workflows justify it
- Replace direct imports from `src/data/products.ts` across cart, wishlist, home, product detail, search, and checkout flows.
- Add loading, empty, offline, and retry states to product screens.
- Seed Firestore with realistic production sample data.
- Add indexes and query-friendly document shapes for category and search use cases.

Definition of done:

- product list, detail, cart totals, and search use live data
- deleting `src/data/products.ts` would not break the app

### Phase 3: Make checkout and orders real

Priority: critical

Goals:

- turn the app from a storefront demo into an actual commerce flow

Tasks:

- Persist addresses in backend per user.
- Replace hardcoded geocoding key usage with a secured server-side or restricted client-safe approach.
- Debounce reverse geocoding from the map screen to avoid quota waste.
- Add delivery slots, order creation, order history, and order tracking models.
- Connect checkout to a real payment provider or build a payment-ready abstraction if real payments are out of scope for the portfolio version.
- Make reorder, cancel, and status updates backend-driven.

Definition of done:

- a real user can add address, place an order, and see it again later
- order total and status are derived from persistent data, not local guesses

### Phase 4: Add Gemini safely

Priority: high

Goals:

- add a useful AI feature
- keep API keys out of the app
- make model switching safe and maintainable

Recommended architecture:

- mobile app -> authenticated backend endpoint -> Gemini API

Do not:

- call Gemini directly from React Native with an embedded API key
- bind the mobile app permanently to a preview model name

Backend tasks:

- Create a small server layer using Firebase Functions, Cloud Run, or another managed backend.
- Store Gemini credentials server-side only.
- Add request validation, auth checks, rate limiting, timeout control, and logging.
- Support backend-controlled model routing:
  - production default: `gemini-2.5-flash`
  - preview flag: `gemini-3-flash`

Product feature options:

- shopping assistant for finding products by intent
- smart search rewrite and query expansion
- recipe-to-cart flow
- product substitution suggestions
- order help / FAQ assistant

Technical tasks:

- return structured JSON from Gemini where possible
- log prompt version, model, latency, and error class
- add fallback behavior when AI is unavailable
- keep AI responses grounded in live catalog data, not freeform hallucinated inventory

Definition of done:

- Gemini can be turned on and off with a backend flag
- no AI secret lives in the client
- model upgrades do not require rewriting app UI code

### Phase 5: Performance optimization

Priority: high

Goals:

- reduce re-renders, startup delay, unnecessary network calls, and slow list rendering

Tasks:

- Profile startup, home screen, product list, cart, and map flows on a mid-range Android device.
- Optimize image loading and caching.
- Replace expensive list rendering with a more scalable list strategy if profiling justifies it.
- Remove avoidable repeated work in screens like `HomeScreen` and `SearchScreen`.
- Add debouncing to search input and map geocoding.
- Lazy-load heavy screens and non-critical features where possible.
- Review global overlays, blur effects, and animations on low-end devices.

Definition of done:

- app startup is noticeably faster
- scrolling stays smooth on catalog screens
- search and map flows do not spam work on each minor change

### Phase 6: Security, reliability, and observability

Priority: high

Goals:

- make the app diagnosable and safe enough for real users

Tasks:

- Move public config to an environment strategy:
  - `EXPO_PUBLIC_...` only for truly public values
  - secrets in EAS secrets or backend config
- Add Firebase security rules for users, addresses, and orders.
- Add error boundaries and centralized error handling.
- Add crash reporting such as Sentry.
- Add analytics for key flows:
  - signup
  - add to cart
  - checkout start
  - order placed
  - Gemini usage
- Define permission prompts and privacy copy for location usage.

Definition of done:

- production crashes are visible
- backend data access is locked down by rules
- app behavior can be measured after release

### Phase 7: Tooling, tests, and release pipeline

Priority: high

Goals:

- make changes safe to ship repeatedly

Tasks:

- Add ESLint and Prettier.
- Add scripts for `typecheck`, `lint`, and `test`.
- Add unit tests for reducers, hooks, and formatting helpers.
- Add integration/UI tests for auth, cart, checkout, and settings flows.
- Add a CI pipeline to run:
  - install
  - typecheck
  - lint
  - tests
  - expo doctor
- Add EAS build profiles for development, preview, and production.
- Document signing, release commands, and environment setup in the repo.

Definition of done:

- every PR has automated checks
- preview builds can be generated consistently
- production release steps are documented and repeatable

### Phase 8: CV and portfolio polish

Priority: medium, but important

Goals:

- turn the project into a strong hiring artifact, not just a code repo

Tasks:

- Rename leftover generic project metadata such as `shop-desing-plan`.
- Clean README and rewrite it as a real case study.
- Add architecture diagrams and feature screenshots.
- Record a short demo showing auth, browsing, cart, checkout, and Gemini assistant usage.
- Add a seeded demo environment with stable credentials and sample data.
- Write a short engineering summary:
  - architecture choices
  - performance improvements
  - security work
  - AI integration strategy
  - measurable before/after outcomes

Definition of done:

- the repo can be shared with recruiters
- the project tells a strong product + engineering story in under 5 minutes

## Suggested first sprint

If execution starts now, the highest-value first sprint is:

1. fix type errors and route contracts
2. align Expo dependencies
3. remove hardcoded secrets from app code
4. make auth bootstrap and locale switching real
5. migrate one end-to-end vertical slice from mock data to Firestore:
   - home
   - product list
   - product detail
   - cart total

That sprint will convert the app from "nice UI demo" into "credible production foundation".

## Recommended success metrics

Track these during the production push:

- zero TypeScript errors
- zero Expo doctor mismatches
- crash-free session rate
- app startup time on Android
- product list scroll performance
- successful signup rate
- checkout completion rate
- Gemini success rate, latency, and fallback rate

## Final recommendation

Do not start by building Gemini first.

The correct order is:

1. stabilize the app shell
2. replace demo data and fake flows
3. secure the backend and release process
4. then add Gemini on top of a real product foundation

That order will produce a much stronger app for both production use and CV value.
