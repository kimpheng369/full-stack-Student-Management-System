import type { NextConfig } from "next";

// Enable standalone mode ONLY when building for Docker / containerized environments.
// On Vercel, output should NOT be set to standalone as Vercel natively optimizes Next.js build output.
const isStandalone = process.env.BUILD_STANDALONE === "true" || process.env.DOCKER_BUILD === "true";

const nextConfig: NextConfig = {
  ...(isStandalone ? { output: "standalone" } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

