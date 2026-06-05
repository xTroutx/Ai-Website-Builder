import { sampleSite } from "./sample";
import type { Site } from "./schema";

/**
 * The single seam through which the app loads Site JSON.
 *
 * Today it returns the in-code, Zod-validated sample. Later this becomes a
 * multi-tenant DB lookup (subdomain -> site row -> parseSite(row.data)) — the
 * call sites in /app never change, and the Zod validation boundary stays in
 * exactly the same place.
 */
export async function getSite(_slug?: string): Promise<Site> {
  // TODO(multi-tenant): resolve `_slug` (from the request subdomain) against the
  // `sites` table and parseSite() the stored JSON. For now, one sample site.
  return sampleSite;
}

/** Convenience: the canonical absolute base URL for the active site. */
export async function getBaseUrl(slug?: string): Promise<string> {
  const site = await getSite(slug);
  return site.baseUrl;
}
