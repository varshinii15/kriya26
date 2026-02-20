"use client";
import { IoMdCall, IoLogoWhatsapp, IoMdArrowBack } from "react-icons/io";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import { useRouter, useParams } from "next/navigation";
import { isPreRegistrationEnabled, is_venue_available } from "@/settings/featureFlags";
import { useState, useEffect } from "react";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

const DEFAULT_YOUTUBE_URL = "https://youtu.be/jtAs-X8j_v4?si=ibyilg2MSt32OoJp";

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
    const [callbackUrl, setCallbackUrl] = useState("");
    const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

    const accent = PAPER_ACCENT;

    // Netflix-style video hero state
    const [videoPhase, setVideoPhase] = useState("poster"); // 'poster' | 'video'
    const [isMuted, setIsMuted] = useState(true);

    // Auto-transition poster → video after 3 s once paper loads
    useEffect(() => {
        if (!paperDetail) return;
        const t = setTimeout(() => setVideoPhase("video"), 3000);
        return () => clearTimeout(t);
    }, [paperDetail]);

    const toggleMute = () => setIsMuted((prev) => !prev);

    // Get video ID from any YouTube URL
    const getVideoId = () => {
        const url = paperDetail?.youtubeUrl || DEFAULT_YOUTUBE_URL;
        if (url.includes("/embed/")) {
            const match = url.match(/\/embed\/([^?&]+)/);
            return match ? match[1] : null;
        }
        const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return m ? m[1] : null;
    };

    // Build autoplay URL — key remount handles mute toggle cross-device
    const getAutoplayUrl = (muted = true) => {
        const vid = getVideoId();
        if (!vid) return "";
        return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&loop=1&playlist=${vid}&rel=0&modestbranding=1`;
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

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCallbackUrl(window.location.href);
        }
    }, []);

    const isRegisteredForPaper = () => {
        if (!user || !user.registeredPapers) return false;
        return user.registeredPapers.some(p => p.paperId === id);
    };

    const getMappedPaperDetail = () => {
        if (!paperDetail) return null;
        return {
            eventName: paperDetail.eventName,
            category: "Paper Presentation",
            custom_category: "Paper Presentation",
            closed: paperDetail.closed,
            timing: paperDetail.startTime && paperDetail.endTime
                ? `${paperDetail.startTime} - ${paperDetail.endTime}`
                : (paperDetail.time || "TBA"),
            hall: paperDetail.hall,
            teamSize: paperDetail.teamSize,
            description: paperDetail.description,
            eventRules: paperDetail.rules, // Map rules to eventRules expected by modal
            contacts: paperDetail.contacts || [],
            oneLineDescription: paperDetail.oneLineDescription || "",
        };
    };

    const handleRegister = async () => {
        if (!isAuthenticated) {
            const callbackUrl = encodeURIComponent(`/portal/paper/${id}`);
            router.push(`/auth?type=register&callbackUrl=${callbackUrl}`);
        } else if (!generalPayment) {
            router.push("/fee-payment");
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
            <div className="relative md:sticky md:top-0 mt-10 md:mt-0 z-40 w-full p-3 md:p-4 md:px-6 lg:px-8 backdrop-blur-xl bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
                <div className="flex items-center gap-4 w-full md:max-w-[50%]">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="Go back"
                    >
                        <IoMdArrowBack className="text-xl md:text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                    {!isPreRegistrationEnabled && (
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
                            {isRegisteredForPaper() ? "Registered" : paperDetail.closed ? "Closed" : "Register"}
                        </button>
                    )}

                    <button
                        className="flex-1 md:flex-none px-3 py-2 md:px-7 md:py-3 text-white font-bold uppercase tracking-wider text-[10px] md:text-sm border border-white/20 hover:bg-white/10 transition-all duration-300"
                        onClick={() => setIsLearnMoreOpen(true)}
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* ===== Main Content ===== */}
            <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-8 gap-10 relative z-10">

                {/* Hero Section: Name + Description | YouTube */}
                <div className="flex flex-col lg:flex-row w-full gap-8">
                    {/* Left: Paper Info — on mobile appears below the video */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">
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
                        <div className="text-base md:text-lg text-white/70 leading-relaxed mt-2 text-justify">
                            {paperDetail.theme?.split('\\n').map((line, i, arr) => (
                                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                            ))}
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

                    {/* Right: Netflix-style Video Hero — wrapper holds video box + mute button */}
                    <div className="w-full lg:w-1/2 h-[350px] md:h-[400px] lg:h-[480px] relative order-1 lg:order-2">

                        {/* Video clipping container — overflow-hidden ONLY contains poster + iframe */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">

                            {/* ── Layer 1: Poster (Kriya logo + gradient) ── */}
                            <div
                                className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000"
                                style={{
                                    opacity: videoPhase === "poster" ? 1 : 0,
                                    pointerEvents: videoPhase === "poster" ? "auto" : "none",
                                }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #111 60%, #0a0a0a 100%)" }}
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{ background: `radial-gradient(ellipse at 50% 40%, ${accent.primary}22 0%, transparent 65%)` }}
                                />
                                <div className="relative z-10 flex flex-col items-center gap-6 px-8">
                                    <Image
                                        src="/Logo/kriya26white.png"
                                        alt="Kriya 26"
                                        width={220}
                                        height={80}
                                        className="object-contain opacity-90"
                                        priority
                                    />
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                        style={{ background: accent.bg, color: accent.primary, border: `1px solid ${accent.primary}40` }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{ background: accent.primary }}
                                        />
                                        Paper Presentation — {paperDetail.eventName}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40 text-xs">
                                        <div className="w-4 h-[2px] rounded animate-pulse" style={{ background: accent.primary }} />
                                        <span className="uppercase tracking-widest font-mono">Preview loading…</span>
                                        <div className="w-4 h-[2px] rounded animate-pulse" style={{ background: accent.primary }} />
                                    </div>
                                </div>
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-24"
                                    style={{ background: "linear-gradient(to top, #000, transparent)" }}
                                />
                            </div>

                            {/* ── Layer 2: YouTube Autoplay iframe ── */}
                            <iframe
                                key={`yt-${isMuted}`}
                                className="absolute inset-0 w-full h-full transition-opacity duration-1000"
                                style={{ opacity: videoPhase === "video" ? 1 : 0, touchAction: "manipulation" }}
                                src={getAutoplayUrl(isMuted)}
                                title="Paper Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />

                            {/* ── Corner accent ── */}
                            <div
                                className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-10"
                                style={{ background: `linear-gradient(135deg, ${accent.primary}25 0%, transparent 60%)` }}
                            />
                        </div>


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
                                {paperDetail.closed ? "Registrations Closed" : (isPreRegistrationEnabled ? "Registration Not Yet Opened" : "Registration is Open Now")}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {is_venue_available && (
                                <div>
                                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Date</p>
                                    <p className="text-white font-semibold text-lg">
                                        {getDateDay(paperDetail.date)} {getDateMonth(paperDetail.date)}
                                    </p>
                                </div>
                            )}
                            {is_venue_available ? (
                                <>
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
                                </>
                            ) : (
                                <div className="col-span-2 md:col-span-3">
                                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Event Details</p>
                                    <p className="text-white font-semibold text-lg">Venue and Time will be announced soon</p>
                                </div>
                            )}
                            {is_venue_available && (
                                <div>
                                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Team Size</p>
                                    <p className="text-white font-semibold text-lg">
                                        {paperDetail.teamSize} Member{paperDetail.teamSize !== "1" ? "s" : ""}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Duration row */}
                        {is_venue_available && paperDetail.duration && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Duration</p>
                                <p className="text-white font-semibold text-lg">{paperDetail.duration} Hours</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Convenors */}
                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    {/* Left: Convenors */}
                    <div className="w-full flex flex-col gap-8">
                        {/* View Rules Button */}
                        <button
                            onClick={() => setIsLearnMoreOpen(true)}
                            className="w-full py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                            style={{
                                borderColor: `${accent.primary}40`,
                                background: `linear-gradient(90deg, ${accent.primary}10, transparent, ${accent.primary}10)`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="text-lg relative z-10" style={{ textShadow: `0 0 20px ${accent.primary}80` }}>View Rules</span>
                            <IoMdArrowBack className="group-hover:translate-x-1 transition-transform rotate-180 text-xl relative z-10" style={{ color: accent.primary }} />
                        </button>

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


                </div>
            </div>

            {/* ===== Learn More Modal ===== */}
            {isLearnMoreOpen && (
                <EventDetailsModal
                    eventDetail={getMappedPaperDetail()}
                    onClose={() => setIsLearnMoreOpen(false)}
                />
            )}

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
