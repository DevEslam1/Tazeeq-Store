---
name: Tazeeq Premium
colors:
  surface: '#f4fbf4'
  surface-dim: '#d4dcd5'
  surface-bright: '#f4fbf4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef6ee'
  surface-container: '#e8f0e9'
  surface-container-high: '#e3eae3'
  surface-container-highest: '#dde4dd'
  on-surface: '#161d19'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2b322d'
  inverse-on-surface: '#ebf3eb'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#f4fbf4'
  on-background: '#161d19'
  surface-variant: '#dde4dd'
typography:
  h1:
    fontFamily: beVietnamPro
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  h2:
    fontFamily: beVietnamPro
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-main:
    fontFamily: beVietnamPro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-secondary:
    fontFamily: beVietnamPro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  price-lg:
    fontFamily: beVietnamPro
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  label-caps:
    fontFamily: beVietnamPro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  container-padding: 20px
---

## Brand & Style

This design system is engineered to evoke an atmosphere of "Ethical Opulence." It balances the raw, organic beauty of high-end produce with the clinical precision of modern luxury software. The visual narrative centers on freshness, exclusivity, and effortless digital hospitality.

The style is a sophisticated blend of **Minimalist Luxury** and **Glassmorphism**. By utilizing a "floating window" architecture, the interface suggests weightlessness and depth, moving away from flat, static layouts toward a more tactile, 3D environment. The goal is to make the user feel as though they are browsing a curated gallery rather than a utility app. Generous white space (breathing room) is mandated to ensure that the vibrant, high-quality photography remains the focal point of the experience.

## Colors

The palette is anchored by "Emerald Vitality" (#10B981), representing the freshness of the produce, and "Deep Forest" (#064E3B) for structural authority. "Artisanal Gold" (#F59E0B) is used sparingly as a high-contrast signifier for premium tiers, organic certifications, and loyalty status.

The background uses a subtle vertical gradient to provide a sense of ground and sky, allowing the white glassmorphic cards to pop with distinct clarity. All interface colors must maintain a high contrast ratio against the light background to ensure accessibility while preserving the airy aesthetic.

## Typography

This design system utilizes **beVietnamPro** for its contemporary, approachable, yet refined character, which perfectly complements modern Arabic typefaces like Cairo or Tajawal. 

Headers are strictly "Deep Forest Green" to anchor the page hierarchy. Body text focuses on legibility with a "Dark Gray" tone that reduces eye strain. A dedicated "Price" style is defined in "Emerald Green" to ensure financial information is immediately discoverable and associated with positive value. For Arabic implementation, ensure the baseline is aligned to maintain the optical balance between the geometric Latin glyphs and the fluid Arabic script.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. On mobile, the content adheres to a 20px safe area on the left and right, with elements floating within these margins. The "Floating Window" concept requires significant vertical padding between sections (32px+) to prevent the 3D shadows from overlapping and creating visual clutter.

Spacing units are based on a 4px scale, favoring larger increments (16px, 24px) to reinforce the luxury feel of "generous space." Products are arranged in a staggered or consistent grid depending on the category, but always contained within the 20px-radius floating cards.

## Elevation & Depth

Hierarchy is established through **Chromatic Depth**. Rather than traditional neutral shadows, this design system uses "Tinted Ambient Shadows" — a soft, 30px blur using #10B981 at 15% opacity. This creates a subtle green glow beneath cards, making them appear as if they are hovering over a luminous surface.

Glassmorphism is applied to headers and navigation bars:
- **Fill:** #FFFFFF at 8% to 15% opacity.
- **Backdrop Blur:** 12px to 20px.
- **Border:** 1px solid white at 20% opacity to define the edges of the "glass" without adding visual weight.

## Shapes

The shape language is defined by "The Soft Edge." A consistent 20px radius is applied to all primary containers and product cards to create a friendly, organic silhouette. Secondary interactive elements, such as buttons and input fields, use a slightly tighter 12px radius to maintain a distinction between "containers" and "actions." Icons should follow a "rounded-line" style, avoiding sharp terminals to match the container architecture.

## Components

### Buttons
Primary buttons are solid Emerald Green with white text and a 12px corner radius. They feature the signature emerald drop shadow to emphasize interactivity. Secondary buttons use a white glassmorphic fill with an Emerald Green border.

### Product Cards
The centerpiece of the UI. Each card must have a 20px radius, a white 8% translucent fill, and a backdrop blur. Images must be high-resolution, isolated produce or lifestyle shots with natural lighting. Prices are always bottom-aligned and bold.

### Premium Badges
Small, pill-shaped indicators using the Gold (#F59E0B) fill. These are used for "Organic," "Premium Import," or "Tazeeq Choice" labels. Text inside badges should be white or Deep Forest Green for maximum legibility.

### Input Fields
Soft, floating fields with a subtle 1px border. On focus, the border transitions to Emerald Green and the shadow intensity increases slightly.

### Navigation Bar
A floating glassmorphic bar at the bottom or top of the screen with a 20px blur. Active states are indicated by Emerald Green icons and a small 4px dot below the icon.