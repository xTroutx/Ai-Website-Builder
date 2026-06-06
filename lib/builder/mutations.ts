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
