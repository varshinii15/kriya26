import React from "react";
import Link from "next/link";
import { BsInstagram, BsLinkedin, BsTelephone } from "react-icons/bs";
import { SiLinktree, SiGmail } from "react-icons/si";
import { TbAlertOctagon } from "react-icons/tb";

// Contact Item Component
const ContactItem = ({ name, phone, className = "" }) => {
    return (
        <div className={className}>
            <h4 className="text-lg mt-2 font-semibold font-circular-web text-white">{name}</h4>
            <Link href={`tel:${phone}`}>
                <div className="flex items-center space-x-4 mt-2 cursor-pointer hover:text-blue-400 transition-colors">
                    <BsTelephone className="text-white" />
                    <p className="text-sm font-circular-web">{phone}</p>
                </div>
            </Link>
        </div>
    );
};

// Contact Button Component
const ContactButton = ({ href, Icon, label, children }) => {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 cursor-pointer text-white px-4 py-2 rounded-md transition-all hover:bg-white/10"
        >
            <Icon size={20} className="flex-shrink-0" />
            <p className="text-lg break-words min-w-0 font-circular-web">{children || label}</p>
        </Link>
    );
};

const Contact = () => {
    return (
        <section
            id="contact"
            className="w-full bg-black px-10 py-16"
        >
            <h1 className="text-4xl md:text-6xl text-white font-zentry font-black uppercase leading-[0.9] pb-6 mb-8 border-b border-white/10 animated-word-static">Contact Us</h1>

            <div className="flex flex-col lg:flex-row gap-8 flex-wrap text-white mt-8">
                <div className="flex-1 flex flex-col lg:flex-wrap gap-8 lg:gap-6 lg:gap-y-12 lg:flex-row items-start lg:justify-between">

                    <div className="w-full lg:w-56">
                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mb-2">Chairperson</h5>
                        <ContactItem name="Jithendra J" phone="+91 75300 28769" />

                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mt-8 mb-2">Co-Chairperson</h5>
                        <ContactItem name="Akash U" phone="+91 89390 28008" />
                    </div>

                    <div className="w-full lg:w-56">
                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mb-2">Secretary (Men)</h5>
                        <ContactItem name="Naren Siddharth M" phone="+91 99409 79069" />

                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mt-8 mb-2">Secretary (Women)</h5>
                        <ContactItem name="Fasila Begum A" phone="+91 74486 49714" />
                    </div>

                    <div className="w-full lg:w-56">
                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mb-2">Secretary (Science)</h5>
                        <ContactItem name="Ridhanya Senthil" phone="+91 90470 50025" />

                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mt-8 mb-2">Event Support</h5>
                        <ContactItem
                            name="Arunaa S"
                            phone="+91 88258 51781"
                            className="mt-2 whitespace-nowrap"
                        />
                    </div>

                    <div className="w-full lg:w-56">
                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mb-2">
                            PR & Sponsorship Support
                        </h5>
                        <ContactItem name="Nakulan A" phone="+91 94889 64540" />
                        <ContactItem
                            name="Madumitha M P"
                            phone="+91 82483 03552"
                            className="mt-6 whitespace-nowrap"
                        />
                    </div>

                    <div className="w-full lg:w-56">
                        <h5 className="text-xs tracking-widest font-general uppercase text-blue-400 font-bold mb-2">Tech Support</h5>
                        <ContactItem name="Bragadeesh V" phone="+91 74188 52849" />
                        <ContactItem
                            name="Abinav P"
                            phone="+91 99655 11133"
                            className="mt-6 whitespace-nowrap"
                        />
                    </div>

                </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex justify-center flex-wrap gap-6 mt-20 pt-10 border-t border-white/10">
                <ContactButton
                    href="https://www.linkedin.com/company/studentsunion-psgtech/"
                    Icon={BsLinkedin}
                    label="Students Union"
                />
                <ContactButton
                    href="https://www.instagram.com/kriya_psgtech/"
                    Icon={BsInstagram}
                    label="@kriya_psgtech"
                />
                <ContactButton
                    href="mailto:helpdesk.kriya@psgtech.ac.in"
                    Icon={SiGmail}
                    label="helpdesk.kriya@psgtech.ac.in"
                />
                <ContactButton
                    href="https://linktr.ee/su.psgtech"
                    Icon={SiLinktree}
                    label="Linktree"
                />
                <ContactButton
                    href="/privacypolicy.html"
                    Icon={TbAlertOctagon}
                    label="Privacy Policy"
                >
                    Privacy Policy
                </ContactButton>
            </div>
        </section>
    );
};

export default Contact;
