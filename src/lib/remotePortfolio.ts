import { supabase } from "@/integrations/supabase/client";
import type { PortfolioPhoto, PortfolioProject } from "@/lib/portfolio";

const BUCKET = "Website Photos";
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nrhfbcqmfsezlkxnzshq.supabase.co";

/** A hand-written caption for one uploaded file, matched by its exact file name. */
type RemotePhotoSpec = {
  file: string;
  title: string;
  caption: string;
  /** Intrinsic size, used to reserve the right space and avoid layout shift. */
  w?: number;
  h?: number;
};

type RemoteProjectDefinition = Omit<PortfolioProject, "photos"> & {
  folder: string;
  /**
   * Optional. The files to publish, in the order they should appear (the first
   * is the project cover), each with the caption shown beneath it. Uploads that
   * aren't listed are appended afterwards with a caption taken from the file
   * name, so a new photo never disappears just because it lacks a caption yet.
   */
  photos?: RemotePhotoSpec[];
};

/*
  Only projects that do NOT already exist in src/lib/portfolio.ts belong here.

  The curated entries in portfolio.ts are the source of truth: they carry the
  hand-written captions, the chosen photo order and the resized WebP files. A
  Supabase folder can therefore only ADD a project — it never replaces one of
  those entries (see mergeRemotePortfolio). Keeping this list to genuinely new
  projects also avoids listing the same folders on every page load.
*/
const REMOTE_PROJECTS: RemoteProjectDefinition[] = [
  {
    folder: "Mapleleaf_Photos",
    slug: "mapleleaf",
    title: "Mapleleaf",
    location: "Taupō district",
    tags: ["Residential", "New build"],
    summary:
      "Lighting built around the shape of this new home: wall lights graze the pale brick, warm interior light spills onto the deck, and the swimming pool and garden are lit for the evening.",
    detailsTitle: "Lighting details",
    details: [
      "Up and down wall lights across the brick frontage",
      "Warm interior lighting through full-height glazing",
      "Linear pendant over the kitchen island",
      "LED beneath the overhead kitchen cabinets",
      "Deck, pool and garden lighting",
    ],
    photos: [
      {
        file: "Maypleleaf(1).png",
        title: "House at dusk",
        caption:
          "The house from the lawn, its brick and timber walls warmed by exterior lighting against the bush line.",
        w: 1533,
        h: 1026,
      },
      {
        file: "Maypleleaf.png",
        title: "Wall lights at dusk",
        caption:
          "Up and down wall lights graze the pale brick beside the timber-clad upper storey.",
        w: 1537,
        h: 1023,
      },
      {
        file: "4BFBD394-AD2B-4517-98CD-9B0A17ABB25A.png",
        title: "Pool and living at sunset",
        caption:
          "Open-plan living opens to the deck and pool, with warm interior light glowing through the glazing.",
        w: 1545,
        h: 1018,
      },
      {
        file: "3C85CA14-CF54-4583-B8F6-D17F872E485C.png",
        title: "Kitchen",
        caption:
          "A linear pendant over the island, with LED lighting concealed beneath the overhead cabinets.",
        w: 1448,
        h: 1086,
      },
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

async function listFolderPhotos(
  folder: string,
  spec?: RemotePhotoSpec[],
): Promise<PortfolioPhoto[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data) return [];

    const uploads = data.filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name));
    const curated = spec ?? [];
    const isListed = (name: string) => curated.some((entry) => entry.file === name);

    // Captioned photos first, in the order they were written; anything else the
    // folder holds follows in file-name order.
    const ordered = [
      ...curated
        .map((entry) => ({
          name: entry.file,
          spec: entry as RemotePhotoSpec | undefined,
        }))
        .filter(({ name }) => uploads.some((file) => file.name === name)),
      ...uploads
        .filter((file) => !isListed(file.name))
        .map((file) => ({ name: file.name, spec: undefined as RemotePhotoSpec | undefined })),
    ];

    return ordered.map(({ name, spec: entry }, index) => {
      const src = publicUrl(`${folder}/${name}`);
      const fallbackTitle = titleFromFilename(name, index);
      return {
        name: `${folder}/${name}`,
        lg: src,
        sm: src,
        w: entry?.w ?? 1600,
        h: entry?.h ?? 1067,
        title: entry?.title ?? fallbackTitle,
        caption: entry?.caption ?? `${fallbackTitle} — ${folder.replace(/_/g, " ")}.`,
      };
    });
  } catch {
    return [];
  }
}

export async function loadRemotePortfolioProjects(): Promise<PortfolioProject[]> {
  const loaded = await Promise.all(
    REMOTE_PROJECTS.map(async ({ folder, photos, ...project }) => ({
      ...project,
      photos: await listFolderPhotos(folder, photos),
    })),
  );
  return loaded.filter((project) => project.photos.length > 0);
}

export function mergeRemotePortfolio(
  current: PortfolioProject[],
  remote: PortfolioProject[],
): PortfolioProject[] {
  // The curated projects in portfolio.ts always win. Supabase folders may only
  // introduce projects that aren't there yet, so hand-written captions, photo
  // order and the resized images can never be overwritten by an upload.
  const existing = new Set(current.map((project) => project.slug));
  return [...current, ...remote.filter((project) => !existing.has(project.slug))];
}
