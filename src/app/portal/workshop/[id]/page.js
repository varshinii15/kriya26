"use client";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getWhatsAppLink } from "@/data/whatsappLinks";

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

export default function WorkshopPage({ params }) {
  const { id } = useParams(params);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const router = useRouter();
  const [generalPayment, setGeneralPayment] = useState(false);
  const [userWorkshopDetails, setUserWorkshopDetails] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [workshopDetail, setWorkshopDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set general payment status from auth context
  useEffect(() => {
    if (user) {
      setGeneralPayment(user.generalFeePaid || user.isPaid || false);
    }
  }, [user]);

  // Fetch user's registered workshops
  useEffect(() => {
    if (isAuthenticated) {
      setRegistrationLoading(true);
      eventService.getUserWorkshops().then((res) => {
        let workshopData = [];
        if (Array.isArray(res)) {
          workshopData = res;
        } else if (res?.workshops && Array.isArray(res.workshops)) {
          workshopData = res.workshops;
        } else if (res?.data && Array.isArray(res.data)) {
          workshopData = res.data;
        }
        console.log('User workshops loaded:', workshopData.map(w => w.workshopId || w._id));
        setUserWorkshopDetails(workshopData);
      }).catch(err => console.error("Error fetching user workshops:", err))
        .finally(() => setRegistrationLoading(false));
    } else {
      setRegistrationLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await eventService.getWorkshopById(id);
        const workshopData = res1?.workshop || res1;
        console.log(workshopData);
        setWorkshopDetail(workshopData);
      } catch (error) {
        console.error("Error fetching workshop details:", error);
      }
    };

    fetchData();
  }, [id]);

  // Helper to check if user is registered for current workshop
  const isRegisteredForWorkshop = () => {
    if (!userWorkshopDetails || !Array.isArray(userWorkshopDetails)) return false;
    const registered = userWorkshopDetails.some((w) =>
      w.workshopId === id || w.workshop_id === id || w._id === id
    );
    console.log('Checking registration for workshop:', id, 'User workshops:', userWorkshopDetails.map(w => w.workshopId || w._id), 'Registered:', registered);
    return registered;
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(`/portal/workshop/${id}`);
      router.push(`/auth?type=register&callbackUrl=${callbackUrl}`);
    } else if (!generalPayment) {
      router.push("/auth/payment?type=GENERAL");
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return !workshopDetail ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg font-semibold text-gray-600 animate-pulse">
        Loading workshop...
      </p>
    </div>
  ) : (
    <div
      className="w-full min-h-screen mt-10 flex flex-col overflow-y-auto bg-gray-200 z-20 relative lg:mt-0"
    >
      <div
        className="sticky top-0 z-20 w-full p-4 mt-2 md:px-6 lg:px-8 lg:mt-0 backdrop-blur-2xl flex items-center justify-between"
      >
        <h1 className="special-font text-2xl md:text-5xl font-bold text-black font-poppins truncate max-w-[50%]">
          <b>{workshopDetail.workshopName}</b>
        </h1>

        <div className="flex items-center gap-4">
          <button
            className="px-7 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs md:text-base hover:bg-white hover:text-black border-2 border-black transition-all duration-300 w-fit shadow-lgr"
            disabled={isRegisteredForWorkshop() || workshopDetail.closed}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {userWorkshopDetails && (
              <>
                {isRegisteredForWorkshop() ? (
                  "Registered"
                ) : workshopDetail.closed ? (
                  "Registrations Closed"
                ) : (
                  "Register"
                )}
              </>
            )}

            {!userWorkshopDetails && <>{workshopDetail.closed ? (
              "Registrations Closed"
            ) : (
              "Register"
            )}</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-6 gap-8">
        {/* Top Section: Workshop Name, Club, Description */}
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {/* Left: Workshop Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Workshop Name */}
            <div className="flex flex-col gap-2">
              <h1 className="special-font text-4xl md:text-6xl lg:text-7xl font-black font-poppins text-black leading-none uppercase tracking-wider">
                <b>{workshopDetail.workshopName}</b>
              </h1>
              {workshopDetail.clubName && (
                <p className="special-font text-xl md:text-3xl font-bold text-blue-600 uppercase tracking-widest">
                  <b>{workshopDetail.clubName}</b>
                </p>
              )}
            </div>

            {/* Workshop Description */}
            <div className="mt-4">
              <div className="text-base md:text-lg text-gray-800 leading-relaxed">
                {workshopDetail.description}
              </div>
            </div>

            {/* WhatsApp Button - Only show if user is registered */}
            {isRegisteredForWorkshop() && (
              <div className="mt-4">
                <a
                  href={getWhatsAppLink(id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 md:px-10 md:py-3 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs md:text-base hover:bg-[#20BA5A] border-2 border-[#25D366] transition-all duration-300 w-fit shadow-lg"
                >
                  <IoLogoWhatsapp className="text-lg md:text-xl" />
                  WhatsApp Group
                </a>
              </div>
            )}
          </div>

          {/* Right: Workshop Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden relative shadow-lg flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image
                src={`/img/workshops/${workshopDetail.workshopId?.toLowerCase() || 'ws1'}.png`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={workshopDetail.workshopName}
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = '/img/workshops/ws1.png';
                }}
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 px-5">
          <div className="w-full">
            {/* Logistics - Mobile Only */}
            <div className="w-full flex lg:hidden flex-col justify-center gap-6 p-2 mt-8">
              <div className="flex special-font items-center gap-4 text-3xl md:text-6xl font-bold uppercase tracking-wider mb-2">
                <h1><b>{workshopDetail.closed ? "Closed" : "Live"}</b></h1>
                <span className="w-2 h-2 bg-black rounded-full mx-2 animate-pulse"></span>
                {workshopDetail.amount && (
                  <h1><b>₹{workshopDetail.amount}</b></h1>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Date</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">{formatDate(workshopDetail.date)}</p>
                </div>

                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Time</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">{workshopDetail.time || "TBA"}</p>
                </div>

                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Venue</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">{workshopDetail.hall || "TBA"}</p>
                </div>

                {workshopDetail.amount && (
                  <div>
                    <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Fee</b></p>
                    <p className="text-xl md:text-xl font-bold text-black">₹{workshopDetail.amount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Convenors Section */}
            {workshopDetail.contacts && workshopDetail.contacts.length > 0 && (
              <div className="flex flex-col items-start mt-10 mb-8">
                <h3 className="text-3xl md:text-3xl special-font font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6"><b>Convenors</b></h3>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full">
                  {workshopDetail.contacts.map((contact, index) => (
                    contact && (
                      <div key={index} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 shrink-0 bg-black text-white rounded-full flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
                          <IoMdCall />
                        </div>
                        <div>
                          <p className="font-bold text-lg uppercase leading-tight">{toTitleCase(contact.name)}</p>
                          <p className="text-gray-600 font-mono text-sm tracking-wide">{contact.mobile}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Logistics - Desktop Only */}
          <div className="hidden lg:flex w-full lg:w-5/12 flex-col justify-center gap-6 p-2">
            <div className="flex special-font items-center gap-4 text-3xl md:text-6xl font-bold uppercase tracking-wider mb-2">
              <h1><b>{workshopDetail.closed ? "Closed" : "Live"}</b></h1>
              <span className="w-2 h-2 bg-black rounded-full mx-2 animate-pulse"></span>
              {workshopDetail.amount && (
                <h1><b>₹{workshopDetail.amount}</b></h1>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Date</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">{formatDate(workshopDetail.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Time</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">{workshopDetail.time || "TBA"}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Venue</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">{workshopDetail.hall || "TBA"}</p>
                </div>
              </div>

              {workshopDetail.amount && (
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Fee</b></p>
                    <p className="text-lg md:text-xl font-bold text-black">₹{workshopDetail.amount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ConfirmationModal
          onConfirm={handleRegister}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
