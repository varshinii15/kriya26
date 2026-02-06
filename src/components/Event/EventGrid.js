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
  titleColor = "text-white",
  category = "",
}) => {
  const router = useRouter();
  
  // Function to get arrow color based on category
  const getCategoryColor = (category) => {
    const categoryLower = category?.toLowerCase() || "";
    
    if (categoryLower === "platinum") return "#C0C0C0"; // Silver
    if (categoryLower === "gold") return "#D9972B"; // Gold
    if (categoryLower === "quiz") return "#98D0FF"; // Blue
    if (categoryLower === "core engineering") return "#F34F44"; // Red
    if (categoryLower === "coding") return "#3AC49C"; // Green
    if (categoryLower === "bot") return "#3AC49C"; // Green (same as coding)
    if (categoryLower === "fashion and textile") return "#B48EEB"; // Purple
    if (categoryLower === "science and technology") return "#B0E369"; // Light Green
    
    return "#181818"; // Default dark color
  };
  
  const categoryArrowColor = getCategoryColor(category);
  
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
      <div className="hidden lg:block absolute group-hover:shadow-lg opacity-0 -translate-y-20 group-hover:-translate-y-2 group-hover:opacity-100 left-0 top-[100%] w-full group-hover:scale-[110%] bg-gray-200 px-4 pt-2 transition-all ease-in-out">
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
        className={`${className} group-hover:shadow-lg z-20 text-lg text-blue overflow-hidden w-full  h-full relative bg-gray-200 lg:group-hover:scale-[110%] transition-all`}
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
          className={`absolute inset-0 flex items-center justify-center font-semibold ${titleColor} drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] tracking-wide text-center  px-4 ${title.length > 15
            ? "text-2xl sm:text-3xl md:text-5xl lg:text-2xl"
            : "text-3xl sm:text-4xl md:text-6xl lg:text-3xl"
            }`}
          style={{ mixBlendMode: 'difference', filter: 'brightness(2) contrast(1.5) saturate(1.2)' }}
        >
          {title}
        </div>

        <div
          className="hidden lg:block absolute top-3 right-3 z-20"
        >
          <div 
            className="absolute top-0 -left-4"
            style={{ backgroundColor: categoryArrowColor }}
          ></div>
          <div
            onClick={(e) => {
              e.preventDefault();
              handleClick(e);
            }}
            className="text-white p-4 cursor-pointer"
            style={{ backgroundColor: categoryArrowColor }}
          >
            <FiArrowUpRight className="text-s text-white" />
          </div>
          <div 
            className="absolute -bottom-4 right-0"
            style={{ backgroundColor: categoryArrowColor }}
          ></div>
        </div>

        <div className="flex flex-row items-center p-6 pb-3 lg:flex-col lg:items-start">
          <div className="flex items-center justify-center mr-4 bg-gray-200 w-14 h-14 lg:mb-4">
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

          <p className="font-semibold font-poppins text-xl w-[60%] text-gray-200 tracking-wider drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" style={{ mixBlendMode: 'difference', filter: 'brightness(2) contrast(1.5) saturate(1.2)' }}>
            {title}
          </p>
        </div>

        <div className="p-6 pt-3 text-gray-200 transition-all backdrop-blur-sm lg:backdrop-blur-md lg:group-hover:backdrop-blur-none">
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

        <div className="w-full px-4 bg-gray-200 shadow-lg lg:hidden font-poppins">
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
