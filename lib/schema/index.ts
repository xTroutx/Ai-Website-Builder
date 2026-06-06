/**
 * The Site JSON schema — the source of truth for FishySites.
 *
 * The AI and the editor only ever produce/mutate data that validates against
 * `SiteSchema`. Templates render exclusively from a parsed `Site`. If something
 * can't be expressed here, it's out of scope for the AI by design.
 */
import { SiteSchema, type Site } from "./site";
import { type Page, type PageType } from "./pages";

export * from "./primitives";
export * from "./seo";
export * from "./sections";
export * from "./pages";
export * from "./site";

/**
 * Parse + validate unknown data into a `Site`. Throws (with rich Zod errors) on
 * invalid input. Use this at every boundary where Site JSON enters the system
 * (DB read, AI tool-call output, imported file).
 */
export function parseSite(data: unknown): Site {
  return SiteSchema.parse(data);
}

/** Non-throwing variant returning Zod's SafeParse result. */
export function safeParseSite(data: unknown) {
  return SiteSchema.safeParse(data);
}

/** Find the (single) home page. */
export function getHomePage(site: Site): Extract<Page, { pageType: "home" }> {
  const home = site.pages.find((p) => p.pageType === "home");
  if (!home || home.pageType !== "home") {
    throw new Error("Site has no home page (should be impossible after parse).");
  }
  return home;
}

/** Find a page by its type and slug (used by dynamic routes). */
export function getPageByTypeAndSlug(
  site: Site,
  pageType: PageType,
  slug: string,
): Page | undefined {
  return site.pages.find((p) => p.pageType === pageType && p.slug === slug);
}

/** Find a singleton page (about/faq/contact) by type. */
export function getSingletonPage(
  site: Site,
  pageType: Extract<PageType, "about" | "faq" | "contact">,
): Page | undefined {
  return site.pages.find((p) => p.pageType === pageType);
}

/** All pages of a given type (e.g. every trip), in document order. */
export function getPagesOfType(site: Site, pageType: PageType): Page[] {
  return site.pages.filter((p) => p.pageType === pageType);
}

/** Find a page by its slug (used by the editor's page switcher). */
export function getPageBySlug(site: Site, slug: string): Page | undefined {
  return site.pages.find((p) => p.slug === slug);
}
