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
import { IoMdLogOut } from "react-icons/io";
import { eventService } from "../../services/eventservice";

// Featured event IDs
const GOLD_EVENT_IDS = ["EVNT34", "EVNT20", "EVNT09", "EVNT25", "EVNT32"];
const PLATINUM_EVENT_IDS = ["EVNT40"];

const NavBarForDesktop = () => {
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [papers, setPapers] = useState([]);
  const [goldEvents, setGoldEvents] = useState([]);
  const [platinumEvents, setPlatinumEvents] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch events
        const eventsResponse = await eventService.getAllEvents();
        const eventsData = Array.isArray(eventsResponse.events) ? eventsResponse.events : eventsResponse?.data || [];
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
        const workshopsData = Array.isArray(workshopsResponse.workshops) ? workshopsResponse.workshops : workshopsResponse?.data?.workshops || [];
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

      } catch (error) {
        console.error("Error fetching navbar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className="fixed top-0 z-50 hidden w-screen max-h-screen overflow-y-auto bg-[#0a0a0a] border-r border-[#1a1a1a] lg:block lg:w-1/4 lg:relative lg:h-screen font-poppins custom-scrollbar">
      <div className="sticky top-0 z-20 flex items-center justify-center w-full py-8 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <Link
          href={"/"}
          className="w-20 h-20 transition-transform duration-300 hover:scale-110"
          style={{
            background: `url(/Logo/kriya26white.png)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></Link>
      </div>

      <div className="px-6 py-8 space-y-8 pb-32">
        {/* Core Navigation Section */}
        <section className="space-y-1">
          {(!userDetails || !localStorage.getItem("token")) && (
            <button
              onClick={() => window.open("https://www.youtube.com/watch?v=YeFJPRFhmCM", "_blank")}
              className="w-full px-4 py-3 mb-6 text-sm font-bold tracking-widest uppercase transition-all duration-300 bg-white text-black hover:bg-gray-200 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              How to Register
            </button>
          )}

          {[
            { href: "/", icon: <AiOutlineHome />, label: "Home" },
            { href: "/portal/event", icon: <MdOutlineEmojiEvents />, label: "Events" },
            { href: "/portal/workshop", icon: <GrWorkshop />, label: "Workshops" },
            { href: "/portal/paper", icon: <HiOutlinePresentationChartBar />, label: "Paper Presentations" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center w-full px-4 py-3 space-x-4 text-sm font-medium transition-all duration-200 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
            >
              <span className="text-xl opacity-70">{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
            </Link>
          ))}
        </section>

        {/* Categories / Sections */}
        <div className="space-y-8 border-t border-[#1a1a1a] pt-8">
          <div>
            <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
              Learning
            </h3>
            <div className="space-y-4">
              <div>
                <p className="px-4 py-1 text-xs font-bold text-white/90">Workshops</p>
                <WorkNav noMargin workshops={workshops} />
              </div>
              <div>
                <p className="px-4 py-1 text-xs font-bold text-white/90">Research</p>
                <PaperNav noMargin papers={papers} />
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
                <GoldNav noMargin goldEvents={goldEvents} />
              </div>
              <div>
                <p className="px-4 py-1 text-xs font-bold text-[#C0C0C0]">Platinum Events</p>
                <GoldNav noMargin goldEvents={platinumEvents} />
              </div>

              <div className="space-y-1">
                <p className="px-4 py-1 text-xs font-bold text-white/90">Categories</p>
                <div className="space-y-0.5">
                  <EventNav category="Coding" events={events} />
                  <EventNav category="Science and Technology" noMargin events={events} />
                  <EventNav category="Bot" events={events} />
                  <EventNav category="Quiz" events={events} />
                  <EventNav category="Core Engineering" events={events} />
                  <EventNav category="Fashion and Textile" events={events} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {typeof window !== "undefined" &&
        localStorage.getItem("token") &&
        userDetails && (
          <div className="fixed bottom-0 z-30 w-[calc(25%-1px)] bg-[#0a0a0a]/90 backdrop-blur-md border-t border-[#1a1a1a] p-4">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#111] border border-[#222]">
              <div className="flex items-center space-x-3">
                <Link
                  href="/portal/profile"
                  className="w-10 h-10 overflow-hidden border-2 border-[#333] rounded-full hover:border-white transition-colors duration-300"
                >
                  <img
                    src={userDetails?.profilePhoto}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <Link href="/portal/profile" className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate max-w-[120px]">
                    {userDetails?.name}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                    {userDetails.kriyaId}
                  </span>
                </Link>
              </div>
              <button
                className="p-2 transition-all duration-200 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                <IoMdLogOut size={20} />
              </button>
            </div>
          </div>
        )}
    </nav>
  );
};

export default NavBarForDesktop;
