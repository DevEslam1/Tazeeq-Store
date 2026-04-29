# Tazeeq Premium Shopping App 🌿✨

Tazeeq is a high-fidelity, premium grocery shopping application built with React Native and Expo. It features a sophisticated "Ethical Opulence" design language, catering to both mobile and tablet users with full support for Arabic (RTL) and English (LTR) languages.

## ✨ Key Features

### 🛍️ Premium Shopping Experience
- **Interactive Catalog:** Explore categories with high-quality imagery and product counts.
- **Dynamic Product Discovery:** Grid-based product listing with badges for "Organic", "PRIME", and "Premium Import".
- **Immersive Product Details:** Detailed descriptions, feature lists, star ratings, and quantity selectors.
- **Smart Cart:** Manage items easily with a glassmorphic cart interface and detailed price breakdown.

### 🎨 Ethical Opulence Design System
- **Glassmorphism:** Elegant use of semi-transparent layers and backdrop blurs for a modern, airy feel.
- **Tinted Ambient Shadows:** Subtle emerald-green glows that create a "luminous" hovering effect for cards and headers.
- **Soft Edge Language:** Consistent 20px corner radius across all primary UI containers.
- **MD3 Color Palette:** A carefully curated Material Design 3 palette featuring Emerald Green and Artisanal Gold.

### 📱 Responsive & Adaptive Layout
- **Intelligent Breakpoints:** Seamlessly switches between Mobile (<768px) and Tablet (≥768px) views.
- **Adaptive Navigation:** 
  - **Mobile:** Floating glassmorphic bottom tab bar.
  - **Tablet:** Permanent sidebar navigation with expanded content areas.
- **Optimized Grids:** Automatic column adjustment for product and category grids based on screen size.

### 🌍 Localization & RTL
- **Full Bidirectional Support:** Built from the ground up to support Arabic (RTL) and English (LTR).
- **Dynamic Font Loading:** Automatically switches between **Be Vietnam Pro** (Latin) and **Cairo** (Arabic) for optimal legibility.
- **i18n Ready:** Fully translated interface managed via `react-i18next`.

### 🚀 Technical Excellence
- **Redux Toolkit:** Robust state management for Cart, Authentication, and Locale.
- **Type Safety:** 100% TypeScript implementation with strict typing.
- **Modular Architecture:** Atomic component design for maximum reusability and maintainability.
- **Expo Ecosystem:** Utilizing Expo's latest features for Blur effects, Linear Gradients, and Font management.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Navigation:** [React Navigation v6](https://reactnavigation.org/)
- **Localization:** [i18next](https://www.i18next.com/)
- **Styling:** React Native StyleSheet with custom Design Tokens
- **Icons:** [Material Community Icons](https://icons.expo.fyi/)
- **Typography:** Be Vietnam Pro & Cairo (Google Fonts)

## 📁 Project Structure

```bash
src/
├── components/      # Atomic design components (common & commerce)
├── data/            # Mock data for products, categories, and orders
├── hooks/           # Custom hooks (useDeviceType, useRTL)
├── i18n/            # Internationalization config and locales
├── navigation/      # Adaptive navigators (Tab, Sidebar, Stack)
├── screens/         # Feature-based screens (Home, Catalog, Cart, etc.)
├── store/           # Redux Toolkit slices and configuration
├── theme/           # Design system tokens and ThemeProvider
└── types/           # TypeScript interface and type definitions
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the App:**
   ```bash
   npx expo start
   ```

3. **View on Devices:**
   - Scan the QR code with the **Expo Go** app on your iOS or Android device.
   - For Tablet view, run in an iPad or Android Tablet emulator.

---

Built with ❤️ by Antigravity for Tazeeq.
