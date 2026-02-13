"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdClose, IoMdArrowDropright, IoMdLogOut } from "react-icons/io";

const WorkNav = ({
  noMargin = false,
  workshops,
  isMobile = false,
  openState = [true, () => { }],
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
    <div className="w-full">
      <div className="flex flex-col ml-6 pl-3 border-l border-[#222] mt-1 space-y-1">
        {workshops
          .filter((item, index) => index < 3)
          .map((e, index) =>
            isMobile ? (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/portal/workshop/${e.id}`);
                }}
                className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
              >
                {e.name}
              </button>
            ) : (
              <Link
                key={index}
                href={`/portal/workshop/${e.id}`}
                className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
              >
                {e.name}
              </Link>
            )
          )}
      </div>

      {workshops.length > 3 && (
        <>
          <button
            className="flex items-center space-x-2 px-6 py-2 group cursor-pointer"
            onClick={() => setHideContent(!hideContent)}
          >
            <IoMdArrowDropright
              className={`text-lg text-gray-500 group-hover:text-white transition-transform duration-300 ${hideContent ? "rotate-90 text-white" : "rotate-0"
                }`}
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">
              {hideContent ? "Show Less" : "Show More"}
            </p>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${hideContent ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="flex flex-col ml-6 pl-3 border-l border-[#222] space-y-1">
              {workshops
                .filter((item, index) => index >= 3)
                .map((e, index) =>
                  isMobile ? (
                    <button
                      key={index}
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/portal/workshop/${e.id}`);
                      }}
                      className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
                    >
                      {e.name}
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={`/portal/workshop/${e.id}`}
                      className="block w-full py-1.5 text-xs text-gray-400 hover:text-white text-left transition-colors duration-200 truncate"
                    >
                      {e.name}
                    </Link>
                  )
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkNav;
