---
name: rtl-i18n
description: Arabic and English localization guidance for this React Native app. Use when Codex needs to add translations, switch locale, handle RTL or LTR layout, update fonts, fix direction-aware icons, or refactor theme and i18n behavior tied to language.
---

# RTL and I18n

Support Arabic and English as real first-class modes.

## Keep strings out of components

- Put user-facing copy in `src/i18n/locales/ar.json` and `src/i18n/locales/en.json`.
- Use `useTranslation()` for labels, empty states, buttons, and errors.
- When adding a new key, update both locale files in the same change.

## Make locale switching real

- Call `i18n.changeLanguage(...)` when locale changes.
- Keep selected locale in persisted app state if the task touches settings or bootstrap behavior.
- Do not force Arabic at startup if the selected locale is English.

## Make direction explicit where needed

- Use `paddingStart` and `paddingEnd` where practical.
- Use `flexDirection: isRTL ? 'row-reverse' : 'row'` only for layouts that truly need to mirror.
- Use `textAlign: isRTL ? 'right' : 'left'` for directional text blocks.
- Mirror arrows, progress chevrons, and directional affordances when the icon itself implies direction.

## Keep typography script-aware

- Use the existing Arabic and Latin font setup from app bootstrap and theme primitives.
- Check mixed-language screens for clipping, line-height issues, and baseline mismatch.
- Avoid hardcoding one language's font on shared components unless that component is language-specific.
