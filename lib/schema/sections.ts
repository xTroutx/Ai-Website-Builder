import { z } from "zod";
import { CtaSchema, MediaSchema, SlugSchema } from "./primitives";

/**
 * Sections are the composable content blocks that make up a page body. Each is a
 * discriminated-union member keyed by `type`, so templates can switch on `type`
 * exhaustively and TypeScript guarantees every case is handled.
 *
 * Captains control WHICH sections appear and their ORDER (array order), and the
 * content inside them. They do NOT control how a section looks — that's the
 * template's job. Adding a new section type = add a member here + a case in the
 * section renderer.
 *
 * Fields common to every section (id, hidden) are spread into each member so the
 * discriminated union stays flat (z.discriminatedUnion requires a literal
 * `type` key on each option).
 */

/**
 * Per-section background styling (selected by clicking the whole section). Colors
 * are curated token choices (not raw hex), with an optional background image/video
 * and a dark/light overlay whose opacity is adjustable.
 */
export const SectionBackgroundSchema = z.object({
  /** Curated background color (token-backed). Omitted = the section's default. */
  color: z.enum(["default", "surface", "band", "primary"]).optional(),
  /** Optional background image/video behind the section content. */
  media: MediaSchema.optional(),
  /** Overlay over the background for legibility/mood. */
  overlay: z
    .object({
      tone: z.enum(["dark", "light"]).default("dark"),
      opacity: z.number().int().min(0).max(100).default(40),
    })
    .optional(),
});
export type SectionBackground = z.infer<typeof SectionBackgroundSchema>;

const base = {
  /** Stable id, unique within a page. Used for React keys and data-edit paths. */
  id: z.string().min(1),
  /** Keep the section in the JSON but don't render it. */
  hidden: z.boolean().default(false),
  /** Section-level background styling (color/image/overlay). */
  background: SectionBackgroundSchema.optional(),
};

/** Big top-of-page banner: headline, supporting copy, CTAs, and a hero image. */
export const HeroSectionSchema = z.object({
  ...base,
  type: z.literal("hero"),
  eyebrow: z.string().optional(),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  media: MediaSchema.optional(),
  primaryCta: CtaSchema.optional(),
  secondaryCta: CtaSchema.optional(),
});

/**
 * An image paired with a heading + body copy (and optional CTA), side by side.
 * The recurring "image + text" block in the design (intro, meet-the-captain).
 */
export const MediaTextSectionSchema = z.object({
  ...base,
  type: z.literal("mediaText"),
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  /** Each string is a paragraph. */
  body: z.array(z.string().min(1)).min(1),
  media: MediaSchema,
  /** Which side the image sits on (a curated layout option, not free design). */
  mediaSide: z.enum(["left", "right"]).default("left"),
  /** Band treatment: the page color, or the contrasting light "band" color. */
  tone: z.enum(["dark", "light"]).default("dark"),
  cta: CtaSchema.optional(),
});

/** A heading plus one or more paragraphs of prose. */
export const RichTextSectionSchema = z.object({
  ...base,
  type: z.literal("richText"),
  heading: z.string().optional(),
  /** Each string is a paragraph. */
  body: z.array(z.string().min(1)).min(1),
});

/** Grid of short feature/benefit blurbs. */
export const FeatureGridSectionSchema = z.object({
  ...base,
  type: z.literal("featureGrid"),
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        /** Optional short icon key/emoji — purely decorative content. */
        icon: z.string().optional(),
      }),
    )
    .min(1),
});

/** Cards promoting trips, each optionally linking to its trip page. */
export const TripCardsSectionSchema = z.object({
  ...base,
  type: z.literal("tripCards"),
  heading: z.string().optional(),
  trips: z
    .array(
      z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        /** Slug of the trip page to link to, when one exists. */
        slug: SlugSchema.optional(),
        priceFrom: z.number().nonnegative().optional(),
        duration: z.string().optional(),
        media: MediaSchema.optional(),
      }),
    )
    .min(1),
});

/** Cards highlighting target species, each optionally linking to its page. */
export const SpeciesCardsSectionSchema = z.object({
  ...base,
  type: z.literal("speciesCards"),
  heading: z.string().optional(),
  species: z
    .array(
      z.object({
        name: z.string().min(1),
        blurb: z.string().min(1),
        slug: SlugSchema.optional(),
        /** Best months, e.g. "Apr–Oct". */
        season: z.string().optional(),
        media: MediaSchema.optional(),
      }),
    )
    .min(1),
});

/** Pricing tiers for trips/packages. */
export const PricingTableSectionSchema = z.object({
  ...base,
  type: z.literal("pricingTable"),
  heading: z.string().optional(),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().nonnegative(),
        /** e.g. "per trip", "per person", "half day". */
        unit: z.string().optional(),
        description: z.string().optional(),
        features: z.array(z.string().min(1)).default([]),
        /** Mark one tier as the recommended/featured option. */
        featured: z.boolean().default(false),
        cta: CtaSchema.optional(),
      }),
    )
    .min(1),
});

/** Photo gallery. */
export const GallerySectionSchema = z.object({
  ...base,
  type: z.literal("gallery"),
  heading: z.string().optional(),
  images: z.array(MediaSchema).min(1),
});

/** Customer testimonials / reviews. */
export const TestimonialsSectionSchema = z.object({
  ...base,
  type: z.literal("testimonials"),
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        location: z.string().optional(),
        /** 1–5 star rating. */
        rating: z.number().int().min(1).max(5).optional(),
      }),
    )
    .min(1),
});

/** Frequently asked questions. Also the source for FAQPage JSON-LD. */
export const FaqSectionSchema = z.object({
  ...base,
  type: z.literal("faq"),
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

/** Label/value rows — trip specs, what's included, quick facts. */
export const InfoListSectionSchema = z.object({
  ...base,
  type: z.literal("infoList"),
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .min(1),
});

/** Headline statistics (years guiding, trips run, etc.). */
export const StatsSectionSchema = z.object({
  ...base,
  type: z.literal("stats"),
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(1),
});

/** Full-width call-to-action banner, optionally over a background image/video. */
export const CtaBannerSectionSchema = z.object({
  ...base,
  type: z.literal("ctaBanner"),
  heading: z.string().min(1),
  body: z.string().optional(),
  cta: CtaSchema,
  /** Optional background image/video behind the banner. */
  media: MediaSchema.optional(),
});

/** Contact details and an optional lead form. */
export const ContactSectionSchema = z.object({
  ...base,
  type: z.literal("contact"),
  heading: z.string().optional(),
  body: z.string().optional(),
  /** Pull phone/email/address from the business profile when true. */
  showBusinessDetails: z.boolean().default(true),
  /** Render the lead-capture form (writes to the `leads` table later). */
  showLeadForm: z.boolean().default(true),
});

/** Long-form article body for fishing reports. Source for Article JSON-LD. */
export const ArticleBodySectionSchema = z.object({
  ...base,
  type: z.literal("articleBody"),
  /** Each string is a paragraph. */
  body: z.array(z.string().min(1)).min(1),
  /** Optional highlighted pull quote. */
  pullQuote: z.string().optional(),
});

/**
 * A pricing matrix: column headers + labelled rows of values — e.g. columns
 * ["1 Angler","2 Anglers"] with rows {label:"Half day", values:["$350","$450"]}.
 * Shared by the rateTable section and pricedOffering blocks.
 */
export const RateMatrixSchema = z.object({
  columns: z.array(z.string().min(1)).min(1),
  rows: z
    .array(
      z.object({
        label: z.string().min(1),
        values: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  /** Small print under the table (e.g. "Prices per boat. Gratuity not included."). */
  note: z.string().optional(),
});
export type RateMatrix = z.infer<typeof RateMatrixSchema>;

/**
 * Generic rich card grid/carousel: cards with an image, optional kicker, title,
 * body, labelled detail rows, and a CTA. The design's recurring card pattern —
 * fishing waters, lodging options, hosted weeks, the guide team.
 */
export const MediaCardsSectionSchema = z.object({
  ...base,
  type: z.literal("mediaCards"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  /** Lay the cards out as a wrapping grid or a horizontal carousel. */
  layout: z.enum(["grid", "carousel"]).default("grid"),
  /** Cards per row at desktop width. */
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  cards: z
    .array(
      z.object({
        media: MediaSchema.optional(),
        /** Small uppercase label above the title (e.g. "FLOAT TRIP WATERS"). */
        eyebrow: z.string().optional(),
        title: z.string().min(1),
        body: z.string().optional(),
        /** Labelled spec rows (e.g. "Best season" → "Apr–Oct"). */
        details: z
          .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
          .default([]),
        cta: CtaSchema.optional(),
      }),
    )
    .min(1),
});

/** A list of included/checkmarked items, laid out in one or more columns. */
export const ChecklistSectionSchema = z.object({
  ...base,
  type: z.literal("checklist"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  items: z.array(z.string().min(1)).min(1),
});

/** A standalone pricing matrix (column headers + labelled rate rows). */
export const RateTableSectionSchema = z.object({
  ...base,
  type: z.literal("rateTable"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  table: RateMatrixSchema,
});

/**
 * A priced offering block: copy + CTAs on one side, a rate table and an
 * "what's included" checklist on the other (the design's Float/Walk-&-Wade trip
 * detail layout). `media` can stand in for the text column when provided.
 */
export const PricedOfferingSectionSchema = z.object({
  ...base,
  type: z.literal("pricedOffering"),
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  body: z.array(z.string().min(1)).default([]),
  media: MediaSchema.optional(),
  /** Which side the rate/included column sits on. */
  detailsSide: z.enum(["left", "right"]).default("right"),
  primaryCta: CtaSchema.optional(),
  secondaryCta: CtaSchema.optional(),
  rate: RateMatrixSchema.optional(),
  includedTitle: z.string().optional(),
  included: z.array(z.string().min(1)).default([]),
});

/** Numbered/kickered process steps (e.g. "What to Expect", "Planning Your Trip"). */
export const StepsSectionSchema = z.object({
  ...base,
  type: z.literal("steps"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        /** Small label above the title (e.g. "STEP 01 — MORNING"). */
        kicker: z.string().optional(),
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .min(1),
});

/** An embedded location map (derived from the business address, or an explicit URL). */
export const MapSectionSchema = z.object({
  ...base,
  type: z.literal("map"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  /** Explicit map embed URL; otherwise derived from the business address. */
  embedUrl: z.url().optional(),
});

/**
 * The Section discriminated union. Order of members doesn't matter; the `type`
 * literal is the discriminant.
 */
export const SectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  MediaTextSectionSchema,
  RichTextSectionSchema,
  FeatureGridSectionSchema,
  TripCardsSectionSchema,
  SpeciesCardsSectionSchema,
  PricingTableSectionSchema,
  GallerySectionSchema,
  TestimonialsSectionSchema,
  FaqSectionSchema,
  InfoListSectionSchema,
  StatsSectionSchema,
  CtaBannerSectionSchema,
  ContactSectionSchema,
  ArticleBodySectionSchema,
  MediaCardsSectionSchema,
  ChecklistSectionSchema,
  RateTableSectionSchema,
  PricedOfferingSectionSchema,
  StepsSectionSchema,
  MapSectionSchema,
]);

export type Section = z.infer<typeof SectionSchema>;
/** The literal `type` of any section. */
export type SectionType = Section["type"];
