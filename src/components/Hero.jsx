"use client";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const totalVideos = 4;
  const nextVdRef = useRef(null);

  const handleMiniVdClick = () => {
    setHasClicked(true);

    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero.mp4`;

  return (
    <div className="relative h-dvh w-full overflow-x-hidden">
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-full overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        </div>
        <div className="absolute left-0 top-0 z-10 size-full bg-black/30" />
        <div className="absolute top-25 left-10 z-50">
          <Image
            src="/Logo/kriya26white.png"
            alt="Kriya 2026 Logo"
            width={160}
            height={80}
            className="h-20 w-auto opacity-90"
          />

        </div>

        <h1 className="special-font font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-10xl 2xl:text-[10rem] font-zentry font-thin uppercase absolute bottom-5 right-5 z-40 text-[#dfdff2]">
          Kri<b>y</b>a
        </h1>

        <div className="absolute-center z-20 w-full text-center font-general">
          <h1 className="special-font text-[2.5rem] sm:text-4xl md:text-5xl lg:text-8xl xl:text-[7rem] 2xl:text-[10rem] font-zentry font-thin uppercase text-[#dfdff2] mb-4">
            the gl<b>o</b>bal cl<b>a</b>sh <b>o</b>f
          </h1>
          <h2 className="special-font text-[2.5rem] sm:text-4xl md:text-5xl lg:text-8xl xl:text-[7rem] 2xl:text-[10rem] font-zentry font-thin uppercase bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            te<b>c</b>h<b>n</b>o t<b>a</b>lents
          </h2>
          <p className="mb-8 font-robert-regular text-xl tracking-wide text-white/70 md:text-xl">
            MARCH 13-15, 2026 | PSG TECH, COIMBATORE
          </p>
          <div className="flex-center mt-4 gap-4">
            <Button
              title="REGISTER NOW"
              containerClass="bg-yellow-300 flex-center gap-1"
              leftIcon={<TiLocationArrow />}
            />
            <Button
              title="EXPLORE EVENTS"
              containerClass="border flex flex-row gap-2 border-white/30 bg-transparent"
              leftIcon={<TiLocationArrow />}
            />
          </div>
        </div>

      </div>

      <h1 className="special-font font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-thin uppercase absolute bottom-5 right-5 text-black">
        Kri<b>y</b>a
      </h1>
    </div>
  );
};

export default Hero;