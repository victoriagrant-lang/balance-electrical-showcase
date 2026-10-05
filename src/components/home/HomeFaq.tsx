import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { HOME_FAQS } from "@/lib/seo";
import { BrandText } from "@/components/brand/BrandName";

/** Plain answers to the questions people (and AI assistants) ask about an electrician in Taupō. */
export function HomeFaq() {
  return (
    <section
      className="mx-auto max-w-[1100px] px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="faq-title"
    >
      <p className="eyebrow text-ink-soft">Electrician in Taupō</p>
      <h2
        id="faq-title"
        className="display-caps mt-5 text-[clamp(2rem,4.4vw,3.8rem)] leading-[1] tracking-[0.1em]!"
      >
        Questions, answered.
      </h2>
      <Reveal className="mt-10 border-t border-ink/15">
        {HOME_FAQS.map((f) => (
          <details key={f.q} className="group border-b border-ink/15 py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[1.2rem] leading-snug [&::-webkit-details-marker]:hidden">
              <span>
                <BrandText text={f.q} />
              </span>
              <Plus className="mt-1 size-5 shrink-0 transition-transform duration-500 group-open:rotate-45" />
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
              <BrandText text={f.a} />
            </p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
