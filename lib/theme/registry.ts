import { getPalette } from "./palettes";
import { getFontPairing } from "./font-pairings";
import { getTemplate } from "./templates";

/**
 * Resolves a site's appearance (paletteId + fontId + templateId) into the
 * `--t-*` CSS custom properties the templates consume (mapped to Tailwind
 * utilities in app/globals.css). Colors come from the palette, fonts from the
 * pairing, and radius from the template — each chosen from curated sets.
 */
export type Appearance = {
  paletteId: string;
  fontId: string;
  templateId: string;
};

export function appearanceToCssVars(appearance: Appearance): Record<string, string> {
  const { colors } = getPalette(appearance.paletteId);
  const fonts = getFontPairing(appearance.fontId);
  const template = getTemplate(appearance.templateId);

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
    "--t-radius": template.radius,
  };
}
