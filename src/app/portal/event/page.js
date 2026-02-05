"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FaSoundcloud } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { eventService } from "../../../services/eventservice";
import "../../../styles/gradientAnimation.css";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import particleOptions from "../../../../ParticleOptions";
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

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = (container) => { };

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
        const mappedEvents = eventsData.map((event) => ({
          name: event.eventName || event.name,
          id: event.eventId || event.id,
          date: event.date ? new Date(event.date).toLocaleDateString() : "TBA",
          category: event.category,
          time: event.timing || event.time || "TBA",
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
                date: event.date ? new Date(event.date).toLocaleDateString() : "TBA",
                category: event.category,
                time: event.timing || event.time || "TBA",
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
                date: event.date ? new Date(event.date).toLocaleDateString() : "TBA",
                category: event.category,
                time: event.timing || event.time || "TBA",
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
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.includes(searchTerm) ||
      event.time.includes(searchTerm)
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
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute top-0 left-0"
        height="100vh"
        width="100vh"
        options={particleOptions}
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
          <div className="flex justify-center mb-8 px-4">
            <input
              type="text"
              placeholder="Search by name, date, or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-md w-full sm:w-3/4 lg:w-1/2 max-w-lg text-black"
            />
          </div>
          <section className="relative flex flex-col items-center w-full  px-6 overflow-x-hidden h-fit lg:overflow-hidden font-poppins lg:px-8 lg:block">
            {/* <div className="w-full my-8 lg:mt-0">
          <h1 className={`text-4xl lg:text-6xl text-white font-semibold font-poppins text-center py-2`}
            id="soon-text"
          >
            ✨ EVENTS ✨
          </h1>
        </div> */}
            {/* FEATURED PLATINUM EVENTS (by ID) */}
            <div hidden={featuredPlatinumEvents.length === 0}>
              <h1
                className={`${TextFont} text-4xl bg-gradient-to-r from-[#d1c5bc] to-[#a89e97] bg-clip-text text-transparent lg:text-5xl tracking-wide font-bold text-center text-[#d1c5bc] pt-8`}
                id="platinum"
              >
                FEATURED PLATINUM EVENTS
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/platinumthumb.jpg"}
                arrowCircleStart="from-[#9c8f86]"
                arrowCircleEnd="to-[#d1c5bc]"
                obj={featuredPlatinumEvents}
                topCurve="bg-[#010101]"
                rightCurve="bg-[#010101]"
                iconImg={
                  "https://cdn-icons-png.flaticon.com/512/3309/3309977.png"
                }
              />
            </div>

            {/* FEATURED GOLD EVENTS (by ID) */}
            <div hidden={featuredGoldEvents.length === 0}>
              <h1
                className={`${TextFont} text-4xl bg-gradient-to-r from-[#ffee35] to-[#ffa228] bg-clip-text text-transparent lg:text-5xl tracking-wide font-bold text-center text-[#FFC92F] pt-8`}
                id="gold"
              >
                FEATURED GOLD EVENTS
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/goldthumb.jpg"}
                arrowCircleStart="from-[#8B5523]"
                arrowCircleEnd="to-[#F2CC3E]"
                obj={featuredGoldEvents}
                topCurve="bg-[#010101]"
                rightCurve="bg-[#010101]"
                iconImg={
                  "https://cdn-icons-png.flaticon.com/512/3309/3309977.png"
                }
              />
            </div>
            <div
              hidden={
                filteredEvents.filter((i) => i.category === "Quiz").length === 0
              }
            >
              <h1
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8 `}
                id="quiz"
                hidden={
                  filteredEvents.filter((i) => i.category === "Quiz").length === 0
                }
              >
                <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-[#e425cc]">
                  QUIZ
                </span>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/quizthumb.jpg"}
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
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8`}
                id="core"
                hidden={
                  filteredEvents.filter((i) => i.category === "Core Engineering")
                    .length === 0
                }
              >
                <span className="${TextFont} bg-clip-text [-webkit-text-fill-color:transparent] bg-[#01c3d3]">
                  CORE ENGINEERING
                </span>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/corethumb.jpg"}
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
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8`}
                id="coding"
                hidden={
                  filteredEvents.filter((i) => i.category === "Coding").length ===
                  0
                }
              >
                <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-[#FFAF74]">
                  CODING
                </span>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/codingthumb.jpg"}
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
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8`}
                id="bot"
                hidden={
                  filteredEvents.filter((i) => i.category === "Bot").length === 0
                }
              >
                <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-[#FCB1AE]">
                  BOT
                </span>
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
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8`}
                id="fashion"
                hidden={
                  filteredEvents.filter(
                    (i) => i.category === "Fashion and Textile"
                  ).length === 0
                }
              >
                <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-[#ea20e3]">
                  FASHION & TEXTILE
                </span>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/fashionthumb.jpg"}
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
                className={`${TextFont} text-3xl lg:text-4xl font-bold text-center pt-8`}
                id="science"
                hidden={
                  filteredEvents.filter((i) => i.category === "Science and Technology")
                    .length === 0
                }
              >
                <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-[#AEFCC4]">
                  SCIENCE & TECHNOLOGY
                </span>
              </h1>
              <EventsGrid
                imgurl={"/thumbnail/sciencethumb.jpg"}
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
                      <h1 className={` text-3xl lg:text-4xl font-bold text-center pt-8`}>
                        <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-r from-purple-400 to-pink-600">
                          {category.toUpperCase()}
                        </span>
                      </h1>
                      <EventsGrid
                        imgurl={"/thumbnail/goldthumb.jpg"}
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
          />
        ))
      ) : (
        <p className="text-gray-500">No events found</p>
      )}
    </div>
  );
};


