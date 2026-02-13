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

  const isTba = (value) => !value || String(value).trim().toLowerCase() === "tba";

  const getOrdinalSuffix = (day) => {
    const mod100 = day % 100;
    if (mod100 >= 11 && mod100 <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatEventDate = (rawDate) => {
    if (isTba(rawDate)) return null;
    const normalized =
      typeof rawDate === "object" && rawDate?.$date ? rawDate.$date : rawDate;
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) return null;
    const day = d.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };

  const parseStartTime = (rawTime) => {
    if (isTba(rawTime)) return null;
    const str = String(rawTime).trim();

    // Match first time occurrence: "9:30", "09.30", "9:30 AM", "14:05", etc.
    const match = str.match(/(\d{1,2})(?:[:.](\d{2}))?\s*([AaPp]\.?\s*[Mm]\.?)?/);
    if (!match) return null;

    let hour = Number(match[1]);
    const minute = Number(match[2] ?? "0");
    let meridiem = match[3] ? match[3].toLowerCase().replace(/\./g, "").replace(/\s+/g, "") : null;

    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

    // If AM/PM not provided, infer from 24h time when possible
    if (!meridiem) {
      if (hour === 0) {
        meridiem = "am";
        hour = 12;
      } else if (hour >= 13) {
        meridiem = "pm";
        hour = hour - 12;
      } else {
        // default to AM for 1-12 if unknown
        meridiem = "am";
      }
    } else {
      // Normalize hour based on explicit AM/PM
      const isPm = meridiem.startsWith("p");
      const isAm = meridiem.startsWith("a");
      if (isAm && hour === 12) hour = 12; // 12 AM edge case is ambiguous without date; keep as 12
      if (isPm && hour > 12) hour = hour; // keep
    }

    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    const ampm = meridiem.startsWith("p") ? "PM" : "AM";
    return `${hh}:${mm} ${ampm}`;
  };

  const formattedDate = formatEventDate(date);
  const formattedStartTime = parseStartTime(time);

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

  return (
    <button
      className="group relative transition-all hover:z-30 font-poppins w-full lg:w-84 text-left flex flex-col"
      onClick={() => router.push(to)}
    >
      <div className="hidden lg:block absolute group-hover:shadow-lg opacity-0 -translate-y-20 group-hover:-translate-y-2 group-hover:opacity-100 left-0 top-full w-full group-hover:scale-[110%] bg-gray-200 px-4 pt-2 transition-all ease-in-out">
        <div className="flex flex-row items-start justify-between gap-6 py-4 text-gray-700">
          <div className="min-w-0">
            <p className="font-semibold font-poppins text-left truncate">
              {formattedDate || "TBA"}
            </p>
          </div>
          <div className="shrink-0">
            <p className="font-semibold font-poppins text-right whitespace-nowrap">
              {formattedStartTime || "TBA"}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${className} group-hover:shadow-lg z-20 text-lg text-blue overflow-hidden w-full h-64 md:h-65 lg:h-55  relative bg-gray-200 lg:group-hover:scale-[110%] transition-all`}
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
      </div>

      <div className="w-full px-4 bg-gray-200 shadow-lg lg:hidden font-poppins">
        <div className="flex flex-row items-start justify-between gap-6 py-3 text-base text-gray-700">
          <p className="font-semibold text-left font-poppins truncate">
            {formattedDate || "TBA"}
          </p>
          <p className="font-semibold text-right font-poppins whitespace-nowrap">
            {formattedStartTime || "TBA"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default EventGrid;
