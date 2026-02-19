"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow, TiUser } from "react-icons/ti";
import { FaEnvelope, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import Button from "./Button";
import { isPreRegistrationEnabled } from "@/settings/featureFlags";

const Hero = ({ preloaderComplete = true }) => {
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

        // Initialize Vanta effect only if component is still mounted
        if (isMounted && window.VANTA?.RINGS && vantaRef.current) {
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
    // Only initialize GSAP animations after preloader completes
    if (!preloaderComplete) return;

    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
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

      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [preloaderComplete]);

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
      <div className="absolute bg-black/50 inset-0 z-20 flex lg:hidden flex-col justify-center items-center px-4 py-8 pointer-events-none">
        <div className="rounded-3xl p-6 text-center w-full max-w-md mx-auto relative flex flex-col items-center">

          {/* Top Text */}
          <div className="flex flex-col items-center justify-center gap-1 mb-4">
            <h3 className="special-font text-blue-500 text-lg font-zentry tracking-wider">
              <b>STUDENTS UNION</b>
            </h3>
            <h3 className="special-font text-white text-lg font-zentry tracking-wider">
              <b>PRESENTS</b>
            </h3>
          </div>

          <Image
            src="/Logo/kriya26white.png"
            alt="Kriya 2026 Logo"
            width={300}
            height={300}
            className="h-20 w-auto mx-auto mb-2"
          />

          {/* Global Clash Title - Smaller */}
          <div className="mb-4">
            <h1 className="special-font text-center text-2xl font-zentry font-thin uppercase text-white mb-1 tracking-wide">
              <span className="">the gl<b>o</b>bal</span>
            </h1>
            <h1 className="special-font text-center text-xl font-zentry font-thin uppercase text-white mb-1 tracking-wide">
              <span className="">Cl<b>a</b>sh <b>of</b></span>
            </h1>
            <h2 className="special-font text-center text-xl font-zentry font-thin uppercase text-white bg-clip-text">
              <span className="bg-black/50 text-blue-500 p-1 rounded-md">te<b>c</b>h<b>n</b>o t<b>a</b>lents</span>
            </h2>
          </div>

          {/* Date - Bigger */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-zentry bg-black/50 px-2 py-1 rounded-xl">
              <h2 className="special-font font-zentry font-thin uppercase text-white bg-clip-text">
                <span className="">Ma<b>r</b>c<b>h</b></span>
              </h2>
              <span className="text-blue-500">13</span>
              <span className="text-white">,</span>
              <span className="text-blue-500">14</span>
              <span className="text-white">,</span>
              <span className="text-blue-500">15</span>
              <span>  </span>
              <span className="text-white">2026</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
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

          <div className="pointer-events-auto flex flex-col sm:flex-row gap-4 justify-center items-stretch w-[80%] mx-auto">
            <Button
              title={isAuthenticated ? "MY PROFILE" : (isPreRegistrationEnabled ? "PRE-REGISTER NOW" : "REGISTER NOW")}
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
      <div className="absolute inset-0 z-20 p-10 bg-black/50 hidden lg:flex flex-col justify-center items-center gap-8 pointer-events-none">

        {/* Top Text */}
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <h3 className="special-font text-blue-500 text-3xl font-zentry tracking-wider">
            <b>STUDENTS UNION</b>
          </h3>
          <h3 className="special-font text-white text-3xl font-zentry tracking-wider">
            <b>PRESENTS</b>
          </h3>
        </div>

        <div className="flex flex-row justify-center items-center gap-32">

          {/* LEFT COLUMN: Logo + Title (Small) + Socials */}
          <div className="flex flex-col items-center text-center gap-6">
            <Image
              src="/Logo/kriya26white.png"
              alt="Kriya 2026 Logo"
              width={500}
              height={400}
              className="h-30 md:h-60 w-auto mx-auto"
            />



            {/* Socials */}
            <div className="flex justify-center gap-4">
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

          {/* RIGHT COLUMN: Date (Big) + Buttons */}
          <div className="flex flex-col items-center justify-center gap-6">

            {/* Title - Moved Here & Smaller */}
            <div className="flex flex-col items-center mb-2">
              <h1 className="special-font text-center text-4xl lg:text-5xl font-zentry font-thin uppercase text-white tracking-wide">
                the gl<b>o</b>bal cl<b>a</b>sh <b>o</b>f <span className="bg-black/50 p-1 rounded-xl text-blue-500">te<b>c</b>h<b>n</b>o t<b>a</b>lents</span>
              </h1>
            </div>

            {/* Date - Bigger */}
            <div className="flex items-center justify-center gap-2 text-7xl xl:text-8xl text-white font-zentry bg-black/50 px-4 py-2 rounded-xl">
              <h2 className="special-font font-zentry font-thin uppercase text-white bg-clip-text">
                <span className="p-2"><b>Ma<b><b>r</b></b>ch</b></span>
              </h2>
              <span className="text-blue-500">13</span>
              <span className="text-white">,</span>
              <span className="text-blue-500">14</span>
              <span className="text-white">,</span>
              <span className="text-blue-500">15</span>
              <span>   </span>
              <span>2026</span>
            </div>

            <div className="flex flex-col gap-4">

              {/* Buttons */}
              <div className="flex-center gap-6">
                <Button
                  title={isAuthenticated ? "MY PROFILE" : (isPreRegistrationEnabled ? "PRE-REGISTER NOW" : "REGISTER NOW")}
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
    </div>
  );
};

export default Hero;