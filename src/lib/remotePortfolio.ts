import { supabase } from "@/integrations/supabase/client";
import type { PortfolioPhoto, PortfolioProject } from "@/lib/portfolio";

const BUCKET = "Website Photos";
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nrhfbcqmfsezlkxnzshq.supabase.co";

type RemoteProjectDefinition = Omit<PortfolioProject, "photos"> & {
  folder: string;
};

const REMOTE_PROJECTS: RemoteProjectDefinition[] = [
  {
    folder: "The_Lake_House_Photos",
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
  },
  {
    folder: "Sparrowhawk_Photos",
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
  },
  {
    folder: "Mapleleaf_Photos",
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
  },
  {
    folder: "Jarden Mile",
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
  },
  {
    folder: "The Sisters",
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
  },
  {
    folder: "Curve House",
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
  },
  {
    folder: "Oakleaf",
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
  },
];

function publicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function titleFromFilename(filename: string, index: number) {
  const stem = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return stem || `Project photograph ${String(index + 1).padStart(2, "0")}`;
}

async function listFolderPhotos(folder: string): Promise<PortfolioPhoto[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data) return [];

    return data
      .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name))
      .map((file, index) => {
        const name = file.name;
        const src = publicUrl(`${folder}/${name}`);
        return {
          name: `${folder}/${name}`,
          lg: src,
          sm: src,
          w: 1600,
          h: 1067,
          title: titleFromFilename(name, index),
          caption: `${titleFromFilename(name, index)} — ${folder.replace(/_/g, " ")}.`,
        };
      });
  } catch {
    return [];
  }
}

export async function loadRemotePortfolioProjects(): Promise<PortfolioProject[]> {
  const loaded = await Promise.all(
    REMOTE_PROJECTS.map(async ({ folder, ...project }) => ({
      ...project,
      photos: await listFolderPhotos(folder),
    })),
  );
  return loaded.filter((project) => project.photos.length > 0);
}

export function mergeRemotePortfolio(
  current: PortfolioProject[],
  remote: PortfolioProject[],
): PortfolioProject[] {
  const bySlug = new Map(remote.map((project) => [project.slug, project]));
  const merged = current.map((project) => bySlug.get(project.slug) ?? project);
  const existing = new Set(current.map((project) => project.slug));
  return [...merged, ...remote.filter((project) => !existing.has(project.slug))];
}
