---
name: gemini-integration
description: Safe Gemini integration workflow for this mobile commerce app. Use when Codex needs to add AI features such as shopping assistant, smart search, recipe-to-cart, substitutions, or support chat, or when Codex needs to choose models, design prompts, structure outputs, or route Gemini calls through backend services.
---

# Gemini Integration

Integrate Gemini as a backend capability, not as a raw client-side SDK secret.

## Use a server-mediated architecture

- Route requests as `mobile app -> authenticated backend endpoint -> Gemini`.
- Keep Gemini API keys and model routing on the server side only.
- Do not hardcode preview-only model IDs into the mobile app UI logic.

## Use model routing intentionally

- Use `gemini-2.5-flash` as the safe production default unless product requirements clearly need a newer preview model.
- Use `gemini-3-flash` behind a server-side flag for experiments or staging flows.
- Keep model selection configurable without requiring a mobile release.

## Ground AI in real catalog data

- Provide live product, category, inventory, and pricing context from backend data.
- Do not let the model invent products or availability.
- Prefer structured JSON outputs for search rewrites, recommendations, substitutions, and cart actions.

## Control risk and cost

- Add auth checks, rate limits, timeouts, and request logging on the backend.
- Handle AI unavailability with a clear fallback path in the app.
- Record model, latency, prompt version, and failure class for observability.

## Fit AI to product workflows

- Keep prompts task-specific and commerce-oriented.
- Favor features that map cleanly to app actions such as search suggestions, substitutions, recipe ingredient matching, or FAQ answers.
- Separate experimentation prompts from stable production prompts.
