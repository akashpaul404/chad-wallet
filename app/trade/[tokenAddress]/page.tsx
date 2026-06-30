import React, { Suspense } from "react";
import TradeNavbar from "../../components/TradeNavbar";
import TradeClientLayout from "../../components/TradeClientLayout";

// ─── Data fetchers (unchanged logic) ─────────────────────────────────────────

async function getTokenOverview(address: string) {
  try {
    const res = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${address}`,
      {
        headers: {
          "x-chain": "solana",
          "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
        },
        next: { revalidate: 30 },
      }
    );
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function getTokenHolders(address: string) {
  try {
    const res = await fetch(
      `https://public-api.birdeye.so/defi/v3/token/holder?address=${address}&offset=0&limit=10`,
      {
        headers: {
          "x-chain": "solana",
          "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
        },
        next: { revalidate: 60 },
      }
    );
    const json = await res.json();
    if (json.success && json.data?.items) return json.data.items;
    if (json.success && Array.isArray(json.data)) return json.data;
    return [];
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TradePage({
  params,
}: {
  params: Promise<{ tokenAddress: string }>;
}) {
  const { tokenAddress } = await params;

  // Fetch both in parallel
  const [overview, holders] = await Promise.all([
    getTokenOverview(tokenAddress),
    getTokenHolders(tokenAddress),
  ]);

  return (
    <div className="flex h-screen flex-col bg-[#060510] overflow-hidden">
      <TradeNavbar />
      <TradeClientLayout
        tokenAddress={tokenAddress}
        overview={overview}
        holders={holders}
      />
    </div>
  );
}
