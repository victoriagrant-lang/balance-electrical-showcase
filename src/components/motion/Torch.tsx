import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

type TorchMode = "dim" | "reveal";

/*
  A pointer-controlled light field.

  - "dim" (project grids): a dark veil with a circular opening that follows the
    cursor; the veil's centre radius is driven by `--tr`.
  - "reveal" (homepage hero): a bright media layer is clipped by a broad, soft,
    elliptical mask. The mask trails the pointer slowly (`--torch-trail-*`) while
    a warmer, tighter highlight follows closely (`--torch-*`). Both coordinates
    are written onto the container so every child layer inherits them.
*/
export function TorchArea({
  children,
  className,
  mode = "dim",
}: {
  children: ReactNode;
  className?: string;
  mode?: TorchMode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (mode === "reveal") {
      // Coordinates live on the container so [data-reveal] and [data-glow] both
      // inherit them (CSS variables inherit downward, not across siblings).
      const setX = gsap.quickTo(el, "--torch-x", { duration: 0.28, ease: "power3.out" });
      const setY = gsap.quickTo(el, "--torch-y", { duration: 0.28, ease: "power3.out" });
      const setTrailX = gsap.quickTo(el, "--torch-trail-x", {
        duration: 0.85,
        ease: "power2.out",
      });
      const setTrailY = gsap.quickTo(el, "--torch-trail-y", {
        duration: 0.85,
        ease: "power2.out",
      });
      const setOpacity = gsap.quickTo(el, "--torch-opacity", {
        duration: 0.85,
        ease: "power2.out",
      });
      const setGlowOpacity = gsap.quickTo(el, "--torch-glow-opacity", {
        duration: 0.9,
        ease: "power2.out",
      });

      const centerX = el.clientWidth / 2;
      const centerY = el.clientHeight / 2;
      el.style.setProperty("--torch-x", String(centerX));
      el.style.setProperty("--torch-y", String(centerY));
      el.style.setProperty("--torch-trail-x", String(centerX));
      el.style.setProperty("--torch-trail-y", String(centerY));

      const leave = () => {
        setOpacity(0);
        setGlowOpacity(0);
      };

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        if (!inside) {
          leave();
          return;
        }
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        setX(x);
        setY(y);
        setTrailX(x);
        setTrailY(y);
        setOpacity(e.pointerType === "touch" ? 0.6 : 0.9);
        setGlowOpacity(e.pointerType === "touch" ? 0.12 : 0.2);
      };

      // Touch / reduced motion: no chasing spotlight — a broad, softly lit
      // centre reveal that stays put.
      if (!isFinePointer() || prefersReducedMotion()) {
        el.style.setProperty("--torch-x", String(centerX));
        el.style.setProperty("--torch-y", String(centerY));
        el.style.setProperty("--torch-trail-x", String(centerX));
        el.style.setProperty("--torch-trail-y", String(centerY));
        el.style.setProperty("--torch-opacity", prefersReducedMotion() ? "0.6" : "0.55");
        el.style.setProperty("--torch-glow-opacity", "0.12");
        return;
      }

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", leave);
      window.addEventListener("pointercancel", leave);
      window.addEventListener("blur", leave);
      leave();

      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", leave);
        window.removeEventListener("pointercancel", leave);
        window.removeEventListener("blur", leave);
        setX.tween.kill();
        setY.tween.kill();
        setTrailX.tween.kill();
        setTrailY.tween.kill();
        setOpacity.tween.kill();
        setGlowOpacity.tween.kill();
      };
    }

    const dark = el.querySelector<HTMLElement>(":scope > [data-dark]");
    if (!dark) return;

    if (!isFinePointer() || prefersReducedMotion()) {
      dark.style.display = "none";
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.toggleAttribute("data-lit", e.isIntersecting)),
        { threshold: 0.55 },
      );
      el.querySelectorAll("[data-shot]").forEach((s) => io.observe(s));
      return () => io.disconnect();
    }

    const setX = gsap.quickTo(dark, "--tx", { duration: 0.7, ease: "power3.out" });
    const setY = gsap.quickTo(dark, "--ty", { duration: 0.7, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setX(e.clientX - r.left);
      setY(e.clientY - r.top);
    };
    const onEnter = () => gsap.to(dark, { "--tr": 340, duration: 1.1, ease: "expo.out" });
    const onLeave = () => gsap.to(dark, { "--tr": 0, duration: 0.8, ease: "power2.inOut" });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);

  const revealRoot = {
    ["--torch-x" as string]: "0",
    ["--torch-y" as string]: "0",
    ["--torch-trail-x" as string]: "0",
    ["--torch-trail-y" as string]: "0",
    ["--torch-opacity" as string]: "0",
    ["--torch-glow-opacity" as string]: "0",
  } as CSSProperties;

  return (
    <div ref={ref} className={cn("relative", className)} style={mode === "reveal" ? revealRoot : undefined}>
      {children}
      {mode === "dim" ? (
        <div
          data-dark
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            ["--tx" as string]: 0,
            ["--ty" as string]: 0,
            ["--tr" as string]: 0,
            background:
              "radial-gradient(circle calc(var(--tr) * 1px + 1px) at calc(var(--tx) * 1px) calc(var(--ty) * 1px), transparent 0%, rgb(18 18 17 / 0.3) 55%, rgb(18 18 17 / 0.62) 100%)",
          }}
        />
      ) : (
        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: "var(--torch-glow-opacity, 0)",
            background:
              "radial-gradient(ellipse 20vw 14vw at calc(var(--torch-x) * 1px) calc(var(--torch-y) * 1px), rgb(242 200 139 / 0.18), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
