"use client";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EventGrid = ({
  handleClick = () => { },
  title = "",
  description = "",
  className = "",
  iconImg = "",
  date = "",
  time = "",
  arrowColor = "bg-[#181818]",
  imgurl = "",
  arrowCircleStart = "from-[#fff]",
  arrowCircleEnd = "to-[#fff]",
  topCurve = "bg-white",
  rightCurve = "bg-white",
  to = "",
}) => {
  const router = useRouter();
  // Mapping dates to corresponding days
  const dateToDayMap = {
    14: "Friday",
    15: "Saturday",
    16: "Sunday",
  };

  return (
    <button
      className="group relative transition-all hover:z-30 font-poppins w-full lg:w-[21rem] text-left"
      onClick={() => router.push(to)}
    >
      <div className="hidden lg:block absolute group-hover:shadow-lg opacity-0 -translate-y-20 group-hover:-translate-y-2 group-hover:opacity-100 left-0 top-[100%] w-full group-hover:scale-[110%] bg-gray-200 rounded-b-3xl px-4 pt-2 transition-all ease-in-out">
        <div className="flex flex-row py-4 text-gray-700 justify-evenly">
          <div className="pt-2">
            <p className="font-semibold text-center font-poppins">
              {date}
              {date === "23" ? <sup>rd</sup> : <sup>th</sup>} March
            </p>
            <p className="text-center font-poppins font-semibold">{dateToDayMap[date]}</p>
          </div>

          <div className="pt-2">
            <p className="font-semibold text-center font-poppins">{time}</p>
            <p className="text-center font-poppins">Time</p>
          </div>
        </div>
      </div>

      <div
        className={`${className} group-hover:shadow-lg z-20 text-lg text-blue rounded-xl lg:rounded-3xl overflow-hidden w-full  h-full relative bg-gray-200 lg:group-hover:scale-[110%] transition-all`}
      >
        <div className="relative z-0 w-full h-full">
          <Image
            src={imgurl}
            fill
            sizes="200"
            alt="cover"
            className="object-cover"
          />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center font-semibold text-white drop-shadow-lg tracking-wide text-center  px-4 ${title.length > 15
            ? "text-2xl sm:text-3xl md:text-5xl lg:text-2xl"
            : "text-3xl sm:text-4xl md:text-6xl lg:text-3xl"
            }`}
        >
          {title}
        </div>

        <div
          className={`hidden lg:block ${arrowColor} rounded-bl-3xl p-2 absolute top-0 right-0 z-20`}
        >
          <div className={`absolute top-0 -left-4 ${arrowColor}`}></div>
          <div
            onClick={(e) => {
              e.preventDefault();
              handleClick(e);
            }}
            className={`bg-gradient-to-tr ${arrowCircleStart} ${arrowCircleEnd} text-white rounded-full p-4 cursor-pointer`}
          >
            <FiArrowUpRight className="text-s text-white" />
          </div>
          <div className={`absolute -bottom-4 right-0 ${arrowColor}`}></div>
        </div>

        <div className="flex flex-row items-center p-6 pb-3 rounded-t-3xl lg:flex-col lg:items-start">
          <div className="flex items-center justify-center mr-4 bg-gray-200 rounded-full w-14 h-14 lg:mb-4">
            <div
              style={{
                background: `url("${iconImg}")`,
                backgroundPosition: "center",
                backgroundSize: "cover,contain",
                backgroundRepeat: "no-repeat",
              }}
              className="w-8 h-8"
            ></div>
          </div>

          <p className="font-semibold font-poppins text-xl w-[60%] text-gray-200 tracking-wider">
            {title}
          </p>
        </div>

        <div className="p-6 pt-3 text-gray-200 transition-all lg:rounded-b-3xl backdrop-blur-sm lg:backdrop-blur-md lg:group-hover:backdrop-blur-none">
          <p className="font-poppins text-base [display:-webkit-box] [-webkit-line-clamp:3] overflow-hidden [-webkit-box-orient:vertical]">
            {description}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 lg:hidden ">
          <div className="flex flex-row justify-between text-white mt-10 ">
            <div>
              <p className="font-semibold">
                {date}
                <sup>th</sup>March
              </p>
              <p className="text-center font-poppins font-semibold">{dateToDayMap[date]}</p>
            </div>
            <div>
              <p className="font-semibold">{time}</p>
              <p className="text-sm">Time</p>
            </div>
          </div>
        </div>

        <div className="w-full px-4 bg-gray-200 shadow-lg lg:hidden rounded-b-xl font-poppins">
          <div className="flex flex-row py-2 text-base text-gray-700 justify-evenly">
            <div className="pt-2">
              <p className="font-semibold text-center font-poppins">
                {date}
                {date === "23" ? <sup>rd</sup> : <sup>th</sup>} Feb
              </p>
              <p className="text-center font-poppins">Date</p>
            </div>

            <div className="pt-2">
              <p className="font-semibold text-center font-poppins">{time}</p>
              <p className="text-center font-poppins">Time</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default EventGrid;
