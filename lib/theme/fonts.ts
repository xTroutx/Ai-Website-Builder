import { Antonio, Barlow } from "next/font/google";

/**
 * Hosted fonts for design themes, loaded via next/font (self-hosted, no layout
 * shift). Each exposes a CSS variable that themes reference in their font tokens
 * (see registry.ts). Applied once on <html> in app/layout.tsx.
 *
 * Antonio — condensed bold display face used for headings (the "Crystal Coast"
 * design). Barlow — clean grotesque for body copy.
 */
export const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
  display: "swap",
});

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

/** Class names to apply on <html> so the font variables are globally available. */
export const fontVariables = `${antonio.variable} ${barlow.variable}`;
