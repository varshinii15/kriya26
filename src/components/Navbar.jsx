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

// Section IDs and their header color preferences
// true = white header, false = black header
const SECTION_HEADER_COLORS = {
  'hero-frame': false, // black header
  'countdown-section': true, // white header
  'stats-section': false, // black header (Stats - dark video bg)
  'clip': true, // white header (PrizePool)
  'story': false, // black header (Flagship Events)
  'features-section': true, // white header (Event categories)
  'workshops-section': true, // white header
  'paper-presentation-section': false, // black header
  'sponsors-section': true, // white header (Sponsors)
  'section8': true, // white header (FAQ)
  'contact': true, // white header
};

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerIsWhite, setHeaderIsWhite] = useState(false); // Start with black header

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

  // Detect which section is under the navbar and update header color
  useEffect(() => {
    const detectCurrentSection = () => {
      const headerHeight = 80;
      const scrollY = window.scrollY;
      // Sample a point near the bottom of the navbar to avoid early switching
      const sampleY = scrollY + headerHeight - 6;

      const sections = Object.keys(SECTION_HEADER_COLORS);
      let currentSection = 'hero-frame';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const elementBottom = elementTop + rect.height;

        if (sampleY >= elementTop && sampleY <= elementBottom) {
          currentSection = sectionId;
          break;
        }
      }

      const shouldBeWhite = SECTION_HEADER_COLORS[currentSection] ?? false;
      setHeaderIsWhite(prev => (prev === shouldBeWhite ? prev : shouldBeWhite));
    };

    // Initial detection after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      detectCurrentSection();
    }, 100);
    
    // Throttle scroll events
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectCurrentSection, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectCurrentSection);
    };
  }, []);

  useEffect(() => {
    if (currentScrollY === 0) {
      // At top: show full navbar with logo
      setIsNavVisible(true);
      setShowLogo(true);
      if (navContainerRef.current) {
        navContainerRef.current.classList.remove("floating-nav");
      }
    } else {
      // When scrolling: keep navbar visible, hide logo, add floating style
      setIsNavVisible(true);
      setShowLogo(false);
      if (navContainerRef.current) {
        navContainerRef.current.classList.add("floating-nav");
      }
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
      className="fixed inset-x-0 top-0 z-50 h-[80px] border-none transition-all duration-700 sm:inset-x-0 w-full backdrop-blur-md"
      style={{
        backgroundColor: headerIsWhite ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        transition: 'background-color 0.7s ease',
      }}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2 px-4 sm:px-6 md:px-6 lg:px-10">
        <div className="grid grid-cols-3 items-center w-full gap-2 md:gap-4">

          {/* LEFT: Institutional Logos (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center justify-start gap-4">
            {/* Mobile Menu Button (Visible only on Mobile) */}
            <button
              onClick={toggleMobileMenu}
              className="flex md:hidden flex-col justify-center items-center w-8 h-8 space-y-1"
            >
              <span className={clsx(
                "block w-6 h-0.5 transition-transform",
                headerIsWhite ? "bg-black" : "bg-white",
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              )}></span>
              <span className={clsx(
                "block w-6 h-0.5 transition-opacity",
                headerIsWhite ? "bg-black" : "bg-white",
                isMobileMenuOpen ? 'opacity-0' : ''
              )}></span>
              <span className={clsx(
                "block w-6 h-0.5 transition-transform",
                headerIsWhite ? "bg-black" : "bg-white",
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              )}></span>
            </button>

            {/* Institutional Logos (Visible only on Desktop) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/Logo/PSG_LOGO_v2.png"
                alt="PSG Logo"
                width={60}
                height={60}
                className="h-10 lg:h-12 w-auto object-contain"
              />
              <Image
                src="/Logo/Year75w.png"
                alt="75 Years Logo"
                width={60}
                height={60}
                className="h-8 lg:h-10 w-auto object-contain"
              />
              <Image
                src={headerIsWhite ? "/Logo/100yearsLogo_white.png" : "/Logo/100yrlogo_v2.png"}
                alt="100 Years Logo"
                width={60}
                height={60}
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* CENTER: Kriya Logo (Main Brand) */}
          <div className="flex items-center justify-center min-w-0 px-2">
            <Image
              src={headerIsWhite ? "/Logo/kriya26black.png" : "/Logo/kriya26white.png"}
              alt="Kriya 2026 Logo"
              width={150}
              height={80}
              className={clsx(
                "h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform hover:scale-105 max-w-full",
                headerIsWhite ? "drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" : "drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              )}
              onError={(e) => {
                // Fallback to white logo if black version doesn't exist
                if (headerIsWhite) {
                  e.target.src = "/Logo/kriya26white.png";
                }
              }}
            />
          </div>

          {/* RIGHT: Navigation + Profile (Desktop) / Profile (Mobile) */}
          <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6">

            {/* Desktop Navigation Links - Hide on medium screens, show on large screens */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn font-general text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                  style={{
                    color: headerIsWhite ? '#000000' : '#ffffff',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = headerIsWhite ? '#2563eb' : '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = headerIsWhite ? '#000000' : '#ffffff';
                  }}
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
                      backgroundColor: headerIsWhite ? '#1f2937' : '#dfdff2',
                    }}
                  />
                ))}
              </button>

              {/* Profile/Home Icon */}
              {pathname === '/profile' ? (
                <Link href="/" className="relative group p-2">
                  <div className={clsx(
                    "absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300",
                    headerIsWhite ? "bg-black/10" : "bg-white/10"
                  )} />
                  <TiHome className={clsx(
                    "w-6 h-6 md:w-7 md:h-7 transition-colors relative z-10",
                    headerIsWhite ? "text-black group-hover:text-blue-600" : "text-white group-hover:text-blue-400"
                  )} />
                </Link>
              ) : (
                <Link href="/profile" className="relative group p-2">
                  <div className={clsx(
                    "absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300",
                    headerIsWhite ? "bg-black/10" : "bg-white/10"
                  )} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clsx(
                      "w-6 h-6 md:w-7 md:h-7 transition-colors relative z-10",
                      headerIsWhite ? "text-black group-hover:text-blue-600" : "text-white group-hover:text-blue-400"
                    )}
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
        <div className={clsx(
          "md:hidden absolute top-[80px] left-0 right-0 backdrop-blur-xl border-t z-40 overflow-hidden h-screen",
          headerIsWhite ? "bg-white/95 border-black/10" : "bg-black/95 border-white/10"
        )}>
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className={clsx(
                  "text-2xl font-zentry font-black uppercase transition-colors tracking-wide",
                  headerIsWhite ? "text-black hover:text-blue-600" : "text-white hover:text-blue-400"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className={clsx(
              "mt-6 pt-6 border-t flex justify-between items-center",
              headerIsWhite ? "border-black/10" : "border-white/10"
            )}>
              <span className={clsx(
                "text-sm font-general uppercase",
                headerIsWhite ? "text-black/60" : "text-white/60"
              )}>Settings</span>
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
                      backgroundColor: headerIsWhite ? '#1f2937' : '#dfdff2',
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