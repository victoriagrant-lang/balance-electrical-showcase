import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Award, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CONTACT } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { LightWords, Reveal, SplitReveal } from "@/components/motion/Reveal";
import portrait from "@/assets/victoria-portrait.webp";
import mitchPortrait from "@/assets/mitch-portrait.webp";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EwrbLogo } from "@/components/EwrbLogo";
import { PORTFOLIO } from "@/lib/portfolio";
import { GoogleReviewsBadge, Testimonials, reviewSchema } from "@/components/Reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { jsonLd, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/brand/BrandName";

export const Route = createFileRoute("/about")({
  loader: () => getGoogleReviews(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "About Victoria Grant | Registered Electrician Taupō | Balance Electrical" },
      {
        name: "description",
        content:
          "Meet Victoria Grant, owner of Balance Electrical and a registered electrician in Taupō. Personal service for residential and commercial electrical projects.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "About Victoria Grant | Balance Electrical" },
      {
        property: "og:description",
        content:
          "Meet Victoria Grant — the owner and registered electrician behind Balance Electrical in Taupō.",
      },
      { property: "og:image", content: `${SITE}${portrait}` },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz/about" }],
    scripts: [reviewSchema(loaderData)].filter((x) => x !== null).map((x) => jsonLd([x])),
  }),
  component: About,
});

const DIRECTORS = [
  {
    name: "Victoria Grant",
    role: "Director — Balance Electrical · Design Lead",
    photo: { src: portrait, w: 1254, h: 1254 },
    alt: "Victoria Grant, Director of Balance Electrical",
    lead: "Raised in Taupō and trained in Wellington, Victoria returned home to establish Balance Electrical with a clear focus on quality workmanship, thoughtful design and personal service.",
    bio: [
      "A qualified electrician and the design lead behind many of Balance’s projects, she has a natural ability to bring the technical and visual sides of a job together. From lighting layouts and electrical planning through to joinery integration and final fit-off, Victoria is involved in the details that shape how a space looks, feels and functions.",
      "She works closely with clients, builders and designers throughout the process, making sure each element is carefully considered and nothing feels like an afterthought.",
      "No matter the size or scope of the project, Victoria brings the same high standard and eye for detail — from the position of a fitting to the way lighting interacts with a material. For her, it’s often the smallest decisions that make the biggest difference to the finished result.",
    ],
    credentials: ["ewrb", "award", "reviews"],
  },
  {
    name: "Mitchell Pearce",
    role: "Director — Balance Air Conditioning · Electrician",
    photo: { src: mitchPortrait, w: 1122, h: 1402 },
    alt: "Mitchell Pearce, Director of Balance Air Conditioning",
    bio: [
      "Mitch is a qualified electrician and Director of Balance Air Conditioning, bringing a broad technical understanding across both electrical and climate systems.",
      "He is a genuine all-rounder on site and is often involved well beyond the air-conditioning scope, helping with electrical planning, problem solving, coordination and making sure the different systems within a project work together properly.",
      "Mitch has a practical, hands-on approach and a strong focus on finding solutions that are reliable, efficient and well integrated into the finished space. From high-wall units through to fully ducted systems built into ceilings and joinery, he works closely with clients, builders and the wider Balance team to get the best result.",
      "His strength is in seeing the whole project, understanding how each service connects, and helping make sure everything is delivered cleanly, efficiently and to a high standard.",
    ],
    credentials: ["ewrb", "award"],
  },
] satisfies {
  name: string;
  role: string;
  photo: { src: string; w: number; h: number };
  alt: string;
  /** Set larger, lighting up word by word; otherwise the bio's first paragraph is used. */
  lead?: string;
  bio: string[];
  credentials: ("ewrb" | "award" | "reviews")[];
}[];

const VALUES = [
  {
    title: "Clear advice",
    copy: "Understand your options before the work begins. We explain the proposed work and costs in plain language, so you can make informed decisions about your project.",
  },
  {
    title: "Careful work",
    copy: "Details matter at every stage, from the cable routes behind the walls to the fittings you use each day. We give the planning, installation and finish the attention they deserve.",
  },
  {
    title: "Personal service",
    copy: "Work directly with Victoria throughout your project. You have a clear point of contact to discuss progress, ask questions and work through decisions as they arise.",
  },
];

function About() {
  const google = Route.useLoaderData();
  return (
    <SiteLayout>
      <Directors google={google} />

      <Testimonials google={google} className="pt-28 md:pt-40" />

      <Values />

      <RecentWork />

      <section className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid items-end gap-12 md:grid-cols-2">
          <div>
            <SplitReveal
              as="h2"
              className="display-caps text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
            >
              Start with a conversation.
            </SplitReveal>
            <Reveal>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
                Tell Victoria about your property, your plans and what you need. She’ll help you
                work through the electrical requirements and the next steps.
              </p>
              <Button asChild variant="lux" size="xl" className="mt-10">
                <Link to="/contact">
                  Discuss your project <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:justify-self-end">
            <a
              href={CONTACT.tel}
              data-cursor="Call"
              className="flex items-center gap-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none"
            >
              <Phone className="size-6" strokeWidth={1.25} />
              {CONTACT.phoneLocal}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="beam-link mt-4 inline-block text-ink-soft hover:text-ink"
            >
              {CONTACT.email}
            </a>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

const badge =
  "group inline-flex items-center border border-ink/20 px-5 py-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/50 hover:shadow-[0_20px_50px_-30px_rgb(28_26_24/0.6)]";

function EwrbBadge() {
  return (
    <a
      href="https://www.ewrb.govt.nz"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(badge, "gap-5")}
    >
      <EwrbLogo tone="dark" alt="EWRB Registered Electrician" className="h-14" />
      <span className="eyebrow text-[10px] leading-relaxed">
        Registered electrician
        <br />
        EWRB licence held
      </span>
    </a>
  );
}

function AwardBadge() {
  return (
    <Link
      to="/portfolio/$slug"
      params={{ slug: "courtyard-house" }}
      className={cn(badge, "max-w-md gap-4")}
    >
      <Award className="size-8 shrink-0" strokeWidth={1.1} />
      <span className="text-sm leading-snug">
        Electrician on Courtyard House — Gold Award, Master Builders House of the Year 2025, Bay of
        Plenty & Central Plateau
      </span>
    </Link>
  );
}

/** The directors, each portrait hung like a gallery piece, its picture light switching on in view. */
function Directors({ google }: { google: ReturnType<typeof Route.useLoaderData> }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-director]", el).forEach((row) => {
        const lights = row.querySelectorAll("[data-picture-light]");
        const frame = row.querySelector("[data-frame]");
        gsap.set(lights, { opacity: 0 });
        gsap.set(frame, { autoAlpha: 0, y: 40 });
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 75%", once: true } })
          .to(frame, { autoAlpha: 1, y: 0, duration: 1.4, ease: "expo.out" })
          .to(lights, { keyframes: { opacity: [0, 1, 0.3, 1] }, duration: 0.6, ease: "none" }, 0.7);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="directors-title"
      className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10"
    >
      <div className="border-t border-ink/15 pt-24 md:pt-32">
        <p className="eyebrow text-ink-soft">The team</p>
        <SplitReveal
          as="h1"
          id="directors-title"
          className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
        >
          The directors.
        </SplitReveal>
      </div>

      {DIRECTORS.map((d, i) => {
        const flip = i % 2 === 1;
        const [lead, ...rest] = "lead" in d && d.lead ? [d.lead, ...d.bio] : d.bio;
        const [director, title] = d.role.split(" · ");
        return (
          <article
            key={d.name}
            data-director
            className="grid items-start gap-12 pt-20 md:grid-cols-12 md:gap-16 md:pt-28"
          >
            <div
              className={cn(
                "relative mx-auto w-full max-w-md md:col-span-5 md:max-w-none",
                flip && "md:order-2 md:col-start-8",
              )}
            >
              {/* picture light */}
              <div
                data-picture-light
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-10 z-10 flex justify-center"
              >
                <span className="h-2 w-1/3 rounded-full bg-frame shadow-[0_6px_22px_rgb(255_231_194/0.9)]" />
              </div>
              <div
                data-picture-light
                aria-hidden
                className="pointer-events-none absolute -inset-x-16 -top-10 bottom-[40%]"
                style={{
                  background:
                    "radial-gradient(50% 70% at 50% 0%, rgb(255 244 226 / 0.9), rgb(255 232 200 / 0.25) 50%, transparent 80%)",
                  mixBlendMode: "soft-light",
                }}
              />
              <div
                data-frame
                className="relative border-[8px] border-frame bg-frame shadow-[0_50px_100px_-45px_rgb(0_0_0/0.7)] md:border-[12px]"
              >
                <img
                  src={d.photo.src}
                  width={d.photo.w}
                  height={d.photo.h}
                  alt={d.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div
                  data-picture-light
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(70% 60% at 50% 0%, rgb(255 236 206 / 0.4), transparent 75%)",
                    mixBlendMode: "soft-light",
                  }}
                />
              </div>
            </div>

            <div className={cn("md:col-span-6 md:pt-6", flip ? "md:order-1" : "md:col-start-7")}>
              <p className="eyebrow text-ink-soft">
                <BrandText text={director} />
                {title && (
                  <>
                    <span className="mx-2 opacity-50">·</span>
                    {title}
                  </>
                )}
              </p>
              <h3 className="display-caps mt-5 text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.05] tracking-[0.1em]!">
                {d.name}
              </h3>
              <div className="led-h mt-7 max-w-[10rem] opacity-80" aria-hidden />
              <LightWords
                className="mt-8 font-display text-[clamp(1.45rem,2.2vw,2rem)] leading-snug text-ink"
                text={lead}
              />
              <Reveal stagger={0.08} className="mt-8 space-y-5">
                {rest.map((para) => (
                  <p key={para} className="text-[1.05rem] leading-relaxed text-ink-soft">
                    <BrandText text={para} />
                  </p>
                ))}
              </Reveal>
              <Reveal className="mt-10 flex flex-wrap gap-4">
                {d.credentials.map((c) =>
                  c === "ewrb" ? (
                    <EwrbBadge key={c} />
                  ) : c === "award" ? (
                    <AwardBadge key={c} />
                  ) : (
                    <GoogleReviewsBadge key={c} google={google} />
                  ),
                )}
              </Reveal>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/** Three wall switches that flip on as they come into view. */
function Values() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const card = e.target as HTMLElement;
          setTimeout(() => card.setAttribute("data-on", ""), Number(card.dataset.delay ?? 0));
          io.unobserve(card);
        }),
      { threshold: 0.5 },
    );
    el.querySelectorAll("[data-switch-card]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-night
      className="theme-night relative overflow-hidden bg-night py-28 md:py-40"
      aria-labelledby="values-title"
    >
      <div className="led-h absolute inset-x-0 top-0 opacity-70" />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow text-muted-foreground">Working with Balance</p>
        <SplitReveal
          as="h2"
          id="values-title"
          className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]! text-ivory"
        >
          What you can expect.
        </SplitReveal>
        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3 md:gap-8">
          {VALUES.map((v, i) => (
            <article
              key={v.title}
              data-switch-card
              data-delay={i * 220}
              className="group relative overflow-hidden border border-ivory/10 p-8 transition-[border-color] duration-700 data-[on]:border-glow/25 md:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-3/4 opacity-0 transition-opacity duration-[1400ms] group-data-[on]:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 70% at 50% 0%, rgb(255 231 194 / 0.14), transparent 75%)",
                }}
              />
              <div className="relative flex items-start justify-between">
                <span className="font-display text-6xl leading-none text-ivory/15 transition-colors duration-700 group-data-[on]:text-glow-soft/60">
                  0{i + 1}
                </span>
                {/* rocker switch */}
                <span
                  aria-hidden
                  className="relative flex h-14 w-9 justify-center rounded-md border border-ivory/25 bg-black/30 p-1"
                >
                  <span className="h-1/2 w-full rounded-sm bg-ivory/25 transition-[transform,background-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] group-data-[on]:translate-y-full group-data-[on]:bg-glow-soft group-data-[on]:shadow-[0_0_14px_rgb(255_231_194/0.8)]" />
                </span>
              </div>
              <h3 className="display-caps relative mt-12 text-2xl tracking-[0.16em]! text-ivory">
                {v.title}
              </h3>
              <p className="relative mt-4 leading-relaxed text-muted-foreground">{v.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const RECENT = ["courtyard-house", "beechtree-studio", "cedar-gables", "twin-pavilions"];

/** Four chapters from the portfolio, so the story ends on the work itself. */
function RecentWork() {
  const projects = RECENT.map((slug) => PORTFOLIO.find((p) => p.slug === slug)).filter(
    (p) => p !== undefined,
  );
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-28 md:px-10 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow text-ink-soft">Recent work</p>
          <SplitReveal
            as="h2"
            className="display-caps mt-5 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1] tracking-[0.1em]!"
          >
            Experience in practice.
          </SplitReveal>
        </div>
        <Button asChild variant="luxOutline" size="xl">
          <Link to="/portfolio">
            View all projects <ArrowRight />
          </Link>
        </Button>
      </div>
      <Reveal
        stagger={0.08}
        className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {projects.map((p) => (
          <Link
            key={p.slug}
            to="/portfolio"
            hash={p.slug}
            data-cursor="Open"
            className="group block"
          >
            <span className="relative block aspect-[4/5] overflow-hidden border-[6px] border-frame bg-frame">
              <img
                src={p.photos[0].sm}
                alt={`${p.photos[0].title}, ${p.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
            </span>
            <span className="display-caps mt-4 block text-lg tracking-[0.14em]!">{p.title}</span>
            <span className="eyebrow mt-2 block text-[10px] text-ink-soft">
              {p.location} · {p.tags.join(" · ")}
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
