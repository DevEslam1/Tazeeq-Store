---
name: responsive-layout
description: Adaptive mobile and tablet layout guidance for this Expo app. Use when Codex needs to adjust breakpoints, grids, navigation chrome, screen composition, spacing, or any layout that should behave differently on phones and tablets.
---

# Responsive Layout

Make tablet layouts meaningfully different, not just scaled-up mobile screens.

## Use the existing breakpoint model

- Use `useDeviceType` as the first decision point for mobile vs tablet behavior.
- Treat widths below `768` as mobile and `768+` as tablet unless the repo is intentionally updated to a new breakpoint system.

## Adapt structure, not only size

- On mobile, favor stacked content and short interaction paths.
- On tablet, use available width for split layouts, denser grids, and persistent navigation where appropriate.
- Keep primary actions visible without forcing excessive scrolling on larger screens.

## Keep navigation coherent

- Mobile patterns should align with the bottom-tab experience.
- Tablet patterns should align with sidebar or wider content layouts already used by the app.
- Audit screen transitions after changing route nesting or device-specific entry points.

## Validate list and card density

- Revisit `FlatList` column counts, item widths, and padding when changing catalog or wishlist layouts.
- Avoid awkward half-empty rows and oversized cards on tablet.
- Keep headers, filters, and search controls balanced across widths.
