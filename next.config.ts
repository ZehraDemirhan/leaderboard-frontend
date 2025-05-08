import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',                               // catch all under /api/v1
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`
            }
        ]
    }
};

export default nextConfig;
