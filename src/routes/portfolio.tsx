import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Award, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/Lightbox";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { TorchArea } from "@/components/motion/Torch";
import { useLenis } from "@/hooks/use-lenis";
import { CONTACT } from "@/lib/contact";
import { PORTFOLIO, type PortfolioPhoto, type PortfolioProject } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { loadRemotePortfolioProjects, mergeRemotePortfolio } from "@/lib/remotePortfolio";

const SITE = "https://www.balanceelectrical.co.nz";
const pad = (n: number) => String(n).padStart(2, "0");

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Our Projects | Electrical & Lighting Taupō | Balance Electrical" },
      {
        name: "description",
        content:
          "Explore Balance Electrical’s residential, commercial and solar projects. See the electrical scope, lighting details and finished installations in each property.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Projects Portfolio — Balance Electrical" },
      {
        property: "og:description",
        content:
          "A closer look at our projects: the properties, the electrical work and the details of each installation.",
      },
      { property: "og:image", content: `${SITE}${PORTFOLIO[0].photos[0].lg}` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/portfolio` }],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [portfolio, setPortfolio] = useState(PORTFOLIO);
  const [open, setOpen] = useState<{ project: number; photo: number } | null>(null);
  useEffect(() => {
    let active = true;
    loadRemotePortfolioProjects().then((remote) => {
      if (active && remote.length) setPortfolio((current) => mergeRemotePortfolio(current, remote));
    });
    return () => {
      active = false;
    };
  }, []);

  const project = open ? portfolio[open.project] : null;
  const shots = project
    ? project.photos.map((p) => ({
        src: p.lg,
        title: p.title,
        place: `${project.title} · ${project.location}`,
        note: p.caption,
      }))
    : [];

  return (
    <SiteLayout>
      <PortfolioHero projects={portfolio} />

      <section data-night className="theme-night relative bg-night" aria-label="Projects">
        <div className="led-h absolute inset-x-0 top-0 opacity-70" />
        {portfolio.map((p, i) => (
          <Chapter
            key={p.slug}
            project={p}
            index={i}
            total={portfolio.length}
            onOpen={(photo) => setOpen({ project: i, photo })}
          />
        ))}
      </section>

      <section className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid items-end gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-ink-soft">Start a project</p>
            <SplitReveal
              as="h2"
              className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
            >
              Let’s plan your project.
            </SplitReveal>
            <Reveal>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
                Building, renovating or fitting out a workplace? Share your plans with Victoria and
                discuss the lighting, power and electrical systems your project needs.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="lux" size="xl">
                  <Link to="/contact" data-cursor="Let's talk">
                    Discuss your project <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="luxOutline" size="xl">
                  <Link to="/areas-of-expertise">Our services</Link>
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:justify-self-end">
            <a
              href={CONTACT.tel}
              data-cursor="Call"
              className="flex items-center gap-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none"
            >
              <Phone className="size-6" strokeWidth={1.25} />
              {CONTACT.phoneLocal}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="beam-link mt-4 inline-block text-ink-soft hover:text-ink"
            >
              {CONTACT.email}
            </a>
          </Reveal>
        </div>
      </section>

      <Lightbox
        shots={shots}
        index={open?.photo ?? null}
        onIndex={(photo) => setOpen(photo === null || !open ? null : { ...open, photo })}
      />
    </SiteLayout>
  );
}

/** Stone hero with a framed print per project that jumps to its chapter. */
function PortfolioHero({ projects }: { projects: PortfolioProject[] }) {
  const lenis = useLenis();
  const jump = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pb-32 md:pt-48">
      <p className="eyebrow text-ink-soft">Portfolio</p>
      <SplitReveal
        as="h1"
        immediate
        delay={0.2}
        className="display-caps mt-6 max-w-6xl text-[clamp(2.6rem,7.4vw,7.2rem)] leading-[0.98] tracking-[0.08em]!"
      >
        Explore our projects.
      </SplitReveal>
      <Reveal delay={0.5} className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
        <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:col-span-6">
          From new homes and renovations to commercial premises and solar installations, see what
          each project involved and explore the finished details. To browse photographs by type of
          work,{" "}
          <Link to="/projects" className="beam-link text-ink">
            visit the gallery
          </Link>
          .
        </p>
        <dl className="grid grid-cols-3 gap-6 border-t border-ink/15 pt-6 md:col-span-5 md:col-start-8">
          <div>
            <dt className="eyebrow text-[10px] text-ink-soft">Projects</dt>
            <dd className="mt-2 font-display text-4xl leading-none">{pad(projects.length)}</dd>
          </div>
          <div>
            <dt className="eyebrow text-[10px] text-ink-soft">Photos</dt>
            <dd className="mt-2 font-display text-4xl leading-none">
              {projects.reduce((total, project) => total + project.photos.length, 0)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-[10px] text-ink-soft">Region</dt>
            <dd className="mt-2 font-display text-4xl leading-none">Taupō</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal
        stagger={0.08}
        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-6"
      >
        {projects.map((p, i) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            onClick={(e) => {
              e.preventDefault();
              jump(p.slug);
            }}
            data-cursor="Open"
            className="group block"
          >
            <span className="flex items-center justify-between text-ink-soft">
              <span className="eyebrow text-[10px]">{pad(i + 1)}</span>
              <span className="eyebrow text-[10px]">{p.photos.length} photos</span>
            </span>
            <span className="relative mt-3 block aspect-[4/3] overflow-hidden border-[6px] border-frame bg-frame">
              <img
                src={p.photos[0].sm}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-[filter,transform] duration-[1200ms] [filter:brightness(0.55)_saturate(0.6)] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:[filter:brightness(1)_saturate(1)] group-focus-visible:[filter:brightness(1)_saturate(1)] [@media(hover:none)]:[filter:none]"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-2/3 opacity-0 transition-opacity duration-[1200ms] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(45% 60% at 50% 0%, rgb(255 236 206 / 0.4), transparent 75%)",
                  mixBlendMode: "screen",
                }}
              />
            </span>
            <span className="display-caps mt-4 block text-xl tracking-[0.14em]!">{p.title}</span>
            <span className="eyebrow mt-2 block text-[10px] text-ink-soft">
              {p.location} · {p.tags.join(" · ")}
            </span>
          </a>
        ))}
      </Reveal>
    </section>
  );
}

/** One project: a sticky story on the left, its photographs in a torch-lit room on the right. */
function Chapter({
  project,
  index,
  total,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  total: number;
  onOpen: (photo: number) => void;
}) {
  const [cover, ...rest] = project.photos;
  const titleId = `${project.slug}-title`;
  // A long single word (e.g. "Headquarters") must still fit the narrow sticky column.
  const longTitle = Math.max(...project.title.split(" ").map((w) => w.length)) > 9;

  return (
    <article
      id={project.slug}
      aria-labelledby={titleId}
      className="scroll-mt-20 border-t border-ivory/10 first-of-type:border-t-0"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
        <header className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <p className="eyebrow text-muted-foreground">
            {pad(index + 1)} / {pad(total)}
          </p>
          <SplitReveal
            as="h2"
            id={titleId}
            className={cn(
              "display-caps mt-5 leading-[1.02] text-ivory",
              longTitle
                ? "text-[clamp(1.6rem,2.6vw,2.5rem)] tracking-[0.08em]!"
                : "text-[clamp(2rem,3.6vw,3.4rem)] tracking-[0.1em]!",
            )}
          >
            {project.title}
          </SplitReveal>
          <p className="eyebrow mt-5 text-[10px] text-glow-soft/80">
            {project.location} · {project.tags.join(" · ")}
          </p>
          {project.accolade && (
            <p className="mt-6 flex items-start gap-3 border border-glow/30 px-4 py-3 text-sm leading-snug text-ivory/90 shadow-[0_0_34px_-14px_rgb(242_200_139/0.7)]">
              <Award className="mt-0.5 size-4 shrink-0 text-glow-soft" strokeWidth={1.5} />
              {project.accolade}
            </p>
          )}
          <p className="mt-6 leading-relaxed text-muted-foreground">{project.summary}</p>
          <p className="eyebrow mt-10 text-[10px] text-muted-foreground">{project.detailsTitle}</p>
          <ul className="mt-4 space-y-2.5">
            {project.details.map((d) => (
              <li key={d} className="flex items-start gap-4 text-sm leading-relaxed text-ivory/85">
                <span className="mt-[0.7em] h-px w-5 shrink-0 bg-glow/60" />
                {d}
              </li>
            ))}
          </ul>
        </header>

        <Reveal className="lg:col-span-8">
          <TorchArea>
            <Photo
              photo={cover}
              project={project.title}
              sizes="(min-width: 1024px) 62vw, 100vw"
              onClick={() => onOpen(0)}
            />
            <div className="mt-4 columns-1 gap-4 sm:columns-2 md:mt-5 md:gap-5">
              {rest.map((p, i) => (
                <Photo
                  key={p.lg}
                  photo={p}
                  project={project.title}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                  onClick={() => onOpen(i + 1)}
                  className="mb-4 break-inside-avoid md:mb-5"
                />
              ))}
            </div>
          </TorchArea>
        </Reveal>
      </div>
    </article>
  );
}

function Photo({
  photo,
  project,
  sizes,
  onClick,
  className,
}: {
  photo: PortfolioPhoto;
  project: string;
  sizes: string;
  onClick: () => void;
  className?: string;
}) {
  // The small variant is 800px on its long edge.
  const smWidth = photo.w >= photo.h ? 800 : Math.round((800 * photo.w) / photo.h);

  return (
    <button
      type="button"
      data-shot
      data-cursor="View"
      onClick={onClick}
      aria-label={`${photo.title} — view larger`}
      className={cn("group relative block w-full overflow-hidden text-left", className)}
    >
      <img
        src={photo.sm}
        srcSet={`${photo.sm} ${smWidth}w, ${photo.lg} ${photo.w}w`}
        sizes={sizes}
        width={photo.w}
        height={photo.h}
        alt={`${photo.title}, ${project}`}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full transition-[filter,transform] duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] max-md:[filter:brightness(0.45)] max-md:group-data-[lit]:[filter:brightness(1)]"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 md:translate-y-2 md:opacity-0 md:transition-all md:duration-700 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
        <span className="eyebrow block text-[10px] text-glow-soft/90">{photo.title}</span>
        <span className="mt-1 block text-sm leading-snug text-ivory/80">{photo.caption}</span>
      </span>
    </button>
  );
}
