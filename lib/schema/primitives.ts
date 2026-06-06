import { z } from "zod";

/**
 * Shared, reusable field schemas. These are the small building blocks composed
 * by sections, pages, and the business profile. Everything here is CONTENT —
 * the kind of thing a captain can edit — never layout or design.
 */

/** URL-safe slug: lowercase words separated by single hyphens. */
export const SlugSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase words separated by single hyphens (e.g. inshore-redfish).",
  );

/**
 * A media reference. For now templates render a solid color block labelled with
 * `alt`; the fields below are exactly what `next/image` + real assets need later,
 * so swapping placeholders for photos requires no schema change.
 */
export const MediaSchema = z.object({
  /** Whether this asset is an image or a video. */
  kind: z.enum(["image", "video"]).default("image"),
  /** Asset path or URL. May be empty while a captain hasn't uploaded a photo. */
  src: z.string().default(""),
  /** Required alt text — content, editable, and important for a11y + SEO. */
  alt: z.string().min(1, "Every image needs alt text."),
  /** Intrinsic dimensions, when known (lets the renderer reserve space). */
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  /** Focal point (0–1) so future cropping keeps the subject in frame. */
  focalX: z.number().min(0).max(1).default(0.5),
  focalY: z.number().min(0).max(1).default(0.5),
  /** Optional short caption shown under the image in galleries. */
  caption: z.string().optional(),
});
export type Media = z.infer<typeof MediaSchema>;

/** Visual weight of a call-to-action button. Maps to template button styles. */
export const CtaVariantSchema = z.enum(["primary", "secondary", "link"]);

/**
 * A call-to-action / link. `href` may be an internal path ("/trips/redfish"),
 * a tel:/mailto:, or an external URL — all plain content the captain controls.
 */
export const CtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: CtaVariantSchema.default("primary"),
  /** Open in a new tab (e.g. external booking provider). */
  external: z.boolean().default(false),
});
export type Cta = z.infer<typeof CtaSchema>;

/** A simple navigation entry. */
export const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type NavLink = z.infer<typeof NavLinkSchema>;

/** Postal address. Used for display and LocalBusiness JSON-LD. */
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1),
  /** Two-letter state/region code, e.g. "SC". */
  region: z.string().min(1),
  postalCode: z.string().optional(),
  /** ISO country code. */
  country: z.string().default("US"),
});
export type Address = z.infer<typeof AddressSchema>;

/** Geo coordinates for maps and LocalBusiness JSON-LD. */
export const GeoSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/** A single weekday's operating hours, or marked closed. */
export const HoursSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  /** 24h "HH:MM"; omit when closed. */
  open: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h HH:MM.")
    .optional(),
  close: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h HH:MM.")
    .optional(),
  closed: z.boolean().default(false),
});

/** A social profile link. */
export const SocialLinkSchema = z.object({
  platform: z.enum([
    "facebook",
    "instagram",
    "youtube",
    "tiktok",
    "x",
    "google",
  ]),
  url: z.url(),
});
export type SocialLink = z.infer<typeof SocialLinkSchema>;
