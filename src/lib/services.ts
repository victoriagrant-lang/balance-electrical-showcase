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
    metaTitle: "Lighting Design Taupō | Architectural & Residential Lighting | Balance Electrical",
    metaDescription:
      "Architectural lighting design and installation in Taupō and Kinloch — concealed LED, linear and feature pendants, joinery and landscape lighting, planned with your architect and builder.",
    contactService: "Lighting design",
    intro: [
      "Lighting is the layer people feel before they notice it. Balance designs and installs lighting schemes that work with the architecture — concealed LED in ceilings and joinery, linear and feature pendants scaled to the room, and exterior lighting that carries the home into the evening.",
      "Schemes are planned around the way each space is used, from task lighting over a kitchen island to soft, low-level light for late evenings, and coordinated with the architect, builder and joiner so fittings, drivers and cabling disappear into the build.",
    ],
    includes: [
      "Lighting plans and fitting selection from the drawings",
      "Concealed LED coves, channels and joinery lighting",
      "Linear and feature pendant lighting",
      "Recessed downlights coordinated with ceiling lines",
      "Exterior, soffit, deck, step and landscape lighting",
      "Scene-based control and smart-home integration",
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
    image: img("fold-house", "07"),
  },
  {
    slug: "new-build-electrician-taupo",
    name: "New builds",
    h1: "New build electrician in Taupō",
    metaTitle: "New Build Electrician Taupō | Full Electrical Fit-Out | Balance Electrical",
    metaDescription:
      "Complete electrical for new homes in Taupō, Kinloch and the district — design, first fix at framing, fit-off, lighting, solar, EV and climate systems, tested and certified.",
    contactService: "New residential build",
    intro: [
      "Balance takes new homes from plans to power-on: pricing and design from the drawings, first-fix wiring at framing, final fit-off once linings and joinery are in, then testing and certification for code compliance.",
      "Because lighting, climate, solar, EV charging and smart-home control are planned together from the start, cabling and equipment can be hidden in the build — and the finished home works as one system.",
    ],
    includes: [
      "Electrical design and pricing from the plans",
      "Pre-wiring and first fix during framing",
      "Switchboard design and installation",
      "Final fit-off, testing and certification",
      "Lighting, climate, solar and EV charger integration",
      "Coordination with the builder and every other trade",
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
    ],
    projects: ["hillside-house", "cedar-gables", "courtyard-house", "behind-the-walls"],
    image: img("hillside-house", "01-exterior-at-dusk"),
  },
  {
    slug: "renovation-electrician-taupo",
    name: "Renovations",
    h1: "Renovation electrician in Taupō",
    metaTitle: "Renovation Electrician Taupō | Rewires & Switchboard Upgrades | Balance Electrical",
    metaDescription:
      "Rewires, additional circuits, switchboard upgrades and new lighting for renovations and additions across Taupō — planned carefully around the home you already live in.",
    contactService: "Renovation or addition",
    intro: [
      "Renovations need electrical work that's threaded carefully through an existing home. Balance plans new circuits, rewires and switchboard upgrades around the way you live, keeping disruption low and finishes tidy.",
      "It's also the moment to rethink lighting and climate: concealed LED in new joinery, a heat pump or ducted system, and the capacity for solar or EV charging later.",
    ],
    includes: [
      "Partial and full rewires",
      "Additional circuits and room additions",
      "Switchboard upgrades with modern safety switches",
      "New lighting schemes and joinery lighting",
      "Heat pump and ducted system installation",
      "Kitchen, bathroom and outdoor living upgrades",
    ],
    faqs: [
      {
        q: "Can you rewire an older home?",
        a: "Yes — from a single room to the whole house. Work is planned in stages where possible so the home stays liveable.",
      },
      {
        q: "Will I need a switchboard upgrade?",
        a: "Older switchboards often lack modern safety-switch (RCD) protection or space for new circuits. Victoria will check yours at the site visit and explain the options.",
      },
    ],
    projects: ["the-arches", "walnut-house"],
    image: img("behind-the-walls", "03-cable-drops"),
  },
  {
    slug: "commercial-electrician-taupo",
    name: "Commercial",
    h1: "Commercial electrician in Taupō",
    metaTitle:
      "Commercial Electrician Taupō | Fit-Outs, Switchboards & Lighting | Balance Electrical",
    metaDescription:
      "Commercial electrical in Taupō — office, retail and workshop fit-outs, switchboards and sub-mains, three-phase power, lighting design, heat pumps and emergency lighting.",
    contactService: "Commercial fit-out",
    intro: [
      "Electrical installations planned around your business, your premises and the people working there. Balance delivers complete commercial packages — lighting design, power and distribution, climate systems and life-safety lighting — coordinated as one installation.",
      "At Beechtree Studio's two-storey headquarters that meant architectural lighting for the client-facing spaces, high-bay lighting in the workshop, labelled sub-mains for every tenancy, heat pumps and compliant emergency lighting throughout.",
    ],
    includes: [
      "Office, retail and workshop fit-outs",
      "Main switchboards, distribution and sub-mains",
      "Three-phase power",
      "Architectural, track and high-bay lighting",
      "Exit and emergency lighting — supply, install and testing",
      "Heat pumps and data cabling",
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
    ],
    projects: ["beechtree-studio"],
    image: img("beechtree-studio", "01-front-at-dusk"),
  },
  {
    slug: "solar-installation-taupo",
    name: "Solar & battery",
    h1: "Solar installation in Taupō",
    metaTitle: "Solar Installation Taupō | Solar Panels & Battery Storage | Balance Electrical",
    metaDescription:
      "Solar panel and battery storage installation in Taupō — inverter wiring, switchboard upgrades and grid connection by a registered electrician, planned for Taupō winters.",
    contactService: "Solar & battery storage",
    intro: [
      "Solar is one of the smartest investments a Taupō homeowner can make — and getting it installed correctly from the start determines how well it performs for the next 25 years. As a registered electrician, Victoria handles the full electrical scope, from inverter wiring through to grid connection.",
      "Arrays are set out carefully on the roof, wiring is kept tidy and protected, and the switchboard is prepared for battery storage and EV charging now or later.",
    ],
    includes: [
      "Residential solar system wiring and installation",
      "Battery storage installation",
      "Grid connection and meter upgrades",
      "Switchboard upgrades for solar-ready homes",
      "Solar and EV charger combined installations",
      "New build solar pre-wiring and system inspections",
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
    metaTitle:
      "Heat Pumps & Ducted Heating Taupō | Integrated Air Conditioning | Balance Electrical",
    metaDescription:
      "Heat pumps, ducted central heating and cooling, and floor-mounted systems in Taupō — designed into your home with linear grilles and custom joinery so climate control stays out of sight.",
    contactService: "Air conditioning & heating",
    intro: [
      "Heating and cooling, designed into the home rather than hung on the wall. Balance supplies and installs high-wall and floor-mounted heat pumps, ducted central heating and cooling, and multi-zone systems from all major brands.",
      "Where it matters, the equipment disappears: ducted air is delivered through linear grilles set into ceilings and bulkheads, floor-mounted units are built into custom joinery, and grilles are coordinated with the joiner so they sit flush with the cabinetry. Controls can be brought together with lighting in a single smart-home system.",
    ],
    includes: [
      "High-wall and floor-mounted heat pumps",
      "Ducted central heating and cooling",
      "Multi-zone systems for larger homes and commercial spaces",
      "Linear grilles coordinated with ceilings and bulkheads",
      "Custom joinery grilles and heat pumps built into cabinetry",
      "Supply, installation, commissioning and servicing",
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
        a: "All major brands are supplied and installed, and Victoria will recommend a system to suit the house, the rooms and how you use them.",
      },
    ],
    projects: [
      "walnut-house",
      "cedar-gables",
      "lake-house",
      "cedar-cube-house",
      "black-ridge-house",
    ],
    image: img("walnut-house", "01-kitchen"),
  },
  {
    slug: "ev-charger-installation-taupo",
    name: "EV charging",
    h1: "EV charger installation in Taupō",
    metaTitle: "EV Charger Installation Taupō | Home & Business Chargers | Balance Electrical",
    metaDescription:
      "Home and business EV charger installation in Taupō — Level 2 wall chargers, load management and solar-ready setups, installed neatly and certified by a registered electrician.",
    contactService: "EV charging",
    intro: [
      "A dedicated wall charger installed by a registered electrician means faster charging, safer wiring and an installation that's ready for whatever you drive next.",
      "Balance assesses your supply and switchboard, positions the charger where it suits the way you park, and can pair it with solar so the car charges from your own generation.",
    ],
    includes: [
      "Level 2 home EV charger installation",
      "Supply and switchboard capacity assessment",
      "Load management",
      "Solar and EV combined installations",
      "Charging points for businesses and rental properties",
      "Certified to NZ electrical standards",
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
    name: "Smart home",
    h1: "Smart home & automation in Taupō",
    metaTitle: "Smart Home Electrician Taupō | Lighting & Climate Control | Balance Electrical",
    metaDescription:
      "Smart-home integration in Taupō — lighting scenes, heating and cooling and selected power brought together in one simple control system, planned into new builds and renovations.",
    contactService: "Something else",
    intro: [
      "Smart-home control brings lighting, heating and cooling and selected electrical functions together, so the home moves easily between everyday, entertaining and evening settings.",
      "The technology is planned in from the wiring stage and kept largely out of sight — fewer switches on the walls, clear scenes for each room, and climate that responds to the way you live. It's how Balance's own showhome, Cedar Gables, and Black Ridge House are run.",
    ],
    includes: [
      "Lighting scenes and centralised control",
      "Heating and cooling integration",
      "Selected power and electrical functions",
      "Keypads, app and voice control",
      "Pre-wiring for automation in new builds",
      "Commissioning and handover",
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
    image: img("cedar-gables", "12"),
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
