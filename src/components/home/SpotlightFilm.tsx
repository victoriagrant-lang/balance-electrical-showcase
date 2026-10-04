import { type CSSProperties, type RefObject } from "react";
import { TorchArea } from "@/components/motion/Torch";

const HOME_IMAGE =
  "https://nrhfbcqmfsezlkxnzshq.supabase.co/storage/v1/object/public/Website%20Photos/Home%20page%20.png";

/*
  The bright layer is clipped by a single broad elliptical mask. The centre is
  fully opaque so the original photograph clearly cuts through the dark ambient
  layer, and the falloff feathers from ~40% to 100% of the ellipse so no ring,
  halo or circular boundary is ever visible. The mask follows the slow trail
  coordinate while the warm highlight (TorchArea's [data-glow]) follows the
  pointer more closely.
*/
const revealStyle = {
  opacity: "var(--torch-opacity)",
  maskImage:
    "radial-gradient(ellipse 56vw 42vw at calc(var(--torch-trail-x) * 1px) calc(var(--torch-trail-y) * 1px), #000 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.74) 40%, rgba(0,0,0,0.52) 58%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0.11) 88%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 56vw 42vw at calc(var(--torch-trail-x) * 1px) calc(var(--torch-trail-y) * 1px), #000 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.74) 40%, rgba(0,0,0,0.52) 58%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0.11) 88%, transparent 100%)",
  willChange: "opacity",
} as CSSProperties;

/** The hero's image layers, driven by the shared TorchArea light field. */
export function SpotlightFilm({ host: _host }: { host: RefObject<HTMLElement | null> }) {
  return (
    <TorchArea mode="reveal" className="absolute inset-0 overflow-hidden bg-stone-pale">
      {/* 1. Dark ambient base — the house sits in shadow. */}
      <img
        src={HOME_IMAGE}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-50 saturate-[0.72] brightness-[0.72] mix-blend-multiply"
      />
      {/* 2. Stone veil — keeps the surrounding copy legible. */}
      <div className="pointer-events-none absolute inset-0 bg-stone-pale/55" />
      {/* 3. Bright reveal — the original photograph, clipped by the soft mask. */}
      <div data-reveal aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={revealStyle}>
        <img
          src={HOME_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center"
        />
      </div>
      {/* 4. Vignette for depth. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(214,202,189,0.14),transparent_38%,rgba(28,29,31,0.2))]" />
    </TorchArea>
  );
}
