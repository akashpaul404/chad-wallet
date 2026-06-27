"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Token } from "./TokenMarquee";

export default function TrendingTokensSidebar() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch("https://public-api.birdeye.so/defi/token_trending", {
          headers: {
            "x-chain": "solana",
            "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
          },
        });
        const json = await res.json();
        if (json.data?.tokens) {
          setTokens(json.data.tokens);
        }
      } catch (e) {
        console.error("Failed to fetch trending tokens:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, []);

  if (loading) {
    return <div className="p-6 text-white/40 text-sm text-center">Loading trending tokens...</div>;
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
