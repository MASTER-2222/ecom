import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out for server-side functionality
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
