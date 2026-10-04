import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { photos } from "@/lib/photos";

const revealStyle = {
  clipPath: "circle(0px at 72% 50%)",
  WebkitClipPath: "circle(0px at 72% 50%)",
  willChange: "clip-path",
} as CSSProperties;

/** A quiet stone veil that lets the project image emerge under the pointer. */
export function SpotlightFilm({ host }: { host: RefObject<HTMLElement | null> }) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = host.current;
    const reveal = revealRef.current;
    if (!section || !reveal) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const hide = () => {
      const clip = "circle(0px at 72% 50%)";
      reveal.style.clipPath = clip;
      reveal.style.webkitClipPath = clip;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = section.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        hide();
        return;
      }

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.min(520, Math.max(320, rect.width * 0.34));
      const clip = `circle(${size}px at ${x}px ${y}px)`;
      reveal.style.clipPath = clip;
      reveal.style.webkitClipPath = clip;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    hide();

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
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
      <div ref={revealRef} className="absolute inset-0 overflow-hidden" style={revealStyle}>
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
