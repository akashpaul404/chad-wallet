import React from "react";
import Navbar from "../../components/Navbar";
import JupiterTerminal from "../../components/JupiterTerminal";
import LightweightChart from "../../components/LightweightChart";
import TrendingTokensSidebar from "../../components/TrendingTokensSidebar";

async function getTokenOverview(address: string) {
  try {
    const res = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${address}`, {
      headers: {
        "x-chain": "solana",
        "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
      },
      next: { revalidate: 30 }
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (e) {
    return null;
  }
}

async function getTokenHolders(address: string) {
  try {
    const res = await fetch(`https://public-api.birdeye.so/defi/token_holder?address=${address}&limit=10`, {
      headers: {
        "x-chain": "solana",
        "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
      },
      next: { revalidate: 60 }
    });
    const json = await res.json();
    return json.success ? json.data.items : [];
  } catch (e) {
    return [];
  }
}

export default async function TradePage({ params }: { params: Promise<{ tokenAddress: string }> }) {
  const { tokenAddress } = await params;

  const [overview, holders] = await Promise.all([
    getTokenOverview(tokenAddress),
    getTokenHolders(tokenAddress)
  ]);

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0c] overflow-hidden">
      <Navbar />

      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Column: Trending Tokens (25%) */}
        <div className="w-1/4 lg:min-w-[280px] xl:max-w-[320px] border-r border-white/5 hidden md:flex flex-col bg-[#0a0a0c]">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Trending Tokens</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TrendingTokensSidebar />
          </div>
        </div>

        {/* Middle Column: Chart & Info (50%) */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0a0a0c] p-4 gap-4 border-r border-white/5">
          {/* Header Info placeholder */}
          <div className="flex items-center justify-between p-4 bg-[#161618] rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              {overview?.logoURI ? (
                <img src={overview.logoURI} alt={overview?.symbol} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/40">?</div>
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
                    ${(overview.price || 0) < 0.01 ? (overview.price || 0).toFixed(6) : (overview.price || 0).toFixed(2)}
                  </span>
                  <span className={`text-sm font-semibold ${(overview.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {(overview.priceChange24h || 0) >= 0 ? "+" : ""}{(overview.priceChange24h || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="flex-col hidden sm:flex text-right">
                  <span className="text-white/40 text-xs">Market Cap</span>
                  <span className="text-white/80 text-sm font-medium">
                    ${((overview.mc || 0) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex-col hidden sm:flex text-right">
                  <span className="text-white/40 text-xs">24h Vol</span>
                  <span className="text-white/80 text-sm font-medium">
                    ${((overview.v24hUSD || 0) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chart Area */}
          <div className="h-[50vh] min-h-[400px] w-full bg-[#161618] rounded-xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white/80">Price Chart</h2>
            </div>
            <div className="flex-1 relative">
              <LightweightChart tokenAddress={tokenAddress} />
            </div>
          </div>

          {/* Holders Table */}
          <div className="flex-1 min-h-[200px] bg-[#161618] rounded-xl border border-white/5 p-4 flex flex-col">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Top 10 Holders</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="text-white/40 border-b border-white/5 pb-2 sticky top-0 bg-[#161618]">
                  <tr>
                    <th className="pb-2 font-medium">Address</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                    <th className="pb-2 font-medium text-right">% Supply</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((holder: any, i: number) => {
                    const supply = overview?.supply || 1;
                    const amount = holder.ui_amount || holder.uiAmount || 0;
                    const percent = (amount / supply) * 100;
                    return (
                      <tr key={holder.owner} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono">
                          {holder.owner.slice(0, 4)}...{holder.owner.slice(-4)}
                          {i === 0 && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Top</span>}
                        </td>
                        <td className="py-3 text-right">
                          {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 text-right">
                          {percent > 100 ? "<0.01" : percent.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                  {(!holders || holders.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-white/30 border border-dashed border-white/10 rounded-lg mt-4 block">
                        No holder data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Desk (25%) */}
        <div className="w-1/4 lg:min-w-[320px] xl:max-w-[400px] bg-[#0a0a0c] overflow-y-auto p-4 flex flex-col gap-4">
          {/* Jupiter Terminal — scrollable box so Connect Wallet is always reachable */}
          <div className="bg-[#161618] rounded-xl border border-white/5 shadow-2xl overflow-y-auto flex-shrink-0" style={{ maxHeight: 'calc(85vh - 220px)' }}>
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
