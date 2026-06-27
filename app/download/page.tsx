"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DownloadPage() {
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      window.location.href = "https://apps.apple.com/us/app/chadwallet/id6757367474";
    }
    // Android detection
    else if (/android/i.test(userAgent)) {
      window.location.href = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
    }
    // Desktop or other
    else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <p className="text-xl font-medium opacity-70 animate-pulse">Redirecting to store...</p>
    </div>
  );
}
