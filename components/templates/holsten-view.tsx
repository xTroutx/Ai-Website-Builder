import type { Page, Site } from "@/lib/schema";
import { Editable, editPath } from "@/components/primitives/Editable";
import { Container } from "@/components/primitives/ui";
import { HolstenShell } from "./holsten/shell";
import { HolstenSectionRenderer } from "./holsten/sections";

/**
 * The "Holston River" template — a dark, rugged fly-fishing design (translated
 * from the Holsten River Figma): olive bands, gold accents, ultra-condensed
 * uppercase headings. A self-contained renderer of the Site JSON that owns its
 * chrome (HolstenShell) and section layouts (HolstenSectionRenderer) while using
 * the shared editable primitives, so the builder works identically across designs.
 *
 * Single-h1 rule: the page's one <h1> is the hero headline when a hero leads,
 * otherwise a compact dark header carries seo.h1.
 */
export function HolstenPageView({ site, page }: { site: Site; page: Page }) {
  const visible = page.sections.filter((s) => !s.hidden);
  const leadIsHero = visible[0]?.type === "hero";

  return (
    <HolstenShell site={site}>
      {!leadIsHero ? (
        <header className="bg-bg py-16 text-ink sm:py-20">
          <Container>
            <div className="flex flex-col gap-5">
              <span aria-hidden className="h-px w-12 bg-primary" />
              <Editable
                as="h1"
                path={editPath(page.slug, "seo", "h1")}
                className="font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-[72px]"
              >
                {page.seo.h1}
              </Editable>
            </div>
          </Container>
        </header>
      ) : null}

      {visible.map((section, i) => (
        <HolstenSectionRenderer
          key={section.id}
          section={section}
          site={site}
          page={page}
          isLead={i === 0}
        />
      ))}
    </HolstenShell>
  );
}
