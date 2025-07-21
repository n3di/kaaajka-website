import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.7tv.app',
      },
      {
        protocol: 'https',
        hostname: 'tipply.pl',
      },
    ],
  },
};

export default nextConfig;