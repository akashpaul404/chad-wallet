"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries, HistogramSeries, CrosshairMode } from "lightweight-charts";

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

export default function LightweightChart({
  tokenAddress,
  interval = "15m",
  mode = "price",
  tokenName = "",
  tokenSymbol = "",
  supply = 1,
}: {
  tokenAddress: string;
  interval?: string;
  mode?: "price" | "mcap";
  tokenName?: string;
  tokenSymbol?: string;
  supply?: number;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ohlc, setOhlc] = useState<{ o: number; h: number; l: number; c: number } | null>(null);

  const scale = mode === "mcap" ? supply : 1;

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
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // overlays on the chart without affecting primary Y scale
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // start volume bars at bottom 20%
        bottom: 0,
      },
    });

    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.get(series)) {
        const data = param.seriesData.get(series) as any;
        setOhlc({ o: data.open, h: data.high, l: data.low, c: data.close });
      }
    });

    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setRetrying(false);
        setError(null);

        const timeTo = Math.floor(Date.now() / 1000);
        // Window size: show ~100 candles based on interval
        const windowSeconds: Record<string, number> = {
          "1m": 100 * 60,
          "5m": 100 * 5 * 60,
          "15m": 100 * 15 * 60,
          "1H": 100 * 60 * 60,
          "4H": 100 * 4 * 60 * 60,
          "1D": 60 * 24 * 60 * 60,
          "1W": 365 * 24 * 60 * 60,
        };
        const timeFrom = timeTo - (windowSeconds[interval] ?? 100 * 15 * 60);

        const res = await fetchWithRetry(
          `https://public-api.birdeye.so/defi/ohlcv?address=${tokenAddress}&type=${interval}&time_from=${timeFrom}&time_to=${timeTo}`,
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
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
            open: item.o * scale,
            high: item.h * scale,
            low: item.l * scale,
            close: item.c * scale,
          }));
          
          const volumeData = json.data.items.map((item: any) => ({
            time: item.unixTime,
            value: item.v,
            color: item.c >= item.o ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)",
          }));

          series.setData(formattedData);
          volumeSeries.setData(volumeData);
          chart.timeScale().fitContent();

          if (formattedData.length > 0) {
            const last = formattedData[formattedData.length - 1];
            setOhlc({ o: last.open, h: last.high, l: last.low, c: last.close });
          }
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
  }, [tokenAddress, interval, mode, supply, scale]);

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
      
      {/* Floating Legend */}
      {!loading && ohlc && (
        <div className="absolute top-3 left-4 z-10 flex flex-col pointer-events-none">
          <div className="text-xs font-bold text-white mb-1">
            {tokenName} <span className="text-zinc-500 font-normal">· {tokenSymbol}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <span>O <span className={ohlc.o > ohlc.c ? "text-red-400" : "text-emerald-400"}>{ohlc.o.toPrecision(6)}</span></span>
            <span>H <span className={ohlc.o > ohlc.c ? "text-red-400" : "text-emerald-400"}>{ohlc.h.toPrecision(6)}</span></span>
            <span>L <span className={ohlc.o > ohlc.c ? "text-red-400" : "text-emerald-400"}>{ohlc.l.toPrecision(6)}</span></span>
            <span>C <span className={ohlc.o > ohlc.c ? "text-red-400" : "text-emerald-400"}>{ohlc.c.toPrecision(6)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
