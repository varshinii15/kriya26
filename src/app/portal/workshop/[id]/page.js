"use client";
import { IoMdCall, IoLogoWhatsapp, IoMdArrowBack } from "react-icons/io";
import { useRouter, useParams } from "next/navigation";
import { isPreRegistrationEnabled, is_venue_available } from "@/settings/featureFlags";
import { useState, useRef, useEffect } from "react";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

// Default accent for workshops - Blue to match landing page
const WORKSHOP_ACCENT = { primary: "#60A5FA", secondary: "#3B82F6", bg: "rgba(96, 165, 250, 0.10)" };

const toTitleCase = (phrase) => {
  if (!phrase) return "";
  const wordsToIgnore = ["of", "in", "for", "and", "an", "or"];
  const wordsToCapitalize = ["it", "cad", "psg"];

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

export default function WorkshopPage({ params }) {
  const { id } = useParams(params);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [generalPayment, setGeneralPayment] = useState(false);
  const [userWorkshopDetails, setUserWorkshopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workshopDetail, setWorkshopDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  // Use purple accent for all workshops for now
  const accent = WORKSHOP_ACCENT;

  useEffect(() => {
    if (user) {
      setGeneralPayment(user.generalFeePaid || user.isPaid || false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      eventService.getUserWorkshops().then((res) => {
        let workshopData = [];
        if (Array.isArray(res)) {
          workshopData = res;
        } else if (res?.workshops && Array.isArray(res.workshops)) {
          workshopData = res.workshops;
        } else if (res?.data && Array.isArray(res.data)) {
          workshopData = res.data;
        }
        setUserWorkshopDetails(workshopData);
      }).catch(err => console.error("Error fetching user workshops:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await eventService.getWorkshopById(id);
        const workshopData = res1?.workshop || res1;
        setWorkshopDetail(workshopData);
      } catch (error) {
        console.error("Error fetching workshop details:", error);
      }
    };
    fetchData();
  }, [id]);

  const isRegisteredForWorkshop = () => {
    if (!userWorkshopDetails || !Array.isArray(userWorkshopDetails)) return false;
    return userWorkshopDetails.some((w) =>
      w.workshopId === id || w.workshop_id === id || w._id === id
    );
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(`/portal/workshop/${id}`);
      router.push(`/auth?type=register&callbackUrl=${callbackUrl}`);
    } else if (!generalPayment) {
      router.push("/fee-payment");
    } else {
      try {
        await eventService.registerWorkshop(id);
        window.location.reload();
      } catch (error) {
        console.error("Error registering for workshop:", error);
        alert("Failed to register for workshop. Please try again.");
      }
    }
  };

  const getMappedEventDetail = () => {
    if (!workshopDetail) return null;
    return {
      eventName: workshopDetail.workshopName,
      category: workshopDetail.clubName || "Workshop",
      custom_category: "Workshop",
      closed: workshopDetail.closed,
      timing: workshopDetail.startTime && workshopDetail.endTime ? `${workshopDetail.startTime} - ${workshopDetail.endTime}` : workshopDetail.time,
      hall: workshopDetail.hall,
      teamSize: "Individual", // Default for workshops
      description: workshopDetail.description,
      contacts: workshopDetail.contacts || [],
      agenda: workshopDetail.agenda || [],
      prerequisites: workshopDetail.prerequisites || null,
      // Map other fields if needed for the modal
    };
  };

  return !workshopDetail ? (
    <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
      <p className="text-lg font-semibold text-white/60 animate-pulse">
        Loading workshop...
      </p>
    </div>
  ) : (
    <div className="w-full min-h-screen flex flex-col overflow-y-auto bg-[#0a0a0a] z-20 relative lg:mt-0">

      {/* ===== Background Effects ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
              disabled={isRegisteredForWorkshop() || workshopDetail.closed}
              onClick={() => setIsModalOpen(true)}
              style={{
                background: isRegisteredForWorkshop() ? accent.primary : 'transparent',
                color: isRegisteredForWorkshop() ? '#0a0a0a' : 'white',
                borderColor: accent.primary,
              }}
            >
              {userWorkshopDetails && (
                <>
                  {isRegisteredForWorkshop() ? "Registered" : workshopDetail.closed ? "Closed" : "Register"}
                </>
              )}
              {!userWorkshopDetails && <>{workshopDetail.closed ? "Closed" : "Register"}</>}
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
      <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-8 gap-6 relative z-10">

        {/* Hero Section: Name + Description */}
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {/* Left: Workshop Info */}
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
              {workshopDetail.clubName || "Workshop"}
            </div>

            {/* Workshop Name */}
            <h1 className="special-font text-3xl md:text-5xl lg:text-6xl font-black font-poppins text-white leading-none uppercase tracking-wider">
              <b>{workshopDetail.workshopName}</b>
            </h1>

            {/* Description */}
            <div className="text-base md:text-lg text-white/70 leading-relaxed mt-2 whitespace-pre-wrap text-justify">
              {workshopDetail.description}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              {/* WhatsApp Button - Only show if user is registered */}
              {isRegisteredForWorkshop() && (
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

          {/* Right: Workshop Image */}
          <div className="w-full lg:w-1/2 h-[350px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center border border-white/10 bg-[#111]">
            <Image
              src={`/img/workshops/ws${parseInt(workshopDetail.workshopId?.replace(/\D/g, '') || '1')}.png`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={workshopDetail.workshopName}
              className="object-cover opacity-80 hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = '/img/workshops/ws1.png';
              }}
            />
            {/* Corner accent */}
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
                {workshopDetail.closed ? "Registrations Closed" : (isPreRegistrationEnabled ? "Registration Not Yet Opened" : "Registration is Open Now")}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {is_venue_available ? (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Timing</p>
                    <p className="text-white font-semibold text-lg">{workshopDetail.startTime && workshopDetail.endTime ? `${workshopDetail.startTime} - ${workshopDetail.endTime}` : (workshopDetail.time || "TBA")}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Venue</p>
                    <p className="text-white font-semibold text-lg">{workshopDetail.hall || "TBA"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Date</p>
                    <p className="text-white font-semibold text-lg">
                      {workshopDetail.date ? new Date(workshopDetail.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 md:col-span-4">
                  <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Workshop Details</p>
                  <p className="text-white font-semibold text-lg">Venue and Time will be announced soon</p>
                </div>
              )}
            </div>
            {is_venue_available && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1.5 font-bold" style={{ color: accent.primary }}>Fee</p>
                <p className="text-white font-semibold text-lg">
                  {workshopDetail.actualFee ? `₹${workshopDetail.actualFee}` : "Free"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* View Agenda & Details Button - Full Width */}
        <button
          onClick={() => setIsLearnMoreOpen(true)}
          className="w-full py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
          style={{
            borderColor: `${accent.primary}40`,
            background: `linear-gradient(90deg, ${accent.primary}10, transparent, ${accent.primary}10)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="text-lg relative z-10" style={{ textShadow: `0 0 20px ${accent.primary}80` }}>View Agenda & Details</span>
          <IoMdArrowBack className="group-hover:translate-x-1 transition-transform rotate-180 text-xl relative z-10" style={{ color: accent.primary }} />
        </button>

        {/* Bottom Section: Convenors */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left: Convenors */}
          <div className="w-full lg:w-7/12 flex flex-col gap-8">


            {workshopDetail.contacts && workshopDetail.contacts.length > 0 && (
              <div className="glass-card p-6 md:p-8">
                <h3 className="special-font text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 rounded-full" style={{ background: accent.primary }} />
                  <b>Convenors</b>
                </h3>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  {workshopDetail.contacts.map(
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
      {
        isLearnMoreOpen && (
          <EventDetailsModal
            eventDetail={getMappedEventDetail()}
            onClose={() => setIsLearnMoreOpen(false)}
          />
        )
      }

      {/* ===== Registration Modal ===== */}
      {
        isModalOpen && (
          <ConfirmationModal
            onConfirm={handleRegister}
            onCancel={() => setIsModalOpen(false)}
          />
        )
      }
    </div >
  );
}
