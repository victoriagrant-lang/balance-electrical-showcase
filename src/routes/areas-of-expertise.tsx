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
import { SITE, collectionPage, jsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";

export const Route = createFileRoute("/areas-of-expertise")({
  head: () => ({
    meta: [
      { title: "Electrical Services Taupō | Balance Electrical" },
      {
        name: "description",
        content:
          "Electrical services in Taupō: new builds, lighting design, commercial, heat pumps, renovations and rewiring, solar, smart homes, EV chargers and repairs.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Areas of Expertise — Balance Electrical" },
      {
        property: "og:description",
        content: "Registered electrical services across Taupō and the surrounding district.",
      },
      { property: "og:url", content: `${SITE}/areas-of-expertise` },
      { property: "og:image", content: photos.kitchen },
    ],
    links: [{ rel: "canonical", href: `${SITE}/areas-of-expertise` }],
    scripts: [
      jsonLd([
        collectionPage(
          "/areas-of-expertise",
          "Electrical services in Taupō",
          SERVICES.map((s) => [s.h1, `/services/${s.slug}`]),
        ),
      ]),
    ],
  }),
  component: AreasOfExpertise,
});

type Area = {
  num: string;
  heading: string;
  service: string;
  /** Shown whole. `w`/`h` (pixels) size the frame before the image loads. */
  img: { src: string; alt: string; credit: string; w: number; h: number };
  /** The opening line, set larger than the rest of the introduction. */
  lead: string;
  intro: string[];
  bullets: string[];
  closing?: string;
  /** Three-beat line that closes the section. */
  tagline: string;
  /** Service pages that go deeper on this area. */
  pages: string[];
  /** Portfolio chapters where this work can be seen. */
  projects?: string[];
};

function shot(slug: string, name: string): Area["img"] {
  const p = getPhoto(slug, name);
  return { src: p.lg, alt: `${p.title}, ${p.project}`, credit: p.project, w: p.w, h: p.h };
}

// `size` is the artwork file's pixel size; update it if the file in src/assets/services/ changes.
function withArt(
  name: ServiceArt,
  alt: string,
  fallback: Area["img"],
  credit: string,
  [w, h]: [number, number],
): Area["img"] {
  const src = serviceImage(name);
  return src ? { src, alt, credit, w, h } : fallback;
}

const sections: Area[] = [
  {
    num: "01",
    pages: ["new-build-electrician-taupo"],
    heading: "New builds",
    service: "New residential build",
    img: shot("cedar-gables", "03-pavilions-at-dusk"),
    lead: "A well-designed electrical system should feel like part of the architecture, not something added at the end.",
    intro: [
      "We work alongside homeowners, builders, architects and designers from the early stages of a new build to coordinate lighting, power, climate, automation and future-ready infrastructure. From first fix through to final commissioning, every detail is considered around the way the home will look, feel and function.",
    ],
    bullets: [
      "Complete electrical design and installation",
      "Architectural lighting design and specification",
      "Smart-home and automation integration",
      "Ducted and integrated air-conditioning systems",
      "Switchboard, power and data infrastructure",
      "Exterior, landscape and feature lighting",
      "Solar, battery and EV-ready provisions",
      "Coordination with builders, architects, joiners and other trades",
      "Pre-wiring and first-fix planning before linings",
      "Final fit-off, testing and commissioning",
    ],
    tagline: "Designed early. Integrated properly. Finished cleanly.",
    projects: ["cedar-gables", "courtyard-house", "hillside-house", "behind-the-walls"],
  },
  {
    num: "02",
    pages: ["lighting-design-taupo"],
    heading: "Lighting design",
    service: "Lighting design",
    img: shot("fold-house", "10"),
    lead: "Good lighting should do more than illuminate a space — it should shape how the home feels.",
    intro: [
      "We design lighting around the architecture, materials and way each space is used, combining task, ambient, feature and exterior lighting into one considered scheme.",
      "From concealed LED and joinery-integrated lighting to pendants, landscape lighting and after-dark exterior effects, every fitting is selected and positioned to work with the home rather than compete with it.",
    ],
    bullets: [
      "Full residential lighting design",
      "Lighting layouts and fitting selection",
      "Architectural and decorative lighting",
      "Concealed LED and linear lighting",
      "Joinery-integrated lighting",
      "Kitchen, bathroom and task lighting",
      "Feature pendants and statement fittings",
      "Exterior, deck and landscape lighting",
      "Lighting scenes and dimming control",
      "Coordination with architects, designers and joiners",
      "Smart-home lighting integration",
      "Final aiming, setup and commissioning",
    ],
    tagline: "Light where it matters. Detail where it counts.",
    projects: ["fold-house", "courtyard-house", "lake-house", "beechtree-studio"],
  },
  {
    num: "03",
    pages: ["commercial-electrician-taupo"],
    heading: "Commercial electrical",
    service: "Commercial fit-out",
    img: shot("beechtree-studio", "01-front-at-dusk"),
    lead: "Commercial electrical systems need to be reliable, practical and properly coordinated from the beginning.",
    intro: [
      "We work with business owners, builders, developers and property managers on commercial new builds, fit-outs and upgrades — delivering power, lighting, distribution, climate and safety systems around the way the space needs to operate.",
      "From offices and showrooms to workshops and commercial premises, we manage the electrical package from planning and first fix through to final testing and commissioning.",
    ],
    bullets: [
      "Complete commercial electrical installations",
      "Office, showroom and workplace fit-outs",
      "Switchboards, distribution and sub-mains",
      "Three-phase power and equipment supplies",
      "Commercial lighting and lighting control",
      "Emergency and exit lighting",
      "Workshop and high-bay lighting",
      "Data and communications cabling",
      "Air-conditioning and mechanical electrical services",
      "Electrical upgrades and alterations",
      "Fault finding, testing and maintenance",
      "Coordination with builders and other trades",
    ],
    tagline: "Built for business. Delivered with detail.",
    projects: ["beechtree-studio"],
  },
  {
    num: "04",
    pages: ["air-conditioning-heating-taupo"],
    heading: "Air conditioning",
    service: "Air conditioning & heating",
    img: shot("walnut-house", "02-galley"),
    lead: "Comfort should be felt, not seen.",
    intro: [
      "We design and install air-conditioning systems around the way a home is built and lived in — from discreet high-wall units to fully ducted systems integrated into ceilings, joinery and architectural details.",
      "Where the project allows, we coordinate grilles, ducting and controls with builders, designers and joiners so the finished system feels considered from the beginning rather than added afterwards.",
    ],
    bullets: [
      "Ducted whole-home air conditioning",
      "High-wall and floor-mounted heat pumps",
      "Multi-zone climate control",
      "Custom grilles integrated into joinery and ceilings",
      "Heating and cooling for new builds and renovations",
      "Residential and light-commercial systems",
      "Smart-home climate integration",
      "System design, sizing and equipment selection",
      "Supply, installation and commissioning",
      "Servicing and maintenance",
    ],
    tagline: "Comfort, built into the design.",
    projects: ["walnut-house", "cedar-cube-house", "black-gable-house", "twin-pavilions"],
  },
  {
    num: "05",
    pages: ["renovation-electrician-taupo"],
    heading: "Renovations & upgrades",
    service: "Renovation or addition",
    img: shot("the-arches", "01-lounge"),
    lead: "Renovations are the opportunity to rethink how a home works — not just how it looks.",
    intro: [
      "We coordinate lighting, power, climate and electrical upgrades around the new layout, joinery and finishes, making sure the services feel integrated into the renovation rather than added on afterwards.",
      "From a single-room update to a full-home transformation, we can work alongside your builder and designer from planning through to final fit-off.",
    ],
    bullets: [
      "Full electrical upgrades for renovations and extensions",
      "Rewiring and additional circuits",
      "Switchboard upgrades and safety improvements",
      "Architectural lighting design",
      "Kitchen, bathroom and joinery-integrated lighting",
      "Exterior, deck and landscape lighting",
      "High-wall and ducted air-conditioning upgrades",
      "Smart-home and automation additions",
      "Power, data and EV-ready provisions",
      "Final testing, fit-off and commissioning",
    ],
    tagline: "Reworked with purpose. Finished with detail.",
    projects: ["the-arches", "walnut-house"],
  },
  {
    num: "06",
    pages: ["solar-installation-taupo"],
    heading: "Solar & battery",
    service: "Solar & battery storage",
    img: shot("twin-pavilions", "01-array"),
    lead: "Solar should feel like part of the home’s electrical system — not a separate add-on.",
    intro: [
      "We design and install solar and battery systems around the property, switchboard and future energy needs, with careful coordination from roof layout through to grid connection and commissioning.",
      "For new builds, we can plan solar infrastructure early so cabling, switchboard capacity, battery location and EV charging provisions are considered before the home is finished.",
    ],
    bullets: [
      "Residential solar system design and installation",
      "Battery storage and integration",
      "Grid connection and metering requirements",
      "Switchboard upgrades for solar-ready homes",
      "Solar and EV charger integration",
      "New-build solar pre-wiring",
      "Existing system inspections and fault finding",
      "System monitoring and commissioning",
      "Coordination with builders and roofing contractors",
    ],
    tagline: "Energy, planned for the way you live.",
    projects: ["twin-pavilions"],
  },
  {
    num: "07",
    pages: ["smart-home-automation-taupo"],
    heading: "Smart home & automation",
    service: "Smart home & automation",
    img: withArt(
      "smart-home",
      "Smart-home control modules and circuit protection, neatly wired in a joinery-housed cabinet",
      shot("black-ridge-house", "04-kitchen-to-living"),
      "Automation control cabinet",
      [1122, 1402],
    ),
    lead: "Technology should make a home easier to live in — not more complicated.",
    intro: [
      "We design and integrate smart-home systems that bring lighting, climate, selected power and automation together into one simple control platform. The system is planned around how the home is actually used, with scenes and controls that feel intuitive from day one.",
      "Whether it’s a full new-build automation system or selected smart features added during a renovation, we coordinate the technology with the electrical, lighting and air-conditioning so everything works together cleanly.",
    ],
    bullets: [
      "Smart-home system design and integration",
      "Lighting control and scene setting",
      "Climate control integration",
      "Automated schedules and routines",
      "Centralised control of selected electrical systems",
      "App and wall-control integration",
      "Smart-home pre-wiring for new builds",
      "Integration with lighting, air conditioning and selected blinds or devices",
      "Future-ready electrical infrastructure",
      "Coordination with builders, designers and joiners",
      "System setup, testing and handover",
    ],
    tagline: "Smarter control. Simpler living.",
    projects: ["black-ridge-house", "cedar-gables"],
  },
  {
    num: "08",
    pages: ["ev-charger-installation-taupo"],
    heading: "EV charging",
    service: "EV charging",
    img: withArt(
      "ev-charging",
      "Wall-mounted EV charger beside a lit garage at dusk",
      shot("black-gable-house", "02-driveway-at-dusk"),
      "EV charging",
      [1536, 1024],
    ),
    lead: "Charging at home or work should feel simple, reliable and properly integrated into the electrical system.",
    intro: [
      "We assess the existing supply, charger location and expected usage, then design and install an EV charging solution that suits the property now and leaves room for future demand.",
      "Where required, we can coordinate load management, switchboard upgrades and solar integration so the charger works efficiently with the rest of the electrical system.",
    ],
    bullets: [
      "Residential EV charger installation",
      "Commercial and workplace charging points",
      "Electrical supply and load assessment",
      "Dedicated circuits and protection",
      "Load management solutions",
      "Switchboard upgrades where required",
      "Solar and EV charging integration",
      "Charger positioning and cable routing",
      "Installation, testing and certification",
      "Future-ready provisions for additional charging",
    ],
    tagline: "Charging, built into the way you live.",
  },
  {
    num: "09",
    pages: ["maintenance-electrician-taupo"],
    heading: "Maintenance & repairs",
    service: "Maintenance & repairs",
    img: shot("beechtree-studio", "09-switchboard"),
    lead: "Reliable electrical work matters just as much after the project is finished.",
    intro: [
      "We provide fault finding, repairs and ongoing electrical maintenance for homes and businesses across Taupō, with a focus on clear communication, tidy workmanship and getting the issue resolved properly.",
      "Whether it’s a small fault, an upgrade, or ongoing maintenance for a commercial property, we approach the work with the same care and attention to detail as our larger projects.",
    ],
    bullets: [
      "Electrical fault finding and diagnosis",
      "Switchboard and safety-switch upgrades",
      "Power point and lighting additions",
      "Repairs to existing electrical systems",
      "Landlord and property electrical maintenance",
      "Commercial maintenance and callouts",
      "Testing and compliance checks",
      "Lighting faults and replacements",
      "Minor alterations and upgrade work",
    ],
    tagline: "Reliable work. Properly resolved.",
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
        <h1>
          <span className="eyebrow block text-ink-soft">Electrical services in Taupō</span>
          <SplitReveal
            as="span"
            immediate
            delay={0.2}
            className="display-caps mt-6 block max-w-5xl text-balance text-[clamp(2rem,5.6vw,5.5rem)] leading-[0.95] tracking-[0.08em]!"
          >
            Electrical expertise. From start to finish.
          </SplitReveal>
        </h1>
        <Reveal delay={0.5} className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-md font-display text-[clamp(1.35rem,2vw,1.8rem)] leading-snug text-ink md:col-span-5">
            One team from planning and first fix through to final fit-off, commissioning and
            maintenance, for homes and businesses across Taupō.
          </p>
          {/* One swipeable row on phones; wraps on larger screens. */}
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:col-span-7 md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0">
            {sections.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => jump(i)}
                aria-label={`View ${s.heading}`}
                className="eyebrow min-h-10 shrink-0 whitespace-nowrap rounded-full border border-ink/20 px-4 text-[10px] transition-colors hover:border-ink hover:bg-ink hover:text-stone-pale"
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
                  {/* The frame takes the photograph's own shape, so the whole image is seen;
                      tall ones are capped to --cap high and sit against the page edge. The width
                      is worked out from the photo's proportions, so the frame is the right size
                      before the image arrives and the page doesn't jump as photos load. */}
                  <div
                    className={cn(
                      "relative mx-auto overflow-hidden border-[length:var(--bw)] border-frame bg-frame [--bw:8px] [--cap:75svh] md:[--bw:10px] lg:[--cap:calc(100svh-180px)]",
                      flip ? "lg:mr-0" : "lg:ml-0",
                    )}
                    style={{
                      width: `min(100%, calc(var(--cap) * ${s.img.w / s.img.h} + 2 * var(--bw)))`,
                    }}
                  >
                    <img
                      src={s.img.src}
                      alt={s.img.alt}
                      width={s.img.w}
                      height={s.img.h}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className={cn(
                        "block h-auto w-full transition-[filter,transform] duration-[1400ms] [transition-timing-function:var(--ease-out-expo)]",
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
                  <p className="mt-6 font-display text-[clamp(1.3rem,1.8vw,1.65rem)] leading-snug text-ink">
                    {s.lead}
                  </p>
                  {s.intro.map((para) => (
                    <p key={para} className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft">
                      {para}
                    </p>
                  ))}
                  <ul className="mt-8 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-4 leading-relaxed">
                        <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ink/50" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {s.closing && <p className="mt-8 leading-relaxed text-ink-soft">{s.closing}</p>}
                  <p className="display-caps mt-10 border-l border-ink/30 pl-5 text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.55] tracking-[0.14em]!">
                    {s.tagline.split(/(?<=\.)\s+/).map((beat) => (
                      <span key={beat} className="block">
                        {beat}
                      </span>
                    ))}
                  </p>
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
