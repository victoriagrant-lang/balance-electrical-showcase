import { getPhoto } from "@/lib/portfolio";
import { serviceImage } from "@/lib/service-images";

/*
  One landing page per service at /services/<slug>, written for the people (and the AI
  assistants) searching for that service in Taupō. Each lists what's included, answers
  the common questions, and points to portfolio projects where the work can be seen.
*/

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  /** Short name used in lists and the footer. */
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** One line about the service that holds true anywhere in the district (area pages). */
  summary: string;
  /** The matching option on the contact form. */
  contactService: string;
  intro: string[];
  includes: string[];
  faqs: Faq[];
  projects: string[];
  image: { src: string; alt: string };
};

function img(slug: string, name: string) {
  const p = getPhoto(slug, name);
  return { src: p.lg, alt: `${p.title}, ${p.project}` };
}

export const SERVICES: Service[] = [
  {
    slug: "lighting-design-taupo",
    name: "Lighting design",
    h1: "Lighting design in Taupō",
    metaTitle: "Architectural Lighting Design Taupō | Balance Electrical",
    metaDescription:
      "Architectural lighting design in Taupō and Kinloch: concealed LED, pendants, joinery and landscape lighting, planned with your architect and builder.",
    summary:
      "Concealed LED, feature pendants, joinery and landscape lighting, designed around the architecture.",
    contactService: "Lighting design",
    intro: [
      "Lighting is the layer people feel before they notice it. Balance designs and installs lighting schemes that work with the architecture — concealed LED in ceilings and joinery, linear and feature pendants scaled to the room, and exterior lighting that carries the home into the evening.",
      "Schemes are planned around the way each space is used, from task lighting over a kitchen island to soft, low-level light for late evenings, and coordinated with the architect, builder and joiner so fittings, drivers and cabling disappear into the build.",
    ],
    includes: [
      "Full residential lighting design",
      "Lighting layouts and fitting selection",
      "Architectural and decorative lighting",
      "Concealed LED and linear lighting",
      "Joinery-integrated lighting",
      "Kitchen, bathroom and task lighting",
      "Feature pendants and statement fittings",
      "Exterior, deck and landscape lighting",
      "Lighting scenes and dimming control",
      "Coordination with architects, designers and joiners",
      "Smart-home lighting integration",
      "Final aiming, setup and commissioning",
    ],
    faqs: [
      {
        q: "When should lighting design start?",
        a: "Ideally at plan stage, before framing. That allows fittings, switching, drivers and concealed LED details to be coordinated with the architect, builder and joiner. Lighting can also be redesigned as part of a renovation.",
      },
      {
        q: "Do you work with architects, designers and builders?",
        a: "Yes. Victoria regularly coordinates with architects, interior designers, builders and joiners so the lighting is built into ceilings and joinery rather than added afterwards.",
      },
      {
        q: "Can lighting be set up as scenes or controlled from a phone?",
        a: "Yes. Lighting can be grouped into scenes for different times of day and controlled from keypads, an app or a smart-home system — often together with heating and cooling.",
      },
    ],
    projects: ["courtyard-house", "fold-house", "lake-house", "cedar-gables"],
    image: img("fold-house", "10"),
  },
  {
    slug: "new-build-electrician-taupo",
    name: "New builds",
    h1: "New build electrician in Taupō",
    metaTitle: "New Build Electrician Taupō | Balance Electrical",
    metaDescription:
      "Electrical for new homes and new construction in Taupō and Kinloch: design from plans, first fix at framing, fit-off, lighting, solar and EV, certified.",
    summary:
      "Complete electrical for new homes and commercial builds, from the plans to final certification.",
    contactService: "New residential build",
    intro: [
      "Balance takes new construction — new homes and commercial new builds — from plans to power-on: pricing and design from the drawings, first-fix wiring at framing, final fit-off once linings and joinery are in, then testing and certification for code compliance.",
      "Because lighting, climate, solar, EV charging and smart-home control are planned together from the start, cabling and equipment can be hidden in the build — and the finished home works as one system.",
    ],
    includes: [
      "Complete electrical design and installation",
      "Architectural lighting design and specification",
      "Smart-home and automation integration",
      "Ducted and integrated air-conditioning systems",
      "Switchboard, power and data infrastructure",
      "Exterior, landscape and feature lighting",
      "Solar, battery and EV-ready provisions",
      "Coordination with builders, architects, joiners and other trades",
      "Pre-wiring and first-fix planning before linings",
      "Final fit-off, testing and commissioning",
    ],
    faqs: [
      {
        q: "When do you get involved in a new build?",
        a: "As early as possible — ideally at plan stage to design and price the electrical, then on site for first fix at framing, and again for final fit-off once the linings and joinery are complete.",
      },
      {
        q: "Is the work certified?",
        a: "Yes. All work is carried out by a registered electrician and tested and certified, with the documentation your builder and council need.",
      },
      {
        q: "Can solar, EV charging and heating be included from the start?",
        a: "Yes, and it's the best time to do it. Cabling, switchboard capacity and equipment positions can be planned in, rather than retrofitted later.",
      },
      {
        q: "Do you wire commercial new builds as well as houses?",
        a: "Yes. Beechtree Studio, a two-storey headquarters with offices and a workshop, was a complete commercial new build — lighting design, switchboards and sub-mains, heat pumps and emergency lighting.",
      },
    ],
    projects: ["hillside-house", "cedar-gables", "courtyard-house", "behind-the-walls"],
    image: img("cedar-gables", "03-pavilions-at-dusk"),
  },
  {
    slug: "renovation-electrician-taupo",
    name: "Renovations & upgrades",
    h1: "Electrical renovations & rewiring in Taupō",
    metaTitle: "Electrical Renovations & Rewiring Taupō | Balance Electrical",
    metaDescription:
      "Electrical for renovations in Taupō: house rewiring, new circuits, switchboard upgrades and lighting, planned around the home you already live in.",
    summary:
      "House rewiring, new circuits, switchboard upgrades and lighting, threaded through an existing home.",
    contactService: "Renovation or addition",
    intro: [
      "Renovations need electrical work that's threaded carefully through an existing home. Balance handles house electrical wiring and rewiring across Taupō — from a single room to the whole house — and plans new circuits, switchboard upgrades and lighting around the way you live, keeping disruption low and finishes tidy.",
      "It's also the moment to rethink lighting and climate: concealed LED in new joinery, a heat pump or ducted system, and the capacity for solar or EV charging later. At The Arches, a complete renovation in Taupō, that meant a new lighting design, electrical works throughout and high-wall heat pumps.",
    ],
    includes: [
      "Full electrical upgrades for renovations and extensions",
      "House wiring and rewiring, from a single room to the whole home",
      "Additional circuits and power points",
      "Switchboard upgrades and safety improvements",
      "Architectural lighting design",
      "Kitchen, bathroom and joinery-integrated lighting",
      "Exterior, deck and landscape lighting",
      "High-wall and ducted air-conditioning upgrades",
      "Smart-home and automation additions",
      "Power, data and EV-ready provisions",
      "Final testing, fit-off and commissioning",
    ],
    faqs: [
      {
        q: "Can you rewire an older home?",
        a: "Yes — from a single room to the whole house. Work is planned in stages where possible so the home stays liveable.",
      },
      {
        q: "Does an older house need a full rewire?",
        a: "Not always. At the site visit Victoria checks the switchboard, safety switches and existing wiring, explains what's sound and what isn't, and gives you the options — from rewiring the rooms you're renovating to the whole house.",
      },
      {
        q: "Will I need a switchboard upgrade?",
        a: "Older switchboards often lack modern safety-switch (RCD) protection or space for new circuits. Victoria will check yours at the site visit and explain the options.",
      },
    ],
    projects: ["the-arches", "walnut-house"],
    image: img("the-arches", "01-lounge"),
  },
  {
    slug: "commercial-electrician-taupo",
    name: "Commercial",
    h1: "Commercial electrician in Taupō",
    metaTitle: "Commercial Electrical Services Taupō | Balance Electrical",
    metaDescription:
      "Commercial electrical services in Taupō: office, retail and workshop fit-outs, switchboards, sub-mains, three-phase power, lighting and emergency lighting.",
    summary:
      "Fit-outs, switchboards and sub-mains, three-phase power, lighting and emergency lighting.",
    contactService: "Commercial fit-out",
    intro: [
      "Commercial electrical services planned around your business, your premises and the people working there. Balance works with business owners, builders, developers and property managers on new builds, fit-outs, upgrades and maintenance — lighting design, power and distribution, climate systems and life-safety lighting, coordinated as one installation.",
      "At Beechtree Studio's two-storey headquarters that meant architectural lighting for the client-facing spaces, high-bay lighting in the workshop, switchboards and sub-mains serving the offices, workshop and shared areas, heat pumps and compliant emergency lighting throughout.",
    ],
    includes: [
      "Complete commercial electrical installations",
      "Office, showroom and workplace fit-outs",
      "Switchboards, distribution and sub-mains",
      "Three-phase power and equipment supplies",
      "Commercial lighting and lighting control",
      "Emergency and exit lighting",
      "Workshop and high-bay lighting",
      "Data and communications cabling",
      "Air-conditioning and mechanical electrical services",
      "Electrical upgrades and alterations",
      "Fault finding, testing and maintenance",
      "Coordination with builders and other trades",
    ],
    faqs: [
      {
        q: "What kinds of commercial projects do you take on?",
        a: "New builds and fit-outs for offices, retail, workshops and mixed-use buildings, as well as switchboard upgrades, additional circuits and maintenance for existing premises.",
      },
      {
        q: "Do you install and test emergency lighting?",
        a: "Yes. Exit and emergency lighting is supplied, installed and tested so circulation routes and exits are compliant.",
      },
      {
        q: "Do you look after existing commercial premises?",
        a: "Yes. Alongside new fit-outs, Balance carries out fault finding, testing and compliance checks, alterations, upgrades and maintenance callouts for existing commercial buildings.",
      },
    ],
    projects: ["beechtree-studio"],
    image: img("beechtree-studio", "01-front-at-dusk"),
  },
  {
    slug: "solar-installation-taupo",
    name: "Solar & battery",
    h1: "Solar installation in Taupō",
    metaTitle: "Solar & Battery Installation Taupō | Balance Electrical",
    metaDescription:
      "Solar panel and battery installation in Taupō: inverter wiring, switchboard upgrades and grid connection by a registered electrician.",
    summary:
      "Solar panels and battery storage, wired, connected and certified by a registered electrician.",
    contactService: "Solar & battery storage",
    intro: [
      "Solar is one of the smartest investments a Taupō homeowner can make — and getting it installed correctly from the start determines how well it performs for years to come. As a registered electrician, Victoria handles the full electrical scope, from inverter wiring through to grid connection.",
      "Arrays are set out carefully on the roof, wiring is kept tidy and protected, and the switchboard is prepared for battery storage and EV charging now or later.",
    ],
    includes: [
      "Residential solar system design and installation",
      "Battery storage and integration",
      "Grid connection and metering requirements",
      "Switchboard upgrades for solar-ready homes",
      "Solar and EV charger integration",
      "New-build solar pre-wiring",
      "Existing system inspections and fault finding",
      "System monitoring and commissioning",
      "Coordination with builders and roofing contractors",
    ],
    faqs: [
      {
        q: "Does solar need to be installed by a registered electrician?",
        a: "The electrical side of a solar installation must be carried out and certified by a licensed electrical worker. Victoria handles the wiring, inverter, switchboard work and sign-off.",
      },
      {
        q: "Can I add a battery later?",
        a: "Usually, yes. The system and switchboard can be set up battery-ready so storage can be added when it suits you.",
      },
      {
        q: "Do you work with solar suppliers?",
        a: "Yes. Victoria can work alongside your chosen panel supplier or recommend trusted local suppliers, while Balance handles the electrical installation, connection and certification.",
      },
    ],
    projects: ["twin-pavilions"],
    image: img("twin-pavilions", "01-array"),
  },
  {
    slug: "air-conditioning-heating-taupo",
    name: "Air conditioning & heating",
    h1: "Air conditioning & heating in Taupō",
    metaTitle: "Heat Pumps & Air Conditioning Taupō | Balance Electrical",
    metaDescription:
      "Heat pumps and ducted heating and cooling in Taupō, designed into the home with linear grilles and custom joinery so climate control stays out of sight.",
    summary:
      "Heat pumps and ducted heating and cooling, with grilles and units built into the joinery.",
    contactService: "Air conditioning & heating",
    intro: [
      "Heating and cooling, designed into the home rather than hung on the wall. Balance supplies and installs high-wall and floor-mounted heat pumps, ducted central heating and cooling, and multi-zone systems from all major brands.",
      "Where it matters, the equipment disappears: ducted air is delivered through linear grilles set into ceilings and bulkheads, floor-mounted units are built into custom joinery, and grilles are coordinated with the joiner so they sit flush with the cabinetry. Controls can be brought together with lighting in a single smart-home system.",
      "Air-conditioning work draws on Mitchell (Mitch) Pearce, Director of Balance Air Conditioning and a licensed electrician, who works across both the electrical and climate systems — from high-wall units through to fully ducted systems built into ceilings and joinery.",
    ],
    includes: [
      "Ducted whole-home air conditioning",
      "High-wall and floor-mounted heat pumps",
      "Multi-zone climate control",
      "Custom grilles integrated into joinery and ceilings",
      "Heating and cooling for new builds and renovations",
      "Residential and light-commercial systems",
      "Smart-home climate integration",
      "System design, sizing and equipment selection",
      "Supply, installation and commissioning",
      "Servicing and maintenance",
    ],
    faqs: [
      {
        q: "Should I choose a heat pump or a ducted system?",
        a: "A high-wall or floor-mounted heat pump suits a single room or open-plan area. A ducted system heats and cools several rooms from one concealed unit, with only slim grilles visible — ideal for new builds and major renovations.",
      },
      {
        q: "Can the grilles be hidden in the joinery?",
        a: "Yes. We coordinate with your joiner so linear grilles run flush through the top of cabinetry, or floor-mounted heat pumps sit inside custom units — as in Walnut House, Cedar Gables and the Lake House.",
      },
      {
        q: "Which brands do you install?",
        a: "All major brands are supplied and installed, and we'll recommend a system to suit the house, the rooms and how you use them.",
      },
    ],
    projects: [
      "walnut-house",
      "cedar-gables",
      "lake-house",
      "cedar-cube-house",
      "black-ridge-house",
    ],
    image: img("walnut-house", "02-galley"),
  },
  {
    slug: "ev-charger-installation-taupo",
    name: "EV charging",
    h1: "EV charger installation in Taupō",
    metaTitle: "EV Charger Installation Taupō | Balance Electrical",
    metaDescription:
      "EV charger installation in Taupō for homes and businesses: wall chargers, load management and solar-ready setups, certified by a registered electrician.",
    summary:
      "Home and workplace EV chargers on their own protected circuit, solar-ready where it suits.",
    contactService: "EV charging",
    intro: [
      "A dedicated wall charger installed by a registered electrician means faster charging, safer wiring and an installation that's ready for whatever you drive next.",
      "Balance assesses your supply and switchboard, positions the charger where it suits the way you park, and can pair it with solar so the car charges from your own generation.",
    ],
    includes: [
      "Residential EV charger installation",
      "Commercial and workplace charging points",
      "Electrical supply and load assessment",
      "Dedicated circuits and protection",
      "Load management solutions",
      "Switchboard upgrades where required",
      "Solar and EV charging integration",
      "Charger positioning and cable routing",
      "Installation, testing and certification",
      "Future-ready provisions for additional charging",
    ],
    faqs: [
      {
        q: "Do I need a dedicated charger, or can I use a normal socket?",
        a: "A standard socket will charge slowly and isn't designed for long daily loads. A dedicated wall charger is much faster and installed on its own protected circuit.",
      },
      {
        q: "Will my switchboard cope?",
        a: "Victoria checks your supply and switchboard first. Where capacity is tight, load management lets the charger share power safely with the rest of the house.",
      },
    ],
    projects: [],
    image: {
      src: serviceImage("ev-charging") ?? img("black-gable-house", "02-driveway-at-dusk").src,
      alt: "Wall-mounted EV charger beside a lit garage at dusk",
    },
  },
  {
    slug: "smart-home-automation-taupo",
    name: "Smart home & automation",
    h1: "Smart home & automation in Taupō",
    metaTitle: "Smart Home & Automation Taupō | Balance Electrical",
    metaDescription:
      "Smart-home control in Taupō: lighting scenes, heating and cooling and selected power in one simple system, planned into new builds and renovations.",
    summary:
      "Lighting scenes, heating and cooling and selected power brought together in one simple system.",
    contactService: "Smart home & automation",
    intro: [
      "Smart-home control brings lighting, heating and cooling and selected electrical functions together, so the home moves easily between everyday, entertaining and evening settings.",
      "The technology is planned in from the wiring stage and kept largely out of sight — fewer switches on the walls, clear scenes for each room, and climate that responds to the way you live. It's how Balance's own showhome, Cedar Gables, and Black Ridge House are run.",
    ],
    includes: [
      "Smart-home system design and integration",
      "Lighting control and scene setting",
      "Climate control integration",
      "Automated schedules and routines",
      "Centralised control of selected electrical systems",
      "App and wall-control integration",
      "Smart-home pre-wiring for new builds",
      "Integration with lighting, air conditioning and selected blinds or devices",
      "Future-ready electrical infrastructure",
      "Coordination with builders, designers and joiners",
      "System setup, testing and handover",
    ],
    faqs: [
      {
        q: "What can a smart-home system control?",
        a: "Typically lighting scenes, heating and cooling, and selected power circuits — all from keypads, an app or voice control, while conventional switches stay to a minimum.",
      },
      {
        q: "Is it only for new builds?",
        a: "It's easiest to plan at build or renovation stage when the wiring is accessible, but some systems can be added to existing homes. Victoria will advise what's practical for yours.",
      },
    ],
    projects: ["cedar-gables", "black-ridge-house"],
    image: {
      src: serviceImage("smart-home") ?? img("cedar-gables", "12").src,
      alt: "Smart-home control modules and circuit protection, neatly wired in a joinery-housed cabinet",
    },
  },
  {
    slug: "maintenance-electrician-taupo",
    name: "Maintenance & repairs",
    h1: "Maintenance electrician in Taupō",
    metaTitle: "Electrical Maintenance & Repairs Taupō | Balance Electrical",
    metaDescription:
      "Electrical maintenance and home repairs in Taupō: fault finding, tripping safety switches, switchboard, lighting and power faults for homes and businesses.",
    summary:
      "Fault finding, repairs and ongoing maintenance for homes, rental properties and businesses.",
    contactService: "Maintenance & repairs",
    intro: [
      "Faults, flickering lights and tripping safety switches are usually quick to pin down when you know where to look. Balance carries out electrical maintenance and home repairs across Taupō (Taupo) and the wider district — for homes, rental properties and commercial buildings — finding the fault, explaining it clearly and fixing it properly.",
      "Whether it's a switchboard that keeps tripping, a fitting that's stopped working, or a safety check on an older home, Victoria handles the diagnosis and the repair, and leaves the installation tested and safe.",
    ],
    includes: [
      "Fault finding and diagnosis",
      "Safety switch (RCD) testing and replacement",
      "Switchboard inspections and repairs",
      "Lighting and power point repairs and additions",
      "Tripping circuit and overload investigation",
      "Landlord and rental property electrical maintenance",
      "Fixture, fitting and appliance wiring repairs",
      "Commercial building maintenance and callouts",
      "Testing and compliance checks",
      "General maintenance callouts",
    ],
    faqs: [
      {
        q: "My safety switch keeps tripping — what should I do?",
        a: "A safety switch that trips repeatedly usually points to a real fault or an overloaded circuit. Victoria can track down the cause, fix it, and advise whether your switchboard needs upgrading.",
      },
      {
        q: "Do you take small repairs, or only larger projects?",
        a: "Both. A single fault or fitting is handled with the same care as a full installation — small maintenance jobs and callouts are a regular part of Balance's work across Taupō.",
      },
      {
        q: "What should I do about a dangerous electrical fault?",
        a: "If there's sparking, smoke, a burning smell or a power line down, keep well clear and call 111. To book a repair or ask about a fault, call Victoria on 027 916 2077, Monday to Friday, 7:30am to 5:30pm.",
      },
      {
        q: "The power is out — should I call an electrician or the power company?",
        a: "If your neighbours and the street lights are out too, it's a network outage: contact your lines company (the faults number is on your power bill) or check your power retailer's outage updates — Balance is an electrician, not a power company. If only your home, or part of it, has lost power, check the switchboard for a tripped safety switch or circuit breaker; if it won't reset or keeps tripping, call Victoria.",
      },
      {
        q: "Can you check an older home's electrical safety?",
        a: "Yes. Victoria can inspect the switchboard, safety switches and wiring, and explain what's needed to bring an older home up to a safe, compliant standard.",
      },
    ],
    projects: ["behind-the-walls", "beechtree-studio", "the-arches"],
    image: img("beechtree-studio", "09-switchboard"),
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
