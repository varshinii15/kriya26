"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
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
import api from "@/services/api";

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
    const [activePopup, setActivePopup] = useState(null);
    const [dismissedPopups, setDismissedPopups] = useState({
        uploadIdCard: false,
        payGeneralFee: false
    });
    const vantaRef = useRef(null);
    const idCardSectionRef = useRef(null);
    const [waitingForIdUpload, setWaitingForIdUpload] = useState(false);

    // Payment records state
    const [paymentRecords, setPaymentRecords] = useState([]);
    const [recordsSummary, setRecordsSummary] = useState({ totalRecords: 0, totalAmount: 0 });
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    // Handler to refresh user data after profile update
    const handleProfileUpdate = async () => {
        if (refreshUser) {
            await refreshUser();
        }
    };

    // Fetch payment records
    const fetchPaymentRecords = async () => {
        try {
            setRecordsLoading(true);
            const response = await api.get("/api/payment/records");
            const data = response.data;
            if (data.success) {
                setPaymentRecords(data.data?.records || []);
                setRecordsSummary(data.data?.summary || { totalRecords: 0, totalAmount: 0 });
            }
        } catch (error) {
            console.error("Error fetching payment records:", error);
        } finally {
            setRecordsLoading(false);
        }
    };

    // Check payment status
    const handleCheckPaymentStatus = async () => {
        try {
            setCheckingPayment(true);
            setStatusMessage(null);
            const response = await api.get("/api/payment/check");
            const data = response.data;

            if (data.success) {
                const { recordsCreated, recordsSkipped, totalRegistrations } = data.summary || {};
                if (totalRegistrations === 0) {
                    setStatusMessage({ type: "info", text: "No payment records found. If you have made a payment, please wait a few minutes and try again." });
                } else if (recordsCreated > 0) {
                    setStatusMessage({ type: "success", text: `Payment verified successfully! ${recordsCreated} new payment record(s) synced.` });
                } else {
                    setStatusMessage({ type: "info", text: "All payment records are already up to date." });
                }
                await fetchPaymentRecords();
                // Refresh user data and page to reflect updated payment status
                if (refreshUser) await refreshUser();
                router.refresh();
            } else {
                setStatusMessage({ type: "error", text: data.message || "Payment check failed." });
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to check payment status. Please try again.";
            setStatusMessage({ type: "error", text: msg });
        } finally {
            setCheckingPayment(false);
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

    // Fetch payment records on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchPaymentRecords();
        }
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

    const isIdCardUploaded = Boolean(user?.idCardUrl);
    const isGeneralFeePaid = Boolean(user?.generalFeePaid);

    // Read tab from query parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'accommodation' && !isPSGStudent) {
            setActiveTab('accommodation');
        }
    }, [searchParams, isPSGStudent]);

    const isLoading = authLoading || (isAuthenticated && dataLoading);

    // Clear waitingForIdUpload once the ID card is actually uploaded
    useEffect(() => {
        if (isIdCardUploaded && waitingForIdUpload) {
            setWaitingForIdUpload(false);
        }
    }, [isIdCardUploaded, waitingForIdUpload]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            setActivePopup(null);
            return;
        }

        if (!isPreRegistrationEnabled && !isIdCardUploaded && !dismissedPopups.uploadIdCard) {
            setActivePopup("uploadIdCard");
            return;
        }

        // Don't show payment popup while user is in the middle of uploading their ID card
        if (waitingForIdUpload) return;

        if (!isPreRegistrationEnabled && !isGeneralFeePaid && !dismissedPopups.payGeneralFee) {
            // Delay the payment reminder so it doesn't appear immediately after the ID card popup
            const timer = setTimeout(() => {
                setActivePopup("payGeneralFee");
            }, 2500);
            return () => clearTimeout(timer);
        }

        setActivePopup(null);
    }, [isLoading, isAuthenticated, isIdCardUploaded, isGeneralFeePaid, dismissedPopups, waitingForIdUpload]);

    // Don't render anything if not authenticated (redirect will happen)
    if (!authLoading && !isAuthenticated) {
        return null;
    }

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

    const closeActivePopup = () => {
        if (!activePopup) return;
        setDismissedPopups((prev) => ({ ...prev, [activePopup]: true }));
        setActivePopup(null);
    };

    const handleUploadIdCardClick = () => {
        closeActivePopup();
        setWaitingForIdUpload(true);
        setActiveTab("profile");
        setTimeout(() => {
            idCardSectionRef.current?.triggerUpload();
        }, 100);
    };

    const handlePayGeneralFeeClick = () => {
        closeActivePopup();
        router.push("/fee-payment");
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
                            </div>
                            {!isGeneralFeePaid && (
                                <button
                                    onClick={() => router.push('/fee-payment')}
                                    className="ml-auto px-5 py-2 font-general text-xs uppercase tracking-wider bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors whitespace-nowrap"
                                >
                                    Pay Now
                                </button>
                            )}
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
                        </div>
                        {!isGeneralFeePaid && (
                            <button
                                onClick={() => router.push('/fee-payment')}
                                className="ml-auto px-5 py-2 font-general text-xs uppercase tracking-wider bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors whitespace-nowrap"
                            >
                                Pay Now
                            </button>
                        )}
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

                            {/* Payment Records Section */}
                            <section className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5">
                                <div className="flex items-end gap-4 mb-4 border-b border-white/10 pb-2">
                                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>Payment Records</b></h2>
                                    {recordsSummary.totalRecords > 0 && (
                                        <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                            {recordsSummary.totalRecords} Record{recordsSummary.totalRecords !== 1 ? "s" : ""} · ₹{recordsSummary.totalAmount}
                                        </span>
                                    )}
                                </div>

                                {/* Check Payment Status Button */}
                                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                                    <button
                                        onClick={handleCheckPaymentStatus}
                                        disabled={checkingPayment}
                                        className={`group relative px-6 py-3 text-white font-general text-xs uppercase tracking-widest rounded-lg transition-all duration-300 border ${checkingPayment
                                            ? "border-gray-500/30 bg-gray-600/30 cursor-not-allowed opacity-60"
                                            : "border-emerald-400/30 bg-emerald-500/20 hover:bg-emerald-500/40 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {checkingPayment ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Checking...
                                                </>
                                            ) : (
                                                <>
                                                    Check Payment Status
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.312.342a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.06-7.534a.75.75 0 0 0-1.5 0v2.033l-.312-.342A7 7 0 0 0 2.848 8.72a.75.75 0 0 0 1.449.39A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.89Z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>

                                {/* Status Message */}
                                {statusMessage && (
                                    <div className={`rounded-lg p-3 border mb-4 ${statusMessage.type === "success"
                                        ? "bg-emerald-500/10 border-emerald-400/30"
                                        : statusMessage.type === "error"
                                            ? "bg-red-500/10 border-red-400/30"
                                            : "bg-blue-500/10 border-blue-400/30"
                                        }`}>
                                        <p className={`font-circular-web text-sm ${statusMessage.type === "success"
                                            ? "text-emerald-300"
                                            : statusMessage.type === "error"
                                                ? "text-red-300"
                                                : "text-blue-300"
                                            }`}>
                                            {statusMessage.text}
                                        </p>
                                    </div>
                                )}

                                {/* Records List */}
                                {recordsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="ml-3 font-general text-sm text-gray-400 uppercase tracking-wider">Loading records...</p>
                                    </div>
                                ) : paymentRecords.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-600 mx-auto mb-3">
                                            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                                            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-circular-web text-gray-400 text-sm">No payment records found.</p>
                                        <p className="font-circular-web text-gray-500 text-xs mt-1">
                                            If you have made a payment, click &quot;Check Payment Status&quot; above to sync your records.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {paymentRecords.map((record, index) => (
                                            <div
                                                key={record._id || index}
                                                className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-general text-sm text-white uppercase tracking-wide truncate">
                                                        {record.category}
                                                    </p>
                                                    <p className="font-circular-web text-xs text-gray-400 mt-1">
                                                        {record.time
                                                            ? new Date(record.time).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                timeZone: "Asia/Kolkata",
                                                            })
                                                            : "—"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4">
                                                    <span className="font-general text-lg text-white font-bold">
                                                        ₹{record.amount}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-general uppercase tracking-wider ${record.status === "1"
                                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                                                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                                                        }`}>
                                                        {record.status === "1" ? "Paid" : "Pending"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* ID Card Upload */}
                            <section id="id-card-section">
                                <IdCardSection ref={idCardSectionRef} user={user} onRefresh={refreshUser} />
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

                </div>
            )}

            {activePopup && !isLoading && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/90 p-6 text-white shadow-2xl">
                        <h3 className="special-font text-3xl uppercase leading-[0.9]">
                            {activePopup === "uploadIdCard" ? <b>Upload ID Card</b> : <b>Pay General Fee</b>}
                        </h3>
                        <p className="mt-3 font-circular-web text-sm text-gray-300">
                            {activePopup === "uploadIdCard"
                                ? "Please upload your college ID card to continue with registrations."
                                : "Please complete your general fee payment to unlock event registrations."}
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={closeActivePopup}
                                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 font-general text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={activePopup === "uploadIdCard" ? handleUploadIdCardClick : handlePayGeneralFeeClick}
                                className="flex-1 rounded-lg border border-blue-400 bg-blue-500 px-4 py-2.5 font-general text-xs uppercase tracking-wider text-white hover:bg-blue-600 transition-colors"
                            >
                                {activePopup === "uploadIdCard" ? "Upload Now" : "Pay Now"}
                            </button>
                        </div>
                    </div>
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

