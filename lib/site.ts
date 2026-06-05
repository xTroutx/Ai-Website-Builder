import { auth } from "@/auth";
import {
  getSiteByOwnerId,
  writeSiteBySlug,
  getSiteSummaryForOwner,
} from "./store-db";
import type { Site } from "./schema";

/**
 * The seam through which the app loads/saves Site JSON for the CURRENT account.
 *
 * Resolution is by the logged-in user (routes are gated by middleware, so a
 * session is always present here). Later, public tenant sites will additionally
 * resolve by request subdomain — that will be a new function alongside these,
 * leaving the editor's owner-scoped path unchanged.
 */
export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Not authenticated.");
  return id;
}

/** The current account's site. */
export async function getSite(): Promise<Site> {
  return getSiteByOwnerId(await getCurrentUserId());
}

/** Persist edits to the current account's site. */
export async function saveSite(site: Site): Promise<void> {
  return writeSiteBySlug(site);
}

/** Dashboard summary for the current account's site. */
export async function getSiteSummary() {
  return getSiteSummaryForOwner(await getCurrentUserId());
}
