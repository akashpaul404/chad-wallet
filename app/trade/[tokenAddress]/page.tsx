import React, { Suspense } from "react";
import Navbar from "../../components/Navbar";
import JupiterTerminal from "../../components/JupiterTerminal";
import LightweightChart from "../../components/LightweightChart";
import TrendingTokensSidebar from "../../components/TrendingTokensSidebar";
import HoldersSkeleton from "../../components/HoldersSkeleton";
import TokenHeaderSkeleton from "../../components/TokenHeaderSkeleton";

// ─── Data fetchers ────────────────────────────────────────────────────────────

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

// ─── Streaming server components ─────────────────────────────────────────────

async function TokenHeader({ tokenAddress }: { tokenAddress: string }) {
  const overview = await getTokenOverview(tokenAddress);
  return (
    <div className="flex items-center justify-between p-4 bg-[#161618] rounded-xl border border-white/5">
      <div className="flex items-center gap-4">
        {overview?.logoURI ? (
          <img
            src={overview.logoURI}
            alt={overview?.symbol}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/40">
            ?
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            {overview?.name || "Unknown Token"}
            <span className="text-white/40 text-sm font-normal">{overview?.symbol}</span>
          </h1>
          <span className="text-white/30 text-xs font-mono">
            {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-6)}
          </span>
        </div>
      </div>

      {overview && (
        <div className="flex items-center gap-6 text-right">
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg">
              ${(overview.price || 0) < 0.01
                ? (overview.price || 0).toFixed(6)
                : (overview.price || 0).toFixed(2)}
            </span>
            <span
              className={`text-sm font-semibold ${
                (overview.priceChange24h || 0) >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {(overview.priceChange24h || 0) >= 0 ? "+" : ""}
              {(overview.priceChange24h || 0).toFixed(2)}%
            </span>
          </div>
          <div className="flex-col hidden sm:flex text-right">
            <span className="text-white/40 text-xs">Market Cap</span>
            <span className="text-white/80 text-sm font-medium">
              ${((overview.mc || 0) / 1_000_000).toFixed(2)}M
            </span>
          </div>
          <div className="flex-col hidden sm:flex text-right">
            <span className="text-white/40 text-xs">24h Vol</span>
            <span className="text-white/80 text-sm font-medium">
              ${((overview.v24hUSD || 0) / 1_000_000).toFixed(2)}M
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

async function HoldersTable({ tokenAddress }: { tokenAddress: string }) {
  const holders = await getTokenHolders(tokenAddress);
  return (
    <table className="w-full text-left text-sm text-white/80">
      <thead className="text-white/40 border-b border-white/5 pb-2 sticky top-0 bg-[#161618]">
        <tr>
          <th className="pb-2 font-medium">Rank</th>
          <th className="pb-2 font-medium">Address</th>
          <th className="pb-2 font-medium text-right">Amount</th>
          <th className="pb-2 font-medium text-right">% Supply</th>
        </tr>
      </thead>
      <tbody>
        {holders && holders.length > 0 ? (
          holders.map((holder: any, i: number) => {
            // ui_amount is already decimal-adjusted per BirdEye v3 spec
            const amount: number = holder.ui_amount ?? 0;
            // Use holder.percentage if available, otherwise compute from raw amount field
            const rawPct: number = holder.percentage ?? null;
            const owner: string = holder.owner || holder.address || "";
            return (
              <tr
                key={owner || i}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 text-white/40 w-8">{i + 1}</td>
                <td className="py-3 font-mono">
                  {owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : "—"}
                  {i === 0 && (
                    <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Top
                    </span>
                  )}
                </td>
                <td className="py-3 text-right">
                  {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 text-right">
                  <span className={rawPct != null && rawPct > 5 ? "text-orange-400" : "text-white/80"}>
                    {rawPct != null
                      ? `${rawPct < 0.01 ? "<0.01" : rawPct.toFixed(2)}%`
                      : "—"}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="py-8 text-center text-white/30 text-xs">
              No holder data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// ─── Page shell — renders instantly, data streams in ─────────────────────────

export default async function TradePage({
  params,
}: {
  params: Promise<{ tokenAddress: string }>;
}) {
  const { tokenAddress } = await params;

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0c] overflow-hidden">
      <Navbar />

      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Column: Trending Tokens */}
        <div className="w-1/4 lg:min-w-[280px] xl:max-w-[320px] border-r border-white/5 hidden md:flex flex-col bg-[#0a0a0c]">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Trending Tokens</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TrendingTokensSidebar />
          </div>
        </div>

        {/* Middle Column: Chart & Info */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0a0a0c] p-4 gap-4 border-r border-white/5">
          {/* Token Header — streams in, skeleton shown while loading */}
          <Suspense fallback={<TokenHeaderSkeleton />}>
            <TokenHeader tokenAddress={tokenAddress} />
          </Suspense>

          {/* Chart Area */}
          <div className="h-[50vh] min-h-[400px] w-full bg-[#161618] rounded-xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white/80">Price Chart</h2>
            </div>
            <div className="flex-1 relative">
              <LightweightChart tokenAddress={tokenAddress} />
            </div>
          </div>

          {/* Holders Table — streams in, skeleton shown while loading */}
          <div className="flex-1 min-h-[200px] bg-[#161618] rounded-xl border border-white/5 p-4 flex flex-col">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Top 10 Holders</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <Suspense fallback={<HoldersSkeleton />}>
                <HoldersTable tokenAddress={tokenAddress} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Desk */}
        <div className="w-1/4 lg:min-w-[320px] xl:max-w-[400px] bg-[#0a0a0c] overflow-y-auto p-4 flex flex-col gap-4">
          <div
            className="bg-[#161618] rounded-xl border border-white/5 shadow-2xl overflow-y-auto flex-shrink-0"
            style={{ maxHeight: "calc(85vh - 220px)" }}
          >
            <JupiterTerminal tokenAddress={tokenAddress} />
          </div>

          <div className="bg-[#161618] rounded-xl border border-white/5 p-4 min-h-[200px]">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Your Positions</h2>
            <div className="flex items-center justify-center h-24 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
              No open positions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
