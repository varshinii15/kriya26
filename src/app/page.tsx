import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizePool from "@/components/About";
import Events from "@/components/Features";
import Flagship from "@/components/Story";
import PaperPresentation from "@/components/PaperPresentation";
import Workshops from "@/components/Workshop";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import CountDown from "@/components/Countdown";
import Faq from "@/components/Faq";
import Team from "@/components/Team";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <Navbar />
      <Hero />
      <CountDown />
      <PrizePool />
      <Flagship />
      <Events />
      <Workshops />
      <PaperPresentation />
      <Team />
      <Footer />
      <Faq />
      <Contact />

    </main>
  );
}
