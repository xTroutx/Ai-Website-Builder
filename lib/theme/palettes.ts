/**
 * Curated color palettes — the COLOR half of the customizer. Captains pick a
 * paletteId; never raw colors. Decoupled from fonts (see font-pairings.ts) so
 * color and typography can be chosen independently, both from vetted sets.
 */

export type PaletteColors = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  primaryContrast: string;
  accent: string;
  border: string;
  /** Contrasting band background (defaults to `surface`). */
  surfaceAlt?: string;
  /** Text on `surfaceAlt` (defaults to `text`). */
  onSurfaceAlt?: string;
};

export type Palette = {
  id: string;
  name: string;
  description: string;
  colors: PaletteColors;
};

export const PALETTES = [
  {
    id: "crystal-coast",
    name: "Crystal Coast",
    description: "Dark navy, ocean blue, and cream.",
    colors: {
      bg: "#1C2029",
      surface: "#181A21",
      text: "#F0F0F0",
      muted: "#A7AFBA",
      primary: "#0077B6",
      primaryContrast: "#F0F0F0",
      accent: "#0077B6",
      border: "#2A2F3A",
      surfaceAlt: "#F2EDE1",
      onSurfaceAlt: "#1C2029",
    },
  },
  {
    id: "harbor",
    name: "Harbor",
    description: "Deep navy and rope tan.",
    colors: {
      bg: "#f7f9fb",
      surface: "#ffffff",
      text: "#0f2233",
      muted: "#5a6b7a",
      primary: "#123a5a",
      primaryContrast: "#ffffff",
      accent: "#c8893b",
      border: "#dbe3ea",
    },
  },
  {
    id: "tidewater",
    name: "Tidewater",
    description: "Soft teal and sand.",
    colors: {
      bg: "#f4faf9",
      surface: "#ffffff",
      text: "#10302e",
      muted: "#557671",
      primary: "#0e7c6b",
      primaryContrast: "#ffffff",
      accent: "#e0a23b",
      border: "#d6e8e4",
    },
  },
  {
    id: "bluewater",
    name: "Bluewater",
    description: "Bright ocean blue and white.",
    colors: {
      bg: "#f5f9ff",
      surface: "#ffffff",
      text: "#0b2540",
      muted: "#56708c",
      primary: "#0b6bcb",
      primaryContrast: "#ffffff",
      accent: "#f25c3b",
      border: "#d5e3f2",
    },
  },
  {
    id: "mangrove",
    name: "Mangrove",
    description: "Forest green and bark brown.",
    colors: {
      bg: "#f6f8f3",
      surface: "#ffffff",
      text: "#1c2a18",
      muted: "#5f6f55",
      primary: "#2f5d34",
      primaryContrast: "#ffffff",
      accent: "#c47a2c",
      border: "#dde4d4",
    },
  },
  {
    id: "sailfish",
    name: "Sailfish",
    description: "Indigo and electric cyan.",
    colors: {
      bg: "#f6f7fb",
      surface: "#ffffff",
      text: "#161a3a",
      muted: "#5b6088",
      primary: "#2b2f77",
      primaryContrast: "#ffffff",
      accent: "#16b3c7",
      border: "#dcdef0",
    },
  },
  {
    id: "sunset-flats",
    name: "Sunset Flats",
    description: "Warm coral and dusk purple.",
    colors: {
      bg: "#fffaf6",
      surface: "#ffffff",
      text: "#3a1f2a",
      muted: "#8a6b73",
      primary: "#b8434f",
      primaryContrast: "#ffffff",
      accent: "#e8923b",
      border: "#f0ddd6",
    },
  },
  {
    id: "redfish",
    name: "Redfish",
    description: "Copper red and marsh gold.",
    colors: {
      bg: "#fbf8f3",
      surface: "#ffffff",
      text: "#2a1c12",
      muted: "#7a6553",
      primary: "#a8431f",
      primaryContrast: "#ffffff",
      accent: "#c79a3a",
      border: "#ece1d3",
    },
  },
  {
    id: "deep-sea",
    name: "Deep Sea",
    description: "Near-black navy with gold.",
    colors: {
      bg: "#0e1620",
      surface: "#172430",
      text: "#eef4fa",
      muted: "#9fb2c4",
      primary: "#e0a93b",
      primaryContrast: "#10202c",
      accent: "#3fb6d8",
      border: "#26384a",
      surfaceAlt: "#172430",
      onSurfaceAlt: "#eef4fa",
    },
  },
  {
    id: "lighthouse",
    name: "Lighthouse",
    description: "Crisp red, white, and navy.",
    colors: {
      bg: "#ffffff",
      surface: "#f6f8fb",
      text: "#13233b",
      muted: "#5a6b80",
      primary: "#b22234",
      primaryContrast: "#ffffff",
      accent: "#1b3a6b",
      border: "#dce3ec",
    },
  },
] as const satisfies readonly Palette[];

export const PALETTE_IDS = PALETTES.map((p) => p.id) as [string, ...string[]];
export type PaletteId = (typeof PALETTES)[number]["id"];

export const DEFAULT_PALETTE_ID: PaletteId = "crystal-coast";

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
