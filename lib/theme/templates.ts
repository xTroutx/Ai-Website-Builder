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
