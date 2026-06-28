# PHORAMEC IMPORTS AVENUE GHANA

An exceptionally polished, clean, and mobile-first Single Page Application (SPA) custom-designed for the **Phoramec Imports Avenue** catalog and secure custom importing operations in Accra, Ghana. Designed under strict Human-Computer Interaction (HCI) standards and WCAG accessibility guidelines.

## 🚀 ARCHITECTURE & ADAPTATIONS

While maintaining the request structure, we implemented this system within a **modern compilation-oriented Vite + React + Tailwind CSS 4 environment** to guarantee lightning-fast performance and seamless caching features.

The logic is split cleanly to follow enterprise standards:
1. **Catalog Registry (`src/data.ts`):** High-quality actual product listings across Phones, Laptops, Home Appliances, and Shoes/Clothes with accurate Ghanaian Cedis (`GHS` / `₵`) pricing.
2. **Audio Assist Screen Reader (`src/utils/speech.ts`):** 100% functional Web Speech Synthesis engine configured for elderly, visually impaired, or partially educated clients. Reads product features, pricing, and stock status on hover, focus, or long-press.
3. **Smart Checkout & Handshake (`src/components/CartCheckout.tsx`):** Coordinates name, phone, optional email receipts, and instant native GPS tracking coordinates via `navigator.geolocation`, forming a direct encoded WhatsApp (`wa.me`) handshake url structure.
4. **Custom Import Form (`src/components/CustomRequestForm.tsx`):** Mimics a direct plain-text WhatsApp order with budget specification, reference image URL, and location sharing.
5. **Manager Backoffice (`src/components/AdminDashboard.tsx`):** A secret administrative portal hidden behind a triple-tap gesture on the Accra footer with password auth (`admin`), housing a real-time product injector form (writes instantly to client catalog view via `localStorage`) and logs tables.

---

## 🛠️ ACCESS AND VERIFIED CONFIGURATION
- **Manager Portal Access:** Tap **three (3) times** on the very bottom footer section ("Manager Panel Secure Portal Link") to trigger the login popup.
- **Passcode:** `admin` (Fully configurable inside `src/data.ts`).
- **Direct Contact:** `+233 55 152 5354` (Standard Ghana office routing).

---

## ♿ ACCESSIBILITY (WCAG) AND USABILTY FEATURES
- **Adaptive System Themes:** Queries your phone's default light/dark preference automatically via `matchMedia` and maps smooth, eye-safe high-contrast custom properties. Features a working override button cached in `localStorage`.
- **Target Zones:** Every interactive button and slider has been styled with a minimum target zone of `48px` by `48px` with spacious padding to secure high-accuracy thumb-only operations.
