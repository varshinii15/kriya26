"use client";
import React from "react";
import { BentoTilt } from "../Features";
import { TiCalendar, TiTime, TiLocation, TiArrowRight } from "react-icons/ti";
import Link from "next/link";

const EventTicket = ({ event }) => {
    return (
        <BentoTilt className="relative w-full shrink-0 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
            {/* Left Color Bar */}
            <div className={`absolute left-0 top-0 w-2 h-full ${event.color || "bg-blue-500"}`}></div>

            <div className="pl-5 pr-4 py-4 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-zentry text-xl md:text-2xl uppercase text-white leading-none mb-1">{event.title}</h3>
                        <span className="font-general text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {event.category || "Technical"}
                        </span>
                    </div>

                    {/* Admit Badge */}
                    <div className="hidden md:block">
                        <span className="font-general text-[8px] font-bold uppercase tracking-widest text-blue-75 border border-white/20 px-2 py-1 rounded-sm">
                            ADMIT ONE
                        </span>
                    </div>
                </div>

                {/* Details - Always Visible */}
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
                    className="inline-flex items-center gap-1 w-fit px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-general text-xs uppercase tracking-wider transition-colors"
                >
                    Go <TiArrowRight className="text-sm" />
                </Link>
            </div>
        </BentoTilt>
    );
};

export default EventTicket;


