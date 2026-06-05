import type { SiteInput } from "../schema";

/**
 * Hardcoded sample site for a fictional charter: Lowcountry Redfish Charters,
 * Charleston SC. This is realistic seed data that exercises every page type and
 * every section type, so the renderer can be exercised end-to-end before real
 * onboarding/AI/DB exist.
 *
 * Typed as `SiteInput` (pre-defaults) and validated through `parseSite()` in
 * lib/sample/index.ts — the same Zod boundary a future DB read will cross.
 *
 * Media uses empty `src` on purpose: templates render labelled solid-color
 * placeholders this session. The `alt` text is real content.
 */
export const lowcountryRedfish: SiteInput = {
  slug: "lowcountry-redfish",
  baseUrl: "https://lowcountry-redfish.fishysites.com",
  themeId: "crystal-coast",
  profile: {
    name: "Lowcountry Redfish Charters",
    tagline: "Sight-fishing the Charleston flats since 2009",
    captainName: "Captain Dale Boykin",
    foundedYear: 2009,
    shortBio:
      "Captain Dale Boykin has poled the Charleston flats for over 15 years, putting anglers of every skill level on tailing redfish, speckled trout, and more.",
    contact: {
      phone: "+1-843-555-0142",
      email: "dale@lowcountryredfish.com",
      address: {
        street: "17 Shem Creek Pier",
        city: "Mount Pleasant",
        region: "SC",
        postalCode: "29464",
        country: "US",
      },
      geo: { lat: 32.7941, lng: -79.8835 },
    },
    hours: [
      { day: "monday", open: "05:30", close: "19:00" },
      { day: "tuesday", open: "05:30", close: "19:00" },
      { day: "wednesday", open: "05:30", close: "19:00" },
      { day: "thursday", open: "05:30", close: "19:00" },
      { day: "friday", open: "05:30", close: "19:00" },
      { day: "saturday", open: "05:30", close: "19:00" },
      { day: "sunday", closed: true },
    ],
    social: [
      { platform: "instagram", url: "https://instagram.com/lowcountryredfish" },
      { platform: "facebook", url: "https://facebook.com/lowcountryredfish" },
      { platform: "youtube", url: "https://youtube.com/@lowcountryredfish" },
    ],
    serviceAreas: [
      "Charleston",
      "Mount Pleasant",
      "Isle of Palms",
      "Folly Beach",
      "Bulls Bay",
    ],
    certifications: [
      "USCG Licensed Captain",
      "CPR & First Aid Certified",
      "Fully Insured",
      "SC Saltwater Guide License",
    ],
    fishingTypes: ["Inshore", "Sight Fishing", "Fly Fishing", "Nearshore"],
    priceRange: "$$$",
    logo: {
      src: "",
      alt: "Lowcountry Redfish Charters logo",
      width: 240,
      height: 80,
    },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Trips", href: "/trips/inshore-redfish" },
    { label: "Species", href: "/species/redfish" },
    { label: "Charleston Harbor", href: "/locations/charleston-harbor" },
    { label: "Reports", href: "/reports/november-redfish-run" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  defaultOgImage: {
    src: "",
    alt: "A tailing redfish on the Charleston flats at sunrise",
    width: 1200,
    height: 630,
  },
  footerNote:
    "USCG Licensed & Insured · SC Guide License #SG-4471 · © Lowcountry Redfish Charters",
  pages: [
    // ─────────────────────────────────────────────────────────── HOME ──
    {
      pageType: "home",
      slug: "home",
      seo: {
        titleTag: "Charleston Redfish Charters | Lowcountry Redfish Charters",
        metaDescription:
          "Sight-fish tailing redfish on the Charleston, SC flats with Captain Dale Boykin. Inshore, fly, and nearshore charters for all skill levels.",
        h1: "Charleston Inshore Fishing Charters",
        jsonLdType: "LocalBusiness",
        keywords: [
          "charleston redfish charters",
          "charleston inshore fishing",
          "mount pleasant fishing guide",
          "sight fishing charleston",
        ],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Charleston, South Carolina",
          headline: "Chase Tailing Redfish on the Charleston Flats",
          subheadline:
            "Light-tackle and fly charters with a captain who's poled these creeks for 15+ years. Half-day and full-day trips for first-timers to seasoned anglers.",
          media: {
            src: "",
            alt: "Captain poling a skiff toward tailing redfish on a Charleston flat at sunrise",
            width: 1600,
            height: 900,
          },
          primaryCta: {
            label: "Book a Charter",
            href: "/contact",
            variant: "primary",
          },
          secondaryCta: {
            label: "See Our Trips",
            href: "/trips/inshore-redfish",
            variant: "secondary",
          },
        },
        {
          id: "intro",
          type: "mediaText",
          mediaSide: "left",
          tone: "light",
          heading: "Guided Fishing Trips on the Lowcountry Flats",
          body: [
            "Welcome to Lowcountry Redfish Charters, your fully licensed and insured fishing charter based out of Mount Pleasant, SC. Whether you are sight-casting tailing redfish on the flats, working creek mouths for trout, or chasing bull reds at the jetties, Captain Dale puts you on the fish.",
            "With year-round access to some of the most productive inshore water on the East Coast, there is always something biting on the Charleston coast. Beginners, families, and experienced anglers alike are welcome aboard.",
          ],
          media: {
            src: "",
            alt: "Captain Dale holding a healthy speckled trout beside the skiff",
            width: 610,
            height: 594,
          },
          cta: { label: "Book Your Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "trips",
          type: "tripCards",
          heading: "What We Offer",
          trips: [
            {
              title: "Inshore Fishing",
              summary:
                "Reds, trout, and more in the shallow flats and creeks around Charleston and Bulls Bay. Great for beginners, families, and consistent action.",
              slug: "inshore-redfish",
              priceFrom: 550,
              duration: "Half day (4 hrs)",
              media: {
                src: "",
                alt: "Angler holding a slot redfish beside the skiff",
                width: 800,
                height: 533,
              },
            },
            {
              title: "Nearshore Sharks & Jacks",
              summary:
                "Wrecks, reefs, and open water just off the beaches targeting bull sharks, jacks, and seasonal species.",
              slug: "nearshore-sharks",
              priceFrom: 750,
              duration: "Full day (8 hrs)",
              media: {
                src: "",
                alt: "Angler fighting a hard-running fish nearshore",
                width: 800,
                height: 533,
              },
            },
            {
              title: "Trophy Redfish",
              summary:
                "Chase giant bull redfish at the jetties and nearshore during the fall run. Big fish and unforgettable fights.",
              media: {
                src: "",
                alt: "Angler cradling an oversized bull redfish",
                width: 800,
                height: 533,
              },
            },
            {
              title: "Fall Trout Run",
              summary:
                "Fast-paced topwater action on schooled-up speckled trout as the water cools. One of the most fun bites of the year.",
              media: {
                src: "",
                alt: "Speckled trout fooled on a topwater plug",
                width: 800,
                height: 533,
              },
            },
          ],
        },
        {
          id: "reviews",
          type: "testimonials",
          heading: "What Anglers Say",
          items: [
            {
              quote:
                "Best day on the water I've ever had. Dale put my son on his first redfish on a fly — we'll be back every year.",
              author: "Mark T.",
              location: "Atlanta, GA",
              rating: 5,
            },
            {
              quote:
                "Patient, professional, and clearly knows every inch of these creeks. Boated a dozen reds on a tough, windy day.",
              author: "Priya S.",
              location: "Charlotte, NC",
              rating: 5,
            },
            {
              quote:
                "Top-notch gear and a beautiful skiff. Felt like fishing with an old friend who happens to be a pro.",
              author: "Greg L.",
              location: "Columbus, OH",
              rating: 5,
            },
          ],
        },
        {
          id: "captain",
          type: "mediaText",
          mediaSide: "right",
          tone: "dark",
          eyebrow: "Your Captain",
          heading: "Meet Captain Dale",
          body: [
            "Charleston born and flats obsessed, Captain Dale Boykin has poled the Lowcountry's creeks for over 15 years. He's happiest when a client lands their first redfish on a fly.",
            "He runs a clean, well-kept skiff, fishes quality gear, and treats the fishery like he wants his kids to fish it too — patient with newcomers, and ready to challenge seasoned anglers.",
          ],
          media: {
            src: "",
            alt: "Portrait of Captain Dale Boykin on his skiff",
            width: 640,
            height: 560,
          },
          cta: { label: "About the Captain", href: "/about", variant: "link" },
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "Proudly Serving the Charleston Coast",
          images: [
            { src: "", alt: "Spartina grass flat at golden hour" },
            { src: "", alt: "Angler with a tailing redfish caught on a fly" },
            { src: "", alt: "Shem Creek docks and shrimp boats at sunrise" },
            { src: "", alt: "A speckled trout released boatside" },
            { src: "", alt: "The skiff poled across skinny water" },
            { src: "", alt: "Sunrise over the Charleston marsh" },
            { src: "", alt: "Client fighting a bull red at the jetties" },
            { src: "", alt: "Fly box of crab and shrimp patterns" },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Get on the Water?",
          body: "Lock in your morning on the flats — most weekends book out weeks ahead.",
          cta: { label: "Book Your Trip", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────── TRIPS ──
    {
      pageType: "trip",
      slug: "inshore-redfish",
      priceFrom: 550,
      duration: "Half day (4 hrs) / Full day (8 hrs)",
      seo: {
        titleTag: "Inshore Redfish Charter — Charleston SC | Lowcountry Redfish",
        metaDescription:
          "Half- and full-day inshore charters sight-fishing redfish and speckled trout on the Charleston flats. Gear included, all skill levels welcome.",
        h1: "Inshore Redfish Charter",
        jsonLdType: "Service",
        keywords: [
          "charleston inshore charter",
          "redfish guide charleston",
          "flats fishing charleston sc",
        ],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Signature Trip",
          headline: "Inshore Redfish Charter",
          subheadline:
            "The trip we're known for. We pole the flats and tuck into creeks to sight-cast tailing redfish, with trout and flounder in the mix.",
          media: {
            src: "",
            alt: "Skiff poled across a glassy Charleston flat with a tailing redfish ahead",
            width: 1600,
            height: 900,
          },
          primaryCta: { label: "Book This Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "specs",
          type: "infoList",
          heading: "Trip Details",
          items: [
            { label: "Duration", value: "Half day (4 hrs) or full day (8 hrs)" },
            { label: "Anglers", value: "Up to 2 (3 by request)" },
            { label: "Departs", value: "Shem Creek, Mount Pleasant" },
            { label: "Best Season", value: "Year-round; peak Sep–Dec" },
            { label: "Targets", value: "Redfish, speckled trout, flounder" },
            { label: "Skill Level", value: "Beginner to advanced" },
          ],
        },
        {
          id: "about",
          type: "richText",
          heading: "What to Expect",
          body: [
            "We launch at first light from Shem Creek and run to whichever flats are fishing best that tide. On a falling tide we hunt tailing redfish in inches of water; on the push we work grass edges and oyster bars for trout and slot reds.",
            "Everything is provided: rods, reels, tackle, ice, water, and polarized sunglasses if you need a pair. You bring a hat, sunscreen, a snack, and a valid SC saltwater fishing license (we'll tell you exactly where to grab one online).",
            "New to fly or light tackle? Great — coaching is part of the trip. Experienced and want to be challenged? We'll put you in technical situations that'll test your cast.",
          ],
        },
        {
          id: "pricing",
          type: "pricingTable",
          heading: "Rates",
          tiers: [
            {
              name: "Half Day",
              price: 550,
              unit: "per trip (1–2 anglers)",
              description: "4 hours on the water — our most popular option.",
              features: ["All gear included", "Ice & water", "Licensing guidance"],
              featured: true,
              cta: { label: "Book Half Day", href: "/contact", variant: "primary" },
            },
            {
              name: "Full Day",
              price: 850,
              unit: "per trip (1–2 anglers)",
              description: "8 hours and more water covered — best for serious anglers.",
              features: [
                "All gear included",
                "Lunch & drinks",
                "Multiple flats & patterns",
              ],
              cta: { label: "Book Full Day", href: "/contact", variant: "secondary" },
            },
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "From Recent Trips",
          images: [
            { src: "", alt: "Angler releasing a copper-colored redfish boatside", caption: "A healthy slot red, released" },
            { src: "", alt: "Fly angler casting to a tailing fish on the flat" },
            { src: "", alt: "Speckled trout held just above the water" },
            { src: "", alt: "Sunrise over the Charleston marsh from the skiff" },
          ],
        },
        {
          id: "faq",
          type: "faq",
          heading: "Trip Questions",
          items: [
            {
              question: "Do I need a fishing license?",
              answer:
                "Yes — each angler needs a SC saltwater fishing license. They're inexpensive and take two minutes to buy online; we send a link when you book.",
            },
            {
              question: "What if the weather is bad?",
              answer:
                "Safety comes first. If conditions are unsafe we'll reschedule or fully refund your deposit — your call.",
            },
            {
              question: "Can you take kids?",
              answer:
                "Absolutely. Kids are welcome and we love introducing new anglers to the sport. Let us know ages so we can plan accordingly.",
            },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to chase tails?",
          body: "Tell us your dates and we'll find the best tide for your trip.",
          cta: { label: "Request a Date", href: "/contact", variant: "primary" },
        },
      ],
    },
    {
      pageType: "trip",
      slug: "nearshore-sharks",
      priceFrom: 750,
      duration: "Full day (8 hrs)",
      seo: {
        titleTag: "Nearshore Shark & Jack Charter — Charleston | Lowcountry Redfish",
        metaDescription:
          "Summer nearshore charters off Charleston for bull sharks, jack crevalle, and tarpon. Heavy tackle, big bites, full-day adventure.",
        h1: "Nearshore Sharks & Jacks",
        jsonLdType: "Service",
        keywords: ["charleston shark fishing", "nearshore charter charleston"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Summer Special",
          headline: "Nearshore Sharks & Jacks",
          subheadline:
            "When the water warms, we run just off the beaches for screaming drags — bull sharks, jacks, and the occasional tarpon.",
          media: {
            src: "",
            alt: "Angler leaning into a deeply bent rod nearshore off Charleston",
            width: 1600,
            height: 900,
          },
          primaryCta: { label: "Book This Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "specs",
          type: "infoList",
          heading: "Trip Details",
          items: [
            { label: "Duration", value: "Full day (8 hrs)" },
            { label: "Anglers", value: "Up to 4" },
            { label: "Season", value: "June–September" },
            { label: "Targets", value: "Bull sharks, jack crevalle, tarpon" },
            { label: "Tackle", value: "Heavy spinning, provided" },
          ],
        },
        {
          id: "about",
          type: "richText",
          heading: "Big Water, Big Bites",
          body: [
            "This is our adrenaline trip. We anchor up over nearshore structure and reefs, set a chum slick, and wait for the rods to fold over. Sharks to 6+ feet, hard-charging jacks, and — in the right week — rolling tarpon.",
            "It's a great trip for groups and anyone who wants to feel a serious pull. We handle every fish with care and release them strong.",
          ],
        },
        {
          id: "pricing",
          type: "pricingTable",
          heading: "Rate",
          tiers: [
            {
              name: "Full Day Nearshore",
              price: 750,
              unit: "per trip (up to 4 anglers)",
              description: "8 hours of heavy-tackle action off the beaches.",
              features: ["Heavy tackle provided", "Bait & chum", "Ice & water"],
              featured: true,
              cta: { label: "Book Nearshore", href: "/contact", variant: "primary" },
            },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Summer dates go quick",
          body: "The nearshore bite is a short, hot season — reserve early.",
          cta: { label: "Check Availability", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ───────────────────────────────────────────────────────── SPECIES ──
    {
      pageType: "species",
      slug: "redfish",
      scientificName: "Sciaenops ocellatus",
      seo: {
        titleTag: "Redfish (Red Drum) in Charleston | Lowcountry Redfish Charters",
        metaDescription:
          "Everything about chasing redfish in Charleston, SC — seasons, tactics, and the flats where they tail. Book a guided redfish charter.",
        h1: "Redfish (Red Drum)",
        jsonLdType: "CollectionPage",
        keywords: ["charleston redfish", "red drum fishing sc", "tailing redfish"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Sciaenops ocellatus",
          headline: "Redfish — The Lowcountry's Signature Gamefish",
          subheadline:
            "Copper-flanked, spot-tailed, and willing to eat a fly in skinny water. Here's how, when, and where we target them.",
          media: { src: "", alt: "Tailing redfish in shallow grass at low tide", width: 1600, height: 900 },
        },
        {
          id: "about",
          type: "richText",
          heading: "About Charleston Redfish",
          body: [
            "Redfish (red drum) are the backbone of Lowcountry inshore fishing. They root for crabs and shrimp on shallow flats, often 'tailing' with their tails breaking the surface — the sight-fishing moment every flats angler chases.",
            "Charleston holds redfish year-round, but fall is magic: big schools push onto the flats and tail aggressively on sunny, low-tide afternoons.",
          ],
        },
        {
          id: "facts",
          type: "infoList",
          heading: "Quick Facts",
          items: [
            { label: "Scientific name", value: "Sciaenops ocellatus" },
            { label: "SC slot limit", value: "15–23 inches (check current regs)" },
            { label: "Best season", value: "Year-round; peak September–December" },
            { label: "Best tide", value: "Low and falling for tailing fish" },
            { label: "Go-to flies", value: "Crab and shrimp patterns, #2–#1" },
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "Charleston Reds",
          images: [
            { src: "", alt: "Redfish tail breaking the surface over grass" },
            { src: "", alt: "Close-up of a redfish spot near the tail" },
            { src: "", alt: "Angler releasing a redfish in shallow water" },
          ],
        },
        {
          id: "trips",
          type: "tripCards",
          heading: "Charters That Target Redfish",
          trips: [
            {
              title: "Inshore Redfish Charter",
              summary: "Our signature flats trip built around tailing reds.",
              slug: "inshore-redfish",
              priceFrom: 550,
              duration: "Half / full day",
            },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Put it into practice",
          body: "Book a redfish charter and we'll get you tight to a tailing fish.",
          cta: { label: "Book a Redfish Trip", href: "/trips/inshore-redfish", variant: "primary" },
        },
      ],
    },
    {
      pageType: "species",
      slug: "speckled-trout",
      scientificName: "Cynoscion nebulosus",
      seo: {
        titleTag: "Speckled Trout Fishing in Charleston | Lowcountry Redfish",
        metaDescription:
          "Target speckled sea trout on the Charleston flats and creeks. Seasons, topwater tactics, and guided trips with Lowcountry Redfish Charters.",
        h1: "Speckled Trout",
        jsonLdType: "CollectionPage",
        keywords: ["speckled trout charleston", "sea trout fishing sc"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Cynoscion nebulosus",
          headline: "Speckled Trout on Light Tackle",
          subheadline:
            "Aggressive, abundant, and a blast at dawn on topwater. A perfect target for newer anglers and fly casters alike.",
          media: { src: "", alt: "A spotted speckled trout held just above the water", width: 1600, height: 900 },
        },
        {
          id: "about",
          type: "richText",
          heading: "About Speckled Trout",
          body: [
            "Speckled (spotted sea) trout school over grass and around creek mouths, ambushing shrimp and baitfish. They eat readily, fight well above their weight, and crush a topwater plug in low light.",
            "Spring and fall are prime, with comfortable mornings and willing fish — a great introduction to Lowcountry inshore fishing.",
          ],
        },
        {
          id: "facts",
          type: "infoList",
          heading: "Quick Facts",
          items: [
            { label: "Scientific name", value: "Cynoscion nebulosus" },
            { label: "Best season", value: "Spring and fall" },
            { label: "Best time", value: "First and last light" },
            { label: "Go-to lures", value: "Topwater plugs, soft plastics under a cork" },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Catch the morning bite",
          body: "Trout fish best at dawn — book an early trip and beat the heat.",
          cta: { label: "Book a Trip", href: "/trips/inshore-redfish", variant: "primary" },
        },
      ],
    },

    // ──────────────────────────────────────────────────────── LOCATION ──
    {
      pageType: "location",
      slug: "charleston-harbor",
      seo: {
        titleTag: "Fishing Charleston Harbor | Lowcountry Redfish Charters",
        metaDescription:
          "A guide to fishing Charleston Harbor and its creeks — what's biting, the best tides, and how to fish it with a local captain.",
        h1: "Fishing Charleston Harbor",
        jsonLdType: "CollectionPage",
        keywords: ["charleston harbor fishing", "shem creek fishing"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Our Home Water",
          headline: "Charleston Harbor & the Creeks",
          subheadline:
            "From Shem Creek to the jetties and the marsh behind Mount Pleasant — the water we fish day in and day out.",
          media: { src: "", alt: "Aerial view of Charleston Harbor marsh creeks at low tide", width: 1600, height: 900 },
        },
        {
          id: "about",
          type: "richText",
          heading: "Why It Fishes So Well",
          body: [
            "Charleston Harbor is a vast estuary — miles of spartina grass flats, oyster bars, and creek mouths flushed twice daily by big tides. That tidal range concentrates bait and gamefish in predictable places if you know how to read it.",
            "We base out of Shem Creek in Mount Pleasant, which puts redfish flats, trout creeks, and the nearshore beaches all within a short run.",
          ],
        },
        {
          id: "spots",
          type: "featureGrid",
          heading: "Where We Fish",
          items: [
            { title: "Shem Creek Flats", body: "Close-to-the-dock redfish and trout — perfect for shorter trips and learning the ropes." },
            { title: "The Marsh Behind IOP", body: "Skinny-water flats that come alive with tailing reds on fall low tides." },
            { title: "Harbor Jetties", body: "Structure that holds bigger trout, flounder, and bull reds in cooler months." },
            { title: "Bulls Bay", body: "A wild, remote run north for anglers who want untouched water." },
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "The Lowcountry",
          images: [
            { src: "", alt: "Spartina grass flat at golden hour" },
            { src: "", alt: "Shem Creek docks and shrimp boats" },
            { src: "", alt: "Oyster bar exposed at low tide" },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Fish it with a local",
          body: "We run these waters every day — let us short-cut your learning curve.",
          cta: { label: "Book a Charter", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────── ABOUT ──
    {
      pageType: "about",
      slug: "about",
      seo: {
        titleTag: "About Captain Dale Boykin | Lowcountry Redfish Charters",
        metaDescription:
          "Meet Captain Dale Boykin — 15+ years guiding anglers on the Charleston flats. USCG licensed, conservation-minded, and obsessed with redfish.",
        h1: "About Lowcountry Redfish Charters",
        jsonLdType: "AboutPage",
        keywords: ["charleston fishing guide", "captain dale boykin"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Your Captain",
          headline: "Meet Captain Dale Boykin",
          subheadline:
            "Charleston born, flats obsessed, and happiest when a client lands their first redfish on a fly.",
          media: { src: "", alt: "Portrait of Captain Dale Boykin on his skiff", width: 1600, height: 900 },
        },
        {
          id: "story",
          type: "richText",
          heading: "Our Story",
          body: [
            "I grew up fishing the creeks behind Mount Pleasant with my grandfather, and I've never wanted to do anything else. In 2009 I bought my first skiff, earned my captain's license, and started Lowcountry Redfish Charters.",
            "Fifteen years and a couple thousand charters later, the mission hasn't changed: put you on fish, teach you something, and send you home already planning the next trip. Whether it's a kid's first catch or an expert chasing a tough sight-fishing shot, that's the day I love.",
            "I run a clean, well-kept Hell's Bay skiff, fish quality gear, and treat the fishery like I want my kids to fish it too.",
          ],
        },
        {
          id: "stats",
          type: "stats",
          heading: "By the Numbers",
          items: [
            { value: "2009", label: "Year founded" },
            { value: "15+", label: "Years guiding" },
            { value: "2,000+", label: "Trips run" },
            { value: "4.9★", label: "Average rating" },
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "On the Water",
          images: [
            { src: "", alt: "Captain Dale poling the skiff across a flat" },
            { src: "", alt: "A happy client with their first redfish" },
            { src: "", alt: "The Hell's Bay skiff at the dock at sunrise" },
          ],
        },
        {
          id: "reviews",
          type: "testimonials",
          heading: "In Their Words",
          items: [
            {
              quote: "Dale is the real deal — humble, expert, and genuinely fun to fish with.",
              author: "Susan R.",
              location: "Greenville, SC",
              rating: 5,
            },
            {
              quote: "Booked three years running. Never a bad day, even when the weather doesn't cooperate.",
              author: "Tom & Will B.",
              location: "Richmond, VA",
              rating: 5,
            },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Come fish with us",
          body: "Let's get a day on the calendar.",
          cta: { label: "Get in Touch", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── FAQ ──
    {
      pageType: "faq",
      slug: "faq",
      seo: {
        titleTag: "Charter FAQ | Lowcountry Redfish Charters",
        metaDescription:
          "Answers to common questions about our Charleston fishing charters — licenses, what to bring, weather, payment, and more.",
        h1: "Frequently Asked Questions",
        jsonLdType: "FAQPage",
        keywords: ["fishing charter faq charleston"],
      },
      sections: [
        {
          id: "intro",
          type: "richText",
          body: [
            "Have a question that isn't covered here? Call or text us at (843) 555-0142 — we're happy to help you plan the perfect trip.",
          ],
        },
        {
          id: "faq",
          type: "faq",
          heading: "Before You Book",
          items: [
            {
              question: "What's included in a charter?",
              answer:
                "All rods, reels, tackle, bait, ice, bottled water, and the use of polarized sunglasses. You just bring sunscreen, a hat, a snack, and your fishing license.",
            },
            {
              question: "Do I need a fishing license?",
              answer:
                "Yes, each angler needs a South Carolina saltwater fishing license. They're cheap and quick to buy online — we send a direct link when you book.",
            },
            {
              question: "What should I wear and bring?",
              answer:
                "Sun protection is key: a hat, polarized sunglasses, sunscreen, and light long sleeves. Bring a soft-soled, non-marking shoe and any food or drinks beyond water.",
            },
            {
              question: "What's your weather and cancellation policy?",
              answer:
                "If conditions are unsafe, we'll reschedule or refund your deposit in full. Light rain is often great fishing, so we'll communicate the morning of if there's any doubt.",
            },
            {
              question: "How do deposits and payment work?",
              answer:
                "A deposit reserves your date; the balance is due the day of the trip. We accept cards, cash, and most mobile payments. Gratuity for the captain is customary and appreciated.",
            },
            {
              question: "Do you keep fish?",
              answer:
                "We're primarily catch-and-release, but you're welcome to keep a legal harvest for dinner within SC regulations. We'll handle and release everything else with care.",
            },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Still have questions?",
          body: "Reach out and we'll get you sorted before your trip.",
          cta: { label: "Contact Us", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ───────────────────────────────────────────────────────── REPORTS ──
    {
      pageType: "report",
      slug: "november-redfish-run",
      publishedAt: "2025-11-18",
      updatedAt: "2025-11-20",
      author: "Captain Dale Boykin",
      excerpt:
        "The fall redfish run is in full swing — big tailing schools on the afternoon low tides and some of the best sight-fishing of the year.",
      seo: {
        titleTag: "November Redfish Run Report — Charleston | Lowcountry Redfish",
        metaDescription:
          "Charleston fishing report: the November redfish run is on. Tailing schools on afternoon lows, plus trout on the warm-up. Tactics and what's next.",
        h1: "November Redfish Run Is On",
        jsonLdType: "Article",
        keywords: ["charleston fishing report", "november redfish charleston"],
      },
      sections: [
        {
          id: "body",
          type: "articleBody",
          pullQuote:
            "On the right afternoon low, we had fifty-plus fish tailing within a cast.",
          body: [
            "It's the report we wait all year to write: the fall redfish run is firing. Cooler nights have pushed bait and fish onto the flats, and the afternoon low tides have been stacked with tailing reds.",
            "This week we found the best fishing on sunny afternoons two hours either side of low water. The fish are eating crab patterns and weedless soft plastics presented well ahead of the school — long leads and quiet poling are everything right now.",
            "Trout fishing has been a bonus on the warm-up, with solid specks around the creek mouths early before we slide onto the flats for the reds.",
            "Looking ahead, expect this pattern to hold through early December before the fish school into deeper winter holes. If a fall sight-fishing trip is on your list, the next three weeks are the time.",
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "From This Week",
          images: [
            { src: "", alt: "A school of tailing redfish on a sunny flat" },
            { src: "", alt: "Client with a fly-caught fall redfish" },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Get in on the fall run",
          body: "These three weeks are the best sight-fishing of the year — don't miss it.",
          cta: { label: "Book a Fall Trip", href: "/contact", variant: "primary" },
        },
      ],
    },
    {
      pageType: "report",
      slug: "spring-trout-report",
      publishedAt: "2025-04-02",
      author: "Captain Dale Boykin",
      excerpt:
        "Warming water has the speckled trout chewing at first light — topwater eats and easy mornings on the creeks.",
      seo: {
        titleTag: "Spring Speckled Trout Report — Charleston | Lowcountry Redfish",
        metaDescription:
          "Charleston spring fishing report: speckled trout are eating topwater at dawn as the water warms. Where we're finding them and what they want.",
        h1: "Spring Trout Are Eating Topwater",
        jsonLdType: "Article",
        keywords: ["spring trout charleston", "charleston fishing report spring"],
      },
      sections: [
        {
          id: "body",
          type: "articleBody",
          body: [
            "Spring has sprung in the Lowcountry, and the speckled trout know it. As the shallows warm through the morning, the topwater bite at first light has been outstanding around creek mouths and grass edges.",
            "Walk-the-dog plugs in natural colors have been the ticket at dawn; as the sun gets up we switch to soft plastics under a popping cork and keep catching. It's a relaxed, productive trip and a great one for newer anglers.",
            "Redfish are mixed in and starting to spread onto the flats as water temps climb — a sign of the great inshore fishing to come this summer.",
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Beat the heat — fish the dawn",
          body: "Spring mornings are comfortable and the fish are willing. Let's go.",
          cta: { label: "Book a Spring Trip", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ───────────────────────────────────────────────────────── CONTACT ──
    {
      pageType: "contact",
      slug: "contact",
      seo: {
        titleTag: "Contact & Book | Lowcountry Redfish Charters",
        metaDescription:
          "Book a Charleston fishing charter with Captain Dale Boykin. Call, text, or send a message to check available dates.",
        h1: "Book Your Charter",
        jsonLdType: "ContactPage",
        keywords: ["book charleston fishing charter", "contact lowcountry redfish"],
      },
      sections: [
        {
          id: "intro",
          type: "richText",
          heading: "Let's get you on the water",
          body: [
            "The fastest way to lock in a date is to call or text Captain Dale directly. Prefer to write? Use the form below and we'll get back to you within a day.",
          ],
        },
        {
          id: "contact",
          type: "contact",
          heading: "Contact & Booking",
          body: "Tell us your preferred dates, group size, and what you'd like to target.",
          showBusinessDetails: true,
          showLeadForm: true,
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Prefer to talk it through?",
          body: "Call or text (843) 555-0142 — we're glad to help you plan.",
          cta: { label: "Call Now", href: "tel:+18435550142", variant: "primary" },
        },
      ],
    },
  ],
};
