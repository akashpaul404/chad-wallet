"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function HeroButtons() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrUrl(`${window.location.origin}/download`);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowQR(false);
      }
    };
    if (showQR) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQR]);

  const handleStartTrading = () => {
    if (authenticated) {
      router.push("/trade/So11111111111111111111111111111111111111112");
    } else {
      login();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 relative">
      <button 
        onClick={handleStartTrading}
        className="px-8 py-4 w-full sm:w-auto bg-[#606AF780] hover:bg-[#606AF7] text-white text-lg font-semibold rounded-2xl transition-all duration-200"
      >
        Start trading
      </button>
      
      <div className="relative w-full sm:w-auto" ref={popoverRef}>
        <button 
          onClick={() => setShowQR(!showQR)}
          className="px-8 py-4 w-full sm:w-auto bg-[#232325] hover:bg-[#2a2a2c] text-white text-lg font-semibold rounded-2xl transition-all duration-200 border border-white/5 text-center"
        >
          Download app
        </button>

        {showQR && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 p-6 bg-[#161618] border border-white/10 rounded-[28px] shadow-2xl z-[100] flex flex-col items-center w-56">
            <div className="bg-white p-3 rounded-2xl mb-4">
              {qrUrl && <QRCode value={qrUrl} size={150} level="H" bgColor="#ffffff" fgColor="#000000" />}
            </div>
            <p className="text-white/80 font-medium text-sm text-center">Scan to download</p>
          </div>
        )}
      </div>
    </div>
  );
}
