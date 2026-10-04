import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { photos } from "@/lib/photos";
import { getPhoto, PORTFOLIO } from "@/lib/portfolio";
import { serviceImage, type ServiceArt } from "@/lib/service-images";
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
          "Registered electrical services in Taupō — new builds, renovations, solar & battery storage, heat pump installation, EV chargers, and commercial fit-outs. Balance Electrical, Victoria Grant.",
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
    heading: "Residential",
    service: "Renovation or addition",
    img: { src: photos.img0004, alt: "Kitchen lighting in a Taupō home", credit: "Residential" },
    intro:
      "From lake-view new builds in Kinloch to a holiday home reworked room by room, Balance Electrical handles the full scope of residential electrical work. In New Zealand, using a registered electrician isn't just about quality — it's a legal requirement.",
    bullets: [
      "New build electrical fit-out — full installation from foundations to CCC",
      "Renovation wiring — additional circuits, partial rewires, room additions",
      "Switchboard upgrades — safety switches, modern distribution boards",
      "Lighting design and installation — interior, exterior, and garden lighting",
      "Swimming pool and spa wiring",
      "Network and data cabling — home offices and media rooms",
      "General maintenance, fault finding, and repairs",
    ],
    projects: ["oakleaf-residence", "the-curve-house", "pukeko", "rainbow-reno"],
  },
  {
    num: "02",
    heading: "Commercial",
    service: "Commercial fit-out",
    img: shot("beechtree-building-headquarters", "01-front-at-dusk"),
    intro:
      "Tenanting, refurbishing or building new. At Beechtree Building's two-storey headquarters we wired it all — the main switchboard and labelled sub-mains for every office and workshop, track lighting and high-bays, a pendant cluster through the stairwell and LED beneath the handrails.",
    bullets: [
      "New office and retail fit-outs",
      "Warehouse and workshop electrical installations",
      "3-phase power installations",
      "Commercial switchboards, sub-mains and cable containment",
      "Exit and emergency lighting — supply, install, and compliance testing",
      "Emergency breakdown and fault finding",
      "Data and voice cabling installations",
    ],
    projects: ["beechtree-building-headquarters"],
  },
  {
    num: "03",
    heading: "Air-Conditioning",
    service: "Air-Conditioning",
    img: shot("rainbow-reno", "02-kitchen", "100% 50%"),
    intro:
      "Victoria is an experienced heat pump installer working with all major brands — from a single high-wall unit in a renovated holiday home to ducted heating throughout a new build. Supply, installation and commissioning, handled by one registered electrician.",
    bullets: [
      "Residential heat pump installation",
      "Ducted heating throughout the home",
      "Commercial multi-zone systems",
      "Heat pump servicing and maintenance",
      "All major brands supplied and installed",
    ],
    projects: ["rainbow-reno", "jarden-mile"],
  },
  {
    num: "04",
    heading: "EV charger installation",
    service: "EV charging",
    img: withArt(
      "ev-charging",
      "Wall-mounted EV charger beside a lit garage at dusk",
      shot("pukeko", "02-driveway-at-dusk", "72% 50%"),
    ),
    intro:
      "EV ownership is growing fast across the Taupō district. A dedicated home charger installed by a registered electrician means faster charging, safer wiring, and an install that's ready for whatever you drive next.",
    bullets: [
      "Level 2 home EV charger installation",
      "Commercial charging points for businesses and rental properties",
      "Load management assessment",
      "All work certified and compliant with NZ electrical standards",
    ],
  },
  {
    num: "05",
    heading: "Maintenance & repairs",
    service: "Something else",
    img: shot("beechtree-building-headquarters", "09-switchboard"),
    intro:
      "Need something fixed? Balance Electrical handles general residential and commercial electrical maintenance and repairs across Taupō — tidy, tested and signed off.",
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
    heading: "New builds",
    service: "New residential build",
    img: shot("kinloch-project", "03-entry-at-dusk"),
    intro:
      "From the first cable through the framing to the last fitting at handover, Balance Electrical works alongside builders, architects and project managers on new homes across the district — including the Gold Award-winning Oakleaf Residence.",
    bullets: [
      "Full new build electrical design and installation",
      "Pre-wiring and first fix, second fix and fit-off",
      "Switchboard design and installation",
      "Exterior and landscape lighting",
      "Smart home pre-wiring and automation-ready installations",
      "Coordination with all other trades throughout the build",
    ],
    projects: ["oakleaf-residence", "sparrowhawk", "kinloch-project", "pre-wires"],
  },
  {
    num: "07",
    heading: "Solar & battery storage",
    service: "Solar & battery storage",
    img: shot("the-sisters", "01-array"),
    intro:
      "Solar power is one of the smartest investments a Taupō homeowner can make — and getting it installed correctly from the start determines how well it performs for the next 25 years. As a registered electrician, Victoria handles the full electrical scope of your solar installation from inverter wiring through to grid connection approval.",
    bullets: [
      "Residential solar panel system wiring and installation",
      "Battery storage system installation — Powerwall and compatible systems",
      "Grid connection and meter upgrades",
      "Solar and EV charger combined installations",
      "Switchboard upgrades for solar-ready homes",
      "Existing system inspections and fault finding",
      "New build solar pre-wiring",
    ],
    closing:
      "Victoria works alongside your solar panel supplier or can recommend trusted local suppliers. The electrical installation, grid connection approval, and sign-off is handled entirely by Balance Electrical.",
    projects: ["the-sisters"],
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
          className="display-caps mt-6 text-[clamp(2.8rem,8.6vw,8.4rem)] leading-[0.95] tracking-[0.08em]"
        >
          Areas of expertise.
        </SplitReveal>
        <Reveal delay={0.5} className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:col-span-6">
            Registered electrical services across Taupō and the surrounding district — seven
            circuits, one standard of work, each shown on a project we've wired.
          </p>
          <div className="flex flex-wrap gap-2 md:col-span-6 md:justify-end">
            {sections.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => jump(i)}
                className="eyebrow h-10 rounded-full border border-ink/20 px-4 text-[10px] transition-colors hover:border-ink hover:bg-ink hover:text-stone-pale"
              >
                {s.num}
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
                  <p className="eyebrow text-ink-soft">Circuit {s.num}</p>
                  <h2 className="display-caps mt-4 text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.05] tracking-[0.1em]">
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
                      <p className="eyebrow text-[10px] text-ink-soft">See it in the portfolio</p>
                      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                        {s.projects.map((slug) => (
                          <li key={slug}>
                            <Link to="/portfolio" hash={slug} className="beam-link text-[0.98rem]">
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
                    Get a quote <ArrowUpRight className="size-3" />
                  </Link>
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
            className="display-caps text-[clamp(2.2rem,5vw,4.4rem)] leading-[1] tracking-[0.1em] text-ivory"
          >
            Not sure what you need?
          </SplitReveal>
          <Reveal>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
              Get in touch and Victoria will talk you through it. No obligation, no jargon.
            </p>
            <Button asChild variant="lux" size="xl" className="mt-10">
              <Link to="/contact">Get a quote</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
