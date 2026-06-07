import type { Page, Site } from "@/lib/schema";
import { getTemplateView } from "./registry";

/**
 * Renders a page using the site's selected template. This is the single seam the
 * app renders through (editor preview + public routes); it dispatches to the
 * template view registered for `site.templateId` (falling back to Coastal).
 */
export function PageRenderer({ site, page }: { site: Site; page: Page }) {
  const { PageView } = getTemplateView(site.templateId);
  return <PageView site={site} page={page} />;
}
