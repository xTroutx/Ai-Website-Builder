import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";
import { pagePath } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";

/**
 * sitemap.xml, generated from the Site JSON. Every indexable page is listed with
 * a sensible priority/changeFrequency derived from its type; noindex pages are
 * excluded. Reports use their publish/update date as lastModified.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();

  const priorityByType: Record<string, number> = {
    home: 1,
    trip: 0.9,
    species: 0.7,
    location: 0.7,
    about: 0.6,
    contact: 0.6,
    faq: 0.6,
    report: 0.5,
  };

  return site.pages
    .filter((page) => !page.seo.noindex)
    .map((page) => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: absoluteUrl(site, pagePath(page)),
        changeFrequency: page.pageType === "report" ? "monthly" : "weekly",
        priority: priorityByType[page.pageType] ?? 0.5,
      };
      if (page.pageType === "report") {
        entry.lastModified = new Date(page.updatedAt ?? page.publishedAt);
      }
      return entry;
    });
}
