import { useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

const SEEN_KEY = "balance:intro-seen";

/**
 * "Switching on": the wordmark draws itself on the stone, the beam finds its
 * balance, then the panel lifts away to a wall of downlights (the hero).
 * Full sequence once per session; later loads get a quick fade.
 * Rendered on the server so there is no flash of page before it.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // storage blocked — play the full intro
      }

      const finish = () => {
        markIntroDone();
        setGone(true);
      };

      document.documentElement.style.overflow = "hidden";
      const release = () => {
        document.documentElement.style.overflow = "";
      };

      const q = gsap.utils.selector(el);
      const strokes = q("[data-logo-stroke]");
      const beam = q("[data-logo-beam]");
      const tagline = q("[data-logo-tagline]");

      if (seen || prefersReducedMotion()) {
        gsap.set([...strokes, ...beam], { strokeDashoffset: 0 });
        gsap.set(tagline, { autoAlpha: 1 });
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
          onStart: release,
          onComplete: finish,
        });
        return release;
      }

      gsap.set(tagline, { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.25, onComplete: finish });
      tl.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.05,
        ease: "power2.inOut",
        stagger: 0.09,
      })
        .to(beam, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
        .fromTo(
          beam,
          { rotate: -16, svgOrigin: "567.5 12" },
          { rotate: 0, svgOrigin: "567.5 12", duration: 1.5, ease: "elastic.out(1, 0.32)" },
          "<0.1",
        )
        .to(tagline, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" }, "<0.1");

      tl.to(
        el,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.2,
          ease: "expo.inOut",
          onStart: release,
        },
        "+=0.15",
      );

      // Let people skip.
      const skip = () => tl.progress(1);
      el.addEventListener("click", skip);
      window.addEventListener("keydown", skip, { once: true });
      return () => {
        release();
        el.removeEventListener("click", skip);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="presentation"
      className="preloader stone-texture fixed inset-0 z-[100] flex cursor-pointer items-center justify-center text-ink"
      style={{
        clipPath: "inset(0% 0% 0% 0%)",
        animation: "preloader-failsafe 0.6s ease 9s forwards",
      }}
    >
      <div className="relative w-[min(78vw,640px)]">
        <Logo tagline className="w-full" />
      </div>
      <p className="eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-ink-soft/80">
        Taupō · Aotearoa
      </p>
    </div>
  );
}
