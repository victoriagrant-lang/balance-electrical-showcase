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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Electrician Taupō | Solar, EV Chargers & New Builds | Balance Electrical" },
      {
        name: "description",
        content:
          "Victoria Grant is a registered electrician based in Taupō. New builds, renovations, solar installation, air-conditioning, EV chargers and commercial electrical work across the Taupō district.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Balance Electrical — Electrician Taupō" },
      {
        property: "og:description",
        content:
          "Thoughtfully planned. Expertly installed. Electrical work, lighting design, air-conditioning and solar for homes and businesses across Taupō.",
      },
      { property: "og:image", content: photos.twilight },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz" }],
  }),
  component: Home,
});

/*
  The home page is one evening at a Balance home:
  stone by day → the scroll story brings the night → lit rooms → morning again.
*/
function Home() {
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
      <SignCTA />
    </SiteLayout>
  );
}
