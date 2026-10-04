import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getPhoto } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/Reveal";
import { TorchArea } from "@/components/motion/Torch";
import { Lightbox, type Shot } from "@/components/Lightbox";

function shot(slug: string, name: string, aspect: string): Shot {
  const p = getPhoto(slug, name);
  return { src: p.lg, title: p.title, place: p.project, note: p.caption, aspect };
}

const WORK: Shot[][] = [
  [
    shot("oakleaf-residence", "04-kitchen-and-dining", "aspect-[4/5]"),
    shot("pukeko", "01-front-at-dusk", "aspect-square"),
  ],
  [
    shot("beechtree-building-headquarters", "03-stairwell-pendants", "aspect-[3/4]"),
    shot("the-lakehouse", "01-island", "aspect-[4/5]"),
  ],
  [
    shot("sparrowhawk", "02-deck-at-sunset", "aspect-[4/5]"),
    shot("kinloch-project", "04-front-door", "aspect-[3/4]"),
  ],
];

/*
  The gallery at night: the cursor is the only light in the room.
  Touch devices get each photograph switching on as it scrolls into view.
*/
export function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const flat = WORK.flat();
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      const cols = q("[data-col]");
      gsap.to(cols[1], {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(cols[2], {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  let index = -1;
  return (
    <section
      ref={root}
      data-night
      className="theme-night relative overflow-hidden bg-night pb-32 pt-8 md:pb-48"
      aria-labelledby="work-title"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8 pb-16 md:pb-24">
          <div>
            <p className="eyebrow text-muted-foreground">Recent work</p>
            <SplitReveal
              as="h2"
              id="work-title"
              className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em] text-ivory"
            >
              Our work, in detail.
            </SplitReveal>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Explore electrical installations and lighting across homes and commercial spaces in
              Taupō and the surrounding district.
            </p>
          </div>
          <Button asChild variant="luxOutline" size="xl">
            <Link to="/portfolio">View all projects</Link>
          </Button>
        </div>

        <TorchArea>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {WORK.map((col, c) => (
              <div
                key={c}
                data-col
                className={cn(
                  "flex flex-col gap-6 md:gap-8",
                  c === 1 && "md:mt-40",
                  c === 2 && "md:mt-16",
                )}
              >
                {col.map((shot) => {
                  index += 1;
                  const i = index;
                  return (
                    <button
                      key={shot.title}
                      type="button"
                      data-shot
                      data-cursor="View"
                      onClick={() => setOpen(i)}
                      className="group relative block w-full overflow-hidden text-left"
                    >
                      <img
                        src={shot.src}
                        alt={`${shot.title}, ${shot.place}`}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          "w-full object-cover transition-[filter,transform] duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03] max-md:[filter:brightness(0.4)] max-md:group-data-[lit]:[filter:brightness(1)]",
                          shot.aspect ?? "aspect-[4/5]",
                        )}
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        <span className="eyebrow block text-[10px] text-glow-soft/90">
                          {shot.place}
                        </span>
                        <span className="mt-1 block font-display text-2xl text-ivory">
                          {shot.title}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </TorchArea>
      </div>

      <Lightbox shots={flat} index={open} onIndex={setOpen} />
    </section>
  );
}
