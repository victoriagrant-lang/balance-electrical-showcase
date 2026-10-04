import { type CSSProperties, type RefObject } from "react";
import { photos } from "@/lib/photos";
import { TorchArea } from "@/components/motion/Torch";

const revealStyle = {
  "--torch-x": "50%",
  "--torch-y": "50%",
  "--torch-trail-x": "50%",
  "--torch-trail-y": "50%",
  "--torch-opacity": 0,
  opacity: "var(--torch-opacity)",
  maskImage:
    "radial-gradient(ellipse 28vw 22vw at var(--torch-trail-x) var(--torch-trail-y), rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.34) 40%, rgba(0,0,0,0.14) 72%, transparent 100%), radial-gradient(ellipse 11vw 8vw at var(--torch-x) var(--torch-y), rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.4) 42%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 28vw 22vw at var(--torch-trail-x) var(--torch-trail-y), rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.34) 40%, rgba(0,0,0,0.14) 72%, transparent 100%), radial-gradient(ellipse 11vw 8vw at var(--torch-x) var(--torch-y), rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.4) 42%, transparent 100%)",
  maskComposite: "add",
  WebkitMaskComposite: "source-over",
  willChange: "transform, mask-image, opacity",
} as CSSProperties;

/** The hero's image layers, driven by the shared TorchArea light field. */
export function SpotlightFilm({ host: _host }: { host: RefObject<HTMLElement | null> }) {
  return (
    <TorchArea mode="reveal" className="absolute inset-0 overflow-hidden bg-stone-pale">
      <img
        src={photos.img0003}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-45 saturate-[0.72] brightness-[0.7] mix-blend-multiply"
      />
      <div className="pointer-events-none absolute inset-0 bg-stone-pale/60" />
      <div
        data-reveal
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={revealStyle}
      >
        <img
          src={photos.img0003}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center brightness-[0.92] saturate-[0.86]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(214,202,189,0.14),transparent_38%,rgba(28,29,31,0.2))]" />
    </TorchArea>
  );
}
