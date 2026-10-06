import { createFileRoute } from "@tanstack/react-router";
import { AREAS } from "@/lib/areas";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/seo";

// Built from the same data as the pages, so new projects and services appear automatically.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const pages: [string, number][] = [
          ["/", 1],
          ["/about", 0.8],
          ["/areas-of-expertise", 0.9],
          ["/portfolio", 0.9],
          ["/projects", 0.7],
          ["/contact", 0.8],
          ["/terms-of-trade", 0.3],
          ...SERVICES.map((s): [string, number] => [`/services/${s.slug}`, 0.9]),
          ...AREAS.map((a): [string, number] => [`/areas/${a.slug}`, 0.8]),
          ...PORTFOLIO.map((p): [string, number] => [`/portfolio/${p.slug}`, 0.7]),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ([path, priority]) =>
      `  <url><loc>${SITE}${path === "/" ? "/" : path}</loc><priority>${priority.toFixed(1)}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
