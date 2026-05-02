---
name: quality-release
description: Production quality, verification, and release workflow for this Expo app. Use when Codex needs to fix type or dependency drift, add tests, improve performance, configure CI, set up EAS builds, add crash reporting or analytics, or prepare this repo for a production or portfolio-ready release.
---

# Quality and Release

Treat every production-facing change as something that must be verified, measurable, and repeatable.

## Keep the repo shippable

- Run `npx tsc --noEmit` after meaningful code changes.
- Run `npx expo-doctor` after dependency or app config changes.
- Align package versions with the installed Expo SDK instead of ignoring validation output.

## Add verification before polish claims

- Add or maintain scripts for typecheck, lint, and tests.
- Prefer automated checks for reducers, hooks, service helpers, and critical app flows.
- Do not mark flows as production-ready if they only work in one manual path.

## Build release discipline

- Keep environment setup explicit for development, preview, and production.
- Use EAS build profiles when preparing distributable builds.
- Keep release steps documented and reproducible.

## Add observability with intent

- Add crash reporting for runtime failures.
- Add analytics for auth, catalog, cart, checkout, and Gemini usage.
- Instrument performance-sensitive screens before claiming optimization work is complete.

## Profile the real bottlenecks

- Check startup, list rendering, search, map interactions, and checkout flow on Android hardware.
- Debounce expensive work such as search filtering and reverse geocoding.
- Optimize image loading, list density, and unnecessary re-renders before micro-tuning.
