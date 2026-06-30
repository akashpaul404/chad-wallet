"use client";

import React from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function TradeNavbar() {
  const { login, logout, authenticated, user } = usePrivy();

  // Helper to get display name from user object
  const getDisplayName = () => {
    if (!user) return "";
    if (user.email) return user.email.address;
    if (user.wallet) {
      const address = user.wallet.address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return "Authenticated";
  };

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 py-3 w-full bg-[#060510] border-b border-zinc-800 shrink-0">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          <img src="/assets/logo/light.png" alt="ChadWallet Logo" className="h-[1em] w-auto" />
          ChadWallet
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-[400px] mx-auto hidden md:block">
        <div className="relative flex items-center w-full">
          <svg className="absolute left-3 w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for tokens or traders..." 
            className="w-full bg-zinc-900 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 border border-transparent focus:border-zinc-700 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Auth & Profile */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        {authenticated ? (
          <>
            {/* Balance Pill with hover dropdown */}
            <div className="relative group cursor-pointer">
              <div className="bg-[#12111a] border border-zinc-800 hover:bg-[#161522] h-9 px-4 rounded-lg flex items-center justify-center font-bold text-white transition-all text-sm">
                $0.00
              </div>
              <div className="absolute top-full right-0 mt-2 w-40 bg-[#12111a] border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                <button className="text-left px-4 py-2 text-sm text-white hover:bg-[#161522] transition-colors">Deposit</button>
                <button className="text-left px-4 py-2 text-sm text-white hover:bg-[#161522] transition-colors">Withdraw</button>
              </div>
            </div>

            {/* Profile Pill with hover dropdown */}
            <div className="relative group cursor-pointer">
              <div className="bg-[#12111a] border border-zinc-800 hover:bg-[#161522] h-9 px-4 rounded-lg flex items-center justify-center font-bold text-white transition-all text-sm gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
                {getDisplayName()}
              </div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#12111a] border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                <button className="text-left px-4 py-2 text-sm text-white hover:bg-[#161522] transition-colors">Your Profile</button>
                <button className="text-left px-4 py-2 text-sm text-white hover:bg-[#161522] transition-colors">Manage Account</button>
                <div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-widest border-t border-zinc-800">Coming Soon</div>
                <button 
                  onClick={logout}
                  className="text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-zinc-800"
                >
                  Log Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={login}
            className="bg-[#12111a] border border-zinc-800 hover:bg-[#161522] h-9 px-5 rounded-lg font-bold text-white transition-all text-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
