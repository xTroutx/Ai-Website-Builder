import type { Metadata } from "next";
import { getSite, isCurrentSiteSuspended } from "@/lib/site";
import { getHomePage } from "@/lib/schema";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { SuspendedNotice } from "@/components/SuspendedNotice";

/**
 * The logged-in captain's own site preview (full render of their home page).
 * Gated by the proxy. This used to live at `/`; `/` is now the public FishySites
 * marketing page. Public per-tenant (subdomain) serving of published sites is a
 * separate, later step.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildMetadata(site, getHomePage(site));
}

export default async function PreviewRoute() {
  if (await isCurrentSiteSuspended()) {
    return <SuspendedNotice showDashboardLink />;
  }
  const site = await getSite();
  const page = getHomePage(site);
  return (
    <>
      <JsonLd site={site} page={page} />
      <PageRenderer site={site} page={page} />
    </>
  );
}
