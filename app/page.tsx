import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { auth } from "@/auth";

/**
 * Public FishySites marketing landing page (the front door of the journey:
 * visit → create account → onboarding). Matches the fishysites.com look —
 * clean, white, ocean-blue, modern sans — and pitches the self-serve AI builder.
 * This is the platform's own page, not a customer Site-JSON template, so it
 * carries its own styling rather than the --t-* token system.
 */
export const metadata: Metadata = {
  title: "FishySites — Websites for fishing guides, charters & lodges",
  description:
    "Built to rank on Google and book more trips. Answer a few questions and get a complete, SEO-researched website for your charter — generated in minutes, then yours to edit and own.",
};

const BRAND = "#0b6fa4";

export default async function LandingPage() {
  const session = await auth();
  const loggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}>
      <Nav loggedIn={loggedIn} />
      <Hero loggedIn={loggedIn} />
      <TrustStrip />
      <Pillars />
      <HowItWorks />
      <SeoSection />
      <Templates />
      <Ownership />
      <FinalCta loggedIn={loggedIn} />
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────── nav ──
function Nav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span aria-hidden className="text-2xl">🐟</span> FishySites
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#seo" className="hover:text-slate-900">SEO</a>
          <a href="#templates" className="hover:text-slate-900">Templates</a>
        </nav>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BRAND }}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              <Link href="/signup" className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90" style={{ backgroundColor: BRAND }}>
                Get started
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────── hero ──
function Hero({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg,#f3f9fc 0%,#ffffff 60%)" }}
      />
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
            For fishing guides, charters & lodges
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Websites that rank on Google and book more trips.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            Answer a few questions about your charter and get a complete website —
            pages, copy, and real SEO — generated in minutes. Then it&apos;s yours to
            edit and own. No retainers, no upsells.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={loggedIn ? "/dashboard" : "/signup"}
              className="rounded-lg px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              {loggedIn ? "Go to dashboard" : "Start building your site"}
            </Link>
            <a href="#how" className="rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
              See how it works
            </a>
          </div>
          <p className="text-sm text-slate-500">Built on real keyword research — never guesses.</p>
        </div>

        <SitePreview />
      </Container>
    </section>
  );
}

/** A stylized browser mockup of a generated charter site (no real screenshot needed). */
function SitePreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 truncate rounded bg-white px-2 py-0.5 text-[10px] text-slate-400">yourcharter.com</span>
        </div>
        {/* mini dark hero, echoing the Holston template */}
        <div className="relative p-6 text-white" style={{ background: "linear-gradient(135deg,#202514,#2a311b)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#f1c045" }}>
            Guided fly fishing trips
          </p>
          <p className="mt-2 text-2xl font-bold uppercase leading-none" style={{ fontFamily: "var(--font-saira), 'Arial Narrow', sans-serif" }}>
            South Holston<br />River Guides
          </p>
          <span className="mt-4 inline-block rounded px-3 py-1.5 text-xs font-bold uppercase" style={{ backgroundColor: "#f1c045", color: "#202514" }}>
            Book a trip
          </span>
        </div>
        <div className="space-y-3 p-6">
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-2.5 w-full rounded bg-slate-100" />
          <div className="h-2.5 w-5/6 rounded bg-slate-100" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-lg bg-slate-100" />
            <div className="aspect-square rounded-lg bg-slate-100" />
            <div className="aspect-square rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
        <span className="font-semibold" style={{ color: BRAND }}>Ranked #1</span>{" "}
        <span className="text-slate-500">“fly fishing guide”</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────── trust strip ──
function TrustStrip() {
  return (
    <div className="border-y border-slate-100 bg-slate-50">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-center text-sm font-medium text-slate-500">
        <span>No retainers</span>
        <Dot /> <span>No upsells</span>
        <Dot /> <span>You own your site</span>
        <Dot /> <span>SEO researched, not guessed</span>
      </Container>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── pillars ──
function Pillars() {
  const items = [
    { icon: <SearchIcon />, title: "Designed to rank", body: "Real keyword research, schema markup, and dedicated species & location pages — the queries anglers actually search." },
    { icon: <BoltIcon />, title: "Built to convert", body: "Fast, mobile-first layouts with your phone number, booking links, recent catches, and reviews where they count." },
    { icon: <KeyIcon />, title: "Done for you, owned by you", body: "We write the content and the SEO; you edit anything in a click. The site is yours — no contracts, no lock-in." },
  ];
  return (
    <Section>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-slate-200 bg-white p-7">
            <div className="grid size-11 place-items-center rounded-xl text-white" style={{ backgroundColor: BRAND }}>
              {it.icon}
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">{it.title}</h3>
            <p className="mt-2 leading-relaxed text-slate-600">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────── how it works ──
function HowItWorks() {
  const steps = [
    { n: "1", title: "Tell us about your charter", body: "A few quick questions — where you fish, your trips, target species, what makes you different." },
    { n: "2", title: "We research your keywords", body: "Real search data — volume and difficulty — for your water and species. Never guesses." },
    { n: "3", title: "We generate your site", body: "Every page written for your business: home, trips, species, location, about, FAQ — with the SEO built in." },
    { n: "4", title: "Pick a design & publish", body: "Compare your site across professional templates, tweak anything, and go live. You own it." },
  ];
  return (
    <Section id="how" tint>
      <Heading kicker="How it works" title="From zero to a site that ranks — in minutes" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-slate-200 bg-white p-6">
            <span className="grid size-9 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: BRAND }}>
              {s.n}
            </span>
            <h3 className="mt-4 font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────── seo ──
function SeoSection() {
  const points = [
    "Real keyword research behind every page — search volume and difficulty, not assumptions",
    "Dedicated species and location pages that capture how anglers actually search",
    "Schema markup, clean metadata, and a sitemap generated automatically",
    "Fast, mobile-first builds that load quickly on the dock",
  ];
  return (
    <Section id="seo">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Heading kicker="Designed to rank" title="SEO that's researched, not guessed" align="left" />
          <ul className="mt-8 flex flex-col gap-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-white">
                  <span className="grid size-6 place-items-center rounded-full" style={{ backgroundColor: BRAND }}><CheckIcon /></span>
                </span>
                <span className="leading-relaxed text-slate-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <blockquote className="text-2xl font-bold leading-snug text-slate-900">
            “The goal is a site that ranks on its own — because it&apos;s built right.”
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-slate-500">
            Every keyword decision rests on real Ahrefs data. If we can&apos;t research it, we don&apos;t guess it.
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

// ───────────────────────────────────────────────────────────── templates ──
function Templates() {
  return (
    <Section id="templates" tint>
      <Heading kicker="Templates" title="Professional designs, ready for your photos" />
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        Pick a look and see your content in it instantly. Switch anytime — your words stay put.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {/* Coastal */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="p-8 text-white" style={{ background: "linear-gradient(135deg,#0e7c6b,#0b2540)" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Bright & coastal</p>
            <p className="mt-2 text-3xl font-extrabold uppercase tracking-tight">Coastal</p>
            <span className="mt-5 inline-block rounded bg-white/90 px-3 py-1.5 text-xs font-bold uppercase text-slate-900">Book now</span>
          </div>
          <div className="p-5 text-sm text-slate-600">Photo-forward and friendly — great for inshore & nearshore charters.</div>
        </div>
        {/* Holston */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="p-8 text-white" style={{ background: "linear-gradient(135deg,#202514,#2a311b)" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#f1c045" }}>Dark & rugged</p>
            <p className="mt-2 text-3xl font-extrabold uppercase tracking-tight" style={{ fontFamily: "var(--font-saira), 'Arial Narrow', sans-serif" }}>Holston River</p>
            <span className="mt-5 inline-block rounded px-3 py-1.5 text-xs font-bold uppercase" style={{ backgroundColor: "#f1c045", color: "#202514" }}>Book a trip</span>
          </div>
          <div className="p-5 text-sm text-slate-600">Earthy and bold — built for fly fishing guides and lodges.</div>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">More designs on the way.</p>
    </Section>
  );
}

// ───────────────────────────────────────────────────────────── ownership ──
function Ownership() {
  return (
    <Section>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-12 text-center sm:px-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">You own it. Completely.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
          No contracts, no restrictions, no marketing agency chasing retainers. Flat
          pricing for guides and charters; custom quotes for lodges and marinas.
        </p>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────────────────── final cta ──
function FinalCta({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section style={{ backgroundColor: BRAND }}>
      <Container className="flex flex-col items-center gap-6 py-16 text-center text-white">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to grow your guide or charter business?
        </h2>
        <p className="max-w-xl text-white/85">
          Build your site in minutes. Edit it whenever you want. Keep it forever.
        </p>
        <Link
          href={loggedIn ? "/dashboard" : "/signup"}
          className="rounded-lg bg-white px-7 py-3 text-base font-semibold shadow-sm transition hover:bg-slate-100"
          style={{ color: BRAND }}
        >
          {loggedIn ? "Go to dashboard" : "Start building your site"}
        </Link>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────── footer ──
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span aria-hidden className="text-xl">🐟</span> FishySites
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#seo" className="hover:text-slate-900">SEO</a>
          <a href="#templates" className="hover:text-slate-900">Templates</a>
          <Link href="/login" className="hover:text-slate-900">Log in</Link>
          <a href="mailto:info@fishysites.com" className="hover:text-slate-900">info@fishysites.com</a>
        </nav>
      </Container>
      <Container className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © FishySites. Websites for fishing guides, charters &amp; lodges.
      </Container>
    </footer>
  );
}

// ── primitives ─────────────────────────────────────────────────────────────
function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["mx-auto w-full max-w-6xl px-6", className ?? ""].join(" ")}>{children}</div>;
}

function Section({ children, id, tint }: { children: ReactNode; id?: string; tint?: boolean }) {
  return (
    <section id={id} className={tint ? "bg-slate-50" : "bg-white"}>
      <Container className="py-20">{children}</Container>
    </section>
  );
}

function Heading({ kicker, title, align = "center" }: { kicker: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: BRAND }}>{kicker}</p>
      <h2 className={["mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl", align === "center" ? "mx-auto max-w-2xl" : ""].join(" ")}>
        {title}
      </h2>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="hidden size-1 rounded-full bg-slate-300 sm:inline-block" />;
}

// ── icons ────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
      <circle cx="7.5" cy="15.5" r="3.5" /><path d="m10 13 8-8 3 3M16 7l2 2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
