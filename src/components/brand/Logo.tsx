import { useId } from "react";
import { cn } from "@/lib/utils";

/*
  The BALANCE wordmark, redrawn as strokes from the site sign.
  Geometric monoline caps; both A's are open "Λ" forms and the second carries
  a beam — a fulcrum and a level, which is the whole idea of the name.

  Geometry: cap height 100, stroke 7, tracked at ~100 units between glyphs.
  Strokes are clipped to the cap band so diagonals end flat on the baseline.
*/

const STROKE = 7;

const LOGO_LETTERS = [
  // B
  "M3.5 0V100M3.5 3.5H44A22.25 22.25 0 0 1 44 48H3.5M3.5 48H45A24.25 24.25 0 0 1 45 96.5H3.5",
  // Λ
  "M165.8 108L218.5 8L271.2 108",
  // L
  "M372.5 0V96.5H432",
  // Λ (fulcrum under the beam)
  "M521.9 108L567.5 19L613.1 108",
  // N
  "M720.5 100V0L792.5 100V0",
  // C
  "M982 18.3A46.5 46.5 0 1 0 982 81.7",
  // E
  "M1150 3.5H1090.5V96.5H1150M1090.5 50H1144",
];

const LOGO_BEAM = "M522 3.5H613";

type LogoProps = {
  className?: string;
  /** Show "ELECTRICAL · AIR CONDITIONING · SOLAR" under the wordmark */
  tagline?: boolean;
  /** Tip the beam into balance when a parent `.group` is hovered */
  hoverBalance?: boolean;
  title?: string;
};

export function Logo({
  className,
  tagline = false,
  hoverBalance = false,
  title = "Balance Electrical",
}: LogoProps) {
  const id = useId().replace(/:/g, "");
  const clipId = `logo-clip-${id}`;
  const height = tagline ? 212 : 100;

  return (
    <svg
      viewBox={`0 0 1150 ${height}`}
      role="img"
      aria-label={title}
      className={cn("block h-auto overflow-visible", className)}
      fill="none"
    >
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <rect x="-20" y="0" width="1190" height="100" />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${clipId})`}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      >
        {LOGO_LETTERS.map((d, i) => (
          <path key={i} d={d} pathLength={1} data-logo-stroke="" />
        ))}
        <path
          d={LOGO_BEAM}
          pathLength={1}
          data-logo-beam=""
          className={cn(hoverBalance && "logo-beam-hover")}
          style={{ transformBox: "view-box", transformOrigin: "567.5px 12px" }}
        />
      </g>
      {tagline && (
        <text
          x="0"
          y="208"
          textLength="1150"
          lengthAdjust="spacing"
          fill="currentColor"
          data-logo-tagline=""
          style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 400 }}
        >
          ELECTRICAL · AIR CONDITIONING · SOLAR
        </text>
      )}
    </svg>
  );
}

/* The beam-and-fulcrum on its own — used as the favicon and small brand marks */
export function LogoMark({ className, title = "Balance" }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  const clipId = `mark-clip-${id}`;
  return (
    <svg viewBox="512 -6 111 112" role="img" aria-label={title} className={className} fill="none">
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <rect x="500" y="0" width="140" height="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} stroke="currentColor" strokeWidth={STROKE}>
        <path d={LOGO_LETTERS[3]} />
        <path d={LOGO_BEAM} />
      </g>
    </svg>
  );
}
