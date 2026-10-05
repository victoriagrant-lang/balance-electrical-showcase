import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { photos } from "@/lib/photos";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Circuits } from "@/components/home/Circuits";
import { DuskToNight } from "@/components/home/DuskToNight";
import { DimmerRoom } from "@/components/home/DimmerRoom";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Victoria } from "@/components/home/Victoria";
import { AreasMarquee } from "@/components/home/AreasMarquee";
import { SignCTA } from "@/components/home/SignCTA";
import { HomeFaq } from "@/components/home/HomeFaq";
import { Testimonials } from "@/components/Reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { HOME_FAQS, SITE, faqPage, jsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => getGoogleReviews(),
  head: () => ({
    meta: [
      { title: "Electrician Taupō | Homes & Businesses | Balance Electrical" },
      {
        name: "description",
        content:
          "Registered electrician in Taupō: new builds, renovations, lighting design, heat pumps, solar, EV chargers, commercial work and repairs. Balance Electrical.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      {
        name: "google-site-verification",
        content: "ixUeePXyPulAeejRHMt5vlzHzWyExwaVkCc_8dNe3XQ",
      },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Balance Electrical — Electrician Taupō" },
      {
        property: "og:description",
        content:
          "Thoughtfully planned. Expertly installed. Electrical work, lighting design, integrated heating and cooling and solar for homes and businesses across Taupō.",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: photos.twilight },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [jsonLd([faqPage(HOME_FAQS)])],
  }),
  component: Home,
});

/*
  The home page is one evening at a Balance home:
  stone by day → the scroll story brings the night → lit rooms → morning again.
*/
function Home() {
  const google = Route.useLoaderData();
  return (
    <SiteLayout>
      <Hero />
      <Manifesto />
      <Circuits />
      <DuskToNight />
      <DimmerRoom />
      <SelectedWork />
      <div className="led-h" />
      <Victoria />
      <AreasMarquee />
      <Testimonials google={google} className="pt-24 md:pt-32" />
      <HomeFaq />
      <SignCTA />
    </SiteLayout>
  );
}
