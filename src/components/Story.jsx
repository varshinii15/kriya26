"use client"
import gsap from "gsap";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// Slides data
const STORY_SLIDES = [
  {
    id: 1,
    image: "/img/entrance.webp",
    alt: "Event 1",
    title: "SPEEDDRIFTERS 2.0",
    location: "N BLOCK GROUND",
    time: "9:30 AM - 4:30 PM",
    day: "14",
    month: "MARCH",
    year: "2025",
    color: "#8750f7" // Purple
  },
  {
    id: 2,
    image: "/img/entrance.webp",
    alt: "Event 2",
    title: "ROBOTIC VISION",
    location: "AUDITORIUM",
    time: "10:00 AM - 5:00 PM",
    day: "15",
    month: "MARCH",
    year: "2025",
    color: "#f75050" // Red
  },
  {
    id: 3,
    image: "/img/entrance.webp",
    alt: "Event 3",
    title: "AI CHALLENGE",
    location: "E BLOCK LAB",
    time: "9:00 AM - 3:00 PM",
    day: "16",
    month: "MARCH",
    year: "2025",
    color: "#50c8f7" // Blue
  },
];

// Animation configuration (elastic easing from CardSwap)
const ANIMATION_CONFIG = {
  ease: 'elastic.out(0.6,0.9)',
  durDrop: 2,
  durMove: 2,
  durReturn: 2,
  promoteOverlap: 0.9,
  returnDelay: 0.05
};

// Card distance settings
const CARD_DISTANCE = 60;
const VERTICAL_DISTANCE = 30; // Reduced to prevent header overlap
const SKEW_AMOUNT = 6;
const AUTO_SWAP_DELAY = 5000;

// Calculate slot position for each card in the stack
// Cards stack to the right and slightly down (behind)
const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: i * distY, // Positive y = cards go down/behind, not up
  z: -i * distX * 1.5,
  zIndex: total - i
});

// Immediately place card at slot position
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
    opacity: 1,
    pointerEvents: slot.zIndex === STORY_SLIDES.length ? 'auto' : 'none'
  });

const FloatingImage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const cardStackRef = useRef(null);

  // Order tracking - which card is in which position
  const orderRef = useRef(Array.from({ length: STORY_SLIDES.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef(null);

  // Touch handling for mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Initialize card positions
  useEffect(() => {
    const total = STORY_SLIDES.length;
    cardsRef.current.forEach((card, i) => {
      if (card) {
        placeNow(card, makeSlot(i, CARD_DISTANCE, VERTICAL_DISTANCE, total), SKEW_AMOUNT);
      }
    });
  }, []);

  // Swap animation - front card drops and returns to back
  const swap = useCallback(() => {
    if (orderRef.current.length < 2 || isAnimating) return;
    setIsAnimating(true);

    const [front, ...rest] = orderRef.current;
    const elFront = cardsRef.current[front];
    if (!elFront) return;

    const tl = gsap.timeline({
      onComplete: () => {
        orderRef.current = [...rest, front];
        setIsAnimating(false);
      }
    });
    tlRef.current = tl;

    // Drop front card down
    tl.to(elFront, {
      y: '+=500',
      duration: ANIMATION_CONFIG.durDrop,
      ease: ANIMATION_CONFIG.ease
    });

    // Promote remaining cards forward
    tl.addLabel('promote', `-=${ANIMATION_CONFIG.durDrop * ANIMATION_CONFIG.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = cardsRef.current[idx];
      if (!el) return;
      const slot = makeSlot(i, CARD_DISTANCE, VERTICAL_DISTANCE, STORY_SLIDES.length);
      tl.set(el, { zIndex: slot.zIndex, pointerEvents: i === 0 ? 'auto' : 'none' }, 'promote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: ANIMATION_CONFIG.durMove,
          ease: ANIMATION_CONFIG.ease
        },
        `promote+=${i * 0.15}`
      );
    });

    // Return front card to back position
    const backSlot = makeSlot(STORY_SLIDES.length - 1, CARD_DISTANCE, VERTICAL_DISTANCE, STORY_SLIDES.length);
    tl.addLabel('return', `promote+=${ANIMATION_CONFIG.durMove * ANIMATION_CONFIG.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex, pointerEvents: 'none' });
      },
      undefined,
      'return'
    );
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: ANIMATION_CONFIG.durReturn,
        ease: ANIMATION_CONFIG.ease
      },
      'return'
    );
  }, [isAnimating]);

  // Auto-swap interval - works on both mobile and desktop
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start auto-swap interval
    intervalRef.current = setInterval(() => {
      swap();
    }, AUTO_SWAP_DELAY);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [swap, isPaused]);

  // Pause/Resume on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (tlRef.current) {
      tlRef.current.pause();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (tlRef.current) {
      tlRef.current.play();
    }
  };

  // Navigate to next slide (manual)
  const nextSlide = useCallback(() => {
    swap();
  }, [swap]);

  // Navigate to previous slide (manual) - reverse animation
  const prevSlide = useCallback(() => {
    if (orderRef.current.length < 2 || isAnimating) return;
    setIsAnimating(true);

    const order = orderRef.current;
    const back = order[order.length - 1];
    const elBack = cardsRef.current[back];
    if (!elBack) return;

    const tl = gsap.timeline({
      onComplete: () => {
        orderRef.current = [back, ...order.slice(0, -1)];
        setIsAnimating(false);
      }
    });
    tlRef.current = tl;

    // Bring back card up from bottom
    const frontSlot = makeSlot(0, CARD_DISTANCE, VERTICAL_DISTANCE, STORY_SLIDES.length);

    // First move back card below visible area
    tl.set(elBack, { y: '+=500', zIndex: frontSlot.zIndex + 1, pointerEvents: 'auto' });

    // Animate it up to front position
    tl.to(elBack, {
      x: frontSlot.x,
      y: frontSlot.y,
      z: frontSlot.z,
      duration: ANIMATION_CONFIG.durDrop,
      ease: ANIMATION_CONFIG.ease
    });

    // Push other cards back
    tl.addLabel('demote', `-=${ANIMATION_CONFIG.durDrop * ANIMATION_CONFIG.promoteOverlap}`);
    order.slice(0, -1).forEach((idx, i) => {
      const el = cardsRef.current[idx];
      if (!el) return;
      const slot = makeSlot(i + 1, CARD_DISTANCE, VERTICAL_DISTANCE, STORY_SLIDES.length);
      tl.set(el, { zIndex: slot.zIndex, pointerEvents: 'none' }, 'demote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: ANIMATION_CONFIG.durMove,
          ease: ANIMATION_CONFIG.ease
        },
        `demote+=${i * 0.15}`
      );
    });
  }, [isAnimating]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Get current front card for indicators
  const currentIndex = orderRef.current[0] || 0;

  return (
    <div
      id="story"
      className="min-h-dvh w-full bg-white text-black overflow-x-hidden overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, transform: "rotateX(-30deg) scale(0.9)" }}
            whileInView={{ opacity: 1, transform: "rotateX(0deg) scale(1)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-zentry animated-word-static text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mb-8 font-black text-black flex items-center gap-2"
          >
            FLAGSHIP EVENTS <span className="text-blue-500 text-base md:text-lg lg:text-xl font-normal tracking-normal">( KRIYA 2026 )</span>
          </motion.p>
        </div>

        <div className="relative size-full">
          {/* Card Stack Container */}
          <div
            ref={containerRef}
            className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center group pt-12"
            style={{ perspective: "900px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Card Stack */}
            <div
              ref={cardStackRef}
              className="relative w-[85vw] md:w-[60vw] lg:w-[50vw] h-full"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {STORY_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-pointer border border-white/10"
                  style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    willChange: "transform"
                  }}
                  onClick={() => window.location.href = '#'}
                >
                  {/* Top Image Section */}
                  <div className="h-[55%] w-full relative">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Bottom Info Section - Dynamic Color Background */}
                  <div
                    className="h-[45%] w-full p-4 md:p-6 lg:p-8 flex items-start justify-between text-black relative"
                    style={{ backgroundColor: slide.color }}
                  >
                    <div className="flex flex-col h-full justify-between z-10">
                      <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase leading-tight mb-2 tracking-wide font-zentry">{slide.title}</h2>
                        <p className="font-semibold text-xs md:text-sm uppercase tracking-wider opacity-80">{slide.location} | {slide.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end z-10">
                      <span className="text-xs md:text-sm font-bold uppercase mb-0 tracking-wider">({slide.month})</span>
                      <span className="text-xs md:text-sm font-bold uppercase mb-1">{slide.year}</span>
                      <span className="text-4xl md:text-5xl lg:text-6xl font-black leading-none">{slide.day}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Desktop only */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 backdrop-blur-md hidden md:flex items-center justify-center text-white border border-black hover:bg-black hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 backdrop-blur-md hidden md:flex items-center justify-center text-white border border-black hover:bg-black hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex md:hidden justify-center items-center gap-6 mt-6">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-3">
              {STORY_SLIDES.map((_, index) => (
                <button
                  key={index}
                  disabled={isAnimating}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'bg-black w-8' : 'bg-black/30 w-2 hover:bg-black/50'}`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;