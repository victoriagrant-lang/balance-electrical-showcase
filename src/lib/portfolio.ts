/*
  Project portfolio — photographs supplied by Victoria, one folder per project in
  src/assets/portfolio/<slug>/. Each photo exists as <name>-lg.webp (≤1800px) and
  <name>-sm.webp (800px); metadata is stripped so no location data is published.
  The first photo of each project is its cover.

  To add a project: drop its images into a new folder with the same naming, then add
  an entry below. Captions describe what is visible in each photograph.
*/

const files = import.meta.glob<string>("/src/assets/portfolio/**/*.webp", {
  eager: true,
  import: "default",
});

export type PortfolioPhoto = {
  name: string;
  lg: string;
  sm: string;
  w: number;
  h: number;
  title: string;
  caption: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  location: string;
  tags: string[];
  summary: string;
  /** Heading for the details list, e.g. "Lighting details" */
  detailsTitle: string;
  details: string[];
  accolade?: string;
  photos: PortfolioPhoto[];
};

function photo(
  slug: string,
  name: string,
  w: number,
  h: number,
  title: string,
  caption: string,
): PortfolioPhoto {
  const base = `/src/assets/portfolio/${slug}/${name}`;
  const lg = files[`${base}-lg.webp`];
  const sm = files[`${base}-sm.webp`];
  if (!lg || !sm) throw new Error(`Portfolio image missing: ${base}-{lg,sm}.webp`);
  return { name, lg, sm, w, h, title, caption };
}

export const PORTFOLIO: PortfolioProject[] = [
  {
    slug: "oakleaf-residence",
    title: "Oakleaf Residence",
    location: "Taupō district",
    tags: ["Residential", "New build"],
    accolade:
      "Gold Award — Master Builders House of the Year 2025, Bay of Plenty & Central Plateau",
    summary:
      "Lighting planned to complement the timber interiors and lake views of this new home. Feature pendants define the living spaces, integrated LEDs highlight the joinery, and outdoor lighting connects the courtyard and garden after dark.",
    detailsTitle: "Lighting details",
    details: [
      "Feature pendants over the living room and lounge",
      "Linear pendant lighting above the kitchen island",
      "Recessed LED line along the joinery wall",
      "Courtyard, pergola and garden lighting",
    ],
    photos: [
      photo(
        "oakleaf-residence",
        "01-courtyard-at-dusk",
        1313,
        851,
        "Courtyard at dusk",
        "Pergola and garden lighting alongside the illuminated interior.",
      ),
      photo(
        "oakleaf-residence",
        "02-living-room",
        1320,
        873,
        "Living room",
        "A drum pendant beneath the timber-lined living room ceiling.",
      ),
      photo(
        "oakleaf-residence",
        "03-kitchen",
        1320,
        878,
        "Kitchen",
        "A linear pendant over the island; stacker doors open straight onto the deck.",
      ),
      photo(
        "oakleaf-residence",
        "04-kitchen-and-dining",
        1320,
        880,
        "Kitchen & dining",
        "A long linear pendant, with a recessed LED line tracing the ceiling beside the joinery.",
      ),
      photo(
        "oakleaf-residence",
        "05-lounge",
        1320,
        876,
        "Lounge",
        "A feature pendant above the curved sofa, beneath the sloping timber ceiling.",
      ),
      photo("oakleaf-residence", "06", 1536, 1024, "", ""),
      photo("oakleaf-residence", "07", 1536, 1024, "", ""),
    ],
  },
  {
    slug: "the-curve-house",
    title: "The Curve House",
    location: "Kinloch",
    tags: ["Residential", "New build"],
    summary:
      "Lighting follows the distinctive curves of this Kinloch home. Continuous LED lines highlight the deck, hallway and staircase, while feature pendants and concealed ceiling lighting give each interior space its own character.",
    detailsTitle: "Lighting details",
    details: [
      "LED line following the curved deck soffit",
      "Recessed LED channel along the hallway ceiling",
      "Linear lighting tracing the stair",
      "Cove lighting to the raked living-room ceiling",
    ],
    photos: [
      photo(
        "the-curve-house",
        "01-curved-deck-at-dusk",
        1320,
        1320,
        "Curved deck at dusk",
        "An LED line traces the sweep of the soffit around the deck.",
      ),
      photo(
        "the-curve-house",
        "02-aerial-at-sunset",
        1320,
        1315,
        "Aerial at sunset",
        "The Curve House above the lake and the golf course.",
      ),
      photo(
        "the-curve-house",
        "03-kitchen-and-dining",
        1320,
        1317,
        "Kitchen & dining",
        "An elliptical dining pendant and linear lighting above the kitchen island.",
      ),
      photo(
        "the-curve-house",
        "04-open-plan-living",
        1800,
        1350,
        "Open-plan living",
        "Concealed lighting along the sloping ceiling, with downlights over the island.",
      ),
      photo(
        "the-curve-house",
        "05-hallway",
        1350,
        1800,
        "Hallway",
        "A recessed LED channel runs the length of the ceiling beside the smoked-glass wall.",
      ),
      photo(
        "the-curve-house",
        "06-stair",
        1800,
        1350,
        "Stair",
        "An LED line follows the stair's profile above floating timber treads.",
      ),
      photo("the-curve-house", "07", 1536, 1024, "", ""),
      photo("the-curve-house", "08", 1536, 1024, "", ""),
      photo("the-curve-house", "09", 1536, 1024, "", ""),
      photo("the-curve-house", "10", 1024, 1536, "", ""),
    ],
  },
  {
    slug: "beechtree-building-headquarters",
    title: "Beechtree Building Headquarters",
    location: "Taupō district",
    tags: ["Commercial", "New build"],
    summary:
      "A complete electrical installation for a two-storey commercial headquarters, covering offices, a workshop and shared spaces. The work combines switchboards and distribution cabling with practical workplace lighting, stairwell pendants and illuminated handrails.",
    detailsTitle: "Electrical scope",
    details: [
      "Soffit downlights and wall washers across the glazed frontage",
      "Glass pendant cluster through the double-height stairwell",
      "LED concealed beneath the timber handrails",
      "Track lighting to the offices, high-bays in the workshop",
      "Main switchboard, cable ladder and labelled sub-mains",
    ],
    photos: [
      photo(
        "beechtree-building-headquarters",
        "01-front-at-dusk",
        1320,
        1324,
        "Front at dusk",
        "Soffit downlights and ground-level wall washers light the glazed two-storey frontage.",
      ),
      photo(
        "beechtree-building-headquarters",
        "02-entry-at-dusk",
        1041,
        1510,
        "Entry at dusk",
        "The glazed entry at dusk, with the lit stair visible behind the glass.",
      ),
      photo(
        "beechtree-building-headquarters",
        "03-stairwell-pendants",
        1086,
        1448,
        "Stairwell",
        "A cluster of glass pendants drops through the double-height stairwell.",
      ),
      photo(
        "beechtree-building-headquarters",
        "04-stair-from-above",
        1086,
        1448,
        "Stair from above",
        "Pendants overhead and LED beneath both handrails, looking down the stair.",
      ),
      photo(
        "beechtree-building-headquarters",
        "05-lit-handrail",
        1041,
        1511,
        "Lit handrail",
        "LED lighting beneath the timber handrail illuminates the stair treads.",
      ),
      photo(
        "beechtree-building-headquarters",
        "06-office",
        1451,
        1084,
        "Office",
        "Black track lighting frames the office, with full-height glazing to the street.",
      ),
      photo(
        "beechtree-building-headquarters",
        "07-open-office",
        1448,
        1086,
        "Open-plan office",
        "Track lighting follows the ceiling line of the open-plan office.",
      ),
      photo(
        "beechtree-building-headquarters",
        "08-workshop",
        1086,
        1448,
        "Workshop",
        "High-bay pendants light the workshop beside its roller door.",
      ),
      photo(
        "beechtree-building-headquarters",
        "09-switchboard",
        1086,
        1448,
        "Switchboard",
        "The main switchboard, with cable ladder rising through the riser.",
      ),
      photo(
        "beechtree-building-headquarters",
        "10-sub-mains",
        1041,
        1511,
        "Sub-mains",
        "Sub-main conduits labelled for each office, workshop and incoming supply.",
      ),
      photo(
        "beechtree-building-headquarters",
        "11-on-site",
        1086,
        1448,
        "On site",
        "The Balance van on site at the finished building.",
      ),
    ],
  },
  {
    slug: "sparrowhawk",
    title: "Sparrowhawk",
    location: "Kinloch",
    tags: ["Residential", "New build"],
    summary:
      "Exterior lighting connects the separate pavilions of this hillside home in Kinloch. Concealed LEDs beneath the deck seating, deck-edge lighting and sheltered courtyard lighting extend the living spaces into the evening.",
    detailsTitle: "Lighting details",
    details: [
      "Concealed LED beneath the built-in deck seating",
      "Deck-edge lighting around the pavilions",
      "Soffit lighting to the sheltered courtyard",
      "Interior lighting across the living spaces",
    ],
    photos: [
      photo(
        "sparrowhawk",
        "01-at-dusk",
        1800,
        1200,
        "At dusk",
        "Interior and deck-edge lighting across the pavilions at dusk.",
      ),
      photo(
        "sparrowhawk",
        "02-deck-at-sunset",
        1800,
        1201,
        "Deck at sunset",
        "Concealed LED lighting beneath the built-in deck seating.",
      ),
      photo(
        "sparrowhawk",
        "03-pavilions-at-dusk",
        1800,
        1348,
        "Pavilions from above",
        "The illuminated pavilions viewed from the hillside at dusk.",
      ),
      photo(
        "sparrowhawk",
        "04-courtyard-at-dusk",
        1800,
        1200,
        "Courtyard at dusk",
        "Lighting around the sheltered courtyard between the pavilions.",
      ),
      photo("sparrowhawk", "05", 1800, 1201, "", ""),
      photo("sparrowhawk", "06", 1800, 1201, "", ""),
      photo("sparrowhawk", "07", 1800, 1201, "", ""),
      photo("sparrowhawk", "08", 1800, 1201, "", ""),
      photo("sparrowhawk", "09", 1800, 1201, "", ""),
      photo("sparrowhawk", "10", 1800, 1201, "", ""),
      photo("sparrowhawk", "11", 1800, 1201, "", ""),
      photo("sparrowhawk", "12", 1800, 1201, "", ""),
      photo("sparrowhawk", "13", 1800, 1201, "", ""),
      photo("sparrowhawk", "14", 1800, 1201, "", ""),
      photo("sparrowhawk", "15", 1800, 1201, "", ""),
      photo("sparrowhawk", "16", 1800, 1201, "", ""),
      photo("sparrowhawk", "17", 1800, 1189, "", ""),
      photo("sparrowhawk", "18", 1800, 1189, "", ""),
    ],
  },
  {
    slug: "the-kinloch-retreat",
    title: "The Kinloch Retreat",
    location: "Kinloch",
    tags: ["Residential", "New build"],
    summary:
      "Lighting integrated with the timber architecture of a Kinloch home. Recessed downlights provide general illumination, concealed LEDs light the kitchen joinery, and soffit lighting defines the covered entrance.",
    detailsTitle: "Lighting details",
    details: [
      "Soffit lighting along the covered entry",
      "Downlights set into timber-lined ceilings",
      "Warm LED concealed above the kitchen joinery",
    ],
    photos: [
      photo(
        "the-kinloch-retreat",
        "01-exterior",
        1320,
        1175,
        "Exterior",
        "Dark timber cladding set among native tussock.",
      ),
      photo(
        "the-kinloch-retreat",
        "02-entry",
        1320,
        887,
        "Entry",
        "Soffit lighting leads the way along the covered path.",
      ),
      photo(
        "the-kinloch-retreat",
        "03-kitchen",
        1320,
        889,
        "Kitchen",
        "Downlights set into the timber-lined ceiling, with warm LED concealed above the joinery.",
      ),
      photo(
        "the-kinloch-retreat",
        "04-kitchen-to-living",
        1320,
        896,
        "Kitchen to living",
        "The timber ceiling carries through, lit by a line of downlights.",
      ),
    ],
  },
  {
    slug: "kinloch-project",
    title: "Kinloch Project",
    location: "Kinloch",
    tags: ["Residential", "New build"],
    summary:
      "A new home followed from framing through to the finished electrical installation. Exterior downlights, wall fittings and low-level deck lighting illuminate the entrance and outdoor spaces while complementing the cedar cladding.",
    detailsTitle: "Lighting details",
    details: [
      "Soffit downlights over the entry and around the house",
      "Wall lights flanking the doors and glazing",
      "Step lights set into the deck and planting",
      "Wired from framing through to final fit-off",
    ],
    photos: [
      photo(
        "kinloch-project",
        "01-exterior-at-dusk",
        1800,
        1200,
        "Exterior at dusk",
        "Soffit downlights around the exterior of the cedar-clad home.",
      ),
      photo(
        "kinloch-project",
        "02-deck-at-dusk",
        1800,
        1359,
        "Deck at dusk",
        "Wall lights flank the stacker doors; small lights glow in the deck.",
      ),
      photo(
        "kinloch-project",
        "03-entry-at-dusk",
        1200,
        1800,
        "Entry at dusk",
        "Soffit downlights, a wall light and low garden lights lead to the door.",
      ),
      photo(
        "kinloch-project",
        "04-front-door",
        1200,
        1800,
        "Front door",
        "Downlights in the soffit wash the entry and the copper-toned door.",
      ),
      photo(
        "kinloch-project",
        "05-step-light",
        1200,
        1800,
        "Step light",
        "A low-level step light beside the garden planting.",
      ),
      photo(
        "kinloch-project",
        "06-entry-by-day",
        1800,
        1200,
        "Entry by day",
        "Cedar, concrete and the lake reflected in the glass.",
      ),
      photo(
        "kinloch-project",
        "07-during-the-build",
        1200,
        1800,
        "During the build",
        "The same house at framing stage, before the linings went on.",
      ),
    ],
  },
  {
    slug: "the-lakehouse",
    title: "The Lakehouse",
    location: "Taupō district",
    tags: ["Residential"],
    summary:
      "Concealed lighting brings out the warmth of this home’s cedar ceilings and oak floors. LEDs run along the ceiling coves and beneath the kitchen island, complemented by small downlights and spotlights in the garden.",
    detailsTitle: "Lighting details",
    details: [
      "Concealed LED cove along the cedar ceilings",
      "LED line beneath the kitchen island",
      "Pinpoint downlights in the cedar soffit",
      "Garden spotlights in the planting",
    ],
    photos: [
      photo(
        "the-lakehouse",
        "01-island",
        1800,
        1200,
        "Kitchen island",
        "Concealed LED lighting beneath the kitchen island illuminates the oak floor.",
      ),
      photo(
        "the-lakehouse",
        "02-cedar-ceiling",
        1800,
        1200,
        "Cedar ceiling",
        "Concealed LED lights the cedar-lined ceiling above the sheer curtains.",
      ),
      photo(
        "the-lakehouse",
        "03-gallery",
        1200,
        1800,
        "Gallery",
        "An LED cove runs the length of the glazed gallery beneath the cedar ceiling.",
      ),
      photo(
        "the-lakehouse",
        "04-hallway",
        1198,
        1800,
        "Hallway",
        "Pinpoint downlights in the cedar soffit lead into the lit gallery.",
      ),
      photo(
        "the-lakehouse",
        "05-garden-light",
        1800,
        1200,
        "Garden light",
        "A spike spotlight set in the planting beside the deck.",
      ),
      photo("the-lakehouse", "06", 1139, 756, "", ""),
      photo("the-lakehouse", "07", 1137, 761, "", ""),
      photo("the-lakehouse", "08", 1134, 1710, "", ""),
      photo("the-lakehouse", "09", 1169, 1755, "", ""),
      photo("the-lakehouse", "10", 1124, 1694, "", ""),
      photo("the-lakehouse", "11", 1800, 1384, "", ""),
      photo("the-lakehouse", "12", 1800, 1200, "", ""),
      photo("the-lakehouse", "13", 1800, 1436, "", ""),
      photo("the-lakehouse", "14", 1200, 1800, "", ""),
      photo("the-lakehouse", "15", 1200, 1800, "", ""),
      photo("the-lakehouse", "16", 1200, 1800, "", ""),
      photo("the-lakehouse", "17", 1200, 1800, "", ""),
      photo("the-lakehouse", "18", 1200, 1800, "", ""),
      photo("the-lakehouse", "19", 1800, 1200, "", ""),
      photo("the-lakehouse", "20", 1800, 1200, "", ""),
      photo("the-lakehouse", "21", 1800, 1200, "", ""),
    ],
  },
  {
    slug: "mapleleaf",
    title: "Mapleleaf",
    location: "Taupō district",
    tags: ["Residential"],
    summary:
      "A considered electrical and lighting installation shaped around the home, its materials and the way each space is used.",
    detailsTitle: "Project details",
    details: [
      "Lighting planned around the architecture",
      "Thoughtful placement of power and controls",
      "Warm, practical illumination throughout the home",
    ],
    photos: [
      photo("mapleleaf", "01", 1448, 1086, "", ""),
      photo("mapleleaf", "02", 1545, 1018, "", ""),
      photo("mapleleaf", "03", 1533, 1026, "", ""),
      photo("mapleleaf", "04", 1537, 1023, "", ""),
    ],
  },
  {
    slug: "pukeko",
    title: "Pūkeko",
    location: "Taupō district",
    tags: ["Residential"],
    summary:
      "A coordinated lighting scheme for the home and garden. Tree uplights and soffit fittings highlight the exterior, while kitchen pendants, track lighting and downlights provide lighting throughout the interior.",
    detailsTitle: "Lighting details",
    details: [
      "Uplights to the trees and planting",
      "Soffit lighting along the eaves and garage",
      "Linear pendant over the kitchen island",
      "Cylinder pendants and downlights through the living areas",
    ],
    photos: [
      photo(
        "pukeko",
        "01-front-at-dusk",
        1448,
        1086,
        "Front at dusk",
        "Uplights illuminate the trees, with soffit lighting along the eaves.",
      ),
      photo(
        "pukeko",
        "02-driveway-at-dusk",
        1448,
        1086,
        "Driveway at dusk",
        "Soffit lights wash the garage doors, with garden lights along the drive.",
      ),
      photo(
        "pukeko",
        "03-garden-at-dusk",
        1448,
        1086,
        "Garden at dusk",
        "Garden uplights and soffit lighting along the front of the property.",
      ),
      photo(
        "pukeko",
        "04-kitchen",
        1320,
        1043,
        "Kitchen",
        "A slim linear pendant over the black island, with downlights set evenly across the ceiling.",
      ),
      photo(
        "pukeko",
        "05-kitchen-and-dining",
        1320,
        867,
        "Kitchen & dining",
        "The linear pendant follows the island; a black track picks out the kitchen beyond.",
      ),
      photo(
        "pukeko",
        "06-dining-and-living",
        1320,
        877,
        "Dining & living",
        "Black cylinder pendants and downlights through the open-plan dining and living.",
      ),
      photo(
        "pukeko",
        "07-living-room",
        1320,
        972,
        "Living room",
        "Downlights around the timber-panelled fireplace wall.",
      ),
      photo(
        "pukeko",
        "08-ensuite",
        1310,
        870,
        "Ensuite",
        "Downlights over the walk-in shower, with a glass pendant beside the round mirror.",
      ),
      photo(
        "pukeko",
        "09-bathroom",
        1320,
        873,
        "Bathroom",
        "Downlights over the tiled shower and oak vanity.",
      ),
    ],
  },
  {
    slug: "jarden-mile",
    title: "Jarden Mile",
    location: "Taupō",
    tags: ["Residential", "Pool", "Air-Conditioning"],
    summary:
      "Electrical work spanning pool wiring, air-conditioning, ducted heating and feature lighting. The installation includes lights within the entrance pavers, an LED strip above the garage and wall fittings along the frontage, with integrated lighting in the bathrooms.",
    detailsTitle: "Electrical scope",
    details: [
      "Swimming pool wiring",
      "Air-conditioning installation",
      "Ducted heating throughout the home",
      "Lights set into the stepping-stone pavers",
      "LED strip above the garage door; up/down wall lights",
    ],
    photos: [
      photo(
        "jarden-mile",
        "02-front-by-day",
        720,
        479,
        "Front by day",
        "Lights set into the stepping-stone pavers, an LED strip over the garage door and up/down wall lights, seen here by day.",
      ),
      photo(
        "jarden-mile",
        "03-lap-pool",
        720,
        479,
        "Lap pool",
        "The lap pool, with electrical connections for its pump and equipment.",
      ),
      photo(
        "jarden-mile",
        "04-entry-and-hall",
        720,
        524,
        "Entry & hall",
        "A wire-frame pendant in the high-ceilinged entrance, looking through to the hallway.",
      ),
      photo(
        "jarden-mile",
        "05-bedroom",
        720,
        479,
        "Bedroom",
        "Recessed downlights in the bedroom and through to the ensuite.",
      ),
      photo(
        "jarden-mile",
        "06-shower-niche",
        720,
        479,
        "Shower niche",
        "LED tucked into the tiled shower niche.",
      ),
      photo(
        "jarden-mile",
        "07-ensuite",
        720,
        479,
        "Ensuite",
        "An LED line along the ceiling edge and a lit niche in the ensuite.",
      ),
    ],
  },
  {
    slug: "the-sisters",
    title: "The Sisters",
    location: "Taupō district",
    tags: ["Residential", "Solar"],
    summary:
      "Solar installation and interior lighting for a lakefront home. Rooftop panels are arranged across several standing-seam roof sections, while pendants and downlights serve the open-plan kitchen, dining and living areas.",
    detailsTitle: "Project highlights",
    details: [
      "Solar array across several roof planes",
      "Mounting rails fixed to the standing seams",
      "Pendants over the kitchen island and dining table",
      "Downlights throughout the open-plan living",
    ],
    photos: [
      photo(
        "the-sisters",
        "05-exterior",
        1274,
        1305,
        "Exterior",
        "The living wing opens fully to the deck and lawn.",
      ),
      photo(
        "the-sisters",
        "01-array",
        1800,
        1350,
        "Array",
        "Solar panels installed along the sloping roof, overlooking the lake.",
      ),
      photo(
        "the-sisters",
        "02-rooftops",
        1800,
        1350,
        "Rooftops",
        "Arrays across the black standing-seam roofs.",
      ),
      photo(
        "the-sisters",
        "06-living-room",
        1305,
        1310,
        "Living room",
        "Recessed downlights above the living room, which opens onto the lakefront deck.",
      ),
      photo(
        "the-sisters",
        "07-living-and-dining",
        1320,
        1327,
        "Living & dining",
        "Pendants over the dining table, with the lake framed beyond.",
      ),
      photo(
        "the-sisters",
        "08-kitchen",
        1298,
        1316,
        "Kitchen",
        "A slim linear pendant hung over the island, with downlights beyond.",
      ),
      photo(
        "the-sisters",
        "03-courtyard-wing",
        1800,
        1350,
        "Courtyard wing",
        "The array continues over the roof of the courtyard wing.",
      ),
      photo(
        "the-sisters",
        "04-rails-set-out",
        1012,
        1800,
        "Rails set out",
        "Mounting rails fixed to the standing seams ahead of the panels.",
      ),
      photo("the-sisters", "09", 1536, 1024, "", ""),
      photo("the-sisters", "10", 1536, 1024, "", ""),
      photo("the-sisters", "11", 1536, 1024, "", ""),
    ],
  },
  {
    slug: "the-bach",
    title: "The Bach",
    location: "Taupō district",
    tags: ["Residential"],
    summary:
      "Lighting integrated into the joinery of a holiday home. LEDs beneath shelves illuminate the kitchen surfaces, a red pendant defines the island, and concealed lighting along the bedhead provides a softer setting in the bedroom.",
    detailsTitle: "Lighting details",
    details: [
      "LED concealed beneath the joinery shelves",
      "Red linear pendant over the island",
      "LED ledge lighting in the bedroom",
      "Recessed downlights along the hall",
    ],
    photos: [
      photo(
        "the-bach",
        "01-kitchen",
        1086,
        1448,
        "Kitchen",
        "A red linear pendant over the island; LED lights the shelf above the bench.",
      ),
      photo(
        "the-bach",
        "02-galley",
        1086,
        1448,
        "Galley",
        "LED beneath the shelf lights the stone splashback in dark-timber joinery.",
      ),
      photo(
        "the-bach",
        "03-hall",
        1086,
        1448,
        "Hall",
        "The joinery runs the length of the hall, its shelf traced with LED.",
      ),
      photo(
        "the-bach",
        "04-bedroom",
        1448,
        1086,
        "Bedroom",
        "Concealed LED lighting along the bedhead ledge.",
      ),
    ],
  },
  {
    slug: "rainbow-reno",
    title: "Rainbow Reno",
    location: "Taupō",
    tags: ["Residential", "Renovation"],
    summary:
      "Lighting and air-conditioning upgrades as part of a holiday home renovation. The work includes illuminated display niches, kitchen track lighting and wall and step lights for the courtyard and covered deck.",
    detailsTitle: "Project highlights",
    details: [
      "LED to the arched display niches",
      "Track spotlights over the kitchen",
      "Air-conditioning installation",
      "Wall and step lighting to the deck and courtyard",
    ],
    photos: [
      photo(
        "rainbow-reno",
        "01-lounge",
        1320,
        881,
        "Lounge",
        "LED lights the arched niches either side of the fireplace and TV wall.",
      ),
      photo(
        "rainbow-reno",
        "02-kitchen",
        1320,
        892,
        "Kitchen",
        "Track spotlights over the curved kitchen and a wall-mounted air-conditioning unit.",
      ),
      photo(
        "rainbow-reno",
        "03-courtyard-at-dusk",
        1320,
        888,
        "Courtyard at dusk",
        "Wall lights and step lights guide the way across the courtyard.",
      ),
      photo(
        "rainbow-reno",
        "04-covered-deck",
        1320,
        899,
        "Covered deck",
        "Wall lights under the veranda and step lights set into the deck edge.",
      ),
    ],
  },
  {
    slug: "pre-wires",
    title: "Pre-wires",
    location: "Taupō district",
    tags: ["New build", "Pre-wiring"],
    summary:
      "The electrical installation begins before the wall and ceiling linings go on. These photographs show cable routes through the framing, organised drops for fittings and wiring prepared for the next stage of the build.",
    detailsTitle: "Project highlights",
    details: [
      "Cable runs planned and clipped along the joists",
      "Bundled drops through the wall framing",
      "Loops kept clear of openings and arches",
      "Pre-wiring before wall and ceiling linings",
    ],
    photos: [
      photo(
        "pre-wires",
        "01-ceiling-runs",
        1440,
        961,
        "Ceiling runs",
        "Cable runs clipped neatly along the joists before the ceiling goes on.",
      ),
      photo(
        "pre-wires",
        "02-first-fix",
        1350,
        1800,
        "Pre-wiring",
        "Electrical cabling through the framing of a two-storey build.",
      ),
      photo(
        "pre-wires",
        "03-cable-drops",
        1350,
        1800,
        "Cable drops",
        "Cable drops grouped along the framing for the later installation of fittings.",
      ),
      photo(
        "pre-wires",
        "04-arched-opening",
        1350,
        1800,
        "Arched opening",
        "Cables looped clear of an arched opening in the framing.",
      ),
    ],
  },
];

/** Look up one portfolio photo by file name, e.g. getPhoto("oakleaf-residence", "02-living-room"). */
export function getPhoto(slug: string, name: string): PortfolioPhoto & { project: string } {
  const project = PORTFOLIO.find((p) => p.slug === slug);
  const found = project?.photos.find((ph) => ph.name === name);
  if (!project || !found) throw new Error(`No portfolio photo ${slug}/${name}`);
  return { ...found, project: project.title };
}

/*
  Gallery filters use a project's tags, except where one photo shows a different
  kind of work from the rest of its project (e.g. the solar array vs the house).
*/
const PHOTO_TAGS: Record<string, string[]> = {
  "the-sisters/01-array": ["Solar"],
  "the-sisters/02-rooftops": ["Solar"],
  "the-sisters/03-courtyard-wing": ["Solar"],
  "the-sisters/04-rails-set-out": ["Solar"],
  "the-sisters/05-exterior": ["Residential"],
  "the-sisters/06-living-room": ["Residential"],
  "the-sisters/07-living-and-dining": ["Residential"],
  "the-sisters/08-kitchen": ["Residential"],
  "jarden-mile/02-front-by-day": ["Residential"],
  "jarden-mile/03-lap-pool": ["Pool"],
  "jarden-mile/04-entry-and-hall": ["Residential", "Air-Conditioning"],
  "jarden-mile/05-bedroom": ["Residential", "Air-Conditioning"],
  "jarden-mile/06-shower-niche": ["Residential", "Air-Conditioning"],
  "jarden-mile/07-ensuite": ["Residential", "Air-Conditioning"],
  "rainbow-reno/02-kitchen": ["Residential", "Renovation", "Air-Conditioning"],
  "kinloch-project/07-during-the-build": ["New build", "Pre-wiring"],
};

export function photoTags(project: PortfolioProject, photo: PortfolioPhoto): string[] {
  return PHOTO_TAGS[`${project.slug}/${photo.name}`] ?? project.tags;
}

export const PORTFOLIO_PHOTO_COUNT = PORTFOLIO.reduce((n, p) => n + p.photos.length, 0);
