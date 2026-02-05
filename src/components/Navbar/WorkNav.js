"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdClose, IoMdArrowDropright, IoMdLogOut } from "react-icons/io";

const WorkNav = ({
  noMargin = false,
  workshops,
  isMobile = false,
  openState = [true, () => {}],
}) => {
  const [isOpen, setIsOpen] = openState;
  const [hideContent, setHideContent] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setHideContent(false);
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      <div
        className={`${"flex h-fit"} transition-all overflow-hidden flex flex-col`}
        id="navElements"
      >
        {workshops
          .filter((item, index) => index < 3)
          .map((e, index) =>
            isMobile ? (
              <button
                key={index}
                onClick={(event) => {
                  setIsOpen(!isOpen);
                  router.push(`/portal/workshop/${e.id}`);
                }}
                className="block w-full px-4 py-2 text-sm text-white text-left text-gray-600 hover:text-text-gray-300"
              >
                {e.name}
              </button>
            ) : (
              <Link
                key={index}
                href={`/portal/workshop/${e.id}`}
                className="block w-full px-4 py-2 text-sm text-white text-left text-gray-600 hover:text-text-gray-300"
              >
                {e.name}
              </Link>
            )
          )}
      </div>
      <button
        className={`flex justify-between group items-center ${
          !noMargin && "mt-0"
        } my-2 pl-2`}
        onClick={() => setHideContent(!hideContent)}
        id="navElements"
      >
        <div>
          <IoMdArrowDropright
            className={`text-lg text-white ${
              hideContent ? "rotate-90" : "rotate-0"
            } transition-all`}
          />
        </div>
        <p className={`w-full text-sm text-white py-2 pl-1`}>
          {`${hideContent ? "Hide" : "Show More"}`}
        </p>
      </button>
      <div
        className={`${
          !hideContent ? "h-0 overflow-hidden" : "flex h-fit mb-8"
        } transition-all overflow-hidden flex flex-col`}
        id="navElements"
      >
        {workshops
          .filter((item, index) => index >= 3)
          .map((e, index) =>
            isMobile ? (
              <button
                key={index}
                onClick={(event) => {
                  setIsOpen(!isOpen);
                  router.push(`/portal/workshop/${e.id}`);
                }}
                className="block w-full px-4 py-2 text-sm text-left text-white hover:text-gray-300"
              >
                {e.name}
              </button>
            ) : (
              <Link
                key={index}
                href={`/portal/workshop/${e.id}`}
                className="block w-full px-4 py-2 text-sm text-left text-white hover:text-gray-300"
              >
                {e.name} 
              </Link>
            )
          )}
      </div>
    </React.Fragment>
  );
};

export default WorkNav;
