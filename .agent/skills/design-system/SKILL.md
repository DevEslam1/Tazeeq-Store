---
name: design-system
description: Tazeeq visual system guidance for tokens, theming, glassmorphism, and reusable commerce UI. Use when Codex needs to change colors, typography, spacing, elevation, shared components, banners, cards, or any UI that should stay consistent with the existing premium storefront look.
---

# Design System

Preserve the existing visual language unless the task explicitly asks for a redesign.

## Use the token source of truth

- Read from `src/theme/tokens` before inventing colors, spacing, radius, or typography values.
- Update tokens or shared theme objects when a value should be reused in more than one place.
- Keep light and dark behavior aligned through `src/theme/themes.ts` and related token files.

## Respect the current product style

- Keep the premium grocery identity: clean surfaces, restrained glass effects, and clear hierarchy.
- Use `GlassCard` and shared elevation styles instead of repeating blur and transparency values inline.
- Keep CTA hierarchy obvious: primary actions should still read as primary across screens.

## Build reusable UI, not one-off styling

- Promote repeated layout or visual patterns into `src/components/common` or `src/components/commerce`.
- Keep product cards, badges, price presentation, and banners visually consistent with existing components.
- Prefer semantic names over screen-specific names when extracting shared UI.

## Avoid visual drift

- Do not mix ad hoc font families, random opacities, or untracked hex values into screens.
- Do not let dark mode styling fork into separate one-off implementations.
- If a screen needs a new pattern, define the pattern once and reuse it.
