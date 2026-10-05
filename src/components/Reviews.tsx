import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  GOOGLE_PROFILE_URL,
  GOOGLE_WRITE_REVIEW_URL,
  type GoogleReviews,
} from "@/lib/google-reviews";
import { REVIEWS } from "@/lib/reviews";
import { cn } from "@/lib/utils";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < Math.round(value) ? "fill-current" : "opacity-25")}
          strokeWidth={i < Math.round(value) ? 0 : 1.5}
        />
      ))}
    </span>
  );
}

/** Live Google rating, styled to sit in the same row as the EWRB and award badges. */
export function GoogleReviewsBadge({ google }: { google?: GoogleReviews }) {
  const rated = google?.rating && google.count;
  return (
    <a
      href={google?.url ?? GOOGLE_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-4 border border-ink/20 px-5 py-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/50 hover:shadow-[0_20px_50px_-30px_rgb(28_26_24/0.6)]"
    >
      {/* Stars only for a real rating: never show five stars that Google didn't give. */}
      {rated ? <Stars value={google.rating!} /> : <Star className="size-3.5" strokeWidth={1.5} />}
      <span className="eyebrow text-[10px] leading-relaxed">
        {rated ? `${google.rating!.toFixed(1)} on Google` : "Reviews on Google"}
        <br />
        {rated ? `${google.count} review${google.count === 1 ? "" : "s"}` : "Read what clients say"}
      </span>
      <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

type Card = {
  key: string;
  quote: string;
  name: string;
  meta: string;
  rating?: number;
  url?: string;
};

/** Google reviews (live) plus any direct testimonials. Renders nothing until there is one. */
export function Testimonials({
  google,
  className,
}: {
  google?: GoogleReviews;
  className?: string;
}) {
  const cards: Card[] = [
    ...(google?.reviews ?? []).map((r) => ({
      key: `g-${r.author}-${r.publishTime ?? r.relativeTime}`,
      quote: r.text,
      name: r.author,
      meta: ["Google review", r.relativeTime].filter(Boolean).join(" · "),
      rating: r.rating,
      url: r.authorUrl,
    })),
    ...REVIEWS.map((r) => ({
      key: `d-${r.name}-${r.quote.slice(0, 16)}`,
      quote: r.quote,
      name: r.name,
      meta: [r.place, r.project].filter(Boolean).join(" · "),
      rating: r.rating,
    })),
  ];
  if (!cards.length) return null;

  return (
    <section
      className={cn("mx-auto max-w-[1440px] px-5 md:px-10", className)}
      aria-labelledby="reviews-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow text-ink-soft">
            {google?.rating && google.count
              ? `${google.rating.toFixed(1)} stars · ${google.count} Google review${google.count === 1 ? "" : "s"}`
              : "Client words"}
          </p>
          <h2
            id="reviews-title"
            className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
          >
            In their words.
          </h2>
        </div>
        <div className="flex flex-wrap gap-6">
          <a
            href={google?.url ?? GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="beam-link eyebrow text-[10px]"
          >
            All reviews on Google
          </a>
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="beam-link eyebrow text-[10px]"
          >
            Leave a review
          </a>
        </div>
      </div>
      <Reveal stagger={0.08} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <figure key={c.key} className="flex flex-col border-[8px] border-frame p-7 md:p-9">
            {c.rating ? <Stars value={c.rating} /> : null}
            <blockquote className="mt-5 flex-1 whitespace-pre-line font-display text-[1.3rem] leading-snug">
              “{c.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="beam-link">
                  {c.name}
                </a>
              ) : (
                c.name
              )}
              {c.meta && (
                <span className="eyebrow mt-1.5 block text-[10px] text-ink-soft">{c.meta}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
