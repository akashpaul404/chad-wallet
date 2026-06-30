"use client";

import React, { useState, useRef } from "react";
import LightweightChart from "./LightweightChart";
import TrendingTokensSidebar from "./TrendingTokensSidebar";
import JupiterTerminal from "./JupiterTerminal";
import SwapsTab from "./SwapsTab";
import BottomNav from "./BottomNav";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TokenOverview {
  name?: string;
  symbol?: string;
  logoURI?: string;
  price?: number;
  priceChange24h?: number;
  v24hChangePercent?: number;
  mc?: number;
  marketCap?: number;
  realMc?: number;
  v24hUSD?: number;
  liquidity?: number;
  holder?: number;
  extensions?: { [k: string]: string };
  decimals?: number;
  createdAt?: number;
  priceChange5mPercent?: number;
  priceChange1hPercent?: number;
  priceChange4hPercent?: number;
  priceChange24hPercent?: number;
  buy24h?: number;
  sell24h?: number;
  vBuy24hUSD?: number;
  vSell24hUSD?: number;
  numberMarkets?: number;
  uniqueWallet24h?: number;
}

interface Holder {
  owner?: string;
  address?: string;
  ui_amount?: number;
  percentage?: number;
}

interface Props {
  tokenAddress: string;
  overview: TokenOverview | null;
  holders: Holder[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | undefined, decimals = 2): string {
  if (n == null) return "—";
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(decimals)}K`;
  return `$${n.toFixed(decimals)}`;
}

function fmtPrice(price: number | undefined): string {
  if (price == null) return "—";
  if (price < 0.0001) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

function pctColor(val?: number) {
  if (val == null) return "text-zinc-400";
  return val >= 0 ? "text-emerald-400" : "text-red-400";
}

function pctFmt(val?: number): string {
  if (val == null) return "—";
  return `${val >= 0 ? "▲" : "▼"} ${Math.abs(val).toFixed(2)}%`;
}

function truncAddr(addr: string, head = 4, tail = 4): string {
  if (!addr) return "—";
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

const INTERVALS = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"] as const;
type Interval = (typeof INTERVALS)[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-1.5 bg-[#161522] rounded-xl shrink-0 min-w-[90px] cursor-grab active:cursor-grabbing">
      <span className="text-[11px] text-zinc-400 mb-0.5">{label}</span>
      <span className={`text-[13px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function HoldersTable({ holders }: { holders: Holder[] }) {
  if (!holders.length) {
    return (
      <div className="flex items-center justify-center h-24 text-zinc-500 text-sm">
        No holder data available
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        {/* <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors text-xs text-zinc-500">
          <input type="checkbox" className="w-3 h-3 accent-[#606AF7] rounded bg-zinc-800 border-zinc-700" />
          Min size (&gt;$1K)
        </label> */}
      </div>
      <table className="w-full text-left text-sm text-white/80">
      <thead className="text-zinc-500 text-xs border-b border-zinc-800">
        <tr>
          <th className="pb-2 font-medium w-8">Rank</th>
          <th className="pb-2 font-medium">Wallet</th>
          <th className="pb-2 font-medium text-right">Amount</th>
          <th className="pb-2 font-medium text-right">% Supply</th>
        </tr>
      </thead>
      <tbody>
        {holders.map((h, i) => {
          const owner = h.owner || h.address || "";
          const amount = h.ui_amount ?? 0;
          const pct = h.percentage ?? null;
          return (
            <tr key={`${owner}-${i}`} className="border-b border-zinc-800/60 hover:bg-white/[0.02] transition-colors">
              <td className="py-1.5 text-zinc-500">{i + 1}</td>
              <td className="py-1.5 font-mono text-xs">
                {truncAddr(owner, 6, 4)}
                {i === 0 && (
                  <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    Top
                  </span>
                )}
              </td>
              <td className="py-1.5 text-right">
                {amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              <td className="py-1.5 text-right">
                <span className={pct != null && pct > 5 ? "text-orange-400" : "text-white/70"}>
                  {pct != null ? (pct < 0.01 ? "<0.01%" : `${pct.toFixed(2)}%`) : "—"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
//
// Architecture (mirrors fomo.family):
//
//   outer-row  [flex row, overflow-hidden, fills viewport height after navbar]
//   ├── left-sidebar  [fixed width, independent overflow-y-auto]
//   └── scroll-area   [flex-1, flex row, overflow-y-auto, items-start]
//        ├── middle-col  [flex-1, flex col — content flows naturally, NO overflow constraint]
//        │    ├── token header  (natural height)
//        │    ├── stats bar     (natural height)
//        │    ├── timeframe bar (natural height)
//        │    ├── chart         (fixed h-[500px])
//        │    ├── tab bar       (natural height)
//        │    └── tab content   (natural height — holders/swaps/thesis)
//        └── right-col  [fixed width, sticky top-0 so it doesn't scroll away]
//             ├── buy/sell panel  (sticky)
//             └── jupiter         (scrolls with page below sticky panel)
//
// Key insight: scroll-area uses overflow-y-auto + items-start. The middle column
// content (header+stats+chart+holders) is taller than the viewport, so scroll-area
// becomes the scroll container. The right panel sticks to the top of the visible
// viewport area via `sticky top-0 self-start`. The left sidebar has its own
// independent scroll — it never participates in the shared scroll.

export default function TradeClientLayout({ tokenAddress, overview, holders }: Props) {
  const [interval, setInterval] = useState<Interval>("15m");
  const [chartMode, setChartMode] = useState<"price" | "mcap">("price");
  const [centerTab, setCenterTab] = useState<"Holders" | "Swaps" | "Thesis">("Holders");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const jupiterRef = useRef<HTMLDivElement>(null);

  const symbol = overview?.symbol ?? "TOKEN";
  const name = overview?.name ?? "Unknown Token";

  const [copied, setCopied] = useState(false);
  const copyAddr = () => {
    navigator.clipboard.writeText(tokenAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleTradeAction = () => {
    jupiterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const presets = ["$10", "$100", "$500", "$1000"];

  const top10Percent = holders?.slice(0, 10).reduce((sum, h) => sum + (h.percentage ?? 0), 0) ?? 0;
  const top10Display = top10Percent > 0 ? `${(top10Percent * 100).toFixed(2)}%` : "—";

  return (
    // ── OUTER ROW ─────────────────────────────────────────────────────────────
    // Use overflow-hidden to lock the page height to the screen, allowing internal scrolling
    <div className="flex flex-1 overflow-hidden p-3 gap-3 bg-transparent pb-11">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────────
          Independent scroll — completely isolated from the center/right scroll.
          h-full so it fills the viewport and sticky to stay in view. */}
      <aside className="w-[280px] min-w-[280px] shrink-0 h-full flex flex-col rounded-xl border border-zinc-800 bg-[#0a0a0f] overflow-hidden">
        <TrendingTokensSidebar />
      </aside>

      {/* ── SHARED AREA WRAPPER (middle + right + footer) ────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── SHARED SCROLL AREA (middle + right) ──────────────────────────────
            This is THE scroll container for both the chart/holders column and
            the right panel. It scrolls natively with the page. */}
        <div className="flex-1 flex overflow-y-auto overflow-x-hidden">

        {/* ── MIDDLE COLUMN ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">

          {/* ── TOKEN HEADER & STATS (Single Row) ───────────────────────────── */}
          <div className="shrink-0 flex items-center px-4 py-2 gap-6 bg-transparent overflow-hidden border-b border-zinc-900/50">
            {/* Token Info (Fixed) */}
            <div className="shrink-0 flex items-center gap-3">
              {overview?.logoURI ? (
                <img src={overview.logoURI} alt={symbol} className="w-10 h-10 rounded-full shrink-0" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}`} alt={symbol} className="w-10 h-10 rounded-full shrink-0" />
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-lg leading-tight uppercase">{symbol}</span>
                  {overview?.extensions?.twitter && (
                    <a href={overview.extensions.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#cbd0eb1a] rounded p-1.5 text-zinc-400 hover:text-white transition-colors" title="Twitter">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {overview?.extensions?.telegram && (
                    <a href={overview.extensions.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#cbd0eb1a] rounded p-1.5 text-zinc-400 hover:text-white transition-colors" title="Telegram">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 1 0 24 12 12 12 0 0 0 11.944 0zm5.992 8.17-1.975 9.31c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.66 13.64l-2.968-.924c-.643-.204-.658-.643.136-.953l11.565-4.461c.537-.194 1.006.12.543 1.867z"/></svg>
                    </a>
                  )}
                  {overview?.extensions?.website && (
                    <a href={overview.extensions.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center bg-[#cbd0eb1a] rounded p-1.5 text-zinc-400 hover:text-white transition-colors" title="Website">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] text-zinc-400">{name}</span>
                  <span className="text-zinc-700 mx-0.5">|</span>
                  <span className="font-mono text-[11px] text-zinc-500">{truncAddr(tokenAddress, 6, 6)}</span>
                  <button onClick={copyAddr} className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Copy contract address">
                    {copied ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats (Scrollable) */}
            <div className="flex-1 flex items-stretch overflow-x-auto hover-scrollbar gap-2 px-1">
              <StatCell label="Market cap" value={fmt(overview?.mc ?? overview?.marketCap ?? overview?.realMc)} />
              <StatCell label="Price" value={fmtPrice(overview?.price)} />
              <StatCell
                label="24H change"
                value={pctFmt(overview?.priceChange24h ?? overview?.v24hChangePercent)}
                valueClass={pctColor(overview?.priceChange24h ?? overview?.v24hChangePercent)}
              />
              <StatCell label="24H Vol." value={fmt(overview?.v24hUSD)} />
              <StatCell label="Liquidity" value={fmt(overview?.liquidity)} />
              <StatCell label="Holders" value={overview?.holder?.toLocaleString("en-US") ?? "—"} />
              <StatCell label="Top 10" value={top10Display} />
            </div>
          </div>

          {/* Timeframe Selector & Price/MCap toggle */}
          <div className="shrink-0 flex items-center justify-between px-3 pt-3 pb-2 bg-transparent">
            <div className="flex items-center gap-1">
              {INTERVALS.map((iv) => (
                <button
                  key={iv}
                  onClick={() => setInterval(iv)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    interval === iv
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {iv}
                </button>
              ))}
            </div>
            
            {/* Price / MCap Toggle */}
            <div className="flex items-center bg-[#111118] rounded-full p-1 border border-zinc-800">
              <button
                onClick={() => setChartMode("price")}
                className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
                  chartMode === "price" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setChartMode("mcap")}
                className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
                  chartMode === "mcap" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                MCap
              </button>
            </div>
          </div>

          {/* Chart — Fixed height for scrollable layout */}
          <div className="h-[300px] shrink-0 mx-3 mb-3  overflow-hidden">
            <LightweightChart 
              tokenAddress={tokenAddress} 
              interval={interval} 
              mode={chartMode}
              tokenName={name}
              tokenSymbol={symbol}
              supply={(overview?.mc ?? overview?.marketCap ?? overview?.realMc ?? 0) / (overview?.price ?? 1)}
            />
          </div>


          {/* Holders / Swaps / Thesis tab bar */}
          <div className="shrink-0 flex items-center gap-6 px-4 bg-transparent">
            {(["Holders", "Swaps", "Thesis"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCenterTab(tab)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  centerTab === tab
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="shrink-0 flex items-center gap-4 px-4 py-3 bg-transparent text-xs text-zinc-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors">
              <input type="checkbox" className="w-3 h-3 accent-[#606AF7] rounded bg-zinc-800 border-zinc-700" />
              My swaps
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors">
              <input type="checkbox" className="w-3 h-3 accent-[#606AF7] rounded bg-zinc-800 border-zinc-700" />
              Thesis
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors">
              <input type="checkbox" className="w-3 h-3 accent-[#606AF7] rounded bg-zinc-800 border-zinc-700" />
              Friends only
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors">
              <input type="checkbox" className="w-3 h-3 accent-[#606AF7] rounded bg-zinc-800 border-zinc-700" />
              Min size (&gt;$1K)
            </label>
            <span className="flex-1" />
            <button className="hover:text-white transition-colors flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter
            </button>
          </div>

          {/* Tab content — naturally expanding height */}
          <div className="p-2 bg-transparent">
            {centerTab === "Holders" && <HoldersTable holders={holders} />}
            {centerTab === "Swaps" && <SwapsTab tokenAddress={tokenAddress} />}
            {centerTab === "Thesis" && (
              <div className="flex items-center justify-center h-24 text-zinc-500 text-sm">
                Thesis coming soon
              </div>
            )}
          </div>
        </div>
        {/* END middle-col */}

        {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
        <aside className="w-[280px] min-w-[280px] shrink-0 h-max flex flex-col gap-4">

          {/* Buy / Sell tabs */}
          

          {/* Amount input */}
          <div className=" rounded-lg p-2 flex flex-col gap-3 border border-zinc-800 shadow-2xl ">
            <div className="flex rounded-lg p-1 shrink-0">
            <button
              onClick={() => setSide("buy")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                side === "buy"
                  ? "bg-[#21c95e33] text-green-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                side === "sell"
                  ? "bg-[#ef444433] text-red-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Sell
            </button>
          </div>
            <div className="flex items-center gap-2 bg-[#12111a] rounded-lg px-4 py-3">
              <span className="text-zinc-500 text-lg font-semibold">$</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-xl font-bold placeholder-zinc-600 outline-none"
              />
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.replace("$", ""))}
                  className="py-2 rounded-lg bg-[#12111a] hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Balance */}
            <div className="text-xs text-zinc-500">$0 available</div>

            {/* Action button — scrolls down to Jupiter */}
            <button
              onClick={handleTradeAction}
              className={`w-full py-3 rounded-lg text-sm font-bold transition-all bg-gray-800 border-gray-700 border ${
                side === "buy"
                  // ? "bg-green-500 hover:bg-green-400 text-white"
                  // : "bg-red-500 hover:bg-red-400 text-white"
              }`}
            >
              {side === "buy" ? `Buy ${symbol}` : `Sell ${symbol}`}
            </button>
          </div>

          {/* Unified About Card */}
          <div className="bg-[#0b0a11] rounded-xl border border-zinc-800 p-3 pb-6 mb-4 relative flex flex-col gap-5">
            
            {/* Header & Text */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">About {symbol}</h3>
              <div className="flex items-center text-[13px] text-zinc-400">
                <span className="truncate">{name} ({symbol}) is the native, decentralized digital currency of the {name} blockchain, enabling peer-to-peer, borderless transactions</span>
                <span className="text-zinc-500 cursor-pointer hover:text-white transition-colors font-medium whitespace-nowrap ml-1">... Read more</span>
              </div>
            </div>
            
            {/* Price Change Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "5M", val: overview?.priceChange5mPercent },
                { label: "1H", val: overview?.priceChange1hPercent },
                { label: "4H", val: overview?.priceChange4hPercent },
                { label: "1D", val: overview?.priceChange24hPercent ?? overview?.priceChange24h },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col bg-[#161522] rounded-lg py-2 px-1 border border-zinc-800/50">
                  <span className="text-[11px] text-zinc-300 mb-1">{label}</span>
                  <span className={`text-[11px] font-bold flex items-center justify-center gap-0.5 ${pctColor(val)}`}>
                    {pctFmt(val)}
                  </span>
                </div>
              ))}
            </div>

            {/* Buy / sell stats with bars */}
            <div className="flex flex-col gap-4">
              {/* Buys/Sells */}
              <div>
                <div className="flex justify-between items-center text-[13px] font-bold mb-1.5">
                  <span className="text-white">{(overview?.buy24h ?? 321).toLocaleString("en-US")} <span className="text-zinc-500 font-normal text-xs ml-0.5">buys</span></span>
                  <span className="text-white">{(overview?.sell24h ?? 262).toLocaleString("en-US")} <span className="text-zinc-500 font-normal text-xs ml-0.5">sells</span></span>
                </div>
                <div className="flex gap-1 h-1.5">
                  <div className="bg-emerald-500 rounded-full h-full" style={{ width: `${((overview?.buy24h ?? 321) / (((overview?.buy24h ?? 321) + (overview?.sell24h ?? 262)) || 1)) * 100}%` }} />
                  <div className="bg-orange-500 rounded-full h-full" style={{ width: `${((overview?.sell24h ?? 262) / (((overview?.buy24h ?? 321) + (overview?.sell24h ?? 262)) || 1)) * 100}%` }} />
                </div>
              </div>
              
              {/* Vol */}
              <div>
                <div className="flex justify-between items-center text-[13px] font-bold mb-1.5">
                  <span className="text-white">{fmt(overview?.vBuy24hUSD ?? 321700)} <span className="text-zinc-500 font-normal text-xs ml-0.5">vol.</span></span>
                  <span className="text-white">{fmt(overview?.vSell24hUSD ?? 282200)} <span className="text-zinc-500 font-normal text-xs ml-0.5">vol.</span></span>
                </div>
                <div className="flex gap-1 h-1.5">
                  <div className="bg-emerald-500 rounded-full h-full" style={{ width: `${((overview?.vBuy24hUSD ?? 321700) / (((overview?.vBuy24hUSD ?? 321700) + (overview?.vSell24hUSD ?? 282200)) || 1)) * 100}%` }} />
                  <div className="bg-orange-500 rounded-full h-full" style={{ width: `${((overview?.vSell24hUSD ?? 282200) / (((overview?.vBuy24hUSD ?? 321700) + (overview?.vSell24hUSD ?? 282200)) || 1)) * 100}%` }} />
                </div>
              </div>
              
              {/* Buyers/Sellers */}
              <div>
                <div className="flex justify-between items-center text-[13px] font-bold mb-1.5">
                  <span className="text-white">{Math.floor((overview?.buy24h ?? 321) * 0.15) || 45} <span className="text-zinc-500 font-normal text-xs ml-0.5">buyers</span></span>
                  <span className="text-white">{Math.floor((overview?.sell24h ?? 262) * 0.15) || 37} <span className="text-zinc-500 font-normal text-xs ml-0.5">sellers</span></span>
                </div>
                <div className="flex gap-1 h-1.5">
                  <div className="bg-emerald-500 rounded-full h-full" style={{ width: '55%' }} />
                  <div className="bg-orange-500 rounded-full h-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
            
            {/* Token Info rows */}
            <div className="flex flex-col text-xs mt-1">
              <div className="flex justify-between items-center py-2.5 border-b border-dashed border-zinc-800/80">
                <span className="text-zinc-500">Supply</span>
                <span className="text-zinc-200 font-bold">{overview?.mc && overview?.price ? fmt(overview.mc / overview.price) : "19.8M"}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-dashed border-zinc-800/80">
                <span className="text-zinc-500">Network</span>
                <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                   <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=032" className="w-3 h-3 grayscale opacity-70" /> Solana
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-dashed border-zinc-800/80">
                <span className="text-zinc-500">Created</span>
                <span className="text-zinc-200 font-bold">1 year ago</span>
              </div>
              <div className="flex justify-between items-center pt-2.5">
                <span className="text-zinc-500">Contract address</span>
                <div className="text-zinc-200 font-bold flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={copyAddr}>
                  {truncAddr(tokenAddress, 6, 6)}
                  <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </div>
              </div>
            </div>

            {/* View less button */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <button className="bg-[#161522] text-zinc-400 hover:text-white px-3 py-1 rounded-lg text-xs font-semibold border border-zinc-800 transition-colors shadow-lg shadow-black/50">
                View less
              </button>
            </div>
          </div>

          {/* Jupiter Terminal — sits below the sticky panel content */}
          {/* <div ref={jupiterRef} className="bg-[#161522] rounded-xl overflow-hidden mt-4 shrink-0">
            <JupiterTerminal tokenAddress={tokenAddress} />
          </div> */}

          {/* Your positions */}
          <div className="bg-[#161522] rounded-xl p-2 mt-4 shrink-0 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">Your positions</h3>
            <div className="flex items-center justify-center py-6 text-xs text-zinc-500">
              No open positions
            </div>
          </div>
        </aside>
        {/* END right-panel */}

        </div>
        {/* END scroll-area */}

        {/* FOOTER NAV */}
        <BottomNav />

      </div>
      {/* END shared-area-wrapper */}

    </div>
    // END outer-row
  );
}
