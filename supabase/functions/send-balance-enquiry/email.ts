import { LOGO_CID, LOGO_HEIGHT, LOGO_PNG_BASE64, LOGO_WIDTH } from "./logo.ts";

/*
  The two enquiry emails, styled like the website: a night header carrying the
  BALANCE wordmark and a warm LED line, an ivory panel for the detail, and the
  site's type pairing (Cormorant Garamond / Josefin Sans, falling back to Georgia /
  Arial where a mail app won't load web fonts). Table layout and inline styles only,
  so it holds together in Gmail and Outlook.
*/

export const PHONE_DISPLAY = "027 916 2077";
export const PHONE_TEL = "+64279162077";
export const INBOX = "enquiries@balanceelectrical.co.nz";

const C = {
  page: "#a69486", // stone
  night: "#121211",
  frame: "#1c1d1f",
  panel: "#ece4da", // ivory
  ink: "#1c1a18",
  soft: "#5a5048",
  rule: "#d3c7b9",
  pale: "#d6cabd", // stone-pale
  dim: "#9a9086",
  glow: "#f2c88b",
  glowSoft: "#ffe7c2",
};

const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
const SANS = "'Josefin Sans',Arial,Helvetica,sans-serif";

export type EnquiryView = {
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  suburb: string;
  service: string;
  stage: string;
  budget: string;
  timeframe: string;
  message: string;
  files: { name: string; size: number }[];
  receivedAt: string;
  siteUrl: string;
};

/** The inline logo, attached once to every email that uses the shell. */
export const logoAttachment = () => ({
  filename: "balance-electrical.png",
  content: LOGO_PNG_BASE64,
  content_id: LOGO_CID,
});

// Everything a visitor types is escaped before it goes anywhere near HTML.
export const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const multiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");
const kb = (n: number) =>
  n > 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
const capitalise = (s: string) => (s ? s[0].toLocaleUpperCase("en-NZ") + s.slice(1) : s);

const eyebrow = (text: string, color: string, extra = "") =>
  `<div style="font-family:${SANS};font-size:10px;line-height:1.6;letter-spacing:0.34em;text-transform:uppercase;color:${color};${extra}">${text}</div>`;

/** A pill button that matches the site's "lux" buttons. */
function button(href: string, label: string, dark = true) {
  const bg = dark ? C.ink : "transparent";
  const fg = dark ? C.panel : C.ink;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;margin:0 8px 10px 0;"><tr>
<td style="border-radius:999px;background:${bg};border:1px solid ${C.ink};">
<a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:10.5px;letter-spacing:0.3em;text-transform:uppercase;color:${fg};text-decoration:none;">${label}</a>
</td></tr></table>`;
}

function shell(opts: { preheader: string; hero: string; body: string; siteUrl: string }) {
  const site = opts.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `<!doctype html>
<html lang="en-NZ">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Josefin+Sans:wght@400;600&display=swap" rel="stylesheet">
<title>Balance Electrical</title>
<style>
  @media (max-width: 620px) {
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .h1 { font-size: 32px !important; }
    .stack td.k { display: block !important; width: auto !important; padding-bottom: 0 !important; border-bottom: 0 !important; }
    .stack td.v { display: block !important; padding-top: 2px !important; }
  }
  a { color: ${C.ink}; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">${opts.preheader}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:36px 12px 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:8px solid ${C.frame};background:${C.panel};">

<tr><td class="px" bgcolor="${C.night}" style="background:${C.night};padding:38px 44px 0;">
<a href="${opts.siteUrl}" style="text-decoration:none;"><img src="cid:${LOGO_CID}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" alt="BALANCE" style="display:block;border:0;width:${LOGO_WIDTH}px;height:auto;color:${C.pale};font-family:${SERIF};font-size:22px;letter-spacing:0.4em;"></a>
${eyebrow("Electrical · Lighting · Climate", C.dim, "margin-top:14px;")}
</td></tr>
<tr><td class="px" bgcolor="${C.night}" style="background:${C.night};padding:34px 44px 40px;">${opts.hero}</td></tr>
<tr><td height="2" bgcolor="#6b5a45" style="height:2px;line-height:2px;font-size:0;background:#6b5a45;background-image:linear-gradient(90deg,rgba(242,200,139,0) 0%,${C.glowSoft} 50%,rgba(242,200,139,0) 100%);">&nbsp;</td></tr>

<tr><td class="px" style="padding:40px 44px 36px;">${opts.body}</td></tr>

<tr><td class="px" bgcolor="${C.night}" style="background:${C.night};padding:30px 44px 32px;">
<div style="font-family:${SERIF};font-size:20px;line-height:1.3;color:${C.panel};">Victoria Grant</div>
${eyebrow("Registered electrician · Taupō", C.dim, "margin-top:6px;")}
<div style="font-family:${SANS};font-size:13px;line-height:1.9;color:${C.pale};margin-top:16px;">
<a href="tel:${PHONE_TEL}" style="color:${C.pale};text-decoration:none;">${PHONE_DISPLAY}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="mailto:${INBOX}" style="color:${C.pale};text-decoration:none;">${INBOX}</a><br>
<a href="${opts.siteUrl}" style="color:${C.glowSoft};text-decoration:none;">${site}</a>
</div>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

function detailRows(d: EnquiryView) {
  const items: [string, string][] = [
    ["Name", esc(d.fullName)],
    ["Email", `<a href="mailto:${esc(d.email)}" style="color:${C.ink};">${esc(d.email)}</a>`],
    [
      "Phone",
      d.phone
        ? `<a href="tel:${esc(d.phone)}" style="color:${C.ink};text-decoration:none;">${esc(d.phone)}</a>`
        : "—",
    ],
    ["Location", d.suburb ? esc(d.suburb) : "—"],
    ["Project", esc(d.service)],
    ["Stage", d.stage ? esc(d.stage) : "—"],
    ["Budget", d.budget ? esc(d.budget) : "—"],
    ["Timeframe", d.timeframe ? esc(d.timeframe) : "—"],
    [
      "Files",
      d.files.length ? d.files.map((f) => `${esc(f.name)} (${kb(f.size)})`).join("<br>") : "—",
    ],
  ];
  return `<table role="presentation" class="stack" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.rule};">${items
    .map(
      ([k, v]) => `<tr>
<td class="k" style="padding:12px 16px 12px 0;border-bottom:1px solid ${C.rule};width:118px;vertical-align:top;font-family:${SANS};font-size:10px;line-height:1.9;letter-spacing:0.26em;text-transform:uppercase;color:${C.soft};">${k}</td>
<td class="v" style="padding:12px 0;border-bottom:1px solid ${C.rule};font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink};">${v}</td>
</tr>`,
    )
    .join("")}</table>`;
}

function messageBlock(d: EnquiryView) {
  return `${eyebrow("Message", C.soft, "margin:30px 0 10px;")}
<div style="border-left:2px solid ${C.glow};padding:2px 0 2px 18px;font-family:${SERIF};font-size:19px;line-height:1.55;color:${C.ink};">${multiline(d.message)}</div>`;
}

/** To Victoria: the enquiry itself, with quick actions at the top. */
export function enquiryEmail(d: EnquiryView) {
  const first = esc(capitalise(d.firstName));
  const actions =
    button(`mailto:${esc(d.email)}`, `Reply to ${first}`) +
    (d.phone ? button(`tel:${esc(d.phone.replace(/[^\d+]/g, ""))}`, "Call", false) : "");
  return shell({
    siteUrl: d.siteUrl,
    preheader: esc(`${d.service} — ${d.suburb || "location not given"}. ${d.message.slice(0, 90)}`),
    hero: `${eyebrow(`New project enquiry · ${esc(d.receivedAt)}`, C.glowSoft)}
<div class="h1" style="font-family:${SERIF};font-size:38px;line-height:1.15;color:${C.panel};margin:14px 0 6px;">${esc(d.fullName)}</div>
<div style="font-family:${SANS};font-size:14px;line-height:1.7;color:${C.pale};">${esc(d.service)}${d.suburb ? ` · ${esc(d.suburb)}` : ""}${d.budget ? ` · ${esc(d.budget)}` : ""}</div>`,
    body: `${actions}
<div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>
${detailRows(d)}
${messageBlock(d)}
<p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${C.soft};margin:28px 0 0;">Replying to this email goes straight to ${first}.${d.files.length ? " Their photos and plans are attached." : ""} Every enquiry is also saved to your <a href="${d.siteUrl}/enquiries" style="color:${C.ink};">enquiries list</a>.</p>`,
  });
}

/** To the person who filled in the form. */
export function confirmationEmail(d: EnquiryView) {
  const first = esc(capitalise(d.firstName));
  return shell({
    siteUrl: d.siteUrl,
    preheader: "Thanks for getting in touch — Victoria will be in touch within the next few days.",
    hero: `${eyebrow("Enquiry received", C.glowSoft)}
<div class="h1" style="font-family:${SERIF};font-size:40px;line-height:1.12;color:${C.panel};margin:14px 0 16px;">Thanks, ${first}.</div>
<div style="font-family:${SANS};font-size:15px;line-height:1.8;color:${C.pale};">Your enquiry has been sent to Balance Electrical. Victoria will be in touch within the next few days to talk it through.</div>`,
    body: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};background:rgba(166,148,134,0.22);border:1px solid ${C.rule};">
<tr><td style="padding:22px 24px;">
${eyebrow("Something urgent?", C.soft)}
<div style="font-family:${SERIF};font-size:22px;line-height:1.35;color:${C.ink};margin:6px 0 14px;">Call Victoria on <a href="tel:${PHONE_TEL}" style="color:${C.ink};text-decoration:none;white-space:nowrap;">${PHONE_DISPLAY}</a></div>
${button(`tel:${PHONE_TEL}`, "Call Victoria")}
</td></tr></table>

${eyebrow("What you sent", C.soft, "margin:36px 0 12px;")}
${detailRows(d)}
${messageBlock(d)}

<p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${C.soft};margin:28px 0 22px;">Need to add something? Just reply to this email — photos and plans are welcome.</p>
<div style="border-top:1px solid ${C.rule};padding-top:26px;">
${eyebrow("While you wait", C.soft, "margin-bottom:8px;")}
<div style="font-family:${SERIF};font-size:21px;line-height:1.4;color:${C.ink};margin-bottom:16px;">See how lighting, electrical and climate come together in our recent projects.</div>
${button(`${d.siteUrl}/portfolio`, "Explore the portfolio", false)}
</div>`,
  });
}
