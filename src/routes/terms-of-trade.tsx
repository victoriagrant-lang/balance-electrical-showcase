import { createFileRoute } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { FileDown } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLenis } from "@/hooks/use-lenis";
import { CONTACT } from "@/lib/contact";
import { SITE, breadcrumbs, businessRef, jsonLd, websiteRef } from "@/lib/seo";
import { TERMS, TERMS_PDF } from "@/lib/terms";

/*
  Balance Electrical's terms of trade. Quotes, invoices and payment reminders point here by
  clause number, so the page is plain, numbered from the order in lib/terms.ts (clause 14.4 is
  #overdue-4), prints cleanly, and links the PDF copy of the same version.
*/
export const Route = createFileRoute("/terms-of-trade")({
  head: () => ({
    meta: [
      { title: "Terms of Trade | Balance Electrical" },
      {
        name: "description",
        content:
          "The terms Balance Electrical works to in Taupō: quotes, payment, changes to a job, certificates, guarantees, and what happens if an invoice isn't paid.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Terms of Trade — Balance Electrical" },
      { property: "og:url", content: `${SITE}/terms-of-trade` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/terms-of-trade` }],
    scripts: [
      jsonLd([
        {
          "@type": "WebPage",
          "@id": `${SITE}/terms-of-trade#page`,
          url: `${SITE}/terms-of-trade`,
          name: "Terms of Trade",
          inLanguage: "en-NZ",
          isPartOf: websiteRef,
          about: businessRef,
          dateModified: TERMS.effectiveIso,
        },
        breadcrumbs([
          ["Home", "/"],
          ["Terms of Trade", "/terms-of-trade"],
        ]),
      ]),
    ],
  }),
  component: TermsOfTrade,
});

function TermsOfTrade() {
  const lenis = useLenis();
  // With smooth scrolling on, glide to the section. Lenis honours the section's scroll margin,
  // which keeps it clear of the fixed header (as it does for links straight to a clause).
  const go = (id: string) => (e: MouseEvent) => {
    const el = document.getElementById(id);
    if (!lenis || !el) return;
    e.preventDefault();
    lenis.scrollTo(el, { duration: 1.4 });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <SiteLayout>
      <article className="mx-auto max-w-[1440px] px-5 pb-28 pt-36 md:px-10 md:pb-40 md:pt-48 print:p-0">
        <div className="max-w-3xl">
          <p className="eyebrow text-ink-soft">Balance Electrical Limited</p>
          <h1 className="display-caps mt-6 text-[clamp(2.2rem,5.6vw,4.8rem)] leading-[0.95] tracking-[0.08em]!">
            Terms of trade
          </h1>
          <p className="eyebrow mt-6 text-[10px] text-ink-soft">
            Version {TERMS.version} · In effect from {TERMS.effective}
          </p>
          <p className="mt-2 hidden text-xs text-ink-soft print:block">
            {SITE.replace(/^https:\/\/(www\.)?/, "")}/terms-of-trade
          </p>
          {TERMS.intro.map((p) => (
            <p key={p.slice(0, 32)} className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
          <a
            href={TERMS_PDF}
            download
            className="beam-link eyebrow mt-8 inline-flex items-center gap-2 text-[10px] print:hidden"
          >
            <FileDown className="size-3.5" strokeWidth={1.5} /> Download PDF
          </a>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 print:mt-8 print:block">
          <nav
            aria-label="Contents"
            className="self-start lg:sticky lg:top-28 lg:col-span-3 print:hidden"
          >
            <p className="eyebrow text-[10px] text-ink-soft">Contents</p>
            <ol className="mt-4 space-y-2 text-sm">
              {TERMS.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={go(s.id)} className="beam-link">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-14 lg:col-span-8 lg:col-start-5 print:space-y-8">
            {TERMS.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-28 break-inside-avoid-page"
              >
                <h2
                  id={`${s.id}-title`}
                  className="font-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-snug text-ink"
                >
                  {i + 1}. {s.heading}
                </h2>
                <ol className="mt-5 space-y-4">
                  {s.clauses.map((c, j) => (
                    <li
                      key={`${s.id}-${j + 1}`}
                      id={`${s.id}-${j + 1}`}
                      className="grid scroll-mt-28 grid-cols-[3rem_1fr] gap-2 leading-relaxed text-ink-soft"
                    >
                      <span className="tabular-nums text-ink">
                        {i + 1}.{j + 1}
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            <section className="border-t border-ink/15 pt-10">
              <h2 className="eyebrow text-[10px] text-ink-soft">Questions about these terms</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Call Victoria on{" "}
                <a href={CONTACT.tel} className="beam-link text-ink">
                  {CONTACT.phoneLocal}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${CONTACT.email}`} className="beam-link text-ink">
                  {CONTACT.email}
                </a>
                . Monday to Friday, 7:30am to 5:30pm.
              </p>
            </section>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
