"use client";
import { IoMdCall, IoLogoWhatsapp, IoMdArrowBack } from "react-icons/io";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect, use } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { SiGmail } from "react-icons/si";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=YeFJPRFhmCM";

// Category accent colors for the dark theme
const CATEGORY_ACCENTS = {
  Gold: { primary: "#D9972B", secondary: "#F2CC3E", bg: "rgba(217,151,43,0.12)" },
  Platinum: { primary: "#C0C0C0", secondary: "#E8E8E8", bg: "rgba(192,192,192,0.10)" },
  Quiz: { primary: "#98D0FF", secondary: "#5724ff", bg: "rgba(87,36,255,0.10)" },
  "Core Engineering": { primary: "#F34F44", secondary: "#FF7B73", bg: "rgba(243,79,68,0.10)" },
  Coding: { primary: "#3AC49C", secondary: "#50E3B9", bg: "rgba(58,196,156,0.10)" },
  Bot: { primary: "#3AC49C", secondary: "#FF6B8A", bg: "rgba(251,225,228,0.08)" },
  "Fashion and Textile": { primary: "#B48EEB", secondary: "#DCA2D2", bg: "rgba(180,142,235,0.10)" },
  Science: { primary: "#B0E369", secondary: "#7BC74D", bg: "rgba(176,227,105,0.10)" },
  Technology: { primary: "#B0E369", secondary: "#7BC74D", bg: "rgba(176,227,105,0.10)" },
  "Science and Technology": { primary: "#B0E369", secondary: "#7BC74D", bg: "rgba(176,227,105,0.10)" },
};

const DEFAULT_ACCENT = { primary: "#5724ff", secondary: "#8B5CF6", bg: "rgba(87,36,255,0.10)" };

const toTitleCase = (phrase) => {
  const wordsToIgnore = ["of", "in", "for", "and", "an", "or"];
  const wordsToCapitalize = ["it", "cad"];

  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (wordsToIgnore.includes(word)) {
        return word;
      }
      if (wordsToCapitalize.includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default function Home({ params }) {
  const { id } = useParams(params);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [showDetails, setShowDetails] = useState(false);
  const geeksForGeeksRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const [generalPayment, setGeneralPayment] = useState(false);
  const [userEventDetails, setUserEventDetails] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [eventDetail, setEventDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check for tutorial in localStorage
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("kriya_video_tutorial_seen");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem("kriya_video_tutorial_seen", "true");
    setShowTutorial(false);
  };

  const accent = CATEGORY_ACCENTS[eventDetail?.category] || DEFAULT_ACCENT;

  // Get YouTube URL - use default if database value is empty
  const getYouTubeUrl = () => {
    const url = eventDetail?.youtubeUrl || DEFAULT_YOUTUBE_URL;
    if (url.includes('/embed/')) return url;
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  useEffect(() => {
    if (user) {
      setGeneralPayment(user.generalFeePaid || user.isPaid || false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      setRegistrationLoading(true);
      eventService.getUserEvents().then((res) => {
        let eventData = [];
        if (Array.isArray(res)) {
          eventData = res;
        } else if (res?.events && Array.isArray(res.events)) {
          eventData = res.events;
        } else if (res?.data && Array.isArray(res.data)) {
          eventData = res.data;
        }
        setUserEventDetails(eventData);
      }).catch(err => console.error("Error fetching user events:", err))
        .finally(() => setRegistrationLoading(false));
    } else {
      setRegistrationLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await eventService.getEventById(id);
        const eventData = res1?.event;
        setEventDetail(eventData);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchData();
  }, [id]);

  const isRegisteredForEvent = () => {
    if (!userEventDetails || !Array.isArray(userEventDetails)) return false;
    return userEventDetails.some((e) =>
      e.eventId === id || e.event_id === id || e._id === id
    );
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(`/portal/event/${id}`);
      router.push(`/auth?type=register&callbackUrl=${callbackUrl}`);
    } else if (!generalPayment) {
      router.push("/auth/payment?type=GENERAL");
    } else {
      try {
        await eventService.registerEvent(id);
        window.location.reload();
      } catch (error) {
        console.error("Error registering for event:", error);
        alert("Failed to register for event. Please try again.");
      }
    }
  };

  return !eventDetail ? (
    <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
      <p className="text-lg font-semibold text-white/60 animate-pulse">
        Loading event...
      </p>
    </div>
  ) : (
    <div className="w-full min-h-screen flex flex-col overflow-y-auto bg-[#0a0a0a] z-20 relative lg:mt-0">

      {/* ===== Background Effects ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating gradient orbs — colored by category */}
        <div
          className="event-bg-orb event-bg-orb-1"
          style={{ background: accent.primary }}
        />
        <div
          className="event-bg-orb event-bg-orb-2"
          style={{ background: accent.secondary }}
        />
        <div
          className="event-bg-orb event-bg-orb-3"
          style={{ background: accent.primary, opacity: 0.15 }}
        />
        {/* Dot grid */}
        <div className="dot-grid-overlay" />
        {/* Noise texture */}
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
            <b>{eventDetail.eventName}</b>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <button
            className="flex-1 md:flex-none px-3 py-2 md:px-7 md:py-3 font-bold uppercase tracking-wider text-[10px] md:text-sm transition-all duration-300 border"
            disabled={isRegisteredForEvent() || eventDetail.closed}
            onClick={() => setIsModalOpen(true)}
            style={{
              background: isRegisteredForEvent() ? accent.primary : 'transparent',
              color: isRegisteredForEvent() ? '#0a0a0a' : 'white',
              borderColor: accent.primary,
            }}
          >
            {userEventDetails && (
              <>
                {isRegisteredForEvent() ? "Registered" : eventDetail.closed ? "Closed" : "Register"}
              </>
            )}
            {!userEventDetails && <>{eventDetail.closed ? "Closed" : "Register"}</>}
          </button>

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
          {/* Left: Event Info */}
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
              {eventDetail.category} Event
            </div>

            {/* Event Name */}
            <h1 className="special-font text-3xl md:text-6xl lg:text-7xl font-black font-poppins text-white leading-none uppercase tracking-wider">
              <b>{eventDetail.eventName}</b>
            </h1>

            {/* Description */}
            <div className="text-base md:text-lg text-white/70 leading-relaxed mt-2">
              {eventDetail.description}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              {/* WhatsApp Button - Only show if user is registered */}
              {isRegisteredForEvent() && (
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
            </div>
          </div>

          {/* Right: YouTube Embed */}
          <div className="w-full lg:w-1/2 h-[350px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center border border-white/10">
            <iframe
              className="w-full h-full"
              src={getYouTubeUrl()}
              title="Event Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Corner accent */}
            <div
              className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${accent.primary}20 0%, transparent 60%)`,
              }}
            />
            {/* ===== Tutorial Overlay (Subtle Tooltip) ===== */}
            {showTutorial && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <style>{`
                  @keyframes subtle-bounce-x {
                    0%, 100% { transform: translateX(130px); }
                    50% { transform: translateX(120px); }
                  }
                  @keyframes subtle-bounce-y {
                    0%, 100% { transform: translateY(70px); }
                    50% { transform: translateY(80px); }
                  }
                  .tutorial-card-animation {
                    animation: subtle-bounce-x 2s ease-in-out infinite;
                  }
                  @media (max-width: 768px) {
                    .tutorial-card-animation {
                      animation: subtle-bounce-y 2s ease-in-out infinite;
                    }
                  }
                `}</style>
                <div
                  className="relative pointer-events-auto bg-black/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] w-[160px] flex flex-col items-center gap-2 tutorial-card-animation"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">Watch Video Detail!</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTutorial();
                    }}
                    className="w-full py-1.5 px-3 text-black text-[9px] font-black uppercase rounded-sm transition-transform active:scale-95 shadow-lg"
                    style={{ backgroundColor: accent.primary }}
                  >
                    Got it
                  </button>

                  {/* Desktop Pointer: Side "<" */}
                  <div
                    className="hidden md:block absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px]"
                    style={{ borderRightColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                  <div
                    className="hidden md:block absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-black/95"
                  />

                  {/* Mobile Pointer: Top "^" pointing up to logo */}
                  <div
                    className="md:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px]"
                    style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                  <div
                    className="md:hidden absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-black/95"
                  />
                </div>
              </div>
            )}
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
                {eventDetail.closed ? "Registrations Closed" : "Live Now"}
              </span>
              <span className="text-white/30 mx-2">|</span>
              <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Free</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Timing</p>
                <p className="text-white font-semibold text-lg">{eventDetail.timing || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Venue</p>
                <p className="text-white font-semibold text-lg">{eventDetail.hall || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Team Size</p>
                <p className="text-white font-semibold text-lg">
                  {eventDetail.teamSize} Member{eventDetail.teamSize !== "1" ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Date</p>
                <p className="text-white font-semibold text-lg">
                  {eventDetail.date ? new Date(eventDetail.date).getDate() : "TBA"} March
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Rounds + Convenors */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left: Rounds + Convenors */}
          <div className="w-full lg:w-7/12 flex flex-col gap-8">
            {/* Round Details */}
            {eventDetail.rounds && eventDetail.rounds.length > 0 && (
              <div className="glass-card p-6 md:p-8">
                <h3 className="special-font text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 rounded-full" style={{ background: accent.primary }} />
                  <b>Round Details</b>
                </h3>
                <div className="space-y-8">
                  {eventDetail.rounds.map((round, index) => {
                    const roundNumber = index + 1;
                    return round ? (
                      <div key={roundNumber} className="w-full">
                        <div className="flex items-center mb-4 gap-4">
                          <span className="text-4xl md:text-5xl font-black" style={{ color: accent.primary, opacity: 0.6 }}>
                            {String(roundNumber).padStart(2, "0")}
                          </span>
                          <div>
                            <h5 className="font-bold text-base md:text-lg text-white uppercase tracking-wide">
                              Round {roundNumber}
                            </h5>
                            <p className="text-white/50 font-semibold text-sm">{round.title}</p>
                          </div>
                        </div>
                        <div className="ml-16 md:ml-20 border-l border-white/10 pl-4">
                          {round.description
                            .replace(/\r\n/g, "\n\r")
                            .split("\n")
                            .map((line, idx) => (
                              <p key={idx} className={`text-sm md:text-base text-white/60 flex items-start mb-1.5 ${line.startsWith("\r") ? "ml-4" : ""}`}>
                                <span className="mr-2 mt-1" style={{ color: accent.primary }}>
                                  •
                                </span>
                                {line.trim()}
                              </p>
                            ))}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Convenors */}
            {eventDetail.contacts && eventDetail.contacts.length > 0 && (
              <div className="glass-card p-6 md:p-8">
                <h3 className="special-font text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 rounded-full" style={{ background: accent.primary }} />
                  <b>Convenors</b>
                </h3>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  {eventDetail.contacts.map(
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
              </div>
            )}
          </div>

          {/* Right: Event Image / Visual */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            <div className="glass-card overflow-hidden rounded-2xl h-[350px] lg:h-[420px] relative">
              <Image
                src={`/eventdetails/${eventDetail.eventId}.jpg`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                alt={eventDetail.eventName}
                className="object-cover opacity-80 hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, ${accent.primary}15 70%, #0a0a0a 100%)`,
                }}
              />
              {/* Event name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">{eventDetail.category}</p>
                <h3 className="special-font text-2xl md:text-3xl font-bold text-white uppercase">
                  <b>{eventDetail.eventName}</b>
                </h3>
              </div>
            </div>

            {/* Rules Summary (if available) */}
            {eventDetail.eventRules && eventDetail.eventRules.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Rules</h3>
                <div className="text-white/50 text-sm space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
                  {eventDetail.eventRules
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line, index) => (
                      <p
                        key={index}
                        className={
                          line.includes("RULES:")
                            ? "mt-3 font-bold text-white/70"
                            : line.startsWith("->")
                              ? "ml-4"
                              : ""
                        }
                      >
                        {line.startsWith("->") ? line.substring(2) : line}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Learn More Modal ===== */}
      {isLearnMoreOpen && (
        <EventDetailsModal
          eventDetail={eventDetail}
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
