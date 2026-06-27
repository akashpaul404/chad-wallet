Step 1: Foundation & Branding
Prompt:

"I am building a Next.js application using Tailwind CSS. This is the landing page for 'ChadWallet', a Solana-based crypto app.

Set up a clean, modern, dark-mode focused layout inspired by fomo.family.

Create a Hero section with the ChadWallet branding. I have a Google Drive folder for assets and links for the Android and iOS apps. Create placeholder buttons for 'Download on App Store' and 'Get it on Google Play'.

Ensure the layout is responsive. Do not add any complex functionality yet, just the static UI and Tailwind scaffolding."

Step 2: Authentication (Privy)
Note: You will need to grab a free API key from Privy.io first.
Prompt:

"Now let's add Authentication using Privy (privy.io).

Install the @privy-io/react-auth package.

Create a PrivyProvider wrapper in the root layout to wrap the application. Use standard Apple and Google login options.

Add a 'Sign In' button to the top right navigation bar.

When a user is authenticated, the button should change to show their wallet address or email, and a 'Sign Out' button."

Step 3: Solana Data & The Marquee Banner (BirdEye)
Note: Get a free API key from BirdEye.
Prompt:

"Let's build the rotating token banners for the top and bottom of the page.

Use the BirdEye API to fetch a list of trending Solana tokens (name, symbol, current price, and 24h price change).

Create a 'TokenBanner' component that uses a CSS marquee animation to scroll these tokens horizontally. Green text for positive changes, red for negative.

Place one banner at the very top of the page (below the nav) and one at the very bottom.

Make each token in the banner clickable. For now, clicking should just console.log the token address. Later it will route to the trading page."

Step 4: Trading UI Scaffolding (The Bonus)
Prompt:

"Now let's build the Trading UI layout on a new route /trade/[tokenAddress].
Create a three-column layout using Tailwind Grid or Flexbox:

Left Column (25% width): A 'Trending Tokens' list. Fetch this data using the BirdEye API.

Middle Column (50% width): The main token info area. Put placeholders for the Token Header (Name/Price), a large placeholder div for the Price Chart, and a table placeholder for 'Live Trades'.

Right Column (25% width): The Action panel. Create a UI with tabs for 'Buy' and 'Sell'. Include an input field for the amount and a large 'Swap' button. Below that, add a section to display the user's current token position."

Step 5: The Hard Integrations (TradingView & Jupiter)
Warning: AI often struggles with TradingView's lightweight charts and Jupiter's React terminal. You may need to read their docs closely to fix AI errors here.
Prompt:

"Let's integrate real trading tools into the /trade page.

In the Middle Column, replace the chart placeholder with the lightweight-charts library (from TradingView). Feed it historical price data from the BirdEye API for the selected token.

In the Right Column, replace our placeholder Buy/Sell UI with the Jupiter Terminal React component (@jup-ag/terminal). Configure it to allow swaps on the Solana network. Ensure it connects to the user's authenticated wallet via Privy.