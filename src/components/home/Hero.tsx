import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, SplitText, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

const LIGHTS = 7;

/*
  The stone panel from the sign, lit like a gallery wall: a row of downlights
  at the ceiling line switches on, and the headline warms up like filaments.
*/
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);

      const title = SplitText.create(q("[data-hero-title]"), { type: "words,chars" });
      const fixtures = q("[data-fixture]");
      const groups = q("[data-pool-group]");
      const fades = q("[data-hero-fade]");

      gsap.set(title.chars, { opacity: 0 });
      // Opacity goes on the blended layers themselves: fading a wrapper would
      // isolate them and break the soft-light blend mid-transition.
      gsap.set([...fixtures, ...q("[data-pool]")], { opacity: 0 });
      gsap.set(fades, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ paused: true });
      fixtures.forEach((fx, i) => {
        const at = i * 0.08;
        tl.to(fx, { keyframes: { opacity: [0, 1, 0.2, 1] }, duration: 0.35, ease: "none" }, at).to(
          groups[i].children,
          { opacity: 1, duration: 1.4, ease: "power2.out" },
          at + 0.2,
        );
      });
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
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* ceiling line with downlights washing the stone */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="absolute inset-x-0 top-0 h-px bg-ink/15" />
        <div className="absolute inset-x-0 top-0 flex justify-around px-[4vw]">
          {Array.from({ length: LIGHTS }).map((_, i) => (
            <div
              key={i}
              className="relative flex w-0 justify-center max-md:[&:nth-child(even)]:hidden"
            >
              <span
                data-fixture
                className="absolute top-0 h-[3px] w-7 rounded-b-full bg-glow-soft shadow-[0_0_16px_4px_rgb(255_231_194/0.85)]"
              />
              <span data-pool-group className="absolute top-0 flex justify-center">
                <span
                  data-pool
                  className="absolute top-0 h-[80svh] w-[30vw] min-w-56 max-w-[460px]"
                  style={{
                    background:
                      "radial-gradient(50% 60% at 50% 0%, rgb(255 246 230 / 0.95), rgb(255 234 204 / 0.35) 45%, transparent 78%)",
                    mixBlendMode: "soft-light",
                  }}
                />
                <span
                  data-pool
                  className="absolute top-0 h-[46svh] w-[16vw] min-w-32 max-w-[240px]"
                  style={{
                    background:
                      "radial-gradient(50% 58% at 50% 0%, rgb(255 238 212 / 0.22), rgb(255 230 196 / 0.06) 55%, transparent 80%)",
                    mixBlendMode: "screen",
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

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

        <div className="mt-16 md:mt-12">
          <h1
            id="hero-title"
            data-hero-title
            className="display-caps text-balance text-[clamp(1.7rem,5.6vw,5.5rem)] leading-[1.1] tracking-[0.03em] text-ink"
            style={{ letterSpacing: "0.03em" }}
          >
            Thoughtfully planned. Expertly installed.
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
            <div data-hero-fade className="flex items-start gap-5 md:col-span-5">
              <span className="mt-3 h-px w-14 shrink-0 bg-ink/40" />
              <p className="max-w-sm text-base leading-relaxed text-ink-soft">
                Led by local electrician Victoria Grant, with a personal approach from the first
                conversation to the finished installation.
              </p>
            </div>
            <div data-hero-fade className="md:col-span-5 md:col-start-8">
              <p className="max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
                Electrical work and lighting design for homes and businesses across Taupō. From new
                builds and renovations to commercial fit-outs, Balance Electrical brings careful
                planning and attention to detail to every project.
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
            <span data-switch-knob className="h-3 w-full rounded-[2px] bg-ink/80" />
          </span>
          <span className="eyebrow text-[10px]">Scroll to explore</span>
          <span className="relative ml-2 hidden h-10 w-px overflow-hidden bg-ink/15 md:block">
            <span className="absolute inset-0 animate-cue bg-ink/70" />
          </span>
        </div>
      </div>
    </section>
  );
}
