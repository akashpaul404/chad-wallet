"use client";

import React from "react";
import Link from "next/link";

export type Token = {
  address: string;
  name: string;
  symbol: string;
  price: number;
  price24hChangePercent: number;
  logoURI?: string;
};

export default function TokenMarquee({ tokens }: { tokens: Token[] }) {
  const handleClick = (address: string) => {
  };

  // Duplicate tokens to ensure seamless infinite scrolling
  // We need enough copies so it exceeds the screen width
  const duplicatedTokens = [...tokens, ...tokens, ...tokens, ...tokens];

  return (
    <div className="w-full bg-[#0a0a0c] border-y border-white/5 overflow-hidden flex whitespace-nowrap py-2">
      <div className="flex animate-marquee hover:[animation-play-state:paused] items-center">
        {duplicatedTokens.map((token, idx) => (
          <Link
            key={`${token.address}-${idx}`}
            href={`/trade/${token.address}`}
            className="flex items-center gap-2 px-6 py-1 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-white/10"
          >
            <img
              src={token.logoURI}
              alt={token.name}
              className="w-6 h-6 rounded-full group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`;
              }}
            />
            <span className="font-bold text-white/90">{token.symbol}</span>
            <span className="text-white/60 text-sm">
              ${(token.price ?? 0) < 0.01 ? (token.price ?? 0).toFixed(6) : (token.price ?? 0).toFixed(2)}
            </span>
            <span
              className={`text-sm font-medium ${
                (token.price24hChangePercent ?? 0) >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {(token.price24hChangePercent ?? 0) >= 0 ? "+" : ""}
              {(token.price24hChangePercent ?? 0).toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
