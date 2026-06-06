import type { Metadata } from "next";
import { getSite, isCurrentSiteSuspended } from "@/lib/site";
import { getHomePage, getPageBySlug, type Page } from "@/lib/schema";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { EditorShell } from "@/components/editor/EditorShell";
import { SuspendedNotice } from "@/components/SuspendedNotice";

export const metadata: Metadata = {
  title: "FishySites Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function pageLabel(page: Page): string {
  switch (page.pageType) {
    case "home":
      return "Home";
    case "about":
      return "About";
    case "faq":
      return "FAQ";
    case "contact":
      return "Contact";
    case "trip":
      return `Trip · ${page.slug}`;
    case "species":
      return `Species · ${page.slug}`;
    case "location":
      return `Location · ${page.slug}`;
    case "report":
      return `Report · ${page.slug}`;
  }
}

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (await isCurrentSiteSuspended()) return <SuspendedNotice showDashboardLink />;

  const site = await getSite();
  const { page: pageParam } = await searchParams;
  const page =
    (pageParam ? getPageBySlug(site, pageParam) : undefined) ?? getHomePage(site);

  const pages = site.pages.map((p) => ({ slug: p.slug, label: pageLabel(p) }));

  return (
    <EditorShell key={page.slug} site={site} pageSlug={page.slug} pages={pages}>
      <PageRenderer site={site} page={page} />
    </EditorShell>
  );
}
