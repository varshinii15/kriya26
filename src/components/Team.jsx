"use client";

import React, { useState, useCallback } from "react";
import AnimatedTitle from "./AnimatedTitle";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";



const SmallTeamCard = ({ img, name, role }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
        >
            {/* Image First */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 mb-2">
                <img
                    src={img}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Name and Role Below - Fixed Height Container */}
            <div className="text-center w-full min-h-[44px] flex flex-col items-center justify-start">
                {role && (
                    <span className="inline-block mb-1 px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 rounded-full border border-blue-200">
                        {role}
                    </span>
                )}
                <p className="font-circular-web text-xs md:text-sm text-neutral-800 font-medium line-clamp-2 px-1">
                    {name}
                </p>
            </div>
        </motion.div>
    );
};

// Department carousel with vertical grid
const DepartmentCarousel = ({ departments }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % departments.length);
    }, [departments.length]);

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + departments.length) % departments.length);
    };

    const currentDept = departments[currentIndex];

    return (
        <div
            className="relative"
        >
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div>
                    <h2 className="font-zentry text-4xl md:text-5xl lg:text-6xl uppercase text-black font-black leading-[0.9] animated-word-static">
                        {currentDept.title}
                    </h2>

                </div>

                {/* Navigation Buttons - Top Right */}
                <div className="flex gap-3">
                    <button
                        onClick={goToPrev}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-100 border border-neutral-200 text-black hover:bg-neutral-200 hover:scale-110 transition-all"
                    >
                        <HiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-100 border border-neutral-200 text-black hover:bg-neutral-200 hover:scale-110 transition-all"
                    >
                        <HiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Department Indicator Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {departments.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`rounded-full transition-all ${currentIndex === index
                            ? 'w-8 h-2 bg-blue-500'
                            : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                            }`}
                    />
                ))}
            </div>

            {/* Vertical Grid of Members */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-3 gap-y-6 px-4"
                >
                    {currentDept.members.map((member, index) => (
                        <SmallTeamCard key={index} {...member} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const Team = () => {
    // First 5 core team members (keep as-is)
    const coreMembers = [
        { img: "/img/gallery-1.webp", name: "Arjun Reddy", role: "Lead Organizer" },
        { img: "/img/gallery-2.webp", name: "Priya Sharma", role: "Tech Head" },
        { img: "/img/gallery-3.webp", name: "Vikram Singh", role: "Design Lead" },
        { img: "/img/gallery-4.webp", name: "Ananya Patel", role: "Event Coordinator" },
        { img: "/img/gallery-5.webp", name: "Rohan Kumar", role: "Marketing Head" },
    ];

    // Generate placeholder members for each department
    const generateMembers = (count, baseName) => {
        return Array.from({ length: count }, (_, i) => ({
            img: `/img/gallery-${(i % 5) + 1}.webp`,
            name: `${baseName} ${i + 1}`,
            role: i < 3 ? (i === 0 ? "Team Lead" : "Co-Lead") : undefined // First 3 members have roles
        }));
    };

    const departments = [
        { title: "Tech Team", members: generateMembers(30, "Tech Member") },
        { title: "PR Team", members: generateMembers(25, "PR Member") },
        { title: "ERM Team", members: generateMembers(35, "ERM Member") },
        { title: "Design Team", members: generateMembers(28, "Design Member") },
        { title: "Content Team", members: generateMembers(32, "Content Member") },
        { title: "Operations Team", members: generateMembers(40, "Operations Member") },
        { title: "Finance Team", members: generateMembers(20, "Finance Member") },
    ];

    return (
        <section className="relative min-h-screen w-full bg-white py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 flex w-full flex-col items-center justify-center text-center">
                    <p className="font-general text-sm uppercase text-neutral-500">
                        The Minds Behind
                    </p>
                    <motion.h2
                        initial={{ opacity: 0, transform: "rotateX(-30deg) scale(0.9)" }}
                        whileInView={{ opacity: 1, transform: "rotateX(0deg) scale(1)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-5 font-zentry text-center animated-word-static text-5xl font-black uppercase leading-[0.9] text-black md:text-7xl"
                    >
                        m<b>e</b>et our <br /> amazing <b>t</b>eam
                    </motion.h2>
                </div>

                {/* Core Team - Unified Grid Layout */}
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-10 max-w-5xl mx-auto mb-20 px-2 md:px-6">
                    {coreMembers.map((member, index) => (
                        <SmallTeamCard key={index} {...member} />
                    ))}
                </div>

                {/* Divider */}
                <div className="my-20 border-t border-neutral-200" />

                {/* Department Section Title */}
                <div className="mb-12 text-center">
                    <h2 className="font-zentry text-4xl md:text-5xl uppercase text-black font-black leading-[0.9] animated-word-static">
                        Our <span className="text-blue-500">Departments</span>
                    </h2>

                </div>

                {/* Department Carousel */}
                <DepartmentCarousel departments={departments} />
            </div>
        </section>
    );
};

export default Team;
