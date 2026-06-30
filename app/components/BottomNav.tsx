"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price?: number;
  price24hChangePercent?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let delay = 1500;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status !== 429) return res;
    } catch (e) {
      // Network error (CORS, offline, etc.)
      if (attempt === maxRetries) throw e;
    }
    if (attempt < maxRetries) {
      await sleep(delay);
      delay *= 2;
    }
  }
  throw new Error("Max retries reached");
}

export default function BottomNav() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTokens() {
      try {
        const res = await fetchWithRetry(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
          {}
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        if (!cancelled) {
          const mapped = [
            {
              id: "bitcoin",
              symbol: "BTC",
              name: "Bitcoin",
              logoURI: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032",
              address: "3NZ9JMVBmO8E6sEQ"
            },
            {
              id: "ethereum",
              symbol: "ETH",
              name: "Ethereum",
              logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032",
              address: "7vfCXTUXx5WJV5J" 
            },
            {
              id: "solana",
              symbol: "SOL",
              name: "Solana",
              logoURI: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=032",
              address: "So11111111111111111111111111111111111111112"
            }
          ].map(coin => ({
            ...coin,
            price: json[coin.id]?.usd || 0,
            price24hChangePercent: json[coin.id]?.usd_24h_change || 0
          }));
          setTokens(mapped);
        }
      } catch (err) {
        console.error("BottomNav fetch error:", err);
        // Fallback to static mock data if CoinGecko is blocked by CORS or rate limits
        if (!cancelled) {
          setTokens([
            { address: "btc", symbol: "BTC", name: "Bitcoin", logoURI: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032", price: 60407.09, price24hChangePercent: 1.28 },
            { address: "eth", symbol: "ETH", name: "Ethereum", logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032", price: 1622.23, price24hChangePercent: 3.33 },
            { address: "sol", symbol: "SOL", name: "Solana", logoURI: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=032", price: 75.60, price24hChangePercent: 6.62 },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTokens();
    const interval = setInterval(fetchTokens, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-3 bg-[#0b0a11] border-t border-[#161522] text-xs select-none overflow-hidden">
      
      {/* Left: Ticker */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1 flex-1 mask-linear-right">
        {loading ? (
          <div className="text-zinc-600 animate-pulse font-medium">Loading ticker...</div>
        ) : (
          tokens.map((token, idx) => (
            <Link
              key={token.address + idx}
              href={`/trade/${token.address}`}
              className="flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-80"
            >
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-4 h-4 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`;
                }}
              />
              {/* <span className="font-semibold text-zinc-400">{token.symbol}</span> */}
              <span className="font-semibold text-zinc-100">${token.price ? token.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</span>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold ${
                (token.price24hChangePercent ?? 0) >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                <span>{(token.price24hChangePercent ?? 0) >= 0 ? "▲" : "▼"}</span>
                <span>{Math.abs(token.price24hChangePercent ?? 0).toFixed(2)}%</span>
              </span>
            </Link>
          ))
        )}
      </div>

      {/* Right: Status and Links */}
      <div className="flex items-center gap-3 text-zinc-500 font-medium shrink-0 ml-6 bg-[#0b0a11] pl-4">
        {/* Network Status */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>Stable</span>
        </div>
        
        <span className="text-zinc-700">·</span>
        <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors">Privacy</Link>
        
        <span className="text-zinc-700">·</span>
        <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors">Terms</Link>
        
        <span className="text-zinc-700">·</span>
        <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors">Help</Link>
        
        {/* Social Links */}
        <div className="flex items-center gap-2 ml-1 text-zinc-500">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-opacity">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
