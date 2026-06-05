import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * robots.txt, generated from the Site JSON. Allows all crawlers and points to
 * the auto-generated sitemap on the site's own base URL.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl(site, "/sitemap.xml"),
    host: site.baseUrl,
  };
}
