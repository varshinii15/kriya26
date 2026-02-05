"use client"
import gsap from "gsap";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { eventService } from "../services/eventservice";

// Event IDs to fetch
const FLAGSHIP_EVENT_IDS = ["EVNT34", "EVNT20", "EVNT09", "EVNT25", "EVNT32", "EVNT40"];

// Random colors for cards
const CARD_COLORS = [
  "#8750f7", // Purple
  "#f75050", // Red
  "#50c8f7", // Blue
  "#50f7a6", // Green
  "#f7a850", // Orange
  "#f750b4", // Pink
];

// Helper to format date
const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const year = date.getFullYear().toString();
  return { day, month, year };
};

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
const SKEW_AMOUNT = 3;
const AUTO_SWAP_DELAY = 1000;

// Calculate slot position for each card in the stack
// Cards stack to the right and slightly down (behind)
const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: i * distY, // Positive y = cards go down/behind, not up
  z: -i * distX * 1.5,
  zIndex: total - i
});

// Immediately place card at slot position
const placeNow = (el, slot, skew, totalCards) =>
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
    pointerEvents: slot.zIndex === totalCards ? 'auto' : 'none'
  });

const FloatingImage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const cardStackRef = useRef(null);

  // Order tracking - which card is in which position
  const orderRef = useRef([]);
  const tlRef = useRef(null);
  const intervalRef = useRef(null);

  // Touch handling for mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch and process flagship event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventPromises = FLAGSHIP_EVENT_IDS.map(id => eventService.getEventById(id));
        const responses = await Promise.all(eventPromises);
        console.log("Flagship Event Details:", responses);

        // Extract and format event data
        const processedEvents = responses.map((res, index) => {
          const event = res.event;
          const { day, month, year } = formatEventDate(event.date);
          return {
            id: event.eventId,
            image: "/img/entrance.webp",
            alt: event.eventName,
            title: event.eventName,
            location: event.hall,
            time: event.timing || "TBD",
            day,
            month,
            year,
            color: CARD_COLORS[index % CARD_COLORS.length]
          };
        });

        setEvents(processedEvents);
        // Initialize order tracking
        orderRef.current = Array.from({ length: processedEvents.length }, (_, i) => i);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails();
  }, []);

  // Initialize card positions when events are loaded
  useEffect(() => {
    if (events.length === 0) return;
    const total = events.length;
    cardsRef.current.forEach((card, i) => {
      if (card) {
        placeNow(card, makeSlot(i, CARD_DISTANCE, VERTICAL_DISTANCE, total), SKEW_AMOUNT, total);
      }
    });
  }, [events]);

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
      const slot = makeSlot(i, CARD_DISTANCE, VERTICAL_DISTANCE, events.length);
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
    const backSlot = makeSlot(events.length - 1, CARD_DISTANCE, VERTICAL_DISTANCE, events.length);
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
  }, [isAnimating, events.length]);

  // Auto-swap interval - works on both mobile and desktop
  useEffect(() => {
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
  }, [swap]);

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
    const frontSlot = makeSlot(0, CARD_DISTANCE, VERTICAL_DISTANCE, events.length);

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
      const slot = makeSlot(i + 1, CARD_DISTANCE, VERTICAL_DISTANCE, events.length);
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
  }, [isAnimating, events.length]);

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
      className="min-h-dvh w-full bg-white text-black overflow-hidden"
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
            className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center group pt-20"
            style={{ perspective: "900px" }}
          >
            {/* Card Stack */}
            <div
              ref={cardStackRef}
              className="relative w-[85vw] md:w-[60vw] lg:w-[50vw] h-full"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {isLoading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
                  <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-black rounded-full"></div>
                </div>
              )}
              {events.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-pointer border border-white/10"
                  style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    willChange: "transform",
                    opacity: 1,
                    transform: `translate(-50%, -50%) translateX(${index * CARD_DISTANCE}px) translateY(${index * VERTICAL_DISTANCE}px) skewY(${SKEW_AMOUNT}deg)`,
                    zIndex: events.length - index
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
              {events.map((_, index) => (
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