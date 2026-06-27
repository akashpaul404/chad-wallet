import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90, 100],
  },
  transpilePackages: ['@vercel/speed-insights'],
};

export default nextConfig;
