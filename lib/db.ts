import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma client singleton.
 *
 * Uses the node-postgres driver adapter (Prisma 7 requires an adapter; the
 * connection URL is no longer read from schema.prisma). Against Neon, point
 * DATABASE_URL at the POOLED connection string ("...-pooler...") so serverless
 * invocations don't exhaust connections.
 *
 * Created lazily so importing this module never throws when DATABASE_URL is
 * absent — the file-backed store (local dev without a DB) never reaches here.
 */
const globalForPrisma = globalThis as unknown as {
  __fishysitesPrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (globalForPrisma.__fishysitesPrisma) return globalForPrisma.__fishysitesPrisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — cannot connect to the database.");
  }
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  // Reuse across hot-reloads / warm serverless invocations.
  globalForPrisma.__fishysitesPrisma = client;
  return client;
}
