import type { NextConfig } from "next";
const dotenv = require('dotenv');
const fs = require('fs');

const envFile = `.env.${process.env.SITE || 'local'}`;

// Load the env file if it exists
if (fs.existsSync(envFile)) {
  console.log(`🔹 Loading env file: ${envFile}`);
  dotenv.config({ path: envFile });
}

const nextConfig: NextConfig = {
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    // optionally expose SITE, though that can be inferred
    NEXT_PUBLIC_SITE: process.env.SITE,
  },
};

export default nextConfig;
