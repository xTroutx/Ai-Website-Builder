import type { MetadataRoute } from "next";

/**
 * The app domain is the PRIVATE builder (login, editor, dashboard) — keep it out
 * of search indexes. Public, indexable per-tenant robots/sitemaps will be served
 * from each captain's site domain (subdomain) in a later phase.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
