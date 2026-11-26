import type { NextConfig } from "next";

/**
 * GitHub Pages serves the app from https://anseungki.github.io/crewlog/,
 * so the build needs a base path. Locally (npm run dev / plain build) it stays "".
 *   NEXT_PUBLIC_BASE_PATH=/crewlog npm run build
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // GitHub Pages is static hosting: no Next.js image optimizer available.
    unoptimized: true,
  },
};

export default nextConfig;
