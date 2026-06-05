import "dotenv/config";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseSite } from "../lib/schema";
import { sampleSite } from "../lib/sample";

/**
 * Seeds the database with a default owner and the sample site. Run after
 * `prisma migrate dev` (or via `prisma db seed`, wired in prisma.config.ts).
 * Idempotent — safe to run repeatedly.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — cannot seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const site = parseSite(sampleSite);

  const owner = await prisma.user.upsert({
    where: { email: "owner@fishysites.local" },
    update: {},
    create: { email: "owner@fishysites.local", name: "FishySites Owner" },
  });

  await prisma.site.upsert({
    where: { slug: site.slug },
    update: {
      name: site.profile.name,
      themeId: site.themeId,
      data: site as unknown as Prisma.InputJsonValue,
    },
    create: {
      slug: site.slug,
      name: site.profile.name,
      themeId: site.themeId,
      data: site as unknown as Prisma.InputJsonValue,
      ownerId: owner.id,
    },
  });

  console.log(`✅ Seeded owner + site "${site.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
