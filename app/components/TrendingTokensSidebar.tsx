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
      delay *= 2; // 1.5s → 3s → 6s → 12s
    }
  }
  return fetch(url, options);
}

export default function TrendingTokensSidebar() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTokens() {
      try {
        // Stagger: delay 400ms so chart and server calls start first
        await sleep(400);
        if (cancelled) return;

        const res = await fetchWithRetry(
          "https://public-api.birdeye.so/defi/token_trending",
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
          }
        );

        if (cancelled) return;

        if (res.status === 429) {
          // Still 429 after retries — show empty gracefully
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (json.data?.tokens && !cancelled) {
          setTokens(json.data.tokens);
        }
      } catch (e) {
        if (!cancelled) console.error("Failed to fetch trending tokens:", e);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRetrying(false);
        }
      }
    }

    fetchTokens();
    return () => { cancelled = true; };
  }, []);

  if (loading || retrying) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-40">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" />
        </div>
        <p className="text-white/30 text-xs">
          {retrying ? "Retrying…" : "Loading trending tokens…"}
        </p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="p-6 text-white/30 text-sm text-center">
        No trending tokens available.<br />
        <span className="text-xs text-white/20">API rate limit may apply.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tokens.map((token, idx) => (
        <Link
          key={`${token.address}-${idx}`}
          href={`/trade/${token.address}`}
          className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 transition-colors group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={token.logoURI}
              alt={token.name}
              className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`;
              }}
            />
            <div className="flex flex-col truncate">
              <span className="font-bold text-white/90 truncate">{token.symbol}</span>
              <span className="text-white/40 text-xs truncate">{token.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-white/90 text-sm font-medium">
              ${(token.price ?? 0) < 0.01 ? (token.price ?? 0).toFixed(6) : (token.price ?? 0).toFixed(2)}
            </span>
            <span
              className={`text-xs font-semibold ${
                (token.price24hChangePercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {(token.price24hChangePercent ?? 0) >= 0 ? "+" : ""}
              {(token.price24hChangePercent ?? 0).toFixed(2)}%
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
