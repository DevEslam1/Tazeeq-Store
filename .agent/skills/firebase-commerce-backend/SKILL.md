---
name: firebase-commerce-backend
description: Firebase and backend workflow for turning this storefront into a production app. Use when Codex needs to implement or refactor Firebase auth, Firestore product data, user profiles, addresses, orders, security rules, Cloud Functions, environment handling, or server-side app integrations.
---

# Firebase Commerce Backend

Treat Firebase as product infrastructure, not a demo data dump.

## Keep the client thin

- Keep public Firebase app configuration in the mobile client only if it is intended to be public.
- Keep privileged operations, secrets, third-party webhooks, Gemini calls, and quota-sensitive integrations on the server side.
- Move hardcoded secrets and operational keys out of source files when touching configuration.

## Shape data around product flows

- Model products, categories, users, addresses, carts, and orders as persistent entities.
- Prefer stable IDs and typed document shapes that match `src/types/app.ts`.
- Add repository helpers in `src/services` so screens do not talk to Firestore directly in many places.

## Keep auth and user bootstrap coherent

- Restore session state from Firebase auth on app launch.
- Keep Redux user state derived from authenticated Firebase state instead of manual screen-only assumptions.
- If phone auth is not fully real, do not leave a fake production flow in place.

## Protect data access

- Add or update Firestore security rules whenever new collections or write paths are introduced.
- Scope user-owned data such as addresses and orders to the authenticated user.
- Validate server inputs before writing order totals, statuses, or privileged fields.

## Prefer server functions for privileged work

- Use Cloud Functions or another server layer for order orchestration, geocoding proxies, notifications, payment callbacks, and AI access.
- Return normalized app-shaped responses so mobile screens do not depend on provider-specific payloads.
