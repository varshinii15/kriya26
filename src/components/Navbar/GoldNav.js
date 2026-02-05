"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GoldNav = ({
  noMargin = false,
  goldEvents,
  isMobile = false,
  openState = [true, () => {}],
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
    <React.Fragment>
      <div
        className={`${"flex h-fit mb-4"} transition-all overflow-hidden flex flex-col`}
        id="navElements"
      >
        {goldEvents.map((e, index) =>
          isMobile ? (
            <button
              key={index}
              onClick={(event) => {
                setIsOpen(!isOpen);
                router.push(`/portal/event/${e.id}`);
              }}
              className="block w-full px-4 py-2 text-md text-white text-left text-gray-600 hover:text-gray-300"
            >
              {toTitleCase(e.name)}
            </button>
          ) : (
            <Link
              key={index}
              href={`/portal/event/${e.id}`}
              className="block w-full px-4 py-2 text-md text-white text-left text-gray-600 hover:text-gray-300"
            >
              {toTitleCase(e.name)}
            </Link>
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default GoldNav;
