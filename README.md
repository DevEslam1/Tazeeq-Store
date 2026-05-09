# Tazeeq Premium Shopping App 🌿✨

Tazeeq is a high-fidelity, premium grocery shopping application built with React Native and Expo. It features a sophisticated "Liquid Glass" design language—a modern evolution from its "Midnight Tech" roots—catering to both mobile and tablet users with full support for Arabic (RTL) and English (LTR) languages, as well as automatic Dark Mode.

## ✨ Key Features

### 🛍️ Premium Shopping Experience
- **Interactive Catalog:** Explore categories with high-quality imagery and product counts.
- **Dynamic Product Discovery:** Grid-based product listing with badges for "Organic", "PRIME", and "Premium Import".
- **Immersive Product Details:** Detailed descriptions, feature lists, star ratings, and quantity selectors.
- **Smart Cart:** Manage items easily with a glassmorphic cart interface and detailed price breakdown.

### 🎨 Liquid Glass Design System
- **Dynamic Theming:** Seamless automatic switching between Light and Dark modes based on system preferences with high-parity design.
- **Glassmorphism:** Elegant use of semi-transparent layers (`expo-blur`) and glass cards for a modern, airy feel.
- **Premium Loading Experience:** Replaced generic spinners with a unified, animated `HeaderProgressBar` for non-intrusive, premium visual feedback.
- **MD3 Color Palette:** A carefully curated Material Design 3 palette featuring Emerald Green, Artisanal Gold, and tailored Dark Mode desaturations.

### 🤖 Gemini AI Shopping Assistant
- **Secure AI Proxy**: Server-mediated architecture using Firebase Functions to protect API keys.
- **Catalog Grounding**: AI responses are dynamically grounded in the live product catalog for high-accuracy suggestions.
- **Recipe-to-Cart**: Ask for recipes and get ingredient suggestions available in the store.

### 🔐 Backend Integration
- **Firebase Authentication:** Secure Email/Password registration and login flows.
- **Cloud Firestore:** Real-time NoSQL database integration for storing user profiles, orders, and application data.
- **Google Maps:** Native map integration for the address picker, powered by the Google Maps API.

### 📱 Responsive & Adaptive Layout
- **Intelligent Breakpoints:** Seamlessly switches between Mobile (<768px) and Tablet (≥768px) views.
- **Adaptive Navigation:** 
  - **Mobile:** Floating glassmorphic bottom tab bar.
  - **Tablet:** Permanent sidebar navigation with expanded content areas.

### ⚡ Performance & Polish
- **High-Performance Imagery:** Utilizes `expo-image` for automatic disk caching, blurhash support, and smooth transition animations.
- **Unified Progress Feedback:** A custom Reanimated-powered progress bar docked to headers provides consistent loading states across all screens.
- **Offline-Ready Fallback:** Robust service layer that automatically switches to local JSON data if Firestore or Auth services are unreachable (ideal for emulator/unstable network environments).
- **Optimized Interactions:** Features input debouncing for search and Reanimated 3 for fluid, native-feeling gestures and transitions.

### 🌍 Localization & RTL
- **Full Bidirectional Support:** Built from the ground up to support Arabic (RTL) and English (LTR).
- **Dynamic Font Loading:** Automatically switches between **Be Vietnam Pro** (Latin) and **Cairo** (Arabic) for optimal legibility.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 50+)
- **Backend Services:** [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Navigation:** [React Navigation v6](https://reactnavigation.org/)
- **Imagery & Caching:** [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- **Localization:** [i18next](https://www.i18next.com/)
- **Icons:** [Material Community Icons](https://icons.expo.fyi/)

## 📁 Project Structure

```bash
src/
├── components/      # Atomic design components (common & commerce)
├── data/            # Mock data for initial seeding
├── hooks/           # Custom hooks (useDeviceType, useRTL, useBanner)
├── i18n/            # Internationalization config and locales
├── navigation/      # Adaptive navigators (Tab, Sidebar, Stack)
├── screens/         # Feature-based screens (Auth, Home, Catalog, etc.)
├── services/        # External services configurations (firebase.ts)
├── store/           # Redux Toolkit slices and configuration
├── theme/           # Design system tokens, Dark Mode, and ThemeProvider
└── types/           # TypeScript interface and type definitions
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase & Maps:**
   - Add your Firebase credentials to `src/services/firebase.ts`.
   - Ensure your Google Maps API key is present in `app.json`.

3. **Start the App:**
   ```bash
   npx expo start
   ```

4. **View on Devices:**
   - Scan the QR code with the **Expo Go** app on your iOS or Android device.
   - For native Firebase/Maps capabilities, build using `npx expo run:android` or `npx expo run:ios`.

---

Built with ❤️ by Antigravity for Tazeeq.
