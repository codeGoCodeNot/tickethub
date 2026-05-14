import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 3600,
    },
  },
};

export default nextConfig;
