/*
  Makes the downloadable PDF of the Terms of Trade from src/lib/terms.ts: white A4 pages, the
  charcoal BALANCE logo, and the same section and clause numbers as /terms-of-trade.

    npx tsx scripts/terms-pdf.tsx

  Needs Playwright with Chromium (it isn't a project dependency; install it globally and run
  with NODE_PATH="$(npm root -g)"). The brand fonts are downloaded from Google Fonts and embedded,
  so the browser itself needs no network (behind a proxy, set NODE_USE_ENV_PROXY=1 too).
  Writes public/balance-electrical-terms-of-trade-v{version}.pdf. Run it whenever the terms
  change, after bumping their version.
*/
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Logo } from "@/components/brand/Logo";
import { CONTACT } from "@/lib/contact";
import { TERMS, TERMS_PDF } from "@/lib/terms";

const CHARCOAL = "#1c1a18";
const INK_SOFT = "#2e2924";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Josefin+Sans:wght@300;400;600&display=swap";
const PAGE_URL = "balanceelectrical.co.nz/terms-of-trade";

/** Google Fonts' CSS for the brand fonts, with each font file embedded in it. */
async function embeddedFonts() {
  const get = (url: string) =>
    fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/130.0" } }).then(
      (res) => {
        if (!res.ok) throw new Error(`${url} → ${res.status}`);
        return res;
      },
    );
  const css = await (await get(FONTS)).text();
  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
  if (!urls.length) throw new Error("Google Fonts returned no font files");
  let embedded = css;
  for (const url of urls) {
    const type = url.endsWith(".woff2")
      ? "font/woff2"
      : url.endsWith(".woff")
        ? "font/woff"
        : "font/ttf";
    const data = Buffer.from(await (await get(url)).arrayBuffer()).toString("base64");
    embedded = embedded.split(url).join(`data:${type};base64,${data}`);
  }
  return embedded;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fonts = await embeddedFonts();
const logo = renderToStaticMarkup(
  createElement(Logo, { tagline: true, title: "Balance Electrical" }),
);

const sections = TERMS.sections
  .map(
    (s, i) => `
      <section>
        <h2><span class="n">${i + 1}.</span> ${esc(s.heading)}</h2>
        <ol>${s.clauses
          .map((c, j) => `<li><span class="n">${i + 1}.${j + 1}</span><p>${esc(c)}</p></li>`)
          .join("")}</ol>
      </section>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en-NZ">
<head>
<meta charset="utf-8">
<title>Terms of Trade — Balance Electrical Limited (version ${TERMS.version})</title>
<style>${fonts}</style>
<style>
  :root { --font-sans: "Josefin Sans", sans-serif; }
  @page { size: A4; margin: 18mm 18mm 20mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #fff; color: ${INK_SOFT}; }
  body { font: 400 9.4pt/1.5 "Josefin Sans", sans-serif; -webkit-print-color-adjust: exact; }
  .logo { width: 62mm; color: ${CHARCOAL}; }
  .logo svg { display: block; width: 100%; height: auto; overflow: visible; }
  h1 { font: 500 30pt/1 "Cormorant Garamond", serif; color: ${CHARCOAL}; letter-spacing: 0.08em; text-transform: uppercase; margin: 12mm 0 0; }
  .meta { margin: 4mm 0 0; font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: ${CHARCOAL}; }
  .meta + .meta { margin-top: 1.5mm; }
  .rule { border: 0; border-top: 0.6pt solid ${CHARCOAL}; margin: 7mm 0 6mm; opacity: 0.35; }
  .intro p { margin: 0 0 3mm; font-size: 10pt; }
  .contents { margin: 6mm 0 2mm; }
  .contents h3, .questions h3 { font: 600 7.5pt/1 "Josefin Sans", sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: ${CHARCOAL}; margin: 0 0 3mm; }
  .contents ol { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 10mm; font-size: 9pt; }
  .contents li { break-inside: avoid; margin: 0 0 1.2mm; }
  section { margin-top: 7mm; }
  h2 { font: 500 14.5pt/1.2 "Cormorant Garamond", serif; color: ${CHARCOAL}; margin: 0 0 3mm; break-after: avoid; }
  h2 .n { font-variant-numeric: lining-nums; }
  ol { margin: 0; padding: 0; list-style: none; }
  section li { display: grid; grid-template-columns: 11mm 1fr; margin: 0 0 2.4mm; break-inside: avoid; }
  section li .n { font-weight: 600; color: ${CHARCOAL}; font-variant-numeric: tabular-nums; }
  section li p { margin: 0; }
  .questions { margin-top: 9mm; padding-top: 5mm; border-top: 0.6pt solid rgba(28,26,24,0.35); break-inside: avoid; }
  .questions p { margin: 0; }
</style>
</head>
<body>
  <div class="logo">${logo}</div>
  <h1>Terms of Trade</h1>
  <p class="meta">Balance Electrical Limited · NZBN 9429050562695</p>
  <p class="meta">Version ${TERMS.version} · In effect from ${esc(TERMS.effective)}</p>
  <p class="meta">${CONTACT.phoneLocal} · ${CONTACT.email}</p>
  <p class="meta">${PAGE_URL}</p>
  <hr class="rule">
  <div class="intro">${TERMS.intro.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
  <nav class="contents"><h3>Contents</h3><ol>${TERMS.sections
    .map((s, i) => `<li>${i + 1}. ${esc(s.heading)}</li>`)
    .join("")}</ol></nav>
  ${sections}
  <div class="questions">
    <h3>Questions about these terms</h3>
    <p>Call Victoria on ${CONTACT.phoneLocal} or email ${CONTACT.email}. Monday to Friday, 7:30am to 5:30pm. The current version is always at ${PAGE_URL}.</p>
  </div>
</body>
</html>`;

// The footer is drawn separately on every page, so it gets its own copy of the fonts.
const footer = `<style>${fonts}</style><div style="width:100%;padding:0 18mm;font:7pt/1 'Josefin Sans',Helvetica,Arial,sans-serif;color:${CHARCOAL};display:flex;justify-content:space-between;letter-spacing:0.06em">
  <span>Balance Electrical Limited · Terms of Trade · Version ${TERMS.version} (${esc(TERMS.effective)})</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

const { chromium } = createRequire(import.meta.url)("playwright") as typeof import("playwright");
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
const fontsLoaded = await page.evaluate(async () => {
  await document.fonts.ready;
  return [
    '600 12px "Josefin Sans"',
    '400 12px "Josefin Sans"',
    '500 12px "Cormorant Garamond"',
  ].every(
    (f) => document.fonts.check(f) && [...document.fonts].some((ff) => ff.status === "loaded"),
  );
});
if (!fontsLoaded) {
  await browser.close();
  throw new Error("The brand fonts (Josefin Sans, Cormorant Garamond) didn't load");
}
const out = `public${TERMS_PDF}`;
writeFileSync(
  out,
  await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer,
  }),
);
await browser.close();
console.log(`Wrote ${out}`);
