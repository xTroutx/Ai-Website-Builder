import { z } from "zod";
import { THEME_IDS } from "../theme/registry";
import {
  AddressSchema,
  GeoSchema,
  HoursSchema,
  MediaSchema,
  NavLinkSchema,
  SocialLinkSchema,
} from "./primitives";
import { PageSchema, pagePath } from "./pages";

/**
 * The captain's business identity. Pure content — used across pages and to build
 * LocalBusiness structured data. The AI fills these from the onboarding
 * interview; it never invents design from them.
 */
export const BusinessProfileSchema = z.object({
  /** Business / brand name. */
  name: z.string().min(1),
  /** Short tagline shown under the name. */
  tagline: z.string().optional(),
  /** Captain's name. */
  captainName: z.string().min(1),
  /** Year the charter business started (for "since YYYY" + experience). */
  foundedYear: z
    .number()
    .int()
    .gte(1900)
    .lte(2100)
    .optional(),
  /** One or two sentences of bio used as a fallback/byline. */
  shortBio: z.string().optional(),
  contact: z.object({
    phone: z.string().min(1),
    email: z.email(),
    address: AddressSchema,
    geo: GeoSchema.optional(),
  }),
  /** Weekly operating hours. */
  hours: z.array(HoursSchema).default([]),
  /** Social profile links. */
  social: z.array(SocialLinkSchema).default([]),
  /** Areas served, e.g. ["Charleston", "Mount Pleasant"]. */
  serviceAreas: z.array(z.string().min(1)).default([]),
  /** Licenses/certifications, e.g. ["USCG Licensed", "CPR Certified"]. */
  certifications: z.array(z.string().min(1)).default([]),
  /** Styles of fishing offered, e.g. ["Inshore", "Fly", "Nearshore"]. */
  fishingTypes: z.array(z.string().min(1)).default([]),
  /** Coarse price band for LocalBusiness, e.g. "$$". */
  priceRange: z.string().optional(),
  /** Logo image. */
  logo: MediaSchema.optional(),
});
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

/**
 * The complete Site JSON — the single source of truth for a published site.
 * Templates render exclusively from this; the AI only ever mutates fields within
 * it (validated here). Nothing about design lives in this object beyond the
 * `themeId` reference into the curated theme registry.
 */
export const SiteSchema = z
  .object({
    /**
     * Tenant slug — the subdomain this site will resolve from later
     * (slug.fishysites.com). Multi-tenant lookup will key on this.
     */
    slug: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Site slug must be lowercase words separated by hyphens.",
      ),
    /** Absolute base URL, used for canonical URLs, sitemap, and OG tags. */
    baseUrl: z.url(),
    /** Selected theme. Must be one of the curated registry ids. */
    themeId: z.string().refine(
      (id): boolean => (THEME_IDS as readonly string[]).includes(id),
      {
        message:
          "Unknown themeId — must be one of the curated themes in /lib/theme.",
      },
    ),
    profile: BusinessProfileSchema,
    /** Header navigation. Order is captain-editable. */
    nav: z.array(NavLinkSchema).default([]),
    /** Site-wide default social share image. */
    defaultOgImage: MediaSchema.optional(),
    /** All pages on the site. */
    pages: z.array(PageSchema).min(1, "A site needs at least a home page."),
    /** Optional short footer note (e.g. license number, copyright tagline). */
    footerNote: z.string().optional(),
  })
  .superRefine((site, ctx) => {
    // Exactly one home page.
    const homeCount = site.pages.filter((p) => p.pageType === "home").length;
    if (homeCount !== 1) {
      ctx.addIssue({
        code: "custom",
        message: `A site must have exactly one home page (found ${homeCount}).`,
        path: ["pages"],
      });
    }

    // No two pages may resolve to the same URL path.
    const seen = new Map<string, number>();
    site.pages.forEach((page, i) => {
      const path = pagePath(page);
      if (seen.has(path)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate page path "${path}".`,
          path: ["pages", i, "slug"],
        });
      }
      seen.set(path, i);
    });
  });

export type Site = z.infer<typeof SiteSchema>;
/**
 * The INPUT shape of a Site (before Zod applies defaults). Author hardcoded /
 * sample data against this so fields with schema defaults can be omitted.
 */
export type SiteInput = z.input<typeof SiteSchema>;
