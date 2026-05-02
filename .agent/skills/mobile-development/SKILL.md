---
name: mobile-development
description: React Native and Expo implementation workflow for this Tazeeq codebase. Use when Codex needs to add or refactor screens, navigation, hooks, Redux state, service layers, async data flows, auth bootstrap, or production app architecture in this repo.
---

# Mobile Development

Work from the existing repo structure instead of introducing a new architecture.

## Follow the project layout

- Put reusable UI in `src/components`.
- Put screen logic in `src/screens`.
- Keep navigation contracts in `src/navigation/types.ts`.
- Keep external integrations in `src/services`.
- Keep shared app state in `src/store`.
- Put cross-screen logic in hooks before duplicating it in screens.

## Prefer typed contracts

- Use typed route props for every screen.
- Remove `any` from navigation, Redux selectors, callbacks, and component props.
- Add or extend types in `src/types/app.ts` when backend data changes.

## Treat mock data as temporary

- Do not add new product logic directly to `src/data/products.ts` unless the task is explicitly demo-only.
- Prefer service-backed repositories and selectors that can move from mock data to Firestore without rewriting screen code.

## Keep flows production-shaped

- Restore auth state on launch instead of relying only on in-memory Redux state.
- Design for loading, empty, error, and offline states on every async screen.
- Persist user preferences such as locale and theme when the task touches them.
- Keep side effects in services, hooks, or thunks instead of embedding them across multiple screens.

## Reuse project primitives

- Use `useAppTheme`, `useRTL`, `useDeviceType`, and existing common components before adding new styling patterns.
- Reuse `AppButton`, `GlassCard`, `AppHeader`, `GlobalBanner`, and existing theme tokens where they fit.

## Verify every meaningful change

- Run `npx tsc --noEmit`.
- Run `npx expo-doctor` when dependencies, native modules, or Expo config change.
- Check affected navigation paths after changing route params or stack structure.
