import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizePool from "@/components/About";
import Events from "@/components/Features";
import Flagship from "@/components/Story";
import PaperPresentation from "@/components/PaperPresentation";
import Workshops from "@/components/Workshop";
import Sponsors from "@/components/Sponsors";
import Contact from "@/components/Contact";
import CountDown from "@/components/Countdown";
import Faq from "@/components/Faq";
import Team from "@/components/Team";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <Navbar />
      <Hero />
      <CountDown />
      <StatsSection />
      <PrizePool />
      <Flagship />
      <Events />
      <Workshops />
      <PaperPresentation />
      <Sponsors />
      <Team />
      <Faq />
      <Contact />

    </main>
  );
}
