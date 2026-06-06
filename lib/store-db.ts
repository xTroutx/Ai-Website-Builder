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
      themeId: valid.paletteId,
    },
  });
}

/** Lightweight summary of an account's site for the dashboard. */
export async function getSiteSummaryForOwner(ownerId: string): Promise<{
  slug: string;
  name: string;
  templateId: string;
  paletteId: string;
  fontId: string;
  published: boolean;
  suspended: boolean;
  pageCount: number;
  profileName: string;
}> {
  const row = await getPrisma().site.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
  });
  if (!row) throw new Error("This account has no site yet.");
  const site = parseSite(row.data);
  return {
    slug: row.slug,
    name: row.name,
    templateId: site.templateId,
    paletteId: site.paletteId,
    fontId: site.fontId,
    published: row.published,
    suspended: row.suspended,
    pageCount: site.pages.length,
    profileName: site.profile.name,
  };
}

/** Whether an account's site is currently suspended (lightweight check). */
export async function getSiteSuspendedForOwner(ownerId: string): Promise<boolean> {
  const row = await getPrisma().site.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
    select: { suspended: true },
  });
  return row?.suspended ?? false;
}

// ── Platform admin queries ────────────────────────────────────────────────

/** All sites with owner info, for the admin console (excludes the heavy JSON). */
export async function listAllSites() {
  return getPrisma().site.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      published: true,
      suspended: true,
      createdAt: true,
      owner: { select: { email: true, name: true } },
    },
  });
}

/** Headline counts for the admin overview. */
export async function getPlatformCounts() {
  const [users, sites, published, suspended] = await Promise.all([
    getPrisma().user.count(),
    getPrisma().site.count(),
    getPrisma().site.count({ where: { published: true } }),
    getPrisma().site.count({ where: { suspended: true } }),
  ]);
  return { users, sites, published, suspended };
}

/** Admin: suspend or reinstate a site by id. */
export async function setSiteSuspended(siteId: string, suspended: boolean) {
  await getPrisma().site.update({ where: { id: siteId }, data: { suspended } });
}

/** Set the published flag on an account's site. */
export async function setPublishedForOwner(
  ownerId: string,
  published: boolean,
): Promise<boolean> {
  const row = await getPrisma().site.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
  });
  if (!row) throw new Error("This account has no site yet.");
  await getPrisma().site.update({ where: { id: row.id }, data: { published } });
  return published;
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
      themeId: valid.paletteId,
      data: asJson(valid),
      ownerId,
    },
  });
  return valid;
}
