# ChadWallet Founding Engineer Assessment

**Sender:** Pengcheng Chen (Founder at OpenChat / ChadWallet)
**Role:** Founding Engineer (ChadWallet)
**Deadline:** Sunday, June 28, 2026

---

## Core Objective
Make a `fomo.family` like landing page (minimum requirement) + a trading page (bonus phase). Use real data where possible; all services have free tiers.

## Technical Specifications & Stack
*   **Framework:** Next.js (App Router preferred), Tailwind CSS
*   **Backend/Hosting:** Supabase, Cloudflare, Vercel
*   **Authentication:** Privy (Sign in with Apple/Google)
*   **Network:** Solana
*   **Data APIs & Trading Integration:**
    *   **Privy:** https://privy.io
    *   **BirdEye (Data API):** https://birdeye.so/data-api
    *   **RPC:** https://www.alchemy.com/rpc-api
    *   **TradingView (Charts):** https://www.tradingview.com/charting-library-docs/latest/api/
    *   **Jupiter (Swaps/Trading):** https://developers.jup.ag/docs/get-started

---

## Detailed Requirements

### 1. Branding & Assets
*   **ChadWallet Brand Identity:** Use assets from the provided asset link.
*   **App Reference Links:**
    *   Android: https://play.google.com/store/apps/details?id=xyz.chadwallet.www
    *   iOS: https://apps.apple.com/us/app/chadwallet/id6757367474

### 2. Phase 1: Landing Page (Minimum)
*   [ ] Implement a high-converting, slick, dark-themed crypto landing page layout similar to `fomo.family`.
*   [ ] Integrate Privy for seamless authentication via Apple and Google.
*   [ ] Build rotating/scrolling token marquee banners at both the top and bottom of the page.
*   [ ] Tapping/clicking a token in the banner must link directly to its corresponding trading page.

### 3. Phase 2: Trading Page (Bonus UI)
A three-column layout split as follows:
*   [ ] **Left Column:** Trending tokens list powered by real-time BirdEye data.
*   [ ] **Middle Column:** Token basic information, historical price chart (TradingView), current list of holders, and live trades ticker stream.
*   [ ] **Right Column:** Token execution desk (Buy & Sell operations via Jupiter protocol) and user's open positions tracker.

---

## Deliverable
Share a live preview link (Vercel deployment) once completed.