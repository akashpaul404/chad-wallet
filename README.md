# ChadWallet 🚀

ChadWallet is a modern, high-performance Solana-based crypto application. It features a slick, dark-themed landing page and a fully-fledged trading interface powered by real-time blockchain data.

## ✨ Features

### Landing Page
*   **Modern Aesthetics:** Clean, dark-mode focused layout designed for high conversion.
*   **Seamless Authentication:** Integrated with [Privy](https://privy.io/) for effortless login using Apple and Google accounts.
*   **Live Token Marquee:** Real-time scrolling banners displaying trending Solana tokens, powered by [BirdEye API](https://birdeye.so/data-api).

### Trading Desk (Advanced)
*   **Trending Markets:** Live sidebar showcasing the hottest tokens on Solana.
*   **Interactive Charts:** Integrated [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) for deep historical price analysis.
*   **Instant Swaps:** Fully functional execution desk utilizing [Jupiter Terminal](https://jup.ag/) for fast, secure token swaps directly from the interface.

## 🛠 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication:** [Privy](https://privy.io/)
*   **Network:** Solana
*   **Data & APIs:** BirdEye (Token Data), Alchemy (RPC)
*   **Trading Integrations:** TradingView (Charts), Jupiter (Swaps)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akashpaul404/chad-wallet.git
    cd chad-wallet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
    NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key
    NEXT_PUBLIC_ALCHEMY_RPC_URL=your_alchemy_rpc_url
    ```
    *(Note: You will need to obtain free API keys from Privy, BirdEye, and Alchemy to fully test the application locally.)*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Download the App

Experience ChadWallet on the go:
*   [Download on the App Store](https://apps.apple.com/us/app/chadwallet/id6757367474)
*   [Get it on Google Play](https://play.google.com/store/apps/details?id=xyz.chadwallet.www)

## 📝 License

This project is intended as a founding engineer assessment for ChadWallet. All rights reserved.
