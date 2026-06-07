import type { Page, Site } from "@/lib/schema";
import { Editable, editPath } from "@/components/primitives/Editable";
import { AccentBar, Container } from "@/components/primitives/ui";
import { SiteShell } from "./SiteShell";
import { SectionRenderer } from "./SectionRenderer";

/**
 * The "Coastal" template — the first design (translated from the Bounty Hunter /
 * Crystal Coast Figma). A template is a self-contained renderer of the Site JSON:
 * it owns its chrome (SiteShell) and section layouts (SectionRenderer) but uses
 * the shared editable primitives so the builder works identically across designs.
 *
 * Additional templates implement the same `({ site, page })` contract and
 * register in ./registry; `templateId` on the site selects which one renders.
 *
 * Single-h1 rule: the page's one <h1> is the hero headline when a hero leads,
 * otherwise a compact header carries seo.h1.
 */
export function CoastalPageView({ site, page }: { site: Site; page: Page }) {
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
