"use client";

import React, { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

declare global {
  interface Window {
    Jupiter: any;
  }
}

export default function JupiterTerminal({ tokenAddress }: { tokenAddress: string }) {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    const scriptId = "jup-terminal-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initJup = () => {
      if (!window.Jupiter) return;

      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "https://api.mainnet-beta.solana.com",
        strictTokenList: false,
        // Allow Jupiter to show its own wallet connect UI so users can connect
        enableWalletPassthrough: false,
        formProps: {
          initialOutputMint: tokenAddress,
          initialInputMint: "So11111111111111111111111111111111111111112",
          fixedOutputMint: true,
        },
        onSuccess: ({ txid }: { txid: string }) => {
        },
      });
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      // Use the latest stable Jupiter Terminal bundle (v4 is current for integrated mode)
      script.src = "https://terminal.jup.ag/main-v4.js";
      script.async = true;
      script.onload = () => setTimeout(initJup, 200);
      document.head.appendChild(script);
    } else if (window.Jupiter) {
      // Script already loaded — just re-init with the new token
      setTimeout(initJup, 100);
    } else {
      // Script tag exists but not loaded yet — wait
      script.addEventListener("load", () => setTimeout(initJup, 200));
    }
  }, [tokenAddress]);

  return (
    <div className="w-full bg-[#161618]">
      {!authenticated && (
        <div className="p-4 text-center border-b border-white/5">
          <p className="text-sm text-yellow-400/80 bg-yellow-400/10 px-4 py-2 rounded-lg inline-block">
            Sign in to execute trades faster — or connect a wallet below
          </p>
        </div>
      )}
      <div
        id="integrated-terminal"
        className="w-full min-h-[520px]"
      />
    </div>
  );
}
