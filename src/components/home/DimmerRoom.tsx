import { useState } from "react";
import { photos } from "@/lib/photos";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { Dial } from "./Dial";

const SCENES = [
  { id: "morning", label: "Morning", level: 85, kelvin: 3600 },
  { id: "entertain", label: "Entertaining", level: 70, kelvin: 3000 },
  { id: "dinner", label: "Dinner", level: 42, kelvin: 2700 },
  { id: "late", label: "Late night", level: 14, kelvin: 2200 },
  { id: "off", label: "Off", level: 0, kelvin: 2700 },
] as const;

// Approximate black-body colour of warm-white LEDs, 2200K → 4000K.
const KELVIN: [number, [number, number, number]][] = [
  [2200, [255, 147, 44]],
  [2700, [255, 169, 87]],
  [3000, [255, 180, 107]],
  [3500, [255, 196, 137]],
  [4000, [255, 209, 163]],
];

function kelvinRgb(k: number) {
  for (let i = 1; i < KELVIN.length; i++) {
    const [k1, c1] = KELVIN[i];
    const [k0, c0] = KELVIN[i - 1];
    if (k <= k1) {
      const t = (k - k0) / (k1 - k0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * t)).join(" ");
    }
  }
  return KELVIN[KELVIN.length - 1][1].join(" ");
}

/*
  The showroom moment: a room you can light yourself. Scenes, a rotary
  dimmer and colour temperature — the controls we program into real homes.
*/
export function DimmerRoom() {
  const [level, setLevel] = useState<number>(SCENES[2].level);
  const [kelvin, setKelvin] = useState<number>(SCENES[2].kelvin);
  const [scene, setScene] = useState<string>("dinner");

  const L = level / 100;
  const rgb = kelvinRgb(kelvin);
  const custom = (fn: () => void) => {
    fn();
    setScene("");
  };

  return (
    <section
      data-night
      className="theme-night relative overflow-hidden bg-night py-28 md:py-40"
      aria-labelledby="dimmer-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[80vw] -translate-x-1/2"
        style={{
          background: `radial-gradient(50% 60% at 50% 0%, rgb(${rgb} / ${0.05 + L * 0.12}), transparent 75%)`,
          transition: "background 600ms ease",
        }}
      />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden border-[6px] border-frame bg-black md:border-[10px]">
            <img
              src={photos.living}
              alt="A living room lit by a Balance lighting scheme"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `brightness(${0.1 + L * 0.95}) saturate(${0.35 + L * 0.7}) contrast(${1.12 - L * 0.08})`,
                transition: "filter 450ms var(--ease-out-expo)",
              }}
            />
            {/* colour temperature wash */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `rgb(${rgb})`,
                mixBlendMode: "soft-light",
                opacity: 0.35 + L * 0.35,
                transition: "background 450ms ease, opacity 450ms ease",
              }}
            />
            {/* downlight pools */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `radial-gradient(22% 45% at 24% 0%, rgb(${rgb} / 0.55), transparent 70%), radial-gradient(22% 45% at 52% 0%, rgb(${rgb} / 0.5), transparent 70%), radial-gradient(22% 45% at 80% 0%, rgb(${rgb} / 0.55), transparent 70%)`,
                mixBlendMode: "screen",
                opacity: L * 0.7,
                transition: "opacity 450ms ease, background 450ms ease",
              }}
            />
            {/* the dark closes in as the level drops */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(75% 70% at 50% 45%, transparent 35%, rgb(0 0 0 / 0.85))",
                opacity: 1 - L * 0.85,
                transition: "opacity 450ms ease",
              }}
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-black/45 px-4 py-2 backdrop-blur-md">
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: level ? `rgb(${rgb})` : "#555",
                  boxShadow: level ? `0 0 10px 2px rgb(${rgb} / 0.9)` : "none",
                }}
              />
              <span className="eyebrow text-[10px] text-ivory/85">
                Living · {level}% · {kelvin}K
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-6">
          <p className="eyebrow text-muted-foreground">The showroom</p>
          <SplitReveal
            as="h2"
            id="dimmer-title"
            className="display-caps mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1] tracking-[0.1em] text-ivory"
          >
            One room. A different feeling.
          </SplitReveal>
          <Reveal>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Bright for the start of the day. Softer over dinner. Low when it’s time to unwind.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Explore how brightness and light colour change the feel of a room — and how lighting
              controls can help you create the setting you want.
            </p>
          </Reveal>

          <Reveal className="mt-10">
            <p className="eyebrow mb-3 text-[10px] text-muted-foreground">Choose a scene</p>
            <ToggleGroup
              type="single"
              value={scene}
              onValueChange={(v) => {
                const s = SCENES.find((x) => x.id === v);
                if (!s) return;
                setScene(s.id);
                setLevel(s.level);
                setKelvin(s.kelvin);
              }}
              className="flex flex-wrap justify-start gap-2"
              aria-label="Lighting scenes"
            >
              {SCENES.map((s) => (
                <ToggleGroupItem
                  key={s.id}
                  value={s.id}
                  className="eyebrow h-10 rounded-full border border-ivory/15 px-4 text-[10px] text-ivory/70 hover:bg-ivory/5 hover:text-ivory data-[state=on]:border-glow/60 data-[state=on]:bg-glow/10 data-[state=on]:text-glow-soft data-[state=on]:shadow-[0_0_24px_-6px_rgb(242_200_139/0.7)]"
                >
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Reveal>

          <Reveal className="mt-10 grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="eyebrow mb-3 text-center text-[10px] text-muted-foreground">
                Adjust the brightness
              </p>
              <Dial
                label="Adjust the brightness"
                value={level}
                onChange={(v) => custom(() => setLevel(v))}
                className="mx-auto w-[200px] text-ivory sm:mx-0"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-[10px] text-muted-foreground">Adjust the warmth</p>
                <p className="font-display text-xl tabular-nums text-ivory">{kelvin}K</p>
              </div>
              <Slider
                value={[kelvin]}
                min={2200}
                max={4000}
                step={50}
                onValueChange={([k]) => custom(() => setKelvin(k))}
                aria-label="Adjust the warmth"
                className="mt-5 [&_[data-orientation=horizontal]]:h-[3px] [&_[role=slider]]:size-5 [&_[role=slider]]:border-glow/70 [&_[role=slider]]:bg-ivory [&_[role=slider]]:shadow-[0_0_18px_rgb(242_200_139/0.8)] [&>span:first-child]:bg-[linear-gradient(90deg,#ff932c,#ffb46b,#ffd1a3)] [&>span:first-child>span]:bg-transparent"
              />
              <div className="eyebrow mt-3 flex justify-between text-[9px] text-muted-foreground">
                <span>Candle 2200K</span>
                <span>Neutral 4000K</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
