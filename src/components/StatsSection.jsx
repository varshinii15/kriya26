"use client";
import React from "react";
import LazyVideo from "./ui/LazyVideo";

const stats = [
  { number: "30+", label: "Events" },
  { number: "10+", label: "Workshops" },
  { number: "5+", label: "Paper Presentations" },
];

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
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h2 className="font-zentry text-[5rem] sm:text-[7rem] md:text-[8rem] lg:text-[10rem] font-black leading-none text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                {stat.number}
              </h2>
              <p className="font-zentry text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest text-white/80 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
