"use client";
import { IoMdCall, IoLogoWhatsapp, IoMdArrowBack } from "react-icons/io";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";
import { isPreRegistrationEnabled, is_venue_available } from "@/settings/featureFlags";
import { useState, useRef, useEffect } from "react";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { SiGmail } from "react-icons/si";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

const DEFAULT_YOUTUBE_URL = "https://youtu.be/jtAs-X8j_v4?si=ibyilg2MSt32OoJp";

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
  const router = useRouter();
  const [generalPayment, setGeneralPayment] = useState(false);
  const [userEventDetails, setUserEventDetails] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [eventDetail, setEventDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);

  // Netflix-style video hero state
  const [videoPhase, setVideoPhase] = useState("poster"); // 'poster' | 'video'
  const [isMuted, setIsMuted] = useState(true);

  const accent = CATEGORY_ACCENTS[eventDetail?.category] || DEFAULT_ACCENT;

  // Extract YouTube video ID from any YouTube URL format
  const getVideoId = () => {
    const url = eventDetail?.youtubeUrl || DEFAULT_YOUTUBE_URL;
    if (url.includes("/embed/")) {
      const match = url.match(/\/embed\/([^?&]+)/);
      return match ? match[1] : null;
    }
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  // Build autoplay embed URL — toggling mute remounts the iframe via `key`
  const getAutoplayUrl = (muted = true) => {
    const vid = getVideoId();
    if (!vid) return "";
    const muteParam = muted ? "&mute=1" : "&mute=0";
    return `https://www.youtube.com/embed/${vid}?autoplay=1${muteParam}&controls=1&loop=1&playlist=${vid}&rel=0&modestbranding=1`;
  };

  // Auto-transition from poster to video after 3 s
  useEffect(() => {
    if (!eventDetail) return;
    const timer = setTimeout(() => setVideoPhase("video"), 3000);
    return () => clearTimeout(timer);
  }, [eventDetail]);

  // Toggle mute — changing key forces iframe remount with new mute param
  const toggleMute = () => setIsMuted((prev) => !prev);

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
      router.push(`/auth?type=login&callbackUrl=${callbackUrl}`);
    } else if (!generalPayment) {
      setIsPaymentOverlayOpen(true);
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
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          {!isPreRegistrationEnabled && (
            <button
              className="flex-1 md:flex-none px-3 py-2 md:px-7 md:py-3 font-bold uppercase tracking-wider text-[10px] md:text-sm transition-all duration-300 border"
              disabled={isRegisteredForEvent() || eventDetail.closed}
              onClick={() => setIsModalOpen(true)}
              style={{
                background: isRegisteredForEvent() ? accent.primary : "transparent",
                color: isRegisteredForEvent() ? "#0a0a0a" : "white",
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

        {/* Hero Section: Name + Description | Video */}
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {/* Left: Event Info — on mobile appears below the video */}
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
              {eventDetail.category} Event
            </div>

            {/* Event Name */}
            <h1 className="special-font text-3xl md:text-6xl lg:text-7xl font-black font-poppins text-white leading-none uppercase tracking-wider">
              <b>{eventDetail.eventName}</b>
            </h1>

            {/* Description */}
            <div className="text-base md:text-lg text-white/70 leading-relaxed mt-2 text-justify">
              {eventDetail.description?.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
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

          {/* Right: Netflix-style Video Hero — wrapper holds both video box and mute button */}
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
                {/* Dark cinematic background */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #111 60%, #0a0a0a 100%)" }}
                />
                {/* Subtle category-colored glow */}
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 50% 40%, ${accent.primary}22 0%, transparent 65%)` }}
                />
                {/* Kriya logo + event info */}
                <div className="relative z-10 flex flex-col items-center gap-6 px-8">
                  <Image
                    src="/Logo/kriya.png"
                    alt="Kriya 26"
                    width={220}
                    height={80}
                    className="object-contain opacity-90"
                    priority
                  />
                  {/* Category + event name badge */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    style={{ background: accent.bg, color: accent.primary, border: `1px solid ${accent.primary}40` }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: accent.primary }}
                    />
                    {eventDetail.category} — {eventDetail.eventName}
                  </div>
                  {/* Loading hint */}
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <div
                      className="w-4 h-[2px] rounded animate-pulse"
                      style={{ background: accent.primary }}
                    />
                    <span className="uppercase tracking-widest font-mono">Preview loading…</span>
                    <div
                      className="w-4 h-[2px] rounded animate-pulse"
                      style={{ background: accent.primary }}
                    />
                  </div>
                </div>
                {/* Bottom gradient fade into video */}
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
                title="Event Video"
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
                {eventDetail.closed ? "Registrations Closed" : (isPreRegistrationEnabled ? "Registration Not Yet Opened" : "Registration is Open Now")}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {is_venue_available ? (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Timing</p>
                    <p className="text-white font-semibold text-lg">{eventDetail.timing || "TBA"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Venue</p>
                    <p className="text-white font-semibold text-lg">{eventDetail.hall || "TBA"}</p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 md:col-span-2">
                  <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Event Details</p>
                  <p className="text-white font-semibold text-lg">Venue and Time will be announced soon</p>
                </div>
              )}
              {is_venue_available && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Team Size</p>
                  <p className="text-white font-semibold text-lg">
                    {eventDetail.teamSize} Member{eventDetail.teamSize !== "1" ? "s" : ""}
                  </p>
                </div>
              )}
              {is_venue_available && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Date</p>
                  <p className="text-white font-semibold text-lg">
                    {eventDetail.date ? new Date(eventDetail.date).getDate() : "TBA"} March
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Convenors */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left: Convenors */}
          <div className="w-full flex flex-col gap-8">
            {/* View Rules & Rounds Button */}
            <button
              onClick={() => setIsLearnMoreOpen(true)}
              className="w-full py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
              style={{
                borderColor: `${accent.primary}40`,
                background: `linear-gradient(90deg, ${accent.primary}10, transparent, ${accent.primary}10)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="text-lg relative z-10" style={{ textShadow: `0 0 20px ${accent.primary}80` }}>View Rules &amp; Rounds</span>
              <IoMdArrowBack className="group-hover:translate-x-1 transition-transform rotate-180 text-xl relative z-10" style={{ color: accent.primary }} />
            </button>

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

      {/* ===== Payment Required Overlay ===== */}
      {isPaymentOverlayOpen && (
        <div className="absolute inset-0 top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
          <div className="flex-col items-center justify-center p-6 text-black bg-white rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold">General Payment Required</h2>
            <p className="mt-2 text-sm">You need to complete the general fee payment before registering for events.</p>
            <div className="flex mt-4 space-x-3">
              <button
                className="px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setIsPaymentOverlayOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
                onClick={() => router.push('/fee-payment')}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
