import Image from "next/image";
import type { ReactNode } from "react";
import type { Page, Section, Site, SectionBackground } from "@/lib/schema";
import { Editable, editPath } from "@/components/primitives/Editable";
import { MediaPlaceholder } from "@/components/primitives/MediaPlaceholder";
import {
  AccentBar,
  Chevron,
  Container,
  CtaLink,
  Eyebrow,
  SectionHeading,
  Stars,
} from "@/components/primitives/ui";

/**
 * Renders one content section from the Site JSON. Pure function of the data:
 * switches exhaustively on `section.type` (the `never` check enforces coverage)
 * and emits the Crystal Coast design's markup with `data-edit` paths on every
 * editable value. Design lives here; only content comes from the JSON.
 */
export function SectionRenderer({
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
  const ov = overlay ?? (media?.src && defaultOverlay ? { tone: "dark" as const, opacity: 40 } : undefined);
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
 * Section band with the design's vertical rhythm. `tone` is the section's default
 * color; the captain's per-section `bg` (color/media/overlay) overrides it.
 * `anchor` (page.slug.sectionId) makes the whole section selectable in the editor.
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
    tone === "band"
      ? "bg-band text-on-band"
      : tone === "surface"
        ? "bg-surface text-ink"
        : "bg-bg text-ink";
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

// ─────────────────────────────────────────────────────────────── hero ──
function Hero({ section, base, isLead }: { section: S<"hero">; base: string; isLead: boolean }) {
  const HeadingTag = isLead ? "h1" : "h2";
  // Prefer a section-background image (set via the Section panel) over the legacy hero media.
  const heroMedia = section.background?.media?.src ? section.background.media : section.media;
  const heroMediaPath = section.background?.media?.src
    ? editPath(base, "background", "media")
    : editPath(base, "media");
  return (
    <section data-section={base} className="relative isolate overflow-hidden bg-bg text-ink">
      {/* Full-bleed media backdrop (solid-color placeholder until real assets). */}
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
        {/* Dark wash + fade to the page color at the bottom for legibility. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(105deg, color-mix(in srgb, var(--color-bg) 80%, transparent) 18%, transparent 60%), linear-gradient(to bottom, transparent 55%, var(--color-bg) 92%)",
          }}
        />
        {section.background?.overlay ? (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: section.background.overlay.tone === "dark" ? "#000" : "#fff",
              opacity: section.background.overlay.opacity / 100,
            }}
          />
        ) : null}
      </div>

      <Container>
        <div className="flex max-w-[820px] flex-col gap-8 py-24 sm:py-32 lg:py-40">
          <div className="flex flex-col gap-5">
            {section.eyebrow ? (
              <Eyebrow text={section.eyebrow} path={editPath(base, "eyebrow")} />
            ) : null}
            <Editable
              as={HeadingTag}
              path={editPath(base, "headline")}
              className="font-heading text-[44px] font-bold uppercase leading-[1.05] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)] sm:text-6xl lg:text-[88px]"
            >
              {section.headline}
            </Editable>
            {section.subheadline ? (
              <Editable as="p" path={editPath(base, "subheadline")} className="max-w-prose text-lg text-ink/85">
                {section.subheadline}
              </Editable>
            ) : null}
          </div>
          {section.primaryCta || section.secondaryCta ? (
            <div className="flex flex-wrap gap-4">
              {section.primaryCta ? (
                <CtaLink cta={section.primaryCta} path={editPath(base, "primaryCta")} />
              ) : null}
              {section.secondaryCta ? (
                <CtaLink cta={section.secondaryCta} path={editPath(base, "secondaryCta")} />
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

// ────────────────────────────────────────────────────────────── mediaText ──
function MediaText({ section, base }: { section: S<"mediaText">; base: string }) {
  const imageFirst = section.mediaSide === "left";
  return (
    <Band tone={section.tone === "light" ? "band" : "bg"} bg={section.background} anchor={base}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
            <MediaPlaceholder media={section.media} path={editPath(base, "media")} ratio="5 / 4" />
          </div>
          <div className={["flex flex-col gap-6", imageFirst ? "lg:order-2" : "lg:order-1"].join(" ")}>
            {section.eyebrow ? (
              <Eyebrow text={section.eyebrow} path={editPath(base, "eyebrow")} />
            ) : null}
            <div className="flex flex-col gap-5">
              <Editable
                as="h2"
                path={editPath(base, "heading")}
                className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl"
              >
                {section.heading}
              </Editable>
              <AccentBar />
            </div>
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

// ─────────────────────────────────────────────────────────────── richText ──
function RichText({ section, base }: { section: S<"richText">; base: string }) {
  const center = (section.align ?? "left") === "center";
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <div className={["flex max-w-3xl flex-col gap-4", center ? "mx-auto items-center text-center" : ""].join(" ")}>
          <SectionHeading text={section.heading} path={editPath(base, "heading")} align={center ? "center" : "left"} />
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="text-lg leading-relaxed text-muted">
              {para}
            </Editable>
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────── featureGrid ──
function FeatureGrid({ section, base }: { section: S<"featureGrid">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <div key={i} className="rounded-theme border border-line bg-bg p-6">
              {item.icon ? (
                <Editable as="div" path={editPath(base, "items", i, "icon")} className="mb-3 text-3xl">
                  {item.icon}
                </Editable>
              ) : null}
              <Editable as="h3" path={editPath(base, "items", i, "title")} className="font-heading text-xl font-bold uppercase text-ink">
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
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="grid gap-8 sm:grid-cols-2">
          {section.trips.map((trip, i) => {
            const tBase = editPath(base, "trips", i);
            return (
              <article key={i} className="flex flex-col overflow-hidden rounded-theme bg-surface">
                {trip.media ? (
                  <MediaPlaceholder media={trip.media} path={editPath(tBase, "media")} ratio="2 / 1" rounded={false} />
                ) : null}
                <div className="flex flex-1 flex-col gap-8 p-8">
                  <div className="flex flex-col gap-[18px]">
                    <Editable as="h3" path={editPath(tBase, "title")} className="font-heading text-3xl font-bold uppercase text-ink">
                      {trip.title}
                    </Editable>
                    <Editable as="p" path={editPath(tBase, "summary")} className="text-muted">
                      {trip.summary}
                    </Editable>
                  </div>
                  <div className="mt-auto flex flex-wrap justify-end gap-6 font-heading text-lg font-bold uppercase tracking-wide">
                    {trip.slug ? (
                      <a href={`/trips/${trip.slug}`} className="inline-flex items-center gap-1 text-ink transition hover:opacity-80">
                        Learn more
                        <Chevron />
                      </a>
                    ) : null}
                    <a href="/contact" className="inline-flex items-center gap-1 text-primary transition hover:opacity-80">
                      Book now
                      <Chevron />
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

// ──────────────────────────────────────────────────────── speciesCards ──
function SpeciesCards({ section, base }: { section: S<"speciesCards">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {section.species.map((sp, i) => {
            const spBase = editPath(base, "species", i);
            const card = (
              <article className="flex h-full flex-col overflow-hidden rounded-theme bg-bg">
                {sp.media ? (
                  <MediaPlaceholder media={sp.media} path={editPath(spBase, "media")} ratio="2 / 1" rounded={false} />
                ) : null}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <Editable as="h3" path={editPath(spBase, "name")} className="font-heading text-2xl font-bold uppercase text-ink">
                    {sp.name}
                  </Editable>
                  {sp.season ? (
                    <Editable as="p" path={editPath(spBase, "season")} className="text-xs font-bold uppercase tracking-wide text-primary">
                      {sp.season}
                    </Editable>
                  ) : null}
                  <Editable as="p" path={editPath(spBase, "blurb")} className="text-sm text-muted">
                    {sp.blurb}
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

// ─────────────────────────────────────────────────────── pricingTable ──
function PricingTable({ section, base }: { section: S<"pricingTable">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {section.tiers.map((tier, i) => {
            const tBase = editPath(base, "tiers", i);
            return (
              <div key={i} className={["flex flex-col rounded-theme bg-bg p-8", tier.featured ? "ring-2 ring-primary" : "border border-line"].join(" ")}>
                {tier.featured ? (
                  <span className="mb-4 inline-block self-start bg-primary px-3 py-1 font-heading text-xs font-bold uppercase tracking-wide text-on-primary">
                    Most popular
                  </span>
                ) : null}
                <Editable as="h3" path={editPath(tBase, "name")} className="font-heading text-2xl font-bold uppercase text-ink">
                  {tier.name}
                </Editable>
                <div className="mt-2 flex items-baseline gap-1">
                  <Editable as="span" path={editPath(tBase, "price")} className="font-heading text-4xl font-bold text-ink">
                    {`$${tier.price}`}
                  </Editable>
                  {tier.unit ? (
                    <Editable as="span" path={editPath(tBase, "unit")} className="text-sm text-muted">
                      {tier.unit}
                    </Editable>
                  ) : null}
                </div>
                {tier.description ? (
                  <Editable as="p" path={editPath(tBase, "description")} className="mt-3 text-sm text-muted">
                    {tier.description}
                  </Editable>
                ) : null}
                {tier.features.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-ink">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex gap-2">
                        <span aria-hidden className="text-primary">✓</span>
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

// ────────────────────────────────────────────────────────────── gallery ──
function Gallery({ section, base }: { section: S<"gallery">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {section.images.map((img, i) => (
            <MediaPlaceholder key={i} media={img} path={editPath(base, "images", i)} ratio="1 / 1" rounded={false} />
          ))}
        </div>
      </Container>
    </Band>
  );
}

// ───────────────────────────────────────────────────────── testimonials ──
function Testimonials({ section, base }: { section: S<"testimonials">; base: string }) {
  return (
    <Band tone="band" bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <div className="grid gap-6 md:grid-cols-3">
          {section.items.map((t, i) => {
            const tBase = editPath(base, "items", i);
            return (
              <figure key={i} className="flex flex-col gap-4 rounded-theme border border-on-band/15 bg-on-band/[0.03] p-7">
                {typeof t.rating === "number" ? <Stars rating={t.rating} /> : null}
                <Editable as="blockquote" path={editPath(tBase, "quote")} className="flex-1 text-lg leading-relaxed">
                  {`“${t.quote}”`}
                </Editable>
                <figcaption className="font-heading text-sm font-bold uppercase tracking-wide">
                  <Editable as="span" path={editPath(tBase, "author")}>{t.author}</Editable>
                  {t.location ? (
                    <Editable as="span" path={editPath(tBase, "location")} className="opacity-70">
                      {` · ${t.location}`}
                    </Editable>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}

// ────────────────────────────────────────────────────────────────── faq ──
function Faq({ section, base }: { section: S<"faq">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} className="mb-10" />
        <dl className="mx-auto max-w-3xl divide-y divide-line">
          {section.items.map((item, i) => (
            <div key={i} className="py-5">
              <Editable as="dt" path={editPath(base, "items", i, "question")} className="font-heading text-xl font-bold uppercase text-ink">
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

// ───────────────────────────────────────────────────────────── infoList ──
function InfoList({ section, base }: { section: S<"infoList">; base: string }) {
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} className="mb-8" />
        <dl className="mx-auto grid max-w-3xl gap-px overflow-hidden rounded-theme border border-line bg-line sm:grid-cols-2">
          {section.items.map((item, i) => (
            <div key={i} className="bg-bg p-4">
              <Editable as="dt" path={editPath(base, "items", i, "label")} className="text-xs font-bold uppercase tracking-wide text-muted">
                {item.label}
              </Editable>
              <Editable as="dd" path={editPath(base, "items", i, "value")} className="mt-1 text-ink">
                {item.value}
              </Editable>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

// ──────────────────────────────────────────────────────────────── stats ──
function Stats({ section, base }: { section: S<"stats">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <SectionHeading text={section.heading} path={editPath(base, "heading")} align="center" className="mb-12 items-center" />
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <div key={i} className="text-center">
              <Editable as="dt" path={editPath(base, "items", i, "value")} className="font-heading text-5xl font-bold text-primary">
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

// ────────────────────────────────────────────────────────────── ctaBanner ──
function CtaBanner({ section, base }: { section: S<"ctaBanner">; base: string }) {
  const ctaMedia = section.background?.media?.src ? section.background.media : section.media;
  const hasMedia = Boolean(ctaMedia?.src);
  const inner = (
    <Container>
      <div className="flex flex-col items-center gap-6 text-center">
        <Editable as="h2" path={editPath(base, "heading")} className={`font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-6xl ${hasMedia ? "text-white" : "text-ink"}`}>
          {section.heading}
        </Editable>
        <AccentBar />
        {section.body ? (
          <Editable as="p" path={editPath(base, "body")} className={`max-w-xl text-lg ${hasMedia ? "text-white/90" : "text-muted"}`}>
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
    const ctaMediaPath = section.background?.media?.src
      ? editPath(base, "background", "media")
      : editPath(base, "media");
    const overlay = section.background?.overlay ?? { tone: "dark" as const, opacity: 55 };
    return (
      <section data-section={base} className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-[100px]">
        <SectionBackdrop media={ctaMedia} overlay={overlay} dataEdit={ctaMediaPath} />
        {inner}
      </section>
    );
  }

  return <Band tone="surface" bg={section.background} anchor={base}>{inner}</Band>;
}

// ──────────────────────────────────────────────────────────────── contact ──
function Contact({ section, base, site }: { section: S<"contact">; base: string; site: Site }) {
  const { contact } = site.profile;
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading text={section.heading} path={editPath(base, "heading")} />
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
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full rounded-theme border border-line bg-bg px-3 py-2 text-ink" />
                </div>
                <button type="submit" disabled className="rounded-theme bg-primary px-5 py-3 font-heading font-bold uppercase tracking-wide text-on-primary opacity-70">
                  Send inquiry
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
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input id={name} name={name} type={type} className="w-full rounded-theme border border-line bg-bg px-3 py-2 text-ink" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────── articleBody ──
function ArticleBody({ section, base }: { section: S<"articleBody">; base: string }) {
  return (
    <Band bg={section.background} anchor={base}>
      <Container>
        <article className="mx-auto flex max-w-3xl flex-col gap-5">
          {section.pullQuote ? (
            <Editable as="blockquote" path={editPath(base, "pullQuote")} className="border-l-4 border-primary pl-5 font-heading text-2xl font-bold uppercase leading-tight text-ink">
              {section.pullQuote}
            </Editable>
          ) : null}
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="text-lg leading-relaxed text-ink">
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

function Intro({ heading, intro, base, align = "center" }: { heading?: string; intro?: string; base: string; align?: "left" | "center" }) {
  if (!heading && !intro) return null;
  return (
    <div className={["mb-12 flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start"].join(" ")}>
      <SectionHeading text={heading} path={editPath(base, "heading")} align={align} className={align === "center" ? "items-center" : ""} />
      {intro ? (
        <Editable as="p" path={editPath(base, "intro")} className="max-w-2xl text-lg leading-relaxed text-muted">
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

function RateMatrixTable({ table, path }: { table: import("@/lib/schema").RateMatrix; path: string }) {
  return (
    <div>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-heading text-base font-bold uppercase tracking-wide text-ink">&nbsp;</th>
            {table.columns.map((c, i) => (
              <th key={i} className="py-2 pl-4 text-right font-heading text-base font-bold uppercase tracking-wide text-primary">
                <Editable as="span" path={editPath(path, "columns", i)}>{c}</Editable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-line last:border-0">
              <td className="py-2.5 pr-4 font-medium text-ink">
                <Editable as="span" path={editPath(path, "rows", ri, "label")}>{row.label}</Editable>
              </td>
              {row.values.map((v, vi) => (
                <td key={vi} className="py-2.5 pl-4 text-right tabular-nums text-ink">
                  <Editable as="span" path={editPath(path, "rows", ri, "values", vi)}>{v}</Editable>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note ? (
        <Editable as="p" path={editPath(path, "note")} className="mt-3 text-xs text-muted">{table.note}</Editable>
      ) : null}
    </div>
  );
}

// ────────────────────────────────────────────────────────────── mediaCards ──
function MediaCards({ section, base }: { section: S<"mediaCards">; base: string }) {
  const cards = section.cards.map((card, i) => {
    const cBase = editPath(base, "cards", i);
    return (
      <article
        key={i}
        className={[
          "flex flex-col overflow-hidden rounded-theme bg-surface",
          section.layout === "carousel" ? "w-[300px] shrink-0 snap-start sm:w-[340px]" : "",
        ].join(" ")}
      >
        {card.media ? (
          <MediaPlaceholder media={card.media} path={editPath(cBase, "media")} ratio="3 / 2" rounded={false} />
        ) : null}
        <div className="flex flex-1 flex-col gap-3 p-6">
          {card.eyebrow ? (
            <Editable as="p" path={editPath(cBase, "eyebrow")} className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {card.eyebrow}
            </Editable>
          ) : null}
          <Editable as="h3" path={editPath(cBase, "title")} className="font-heading text-xl font-bold uppercase text-ink">
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
                  <Editable as="dd" path={editPath(cBase, "details", di, "value")} className="text-right font-medium text-ink">{d.value}</Editable>
                </div>
              ))}
            </dl>
          ) : null}
          {card.cta ? (
            <div className="mt-auto pt-3">
              <CtaLink cta={card.cta} path={editPath(cBase, "cta")} />
            </div>
          ) : null}
        </div>
      </article>
    );
  });
  return (
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} align="left" />
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
        <Intro heading={section.heading} intro={section.intro} base={base} align="left" />
        <ul className={["grid gap-x-10 gap-y-3", GRID_COLS[section.columns] ?? ""].join(" ")}>
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-ink">
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
    <Band tone="surface" bg={section.background} anchor={base}>
      <Container>
        <Intro heading={section.heading} intro={section.intro} base={base} />
        <div data-block={editPath(base, "table")} className="mx-auto max-w-2xl rounded-theme border border-line bg-bg p-7">
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
      <div className="flex flex-col gap-5">
        <Editable as="h2" path={editPath(base, "heading")} className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl text-ink">
          {section.heading}
        </Editable>
        <AccentBar />
      </div>
      {section.media ? (
        <MediaPlaceholder media={section.media} path={editPath(base, "media")} ratio="3 / 2" />
      ) : null}
      {section.body.length ? (
        <div className="flex flex-col gap-4">
          {section.body.map((para, i) => (
            <Editable key={i} as="p" path={editPath(base, "body", i)} className="leading-relaxed text-muted">
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
        <div data-block={editPath(base, "rate")} className="rounded-theme border border-line bg-bg p-7">
          <RateMatrixTable table={section.rate} path={editPath(base, "rate")} />
        </div>
      ) : null}
      {section.included.length ? (
        <div data-block={editPath(base, "included")} className="rounded-theme border border-line bg-bg p-7">
          <Editable as="h3" path={editPath(base, "includedTitle")} className="mb-4 font-heading text-lg font-bold uppercase text-ink">
            {section.includedTitle ?? "What's Included"}
          </Editable>
          <ul className="flex flex-col gap-2.5 text-sm text-ink">
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
        <Intro heading={section.heading} intro={section.intro} base={base} />
        <div className={["grid gap-8", cols].join(" ")}>
          {section.items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 border-t-2 border-primary pt-5">
              {item.kicker ? (
                <Editable as="p" path={editPath(base, "items", i, "kicker")} className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {item.kicker}
                </Editable>
              ) : null}
              <Editable as="h3" path={editPath(base, "items", i, "title")} className="font-heading text-xl font-bold uppercase text-ink">
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
  const query = [address.street, address.city, address.region, address.postalCode].filter(Boolean).join(", ");
  const src = section.embedUrl ?? `https://www.google.com/maps?q=${encodeURIComponent(query || "United States")}&output=embed`;
  return (
    <Band bg={section.background} anchor={base} className="!py-0">
      <div>
        {section.heading ? (
          <Container className="py-10">
            <Intro heading={section.heading} intro={section.intro} base={base} align="left" />
          </Container>
        ) : null}
        <iframe
          title={section.heading ?? "Map"}
          src={src}
          className="block h-[420px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Band>
  );
}
