import type { NextConfig } from "next";

const API = process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.akobot.in";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: API,
    NEXT_PUBLIC_PAYMENT_GATEWAY: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "razorpay",
  },
  async rewrites() {
    return [
      { source: "/api/auth/:path*", destination: `${API}/auth/:path*` },
      { source: "/api/admin/:path*", destination: `${API}/api/admin/:path*` },
      { source: "/api/main/:path*", destination: `${API}/:path*` },
      { source: "/api/packages", destination: `${API}/api/packages` },
      { source: "/api/packages/:path*", destination: `${API}/api/packages/:path*` },
      { source: "/api/payment/:path*", destination: `${API}/api/payment/:path*` },
      { source: "/api/apimodule/:path*", destination: `${API}/:path*` },
      { source: "/api/provider/:path*", destination: `${API}/:path*` },
    ];
  },
};

export default nextConfig;
