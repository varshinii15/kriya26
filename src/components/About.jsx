"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";
import VantaBackground from "./ui/VantaBackground";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
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
        scale: 1.5, // Grow the text size
      },
      0 // Start at the same time as image expansion
    );
  });

  return (
    <>
      <section id='clip' className="prize-section min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        <div
          className="prize-pool-card relative bg-gray-900 flex justify-center items-center"
          style={{
            width: "70vw",
            height: "70vh",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <VantaBackground>
            <div className="prize-pool-text w-full absolute inset-0 flex flex-col justify-center items-center text-center">
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