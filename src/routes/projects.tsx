import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { Lightbox, type Shot } from "@/components/Lightbox";
import { photos } from "@/lib/photos";
import { getPhoto, getProject } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Gallery | Electrician Taupō | Balance Electrical" },
      {
        name: "description",
        content:
          "The work, up close: architectural lighting, integrated electrical, climate systems, smart-home technology and solar from Balance Electrical’s projects in Taupō. Explore by discipline or switch to After Dark.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Gallery — Balance Electrical" },
      {
        property: "og:description",
        content:
          "See the details of our electrical and lighting work. Filter photographs by service, or explore the full project in our portfolio.",
      },
      { property: "og:image", content: photos.fountainEntry },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz/projects" }],
  }),
  component: Gallery,
});

type Discipline = "Lighting" | "Electrical" | "Climate" | "Smart Home" | "Solar";

type Pick = {
  slug: string;
  name: string;
  /** The detail the photograph is about, shown above the project name. */
  label: string;
  tags: Discipline[];
  /** Taken at dusk or after dark. */
  dark?: boolean;
};

// The photographs shown on the gallery page, in display order.
const GALLERY: Pick[] = [
  {
    slug: "fold-house",
    name: "06-stair",
    label: "Integrated stair lighting",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "courtyard-house",
    name: "06",
    label: "Linear joinery lighting",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "cedar-gables",
    name: "13",
    label: "Sculptural kitchen lighting",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "walnut-house",
    name: "01-kitchen",
    label: "Joinery-integrated climate",
    tags: ["Climate", "Electrical"],
  },
  { slug: "lake-house", name: "03-gallery", label: "Cedar ceiling cove", tags: ["Lighting"] },
  {
    slug: "beechtree-studio",
    name: "03-stairwell-pendants",
    label: "Stairwell feature lighting",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "the-arches",
    name: "01-lounge",
    label: "Illuminated display niches",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "cedar-gables",
    name: "08",
    label: "Integrated wardrobe lighting",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "pool-courtyard",
    name: "06-shower-niche",
    label: "Illuminated shower niche",
    tags: ["Lighting", "Electrical"],
  },
  {
    slug: "black-ridge-house",
    name: "03-kitchen",
    label: "Centralised lighting & climate control",
    tags: ["Smart Home", "Electrical"],
  },
  {
    slug: "cedar-cube-house",
    name: "05-integrated-climate",
    label: "Linear ducted grilles",
    tags: ["Climate", "Electrical"],
  },
  {
    slug: "black-gable-house",
    name: "01-front-at-dusk",
    label: "Façade & garden lighting",
    tags: ["Lighting", "Electrical"],
    dark: true,
  },
  {
    slug: "twin-pavilions",
    name: "01-array",
    label: "Rooftop solar array",
    tags: ["Solar", "Electrical"],
  },
  {
    slug: "black-ridge-house",
    name: "04-kitchen-to-living",
    label: "Smart lighting scenes",
    tags: ["Smart Home", "Electrical"],
  },
  {
    slug: "cedar-cube-house",
    name: "02",
    label: "Pool & courtyard lighting",
    tags: ["Lighting", "Electrical"],
    dark: true,
  },
  {
    slug: "behind-the-walls",
    name: "01-ceiling-runs",
    label: "Planned ceiling runs",
    tags: ["Electrical"],
  },
  {
    slug: "hillside-house",
    name: "03-entry-at-dusk",
    label: "Entry & soffit lighting",
    tags: ["Lighting"],
    dark: true,
  },
  {
    slug: "behind-the-walls",
    name: "03-cable-drops",
    label: "Grouped cable drops",
    tags: ["Electrical"],
  },
];

type Tile = Shot & {
  slug: string;
  smSrc: string;
  w: number;
  h: number;
  tags: Discipline[];
  dark: boolean;
};

const TILES: Tile[] = GALLERY.map((pick) => {
  const project = getProject(pick.slug);
  const photo = getPhoto(pick.slug, pick.name);
  return {
    slug: pick.slug,
    src: photo.lg,
    smSrc: photo.sm,
    w: photo.w,
    h: photo.h,
    title: pick.label,
    place: project?.title ?? photo.project,
    note: photo.caption,
    tags: pick.tags,
    dark: Boolean(pick.dark),
  };
});

const AFTER_DARK = "After Dark";
const FILTERS = ["All", "Lighting", "Electrical", "Climate", "Smart Home", "Solar", AFTER_DARK];

const matches = (t: Tile, f: string) =>
  f === "All" ? true : f === AFTER_DARK ? t.dark : t.tags.includes(f as Discipline);

function Gallery() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = TILES.filter((t) => matches(t, filter));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-20 md:pt-48">
        <p className="eyebrow text-ink-soft">Gallery</p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-6 max-w-5xl text-[clamp(2.6rem,7.4vw,7.2rem)] leading-[0.98] tracking-[0.08em]!"
        >
          The work, up close.
        </SplitReveal>
        <Reveal delay={0.5} className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="max-w-2xl space-y-5 text-[1.05rem] leading-relaxed text-ink-soft md:col-span-7">
            <p>
              A closer look at the details behind our projects — architectural lighting, integrated
              electrical, climate systems, smart-home technology and the workmanship that sits
              behind the finish.
            </p>
            <p>
              Explore by discipline, or switch to After Dark to see how the lighting transforms each
              project at night.
            </p>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Button asChild variant="luxOutline" size="xl">
              <Link to="/portfolio">
                Explore the portfolio <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <section
        data-night
        className="theme-night relative bg-night py-14 md:py-24"
        aria-label="Project gallery"
      >
        <div className="led-h absolute inset-x-0 top-0 opacity-70" />
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div role="toolbar" aria-label="Filter by discipline" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "eyebrow inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[10px] transition-[color,background-color,border-color,box-shadow] duration-500",
                  filter === f
                    ? "border-glow/60 bg-glow-soft text-ink shadow-[0_0_24px_-6px_rgb(255_231_194/0.8)]"
                    : "border-ivory/20 text-ivory/75 hover:border-ivory/50 hover:text-ivory",
                )}
              >
                {f}
                <span className="opacity-60">{TILES.filter((t) => matches(t, f)).length}</span>
              </button>
            ))}
          </div>

          {/*
            Justified rows on larger screens: every photograph keeps its own proportions and
            the row widths are shared out by aspect ratio, so the order reads left to right.
            The trailing spacer stops a short last row from stretching.
          */}
          <div
            key={filter}
            className="mt-10 flex flex-col gap-4 md:mt-14 md:flex-row md:flex-wrap md:after:grow-[999] md:after:content-['']"
          >
            {shown.map((t, i) => (
              <button
                key={t.src}
                type="button"
                data-cursor="View"
                onClick={() => setOpen(i)}
                style={
                  { "--r": t.w / t.h, animationDelay: `${Math.min(i, 8) * 60}ms` } as CSSProperties
                }
                className="group relative block animate-[fadeInUp_0.9s_var(--ease-out-expo)_both] overflow-hidden bg-frame text-left md:shrink md:grow-[calc(var(--r)*100)] md:basis-[calc(var(--r)*clamp(200px,19vw,300px))]"
              >
                <span className="block aspect-[4/3] md:aspect-auto md:pb-[calc(100%/var(--r))]" />
                <img
                  src={t.smSrc}
                  srcSet={`${t.smSrc} 800w, ${t.src} 1800w`}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  width={t.w}
                  height={t.h}
                  alt={`${t.title}, ${t.place}`}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-[1200ms] [filter:brightness(0.86)] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:[filter:brightness(1.04)] group-focus-visible:[filter:brightness(1.04)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 50% at 50% 0%, rgb(255 236 206 / 0.22), transparent 70%)",
                    mixBlendMode: "screen",
                  }}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 pt-16 md:p-6 md:pt-20">
                  <span className="eyebrow block text-[9.5px] text-glow-soft/90">{t.title}</span>
                  <span className="mt-1.5 block font-display text-[1.6rem] leading-tight text-ivory">
                    {t.place}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid items-center gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <div className="border-[8px] border-frame md:border-[12px]">
              <img
                src={photos.media}
                loading="lazy"
                decoding="async"
                alt="An example of Balance Electrical’s work"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="md:col-span-5 md:col-start-8">
            <p className="eyebrow text-ink-soft">Your project</p>
            <SplitReveal
              as="h2"
              className="display-caps mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1] tracking-[0.1em]!"
            >
              Ideas for your space.
            </SplitReveal>
            <Reveal>
              <p className="mt-6 leading-relaxed text-ink-soft">
                Seen a detail you like? Tell us which project caught your eye and what you have in
                mind. We can discuss how the lighting or electrical approach could work in your own
                home or business.
              </p>
              <Button asChild variant="lux" size="xl" className="mt-10">
                <Link to="/contact">
                  Discuss your project <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <Lightbox shots={shown} index={open} onIndex={setOpen} />
    </SiteLayout>
  );
}
