---
name: RTL & Internationalization
description: Guidelines for bidirectional layout using I18nManager and react-i18next patterns.
---

# RTL & Internationalization Skill

This skill provides guidelines for building apps that support both Arabic (RTL) and English (LTR) seamlessly.

## 🌍 i18n Configuration
- Use `react-i18next` for managing translations.
- Store translation JSON files in `src/i18n/locales/ar.json` and `src/i18n/locales/en.json`.
- Use the `useTranslation` hook for all user-facing strings.

## ↔️ RTL Layout Rules
- **Logical Properties:** Always use logical properties where possible. However, React Native doesn't support all of them yet. Use the `useRTL` hook to conditionally apply styles.
- **Direction-Aware Styles:**
  - Instead of `paddingLeft`, use the `useRTL` hook to decide if it should be `paddingLeft` or `paddingRight` for directional intent, or use `paddingStart` and `paddingEnd`.
  - Use `flexDirection: isRTL ? 'row-reverse' : 'row'` for horizontal layouts that need to flip.
- **Text Alignment:** Use `textAlign: isRTL ? 'right' : 'left'` or the platform-specific `textAlign: 'auto'`.
- **Icons:** Some icons need to be flipped in RTL (e.g., arrows, progression indicators). Check `isRTL` to apply a `transform: [{ scaleX: -1 }]`.

## 🔤 Font Handling
- Apply the correct font family based on the active locale.
- `en` -> Be Vietnam Pro
- `ar` -> Cairo or Tajawal
- Ensure baseline alignment is checked when mixing scripts.

## 🛠️ Implementation Patterns
- Use `I18nManager.forceRTL(true)` when switching to Arabic and reload the app if necessary (Expo handles this better with some plugins or custom logic).
- Use `useRTL` hook:
  ```typescript
  const { isRTL, flexRow, textAlign } = useRTL();
  ```
