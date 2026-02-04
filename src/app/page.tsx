import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Workshop from "@/components/Workshop";
import Story from "@/components/Story";
import Footer from "@/components/Footer";
import CountDown from "@/components/Countdown";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <Navbar />
      <Hero />
      <CountDown />
      <About />
      <Features />
      <Workshop />
      <Story />
      <Footer />
    </main>
  );
}
