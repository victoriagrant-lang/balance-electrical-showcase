import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, SplitText, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { HeroReveal } from "./HeroReveal";

/* The pointer parts the stone to uncover the lit room beneath the headline. */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);

      // The whole heading is split (so it keeps its accessible name), except the small line.
      const title = SplitText.create(q("#hero-title"), {
        type: "words,chars",
        ignore: "[data-hero-fade]",
      });
      const fades = q("[data-hero-fade]");

      gsap.set(title.chars, { opacity: 0 });
      gsap.set(fades, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ paused: true });
      // Each letter flickers on like a warming filament.
      tl.to(
        title.chars,
        {
          keyframes: { opacity: [0, 0.85, 0.15, 0.6, 1] },
          duration: 0.6,
          ease: "none",
          stagger: { each: 0.035, from: "random" },
        },
        0.25,
      ).to(fades, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.08, ease: "expo.out" }, 0.9);

      const off = onIntroDone(() => tl.play());

      // Scrolling away: type drifts up and the lights dim a touch.
      gsap.to(q("[data-hero-inner]"), {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-switch-knob]"), {
        y: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=120", scrub: true },
      });

      return () => {
        off();
        title.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-stone-pale text-ink"
      aria-labelledby="hero-title"
    >
      <HeroReveal host={root} />

      <div
        data-hero-inner
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-5 pb-10 pt-32 md:px-10 md:pb-14 md:pt-40"
      >
        <div
          data-hero-fade
          className="flex flex-wrap items-center justify-between gap-3 text-ink-soft"
        >
          <p className="eyebrow">Electrical · Lighting · Air-Conditioning · Solar</p>
          <p className="eyebrow">Taupō and the surrounding district</p>
        </div>

        <div className="mt-12 md:mt-8">
          {/* The small line names the trade and the town, so the page's main heading does too. */}
          <h1
            id="hero-title"
            className="display-caps text-[clamp(1.55rem,4.3vw,4.4rem)] leading-[1.08] tracking-[0.03em] text-ink"
            style={{ letterSpacing: "0.03em" }}
          >
            <span data-hero-fade className="eyebrow mb-5 block text-ink-soft">
              Registered electrician in Taupō
            </span>{" "}
            <span className="block">Electrical, lighting &amp; air-conditioning.</span>{" "}
            <span className="block text-ink/55">Considered together.</span>
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
            <div data-hero-fade className="flex items-start gap-5 md:col-span-5">
              <span className="mt-3 h-px w-14 shrink-0 bg-ink/35" />
              <p className="max-w-sm text-base leading-relaxed text-ink-soft">
                Thoughtfully planned and expertly installed by Taupō electrician Victoria Grant,
                with a personal approach from the first conversation to the finished installation.
              </p>
            </div>
            <div data-hero-fade className="md:col-span-5 md:col-start-8">
              <p className="max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
                From high-end new builds and renovations to commercial fit-outs, lighting design,
                smart-home integration, air conditioning, solar and{" "}
                <Link
                  to="/services/$slug"
                  params={{ slug: "maintenance-electrician-taupo" }}
                  className="beam-link text-ink underline decoration-ink/30 underline-offset-4"
                >
                  maintenance and repairs
                </Link>
                , we deliver considered systems that work seamlessly with the architecture.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="lux" size="xl">
                  <Link to="/contact" data-cursor="Let's talk">
                    Discuss your project <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="luxOutline" size="xl">
                  <Link to="/portfolio">View our work</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-fade className="mt-14 flex items-center gap-4 text-ink-soft md:mt-10">
          {/* a light switch that flips as you start to scroll */}
          <span
            aria-hidden
            className="relative flex h-9 w-5 justify-center rounded-[5px] border border-ink/35 p-[3px]"
          >
            <span data-switch-knob className="h-3 w-full rounded-[2px] bg-ink/70" />
          </span>
          <span className="eyebrow text-[9px] leading-relaxed text-ink-soft">
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">
              Move your cursor to reveal
            </span>
            <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Drag to reveal</span>
            <br />
            Scroll to explore
          </span>
          <span className="relative ml-2 hidden h-10 w-px overflow-hidden bg-ink/15 md:block">
            <span className="absolute inset-0 animate-cue bg-ink/50" />
          </span>
        </div>
      </div>
    </section>
  );
}
