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
            id: paper.ppid || paper.id,
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
    <nav className="fixed top-0 z-50 hidden w-screen max-h-screen overflow-y-scroll bg-black shadow-md lg:block lg:w-1/4 lg:relative lg:h-screen font-poppins">
      <div className="sticky top-0 z-10 flex items-center justify-center w-full px-6 bg-black shadow-sm">
        <Link
          href={"/"}
          className="mt-5 w-16 h-16"
          style={{
            background: `url(/assets/Logo/Kriya25whitelogo.png)`,
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></Link>
      </div>

      <div
        className={`divide-y divide-gray-600 h-fit transition-all ease-in-out duration-300 px-6 bg-black text-white `}
      >
        <div className="flex flex-col w-full py-8">
          {(!userDetails || !localStorage.getItem("token")) && (
            <button
              onClick={() => router.push("/auth?type=signup&page=switch")}
              className="px-6 py-3 mb-4 text-md text-black bg-white rounded-lg"
            >
              Register / Login
            </button>
          )}
          <Link
            href="/"
            className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-text-gray-300"
          >
            <AiOutlineHome className="text-lg" />
            <p className="">Home</p>
          </Link>
          <Link
            href="/portal/event"
            className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300"
          >
            <MdOutlineEmojiEvents className="text-lg" />
            <p className="">Events</p>
          </Link>
          <Link
            href="/#section5"
            className="flex items-center w-full py-2 space-x-4 text-left text-white  group hover:text-gray-300"
          >
            <GrWorkshop className="text-lg opacity-70 group-hover:opacity-100" />
            <p className="">Workshops</p>
          </Link>
          <Link
            href="/#section4"
            className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300"
          >
            <HiOutlinePresentationChartBar className="text-lg" />
            <p className="">Paper Presentations</p>
          </Link>
          <Link
            href="/portal/accommodation"
            className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300 "
          >
            <BiBuildingHouse className="text-lg" />
            <p className="">Accommodations</p>
          </Link>
        </div>
        <div className="py-4">
          <div className="flex justify-between items-center space-x-4">
            <h3 className="py-3 font-semibold text-white">Workshops</h3>
          </div>
          <WorkNav noMargin workshops={workshops} />
          <h3 className="py-3 font-semibold text-white">Events</h3>
          <h3 className="py-3 font-semibold text-white">Platinum Event</h3>

          <GoldNav noMargin goldEvents={platinumEvents} />

          <EventNav category="Coding" events={events} />
          <EventNav category="Science and Technology" noMargin events={events} />
          <EventNav category="Bot" events={events} />
          <EventNav category="Quiz" events={events} />
          <EventNav category="Core Engineering" events={events} />
          <EventNav category="Fashion and Textile" events={events} />
          <h3 className="py-3 font-semibold text-white">Gold Events</h3>
          <GoldNav noMargin goldEvents={goldEvents} />
          <h3 className="py-3 font-semibold text-white">
            Paper Presentations
          </h3>
          <PaperNav noMargin papers={papers} />
        </div>
      </div>

      {typeof window !== "undefined" &&
        localStorage.getItem("token") &&
        userDetails && (
          <div className="sticky bottom-0 z-10 flex items-center justify-between w-full p-2 px-6 space-x-4 bg-white shadow-lg shadow-black">
            <Link
              href="/portal/profile"
              className="w-8 h-8 rounded-full aspect-square"
              style={{
                backgroundImage: `url(${userDetails?.profilePhoto})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></Link>
            <Link href="/portal/profile" className="flex-1">
              <h2 className="font-semibold text-black">
                {userDetails?.name}
              </h2>
              <h4 className="text-xs text-gray-600">{userDetails.kriyaId}</h4>
            </Link>
            <button
              className=""
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              <IoMdLogOut size={24} />
            </button>
          </div>
        )}
    </nav>
  );
};

export default NavBarForDesktop;
