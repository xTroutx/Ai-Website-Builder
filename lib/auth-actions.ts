"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { getPrisma } from "./db";
import { getUserByEmail } from "./users";
import { createSiteForOwner, slugExists } from "./store-db";

export type AuthFormState = { error?: string };

const SignupSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  businessName: z.string().trim().min(1).optional(),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base) || "charter";
  if (await slugExists(slug)) slug = `${slug}-${randomUUID().slice(0, 6)}`;
  return slug;
}

/** Create an account + its starter site, then sign the captain in. */
export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    businessName: formData.get("businessName") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const { password, businessName } = parsed.data;

  if (await getUserByEmail(email)) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await getPrisma().user.create({
    data: { email, name: businessName ?? null, passwordHash },
  });

  const slug = await uniqueSlug(businessName ?? email.split("@")[0]);
  await createSiteForOwner(user.id, { slug, businessName });

  // signIn throws a redirect (to /editor) on success — let it propagate.
  try {
    await signIn("credentials", { email, password, redirectTo: "/editor" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Could not sign in." };
    throw error;
  }
  return {};
}

/** Log in an existing captain. */
export async function authenticate(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/editor",
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid email or password." };
    throw error; // redirect (success) and other errors propagate
  }
  return {};
}

/** Sign out and return to the login page. */
export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
