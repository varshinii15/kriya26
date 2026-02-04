"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TiLocationArrow } from "react-icons/ti";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const WORKSHOPS = [
  { id: 1, title: "Immersive Tech", desc: "Dive into AR/VR experiences and spatial computing.", img: "/img/gallery-1.webp" },
  { id: 2, title: "Web3 Gaming", desc: "The future of decentralized play and mechanics.", img: "/img/gallery-2.webp" },
  { id: 3, title: "AI Agents", desc: "Building autonomous systems and neural networks.", img: "/img/gallery-3.webp" },
  { id: 4, title: "Digital Art", desc: "Creative coding, generative art, and NFTs.", img: "/img/gallery-4.webp" },
  { id: 5, title: "Cyber Security", desc: "Protecting the digital frontier from threats.", img: "/img/gallery-5.webp" },
  { id: 6, title: "Game Design", desc: "Crafting compelling narratives and mechanics.", img: "/img/swordman.webp" },
  { id: 7, title: "Blockchain", desc: "Smart contracts, dApps, and consensus.", img: "/img/stones.webp" },
  { id: 8, title: "Cloud Scale", desc: "Architecting systems for millions of users.", img: "/img/entrance.webp" },
  { id: 9, title: "UI/UX Design", desc: "Designing for humans with empathy and data.", img: "/img/about.webp" },
  { id: 10, title: "Data Science", desc: "Extracting actionable insights from big data.", img: "/img/contact-1.webp" },
  { id: 11, title: "Robotics", desc: "Automating the physical world with machines.", img: "/img/contact-2.webp" },
  { id: 12, title: "IoT Systems", desc: "Connecting the physical and digital worlds.", img: "/img/gallery-1.webp" },
];

// Number of cards visible at once (grouped)
const CARDS_PER_VIEW = 3;

// Calculate number of groups (pages)
const TOTAL_GROUPS = Math.ceil(WORKSHOPS.length / CARDS_PER_VIEW);

// Group workshops into sets of 3
const getWorkshopGroups = () => {
  const groups = [];
  for (let i = 0; i < WORKSHOPS.length; i += CARDS_PER_VIEW) {
    groups.push(WORKSHOPS.slice(i, i + CARDS_PER_VIEW));
  }
  return groups;
};

const WORKSHOP_GROUPS = getWorkshopGroups();

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

const glowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
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

// Card stagger animation variants - Fast cascade effect
const cardStaggerVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.85,
    rotateX: -10,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: i * 0.08,
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -30,
    scale: 0.9,
    transition: {
      duration: 0.2,
      delay: (2 - i) * 0.03,
    },
  }),
};

const WorkshopCard = ({ item, isHovered, onHover, onLeave, index }) => {
  return (
    <motion.div
      custom={index}
      variants={cardStaggerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative h-[320px] w-[260px] sm:h-[380px] sm:w-[280px] md:h-[420px] md:w-[320px] lg:w-[340px] flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-neutral-900"
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 25 },
      }}
      style={{
        boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Background Image with Zoom */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
        {/* Title - Always Visible */}
        <motion.h3
          variants={titleVariants}
          initial="collapsed"
          animate={isHovered ? "expanded" : "collapsed"}
          className="bento-title special-font text-xl sm:text-2xl md:text-3xl font-bold uppercase leading-tight tracking-wide text-blue-100 origin-left"
        >
          {item.title.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{
                color: isHovered ? "#ffffff" : "#dfdff0",
                textShadow: isHovered ? "0 0 20px rgba(255, 255, 255, 0.3)" : "none",
              }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h3>

        {/* Register Button - Always Visible */}
        <motion.div
          className="mt-3"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 rounded-full bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors"
          >
            <TiLocationArrow className="text-sm sm:text-base" />
            <span>Register</span>
          </motion.button>
        </motion.div>

        {/* Expanded Details - Animated Entry */}
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-4 overflow-hidden"
            >
              {/* Divider Line */}
              <motion.div
                variants={itemVariants}
                className="h-[1px] w-16 bg-gradient-to-r from-white/60 to-transparent mb-3"
              />

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="font-circular-web text-sm sm:text-base text-blue-50/90 mb-2 leading-relaxed"
              >
                {item.desc}
              </motion.p>

              {/* Additional Info */}
              <motion.p
                variants={itemVariants}
                className="font-circular-web text-xs sm:text-sm text-blue-50/60 mb-4"
              >
                Join top industry experts for this hands-on session.
              </motion.p>

              {/* Details Button on Hover */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-colors"
              >
                Details
              </motion.button>
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
  for (let i = 0; i < WORKSHOPS.length; i += cardsPerView) {
    workshopGroups.push(WORKSHOPS.slice(i, i + cardsPerView));
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
    setDirection(1);
    setCurrentGroupIndex((prev) => (prev + 1) % totalGroups);
  }, [totalGroups]);

  // Navigate to previous group
  const goToPrev = useCallback(() => {
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
    if (isPaused || hoveredCardIndex !== null) return;

    const interval = setInterval(() => {
      goToNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, hoveredCardIndex, goToNext]);


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
      className="relative w-full overflow-hidden bg-black py-24 md:py-32 z-10"
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
      <div className="container mx-auto mb-12 md:mb-16 px-6 text-center relative z-10">
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
          className="mt-2 text-center text-5xl font-zentry font-black uppercase leading-[0.9] text-blue-50 md:text-7xl"
        >
          WOrk<b>s</b>hops
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-center font-circular-web text-lg md:text-xl text-blue-50/60 max-w-2xl mx-auto"
        >
          Interactive sessions led by industry experts. Navigate through our workshops.
        </motion.p>
      </div>

      {/* Navigation Buttons - Top Right */}
      <div className="container mx-auto px-4 md:px-6 mb-6">
        <div className="flex justify-end gap-3">
          <NavButton direction="left" onClick={goToPrev} />
          <NavButton direction="right" onClick={goToNext} />
        </div>
      </div>

      {/* Main Carousel Container */}
      <div
        className="relative container mx-auto px-4 md:px-6"
        style={{ perspective: "1500px", perspectiveOrigin: "center center" }}
      >

        {/* Cards Container - Fixed height to prevent layout jump */}
        <div
          className="relative w-full overflow-visible py-4 sm:py-6 md:py-8"
          style={{ minHeight: "480px" }}
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
              className="flex justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 absolute inset-0 items-center px-2 sm:px-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              {currentGroup.map((item, index) => (
                <WorkshopCard
                  key={item.id}
                  item={item}
                  index={index}
                  isHovered={hoveredCardIndex === `${currentGroupIndex}-${index}`}
                  onHover={() => setHoveredCardIndex(`${currentGroupIndex}-${index}`)}
                  onLeave={() => setHoveredCardIndex(null)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <ProgressIndicator
            currentIndex={currentGroupIndex}
            total={totalGroups}
            onDotClick={goToGroup}
          />
        </div>
      </div>
    </section>
  );
};

export default Workshop;
