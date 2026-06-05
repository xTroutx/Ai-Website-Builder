import type { Page, Site } from "@/lib/schema";
import { Editable, editPath } from "@/components/primitives/Editable";
import { AccentBar, Container } from "@/components/primitives/ui";
import { SiteShell } from "./SiteShell";
import { SectionRenderer } from "./SectionRenderer";

/**
 * Renders a full page from the Site JSON inside the themed site shell.
 *
 * Single-h1 rule: a page's one <h1> is `seo.h1`. If the first visible section is
 * a hero, that hero renders the h1 (its headline). Otherwise we render a compact
 * page header carrying the h1 so every page has exactly one — important for SEO
 * and accessibility.
 */
export function PageRenderer({ site, page }: { site: Site; page: Page }) {
  const visible = page.sections.filter((s) => !s.hidden);
  const leadIsHero = visible[0]?.type === "hero";

  return (
    <SiteShell site={site}>
      {!leadIsHero ? (
        <header className="bg-surface py-16 text-ink sm:py-20">
          <Container>
            <div className="flex flex-col gap-5">
              <Editable
                as="h1"
                path={editPath(page.slug, "seo", "h1")}
                className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight text-ink sm:text-6xl"
              >
                {page.seo.h1}
              </Editable>
              <AccentBar />
            </div>
          </Container>
        </header>
      ) : null}

      {visible.map((section, i) => (
        <SectionRenderer
          key={section.id}
          section={section}
          site={site}
          page={page}
          isLead={i === 0}
        />
      ))}
    </SiteShell>
  );
}
