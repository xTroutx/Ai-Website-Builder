import type { Site } from "./schema";

/**
 * Persistence dispatcher.
 *
 * - DATABASE_URL set  -> Postgres (store-db) — production / Vercel, and locally
 *   once Neon is configured.
 * - DATABASE_URL unset -> file store (store-file) — local dev with no DB.
 *
 * Dynamic imports keep the Prisma/pg code (and its DATABASE_URL requirement) out
 * of the file-store path entirely. getSite()/writeSite callers don't change.
 */
const useDb = Boolean(process.env.DATABASE_URL);

export async function readSite(): Promise<Site> {
  const mod = useDb ? await import("./store-db") : await import("./store-file");
  return mod.readSite();
}

export async function writeSite(site: Site): Promise<void> {
  const mod = useDb ? await import("./store-db") : await import("./store-file");
  return mod.writeSite(site);
}
