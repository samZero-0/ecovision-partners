// import AboutUsSection from "@/src/components/About";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import MissionBanner from "@/src/components/Banner";
import Chatbot from "@/src/components/Chatbot";
import ContactPage from "@/src/components/Contact";
import { DirectionAwareHoverDemo } from "@/src/components/DirectionalHover";
import { GridSmallBackgroundDemo } from "@/src/components/LineBg";
import PricingPackages from "@/src/components/Pricing";
import WhatWeOffer from "@/src/components/WhatWeOffer";


export default function Home() {
  return (
    <div>
      <MissionBanner></MissionBanner>
      <GridSmallBackgroundDemo></GridSmallBackgroundDemo>
      {/* <DirectionAwareHoverDemo></DirectionAwareHoverDemo> */}
      {/* <AboutUsSection></AboutUsSection> */}
      <WhatWeOffer></WhatWeOffer>
      <PricingPackages></PricingPackages>
      <ContactPage></ContactPage>
      <Chatbot></Chatbot>
    </div>
  );
}
