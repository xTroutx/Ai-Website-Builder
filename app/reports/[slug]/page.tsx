import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/site";
import { getPageByTypeAndSlug, getPagesOfType } from "@/lib/schema";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageRenderer } from "@/components/templates/PageRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const site = await getSite();
  return getPagesOfType(site, "report").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const page = getPageByTypeAndSlug(site, "report", slug);
  return page ? buildMetadata(site, page) : {};
}

export default async function ReportRoute({ params }: Params) {
  const { slug } = await params;
  const site = await getSite();
  const page = getPageByTypeAndSlug(site, "report", slug);
  if (!page) notFound();
  return (
    <>
      <JsonLd site={site} page={page} />
      <PageRenderer site={site} page={page} />
    </>
  );
}
