import { AREAS } from "@/lib/areas";
import { CONTACT } from "@/lib/contact";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";
import { ENTITY_SUMMARY, HOME_FAQS, SITE, TEAM_SUMMARY } from "@/lib/seo";

/*
  /llms.txt (and the longer /llms-full.txt) give AI assistants a plain-language summary
  of the business with links, following https://llmstxt.org. Built from the site data, and
  worded exactly like the schema and the home FAQ so every source says the same thing.
*/

const facts = `- Business: Balance Electrical (Balance Electrical Ltd), Taupō, New Zealand — ${SITE}
- Owner and Director: Victoria Grant — registered and licensed electrician (Electrical Workers Registration Board, EWRB); raised in Taupō, trained in Wellington; design lead on lighting and electrical planning
- Works alongside: Mitchell (Mitch) Pearce, Director of Balance Air Conditioning — electrician holding the same EWRB licence, working across electrical and air-conditioning systems, from high-wall heat pumps to fully ducted systems built into ceilings and joinery
- Working with Balance: you deal directly with Victoria from the first conversation to the finished installation
- Service area: ${AREAS.map((a) => a.name).join(", ")}, Kuratau, Ātiamuri and the wider Taupō district. Work is done on site; there is no shopfront or public street address
- Hours: Monday–Friday, 7:30am–5:30pm
- Phone: ${CONTACT.phoneLocal} (${CONTACT.phone})
- Email: ${CONTACT.email}
- Enquiries and quotes: ${SITE}/contact — replies within a few days
- Google Business Profile and reviews: https://g.page/r/CUTDVwlL1oZeEBM
- Recognition: Balance was the electrician on Courtyard House, which won a Gold Award at the Master Builders House of the Year 2025 (Bay of Plenty & Central Plateau). The award went to the house and its builder.
- Showhome: Cedar Gables in Kinloch is Balance's own showhome, combining interior design, lighting, integrated air conditioning and smart-home control`;

const intro = `# Balance Electrical

> ${ENTITY_SUMMARY}

${TEAM_SUMMARY}`;

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
- [About — Victoria Grant and Mitch Pearce](${SITE}/about)
- [Electrical services in Taupō (areas of expertise)](${SITE}/areas-of-expertise)
- [Portfolio — project stories](${SITE}/portfolio)
- [Gallery — photos by type of work](${SITE}/projects)
- [Contact and quotes](${SITE}/contact)

## Optional
- [Full text: services, FAQs, areas and project write-ups](${SITE}/llms-full.txt)
`;
}

export function llmsFullTxt() {
  return `${intro}

## Key facts
${facts}

## Questions
${HOME_FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

${SERVICES.map(
  (s) => `## ${s.h1}
URL: ${SITE}/services/${s.slug}

${s.intro.join("\n\n")}

What's included:
${s.includes.map((i) => `- ${i}`).join("\n")}

${s.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`,
).join("\n")}
${AREAS.map(
  (a) => `## ${a.h1}
URL: ${SITE}/areas/${a.slug}

${a.intro.join("\n\n")}
`,
).join("\n")}
${PORTFOLIO.map(
  (p) => `## Project: ${p.title}
${p.location} · ${p.tags.join(" · ")}${p.accolade ? `\nAward for the house (Balance was the electrician): ${p.accolade}` : ""}
URL: ${SITE}/portfolio/${p.slug}

${(p.story ?? [p.summary]).join("\n\n")}

${p.detailsTitle}:
${p.details.map((d) => `- ${d}`).join("\n")}
`,
).join("\n")}`;
}
