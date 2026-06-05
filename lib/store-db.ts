import { Prisma } from "@/lib/generated/prisma/client";
import { getPrisma } from "./db";
import { parseSite, type Site } from "./schema";
import { sampleSite } from "./sample";

/**
 * Postgres-backed, per-owner Site store. Each account owns one site (for now);
 * the full Site JSON lives in `Site.data` and is parseSite()-validated at this
 * boundary. Multi-tenant public routing by subdomain comes later — today a
 * captain's site is resolved by the logged-in user (see lib/site.ts).
 */

function asJson(site: Site): Prisma.InputJsonValue {
  return site as unknown as Prisma.InputJsonValue;
}

/** The site owned by a given account. Throws if the account has none. */
export async function getSiteByOwnerId(ownerId: string): Promise<Site> {
  const row = await getPrisma().site.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
  });
  if (!row) throw new Error("This account has no site yet.");
  return parseSite(row.data);
}

/** Persist edits to a site (keyed by its globally-unique tenant slug). */
export async function writeSiteBySlug(site: Site): Promise<void> {
  const valid = parseSite(site);
  await getPrisma().site.update({
    where: { slug: valid.slug },
    data: {
      data: asJson(valid),
      name: valid.profile.name,
      themeId: valid.themeId,
    },
  });
}

/** True if a tenant slug is already taken. */
export async function slugExists(slug: string): Promise<boolean> {
  const row = await getPrisma().site.findUnique({ where: { slug } });
  return Boolean(row);
}

/**
 * Create a new site for an account by cloning the sample template and
 * personalizing its identity (slug, base URL, business name).
 */
export async function createSiteForOwner(
  ownerId: string,
  opts: { slug: string; businessName?: string },
): Promise<Site> {
  const draft = structuredClone(sampleSite);
  draft.slug = opts.slug;
  draft.baseUrl = `https://${opts.slug}.fishysites.com`;
  if (opts.businessName) draft.profile.name = opts.businessName;

  const valid = parseSite(draft);
  await getPrisma().site.create({
    data: {
      slug: valid.slug,
      name: valid.profile.name,
      themeId: valid.themeId,
      data: asJson(valid),
      ownerId,
    },
  });
  return valid;
}
