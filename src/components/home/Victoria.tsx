import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import portrait from "@/assets/victoria-portrait.webp";
import { Button } from "@/components/ui/button";
import { BalanceWordmark } from "@/components/brand/BrandName";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";

const STATS = [
  { value: "Local", label: "Taupō owned & operated" },
  { value: "EWRB", label: "registered & licensed" },
  { value: "Expertise", label: "Residential & commercial" },
];

export function Victoria() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      // A spotlight opening on the portrait, like an iris.
      gsap.fromTo(
        q("[data-portrait]"),
        { clipPath: "circle(9% at 50% 36%)", scale: 1.18 },
        {
          clipPath: "circle(100% at 50% 36%)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "center 55%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-44"
      aria-labelledby="victoria-title"
    >
      <div className="grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden border-[6px] border-frame bg-frame md:border-[10px]">
            <img
              data-portrait
              src={portrait}
              alt="Victoria Grant, owner and registered electrician at Balance Electrical"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 55% at 30% 0%, rgb(255 236 206 / 0.35), transparent 70%)",
                mixBlendMode: "soft-light",
              }}
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="eyebrow text-ink-soft">Owner-operator · Registered electrician</p>
          <SplitReveal
            as="h2"
            id="victoria-title"
            className="display-caps mt-5 text-balance text-[clamp(2rem,3.8vw,3.5rem)] leading-[1.1] tracking-[0.05em]!"
          >
            Local knowledge. Personal commitment.
          </SplitReveal>
          <Reveal>
            <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
              <BalanceWordmark /> Electrical is owned and operated by Victoria Grant, a registered
              and licensed electrician raised in Taupō.
            </p>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
              After training in Wellington, Victoria returned home to establish a business built
              around thoughtful work and personal service. Her experience spans new homes,
              renovations and commercial projects, with the same attention given to the planning and
              the finished installation.
            </p>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
              When you work with Balance, you deal directly with the person responsible for your
              project.
            </p>
          </Reveal>
          <Reveal
            stagger={0.1}
            className="mt-12 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-3"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl leading-none">{s.value}</p>
                <p className="eyebrow mt-3 text-[10px] leading-relaxed text-ink-soft">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-12">
            <Button asChild variant="luxOutline" size="xl">
              <Link to="/about">
                Meet Victoria <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
