import TokenMarquee, { Token } from "./TokenMarquee";
import fs from "fs";
import path from "path";

async function getTrendingTokens(): Promise<{ tokens: Token[], error?: string }> {
  let apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  
  // Fallback to read from .env file directly if server hasn't been restarted
  if (!apiKey) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/NEXT_PUBLIC_BIRDEYE_API_KEY=(.+)/);
        if (match) apiKey = match[1].trim();
      }
    } catch (e) {}
  }

  if (!apiKey) {
    return { tokens: [], error: "NEXT_PUBLIC_BIRDEYE_API_KEY is missing. Please restart the Next.js dev server." };
  }

  try {
    const res = await fetch("https://public-api.birdeye.so/defi/token_trending", {
      headers: {
        "x-chain": "solana",
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { tokens: [], error: `API Error: ${res.status}` };
    }
    
    const json = await res.json();
    return { tokens: json.data?.tokens || [] };
  } catch (e: any) {
    return { tokens: [], error: `Fetch failed: ${e.message || "Unknown error"}` };
  }
}

export default async function TokenBanner() {
  const { tokens, error } = await getTrendingTokens();
  
  if (error || tokens.length === 0) {
    return (
      <div className="w-full bg-red-900/20 border-y border-red-500/20 py-2 text-center text-red-400 text-sm font-medium">
        {error || "No trending tokens found."}
      </div>
    );
  }

  return <TokenMarquee tokens={tokens} />;
}
