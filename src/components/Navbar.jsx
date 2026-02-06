"use client"
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow, TiHome } from "react-icons/ti";
import { usePathname } from "next/navigation";

import Button from "./Button";

const navItems = ["Accommodation", "Campus Map", "Contact"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname();

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    }
  }, []);

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // At top: show full navbar with logo
      setIsNavVisible(true);
      setShowLogo(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else {
      // When scrolling: keep navbar visible, hide logo, add floating style
      setIsNavVisible(true);
      setShowLogo(false);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-0 z-50 h-[80px] border-none transition-all duration-700 sm:inset-x-0 w-full bg-black/80 backdrop-blur-md"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2 px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-3 items-center w-full">

          {/* LEFT: Institutional Logos (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center justify-start gap-4">
            {/* Mobile Menu Button (Visible only on Mobile) */}
            <button
              onClick={toggleMobileMenu}
              className="flex md:hidden flex-col justify-center items-center w-8 h-8 space-y-1"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>

            {/* Institutional Logos (Visible only on Desktop) */}
            <div className="hidden md:flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/Logo/PSG_LOGO_v2.png"
                alt="PSG Logo"
                width={60}
                height={60}
                className="h-12 w-auto object-contain"
              />
              <Image
                src="/Logo/Year75w.png"
                alt="75 Years Logo"
                width={60}
                height={60}
                className="h-10 w-auto object-contain"
              />
              <Image
                src="/Logo/100yrlogo_v2.png"
                alt="100 Years Logo"
                width={60}
                height={60}
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* CENTER: Kriya Logo (Main Brand) */}
          <div className="flex items-center justify-center">
            <Image
              src="/Logo/kriya26white.png"
              alt="Kriya 2026 Logo"
              width={150}
              height={80}
              className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
            />
          </div>

          {/* RIGHT: Navigation + Profile (Desktop) / Profile (Mobile) */}
          <div className="flex items-center justify-end gap-6">

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn font-general text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Audio Toggle */}
              <button
                onClick={toggleAudioIndicator}
                className="hidden md:flex items-center space-x-0.5"
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>

              {/* Profile/Home Icon */}
              {pathname === '/profile' ? (
                <Link href="/" className="relative group p-2">
                  <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <TiHome className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-blue-400 transition-colors relative z-10" />
                </Link>
              ) : (
                <Link href="/profile" className="relative group p-2">
                  <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-blue-400 transition-colors relative z-10"
                  >
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40 overflow-hidden h-screen">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="text-2xl font-zentry font-black uppercase text-white hover:text-blue-400 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-white/60 text-sm font-general uppercase">Settings</span>
              <button
                onClick={toggleAudioIndicator}
                className="flex items-center space-x-0.5"
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavBar;