import type { Metadata } from "next";
import type { Page, Site } from "../schema";
import { pagePath, PAGE_PATH_PREFIX } from "../schema";

/** Absolute URL for a page on the site. */
export function absoluteUrl(site: Site, path: string): string {
  return new URL(path, site.baseUrl).toString();
}

/** Canonical path for a page, honoring an SEO canonicalSlug override. */
function canonicalPath(page: Page): string {
  const override = page.seo.canonicalSlug;
  if (!override) return pagePath(page);
  // Re-attach the type's URL prefix to the overridden slug.
  const prefix = PAGE_PATH_PREFIX[page.pageType];
  return prefix ? `${prefix}/${override}` : pagePath(page);
}

/**
 * Build Next.js `Metadata` for a page entirely from its SEO block + the site.
 * Produces <title>, description, canonical, Open Graph, Twitter card, and robots
 * directives. No <head> is ever hand-written.
 */
export function buildMetadata(site: Site, page: Page): Metadata {
  const { seo } = page;
  const url = absoluteUrl(site, canonicalPath(page));

  // Only emit an OG image when there's a real asset (placeholders have empty src).
  const ogImageSource = seo.ogImage ?? site.defaultOgImage;
  const images =
    ogImageSource && ogImageSource.src
      ? [
          {
            url: ogImageSource.src,
            alt: ogImageSource.alt,
            ...(ogImageSource.width ? { width: ogImageSource.width } : {}),
            ...(ogImageSource.height ? { height: ogImageSource.height } : {}),
          },
        ]
      : undefined;

  const isReport = page.pageType === "report";

  return {
    title: seo.titleTag,
    description: seo.metaDescription,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: { canonical: url },
    robots: seo.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: seo.titleTag,
      description: seo.metaDescription,
      url,
      type: isReport ? "article" : "website",
      ...(isReport && page.pageType === "report"
        ? {
            publishedTime: page.publishedAt,
            modifiedTime: page.updatedAt,
            authors: [page.author ?? site.profile.captainName],
          }
        : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titleTag,
      description: seo.metaDescription,
      ...(images ? { images } : {}),
    },
  };
}
