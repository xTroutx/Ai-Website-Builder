import { Prisma } from "@/lib/generated/prisma/client";
import { getPrisma } from "./db";
import { parseSite, type Site } from "./schema";
import { sampleSite } from "./sample";

/**
 * Postgres-backed Site store (used when DATABASE_URL is set — i.e. on Vercel,
 * and locally once Neon is configured). The full Site JSON lives in
 * `Site.data`; we parseSite() it on read so the Zod validation boundary sits
 * exactly here, where the DB boundary is.
 *
 * DB-persistence-first phase: a single site keyed by the sample's slug, owned by
 * a default user. Multi-tenant lookup by request subdomain comes later.
 */

const SITE_SLUG = sampleSite.slug;
const OWNER_EMAIL = "owner@fishysites.local";

/** Cast a validated Site to Prisma's JSON input type for the `data` column. */
function asJson(site: Site): Prisma.InputJsonValue {
  return site as unknown as Prisma.InputJsonValue;
}

export async function readSite(): Promise<Site> {
  const prisma = getPrisma();
  const row = await prisma.site.findUnique({ where: { slug: SITE_SLUG } });
  if (!row) {
    await ensureSeed();
    return parseSite(sampleSite);
  }
  return parseSite(row.data);
}

export async function writeSite(site: Site): Promise<void> {
  const prisma = getPrisma();
  const valid = parseSite(site);
  await ensureSeed(); // guarantees the row + owner exist
  await prisma.site.update({
    where: { slug: valid.slug },
    data: {
      data: asJson(valid),
      name: valid.profile.name,
      themeId: valid.themeId,
    },
  });
}

/** Create the default owner + sample site if they don't exist yet. */
async function ensureSeed(): Promise<void> {
  const prisma = getPrisma();
  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: { email: OWNER_EMAIL, name: "FishySites Owner" },
  });
  await prisma.site.upsert({
    where: { slug: SITE_SLUG },
    update: {},
    create: {
      slug: SITE_SLUG,
      name: sampleSite.profile.name,
      themeId: sampleSite.themeId,
      data: asJson(parseSite(sampleSite)),
      ownerId: owner.id,
    },
  });
}
