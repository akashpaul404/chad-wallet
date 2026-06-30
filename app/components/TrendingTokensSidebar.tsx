"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Token } from "./TokenMarquee";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 4): Promise<Response> {
  let delay = 1500;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    if (attempt < maxRetries) {
      await sleep(delay);
      delay *= 2;
    }
  }
  return fetch(url, options);
}

type MainTab = "Alerts" | "Tokens" | "Leaderboard";
type SubTab = "Trending" | "Most Held" | "Crypto";

function fmtMC(n: number | string | undefined): string {
  if (n == null) return "—";
  const num = Number(n);
  if (isNaN(num)) return "—";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

export default function TrendingTokensSidebar() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>("Tokens");
  const [subTab, setSubTab] = useState<SubTab>("Trending");

  useEffect(() => {
    let cancelled = false;

    async function fetchTokens() {
      try {
        const res = await fetchWithRetry(
          "https://public-api.birdeye.so/defi/token_trending",
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
            cache: "force-cache",
            // @ts-ignore
            next: { revalidate: 60 },
          }
        );
        if (cancelled) return;
        if (res.status === 429) { setLoading(false); return; }
        const json = await res.json();
        if (json.data?.tokens && !cancelled) setTokens(json.data.tokens);
      } catch (e) {
        if (!cancelled) console.error("Failed to fetch trending tokens:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTokens();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Main tabs: Tokens | Leaderboard */}
      <div className="flex border-b border-zinc-800 shrink-0">
        {(["Alerts", "Tokens", "Leaderboard"] as MainTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              mainTab === tab
                ? "text-white border-white"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {mainTab === "Alerts" && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 h-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3 opacity-50"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <p className="text-sm">Alerts coming soon</p>
        </div>
      )}

      {mainTab === "Tokens" && (
        <>
          {/* Sub-tabs */}
          <div className="flex gap-1 px-2 py-2 border-b border-zinc-800 shrink-0 overflow-x-auto">
            {(["Trending", "Most Held", "Crypto"] as SubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                  subTab === tab
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Token list */}
          <div className="flex-1 overflow-y-auto hover-scrollbar transition-colors">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-40">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" />
                </div>
                <p className="text-zinc-500 text-xs">Loading tokens…</p>
              </div>
            ) : subTab !== "Trending" ? (
              <div className="flex items-center justify-center h-32 text-zinc-500 text-xs">
                {subTab} coming soon
              </div>
            ) : tokens.length === 0 ? (
              <div className="p-6 text-zinc-500 text-sm text-center">
                No trending tokens available.<br />
                <span className="text-xs text-zinc-600">API rate limit may apply.</span>
              </div>
            ) : (
              tokens.map((token, idx) => (
                <Link
                  key={`${token.address}-${idx}`}
                  href={`/trade/${token.address}`}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-zinc-800/50 border-b border-zinc-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                    <img
                      src={token.logoURI}
                      alt={token.name}
                      className="w-7 h-7 rounded-full shrink-0 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`;
                      }}
                    />
                    <div className="flex flex-col truncate min-w-0">
                      <span className="font-bold text-white/90 text-sm truncate">{token.symbol}</span>
                      <span className="text-zinc-600 text-[10px] truncate">
                        {fmtMC((token as any).mc ?? (token as any).marketCap ?? (token as any).realMc ?? (token as any).fdv)} MC
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className="text-white/80 text-xs font-medium">
                      {(token.price ?? 0) < 0.01
                        ? (token.price ?? 0).toFixed(6)
                        : (token.price ?? 0).toFixed(4)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        (token.price24hChangePercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {(token.price24hChangePercent ?? 0) >= 0 ? "+" : ""}
                      {(token.price24hChangePercent ?? 0).toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      )}

      {mainTab === "Leaderboard" && (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
          Leaderboard coming soon
        </div>
      )}
    </div>
  );
}
