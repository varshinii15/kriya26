import React, { useState } from "react";
import { IoMdCall } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const EventDetailsModal = ({ eventDetail, onClose }) => {
    const [expandRounds, setExpandRounds] = useState(false);
    const [expandRules, setExpandRules] = useState(false);

    if (!eventDetail) return null;

    return (
        <div className="fixed inset-0 lg:left-[25%] lg:w-[75%] z-[100] flex items-center justify-center p-4 pt-24 md:p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-none shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Content with Sticky Close Button */}
                <div className="p-4 md:p-6 pb-2 border-b border-gray-100 bg-white sticky top-0 z-40 relative">
                    {/* Close Button MOVED INSIDE STICKY HEADER */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 z-50 group bg-white border border-gray-200 hover:bg-black transition-colors shadow-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-black group-hover:text-white transition-colors"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="flex flex-col gap-1">
                        <h2 className="special-font text-4xl md:text-6xl font-black uppercase tracking-wider text-black leading-none">
                            <b>{eventDetail.eventName}</b>
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className="special-font text-blue-400 font-bold tracking-widest uppercase text-lg md:text-xl">
                                <b>{eventDetail.category} Event</b>
                            </p>
                            {eventDetail.closed && (
                                <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    Closed
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 space-y-8 bg-white">
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border-l-4 border-blue-400 pl-6 py-2">
                            <p className="font-poppins text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                                Timing
                            </p>
                            <p className="special-font text-xl md:text-2xl font-bold text-black tracking-wider">
                                <b>{eventDetail.timing}</b>
                            </p>
                        </div>
                        <div className="bg-white border-l-4 border-blue-400 pl-6 py-2">
                            <p className="font-poppins text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                                Venue
                            </p>
                            <p className="special-font text-xl md:text-2xl font-bold text-black tracking-wider">
                                <b>{eventDetail.hall || "TBA"}</b>
                            </p>
                        </div>
                        <div className="bg-white border-l-4 border-blue-400 pl-6 py-2">
                            <p className="font-poppins text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                                Team Size
                            </p>
                            <p className="special-font text-xl md:text-2xl font-bold text-black">
                                <b>{eventDetail.teamSize} Member{eventDetail.teamSize !== "1" ? "s" : ""}</b>
                            </p>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="font-poppins">
                        <h3 className="special-font text-2xl md:text-3xl text-blue-400 uppercase mb-4">
                            <b>About The Event</b>
                        </h3>
                        {eventDetail.oneLineDescription && (
                            <p className="text-lg md:text-xl font-bold text-black italic opacity-90 mb-4 border-l-4 border-black pl-6 py-2">
                                "{eventDetail.oneLineDescription}"
                            </p>
                        )}
                        <div className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap text-justify">
                            {eventDetail.description}
                        </div>
                    </section>

                    {/* Rounds Section */}
                    {eventDetail.rounds && eventDetail.rounds.length > 0 && (
                        <section className="font-poppins">
                            <h3 className="special-font text-2xl md:text-3xl text-blue-400 uppercase mb-6">
                                <b>Rounds</b>
                            </h3>
                            <div className="relative">
                                <div className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${expandRounds ? 'max-h-full' : 'max-h-[300px] md:max-h-full'}`}>
                                    {eventDetail.rounds.map((round, index) => (
                                        <div
                                            key={index}
                                            className="group relative bg-white border border-gray-200 p-6 hover:border-black transition-all duration-300"
                                        >
                                            <div className="absolute top-0 right-0 bg-blue-400 text-white px-3 py-1 font-bold text-lg special-font">
                                                <b>0{index + 1}</b>
                                            </div>
                                            <h4 className="text-xl font-black uppercase text-black mb-2 tracking-wide">
                                                {round.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                                {round.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {/* Blur Overlay for Mobile */}
                                {!expandRounds && (
                                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none md:hidden" />
                                )}
                                {/* Show More Button for Mobile */}
                                <div className="flex justify-center mt-4 md:hidden">
                                    <button
                                        onClick={() => setExpandRounds(!expandRounds)}
                                        className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-wider text-xs animate-bounce"
                                    >
                                        {expandRounds ? "Show Less" : "Show More"}
                                        {expandRounds ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Rules Section */}
                    {eventDetail.eventRules && (
                        <section className="font-poppins">
                            <h3 className="special-font text-2xl md:text-3xl text-blue-400 uppercase mb-4">
                                <b>Rules & Regulations</b>
                            </h3>
                            <div className="relative">
                                <div className={`bg-white border border-gray-200 p-6 overflow-hidden transition-all duration-500 ease-in-out ${expandRules ? 'max-h-full' : 'max-h-[250px] md:max-h-full'}`}>
                                    <ul className="space-y-3">
                                        {(() => {
                                            const rawRules = eventDetail.eventRules;
                                            let rules = [];
                                            if (rawRules.includes("\n")) {
                                                rules = rawRules.split("\n").filter(r => r.trim());
                                            } else {
                                                rules = rawRules.split(/(?=\d+\.\s)/).filter(r => r.trim());
                                            }

                                            return rules.map((rule, i) => (
                                                <li key={i} className="flex gap-3 text-gray-800 text-sm md:text-base font-medium">
                                                    <span className="text-blue-400 font-bold text-lg">•</span>
                                                    <span className="flex-1 leading-relaxed">
                                                        {rule.replace(/^\d+\.\s*/, "")}
                                                    </span>
                                                </li>
                                            ));
                                        })()}
                                    </ul>
                                </div>
                                {/* Blur Overlay for Mobile */}
                                {!expandRules && (
                                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none md:hidden" />
                                )}
                                {/* Show More Button for Mobile */}
                                <div className="flex justify-center mt-4 md:hidden">
                                    <button
                                        onClick={() => setExpandRules(!expandRules)}
                                        className="flex flex-col items-center gap-1 text-black font-bold uppercase tracking-wider text-xs animate-bounce"
                                    >
                                        {expandRules ? "Show Less" : "Show More"}
                                        {expandRules ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Contact Section */}
                    {eventDetail.contacts && eventDetail.contacts.length > 0 && (
                        <section className="font-poppins">
                            <h3 className="special-font text-2xl md:text-3xl text-blue-400 uppercase mb-6">
                                <b>Get In Touch</b>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {eventDetail.contacts.map((contact, index) => (
                                    contact && (
                                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 hover:border-blue-400 transition-colors bg-white">
                                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-lg shrink-0">
                                                <IoMdCall />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base uppercase text-black mb-0">
                                                    {contact.name}
                                                </p>
                                                <p className="text-blue-400 font-mono text-sm font-bold tracking-wide">
                                                    {contact.mobile || contact.phone}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer Action - NO LONGER STICKY */}
                <div className="p-8 pb-12 pt-4 bg-white border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-colors shadow-xl"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
