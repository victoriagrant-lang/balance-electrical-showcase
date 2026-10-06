import { AREAS, type Area } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES, type Faq } from "@/lib/services";
import type { GoogleReviews } from "@/lib/google-reviews";
import victoriaPortrait from "@/assets/victoria-portrait.webp";
import mitchPortrait from "@/assets/mitch-portrait.webp";

/*
  Structured data (schema.org JSON-LD) shared across the site. Search engines and AI
  assistants read this to understand who Balance is, what it does, where, and who runs it.
  Everything here must stay factual — it is quoted back to people as an answer. No prices,
  years, memberships, street address, after-hours service or awards won by Balance itself.
*/

export const SITE = "https://www.balanceelectrical.co.nz";
const BUSINESS_ID = `${SITE}/#business`;
const VICTORIA_ID = `${SITE}/#victoria`;
const MITCH_ID = `${SITE}/#mitchell-pearce`;
const AIR_CONDITIONING_ID = `${SITE}/#balance-air-conditioning`;
const WEBSITE_ID = `${SITE}/#website`;
const DISTRICT_ID = `${SITE}/#taupo-district`;
const GOOGLE_PROFILE = "https://g.page/r/CUTDVwlL1oZeEBM";
/** The same Business Profile as a Google Maps listing link (its "cid"). */
const GOOGLE_MAPS = "https://maps.google.com/?cid=6811367104212091716";

export const businessRef = { "@id": BUSINESS_ID };
export const websiteRef = { "@id": WEBSITE_ID };
export const victoriaRef = { "@id": VICTORIA_ID };
export const mitchRef = { "@id": MITCH_ID };

/**
 * Who Balance is, in one quotable passage. Used word for word in the schema, the first home
 * FAQ and llms.txt, so every source an assistant reads says the same thing.
 */
export const ENTITY_SUMMARY =
  "Balance Electrical is an electrical business in Taupō, New Zealand, owned and run by Victoria Grant, a registered and licensed electrician (EWRB). It designs and installs electrical, lighting, air conditioning and heating, solar and battery, EV charging and smart-home systems, and carries out maintenance and repairs, for homes and businesses across the Taupō district.";
export const TEAM_SUMMARY =
  "Victoria is Director of Balance Electrical and its design lead, and works alongside Mitchell (Mitch) Pearce, Director of Balance Air Conditioning, who holds the same EWRB licence.";

export const KNOWS_ABOUT = [
  "Residential electrical installation",
  "Commercial electrical installation",
  "Electrical maintenance, fault finding and repairs",
  "Architectural lighting design",
  "Concealed LED and joinery lighting",
  "Exterior and landscape lighting",
  "New build electrical design and pre-wiring",
  "Renovation rewiring and switchboard upgrades",
  "Heat pump installation",
  "Ducted central heating and cooling",
  "Air-conditioning grilles integrated into joinery",
  "Solar panel and battery storage installation",
  "EV charger installation",
  "Smart-home lighting and climate control",
  "Emergency and exit lighting",
  "Swimming pool wiring",
];

/** Licensing is personal in New Zealand: the EWRB registers electricians, not companies. */
const EWRB_LICENCE = {
  "@type": "EducationalOccupationalCredential",
  name: "Registered and licensed electrician (New Zealand)",
  credentialCategory: "license",
  recognizedBy: {
    "@type": "Organization",
    name: "Electrical Workers Registration Board",
    alternateName: "EWRB",
    url: "https://www.ewrb.govt.nz",
  },
};

export const serviceId = (slug: string) => `${SITE}/services/${slug}#service`;
export const projectId = (slug: string) => `${SITE}/portfolio/${slug}#project`;

/**
 * Each place's Wikipedia article, so search engines know exactly which Kinloch or Wairakei
 * is meant (there are others overseas). Checked against Wikipedia, October 2026.
 */
const WIKIPEDIA: Record<string, string> = {
  taupo: "https://en.wikipedia.org/wiki/Taup%C5%8D",
  kinloch: "https://en.wikipedia.org/wiki/Kinloch,_New_Zealand",
  "acacia-bay": "https://en.wikipedia.org/wiki/Acacia_Bay",
  wairakei: "https://en.wikipedia.org/wiki/Wairakei",
  turangi: "https://en.wikipedia.org/wiki/T%C5%ABrangi",
  kuratau: "https://en.wikipedia.org/wiki/Kuratau",
  atiamuri: "https://en.wikipedia.org/wiki/%C4%80tiamuri",
  district: "https://en.wikipedia.org/wiki/Taup%C5%8D_District",
};

const DISTRICT = {
  "@type": "AdministrativeArea",
  "@id": DISTRICT_ID,
  name: "Taupō District",
  sameAs: WIKIPEDIA.district,
  containedInPlace: { "@type": "Country", name: "New Zealand" },
};

/** One place, described the same way everywhere it's used. */
export function placeNode(a: Area) {
  return {
    "@type": "Place",
    "@id": `${SITE}/areas/${a.slug}#place`,
    name: a.name,
    geo: { "@type": "GeoCoordinates", latitude: a.geo.lat, longitude: a.geo.lng },
    containedInPlace: { "@id": DISTRICT_ID },
    ...(WIKIPEDIA[a.slug] ? { sameAs: WIKIPEDIA[a.slug] } : {}),
  };
}

/** The area pages' places, the others named on the contact page, and the district. */
export const AREA_SERVED = [
  ...AREAS.map(placeNode),
  {
    "@type": "Place",
    name: "Kuratau",
    sameAs: WIKIPEDIA.kuratau,
    containedInPlace: { "@id": DISTRICT_ID },
  },
  {
    "@type": "Place",
    name: "Ātiamuri",
    sameAs: WIKIPEDIA.atiamuri,
    containedInPlace: { "@id": DISTRICT_ID },
  },
  DISTRICT,
];

/**
 * The live Google rating and reviews (when the Places lookup has them), as part of the one
 * business entity — never a second, partial copy of it. ratingCount, because Google's count
 * includes star-only ratings.
 */
function googleRating(google?: GoogleReviews) {
  if (!google?.rating || !google.count) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: google.rating,
      ratingCount: google.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: google.reviews
      .filter((r) => r.rating >= 1 && r.rating <= 5)
      .map((r) => ({
        "@type": "Review",
        reviewBody: r.text,
        author: { "@type": "Person", name: r.author },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        publisher: { "@type": "Organization", name: "Google" },
        ...(r.publishTime ? { datePublished: r.publishTime.slice(0, 10) } : {}),
      })),
  };
}

const VICTORIA = {
  "@type": "Person",
  "@id": VICTORIA_ID,
  name: "Victoria Grant",
  jobTitle: "Director, Balance Electrical",
  description:
    "Owner and Director of Balance Electrical, its design lead, and a registered and licensed electrician (EWRB). Raised in Taupō and trained in Wellington.",
  image: `${SITE}${victoriaPortrait}`,
  url: `${SITE}/about`,
  worksFor: businessRef,
  hasCredential: EWRB_LICENCE,
  knowsAbout: KNOWS_ABOUT,
};

const MITCH = {
  "@type": "Person",
  "@id": MITCH_ID,
  name: "Mitchell Pearce",
  alternateName: "Mitch Pearce",
  jobTitle: "Director, Balance Air Conditioning",
  description:
    "Director of Balance Air Conditioning and a licensed electrician (EWRB), working across electrical and air-conditioning systems with the Balance team — from high-wall heat pumps to fully ducted systems built into ceilings and joinery.",
  image: `${SITE}${mitchPortrait}`,
  url: `${SITE}/about`,
  worksFor: { "@id": AIR_CONDITIONING_ID },
  affiliation: businessRef,
  hasCredential: EWRB_LICENCE,
  knowsAbout: [
    "Heat pump installation",
    "Ducted heating and cooling",
    "Air-conditioning grilles integrated into joinery",
    "Electrical installation",
  ],
};

/**
 * The business, the people behind it, and the website — included on every page. Pages that
 * load the live Google reviews (home, about) pass them in so the rating joins the business.
 */
export function siteGraph(google?: GoogleReviews) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Electrician", "LocalBusiness"],
        "@id": BUSINESS_ID,
        name: "Balance Electrical",
        legalName: "Balance Electrical Limited",
        identifier: { "@type": "PropertyValue", propertyID: "NZBN", value: "9429050562695" },
        foundingDate: "2022-05-10",
        description: `${ENTITY_SUMMARY} ${TEAM_SUMMARY}`,
        slogan: "Electrical, lighting & air-conditioning. Considered together.",
        url: `${SITE}/`,
        email: CONTACT.email,
        telephone: CONTACT.phone,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: CONTACT.phone,
          email: CONTACT.email,
          areaServed: "NZ",
          availableLanguage: "English",
        },
        image: `${SITE}${PORTFOLIO[0].photos[0].lg}`,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE}/#logo`,
          url: `${SITE}/logo.png`,
          contentUrl: `${SITE}/logo.png`,
          width: 512,
          height: 512,
          caption: "Balance Electrical",
        },
        sameAs: [GOOGLE_PROFILE, GOOGLE_MAPS],
        hasMap: GOOGLE_PROFILE,
        // A service-area business: the town only, never a street address.
        address: {
          "@type": "PostalAddress",
          addressLocality: "Taupō",
          addressRegion: "Waikato",
          addressCountry: "NZ",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:30",
          closes: "17:30",
        },
        areaServed: AREA_SERVED,
        founder: victoriaRef,
        employee: victoriaRef,
        memberOf: {
          "@type": "Organization",
          name: "NZ Trade Group",
          url: "https://nztradegroup.co.nz/",
        },
        knowsAbout: KNOWS_ABOUT,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Electrical services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            // Named as on the service's own page, which describes it in full.
            itemOffered: {
              "@type": "Service",
              "@id": serviceId(s.slug),
              name: s.h1,
              url: `${SITE}/services/${s.slug}`,
            },
          })),
        },
        subjectOf: PORTFOLIO.filter((p) => p.story).map((p) => ({
          "@type": "CreativeWork",
          "@id": projectId(p.slug),
          name: p.title,
          url: `${SITE}/portfolio/${p.slug}`,
        })),
        ...googleRating(google),
      },
      VICTORIA,
      MITCH,
      { "@type": "Organization", "@id": AIR_CONDITIONING_ID, name: "Balance Air Conditioning" },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Balance Electrical",
        url: `${SITE}/`,
        inLanguage: "en-NZ",
        publisher: businessRef,
      },
    ],
  };
}

export function breadcrumbs(items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${path === "/" ? "" : path}`,
    })),
  };
}

export function faqPage(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** A page that lists other pages (services, projects), as an ItemList of links. */
export function collectionPage(path: string, name: string, items: [string, string][]) {
  const url = `${SITE}${path}`;
  return {
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name,
    inLanguage: "en-NZ",
    isPartOf: websiteRef,
    about: businessRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map(([itemName, itemPath], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: itemName,
        url: `${SITE}${itemPath}`,
      })),
    },
  };
}

/**
 * JSON for a <script> tag. TanStack writes head scripts unescaped, so characters that could
 * close the tag or break the line are escaped (JSON parsers read them back unchanged).
 */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function jsonLd(graph: object[]) {
  return {
    type: "application/ld+json",
    children: serializeJsonLd({ "@context": "https://schema.org", "@graph": graph }),
  };
}

/** Home page questions — shown on the page and published as FAQPage data for AI answers. */
export const HOME_FAQS: Faq[] = [
  {
    q: "Who is Balance Electrical?",
    a: `${ENTITY_SUMMARY} ${TEAM_SUMMARY}`,
  },
  {
    q: "Where are you based, and what areas do you cover?",
    a: "Balance is based in Taupō (also spelt Taupo) and works on site at homes and businesses across Taupō, Kinloch, Acacia Bay, Wairakei, Kuratau, Tūrangi, Ātiamuri and the wider Taupō district. There’s no shopfront or public street address — get in touch by phone, email or the contact page.",
  },
  {
    q: "What electrical work do you do?",
    a: "Lighting design, complete new-build installations, renovations and rewires, commercial fit-outs, heat pumps and ducted heating and cooling integrated into joinery, solar and battery storage, EV chargers, smart-home control, switchboard upgrades, and maintenance and repairs.",
  },
  {
    q: "Do you install heat pumps and air conditioning?",
    a: "Yes. High-wall and floor-mounted heat pumps, ducted heating and cooling and multi-zone systems are designed and installed, with grilles and units built into ceilings and joinery where it suits the home. Mitchell (Mitch) Pearce, Director of Balance Air Conditioning and a licensed electrician, works on these systems with the Balance team.",
  },
  {
    q: "Do you take small jobs and repairs?",
    a: "Yes. Fault finding, tripping safety switches, switchboard repairs, lighting and power faults, and ongoing maintenance for homes, rental properties and commercial buildings are a regular part of the work, alongside new builds and renovations.",
  },
  {
    q: "Are you a registered electrician?",
    a: "Yes. Victoria Grant is a registered and licensed electrician with the Electrical Workers Registration Board (EWRB), and all work is tested and certified. Mitch Pearce, Director of Balance Air Conditioning, holds the same EWRB licence.",
  },
  {
    q: "What are your hours?",
    a: "Monday to Friday, 7:30am to 5:30pm. To book a repair or ask about a fault, call Victoria on 027 916 2077.",
  },
  {
    q: "How do I get a quote?",
    a: "Send a project brief through the contact page — you can include the stage, budget, timeframe and photos or plans — or call Victoria on 027 916 2077. Victoria replies within a few days.",
  },
];
