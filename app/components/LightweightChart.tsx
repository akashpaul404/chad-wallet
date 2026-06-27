"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

export default function LightweightChart({ tokenAddress }: { tokenAddress: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
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
      upColor: "#10b981", // emerald-500
      downColor: "#ef4444", // red-500
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Fetch 15m candles for the last 100 candles (25 hours) from BirdEye
        const timeTo = Math.floor(Date.now() / 1000);
        const timeFrom = timeTo - 25 * 60 * 60; // 25 hours ago
        
        const res = await fetch(
          `https://public-api.birdeye.so/defi/ohlcv?address=${tokenAddress}&type=15m&time_from=${timeFrom}&time_to=${timeTo}`,
          {
            headers: {
              "x-chain": "solana",
              "X-API-KEY": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "",
            },
          }
        );

        const json = await res.json();
        
        if (json.success && json.data?.items) {
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
          setError("No historical data available");
        }
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setError("Failed to load chart");
      } finally {
        setLoading(false);
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
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [tokenAddress]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#161618]/80 backdrop-blur-sm">
          <div className="text-white/50 text-sm font-medium animate-pulse">Loading chart data...</div>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#161618]">
          <div className="text-red-400 text-sm font-medium bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
