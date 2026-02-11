"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow, TiUser } from "react-icons/ti";
import { FaEnvelope, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import Button from "./Button";

const Hero = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = null;
    let isMounted = true;

    const loadVanta = async () => {
      if (typeof window !== 'undefined') {
        // Load THREE.js if not present
        if (!window.THREE) {
          const threeScript = document.createElement('script');
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
          document.head.appendChild(threeScript);

          await new Promise((resolve) => {
            threeScript.onload = resolve;
          });
        }

        // Load Vanta Rings if not present (check for RINGS specifically, not just VANTA)
        if (!window.VANTA?.RINGS) {
          const vantaScript = document.createElement('script');
          vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.rings.min.js';
          document.head.appendChild(vantaScript);

          await new Promise((resolve) => {
            vantaScript.onload = resolve;
          });
        }

        // Wait a frame to ensure DOM is ready and scripts are fully initialized
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // Initialize Vanta effect only if component is still mounted and not already initialized
        if (isMounted && window.VANTA?.RINGS && vantaRef.current && !vantaEffect) {
          vantaEffect = window.VANTA.RINGS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x50707,
            color: 0x939236,
            xyTurbulence: 0.75,
            rotationX: 0.5,
            rotationY: 0.5
          });
        }
      }
    };

    loadVanta();

    return () => {
      isMounted = false;
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  useGSAP(() => {
    gsap.set("#hero-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#hero-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div id="hero-frame" className="relative h-dvh w-full overflow-x-hidden rounded-lg">
      {/* Background 2026 Text */}
      {/* <h1 className="special-font absolute z-0 font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[7rem] font-thin uppercase bottom-15 right-15 text-black/30 hidden lg:block">
        20<b>2</b>6
      </h1> */}

      <div
        ref={vantaRef}
        className="absolute inset-0 z-10"
      />

      {/* Mobile Layout */}
      <div className="absolute bg-black/50 inset-0 z-20 flex lg:hidden justify-center items-center px-4 py-8 pointer-events-none">
        <div className="rounded-3xl p-6 mt-22 text-center w-full max-w-md mx-auto relative">
          {/* <h1 className="special-font font-zentry text-4xl font-thin uppercase absolute top-4 right-4 z-40 text-white">
            20<b>2</b>6
          </h1> */}

          <Image
            src="/Logo/kriya26white.png"
            alt="Kriya 2026 Logo"
            width={300}
            height={300}
            className="h-35 w-auto mx-auto mb-6"
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
          <div className="mb-10 mt-5">
            <h1 className="special-font text-center text-6xl font-zentry font-thin uppercase text-white mb-1 tracking-wide">
              <span className="">the gl<b>o</b>bal</span>
            </h1>
            <h1 className="special-font text-center text-5xl font-zentry font-thin uppercase text-white mb-1 tracking-wide">
              <span className="">Cl<b>a</b>sh <b>of</b></span>
            </h1>
            <h2 className="special-font text-center text-5xl font-zentry font-thin uppercase text-white bg-clip-text text-transparent">
              <span className="bg-black/50 text-blue-400 p-2 rounded-xl">te<b>c</b>h<b>n</b>o t<b>a</b>lents</span>
            </h2>
          </div>

          {/* Date */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-5xl text-white font-zentry bg-black/50 p-2 py-1 rounded-xl">
              <h2 className="special-font font-zentry font-thin uppercase text-white bg-clip-text text-transparent">
                <span className="bg-black/50 p-2 py-1 rounded-xl">Ma<b>r</b>c<b>h</b></span>
              </h2>
              <span className="text-blue-400 ">14</span>
              <span className="text-purple-400">,</span>
              <span className="text-blue-400">15</span>
              <span className="text-purple-400">,</span>
              <span className="text-blue-400">16</span>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col sm:flex-row gap-4 justify-center items-stretch w-[80%] mx-auto">
            <Button
              title={isAuthenticated ? "MY PROFILE" : "REGISTER NOW"}
              containerClass="bg-blue-400 hover:bg-purple-700 flex-center gap-2 px-4 py-3 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full"
              leftIcon={isAuthenticated ? <TiUser className="w-4 h-4" /> : <TiLocationArrow className="w-4 h-4" />}
              onClick={() => router.push(isAuthenticated ? '/profile' : '/auth')}
            />
            <Button
              title="EXPLORE EVENTS"
              containerClass="border-2 border-white/40 hover:bg-white/10 flex-center gap-2 px-4 py-3 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm pointer-events-auto w-full"
              leftIcon={<TiLocationArrow className="w-5 h-5 group-hover:animate-bounce" />}
              onClick={() => router.push("/portal/event")}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="absolute inset-0 z-20 p-20 bg-black/50 hidden lg:flex flex-row justify-center items-center gap-10 pointer-events-none">

        {/* <h1 className="special-font font-zentry text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-10xl 2xl:text-[7rem] font-zentry font-thin uppercase absolute bottom-5 right-5 z-40 text-[#dfdff2]">
          20<b>2</b>6
        </h1> */}

        <div className="rounded-3xl p-6 md:p-8 text-center">
          <Image
            src="/Logo/kriya26white.png"
            alt="Kriya 2026 Logo"
            width={500}
            height={400}
            className="h-30 md:h-75 w-auto mx-auto mb-4"
          />
          <div className="flex items-center justify-center gap-2 text-5xl text-white font-zentry">
            <h2 className="special-font font-zentry font-thin uppercase text-white bg-clip-text text-transparent">
              <span className="p-2"><b>Ma<b><b>r</b></b>ch</b></span>
            </h2>
            <span>14</span>
            <span className="text-blue-400">,</span>
            <span>15</span>
            <span className="text-blue-400">,</span>
            <span>16</span>
          </div>
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
          <div className="rounded-2xl p-8 md:p-10 text-center">
            {/* Title Section */}
            <h1 className="p-3 special-font text-center text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[7rem] font-zentry font-thin uppercase text-white mb-2 tracking-wide">
              the gl<b>o</b>bal cl<b>a</b>sh
            </h1>
            <h2
              className="special-font text-center text-[2.5rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[5rem] font-zentry font-thin uppercase text-white mb-6"
            >
              <span className="px-4 py-2"><b>o</b>f <span className="bg-black/50 p-2 rounded-xl text-blue-400"> te<b>c</b>h<b>n</b>o t<b>a</b>lents</span></span>
            </h2>
            <p className="text-base text-end mr-15 md:text-lg text-white font-zentry mb-8">
              <span className="bg-black/50 px-4 py-2 rounded-md">POWERED BY <span className="text-blue-400 font-bold ml-2">STUDENTS UNION</span></span>
            </p>
            <div className="flex-center mt-6 gap-6">
              <Button
                title={isAuthenticated ? "MY PROFILE" : "REGISTER NOW"}
                titleClass="font-bold"
                containerClass="bg-blue-400 font-bold flex-center gap-2 px-8 py-4 rounded-xl font-zentry text-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 pointer-events-auto"
                leftIcon={isAuthenticated ? <TiUser className="w-5 h-5" /> : <TiLocationArrow className="w-5 h-5 group-hover:animate-bounce" />}
                onClick={() => router.push(isAuthenticated ? '/profile' : '/auth')}
              />
              <Button
                title="EXPLORE EVENTS"
                containerClass="bg-white font-bold flex-center gap-2 px-8 py-4 rounded-xl font-zentry text-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 pointer-events-auto"
                leftIcon={<TiLocationArrow className="w-5 h-5 group-hover:animate-bounce" />}
                onClick={() => router.push("/portal/event")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;