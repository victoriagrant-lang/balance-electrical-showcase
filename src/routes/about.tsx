import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Award, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CONTACT } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { LightWords, Reveal, SplitReveal } from "@/components/motion/Reveal";
import { photos } from "@/lib/photos";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { EwrbLogo } from "@/components/EwrbLogo";
import { PORTFOLIO } from "@/lib/portfolio";

export const Route = createFileRoute("/about")({
  head: () => ({
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
      { property: "og:image", content: photos.victoria },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz/about" }],
  }),
  component: About,
});

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
  return (
    <SiteLayout>
      <AboutHero />

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <p className="eyebrow text-ink-soft">Her story</p>
            <div className="mt-4 h-px w-14 bg-ink/40" />
          </Reveal>
          <div className="md:col-span-9">
            <LightWords
              className="font-display text-[clamp(1.8rem,3.8vw,3.4rem)] leading-[1.15]"
              text="Raised in Taupō and trained in Wellington, Victoria returned home to establish Balance Electrical: a local business built on careful workmanship and personal service."
            />
            <Reveal
              stagger={0.12}
              className="mt-16 grid gap-10 text-[1.05rem] leading-relaxed text-ink-soft md:grid-cols-2"
            >
              <p>
                Victoria is a registered and licensed electrician who takes an active role in the
                work, from discussing your plans to completing the installation. You deal directly
                with the person responsible for your project.
              </p>
              <p>
                That personal approach matters whether you need an additional power point or a
                complete electrical installation. Victoria takes the time to understand what you
                need, explain the options and coordinate the work with your wider project.
              </p>
              <p className="md:col-span-2">
                Her experience includes homes in Kinloch, the Oakleaf Residence and Beechtree
                Building’s two-storey headquarters, alongside solar installations, air-conditioning
                and pool wiring. Across these projects, the focus is the same: electrical work
                planned around the property and the people who use it.
              </p>
            </Reveal>
            <Reveal className="mt-14 flex flex-wrap gap-4">
              <a
                href="https://www.ewrb.govt.nz"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-5 border border-ink/20 px-5 py-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/50 hover:shadow-[0_20px_50px_-30px_rgb(28_26_24/0.6)]"
              >
                <EwrbLogo tone="dark" alt="EWRB Registered Electrician" className="h-14" />
                <span className="eyebrow text-[10px] leading-relaxed">
                  Registered electrician
                  <br />
                  EWRB licence held
                </span>
              </a>
              <Link
                to="/portfolio"
                hash="oakleaf-residence"
                className="group inline-flex max-w-md items-center gap-4 border border-ink/20 px-5 py-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/50 hover:shadow-[0_20px_50px_-30px_rgb(28_26_24/0.6)]"
              >
                <Award className="size-8 shrink-0" strokeWidth={1.1} />
                <span className="text-sm leading-snug">
                  Electrician on the Oakleaf Residence — Gold Award, Master Builders House of the
                  Year 2025, Bay of Plenty & Central Plateau
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

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

/** The portrait hangs on the stone like a gallery piece, under a picture light. */
function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      gsap.set(q("[data-picture-light]"), { opacity: 0 });
      gsap.set(q("[data-frame]"), { autoAlpha: 0, y: 40 });
      const tl = gsap.timeline({ paused: true });
      tl.to(q("[data-frame]"), { autoAlpha: 1, y: 0, duration: 1.4, ease: "expo.out" }, 0.2).to(
        q("[data-picture-light]"),
        { keyframes: { opacity: [0, 1, 0.3, 1] }, duration: 0.6, ease: "none" },
        0.9,
      );
      const off = onIntroDone(() => tl.play());
      gsap.to(q("[data-frame]"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-36 md:px-10 md:pt-44"
    >
      <div className="grid items-end gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow text-ink-soft">About Victoria</p>
          <SplitReveal
            as="h1"
            immediate
            delay={0.3}
            className="display-caps mt-6 text-[clamp(2.6rem,6.3vw,6.4rem)] leading-[0.95] tracking-[0.08em]!"
          >
            Meet Victoria.
          </SplitReveal>
          <Reveal delay={0.6}>
            <p className="eyebrow mt-10 text-ink-soft">
              Owner-operator · Registered electrician · Taupō
            </p>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
              The person behind Balance Electrical — and your point of contact for electrical work,
              lighting and air-conditioning across Taupō and the surrounding district.
            </p>
          </Reveal>
        </div>
        <div className="relative md:col-span-5 md:col-start-8">
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
              src={photos.victoria}
              alt="Victoria Grant — owner and registered electrician"
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
      </div>
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

const RECENT = [
  "oakleaf-residence",
  "beechtree-building-headquarters",
  "sparrowhawk",
  "the-sisters",
];

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
