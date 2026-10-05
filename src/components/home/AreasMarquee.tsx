import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const ROWS = [
  ["Taupō", "Kinloch", "Acacia Bay", "Wairakei", "Kuratau"],
  ["Tūrangi", "Ātiamuri", "Rainbow Point", "Nukuhau", "Central Plateau"],
];

/** A place name in running text, linked to its area page. */
function Place({ slug, children }: { slug: string; children: string }) {
  return (
    <Link
      to="/areas/$slug"
      params={{ slug }}
      className="beam-link text-ink underline decoration-ink/30 underline-offset-4"
    >
      {children}
    </Link>
  );
}

function Row({ words, lit }: { words: string[]; lit?: boolean }) {
  // Doubled so the strip never runs out while it slides.
  const all = [...words, ...words, ...words];
  return (
    <div
      data-row
      className="flex w-max items-center gap-[4vw] whitespace-nowrap will-change-transform"
    >
      {all.map((w, i) => (
        <span key={i} className="flex items-center gap-[4vw]">
          <span
            className={
              lit
                ? "display-caps text-[clamp(3rem,9vw,8.5rem)] leading-none tracking-[0.08em] text-ink [text-shadow:0_0_40px_rgb(255_236_206/0.55)]"
                : "display-caps text-outline text-[clamp(3rem,9vw,8.5rem)] leading-none tracking-[0.08em]"
            }
          >
            {w}
          </span>
          <span className="size-2 rounded-full bg-ink/25" />
        </span>
      ))}
    </div>
  );
}

/*
  Place names slide past a fixed beam of light at the centre of the page;
  each one is outlined until it crosses the beam and fills in.
*/
export function AreasMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      q("[data-lane]").forEach((lane, i) => {
        const rows = lane.querySelectorAll("[data-row]");
        gsap.fromTo(
          rows,
          { xPercent: i % 2 ? -33 : 0 },
          {
            xPercent: i % 2 ? 0 : -33,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden py-24 md:py-36"
      aria-labelledby="areas-title"
    >
      <p id="areas-title" className="eyebrow mb-12 px-5 text-center text-ink-soft md:mb-16">
        Based in Taupō. Working throughout the district.
      </p>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[28vw] -translate-x-1/2"
        style={{
          background: "linear-gradient(90deg, transparent, rgb(255 244 228 / 0.5), transparent)",
          mixBlendMode: "soft-light",
        }}
      />
      <div className="space-y-4 md:space-y-6">
        {ROWS.map((words, i) => (
          <div key={i} data-lane aria-hidden className="relative">
            <Row words={words} />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 30%, #000 44%, #000 56%, transparent 70%)",
                maskImage:
                  "linear-gradient(90deg, transparent 30%, #000 44%, #000 56%, transparent 70%)",
              }}
            >
              <Row words={words} lit />
            </div>
          </div>
        ))}
      </div>
      <div className="relative mx-auto mt-12 max-w-2xl px-5 text-center">
        <p className="leading-relaxed text-ink-soft">
          We work with homeowners, builders and businesses across Taupō,{" "}
          <Place slug="kinloch">Kinloch</Place>, <Place slug="acacia-bay">Acacia Bay</Place>,{" "}
          <Place slug="wairakei">Wairakei</Place>, Kuratau, <Place slug="turangi">Tūrangi</Place>,
          Ātiamuri and the wider Central Plateau.
        </p>
        <Link to="/contact" className="beam-link mt-6 inline-block text-sm">
          Discuss your location and project
        </Link>
      </div>
    </section>
  );
}
