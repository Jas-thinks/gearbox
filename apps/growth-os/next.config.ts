import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@gearbox/config", "@gearbox/types", "@gearbox/utils"],
};

export default nextConfig;
