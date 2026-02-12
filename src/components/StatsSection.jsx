"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import LazyVideo from "./ui/LazyVideo";

const stats = [
  { number: "30 +", label: "Events" },
  { number: "10 +", label: "Workshops" },
  { number: "5 +", label: "Paper Presentations" },
];

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref} className="special-font">
      <b>
        <motion.span>{rounded}</motion.span>
        {suffix}
      </b>
    </span>
  );
};

const StatsSection = () => {
  return (
    <section
      id="stats-section"
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <LazyVideo
        src="https://res.cloudinary.com/dkashskr5/video/upload/f_auto,q_auto/v1770701397/stats-bg-3_z2fmay.mp4"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-24">
          {stats.map((stat, index) => {
            // Parse the number and suffix (e.g., "30+" -> number: 30, suffix: "+")
            const match = stat.number.match(/^(\d+)(.*)$/);
            const numericValue = match ? parseInt(match[1], 10) : 0;
            const suffix = match ? match[2] : "";

            return (
              <div key={index} className="text-center">
                <h2 className="special-font text-[5rem] sm:text-[7rem] md:text-[8rem] lg:text-[10rem] font-black leading-none text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <AnimatedCounter value={numericValue} suffix={suffix} />
                </h2>
                <p className="font-zentry text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest text-white/80 mt-2">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
