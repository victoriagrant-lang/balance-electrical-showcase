import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LightWords, Reveal } from "@/components/motion/Reveal";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { PORTFOLIO, getPhoto } from "@/lib/portfolio";

const PROOF = [
  { value: "2025", label: "Gold Award home — Master Builders House of the Year" },
  { value: "EWRB", label: "Registered electrician, every job certified" },
  { value: String(PORTFOLIO.length), label: "Projects in the portfolio" },
  { value: "1", label: "Point of contact, first call to final fit-off" },
];

const LEFT = getPhoto("lake-house", "21");
const RIGHT = getPhoto("walnut-house", "03-hall");

/*
  Straight after the hero, the lights go down: a statement that switches on word by word
  as you scroll, two project photographs that warm up as they arrive, and four plain facts.
*/
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      q("[data-lamp]").forEach((img) => {
        gsap.fromTo(
          img,
          { filter: "brightness(0.22) saturate(0.4)", scale: 1.08 },
          {
            filter: "brightness(1) saturate(1)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: img, start: "top 92%", end: "center 55%", scrub: 0.6 },
          },
        );
      });
      gsap.fromTo(
        q("[data-glow]"),
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "center center", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="theme-night relative overflow-hidden bg-night text-ivory"
      aria-labelledby="manifesto-title"
    >
      <div className="led-h absolute inset-x-0 top-0 opacity-80" />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[8%] h-[70vh] w-[70vw]"
        style={{
          background:
            "radial-gradient(45% 50% at 30% 30%, rgb(255 231 194 / 0.13), rgb(242 200 139 / 0.04) 55%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Planned around you</p>
          </Reveal>
          <LightWords
            as="h2"
            id="manifesto-title"
            glow
            className="mt-6 font-display text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.08] text-ivory"
            text="Good electrical work starts with how you use a space — and ends in light you barely notice."
          />
          <Reveal className="mt-10 grid max-w-2xl gap-6 text-[1.05rem] leading-relaxed text-ivory/70 sm:grid-cols-2">
            <p>
              Where you need light. How you heat and cool the house. Where you plug in, switch on
              and spend your time.
            </p>
            <p>
              We plan those details early, so the electrical, lighting and climate systems disappear
              into the architecture — and simply work.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <Link
              to="/portfolio/$slug"
              params={{ slug: "cedar-gables" }}
              className="beam-link eyebrow inline-flex items-center gap-2 text-[10px] text-glow-soft"
            >
              See it in our showhome, Cedar Gables <ArrowRight className="size-3" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-5 items-start gap-4 self-end lg:col-span-5 md:gap-5">
          <figure className="col-span-3 mt-16 overflow-hidden border-[6px] border-frame bg-frame">
            <img
              data-lamp
              src={LEFT.sm}
              alt={`${LEFT.title}, ${LEFT.project}`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-[75%_50%]"
            />
          </figure>
          <figure className="col-span-2 overflow-hidden border-[6px] border-frame bg-frame">
            <img
              data-lamp
              src={RIGHT.sm}
              alt={`${RIGHT.title}, ${RIGHT.project}`}
              loading="lazy"
              decoding="async"
              className="aspect-[2/3] w-full object-cover"
            />
          </figure>
          <figcaption className="eyebrow col-span-5 text-[9px] leading-relaxed text-muted-foreground">
            {LEFT.project} · {RIGHT.project}
          </figcaption>
        </div>
      </div>

      <Reveal
        stagger={0.08}
        className="relative mx-auto grid max-w-[1440px] grid-cols-2 border-t border-ivory/10 px-5 md:px-10 lg:grid-cols-4"
      >
        {PROOF.map((p, i) => (
          <div
            key={p.label}
            className={
              "py-8 pr-6 md:py-12 " +
              (i % 2 === 1 ? "border-l border-ivory/10 pl-6 " : "") +
              (i >= 2 ? "border-t border-ivory/10 lg:border-t-0 " : "") +
              (i === 2 ? "lg:border-l lg:pl-6" : "")
            }
          >
            <p className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none text-glow-soft [text-shadow:0_0_28px_rgb(242_200_139/0.35)]">
              {p.value}
            </p>
            <p className="eyebrow mt-4 max-w-[22ch] text-[10px] leading-relaxed text-ivory/60">
              {p.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
