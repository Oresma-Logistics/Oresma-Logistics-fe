import { HeroSection } from "@/components/pages/landingpage/hero-section";
import AboutUs from "@/components/pages/landingpage/aboutUs";
import Services from "@/components/pages/landingpage/services";
import Process from "@/components/pages/landingpage/process";
import { Team } from "@/components/pages/landingpage/teams";
import CaseStudy from "@/components/pages/landingpage/case-study";
export default function LandingPage() {
  return (
    // <main className="bg-linear-to-b from-[#D9E0EB] to-[#C8D1DF]">
    <main className="bg-primaryT text-white">
      <HeroSection />
      <div className="lg:p-24 md:p-12 p-7 space-y-20">
        <AboutUs />
        <Services />
        <Team />
        <Process />
        <CaseStudy />
      </div>
    </main>
  );
}
