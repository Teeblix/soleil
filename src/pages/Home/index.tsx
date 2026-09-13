import { Hero } from "./Hero";
import { ShopByCategory } from "./ShopByCategory";
import { FreshForSummer } from "./FreshForSummer";
import { BrandStory } from "./BrandStory";
import { ExploreEverything } from "./ExploreEverything";
import { AsSeenOn } from "./AsSeenOn";
import { Testimonials } from "./Testimonials";
import { FinalCta } from "./FinalCta";
import { TrustBadges } from "../../components/TrustBadges";
import { Footer } from "../../components/Footer";

export function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <Hero />
      <ShopByCategory />
      <FreshForSummer />
      <BrandStory />
      <ExploreEverything />
      <AsSeenOn />
      <Testimonials />
      <TrustBadges />
      <FinalCta />
      <Footer />
    </div>
  );
}
