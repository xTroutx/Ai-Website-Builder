"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId, getSite, saveSite } from "./site";
import { applyOnboarding, type OnboardingInput } from "./onboarding";
import { getPrisma } from "./db";

const OnboardingSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required."),
  captainName: z.string().trim().min(1, "Captain name is required."),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  phone: z.string().trim().min(1, "Phone is required."),
  email: z.email("Enter a valid contact email."),
  foundedYear: z.number().int().gte(1900).lte(2100).optional(),
  fishingTypes: z.array(z.string()).default([]),
  species: z.array(z.string()).default([]),
  description: z.string().trim().min(1, "Tell us a bit about your charter."),
  templateId: z.string().min(1),
  paletteId: z.string().min(1),
  fontId: z.string().min(1),
});

export type OnboardingResult = { error?: string };

/** Apply the onboarding answers to the account's site, then go to the dashboard. */
export async function completeOnboarding(
  input: OnboardingInput,
): Promise<OnboardingResult> {
  const parsed = OnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your answers." };
  }

  const uid = await getCurrentUserId();
  const site = await getSite();

  try {
    const updated = applyOnboarding(site, parsed.data);
    await saveSite(updated);
  } catch {
    return { error: "Could not build your site from those answers. Please try again." };
  }

  await getPrisma().user.update({
    where: { id: uid },
    data: { onboardedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  redirect("/dashboard"); // throws NEXT_REDIRECT — navigation happens here
}
