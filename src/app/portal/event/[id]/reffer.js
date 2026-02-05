"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import {
  fetchEventById,
  fetchEventDetailsByEmail,
  fetchEventRegister,
  fetchUserByEmail,
} from "../../../../API/call";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import particleOptions from "../../../../../ParticleOptions";

const Event = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generalPayment, setGeneralPayment] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userEventDetails, setUserEventDetails] = useState(null);

  const particlesInit = useCallback(async (engine) => {

    await loadSlim(engine);
  }, []);

  const particlesLoaded = (container) => {
  };

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

  const [eventDetail, setEventDetail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      fetchUserByEmail().then((res) => {
        setUserDetails(res.data.user);
        setIsLoggedIn(true);
        setGeneralPayment(res.data.user.isPaid);
      });
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      fetchEventDetailsByEmail().then((res) => {
        setUserEventDetails(res.data);
      });
    }
  }, []);

  useEffect(() => {
    setEventDetail(fetchEventById(id));
  }, [id]);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      router.push("/auth?type=signup");
    } else if (!generalPayment) {
      router.push("/auth/payment?type=GENERAL");
    } else {
      await fetchEventRegister({
        email: localStorage.getItem("email"),
        eventId: id,
      }).then((res) => {
        window.location.reload();
      });
    }
  };

  return !eventDetail ? (
    <section className="w-full h-screen py-12 overflow-y-scroll lg:px-16 font-poppins pt-36 lg:pt-12">
      <p className="px-8 text-xl text-white">Loading...</p>
    </section>
  ) : (
    <section className="w-full h-screen py-12 overflow-y-scroll lg:px-16 font-poppins pt-36 lg:pt-12">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute top-0 left-0"
        height="100vh"
        width="100vh"
        options={particleOptions}
      />
      <h2 className="px-8 mb-2 text-base tracking-widest text-gray-400 lg:px-0">
        {eventDetail.category}
      </h2>
      <div className="w-fit">
        <h1 className="px-8 text-3xl font-semibold text-white lg:px-0">
          {toTitleCase(eventDetail.eventName)}
        </h1>
        <div className="w-[60%] lg:w-[80%] ml-8 lg:ml-0 mt-2 h-[4px] bg-gradient-to-r rounded-[2px] from-[#3b82f6] to-[#8b5cf6]"></div>
      </div>
      <p className="text-white text-justify mt-8 text-base w-full lg:w-[90%] pb-8 px-8 lg:px-0">
        {eventDetail.description}
      </p>

      <div className="flex flex-col w-full gap-4 my-4 text-black lg:flex-row lg:px-0">
        <div className="relative w-full px-8 py-8 space-y-12 bg-white lg:w-2/3 lg:rounded-3xl lg:p-12">
          {eventDetail.eventId === "EVNT0043" ? (
            <div className="flex w-full">
              <div className="z-30 flex-1 space-y-2">
                <p className="text-base lg:text-base text-justify text-[#3c4043] pt-4 lg:pt-0">
                  <div>
                    <p>
                      Are you passionate about getting your dream IT job and
                      don’t know how? Join us for a FREE &quot;IT Career Guidance and
                      Placement Assistance&quot; workshop! This power-packed session
                      will equip you with:
                      <br />
                      <br />
                      <ul className="list-disc text-base text-[#3c4043] pl-4 space-y-2">
                        <li>
                          Expert insights into in-demand IT skills and career
                          paths.
                        </li>
                        <li>
                          Insider tips on crafting a winning resume and acing
                          interviews.
                        </li>
                        <li>
                          Exclusive guidance on navigating the placement
                          process.
                        </li>
                        <li>
                          Direct interaction with industry professionals from
                          Vites Technologies.
                        </li>
                        <li>
                          Networking opportunities with fellow tech enthusiasts
                        </li>
                        <li>Gain a competitive edge in the job market.</li>
                      </ul>
                    </p>
                    <br />
                  </div>
                </p>
              </div>
            </div>
          ) : (
            <>
              <RoundDescription
                roundNumber={1}
                title={eventDetail.round_title_1}
                description={eventDetail.round_desc_1}
              />

              {eventDetail?.round_title_2?.length > 0 &&
                eventDetail?.round_desc_2?.length > 0 && (
                  <RoundDescription
                    roundNumber={2}
                    title={eventDetail.round_title_2}
                    description={eventDetail.round_desc_2}
                  />
                )}

              {eventDetail?.round_title_3?.length > 0 &&
                eventDetail?.round_desc_3?.length > 0 && (
                  <RoundDescription
                    roundNumber={3}
                    title={eventDetail?.round_title_3}
                    description={eventDetail?.round_desc_3}
                  />
                )}

              {eventDetail?.round_title_4?.length > 0 &&
                eventDetail?.round_desc_4?.length > 0 && (
                  <RoundDescription
                    roundNumber={4}
                    title={eventDetail.round_title_4}
                    description={eventDetail.round_desc_4}
                  />
                )}
            </>
          )}
        </div>
        <div className="flex flex-col justify-between w-full space-y-4 lg:w-1/3">
          {eventDetail.closed ? (
            <div className="flex justify-center p-8 space-y-4 text-center lg:bg-white lg:rounded-3xl lg:p-12 lg:text-left lg:justify-start">
              <span className="text-3xl lg:text-3xl font-semibold tracking-wide bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
                Registrations Closed
              </span>
            </div>
          ) : (
            <button
              className="flex justify-center p-8 space-y-4 text-center lg:bg-white lg:rounded-3xl lg:p-12 lg:text-left lg:justify-start"
              onClick={() => {
                !userEventDetails.find((i) => i.eventId === id) &&
                  (window.confirm("Are you sure you want to register ?")
                    ? handleRegister()
                    : console.log("Cancelled"));
              }}
            >
              {userEventDetails && (
                <span className="text-3xl lg:text-3xl font-semibold tracking-wide bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
                  {userEventDetails.find((i) => i.eventId === id)
                    ? "Registered"
                    : "Register Here!"}
                </span>
              )}
            </button>
          )}
          {/* <p className="bg-gradient-to-r from-[#C80067] to-[#7470ff] py-4 px-6 rounded-xl shadow-lg shadow-gray-900 lg:shadow-md w-fit text-white text-2xl hover:underline">Register Here !</p> */}

          <div className="bg-[#ffffff] flex flex-col lg:rounded-3xl p-8 lg:p-12 space-y-2 justify-center">
            <div className="flex flex-row items-center gap-4 lg:gap-4">
              <p className="text-6xl lg:text-6xl font-semibold tracking-wide text-[#3c4043]">
                {eventDetail.date}
              </p>
              <div className="flex flex-col">
                <p className="text-lg font-semibold tracking-wide text-[#3c4043]">
                  February
                </p>
                <p className="text-lg font-semibold tracking-wide text-[#3c4043]">
                  2024
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 lg:gap-6">
              <p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
                <MdAccessTime />
              </p>
              <div className="flex flex-col pl-2">
                <p className="text-base lg:text-base font-semibold tracking-wider text-[#3c4043]">
                  {eventDetail.timing}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 lg:gap-6">
              <p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
                <MdOutlineLocationOn />
              </p>
              <div className="flex flex-col pl-2">
                <p
                  className={`text-base ${eventDetail.hall.length > 15 ? "lg:text-base" : "lg:text-lg"
                    } font-semibold tracking-wider text-[#3c4043]`}
                >
                  {eventDetail.hall}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 lg:gap-6">
              <p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
                {eventDetail.teamSize !== "1" ? (
                  <AiOutlineTeam />
                ) : (
                  <AiOutlineUser />
                )}
              </p>
              <div className="flex flex-col pl-2">
                <p className="text-base lg:text-lg font-semibold tracking-wide text-[#3c4043]">
                  {eventDetail.teamSize} Member
                  {eventDetail.teamSize !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {eventDetail.teamSize !== "1" && (
              <div>
                <p className="text-2xl font-semibold tracking-wide py-4 text-[#3c4043]">
                  Note
                </p>
                <ul className="list-disc text-base text-[#3c4043] pl-4 space-y-2">
                  <li>
                    For team events,{" "}
                    <b className="font-semibold">every member</b> of the team is
                    required to register for the event and pay the general
                    registration fee.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="lg:bg-[#ffffff] flex-1 flex flex-col lg:rounded-3xl p-8 lg:px-0 lg:pb-0 lg:pt-12 space-y-6">
            <p className="text-3xl lg:text-3xl font-semibold tracking-wide text-white lg:text-[#3c4043] lg:px-12">
              Contact
            </p>

            <div className="flex flex-row items-center justify-between lg:px-12">
              <div className="w-1/2 lg:w-1/2">
                <p className="text-base lg:text-base font-semibold tracking-wide text-white lg:text-[#3c4043]">
                  {toTitleCase(eventDetail.contact_name_1)}
                </p>
                <p className="text-base lg:text-sm tracking-wide text-white lg:text-[#3c4043]">
                  {eventDetail.contact_mobile_1}
                </p>
              </div>
              <div className="space-x-8">
                <button
                  onClick={() => {
                    window.open(`tel:${eventDetail.contact_mobile_1}`);
                  }}
                >
                  <IoMdCall className="text-white hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
                </button>
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/${eventDetail.contact_mobile_1}`
                    );
                  }}
                >
                  <IoLogoWhatsapp className="text-white hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
                </button>
              </div>
            </div>

            {eventDetail.eventId === "EVNT0043" ? (
              <></>
            ) : (
              <div className="flex flex-row items-center justify-between lg:px-12">
                <div className="w-1/2 lg:w-1/2">
                  <p className="text-base lg:text-base font-semibold tracking-wide text-white lg:text-[#3c4043]">
                    {toTitleCase(eventDetail.contact_name_2)}
                  </p>
                  <p className="text-base lg:text-sm tracking-wide text-white lg:text-[#3c4043]">
                    {eventDetail.contact_mobile_2}
                  </p>
                </div>
                <div className="space-x-8">
                  <button
                    onClick={() => {
                      window.open(`tel:${eventDetail.contact_mobile_2}`);
                    }}
                  >
                    <IoMdCall className="text-white hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        `https://wa.me/${eventDetail.contact_mobile_2}`
                      );
                    }}
                  >
                    <IoLogoWhatsapp className="text-white hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
                  </button>
                </div>
              </div>
            )}

            <div
              className="flex-1 hidden lg:block rounded-b-3xl"
              style={{
                background:
                  "linear-gradient(to bottom, white 10%, rgba(255,255,255,0) 100%), url(/assets/Design/heightFiller.png) ",
                backgroundSize: "350%",
              }}
            ></div>
          </div>
        </div>
      </div>

      {eventDetail.eventRules && eventDetail.eventRules.length > 0 && (
        <div className="flex flex-row w-full gap-4 my-4 lg:px-0">
          <div className="bg-[#ffffff] w-full lg:rounded-3xl p-8 lg:p-12 space-y-4">
            <p className="text-3xl font-semibold tracking-wider text-[#3c4043]">
              Rules
            </p>
            <ul className="list-disc text-base tracking-wide text-justify text-[#3c4043] pl-4">
              {eventDetail.eventRules.split("\n").map((rule, index) => (
                <div key={index}>
                  {rule.startsWith("->") ? (
                    <li key={index} className="ml-4">
                      {rule.substring(2)}
                    </li>
                  ) : (
                    <li key={index}>{rule}</li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

const RoundDescription = ({ roundNumber, description, title = "" }) => {
  const toTitleCase = (phrase) => {
    const wordsToIgnore = ["of", "in", "for", "and", "a", "an", "or", "the"];
    const formattedPhrase = phrase
      .toLowerCase()
      .split(" ")
      .map((word) => {
        if (wordsToIgnore.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    return formattedPhrase.charAt(0).toUpperCase() + formattedPhrase.slice(1);
  };

  return (
    <div className="flex w-full ">
      <p className="hidden lg:block w-28 pr-4 text-9xl font-jetbrains tracking-wider text-[#3c4043] z-10 opacity-40 text-right">
        {roundNumber}
      </p>
      <div className="z-30 flex-1 space-y-2">
        {title.length > 0 && title.split(" ")[0].toLowerCase() !== "round" ? (
          <React.Fragment>
            <p className="tracking-wider uppercase">ROUND {roundNumber}</p>
            <div className="flex flex-row items-end gap-y-4">
              <p className="text-3xl font-semibold tracking-wide text-[#3c4043]">
                {toTitleCase(title)}
              </p>
            </div>
          </React.Fragment>
        ) : (
          <div className="flex flex-row items-end gap-y-4">
            <p className="text-3xl font-semibold tracking-wide text-[#3c4043]">
              ROUND {roundNumber}
            </p>
          </div>
        )}
        <div className="text-base lg:text-base text-justify text-[#3c4043] pt-4 lg:pt-0">
          {description.split("\n").map((desc, index) => (
            <div key={index}>
              <p>{desc}</p>
              <br></br>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
