import { promises as fs } from "node:fs";
import path from "node:path";
import { parseSite, type Site } from "./schema";
import { sampleSite } from "./sample";

/**
 * File-backed Site JSON store — the LOCAL-DEV fallback used when DATABASE_URL is
 * not set. Edits go to `.data/site.json`. This does NOT work on Vercel (the
 * serverless filesystem is ephemeral); the DB store (store-db.ts) is used there.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const SITE_FILE = path.join(DATA_DIR, "site.json");

export async function readSite(): Promise<Site> {
  try {
    const raw = await fs.readFile(SITE_FILE, "utf8");
    return parseSite(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await writeSite(sampleSite);
      return sampleSite;
    }
    throw err;
  }
}

export async function writeSite(site: Site): Promise<void> {
  const valid = parseSite(site);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SITE_FILE, JSON.stringify(valid, null, 2), "utf8");
}
