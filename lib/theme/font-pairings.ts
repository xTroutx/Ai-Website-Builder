/**
 * Curated font pairings — the TYPOGRAPHY half of the customizer. Captains pick a
 * fontId; never raw font names. Each pairing is a heading + body CSS font stack.
 * The "Charter" pairing uses the hosted Antonio/Barlow fonts loaded in
 * lib/theme/fonts.ts (via CSS variables); the rest are web-safe stacks.
 *
 * This module is plain data (no next/font import), so it is safe to use in
 * client components like the customizer.
 */

export type FontPairing = {
  id: string;
  name: string;
  description: string;
  heading: string;
  body: string;
};

export const FONT_PAIRINGS = [
  {
    id: "antonio-barlow",
    name: "Charter",
    description: "Bold condensed headings, clean body.",
    heading: "var(--font-antonio), 'Oswald', 'Arial Narrow', sans-serif",
    body: "var(--font-barlow), 'Segoe UI', system-ui, sans-serif",
  },
  {
    id: "classic-serif",
    name: "Classic",
    description: "Timeless all-serif.",
    heading: "Georgia, 'Times New Roman', serif",
    body: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "serif-sans",
    name: "Editorial",
    description: "Serif headings, sans body.",
    heading: "Georgia, 'Palatino Linotype', serif",
    body: "'Helvetica Neue', Arial, sans-serif",
  },
  {
    id: "modern-sans",
    name: "Modern",
    description: "Friendly all-sans.",
    heading: "'Trebuchet MS', 'Segoe UI', sans-serif",
    body: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
  {
    id: "geometric-sans",
    name: "Geometric",
    description: "Clean geometric sans.",
    heading: "'Century Gothic', 'Futura', 'Trebuchet MS', sans-serif",
    body: "Verdana, 'Segoe UI', sans-serif",
  },
  {
    id: "humanist-sans",
    name: "Humanist",
    description: "Warm, approachable sans.",
    heading: "'Optima', 'Segoe UI', 'Helvetica Neue', sans-serif",
    body: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  {
    id: "slab",
    name: "Rugged",
    description: "Slab headings, neutral body.",
    heading: "'Rockwell', 'Courier New', Georgia, serif",
    body: "Tahoma, 'Segoe UI', sans-serif",
  },
] as const satisfies readonly FontPairing[];

export const FONT_IDS = FONT_PAIRINGS.map((f) => f.id) as [string, ...string[]];
export type FontId = (typeof FONT_PAIRINGS)[number]["id"];

export const DEFAULT_FONT_ID: FontId = "antonio-barlow";

export function getFontPairing(id: string): FontPairing {
  return FONT_PAIRINGS.find((f) => f.id === id) ?? FONT_PAIRINGS[0];
}
