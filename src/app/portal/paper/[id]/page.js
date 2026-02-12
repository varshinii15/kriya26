"use client";
import { IoMdCall, IoLogoWhatsapp, IoMdArrowBack } from "react-icons/io";
import { SiGmail } from "react-icons/si";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=YeFJPRFhmCM";

// Paper-specific accent — warm amber/gold
const PAPER_ACCENT = { primary: "#F59E0B", secondary: "#FBBF24", bg: "rgba(245,158,11,0.12)" };

const toTitleCase = (phrase) => {
    const wordsToIgnore = ["of", "in", "for", "and", "an", "or"];
    const wordsToCapitalize = ["it", "cad"];

    return phrase
        .toLowerCase()
        .split(" ")
        .map((word) => {
            if (wordsToIgnore.includes(word)) return word;
            if (wordsToCapitalize.includes(word)) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};

export default function PaperPage({ params }) {
    const { id } = useParams(params);
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const router = useRouter();
    const [generalPayment, setGeneralPayment] = useState(false);
    const [userPaperDetails, setUserPaperDetails] = useState(null);
    const [registrationLoading, setRegistrationLoading] = useState(true);
    const [paperDetail, setPaperDetail] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const accent = PAPER_ACCENT;

    // Get YouTube URL - use default if database value is empty
    const getYouTubeUrl = () => {
        const url = paperDetail?.youtubeUrl || DEFAULT_YOUTUBE_URL;
        if (!url || url.trim() === "") return `https://www.youtube.com/embed/YeFJPRFhmCM`;
        if (url.includes('/embed/')) return url;
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }
        return url;
    };

    // Format date from ISO string
    const formatDate = (dateStr) => {
        if (!dateStr) return "TBA";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        } catch {
            return "TBA";
        }
    };

    const getDateDay = (dateStr) => {
        if (!dateStr) return "TBA";
        try {
            return new Date(dateStr).getDate();
        } catch {
            return "TBA";
        }
    };

    const getDateMonth = (dateStr) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", { month: "long" });
        } catch {
            return "";
        }
    };

    useEffect(() => {
        if (user) {
            setGeneralPayment(user.generalFeePaid || user.isPaid || false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated) {
            setRegistrationLoading(true);
            eventService.getUserPapers().then((res) => {
                let paperData = [];
                if (Array.isArray(res)) {
                    paperData = res;
                } else if (res?.papers && Array.isArray(res.papers)) {
                    paperData = res.papers;
                } else if (res?.data && Array.isArray(res.data)) {
                    paperData = res.data;
                }
                setUserPaperDetails(paperData);
            }).catch(err => console.error("Error fetching user papers:", err))
                .finally(() => setRegistrationLoading(false));
        } else {
            setRegistrationLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await eventService.getPaperById(id);
                const paperData = res1?.paper || res1?.event || res1;
                setPaperDetail(paperData);
            } catch (error) {
                console.error("Error fetching paper details:", error);
            }
        };
        fetchData();
    }, [id]);

    const isRegisteredForPaper = () => {
        if (!userPaperDetails || !Array.isArray(userPaperDetails)) return false;
        return userPaperDetails.some((p) =>
            p.paperId === id || p.eventId === id || p._id === id
        );
    };

    const handleRegister = async () => {
        if (!isAuthenticated) {
            const callbackUrl = encodeURIComponent(`/portal/paper/${id}`);
            router.push(`/auth?type=register&callbackUrl=${callbackUrl}`);
        } else if (!generalPayment) {
            router.push("/auth/payment?type=GENERAL");
        } else {
            try {
                await eventService.registerPaper(id);
                window.location.reload();
            } catch (error) {
                console.error("Error registering for paper:", error);
                alert("Failed to register for paper presentation. Please try again.");
            }
        }
    };

    return !paperDetail ? (
        <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
            <p className="text-lg font-semibold text-white/60 animate-pulse">
                Loading paper...
            </p>
        </div>
    ) : (
        <div className="w-full min-h-screen flex flex-col overflow-y-auto bg-[#0a0a0a] z-20 relative lg:mt-0">

            {/* ===== Background Effects ===== */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="event-bg-orb event-bg-orb-1" style={{ background: accent.primary }} />
                <div className="event-bg-orb event-bg-orb-2" style={{ background: accent.secondary }} />
                <div className="event-bg-orb event-bg-orb-3" style={{ background: accent.primary, opacity: 0.15 }} />
                <div className="dot-grid-overlay" />
                <div className="noise-overlay" />
            </div>

            {/* ===== Top Gradient Accent Line ===== */}
            <div
                className="w-full h-[2px] relative z-10"
                style={{ background: `linear-gradient(90deg, transparent, ${accent.primary}, transparent)` }}
            />

            {/* ===== Header ===== */}
            <div className="relative md:sticky md:top-0 mt-10 md:mt-0 z-10 w-full p-3 md:p-4 md:px-6 lg:px-8 backdrop-blur-xl bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
                <div className="flex items-center gap-4 w-full md:max-w-[50%]">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="Go back"
                    >
                        <IoMdArrowBack className="text-xl md:text-2xl" />
                    </button>
                    <h1 className="special-font text-lg md:text-5xl font-bold text-white font-poppins truncate">
                        <b>{paperDetail.eventName}</b>
                    </h1>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                    <button
                        className="flex-1 md:flex-none px-3 py-2 md:px-7 md:py-3 font-bold uppercase tracking-wider text-[10px] md:text-sm transition-all duration-300 border"
                        disabled={isRegisteredForPaper() || paperDetail.closed}
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: isRegisteredForPaper() ? accent.primary : 'transparent',
                            color: isRegisteredForPaper() ? '#0a0a0a' : 'white',
                            borderColor: accent.primary,
                        }}
                    >
                        {userPaperDetails && (
                            <>
                                {isRegisteredForPaper() ? "Registered" : paperDetail.closed ? "Closed" : "Register"}
                            </>
                        )}
                        {!userPaperDetails && <>{paperDetail.closed ? "Closed" : "Register"}</>}
                    </button>
                </div>
            </div>

            {/* ===== Main Content ===== */}
            <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-8 gap-10 relative z-10">

                {/* Hero Section: Name + Description | YouTube */}
                <div className="flex flex-col lg:flex-row w-full gap-8">
                    {/* Left: Paper Info */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        {/* Category Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full w-fit text-xs font-bold uppercase tracking-widest"
                            style={{ background: accent.bg, color: accent.primary, border: `1px solid ${accent.primary}30` }}
                        >
                            <span
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ background: accent.primary }}
                            />
                            Paper Presentation
                        </div>

                        {/* Paper Name */}
                        <h1 className="special-font text-3xl md:text-6xl lg:text-7xl font-black font-poppins text-white leading-none uppercase tracking-wider">
                            <b>{paperDetail.eventName}</b>
                        </h1>

                        {/* Tagline */}
                        {paperDetail.tagline && (
                            <p className="text-sm md:text-base text-white/50 italic tracking-wide">
                                {paperDetail.tagline}
                            </p>
                        )}

                        {/* Theme / Description */}
                        <div className="text-base md:text-lg text-white/70 leading-relaxed mt-2">
                            {paperDetail.theme}
                        </div>

                        {/* Topic */}
                        {paperDetail.topic && (
                            <div className="glass-card-light p-4 mt-2">
                                <p className="text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: accent.primary }}>Topics</p>
                                <p className="text-white/70 text-sm md:text-base leading-relaxed">{paperDetail.topic}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {/* WhatsApp Button - Only show if user is registered */}
                            {isRegisteredForPaper() && (
                                <a
                                    href={getWhatsAppLink(id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 md:px-8 md:py-3 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs md:text-sm hover:bg-[#20BA5A] transition-all duration-300 w-fit flex items-center gap-2 rounded-sm"
                                >
                                    <IoLogoWhatsapp className="text-lg" />
                                    WhatsApp Group
                                </a>
                            )}

                            {/* Email contact */}
                            {paperDetail.eventMail && (
                                <a
                                    href={`mailto:${paperDetail.eventMail}`}
                                    className="px-6 py-2.5 md:px-8 md:py-3 border text-white font-bold uppercase tracking-wider text-xs md:text-sm hover:bg-white/10 transition-all duration-300 w-fit flex items-center gap-2 rounded-sm"
                                    style={{ borderColor: accent.primary }}
                                >
                                    <SiGmail className="text-lg" />
                                    Email
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: YouTube Embed */}
                    <div className="w-full lg:w-1/2 h-[350px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center border border-white/10">
                        <iframe
                            className="w-full h-full"
                            src={getYouTubeUrl()}
                            title="Paper Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <div
                            className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, ${accent.primary}20 0%, transparent 60%)`,
                            }}
                        />
                    </div>
                </div>

                {/* Info Cards Row */}
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* Logistics Card */}
                    <div className="glass-card p-6 md:p-8 flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-3 h-3 rounded-full pulse-glow"
                                style={{ color: accent.primary, background: accent.primary }}
                            />
                            <span className="text-white font-bold uppercase tracking-widest text-sm">
                                {paperDetail.closed ? "Registrations Closed" : "Live Now"}
                            </span>
                            <span className="text-white/30 mx-2">|</span>
                            <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Free</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Date</p>
                                <p className="text-white font-semibold text-lg">
                                    {getDateDay(paperDetail.date)} {getDateMonth(paperDetail.date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Time</p>
                                <p className="text-white font-semibold text-lg">
                                    {paperDetail.startTime && paperDetail.endTime
                                        ? `${paperDetail.startTime} – ${paperDetail.endTime}`
                                        : paperDetail.time || "TBA"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Venue</p>
                                <p className="text-white font-semibold text-lg">{paperDetail.hall || "TBA"}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Team Size</p>
                                <p className="text-white font-semibold text-lg">
                                    {paperDetail.teamSize} Member{paperDetail.teamSize !== "1" ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Duration row */}
                        {paperDetail.duration && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Duration</p>
                                <p className="text-white font-semibold text-lg">{paperDetail.duration} Hours</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Rules + Convenors */}
                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    {/* Left: Rules + Convenors */}
                    <div className="w-full lg:w-7/12 flex flex-col gap-8">
                        {/* Rules */}
                        {paperDetail.rules && paperDetail.rules.length > 0 && (
                            <div className="glass-card p-6 md:p-8">
                                <h3 className="special-font text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                                    <span className="w-1 h-8 rounded-full" style={{ background: accent.primary }} />
                                    <b>Rules</b>
                                </h3>
                                <div className="space-y-3">
                                    {paperDetail.rules
                                        .split("\n")
                                        .filter((line) => line.trim())
                                        .map((line, index) => {
                                            const isSubItem = line.trim().startsWith("*") || line.trim().startsWith("-");
                                            return (
                                                <p
                                                    key={index}
                                                    className={`text-sm md:text-base text-white/60 flex items-start ${isSubItem ? "ml-8" : ""}`}
                                                >
                                                    <span className="mr-2 mt-1 shrink-0" style={{ color: accent.primary }}>
                                                        {isSubItem ? "◦" : "•"}
                                                    </span>
                                                    <span>{line.trim().replace(/^\*\s*/, "").replace(/^-\s*/, "")}</span>
                                                </p>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Convenors */}
                        {paperDetail.contacts && paperDetail.contacts.length > 0 && (
                            <div className="glass-card p-6 md:p-8">
                                <h3 className="special-font text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                                    <span className="w-1 h-8 rounded-full" style={{ background: accent.primary }} />
                                    <b>Convenors</b>
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6 w-full">
                                    {paperDetail.contacts.map(
                                        (contact, index) =>
                                            contact && (
                                                <div key={index} className="flex items-center gap-4 group glass-card-light px-4 py-3">
                                                    <div
                                                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform text-white"
                                                        style={{ background: accent.primary }}
                                                    >
                                                        <IoMdCall />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-base uppercase leading-tight text-white">{toTitleCase(contact.name)}</p>
                                                        <p className="text-white/40 font-mono text-sm tracking-wide">{contact.mobile}</p>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>

                                {/* Email */}
                                {paperDetail.eventMail && (
                                    <div className="mt-4 flex items-center gap-3 text-white/40 text-sm">
                                        <SiGmail style={{ color: accent.primary }} />
                                        <a href={`mailto:${paperDetail.eventMail}`} className="hover:text-white/70 transition-colors">
                                            {paperDetail.eventMail}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Paper Image / Visual */}
                    <div className="w-full lg:w-5/12 flex flex-col gap-6">
                        <div className="glass-card overflow-hidden rounded-2xl h-[350px] lg:h-[420px] relative">
                            <Image
                                src={paperDetail.image && paperDetail.image.trim() !== "" ? paperDetail.image : `/eventdetails/${paperDetail.paperId}.jpg`}
                                fill
                                sizes="(max-width: 768px) 100vw, 40vw"
                                alt={paperDetail.eventName}
                                className="object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(180deg, transparent 40%, ${accent.primary}15 70%, #0a0a0a 100%)`,
                                }}
                            />
                            {/* Paper name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Paper Presentation</p>
                                <h3 className="special-font text-2xl md:text-3xl font-bold text-white uppercase">
                                    <b>{paperDetail.eventName}</b>
                                </h3>
                            </div>
                        </div>

                        {/* Deadline (if available) */}
                        {paperDetail.deadline && (
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">Submission Deadline</h3>
                                <p className="text-white font-semibold text-lg">{formatDate(paperDetail.deadline)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== Registration Modal ===== */}
            {isModalOpen && (
                <ConfirmationModal
                    onConfirm={handleRegister}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
