import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { photos } from "@/lib/photos";

const revealStyle = {
  "--spot-x": "72%",
  "--spot-y": "50%",
  "--spot-size": "0px",
} as CSSProperties;

/** A quiet stone veil that lets the project image emerge under the pointer. */
export function SpotlightFilm({ host }: { host: RefObject<HTMLElement | null> }) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = host.current;
    const reveal = revealRef.current;
    if (!section || !reveal) return;

    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!media.matches) return;

    const setX = gsap.quickTo(reveal, "--spot-x", { duration: 0.7, ease: "power3.out" });
    const setY = gsap.quickTo(reveal, "--spot-y", { duration: 0.7, ease: "power3.out" });
    const setSize = gsap.quickTo(reveal, "--spot-size", { duration: 0.8, ease: "power3.out" });
    const centre = () => {
      setX(section.clientWidth * 0.72);
      setY(section.clientHeight * 0.5);
    };
    const resize = new ResizeObserver(centre);
    resize.observe(section);
    centre();

    const move = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      setX(event.clientX - rect.left);
      setY(event.clientY - rect.top);
      setSize(Math.min(460, Math.max(280, section.clientWidth * 0.3)));
    };
    const leave = () => setSize(0);

    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);

    return () => {
      resize.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      setX.tween.kill();
      setY.tween.kill();
      setSize.tween.kill();
    };
  }, [host]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-stone-pale"
    >
      <img
        src={photos.img0003}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-35 saturate-[0.72] mix-blend-multiply"
      />
      <div className="absolute inset-0 bg-stone-pale/70" />
      <div
        ref={revealRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          ...revealStyle,
          maskImage:
            "radial-gradient(circle var(--spot-size) at var(--spot-x) var(--spot-y), black 0%, black 62%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--spot-size) at var(--spot-x) var(--spot-y), black 0%, black 62%, transparent 100%)",
        }}
      >
        <img
          src={photos.img0003}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(214,202,189,0.18),transparent_35%,rgba(214,202,189,0.42))]" />
    </div>
  );
}
