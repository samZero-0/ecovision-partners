import AboutUsSection from "@/src/components/About";
import MissionBanner from "@/src/components/Banner";
import Chatbot from "@/src/components/Chatbot";
import ContactPage from "@/src/components/Contact";
import PricingPackages from "@/src/components/Pricing";
import WhatWeOffer from "@/src/components/WhatWeOffer";


export default function Home() {
  return (
    <div>
      <MissionBanner></MissionBanner>
      <AboutUsSection></AboutUsSection>
      <WhatWeOffer></WhatWeOffer>
      <PricingPackages></PricingPackages>
      <ContactPage></ContactPage>
      <Chatbot></Chatbot>
    </div>
  );
}
