import { parseSite, safeParseSite, type Site } from "../schema";
import { getValueAtPath, setValueAtPath } from "./paths";

/**
 * The mutation surface for Site JSON. These are the ONLY functions that change a
 * site's content — the AI/editor never writes the JSON directly. Every mutation
 * returns a fully re-validated Site (or throws), so an invalid edit can never be
 * persisted. This is what keeps the hard rule enforceable: the AI proposes a
 * value, and the value must survive the schema to take effect.
 */

export class InvalidEditError extends Error {
  constructor(
    message: string,
    readonly issues?: unknown,
  ) {
    super(message);
    this.name = "InvalidEditError";
  }
}

/**
 * Set the scalar content at a data-edit path. The incoming value is coerced to
 * match the existing field's type (e.g. a numeric price stays a number), then
 * the whole site is re-validated through Zod.
 */
export function setContent(
  site: Site,
  path: string,
  value: string | number,
): Site {
  const current = getValueAtPath(site, path);

  if (current !== undefined && typeof current === "object" && current !== null) {
    throw new InvalidEditError(
      `Path "${path}" points at a structured field, not editable text.`,
    );
  }

  // Coerce to the existing field's type so the schema stays satisfied.
  let next: string | number = value;
  if (typeof current === "number") {
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(n)) {
      throw new InvalidEditError(`"${value}" is not a valid number for "${path}".`);
    }
    next = n;
  } else {
    next = String(value);
  }

  const updated = setValueAtPath(site, path, next);

  const result = safeParseSite(updated);
  if (!result.success) {
    throw new InvalidEditError(
      `Edit to "${path}" failed validation.`,
      result.error.issues,
    );
  }
  return result.data;
}

/** Re-validate an arbitrary candidate site (used at the persistence boundary). */
export function validateSite(data: unknown): Site {
  return parseSite(data);
}

// ── Section operations ───────────────────────────────────────────────────────

function revalidate(candidate: unknown, ctx: string): Site {
  const result = safeParseSite(candidate);
  if (!result.success) {
    throw new InvalidEditError(`${ctx} failed validation.`, result.error.issues);
  }
  return result.data;
}

function findPage(site: Site, pageSlug: string) {
  const page = site.pages.find((p) => p.slug === pageSlug);
  if (!page) throw new InvalidEditError(`No page "${pageSlug}".`);
  return page;
}

/** Show or hide a section on a page. */
export function setSectionHidden(
  site: Site,
  pageSlug: string,
  sectionId: string,
  hidden: boolean,
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) throw new InvalidEditError(`No section "${sectionId}".`);
  section.hidden = hidden;
  return revalidate(next, `Toggle section "${sectionId}"`);
}

/** Move a section up (-1) or down (+1) within its page. No-op at the ends. */
export function moveSection(
  site: Site,
  pageSlug: string,
  sectionId: string,
  direction: -1 | 1,
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const i = page.sections.findIndex((s) => s.id === sectionId);
  const j = i + direction;
  if (i >= 0 && j >= 0 && j < page.sections.length) {
    [page.sections[i], page.sections[j]] = [page.sections[j], page.sections[i]];
  }
  return revalidate(next, `Move section "${sectionId}"`);
}

/** Update a media object (image/video) at a path — src, kind, dimensions, caption. */
export function setMedia(
  site: Site,
  path: string,
  patch: {
    src?: string;
    kind?: "image" | "video";
    width?: number;
    height?: number;
    caption?: string;
  },
): Site {
  const next = structuredClone(site);
  const media = getValueAtPath(next, path);
  if (!media || typeof media !== "object") {
    throw new InvalidEditError(`No media at "${path}".`);
  }
  const target = media as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) target[k] = v;
  }
  return revalidate(next, `Set media "${path}"`);
}

/**
 * Place or replace the single background image/video on a section that supports
 * one (hero, mediaText, ctaBanner). Creates the media object if absent, deriving
 * alt text from the section's heading. For galleries/cards (multiple images),
 * select the specific slot and use setMedia instead.
 */
export function setSectionMedia(
  site: Site,
  pageSlug: string,
  sectionId: string,
  media: { src: string; kind: "image" | "video" },
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) throw new InvalidEditError(`No section "${sectionId}".`);
  if (
    section.type !== "hero" &&
    section.type !== "mediaText" &&
    section.type !== "ctaBanner"
  ) {
    throw new InvalidEditError(
      `A "${section.type}" section doesn't take a single background image — select a specific image slot instead.`,
    );
  }
  const existing = section.media;
  const heading = section.type === "hero" ? section.headline : section.heading;
  section.media = {
    ...(existing ?? {}),
    kind: media.kind,
    src: media.src,
    alt: existing?.alt || heading || "Site photo",
    focalX: existing?.focalX ?? 0.5,
    focalY: existing?.focalY ?? 0.5,
  };
  return revalidate(next, `Set media on "${sectionId}"`);
}

/** Set a section's background color and/or overlay (curated; whole-section style). */
export function setSectionBackground(
  site: Site,
  pageSlug: string,
  sectionId: string,
  patch: {
    color?: "default" | "surface" | "band" | "primary";
    overlay?: { tone: "dark" | "light"; opacity: number } | null;
  },
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) throw new InvalidEditError(`No section "${sectionId}".`);
  const bg = { ...(section.background ?? {}) };
  if (patch.color !== undefined) bg.color = patch.color;
  if (patch.overlay !== undefined) {
    if (patch.overlay === null) delete bg.overlay;
    else bg.overlay = patch.overlay;
  }
  section.background = bg;
  return revalidate(next, `Style section "${sectionId}"`);
}

/** Set/replace a section's background image or video (any section). */
export function setSectionBackgroundMedia(
  site: Site,
  pageSlug: string,
  sectionId: string,
  media: { src: string; kind: "image" | "video" },
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) throw new InvalidEditError(`No section "${sectionId}".`);
  const s = section as Record<string, unknown>;
  const existing = section.background?.media;
  const alt =
    existing?.alt ||
    (typeof s.heading === "string"
      ? s.heading
      : typeof s.headline === "string"
        ? s.headline
        : "Background image");
  section.background = {
    ...(section.background ?? {}),
    media: {
      ...(existing ?? {}),
      kind: media.kind,
      src: media.src,
      alt,
      focalX: existing?.focalX ?? 0.5,
      focalY: existing?.focalY ?? 0.5,
    },
  };
  return revalidate(next, `Set background image on "${sectionId}"`);
}

/** Set (or clear) a section's content alignment. */
export function setSectionAlign(
  site: Site,
  pageSlug: string,
  sectionId: string,
  align: "left" | "center" | null,
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) throw new InvalidEditError(`No section "${sectionId}".`);
  if (align === null) delete section.align;
  else section.align = align;
  return revalidate(next, `Align section "${sectionId}"`);
}

/**
 * Default content for each section type — the minimal valid shape (placeholder
 * copy + empty media) used when a captain adds a new section. Everything is real,
 * editable content; the schema fills the rest of the defaults on revalidate.
 */
const SECTION_TEMPLATES: Record<string, (id: string) => Record<string, unknown>> = {
  hero: (id) => ({ id, type: "hero", headline: "Your headline here", subheadline: "A sentence about what you offer.", media: { src: "", alt: "Hero image" }, primaryCta: { label: "Book Now", href: "/contact", variant: "primary" } }),
  mediaText: (id) => ({ id, type: "mediaText", heading: "Section heading", body: ["Add a paragraph of copy here."], media: { src: "", alt: "Photo" }, mediaSide: "left", tone: "dark" }),
  richText: (id) => ({ id, type: "richText", heading: "Section heading", body: ["Add a paragraph of copy here."] }),
  featureGrid: (id) => ({ id, type: "featureGrid", heading: "What sets us apart", items: [{ title: "Feature one", body: "Describe it." }, { title: "Feature two", body: "Describe it." }, { title: "Feature three", body: "Describe it." }] }),
  tripCards: (id) => ({ id, type: "tripCards", heading: "Our Trips", trips: [{ title: "Trip name", summary: "What this trip is about." }] }),
  speciesCards: (id) => ({ id, type: "speciesCards", heading: "Target Species", species: [{ name: "Species name", blurb: "When and how we target them." }] }),
  pricingTable: (id) => ({ id, type: "pricingTable", heading: "Rates", tiers: [{ name: "Tier", price: 0, features: ["Included item"] }] }),
  gallery: (id) => ({ id, type: "gallery", heading: "Gallery", images: [{ src: "", alt: "Photo one" }, { src: "", alt: "Photo two" }, { src: "", alt: "Photo three" }] }),
  testimonials: (id) => ({ id, type: "testimonials", heading: "What Guests Say", items: [{ quote: "A great review goes here.", author: "Guest name", rating: 5 }] }),
  faq: (id) => ({ id, type: "faq", heading: "FAQ", items: [{ question: "A common question?", answer: "The answer." }] }),
  infoList: (id) => ({ id, type: "infoList", heading: "Details", items: [{ label: "Label", value: "Value" }] }),
  stats: (id) => ({ id, type: "stats", heading: "By the Numbers", items: [{ value: "100+", label: "Trips run" }] }),
  ctaBanner: (id) => ({ id, type: "ctaBanner", heading: "Ready to book?", body: "A short nudge to act.", cta: { label: "Book Now", href: "/contact", variant: "primary" } }),
  contact: (id) => ({ id, type: "contact", heading: "Get in Touch", body: "Send us a message and we'll reply soon." }),
  articleBody: (id) => ({ id, type: "articleBody", body: ["Write your article here."] }),
  mediaCards: (id) => ({ id, type: "mediaCards", heading: "Highlights", cards: [{ title: "Card one", body: "Describe it." }, { title: "Card two", body: "Describe it." }, { title: "Card three", body: "Describe it." }] }),
  checklist: (id) => ({ id, type: "checklist", heading: "What's Included", items: ["First item", "Second item", "Third item"] }),
  rateTable: (id) => ({ id, type: "rateTable", heading: "Pricing", table: { columns: ["1 Angler", "2 Anglers"], rows: [{ label: "Half day", values: ["$0", "$0"] }, { label: "Full day", values: ["$0", "$0"] }] } }),
  pricedOffering: (id) => ({ id, type: "pricedOffering", heading: "Trip name", body: ["What this trip includes."], rate: { columns: ["1 Angler", "2 Anglers"], rows: [{ label: "Half day", values: ["$0", "$0"] }] }, included: ["Gear provided", "Lunch included"] }),
  steps: (id) => ({ id, type: "steps", heading: "How It Works", items: [{ kicker: "Step 01", title: "First step", body: "What happens." }, { kicker: "Step 02", title: "Second step", body: "What happens." }, { kicker: "Step 03", title: "Third step", body: "What happens." }] }),
  map: (id) => ({ id, type: "map", heading: "Find Us" }),
};

/** Section types a captain can add, in a sensible menu order. */
export const ADDABLE_SECTION_TYPES = Object.keys(SECTION_TEMPLATES);

/**
 * Add a new section of `type` to a page, optionally after `afterSectionId`
 * (appended to the end otherwise). The new section gets a unique id and minimal
 * valid placeholder content, then the whole site is re-validated.
 */
export function addSection(
  site: Site,
  pageSlug: string,
  type: string,
  afterSectionId?: string,
): Site {
  const make = SECTION_TEMPLATES[type];
  if (!make) throw new InvalidEditError(`Unknown section type "${type}".`);
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);

  // Unique id within the page.
  const existing = new Set(page.sections.map((s) => s.id));
  let n = 1;
  let id = type;
  while (existing.has(id)) id = `${type}-${n++}`;

  const section = make(id) as unknown as (typeof page.sections)[number];
  const at = afterSectionId ? page.sections.findIndex((s) => s.id === afterSectionId) : -1;
  if (at >= 0) page.sections.splice(at + 1, 0, section);
  else page.sections.push(section);

  return revalidate(next, `Add ${type} section`);
}

/** Remove a section from a page. */
export function removeSection(
  site: Site,
  pageSlug: string,
  sectionId: string,
): Site {
  const next = structuredClone(site);
  const page = findPage(next, pageSlug);
  page.sections = page.sections.filter((s) => s.id !== sectionId);
  return revalidate(next, `Remove section "${sectionId}"`);
}

// ── List item operations ──────────────────────────────────────────────────

/**
 * Resolve a data-edit path to the list it refers to (the list itself, or the
 * list that contains the addressed item/field). Rate-table cells resolve to the
 * row/column lists so add/remove operate on whole rows or columns, not cells.
 */
function arrayContext(path: string): { arrayPath: string; index: number | null } {
  let m = path.match(/^(.*\.rows)\.(\d+)/);
  if (m) return { arrayPath: m[1], index: Number(m[2]) };
  m = path.match(/^(.*\.columns)\.(\d+)/);
  if (m) return { arrayPath: m[1], index: Number(m[2]) };
  const segs = path.split(".");
  for (let i = segs.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(segs[i])) {
      return { arrayPath: segs.slice(0, i).join("."), index: Number(segs[i]) };
    }
  }
  return { arrayPath: path, index: null };
}

const rowsSiblingOf = (columnsPath: string) => columnsPath.replace(/\.columns$/, ".rows");

/** Keep each rate row's `values` length in sync when a column is added/removed. */
function syncColumnValues(site: Site, columnsPath: string, removeAt: number | null): Site {
  const rowsPath = rowsSiblingOf(columnsPath);
  const rows = getValueAtPath(site, rowsPath);
  if (!Array.isArray(rows)) return site;
  const next = rows.map((r) => {
    const row = r as { values?: string[] };
    const vals = Array.isArray(row.values) ? [...row.values] : [];
    if (removeAt === null) vals.push(vals[vals.length - 1] ?? "—");
    else vals.splice(removeAt, 1);
    return { ...row, values: vals };
  });
  return setValueAtPath(site, rowsPath, next);
}

/**
 * Append an item to the list at (or containing) `path`. New items copy the last
 * item's shape — a placeholder string for text lists, a clone for object lists —
 * so the result is always valid; the captain then edits it.
 */
export function addArrayItem(site: Site, path: string): Site {
  const { arrayPath } = arrayContext(path);
  const arr = getValueAtPath(site, arrayPath);
  if (!Array.isArray(arr)) throw new InvalidEditError(`"${arrayPath}" is not a list.`);
  if (arr.length === 0) throw new InvalidEditError(`Can't add to an empty list.`);
  const last = arr[arr.length - 1];
  const item =
    typeof last === "string" ? "New item" : typeof last === "number" ? 0 : structuredClone(last);
  let updated = setValueAtPath(site, arrayPath, [...arr, item]);
  if (arrayPath.endsWith(".columns")) updated = syncColumnValues(updated, arrayPath, null);
  return revalidate(updated, `Add item to "${arrayPath}"`);
}

/** Remove the item the `path` addresses from its list (kept to at least one item). */
export function removeArrayItem(site: Site, path: string): Site {
  const { arrayPath, index } = arrayContext(path);
  if (index === null) throw new InvalidEditError(`Select a specific item to remove.`);
  const arr = getValueAtPath(site, arrayPath);
  if (!Array.isArray(arr)) throw new InvalidEditError(`"${arrayPath}" is not a list.`);
  if (arr.length <= 1) throw new InvalidEditError(`This list must keep at least one item.`);
  let updated = setValueAtPath(site, arrayPath, arr.filter((_, i) => i !== index));
  if (arrayPath.endsWith(".columns")) updated = syncColumnValues(updated, arrayPath, index);
  return revalidate(updated, `Remove item from "${arrayPath}"`);
}
