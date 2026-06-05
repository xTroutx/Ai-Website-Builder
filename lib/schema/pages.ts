import { z } from "zod";
import { SlugSchema } from "./primitives";
import { SeoSchema } from "./seo";
import { SectionSchema } from "./sections";

/**
 * The 8 page types of the fishing niche. Each page is a discriminated-union
 * member keyed by `pageType`. Every page carries a slug, an SEO block, and an
 * ordered list of sections. Some types add a few typed fields that feed richer
 * structured data (e.g. a trip's price, a report's publish date).
 *
 * Routing (handled in /app):
 *   home     -> /
 *   trip     -> /trips/[slug]
 *   species  -> /species/[slug]
 *   location -> /locations/[slug]
 *   about    -> /about
 *   faq      -> /faq
 *   report   -> /reports/[slug]
 *   contact  -> /contact
 */

const pageBase = {
  /**
   * Page slug. For singletons (home/about/faq/contact) this is a fixed keyword
   * ("home", "about", ...). For repeatable types it's the URL segment.
   */
  slug: SlugSchema,
  seo: SeoSchema,
  sections: z.array(SectionSchema).default([]),
};

/** Home page. JSON-LD: LocalBusiness. */
export const HomePageSchema = z.object({
  ...pageBase,
  pageType: z.literal("home"),
});

/** A single trip/charter offering. JSON-LD: Service. */
export const TripPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("trip"),
  /** Starting price in whole USD — feeds the Service offer. */
  priceFrom: z.number().nonnegative().optional(),
  /** Human-readable duration, e.g. "4 hours", "Full day". */
  duration: z.string().optional(),
});

/** A target species page. JSON-LD: CollectionPage (or WebPage). */
export const SpeciesPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("species"),
  /** Latin name shown alongside the common name. */
  scientificName: z.string().optional(),
});

/** A fishing location/area page. JSON-LD: CollectionPage (or WebPage). */
export const LocationPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("location"),
});

/** About the captain/business. JSON-LD: AboutPage. */
export const AboutPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("about"),
});

/** FAQ page. JSON-LD: FAQPage (built from the faq section). */
export const FaqPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("faq"),
});

/** A fishing report / blog article. JSON-LD: Article. */
export const ReportPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("report"),
  /** Publish date, YYYY-MM-DD. Feeds Article datePublished. */
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
  /** Optional last-updated date, YYYY-MM-DD. */
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
    .optional(),
  /** Byline. Defaults to the captain at render time when omitted. */
  author: z.string().optional(),
  /** Short summary used in listings and the Article description. */
  excerpt: z.string().min(1),
});

/** Contact page. JSON-LD: ContactPage. */
export const ContactPageSchema = z.object({
  ...pageBase,
  pageType: z.literal("contact"),
});

/** The Page discriminated union. */
export const PageSchema = z.discriminatedUnion("pageType", [
  HomePageSchema,
  TripPageSchema,
  SpeciesPageSchema,
  LocationPageSchema,
  AboutPageSchema,
  FaqPageSchema,
  ReportPageSchema,
  ContactPageSchema,
]);

export type Page = z.infer<typeof PageSchema>;
export type PageType = Page["pageType"];

/** URL path prefix for each repeatable page type. */
export const PAGE_PATH_PREFIX: Record<PageType, string> = {
  home: "",
  trip: "/trips",
  species: "/species",
  location: "/locations",
  about: "/about",
  faq: "/faq",
  report: "/reports",
  contact: "/contact",
};

/** Build the canonical path (leading slash, no trailing slash) for a page. */
export function pagePath(page: Pick<Page, "pageType" | "slug">): string {
  switch (page.pageType) {
    case "home":
      return "/";
    case "about":
      return "/about";
    case "faq":
      return "/faq";
    case "contact":
      return "/contact";
    case "trip":
      return `/trips/${page.slug}`;
    case "species":
      return `/species/${page.slug}`;
    case "location":
      return `/locations/${page.slug}`;
    case "report":
      return `/reports/${page.slug}`;
  }
}
