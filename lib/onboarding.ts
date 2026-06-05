import { parseSite, type Site } from "./schema";

/**
 * The onboarding interview answers + appearance choices. Pure data — collected
 * by the wizard, validated in the server action, then applied here.
 */
export type OnboardingInput = {
  businessName: string;
  captainName: string;
  city: string;
  state: string;
  /** Public contact phone shown on the site. */
  phone: string;
  /** Public contact email shown on the site. */
  email: string;
  foundedYear?: number;
  fishingTypes: string[];
  species: string[];
  description: string;
  // Appearance
  templateId: string;
  paletteId: string;
  fontId: string;
};

const truncate = (s: string, n: number) =>
  s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";

const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

/**
 * Apply onboarding answers to a starter site: set appearance, fill the business
 * profile, and seed personalized copy into the home + about pages. Returns a
 * fully re-validated Site. (Deterministic for now; real Claude copy-generation
 * swaps in behind this same function later.)
 */
export function applyOnboarding(site: Site, input: OnboardingInput): Site {
  const draft = structuredClone(site);

  // Appearance
  draft.templateId = input.templateId;
  draft.paletteId = input.paletteId;
  draft.fontId = input.fontId;

  // Business profile
  const p = draft.profile;
  p.name = input.businessName;
  p.captainName = input.captainName;
  p.tagline = firstSentence(input.description) || `${input.city} fishing charters`;
  p.shortBio = input.description;
  if (typeof input.foundedYear === "number") p.foundedYear = input.foundedYear;
  p.contact.phone = input.phone;
  p.contact.email = input.email;
  p.contact.address.city = input.city;
  p.contact.address.region = input.state;
  p.serviceAreas = [input.city];
  if (input.fishingTypes.length) p.fishingTypes = input.fishingTypes;

  const headline = `${input.city} Fishing Charters`;

  // Home page copy
  const home = draft.pages.find((pg) => pg.pageType === "home");
  if (home) {
    home.seo.h1 = headline;
    home.seo.titleTag = truncate(`${input.city} Fishing Charters | ${input.businessName}`, 70);
    home.seo.metaDescription = truncate(input.description, 165);

    const hero = home.sections.find((s) => s.id === "hero");
    if (hero && hero.type === "hero") {
      hero.eyebrow = `${input.city}, ${input.state}`;
      hero.headline = headline;
      hero.subheadline = truncate(input.description, 200);
    }
    const intro = home.sections.find((s) => s.id === "intro");
    if (intro && intro.type === "mediaText") {
      intro.heading = `Guided Fishing Trips in ${input.city}`;
      intro.body = [input.description];
    }
  }

  // About page copy
  const about = draft.pages.find((pg) => pg.pageType === "about");
  if (about) {
    const aboutHero = about.sections.find((s) => s.id === "hero");
    if (aboutHero && aboutHero.type === "hero") {
      aboutHero.headline = `Meet ${input.captainName}`;
    }
    const story = about.sections.find((s) => s.id === "story");
    if (story && story.type === "richText") {
      story.body = [input.description, ...story.body.slice(1)];
    }
  }

  return parseSite(draft);
}
