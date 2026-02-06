"use client";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect, use } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { SiGmail } from "react-icons/si";
import EventDetailsModal from "@/components/EventDetailsModal";

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
  const { id } = useParams(params); // Unwrap the Promise in Next.js 16

  const [showDetails, setShowDetails] = useState(false);
  const geeksForGeeksRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generalPayment, setGeneralPayment] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userEventDetails, setUserEventDetails] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const mail = "events.kriya@psgtech.ac.in";

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      eventService.getUserByEmail(email).then((res) => {
        const userData = res?.data?.user || res?.user || res;
        setUserDetails(userData);
        setIsLoggedIn(true);
        setGeneralPayment(userData.isPaid);
      }).catch(err => console.error("Error fetching user:", err));
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      eventService.getEventDetailsByEmail(email).then((res) => {
        const eventData = res?.data || res;
        setUserEventDetails(eventData);
      }).catch(err => console.error("Error fetching user events:", err));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await eventService.getEventById(id);
        const eventData = res1?.event
        console.log(eventData)
        setEventDetail(eventData);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (showDetails && geeksForGeeksRef.current) {
      geeksForGeeksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDetails]);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };
  const handleRegister = async () => {
    if (!isLoggedIn) {
      router.push("/auth?type=signup");
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

  useEffect(() => {
    if (showDetails) {
      const targetDiv = document.getElementById("info");
      if (targetDiv) {
        targetDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [showDetails]);

  return !eventDetail ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg font-semibold text-gray-600 animate-pulse">
        Loading event...
      </p>
    </div>
  ) : (
    <div
      className={`w-full min-h-screen mt-10 flex flex-col overflow-y-auto ${eventDetail.category === "Gold"
        ? "bg-[#FAF8C8]"
        : eventDetail.category === "Platinum"
          ? "bg-[#d1c5bc]"
          : eventDetail.category === "Quiz"
            ? "bg-[#eadffd]"
            : eventDetail.category === "Core Engineering"
              ? "bg-[#D7FFFF]"
              : eventDetail.category === "Coding"
                ? "bg-[#FFE2C2]"
                : eventDetail.category === "Bot"
                  ? "bg-[#FBE1E4]"
                  : eventDetail.category === "Fashion and Textile"
                    ? "bg-[#DCA2D2]"
                    : eventDetail.category === "Science" ||
                      eventDetail.category === "Technology"
                      ? "bg-[#E3FCE9]"
                      : "bg-gray-200"
        } z-20 relative lg:mt-0`}
    >
      <div
        className="sticky top-0 z-20 w-full p-4 mt-2 md:px-6 lg:px-8 lg:mt-0 backdrop-blur-2xl flex items-center justify-between"
      >
        <h1 className="special-font text-2xl md:text-5xl font-bold text-black font-poppins truncate max-w-[50%]">
          <b>{eventDetail.eventName}</b>
        </h1>

        <div className="flex items-center gap-4 ">
          <button
            className="px-7 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs md:text-base hover:bg-white hover:text-black border-2 border-black transition-all duration-300 w-fit shadow-lgr"
            disabled={
              (userEventDetails &&
                userEventDetails.find((i) => i.eventId === id)) ||
              eventDetail.closed
            }
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {userEventDetails && (
              <>
                {userEventDetails.find((i) => i.eventId === id) ? (
                  "Registered"
                ) : eventDetail.closed ? (
                  "Registrations Closed"
                ) : (
                  "Register"
                )}
              </>
            )}

            {!userEventDetails && <>{eventDetail.closed ? (
              "Registrations Closed"
            ) : (
              "Register"
            )}</>}
          </button>

          {eventDetail.youtubeUrl && (
            <button
              className="px-7 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs md:text-base hover:bg-white hover:text-black border-2 border-black transition-all duration-300 w-fit shadow-lgr"
              onClick={() => setShowVideo(true)}
            >
              OVERVIEW
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full px-4 md:px-8 py-6 gap-8">
        <div className="flex flex-col justify-center lg:flex-row w-full gap-8 lg:h-[50vh]">
          {/* Left: Video Placeholder */}
          <div className="w-full lg:w-7/12 h-full min-h-[300px] bg-gray-100 rounded-xl overflow-hidden relative shadow-lg flex items-center justify-center">
            {eventDetail.youtubeUrl ? (
              <iframe
                className="w-full h-full"
                src={eventDetail.youtubeUrl}
                title="Event Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={`/eventdetails/${eventDetail.eventId}.jpg`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  alt={eventDetail.eventName}
                  className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay for aesthetic */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row jutsify-around px-5">
          <div className="w-full">
            {/* Middle Section: Title */}
            <div className="flex flex-col gap-1 mt-4">
              <h1 className="special-font text-4xl md:text-7xl lg:text-8xl font-black font-poppins text-black leading-none uppercase tracking-wider">
                <b>{eventDetail.eventName}</b>
              </h1>
              <p className="special-font text-2xl md:text-5xl font-bold text-blue-600 uppercase tracking-widest">
                <b>{eventDetail.category} Event</b>
              </p>

              <button
                onClick={() => setIsLearnMoreOpen(true)}
                className="mt-4 md:mt-6 px-6 py-2 md:px-10 md:py-3 bg-black text-white font-bold uppercase tracking-wider text-xs md:text-base hover:bg-white hover:text-black border-2 border-black transition-all duration-300 w-fit shadow-lg"
              >
                Learn More
              </button>
            </div>

            {/* Logistics - Mobile Only */}
            <div className="w-full flex lg:hidden flex-col justify-center gap-6 p-2 mt-8">
              <div className="flex special-font items-center gap-4 text-3xl md:text-6xl font-bold uppercase tracking-wider mb-2">
                <h1><b>{eventDetail.closed ? "Closed" : "Live"}</b></h1>
                <span className="w-2 h-2 bg-black rounded-full mx-2 animate-pulse"></span>
                <h1><b>Free</b></h1>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Timing</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">{eventDetail.timing}</p>
                </div>

                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Venue</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">{eventDetail.hall || "TBA"}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Members</b></p>
                  <p className="text-xl md:text-xl font-bold text-black">
                    {eventDetail.teamSize} Member{eventDetail.teamSize !== "1" ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Convenors */}
            <div className="flex flex-col items-start mt-10 mb-8">
              <h3 className="text-3xl md:text-3xl special-font font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6"><b>Convenors</b></h3>
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full">
                {eventDetail.contacts && eventDetail.contacts.map((contact, index) => (
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
          </div>

          {/* Right: Logistics - Desktop Only */}
          <div className="hidden lg:flex w-full lg:w-5/12 flex-col justify-center gap-6 p-2">
            <div className="flex special-font items-center gap-4 text-3xl md:text-6xl font-bold uppercase tracking-wider mb-2">
              <h1><b>{eventDetail.closed ? "Closed" : "Live"}</b></h1>
              <span className="w-2 h-2 bg-black rounded-full mx-2 animate-pulse"></span>
              <h1><b>Free</b></h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Timing</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">{eventDetail.timing}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Venue</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">{eventDetail.hall || "TBA"}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-2xl md:text-2xl special-font text-blue-600 font-bold uppercase tracking-widest mb-1"><b>Members</b></p>
                  <p className="text-lg md:text-xl font-bold text-black">
                    {eventDetail.teamSize} Member{eventDetail.teamSize !== "1" ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* {eventDetail.teamSize !== "1" && (
              <div className="bg-white/60 p-4 rounded-lg mt-4 border-l-4 border-black backdrop-blur-sm">
                <p className="font-bold text-xs uppercase tracking-wide mb-1 opacity-70">Note</p>
                <p className="text-sm font-medium leading-relaxed">
                  For team events, <span className="font-bold">every member</span> is required to register.
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {isLearnMoreOpen && (
        <EventDetailsModal
          eventDetail={eventDetail}
          onClose={() => setIsLearnMoreOpen(false)}
        />
      )}

      <div className="w-full" id="info">
        {showDetails && (
          <div
            className={`w-full p-8 text-black  ${inter.variable} ${jetBrainsMono.variable
              } bg-gradient-to-r ${eventDetail.category === "Gold"
                ? "from-[#FAF8C8] to-[#FAF8C8]"
                : eventDetail.category === "Platinum"
                  ? "from-[#d1c5bc] to-[#c7b8ae]"
                  : eventDetail.category === "Quiz"
                    ? "from-[#eadffd] to-[#eadffd]"
                    : eventDetail.category === "Core Engineering"
                      ? "from-[#D7FFFF] to-[#D7FFFF]"
                      : eventDetail.category === "Coding"
                        ? "from-[#FFE2C2] to-[#FFE2C2]"
                        : eventDetail.category === "Bot"
                          ? "from-[#FBE1E4] to-[#FBE1E4]"
                          : eventDetail.category === "Fashion and Textile"
                            ? "from-[#DCA2D2] to-[#DCA2D2]"
                            : eventDetail.category === "Science" ||
                              eventDetail.category === "Technology"
                              ? "from-[#E3FCE9] to-[#E3FCE9]"
                              : "from-gray-200 to-gray-50"
              }  antialiased`}
          >
            <div className="flex flex-col items-start justify-between lg:flex-row">
              <div>
                <h2 className="mt-2 text-lg font-bold">
                  {"( "}
                  {eventDetail.category} {" )"}
                </h2>
                {/* <h3 className="mt-1 text-5xl font-bold">Nextech</h3> */}
                <h3
                  className={`font-bold mt-1 text-black ${(eventDetail?.eventName?.length || 0) > 15
                    ? "text-3xl"
                    : "text-5xl"
                    }`}
                >
                  {eventDetail.eventName || "Event"}
                </h3>
              </div>

              <div className="text-3xl font-bold lg:text-right sm:text-left flex flex-col items-end lg:mt-[-1rem]">
                <div className="hidden items-center sm:mr-8=10 xl:text-right sm:text-left sm:mt-0 mt-2 mr-2 lg:flex">
                  <span className="mr-2 font-bold text-7xl sm:text-left">
                    {eventDetail.date}
                  </span>
                  <div className="mb-3 sm:text-left">
                    <p className="text-xl font-bold leading-tight">MARCH</p>
                    <p className="-mt-1 text-lg font-bold">
                      {"("}2026{")"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start w-full gap-2 my-2 lg:justify-end lg:my-0">
              <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row">
                <p className="py-3 text-xl font-semibold text-gray-600 lg:text-2xl lg:px-3 lg:text-md">
                  <MdAccessTime />
                </p>
                <p className="mt-1 text-xs text-gray-600 lg:text-md">
                  {eventDetail.timing}
                </p>
              </div>
              <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row ">
                <p className="py-3 text-xl font-semibold text-gray-600 lg:text-2xl lg:px-3">
                  <MdOutlineLocationOn />
                </p>
                <p className="text-xs font-semibold text-black ">
                  {eventDetail.hall}
                </p>
              </div>
              <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row">
                <p className="p-3 text-xl font-semibold text-gray-600 lg:text-2xl">
                  {eventDetail.teamSize !== "1" ? (
                    <AiOutlineTeam />
                  ) : (
                    <AiOutlineUser />
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-700">
                  {eventDetail.teamSize} Member
                  {eventDetail.teamSize !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-500 h-[1px]"></div>
            <p className="pt-4 mt-1 text-gray-700 text-md/6">
              <p className="pt-4 mt-1 text-gray-700 text-md/6">
                {id === "EVNT82"
                  ? eventDetail.description
                    .replace(/\r\n/g, "\n\r")
                    .split("\n")
                    .map((line, index) => (
                      <div key={index}>
                        <p
                          className={`text-m text-justify text-gray-700  flex items-start mb-[1%] ${line.startsWith("\r") ? "ml-[5%]" : "" // Extra indentation for lines with "\r"
                            }`}
                        >
                          <span className="mr-2">•</span> {line.trim()}
                        </p>
                      </div>
                    ))
                  : eventDetail.description}
              </p>
            </p>

            {/* Flex container for Rounds and Convenors */}
            <div className="flex flex-col gap-12 mt-4 lg:flex-row">
              {/* Rounds Section */}
              <div className="w-full lg:w-4/5">
                {/** Loop through rounds dynamically */}
                {/** Loop through rounds dynamically */}
                {eventDetail.rounds && eventDetail.rounds.map((round, index) => {
                  const roundNumber = index + 1;
                  return round ? (
                    <div key={roundNumber}>
                      <div className="flex items-center mb-[2%]">
                        <h4 className="mr-4 text-6xl font-bold">
                          {roundNumber}
                        </h4>
                        <div>
                          <h5 className="font-bold text-m">
                            ROUND {roundNumber}
                          </h5>
                          <p className="font-semibold text-m">
                            ({round.title})
                          </p>
                        </div>
                      </div>
                      <div className="mb-[2%]" key={roundNumber}>
                        {round.description
                          .replace(/\r\n/g, "\n\r")
                          .split("\n")
                          .map((line, idx) => (
                            <div key={idx}>
                              <p
                                key={idx}
                                className={`text-m text-justify text-gray-700 ml-[5%] flex items-start mb-[1%] ${line.startsWith("\r") ? "ml-[10%]" : "" // Add extra margin if line starts with space (indicates a tab)
                                  }`}
                              >
                                <span className="mr-2">•</span> {line.trim()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Convenors Section (takes 20% width on larger screens) */}
              {eventDetail.eventRules &&
                eventDetail.eventRules.length > 0 && (
                  <div className="w-full lg:w-2/5 xl:border-l sm:border-0 xl:pl-8 sm:pl-1 xl:mt-1 sm:mt-[1.5rem]">
                    <p className="font-bold sm:text-left">■ RULES ■</p>
                    <div className="text-gray-800 text-m whitespace-pre-wrap">
                      {eventDetail.eventRules
                        .split("\n")
                        .map((line, index) => (
                          <p
                            key={index}
                            className={
                              line.includes("RULES:")
                                ? "mt-4 font-bold" // Increase space before "RULES" sections
                                : line.startsWith("->")
                                  ? " mb-1" // Reduce space between subrules
                                  : "mb-2" // Normal spacing for regular rules
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
        )}
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
