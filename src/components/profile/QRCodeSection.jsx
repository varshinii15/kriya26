"use client";
import React, { useState } from "react";
import { BentoTilt } from "../Features";
import { TiTimes } from "react-icons/ti";

const QRCodeSection = ({ ticketId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Compact QR Code Card */}
            <BentoTilt
                className="w-full h-full min-h-[280px] border border-white/10 bg-white/5 backdrop-blur-md rounded-xl relative overflow-hidden group cursor-pointer"
                onClick={() => setIsExpanded(true)}
            >
                <div className="absolute inset-0 bg-[url('/img/grid.png')] opacity-10 bg-repeat bg-size-[50px_50px]"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-5 text-center">
                    <div className="relative bg-white/90 backdrop-blur-lg p-2 rounded-lg mb-4 shadow-lg">
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-black relative overflow-hidden flex items-center justify-center">
                            <p className="text-white text-[10px] font-mono">QR CODE</p>
                            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-blue-500/50 to-transparent -translate-y-full animate-scan"></div>
                        </div>
                        {/* Corner Markers */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-black -translate-x-0.5 -translate-y-0.5"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-black translate-x-0.5 -translate-y-0.5"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-black -translate-x-0.5 translate-y-0.5"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-black translate-x-0.5 translate-y-0.5"></div>
                    </div>

                    {/* Kriya ID in Blue */}
                    <h3 className="font-zentry text-2xl text-blue-400 uppercase mb-2">{ticketId || "KRIYA-26-XXXX"}</h3>
                    <p className="font-general text-[10px] text-gray-400 uppercase tracking-widest">Tap to Expand</p>
                </div>

                <style jsx>{`
                    @keyframes scan {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                    .animate-scan {
                        animation: scan 2.5s linear infinite;
                    }
                `}</style>
            </BentoTilt>

            {/* Expanded Modal - Pops to Center */}
            {isExpanded && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setIsExpanded(false)}
                >
                    <div
                        className="relative bg-[#181818] border border-white/10 rounded-2xl p-8 max-w-sm w-full animate-pop-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setIsExpanded(false)}
                        >
                            <TiTimes className="text-2xl" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="relative bg-white p-4 rounded-lg mb-6">
                                <div className="w-48 h-48 bg-black relative overflow-hidden flex items-center justify-center">
                                    <p className="text-white text-xs font-mono">QR CODE</p>
                                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-blue-500/50 to-transparent -translate-y-full animate-scan-modal"></div>
                                </div>
                                {/* Corner Markers */}
                                <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-black -translate-x-1 -translate-y-1"></div>
                                <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-black translate-x-1 -translate-y-1"></div>
                                <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-black -translate-x-1 translate-y-1"></div>
                                <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-black translate-x-1 translate-y-1"></div>
                            </div>

                            {/* Kriya ID in Blue */}
                            <h3 className="font-zentry text-3xl text-blue-400 uppercase mb-3">{ticketId || "KRIYA-26-XXXX"}</h3>
                            <p className="font-general text-xs text-gray-400 uppercase tracking-widest">Scan at Venue for Entry</p>
                        </div>

                        <style jsx>{`
                            @keyframes scan-modal {
                                0% { transform: translateY(-100%); }
                                100% { transform: translateY(100%); }
                            }
                            .animate-scan-modal {
                                animation: scan-modal 2s linear infinite;
                            }
                            @keyframes pop-in {
                                0% { transform: scale(0.8); opacity: 0; }
                                100% { transform: scale(1); opacity: 1; }
                            }
                            .animate-pop-in {
                                animation: pop-in 0.25s ease-out forwards;
                            }
                            @keyframes fade-in {
                                0% { opacity: 0; }
                                100% { opacity: 1; }
                            }
                            .animate-fade-in {
                                animation: fade-in 0.2s ease-out forwards;
                            }
                        `}</style>
                    </div>
                </div>
            )}
        </>
    );
};

export default QRCodeSection;


