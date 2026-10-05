import { AREAS } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES, type Faq } from "@/lib/services";

/*
  Structured data (schema.org JSON-LD) shared across the site. Search engines and AI
  assistants read this to understand who Balance is, what it does, where, and who runs it.
  Everything here must stay factual — it is quoted back to people as an answer.
*/

export const SITE = "https://www.balanceelectrical.co.nz";
const BUSINESS_ID = `${SITE}/#business`;
const PERSON_ID = `${SITE}/#victoria`;
const WEBSITE_ID = `${SITE}/#website`;

export const businessRef = { "@id": BUSINESS_ID };

export const KNOWS_ABOUT = [
  "Residential electrical installation",
  "Commercial electrical installation",
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

const PLACES = AREAS.map((a) => ({
  "@type": "Place",
  name: `${a.name}, New Zealand`,
  url: `${SITE}/areas/${a.slug}`,
}));

/** The business, the person behind it, and the website — included on every page. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Electrician", "LocalBusiness"],
        "@id": BUSINESS_ID,
        name: "Balance Electrical",
        legalName: "Balance Electrical Ltd",
        description:
          "Owner-operated registered electrician in Taupō, New Zealand, led by Victoria Grant. Electrical design and installation for new homes, renovations and commercial buildings, with architectural lighting design, heat pumps and ducted heating and cooling integrated into joinery, solar and battery storage, EV chargers and smart-home control.",
        slogan: "Electrical, lighting & air-conditioning. Considered together.",
        url: SITE,
        email: CONTACT.email,
        telephone: CONTACT.phone,
        image: `${SITE}${PORTFOLIO[0].photos[0].lg}`,
        logo: `${SITE}/favicon.svg`,
        alternateName: [
          "Balance Electrical Taupō",
          "Balance Electrical Taupo",
          "Balance Electrical Ltd",
        ],
        sameAs: ["https://g.page/r/CUTDVwlL1oZeEBM"],
        hasMap: "https://g.page/r/CUTDVwlL1oZeEBM",
        keywords:
          "electrician Taupō, Taupo electrician, registered electrician Taupo, electrician Kinloch, lighting design Taupo, heat pumps Taupo, ducted heating Taupo, solar installation Taupo, EV charger installation Taupo, commercial electrician Taupo",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Taupō",
          addressRegion: "Waikato",
          addressCountry: "NZ",
        },
        geo: { "@type": "GeoCoordinates", latitude: -38.6857, longitude: 176.0702 },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:30",
          closes: "17:30",
        },
        areaServed: [
          ...PLACES,
          { "@type": "AdministrativeArea", name: "Taupō District, New Zealand" },
        ],
        founder: { "@id": PERSON_ID },
        employee: { "@id": PERSON_ID },
        knowsAbout: KNOWS_ABOUT,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Registered Electrician",
          recognizedBy: {
            "@type": "Organization",
            name: "Electrical Workers Registration Board (EWRB)",
            url: "https://www.ewrb.govt.nz",
          },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Electrical services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.metaDescription,
              url: `${SITE}/services/${s.slug}`,
            },
          })),
        },
        subjectOf: PORTFOLIO.filter((p) => p.story).map((p) => ({
          "@type": "CreativeWork",
          name: p.title,
          url: `${SITE}/portfolio/${p.slug}`,
        })),
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Victoria Grant",
        jobTitle: "Owner and Registered Electrician",
        worksFor: { "@id": BUSINESS_ID },
        url: `${SITE}/about`,
        knowsAbout: KNOWS_ABOUT,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Registered Electrician (EWRB, New Zealand)",
        },
        homeLocation: { "@type": "Place", name: "Taupō, New Zealand" },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Balance Electrical",
        url: SITE,
        inLanguage: "en-NZ",
        publisher: { "@id": BUSINESS_ID },
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

export function jsonLd(graph: object[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
  };
}

/** Home page questions — shown on the page and published as FAQPage data for AI answers. */
export const HOME_FAQS: Faq[] = [
  {
    q: "Who is Balance Electrical?",
    a: "Balance Electrical is an owner-operated electrical business in Taupō, New Zealand, run by registered electrician Victoria Grant. The person who quotes your job is the person who plans and carries out the work.",
  },
  {
    q: "What areas do you cover?",
    a: "Taupō, Kinloch, Acacia Bay, Wairakei, Tūrangi and the wider Taupō district, for both homes and businesses.",
  },
  {
    q: "What electrical work do you do?",
    a: "Lighting design, complete new-build installations, renovations and rewires, commercial fit-outs, heat pumps and ducted heating and cooling integrated into joinery, solar and battery storage, EV chargers, smart-home control, switchboard upgrades and maintenance.",
  },
  {
    q: "Are you a registered electrician?",
    a: "Yes. Victoria Grant is a registered electrician with the Electrical Workers Registration Board (EWRB), and all work is tested and certified.",
  },
  {
    q: "How do I get a quote?",
    a: "Send a project brief through the contact page — you can include the stage, budget, timeframe and photos or plans — or call Victoria on 027 916 2077. Victoria replies within a few days.",
  },
];
