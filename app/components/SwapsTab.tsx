"use client";

import React, { useEffect, useState } from "react";

interface Swap {
  blockUnixTime: number;
  side: "buy" | "sell";
  volumeUSD: number;
  owner: string;
  txHash: string;
}

function timeAgo(unixTime: number): string {
  const seconds = Math.floor(Date.now() / 1000) - unixTime;
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatUSD(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
}

export default function SwapsTab({ tokenAddress }: { tokenAddress: string }) {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSwaps() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://public-api.birdeye.so/defi/txs/token?address=${tokenAddress}&limit=20`,
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
          }
        );
        if (cancelled) return;
        if (!res.ok) {
          setError("Failed to load swaps.");
          return;
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.items)) {
          const mapped: Swap[] = json.data.items.map((item: any) => ({
            blockUnixTime: item.blockUnixTime ?? item.timestamp ?? 0,
            side: item.side === "sell" ? "sell" : "buy",
            volumeUSD: item.volumeUSD ?? item.volume ?? 0,
            owner: item.owner ?? item.source ?? "",
            txHash: item.txHash ?? item.signature ?? "",
          }));
          setSwaps(mapped);
        } else {
          setError("No swap data available.");
        }
      } catch {
        if (!cancelled) setError("Failed to load swaps.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSwaps();
    return () => { cancelled = true; };
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || swaps.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
        {error ?? "No recent swaps found."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-zinc-500 border-b border-zinc-800 text-xs">
            <th className="pb-2 pr-4 font-medium">Time</th>
            <th className="pb-2 pr-4 font-medium">Type</th>
            <th className="pb-2 pr-4 font-medium text-right">Amount</th>
            <th className="pb-2 font-medium">Wallet</th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap, i) => (
            <tr
              key={swap.txHash || i}
              className="border-b border-zinc-800/60 hover:bg-white/[0.03] transition-colors"
            >
              <td className="py-2.5 pr-4 text-zinc-400 whitespace-nowrap">
                {timeAgo(swap.blockUnixTime)}
              </td>
              <td className="py-2.5 pr-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    swap.side === "buy"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {swap.side === "buy" ? "Buy" : "Sell"}
                </span>
              </td>
              <td className="py-2.5 pr-4 text-right font-medium text-white/80">
                {formatUSD(swap.volumeUSD)}
              </td>
              <td className="py-2.5 font-mono text-zinc-400 text-xs">
                {swap.owner
                  ? `${swap.owner.slice(0, 4)}…${swap.owner.slice(-4)}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
