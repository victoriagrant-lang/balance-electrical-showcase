import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL, REVIEWS } from "@/lib/reviews";

/** Google reviews link, styled to sit in the same row as the EWRB and award badges. */
export function GoogleReviewsBadge() {
  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-4 border border-ink/20 px-5 py-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/50 hover:shadow-[0_20px_50px_-30px_rgb(28_26_24/0.6)]"
    >
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
        ))}
      </span>
      <span className="eyebrow text-[10px] leading-relaxed">
        Reviews on Google
        <br />
        Read what clients say
      </span>
      <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Client testimonials — renders nothing until real reviews are added in lib/reviews.ts. */
export function Testimonials() {
  if (!REVIEWS.length) return null;
  return (
    <section
      className="mx-auto max-w-[1440px] px-5 pt-28 md:px-10 md:pt-40"
      aria-labelledby="reviews-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow text-ink-soft">Client words</p>
          <h2
            id="reviews-title"
            className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
          >
            In their words.
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="beam-link eyebrow text-[10px]"
          >
            All reviews on Google
          </a>
          {GOOGLE_WRITE_REVIEW_URL && (
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="beam-link eyebrow text-[10px]"
            >
              Leave a review
            </a>
          )}
        </div>
      </div>
      <Reveal stagger={0.08} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.name + r.quote.slice(0, 20)}
            className="flex flex-col border-[8px] border-frame p-7 md:p-9"
          >
            {r.rating && (
              <span className="flex gap-0.5" aria-label={`${r.rating} out of 5`}>
                {Array.from({ length: r.rating }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
                ))}
              </span>
            )}
            <blockquote className="mt-5 flex-1 font-display text-[1.35rem] leading-snug">
              “{r.quote}”
            </blockquote>
            <figcaption className="eyebrow mt-6 text-[10px] leading-relaxed text-ink-soft">
              {r.name}
              {r.place && ` · ${r.place}`}
              {r.project && ` · ${r.project}`}
              {r.source === "Google" && " · Google review"}
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
