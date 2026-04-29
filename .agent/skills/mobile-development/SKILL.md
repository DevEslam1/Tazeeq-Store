---
name: Mobile App Development
description: Guidelines and best practices for React Native, Expo, and UI/UX design focusing on high-quality shop applications.
---

# Mobile App Development Skill

This skill provides a set of protocols and guidelines to follow when building or maintaining mobile applications using React Native and Expo.

## 📱 React Native & Layout
- **Responsive Design:** Use a combination of flexbox, percentage-based dimensions, and the `useDeviceType` hook to ensure the layout adapts to various screen sizes.
- **Layout Consistency:** Maintain consistent spacing using a standardized spacing scale defined in `src/theme/tokens/spacing.ts`.
- **RTL Support:** Always use logical properties or the `useRTL` hook to handle bidirectional layouts.

## 🚀 Expo Project Structure
- Follow a modular project structure:
  - `src/components`: Reusable UI components.
    - `common`: Atomic, non-business specific components.
    - `commerce`: Components related to the shopping domain.
  - `src/screens`: Individual screen components. Each screen should handle both mobile and tablet views.
  - `src/navigation`: Navigation configuration and types.
  - `src/theme`: Theme definitions and semantic tokens.
  - `src/store`: State management (Redux Toolkit).
  - `src/hooks`: Custom React hooks.
  - `src/utils`: Helper functions.
  - `src/i18n`: Internationalization configuration and translations.

## ⌨️ TypeScript Strict Typing
- Use `strict: true` in `tsconfig.json`.
- Avoid `any`. Define interfaces and types for all props, state, and API responses in `src/types`.
- Use discriminated unions for complex state models.

## 🎨 Design System
- **Tokens:** Strictly adhere to the tokens defined in `src/theme/tokens`.
- **Glassmorphism:** Use the `GlassCard` component and `glassmorphic` elevation for a premium look.
- **Typography:** Use the `typography` tokens and ensure font families are applied correctly for both Arabic and English.

## 🧩 Component Design System
- Build atomic, reusable components.
- Components should be direction-aware and responsive.

## 🛒 State Modeling
- Use Redux Toolkit for managing global state like `cart`, `wishlist`, `orders`, and `auth`.
- Keep state normalized where possible.

## 🔄 UX States
- Always handle and design for Loading, Empty, Error, and Offline states.

## ♿ Accessibility
- Ensure touch targets are at least 44x44dp.
- Maintain high contrast and support system font scaling.
