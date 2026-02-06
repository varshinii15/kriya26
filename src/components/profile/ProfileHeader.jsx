"use client";
import React from "react";
import Image from "next/image";
import Button from "../Button";
import { TiEdit } from "react-icons/ti";

const ProfileHeader = ({ user }) => {
    // State management for user details
    const [name, setName] = React.useState(user?.name || "KRIYA USER");
    const [kriyaId, setKriyaId] = React.useState(user?.kriyaId || "KRIYA-26-0000");
    const [email, setEmail] = React.useState(user?.email || "user@example.com");
    const [phone, setPhone] = React.useState(user?.phone || "+91 98765 43210");
    const [department, setDepartment] = React.useState(user?.department || "Department Not Set");
    const [year, setYear] = React.useState(user?.year || "Year ?");
    const [college, setCollege] = React.useState(user?.college || "PSG College of Technology");

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

                {/* Avatar Section */}
                <div className="relative group shrink-0">
                    <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-500 to-violet-500 opacity-20 blur-md group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-white/20 p-1">
                        <div className="h-full w-full rounded-full overflow-hidden relative bg-black">
                            <Image
                                src={user?.avatar || "/img/gallery-1.webp"}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="flex-1 w-full text-center md:text-left">
                    {/* Name - Keeping it prominent as the header title */}
                    <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-1">Name</p>
                        <h1 className="special-font text-5xl md:text-5xl uppercase text-white tracking-wide leading-none">
                            <b>{name}</b>
                        </h1>
                    </div>

                    {/* Details Grid - 3 rows x 2 columns */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {/* Row 1 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Kriya ID</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{kriyaId}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Institution</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{college}</p>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Department</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{department}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Year</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{year}</p>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Phone</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{phone}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Email</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web break-all">{email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button - Positioned at top right */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                {/* Mobile: Icon only */}
                <div className="md:hidden">
                    <Button
                        containerClass="!bg-white/10 !text-white hover:!bg-white/20 border border-white/10 !px-3 !py-3"
                        leftIcon={<TiEdit className="text-lg" />}
                    />
                </div>
                {/* Desktop: Icon + Text */}
                <div className="hidden md:block">
                    <Button
                        title="Edit Profile"
                        containerClass="!bg-white/10 !text-white hover:!bg-white/20 border border-white/10"
                        leftIcon={<TiEdit />}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
