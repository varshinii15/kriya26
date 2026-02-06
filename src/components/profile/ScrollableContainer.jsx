"use client";
import React, { useState, useRef, useEffect } from "react";
import { TiArrowDown } from "react-icons/ti";

const ScrollableContainer = ({ children, maxHeight = "350px", className = "" }) => {
    const containerRef = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    // Check if content overflows
    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                const { scrollHeight, clientHeight } = containerRef.current;
                setHasOverflow(scrollHeight > clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [children]);

    // Handle scroll event
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop } = containerRef.current;
            setHasScrolled(scrollTop > 10);
        }
    };

    const showIndicator = hasOverflow && !hasScrolled;

    return (
        <div className="relative">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className={`flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ${className}`}
                style={{ maxHeight }}
            >
                {children}
            </div>

            {/* Scroll Indicator */}
            <div
                className={`absolute bottom-0 left-0 right-0 flex justify-center pb-2 pt-6 bg-linear-to-t from-[#121212] to-transparent pointer-events-none transition-opacity duration-300 ${showIndicator ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="flex flex-col items-center text-gray-400 animate-bounce">
                    <span className="font-general text-[10px] uppercase tracking-wider mb-1">Scroll</span>
                    <TiArrowDown className="text-lg" />
                </div>
            </div>
        </div>
    );
};

export default ScrollableContainer;
