import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { photos } from "@/lib/photos";
import { getPhoto, PORTFOLIO } from "@/lib/portfolio";
import { serviceImage, type ServiceArt } from "@/lib/service-images";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";

export const Route = createFileRoute("/areas-of-expertise")({
  head: () => ({
    meta: [
      {
        title:
          "Electrical Services Taupō | Solar, New Builds, Renovations, EV Chargers | Balance Electrical",
      },
      {
        name: "description",
        content:
          "Electrical services in Taupō for homes and businesses. Explore lighting, new builds, renovations, heat pumps and ducted heating and cooling, solar, EV charging and smart homes.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      {
        name: "keywords",
        content:
          "solar panel installation Taupo, solar electrician Taupo, battery storage Taupo, EV charger Taupo, registered electrician Taupo",
      },
      { property: "og:title", content: "Areas of Expertise — Balance Electrical" },
      {
        property: "og:description",
        content: "Registered electrical services across Taupō and the surrounding district.",
      },
      { property: "og:image", content: photos.kitchen },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz/areas-of-expertise" }],
  }),
  component: AreasOfExpertise,
});

type Area = {
  num: string;
  heading: string;
  service: string;
  img: { src: string; alt: string; credit: string; focus?: string };
  intro: string;
  bullets: string[];
  closing?: string;
  /** Service pages that go deeper on this area. */
  pages: string[];
  /** Portfolio chapters where this work can be seen. */
  projects?: string[];
};

function shot(slug: string, name: string, focus?: string): Area["img"] {
  const p = getPhoto(slug, name);
  return { src: p.lg, alt: `${p.title}, ${p.project}`, credit: p.project, focus };
}

function withArt(name: ServiceArt, alt: string, fallback: Area["img"]): Area["img"] {
  const src = serviceImage(name);
  return src ? { src, alt, credit: alt } : fallback;
}

const sections: Area[] = [
  {
    num: "01",
    pages: ["lighting-design-taupo", "renovation-electrician-taupo"],
    heading: "Homes & renovations",
    service: "Renovation or addition",
    img: shot("the-arches", "02-kitchen"),
    intro:
      "Make your home work better, room by room. We plan and install lighting, power and wiring around the way you live, whether you’re renovating, extending or updating an existing space.",
    bullets: [
      "Complete electrical installations for new homes",
      "Rewiring, additional circuits and wiring for extensions",
      "Switchboard upgrades and safety switches",
      "Interior, exterior and garden lighting design and installation",
      "Swimming pool and spa wiring",
      "Network and data cabling for home offices and media rooms",
      "General maintenance, fault finding, and repairs",
    ],
    projects: ["courtyard-house", "fold-house", "black-gable-house", "the-arches"],
  },
  {
    num: "02",
    pages: ["commercial-electrician-taupo"],
    heading: "Commercial",
    service: "Commercial fit-out",
    img: shot("beechtree-studio", "01-front-at-dusk"),
    intro:
      "Electrical installations planned around your business, your premises and the people working there. From offices and retail spaces to workshops, we coordinate power, lighting and cabling with the wider fit-out. Our work includes Beechtree Studio’s two-storey headquarters.",
    bullets: [
      "New office and retail fit-outs",
      "Warehouse and workshop electrical installations",
      "Three-phase power installations",
      "Switchboards, distribution cabling and cable containment",
      "Exit and emergency lighting — supply, install, and compliance testing",
      "Electrical fault finding and repairs",
      "Data and voice cabling installations",
    ],
    projects: ["beechtree-studio"],
  },
  {
    num: "03",
    pages: ["air-conditioning-heating-taupo"],
    heading: "Air conditioning & heating",
    service: "Air conditioning & heating",
    img: shot("walnut-house", "01-kitchen"),
    intro:
      "Heating and cooling, designed into the home rather than hung on the wall. We supply and install high-wall and floor-mounted heat pumps, ducted central heating and cooling, and multi-zone systems — then integrate them into the design, with linear grilles set into ceilings and bulkheads and custom grilles or heat pumps built into the joinery.",
    bullets: [
      "High-wall and floor-mounted heat pumps",
      "Ducted central heating and cooling for the whole home",
      "Linear grilles coordinated with ceilings and bulkheads",
      "Custom joinery grilles and heat pumps built into cabinetry",
      "Commercial multi-zone systems",
      "Servicing and maintenance",
      "All major brands supplied and installed",
    ],
    projects: ["walnut-house", "cedar-gables", "lake-house", "cedar-cube-house"],
  },
  {
    num: "04",
    pages: ["ev-charger-installation-taupo"],
    heading: "EV charger installation",
    service: "EV charging",
    img: withArt(
      "ev-charging",
      "Wall-mounted EV charger beside a lit garage at dusk",
      shot("black-gable-house", "02-driveway-at-dusk", "72% 50%"),
    ),
    intro:
      "Make charging part of your everyday routine. We assess your electrical supply, charger location and usage needs, then install a dedicated charging point for your home or business.",
    bullets: [
      "Dedicated home EV chargers",
      "Commercial charging points for businesses and rental properties",
      "Electrical supply and load management assessment",
      "Installation, testing and electrical certification",
    ],
  },
  {
    num: "05",
    pages: [],
    heading: "Maintenance & repairs",
    service: "Something else",
    img: shot("beechtree-studio", "09-switchboard"),
    intro:
      "Get faults investigated and everyday electrical problems sorted. We provide maintenance and repairs for homes and businesses across Taupō, with a clear explanation of the issue and the work required.",
    bullets: [
      "Fault finding and diagnosis",
      "Safety switch installation and testing",
      "Landlord electrical inspections",
      "Power point and lighting additions",
      "General repairs and callouts",
    ],
  },
  {
    num: "06",
    pages: ["new-build-electrician-taupo", "smart-home-automation-taupo"],
    heading: "New builds",
    service: "New residential build",
    img: shot("cedar-gables", "06"),
    intro:
      "Plan your electrical installation while your home is taking shape. We work with you, your builder and your design team to coordinate power, lighting and controls, from the initial layout through to the finished installation.",
    bullets: [
      "Full new build electrical design and installation",
      "Pre-wiring before wall linings and final installation of fittings",
      "Switchboard design and installation",
      "Exterior and landscape lighting",
      "Smart home pre-wiring and automation-ready installations",
      "Coordination with your builder and other trades",
    ],
    projects: ["courtyard-house", "cedar-gables", "hillside-house", "behind-the-walls"],
  },
  {
    num: "07",
    pages: ["solar-installation-taupo"],
    heading: "Solar & battery storage",
    service: "Solar & battery storage",
    img: shot("twin-pavilions", "01-array"),
    intro:
      "Plan solar and battery storage around your property and the way you use electricity. Balance Electrical handles the electrical installation, including inverter wiring, switchboard requirements and the grid connection process.",
    bullets: [
      "Residential solar panel system wiring and installation",
      "Battery storage installation and integration",
      "Grid connection and meter upgrades",
      "Solar and EV charger combined installations",
      "Switchboard upgrades for solar-ready homes",
      "Existing system inspections and fault finding",
      "New build solar pre-wiring",
    ],
    closing:
      "We can work alongside your chosen solar supplier or discuss local supplier options. We’ll clarify the electrical scope and connection requirements before the installation begins.",
    projects: ["twin-pavilions"],
  },
];

function AreasOfExpertise() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // The section crossing the middle of the viewport is the one switched on.
  useEffect(() => {
    const els = listRef.current?.querySelectorAll<HTMLElement>("[data-area]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.area));
        }),
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = document.getElementById(`area-${sections[i].num}`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -120, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-ink-soft">What we do</p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-6 max-w-5xl text-balance text-[clamp(2rem,5.6vw,5.5rem)] leading-[0.95] tracking-[0.08em]!"
        >
          Electrical expertise. From start to finish.
        </SplitReveal>
        <Reveal delay={0.5} className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:col-span-6">
            Electrical services for homes and businesses across Taupō. Explore how we can help with
            your build, renovation or upgrade, and see examples of our work.
          </p>
          <div className="flex flex-wrap gap-2 md:col-span-6 md:justify-end">
            {sections.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => jump(i)}
                aria-label={`View ${s.heading}`}
                className="eyebrow min-h-10 rounded-full border border-ink/20 px-4 text-[10px] transition-colors hover:border-ink hover:bg-ink hover:text-stone-pale"
              >
                {s.heading}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-40">
        <div ref={listRef}>
          {sections.map((s, i) => {
            const lit = active === i;
            const flip = i % 2 === 1;
            return (
              <article
                key={s.num}
                id={`area-${s.num}`}
                data-area={i}
                className="grid scroll-mt-28 gap-10 border-t border-ink/15 py-16 first:border-t-0 first:pt-0 md:py-24 lg:grid-cols-12 lg:gap-16"
              >
                {/* The photograph travels with its own text: pinned beside it, then leaves with it. */}
                <figure
                  className={cn(
                    "relative self-start lg:sticky lg:top-28 lg:col-span-6",
                    flip && "lg:order-2",
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-[8px] border-frame bg-frame md:border-[10px] lg:aspect-[4/5] lg:max-h-[calc(100svh-160px)] lg:w-full">
                    <img
                      src={s.img.src}
                      alt={s.img.alt}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      style={{ objectPosition: s.img.focus }}
                      className={cn(
                        "h-full w-full object-cover transition-[filter,transform] duration-[1400ms] [transition-timing-function:var(--ease-out-expo)]",
                        lit
                          ? "scale-100 [filter:brightness(1)_saturate(1)]"
                          : "scale-[1.04] [filter:brightness(0.45)_saturate(0.6)]",
                      )}
                    />
                    {lit && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 animate-[sweep_1.4s_var(--ease-out-expo)_both]"
                        style={{
                          background:
                            "linear-gradient(100deg, transparent 35%, rgb(255 236 206 / 0.35) 50%, transparent 65%)",
                          mixBlendMode: "screen",
                        }}
                      />
                    )}
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-5 text-ivory md:p-6">
                      <span className="eyebrow text-[10px] text-glow-soft/90">{s.img.credit}</span>
                      <span className="font-display text-3xl leading-none">{s.num}</span>
                    </figcaption>
                  </div>
                </figure>

                <div className={cn("lg:col-span-6 lg:py-4", flip && "lg:order-1")}>
                  <p className="eyebrow text-ink-soft">Service {s.num}</p>
                  <h2 className="display-caps mt-4 text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.05] tracking-[0.1em]!">
                    {s.heading}
                  </h2>
                  <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">{s.intro}</p>
                  <ul className="mt-8 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-4 leading-relaxed">
                        <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ink/50" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {s.closing && <p className="mt-8 leading-relaxed text-ink-soft">{s.closing}</p>}
                  {s.projects && (
                    <div className="mt-10 border-t border-ink/15 pt-6">
                      <p className="eyebrow text-[10px] text-ink-soft">Related projects</p>
                      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                        {s.projects.map((slug) => (
                          <li key={slug}>
                            <Link
                              to="/portfolio/$slug"
                              params={{ slug }}
                              className="beam-link text-[0.98rem]"
                            >
                              {PORTFOLIO.find((p) => p.slug === slug)?.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Link
                    to="/contact"
                    search={{ service: s.service }}
                    className="beam-link eyebrow mt-10 inline-flex items-center gap-2 text-[10px]"
                  >
                    Discuss your project <ArrowUpRight className="size-3" />
                  </Link>
                  {s.pages.map((page) => (
                    <Link
                      key={page}
                      to="/services/$slug"
                      params={{ slug: page }}
                      className="beam-link eyebrow ml-6 mt-10 inline-flex items-center gap-2 text-[10px] text-ink-soft"
                    >
                      {SERVICES.find((x) => x.slug === page)?.name} in detail
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section data-night className="theme-night relative overflow-hidden bg-night">
        <div className="led-h opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[70%] w-[70vw] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgb(255 231 194 / 0.14), transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-40">
          <SplitReveal
            as="h2"
            className="display-caps text-[clamp(2.2rem,5vw,4.4rem)] leading-[1] tracking-[0.1em]! text-ivory"
          >
            Let’s work through the details.
          </SplitReveal>
          <Reveal>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
              You don’t need a finished plan to get in touch. Tell us about your property and what
              you want to achieve, and Victoria will help you identify the next steps.
            </p>
            <Button asChild variant="lux" size="xl" className="mt-10">
              <Link to="/contact">Discuss your project</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
