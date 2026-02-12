"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Preloader = ({ onComplete, finished = false }) => {
    const containerRef = useRef(null);
    const waveRef = useRef(null);
    const contentRef = useRef(null);
    const timelineRef = useRef(null);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        // Horizontal wave movement - always active
        gsap.to(waveRef.current, {
            x: "-50%",
            duration: 3,
            repeat: -1,
            ease: "none",
        });

        // Main animation timeline
        const tl = gsap.timeline();
        timelineRef.current = tl;

        // 1. Text Reveal
        tl.fromTo(contentRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        // 2. Initial Fill (Rise to ~80%)
        tl.to(waveRef.current, {
            y: "-80%",
            duration: 3,
            ease: "power1.inOut",
            onUpdate: function () {
                // Approximate percentage based on y position (-80% is 80% progress)
                const currentY = parseFloat(gsap.getProperty(waveRef.current, "y"));
                const p = Math.min(95, Math.abs(currentY));
                setPercent(Math.round(p));
            }
        });

        // 3. Continuous Vertical Oscillation (Floating state)
        tl.to(waveRef.current, {
            y: "-65%",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        return () => {
            gsap.killTweensOf("*");
            if (timelineRef.current) timelineRef.current.kill();
        };
    }, []);

    // Handle exit when finished prop becomes true
    useEffect(() => {
        if (finished && waveRef.current) {
            // Kill existing vertical timelines to take over for exit
            if (timelineRef.current) timelineRef.current.kill();

            setPercent(100);
            const exitTl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            // Complete the fill to 100%
            exitTl.to(waveRef.current, {
                y: "-100%",
                duration: 0.6,
                ease: "power2.out"
            })
                // Fade out content
                .to(contentRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    filter: "blur(10px)",
                    duration: 0.6,
                    ease: "power4.in"
                })
                // Screen wipe
                .to(containerRef.current, {
                    height: 0,
                    duration: 1,
                    ease: "expo.inOut"
                });
        }
    }, [finished, onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden shadow-2xl"
        >
            <div ref={contentRef} className="relative flex flex-col items-center">
                {/* SVG Text with Liquid Fill */}
                <div className="relative mb-8 h-32 w-[300px] sm:w-[500px] flex items-center justify-center">
                    <svg
                        viewBox="0 0 500 100"
                        className="w-full h-full select-none"
                        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}
                    >
                        <defs>
                            <pattern
                                id="wave"
                                patternUnits="userSpaceOnUse"
                                width="1000"
                                height="200"
                                viewBox="0 0 1000 200"
                            >
                                <path
                                    ref={waveRef}
                                    d="M0 100 C 150 50, 350 150, 500 100 C 650 50, 850 150, 1000 100 L 1000 200 L 0 200 Z"
                                    fill="#2563eb"
                                    transform="translate(0, 100)"
                                />
                            </pattern>

                            {/* Fallback pattern for infinite loop */}
                            <mask id="textMask">
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-zentry text-8xl font-black uppercase tracking-widest"
                                    style={{ fontFamily: "'zentry', sans-serif" }}
                                >
                                    KRIYA 26
                                </text>
                            </mask>
                        </defs>

                        {/* Background (Outline) */}
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-zentry text-8xl font-black uppercase tracking-widest fill-none stroke-gray-100 stroke-[1px]"
                            style={{ fontFamily: "'zentry', sans-serif" }}
                        >
                            KRIYA 26
                        </text>

                        {/* Filled Layer */}
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-zentry text-8xl font-black uppercase tracking-widest fill-[url(#wave)]"
                            style={{ fontFamily: "'zentry', sans-serif" }}
                        >
                            KRIYA 26
                        </text>
                    </svg>
                </div>

                {/* Counter & Info */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-general text-[10px] uppercase tracking-[0.5em] text-gray-600 font-medium">
                        2026 • PSG TECH
                    </span>
                    <div className="h-[1px] w-12 bg-gray-200 my-1" />
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-xs font-mono">00</span>
                        <span className="text-blue-600 font-mono text-lg font-bold w-12 text-center tabular-nums">
                            {percent.toString().padStart(2, '0')}
                        </span>
                        <span className="text-gray-600 text-xs font-mono">100</span>
                    </div>
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-gray-100" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-gray-100" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-gray-100" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-gray-100" />
        </div>
    );
};

export default Preloader;
