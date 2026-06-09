import { getAhrefsApiKey } from "../settings";

/**
 * Low-level client for the Ahrefs API v3. Auth is a Bearer token (the platform's
 * Ahrefs key, admin-managed/encrypted, same as the Anthropic key). Server-only.
 *
 * The generation pipeline uses this for REAL keyword research — there is no
 * fallback or guessing: if the key is missing or the API errors, callers get an
 * AhrefsError and generation must halt rather than invent SEO data.
 */
const BASE = "https://api.ahrefs.com/v3";

export class AhrefsError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AhrefsError";
  }
}

/** GET a JSON resource from the Ahrefs API v3. Throws AhrefsError on missing key or non-2xx. */
export async function ahrefsGet<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  const key = await getAhrefsApiKey();
  if (!key) {
    throw new AhrefsError("No Ahrefs API key configured — add one in the admin console.");
  }
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    // Keyword data changes slowly; let the platform cache identical lookups briefly.
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AhrefsError(`Ahrefs API ${res.status}: ${body.slice(0, 300)}`, res.status);
  }
  return (await res.json()) as T;
}
