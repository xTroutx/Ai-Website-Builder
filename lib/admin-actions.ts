"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setSiteSuspended } from "./store-db";
import { setAnthropicKey, clearAnthropicKey, setAhrefsKey, clearAhrefsKey } from "./settings";

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Forbidden: admin only.");
  }
}

/** Admin-only: suspend/reinstate a site. Driven by the admin table form. */
export async function toggleSuspendAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const siteId = String(formData.get("siteId") ?? "");
  const suspended = String(formData.get("suspended") ?? "") === "true";
  if (!siteId) return;
  await setSiteSuspended(siteId, suspended);
  revalidatePath("/admin");
  revalidatePath("/", "layout"); // reflect on the affected captain's site/editor
}

/** Admin-only: set or remove the platform Anthropic API key. */
export async function saveAnthropicKeyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const intent = String(formData.get("intent") ?? "save");
  if (intent === "remove") {
    await clearAnthropicKey();
  } else {
    const key = String(formData.get("apiKey") ?? "").trim();
    if (key) await setAnthropicKey(key);
  }
  revalidatePath("/admin");
}

/** Admin-only: set or remove the platform Ahrefs API key (SEO keyword research). */
export async function saveAhrefsKeyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const intent = String(formData.get("intent") ?? "save");
  if (intent === "remove") {
    await clearAhrefsKey();
  } else {
    const key = String(formData.get("apiKey") ?? "").trim();
    if (key) await setAhrefsKey(key);
  }
  revalidatePath("/admin");
}
