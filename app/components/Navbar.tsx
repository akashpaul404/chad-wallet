"use client";

import React from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Navbar() {
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
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          <img src="/assets/logo/light.png" alt="ChadWallet Logo" className="h-[1em] w-auto" />
          ChadWallet
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <a href="https://apps.apple.com/us/app/chadwallet/id6757367474" target="_blank" rel="noopener noreferrer" className="hidden md:block opacity-80 hover:opacity-100 transition-opacity">
          <img src="/assets/badges/appstore.svg" alt="Download on the App Store" className="h-10 w-auto" />
        </a>

        <a href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www" target="_blank" rel="noopener noreferrer" className="hidden md:block opacity-80 hover:opacity-100 transition-opacity">
          <img src="/assets/badges/playstore.svg" alt="Get it on Google Play" className="h-10 w-auto" />
        </a>

        {authenticated ? (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm font-medium text-white/80 hidden sm:block px-3 py-2 bg-white/5 rounded-full">
              {getDisplayName()}
            </span>
            <button
              onClick={logout}
              className="bg-[#12111a] ring ring-[#cbd0eb1a] hover:bg-[#12111a]/80 h-10 px-5 rounded-lg font-bold text-white transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-[#12111a] ring ring-[#cbd0eb1a] hover:bg-[#12111a]/80 h-10 px-5 rounded-lg font-bold text-white transition-all text-sm ml-2"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
