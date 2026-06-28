"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 4): Promise<Response> {
  let delay = 1500; // start at 1.5s
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    if (attempt < maxRetries) {
      await sleep(delay);
      delay *= 2; // exponential: 1.5s → 3s → 6s → 12s
    }
  }
  // Return the last 429 response after exhausting retries
  return fetch(url, options);
}

export default function LightweightChart({ tokenAddress }: { tokenAddress: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.5)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setRetrying(false);
        setError(null);

        const timeTo = Math.floor(Date.now() / 1000);
        const timeFrom = timeTo - 25 * 60 * 60;

        setRetrying(false);

        const res = await fetchWithRetry(
          `https://public-api.birdeye.so/defi/ohlcv?address=${tokenAddress}&type=15m&time_from=${timeFrom}&time_to=${timeTo}`,
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
            cache: "force-cache",
            // @ts-ignore — Next.js extends fetch with 'next' option
            next: { revalidate: 60 },
          }
        );

        if (cancelled) return;

        if (res.status === 429) {
          setError("API rate limit reached. Please wait a few seconds and refresh.");
          return;
        }

        const json = await res.json();

        if (json.success && json.data?.items?.length > 0) {
          const formattedData = json.data.items.map((item: any) => ({
            time: item.unixTime,
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
          }));
          series.setData(formattedData);
          chart.timeScale().fitContent();
        } else {
          setError("No chart data available for this token.");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load chart data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRetrying(false);
        }
      }
    };

    fetchHistory();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [tokenAddress]);

  return (
    <div className="relative w-full h-full">
      {(loading || retrying) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#161618]/80 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
          <p className="text-white/50 text-sm font-medium">
            {retrying ? "Rate limited — retrying automatically…" : "Loading chart data…"}
          </p>
        </div>
      )}
      {error && !loading && !retrying && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#161618]">
          <div className="text-amber-400 text-sm font-medium bg-amber-400/10 px-4 py-2 rounded-lg border border-amber-400/20 max-w-xs text-center">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-white/40 hover:text-white/80 underline transition-colors"
          >
            Reload page
          </button>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
