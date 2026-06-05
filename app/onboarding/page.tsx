import type { Metadata } from "next";
import { getSite, getCurrentUserId } from "@/lib/site";
import { getUserById } from "@/lib/users";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Set up your site · FishySites",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const site = await getSite();
  const user = await getUserById(await getCurrentUserId());

  // Start the interview blank (the starter site is a generic template), but keep
  // the current appearance + the account email as sensible defaults.
  const defaults = {
    businessName: "",
    captainName: "",
    city: "",
    state: "",
    phone: "",
    email: user?.email ?? "",
    templateId: site.templateId,
    paletteId: site.paletteId,
    fontId: site.fontId,
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 font-bold">
          <span aria-hidden className="mr-2">🐟</span> FishySites
        </div>
      </header>
      <OnboardingWizard defaults={defaults} />
    </div>
  );
}
