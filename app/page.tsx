import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { getHomePage } from "@/lib/schema";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageRenderer } from "@/components/templates/PageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildMetadata(site, getHomePage(site));
}

export default async function HomeRoute() {
  const site = await getSite();
  const page = getHomePage(site);
  return (
    <>
      <JsonLd site={site} page={page} />
      <PageRenderer site={site} page={page} />
    </>
  );
}
