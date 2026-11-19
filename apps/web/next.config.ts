import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle → tiny Docker image for ECS Fargate.
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  poweredByHeader: false,
  compress: true,
  transpilePackages: [
    "@gearbox/config",
    "@gearbox/infra",
    "@gearbox/database",
    "@gearbox/types",
    "@gearbox/utils",
    "@gearbox/ui",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
