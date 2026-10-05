import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BrandText } from "@/components/brand/BrandName";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { ProjectCards } from "@/components/ProjectCards";
import { AREAS, getArea } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { SERVICES } from "@/lib/services";
import { SITE, breadcrumbs, businessRef, jsonLd, placeNode, websiteRef } from "@/lib/seo";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    if (!getArea(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const a = getArea(params.slug);
    if (!a) return {};
    const url = `${SITE}/areas/${a.slug}`;
    return {
      meta: [
        { title: a.metaTitle },
        { name: "description", content: a.metaDescription },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "geo.region", content: "NZ-WKO" },
        { name: "geo.placename", content: a.name },
        { name: "geo.position", content: `${a.geo.lat};${a.geo.lng}` },
        { property: "og:title", content: `${a.h1} | Balance Electrical` },
        { property: "og:description", content: a.metaDescription },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        jsonLd([
          {
            "@type": "WebPage",
            "@id": `${url}#page`,
            name: a.h1,
            description: a.metaDescription,
            url,
            inLanguage: "en-NZ",
            isPartOf: websiteRef,
            about: [businessRef, { "@id": placeNode(a)["@id"] }],
          },
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: a.h1,
            serviceType: "Electrician",
            url,
            provider: businessRef,
            areaServed: placeNode(a),
          },
          breadcrumbs([
            ["Home", "/"],
            [a.name, `/areas/${a.slug}`],
          ]),
        ]),
      ],
    };
  },
  component: AreaPage,
});

function AreaPage() {
  const { slug } = Route.useLoaderData();
  const a = getArea(slug)!;
  const [lede, ...rest] = a.intro;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-ink-soft">Working across the Taupō district · {a.name}</p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-6 max-w-5xl text-balance text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.96] tracking-[0.08em]!"
        >
          {a.h1}
        </SplitReveal>
        <Reveal delay={0.45} className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink-soft md:col-span-7">
            <p className="text-[1.15rem] text-ink">
              <BrandText text={lede} />
            </p>
            {rest.map((p) => (
              <p key={p.slice(0, 30)}>
                <BrandText text={p} />
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Button asChild variant="lux" size="xl">
              <Link to="/contact">
                Discuss your project <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="luxOutline" size="xl">
              <a href={CONTACT.tel}>
                <Phone /> {CONTACT.phoneLocal}
              </a>
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
        <h2 className="eyebrow text-ink-soft">Services in {a.name}</h2>
        <ul className="mt-8 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li key={s.slug} className="bg-stone">
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:bg-stone-lit"
              >
                <span className="display-caps text-lg tracking-[0.12em]">{s.name}</span>
                <span className="text-sm leading-relaxed text-ink-soft">{s.summary}</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section data-night className="theme-night relative bg-night py-20 md:py-28">
        <div className="led-h absolute inset-x-0 top-0 opacity-70" />
        <div className="mx-auto max-w-[1440px] px-5 text-ivory md:px-10">
          <p className="eyebrow text-muted-foreground">
            {a.local ? `Projects in and around ${a.name}` : "Recent work across the district"}
          </p>
          <ProjectCards slugs={a.projects} className="mt-10" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <p className="eyebrow text-ink-soft">Also working across</p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {AREAS.filter((o) => o.slug !== a.slug).map((o) => (
            <li key={o.slug}>
              <Link
                to="/areas/$slug"
                params={{ slug: o.slug }}
                className="beam-link font-display text-2xl"
              >
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
