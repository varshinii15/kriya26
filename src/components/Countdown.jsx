"use client";

import { useState, useEffect, useRef } from "react";
import DateSlider from "@/components/countdown/DateSlider";
import Countdown from "@/components/countdown/countdown";
import Main from "@/components/countdown/Main";
import { motion } from "framer-motion";

export default function CountDown() {
    const sectionRef = useRef(null);

    return (
        <main id="countdown-section" className="flex flex-col w-screen sm:h-screen overflow-hidden bg-black md:h-auto lg:h-screen xl:h-screen">
            {/* Date Slider - Always at top */}
            <div className="pt-6 pb-4 px-4">
                <DateSlider />
            </div>

            {/* Responsive container for Main and Countdown */}
            <div className="flex flex-col flex-1 w-full gap-6 py-4 md:gap-0 md:justify-between md:flex-row">
                {/* Countdown - Second on mobile, right on desktop */}
                <div className="w-full md:w-[50%] flex md:hidden">
                    <Countdown />
                </div>

                {/* Main - Third on mobile, left on desktop */}
                <div className="flex w-full md:w-[50%]">
                    <Main />
                </div>

                <div className=" w-full md:w-[50%] hidden md:flex">
                    <Countdown />
                </div>
            </div>
        </main>
    );
}
