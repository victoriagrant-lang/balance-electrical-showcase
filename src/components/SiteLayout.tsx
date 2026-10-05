import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { EwrbLogo } from "@/components/EwrbLogo";
import { AREAS } from "@/lib/areas";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/areas-of-expertise", label: "Expertise" },
  { to: "/projects", label: "Gallery" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

// Footer service list → each service's own page, in the same order as the home page chapters,
// then maintenance (which has no home chapter).
const SERVICE_LINKS: [string, string][] = [
  ["New builds", "new-build-electrician-taupo"],
  ["Lighting design", "lighting-design-taupo"],
  ["Commercial electrical", "commercial-electrician-taupo"],
  ["Air conditioning", "air-conditioning-heating-taupo"],
  ["Renovations & upgrades", "renovation-electrician-taupo"],
  ["Solar & battery", "solar-installation-taupo"],
  ["Smart home & automation", "smart-home-automation-taupo"],
  ["EV charging", "ev-charger-installation-taupo"],
  ["Maintenance & repairs", "maintenance-electrician-taupo"],
];

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="stone-texture flex min-h-screen flex-col text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/*
  One fixed bar, styled like the dark frame around the Balance sign. It never hides,
  resizes or changes colour while scrolling — so it reads as part of the page, not a
  flicker, whatever section passes beneath it.
*/
function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ivory/10 bg-frame/88 text-ivory backdrop-blur-md [transform:translateZ(0)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link
          to="/"
          className="group -m-2 p-2"
          aria-label="Balance Electrical, electrician in Taupō — home"
        >
          <Logo hoverBalance className="w-[132px] text-stone-pale md:w-[152px]" />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="beam-link eyebrow text-[10.5px] opacity-70 transition-opacity duration-300 hover:opacity-100"
              activeProps={{ className: "!opacity-100" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* On phones, where "Let's talk" is hidden, one tap calls Victoria. */}
          <a
            href={CONTACT.tel}
            aria-label={`Call Victoria on ${CONTACT.phoneLocal}`}
            className="flex size-11 items-center justify-center opacity-80 transition-opacity hover:opacity-100 sm:hidden"
          >
            <Phone className="size-[18px]" strokeWidth={1.25} />
          </a>
          <Button
            asChild
            variant="lux"
            className="hidden h-11 bg-stone-pale px-6 text-[10.5px] text-frame hover:bg-ivory sm:inline-flex"
          >
            <Link to="/contact">Let's talk</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
      <div aria-hidden className="led-h absolute inset-x-0 bottom-0 opacity-40" />
    </header>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="group relative -mr-2 flex size-11 items-center justify-center lg:hidden"
          aria-label="Open menu"
        >
          <span className="absolute h-px w-6 -translate-y-[4px] bg-current transition-transform duration-500 group-hover:translate-x-0.5" />
          <span className="absolute h-px w-6 translate-y-[4px] bg-current transition-transform duration-500 group-hover:-translate-x-0.5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="theme-night h-[100dvh] border-none bg-night p-0 text-ivory [&>button]:right-5 [&>button]:top-6 [&>button]:size-8 [&>button]:focus:ring-0 [&>button]:focus-visible:ring-1"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 0%, rgb(255 231 194 / 0.14), rgb(242 200 139 / 0.04) 50%, transparent 80%)",
          }}
        />
        <div className="relative flex h-full flex-col px-6 pb-10 pt-6">
          <Logo className="w-[132px] text-stone-pale" />
          <nav className="mt-16 flex flex-col gap-2" aria-label="Mobile">
            {nav.map((n, i) => (
              <SheetClose asChild key={n.to}>
                <Link
                  to={n.to}
                  className="display-caps flex items-baseline gap-4 py-2 text-[2.1rem] leading-none tracking-[0.14em] text-ivory/70 transition-colors hover:text-ivory"
                  activeProps={{ className: "!text-ivory text-glow" }}
                  activeOptions={{ exact: true }}
                  style={{
                    animation: `fadeInUp 0.8s var(--ease-out-expo) ${0.1 + i * 0.06}s both`,
                  }}
                >
                  <span className="eyebrow text-[10px] text-muted-foreground">0{i + 1}</span>
                  {n.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto space-y-2 text-sm text-muted-foreground">
            <div className="led-h mb-6 opacity-60" />
            <a href={CONTACT.tel} className="block font-display text-2xl text-ivory">
              {CONTACT.phoneLocal}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="block">
              {CONTACT.email}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SiteFooter() {
  return (
    <footer data-night className="theme-night relative overflow-hidden bg-frame text-ivory">
      <div className="led-h opacity-70" />
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-24 md:px-10 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-muted-foreground">Let's talk</p>
            <h2 className="mt-5 max-w-md font-display text-4xl leading-tight">
              Let’s get your project underway.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Planning a new build, a renovation or an electrical upgrade? Tell us what you have in
              mind. We’ll talk through your requirements and the next steps.
            </p>
            <Link to="/contact" className="beam-link mt-6 inline-flex items-center gap-2">
              Discuss your project <ArrowUpRight className="size-4" />
            </Link>
            <a
              href={CONTACT.tel}
              data-cursor="Call Victoria"
              className="group mt-6 block font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-none text-ivory transition-[text-shadow] duration-700 hover:text-glow"
            >
              {CONTACT.phoneLocal}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="beam-link mt-6 inline-flex items-center gap-2 text-base text-ivory/80 hover:text-ivory"
            >
              {CONTACT.email}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 md:col-span-6 md:grid-cols-3">
            <div>
              <p className="eyebrow mb-5 text-muted-foreground">Explore</p>
              <ul className="space-y-3 text-sm">
                {nav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="beam-link text-ivory/80 hover:text-ivory">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-muted-foreground">Services</p>
              <ul className="space-y-3 text-sm">
                {SERVICE_LINKS.map(([label, area]) => (
                  <li key={label}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: area }}
                      className="beam-link text-ivory/80 hover:text-ivory"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow mb-5 text-muted-foreground">Working across</p>
              <ul className="space-y-3 text-sm">
                {AREAS.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to="/areas/$slug"
                      params={{ slug: a.slug }}
                      className="beam-link text-ivory/80 hover:text-ivory"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <EwrbLogo tone="light" className="mt-8 h-12" />
            </div>
          </div>
        </div>

        <GiantLogo />

        <div className="flex flex-col items-start justify-between gap-3 border-t border-ivory/10 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Balance Electrical Ltd · Electrician in Taupō, New Zealand
            · Mon–Fri 7:30am–5:30pm
          </p>
          <p className="eyebrow text-[10px]">Licensed Electrical Worker · EWRB Registered</p>
        </div>
      </div>
    </footer>
  );
}

/** Full-width wordmark in the dark; the cursor is a torch that lights its strokes. */
function GiantLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const setX = gsap.quickTo(el, "--mx", { duration: 0.8, ease: "power3.out" });
    const setY = gsap.quickTo(el, "--my", { duration: 0.8, ease: "power3.out" });

    if (!isFinePointer()) {
      // Touch: a slow sweep of light across the letters.
      const tween = gsap.fromTo(
        el,
        { "--mx": -10 },
        { "--mx": 110, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
      gsap.set(el, { "--my": 50 });
      return () => {
        tween.kill();
      };
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setX(((e.clientX - r.left) / r.width) * 100);
      setY(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative my-20 select-none md:my-28"
      style={{ ["--mx" as string]: 50, ["--my" as string]: 50 }}
    >
      <Logo className="w-full text-ivory/[0.07]" title="" />
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle min(22vw,280px) at calc(var(--mx) * 1%) calc(var(--my) * 1%), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(circle min(22vw,280px) at calc(var(--mx) * 1%) calc(var(--my) * 1%), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
        }}
      >
        <Logo
          className="w-full text-glow-soft [filter:drop-shadow(0_0_14px_rgb(242_200_139/0.7))_drop-shadow(0_0_40px_rgb(242_200_139/0.35))]"
          title=""
        />
      </div>
    </div>
  );
}
