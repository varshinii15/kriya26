import React from "react";
import AnimatedTitle from "./AnimatedTitle";

const TeamMember = ({ img, name, role }) => {
    return (
        <div className="group relative flex w-full flex-col items-center justify-center p-4 sm:w-1/2 md:w-1/3 lg:w-1/5">
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border-2 border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-300">
                <img
                    src={img}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="mt-4 text-center">
                <h3 className="font-zentry text-2xl uppercase text-blue-50 transition-colors duration-300 group-hover:text-yellow-300">
                    {name}
                </h3>
                <p className="font-general text-sm uppercase tracking-wide text-blue-50/70">
                    {role}
                </p>
            </div>
        </div>
    );
};

const Team = () => {
    const members = [
        {
            img: "/img/gallery-1.webp",
            name: "Arjun Reddy",
            role: "Lead Organizer",
        },
        {
            img: "/img/gallery-2.webp",
            name: "Priya Sharma",
            role: "Tech Head",
        },
        {
            img: "/img/gallery-3.webp",
            name: "Vikram Singh",
            role: "Design Lead",
        },
        {
            img: "/img/gallery-4.webp",
            name: "Ananya Patel",
            role: "Event Coordinator",
        },
        {
            img: "/img/gallery-5.webp",
            name: "Rohan Kumar",
            role: "Marketing Head",
        },
    ];

    return (
        <section className="relative min-h-screen w-full bg-black py-20">
            <div className="container mx-auto px-4">
                <div className="mb-16 flex w-full flex-col items-center justify-center text-center">
                    <p className="font-general text-sm uppercase text-blue-50">
                        The Minds Behind
                    </p>
                    <AnimatedTitle
                        title="m<b>e</b>et our <br /> amazing <b>t</b>eam"
                        containerClass="mt-5 !text-white text-center"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-8 lg:gap-0">
                    {members.map((member, index) => (
                        <TeamMember key={index} {...member} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
