/*
  One page per place Balance works, at /areas/<slug>. Local copy stays factual: where
  the place is, the kinds of homes and work typical there, and projects nearby.
*/

export type Area = {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Portfolio projects to feature. */
  projects: string[];
  /** True when the featured projects are in this place, not just nearby examples. */
  local?: boolean;
  geo: { lat: number; lng: number };
};

export const AREAS: Area[] = [
  {
    slug: "taupo",
    name: "Taupō",
    h1: "Electrical work around Taupō township",
    metaTitle: "Electrical Work Around Taupō Township | Balance Electrical",
    metaDescription:
      "Electrical, lighting and heat-pump work in and around Taupō township (Taupo), from renovations and rewires to new builds, by electrician Victoria Grant.",
    intro: [
      "Balance Electrical is based in Taupō (Taupo) and owned by registered electrician Victoria Grant, who was raised here. Around the township and its suburbs, including Nukuhau and Rainbow Point, the work runs from renovations and rewires in existing homes to complete new-build installations, commercial fit-outs, and maintenance and repairs.",
      "Two Taupō projects show the range: The Arches, a complete renovation with a new lighting design, electrical works throughout and high-wall heat pumps, and Pool Courtyard, a new home with full lighting design, electrical installation and ducted air conditioning.",
    ],
    projects: ["the-arches", "pool-courtyard", "courtyard-house", "beechtree-studio", "lake-house"],
    local: true,
    geo: { lat: -38.6857, lng: 176.0702 },
  },
  {
    slug: "kinloch",
    name: "Kinloch",
    h1: "Electrician in Kinloch",
    metaTitle: "Electrician in Kinloch | Balance Electrical",
    metaDescription:
      "Electrical, lighting design, smart-home and climate systems for new homes and renovations in Kinloch, on the north-western shore of Lake Taupō.",
    intro: [
      "Kinloch, on the north-western shore of Lake Taupō, is home to several of Balance's most considered projects — including Cedar Gables, Balance's own showhome.",
      "Homes here are often built around the lake and the landscape, so exterior and landscape lighting, soffit and deck lighting, and climate systems that stay out of sight matter as much as the wiring inside.",
    ],
    projects: ["cedar-gables", "fold-house", "black-ridge-house", "hillside-house"],
    local: true,
    geo: { lat: -38.6667, lng: 175.9167 },
  },
  {
    slug: "acacia-bay",
    name: "Acacia Bay",
    h1: "Electrician in Acacia Bay",
    metaTitle: "Electrician in Acacia Bay | Balance Electrical",
    metaDescription:
      "Registered electrician for Acacia Bay homes — lighting design, renovations and rewires, new builds, heat pumps and ducted heating, solar and EV chargers.",
    intro: [
      "Acacia Bay sits on the western side of the lake, a short drive from Taupō township, and is part of the area Balance covers — from renovations and rewires to complete new-build installations.",
      "Lake-facing homes benefit from lighting that keeps the view clear after dark, and from heating and cooling designed into the joinery rather than mounted on the wall.",
    ],
    projects: ["lake-house", "twin-pavilions", "walnut-house"],
    geo: { lat: -38.7, lng: 176.0333 },
  },
  {
    slug: "wairakei",
    name: "Wairakei",
    h1: "Electrician in Wairakei",
    metaTitle: "Electrician in Wairakei | Balance Electrical",
    metaDescription:
      "Residential and commercial electrical in Wairakei, just north of Taupō — new builds, lighting, heat pumps, solar, EV charging and maintenance.",
    intro: [
      "Just north of Taupō township, Wairakei is a short trip for Balance — whether it's a new home, an upgrade to an existing one, or commercial electrical work.",
      "Services include complete new-build installations, lighting design, heat pumps and ducted systems, solar and EV charging, and general maintenance and fault-finding.",
    ],
    projects: ["cedar-cube-house", "black-gable-house", "courtyard-house"],
    geo: { lat: -38.6253, lng: 176.1031 },
  },
  {
    slug: "turangi",
    name: "Tūrangi",
    h1: "Electrician in Tūrangi",
    metaTitle: "Electrician in Tūrangi | Balance Electrical",
    metaDescription:
      "Electrical services for Tūrangi at the southern end of Lake Taupō — new builds, renovations, heat pumps and ducted heating, solar and EV chargers.",
    intro: [
      "At the southern end of Lake Taupō, Tūrangi is part of the wider district Balance covers, for both new builds and work on existing homes and businesses.",
      "Efficient heating matters through Central Plateau winters. Services here include heat pumps and ducted systems, solar, lighting, switchboard upgrades, and maintenance and repairs.",
    ],
    projects: ["hillside-house", "pool-courtyard", "behind-the-walls"],
    geo: { lat: -38.9886, lng: 175.8086 },
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
