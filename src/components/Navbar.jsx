"use client"
import Image from "next/image";
import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

const navItems = ["Accomdation", "Campus Map", "About", "Contact"];

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
      className="fixed inset-x-0 top-0 z-50 h-16 border-none transition-all duration-700 sm:inset-x-0 w-full bg-black/80 backdrop-blur-md"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2 flex justify-between px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-2 md:gap-4">
          {showLogo && (
            <>
              <Image
                src="/Logo/PSG_LOGO.png"
                alt="PSG Logo"
                width={100}
                height={130}
                className="h-16 sm:h-16 md:h-20 lg:h-28 w-auto transition-opacity duration-300"
              />
              <Image
                src="/Logo/Year75w.png"
                alt="75 Years Logo"
                width={60}
                height={60}
                className="h-12 sm:h-10 md:h-12 lg:h-15 w-auto transition-opacity duration-300"
              />
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex h-full items-center">
            <div>
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
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

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleAudioIndicator}
            className="mr-4 flex items-center space-x-0.5"
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

          <button
            onClick={toggleMobileMenu}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-40">
          <nav className="flex flex-col py-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="px-6 py-3 text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavBar;