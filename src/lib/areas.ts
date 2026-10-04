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
    h1: "Electrician in Taupō",
    metaTitle: "Electrician Taupō | Registered Electrician Victoria Grant | Balance Electrical",
    metaDescription:
      "Registered electrician in Taupō for new builds, renovations, lighting design, heat pumps and ducted heating, solar, EV chargers and commercial work.",
    intro: [
      "Balance Electrical is based in Taupō and owner-operated by registered electrician Victoria Grant. From new homes and renovations to commercial fit-outs, every job is planned, wired and finished by the person you first spoke to.",
      "Work across Taupō ranges from lighting design and complete new-build installations to heat pumps, ducted climate systems, solar, EV charging and switchboard upgrades for existing homes and businesses.",
    ],
    projects: ["courtyard-house", "beechtree-studio", "pool-courtyard", "the-arches", "lake-house"],
    local: true,
    geo: { lat: -38.6857, lng: 176.0702 },
  },
  {
    slug: "kinloch",
    name: "Kinloch",
    h1: "Electrician in Kinloch",
    metaTitle: "Electrician Kinloch | New Builds, Lighting & Climate | Balance Electrical",
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
    metaTitle: "Electrician Acacia Bay | Lighting, Renovations & New Builds | Balance Electrical",
    metaDescription:
      "Registered electrician for Acacia Bay homes — lighting design, renovations and rewires, new builds, heat pumps and ducted heating, solar and EV chargers.",
    intro: [
      "Acacia Bay sits on the western side of the lake, a short drive from Taupō township, and Balance works on homes here regularly — from renovations and rewires to complete new-build installations.",
      "Lake-facing homes benefit from lighting that keeps the view clear after dark, and from heating and cooling designed into the joinery rather than mounted on the wall.",
    ],
    projects: ["lake-house", "glass-pavilion", "walnut-house"],
    geo: { lat: -38.7, lng: 176.0333 },
  },
  {
    slug: "wairakei",
    name: "Wairakei",
    h1: "Electrician in Wairakei",
    metaTitle: "Electrician Wairakei | Residential & Commercial Electrical | Balance Electrical",
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
    metaTitle: "Electrician Tūrangi | Electrical, Heating & Solar | Balance Electrical",
    metaDescription:
      "Electrical services for Tūrangi at the southern end of Lake Taupō — new builds, renovations, heat pumps and ducted heating, solar and EV chargers.",
    intro: [
      "At the southern end of Lake Taupō, Tūrangi is part of the wider district Balance covers, for both new builds and work on existing homes and businesses.",
      "Efficient heating is a priority through Central Plateau winters, so heat pumps, ducted systems and solar are common requests — alongside lighting, switchboard upgrades and maintenance.",
    ],
    projects: ["hillside-house", "pool-courtyard", "behind-the-walls"],
    geo: { lat: -38.9886, lng: 175.8086 },
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
