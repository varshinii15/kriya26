"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useState } from "react";

import AnimatedTitle from "./AnimatedTitle";
import VantaBackground from "./ui/VantaBackground";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted after a brief delay to ensure DOM is stable
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Wait for component to be mounted
    if (!isMounted) return;

    // Wait for elements to exist in DOM
    const clipSection = document.querySelector("#clip");
    const prizeCard = document.querySelector(".prize-pool-card");

    if (!clipSection || !prizeCard) {
      console.warn("Prize pool elements not found, retrying...");
      return;
    }

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Set initial states explicitly
      gsap.set(".prize-pool-card", {
        width: "70vw",
        height: "70vh",
        borderRadius: "20px",
      });
      gsap.set(".prize-pool-text", { scale: 1 });

      const clipAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: "#clip",
          start: "center center",
          end: "+=800 center",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          markers: false, // Set to true for debugging
        },
      });

      clipAnimation.to(".prize-pool-card", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      });

      // Animate the prize pool text to grow as the image expands
      clipAnimation.to(
        ".prize-pool-text",
        {
          scale: 2.0, // Grow the text size
        },
        0 // Start at the same time as image expansion
      );
    });

    // Mobile version
    mm.add("(max-width: 767px)", () => {
      // Set initial states explicitly
      gsap.set(".prize-pool-card", {
        width: "70vw",
        height: "70vh",
        borderRadius: "20px",
      });
      gsap.set(".prize-pool-text", { scale: 1 });

      const clipAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: "#clip",
          start: "center center",
          end: "+=800 center",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          markers: false,
        },
      });

      clipAnimation.to(".prize-pool-card", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      });
      clipAnimation.to(
        ".prize-pool-text",
        {
          scale: 2, // Grow the text size
        },
        0 // Start at the same time as image expansion
      );
    });

    // Force a refresh after layout is settled and animations are created
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      mm.revert();
    };
  }, [isMounted]);

  return (
    <>
      <section id='clip' className="prize-section min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        <div
          className="prize-pool-card relative bg-gray-900 flex justify-center items-center overflow-hidden"
        >
          <VantaBackground>
            <div className="prize-pool-text bg-black/50 xl:bg-transparent w-full absolute inset-0 flex flex-col justify-center items-center text-center">
              <AnimatedTitle
                title="<b>P</b>rize <b>P</b>ool <br /> 6,00,000"
                containerClass="special-font !text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              />
            </div>
          </VantaBackground>
        </div>
      </section>
    </>
  );
};

export default About;