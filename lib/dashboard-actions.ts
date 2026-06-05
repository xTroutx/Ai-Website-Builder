"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getCurrentUserId } from "./site";
import { getSiteSummaryForOwner, setPublishedForOwner } from "./store-db";
import { getUserById, updateUserName, updateUserPassword } from "./users";

export type AccountState = { error?: string; success?: string };

/** Flip the current account's site between Live and Draft. */
export async function togglePublish(): Promise<void> {
  const uid = await getCurrentUserId();
  const summary = await getSiteSummaryForOwner(uid);
  await setPublishedForOwner(uid, !summary.published);
  revalidatePath("/dashboard");
}

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
});

/** Change the current account's password (verifies the current one). */
export async function changePassword(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const uid = await getCurrentUserId();
  const parsed = PasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const user = await getUserById(uid);
  if (!user?.passwordHash) return { error: "No password is set for this account." };

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  await updateUserPassword(uid, await bcrypt.hash(parsed.data.newPassword, 10));
  return { success: "Password updated." };
}

/** Update the account's display name. */
export async function updateName(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const uid = await getCurrentUserId();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name cannot be empty." };
  await updateUserName(uid, name);
  revalidatePath("/dashboard");
  return { success: "Name updated." };
}
