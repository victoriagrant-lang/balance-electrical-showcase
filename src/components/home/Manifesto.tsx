import { LightWords, Reveal } from "@/components/motion/Reveal";

export function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="eyebrow text-ink-soft">Planned around you</p>
          <div className="mt-4 h-px w-14 bg-ink/40" />
        </Reveal>
        <div className="md:col-span-9">
          <LightWords
            as="h2"
            className="font-display text-[clamp(1.9rem,4.4vw,4.1rem)] leading-[1.12] text-ink"
            text="Good electrical work starts with how you use a space."
          />
          <Reveal className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              Where you need light. How you heat your home. Where you plug in, switch on and spend
              your time.
            </p>
            <p>
              We consider these details early, so your electrical installation works with the way
              you live — and complements the space around it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
