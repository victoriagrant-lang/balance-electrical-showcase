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
