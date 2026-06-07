import type { SiteInput } from "../schema";

/**
 * Reference site for the Holston River template — modelled section-by-section on
 * the "Holsten River Fishing Guides" Figma so the design can be exercised across
 * every page type and every (including the new) section type. Like the other
 * sample, media `src` is empty on purpose (templates render labelled placeholders);
 * `alt` text is real content.
 */
export const holstonRiver: SiteInput = {
  slug: "holston-river",
  baseUrl: "https://holston-river.fishysites.com",
  templateId: "holsten",
  paletteId: "holsten",
  fontId: "saira-inter",
  profile: {
    name: "Holston River Fishing Guides",
    tagline: "Professionally guided fly fishing trips since 2014",
    captainName: "Chris Holston",
    foundedYear: 2014,
    shortBio:
      "Chris Holston has guided fly anglers across the South Holston, Watauga, and the wild mountain streams of Virginia, Tennessee, and North Carolina for over a decade.",
    contact: {
      phone: "+1-828-416-0159",
      email: "chris@holstonriverflyfishing.com",
      address: {
        street: "118 Riverside Drive",
        city: "Boone",
        region: "NC",
        postalCode: "28607",
        country: "US",
      },
      geo: { lat: 36.2168, lng: -81.6746 },
    },
    hours: [
      { day: "monday", open: "05:00", close: "20:00" },
      { day: "tuesday", open: "05:00", close: "20:00" },
      { day: "wednesday", open: "05:00", close: "20:00" },
      { day: "thursday", open: "05:00", close: "20:00" },
      { day: "friday", open: "05:00", close: "20:00" },
      { day: "saturday", open: "05:00", close: "20:00" },
      { day: "sunday", open: "05:00", close: "20:00" },
    ],
    social: [
      { platform: "instagram", url: "https://instagram.com/holstonriverflyfishing" },
      { platform: "facebook", url: "https://facebook.com/holstonriverflyfishing" },
    ],
    serviceAreas: ["Boone", "South Holston River", "Watauga River", "New River", "Virginia", "Tennessee"],
    certifications: ["USFS Special-Use Permitted", "Wilderness First Aid", "CPR Certified", "Fully Insured"],
    fishingTypes: ["Fly Fishing", "Float Trips", "Walk & Wade", "Multi-Day"],
    priceRange: "$$$",
    logo: { src: "", alt: "Holston River Fishing Guides logo", width: 240, height: 80 },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Fishing Trips", href: "/trips/day-trip" },
    { label: "Rivers", href: "/locations/rivers" },
    { label: "Lodging", href: "/locations/lodging" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  defaultOgImage: {
    src: "",
    alt: "Drift boats on the South Holston River at first light",
    width: 1200,
    height: 630,
  },
  footerNote: "© Holston River Fishing Guides. USFS Permitted & Insured. All Rights Reserved.",
  pages: [
    // ─────────────────────────────────────────────────────────── HOME ──
    {
      pageType: "home",
      slug: "home",
      seo: {
        titleTag: "South Holston River Fishing Guides | Guided Fly Fishing",
        metaDescription:
          "Professionally guided fly fishing trips on the South Holston, Watauga, and mountain streams across VA, TN, and NC. Float and walk-&-wade trips for all levels.",
        h1: "South Holston River Fishing Guides",
        jsonLdType: "LocalBusiness",
        keywords: ["south holston fishing guide", "fly fishing boone nc", "watauga river guide", "guided fly fishing trips"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Professionally Guided Fly Fishing Trips",
          headline: "South Holston River Fishing Guides",
          subheadline:
            "Holston River Fishing Guides runs guided fly fishing trips out of Boone, North Carolina on the South Holston, Watauga, New River, South Fork Holston, and dozens of mountain streams across Virginia, Tennessee, and North Carolina.",
          media: { src: "", alt: "Aerial view of drift boats on the South Holston River", width: 1600, height: 900 },
          primaryCta: { label: "View Fishing Trips", href: "/trips/day-trip", variant: "primary" },
          secondaryCta: { label: "Call (828) 416-0159", href: "tel:+18284160159", variant: "link" },
        },
        {
          id: "options",
          type: "tripCards",
          heading: "Fly Fishing Trip Options",
          trips: [
            {
              title: "Float Fishing Trips",
              summary:
                "Cover more water from a drift boat on the South Holston and Watauga. Ideal for anglers of every level who want a full day on big tailwater.",
              slug: "day-trip",
              duration: "Full day",
              media: { src: "", alt: "Guide rowing a drift boat down the South Holston", width: 800, height: 533 },
            },
            {
              title: "Walk & Wade Trips",
              summary:
                "Get off the beaten path and into the wild mountain streams. Intimate, technical water for anglers who want to cover ground on foot.",
              slug: "day-trip",
              duration: "Half / full day",
              media: { src: "", alt: "Angler wading a clear mountain stream", width: 800, height: 533 },
            },
            {
              title: "Overnight & Multi-Day Trips",
              summary:
                "Riverside camping, lodging, and catered meals on multi-day adventures. The full Appalachian experience, planned end to end.",
              slug: "multi-day-trip",
              duration: "2–5 days",
              media: { src: "", alt: "Riverside camp at dusk on a multi-day trip", width: 800, height: 533 },
            },
          ],
        },
        {
          id: "about",
          type: "mediaText",
          mediaSide: "left",
          tone: "dark",
          heading: "About HRFG",
          body: [
            "We fish 12 months a year. Float trips, walk-and-wade outings, and multi-day overnight adventures with riverside camping, lodging, and catered meals.",
            "Our guides hold licenses in all three states and USFS special-use permits for fishing and camping in the George Washington and Jefferson National Forest. Every guide on staff is certified in Wilderness First Aid and CPR. We bring the rods, the tackle, the waders, the boat, and the lunch. You bring yourself.",
          ],
          media: { src: "", alt: "Two anglers kneeling with a large brown trout in the snow", width: 610, height: 594 },
          cta: { label: "Learn More About Us", href: "/about", variant: "primary" },
        },
        {
          id: "where-we-fish",
          type: "mediaCards",
          heading: "Where We Fish",
          intro:
            "Based in Boone, NC, our guides cover a 75-mile radius across the Blue Ridge. We float the rivers and hike the creeks and wade sections. Call us to discuss fishing and local knowledge.",
          layout: "carousel",
          columns: 3,
          cards: [
            {
              eyebrow: "Tailwater",
              title: "South Holston River, TN",
              body: "An hour from Boone, the Sulfur hatch and wild brown trout make the South Holston a world-class tailwater.",
              details: [
                { label: "Best season", value: "Year-round" },
                { label: "Trip style", value: "Float & wade" },
              ],
              cta: { label: "Book this water", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Tailwater",
              title: "South Fork Holston River, TN",
              body: "Fifty minutes from Boone, a river fished hard through tailwater. Clear water, perfect for camping.",
              details: [
                { label: "Best season", value: "Spring–Fall" },
                { label: "Trip style", value: "Float" },
              ],
              cta: { label: "Book this water", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Freestone",
              title: "Watauga River, TN",
              body: "An hour from Boone, near Elizabethton. Hard-fighting rainbows and wild browns over a generous flow.",
              details: [
                { label: "Best season", value: "Year-round" },
                { label: "Trip style", value: "Float & wade" },
              ],
              cta: { label: "Book this water", href: "/trips/day-trip", variant: "link" },
            },
          ],
        },
        {
          id: "reviews",
          type: "testimonials",
          heading: "What Our Guests Are Saying",
          items: [
            {
              quote:
                "Chris is an exceptional guide. He knows the rivers and how to fish them in all weather, so plan to catch fish — but you have to work it and listen to him. An incredible trainer and mentor for the novice and experienced fly fisherman.",
              author: "Michael R.",
              location: "Charlotte, NC",
              rating: 5,
            },
            {
              quote:
                "Best guided trip I've ever been on. We caught fish all day and learned more about reading water in one outing than in years on my own.",
              author: "David P.",
              location: "Knoxville, TN",
              rating: 5,
            },
            {
              quote:
                "Top to bottom professional. Great gear, great instruction, and a genuine love for these rivers. We've already booked next year.",
              author: "Sarah & Tom W.",
              location: "Atlanta, GA",
              rating: 5,
            },
          ],
        },
        {
          id: "destinations",
          type: "speciesCards",
          heading: "Destination Fly Fishing Trips",
          species: [
            { name: "Georgetown, SC", season: "Coastal Redfish", blurb: "Sight-casting tailing redfish on the Lowcountry flats." },
            { name: "Grand Bahama", season: "Bonefish Flats", blurb: "Wading white sand flats for bonefish in gin-clear water." },
            { name: "Ascension Bay", season: "Permit & Tarpon", blurb: "The grand slam fishery of Mexico's Yucatán coast." },
            { name: "Teton Valley", season: "Cutthroat Paradise", blurb: "Dry-fly cutthroat under the shadow of the Tetons." },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Book Your Trip",
          body: "We have rates and guides year-round. Call (828) 416-0159 or send a message to chris@holstonriverflyfishing.com and we'll find the right water and put you on fish.",
          cta: { label: "Book Your Trip Now", href: "/contact", variant: "primary" },
          media: { src: "", alt: "Anglers on a drift boat at golden hour", width: 1600, height: 700 },
        },
      ],
    },

    // ──────────────────────────────────────────────────────── DAY TRIP ──
    {
      pageType: "trip",
      slug: "day-trip",
      priceFrom: 350,
      duration: "Half day / Full day",
      seo: {
        titleTag: "Guided Fly Fishing Day Trips Near Boone, NC | Holston River",
        metaDescription:
          "Float and walk-&-wade fly fishing day trips on the South Holston and Watauga near Boone, NC. Gear, lunch, and instruction included for all levels.",
        h1: "Guided Fly Fishing Day Trips Near Boone, NC",
        jsonLdType: "Service",
        keywords: ["fly fishing day trip boone nc", "south holston float trip", "walk and wade guide"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Guided Day Trips",
          headline: "Guided Fly Fishing Day Trips Near Boone, NC",
          subheadline: "Float a drift boat on big tailwater or hike into wild mountain streams — a full day of guided fly fishing, gear and lunch included.",
          media: { src: "", alt: "Angler casting from a drift boat on the South Holston", width: 1600, height: 900 },
          primaryCta: { label: "Book a Day Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "promo",
          type: "mediaText",
          mediaSide: "right",
          tone: "light",
          eyebrow: "Limited Time",
          heading: "First-Time Customer Discount",
          body: [
            "New to Holston River Fishing Guides? Take $50 off your first guided day trip when you mention this offer at booking. A great way to try the water with a pro before you plan a bigger adventure.",
          ],
          media: { src: "", alt: "Guide netting a trout for a first-time client", width: 610, height: 360 },
          cta: { label: "Claim the Discount", href: "/contact", variant: "primary" },
        },
        {
          id: "float",
          type: "pricedOffering",
          eyebrow: "Drift Boat",
          heading: "Float Fishing Trips",
          detailsSide: "right",
          body: [
            "The full day float covers more water on the South Holston and Watauga from a comfortable drift boat. We provide everything — rods, reels, flies, waders, and lunch on the bank.",
            "Great for anglers of every level. Beginners get hands-on coaching; experienced casters get put on technical, rewarding water.",
          ],
          primaryCta: { label: "Book a Float Trip", href: "/contact", variant: "primary" },
          secondaryCta: { label: "See Rates", href: "/trips/day-trip", variant: "link" },
          rate: {
            columns: ["1 Angler", "2 Anglers"],
            rows: [
              { label: "Half day (4 hrs)", values: ["$350", "$425"] },
              { label: "Full day (8 hrs)", values: ["$500", "$575"] },
            ],
            note: "Prices per boat. Gratuity not included.",
          },
          includedTitle: "What's Included on Every Trip",
          included: [
            "All rods, reels, and flies",
            "Waders and boots in your size",
            "Streamside lunch and drinks",
            "Drift boat and shuttle",
            "Hands-on casting instruction",
          ],
        },
        {
          id: "wade",
          type: "pricedOffering",
          eyebrow: "On Foot",
          heading: "Walk & Wade Fishing Trips",
          detailsSide: "left",
          media: { src: "", alt: "Angler wading a small mountain creek under rhododendron", width: 610, height: 400 },
          body: [
            "Get off the beaten path and into the wild mountain streams. Walk-and-wade trips are intimate and technical — perfect for anglers who want to cover ground on foot and learn to read small water.",
          ],
          primaryCta: { label: "Book a Wade Trip", href: "/contact", variant: "primary" },
          rate: {
            columns: ["1 Angler", "2 Anglers"],
            rows: [
              { label: "Half day (4 hrs)", values: ["$300", "$375"] },
              { label: "Full day (8 hrs)", values: ["$450", "$525"] },
            ],
            note: "Prices per group. Gratuity not included.",
          },
          includedTitle: "What's Included on Every Trip",
          included: ["All rods, reels, and flies", "Waders and boots in your size", "Streamside lunch and drinks", "Expert local instruction"],
        },
        {
          id: "expect",
          type: "steps",
          heading: "What to Expect on Your Trip",
          items: [
            { kicker: "Step 01 — Morning", title: "The Rigging", body: "We meet at the launch, fit your waders, and rig rods for the conditions while we talk through the day's plan." },
            { kicker: "Step 02 — On the Water", title: "First Light", body: "We hit the water early and work the best runs of the morning hatch, coaching your cast and drift as we go." },
            { kicker: "Step 03 — Midday", title: "The Shore Lunch", body: "We pull over for a streamside lunch, swap stories, and reset before the afternoon bite." },
            { kicker: "Step 04 — Afternoon", title: "After the Trip", body: "We finish on a strong run, break down gear, and send you off with tips for fishing the water on your own." },
          ],
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "From Recent Day Trips",
          images: [
            { src: "", alt: "Wild brown trout held just above the water" },
            { src: "", alt: "Angler casting across a misty tailwater run" },
            { src: "", alt: "A rainbow trout being released boatside" },
            { src: "", alt: "Fly box of sulfur and midge patterns" },
            { src: "", alt: "Drift boat anchored along a grassy bank" },
            { src: "", alt: "Guide coaching a client's cast" },
          ],
        },
        {
          id: "policies",
          type: "faq",
          heading: "Trip Details & Policies",
          items: [
            { question: "Deposit", answer: "A 50% deposit reserves your date; the balance is due the day of the trip." },
            { question: "Cancellation", answer: "Cancel 7+ days out for a full refund of your deposit. Inside 7 days the deposit is non-refundable but transferable to a new date." },
            { question: "Weather", answer: "We fish in most conditions. If water is unsafe we'll reschedule or refund in full — your call." },
            { question: "Fishing License", answer: "Each angler needs a valid license for the state we fish. We'll tell you exactly which one and where to buy it online." },
            { question: "What to Bring", answer: "A hat, polarized sunglasses, sunscreen, layers for the weather, and a valid fishing license. We provide the rest." },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Book?",
          body: "Promotions during peak season. Float trips from $350. Call (828) 416-0159 or email chris@holstonriverflyfishing.com.",
          cta: { label: "Book Your Trip Now", href: "/contact", variant: "primary" },
          media: { src: "", alt: "Drift boat silhouetted on the river at dusk", width: 1600, height: 700 },
        },
      ],
    },

    // ─────────────────────────────────────────────────── MULTI-DAY TRIP ──
    {
      pageType: "trip",
      slug: "multi-day-trip",
      priceFrom: 1200,
      duration: "2–5 days",
      seo: {
        titleTag: "Multi-Day Fly Fishing Trips | Holston River Fishing Guides",
        metaDescription:
          "Overnight and multi-day guided fly fishing adventures with riverside camping, lodging, and catered meals across the southern Appalachians.",
        h1: "Multi-Day Fly Fishing Trips",
        jsonLdType: "Service",
        keywords: ["multi-day fly fishing", "overnight fishing trip appalachia", "riverside camping fly fishing"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Overnight Adventures",
          headline: "Multi-Day Fly Fishing Trips",
          subheadline: "Two to five days of guided water, riverside camping or lodging, and catered meals — the full Appalachian fly fishing experience.",
          media: { src: "", alt: "Tents pitched along a river at golden hour", width: 1600, height: 900 },
          primaryCta: { label: "Plan Your Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "why",
          type: "mediaText",
          mediaSide: "left",
          tone: "dark",
          heading: "Why Multi-Day Trips Are Different",
          body: [
            "A multi-day trip lets us chase the best water across the region instead of being tied to a single river. We follow the hatches, the flows, and the weather to put you on the best fishing each day.",
            "Mornings and evenings — the magic hours — are spent on the water instead of driving to it. Everything in between is handled: camp, meals, and gear.",
          ],
          media: { src: "", alt: "Anglers fishing a remote run at first light", width: 610, height: 594 },
          cta: { label: "Talk to a Guide", href: "/contact", variant: "primary" },
        },
        {
          id: "offer",
          type: "featureGrid",
          heading: "What We Offer",
          items: [
            { icon: "🏕️", title: "Riverside Camping", body: "Permitted backcountry camps right on the water in the national forest." },
            { icon: "🛶", title: "Float & Wade", body: "A mix of drift-boat floats and walk-and-wade days for variety." },
            { icon: "🍳", title: "Catered Meals", body: "Hot breakfasts, streamside lunches, and hearty dinners, all included." },
            { icon: "🎣", title: "All Gear Provided", body: "Rods, reels, flies, waders, and camp equipment — just bring yourself." },
          ],
        },
        {
          id: "addons",
          type: "checklist",
          heading: "Add-Ons",
          intro: "Customize your adventure with optional extras booked ahead of time.",
          columns: 3,
          items: [
            "Extra guided day",
            "Photography package",
            "Premium lodging upgrade",
            "Spey / two-handed instruction",
            "Custom fly tying session",
            "Non-angler companion rate",
          ],
        },
        {
          id: "included",
          type: "pricedOffering",
          eyebrow: "All-Inclusive",
          heading: "What's Included",
          detailsSide: "right",
          media: { src: "", alt: "Camp kitchen set up beside the river", width: 610, height: 400 },
          body: [
            "Multi-day trips are all-inclusive from the moment we meet at the trailhead. Here's what comes standard on every overnight adventure.",
          ],
          primaryCta: { label: "Request a Quote", href: "/contact", variant: "primary" },
          rate: {
            columns: ["2 Days", "4 Days"],
            rows: [
              { label: "1 Angler", values: ["$1,200", "$2,200"] },
              { label: "2 Anglers", values: ["$1,600", "$2,900"] },
            ],
            note: "Per group. Includes camping, meals, and guiding.",
          },
          includedTitle: "Standard on Every Trip",
          included: ["Permitted riverside camping", "All meals and drinks", "Drift boat and shuttles", "Rods, reels, flies, and waders", "Wilderness-certified guides"],
        },
        {
          id: "camp",
          type: "gallery",
          heading: "Where We Camp & Fish",
          images: [
            { src: "", alt: "A backcountry camp lit by lantern at dusk" },
            { src: "", alt: "Misty river canyon at dawn" },
            { src: "", alt: "Angler hiking into a remote stream" },
            { src: "", alt: "Trout in the net beside the boat" },
          ],
        },
        {
          id: "planning",
          type: "steps",
          heading: "Planning Your Trip",
          items: [
            { kicker: "01", title: "Reach Out", body: "Tell us your dates, group size, and the kind of water you want to fish." },
            { kicker: "02", title: "Build the Itinerary", body: "We design a day-by-day plan around the best fishing and your goals." },
            { kicker: "03", title: "Pack & Arrive", body: "We send a simple packing list. You show up — we handle everything else." },
          ],
        },
        {
          id: "policies",
          type: "faq",
          heading: "Trip Details & Policies",
          items: [
            { question: "Deposit", answer: "A 50% deposit confirms multi-day dates; the balance is due two weeks before the trip." },
            { question: "Group Size", answer: "We keep groups small — typically one to four anglers per guide — for the best experience." },
            { question: "Fitness", answer: "Most trips involve moderate hiking and wading. Tell us about any limitations and we'll tailor the route." },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Plan Your Trip?",
          body: "Multi-day adventures book early. Reach out and we'll start building your itinerary.",
          cta: { label: "Start Planning", href: "/contact", variant: "primary" },
          media: { src: "", alt: "River winding through the Blue Ridge at sunset", width: 1600, height: 700 },
        },
      ],
    },

    // ──────────────────────────────────────────────────── RIVERS (LOC) ──
    {
      pageType: "location",
      slug: "rivers",
      seo: {
        titleTag: "Where We Fish — Rivers & Streams | Holston River Fishing Guides",
        metaDescription:
          "The rivers and streams we guide across VA, TN, and NC — South Holston, Watauga, and wild mountain creeks. Float and walk-&-wade waters explained.",
        h1: "Where We Fish",
        jsonLdType: "CollectionPage",
        keywords: ["south holston river", "watauga river fishing", "appalachian trout streams"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Our Waters",
          headline: "Where We Fish",
          subheadline: "From world-class tailwaters to hidden freestone creeks — a guide to the rivers and streams we fish across the southern Appalachians.",
          media: { src: "", alt: "Clear mountain river running through the forest", width: 1600, height: 900 },
        },
        {
          id: "float-waters",
          type: "mediaCards",
          heading: "Fly Fishing Float Trips",
          intro: "Big tailwater fished from a drift boat. These rivers carry generous flows and strong fish — ideal for covering water across a full day.",
          layout: "carousel",
          columns: 3,
          cards: [
            {
              eyebrow: "Float Trip Waters",
              title: "South Holston River, TN",
              body: "An hour from Boone. The famous Sulfur hatch and wild brown trout make this one of the best tailwaters in the East.",
              details: [{ label: "Best season", value: "Year-round" }, { label: "Float length", value: "7–9 miles" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Float Trip Waters",
              title: "Watauga River, TN",
              body: "Near Elizabethton. Hard-fighting rainbows and wild browns over a generous flow with great access.",
              details: [{ label: "Best season", value: "Year-round" }, { label: "Float length", value: "6–8 miles" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Float Trip Waters",
              title: "South Fork Holston, TN",
              body: "Fifty minutes from Boone. Clear, cold tailwater with consistent dry-fly action and room to spread out.",
              details: [{ label: "Best season", value: "Spring–Fall" }, { label: "Float length", value: "5–7 miles" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
          ],
        },
        {
          id: "grand-slam",
          type: "richText",
          heading: 'The "Grand Slam"',
          body: [
            "Catch a brook trout, a rainbow, and a brown in the same trip and you've completed what we call the Grand Slam. It's doable on a single long day of wade fishing across our freestone creeks, but it does take some local know-how. Ask your guide about it on your next trip.",
          ],
        },
        {
          id: "wade-waters",
          type: "mediaCards",
          heading: "Fly Fishing Walk & Wade Trips",
          intro: "Intimate freestone water you reach on foot — technical, wild, and full of native fish.",
          layout: "carousel",
          columns: 3,
          cards: [
            {
              eyebrow: "Wade Trip Waters",
              title: "Whitetop Laurel Creek",
              body: "A scenic Virginia creek winding through old-growth forest. Wild rainbows and browns and the odd native brookie.",
              details: [{ label: "Best season", value: "Apr–Oct" }, { label: "Access", value: "Walk-in" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Wade Trip Waters",
              title: "South Fork Holston Wade Sections",
              body: "The upper wade sections offer wadeable water with pretty wild fish, away from the float crowds.",
              details: [{ label: "Best season", value: "Spring–Fall" }, { label: "Access", value: "Walk-in" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
            {
              eyebrow: "Wade Trip Waters",
              title: "Beaverdam Creek, Upper South Fork",
              body: "Small, wild, and intimate. A native brook trout fishery for anglers who love tight, technical casting.",
              details: [{ label: "Best season", value: "Apr–Oct" }, { label: "Access", value: "Walk-in" }],
              cta: { label: "Book this trip", href: "/trips/day-trip", variant: "link" },
            },
          ],
        },
        {
          id: "how-we-choose",
          type: "featureGrid",
          heading: "How We Choose the River",
          items: [
            { icon: "🗓️", title: "Season & Hatches", body: "What's hatching drives everything. We follow the bugs from river to river all season." },
            { icon: "🎯", title: "Your Goals", body: "Topwater dry-fly action or a shot at a wallhanger — we match the water to what you want." },
            { icon: "📈", title: "Experience Level", body: "We match river difficulty to your skill, from beginner-friendly to expert-only technical water." },
            { icon: "💧", title: "Water Conditions", body: "Flows, clarity, and temperature change daily. We monitor USGS gauges and local knowledge." },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Fish?",
          body: "Call (828) 416-0159 or email chris@holstonriverflyfishing.com and we'll match you to the right water.",
          cta: { label: "Book Your Trip Now", href: "/contact", variant: "primary" },
          media: { src: "", alt: "Angler casting on a wide river at sunset", width: 1600, height: 700 },
        },
      ],
    },

    // ─────────────────────────────────────────────────── LODGING (LOC) ──
    {
      pageType: "location",
      slug: "lodging",
      seo: {
        titleTag: "Lodging for Your Fly Fishing Trip | Holston River Fishing Guides",
        metaDescription:
          "Cabins and lodges near the South Holston and Watauga for your guided fly fishing trip — riverside retreats across Virginia and Tennessee.",
        h1: "Lodging for Your Fly Fishing Trip",
        jsonLdType: "CollectionPage",
        keywords: ["south holston lodging", "fly fishing cabins tennessee", "watauga river lodging"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Stay & Fish",
          headline: "Lodging for Your Fly Fishing Trip",
          subheadline: "Hand-picked cabins and lodges minutes from the water, so you can wake up, grab coffee, and be casting by first light.",
          media: { src: "", alt: "A-frame cabin overlooking the river", width: 1600, height: 900 },
        },
        {
          id: "promo",
          type: "mediaText",
          mediaSide: "right",
          tone: "light",
          eyebrow: "Bundle & Save",
          heading: "Guided Trip Discounts With Lodging",
          body: [
            "Book a multi-day guided trip and stay at one of our partner cabins to save on both. We'll coordinate your dates, your water, and your bed so the whole trip is handled.",
          ],
          media: { src: "", alt: "Porch of a riverside cabin at dusk", width: 610, height: 360 },
          cta: { label: "Ask About Bundles", href: "/contact", variant: "primary" },
        },
        {
          id: "virginia",
          type: "mediaCards",
          heading: "Virginia Lodging",
          columns: 2,
          cards: [
            {
              title: "Angler's Getaway",
              body: "A cozy cabin steps from Whitetop Laurel Creek. Sleeps four, with a fly-tying bench and a wood stove.",
              details: [{ label: "Sleeps", value: "4" }, { label: "From", value: "$185 / night" }],
              media: { src: "", alt: "Small wood cabin in the Virginia woods", width: 800, height: 533 },
              cta: { label: "View Lodging", href: "/contact", variant: "link" },
            },
            {
              title: "Rainbow Trout Cabin",
              body: "A classic creekside cabin with a wraparound porch and easy access to wade water. Sleeps six.",
              details: [{ label: "Sleeps", value: "6" }, { label: "From", value: "$240 / night" }],
              media: { src: "", alt: "Red cabin beside a mountain creek", width: 800, height: 533 },
              cta: { label: "View Lodging", href: "/contact", variant: "link" },
            },
          ],
        },
        {
          id: "tennessee",
          type: "mediaCards",
          heading: "Tennessee Lodging",
          columns: 3,
          cards: [
            {
              title: "Riverside Retreat",
              body: "On the banks of the South Holston, this retreat puts the river out your back door. Sleeps eight.",
              details: [{ label: "Sleeps", value: "8" }, { label: "From", value: "$320 / night" }],
              media: { src: "", alt: "Large riverfront lodge at dusk", width: 800, height: 533 },
              cta: { label: "View Lodging", href: "/contact", variant: "link" },
            },
            {
              title: "Meredith Valley Farm",
              body: "A restored farmhouse in the valley, minutes from the Watauga. Quiet, comfortable, and group-friendly.",
              details: [{ label: "Sleeps", value: "10" }, { label: "From", value: "$380 / night" }],
              media: { src: "", alt: "White farmhouse in a green valley", width: 800, height: 533 },
              cta: { label: "View Lodging", href: "/contact", variant: "link" },
            },
            {
              title: "Eagle's Cottage",
              body: "A snug two-bedroom cottage perfect for a pair of anglers on a focused fishing weekend.",
              details: [{ label: "Sleeps", value: "2" }, { label: "From", value: "$160 / night" }],
              media: { src: "", alt: "Small stone cottage among trees", width: 800, height: 533 },
              cta: { label: "View Lodging", href: "/contact", variant: "link" },
            },
          ],
        },
        {
          id: "help",
          type: "mediaText",
          mediaSide: "left",
          tone: "light",
          heading: "Not Sure Which Rental Fits?",
          body: [
            "Tell us your group size, budget, and which water you want to fish, and we'll recommend the right cabin or lodge — and coordinate it with your guided days so everything lines up.",
          ],
          media: { src: "", alt: "Map of cabins along the river valley", width: 610, height: 400 },
          cta: { label: "Get a Recommendation", href: "/contact", variant: "primary" },
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Book?",
          body: "Lock in lodging and guided days together and we'll handle the logistics end to end.",
          cta: { label: "Book Your Stay", href: "/contact", variant: "primary" },
          media: { src: "", alt: "Cabin windows glowing at night by the river", width: 1600, height: 700 },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────── ABOUT ──
    {
      pageType: "about",
      slug: "about",
      seo: {
        titleTag: "About Holston River Fishing Guides | Boone, NC",
        metaDescription:
          "Meet the guides behind Holston River Fishing Guides — a decade of guiding fly anglers across the South Holston, Watauga, and wild Appalachian streams.",
        h1: "About Holston River Fishing Guides",
        jsonLdType: "AboutPage",
        keywords: ["holston river fishing guides", "boone nc fly fishing guide", "chris holston guide"],
      },
      sections: [
        {
          id: "story",
          type: "mediaText",
          mediaSide: "left",
          tone: "dark",
          eyebrow: "Our Story",
          heading: "How We Started",
          body: [
            "Holston River Fishing Guides began with a simple idea: share the rivers we grew up on with anglers who'd never seen water this good. What started as a one-boat operation in 2014 has grown into a small team of full-time, certified guides.",
            "We still run it like a family business — small groups, big effort, and a genuine love for these mountains and the fish that live in them.",
          ],
          media: { src: "", alt: "Guide holding a wild brown trout in the snow", width: 610, height: 594 },
        },
        {
          id: "apart",
          type: "featureGrid",
          heading: "What Sets Us Apart",
          items: [
            { icon: "🗺️", title: "Local Knowledge", body: "We fish these rivers 200+ days a year and know where the fish are in every season and flow." },
            { icon: "🪪", title: "Fully Permitted", body: "Licensed in all three states with USFS special-use permits to fish and camp the national forest." },
            { icon: "⛑️", title: "Safety First", body: "Every guide is certified in Wilderness First Aid and CPR and carries a full kit on the water." },
          ],
        },
        {
          id: "guides",
          type: "mediaCards",
          heading: "Meet the Guides",
          columns: 3,
          cards: [
            { eyebrow: "Owner & Head Guide", title: "Chris Holston", body: "A decade on these rivers and happiest coaching a first-timer into their best fish.", media: { src: "", alt: "Portrait of head guide Chris Holston", width: 600, height: 600 } },
            { eyebrow: "Guide", title: "Marcus Lane", body: "Spey specialist and dry-fly fanatic who knows every seam on the South Holston.", media: { src: "", alt: "Portrait of guide Marcus Lane", width: 600, height: 600 } },
            { eyebrow: "Guide", title: "Dani Reyes", body: "Backcountry and small-stream expert who lives for native brook trout water.", media: { src: "", alt: "Portrait of guide Dani Reyes", width: 600, height: 600 } },
          ],
        },
        {
          id: "quote",
          type: "articleBody",
          pullQuote: "We measure success in moments on the water, not just numbers in the net.",
          body: [
            "Some of our favorite days have been low-catch days — a beginner's first roll cast that finally turns over, a parent and kid sharing a net, a heron lifting off a quiet run at dawn. The fish matter, but the river is the point.",
          ],
        },
        {
          id: "footprint",
          type: "gallery",
          heading: "Our Footprint",
          images: [
            { src: "", alt: "Wild brown trout cradled over the water" },
            { src: "", alt: "Guide and client laughing on the boat" },
            { src: "", alt: "Fog lifting off a mountain river" },
            { src: "", alt: "Angler hiking out at the end of the day" },
            { src: "", alt: "Brook trout in the net" },
            { src: "", alt: "Drift boat on a still morning river" },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Fish With Us?",
          body: "Come see the rivers we love. Let's get a day on the calendar.",
          cta: { label: "Get in Touch", href: "/contact", variant: "primary" },
          media: { src: "", alt: "The team launching boats at dawn", width: 1600, height: 700 },
        },
      ],
    },

    // ──────────────────────────────────────────────────── HOSTED TRAVEL ──
    {
      pageType: "trip",
      slug: "hosted-travel",
      priceFrom: 3200,
      duration: "Hosted weeks",
      seo: {
        titleTag: "Hosted Fly Fishing Travel | Holston River Fishing Guides",
        metaDescription:
          "Hosted fly fishing trips to world-class destinations — bonefish flats, permit, and dry-fly rivers — with lodging, meals, and a familiar guide along.",
        h1: "Hosted Fly Fishing Travel",
        jsonLdType: "Service",
        keywords: ["hosted fly fishing trips", "fly fishing travel host", "destination fly fishing"],
      },
      sections: [
        {
          id: "hero",
          type: "hero",
          eyebrow: "Travel With Us",
          headline: "Hosted Fly Fishing Travel",
          subheadline: "Fish world-class destinations with a guide you already know. We handle the logistics; you enjoy the trip of a lifetime.",
          media: { src: "", alt: "Tropical flats lodge surrounded by palms", width: 1600, height: 900 },
          primaryCta: { label: "See Hosted Weeks", href: "/contact", variant: "primary" },
        },
        {
          id: "what",
          type: "richText",
          heading: 'What "Hosted" Means',
          body: [
            "Many fly fishing companies sell trips. We accompany you. When you travel with Holston River, a guide joins you for the week — handling logistics, smoothing travel, and making sure you get on fish.",
            "From airport pickup to the last cast, you fish and relax while we manage everything: lodging, meals, transfers, and the daily plan. It's the easiest way to fish a world-class destination with people you trust.",
          ],
        },
        {
          id: "weeks",
          type: "mediaCards",
          heading: "Annual Hosted Weeks",
          intro: "We host the same trips every year. Dates book early — usually 6 to 12 months out — and spots fill fast. If a week is sold out, ask to be added to next year's list.",
          columns: 3,
          cards: [
            { eyebrow: "Legendary Bull · Bahamas", title: "Kay Fly Fishing Lodge", body: "Wade endless white-sand flats for bonefish, with a shot at permit and the occasional tarpon.", details: [{ label: "When", value: "March" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
            { eyebrow: "Grand Bahama", title: "East End Lodge", body: "Remote, uncrowded flats and big bonefish off the quiet east end of Grand Bahama.", details: [{ label: "When", value: "April" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
            { eyebrow: "Georgetown, SC", title: "Lowcountry Redfish", body: "Sight-cast tailing redfish on the Lowcountry flats — a short hop from home.", details: [{ label: "When", value: "October" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
            { eyebrow: "Teton Valley", title: "Cutthroat Paradise", body: "Dry-fly cutthroat on freestone rivers under the shadow of the Tetons.", details: [{ label: "When", value: "July" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
            { eyebrow: "Costa Rica", title: "4Corners Costa Rica", body: "Blue water and jungle rivers — roosterfish on the beach, machaca in the trees.", details: [{ label: "When", value: "February" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
            { eyebrow: "Georgia Coast", title: "Saint Simons Island", body: "Fall flats fishing for tailing reds and a relaxed barrier-island base camp.", details: [{ label: "When", value: "November" }], cta: { label: "Key dates & info", href: "/contact", variant: "link" } },
          ],
        },
        {
          id: "addons",
          type: "checklist",
          heading: "Add-Ons",
          columns: 3,
          items: [
            "Companion (non-angler) rate",
            "Extra guided day on arrival",
            "Casting clinic before you travel",
            "Fly tying and gear-prep session",
            "Custom rod & reel rental package",
            "Add travel-day shuttle service",
          ],
        },
        {
          id: "custom",
          type: "richText",
          heading: "Custom Hosted Trips",
          body: [
            "If we haven't been there in 25 years schedule, we create custom trips. Share your target species, destination, and group size, and we'll design the trip — including lodging, guides, and logistics. Whatever your goal, we can match it.",
            "Call Chris at (828) 416-0159 or email chris@holstonriverflyfishing.com to start the conversation.",
          ],
        },
        {
          id: "why",
          type: "mediaText",
          mediaSide: "left",
          tone: "light",
          heading: "Why Book a Hosted Trip Through Us",
          body: [
            "You're not just another reservation. We know the lodges, the guides, and the water — and we're on the trip with you. If something goes sideways, we sort it out so your fishing time stays fishing time.",
            "Familiar faces, trusted gear, and zero logistics to manage. Just show up and fish.",
          ],
          media: { src: "", alt: "Guide and clients celebrating a flats catch", width: 610, height: 400 },
          cta: { label: "Plan a Hosted Trip", href: "/contact", variant: "primary" },
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Ready to Plan Your Trip?",
          body: "Book a spot on a hosted week or design a custom adventure. Call (828) 416-0159 or email to get started.",
          cta: { label: "Start Planning", href: "/contact", variant: "primary" },
          media: { src: "", alt: "Skiff running across tropical flats", width: 1600, height: 700 },
        },
      ],
    },

    // ───────────────────────────────────────────────────────────── FAQ ──
    {
      pageType: "faq",
      slug: "faq",
      seo: {
        titleTag: "Fly Fishing Trip FAQ | Holston River Fishing Guides",
        metaDescription:
          "Answers to common questions about our guided fly fishing trips near Boone, NC — licenses, gear, weather, deposits, and what to expect.",
        h1: "Frequently Asked Questions",
        jsonLdType: "FAQPage",
        keywords: ["fly fishing guide faq", "holston river fishing questions"],
      },
      sections: [
        {
          id: "intro",
          type: "richText",
          body: ["Have a question that isn't covered here? Call or text us at (828) 416-0159 — we're glad to help you plan the perfect trip."],
        },
        {
          id: "faq",
          type: "faq",
          heading: "Before You Book",
          items: [
            { question: "What's included on a guided trip?", answer: "Rods, reels, flies, waders and boots, a streamside lunch, and instruction. You bring a license, sunglasses, and weather-appropriate layers." },
            { question: "Do I need a fishing license?", answer: "Yes — each angler needs a valid license for the state we fish. We'll tell you exactly which one and send a link to buy it online." },
            { question: "I've never fly fished. Can I still book?", answer: "Absolutely. A huge share of our trips are first-timers. Coaching is part of every trip and we love teaching the sport." },
            { question: "What's your weather policy?", answer: "We fish in most conditions. If water levels or weather make it unsafe, we'll reschedule or refund your deposit in full." },
            { question: "How do deposits work?", answer: "A 50% deposit reserves your date; the balance is due the day of the trip. Cards, cash, and mobile payments accepted." },
          ],
        },
        {
          id: "cta",
          type: "ctaBanner",
          heading: "Still Have Questions?",
          body: "Reach out and we'll get you sorted before your trip.",
          cta: { label: "Contact Us", href: "/contact", variant: "primary" },
        },
      ],
    },

    // ───────────────────────────────────────────────────────── CONTACT ──
    {
      pageType: "contact",
      slug: "contact",
      seo: {
        titleTag: "Contact & Book | Holston River Fishing Guides",
        metaDescription:
          "Book a guided fly fishing trip with Holston River Fishing Guides near Boone, NC. Call, email, or send a message to check available dates.",
        h1: "Get in Touch",
        jsonLdType: "ContactPage",
        keywords: ["book holston river fishing", "contact fly fishing guide boone"],
      },
      sections: [
        {
          id: "contact",
          type: "contact",
          heading: "Get in Touch",
          body: "Thanks for your interest in fishing with us. We're happy to answer any questions. Please complete the form with your preferred dates and we'll get back to you fast.",
          showBusinessDetails: true,
          showLeadForm: true,
        },
        {
          id: "map",
          type: "map",
          heading: "Find Us",
          intro: "Based in Boone, NC — a short drive from the South Holston, Watauga, and the New River.",
        },
        {
          id: "gallery",
          type: "gallery",
          heading: "On the Water",
          images: [
            { src: "", alt: "Wild brown trout over the water" },
            { src: "", alt: "Angler with a bright rainbow trout" },
            { src: "", alt: "Two anglers on a drift boat" },
            { src: "", alt: "Casting on a misty river" },
            { src: "", alt: "Guide netting a fish" },
            { src: "", alt: "Brook trout held low over the current" },
          ],
        },
      ],
    },
  ],
};
