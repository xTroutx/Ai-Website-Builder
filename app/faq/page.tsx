import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/site";
import { getSingletonPage } from "@/lib/schema";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageRenderer } from "@/components/templates/PageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const page = getSingletonPage(site, "faq");
  return page ? buildMetadata(site, page) : {};
}

export default async function FaqRoute() {
  const site = await getSite();
  const page = getSingletonPage(site, "faq");
  if (!page) notFound();
  return (
    <>
      <JsonLd site={site} page={page} />
      <PageRenderer site={site} page={page} />
    </>
  );
}
