import { ahrefsGet } from "./client";

/**
 * Real SEO keyword research via the Ahrefs API v3 — the data the generation
 * pipeline picks keywords from. Per the owner's hard rule, keywords are NEVER
 * invented: these functions return real Ahrefs metrics or throw (AhrefsError),
 * and the generator halts rather than guessing.
 */

export type SearchIntents = {
  informational?: boolean;
  navigational?: boolean;
  commercial?: boolean;
  transactional?: boolean;
  branded?: boolean;
  local?: boolean;
};

export type KeywordMetrics = {
  keyword: string;
  /** Avg. monthly searches in the target country. */
  volume: number | null;
  /** Keyword Difficulty, 0–100. */
  difficulty: number | null;
  /** Cost per click, in USD cents. */
  cpc: number | null;
  intents: SearchIntents | null;
  parentTopic: string | null;
  globalVolume: number | null;
};

type OverviewRow = {
  keyword: string;
  volume: number | null;
  difficulty: number | null;
  cpc: number | null;
  intents: SearchIntents | null;
  parent_topic: string | null;
  global_volume: number | null;
};

/**
 * Volume + difficulty + intent for a set of keywords (Keywords Explorer
 * overview). `country` is an ISO 3166-1 alpha-2 code (default "us").
 */
export async function keywordOverview(
  keywords: string[],
  country = "us",
): Promise<KeywordMetrics[]> {
  const list = keywords.map((k) => k.trim()).filter(Boolean);
  if (!list.length) return [];
  const data = await ahrefsGet<{ keywords?: OverviewRow[] }>("/keywords-explorer/overview", {
    select: "keyword,volume,difficulty,cpc,intents,parent_topic,global_volume",
    country,
    keywords: list.join(","),
  });
  return (data.keywords ?? []).map((k) => ({
    keyword: k.keyword,
    volume: k.volume ?? null,
    difficulty: k.difficulty ?? null,
    cpc: k.cpc ?? null,
    intents: k.intents ?? null,
    parentTopic: k.parent_topic ?? null,
    globalVolume: k.global_volume ?? null,
  }));
}

/**
 * Given seed keywords, return the real "matching terms" with their metrics —
 * the actual phrasing people search, used to expand a seed into candidates.
 */
export async function matchingTerms(
  seed: string,
  country = "us",
  limit = 50,
): Promise<KeywordMetrics[]> {
  if (!seed.trim()) return [];
  const data = await ahrefsGet<{ keywords?: OverviewRow[] }>("/keywords-explorer/matching-terms", {
    select: "keyword,volume,difficulty,cpc,intents,parent_topic,global_volume",
    country,
    keywords: seed.trim(),
    limit,
    order_by: "volume:desc",
  });
  return (data.keywords ?? []).map((k) => ({
    keyword: k.keyword,
    volume: k.volume ?? null,
    difficulty: k.difficulty ?? null,
    cpc: k.cpc ?? null,
    intents: k.intents ?? null,
    parentTopic: k.parent_topic ?? null,
    globalVolume: k.global_volume ?? null,
  }));
}

/**
 * Pick the best primary keyword from a candidate set: highest volume among
 * candidates whose difficulty is within reach for the site's Domain Rating.
 * Returns null if no candidate has usable data (caller halts — never guesses).
 */
export function pickPrimaryKeyword(
  candidates: KeywordMetrics[],
  domainRating = 0,
): KeywordMetrics | null {
  // A simple, auditable rule: cap difficulty near the site's authority, then take
  // the highest-volume keyword under that cap. Conservative for brand-new sites.
  const maxKd = Math.max(15, Math.min(60, domainRating + 15));
  const usable = candidates.filter((c) => typeof c.volume === "number" && typeof c.difficulty === "number");
  if (!usable.length) return null;
  const inReach = usable.filter((c) => (c.difficulty ?? 100) <= maxKd);
  const pool = inReach.length ? inReach : usable;
  return pool.reduce((best, c) => ((c.volume ?? 0) > (best.volume ?? 0) ? c : best));
}
