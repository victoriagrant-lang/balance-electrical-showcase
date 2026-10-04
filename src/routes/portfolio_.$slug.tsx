import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/Lightbox";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { TorchArea } from "@/components/motion/Torch";
import { PORTFOLIO, getProject, type PortfolioProject } from "@/lib/portfolio";
import { SITE, breadcrumbs, businessRef } from "@/lib/seo";

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
        { name: "description", content: project.summary },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${project.title} | Balance Electrical` },
        { property: "og:description", content: project.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE}${cover.lg}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CreativeWork",
                "@id": `${url}#project`,
                name: project.title,
                headline: `${project.title} — ${project.tags.join(", ")}`,
                description: project.summary,
                text: (project.story ?? [project.summary]).join("\n\n"),
                url,
                image: project.photos.slice(0, 8).map((p) => ({
                  "@type": "ImageObject",
                  contentUrl: `${SITE}${p.lg}`,
                  caption: `${p.title} — ${p.caption}`,
                  width: p.w,
                  height: p.h,
                })),
                keywords: [...project.tags, ...project.details].join(", "),
                locationCreated: { "@type": "Place", name: `${project.location}, New Zealand` },
                creator: businessRef,
                ...(project.accolade ? { award: project.accolade } : {}),
              },
              breadcrumbs([
                ["Home", "/"],
                ["Portfolio", "/portfolio"],
                [project.title, `/portfolio/${project.slug}`],
              ]),
            ],
          }),
        },
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
      <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-36 md:px-10 md:pb-20 md:pt-48">
        <Link
          to="/portfolio"
          hash={project.slug}
          className="beam-link eyebrow inline-flex items-center gap-2 text-[10px] text-ink-soft"
        >
          <ArrowLeft className="size-3" /> Portfolio
        </Link>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-8 max-w-5xl text-balance text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.96] tracking-[0.08em]!"
        >
          {project.title}
        </SplitReveal>
        <Reveal delay={0.45}>
          <p className="eyebrow mt-8 text-[10px] leading-relaxed text-ink-soft">
            {project.location} · {project.tags.join(" · ")}
          </p>
          {project.accolade && (
            <p className="mt-6 inline-flex max-w-xl items-start gap-3 border border-ink/25 px-4 py-3 text-sm leading-snug">
              <Award className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
              {project.accolade}
            </p>
          )}
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-[1440px] px-5 md:px-10">
        <button
          type="button"
          onClick={() => setOpen(0)}
          data-cursor="View"
          className="group block w-full overflow-hidden border-[8px] border-frame bg-frame md:border-[12px]"
          aria-label={`${cover.title} — view larger`}
        >
          <img
            src={cover.lg}
            width={cover.w}
            height={cover.h}
            alt={`${cover.title}, ${project.title}`}
            className="block h-auto max-h-[82svh] w-full object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.02]"
          />
        </button>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
          <span className="eyebrow mr-3 text-[10px] text-ink">{cover.title}</span>
          {cover.caption}
        </p>
      </Reveal>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
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
          <div className="border-[8px] border-frame p-7 md:p-9">
            <p className="eyebrow text-[10px] text-ink-soft">{project.detailsTitle}</p>
            <ul className="mt-5 space-y-3">
              {project.details.map((d) => (
                <li key={d} className="flex items-start gap-4 text-[0.95rem] leading-relaxed">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ink/50" />
                  {d}
                </li>
              ))}
            </ul>
            <Button asChild variant="lux" size="lg" className="mt-8 w-full">
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
            <p className="eyebrow text-muted-foreground">In detail</p>
            <TorchArea className="mt-10">
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                {rest.map((p, i) => (
                  <figure key={p.name} className="mb-8 break-inside-avoid">
                    <button
                      type="button"
                      data-shot
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
                        className="block h-auto w-full transition-[filter,transform] duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] max-md:[filter:brightness(0.5)] max-md:group-data-[lit]:[filter:brightness(1)]"
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
            </TorchArea>
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
