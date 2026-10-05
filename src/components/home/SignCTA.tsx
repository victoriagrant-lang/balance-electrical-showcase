import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CONTACT } from "@/lib/contact";
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { HOUSE_SRC, HouseLights } from "./HouseScene";

// Each links to its own service page.
const LIST: [string, string][] = [
  ["Lighting design", "lighting-design-taupo"],
  ["New builds", "new-build-electrician-taupo"],
  ["Renovations", "renovation-electrician-taupo"],
  ["Commercial", "commercial-electrician-taupo"],
  ["Solar", "solar-installation-taupo"],
];

/*
  The site sign itself, rebuilt as the closing call to action. A floodlight
  finds it, then the house's lights come on as it scrolls into view.
*/
export function SignCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const channels = q("[data-ch]");
      if (prefersReducedMotion()) {
        gsap.set(channels, { opacity: 1 });
        gsap.set(q("[data-dusk]"), { opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-sign]")[0],
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
      });
      tl.to(q("[data-flood]"), { opacity: 1, duration: 1.2, ease: "power2.out" })
        .to(q("[data-dusk]"), { opacity: 1, duration: 1.4, ease: "sine.inOut" }, 0.2)
        .to(
          channels,
          { keyframes: { opacity: [0, 0.8, 0.2, 1] }, duration: 0.5, ease: "none", stagger: 0.18 },
          0.9,
        );
    },
    { scope: root },
  );

  // A gentle tilt towards the pointer, like walking past the sign.
  useEffect(() => {
    const el = root.current;
    const sign = el?.querySelector<HTMLElement>("[data-sign]");
    if (!el || !sign || !isFinePointer() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(sign, "rotationX", { duration: 1, ease: "power3.out" });
    const ry = gsap.quickTo(sign, "rotationY", { duration: 1, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = sign.getBoundingClientRect();
      ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 5);
      rx(-((e.clientY - (r.top + r.height / 2)) / r.height) * 4);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden px-4 pb-28 pt-10 md:px-10 md:pb-40"
      aria-labelledby="sign-title"
    >
      {/* floodlight from above */}
      <div
        data-flood
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[110vw] -translate-x-1/2 opacity-0"
        style={{
          background:
            "radial-gradient(40% 55% at 50% 0%, rgb(255 246 230 / 0.85), rgb(255 234 204 / 0.25) 50%, transparent 80%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* perspective lives here, not on the section, so the floodlight's blend isn't isolated */}
      <div style={{ perspective: "1600px" }}>
        <div
          data-sign
          className="relative mx-auto grid max-w-[1320px] border-[8px] border-frame bg-frame shadow-[0_70px_120px_-50px_rgb(0_0_0/0.6)] md:grid-cols-[1.62fr_1fr] md:border-[14px]"
        >
          {/* left: the house panel */}
          <div className="relative aspect-[906/585] overflow-hidden md:aspect-auto md:min-h-full">
            <img
              src={HOUSE_SRC}
              alt="A modern single-level home at dusk"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* dusk settles on the house; the sky stays light */}
            <div
              data-dusk
              aria-hidden
              className="absolute inset-0 opacity-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgb(20 24 34 / 0.15) 40%, rgb(10 14 22 / 0.72) 70%, rgb(8 10 16 / 0.82) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            <HouseLights />
            <div className="absolute inset-x-0 top-[9%] flex flex-col items-center text-center text-ink">
              <h2
                id="sign-title"
                className="display-caps text-[clamp(1.1rem,3vw,2.5rem)] tracking-[0.28em]"
              >
                Watch this space
              </h2>
              <span className="mt-[3%] h-px w-[12%] bg-ink/60" />
              <p className="eyebrow mt-[3%] text-[clamp(0.55rem,1.1vw,0.85rem)] leading-[2]">
                Something special
                <br />
                is coming
              </p>
            </div>
          </div>

          {/* right: the stone panel */}
          <div className="stone-texture flex flex-col px-7 py-9 text-ink md:px-[8%] md:py-[9%]">
            <Logo tagline className="w-full" />
            <div className="my-8 h-px w-1/2 bg-ink/35 md:my-[12%]" />
            <ul className="space-y-4">
              {LIST.map(([item, slug]) => (
                <li key={item}>
                  <Link
                    to="/services/$slug"
                    params={{ slug }}
                    className="beam-link eyebrow text-[11px] tracking-[0.34em] md:text-[12px]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="my-8 h-px w-1/2 bg-ink/35 md:my-[12%]" />
            <div className="mt-auto flex items-center gap-5">
              <Link
                to="/contact"
                data-cursor="Let's talk"
                aria-label="Let's talk — start a project"
                className="group flex size-16 shrink-0 items-center justify-center rounded-full bg-frame text-stone-pale transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgb(242_200_139/0.6),0_0_40px_-4px_rgb(242_200_139/0.8)]"
              >
                <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <p className="display-caps text-2xl leading-tight tracking-[0.24em]">
                Let's
                <br />
                talk
              </p>
            </div>
            <a
              href={CONTACT.tel}
              className="eyebrow mt-6 block text-[10px] tracking-[0.3em] text-ink-soft hover:text-ink"
            >
              balanceelectrical.co.nz · {CONTACT.phoneLocal}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
