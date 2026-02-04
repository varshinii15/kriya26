'use client';

import React from 'react';
import PaperDesktop from './paper presentation/PaperDesktop';
import AnimatedTitle from './AnimatedTitle';

const PaperPresentation = () => {
    return (
        <section className="min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center py-20 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content - Horizontal Layout */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">

                {/* LEFT SIDE - Paper Cards */}
                <div className="w-full lg:w-[60%] xl:w-[65%] h-[500px] md:h-[600px] flex-shrink-0">
                    <PaperDesktop />
                </div>

                {/* RIGHT SIDE - Heading */}
                <div className="w-full lg:w-[35%] xl:w-[30%] text-center lg:text-left flex flex-col justify-center">
                    <AnimatedTitle
                        title="<b>R</b>esearch <br /> <b>P</b>aper <br /> <b>P</b>resentations"
                        containerClass="special-font text-black drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    />
                    <p className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider mt-4" style={{ color: '#9146FF' }}>
                        (<b>K</b>riya 2026)
                    </p>
                </div>

            </div>

            {/* Floating Chat Icon */}
            <div className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50 cursor-pointer transition-all duration-300 hover:scale-110">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-7 h-7"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                </svg>
            </div>
        </section>
    );
};

export default PaperPresentation;
