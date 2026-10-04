import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

type TorchMode = "dim" | "reveal";

/**
 * A pointer controlled light field. The default dim mode is used by the
 * project grids; reveal mode lets a bright media layer emerge through a
 * broad, layered mask without introducing a second cursor system.
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
      const reveal = el.querySelector<HTMLElement>(":scope > [data-reveal]");
      if (!reveal) return;
      const glow = el.querySelector<HTMLElement>(":scope > [data-glow]");
      const setX = gsap.quickTo(reveal, "--torch-x", { duration: 0.28, ease: "power3.out" });
      const setY = gsap.quickTo(reveal, "--torch-y", { duration: 0.28, ease: "power3.out" });
      const setTrailX = gsap.quickTo(reveal, "--torch-trail-x", {
        duration: 0.82,
        ease: "power2.out",
      });
      const setTrailY = gsap.quickTo(reveal, "--torch-trail-y", {
        duration: 0.82,
        ease: "power2.out",
      });
      const setOpacity = gsap.quickTo(reveal, "--torch-opacity", {
        duration: 0.85,
        ease: "power2.out",
      });
      const setGlowOpacity = glow
        ? gsap.quickTo(glow, "--torch-glow-opacity", { duration: 0.9, ease: "power2.out" })
        : undefined;

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
        setOpacity(e.pointerType === "touch" ? 0.58 : 0.82);
        setGlowOpacity?.(e.pointerType === "touch" ? 0.16 : 0.24);
      };
      const leave = () => {
        setOpacity(0);
        setGlowOpacity?.(0);
      };

      if (!isFinePointer() || prefersReducedMotion()) {
        reveal.style.setProperty("--torch-x", "50%");
        reveal.style.setProperty("--torch-y", "50%");
        reveal.style.setProperty("--torch-trail-x", "50%");
        reveal.style.setProperty("--torch-trail-y", "50%");
        reveal.style.setProperty("--torch-opacity", prefersReducedMotion() ? "0.58" : "0.5");
        setGlowOpacity?.(0.12);
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
        setGlowOpacity?.tween.kill();
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

  const revealVars = {
    ["--torch-x" as string]: "50%",
    ["--torch-y" as string]: "50%",
    ["--torch-trail-x" as string]: "50%",
    ["--torch-trail-y" as string]: "50%",
    ["--torch-opacity" as string]: 0,
  } as CSSProperties;

  return (
    <div ref={ref} className={cn("relative", className)}>
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
            ...revealVars,
            opacity: "var(--torch-glow-opacity, 0)",
            background:
              "radial-gradient(ellipse 16vw 12vw at calc(var(--torch-x) * 1px) calc(var(--torch-y) * 1px), rgb(242 200 139 / 0.16), transparent 72%)",
          }}
        />
      )}
    </div>
  );
}
