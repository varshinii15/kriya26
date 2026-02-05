"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { useRouter } from "next/navigation";
import "./globals.css";
import { useState, useRef, useEffect, use } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { eventService } from "../../../../services/eventservice";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
import { SiGmail } from "react-icons/si";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Adjust weights as per your needs
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Adjust weights as per your needs
});

export default function Home({ params }) {
  const { id } = use(params); // Unwrap the Promise in Next.js 16

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
        const eventData = res1?.data || res1;
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
        className={`sticky top-0 z-20 w-full p-4 mt-2 md:px-6 lg:px-8 lg:mt-0 backdrop-blur-2xl 
    ${userEventDetails &&
            userEventDetails.find((i) => i.eventId === id) &&
            id === "EVNT89"
            ? "flex flex-col sm:flex-row"
            : "flex  items-center justify-between "
          }`}
      >
        <h1 className="text-2xl font-semibold text-black">Event</h1>

        <div className="flex items-center gap-4 ">
          <button
            className={`md:px-4 md:py-2 px-1 py-1 text-xs font-light text-white uppercase 
  ${userEventDetails &&
                userEventDetails.find((i) => i.eventId === id) &&
                id == "EVNT89"
                ? ""
                : "bg-black"
              } 
  lg:font-normal lg:tracking-wider lg:text-sm font-poppins`}
            disabled={
              (userEventDetails &&
                userEventDetails.find((i) => i.eventId === id) &&
                id != "EVNT89") ||
              eventDetail.closed
            }
            onClick={() => {
              {
                setIsModalOpen(true);
              }
            }}
          >
            {userEventDetails && (
              <>
                {userEventDetails.find((i) => i.eventId === id) ? (
                  id === "EVNT89" ? (
                    <div className="md:ml-[10%] flex flex-col  w-full md:px-4 px-2 py-2 rounded-3xl bg-gray-100">
                      <p className="font-medium text-[#3c4043] text-xs md:text-base ">
                        Already Registered! You can submit the abstract to the
                        mail ID
                      </p>
                      <div className="flex flex-col gap-2 mt-2 text-[#3c4043]">
                        <div className="flex flex-col md:flex-row items-start md:items-center w-full space-y-2 md:space-y-0 md:space-x-4 group">
                          <div className="flex flex-row items-center space-x-4 ml-[10%] md:ml-0">
                            <SiGmail className="text-lg md:text-2xl group-hover:text-black" />
                            <button
                              className="text-blue-700 group-hover:underline break-words text-left text-sm md:text-base"
                              onClick={(event) => {
                                event.stopPropagation();
                                console.log("Opening email:", mail);
                                window.open(
                                  `mailto:${mail}?subject=Kriya Ideathon - abstract submission`
                                );
                              }}
                            >
                              {mail}
                            </button>
                          </div>
                          <span className="text-[10px] ml-[5%]  md:ml-2">
                            (Make sure you attach the video of the abstract)
                          </span>
                        </div>

                        <p className="text-xs md:text-sm text-[#5f6368] ">
                          Please use{" "}
                          <span className="italic lowercase font-semibold">
                            &quot;Kriya Ideathon - abstract submission&quot;
                          </span>{" "}
                          as the subject.
                        </p>
                      </div>
                    </div>
                  ) : (
                    "Registered"
                  )
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
              className="md:px-4 md:py-2 px-1 py-1 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              onClick={() => setShowVideo(true)}
            >
              OVERVIEW
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full mb-5 md:mb-10 lg:mb-20">
        <div className="flex flex-col w-full lg:flex-row lg:h-[calc(100vh-68px)]">
          <div className="h-full relative w-full lg:w-[75%] flex flex-col lg:justify-end">
            {/* Image */}

            <div
              className={`w-full relative lg:absolute lg:top-0 aspect-[1000/723] self-end -z-10`}
            >
              <Image
                src={`/eventdetails/${eventDetail.eventId}.jpg`}
                fill
                sizes="400"
                alt="cover"
                className=""
              />

              {/* <div className="absolute flex-col hidden w-full gap-1 px-4 py-2 -bottom-[12%]  lg:flex md:px-6 lg:px-8">

                <div className="flex gap-4">

                  <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">{eventDetail.date}</h1>

                  <div className="flex flex-col">
                    <p className="text-2xl font-bold">MARCH</p>
                    <p className="text-2xl font-bold">(2025)</p>
                  </div>

                </div>

                <p className="text-xl font-bold text-black md:text-3xl">
                  {eventDetail.category} Event
                </p>

                <h2
                  className={`font-bold text-black ${eventDetail.eventName.length > 15 ? "text-3xl md:text-6xl" : "text-5xl md:text-8xl"
                    }`}
                >
                  {eventDetail.eventName}
                </h2>


                <button onClick={() => {
                  setShowDetails(true);
                  const targetDiv = document.getElementById('info');
                  targetDiv.scrollIntoView({
                    behavior: 'smooth',  // Smooth scrolling
                    block: 'start'       // Align to the top of the viewport
                  });

                }}
                  className="self-start px-4 py-2 mt-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins">
                  Learn More
                </button>

              </div> */}
            </div>

            <div className="relative flex-col hidden w-full gap-1 px-4 py-2 lg:flex md:px-6 lg:px-8 ">
              <div className="flex gap-4">
                <h1
                  className={`text-4xl font-bold md:text-6xl xl:text-8xl 
    ${eventDetail.category === "Gold"
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
                    }`}
                >
                  {eventDetail.date}
                </h1>

                <div
                  className={`flex flex-col ${eventDetail.category === "Gold"
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
                    }`}
                >
                  <p className="text-2xl font-bold">MARCH</p>
                  <p className="text-2xl font-bold">(2025)</p>
                </div>
              </div>

              <p
                className={`text-xl font-bold text-black md:text-3xl
                `}
              >
                {eventDetail.category} Event
              </p>

              <h2
                className={`font-bold text-black   ${(eventDetail?.eventName?.length || 0) > 15
                  ? "text-3xl md:text-6xl w-[90%]"
                  : "text-5xl md:text-7xl"
                  }`}
              >
                {eventDetail.eventName || "Event"}
              </h2>

              <button
                onClick={() => {
                  setShowDetails(true);
                  const targetDiv = document.getElementById("info");
                  targetDiv.scrollIntoView({
                    behavior: "smooth", // Smooth scrolling
                    block: "start", // Align to the top of the viewport
                  });
                }}
                className="self-start px-4 py-2 mt-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              >
                Learn More
              </button>
            </div>

            <div className="flex flex-col w-full px-4 py-2 gasp-1 lg:hidden md:px-6 lg:px-8">
              <div className="flex gap-4">
                <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">
                  {eventDetail.date}
                </h1>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold">MARCH</p>
                  <p className="text-2xl font-bold">(2025)</p>
                </div>
              </div>

              <p className="text-xl font-bold text-black md:text-3xl">
                {eventDetail.category} Event
              </p>

              <h2
                className={`font-bold text-black ${(eventDetail?.eventName?.length || 0) > 15
                  ? "text-2xl md:text-5xl"
                  : "text-3xl md:text-7xl"
                  }`}
              >
                {eventDetail.eventName || "Event"}
              </h2>
              <div className="flex flex-col py-3 gap-1 ">
                <h3 className="text-xl font-bold">Convenors</h3>

                <div className="flex flex-col gap-2 pl-5">
                  {[eventDetail.contact_name_1, eventDetail.contact_name_2].map(
                    (contact, index) =>
                      contact && (
                        <div key={index} className="">
                          <p className="text-lg font-semibold">
                            {toTitleCase(contact)} <br />
                            <span className="flex items-center space-x-2">
                              <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                              <span>
                                {index === 0
                                  ? eventDetail.contact_mobile_1
                                  : eventDetail.contact_mobile_2}
                              </span>
                            </span>
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  {
                    setShowDetails(true);
                    const targetDiv = document.getElementById("info");
                    targetDiv.scrollIntoView({
                      behavior: "smooth", // Smooth scrolling
                      block: "start", // Align to the top of the viewport
                    });
                  }
                }}
                className="self-start px-4 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right */}

          <div className="h-full hidden lg:flex w-full lg:w-[25%] flex-col justify-between p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-stretch w-full mt-[10%] text-2xl  2xl:text-3xl font-semibold uppercase justify-evenly">
                <h1>{eventDetail.closed ? "Closed " : "Live* "}</h1>

                <div className="w-1 bg-black" />

                <h1>Free*</h1>
              </div>

              {/* Venue */}

              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center gap-4">
                  <div className="  text-2xl  text-gray-600">
                    <MdAccessTime />
                  </div>

                  <p className="text-xl  text-gray-600">{eventDetail.timing}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="  text-2xl font-semibold text-black">
                    <MdOutlineLocationOn />
                  </div>
                  <p
                    className={`text-xl ${(eventDetail?.hall?.length || 0) > 20 ? "md:text-sm" : "lg:text-xl"
                      } font-semibold text-black `}
                  >
                    {eventDetail.hall || "TBA"}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-4">
                  <p className=" text-2xl font-semibold text-gray-600">
                    {eventDetail.teamSize !== "1" ? (
                      <AiOutlineTeam size={30} />
                    ) : (
                      <AiOutlineUser size={30} />
                    )}
                  </p>
                  <p className="text-lg text-gray-600 ">
                    {eventDetail.teamSize} Member
                    {eventDetail.teamSize !== "1" ? "s" : ""}
                  </p>
                </div>
                {eventDetail.teamSize !== "1" && (
                  <div>
                    <p className="text-2xl font-semibold tracking-wide text-gray-600">
                      Note
                    </p>
                    <ul className="pl-4 space-y-2 text-gray-700 list-disc text-sm">
                      <li>
                        For team events,{" "}
                        <b className="font-semibold">every member</b> of the
                        team is required to register for the event and pay the
                        general registration fee.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Convennors */}

            <div className="flex flex-col self-center gap-2 ">
              <h3 className="text-3xl font-bold">Convenors</h3>

              <div className="flex flex-col gap-2">
                {[eventDetail.contact_name_1, eventDetail.contact_name_2].map(
                  (contact, index) =>
                    contact && (
                      <div key={index} className="">
                        <p className="text-lg font-semibold">
                          {toTitleCase(contact)} <br />
                          <span className="flex items-center space-x-2">
                            <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                            <span>
                              {index === 0
                                ? eventDetail.contact_mobile_1
                                : eventDetail.contact_mobile_2}
                            </span>
                          </span>
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
          {showVideo && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative w-full max-w-2xl">
                {eventDetail.youtubeUrl && (
                  <iframe
                    className="w-full h-[400px] rounded-lg z-20"
                    src={
                      eventDetail.youtubeUrl
                        ? eventDetail.youtubeUrl
                        : "https://www.youtube.com/embed/YeFJPRFhmCM?si=gg31c7VicKYd8Lv-"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
                <button
                  className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-full"
                  onClick={() => setShowVideo(false)}
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

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
                        {"("}2025{")"}
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
                  {[1, 2, 3, 4].map((roundNumber) => {
                    const roundTitle =
                      eventDetail[`round_title_${roundNumber}`];
                    const roundDesc = eventDetail[`round_desc_${roundNumber}`];

                    return roundTitle && roundDesc ? (
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
                              ({roundTitle})
                            </p>
                          </div>
                        </div>
                        <div className="mb-[2%]" key={roundNumber}>
                          {roundDesc
                            .replace(/\r\n/g, "\n\r")
                            .split("\n")
                            .map((line, index) => (
                              <div key={index}>
                                <p
                                  key={index}
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
