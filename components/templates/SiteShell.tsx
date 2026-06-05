import Link from "next/link";
import type { ReactNode } from "react";
import type { Site, SocialLink } from "@/lib/schema";
import { getPagesOfType } from "@/lib/schema";
import { appearanceToCssVars } from "@/lib/theme";
import { Editable, editPath } from "@/components/primitives/Editable";
import { Container } from "@/components/primitives/ui";

/**
 * The site frame: applies the active theme's design tokens (`--t-*` variables)
 * and renders the locked header/nav and footer around the page content,
 * following the Crystal Coast design (dark utility strip over a light nav bar
 * with a blue call button; a dark multi-column footer). Everything visual here
 * is template-owned (`data-locked`); captains edit only content values.
 */
export function SiteShell({
  site,
  children,
}: {
  site: Site;
  children: ReactNode;
}) {
  const vars = appearanceToCssVars({
    paletteId: site.paletteId,
    fontId: site.fontId,
    templateId: site.templateId,
  });

  return (
    <div style={vars} className="flex min-h-screen flex-col bg-bg font-body text-ink">
      <SiteHeader site={site} />
      <main className="flex-1">{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}

function availabilityText(site: Site): string {
  const openDays = site.profile.hours.filter((h) => !h.closed).length;
  if (openDays >= 7) return "Open 7 Days a Week — Contact for Availability";
  if (openDays > 0) return `Open ${openDays} Days a Week — Contact for Availability`;
  return "Contact for Availability";
}

function SiteHeader({ site }: { site: Site }) {
  const { profile } = site;
  return (
    <header data-locked="true" className="relative z-20">
      {/* Dark utility strip */}
      <div className="bg-bg text-ink">
        <Container className="flex h-11 items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="flex items-center gap-2 font-heading font-bold uppercase tracking-wide">
            <CheckIcon className="size-4 text-primary" />
            <span className="truncate">{availabilityText(site)}</span>
          </p>
          <SocialIcons social={profile.social} className="shrink-0" iconClassName="size-[18px]" />
        </Container>
      </div>

      {/* Light main nav bar with blue call button */}
      <div className="bg-band text-on-band">
        <Container className="flex h-[88px] items-center justify-between gap-6 !pr-0">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">
              🐟
            </span>
            <Editable
              as="span"
              path="profile.name"
              className="font-heading text-xl font-bold uppercase leading-none tracking-tight"
            >
              {profile.name}
            </Editable>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9 font-heading text-[19px] font-bold uppercase">
              {site.nav.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="transition hover:text-primary">
                    <Editable as="span" path={editPath("nav", i, "label")}>
                      {link.label}
                    </Editable>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={`tel:${profile.contact.phone}`}
            className="flex h-[88px] items-center bg-primary px-6 text-on-primary sm:px-9"
          >
            <span className="font-heading font-bold uppercase leading-tight tracking-wide">
              <span className="block text-[15px]">Call Us Now</span>
              <span className="block text-[18px]">{profile.contact.phone}</span>
            </span>
          </a>
        </Container>
      </div>
    </header>
  );
}

function SiteFooter({ site }: { site: Site }) {
  const { profile } = site;
  const { contact } = profile;
  const trips = getPagesOfType(site, "trip");

  return (
    <footer data-locked="true" className="mt-auto bg-bg text-ink">
      <Container className="flex flex-col gap-14 pb-10 pt-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="grid flex-1 gap-10 sm:grid-cols-3">
            {/* Explore */}
            <FooterCol title="Explore">
              {site.nav.map((link, i) => (
                <FooterLink key={i} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterCol>

            {/* Fishing trips */}
            {trips.length ? (
              <FooterCol title="Fishing Trips">
                {trips.map((t) => (
                  <FooterLink key={t.slug} href={`/trips/${t.slug}`}>
                    {t.seo.h1}
                  </FooterLink>
                ))}
              </FooterCol>
            ) : null}

            {/* Contact */}
            <FooterCol title="Book Your Trip">
              <a className="flex items-center gap-3 hover:text-primary" href={`tel:${contact.phone}`}>
                <PhoneIcon className="size-4 shrink-0 text-primary" />
                {contact.phone}
              </a>
              <a className="flex items-center gap-3 hover:text-primary" href={`mailto:${contact.email}`}>
                <MailIcon className="size-4 shrink-0 text-primary" />
                {contact.email}
              </a>
              <span className="flex items-start gap-3">
                <PinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {[
                    contact.address.street,
                    `${contact.address.city}, ${contact.address.region} ${contact.address.postalCode ?? ""}`.trim(),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
            </FooterCol>
          </div>

          {/* Brand mark */}
          <div className="flex items-start lg:justify-end">
            <div className="flex flex-col items-center gap-2 text-center">
              <span aria-hidden className="text-5xl">
                🐟
              </span>
              <span className="font-heading text-2xl font-bold uppercase leading-none">
                {profile.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          {site.footerNote ? (
            <Editable as="p" path="footerNote" className="text-sm text-muted">
              {site.footerNote}
            </Editable>
          ) : (
            <span />
          )}
          <SocialIcons social={profile.social} iconClassName="size-6" />
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading text-2xl font-bold uppercase">{title}</h2>
      <div className="flex flex-col gap-4 text-sm text-muted">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="transition hover:text-primary">
      {children}
    </Link>
  );
}

// ── Icons (inline, currentColor) ──────────────────────────────────────────
function SocialIcons({
  social,
  className,
  iconClassName,
}: {
  social: SocialLink[];
  className?: string;
  iconClassName?: string;
}) {
  if (!social.length) return null;
  return (
    <div className={["flex items-center gap-4", className ?? ""].join(" ")}>
      {social.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.platform}
          className="transition hover:text-primary"
        >
          <SocialGlyph platform={s.platform} className={iconClassName} />
        </a>
      ))}
    </div>
  );
}

function SocialGlyph({ platform, className }: { platform: SocialLink["platform"]; className?: string }) {
  const cls = ["inline-block", className ?? "size-5"].join(" ");
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
        </svg>
      );
    default:
      return (
        <span className={["grid place-items-center rounded-full border border-current text-[10px] font-bold uppercase", className ?? "size-5"].join(" ")}>
          {platform.charAt(0)}
        </span>
      );
  }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2Z" />
    </svg>
  );
}
function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7L4 6.2V6l8 5 8-5v.2L12 11Z" />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
