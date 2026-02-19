"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventService } from "../../../services/eventservice";
import "../../../styles/gradientAnimation.css";
import PixelSnow from "../../../components/PixelSnow/PixelSnow";
import EventGrid from "../../../components/Event/EventGrid";
import "../../../styles/Landing.css";

const PaperList = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadPapers = async () => {
            try {
                setLoading(true);
                const response = await eventService.getAllPapers();

                let papersData = [];
                if (Array.isArray(response)) {
                    papersData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    papersData = response.data;
                } else if (response?.papers && Array.isArray(response.papers)) {
                    papersData = response.papers;
                }

                const normalizeMongoDate = (d) => {
                    if (!d) return null;
                    if (typeof d === "string") return d;
                    if (typeof d === "object" && d.$date) return d.$date;
                    return null;
                };

                const mappedPapers = papersData
                    .map((paper) => ({
                        name: paper.eventName || paper.name,
                        id: paper.paperId || paper.eventId || paper.id,
                        date: normalizeMongoDate(paper.date) || "TBA",
                        category: paper.category || "Paper Presentation",
                        time: paper.startTime || paper.timing || paper.time || "TBA",
                    }))
                    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

                setPapers(mappedPapers);
                setError(null);
            } catch (error) {
                console.error("Error loading papers:", error);
                setError("Failed to load paper presentations");
                setPapers([]);
            } finally {
                setLoading(false);
            }
        };

        loadPapers();
    }, []);

    useEffect(() => {
        localStorage.setItem("hasVideoPlayed", "false");
    }, []);

    const filteredPapers = papers.filter(
        (paper) =>
            searchTerm === "" ||
            paper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (paper.category &&
                paper.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toTitleCase = (phrase) => {
        const wordsToIgnore = ["of", "in", "for", "and", "a", "an", "or"];
        const wordsToCapitalize = ["it", "cad"];
        return phrase
            .toLowerCase()
            .split(" ")
            .map((word) => {
                if (wordsToIgnore.includes(word)) return word;
                if (wordsToCapitalize.includes(word)) return word.toUpperCase();
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };

    return (
        <div className="w-full h-screen py-12 pt-24 overflow-y-scroll font-poppins lg:pt-12">
            <PixelSnow
                className="fixed top-0 left-0 w-full h-full"
                color="#ffffff"
                flakeSize={0.015}
                minFlakeSize={1.25}
                pixelResolution={200}
                speed={1.5}
                depthFade={8}
                farPlane={20}
                brightness={10}
                gamma={0.4545}
                density={0.3}
                variant="snowflake"
                direction={125}
            />

            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                        <p className="text-lg font-semibold text-white">
                            Loading paper presentations...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-red-400 mb-2">{error}</p>
                        <p className="text-gray-400">Please try again later</p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-center items-center gap-6 mb-8 px-4 relative z-30">
                        <input
                            type="text"
                            placeholder="Search papers by name, category, date, or time..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 border-2 border-white/30 shadow-lg w-full sm:w-3/4 lg:w-1/2 max-w-lg text-white bg-black/40 backdrop-blur-md placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-black/50 transition-all"
                        />
                    </div>
                    <section className="relative flex flex-col items-center w-full px-4 md:px-6 pb-32 overflow-x-hidden h-fit lg:overflow-hidden font-poppins lg:px-8 lg:pb-40 lg:block">
                        <h1
                            className="special-font text-4xl lg:text-5xl tracking-wide font-black text-center pt-8 uppercase"
                            style={{ color: "#B48EEB" }}
                        >
                            <b>PAPER PRESENTATIONS</b>
                        </h1>
                        <div className="flex flex-wrap justify-center gap-8 py-12">
                            {filteredPapers.length > 0 ? (
                                filteredPapers.map((paper, index) => (
                                    <EventGrid
                                        key={index}
                                        title={toTitleCase(paper.name)}
                                        description={""}
                                        date={paper.date}
                                        time={paper.time}
                                        iconImg={
                                            "https://cdn-icons-png.flaticon.com/512/3309/3309977.png"
                                        }
                                        imgurl={"/thumbnail/paperthumb.png"}
                                        arrowCircleStart="from-[#9B1E55]"
                                        arrowCircleEnd="to-[#5F0D2E]"
                                        topCurve="bg-[#010101]"
                                        rightCurve="bg-[#010101]"
                                        to={`/portal/paper/${paper.id}`}
                                        titleColor="text-white"
                                        category={paper.category}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">No paper presentations found</p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default PaperList;
