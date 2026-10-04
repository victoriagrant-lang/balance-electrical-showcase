import { Link } from "@tanstack/react-router";
import { PORTFOLIO } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

/** Portfolio covers that open each project's story page. */
export function ProjectCards({ slugs, className }: { slugs: string[]; className?: string }) {
  const projects = slugs
    .map((slug) => PORTFOLIO.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);
  return (
    <div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6", className)}>
      {projects.map((p) => {
        const cover = p.photos[0];
        return (
          <Link
            key={p.slug}
            to="/portfolio/$slug"
            params={{ slug: p.slug }}
            data-cursor="Open"
            className="group block"
          >
            <span className="relative block aspect-[4/5] overflow-hidden border-[6px] border-frame bg-frame">
              <img
                src={cover.sm}
                alt={`${cover.title}, ${p.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
            </span>
            <span className="display-caps mt-4 block text-lg tracking-[0.14em]">{p.title}</span>
            <span className="eyebrow mt-2 block text-[10px] leading-relaxed opacity-70">
              {p.location} · {p.tags.join(" · ")}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
