import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorLight } from "@/components/motion/CursorLight";
import { Preloader } from "@/components/motion/Preloader";
import { LogoMark } from "@/components/brand/Logo";
import { photos } from "@/lib/photos";
import { siteGraph } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="theme-night relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-6">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[80vh] w-[70vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, rgb(255 231 194 / 0.16), rgb(242 200 139 / 0.05) 50%, transparent 80%)",
        }}
      />
      <div className="relative max-w-md text-center">
        <LogoMark className="mx-auto h-14 w-14 text-stone-pale/80" />
        <p className="eyebrow mt-10 text-muted-foreground">Error 404 · Circuit open</p>
        <h1 className="display-caps mt-4 text-4xl text-ivory md:text-5xl">Lights out</h1>
        <p className="mt-5 text-muted-foreground">
          This room isn't wired yet. The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="eyebrow mt-10 inline-flex h-12 items-center rounded-full bg-stone-pale px-8 text-frame transition-shadow duration-500 hover:shadow-[0_0_46px_-6px_rgb(242_200_139/0.75)]"
        >
          Switch back on
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const OG_IMAGE = photos.twilight;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Electrician Taupō | Solar, EV Chargers & New Builds | Balance Electrical" },
      {
        name: "description",
        content:
          "Victoria Grant is a registered electrician in Taupō. Lighting design, new builds, renovations, heat pumps and ducted heating integrated into joinery, solar, EV chargers, smart homes and commercial electrical across the Taupō district.",
      },
      { name: "author", content: "Balance Electrical" },
      { property: "og:site_name", content: "Balance Electrical" },
      { property: "og:locale", content: "en_NZ" },
      { name: "theme-color", content: "#a69486" },
      { property: "og:title", content: "Balance Electrical — Electrician Taupō" },
      {
        property: "og:description",
        content:
          "Considered residential and commercial electrical work across Taupō and the Taupō district — lighting design, new builds, climate systems, solar and smart homes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(siteGraph()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NZ">
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <Preloader />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <CursorLight />
      </SmoothScroll>
    </QueryClientProvider>
  );
}
