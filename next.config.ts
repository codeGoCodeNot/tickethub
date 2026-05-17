import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    staleTimes: {
      dynamic: 60 * 5,
      static: 3600,
    },
  },
};

export default nextConfig;
