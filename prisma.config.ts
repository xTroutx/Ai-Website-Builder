import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 configuration. The datasource URL lives here (no longer in
 * schema.prisma). Migration/introspection commands need a real DATABASE_URL;
 * the runtime client connects via a driver adapter (lib/db.ts).
 *
 * We read process.env directly (not the throwing `env()` helper) with a harmless
 * placeholder fallback, so `prisma generate` works even when DATABASE_URL is
 * unset (local dev runs the file store until Neon is configured). Migrate/seed
 * still require a real DATABASE_URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
