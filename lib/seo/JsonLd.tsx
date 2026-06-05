import type { Page, Site } from "../schema";
import { buildJsonLdGraph } from "./structured-data";

/**
 * Renders the page's structured data as one or more
 * <script type="application/ld+json"> tags. Server-rendered into the page so
 * crawlers see it in the initial HTML.
 */
export function JsonLd({ site, page }: { site: Site; page: Page }) {
  const nodes = buildJsonLdGraph(site, page);
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inline; no user-controlled HTML.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
