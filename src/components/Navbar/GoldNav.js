"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GoldNav = ({
  noMargin = false,
  goldEvents,
  isMobile = false,
  openState = [true, () => { }],
}) => {
  const [isOpen, setIsOpen] = openState;
  const [hideContent, setHideContent] = useState(false);
  const router = useRouter();

  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  useEffect(() => {
    if (!isOpen) {
      setHideContent(false);
    }
  }, [isOpen]);

  return (
    <div className="w-full flex flex-col mt-1 mb-4 space-y-1 ml-6 pl-3 border-l border-[#222]">
      {goldEvents.map((e, index) =>
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
  );
};

export default GoldNav;
