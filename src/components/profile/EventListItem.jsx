"use client";
import React, { useState, useRef, useEffect } from "react";
import { TiCalendar, TiTime, TiLocation, TiArrowRight } from "react-icons/ti";
import Link from "next/link";
import { createPortal } from "react-dom";

const EventListItem = ({ event }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, showBelow: true });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle click for mobile
    const handleClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    // Calculate fixed position when opened
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const popupWidth = 300;
            const popupHeight = 220;
            const padding = 16;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate horizontal position
            let left = rect.left;
            if (left + popupWidth > viewportWidth - padding) {
                left = viewportWidth - popupWidth - padding;
            }
            if (left < padding) {
                left = padding;
            }

            // Check if there's enough space below, otherwise show above
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const showBelow = spaceBelow >= popupHeight + 10 || spaceBelow > spaceAbove;

            let top;
            if (showBelow) {
                top = rect.bottom + 8;
            } else {
                top = rect.top - popupHeight - 8;
            }

            // Ensure popup doesn't go off screen vertically
            if (top < padding) top = padding;
            if (top + popupHeight > viewportHeight - padding) {
                top = viewportHeight - popupHeight - padding;
            }

            setPopupPosition({ top, left, showBelow });
        }
    }, [isOpen]);

    const PopupContent = (
        <div
            className={`fixed z-9999 transition-all duration-200 ease-out ${isOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
            style={{
                top: popupPosition.top,
                left: popupPosition.left,
                width: '300px',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative border border-white/10 bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Left Color Bar */}
                <div className={`absolute left-0 top-0 w-2 h-full ${event.color || "bg-blue-500"}`}></div>

                <div className="pl-5 pr-4 py-4">
                    {/* Header */}
                    <div className="mb-3">
                        <h3 className="font-zentry text-xl uppercase text-white leading-none mb-1">{event.title}</h3>
                        <span className="font-general text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {event.category || "Technical"}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                                <TiCalendar /> <span className="uppercase font-general tracking-wide">Date</span>
                            </div>
                            <p className="text-white font-circular-web text-xs">{event.date}</p>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                                <TiTime /> <span className="uppercase font-general tracking-wide">Time</span>
                            </div>
                            <p className="text-white font-circular-web text-xs">{event.time}</p>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                                <TiLocation /> <span className="uppercase font-general tracking-wide">Venue</span>
                            </div>
                            <p className="text-white font-circular-web text-xs truncate">{event.venue}</p>
                        </div>
                    </div>

                    {/* Go Button */}
                    <Link
                        href={event.link || `/events/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-general text-xs uppercase tracking-wider transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Go <TiArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={containerRef}
                className="relative inline-block"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={handleClick}
            >
                {/* Text Link */}
                <span
                    className={`font-circular-web text-sm md:text-base cursor-pointer transition-colors ${isOpen ? 'text-blue-400' : 'text-white/80 hover:text-white'
                        }`}
                >
                    {event.title}
                </span>
            </div>

            {/* Portal the popup to body to escape any container overflow issues */}
            {mounted && createPortal(PopupContent, document.body)}
        </>
    );
};

export default EventListItem;

