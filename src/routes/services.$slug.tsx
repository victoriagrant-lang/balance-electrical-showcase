import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Phone, Plus } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { ProjectCards } from "@/components/ProjectCards";
import { AREAS } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { SERVICES, getService } from "@/lib/services";
import { AREA_SERVED, SITE, breadcrumbs, businessRef, faqPage, jsonLd, serviceId } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    if (!getService(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const s = getService(params.slug);
    if (!s) return {};
    const url = `${SITE}/services/${s.slug}`;
    const image = s.image.src.startsWith("http") ? s.image.src : `${SITE}${s.image.src}`;
    return {
      meta: [
        { title: s.metaTitle },
        { name: "description", content: s.metaDescription },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "geo.region", content: "NZ-WKO" },
        { name: "geo.placename", content: "Taupo" },
        { property: "og:title", content: `${s.h1} | Balance Electrical` },
        { property: "og:description", content: s.metaDescription },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        jsonLd([
          {
            "@type": "Service",
            "@id": serviceId(s.slug),
            name: s.h1,
            serviceType: s.name,
            description: [...s.intro].join(" "),
            url,
            image,
            provider: businessRef,
            areaServed: AREA_SERVED,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `${s.name} — what's included`,
              itemListElement: s.includes.map((name) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name },
              })),
            },
          },
          faqPage(s.faqs),
          breadcrumbs([
            ["Home", "/"],
            ["Areas of expertise", "/areas-of-expertise"],
            [s.name, `/services/${s.slug}`],
          ]),
        ]),
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = getService(slug)!;
  const [lede, ...rest] = s.intro;
  const others = SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-ink-soft">
          <Link to="/areas-of-expertise" className="beam-link">
            Areas of expertise
          </Link>{" "}
          · {s.name}
        </p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-6 max-w-5xl text-balance text-[clamp(2.4rem,6.6vw,6.4rem)] leading-[0.96] tracking-[0.08em]!"
        >
          {s.h1}
        </SplitReveal>
        <Reveal delay={0.45} className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="max-w-2xl text-[1.1rem] leading-relaxed text-ink-soft md:col-span-7">
            {lede}
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Button asChild variant="lux" size="xl">
              <Link to="/contact" search={{ service: s.contactService }}>
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

      <Reveal className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="overflow-hidden border-[8px] border-frame bg-frame md:border-[12px]">
          <img
            src={s.image.src}
            alt={s.image.alt}
            className="block aspect-[16/9] max-h-[78svh] w-full object-cover"
          />
        </div>
      </Reveal>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {rest.map((p) => (
            <Reveal key={p.slice(0, 30)}>
              <p className="text-[1.05rem] leading-relaxed text-ink-soft">{p}</p>
            </Reveal>
          ))}
          <Reveal className="mt-12">
            <h2 className="eyebrow text-ink-soft">What's included</h2>
            <ul className="mt-6 space-y-3">
              {s.includes.map((i) => (
                <li key={i} className="flex items-start gap-4 leading-relaxed">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ink/50" />
                  {i}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <aside className="self-start lg:sticky lg:top-28 lg:col-span-4 lg:col-start-9">
          <div className="border-[8px] border-frame p-7 md:p-9">
            <h2 className="eyebrow text-[10px] text-ink-soft">Working across</h2>
            <ul className="mt-5 space-y-2">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    to="/areas/$slug"
                    params={{ slug: a.slug }}
                    className="beam-link text-[1.05rem]"
                  >
                    {a.linkLabel ?? a.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">
              Based in Taupō (Taupo) and owned by Victoria Grant, registered electrician (EWRB).
            </p>
          </div>
        </aside>
      </section>

      {s.projects.length > 0 && (
        <section data-night className="theme-night relative bg-night py-20 md:py-28">
          <div className="led-h absolute inset-x-0 top-0 opacity-70" />
          <div className="mx-auto max-w-[1440px] px-5 text-ivory md:px-10">
            <p className="eyebrow text-muted-foreground">In the portfolio</p>
            <h2 className="display-caps mt-4 text-[clamp(1.8rem,3.6vw,3rem)] leading-[1] tracking-[0.1em]!">
              {s.name}, seen in our work
            </h2>
            <ProjectCards slugs={s.projects} className="mt-12" />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1100px] px-5 py-24 md:px-10 md:py-32">
        <h2 className="display-caps text-[clamp(1.8rem,3.6vw,3rem)] leading-[1] tracking-[0.1em]!">
          Questions, answered
        </h2>
        <div className="mt-10 border-t border-ink/15">
          {s.faqs.map((f) => (
            <details key={f.q} className="group border-b border-ink/15 py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.15rem] font-display leading-snug [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="mt-1 size-5 shrink-0 transition-transform duration-500 group-open:rotate-45" />
              </summary>
              <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10 md:pb-40">
        <p className="eyebrow text-ink-soft">Other services</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: o.slug }}
                className="eyebrow inline-flex h-11 items-center rounded-full border border-ink/20 px-5 text-[10px] transition-colors hover:border-ink hover:bg-ink hover:text-stone-pale"
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
