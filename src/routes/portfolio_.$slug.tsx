import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/Lightbox";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { PORTFOLIO, getProject, type PortfolioProject } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";
import { SITE, breadcrumbs, businessRef, jsonLd, serviceId } from "@/lib/seo";

/** Up to `max` characters, cut at a word, for meta descriptions. */
function clip(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max - 1);
  const head = cut > 0 ? text.slice(0, cut) : text.slice(0, max - 1);
  return `${head.replace(/[,;:—–-]$/, "")}…`;
}

/**
 * Service pages related to this project (from each service's project list). Maintenance is
 * left out: its project cards only illustrate the standard of work, not maintenance jobs.
 */
function servicesFor(slug: string) {
  return SERVICES.filter(
    (s) => s.slug !== "maintenance-electrician-taupo" && s.projects.includes(slug),
  );
}

export const Route = createFileRoute("/portfolio_/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return {};
    const url = `${SITE}/portfolio/${project.slug}`;
    const cover = project.photos[0];
    const title = `${project.title} — ${project.location} | Balance Electrical`;
    return {
      meta: [
        { title },
        { name: "description", content: clip(project.summary) },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${project.title} | Balance Electrical` },
        { property: "og:description", content: clip(project.summary) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE}${cover.lg}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        jsonLd([
          {
            // The write-up of a project Balance worked on. Any award belongs to the house
            // and its builder, so it stays in the visible copy and out of this markup.
            "@type": "CreativeWork",
            "@id": `${url}#project`,
            name: project.title,
            headline: `${project.title} — ${project.tags.join(", ")}`,
            description: project.summary,
            text: (project.story ?? [project.summary]).join("\n\n"),
            url,
            inLanguage: "en-NZ",
            image: project.photos.slice(0, 8).map((p) => ({
              "@type": "ImageObject",
              contentUrl: `${SITE}${p.lg}`,
              caption: `${p.title} — ${p.caption}`,
              width: p.w,
              height: p.h,
            })),
            keywords: [...project.tags, ...project.details].join(", "),
            contentLocation: { "@type": "Place", name: `${project.location}, New Zealand` },
            contributor: businessRef,
            publisher: businessRef,
            mentions: servicesFor(project.slug).map((s) => ({ "@id": serviceId(s.slug) })),
          },
          breadcrumbs([
            ["Home", "/"],
            ["Portfolio", "/portfolio"],
            [project.title, `/portfolio/${project.slug}`],
          ]),
        ]),
      ],
    };
  },
  component: ProjectStory,
});

function ProjectStory() {
  const { slug } = Route.useLoaderData();
  const project = getProject(slug) as PortfolioProject;
  const [open, setOpen] = useState<number | null>(null);
  const index = PORTFOLIO.findIndex((p) => p.slug === project.slug);
  const next = PORTFOLIO[(index + 1) % PORTFOLIO.length];
  const services = servicesFor(project.slug);
  const [cover, ...rest] = project.photos;
  const [lede, ...paragraphs] = project.story ?? [project.summary];
  const shots = project.photos.map((p) => ({
    src: p.lg,
    title: p.title,
    place: `${project.title} · ${project.location}`,
    note: p.caption,
  }));

  return (
    <SiteLayout>
      {/* The cover photograph is the hero: full-bleed, with the title set into its lower edge. */}
      <section
        data-night
        className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-night text-ivory"
      >
        <button
          type="button"
          onClick={() => setOpen(0)}
          data-cursor="View"
          aria-label={`${cover.title} — view larger`}
          className="group absolute inset-0 -z-10 block"
        >
          <img
            src={cover.lg}
            width={cover.w}
            height={cover.h}
            alt={`${cover.title}, ${project.title}`}
            className="h-full w-full animate-[fadeInUp_1.4s_var(--ease-out-expo)_both] object-cover transition-transform duration-[1800ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.02]"
          />
        </button>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/45 to-night/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-night/70 to-transparent"
        />
        <div className="pointer-events-none mx-auto w-full max-w-[1440px] px-5 pb-12 pt-36 md:px-10 md:pb-16">
          <Link
            to="/portfolio"
            hash={project.slug}
            className="beam-link eyebrow pointer-events-auto inline-flex items-center gap-2 text-[10px] text-ivory/80"
          >
            <ArrowLeft className="size-3" /> Portfolio
          </Link>
          <SplitReveal
            as="h1"
            immediate
            delay={0.2}
            className="display-caps mt-6 max-w-5xl text-balance text-[clamp(2.4rem,7vw,6.6rem)] leading-[0.96] tracking-[0.08em]! text-ivory [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]"
          >
            {project.title}
          </SplitReveal>
          <Reveal delay={0.45} className="mt-7 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-[10px] leading-relaxed text-glow-soft/90">
                {project.location} · {project.tags.join(" · ")}
              </p>
              {project.accolade && (
                <p className="mt-5 inline-flex max-w-xl items-start gap-3 border border-glow/40 bg-night/40 px-4 py-3 text-sm leading-snug text-ivory/90 backdrop-blur-sm">
                  <Award className="mt-0.5 size-4 shrink-0 text-glow-soft" strokeWidth={1.5} />
                  {project.accolade}
                </p>
              )}
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ivory/75">
              <span className="eyebrow mr-3 text-[10px] text-ivory">{cover.title}</span>
              {cover.caption}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.3]">{lede}</p>
          </Reveal>
          <Reveal
            stagger={0.08}
            className="mt-10 space-y-6 text-[1.05rem] leading-relaxed text-ink-soft"
          >
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Reveal>
        </div>
        <aside className="self-start lg:sticky lg:top-28 lg:col-span-4 lg:col-start-9">
          <div className="border-[8px] border-frame p-5 sm:p-7 md:p-9">
            <p className="eyebrow text-[10px] text-ink-soft">{project.detailsTitle}</p>
            <ul className="mt-5 space-y-3">
              {project.details.map((d) => (
                <li key={d} className="flex items-start gap-4 text-[0.95rem] leading-relaxed">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ink/50" />
                  {d}
                </li>
              ))}
            </ul>
            {services.length > 0 && (
              <>
                <p className="eyebrow mt-8 text-[10px] text-ink-soft">Related services</p>
                <ul className="mt-4 space-y-2">
                  {services.map((s) => (
                    <li key={s.slug} className="text-[0.95rem] leading-relaxed">
                      <Link to="/services/$slug" params={{ slug: s.slug }} className="beam-link">
                        {s.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button
              asChild
              variant="lux"
              size="lg"
              className="mt-8 h-auto min-h-12 w-full whitespace-normal py-3 text-center"
            >
              <Link to="/contact">
                Discuss a project like this <ArrowRight />
              </Link>
            </Button>
          </div>
        </aside>
      </section>

      {rest.length > 0 && (
        <section
          data-night
          className="theme-night relative bg-night py-20 md:py-28"
          aria-label={`${project.title} photographs`}
        >
          <div className="led-h absolute inset-x-0 top-0 opacity-70" />
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="eyebrow text-muted-foreground">In detail</p>
              <p className="eyebrow text-[10px] text-muted-foreground">
                {project.photos.length} photographs · select one to enlarge
              </p>
            </div>
            <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {rest.map((p, i) => (
                <figure key={p.name} className="mb-8 break-inside-avoid">
                  <button
                    type="button"
                    data-cursor="View"
                    onClick={() => setOpen(i + 1)}
                    className="group block w-full overflow-hidden"
                    aria-label={`${p.title} — view larger`}
                  >
                    <img
                      src={p.sm}
                      width={p.w}
                      height={p.h}
                      alt={`${p.title}, ${project.title}`}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full transition-[filter,transform] duration-[1200ms] [filter:brightness(0.94)] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:[filter:brightness(1.03)]"
                    />
                  </button>
                  <figcaption className="mt-3">
                    <span className="eyebrow block text-[10px] text-glow-soft/90">{p.title}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ivory/70">
                      {p.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-5 py-24 md:px-10 md:py-32">
        <div>
          <p className="eyebrow text-ink-soft">Next project</p>
          <Link
            to="/portfolio/$slug"
            params={{ slug: next.slug }}
            className="display-caps mt-4 block text-[clamp(1.8rem,4vw,3.4rem)] leading-[1] tracking-[0.08em]! hover:opacity-70"
          >
            {next.title}
          </Link>
          <p className="eyebrow mt-3 text-[10px] text-ink-soft">
            {next.location} · {next.tags.join(" · ")}
          </p>
        </div>
        <Button asChild variant="luxOutline" size="xl">
          <Link to="/portfolio">
            All projects <ArrowRight />
          </Link>
        </Button>
      </section>

      <Lightbox shots={shots} index={open} onIndex={setOpen} />
    </SiteLayout>
  );
}
