import { readSite } from "./store";
import type { Site } from "./schema";

/**
 * The single seam through which the app loads Site JSON.
 *
 * Today it reads the file-backed working copy (seeded from the sample on first
 * run; see lib/store.ts), so click-to-edit changes persist and appear on the
 * public pages. Later this becomes a multi-tenant DB lookup (subdomain -> site
 * row -> parseSite(row.data)) — the call sites in /app never change, and the Zod
 * validation boundary stays in exactly the same place.
 */
export async function getSite(_slug?: string): Promise<Site> {
  // TODO(multi-tenant): resolve `_slug` (from the request subdomain) against the
  // `sites` table instead of the single file store.
  return readSite();
}

/** Convenience: the canonical absolute base URL for the active site. */
export async function getBaseUrl(slug?: string): Promise<string> {
  const site = await getSite(slug);
  return site.baseUrl;
}
