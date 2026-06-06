import type { Site } from "../schema";

/**
 * Resolves a `data-edit` dot-path (the attribute templates stamp on every
 * editable value) back to a concrete location in the Site JSON, and provides
 * immutable get/set against it.
 *
 * Path grammar (matches how editPath() builds them in the templates):
 *   profile.name                      -> site.profile.name
 *   nav.0.label                       -> site.nav[0].label
 *   footerNote                        -> site.footerNote
 *   <slug>.seo.h1                     -> the page with that slug, seo.h1
 *   <slug>.<sectionId>.<field...>     -> that page's section (by id), then field
 *                                        (field may nest: body.0, items.2.question)
 *
 * Pages are matched by slug and sections by id rather than array index, so the
 * paths stay stable even if document order changes.
 */

/** Top-level Site keys that a path can address directly (not page-rooted). */
const DIRECT_ROOTS = new Set([
  "profile",
  "nav",
  "footerNote",
  "defaultOgImage",
  "baseUrl",
  "slug",
  "themeId",
]);

/** Translate a semantic data-edit path into literal object keys into the Site. */
function resolveToKeys(site: Site, path: string): string[] {
  const segs = path.split(".");
  if (segs.length === 0 || segs[0] === "") {
    throw new Error(`Empty edit path.`);
  }
  if (DIRECT_ROOTS.has(segs[0])) {
    return segs;
  }

  // Page-rooted: first segment is a page slug.
  const pageIdx = site.pages.findIndex((p) => p.slug === segs[0]);
  if (pageIdx < 0) {
    throw new Error(`No page with slug "${segs[0]}" (path "${path}").`);
  }
  if (segs[1] === "seo") {
    return ["pages", String(pageIdx), "seo", ...segs.slice(2)];
  }
  const page = site.pages[pageIdx];
  const secIdx = page.sections.findIndex((s) => s.id === segs[1]);
  if (secIdx < 0) {
    throw new Error(`No section "${segs[1]}" on page "${segs[0]}" (path "${path}").`);
  }
  return ["pages", String(pageIdx), "sections", String(secIdx), ...segs.slice(2)];
}

function walk(root: unknown, keys: string[]): unknown {
  let cur: unknown = root;
  for (const key of keys) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

/** Read the current value at a data-edit path (undefined if it doesn't exist). */
export function getValueAtPath(site: Site, path: string): unknown {
  return walk(site, resolveToKeys(site, path));
}

/**
 * Return a deep clone of the site with the value at `path` replaced. Does NOT
 * validate — callers run the result through parseSite() (see mutations.ts).
 */
export function setValueAtPath(site: Site, path: string, value: unknown): Site {
  const keys = resolveToKeys(site, path);
  const clone = structuredClone(site);
  const parent = walk(clone, keys.slice(0, -1));
  if (parent == null || typeof parent !== "object") {
    throw new Error(`Cannot set "${path}": parent location does not exist.`);
  }
  const leaf = keys[keys.length - 1];
  const container = parent as Record<string, unknown>;
  if (!(leaf in container)) {
    throw new Error(`Cannot set "${path}": field "${leaf}" does not exist.`);
  }
  container[leaf] = value;
  return clone;
}

/** True when the value at a path is a directly-editable scalar (string/number). */
export function isEditableScalar(site: Site, path: string): boolean {
  const v = getValueAtPath(site, path);
  return typeof v === "string" || typeof v === "number";
}

/**
 * Technical SEO + identity fields that FishySites manages automatically and
 * captains may NOT edit directly (the page <title>, meta description, JSON-LD
 * type, keywords, canonical slug, OG image, and the site slug/base URL). The
 * visible page H1 (`seo.h1`) is intentionally NOT protected — it's on-page copy.
 */
const PROTECTED_SEO =
  /\.seo\.(titleTag|metaDescription|jsonLdType|keywords|canonicalSlug|ogImage)\b/;

export function isProtectedPath(path: string): boolean {
  if (path === "slug" || path === "baseUrl") return true;
  return PROTECTED_SEO.test(path);
}
