"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose, IoMdArrowDropright, IoMdLogOut } from "react-icons/io";
import Link from "next/link";

const EventNav = ({
  category,
  noMargin = false,
  events,
  isMobile = false,
  openState = [true, () => { }],
}) => {
  const [isOpen, setIsOpen] = openState;
  const [hideContent, setHideContent] = useState(false);

  const router = useRouter();

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

  const handleCategoryClick = () => {
    setHideContent(!hideContent);

    // If we're on the portal event page, try to scroll to the section
    const categoryIdMap = {
      "Coding": "coding",
      "Science and Technology": "science",
      "Bot": "bot",
      "Quiz": "quiz",
      "Core Engineering": "core",
      "Fashion and Textile": "fashion",
      "Platinum": "platinum",
      "Gold": "gold"
    };

    const targetId = categoryIdMap[category];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHideContent(false);
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      <button
        className={`flex justify-between group items-center w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] border border-transparent hover:border-[#333] ${!noMargin ? "my-1" : ""
          }`}
        onClick={handleCategoryClick}
        id="navElements"
      >
        <div className="flex items-center space-x-2">
          <IoMdArrowDropright
            className={`text-xl text-gray-500 group-hover:text-white transition-transform duration-300 ${hideContent ? "rotate-90 text-white" : "rotate-0"
              }`}
          />
          <p
            className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200 ${hideContent ? "text-white" : "text-gray-400 group-hover:text-white"
              }`}
          >
            {category}
          </p>
        </div>
        {events && events.length > 0 && (
          <span className="text-[10px] bg-[#333] text-gray-400 px-1.5 py-0.5 rounded-full font-mono flex items-center">
            {events.filter((e) => e.category === category).length}
          </span>
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${hideContent ? "max-h-[1000px] opacity-100 mb-4" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col ml-6 pl-3 border-l border-[#222] mt-1 space-y-1">
          {events
            .filter((e) => e.category === category)
            .map((e, index) =>
              isMobile ? (
                <button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/portal/event/${e.id}`);
                  }}
                  className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
                >
                  {toTitleCase(e.name)}
                </button>
              ) : (
                <Link
                  key={index}
                  href={`/portal/event/${e.id}`}
                  className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
                >
                  {toTitleCase(e.name)}
                </Link>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default EventNav;
