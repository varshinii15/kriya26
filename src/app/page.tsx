"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountDown from "@/components/Countdown";
import Preloader from "@/components/ui/Preloader";

const StatsSection = React.memo(
  dynamic(() => import("@/components/StatsSection")),
);
const PrizePool = React.memo(dynamic(() => import("@/components/About")));
const Flagship = React.memo(dynamic(() => import("@/components/Story")));
const Events = React.memo(dynamic(() => import("@/components/Features")));
const Workshops = React.memo(dynamic(() => import("@/components/Workshop")));
const PaperPresentation = React.memo(
  dynamic(() => import("@/components/PaperPresentation")),
);
const Sponsors = React.memo(dynamic(() => import("@/components/Sponsors")));
const Team = React.memo(dynamic(() => import("@/components/Team")));
const Faq = React.memo(dynamic(() => import("@/components/Faq")));
const Location = React.memo(dynamic(() => import("@/components/Location")));
const Contact = React.memo(dynamic(() => import("@/components/Contact")));

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
      <Hero preloaderComplete={!isLoading} />
      <StatsSection />
      <CountDown />
      <PrizePool preloaderComplete={!isLoading} />
      <Flagship />
      <Events />
      <Workshops />
      <PaperPresentation />
      <Sponsors />
      <Team />
      <Faq />
      <Location />
      <Contact />
    </main>
  );
}
