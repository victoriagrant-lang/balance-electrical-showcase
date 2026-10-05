import { AREAS } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/seo";

/*
  /llms.txt (and the longer /llms-full.txt) give AI assistants a plain-language summary
  of the business with links, following https://llmstxt.org. Built from the site data.
*/

const facts = `- Business: Balance Electrical Ltd, Taupō, New Zealand
- Owner and electrician: Victoria Grant, registered electrician (Electrical Workers Registration Board, EWRB)
- Owner-operated: the person who quotes is the person who does the work
- Service area: ${AREAS.map((a) => a.name).join(", ")} and the wider Taupō district
- Hours: Monday–Friday, 7:30am–5:30pm
- Phone: ${CONTACT.phoneLocal} (${CONTACT.phone})
- Email: ${CONTACT.email}
- Enquiries: ${SITE}/contact — replies within a few days
- Recognition: electrician on Courtyard House, Gold Award winner, Master Builders House of the Year 2025 (Bay of Plenty & Central Plateau)
- Showhome: Cedar Gables in Kinloch is Balance's own showhome, combining interior design, lighting, integrated air conditioning and smart-home control`;

const intro = `# Balance Electrical

> Owner-operated registered electrician in Taupō, New Zealand, led by Victoria Grant. Electrical design and installation for new homes, renovations and commercial buildings — with architectural lighting design, heat pumps and ducted heating and cooling built into joinery, solar and battery storage, EV chargers and smart-home control.`;

export function llmsTxt() {
  return `${intro}

## Key facts
${facts}

## Services
${SERVICES.map((s) => `- [${s.h1}](${SITE}/services/${s.slug}): ${s.metaDescription}`).join("\n")}

## Areas
${AREAS.map((a) => `- [${a.h1}](${SITE}/areas/${a.slug}): ${a.metaDescription}`).join("\n")}

## Projects
${PORTFOLIO.map((p) => `- [${p.title}](${SITE}/portfolio/${p.slug}) — ${p.location}, ${p.tags.join(", ")}: ${p.summary}`).join("\n")}

## Pages
- [About Victoria Grant](${SITE}/about)
- [Areas of expertise](${SITE}/areas-of-expertise)
- [Portfolio — project stories](${SITE}/portfolio)
- [Gallery — photos by type of work](${SITE}/projects)
- [Contact and project brief](${SITE}/contact)

## Optional
- [Full text: services, FAQs and project write-ups](${SITE}/llms-full.txt)
`;
}

export function llmsFullTxt() {
  return `${intro}

## Key facts
${facts}

${SERVICES.map(
  (s) => `## ${s.h1}
URL: ${SITE}/services/${s.slug}

${s.intro.join("\n\n")}

What's included:
${s.includes.map((i) => `- ${i}`).join("\n")}

${s.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`,
).join("\n")}
${PORTFOLIO.map(
  (p) => `## Project: ${p.title}
${p.location} · ${p.tags.join(" · ")}${p.accolade ? `\nAward: ${p.accolade}` : ""}
URL: ${SITE}/portfolio/${p.slug}

${(p.story ?? [p.summary]).join("\n\n")}

${p.detailsTitle}:
${p.details.map((d) => `- ${d}`).join("\n")}
`,
).join("\n")}`;
}
