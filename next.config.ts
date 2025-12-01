import type { NextConfig } from "next";
const dotenv = require('dotenv');
const fs = require('fs');

const envFile = `.env.${process.env.SITE}`;

// Load the env file if it exists, overriding any existing values
if (fs.existsSync(envFile)) {
  console.log(`🔹 Loading env file: ${envFile}`);
  dotenv.config({ path: envFile, override: true });
} else if (process.env.SITE) {
  console.log(`⚠️  Warning: ${envFile} not found, but SITE=${process.env.SITE} is set`);
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
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
  distDir: `build/${process.env.SITE || 'local'}`,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    // optionally expose SITE, though that can be inferred
    NEXT_PUBLIC_SITE: process.env.SITE,
  },
};

export default nextConfig;
