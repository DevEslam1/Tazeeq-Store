---
name: Responsive & Tablet Layout
description: Guidelines for the useDeviceType hook and adaptive component patterns.
---

# Responsive & Tablet Layout Skill

This skill ensures the Tazeeq app provides a premium experience on both mobile and tablet devices.

## 📱 Breakpoints
- **Mobile:** `< 768px` width.
- **Tablet:** `≥ 768px` width.

## 🛠️ useDeviceType Hook
- Use this hook to determine the current device type and window dimensions.
- Returns `{ isTablet, isMobile, width, height }`.

## 🗺️ Adaptive Navigation
- **Mobile:** Uses a bottom tab bar for primary navigation.
- **Tablet:** Uses a fixed sidebar on the left.

## 🍱 Component Adaptation
- **Grids:**
  - Mobile: 2 columns for products, 3 for categories.
  - Tablet: 4-5 columns for products, 5-6 for categories.
- **Layouts:**
  - Mobile: Vertical stacking of elements.
  - Tablet: Utilize horizontal space with side-by-side sections (e.g., image on left, details on right in Product Detail).

## 📐 Scaling
- Elements shouldn't just get bigger on tablet; they should utilize the extra space to show more content or better organized layouts.
