import { useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

const SEEN_KEY = "balance:intro-seen";
const TAGLINE = "ELECTRICAL · AIR CONDITIONING · SOLAR";

// The torch travels from just before the B to just past the E (percent of the wordmark's width).
const FROM = -14;
const TO = 114;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The footer's wordmark, as the loader: BALANCE sits unlit in the dark and a torch of warm
 * light travels through it from the B to the E, leaving each letter glowing as it passes,
 * while a counter runs 000 → 100. At the E the whole word comes up, the LED hairline runs
 * out to the walls, and the night parts on a seam just above the letters onto the stone hero.
 * Full sequence once per session; later loads (and reduced motion) get a lit frame and a fade.
 * Rendered on the server, unlit, so there is no flash of page before it.
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
        // storage blocked: play the full intro
      }

      const q = gsap.utils.selector(el);
      const one = (sel: string) => q(sel)[0] as HTMLElement;
      const stage = one("[data-stage]");
      const torch = one("[data-torch]");
      const trail = one("[data-trail]");
      const tagline = one("[data-tagline]");
      const countEl = one("[data-count]");
      const digits = Array.from(countEl.children) as HTMLElement[];
      const fill = one("[data-fill]");
      const spill = one("[data-spill]");
      const upper = q('[data-move="up"]');
      const lower = q('[data-move="down"]');
      const edges = q("[data-edge]");
      const glows = q("[data-glow]");

      // The CSS failsafe only covers a script that never runs; from here the timeline decides.
      el.style.animation = "none";
      document.documentElement.style.overflow = "hidden";
      const release = () => {
        document.documentElement.style.overflow = "";
      };

      // Two channels: how far the torch has travelled (v) and the finale (f).
      const S = { v: 0, f: 0 };
      const draw = () => {
        const { v, f } = S;
        stage.style.setProperty("--mx", lerp(FROM, TO, v).toFixed(2));
        trail.style.opacity = String(lerp(0.5, 1, f));
        tagline.style.opacity = String(lerp(0.12, 0.6, clamp(v * 1.2 - 0.2) * 0.6 + f * 0.4));

        const n = Math.round(v * 100);
        const s = String(n).padStart(3, "0");
        const firstSignificant = n === 0 ? 2 : 3 - String(n).length;
        digits.forEach((d, i) => {
          d.textContent = s[i];
          d.toggleAttribute("data-zero", i < firstSignificant);
        });
        countEl.style.color = `rgb(236 228 218 / ${lerp(0.26, 0.96, Math.pow(v, 0.62)).toFixed(3)})`;
        countEl.style.textShadow =
          f > 0.001 ? `0 0 ${Math.round(30 * f)}px rgb(255 214 160 / ${(0.5 * f).toFixed(3)})` : "";
        fill.style.transform = `scaleX(${v.toFixed(4)})`;
      };
      // GSAP calls these on every render (seek and skip included), unlike onUpdate.
      const channel = (key: keyof typeof S) => (x?: number) => {
        if (x === undefined) return S[key];
        S[key] = x;
        draw();
      };
      const state = { v: channel("v"), f: channel("f") };

      const finish = () => {
        markIntroDone();
        setGone(true);
      };

      if (seen || prefersReducedMotion()) {
        S.v = 1;
        S.f = 1;
        draw();
        gsap.set(torch, { opacity: 0 });
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.5,
          delay: seen ? 0.1 : 0.7,
          ease: "power2.out",
          onStart: release,
          onComplete: finish,
        });
        return release;
      }

      const seamY = () => stage.getBoundingClientRect().top;
      const tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });
      tl.addLabel("on", 0.15)
        // The torch comes up just before the B and travels through to the E
        .fromTo(torch, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, "on")
        .to(state, { v: 1, duration: 1.7, ease: "sine.inOut" }, "on+=0.05")
        .addLabel("flare", ">-0.12")
        // The whole word comes up to full and glows for a moment
        .to(state, { f: 1, duration: 0.3, ease: "power2.out" }, "flare")
        // The light runs out to the walls as the brand's LED hairline
        .fromTo(
          edges,
          { opacity: 1, scaleX: 0.06, transformOrigin: "50% 50%" },
          { scaleX: 1, duration: 0.6, ease: "expo.out", immediateRender: false },
          "flare+=0.1",
        )
        .addLabel("spill", "flare+=0.4")
        .add(release, "spill")
        .add(markIntroDone, "spill+=0.1")
        // The night parts on the seam; the lit wordmark rides down with the lower half
        .to(upper, { y: () => -(seamY() + 24), duration: 0.9, ease: "power4.inOut" }, "spill")
        .to(
          lower,
          { y: () => window.innerHeight - seamY() + 24, duration: 0.9, ease: "power4.inOut" },
          "spill",
        )
        .fromTo(glows, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power2.out" }, "spill")
        .to([...glows, ...edges], { opacity: 0, duration: 0.45, ease: "power2.in" }, "spill+=0.4")
        .set(spill, { opacity: 1 }, "spill")
        .to(spill, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "spill+=0.25");

      // Let people skip: jump to the finale so the reveal still happens, quickly.
      const skip = () => {
        if (tl.time() < (tl.labels.spill ?? 0)) tl.seek("flare");
        tl.timeScale(1.6).play();
      };
      el.addEventListener("click", skip);
      window.addEventListener("keydown", skip, { once: true });

      // Wait (briefly) for the display face so the counter doesn't change font mid-count.
      let cancelled = false;
      Promise.race([
        document.fonts?.load('300 1em "Cormorant Garamond"'),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ])
        .catch(() => {})
        .then(() => {
          if (!cancelled) tl.play();
        });

      return () => {
        cancelled = true;
        release();
        el.removeEventListener("click", skip);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} role="presentation" aria-hidden className="dimmer">
      <div className="dimmer-spill" data-spill />

      {/* The night, in two halves that part on the seam */}
      <div className="dimmer-glow" data-half="up" data-glow data-move="up" />
      <div className="dimmer-glow" data-half="down" data-glow data-move="down" />
      <div className="dimmer-half" data-half="up" data-move="up">
        <div className="dimmer-hud dimmer-label" data-row="top">
          <span>Taupō · Aotearoa</span>
          <span>Architectural lighting</span>
        </div>
      </div>
      <div className="dimmer-half" data-half="down" data-move="down">
        <div className="dimmer-hud" data-row="bottom">
          <div>
            <p className="dimmer-label">Switching on</p>
            <p className="dimmer-count" data-count>
              <span data-zero="">0</span>
              <span data-zero="">0</span>
              <span>0</span>
            </p>
          </div>
          <div className="dimmer-track">
            <div data-fill />
          </div>
        </div>
      </div>

      {/* The footer's wordmark: unlit strokes, the glow left behind the torch, and the torch */}
      <div className="dimmer-stage" data-stage data-move="down">
        <Logo className="dimmer-mark text-ivory/[0.1]" title="" />
        <div className="dimmer-lit" data-mask="trail" data-trail>
          <Logo className="dimmer-mark dimmer-glowing" title="" />
        </div>
        <div className="dimmer-lit" data-mask="torch" data-torch>
          <Logo className="dimmer-mark dimmer-glowing" title="" />
        </div>
        <div className="dimmer-tagline" data-tagline>
          {TAGLINE.split("").map((ch, i) => (
            <span key={i}>{ch === " " ? " " : ch}</span>
          ))}
        </div>
      </div>

      {/* The opening edges: shadow gap and LED hairline, riding each half */}
      <div className="dimmer-edge" data-half="up" data-edge data-move="up" />
      <div className="dimmer-edge" data-half="down" data-edge data-move="down" />
    </div>
  );
}
