import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/hooks/use-lenis";
import { HOUSE_SRC, HouseDrawing, HouseLights } from "./HouseScene";

/*
  Scrolltelling, skydive-style: one pinned scene, scroll advances the scene.
  Drawing → dusk → nightfall → five lighting channels switch on in turn.
  A progress counter and lighting keypad track the scene.
*/

const CHAPTERS = [
  {
    at: 0,
    label: "Plan",
    title: "Start with the architecture and the way people move through the home.",
  },
  {
    at: 0.14,
    label: "Dusk",
    title: "As daylight fades, lighting gives the outdoor spaces a different character.",
  },
  {
    at: 0.26,
    label: "After dark",
    title: "Each layer has a purpose. Together, they create a complete picture.",
  },
  {
    at: 0.38,
    label: "Channel 01 · Soffit",
    title: "Soft light reveals the warmth and texture of the timber.",
  },
  {
    at: 0.5,
    label: "Channel 02 · Stonework",
    title: "Directional light brings depth to the stonework.",
  },
  {
    at: 0.62,
    label: "Channel 03 · Path",
    title: "Low-level lighting helps guide the way to the entrance.",
  },
  {
    at: 0.74,
    label: "Channel 04 · Garden",
    title: "Illuminated planting gives the garden depth after dark.",
  },
  {
    at: 0.86,
    label: "Channel 05 · Interior",
    title: "A warm interior completes the welcome.",
  },
];

const CHANNELS = [
  { name: "Soffit", at: 0.38, level: 30 },
  { name: "Stonework", at: 0.5, level: 65 },
  { name: "Path", at: 0.62, level: 40 },
  { name: "Garden", at: 0.74, level: 80 },
  { name: "Interior", at: 0.86, level: 100 },
];

const RAMP = 0.05;

export function DuskToNight() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const plate = q("[data-plate]")[0] as HTMLElement;
      const pan = q("[data-pan]")[0] as HTMLElement;
      const draws = q("[data-draw]");
      const captions = q("[data-caption]");
      const leds = q("[data-led]");
      const levels = q("[data-level]");
      const count = q("[data-count]")[0];
      const bar = q("[data-bar]")[0];

      let lastChapter = -1;
      const lastLevels = CHANNELS.map(() => -1);

      const hud = (p: number) => {
        let ch = 0;
        CHAPTERS.forEach((c, i) => {
          if (p >= c.at) ch = i;
        });
        if (ch !== lastChapter) {
          captions.forEach((c, i) => c.toggleAttribute("data-active", i === ch));
          count.textContent = String(ch + 1).padStart(2, "0");
          lastChapter = ch;
        }
        CHANNELS.forEach((c, i) => {
          const lv = Math.round(gsap.utils.clamp(0, 1, (p - c.at) / RAMP) * c.level);
          if (lv !== lastLevels[i]) {
            levels[i].textContent = `${lv}%`;
            leds[i].toggleAttribute("data-on", lv > 0);
            lastLevels[i] = lv;
          }
        });
        gsap.set(bar, { scaleX: p });
      };

      if (prefersReducedMotion()) {
        gsap.set(stage, { "--nf": 1 });
        gsap.set(q("[data-photo]"), { autoAlpha: 1 });
        gsap.set(q("[data-paper], [data-drawing]"), { autoAlpha: 0 });
        gsap.set(q("[data-ch], [data-stars]"), { opacity: 1 });
        gsap.set(q("[data-tint]"), { opacity: 0.5 });
        hud(1);
        return;
      }

      gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1 });
      hud(0);

      // Arrive: the framed plate grows into place as the section scrolls in.
      gsap.fromTo(
        plate,
        { scale: 0.74, y: 60 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
        },
      );
      gsap.to(draws, {
        strokeDashoffset: 0.55,
        ease: "none",
        stagger: { each: 0.01, from: "start" },
        scrollTrigger: { trigger: el, start: "top 70%", end: "top top", scrub: true },
      });

      // HUD follows the scrubbed timeline (not raw scroll) so text and light stay in step.
      const tl: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => hud(tl.progress()),
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(draws, { strokeDashoffset: 0, duration: 0.14, stagger: { amount: 0.02 } }, 0)
        .to(q("[data-photo]"), { autoAlpha: 1, duration: 0.08 }, 0.13)
        .to(q("[data-drawing]"), { autoAlpha: 0.22, duration: 0.06 }, 0.14)
        .to(q("[data-paper]"), { autoAlpha: 0, duration: 0.02 }, 0.21)
        .to(q("[data-drawing]"), { autoAlpha: 0, duration: 0.04 }, 0.2)
        .to(stage, { "--nf": 1, duration: 0.12, ease: "sine.inOut" }, 0.24)
        .to(q("[data-tint]"), { opacity: 0.5, duration: 0.12 }, 0.24)
        .to(q("[data-stars]"), { opacity: 1, duration: 0.1 }, 0.28);

      CHANNELS.forEach((c, i) => {
        const g = q(`[data-ch="${i + 1}"]`);
        tl.to(g, { opacity: 0.7, duration: RAMP * 0.3, ease: "power4.out" }, c.at)
          .to(g, { opacity: 0.25, duration: RAMP * 0.15 }, c.at + RAMP * 0.3)
          .to(g, { opacity: 1, duration: RAMP * 0.55, ease: "power2.out" }, c.at + RAMP * 0.45);
      });

      // A slow push-in to finish, and on small screens a pan along the house.
      tl.to(plate, { scale: 1.035, duration: 0.14, ease: "sine.inOut" }, 0.86);
      tl.fromTo(
        pan,
        { x: 0 },
        { x: () => -(pan.offsetWidth - plate.clientWidth), duration: 0.62, ease: "sine.inOut" },
        0.32,
      );
      tl.to({}, { duration: 0.001 }, 1);
    },
    { scope: root, dependencies: [] },
  );

  const skip = () => {
    const st = ScrollTrigger.getAll().find((t) => t.pin && root.current?.contains(t.pin));
    const y = st
      ? st.end + 2
      : (root.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} data-night aria-labelledby="lighting-story-title">
      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-24 md:px-10">
        <h2
          id="lighting-story-title"
          className="display-caps max-w-[25ch] text-balance text-[clamp(2rem,4vw,3.8rem)] leading-[1.1] tracking-[0.05em]!"
        >
          See what considered lighting can do.
        </h2>
        <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">
          The right lighting makes an entrance welcoming, a path easier to navigate and
          architectural details stand out. Explore how each layer changes this home after dark.
        </p>
      </div>
      <div
        data-stage
        className="relative flex h-[100svh] min-h-[560px] flex-col items-center justify-center overflow-hidden px-5 pb-6 pt-[84px] md:px-10"
        style={{
          ["--nf" as string]: 0,
          color:
            "color-mix(in oklab, var(--ivory) calc(clamp(0, (var(--nf) * 1.25 - 0.42) * 5, 1) * 100%), var(--ink))",
        }}
      >
        {/* night falls over the stone */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: "min(1, calc(var(--nf) * 1.25))",
            background:
              "radial-gradient(70% 50% at 50% 58%, #1d1c1b, transparent 70%), linear-gradient(#0b0c0f, #121211 60%, #151413)",
          }}
        />

        <div
          className="relative flex w-full flex-col gap-4 md:gap-5"
          style={{ maxWidth: "min(100%, 1180px, calc((100svh - 290px) * 1.549))" }}
        >
          {/* top row: scene progress */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow whitespace-nowrap text-[10px] opacity-70">Scene · Arrival</p>
              <p className="eyebrow mt-1 text-[10px]">
                <span data-count>01</span>
                <span className="opacity-50"> / {String(CHAPTERS.length).padStart(2, "0")}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={skip}
              className="eyebrow hidden items-center gap-2 text-[10px] opacity-60 transition-opacity hover:opacity-100 md:inline-flex"
            >
              Skip the story <ArrowDown className="size-3" />
            </button>
          </div>

          {/* the plate: the sign's house, in its black frame */}
          <div
            data-plate
            className="relative aspect-square w-full overflow-hidden border-[6px] border-frame bg-frame shadow-[0_40px_120px_-40px_rgb(0_0_0/0.6)] md:aspect-[906/585] md:border-[10px]"
          >
            <div data-pan className="absolute inset-y-0 left-0 aspect-[906/585] h-full">
              <div data-paper className="absolute inset-0 bg-stone-pale" />
              <img
                data-photo
                src={HOUSE_SRC}
                alt="A long, low modern home with timber cladding and a river-stone feature wall"
                className="invisible absolute inset-0 h-full w-full object-cover opacity-0"
                style={{
                  filter:
                    "brightness(calc(1 - var(--nf) * 0.72)) saturate(calc(1 - var(--nf) * 0.5)) contrast(calc(1 + var(--nf) * 0.12))",
                }}
              />
              <div
                data-tint
                className="absolute inset-0 bg-[#08111f] opacity-0 mix-blend-multiply"
              />
              <HouseLights />
              <div data-drawing className="absolute inset-0 text-ink">
                <HouseDrawing />
              </div>
            </div>
          </div>

          {/* captions + keypad */}
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start md:gap-10">
            <div className="relative h-[8rem] md:h-[7rem]" aria-live="polite">
              {CHAPTERS.map((c, i) => (
                <div
                  key={c.label}
                  data-caption
                  data-active={i === 0 ? "" : undefined}
                  className="absolute inset-0 translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-700 [transition-timing-function:var(--ease-out-expo)] data-[active]:translate-y-0 data-[active]:opacity-100 data-[active]:blur-none"
                >
                  <p className="eyebrow text-[10px] opacity-70">{c.label}</p>
                  <p className="mt-2 max-w-[34ch] font-display text-[1.15rem] leading-snug md:text-[1.5rem]">
                    {c.title}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="grid grid-cols-5 gap-1.5 md:flex md:gap-2"
              role="group"
              aria-label="Lighting keypad"
            >
              {CHANNELS.map((c, i) => (
                <div
                  key={c.name}
                  className="flex flex-col items-center gap-1.5 rounded-sm border border-current/15 px-2 py-2.5 md:w-[98px] md:items-start md:px-3"
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="eyebrow text-[9px] opacity-60">0{i + 1}</span>
                    <span
                      data-led
                      className="size-1.5 rounded-full bg-current opacity-25 transition-all duration-300 data-[on]:bg-glow-soft data-[on]:opacity-100 data-[on]:shadow-[0_0_10px_2px_rgb(255_231_194/0.9)]"
                    />
                  </span>
                  <span className="eyebrow hidden text-[9px] md:block">{c.name}</span>
                  <span data-level className="font-display text-lg leading-none tabular-nums">
                    0%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-current/10">
          <div
            data-bar
            className={cn("led-h h-px origin-left")}
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
