import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/leaderboard/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/:path*`
            }
        ]
    }
};

export default nextConfig;
