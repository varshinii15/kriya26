import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PrizePool from "@/components/About";
import Events from "@/components/Features";
import Flagship from "@/components/Story";
import Workshop from "@/components/Workshop";
import PaperPresentation from "@/components/PaperPresentation";
import Footer from "@/components/Footer";
import CountDown from "@/components/Countdown";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <Navbar />
      <Hero />
      <CountDown />
      <PrizePool />
      <Flagship />
      <Workshop />
      <Events />
      <Workshop />
      <PaperPresentation />
      <Footer />
    </main>
  );
}
