import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { BrandText } from "@/components/brand/BrandName";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import {
  GOOGLE_PROFILE_URL,
  GOOGLE_WRITE_REVIEW_URL,
  type GoogleReviews,
} from "@/lib/google-reviews";
import { REVIEWS, SAVED_GOOGLE_REVIEWS } from "@/lib/reviews";
import { cn } from "@/lib/utils";

function Stars({
  value,
  className,
  size = "size-3.5",
}: {
  value: number;
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(size, i < Math.round(value) ? "fill-current" : "opacity-25")}
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
  photo?: string;
  reply?: string;
};

/** Long reviews show their first few lines, with the rest a tap away (all of it is in the page). */
const LONG = 320;

function ReviewCard({ c, hidden = false }: { c: Card; hidden?: boolean }) {
  const [open, setOpen] = useState(false);
  const long = c.quote.length > LONG;
  return (
    <figure
      className={cn("flex flex-col border-[8px] border-frame p-7 md:p-9", hidden && "hidden")}
    >
      {c.rating ? <Stars value={c.rating} /> : null}
      <blockquote
        className={cn(
          "mt-5 whitespace-pre-line font-display text-[1.3rem] leading-snug",
          long && !open && "line-clamp-6",
        )}
      >
        “{c.quote}”
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="beam-link eyebrow mt-4 self-start text-[10px] text-ink-soft"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
      {c.reply && (
        <details className="group mt-5 border-l border-ink/25 pl-4">
          <summary className="eyebrow cursor-pointer list-none text-[10px] text-ink-soft [&::-webkit-details-marker]:hidden">
            Our reply{" "}
            <span className="inline-block transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {c.reply}
          </p>
        </details>
      )}
      <figcaption className="mt-auto flex items-center gap-4 pt-7 text-sm">
        {c.photo ? (
          <img
            src={c.photo}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/10 font-display text-lg"
          >
            {c.name.charAt(0)}
          </span>
        )}
        <span>
          {c.url ? (
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="beam-link">
              {c.name}
            </a>
          ) : (
            c.name
          )}
          {c.meta && <span className="eyebrow mt-1 block text-[10px] text-ink-soft">{c.meta}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Reviews pulled live from Google (rating, count and Google's most relevant reviews), plus
 * any direct testimonials. With nothing to show yet it still offers the Google links, so the
 * section never quietly disappears from a page that asks for it.
 */
export function Testimonials({
  google,
  className,
  initial = 6,
}: {
  google?: GoogleReviews;
  className?: string;
  /**
   * Reviews shown at first; the rest are in the page behind "Show all reviews" (so the page
   * still contains every review its structured data lists).
   */
  initial?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  // Live reviews when Google returns them; otherwise the saved ones from the same profile.
  const live = google?.reviews ?? [];
  const fromGoogle = live.length ? live : google ? SAVED_GOOGLE_REVIEWS : [];
  const cards: Card[] = [
    ...fromGoogle.map((r) => ({
      key: `g-${r.author}-${r.publishTime ?? r.relativeTime}`,
      quote: r.text,
      name: r.author,
      meta: ["Google review", r.relativeTime].filter(Boolean).join(" · "),
      rating: r.rating,
      url: r.authorUrl ?? google?.url,
      photo: r.photo,
      reply: r.reply,
    })),
    ...REVIEWS.map((r) => ({
      key: `d-${r.name}-${r.quote.slice(0, 16)}`,
      quote: r.quote,
      name: r.name,
      meta: [r.place, r.project].filter(Boolean).join(" · "),
      rating: r.rating,
    })),
  ];
  if (!cards.length && !google) return null;
  const more = showAll ? 0 : Math.max(0, cards.length - initial);
  const rated =
    google?.rating && google.count ? { rating: google.rating, count: google.count } : null;
  const profile = google?.url ?? GOOGLE_PROFILE_URL;
  // Google asks for an "as of" date beside a rating shown off Google.
  const asOf = google?.asOf
    ? new Date(google.asOf).toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Pacific/Auckland",
      })
    : "";

  return (
    <section
      className={cn("mx-auto max-w-[1440px] px-5 md:px-10", className)}
      aria-labelledby="reviews-title"
    >
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-ink-soft">{google ? "Google reviews" : "Client words"}</p>
          <h2
            id="reviews-title"
            className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
          >
            In their words.
          </h2>
        </div>
        <div className="md:col-span-5 md:justify-self-end">
          {rated && (
            <a
              href={profile}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5"
              aria-label={`Rated ${rated.rating.toFixed(1)} out of 5 from ${rated.count} reviews on Google`}
            >
              <span className="font-display text-[clamp(3.2rem,6vw,4.6rem)] leading-none">
                {rated.rating.toFixed(1)}
              </span>
              <span>
                <Stars value={rated.rating} size="size-4" />
                <span className="eyebrow mt-2 flex items-center gap-1.5 text-[10px] text-ink-soft">
                  {rated.count} review{rated.count === 1 ? "" : "s"} on Google
                  <ArrowUpRight className="size-3 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                {asOf && (
                  <span className="eyebrow mt-1 block text-[9px] text-ink-soft/80">
                    as of {asOf}
                  </span>
                )}
              </span>
            </a>
          )}
          <div className={cn("flex flex-wrap gap-3", rated && "mt-7")}>
            <Button asChild variant="lux" size="xl">
              <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                Leave a review
              </a>
            </Button>
            <Button asChild variant="luxOutline" size="xl">
              <a href={profile} target="_blank" rel="noopener noreferrer">
                {rated ? "Read all on Google" : "Reviews on Google"}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {cards.length > 0 ? (
        <>
          <Reveal stagger={0.08} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <ReviewCard key={c.key} c={c} hidden={!showAll && i >= initial} />
            ))}
          </Reveal>
          {more > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="beam-link eyebrow mt-10 text-[10px]"
            >
              Show all {cards.length} reviews
            </button>
          )}
        </>
      ) : (
        <p className="mt-10 max-w-xl leading-relaxed text-ink-soft">
          <BrandText text="Worked with Balance? We'd love to hear how it went — your review helps other people in Taupō find the right electrician." />
        </p>
      )}
      {fromGoogle.length > 0 && (
        <p className="eyebrow mt-8 text-[10px] text-ink-soft">
          {live.length
            ? "Reviews from Google Maps · updated automatically"
            : "Reviews from Google Maps"}
        </p>
      )}
    </section>
  );
}
