import type { Page, Section, Site } from "../schema";
import { pagePath } from "../schema";
import { absoluteUrl } from "./metadata";

/**
 * Build the JSON-LD structured-data object for a page, chosen by its
 * `seo.jsonLdType`. Output is a plain object serialized into a
 * <script type="application/ld+json"> by the JsonLd component. Search engines
 * read this; it's generated entirely from the schema.
 */

type Json = Record<string, unknown>;

/** The LocalBusiness node — the site's anchor entity, reused/referenced. */
function localBusinessNode(site: Site): Json {
  const { profile } = site;
  const { contact } = profile;
  const id = `${site.baseUrl}#business`;

  const node: Json = {
    "@type": "LocalBusiness",
    "@id": id,
    name: profile.name,
    url: site.baseUrl,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      ...(contact.address.street ? { streetAddress: contact.address.street } : {}),
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      ...(contact.address.postalCode
        ? { postalCode: contact.address.postalCode }
        : {}),
      addressCountry: contact.address.country,
    },
  };

  if (profile.tagline) node.description = profile.tagline;
  if (profile.priceRange) node.priceRange = profile.priceRange;
  if (profile.serviceAreas.length) node.areaServed = profile.serviceAreas;
  if (contact.geo) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    };
  }
  if (profile.social.length) {
    node.sameAs = profile.social.map((s) => s.url);
  }
  if (profile.logo && profile.logo.src) {
    node.logo = profile.logo.src;
  }
  return node;
}

/** Reference to the business node by @id. */
function businessRef(site: Site): Json {
  return { "@id": `${site.baseUrl}#business` };
}

function findSection<T extends Section["type"]>(
  page: Page,
  type: T,
): Extract<Section, { type: T }> | undefined {
  return page.sections.find((s) => s.type === type) as
    | Extract<Section, { type: T }>
    | undefined;
}

export function buildJsonLd(site: Site, page: Page): Json {
  const url = absoluteUrl(site, pagePath(page));
  const withContext = (node: Json): Json => ({
    "@context": "https://schema.org",
    ...node,
  });

  switch (page.seo.jsonLdType) {
    case "LocalBusiness":
      return withContext(localBusinessNode(site));

    case "Service": {
      const node: Json = {
        "@type": "Service",
        name: page.seo.h1,
        description: page.seo.metaDescription,
        serviceType: "Fishing charter",
        provider: businessRef(site),
        areaServed: site.profile.serviceAreas,
        url,
      };
      if (page.pageType === "trip" && typeof page.priceFrom === "number") {
        node.offers = {
          "@type": "Offer",
          priceCurrency: "USD",
          price: page.priceFrom,
          availability: "https://schema.org/InStock",
          url,
        };
      }
      return withContext(node);
    }

    case "FAQPage": {
      const faq = findSection(page, "faq");
      return withContext({
        "@type": "FAQPage",
        url,
        mainEntity: (faq?.items ?? []).map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });
    }

    case "Article": {
      const node: Json = {
        "@type": "Article",
        headline: page.seo.h1,
        description: page.seo.metaDescription,
        url,
        mainEntityOfPage: url,
        publisher: businessRef(site),
      };
      if (page.pageType === "report") {
        node.datePublished = page.publishedAt;
        node.dateModified = page.updatedAt ?? page.publishedAt;
        node.author = {
          "@type": "Person",
          name: page.author ?? site.profile.captainName,
        };
      }
      return withContext(node);
    }

    case "AboutPage":
    case "ContactPage":
    case "CollectionPage":
    case "WebPage":
    default:
      return withContext({
        "@type": page.seo.jsonLdType,
        name: page.seo.h1,
        description: page.seo.metaDescription,
        url,
        about: businessRef(site),
      });
  }
}

/**
 * For pages whose primary node references the business by @id (Service/Article/
 * etc.), also emit the business node so the reference resolves. Returns an array
 * of JSON-LD objects to render.
 */
export function buildJsonLdGraph(site: Site, page: Page): Json[] {
  const primary = buildJsonLd(site, page);
  // Home already IS the business; no extra node needed.
  if (page.seo.jsonLdType === "LocalBusiness") return [primary];
  return [
    primary,
    { "@context": "https://schema.org", ...localBusinessNode(site) },
  ];
}
