import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountDown from "@/components/Countdown";

// Dynamically import components that are below the fold
const StatsSection = dynamic(() => import("@/components/StatsSection"));
const PrizePool = dynamic(() => import("@/components/About"));
const Flagship = dynamic(() => import("@/components/Story"));
const Events = dynamic(() => import("@/components/Features"));
const Workshops = dynamic(() => import("@/components/Workshop"));
const PaperPresentation = dynamic(() => import("@/components/PaperPresentation"));
const Sponsors = dynamic(() => import("@/components/Sponsors"));
const Team = dynamic(() => import("@/components/Team"));
const Faq = dynamic(() => import("@/components/Faq"));
const Contact = dynamic(() => import("@/components/Contact"));

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
