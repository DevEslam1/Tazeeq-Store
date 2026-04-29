# Design-to-App Alignment: stitch_tazaj_premium_ui_design

After a pixel-level audit comparing every design reference image against the current codebase, I've identified **40+ discrepancies** across 11 screens. Below is the full plan organized by component/screen priority.

---

## User Review Required

> [!IMPORTANT]
> **Section order in Home Screen:** The design (`tazeeq_premium_home/screen.png`) shows `Promo Banner → Categories → Best Sellers`, but the current code renders `Categories → Promo Banner → Best Sellers`. The other home design (`home/screen.png`) shows `Categories → Promo Banner → Best Sellers`. **Which order do you prefer?**

> [!IMPORTANT]
> **Header style:** The `home/screen.png` design uses **"Tazeeq"** (English) centered with a search icon + cart icon. The `tazeeq_premium_home/screen.png` design shows **"طازج"** (Arabic) with a hamburger menu + notification bell + cart. **Which header style should we use?** The current code uses "Tazeeq" + shopping icon + search icon, closest to `home/screen.png`.

> [!WARNING]
> **Product images:** Many product card images in `product_list/screen.png` appear as dark/broken placeholders. The app currently uses Unsplash URLs, which is correct. I'll ensure all image URLs are valid and that we add proper fallback/error handling.

---

## Open Questions

> [!IMPORTANT]
> **Navigation tab naming:** Design shows **Shop • Organic • Orders • Account** (matching current code), but `tazeeq_premium_home` shows **HOME • CATEGORIES • PROFILE**. Which navigation scheme should we follow?

> [!IMPORTANT]
> **Cart Screen Access:** The design shows cart accessed from the header icon (not from a tab). Currently there's no direct navigation from AppHeader to CartScreen. Should the cart icon in the header navigate to Cart?

---

## Proposed Changes

### Phase 1: Foundation — Theme Tokens & Core Components

These are the building blocks used everywhere. Fixing them first cascades fixes across all screens.

---

#### [MODIFY] [AppHeader.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/common/AppHeader.tsx)

**Design vs Code discrepancies:**
1. **Design** shows the header as a GlassCard with rounded bottom corners, contained within the 20px safe area margins — like a "floating window" card. **Code** uses a `position: absolute` full-bleed BlurView with `borderBottomLeftRadius: 32`.
2. **Design** header has the `Tazeeq` logo centered, search icon on the right, cart on the left. **Code** matches structurally but the visual appearance differs:
   - The header should float inside the 20px margin (not full-bleed)
   - Search bar below should have a subtle rounded-rectangle shape matching the glass container
3. **Design** header sits on top of the minty `#f4fbf4` background and has a clear glassmorphic border. **Code** has the glass effect but the container is too wide.

**Changes:**
- Add 20px horizontal margin to `outerContainer` so the header floats inside the safe area
- Add `marginTop` for proper spacing from status bar
- Keep `borderRadius: 20` all corners (matching "floating window" architecture)
- Reduce overall header height to match the compact design
- Ensure the search bar inner shadow is softer

---

#### [MODIFY] [BottomTabBar.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/common/BottomTabBar.tsx)

**Design vs Code discrepancies:**
1. **Design** shows a floating glassmorphic pill tab bar with **4px active dot** below the active icon, icons at 28px, and uppercase labels. **Code** is structurally correct but:
   - Active dot `bottom: -10` puts it outside the visible area
   - Tab bar shape needs more prominent glass effect
2. **Design** shows the active "Shop" tab icon filled with a stronger emerald tint. **Code** uses `primaryContainer` which matches.
3. **Design** shows text labels in `UPPERCASE` with `letter-spacing: 0.05em`. **Code** uses `labelCaps` which has `textTransform: 'uppercase'` ✅ but the `letterSpacing` value `0.05` is in `em` not `px` — React Native expects pixels.

**Changes:**
- Fix `activeDot` position: `bottom: -4` (inside the bar, not clipped)
- Fix `letterSpacing: 0.8` (0.05em × 16px ≈ 0.8px)
- Add a subtle green tinted shadow to the tab bar matching the elevation spec
- Ensure proper `safeAreaBottom` inset on iOS

---

#### [MODIFY] [GlassCard.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/common/GlassCard.tsx)

**Design vs Code discrepancies:**
1. **Design** cards have a solid white background with very subtle glassmorphic hint. **Code** uses `rgba(255, 255, 255, 0.08)` which is almost invisible — cards appear mostly transparent.
2. **Design** shows `borderRadius: 20` on all primary cards. **Code** uses `theme.radius.xl` which is `20` ✅.
3. **Design** cards have a tinted emerald shadow. **Code** applies `theme.elevation.card` which has `shadowColor: '#10B981'` ✅.

**Changes:**
- Increase `backgroundColor` from `0.08` to `0.85` for the default card to match design's mostly-opaque white cards
- Add an optional `transparent` prop for truly glassmorphic variants (header, nav bar)
- Ensure the `BlurView intensity` is meaningful (currently 15 which is very subtle)

---

#### [MODIFY] [ProductCard.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/commerce/ProductCard.tsx)

**Design vs Code discrepancies (critical):**
1. **Design** shows product cards with:
   - Product image filling the top area with a light background
   - "PRIME" badge in an **orange/gold pill** in the top-right corner
   - Product name in **bold dark text**, right-aligned
   - Weight/unit below the name
   - A green circular `+` button on the far left, price in **emerald green** on the right
   - **Star rating + review count** between name and price (visible in `product_list/screen.png`)
2. **Code** differences:
   - Badge is positioned `top-left` instead of `top-right` (RTL correction needed)
   - No star rating displayed
   - Card height is fixed at `300` — design cards are taller with more content
   - Image `resizeMode: 'contain'` — design shows `'cover'` style photos
   - Card background is pure `white` — design uses a slightly off-white (#f4fbf4) with the glass effect

**Changes:**
- Reposition badge to top-right for RTL (`right: 12` instead of `left: 12`)
- Add star rating + review count row between weight and footer
- Adjust card height to accommodate new content
- Use `resizeMode: 'cover'` for images
- Apply the GlassCard container instead of plain white `View`
- Add subtle rounded image container with padding matching design

---

#### [MODIFY] [CategoryCard.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/commerce/CategoryCard.tsx)

**Design vs Code discrepancies:**
1. **Design** (`categories/screen.png`) shows categories as **rounded-square** cards in a 3-column grid, each with:
   - A circular icon area with a light tinted background
   - Category name centered below
   - Selected state has an **orange/gold border** (not green)
   - Icons are **themed line icons** (leaf, water drop, wheat)
2. **Code** uses cards in a horizontal FlatList on the home page and 3-column grid on CategoriesScreen. The card shape/size differs from design.
3. **Design** selected category (`خضروات طازجة`) has an orange border and a warmer gold-tinted icon circle, not the green `primaryContainer + '20'` used in code.

**Changes:**
- Change selected border color from `primaryContainer` to `secondaryContainer` (gold)
- Adjust icon container to be a circle with `borderRadius: full`
- Ensure card width adapts for both horizontal list and 3-column grid
- Match the icon styling (line style, proper coloring)

---

#### [MODIFY] [Badge.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/common/Badge.tsx)

**Design vs Code discrepancies:**
1. **Design** PRIME badge is **orange/gold** pill with white text. **Code** correctly uses `secondaryContainer` (#F59E0B) ✅
2. **Design** Organic badge uses **emerald green** with white text + a small leaf icon. **Code** uses `primaryContainer` ✅ but no icon.
3. **Design** "عضوي" (Organic) badge shows text in **Arabic** but code uses `type.toUpperCase()` which outputs English "ORGANIC"

**Changes:**
- Add Arabic label mapping for badge types (عضوي, بريميوم, etc.)
- Optionally add a small icon prefix for organic badges
- Ensure the badge is positioned correctly in RTL (top-right of card)

---

#### [MODIFY] [AppButton.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/components/common/AppButton.tsx)

**Design vs Code discrepancies:**
1. **Design** primary buttons have a **gradient effect** (emerald to a slightly darker shade) visible in the checkout CTA buttons. **Code** uses flat solid color.
2. **Design** buttons show `12px border-radius`. **Code** uses `theme.radius.default` which is `12` ✅.
3. **Design** glass buttons in confirmation page have a clear outlined style. **Code** `glass` variant uses 15% white fill.

**Changes:**
- Add a `LinearGradient` option for primary buttons to match the premium gradient CTA
- Ensure the glass variant has a visible border with `theme.colors.primary`
- Add arrow icon support for CTA buttons (design shows `→` in checkout buttons)

---

### Phase 2: Screen-by-Screen Alignment

---

#### [MODIFY] [HomeScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/home/HomeScreen.tsx)

**Design vs Code discrepancies:**
1. **Section order** — see User Review Required above
2. **Promo Banner**:
   - Design shows a gradient with background produce imagery overlaid, plus a "تسوق الان" CTA button and a "عرض حصري" (exclusive offer) pill badge
   - Code has correct gradient colors but missing: the CTA button, the exclusive offer pill, and the background image overlay
3. **Categories horizontal list** — design shows 4 visible cards with emoji-style produce images (actual photos), not icon-based cards
4. **Best Sellers** — design shows product cards in a 2-column grid with images, ratings, and prices visible; code is close but product cards need the fixes from Phase 1
5. **Search bar** — design shows search placeholder in Arabic "بحث عن خضروات..." matching code ✅

**Changes:**
- Add CTA button "تسوق الان" to promo banner
- Add "عرض حصري" pill badge on promo banner
- Add background image overlay to promo banner
- Consider adding actual produce photos to category cards (requires new image field on Category type)
- Add proper bottom spacing to avoid tab bar overlap (currently `height: 120` spacer, should use tab bar height)

---

#### [MODIFY] [ProductDetailScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/product/ProductDetailScreen.tsx)

**Design vs Code discrepancies:**
1. **Image carousel**: Design shows a carousel with **3 pagination dots** at the bottom. Code shows a single static image.
2. **Badge positioning**: Design shows "Organic" badge **on top of the product image**, overlaid in the top-left. Code doesn't show badges on the detail image.
3. **Wishlist heart**: Design shows heart button in a circular glass container on the left side of the name row. Code uses a bare icon.
4. **Star rating**: Design shows 5 filled/empty stars with review count. Code shows numeric rating — should switch to star icons.
5. **Price display**: Design shows current price in emerald + old strikethrough price. Code has this via PriceTag ✅.
6. **Weight selector**: Design shows a dropdown pill "1 كجم ˅". Code shows a stepper (different UX pattern).
7. **Feature bullets**: Design shows checkmark bullets (✓ طبيعي 100%, ✓ غني بفيتامين سي, ✓ توصيل مبرد). Code doesn't have these.
8. **Back button**: Design shows back + share buttons in glass circles. Code only has back button.

**Changes:**
- Add image carousel with pagination dots (use `FlatList` horizontal + pagination)
- Add "Organic" badge overlay on image
- Wrap wishlist heart in a glass circle
- Replace numeric rating with star icons
- Add weight dropdown selector
- Add product features/bullets section
- Add share button (top-left in RTL)
- Style the content area as a true floating card with rounded top

---

#### [MODIFY] [CategoriesScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/catalog/CategoriesScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design uses the standard `AppHeader` with "Tazeeq" branding + glassmorphic floating header. Code uses a plain inline header with a back button.
2. **Title & subtitle**: Design shows "الفئات" title + "اكتشف منتجاتنا الطازجة" subtitle. Code matches ✅.
3. **Grid layout**: Design shows a 3-column grid of category cards with line icons + labels. Code matches ✅.
4. **Selected state**: Design shows orange border highlight. Code uses green tint — fix via CategoryCard changes.
5. **Bottom promo banner**: Design shows a promotional card at the bottom ("خصم 20% على جميع المنتجات العضوية" with a CTA). Code doesn't have this.

**Changes:**
- Replace inline header with `AppHeader` to match floating header pattern
- Add bottom promotional banner with gradient and CTA
- Apply consistent card spacing

---

#### [MODIFY] [ProductListScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/catalog/ProductListScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows a **gradient emerald header** with the category name centered, a back arrow + star icon (right), and a filter icon (left). Code has green header with back + filter — close but:
   - Missing star icon
   - No gradient effect
2. **Filter pills**: Design shows horizontal scrollable filter pills below the header ("الكل", "الأكثر مبيعاً", "الأقل سعراً", "الأغلى سعراً"). Code doesn't have filter pills.
3. **Product grid**: Design shows 2-column grid with product cards. Code matches ✅.
4. **Product cards**: Need the Phase 1 fixes from ProductCard

**Changes:**
- Add gradient to header background (dark emerald to lighter emerald)
- Add horizontal filter pills row below header
- Add star/favorite icon next to back button
- Apply rounded bottom corners to the header

---

#### [MODIFY] [CartScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/cart/CartScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows standard `AppHeader` (glassmorphic floating). Code uses an inline header with back button.
2. **"Select all" row**: Design shows a "سلة التسوق (5 منتجات)" header bar with a cart icon, item count, and a "اختر الكل" checkbox. Code doesn't have this.
3. **Cart item cards**: Design shows each item as a glass card with:
   - Product image with a green checkmark overlay circle (selected state)
   - Badge overlay on image (مستورد / imported)
   - Name, weight, source right-aligned
   - Delete (trash) icon
   - Stepper (−/+) in a rounded container
   - Price in bold emerald
4. **Coupon code input**: Design shows a coupon/promo code text input with a tag icon and "تطبيق" button. Code doesn't have this.
5. **Delivery time section**: Design shows "وقت التوصيل المتوقع" with estimated delivery. Code doesn't have this.
6. **Payment method preview**: Design shows a saved Visa card preview. Code doesn't have this.
7. **Summary section**: Design shows subtotal, delivery fee, and discount line. Code has subtotal + delivery fee but no discount.

**Changes:**
- Replace header with `AppHeader` pattern
- Add select-all bar with cart icon and product count
- Add green checkmark overlay on selected cart items
- Add coupon code input row
- Add estimated delivery time section
- Add saved payment method preview
- Add discount line to summary

---

#### [MODIFY] [DeliveryScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/checkout/DeliveryScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows a floating glassmorphic pill header with "معلومات التوصيل" + location icon + back arrow. Code uses a standard inline header.
2. **Address cards**: Design shows saved addresses with:
   - Home icon in a **gold/orange** circle (not emerald) for المنزل
   - Office icon in a **gray** circle for العمل
   - Selected address has **gold/orange border** (not emerald)
   - Checkmark in green for selected
3. **New address form**: Design shows a full form with name, phone (+966 prefix), city dropdown, and address details fields. Code only has a notes input.
4. **Map preview**: Design shows an actual map view. Code shows a placeholder.
5. **Delivery time slots**: Design shows horizontal time slot pills (اليوم 09:00-10:00, اليوم 10:00-11:00) with selected state in emerald. Code doesn't have time slots.
6. **Footer summary**: Design shows delivery fee + total in the footer bar. Code only shows a CTA button.

**Changes:**
- Restyle header as floating pill
- Change address icon colors to match design (gold for home, gray for work)
- Change selected border to gold
- Add full new address form (name, phone, city dropdown, details)
- Add delivery time slot selector
- Add summary (delivery fee + total) to footer above CTA

---

#### [MODIFY] [PaymentScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/checkout/PaymentScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows floating pill with "طريقة الدفع" + credit card emoji + back arrow. Code uses inline header.
2. **Payment methods**: Design shows 3 options in a **vertical list** with radio buttons (selected = orange border), not a horizontal grid. Methods are:
   - بطاقة ائتمان (Credit card) — with card icon
   - فودافون كاش — with phone icon
   - Google Wallet — with wallet icon
   Code shows them in a horizontal 3-column grid.
3. **Card form**: Design matches code mostly ✅, but code placeholder says "ESLAM AHMED" while design says "أحمد محمد".
4. **Security badge**: Design shows a gold pill "🔒 دفع آمن 100% ومشفّر". Code shows a text line.
5. **Summary card**: Design shows subtotal + delivery + total in a card. Code shows only total.
6. **Terms checkbox**: Design shows a terms & conditions checkbox. Code doesn't have this.
7. **CTA button**: Design shows "✅ تأكيد الطلب والدفع" with a checkmark. Code text matches but no emoji.

**Changes:**
- Restyle payment methods as vertical list with radio buttons and orange selected border
- Update placeholder names to Arabic
- Add security badge as a gold pill
- Add full price breakdown (subtotal, delivery) to summary
- Add terms & conditions checkbox
- Add checkmark emoji to CTA button

---

#### [MODIFY] [ConfirmationScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/checkout/ConfirmationScreen.tsx)

**Design vs Code discrepancies:**
1. **Success icon**: Design shows a large emerald circle with white checkmark. Code matches ✅.
2. **Order details**: Design shows **ORDER NUMBER** label + `#ORD-2026-4891` + estimated arrival + delivery address + total in emerald. Code has some of this but formatting differs.
3. **Items preview**: Design shows a horizontal scroll of product thumbnails. Code uses random Unsplash URLs.
4. **Map + Timeline**: Design shows a map view with delivery truck icon + an order timeline (Order Placed → Preparing → On the Way). Code doesn't have this.
5. **Dual CTA buttons**: Design shows "شاهد حالة الطلب" (primary emerald) + "اتصل بالمبروك" (outlined). Code has "تتبع الطلب" + "العودة للرئيسية".

**Changes:**
- Add structured order details card (order number, estimated arrival, delivery address, total)
- Use actual product images from cart data for item previews
- Add mini-map preview with delivery truck overlay
- Add order timeline visualization
- Update CTA button text to match design
- Add outlined call button

---

#### [MODIFY] [TrackingScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/orders/TrackingScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows the standard AppHeader (Tazeeq floating glassmorphic). Code uses a back button overlay on the map.
2. **Status stepper**: Design shows a horizontal progress bar with **labeled icons** (تم الطلب → مجهز → في الطريق ⚡ → تم التوصيل) with checkmark circles and a truck icon. Code uses plain dots and lines.
3. **Map**: Design shows a full-bleed map background with a dashed green delivery route and a truck icon. Code uses a stock photo.
4. **ETA banner**: Design shows a prominent emerald gradient banner "🚚 يصل خلال 18 دقيقة ⏱" with a countdown. Code has a small GlassCard.
5. **Driver card**: Design shows driver info with avatar, name, rating stars, call + message buttons, vehicle info, and a cancel order button. Code has driver info but simpler layout.
6. **Cancel button**: Design shows an outlined red "إلغاء الطلب ✕" button. Code doesn't have cancel.

**Changes:**
- Add AppHeader above the map
- Redesign stepper with proper icons (checkmarks, truck) and labels
- Replace stock photo with a styled map placeholder (use green-tinted gradient as background)
- Upgrade ETA banner to a prominent gradient card with truck emoji
- Enhance driver card with vehicle info section
- Add cancel order button with red outlined style

---

#### [MODIFY] [RatingScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/orders/RatingScreen.tsx)

**Design vs Code discrepancies:**
1. **Header**: Design shows "Tazeeq" branding with a forward arrow (→), not a standard back button. Code has no header navigation.
2. **Success message**: Design shows "تم استلام طلبك بنجاح!" with a large green checkmark icon at top. Code shows "كيف كانت تجربتك؟" — different messaging.
3. **Points reward card**: Design shows a glass card "حصلت على 50 نقطة!" with a "بريميوم" badge. Code has this ✅ but styled differently.
4. **Product rating section**: Design shows "تقييم المنتجات" with **individual product images** and star ratings per product. Code only has a general delivery rating.
5. **Delivery rating**: Design shows a **slider** (horizontal track) for delivery rating, not stars. Code uses star icons.
6. **Photo upload**: Design shows an "إرفاق صور" section with + buttons and a camera icon. Code doesn't have this.
7. **Submit button**: Design shows full-width "إرسال التقييم" emerald button. Code matches ✅.

**Changes:**
- Add header with Tazeeq branding and navigation arrow
- Add success checkmark icon and message
- Add per-product rating section with product thumbnails
- Replace star delivery rating with a horizontal slider
- Add photo upload section with camera icon
- Add proper spacing between sections

---

### Phase 3: Additional Missing Screens & Polish

---

#### [MODIFY] [OrganicScreen.tsx](file:///c:/Users/Eslam/shop-desing-plan/src/screens/catalog/OrganicScreen.tsx)

The Organic screen doesn't have a specific design reference but should follow the same product list pattern with a green-themed header.

---

#### [MODIFY] [typography.ts](file:///c:/Users/Eslam/shop-desing-plan/src/theme/tokens/typography.ts)

**Design spec says font family is `beVietnamPro`. Code has no `fontFamily` set**, relying on system defaults. For Arabic, the design spec mentions Cairo or Tajawal.

**Changes:**
- Since this is React Native/Expo, we need to load custom fonts via `expo-font`
- Add `fontFamily` to all typography tokens (or omit if staying with system font for Arabic clarity)
- Fix `letterSpacing: 0.05` → should be `0.8` (pixels, not em units)

---

## Verification Plan

### Automated Tests
- Run `npx expo run:android` and verify each screen visually
- Cross-reference each screen against the corresponding `screen.png` in `stitch_tazaj_premium_ui_design/`

### Manual Verification
- **Home Screen**: Verify section order, promo banner with gradient + CTA, category cards, product grid
- **Categories Screen**: Verify 3-column grid, selected state with gold border, bottom promo
- **Product List**: Verify header gradient, filter pills, 2-column product grid
- **Product Detail**: Verify image carousel, badge overlay, star rating, feature bullets
- **Cart**: Verify select-all bar, coupon input, delivery preview, payment method preview
- **Delivery**: Verify address cards with gold/orange icons, form fields, time slots
- **Payment**: Verify vertical payment list, card form, terms checkbox
- **Confirmation**: Verify order details card, item previews, map + timeline
- **Tracking**: Verify status stepper icons, ETA gradient banner, driver card with cancel
- **Rating**: Verify per-product rating, delivery slider, photo upload section

### Build Verification
```bash
npx expo run:android
```
Ensure no TypeScript errors, no missing imports, and smooth animations.
