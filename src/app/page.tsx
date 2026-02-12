"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountDown from "@/components/Countdown";
import Preloader from "@/components/ui/Preloader";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsFinished(true), 2000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <main className="relative min-h-screen w-full">
      {isLoading && (
        <Preloader
          finished={isFinished}
          onComplete={() => setIsLoading(false)}
        />
      )}
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
