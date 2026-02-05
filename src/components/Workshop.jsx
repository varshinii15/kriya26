"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { TiLocationArrow, TiCalendar } from "react-icons/ti";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const STATIC_IMAGES = [
  "/img/workshops/ws1.png",
  //"/img/gallery-1.webp",
  "/img/workshops/ws2.png",
  "/img/workshops/ws3.png",
  "/img/workshops/ws4.png",
  "/img/workshops/ws5.png",
  "/img/workshops/ws6.png",
  "/img/stones.webp",
  "/img/workshops/ws8.png",
  "/img/workshops/ws9.png",
  "/img/workshops/ws10.png",
  "/img/workshops/ws11.png",
  "/img/workshops/ws12.png",
  "/img/contact-2.webp",
];

// Premium stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(5px)",
    transition: { duration: 0.2 },
  },
};

const titleVariants = {
  collapsed: {
    y: 0,
    scale: 1,
  },
  expanded: {
    y: -10,
    scale: 1.05,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
    },
  },
};

// Slide animation variants - Spectacular 3D flip transitions
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "80%" : "-80%",
    opacity: 0,
    scale: 0.75,
    rotateY: direction > 0 ? 35 : -35,
    rotateZ: direction > 0 ? 5 : -5,
    filter: "blur(12px)",
    transformOrigin: direction > 0 ? "left center" : "right center",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    filter: "blur(0px)",
    transformOrigin: "center center",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.8,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? "-80%" : "80%",
    opacity: 0,
    scale: 0.75,
    rotateY: direction > 0 ? -35 : 35,
    rotateZ: direction > 0 ? -5 : 5,
    filter: "blur(12px)",
    transformOrigin: direction > 0 ? "right center" : "left center",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.8,
    },
  }),
};

// Card stagger animation variants - Aligned with parent slideVariants
const cardStaggerVariants = {
  enter: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  center: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: i * 0.1,
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -30,
    transition: { duration: 0.2 },
  }),
};

const WorkshopCard = ({ item, isHovered, isSiblingHovered, onHover, onLeave, index, isMobile }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      custom={index}
      variants={cardStaggerVariants}
      onMouseEnter={!isMobile ? onHover : undefined}
      onMouseLeave={!isMobile ? onLeave : undefined}
      className={`relative h-[380px] md:h-[420px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 group`}
      style={{
        width: isMobile ? "100%" : (isHovered ? "800px" : (isSiblingHovered ? "280px" : "360px")),
        zIndex: isHovered ? 50 : 1,
      }}
      as={motion.div}
      animate={{
        width: isMobile ? "100%" : (isHovered ? 800 : (isSiblingHovered ? 280 : 360)),
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        width: { type: "spring", stiffness: 400, damping: 30 }, // Slightly softer spring for width
        opacity: { duration: 0.18 },
        scale: { duration: 0.18 },
      }}
    >
      {/* Background Image - Absolute fill */}
      <div className="absolute inset-0">
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Gradient Overlay - Lighter as requested */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {/* Removed hover darkening as requested */}
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-row items-end p-6 md:p-8 overflow-hidden gap-6">

        {/* LEFT COLUMN: Title, Date, Button */}
        {/* Grows to fill space, but respects Right Column when present */}
        <div className="flex flex-col justify-end flex-1 min-w-0 h-full relative z-10" style={{ maxWidth: isHovered ? '480px' : '100%' }}>
          <div className="mt-auto w-full">

            {/* Title - Always shows full text, wraps naturally */}
            <h3 className="text-2xl md:text-3xl font-bold uppercase leading-tight text-white mb-3 drop-shadow-md">
              {item.title}
            </h3>

            {/* Date - Always white */}
            <div className="flex items-center gap-2 text-white/90 text-sm mb-3 font-medium drop-shadow-sm">
              <TiCalendar className="text-lg text-white" />
              <span>{formatDate(item.date)}</span>
            </div>

            {/* Venue - Visible on Mobile or when not hovered */}
            <div className="flex items-center gap-2 text-white text-xs mb-5 font-medium drop-shadow-sm uppercase tracking-wide">
              <span className="text-white">Venue:</span>
              <span>{item.hall}</span>
            </div>

            {/* ACTION BUTTON - Premium "Learn More" */}
            <button
              className="group/btn relative flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              <span className="relative z-10">Learn More</span>
              <TiLocationArrow className="relative z-10 text-xl group-hover/btn:-rotate-45 transition-transform duration-200" />

              {/* Sheen Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Details (Visible ONLY on Hover) */}
        {/* Logic: Details appear on the right, no glass/border effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 30, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                opacity: { duration: 0.2 },
                filter: { duration: 0.2 }
              }}
              className="w-[320px] flex-shrink-0 flex flex-col justify-end h-full relative z-10 pl-6 text-shadow"
            >
              <div className="space-y-5 mb-2 p-2">

                {/* Club Name */}
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03, duration: 0.15 }}
                >
                  <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">Organized By</span>
                  <span className="text-white text-sm font-bold uppercase tracking-wider text-shadow-sm">{item.club || "PSGC"}</span>
                </motion.div>

                {/* Time */}
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.15 }}
                >
                  <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">Time</span>
                  <span className="text-white text-sm font-circular-web flex items-center gap-2 text-shadow-sm">
                    <TiLocationArrow className="rotate-45 text-blue-400" /> {item.time}
                  </span>
                </motion.div>

                {/* Venue */}
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.09, duration: 0.15 }}
                >
                  <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">Venue</span>
                  <span className="text-white text-sm font-circular-web leading-tight text-shadow-sm">
                    {item.hall}
                  </span>
                </motion.div>

                {/* Description */}
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.15 }}
                >
                  <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">About</span>
                  <p className="text-white/90 text-xs leading-relaxed font-circular-web line-clamp-4 text-shadow-sm">
                    {item.desc}
                  </p>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

// Navigation Button Component
const NavButton = ({ direction, onClick, disabled }) => {
  const isLeft = direction === "left";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden group"
      whileHover={{
        scale: 1.1,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderColor: "rgba(255,255,255,0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Icon */}
      {isLeft ? (
        <HiChevronLeft className="text-xl sm:text-2xl relative z-10" />
      ) : (
        <HiChevronRight className="text-xl sm:text-2xl relative z-10" />
      )}

      {/* Ripple effect */}
      <motion.span
        className="absolute inset-0 bg-white/10 rounded-full"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
};

// Progress Indicator Component - Simple single color dots
const ProgressIndicator = ({ currentIndex, total, onDotClick }) => {
  return (
    <div className="flex items-center gap-3 mt-8">
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick(index)}
          className="rounded-full bg-white/30 cursor-pointer"
          animate={{
            width: currentIndex === index ? 32 : 10,
            height: 10,
            backgroundColor: currentIndex === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
          }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.6)", scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
};

const Workshop = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get("https://kriyabackend.psgtech.ac.in/api/events/workshops");
        if (response.data.success) {
          const mappedWorkshops = response.data.workshops.map((ws, index) => ({
            id: ws.workshopId,
            title: ws.workshopName,
            desc: ws.description,
            club: ws.clubName,
            hall: ws.hall,
            date: ws.date,
            time: ws.time,
            img: STATIC_IMAGES[index % STATIC_IMAGES.length], // Cycle through static images
          }));
          setWorkshops(mappedWorkshops);
        }
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Calculate groups dynamically based on cardsPerView
  const workshopGroups = [];
  if (!loading && workshops.length > 0) {
    for (let i = 0; i < workshops.length; i += cardsPerView) {
      workshopGroups.push(workshops.slice(i, i + cardsPerView));
    }
  }
  const totalGroups = workshopGroups.length;

  // Reset current index if it's out of bounds when cardsPerView changes
  useEffect(() => {
    if (currentGroupIndex >= totalGroups) {
      setCurrentGroupIndex(0);
    }
  }, [cardsPerView, totalGroups, currentGroupIndex]);

  // Auto-play interval (3 seconds)
  const AUTO_PLAY_INTERVAL = 3000;

  // Navigate to next group
  const goToNext = useCallback(() => {
    if (totalGroups === 0) return;
    setDirection(1);
    setCurrentGroupIndex((prev) => (prev + 1) % totalGroups);
  }, [totalGroups]);

  // Navigate to previous group
  const goToPrev = useCallback(() => {
    if (totalGroups === 0) return;
    setDirection(-1);
    setCurrentGroupIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  }, [totalGroups]);

  // Go to specific group
  const goToGroup = useCallback((index) => {
    setDirection(index > currentGroupIndex ? 1 : -1);
    setCurrentGroupIndex(index);
  }, [currentGroupIndex]);

  // Auto-play effect
  useEffect(() => {
    if (isPaused || hoveredCardIndex !== null || totalGroups === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, hoveredCardIndex, goToNext, totalGroups]);


  // Touch handlers for swipe support
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  const currentGroup = workshopGroups[currentGroupIndex] || [];

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-visible bg-black py-2 md:py-24 z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <div className="container mx-auto mb-4 md:mb-12 px-12 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-circular-web text-lg text-blue-50"
        >
          Hands-on Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, transform: "rotateX(-30deg) scale(0.9)" }}
          animate={isInView ? { opacity: 1, transform: "rotateX(0deg) scale(1)" } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-2 font-zentry text-center animated-word-static text-5xl font-black uppercase leading-[0.9] text-blue-50 md:text-7xl"
        >
          WOrk<b>s</b>hops
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-center mx-auto font-zentry text-lg md:text-3xl text-blue-50/60 max-w-2xl hidden md:block"
        >
          Interactive sessions led by industry experts. Navigate through our workshops.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {/* Navigation Buttons - Top Right (Desktop Only) */}
          <div className="container mx-auto px-4 md:px-6 mb-2 hidden md:block">
            <div className="flex justify-end gap-3">
              <NavButton direction="left" onClick={goToPrev} disabled={totalGroups <= 1} />
              <NavButton direction="right" onClick={goToNext} disabled={totalGroups <= 1} />
            </div>
          </div>

          {/* Main Carousel Container */}
          <div
            className="relative container mx-auto px-4 md:px-6 overflow-visible"
            style={{ perspective: "1500px", perspectiveOrigin: "center center" }}
          >

            {/* Cards Container - Fixed height to prevent layout jump */}
            <div
              className="relative w-full py-4 sm:py-6 md:py-8"
              style={{ minHeight: "480px", overflow: "visible" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={currentGroupIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  layout // Add layout prop for smooth sibling rearrangement
                  className="flex justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 absolute inset-0 items-center px-8 sm:px-12 md:px-16"
                  style={{ transformStyle: "preserve-3d", overflow: "visible" }}
                >
                  {currentGroup.map((item, index) => {
                    const isHovered = hoveredCardIndex === `${currentGroupIndex}-${index}`;
                    const isAnyHovered = hoveredCardIndex !== null && hoveredCardIndex.startsWith(`${currentGroupIndex}-`);
                    const isSiblingHovered = isAnyHovered && !isHovered;

                    return (
                      <WorkshopCard
                        key={item.id}
                        item={item}
                        index={index}
                        isHovered={isHovered}
                        isSiblingHovered={isSiblingHovered}
                        isMobile={cardsPerView === 1}
                        onHover={() => setHoveredCardIndex(`${currentGroupIndex}-${index}`)}
                        onLeave={() => setHoveredCardIndex(null)}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            {totalGroups > 1 && (
              <div className="flex justify-center">
                <ProgressIndicator
                  currentIndex={currentGroupIndex}
                  total={totalGroups}
                  onDotClick={goToGroup}
                />
              </div>
            )}

            {/* Navigation Buttons - Bottom (Mobile Only) - REMOVED as per request */}
          </div>
        </>
      )}
    </section>
  );
};

export default Workshop;
