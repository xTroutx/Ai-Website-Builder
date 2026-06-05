import { z } from "zod";
import { MediaSchema, SlugSchema } from "./primitives";

/**
 * The structured-data type emitted as JSON-LD for a page. The renderer picks the
 * right shape from this. Defaults per page type are enforced in pages.ts, but the
 * value lives here so SEO output is derived purely from the schema.
 */
export const JsonLdTypeSchema = z.enum([
  "LocalBusiness", // home
  "Service", // trip
  "FAQPage", // faq
  "Article", // report
  "AboutPage", // about
  "ContactPage", // contact
  "WebPage", // generic fallback
  "CollectionPage", // species / location index-style pages
]);
export type JsonLdType = z.infer<typeof JsonLdTypeSchema>;

/**
 * Per-page SEO. Every page carries this. The renderer turns it into the
 * <title>, meta description, canonical, Open Graph tags, and JSON-LD — all
 * automatically, with no hand-written <head> anywhere.
 */
export const SeoSchema = z.object({
  /** <title> contents. Kept short for SERP display. */
  titleTag: z
    .string()
    .min(1)
    .max(70, "Title tags over ~60 chars get truncated in search results."),
  /** <meta name="description">. */
  metaDescription: z
    .string()
    .min(1)
    .max(165, "Meta descriptions over ~160 chars get truncated."),
  /** The single visible <h1> for the page. */
  h1: z.string().min(1),
  /** Which JSON-LD shape to emit. */
  jsonLdType: JsonLdTypeSchema,
  /**
   * SEO-friendly keywords this page targets. Not output as a meta tag (those are
   * ignored by search engines) but used to keep copy/slug on-topic and available
   * to future tooling.
   */
  keywords: z.array(z.string()).default([]),
  /** Social share image; falls back to a site-wide default when omitted. */
  ogImage: MediaSchema.optional(),
  /** Override the slug used in the canonical URL (defaults to the page slug). */
  canonicalSlug: SlugSchema.optional(),
  /** Exclude from indexing (e.g. thin/duplicate pages). */
  noindex: z.boolean().default(false),
});
export type Seo = z.infer<typeof SeoSchema>;
