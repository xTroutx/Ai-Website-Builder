"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setSiteSuspended } from "./store-db";

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
