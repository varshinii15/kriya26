'use client';

import React, { useState, useEffect } from "react";
import { eventService } from "../services/eventservice";
import PaperPresentationItemDesktop from './paper_presentation/PaperPresentationItemDesktop';
import PaperPresentationItemMobile from './paper_presentation/PaperPresentationItemMobile';
import AnimatedTitle from './AnimatedTitle';

const STATIC_IMAGES = [
    "/img/papers/pp1.png",
    "/img/papers/pp2.png",
    "/img/papers/pp3.png",
    "/img/papers/pp4.png",
    "/img/papers/pp5.png",
    "/img/papers/pp6.png",
    "/img/papers/pp7.png",
    "/img/papers/pp8.png",
    "/img/papers/pp9.png",
    "/img/papers/pp10.png",
];

const PaperPresentation = () => {
    const [onMouseHoverIndex, setOnMouseHoverIndex] = useState(0);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPapers = async () => {
            try {
                setLoading(true);
                const response = await eventService.getAllPapers();

                // Handle different response formats
                let papersData = [];
                if (Array.isArray(response)) {
                    papersData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    papersData = response.data;
                } else if (response?.papers && Array.isArray(response.papers)) {
                    papersData = response.papers;
                }

                // Map static images to papers
                const papersWithImages = papersData.map((paper, index) => ({
                    ...paper,
                    image: STATIC_IMAGES[index % STATIC_IMAGES.length],
                }));

                setPapers(papersWithImages);
                setError(null);
            } catch (error) {
                // Only log non-404 errors to avoid console spam
                if (error.response?.status !== 404) {
                    console.error("Error loading papers:", error);
                }
                // Check if it's a 404 error
                if (error.response?.status === 404) {
                    setError("Paper presentations API not available yet");
                } else {
                    setError("Failed to load papers");
                }
                setPapers([]);
            } finally {
                setLoading(false);
            }
        };
        loadPapers();
    }, []);

    if (loading) {
        return (
            <section className="min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center py-20 px-4">
                <div className="flex items-center justify-center w-full h-full">
                    <div className="text-gray-600 text-lg">Loading papers...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center py-20 px-4">
                <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                        <div className="text-yellow-500 text-lg mb-2">{error}</div>
                        <div className="text-gray-500 text-sm">Paper presentations will be available soon</div>
                    </div>
                </div>
            </section>
        );
    }

    if (papers.length === 0) {
        return (
            <section className="min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center py-20 px-4">
                <div className="flex items-center justify-center w-full h-full">
                    <div className="text-gray-500 text-lg">No papers available</div>
                </div>
            </section>
        );
    }
    return (
        <section id="paper-presentation-section" className="min-h-screen w-full bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Desktop Layout */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto hidden lg:flex flex-col lg:flex-row items-center justify-center min-h-screen py-20 px-4 gap-8">
                <div className="w-full lg:w-[60%] xl:w-[65%] h-[500px] md:h-[600px] flex-shrink-0">
                    <div className="flex items-center justify-center w-full h-full md:pr-16 space-x-2">
                        {papers.map((data, index) => (
                            <PaperPresentationItemDesktop
                                key={index}
                                index={index}
                                onMouseHoverIndex={onMouseHoverIndex}
                                setOnMouseHoverIndex={setOnMouseHoverIndex}
                                data={data}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-[35%] xl:w-[30%] text-center lg:text-left flex flex-col justify-center">
                    <AnimatedTitle
                        title="<b>R</b>esearch <br /> <b>P</b>aper <br /> <b>P</b>resentations"
                        containerClass="special-font text-black drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    />
                    <p className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider mt-4  text-blue-400 text-center ">
                        <b>( K</b><b>r</b><b>iya 2026 )</b>
                    </p>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="relative z-10 w-full mx-auto flex lg:hidden flex-col h-[90vh]">
                {/* Header Section */}
                <div className="w-full text-center pt-8 pb-6 px-4 flex-shrink-0">
                    <AnimatedTitle
                        title="<b>R</b>esearch <b>P</b>aper <br /> <b>P</b>resentations"
                        containerClass="special-font text-black drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] text-3xl md:text-4xl"
                    />
                    <p className="special-font text-xl md:text-2xl font-black uppercase tracking-wider mt-3" style={{ color: '#9146FF' }}>
                        (<b>K</b>riya 2026)
                    </p>
                </div>

                {/* Cards Section - Full Height */}
                <div className="flex-1 w-full px-4 pb-20 min-h-0">
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide h-full items-center" 
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}>
                        {papers.map((data, index) => (
                            <PaperPresentationItemMobile
                                key={index}
                                data={data}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50 cursor-pointer transition-all duration-300 hover:scale-110">{/* Mobile Layout */}
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
