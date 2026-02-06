"use client";
import React, { useState, useEffect, useRef } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsGrid from "@/components/profile/StatsGrid";
import QRCodeSection from "@/components/profile/QRCodeSection";
import EventTicket from "@/components/profile/EventTicket";
import ScrollableContainer from "@/components/profile/ScrollableContainer";

// Mock Data for Development
const USER_DATA = {
    name: "Adhish Krishna S",
    kriyaId: "KRIYA-26-4892",
    college: "PSG College of Technology",
    email: "alex.sterling@example.com",
    avatar: "/img/gallery-2.webp",
    department: "CSE AI ML",
    isPaid: true,
    year: "3"
};

const STATS_DATA = {
    eventsCount: 4,
    workshopsCount: 2,
    isPaid: true
};

const REGISTERED_EVENTS = [
    { id: 1, title: "Paper Pres.", category: "CS", date: "March 14", time: "10:00 AM", venue: "F-Block", color: "bg-blue-500" },
    { id: 2, title: "Robo Wars", category: "Robotics", date: "March 15", time: "11:30 AM", venue: "Quadrangle", color: "bg-red-500" },
    { id: 3, title: "Code Rush", category: "Coding", date: "March 14", time: "02:00 PM", venue: "Comp. Labs", color: "bg-violet-500" },
    { id: 4, title: "Circuit Debug", category: "Electrical", date: "March 16", time: "09:00 AM", venue: "E-Block", color: "bg-yellow-500" }
];

const WORKSHOPS = [
    { id: 101, title: "AI/ML Masterclass", category: "Workshop", date: "March 15", time: "10:00 AM", venue: "Assembly Hall", color: "bg-emerald-500" },
    { id: 102, title: "Drone Tech", category: "Workshop", date: "March 16", time: "01:30 PM", venue: "Ground 2", color: "bg-orange-500" }
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const vantaRef = useRef(null);

    // Filter events by type
    const paperPresentations = REGISTERED_EVENTS.filter(e => e.category === "paper_presentation");
    const otherEvents = REGISTERED_EVENTS.filter(e => e.category !== "paper_presentation");
    const hasPaperPresentations = paperPresentations.length > 0;

    // Vanta Waves Background Effect
    useEffect(() => {
        let vantaEffect = null;

        const loadVanta = async () => {
            if (typeof window !== 'undefined') {
                if (!window.THREE) {
                    const threeScript = document.createElement('script');
                    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
                    document.head.appendChild(threeScript);

                    await new Promise((resolve) => {
                        threeScript.onload = resolve;
                    });
                }

                // Load Vanta Waves
                if (!window.VANTA || !window.VANTA.WAVES) {
                    const vantaScript = document.createElement('script');
                    vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js';
                    document.head.appendChild(vantaScript);

                    await new Promise((resolve) => {
                        vantaScript.onload = resolve;
                    });
                }

                // Initialize Vanta effect
                if (window.VANTA && vantaRef.current) {
                    vantaEffect = window.VANTA.WAVES({
                        el: vantaRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        color: 0x30c15,
                        shininess: 55.00,
                        waveHeight: 0.00,
                        waveSpeed: 0.70,
                        zoom: 1.49
                    });
                }
            }
        };

        loadVanta();

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-black text-white pt-28 pb-20 px-4 md:px-8 lg:px-12 relative">
            {/* Vanta Waves Background - Fixed to screen */}
            <div ref={vantaRef} className="fixed inset-0 w-screen h-screen z-0"></div>

            {/* Content */}
            <div className="max-w-4xl mx-auto space-y-6 relative z-10">

                {/* Tab Navigation */}
                <div className="flex gap-1 border-b border-white/10 mb-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "profile"
                            ? "text-white border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("accommodation")}
                        className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "accommodation"
                            ? "text-white border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        Accommodation
                    </button>
                </div>

                {activeTab === "profile" && (
                    <>
                        {/* Row 1: Profile Header (Full Width) */}
                        <section>
                            <ProfileHeader user={USER_DATA} />
                        </section>

                        {/* Row 2: Stats Row (Horizontal) */}
                        <section>
                            <StatsGrid stats={STATS_DATA} />
                        </section>

                        {/* Row 3: QR Code + My Workshops (Side by Side) */}
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* QR Code Section (Left) */}
                            <div className="lg:col-span-4">
                                <QRCodeSection ticketId={USER_DATA.kriyaId} />
                            </div>

                            {/* My Workshops Section (Right) */}
                            <div className="lg:col-span-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col">
                                <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>My Workshops</b></h2>
                                    <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                        {WORKSHOPS.length} Enrolled
                                    </span>
                                </div>
                                <ScrollableContainer maxHeight="300px">
                                    {WORKSHOPS.map(workshop => (
                                        <EventTicket key={workshop.id} event={workshop} />
                                    ))}
                                </ScrollableContainer>
                            </div>
                        </section>

                        {/* Row 4: My Events + My Paper Presentations (Side by Side) */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* My Events Section */}
                            <div className={`border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col ${!hasPaperPresentations ? 'lg:col-span-2' : ''}`}>
                                <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>My Events</b></h2>
                                    <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                        {otherEvents.length} Registered
                                    </span>
                                </div>
                                <ScrollableContainer maxHeight="350px">
                                    {otherEvents.map(event => (
                                        <EventTicket key={event.id} event={event} />
                                    ))}
                                </ScrollableContainer>
                            </div>

                            {/* My Paper Presentations Section (Only if user has paper presentations) */}
                            {hasPaperPresentations && (
                                <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col">
                                    <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                        <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>My Paper Presentations</b></h2>
                                        <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                            {paperPresentations.length} Submitted
                                        </span>
                                    </div>
                                    <ScrollableContainer maxHeight="350px">
                                        {paperPresentations.map(event => (
                                            <EventTicket key={event.id} event={event} />
                                        ))}
                                    </ScrollableContainer>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {activeTab === "accommodation" && (
                    <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                        <div className="text-center">
                            <h2 className="font-zentry text-4xl text-white uppercase mb-4">Accommodation</h2>
                            <p className="font-circular-web text-gray-400">Coming Soon</p>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}


