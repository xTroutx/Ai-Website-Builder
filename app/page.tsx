import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { auth } from "@/auth";

/**
 * Public FishySites marketing landing page — the front door of the journey
 * (visit → create account → onboarding). Recreated to match fishysites.com:
 * orange + dark charcoal + warm off-white, heavy condensed uppercase display
 * headings (Saira) over Inter body, orange marquee strips, photo-forward bands.
 * Keeps the real fishysites.com copy/taglines but pitches the self-serve builder
 * (CTAs → /signup). This is the platform's own page, not a Site-JSON template.
 *
 * Imagery: where the live site uses angler photography, this uses dark gradient
 * placeholders until real photos are supplied.
 */
export const metadata: Metadata = {
  title: "FishySites — Websites for fishing guides, charters & lodges",
  description:
    "Built to rank on Google and book more trips. Answer a few questions and get a complete, SEO-researched website for your charter — generated in minutes, then yours to edit and own.",
};

const ORANGE = "#f07f1c";
const DARK = "#20272b";
const WARM = "#eae7e1";
const SAIRA = "var(--font-saira), 'Oswald', 'Arial Narrow', sans-serif";

export default async function LandingPage() {
  const session = await auth();
  const loggedIn = Boolean(session?.user);

  return (
    <div className="bg-white text-[#20272b]" style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}>
      <Hero loggedIn={loggedIn} />
      <FishyDudes />
      <Marquee />
      <Cards />
      <SeoSection />
      <OrangeCallout />
      <Hosting />
      <OwnStrip />
      <Showcase />
      <NotAgency />
      <FinalCta loggedIn={loggedIn} />
      <Footer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────── hero + nav ──
function Hero({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="relative isolate overflow-hidden text-white" style={{ backgroundColor: DARK }}>
      {/* photographic backdrop placeholder (dark, warm) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(120% 100% at 80% 0%, #3a4651 0%, #20272b 55%, #171c20 100%)" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(90deg,#171c20 8%,transparent 70%)" }} />

      {/* nav */}
      <Container className="relative flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span aria-hidden className="text-2xl">🐟</span> FishySites
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] font-semibold uppercase tracking-wide text-white/85 lg:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#seo" className="hover:text-white">Web SEO</a>
          <a href="#templates" className="hover:text-white">Websites</a>
          <a href="#own" className="hover:text-white">Support</a>
        </nav>
        {loggedIn ? (
          <Link href="/dashboard" className="rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: ORANGE }}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className="rounded-sm border border-white/40 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10">
            Log in
          </Link>
        )}
      </Container>

      {/* hero content */}
      <Container className="relative grid items-end gap-10 pb-16 pt-24 lg:min-h-[460px] lg:grid-cols-2 lg:pt-32">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: SAIRA }}>
            Websites for{" "}
            <span style={{ color: ORANGE }}>fishing guides</span>
            <span className="block text-2xl font-bold text-white/70 sm:text-3xl">/ Charters &amp; Lodges</span>
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <HeroBullet>Websites built to rank on Google and help you book more trips.</HeroBullet>
            <HeroBullet>Flat pricing for guides and charters. Custom quotes for lodges and marinas.</HeroBullet>
          </div>
          <div>
            <Link
              href={loggedIn ? "/dashboard" : "/signup"}
              className="inline-block rounded-sm px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-95"
              style={{ backgroundColor: ORANGE }}
            >
              {loggedIn ? "Go to dashboard" : "Get started"}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroBullet({ children }: { children: ReactNode }) {
  return (
    <p className="flex max-w-xs items-start gap-2 text-sm leading-snug text-white/85">
      <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: ORANGE }}>✓</span>
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────── "we build fishy sites" ──
function FishyDudes() {
  return (
    <section style={{ backgroundColor: WARM }}>
      <Container className="grid items-center gap-8 py-16 lg:grid-cols-[1.6fr_1fr]">
        <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
          We build fishy sites<br />for fishy dudes
        </h2>
        <p className="text-sm italic leading-relaxed text-[#5b5f5a]">
          “Fishy anglers have an aura about them, some indescribable swagger, with an innate
          ability to catch fish.” — every guide, probably
        </p>
      </Container>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────── marquee ──
function Marquee() {
  const items = ["Mobile Performance", "SEO", "Conversions"];
  const row = Array.from({ length: 6 }).flatMap(() => items);
  return (
    <div className="overflow-hidden" style={{ backgroundColor: ORANGE }}>
      <div className="flex items-center gap-6 whitespace-nowrap py-3 text-base font-bold uppercase tracking-wide text-white" style={{ fontFamily: SAIRA }}>
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-6">
            {it}
            <span aria-hidden className="text-white/70">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────── cards ──
function Cards() {
  const cards = [
    { tag: "Flat rate $1,500", grad: "linear-gradient(135deg,#2c3a2a,#0f1a12)", title: "For Guides & Charters", points: ["SEO-optimized to help you rank on Google", "Booking integration included", "No ongoing monthly subscriptions"] },
    { tag: "Custom quote", grad: "linear-gradient(135deg,#26414b,#10222a)", title: "For Lodges & Marinas", points: ["Custom quotes based on size and scope", "Structure built for your program and activities", "Online booking and CRM integration"] },
    { tag: "$39.99 / month", grad: "linear-gradient(135deg,#3a3326,#1c160e)", title: "Optional Hosting", points: ["Easy-to-use support system", "Fast, secure, managed hosting", "Content updates handled for you"] },
  ];
  return (
    <section style={{ backgroundColor: WARM }}>
      <Container className="grid gap-6 py-16 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="overflow-hidden rounded-md bg-white shadow-sm">
            <div className="relative h-36" style={{ background: c.grad }}>
              <span className="absolute bottom-3 left-3 rounded-sm px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: ORANGE }}>
                {c.tag}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold uppercase tracking-tight" style={{ fontFamily: SAIRA }}>{c.title}</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-[#444]">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Bullet />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────── seo ──
function SeoSection() {
  const points = [
    "Keyword targeting for your local market",
    "Advanced schema markup",
    "Fast-loading pages and mobile-first design",
    "Optimized titles, descriptions, and alt tags",
    "Internal link structure for future service pages",
  ];
  return (
    <section id="seo" className="bg-white">
      <Container className="grid items-start gap-12 py-20 lg:grid-cols-2">
        <div>
          <h2 className="max-w-md text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
            SEO-optimized websites for fishing guides &amp; charters
          </h2>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide" style={{ color: ORANGE }}>Our SEO setup includes</p>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] text-[#444]">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5"><Bullet />{p}</li>
            ))}
          </ul>
          <a href="#templates" className="mt-7 inline-block rounded-sm px-6 py-3 text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DARK }}>
            Our websites
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-[15px] leading-relaxed text-[#555]">
            Every site we build is structured to perform on Google. We follow Google&apos;s
            best practices — proper heading hierarchy, optimized metadata, and keyword-rich
            copy that reads naturally. Every keyword decision rests on real research, not
            assumptions.
          </p>
          {/* stat mockup */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-400">
              <SearchIcon /> south holston fishing guide
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">People reached</p>
                <p className="text-3xl font-extrabold" style={{ fontFamily: SAIRA }}>12,239</p>
              </div>
              <svg viewBox="0 0 120 40" className="h-12 w-32" aria-hidden>
                <polyline points="0,34 20,28 40,30 60,18 80,20 100,8 120,4" fill="none" stroke={ORANGE} strokeWidth="3" />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ────────────────────────────────────────────────────────── orange callout ──
function OrangeCallout() {
  return (
    <section style={{ backgroundColor: ORANGE }}>
      <Container className="flex flex-col items-center gap-5 py-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">You don&apos;t need a monthly SEO plan</p>
        <h2 className="max-w-3xl text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl" style={{ fontFamily: SAIRA }}>
          Our goal is to build a site that ranks on its own because it&apos;s built right.
        </h2>
        <Link href="/signup" className="rounded-sm px-7 py-3 text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DARK }}>
          Get started
        </Link>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────── hosting ──
function Hosting() {
  const includes = [
    { icon: <BackupIcon />, label: "Daily automated backups" },
    { icon: <ShieldIcon />, label: "SSL certificate & security" },
    { icon: <PlugIcon />, label: "Maintenance & updates" },
    { icon: <SupportIcon />, label: "Priority support" },
  ];
  return (
    <section className="bg-white">
      <Container className="grid items-start gap-10 pt-20 lg:grid-cols-2">
        <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
          Hosting that keeps you online
        </h2>
        <p className="text-[15px] leading-relaxed text-[#555]">
          Fully managed hosting from $39.99/month — speed, security, and peace of mind.
          Backups, SSL, and updates handled, so you can focus on the water. You own the
          site completely.
        </p>
      </Container>
      <Container className="grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
        {includes.map((it) => (
          <div key={it.label} className="flex flex-col gap-3">
            <span className="grid size-11 place-items-center rounded-lg text-white" style={{ backgroundColor: ORANGE }}>{it.icon}</span>
            <span className="text-sm font-medium text-[#444]">{it.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}

// ────────────────────────────────────────────────────────────── own strip ──
function OwnStrip() {
  return (
    <div id="own" className="overflow-hidden" style={{ backgroundColor: ORANGE }}>
      <Container className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-4 text-center text-base font-bold uppercase tracking-wide text-white" style={{ fontFamily: SAIRA }}>
        <span>You own the site completely</span>
        <span aria-hidden className="text-white/70">◆</span>
        <span>No contracts, no restrictions</span>
      </Container>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── showcase ──
function Showcase() {
  return (
    <section id="templates" className="relative isolate overflow-hidden" style={{ backgroundColor: DARK }}>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(120% 120% at 10% 50%, #2f3a44 0%, #20272b 60%)" }} />
      <Container className="grid items-center gap-10 py-20 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid grid-cols-2 gap-4">
          <MiniSite grad="linear-gradient(135deg,#0e7c6b,#0b2540)" kicker="Coastal" />
          <MiniSite grad="linear-gradient(135deg,#202514,#2a311b)" kicker="Holston River" accent="#f1c045" />
          <MiniSite grad="linear-gradient(135deg,#123a5a,#0b1f30)" kicker="Harbor" />
          <MiniSite grad="linear-gradient(135deg,#2f5d34,#15240f)" kicker="Mangrove" />
        </div>
        <div className="text-white">
          <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
            Designed to rank.<br /><span style={{ color: ORANGE }}>Built to convert.</span>
          </h2>
          <p className="mt-5 max-w-sm text-white/75">
            Pick a professional design and see your content in it instantly. Switch
            anytime — your words stay put.
          </p>
        </div>
      </Container>
    </section>
  );
}

function MiniSite({ grad, kicker, accent = "#ffffff" }: { grad: string; kicker: string; accent?: string }) {
  return (
    <div className="overflow-hidden rounded-md bg-white/95 shadow-xl">
      <div className="p-4 text-white" style={{ background: grad }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{kicker}</p>
        <p className="mt-1 text-sm font-extrabold uppercase" style={{ fontFamily: SAIRA }}>Charter Co.</p>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="h-1.5 w-2/3 rounded bg-slate-200" />
        <div className="h-1.5 w-full rounded bg-slate-100" />
        <div className="h-1.5 w-5/6 rounded bg-slate-100" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── not an agency ──
function NotAgency() {
  return (
    <section id="how" className="bg-white">
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
            We&apos;re not a marketing agency chasing retainers
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-[#555]">
            FishySites builds fast, SEO-optimized fishing websites that rank and help fill
            your calendar. Answer a few questions, we research your keywords and generate
            your site, you pick a design and publish.
          </p>
          <p className="mt-4 font-bold text-[#20272b]">No retainers. No upsells. Just clean, effective sites that work.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Bookings</p>
              <p className="text-4xl font-extrabold" style={{ fontFamily: SAIRA }}>+38%</p>
            </div>
            <svg viewBox="0 0 120 50" className="h-16 w-40" aria-hidden>
              <polyline points="0,44 24,40 48,30 72,32 96,16 120,6" fill="none" stroke={ORANGE} strokeWidth="3" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-slate-500">Built right, your site keeps working after launch — no monthly plan required.</p>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────── final cta ──
function FinalCta({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section style={{ backgroundColor: ORANGE }}>
      <Container className="flex flex-col items-start gap-5 py-16 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">Work with us</p>
        <h2 className="max-w-2xl text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl" style={{ fontFamily: SAIRA }}>
          Ready to grow your guide or charter business?
        </h2>
        <p className="max-w-xl text-white/85">
          Tell us a little about your charter, and we&apos;ll generate a site built to rank —
          pages, copy, and SEO. No retainers, just clean sites that perform.
        </p>
        <Link href={loggedIn ? "/dashboard" : "/signup"} className="rounded-sm px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white" style={{ backgroundColor: DARK }}>
          {loggedIn ? "Go to dashboard" : "Get started"}
        </Link>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────── footer ──
function Footer() {
  return (
    <footer className="bg-white">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span aria-hidden className="text-xl">🐟</span> FishySites
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Fast, SEO-optimized websites for fishing guides, charters, and lodges — designed
            to rank on Google and book more trips.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: ORANGE }}>Contact</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <li><a href="mailto:info@fishysites.com" className="hover:text-slate-900">info@fishysites.com</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: ORANGE }}>Quick links</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
            <li><a href="#seo" className="hover:text-slate-900">Web SEO</a></li>
            <li><a href="#templates" className="hover:text-slate-900">Websites</a></li>
            <li><Link href="/login" className="hover:text-slate-900">Log in</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-100">
        <Container className="py-5 text-center text-xs text-slate-400">© FishySites. Websites for fishing guides, charters &amp; lodges.</Container>
      </div>
    </footer>
  );
}

// ── primitives + icons ───────────────────────────────────────────────────
function Container({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={["mx-auto w-full max-w-6xl px-6", className ?? ""].join(" ")} style={style}>{children}</div>;
}

function Bullet() {
  return <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full" style={{ backgroundColor: ORANGE }} />;
}

function SearchIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4 text-slate-400" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
}
function BackupIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden><path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4" /></svg>);
}
function ShieldIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden><path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
}
function PlugIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden><path d="M12 22v-5M9 7V2M15 7V2M7 7h10v4a5 5 0 0 1-10 0V7Z" /></svg>);
}
function SupportIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17h.01" /></svg>);
}
