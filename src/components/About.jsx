"use client"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

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

    clipAnimation.to(".mask-clip-path", {
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
    <div className="min-h-screen w-full overflow-hidden">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <div className="about-subtext">
          <p>The Game of Games begins—your life, now an epic MMORPG</p>
          <p className="text-gray-500">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      <div className="h-dvh w-full" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/hey.jpeg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
          {/* Prize pool text overlay */}
          <div className="prize-pool-text absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-100 scale-75">
            <AnimatedTitle
              title="Price pool <br /> 6,00,000"
              containerClass="!text-white text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;