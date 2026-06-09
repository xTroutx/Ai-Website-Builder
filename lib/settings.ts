import { getPrisma } from "./db";
import { encryptSecret, decryptSecret } from "./crypto";

/**
 * Platform settings (single row). Currently holds the Anthropic API key managed
 * from the admin console, stored encrypted. Resolution order for the live key:
 * admin-stored key first, then the ANTHROPIC_API_KEY env var as a fallback.
 */
const ID = "global";

export async function setAnthropicKey(plaintext: string): Promise<void> {
  const enc = encryptSecret(plaintext.trim());
  await getPrisma().platformSettings.upsert({
    where: { id: ID },
    update: { anthropicKeyEnc: enc },
    create: { id: ID, anthropicKeyEnc: enc },
  });
}

export async function clearAnthropicKey(): Promise<void> {
  await getPrisma().platformSettings.upsert({
    where: { id: ID },
    update: { anthropicKeyEnc: null },
    create: { id: ID, anthropicKeyEnc: null },
  });
}

/** The usable API key (admin-stored, else env), or null if none. Server-only. */
export async function getAnthropicApiKey(): Promise<string | null> {
  const row = await getPrisma().platformSettings.findUnique({ where: { id: ID } });
  if (row?.anthropicKeyEnc) {
    try {
      return decryptSecret(row.anthropicKeyEnc);
    } catch {
      // fall through to env if decryption fails (e.g. AUTH_SECRET rotated)
    }
  }
  return process.env.ANTHROPIC_API_KEY ?? null;
}

// ── Ahrefs API key (real SEO keyword research at generation time) ───────────

export async function setAhrefsKey(plaintext: string): Promise<void> {
  const enc = encryptSecret(plaintext.trim());
  await getPrisma().platformSettings.upsert({
    where: { id: ID },
    update: { ahrefsKeyEnc: enc },
    create: { id: ID, ahrefsKeyEnc: enc },
  });
}

export async function clearAhrefsKey(): Promise<void> {
  await getPrisma().platformSettings.upsert({
    where: { id: ID },
    update: { ahrefsKeyEnc: null },
    create: { id: ID, ahrefsKeyEnc: null },
  });
}

/** The usable Ahrefs API key (admin-stored, else env), or null if none. Server-only. */
export async function getAhrefsApiKey(): Promise<string | null> {
  const row = await getPrisma().platformSettings.findUnique({ where: { id: ID } });
  if (row?.ahrefsKeyEnc) {
    try {
      return decryptSecret(row.ahrefsKeyEnc);
    } catch {
      // fall through to env if decryption fails (e.g. AUTH_SECRET rotated)
    }
  }
  return process.env.AHREFS_API_KEY ?? null;
}

/** Masked status for the admin UI — never returns the full key. */
export async function getAhrefsKeyStatus(): Promise<AnthropicKeyStatus> {
  const row = await getPrisma().platformSettings.findUnique({ where: { id: ID } });
  if (row?.ahrefsKeyEnc) {
    try {
      const key = decryptSecret(row.ahrefsKeyEnc);
      return { connected: true, source: "admin", last4: key.slice(-4) };
    } catch {
      // ignore
    }
  }
  const env = process.env.AHREFS_API_KEY;
  if (env) return { connected: true, source: "env", last4: env.slice(-4) };
  return { connected: false, source: null, last4: null };
}

export type AnthropicKeyStatus = {
  connected: boolean;
  source: "admin" | "env" | null;
  last4: string | null;
};

/** Masked status for the admin UI — never returns the full key. */
export async function getAnthropicKeyStatus(): Promise<AnthropicKeyStatus> {
  const row = await getPrisma().platformSettings.findUnique({ where: { id: ID } });
  if (row?.anthropicKeyEnc) {
    try {
      const key = decryptSecret(row.anthropicKeyEnc);
      return { connected: true, source: "admin", last4: key.slice(-4) };
    } catch {
      // ignore
    }
  }
  const env = process.env.ANTHROPIC_API_KEY;
  if (env) return { connected: true, source: "env", last4: env.slice(-4) };
  return { connected: false, source: null, last4: null };
}
