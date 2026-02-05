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
  openState = [true, () => {}],
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

  useEffect(() => {
    if (!isOpen) {
      setHideContent(false);
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      <button
        className={`flex justify-between group items-center ${
          !noMargin && "mt-0"
        } my-2`}
        onClick={() => setHideContent(!hideContent)}
        id="navElements"
      >
        <div>
          <IoMdArrowDropright
            className={`text-lg text-gray-500 ${
              hideContent ? "rotate-90" : "rotate-0"
            } transition-all`}
          />
        </div>
        <p
          className={`w-full text-sm uppercase tracking-widest text-white py-2 pl-1`}
        >
          {category}
        </p>
      </button>
      <div
        className={`${
          !hideContent ? "h-0 overflow-hidden" : "flex h-fit mb-8"
        } transition-all overflow-hidden flex flex-col`}
        id="navElements"
      >
        {events
          .filter((e) => e.category === category)
          .map((e, index) =>
            isMobile ? (
              <button
                key={index}
                onClick={(event) => {
                  setIsOpen(!isOpen);
                  router.push(`/portal/event/${e.id}`);
                }}
                className="block w-full px-8 py-2 text-sm text-white text-left text-gray-600 hover:text-gray-300"
              >
                {toTitleCase(e.name)}
              </button>
            ) : (
              <Link
                key={index}
                href={`/portal/event/${e.id}`}
                className="block w-full px-8 py-2 text-sm text-white text-left text-gray-600 hover:text-gray-300"
              >
                {toTitleCase(e.name)}
              </Link>
            )
          )}
      </div>
    </React.Fragment>
  );
};

export default EventNav;
