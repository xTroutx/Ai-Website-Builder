# FishySites

A chat-driven website builder for fishing guides and charter captains.

Captains answer a guided onboarding interview; the system fills a validated
**Site JSON** model, writes SEO copy, and renders a finished, bookable site from
**fixed templates**. Captains then edit content (not design) by clicking elements
on a live preview and telling a chat what to change.

## The one hard architectural rule

> The AI never generates raw HTML/CSS or invents layouts. It only writes copy and
> fills fields in the Zod-validated Site JSON. Fixed templates render that JSON.
> All design, layout, performance, accessibility, and SEO live in the templates
> and are controlled by us — not the AI.

```
onboarding answers / click-to-edit chat
  -> tool calls that mutate Site JSON (Zod-validated)
  -> fixed templates render the JSON
  -> published site
```

If a feature would require the AI to produce layout or arbitrary design, stop and
flag it instead of building it.

## What exists today (renderer foundation)

- **Site JSON schema** — the source of truth. `lib/schema/`
- **Theme registry** — ~10 curated palette + font combos → CSS-variable tokens.
  No raw color/font control. `lib/theme/`
- **Sample site** — "Lowcountry Redfish Charters" (Charleston SC), exercising all
  8 page types and all 14 section types, validated through Zod. `lib/sample/`
- **Templates** — pure functions of the JSON, with `data-edit` paths on every
  editable value and design tokens cleanly separated. `components/`
- **Automatic SEO** — per-page `<title>`/description/canonical/OG, JSON-LD per
  page type, `sitemap.xml`, `robots.txt`, all derived from the schema. `lib/seo/`
- **Thin DB schema** — `User`, `Site`, `Lead` (Prisma 7). `prisma/`

**Not built yet (by design):** the AI chat, the onboarding interview, auth,
billing, domains, and the real designs.

## Run it

```bash
npm run dev      # http://localhost:3000
npm run build    # static-renders every page
```

Routes: `/`, `/about`, `/faq`, `/contact`, `/trips/[slug]`, `/species/[slug]`,
`/locations/[slug]`, `/reports/[slug]`, plus `/sitemap.xml` and `/robots.txt`.

## Project map

```
lib/schema/        Zod Site JSON schema (source of truth) + helpers
  primitives.ts    media, links, contact, address, hours, social
  seo.ts           per-page SEO block + JSON-LD type
  sections.ts      14 section types (discriminated union on `type`)
  pages.ts         8 page types (discriminated union on `pageType`) + routing
  site.ts          BusinessProfile + Site (top level) + invariants
lib/theme/         curated themes -> design tokens (--t-* CSS variables)
lib/sample/        hardcoded, Zod-validated sample site
lib/seo/           metadata + JSON-LD builders, <JsonLd> component
lib/site.ts        getSite() — the single data seam (sample today, DB later)
components/
  primitives/      Editable (data-edit), MediaPlaceholder, ui helpers
  templates/       SectionRenderer, SiteShell, PageRenderer
app/               routes; sitemap.ts; robots.ts
prisma/            thin schema (User/Site/Lead)
```

## Design principles baked in

**Content vs. design separation.** Templates only use token-backed Tailwind
utilities (`bg-primary`, `text-ink`, `font-heading`, `rounded-theme`, …) that
resolve to the active theme's `--t-*` variables (set on `<SiteShell>`). They
never hardcode colors or fonts. Swapping in real designs changes token *values*
and markup — never schema or logic.

**Editing seam.** Every editable value is wrapped in `<Editable>` and carries a
`data-edit="<dot.path>"` attribute mapping it back to its Site JSON location
(e.g. `home.hero.headline`, `trips/...` use slug-rooted paths like
`inshore-redfish.specs.items.0.value`). Structural/locked chrome carries
`data-locked`. The future click-to-edit overlay reads these — no template change
needed.

**SEO is automatic.** Driven entirely by the schema; there is no hand-written
`<head>` anywhere.

## Extending

- **Add a theme:** append to `THEMES` in `lib/theme/registry.ts`. The schema's
  `themeId` validation picks it up automatically.
- **Add a section type:** add a member to the `SectionSchema` union
  (`lib/schema/sections.ts`) and a `case` in `SectionRenderer`. The exhaustive
  `never` check forces you to handle it.
- **Add a page type:** add to the `PageSchema` union + `pagePath()`
  (`lib/schema/pages.ts`) and create the route under `app/`.

## Wiring the real database (later)

No live DB is needed to run today. When ready:

1. Set `DATABASE_URL` in `.env` (Postgres).
2. `npx prisma migrate dev` to create tables.
3. Seed: store the validated Site JSON in `Site.data`.
4. Update `getSite()` in `lib/site.ts` to resolve the request subdomain to a
   `Site` row and `parseSite(row.data)`. Call sites in `app/` don't change.

Prisma 7 note: the connection URL lives in `prisma.config.ts` (not
`schema.prisma`), and the runtime client connects via a driver adapter
(e.g. `@prisma/adapter-pg`) passed to `new PrismaClient({ adapter })`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Zod 4 ·
Prisma 7 · Postgres (planned).
