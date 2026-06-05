/**
 * Theme registry — the ONLY source of colors and fonts.
 *
 * Captains pick a `themeId` (see the curated list below). They never choose raw
 * colors or fonts. The AI never emits color/font values either; it can only set
 * `themeId` to one of these vetted combinations.
 *
 * Each theme resolves to a flat set of design tokens. `themeToCssVars()` turns a
 * theme into the `--t-*` CSS custom properties that templates consume (mapped to
 * Tailwind utilities in app/globals.css). When the real designs arrive, only the
 * token VALUES here change — no template logic touches this file's shape.
 */

export type ThemeTokens = {
  colors: {
    /** Page background */
    bg: string;
    /** Card / raised surface background */
    surface: string;
    /** Primary body/heading text */
    text: string;
    /** Secondary / muted text */
    muted: string;
    /** Brand color for primary actions */
    primary: string;
    /** Readable text/icon color on top of `primary` */
    primaryContrast: string;
    /** Secondary brand accent */
    accent: string;
    /** Hairlines, dividers, borders */
    border: string;
    /**
     * Contrasting "band" background for alternating sections (e.g. the cream
     * testimonials band over a dark page). Defaults to `surface` when omitted.
     */
    surfaceAlt?: string;
    /** Text color on top of `surfaceAlt`. Defaults to `text` when omitted. */
    onSurfaceAlt?: string;
  };
  fonts: {
    /** Font stack for headings */
    heading: string;
    /** Font stack for body copy */
    body: string;
  };
  /** Corner rounding applied to cards, buttons, media (CSS length) */
  radius: string;
};

export type Theme = {
  id: string;
  /** Human label shown in (future) theme picker */
  name: string;
  /** One-line description of the vibe */
  description: string;
  tokens: ThemeTokens;
};

// Web-safe font pairings — visually distinct cross-platform, zero network deps.
// Real designs will replace these with hosted fonts; the token shape stays.
const FONTS = {
  classicSerif: {
    heading: "Georgia, 'Times New Roman', serif",
    body: "Georgia, 'Times New Roman', serif",
  },
  serifSans: {
    heading: "Georgia, 'Palatino Linotype', serif",
    body: "'Helvetica Neue', Arial, sans-serif",
  },
  modernSans: {
    heading: "'Trebuchet MS', 'Segoe UI', sans-serif",
    body: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
  geometricSans: {
    heading: "'Century Gothic', 'Futura', 'Trebuchet MS', sans-serif",
    body: "Verdana, 'Segoe UI', sans-serif",
  },
  humanistSans: {
    heading: "'Optima', 'Segoe UI', 'Helvetica Neue', sans-serif",
    body: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  slabSans: {
    heading: "'Rockwell', 'Courier New', Georgia, serif",
    body: "Tahoma, 'Segoe UI', sans-serif",
  },
  // Hosted design fonts (loaded via lib/theme/fonts.ts). Condensed display +
  // grotesque body — the "Crystal Coast" charter look.
  antonioBarlow: {
    heading: "var(--font-antonio), 'Oswald', 'Arial Narrow', sans-serif",
    body: "var(--font-barlow), 'Segoe UI', system-ui, sans-serif",
  },
} as const;

/**
 * The curated themes. ~8–12 vetted combinations. To add one, append here — the
 * schema's themeId validation reads THEME_IDS off this array automatically.
 */
export const THEMES = [
  {
    id: "crystal-coast",
    name: "Crystal Coast",
    description:
      "Dark navy, ocean blue, and cream with bold condensed type — Bounty Hunter Guide Service design.",
    tokens: {
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
      fonts: FONTS.antonioBarlow,
      radius: "0px",
    },
  },
  {
    id: "harbor",
    name: "Harbor",
    description: "Deep navy and rope-tan — classic Atlantic charter feel.",
    tokens: {
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
      fonts: FONTS.serifSans,
      radius: "0.5rem",
    },
  },
  {
    id: "tidewater",
    name: "Tidewater",
    description: "Soft teal and sand — calm flats and inshore marsh.",
    tokens: {
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
      fonts: FONTS.humanistSans,
      radius: "0.75rem",
    },
  },
  {
    id: "bluewater",
    name: "Bluewater",
    description: "Bright ocean blue and white — offshore and bluewater trips.",
    tokens: {
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
      fonts: FONTS.modernSans,
      radius: "0.5rem",
    },
  },
  {
    id: "mangrove",
    name: "Mangrove",
    description: "Forest green and bark brown — backcountry and mangrove runs.",
    tokens: {
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
      fonts: FONTS.classicSerif,
      radius: "0.375rem",
    },
  },
  {
    id: "sailfish",
    name: "Sailfish",
    description: "Indigo and electric cyan — sporty, tournament energy.",
    tokens: {
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
      fonts: FONTS.geometricSans,
      radius: "0.875rem",
    },
  },
  {
    id: "sunset-flats",
    name: "Sunset Flats",
    description: "Warm coral and dusk purple — golden-hour fly fishing.",
    tokens: {
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
      fonts: FONTS.serifSans,
      radius: "0.625rem",
    },
  },
  {
    id: "driftwood",
    name: "Driftwood",
    description: "Muted slate and weathered oak — understated, premium.",
    tokens: {
      colors: {
        bg: "#f7f6f4",
        surface: "#ffffff",
        text: "#26241f",
        muted: "#6e6a61",
        primary: "#3f4a4d",
        primaryContrast: "#ffffff",
        accent: "#a87f4a",
        border: "#e3dfd8",
      },
      fonts: FONTS.slabSans,
      radius: "0.25rem",
    },
  },
  {
    id: "redfish",
    name: "Redfish",
    description: "Copper red and marsh gold — Lowcountry redfish on the flats.",
    tokens: {
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
      fonts: FONTS.humanistSans,
      radius: "0.5rem",
    },
  },
  {
    id: "deep-sea",
    name: "Deep Sea",
    description: "Near-black navy with gold — bold, dark-mode offshore look.",
    tokens: {
      colors: {
        bg: "#0e1620",
        surface: "#172430",
        text: "#eef4fa",
        muted: "#9fb2c4",
        primary: "#e0a93b",
        primaryContrast: "#10202c",
        accent: "#3fb6d8",
        border: "#26384a",
      },
      fonts: FONTS.geometricSans,
      radius: "0.5rem",
    },
  },
  {
    id: "lighthouse",
    name: "Lighthouse",
    description: "Crisp red, white, and navy — traditional New England charter.",
    tokens: {
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
      fonts: FONTS.classicSerif,
      radius: "0.375rem",
    },
  },
] as const satisfies readonly Theme[];

/** All valid theme ids — consumed by the Zod schema's themeId validator. */
export const THEME_IDS = THEMES.map((t) => t.id) as [string, ...string[]];

export type ThemeId = (typeof THEMES)[number]["id"];

const DEFAULT_THEME_ID: ThemeId = "redfish";

/** Look up a theme by id, falling back to the default if unknown. */
export function getTheme(themeId: string): Theme {
  return THEMES.find((t) => t.id === themeId) ?? getTheme(DEFAULT_THEME_ID);
}

/**
 * Convert a theme into the `--t-*` CSS custom properties templates rely on.
 * Spread the result onto a wrapping element's `style`.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const { colors, fonts, radius } = theme.tokens;
  return {
    "--t-bg": colors.bg,
    "--t-surface": colors.surface,
    "--t-text": colors.text,
    "--t-muted": colors.muted,
    "--t-primary": colors.primary,
    "--t-primary-contrast": colors.primaryContrast,
    "--t-accent": colors.accent,
    "--t-border": colors.border,
    "--t-surface-alt": colors.surfaceAlt ?? colors.surface,
    "--t-on-surface-alt": colors.onSurfaceAlt ?? colors.text,
    "--t-font-heading": fonts.heading,
    "--t-font-body": fonts.body,
    "--t-radius": radius,
  };
}
