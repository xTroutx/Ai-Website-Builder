import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 configuration. The datasource URL lives here (no longer in
 * schema.prisma) and is read from DATABASE_URL. Used by migration/introspection
 * commands; the runtime client connects via a driver adapter instead.
 *
 * No live database is required this session — the renderer reads the in-code
 * sample. When wiring persistence: set DATABASE_URL, run `prisma migrate dev`,
 * then seed.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
