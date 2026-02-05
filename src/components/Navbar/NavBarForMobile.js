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
            id: paper.ppid || paper.id,
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
    <nav className="fixed top-0 z-50 w-screen max-h-screen overflow-y-auto bg-black shadow-md lg:hidden lg:w-1/4 lg:relative lg:h-screen font-poppins">
      <div className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-black">
        <MenuToggle isOpen={isOpen} setIsOpen={setIsOpen} className="" />
        <div className="flex justify-center">
          <Link
            href={"/"}
            className="w-[3.5rem] h-[2.25rem]"
            style={{
              background: `url(/assets/Logo/Kriya25whitelogo.png)`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          ></Link>
        </div>
        <div className="flex justify-end">
          {userDetails ? (
            <Link
              href={"/portal/profile"}
              className="w-8 h-8 rounded-full"
              style={{
                backgroundImage: `url(${userDetails?.profilePhoto})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></Link>
          ) : (
            <Link
              href={"/auth?type=login"}
              className="text-white rounded-lg w-fit"
            >
              <FaRegUserCircle size={32} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`divide-y divide-gray-600 ${isOpen ? "h-fit" : "h-0 overflow-hidden"
          } transition-all ease-in-out duration-300`}
      >
        <div className="flex flex-col w-full px-6 py-8">
          <Link
            href="/"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Home
          </Link>
          {token && userDetails ? (
            <Link
              href="/portal/profile"
              className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth?type=login"
              className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
            >
              Register / Login
            </Link>
          )}
          <Link
            href="/#section3"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Events
          </Link>
          <Link
            href="/#section5"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Workshops
          </Link>
          <Link
            href="/#section4"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Paper Presentations
          </Link>
          <Link
            href="/portal/accommodation"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Accommodations
          </Link>
        </div>
        <div className="px-6 py-8 pb-16" id="navOpen">
          <div className="flex items-center space-x-4">
            <h3 className="py-3 font-semibold text-white" id="navElements">
              Workshops
            </h3>
          </div>
          <WorkNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            workshops={workshops}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Events
          </h3>
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Platinum Event
          </h3>
          <GoldNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            goldEvents={platinumEvents}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Quiz"
            noMargin
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Bot"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Coding"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Fashion and Textile"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Core Engineering"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Science and Technology"
            events={events}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Gold Events
          </h3>
          <GoldNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            goldEvents={goldEvents}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Paper Presentations
          </h3>
          <PaperNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            papers={papers}
          />
        </div>

        {token && (
          <div className="sticky bottom-0 z-10 flex items-center justify-between w-full bg-white shadow-lg">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex flex-row items-center px-6 py-4 gap-x-4"
            >
              <IoMdLogOut className="text-2xl" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarForMobile;
