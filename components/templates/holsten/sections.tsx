import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta, Page, Section, Site, SectionBackground } from "@/lib/schema";
import { Editable, editPath } from "@/components/primitives/Editable";
import { MediaPlaceholder } from "@/components/primitives/MediaPlaceholder";
import { Container } from "@/components/primitives/ui";

/**
 * Renders one Site-JSON section in the "Holston River" design — dark olive bands
 * with gold accents, ultra-condensed uppercase headings, gold rule-and-eyebrow
 * kickers, and gold arrow buttons. Pure function of the data: switches
 * exhaustively on `section.type`. Same content contract as the Coastal renderer
 * (every editable value carries a `data-edit` path); only the design differs.
 */
export function HolstenSectionRenderer({
  section,
  site,
  page,
  isLead,
}: {
  section: Section;
  site: Site;
  page: Page;
  isLead: boolean;
}) {
  if (section.hidden) return null;
  const base = editPath(page.slug, section.id);

  switch (section.type) {
    case "hero":
      return <Hero section={section} base={base} isLead={isLead} />;
    case "mediaText":
      return <MediaText section={section} base={base} />;
    case "richText":
      return <RichText section={section} base={base} />;
    case "featureGrid":
      return <FeatureGrid section={section} base={base} />;
    case "tripCards":
      return <TripCards section={section} base={base} />;
    case "speciesCards":
      return <SpeciesCards section={section} base={base} />;
    case "pricingTable":
      return <PricingTable section={section} base={base} />;
    case "gallery":
      return <Gallery section={section} base={base} />;
    case "testimonials":
      return <Testimonials section={section} base={base} />;
    case "faq":
      return <Faq section={section} base={base} />;
    case "infoList":
      return <InfoList section={section} base={base} />;
    case "stats":
      return <Stats section={section} base={base} />;
    case "ctaBanner":
      return <CtaBanner section={section} base={base} />;
    case "contact":
      return <Contact section={section} base={base} site={site} />;
    case "articleBody":
      return <ArticleBody section={section} base={base} />;
    case "mediaCards":
      return <MediaCards section={section} base={base} />;
    case "checklist":
      return <Checklist section={section} base={base} />;
    case "rateTable":
      return <RateTable section={section} base={base} />;
    case "pricedOffering":
      return <PricedOffering section={section} base={base} />;
    case "steps":
      return <Steps section={section} base={base} />;
    case "map":
      return <MapBlock section={section} base={base} site={site} />;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}

type S<T extends Section["type"]> = Extract<Section, { type: T }>;

// ── shared design primitives ────────────────────────────────────────────────

const HEADING_CLS =
  "font-heading font-bold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-[56px]";

/** Whether a section should center its content — its `align`, or the template default. */
function isCentered(section: { align?: "left" | "center" }, fallback: "left" | "center"): boolean {
  return (section.align ?? fallback) === "center";
}

/** Background color utility for a curated per-card background color token. */
function cardBgClass(color?: string): string {
  return color === "surface"
    ? "bg-surface"
    : color === "band"
      ? "bg-band text-on-band"
      : color === "primary"
        ? "bg-primary text-on-primary"
        : "bg-bg";
}

/** Per-card image/video background + optional overlay, behind card content. */
function CardBackground({
  media,
  overlay,
  dataEdit,
}: {
  media?: SectionBackground["media"];
  overlay?: SectionBackground["overlay"];
  dataEdit: string;
}) {
  return (
    <div data-edit={dataEdit} className="absolute inset-0">
      {media?.src ? (
        media.kind === "video" ? (
          <video src={media.src} className="absolute inset-0 size-full object-cover" muted loop playsInline />
        ) : (
          <Image src={media.src} alt={media.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
        )
      ) : null}
      {overlay ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: overlay.tone === "dark" ? "#000" : "#fff", opacity: overlay.opacity / 100 }}
        />
      ) : null}
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 8" fill="none" className={["h-2 w-8 shrink-0", className ?? ""].join(" ")} aria-hidden>
      <path d="M0 4h30M27 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Gold rule + wide-tracked uppercase kicker (the design's signature eyebrow). */
function Eyebrow({ text, path, center }: { text: string; path: string; center?: boolean }) {
  return (
    <div className={["flex items-center gap-4", center ? "justify-center" : ""].join(" ")}>
      <span aria-hidden className="h-px w-12 bg-primary" />
      <Editable as="p" path={path} className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary">
        {text}
      </Editable>
    </div>
  );
}

/** Section heading (h2) with the condensed display face. */
function Heading({ text, path, center }: { text: string; path: string; center?: boolean }) {
  return (
    <Editable as="h2" path={path} className={[HEADING_CLS, center ? "text-center" : ""].join(" ")}>
      {text}
    </Editable>
  );
}

const ctaCls: Record<Cta["variant"], string> = {
  primary:
    "bg-primary text-on-primary px-6 py-4 font-heading text-[18px] font-bold uppercase tracking-wide rounded-theme hover:opacity-90",
  secondary:
    "border border-current px-6 py-4 font-heading text-[18px] font-bold uppercase tracking-wide rounded-theme hover:opacity-80",
  link: "font-heading text-[18px] font-bold uppercase tracking-wide hover:opacity-80",
};

/** Gold/outline/inline CTA with the design's long arrow. */
function CtaLink({ cta, path, className }: { cta: Cta; path: string; className?: string }) {
  const cls = ["inline-flex items-center justify-center gap-3 text-center transition", ctaCls[cta.variant], className ?? ""].join(" ");
  const content = (
    <>
      {cta.label}
      <Arrow />
    </>
  );
  const isInternal = cta.href.startsWith("/") && !cta.external;
  if (isInternal) {
    return (
      <Link href={cta.href} data-edit={path} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <a href={cta.href} data-edit={path} className={cls} {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {content}
    </a>
  );
}

/** Background image/video + overlay layer, shared by Band, hero, and cta. */
function SectionBackdrop({
  media,
  overlay,
  dataEdit,
  defaultOverlay,
}: {
  media?: SectionBackground["media"];
  overlay?: SectionBackground["overlay"];
  dataEdit?: string;
  defaultOverlay?: boolean;
}) {
  const ov = overlay ?? (media?.src && defaultOverlay ? { tone: "dark" as const, opacity: 45 } : undefined);
  return (
    <div data-edit={dataEdit} className="absolute inset-0 -z-10">
      {media?.src ? (
        media.kind === "video" ? (
          <video src={media.src} className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline />
        ) : (
          <Image src={media.src} alt={media.alt} fill sizes="100vw" className="object-cover" />
        )
      ) : null}
      {ov ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: ov.tone === "dark" ? "#000" : "#fff", opacity: ov.opacity / 100 }}
        />
      ) : null}
    </div>
  );
}

/**
 * A section band. `tone` is the default treatment (dark page color, slightly
 * lifted surface, or the light contrasting band); the captain's per-section `bg`
 * overrides it. `anchor` (page.slug.sectionId) makes the section selectable.
 */
function Band({
  children,
  tone = "bg",
  className,
  bg,
  anchor,
}: {
  children: ReactNode;
  tone?: "bg" | "surface" | "band";
  className?: string;
  bg?: SectionBackground;
  anchor?: string;
}) {
  const toneClass =
    tone === "band" ? "bg-band text-on-band" : tone === "surface" ? "bg-surface text-ink" : "bg-bg text-ink";
  const colorClass =
    bg?.color === "surface"
      ? "bg-surface text-ink"
      : bg?.color === "band"
        ? "bg-band text-on-band"
        : bg?.color === "primary"
          ? "bg-primary text-on-primary"
          : toneClass;
  const hasMedia = Boolean(bg?.media?.src);
  return (
    <section
      data-section={anchor}
      className={[
        "relative isolate py-16 sm:py-20 lg:py-[100px]",
        hasMedia ? "text-white" : colorClass,
        className ?? "",
      ].join(" ")}
    >
      {hasMedia || bg?.overlay ? (
        <SectionBackdrop
          media={bg?.media}
          overlay={bg?.overlay}
          defaultOverlay
          dataEdit={anchor ? `${anchor}.background.media` : undefined}
        />
      ) : null}
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────── hero ──
function Hero({ section, base, isLead }: { section: S<"hero">; base: string; isLead: boolean }) {
  const HeadingTag = isLead ? "h1" : "h2";
  const heroMedia = section.background?.media?.src ? section.background.media : section.media;
  const heroMediaPath = section.background?.media?.src ? editPath(base, "background", "media") : editPath(base, "media");
  const overlay = section.background?.overlay;
  return (
    <section data-section={base} className="relative isolate overflow-hidden bg-bg text-white">
      <div data-edit={heroMediaPath} className="absolute inset-0 -z-10">
        {heroMedia?.src ? (
          heroMedia.kind === "video" ? (
            <video src={heroMedia.src} className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline />
          ) : (
            <Image src={heroMedia.src} alt={heroMedia.alt} fill priority sizes="100vw" className="object-cover" />
          )
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-surface"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-ink) 6%, transparent) 0 2px, transparent 2px 14px)",
            }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: "#000", opacity: (overlay?.opacity ?? 42) / 100 }}
        />
      </div>

      <Container>
        <div className="flex max-w-[900px] flex-col gap-7 py-28 sm:py-36 lg:py-44">
          {section.eyebrow ? <Eyebrow text={section.eyebrow} path={editPath(base, "eyebrow")} /> : null}
          <Editable
            as={HeadingTag}
            path={editPath(base, "headline")}
            className="font-heading text-[52px] font-bold uppercase leading-[0.92] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)] sm:text-7xl lg:text-[100px]"
          >
            {section.headline}
          </Editable>
          {section.subheadline ? (
            <Editable as="p" path={editPath(base, "subheadline")} className="max-w-[760px] text-lg leading-relaxed text-white/90">
              {section.subheadline}
            </Editable>
          ) : null}
          {section.primaryCta || section.secondaryCta ? (
            <div className="mt-2 flex flex-wrap items-center gap-6">
              {section.primaryCta ? <CtaLink cta={section.primaryCta} path={editPath(base, "primaryCta")} /> : null}
              {section.secondaryCta ? <CtaLink cta={section.secondaryCta} path={editPath(base, "secondaryCta")} /> : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────── mediaText ──
function MediaText({ section, base }: { section: S<"mediaText">; base: string }) {
  const imageFirst = section.mediaSide === "left";
  const center = isCentered(section, "left");
  return (
    <Band tone={section.tone === "light" ? "band" : "bg"} bg={section.background} anchor={base}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
            <MediaPlaceholder media={section.media} path={editPath(base, "media")} ratio="5 / 4" rounded={false} />
          </div>
          <div className={["flex flex-col gap-6", center ? "items-center text-center" : "", imageFirst ? "lg:order-2" : "lg:order-1"].join(" ")}>
            {section.eyebrow ? <Eyebrow text={section.eyebrow} path={editPath(base, "eyebrow")} /> : null}
            <Heading text={section.heading} path={editPath(base, "heading")} />
            <div className="flex flex-col gap-4">
              {section.body.map((para, i) => (
                <Editable key={i} as="p" path={editPath(base, "body", i)} className="leading-relaxed opacity-90">
                  {para}
                </Editable>
              ))}
            </div>
            {section.cta ? (
              <div>
                <CtaLink cta={section.cta} path={editPath(base, "cta")} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────────────── richText ──
function RichText({ section, base }: { section: S<"richText">; base: string }) {
  const center = isCentered(section, "left");
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <div className={["flex max-w-3xl flex-col gap-5", center ? "mx-auto items-center text-center" : ""].join(" ")}>
          {section.heading ? <Heading text={section.heading} path={editPath(base, "heading")} center={center} /> : null}
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="text-lg leading-relaxed opacity-90">
              {para}
            </Editable>
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────── featureGrid ──
function FeatureGrid({ section, base }: { section: S<"featureGrid">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col items-center gap-5">
            <Heading text={section.heading} path={editPath(base, "heading")} center />
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <div key={i} className="rounded-theme border border-line bg-surface p-6">
              {item.icon ? (
                <Editable as="div" path={editPath(base, "items", i, "icon")} className="mb-3 text-3xl text-primary">
                  {item.icon}
                </Editable>
              ) : null}
              <Editable as="h3" path={editPath(base, "items", i, "title")} className="font-heading text-xl font-bold uppercase">
                {item.title}
              </Editable>
              <Editable as="p" path={editPath(base, "items", i, "body")} className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </Editable>
            </div>
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────────── tripCards ──
function TripCards({ section, base }: { section: S<"tripCards">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} />
          </div>
        ) : null}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {section.trips.map((trip, i) => {
            const tBase = editPath(base, "trips", i);
            const center = (trip.align ?? "left") === "center";
            return (
              <article
                key={i}
                data-block={editPath(tBase)}
                className={["flex flex-col overflow-hidden rounded-theme", cardBgClass(trip.background?.color)].join(" ")}
              >
                {trip.media ? (
                  <MediaPlaceholder media={trip.media} path={editPath(tBase, "media")} ratio="3 / 2" rounded={false} />
                ) : null}
                <div className={["flex flex-1 flex-col gap-4 p-7", center ? "items-center text-center" : ""].join(" ")}>
                  <Editable as="h3" path={editPath(tBase, "title")} className="font-heading text-2xl font-bold uppercase">
                    {trip.title}
                  </Editable>
                  <Editable as="p" path={editPath(tBase, "summary")} className="text-sm leading-relaxed text-muted">
                    {trip.summary}
                  </Editable>
                  {trip.duration || typeof trip.priceFrom === "number" ? (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {trip.duration ? <Editable as="span" path={editPath(tBase, "duration")}>{trip.duration}</Editable> : null}
                      {typeof trip.priceFrom === "number" ? (
                        <Editable as="span" path={editPath(tBase, "priceFrom")}>{`From $${trip.priceFrom}`}</Editable>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="mt-auto pt-2">
                    <a
                      href={trip.slug ? `/trips/${trip.slug}` : "/contact"}
                      className="inline-flex items-center gap-3 bg-primary px-5 py-3 font-heading text-[16px] font-bold uppercase tracking-wide text-on-primary transition hover:opacity-90"
                    >
                      {trip.slug ? "Explore Trip" : "Book Now"}
                      <Arrow />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────────── speciesCards ──
// In the Holston design this is the light "Destination Trips" band: image cards
// with a gold category label and the name set over a gradient at the bottom.
function SpeciesCards({ section, base }: { section: S<"speciesCards">; base: string }) {
  return (
    <Band tone="band" bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} />
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.species.map((sp, i) => {
            const spBase = editPath(base, "species", i);
            const bgMedia = sp.background?.media?.src ? sp.background.media : sp.media;
            const center = (sp.align ?? "left") === "center";
            const card = (
              <article
                data-block={editPath(spBase)}
                className={["group relative aspect-[3/4] overflow-hidden rounded-theme", cardBgClass(sp.background?.color)].join(" ")}
              >
                <CardBackground media={bgMedia} overlay={sp.background?.overlay} dataEdit={editPath(spBase, "background", "media")} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div
                  className={[
                    "absolute inset-x-0 flex flex-col gap-1 p-5",
                    center ? "inset-y-0 items-center justify-center text-center" : "bottom-0",
                  ].join(" ")}
                >
                  {sp.season ? (
                    <Editable as="p" path={editPath(spBase, "season")} className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {sp.season}
                    </Editable>
                  ) : null}
                  <Editable as="h3" path={editPath(spBase, "name")} className="font-heading text-2xl font-bold uppercase text-white">
                    {sp.name}
                  </Editable>
                </div>
              </article>
            );
            return sp.slug ? (
              <a key={i} href={`/species/${sp.slug}`} className="block">
                {card}
              </a>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────── pricingTable ──
function PricingTable({ section, base }: { section: S<"pricingTable">; base: string }) {
  return (
    <Band tone="band" bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col items-center gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} center />
          </div>
        ) : null}
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {section.tiers.map((tier, i) => {
            const tBase = editPath(base, "tiers", i);
            return (
              <div
                key={i}
                className={[
                  "flex flex-col rounded-theme bg-white p-8 text-on-band",
                  tier.featured ? "ring-2 ring-primary" : "border border-black/10",
                ].join(" ")}
              >
                {tier.featured ? (
                  <span className="mb-4 inline-block self-start bg-primary px-3 py-1 font-heading text-xs font-bold uppercase tracking-wide text-on-primary">
                    Most popular
                  </span>
                ) : null}
                <Editable as="h3" path={editPath(tBase, "name")} className="font-heading text-2xl font-bold uppercase">
                  {tier.name}
                </Editable>
                <div className="mt-2 flex items-baseline gap-1">
                  <Editable as="span" path={editPath(tBase, "price")} className="font-heading text-4xl font-bold">
                    {`$${tier.price}`}
                  </Editable>
                  {tier.unit ? (
                    <Editable as="span" path={editPath(tBase, "unit")} className="text-sm opacity-70">
                      {tier.unit}
                    </Editable>
                  ) : null}
                </div>
                {tier.description ? (
                  <Editable as="p" path={editPath(tBase, "description")} className="mt-3 text-sm opacity-80">
                    {tier.description}
                  </Editable>
                ) : null}
                {tier.features.length ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex gap-2">
                        <span aria-hidden className="font-bold text-primary">✓</span>
                        <Editable as="span" path={editPath(tBase, "features", fi)}>{f}</Editable>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {tier.cta ? (
                  <div className="mt-6">
                    <CtaLink cta={tier.cta} path={editPath(tBase, "cta")} className="w-full" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────────────── gallery ──
function Gallery({ section, base }: { section: S<"gallery">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} />
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {section.images.map((img, i) => (
            <MediaPlaceholder key={i} media={img} path={editPath(base, "images", i)} ratio="1 / 1" rounded={false} />
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────── testimonials ──
function Testimonials({ section, base }: { section: S<"testimonials">; base: string }) {
  return (
    <Band tone="band" bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col items-center gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} center />
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-3">
          {section.items.map((t, i) => {
            const tBase = editPath(base, "items", i);
            return (
              <figure key={i} className="flex flex-col gap-4 rounded-theme bg-white p-7 text-on-band shadow-sm">
                <span aria-hidden className="font-heading text-5xl leading-none text-primary">
                  &ldquo;
                </span>
                <Editable as="blockquote" path={editPath(tBase, "quote")} className="flex-1 leading-relaxed">
                  {t.quote}
                </Editable>
                <figcaption className="flex items-center gap-3 border-t border-black/10 pt-4">
                  <span aria-hidden className="grid size-9 place-items-center rounded-full bg-black/10 text-xs font-bold uppercase">
                    {t.author.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    {typeof t.rating === "number" ? (
                      <span className="text-sm text-primary" aria-label={`${t.rating} out of 5 stars`}>
                        {"★".repeat(Math.max(0, Math.min(5, t.rating)))}
                      </span>
                    ) : null}
                    <span className="font-heading text-sm font-bold uppercase tracking-wide">
                      <Editable as="span" path={editPath(tBase, "author")}>{t.author}</Editable>
                      {t.location ? (
                        <Editable as="span" path={editPath(tBase, "location")} className="opacity-60">
                          {` · ${t.location}`}
                        </Editable>
                      ) : null}
                    </span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────────────── faq ──
function Faq({ section, base }: { section: S<"faq">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-10 flex flex-col gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} />
          </div>
        ) : null}
        <dl className="mx-auto max-w-3xl divide-y divide-line">
          {section.items.map((item, i) => (
            <div key={i} className="py-5">
              <Editable as="dt" path={editPath(base, "items", i, "question")} className="font-heading text-xl font-bold uppercase">
                {item.question}
              </Editable>
              <Editable as="dd" path={editPath(base, "items", i, "answer")} className="mt-2 leading-relaxed text-muted">
                {item.answer}
              </Editable>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────────────── infoList ──
function InfoList({ section, base }: { section: S<"infoList">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-8 flex flex-col gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} />
          </div>
        ) : null}
        <dl className="mx-auto grid max-w-3xl gap-px overflow-hidden rounded-theme border border-line bg-line sm:grid-cols-2">
          {section.items.map((item, i) => (
            <div key={i} className="bg-bg p-4">
              <Editable as="dt" path={editPath(base, "items", i, "label")} className="text-xs font-bold uppercase tracking-wide text-primary">
                {item.label}
              </Editable>
              <Editable as="dd" path={editPath(base, "items", i, "value")} className="mt-1">
                {item.value}
              </Editable>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────────────── stats ──
function Stats({ section, base }: { section: S<"stats">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        {section.heading ? (
          <div className="mb-12 flex flex-col items-center gap-4">
            <Heading text={section.heading} path={editPath(base, "heading")} center />
          </div>
        ) : null}
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <div key={i} className="text-center">
              <Editable as="dt" path={editPath(base, "items", i, "value")} className="font-heading text-5xl font-bold text-primary lg:text-6xl">
                {item.value}
              </Editable>
              <Editable as="dd" path={editPath(base, "items", i, "label")} className="mt-1 text-sm uppercase tracking-wide text-muted">
                {item.label}
              </Editable>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────────── ctaBanner ──
function CtaBanner({ section, base }: { section: S<"ctaBanner">; base: string }) {
  const ctaMedia = section.background?.media?.src ? section.background.media : section.media;
  const hasMedia = Boolean(ctaMedia?.src);
  const center = isCentered(section, "center");
  const inner = (
    <Container>
      <div className={["flex flex-col gap-6", center ? "items-center text-center" : "items-start text-left"].join(" ")}>
        <Editable
          as="h2"
          path={editPath(base, "heading")}
          className={[HEADING_CLS, hasMedia ? "text-white" : "text-ink"].join(" ")}
        >
          {section.heading}
        </Editable>
        {section.body ? (
          <Editable as="p" path={editPath(base, "body")} className={["max-w-xl text-lg", hasMedia ? "text-white/90" : "text-muted"].join(" ")}>
            {section.body}
          </Editable>
        ) : null}
        <div className="mt-2">
          <CtaLink cta={section.cta} path={editPath(base, "cta")} />
        </div>
      </div>
    </Container>
  );

  if (hasMedia && ctaMedia) {
    const ctaMediaPath = section.background?.media?.src ? editPath(base, "background", "media") : editPath(base, "media");
    const overlay = section.background?.overlay ?? { tone: "dark" as const, opacity: 60 };
    return (
      <section data-section={base} className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-[100px]">
        <SectionBackdrop media={ctaMedia} overlay={overlay} dataEdit={ctaMediaPath} />
        {inner}
      </section>
    );
  }

  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      {inner}
    </Band>
  );
}

// ───────────────────────────────────────────────────────────────── contact ──
function Contact({ section, base, site }: { section: S<"contact">; base: string; site: Site }) {
  const { contact } = site.profile;
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {section.heading ? <Heading text={section.heading} path={editPath(base, "heading")} /> : null}
            {section.body ? (
              <Editable as="p" path={editPath(base, "body")} className="text-muted">
                {section.body}
              </Editable>
            ) : null}
            {section.showBusinessDetails ? (
              <ul className="mt-2 space-y-3">
                <li>
                  <span className="font-heading font-bold uppercase">Phone: </span>
                  <a className="text-primary hover:underline" href={`tel:${contact.phone}`}>{contact.phone}</a>
                </li>
                <li>
                  <span className="font-heading font-bold uppercase">Email: </span>
                  <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <span className="font-heading font-bold uppercase">Location: </span>
                  {[contact.address.street, contact.address.city, contact.address.region, contact.address.postalCode].filter(Boolean).join(", ")}
                </li>
              </ul>
            ) : null}
          </div>

          {section.showLeadForm ? (
            <form data-locked="true" className="rounded-theme border border-line bg-surface p-6" aria-label="Booking inquiry form">
              <div className="grid gap-4">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Preferred dates" name="dates" />
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full rounded-theme border border-line bg-bg px-3 py-2" />
                </div>
                <button type="submit" disabled className="inline-flex items-center justify-center gap-3 rounded-theme bg-primary px-5 py-3 font-heading font-bold uppercase tracking-wide text-on-primary opacity-70">
                  Send inquiry
                  <Arrow />
                </button>
                <p className="text-xs text-muted">Form submission is enabled after launch.</p>
              </div>
            </form>
          ) : null}
        </div>
      </Container>
    </Band>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={name} name={name} type={type} className="w-full rounded-theme border border-line bg-bg px-3 py-2" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────── articleBody ──
function ArticleBody({ section, base }: { section: S<"articleBody">; base: string }) {
  const center = isCentered(section, "left");
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <article className={["mx-auto flex max-w-3xl flex-col gap-5", center ? "items-center text-center" : ""].join(" ")}>
          {section.pullQuote ? (
            <Editable as="blockquote" path={editPath(base, "pullQuote")} className="border-l-4 border-primary pl-5 font-heading text-2xl font-bold uppercase leading-tight">
              {section.pullQuote}
            </Editable>
          ) : null}
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="text-lg leading-relaxed opacity-90">
              {para}
            </Editable>
          ))}
        </article>
      </Container>
    </Band>
  );
}

// ── shared helpers for the richer sections ──────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={["size-4 shrink-0", className ?? ""].join(" ")} aria-hidden>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

/** Optional section heading + intro paragraph, in the design's rhythm. */
function Intro({ heading, intro, base, center }: { heading?: string; intro?: string; base: string; center?: boolean }) {
  if (!heading && !intro) return null;
  return (
    <div className={["mb-12 flex flex-col gap-4", center ? "items-center text-center" : ""].join(" ")}>
      {heading ? <Heading text={heading} path={editPath(base, "heading")} center={center} /> : null}
      {intro ? (
        <Editable as="p" path={editPath(base, "intro")} className="max-w-2xl text-lg leading-relaxed opacity-90">
          {intro}
        </Editable>
      ) : null}
    </div>
  );
}

const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** A column-header + labelled-row pricing matrix. Inherits surrounding text color. */
function RateMatrixTable({ table, path }: { table: import("@/lib/schema").RateMatrix; path: string }) {
  return (
    <div>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-current/20">
            <th className="py-2 pr-4 font-heading text-base font-bold uppercase tracking-wide">&nbsp;</th>
            {table.columns.map((c, i) => (
              <th key={i} className="py-2 pl-4 text-right font-heading text-base font-bold uppercase tracking-wide text-primary">
                <Editable as="span" path={editPath(path, "columns", i)}>{c}</Editable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-current/10 last:border-0">
              <td className="py-2.5 pr-4 font-medium">
                <Editable as="span" path={editPath(path, "rows", ri, "label")}>{row.label}</Editable>
              </td>
              {row.values.map((v, vi) => (
                <td key={vi} className="py-2.5 pl-4 text-right tabular-nums">
                  <Editable as="span" path={editPath(path, "rows", ri, "values", vi)}>{v}</Editable>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note ? (
        <Editable as="p" path={editPath(path, "note")} className="mt-3 text-xs opacity-60">{table.note}</Editable>
      ) : null}
    </div>
  );
}

// ────────────────────────────────────────────────────────────── mediaCards ──
function MediaCards({ section, base }: { section: S<"mediaCards">; base: string }) {
  const cards = section.cards.map((card, i) => {
    const cBase = editPath(base, "cards", i);
    const center = (card.align ?? "left") === "center";
    return (
      <article
        key={i}
        data-block={editPath(cBase)}
        className={[
          "flex flex-col overflow-hidden rounded-theme",
          cardBgClass(card.background?.color),
          section.layout === "carousel" ? "w-[300px] shrink-0 snap-start sm:w-[340px]" : "",
        ].join(" ")}
      >
        {card.media ? (
          <MediaPlaceholder media={card.media} path={editPath(cBase, "media")} ratio="3 / 2" rounded={false} />
        ) : null}
        <div className={["flex flex-1 flex-col gap-3 p-6", center ? "items-center text-center" : ""].join(" ")}>
          {card.eyebrow ? (
            <Editable as="p" path={editPath(cBase, "eyebrow")} className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {card.eyebrow}
            </Editable>
          ) : null}
          <Editable as="h3" path={editPath(cBase, "title")} className="font-heading text-xl font-bold uppercase">
            {card.title}
          </Editable>
          {card.body ? (
            <Editable as="p" path={editPath(cBase, "body")} className="text-sm leading-relaxed text-muted">
              {card.body}
            </Editable>
          ) : null}
          {card.details.length ? (
            <dl className="mt-1 flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
              {card.details.map((d, di) => (
                <div key={di} className="flex justify-between gap-4">
                  <Editable as="dt" path={editPath(cBase, "details", di, "label")} className="text-muted">{d.label}</Editable>
                  <Editable as="dd" path={editPath(cBase, "details", di, "value")} className="text-right font-medium">{d.value}</Editable>
                </div>
              ))}
            </dl>
          ) : null}
          {card.cta ? (
            <div className="mt-auto pt-3">
              <CtaLink cta={card.cta} path={editPath(cBase, "cta")} className="!px-0 !py-0 text-primary" />
            </div>
          ) : null}
        </div>
      </article>
    );
  });

  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} center={isCentered(section, "left")} />
        {section.layout === "carousel" ? (
          <div className="-mx-1 flex snap-x gap-6 overflow-x-auto px-1 pb-4">{cards}</div>
        ) : (
          <div className={["grid gap-6", GRID_COLS[section.columns]].join(" ")}>{cards}</div>
        )}
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────────── checklist ──
function Checklist({ section, base }: { section: S<"checklist">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} center={isCentered(section, "left")} />
        <ul className={["grid gap-x-10 gap-y-3", GRID_COLS[section.columns] ?? ""].join(" ")}>
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckIcon className="mt-1 text-primary" />
              <Editable as="span" path={editPath(base, "items", i)} className="leading-relaxed">
                {item}
              </Editable>
            </li>
          ))}
        </ul>
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────────── rateTable ──
function RateTable({ section, base }: { section: S<"rateTable">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} center={isCentered(section, "center")} />
        <div className="mx-auto max-w-2xl rounded-theme bg-surface p-7">
          <RateMatrixTable table={section.table} path={editPath(base, "table")} />
        </div>
      </Container>
    </Band>
  );
}

// ─────────────────────────────────────────────────────────── pricedOffering ──
function PricedOffering({ section, base }: { section: S<"pricedOffering">; base: string }) {
  const detailsRight = section.detailsSide === "right";
  const textCol = (
    <div className="flex flex-col gap-6">
      {section.eyebrow ? <Eyebrow text={section.eyebrow} path={editPath(base, "eyebrow")} /> : null}
      <Heading text={section.heading} path={editPath(base, "heading")} />
      {section.media ? (
        <MediaPlaceholder media={section.media} path={editPath(base, "media")} ratio="3 / 2" rounded={false} />
      ) : null}
      {section.body.length ? (
        <div className="flex flex-col gap-4">
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="leading-relaxed opacity-90">
              {para}
            </Editable>
          ))}
        </div>
      ) : null}
      {section.primaryCta || section.secondaryCta ? (
        <div className="flex flex-wrap gap-4">
          {section.primaryCta ? <CtaLink cta={section.primaryCta} path={editPath(base, "primaryCta")} /> : null}
          {section.secondaryCta ? <CtaLink cta={section.secondaryCta} path={editPath(base, "secondaryCta")} /> : null}
        </div>
      ) : null}
    </div>
  );
  const detailsCol = (
    <div className="flex flex-col gap-6">
      {section.rate ? (
        <div className="rounded-theme bg-surface p-7">
          <RateMatrixTable table={section.rate} path={editPath(base, "rate")} />
        </div>
      ) : null}
      {section.included.length ? (
        <div className="rounded-theme border border-line p-7">
          <Editable
            as="h3"
            path={editPath(base, "includedTitle")}
            className="mb-4 font-heading text-lg font-bold uppercase"
          >
            {section.includedTitle ?? "What's Included"}
          </Editable>
          <ul className="flex flex-col gap-2.5 text-sm">
            {section.included.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 text-primary" />
                <Editable as="span" path={editPath(base, "included", i)} className="leading-relaxed">
                  {item}
                </Editable>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={detailsRight ? "lg:order-1" : "lg:order-2"}>{textCol}</div>
          <div className={detailsRight ? "lg:order-2" : "lg:order-1"}>{detailsCol}</div>
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────────────── steps ──
function Steps({ section, base }: { section: S<"steps">; base: string }) {
  const cols = section.items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : section.items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} center={isCentered(section, "center")} />
        <div className={["grid gap-8", cols].join(" ")}>
          {section.items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 border-t-2 border-primary pt-5">
              {item.kicker ? (
                <Editable as="p" path={editPath(base, "items", i, "kicker")} className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {item.kicker}
                </Editable>
              ) : null}
              <Editable as="h3" path={editPath(base, "items", i, "title")} className="font-heading text-xl font-bold uppercase">
                {item.title}
              </Editable>
              <Editable as="p" path={editPath(base, "items", i, "body")} className="text-sm leading-relaxed text-muted">
                {item.body}
              </Editable>
            </div>
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────────────────── map ──
function MapBlock({ section, base, site }: { section: S<"map">; base: string; site: Site }) {
  const { address } = site.profile.contact;
  const query = [address.street, address.city, address.region, address.postalCode]
    .filter(Boolean)
    .join(", ");
  const src = section.embedUrl ?? `https://www.google.com/maps?q=${encodeURIComponent(query || "United States")}&output=embed`;
  return (
    <Band bg={section.background} anchor={base} className="!py-0">
      <div className="relative">
        {section.heading ? (
          <Container className="py-10">
            <Intro heading={section.heading} intro={section.intro} base={base} center={isCentered(section, "left")} />
          </Container>
        ) : null}
        <iframe
          title={section.heading ?? "Map"}
          src={src}
          className="block h-[420px] w-full border-0 grayscale-[0.2]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Band>
  );
}
