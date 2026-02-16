"use client";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPreRegistrationEnabled } from "@/settings/featureFlags";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsGrid from "@/components/profile/StatsGrid";
import QRCodeSection from "@/components/profile/QRCodeSection";
import EventTicket from "@/components/profile/EventTicket";
import ScrollableContainer from "@/components/profile/ScrollableContainer";
import IdCardSection from "@/components/profile/IdCardSection";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventservice";

// Color mapping for event categories
const getCategoryColor = (category, itemType) => {
    if (itemType === 'workshop') return 'bg-emerald-500';
    if (itemType === 'paper') return 'bg-yellow-500';

    const cat = (category || '').toLowerCase();
    if (cat.includes('non technical') || cat.includes('non-technical')) return 'bg-cyan-500';
    if (cat.includes('technical')) return 'bg-pink-500';
    return 'bg-blue-500';
};

// Transform API event to EventTicket format
const transformEvent = (item, itemType) => ({
    id: item._id || item.eventId || item.workshopId || item.paperId,
    title: item.eventName || item.workshopName || item.name || 'Unnamed Event',
    category: item.category || (itemType === 'workshop' ? 'Workshop' : itemType === 'paper' ? 'Paper' : 'Event'),
    date: item.date ? new Date(item.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'TBA',
    venue: item.hall || 'TBA',
    color: getCategoryColor(item.category, itemType),
    link: itemType === 'workshop'
        ? `/portal/workshop/${item.workshopId}`
        : itemType === 'paper'
            ? `/portal/paper/${item.paperId}`
            : `/portal/event/${item.eventId}`,
    itemType
});

function ProfilePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, isAuthenticated, logout, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [events, setEvents] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [papers, setPapers] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const vantaRef = useRef(null);

    // Handler to refresh user data after profile update
    const handleProfileUpdate = async () => {
        if (refreshUser) {
            await refreshUser();
        }
    };

    // Redirect to auth if not authenticated
    // Use a small delay to allow auth state to stabilize after navigation
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            const timer = setTimeout(() => {
                router.push('/auth?type=login');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch user registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!isAuthenticated) return;

            try {
                setDataLoading(true);
                const [eventsRes, workshopsRes, papersRes] = await Promise.all([
                    eventService.getUserEvents().catch(() => []),
                    eventService.getUserWorkshops().catch(() => []),
                    eventService.getUserPapers().catch(() => [])
                ]);

                // Safe extraction helper
                const safeExtract = (res, key) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res[key] && Array.isArray(res[key])) return res[key];
                    if (res.data && Array.isArray(res.data)) return res.data;
                    return [];
                };

                setEvents(safeExtract(eventsRes, 'events').map(e => transformEvent(e, 'event')));
                setWorkshops(safeExtract(workshopsRes, 'workshops').map(w => transformEvent(w, 'workshop')));
                setPapers(safeExtract(papersRes, 'papers').map(p => transformEvent(p, 'paper')));
            } catch (err) {
                console.error('Error fetching registrations:', err);
                setError('Failed to load registrations');
            } finally {
                setDataLoading(false);
            }
        };

        fetchRegistrations();
    }, [isAuthenticated]);

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

    // Build user data for ProfileHeader
    const userData = user ? {
        name: user.name || 'KRIYA USER',
        kriyaId: user.uniqueId || 'KRIYA-26-0000',
        college: user.college || 'Not Set',
        email: user.email || 'user@example.com',
        phone: user.phone || 'Not Set',
        department: user.department || 'Not Set',
        year: user.year || '?',
        isPaid: user.generalFeePaid
    } : {};

    // Build stats data
    const statsData = {
        eventsCount: events.length,
        workshopsCount: workshops.length,
        isPaid: user?.generalFeePaid || false
    };

    // Filter paper presentations
    const hasPaperPresentations = papers.length > 0;

    // Check if user is from PSG colleges based on email (no accommodation needed)
    const isPSGStudent = user?.email ?
        (user.email.toLowerCase().endsWith('@psgtech.ac.in')) : false;

    // Read tab from query parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'accommodation' && !isPSGStudent) {
            setActiveTab('accommodation');
        } else if (tabParam === 'ambassador') {
            setActiveTab('ambassador');
        }
    }, [searchParams, isPSGStudent]);

    // Don't render anything if not authenticated (redirect will happen)
    if (!authLoading && !isAuthenticated) {
        return null;
    }

    const isLoading = authLoading || (isAuthenticated && dataLoading);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/auth?type=login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Pre-registration view
    if (isPreRegistrationEnabled) {
        return (
            <div className="min-h-screen w-full bg-black text-white pt-28 pb-20 px-4 md:px-8 lg:px-12 relative">
                {!isLoading && <Navbar />}
                {/* Vanta Waves Background - Fixed to screen, always mounted */}
                <div ref={vantaRef} className="fixed inset-0 w-screen h-screen z-0"></div>

                {/* Loading Overlay */}
                {isLoading ? (
                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-general text-sm uppercase tracking-wider text-gray-400">Loading Profile...</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                        {/* Tab Navigation */}
                        <div className="flex items-center border-b border-white/10 mb-2 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-1 min-w-max">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "profile"
                                        ? "text-white border-b-2 border-blue-500"
                                        : "text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    Profile
                                </button>
                                {!isPSGStudent && (
                                    <button
                                        onClick={() => setActiveTab("accommodation")}
                                        className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "accommodation"
                                            ? "text-white border-b-2 border-blue-500"
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        Accommodation
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveTab("ambassador")}
                                    className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "ambassador"
                                        ? "text-white border-b-2 border-blue-500"
                                        : "text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    Ambassador
                                </button>
                            </div>
                        </div>

                        {activeTab === "profile" && (
                            <>
                                {/* Notification Banner */}
                                <div className="bg-blue-600/20 border border-blue-400 p-4 rounded-xl text-center backdrop-blur-md">
                                    <p className="font-general font-medium text-white tracking-wide drop-shadow-md">
                                        You will be notified once registrations opens
                                    </p>
                                </div>

                                {/* Row 1: Profile Header (Full Width) */}
                                <section>
                                    <ProfileHeader
                                        user={userData}
                                        onLogout={handleLogout}
                                        isLoggingOut={isLoggingOut}
                                        onProfileUpdate={handleProfileUpdate}
                                    />
                                </section>

                                {/* Row 3: QR Code Section (Left) */}
                                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-12">
                                        <QRCodeSection ticketId={userData.kriyaId} />
                                    </div>
                                </section>
                            </>
                        )}

                        {!isPSGStudent && activeTab === "accommodation" && (
                            <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                                <div className="text-center">
                                    <h2 className="font-zentry text-4xl text-white uppercase mb-4">Accommodation</h2>
                                    <p className="font-circular-web text-gray-400">Coming Soon</p>
                                </div>
                            </section>
                        )}

                        {activeTab === "ambassador" && (
                            <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-8">
                                <div className="text-center max-w-lg">
                                    <h2 className="font-zentry text-4xl text-white uppercase mb-4">Campus Ambassador</h2>
                                    <p className="font-circular-web text-gray-300 text-lg leading-relaxed mb-6">
                                        Represent Kriya on your campus. Get your unique referral code, bring your crew to register & pay — and <span className="text-blue-400 font-bold">the more they join, the bigger your rewards</span>.
                                    </p>
                                    <p className="font-general text-sm uppercase tracking-widest text-gray-500">Coming Soon</p>
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black text-white pt-28 pb-20 px-4 md:px-8 lg:px-12 relative">
            {!isLoading && <Navbar />}
            {/* Vanta Waves Background - Fixed to screen, always mounted */}
            <div ref={vantaRef} className="fixed inset-0 w-screen h-screen z-0"></div>

            {/* Loading Overlay */}
            {isLoading ? (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="font-general text-sm uppercase tracking-wider text-gray-400">Loading Profile...</p>
                    </div>
                </div>
            ) : (

                /* Content */
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">

                    {/* Tab Navigation */}
                    <div className="flex items-center border-b border-white/10 mb-2 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1 min-w-max">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "profile"
                                    ? "text-white border-b-2 border-blue-500"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                Profile
                            </button>
                            {!isPSGStudent && (
                                <button
                                    onClick={() => setActiveTab("accommodation")}
                                    className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "accommodation"
                                        ? "text-white border-b-2 border-blue-500"
                                        : "text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    Accommodation
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab("ambassador")}
                                className={`px-6 py-3 font-general text-sm uppercase tracking-wider transition-colors ${activeTab === "ambassador"
                                    ? "text-white border-b-2 border-blue-500"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                Ambassador
                            </button>
                        </div>
                    </div>

                    {activeTab === "profile" && (
                        <>
                            {/* Row 1: Profile Header (Full Width) */}
                            <section>
                                <ProfileHeader
                                    user={userData}
                                    onLogout={handleLogout}
                                    isLoggingOut={isLoggingOut}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            </section>

                            <section>
                                <StatsGrid stats={statsData} />
                            </section>

                            {/* Row 2.5: ID Card Upload */}
                            <section>
                                <IdCardSection user={user} onRefresh={refreshUser} />
                            </section>

                            {/* Row 3: QR Code + My Workshops (Side by Side) */}
                            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* QR Code Section (Left) */}
                                <div className="lg:col-span-4">
                                    <QRCodeSection ticketId={userData.kriyaId} />
                                </div>

                                {/* My Workshops Section (Right) */}
                                <div className="lg:col-span-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col">
                                    <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                        <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>My Workshops</b></h2>
                                        <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                            {workshops.length} Enrolled
                                        </span>
                                    </div>
                                    <ScrollableContainer maxHeight="300px">
                                        {workshops.length > 0 ? (
                                            workshops.map(workshop => (
                                                <EventTicket key={workshop.id} event={workshop} />
                                            ))
                                        ) : (
                                            <p className="text-gray-500 font-general text-sm text-center py-8">No workshops enrolled yet</p>
                                        )}
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
                                            {events.length} Registered
                                        </span>
                                    </div>
                                    <ScrollableContainer maxHeight="350px">
                                        {events.length > 0 ? (
                                            events.map(event => (
                                                <EventTicket key={event.id} event={event} />
                                            ))
                                        ) : (
                                            <p className="text-gray-500 font-general text-sm text-center py-8">No events registered yet</p>
                                        )}
                                    </ScrollableContainer>
                                </div>

                                {/* My Paper Presentations Section (Only if user has paper presentations) */}
                                {hasPaperPresentations && (
                                    <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col">
                                        <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>My Paper Presentations</b></h2>
                                            <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                                {papers.length} Submitted
                                            </span>
                                        </div>
                                        <ScrollableContainer maxHeight="350px">
                                            {papers.map(paper => (
                                                <EventTicket key={paper.id} event={paper} />
                                            ))}
                                        </ScrollableContainer>
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {!isPSGStudent && activeTab === "accommodation" && (
                        <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                            <div className="text-center">
                                <h2 className="font-zentry text-4xl text-white uppercase mb-4">Accommodation</h2>
                                <p className="font-circular-web text-gray-400">Coming Soon</p>
                            </div>
                        </section>
                    )}

                    {activeTab === "ambassador" && (
                        <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-8">
                            <div className="text-center max-w-lg">
                                <h2 className="font-zentry text-4xl text-white uppercase mb-4">Campus Ambassador</h2>
                                <p className="font-circular-web text-gray-300 text-lg leading-relaxed mb-6">
                                    Represent Kriya on your campus. Get your unique referral code, bring your crew to register & pay — and <span className="text-blue-400 font-bold">the more they join, the bigger your rewards</span>.
                                </p>
                                <p className="font-general text-sm uppercase tracking-widest text-gray-500">Coming Soon</p>
                            </div>
                        </section>
                    )}

                </div>
            )}
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={null}>
            <ProfilePageContent />
        </Suspense>
    );
}
