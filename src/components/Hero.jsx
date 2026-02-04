"use client";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { FaEnvelope, FaLinkedin, FaInstagram } from "react-icons/fa";
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
        className="relative z-10 h-dvh w-full overflow-x-hidden rounded-lg bg-blue-75"
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
        
        {/* Mobile Layout */}
        <div className="absolute inset-0 z-20 flex lg:hidden justify-center items-center px-4 py-8 pointer-events-none">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-center border border-white/30 w-full max-w-md mx-auto relative">
            {/* Mobile 2026 Text */}
            <h1 className="special-font font-zentry text-4xl font-thin uppercase absolute top-4 right-4 z-40 text-white">
              20<b>2</b>6
            </h1>
            
            {/* Logo */}
            <Image
              src="/Logo/kriya26white.png"
              alt="Kriya 2026 Logo"
              width={300}
              height={240}
              className="h-32 w-auto mx-auto mb-6"
            />
            
            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-8">
              <a 
                href="mailto:helpdesk.kriya@psgtech.ac.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaEnvelope className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/company/studentsunion-psgtech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaLinkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.instagram.com/kriya_psgtech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaInstagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>

            {/* Global Clash Title */}
            <div className="mb-6">
              <h1 className="special-font text-center text-5xl font-zentry font-thin uppercase text-white mb-1 tracking-wide">
                the gl<b>o</b>bal cl<b>a</b>sh <b>o</b>f
              </h1>
              <h2 className="special-font text-center text-5xl font-zentry font-thin uppercase bg-gradient-to-r from-[#FA9212] via-[#F48B11] to-[#FFE014] bg-clip-text text-transparent">
                te<b>c</b>h<b>n</b>o t<b>a</b>lents
              </h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <h3 className="text-5xl font-zentry font-bold text-white">
                  30<span className="text-purple-400 text-5xl ml-2">+</span>
                </h3>
                <p className="text-white/80 text-2xl font-zentry uppercase tracking-wide">EVENTS</p>
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-zentry font-bold text-white">
                  10<span className="text-purple-400 text-5xl ml-2">+</span>
                </h3>
                <p className="text-white/80 text-2xl font-zentry uppercase tracking-wide">WORKSHOPS</p>
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-zentry font-bold text-white">
                  5<span className="text-purple-400 text-5xl ml-2">+</span>
                </h3>
                <p className="text-white/80 text-2xl font-zentry uppercase tracking-wide">PAPERS</p>
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-5xl text-white font-zentry">
                <h2 className="special-font font-zentry font-thin uppercase bg-gradient-to-r from-[#FA9212] via-[#F48B11] to-[#FFE014] bg-clip-text text-transparent">
                  Ma<b>r</b>c<b>h</b>
                </h2>
                <span>14</span>
                <span className="text-purple-400">,</span>
                <span>15</span>
                <span className="text-purple-400">,</span>
                <span>16</span>
              </div>
            </div>

            {/* Register Button */}
            <div className="pointer-events-auto">
              <Button
                title="REGISTER NOW"
                containerClass="bg-purple-600 hover:bg-purple-700 flex-center gap-2 px-6 py-3 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 border border-purple-500 w-full"
                leftIcon={<TiLocationArrow className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="absolute inset-0 z-20 m-20 hidden lg:flex flex-row justify-center items-center gap-15 pointer-events-none">

          <h1 className="special-font font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-10xl 2xl:text-[7rem] font-zentry font-thin uppercase absolute bottom-[-25px] right-[-25px] z-40 text-[#dfdff2]">
          20<b>2</b>6
        </h1>
  
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 text-center border border-white/30">
            <Image
              src="/Logo/kriya26white.png"
              alt="Kriya 2026 Logo"
              width={500}
              height={400}
              className="h-30 md:h-60 w-auto mx-auto mb-4"
            />
            <p className="text-white text-base md:text-xl font-zentry font-semibold mb-1">POWERED BY <span className="text-blue-400 text-base md:text-xl font-zentry font-bold mb-4">STUDENTS UNION</span></p>
            <div className="flex justify-center gap-4 mt-6">
              <a 
                href="mailto:helpdesk.kriya@psgtech.ac.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 active:animate-bounce border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaEnvelope className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/company/studentsunion-psgtech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 active:animate-bounce border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaLinkedin className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.instagram.com/kriya_psgtech/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 active:animate-bounce border border-white/40 hover:border-white/60 pointer-events-auto"
              >
                <FaInstagram className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 md:p-13 border border-white/30">
                <div className="grid grid-cols-3 gap-6 md:gap-15">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-7xl font-zentry font-bold text-white">
                      30<span className="text-purple-400 ml-2">+</span>
                    </h3>
                    <p className="text-white/80 text-xs md:text-xl font-zentry uppercase tracking-wide">EVENTS</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl md:text-7xl font-zentry font-bold text-white">
                      10<span className="text-purple-400 ml-2">+</span>
                    </h3>
                    <p className="text-white/80 text-xs md:text-xl font-zentry uppercase tracking-wide">WORKSHOPS</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl md:text-7xl font-zentry font-bold text-white">
                      5<span className="text-purple-400 ml-2">+</span>
                    </h3>
                    <p className="text-white/80 text-xs md:text-xl font-zentry uppercase tracking-wide">PAPER PRESENTATIONS</p>
                  </div>
                </div>
              </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 md:p-10 text-center border border-white/30">
              {/* Date Section */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-3 special-font font-zentry font-thin">
                  <h2 className="special-font text-italic text-center text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-zentry font-thin uppercase bg-gradient-to-r from-[#FA9212] via-[#F48B11] to-[#FFE014] bg-clip-text text-transparent mb-6">
                    Ma<b>r</b>c<b>h</b>
                  </h2>
                  <div className="flex items-center gap-2 text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white">
                    <span>14</span>
                    <span className="text-purple-400">,</span>
                    <span>15</span>
                    <span className="text-purple-400">,</span>
                    <span>16</span>
                  </div>
                </div>
              </div>
              
              {/* Title Section */}
              <h1 className="special-font text-center text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-zentry font-thin uppercase text-white mb-2 tracking-wide">
                the gl<b>o</b>bal cl<b>a</b>sh <b>o</b>f
              </h1>
              <h2 className="special-font text-center text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-zentry font-thin uppercase bg-gradient-to-r from-[#FA9212] via-[#F48B11] to-[#FFE014] bg-clip-text text-transparent mb-6">
                te<b>c</b>h<b>n</b>o t<b>a</b>lents
              </h2>
              <p className="text-base md:text-lg text-white/80 font-zentry mb-8">
                POWERED BY <span className="text-purple-400 font-bold ml-2">STUDENTS UNION</span>
              </p>
              <div className="flex-center mt-6 gap-6">
                <Button
                  title="REGISTER NOW"
                  containerClass="bg-purple-600 hover:bg-purple-700 flex-center gap-2 px-8 py-4 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-purple-500 pointer-events-auto"
                  leftIcon={<TiLocationArrow className="w-5 h-5 group-hover:animate-bounce" />}
                />
                <Button
                  title="EXPLORE EVENTS"
                  containerClass="border-2 border-white/40 hover:bg-white/10 flex-center gap-2 px-8 py-4 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm pointer-events-auto"
                  leftIcon={<TiLocationArrow className="w-5 h-5 group-hover:animate-bounce" />}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      <h1 className="special-font font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[7rem] font-thin uppercase absolute bottom-15 right-15 text-black hidden lg:block">
        20<b>2</b>6
      </h1>
    </div>
  );
};

export default Hero;