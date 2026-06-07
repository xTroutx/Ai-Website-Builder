/**
 * Template registry — the LAYOUT/design choice (separate from colors & fonts).
 *
 * A template defines structure and design-level tokens (e.g. corner radius).
 * Only "coastal" is implemented today (the Bounty Hunter / Crystal Coast design
 * translated from Figma); the others are placeholders shown as "Coming soon" in
 * the selector. The renderer falls back to the coastal layout for any id.
 */

export type Template = {
  id: string;
  name: string;
  description: string;
  /** Whether this template is implemented and selectable. */
  available: boolean;
  /** Corner radius design token (CSS length). */
  radius: string;
};

export const TEMPLATES = [
  {
    id: "coastal",
    name: "Coastal",
    description: "Bold, photo-forward charter layout with sharp edges.",
    available: true,
    radius: "0px",
  },
  {
    id: "holsten",
    name: "Holston River",
    description: "Dark, rugged fly-fishing layout with gold accents.",
    available: true,
    radius: "0px",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional, content-rich layout. (Coming soon)",
    available: false,
    radius: "0.5rem",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, spacious, understated. (Coming soon)",
    available: false,
    radius: "0.75rem",
  },
  {
    id: "expedition",
    name: "Expedition",
    description: "Rugged, adventure-style layout. (Coming soon)",
    available: false,
    radius: "0.25rem",
  },
] as const satisfies readonly Template[];

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as [string, ...string[]];
export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const DEFAULT_TEMPLATE_ID: TemplateId = "coastal";

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

/**
 * The palette + font each template was designed around. Picking a template in
 * the customizer applies these so it looks the way it does in the comparison —
 * the captain can still change colors/fonts afterward (they're independent).
 */
export const TEMPLATE_DEFAULT_APPEARANCE: Record<
  string,
  { paletteId: string; fontId: string }
> = {
  coastal: { paletteId: "crystal-coast", fontId: "antonio-barlow" },
  holsten: { paletteId: "holsten", fontId: "saira-inter" },
};

/** Recommended palette/font for a template (falls back to the coastal pairing). */
export function getTemplateDefaultAppearance(id: string): {
  paletteId: string;
  fontId: string;
} {
  return TEMPLATE_DEFAULT_APPEARANCE[id] ?? TEMPLATE_DEFAULT_APPEARANCE.coastal;
}
