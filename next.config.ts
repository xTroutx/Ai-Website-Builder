import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma + the pg driver out of the bundle; load them as native Node
  // modules on the server (required for the driver adapter to work on Vercel).
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
