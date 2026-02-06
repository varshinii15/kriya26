"use client";
import React from "react";
import { BentoTilt } from "../Features";
import { TiTick, TiTimes } from "react-icons/ti";

const StatCard = ({ label, value, title, colorClass = "text-white" }) => (
    <div className="flex flex-col justify-between h-full p-4 md:p-5 text-blue-75">
        <h3 className="font-general text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">{label}</h3>
        <h1 className={`font-zentry text-3xl md:text-4xl ${colorClass}`}>{value}</h1>
        <p className="font-circular-web text-xs md:text-sm opacity-80 mt-1">{title}</p>
    </div>
);

const StatsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Payment Status */}
            <BentoTilt className="col-span-3 md:col-span-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl min-h-[100px] md:min-h-[120px]">
                <div className="h-full p-4 md:p-5 flex flex-col justify-center">
                    <h3 className="font-general text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-2">General Fee:</h3>
                    <div className={`flex items-center gap-2 ${stats?.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                        {stats?.isPaid ? (
                            <TiTick className="text-2xl" />
                        ) : (
                            <TiTimes className="text-2xl" />
                        )}
                        <span className="special-font text-2xl md:text-3xl uppercase">
                            <b>{stats?.isPaid ? "Paid" : "Not Paid"}</b>
                        </span>
                    </div>
                </div>
            </BentoTilt>

            {/* Events Count */}
            <BentoTilt className="col-span-1 md:col-span-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl min-h-[100px] md:min-h-[120px]">
                <StatCard
                    label="Registered"
                    value={stats?.eventsCount || "0"}
                    title="Events"
                    colorClass="text-blue-400"
                />
            </BentoTilt>

            {/* Workshops Count */}
            <BentoTilt className="col-span-2 md:col-span-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl min-h-[100px] md:min-h-[120px]">
                <StatCard
                    label="Enrolled"
                    value={stats?.workshopsCount || "0"}
                    title="Workshops"
                    colorClass="text-violet-400"
                />
            </BentoTilt>
        </div>
    );
};

export default StatsGrid;

