"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

interface StartTradingButtonProps {
  className?: string;
}

export default function StartTradingButton({ className }: StartTradingButtonProps) {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  const handleStartTrading = () => {
    if (authenticated) {
      router.push("/trade/So11111111111111111111111111111111111111112");
    } else {
      login();
    }
  };

  return (
    <button 
      onClick={handleStartTrading}
      className={`px-8 py-4 bg-[#606AF780] hover:bg-[#606AF7] text-white text-lg font-semibold rounded-2xl transition-all duration-200 ${className || ''}`}
    >
      Start trading
    </button>
  );
}
