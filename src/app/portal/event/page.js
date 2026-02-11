"use client";
import React, { useEffect, useState } from "react";
import { FaSoundcloud } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { eventService } from "../../../services/eventservice";
import "../../../styles/gradientAnimation.css";
import PixelSnow from "../../../components/PixelSnow/PixelSnow";
import EventGrid from "../../../components/Event/EventGrid";
import "../../../styles/Landing.css";

const TextFont = "Helonik";

// Featured event IDs
const GOLD_EVENT_IDS = ["EVNT34", "EVNT20", "EVNT09", "EVNT25", "EVNT32"];
const PLATINUM_EVENT_IDS = ["EVNT40"];

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [featuredGoldEvents, setFeaturedGoldEvents] = useState([]);
  const [featuredPlatinumEvents, setFeaturedPlatinumEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch events from eventService
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();

        // Handle different response formats
        let eventsData = [];
        if (Array.isArray(response)) {
          eventsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          eventsData = response.data;
        } else if (response?.events && Array.isArray(response.events)) {
          eventsData = response.events;
        }

        // Map to the format needed for the UI
        const normalizeMongoDate = (d) => {
          if (!d) return null;
          if (typeof d === "string") return d;
          // Handle Mongo-style date wrapper: { $date: "..." }
          if (typeof d === "object" && d.$date) return d.$date;
          return null;
        };

        const mappedEvents = eventsData.map((event) => ({
          name: event.eventName || event.name,
          id: event.eventId || event.id,
          // Keep ISO-like date string for consistent formatting in UI
          date: normalizeMongoDate(event.date) || "TBA",
          category: event.category,
          // Prefer structured startTime if present; otherwise fall back to timing string
          time: event.startTime || event.timing || event.time || "TBA",
        })).sort((a, b) => a.name.localeCompare(b.name));

        setEvents(mappedEvents);

        // Fetch featured events by ID
        const fetchFeaturedEvents = async () => {
          try {
            // Fetch Gold events
            const goldPromises = GOLD_EVENT_IDS.map(id => eventService.getEventById(id));
            const goldResponses = await Promise.all(goldPromises);
            const goldEvents = goldResponses.map(res => {
              const event = res?.event || res;
              return {
                name: event.eventName || event.name,
                id: event.eventId || event.id,
                date: normalizeMongoDate(event.date) || "TBA",
                category: event.category,
                time: event.startTime || event.timing || event.time || "TBA",
              };
            });
            setFeaturedGoldEvents(goldEvents);

            // Fetch Platinum events
            const platinumPromises = PLATINUM_EVENT_IDS.map(id => eventService.getEventById(id));
            const platinumResponses = await Promise.all(platinumPromises);
            const platinumEvents = platinumResponses.map(res => {
              const event = res?.event || res;
              return {
                name: event.eventName || event.name,
                id: event.eventId || event.id,
                date: normalizeMongoDate(event.date) || "TBA",
                category: event.category,
                time: event.startTime || event.timing || event.time || "TBA",
              };
            });
            setFeaturedPlatinumEvents(platinumEvents);
          } catch (error) {
            console.error("Error fetching featured events:", error);
          }
        };

        fetchFeaturedEvents();
        setError(null);
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      searchTerm === "" ||
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPlatinumEvents = featuredPlatinumEvents.filter(
    (event) =>
      searchTerm === "" ||
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredGoldEvents = featuredGoldEvents.filter(
    (event) =>
      searchTerm === "" ||
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  useEffect(() => {
    if (!searchParams || !searchParams.get("ctg")) return;

    const ctg = searchParams.get("ctg");

    if (events.length > 0) {
      const element = document.querySelector(`#${ctg}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Slight delay to ensure DOM is ready
      } else {
        console.warn(`Element with id "${ctg}" not found.`);
      }
    }
  }, [events, searchParams]);

  useEffect(() => {
    // Your logic here to reset hasVideoPlayed to false
    localStorage.setItem("hasVideoPlayed", "false");
  }, []);
  return (
    <div className="w-full  h-screen py-12 pt-24 overflow-y-scroll font-poppins lg:pt-12">
      <PixelSnow
        className="fixed top-0 left-0 w-full h-full"
        color="#ffffff"
        flakeSize={0.015}
        minFlakeSize={1.25}
        pixelResolution={200}
        speed={1.5}
        depthFade={8}
        farPlane={20}
        brightness={10}
        gamma={0.4545}
        density={0.3}
        variant="snowflake"
        direction={125}
      />

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-white">Loading events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-400 mb-2">{error}</p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center gap-6 mb-8 px-4 relative z-30">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 shadow-lg"
              aria-label="Go back"
            >
              <IoMdArrowBack className="text-xl md:text-2xl" />
            </button>
            <input
              type="text"
              placeholder="Search events by name, category, date, or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border-2 border-white/30 shadow-lg w-full sm:w-3/4 lg:w-1/2 max-w-lg text-white bg-black/40 backdrop-blur-md placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-black/50 transition-all"
            />
          </div>
          <section className="relative flex flex-col items-center w-full  px-6 pb-32 overflow-x-hidden h-fit lg:overflow-hidden font-poppins lg:px-8 lg:pb-40 lg:block">
            {/* <div className="w-full my-8 lg:mt-0">
          <h1 className={`text-4xl lg:text-6xl text-white font-semibold font-poppins text-center py-2`}
            id="soon-text"
          >
            ✨ EVENTS ✨
          </h1>
        </div> */}
            {/* FEATURED PLATINUM EVENTS (by ID) */}
            <div hidden={filteredPlatinumEvents.length === 0}>
              <h1
                className="special-font text-4xl lg:text-5xl tracking-wide font-black text-center pt-8 uppercase"
                style={{ color: '#C0C0C0' }}
                id="platinum"
              >
                <b>PLATINUM EVENTS</b>
              </h1>
              <EventsGrid
                imgurl="/thumbnail/platinumthumb.png"
                arrowCircleStart="from-[#9c8f86]"
                arrowCircleEnd="to-[#d1c5bc]"
                obj={filteredPlatinumEvents}
                topCurve="bg-[#010101]"
                rightCurve="bg-[#010101]"
                iconImg={
                  "https://cdn-icons-png.flaticon.com/512/3309/3309977.png"
                }
                categoryOverride="platinum"
              />
            </div>

            {/* FEATURED GOLD EVENTS (by ID) */}
            <div hidden={filteredGoldEvents.length === 0}>
              <h1
                className="special-font text-4xl lg:text-5xl tracking-wide font-black text-center pt-8 uppercase"
                style={{ color: '#FFD700' }}
                id="gold"
              >
                <b>GOLD EVENTS</b>
              </h1>
              <EventsGrid
                imgurl="/thumbnail/goldthumb.png"
                arrowCircleStart="from-[#8B5523]"
                arrowCircleEnd="to-[#F2CC3E]"
                obj={filteredGoldEvents}
                topCurve="bg-[#010101]"
                rightCurve="bg-[#010101]"
                iconImg={
                  "https://cdn-icons-png.flaticon.com/512/3309/3309977.png"
                }
                categoryOverride="gold"
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Quiz").length === 0
              }
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#98D0FF' }}
                id="quiz"
                hidden={
                  filteredEvents.filter((i) => i.category === "Quiz").length === 0
                }
              >
                <b>QUIZ</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/quizthumb.png"}
                arrowCircleStart="from-[#121a43]"
                arrowCircleEnd="to-[#a21cd9]"
                obj={filteredEvents.filter((i) => i.category === "Quiz")}
                topCurve="bg-[#7d1ab2]"
                rightCurve="bg-[#551789]"
                iconImg={"/assets/CatLogo/kriyative.png"}
              />
            </div>

            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Core Engineering")
                  .length === 0
              }
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#F34F44' }}
                id="core"
                hidden={
                  filteredEvents.filter((i) => i.category === "Core Engineering")
                    .length === 0
                }
              >
                <b>CORE ENGINEERING</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/corethumb.png"}
                arrowCircleStart="from-[#121a43]"
                arrowCircleEnd="to-[#58B0B0]"
                obj={filteredEvents.filter(
                  (i) => i.category === "Core Engineering"
                )}
                topCurve="bg-[#2F6F6F]"
                rightCurve="bg-[#1C4A4A]"
                iconImg={"/assets/CatLogo/brainiac.png"}
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Coding").length === 0
              }
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#3AC49C' }}
                id="coding"
                hidden={
                  filteredEvents.filter((i) => i.category === "Coding").length ===
                  0
                }
              >
                <b>CODING</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/codingthumb.png"}
                arrowCircleStart="from-[#A76B40]"
                arrowCircleEnd="to-[#D19872]"
                obj={filteredEvents.filter((i) => i.category === "Coding")}
                topCurve="bg-[#B7592D]"
                rightCurve="bg-[#8F3C1F]"
                iconImg={"/assets/CatLogo/circuit.png"}
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Bot").length === 0
              }
              className="w-full "
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#3AC49C' }}
                id="bot"
                hidden={
                  filteredEvents.filter((i) => i.category === "Bot").length === 0
                }
              >
                <b>BOT</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/botthumb.jpg"}
                arrowCircleStart="from-[#D98165]"
                arrowCircleEnd="to-[#5C2D47]"
                obj={filteredEvents.filter((i) => i.category === "Bot")}
                topCurve="bg-[#9C4E57]"
                rightCurve="bg-[#7F3A4C]"
                iconImg={"/assets/CatLogo/coding.png"}
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Fashion and Textile")
                  .length === 0
              }
              className="h-[10%]"
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#B48EEB' }}
                id="fashion"
                hidden={
                  filteredEvents.filter(
                    (i) => i.category === "Fashion and Textile"
                  ).length === 0
                }
              >
                <b>FASHION & TEXTILE</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/fashionthumb.png"}
                arrowCircleStart="from-[#9B1E55]"
                arrowCircleEnd="to-[#5F0D2E]"
                obj={filteredEvents.filter(
                  (i) => i.category === "Fashion and Textile"
                )}
                topCurve="bg-[#8B2F48]"
                rightCurve="bg-[#6C2A3E]"
                iconImg={"/assets/CatLogo/core.png"}
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Science and Technology").length ===
                0
              }
            >
              <h1
                className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase"
                style={{ color: '#B0E369' }}
                id="science"
                hidden={
                  filteredEvents.filter((i) => i.category === "Science and Technology")
                    .length === 0
                }
              >
                <b>SCIENCE & TECHNOLOGY</b>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/sciencethumb.png"}
                arrowCircleStart="from-[#5BBF7A]"
                arrowCircleEnd="to-[#2E8050]"
                obj={filteredEvents.filter((i) => i.category === "Science and Technology")}
                topCurve="bg-[#4AA96C]"
                rightCurve="bg-[#3B8E5D]"
                iconImg={"/assets/CatLogo/manager.png"}
              />

              {/* Dynamic sections for categories not hardcoded */}
              {(() => {
                const hardcodedCategories = ["Platinum", "Gold", "Quiz", "Core Engineering", "Coding", "Bot", "Fashion and Textile", "Science", "Science and Technology"];
                const otherCategories = [...new Set(filteredEvents.map(e => e.category).filter(cat => cat && !hardcodedCategories.includes(cat)))];

                return otherCategories.map(category => {
                  const categoryEvents = filteredEvents.filter(i => i.category === category);
                  if (categoryEvents.length === 0) return null;

                  return (
                    <div key={category}>
                      <h1 className="special-font text-3xl lg:text-4xl font-black text-center pt-8 uppercase" style={{ color: '#FFD700' }}>
                        {category.toUpperCase()}
                      </h1>
                      <EventsGrid
                        imgurl={"/thumbnail/goldthumb.png"}
                        arrowCircleStart="from-purple-500"
                        arrowCircleEnd="to-pink-500"
                        obj={categoryEvents}
                        topCurve="bg-[#010101]"
                        rightCurve="bg-[#010101]"
                        iconImg={"https://cdn-icons-png.flaticon.com/512/3309/3309977.png"}
                      />
                    </div>
                  );
                });
              })()}</div>
          </section>
        </div>
      )}
    </div>
  );
};

export default EventList;

const EventsGrid = ({
  obj,
  imgurl,
  arrowCircleStart,
  arrowCircleEnd,
  topCurve,
  rightCurve,
  iconImg,
  titleColor = "text-white",
  categoryOverride = "",
}) => {
  const toTitleCase = (phrase) => {
    const wordsToIgnore = ["of", "in", "for", "and", "a", "an", "or"];
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

  const filteredEvents = obj.filter((i) => i.eventId !== "EVNT0043");
  return (
    <div className="flex flex-wrap justify-center gap-8 py-12">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((i, index) => (
          <EventGrid
            key={index}
            title={toTitleCase(i.name)}
            description={""}
            date={i.date}
            time={i.time}
            iconImg={iconImg}
            imgurl={imgurl}
            arrowCircleStart={arrowCircleStart}
            arrowCircleEnd={arrowCircleEnd}
            topCurve={topCurve}
            rightCurve={rightCurve}
            to={`/portal/event/${i.id}`}
            titleColor={titleColor}
            category={categoryOverride || i.category}
          />
        ))
      ) : (
        <p className="text-gray-500">No events found</p>
      )}
    </div>
  );
};


