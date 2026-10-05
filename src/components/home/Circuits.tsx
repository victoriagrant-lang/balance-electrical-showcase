import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getPhoto, type PortfolioPhoto } from "@/lib/portfolio";
import { serviceImage, type ServiceArt } from "@/lib/service-images";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/Reveal";

type Card = { src: string; alt: string; focus: string };

// `focus` is the object-position that keeps the relevant detail inside the 4:5 crop.
function fromPhoto(p: PortfolioPhoto & { project: string }, focus = "50% 50%"): Card {
  return { src: p.lg, alt: `${p.title}, ${p.project}`, focus };
}

// Generated service artwork wins when present; otherwise the closest project photo.
function art(name: ServiceArt, alt: string, fallback: Card): Card {
  const src = serviceImage(name);
  return src ? { src, alt, focus: "50% 50%" } : fallback;
}

// Same order as the Expertise page.
const SERVICES = [
  {
    title: "New builds",
    page: "new-build-electrician-taupo",
    service: "New residential build",
    card: fromPhoto(getPhoto("cedar-gables", "03-pavilions-at-dusk"), "40% 50%"),
    copy: "Electrical, lighting, climate and automation planned alongside your build — from first fix through to final commissioning, so every detail feels part of the architecture.",
  },
  {
    title: "Lighting design",
    page: "lighting-design-taupo",
    service: "Lighting design",
    card: fromPhoto(getPhoto("fold-house", "07")),
    copy: "Task, ambient, feature and exterior lighting combined into one considered scheme — every fitting selected and positioned to work with the home, not compete with it.",
  },
  {
    title: "Commercial electrical",
    page: "commercial-electrician-taupo",
    service: "Commercial fit-out",
    card: fromPhoto(getPhoto("beechtree-studio", "02-entry-at-dusk")),
    copy: "Practical electrical solutions for workplaces and commercial spaces. Our services include office and retail fit-outs, three-phase power, emergency lighting and compliance testing.",
  },
  {
    title: "Air conditioning",
    page: "air-conditioning-heating-taupo",
    service: "Air conditioning & heating",
    card: fromPhoto(getPhoto("walnut-house", "02-galley"), "50% 30%"),
    copy: "Comfort should be felt, not seen. From discreet high-wall units to fully ducted systems with grilles built into ceilings and joinery.",
  },
  {
    title: "Renovations & upgrades",
    page: "renovation-electrician-taupo",
    service: "Renovation or addition",
    card: fromPhoto(getPhoto("the-arches", "01-lounge")),
    copy: "A chance to rethink how a home works, not just how it looks. Lighting, power and climate upgrades coordinated around the new layout, joinery and finishes.",
  },
  {
    title: "Solar & battery",
    page: "solar-installation-taupo",
    service: "Solar & battery storage",
    card: fromPhoto(getPhoto("twin-pavilions", "01-array")),
    copy: "Make more of the energy your property can generate. We help with solar electrical installation, grid connection and battery storage options suited to your property and energy use.",
  },
  {
    title: "Smart home & automation",
    page: "smart-home-automation-taupo",
    service: "Smart home & automation",
    card: art(
      "smart-home",
      "Smart-home control modules, neatly wired in a joinery-housed cabinet",
      fromPhoto(getPhoto("black-ridge-house", "04-kitchen-to-living")),
    ),
    copy: "Lighting, climate, selected power and automation brought together into one simple control platform — planned around how the home is actually used.",
  },
  {
    title: "EV charging",
    page: "ev-charger-installation-taupo",
    service: "EV charging",
    card: art(
      "ev-charging",
      "Wall-mounted EV charger beside a lit garage at dusk",
      fromPhoto(getPhoto("black-gable-house", "02-driveway-at-dusk"), "72% 50%"),
    ),
    copy: "Convenient charging at home. We install dedicated EV chargers, with load management options to suit your electrical supply and household needs.",
  },
];

export function Circuits() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const track = q("[data-track]")[0] as HTMLElement;
      const cards = q("[data-card]");
      const counter = q("[data-counter]")[0];
      const bar = q("[data-progress]")[0];

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "bottom bottom",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
          },
        });
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: tween,
            start: "left 72%",
            end: "right 28%",
            onToggle: (self) => {
              card.toggleAttribute("data-lit", self.isActive);
              if (self.isActive) counter.textContent = String(i + 1).padStart(2, "0");
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Small screens: native swipe; the card in view switches on.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(min-width: 768px)").matches) return;
    const track = el.querySelector("[data-track]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-lit", e.isIntersecting)),
      { root: track, threshold: 0.6 },
    );
    el.querySelectorAll("[data-card]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} aria-labelledby="circuits-title" className="relative">
      {/* Sized to its content (not a full-screen panel) so no dead stone sits above it. */}
      <div data-pin className="flex flex-col py-20 md:py-14">
        <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between gap-8 px-5 md:px-10">
          <div>
            <p className="eyebrow text-ink-soft">What we do</p>
            <SplitReveal
              as="h2"
              id="circuits-title"
              className="display-caps mt-5 max-w-[24ch] text-balance text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.1] tracking-[0.05em]!"
            >
              Expertise for every part of your project.
            </SplitReveal>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">
              Building from the ground up, improving an existing property or fitting out a business?
              We’ll help you plan and install the electrical systems your space needs.
            </p>
          </div>
          <p className="eyebrow hidden shrink-0 text-ink-soft md:block">
            <span data-counter className="text-ink">
              01
            </span>{" "}
            / {String(SERVICES.length).padStart(2, "0")}
          </p>
        </div>

        <div
          data-track
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mt-12 md:snap-none md:gap-8 md:overflow-visible md:pl-[max(40px,calc((100vw-1440px)/2+40px))] md:pr-[12vw]"
        >
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              data-card
              className="group relative w-[78vw] shrink-0 snap-center sm:w-[46vw] md:w-[min(30vw,420px,calc((100svh-440px)*0.8))] md:min-w-[260px]"
            >
              <div className="flex items-center justify-between text-ink-soft">
                <span className="eyebrow text-[10px]">Ch {String(i + 1).padStart(2, "0")}</span>
                <span className="size-1.5 rounded-full bg-ink/30 transition-all duration-500 group-data-[lit]:bg-glow-soft group-data-[lit]:shadow-[0_0_10px_3px_rgb(255_231_194/0.9)]" />
              </div>
              <div className="relative mt-4 aspect-[4/5] overflow-hidden border-[6px] border-frame bg-frame md:aspect-[4/3] md:max-h-[26svh]">
                <img
                  src={s.card.src}
                  alt={`${s.title} — ${s.card.alt}`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: s.card.focus }}
                  className="h-full w-full object-cover transition-[filter,transform] duration-[1400ms] [filter:brightness(0.38)_saturate(0.45)] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:[filter:brightness(1)_saturate(1)] group-data-[lit]:[filter:brightness(1)_saturate(1)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-2/3 opacity-0 transition-opacity duration-[1400ms] group-hover:opacity-100 group-data-[lit]:opacity-100"
                  style={{
                    background:
                      "radial-gradient(45% 60% at 50% 0%, rgb(255 236 206 / 0.4), transparent 75%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
              <h3 className="display-caps mt-6 text-[1.55rem] tracking-[0.14em]">{s.title}</h3>
              <p className="mt-3 max-w-[36ch] text-[0.98rem] leading-relaxed text-ink-soft">
                {s.copy}
              </p>
              <Link
                to="/contact"
                search={{ service: s.service }}
                className="beam-link eyebrow mt-5 inline-flex items-center gap-2 text-[10px]"
              >
                Discuss your project <ArrowUpRight className="size-3" />
              </Link>
              <Link
                to="/services/$slug"
                params={{ slug: s.page }}
                className="beam-link eyebrow mt-3 flex w-fit items-center gap-2 text-[10px] text-ink-soft"
              >
                {s.title} in Taupō
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-[1440px] px-10 md:block">
          <div className="relative h-px bg-ink/15">
            <div
              data-progress
              className="absolute inset-0 origin-left bg-ink"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
