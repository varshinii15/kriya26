"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineHome } from "react-icons/ai";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlinePresentationChartBar } from "react-icons/hi";
import { BiBuildingHouse } from "react-icons/bi";
import WorkNav from "./WorkNav";
import EventNav from "./EventNav";
import GoldNav from "./GoldNav";
import PaperNav from "./PaperNav";
import MenuToggle from "./MenuToggle";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { eventService } from "../../services/eventservice";

// Featured event IDs
const GOLD_EVENT_IDS = ["EVNT34", "EVNT20", "EVNT09", "EVNT25", "EVNT32"];
const PLATINUM_EVENT_IDS = ["EVNT40"];

const NavBarForMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [papers, setPapers] = useState([]);
  const [goldEvents, setGoldEvents] = useState([]);
  const [platinumEvents, setPlatinumEvents] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await eventService.getAllEvents();
        const eventsData = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse?.data || [];
        const sortedEvents = eventsData
          .map((event) => ({
            name: event.eventName || event.name,
            category: event.category,
            id: event.eventId || event.id,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setEvents(sortedEvents);

        // Fetch Gold and Platinum events by specific IDs
        try {
          const goldPromises = GOLD_EVENT_IDS.map(id => eventService.getEventById(id));
          const goldResponses = await Promise.all(goldPromises);
          const goldEvents = goldResponses.map(res => {
            const event = res?.event || res;
            return {
              name: event.eventName || event.name,
              category: event.category,
              id: event.eventId || event.id,
            };
          });
          setGoldEvents(goldEvents);

          const platinumPromises = PLATINUM_EVENT_IDS.map(id => eventService.getEventById(id));
          const platinumResponses = await Promise.all(platinumPromises);
          const platinumEvents = platinumResponses.map(res => {
            const event = res?.event || res;
            return {
              name: event.eventName || event.name,
              category: event.category,
              id: event.eventId || event.id,
            };
          });
          setPlatinumEvents(platinumEvents);
        } catch (error) {
          console.error("Error fetching featured events by ID:", error);
        }

        // Fetch workshops
        const workshopsResponse = await eventService.getAllWorkshops();
        const workshopsData = Array.isArray(workshopsResponse.workshops) ? workshopsResponse.workshops : workshopsResponse?.data || [];
        const sortedWorkshops = workshopsData
          .map((workshop) => ({
            name: workshop.workshopName || workshop.name,
            id: workshop.workshopId || workshop.id,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setWorkshops(sortedWorkshops);

        // Fetch papers
        const papersResponse = await eventService.getAllPapers();
        const papersData = Array.isArray(papersResponse.papers) ? papersResponse.papers : papersResponse?.data?.papers || [];
        const sortedPapers = papersData
          .map((paper) => ({
            name: paper.eventName || paper.name,
            paperId: paper.paperId || paper.id,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setPapers(sortedPapers);

        // Fetch token
        const t = localStorage.getItem("token");
        setToken(t);
      } catch (error) {
        console.error("Error fetching navbar data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const navOpen = document.querySelector("#navOpen");
    const elements = document.querySelectorAll("#navElements");

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        elements.forEach((tag) => {
          tag.classList.add("animate-fade-in-slow");
        });
      }
    });

    observer.observe(navOpen);
  });

  return (
    <nav className="fixed top-0 z-50 w-screen max-h-screen overflow-y-auto bg-[#0a0a0a] shadow-2xl lg:hidden font-poppins custom-scrollbar transition-all duration-300">
      <div className="sticky top-0 z-20 flex items-center justify-between w-full px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <MenuToggle isOpen={isOpen} setIsOpen={setIsOpen} className="text-white" />
        <Link
          href={"/"}
          className="w-12 h-8"
          style={{
            background: `url(/Logo/kriya26white.png)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></Link>
        <div className="flex justify-end">
          {userDetails ? (
            <Link
              href={"/portal/profile"}
              className="w-9 h-9 border border-[#333] rounded-full overflow-hidden"
            >
              <img
                src={userDetails?.profilePhoto}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <Link
              href={"/auth?type=login"}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaRegUserCircle size={28} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
      >
        <div className="px-6 py-8 space-y-8">
          {/* Core Links */}
          <section className="space-y-1">
            {(!token || !userDetails) && (
              <button
                type="button"
                onClick={() => window.open("https://www.youtube.com/watch?v=YeFJPRFhmCM", "_blank")}
                className="w-full px-4 py-3 mb-6 text-xs font-black tracking-widest uppercase bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 transition-all"
              >
                How to Register
              </button>
            )}

            {[
              { href: "/", label: "Home", icon: <AiOutlineHome /> },
              { href: "/portal/event", label: "Events", icon: <MdOutlineEmojiEvents /> },
              { href: "/portal/workshop", label: "Workshops", icon: <GrWorkshop /> },
              { href: "/portal/paper", label: "Paper Presentations", icon: <HiOutlinePresentationChartBar /> },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-4 py-3 space-x-4 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#111] rounded-lg transition-all"
              >
                <span className="text-xl opacity-70">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            ))}
          </section>

          {/* Deep Navigation */}
          <div className="space-y-8 border-t border-[#1a1a1a] pt-8" id="navOpen">
            <div>
              <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                Learning
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="px-4 py-1 text-xs font-bold text-white/90">Workshops</p>
                  <WorkNav
                    openState={[isOpen, setIsOpen]}
                    isMobile
                    noMargin
                    workshops={workshops}
                  />
                </div>
                <div>
                  <p className="px-4 py-1 text-xs font-bold text-white/90">Research</p>
                  <PaperNav
                    openState={[isOpen, setIsOpen]}
                    isMobile
                    noMargin
                    papers={papers}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                Competitions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="px-4 py-1 text-xs font-bold text-[#D9972B]">Gold Events</p>
                  <GoldNav
                    openState={[isOpen, setIsOpen]}
                    isMobile
                    noMargin
                    goldEvents={goldEvents}
                  />
                </div>

                <div>
                  <p className="px-4 py-1 text-xs font-bold text-[#C0C0C0]">Platinum Events</p>
                  <GoldNav
                    openState={[isOpen, setIsOpen]}
                    isMobile
                    noMargin
                    goldEvents={platinumEvents}
                  />
                </div>

                <div className="space-y-1">
                  <p className="px-4 py-1 text-xs font-bold text-white/90">Categories</p>
                  <div className="space-y-0.5">
                    {["Quiz", "Bot", "Coding", "Fashion and Textile", "Core Engineering", "Science and Technology"].map((cat) => (
                      <EventNav
                        key={cat}
                        openState={[isOpen, setIsOpen]}
                        isMobile
                        category={cat}
                        events={events}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {token && (
          <div className="sticky bottom-0 z-30 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#1a1a1a] p-4">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex items-center justify-center w-full px-6 py-3 space-x-3 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            >
              <IoMdLogOut size={20} />
              <span>Logout Account</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarForMobile;
