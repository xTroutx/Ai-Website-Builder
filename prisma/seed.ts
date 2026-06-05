import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseSite } from "../lib/schema";
import { sampleSite } from "../lib/sample";

/**
 * Seeds a demo account (so you can log in immediately) that owns the sample
 * site. Run after a schema change via `npm run db:seed`. Idempotent.
 *
 *   login: demo@fishysites.local  /  fishysites123
 */
const DEMO_EMAIL = "demo@fishysites.local";
const DEMO_PASSWORD = "fishysites123";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set — cannot seed.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const site = parseSite(sampleSite);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const data = site as unknown as Prisma.InputJsonValue;

  const owner = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash },
    create: { email: DEMO_EMAIL, name: "Demo Captain", passwordHash },
  });

  await prisma.site.upsert({
    where: { slug: site.slug },
    update: { name: site.profile.name, themeId: site.themeId, data, ownerId: owner.id },
    create: {
      slug: site.slug,
      name: site.profile.name,
      themeId: site.themeId,
      data,
      ownerId: owner.id,
    },
  });

  console.log(`✅ Seeded demo account (${DEMO_EMAIL} / ${DEMO_PASSWORD}) + site "${site.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
