"use client"
import { useState } from "react";
import "@/components/FAQ/faq.css";

const faqData = {
  General: [
    {
      question: "What is KRIYA 2025?",
      answer:
        "KRIYA 2025 is a premier intercollegiate techno fest organized by PSG College of Technology. It features an exciting lineup of technical events, workshops, and competitions.",
    },
    {
      question: "Who can participate in KRIYA 2025?",
      answer:
        "Students from any engineering institution are welcome to participate.",
    },
    {
      question: "What are the dates for KRIYA 2025?",
      answer: "KRIYA 2025 will take place from 14th March to 16th March 2025.",
    },
    {
      question: "How can I stay updated about the event?",
      answer:
        "Stay informed through the official KRIYA 2025 website, social media channels, and email updates.",
    },
  ],
  Registration: [
    {
      question: "How can I register for KRIYA 2025?",
      answer:
        "You can register by visiting the official KRIYA 2025 website and following the registration process.",
    },
    {
      question: "Is registration mandatory to participate in the events?",
      answer:
        "Yes, registration is required to take part in any events or workshops.",
    },
    {
      question: "Can I register as a team for group events?",
      answer:
        "Absolutely! Team registrations are available for applicable events.",
    },
    {
      question: "What is the last date for registration?",
      answer:
        "Registrations are open until event slots are filled. On-spot registrations may also be available if slots remain.",
    },
  ],
  Workshops: [
    {
      question: "What workshops are available during KRIYA 2025?",
      answer:
        "Workshops cover topics like artificial intelligence, robotics, and more. Detailed information can be found on the official website.",
    },
    {
      question: "Is there an additional fee for attending workshops?",
      answer: "Yes, workshops require a separate registration fee.",
    },
    {
      question: "Will participants receive certificates for workshops?",
      answer:
        "Yes, all workshop attendees will receive participation certificates.",
    },
    {
      question: "Do workshops require prior knowledge?",
      answer:
        "Some workshops may require basic knowledge, which will be specified in their descriptions.",
    },
    {
      question: "Are workshop slots limited?",
      answer:
        "Yes, workshop slots are limited and will be filled on a first-come, first-served basis.",
    },
  ],
  Events: [
    {
      question: "What types of events will be held at KRIYA 2025?",
      answer: "KRIYA 2025 will feature technical competitions and hackathons.",
    },
    {
      question: "Can I participate in multiple events?",
      answer:
        "Yes, you are welcome to participate in multiple events, provided there are no scheduling conflicts.",
    },
    {
      question: "Are there prizes for winners?",
      answer: "Yes, winners will receive cash prizes and certificates.",
    },
    {
      question: "How will I know the event schedule?",
      answer:
        "The event schedule will be shared on the official social media channels.",
    },
    {
      question: "Are there team-based events?",
      answer: "Yes, many events allow or require team participation.",
    },
  ],
  Logistics: [
    {
      question: "Where is KRIYA 2025 being held?",
      answer:
        "KRIYA 2025 will take place at PSG College of Technology, Coimbatore.",
    },
    {
      question: "Will food be available at the venue?",
      answer: "Yes, food stalls will be set up throughout the event.",
    },
    {
      question: "Is accommodation provided for outstation participants?",
      answer:
        "Yes, accommodations can be arranged upon request and separate payment has to be done for the accommodations.",
    },
    {
      question: "Is there parking available at the venue?",
      answer: "Yes, parking facilities are available for all participants.",
    },
  ],
  Refunds: [
    {
      question: "Can I get a refund if I cancel my registration?",
      answer: "No, KRIYA 2025 follows a strict no-refund policy.",
    },
    {
      question: "Are workshop fees refundable?",
      answer:
        "No, workshop fees are non-refundable unless the workshop is canceled by the organizers.",
    },
  ],
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div
      className="min-h-20vh bg-black text-[#EBECF3] flex flex-col items-start px-6 py-20"
      id="section8"
    >
      <h1 className="font-zentry text-7xl font-bold mb-4 text-left w-full">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-400 font-poppins text-sm mb-2 text-left w-full">
        Get the answers you need to navigate our platform with confidence.
      </p>

      {/* Category Buttons */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-4 mb-6 text-xs sm:text-m self-start mt-5 whitespace-nowrap">
          {Object.keys(faqData).map((category) => (
            <button
              key={category}
              className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded-full border border-[#3E4250] ${selectedCategory === category ? "bg-pink-600 text-black" : ""
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="w-full min-w-100vw space-y-4 mt-3">
        {faqData[selectedCategory].map((faq, index) => (
          <div
            key={index}
            className="text-left border border-[#3E4250] rounded-2xl w-full"
          >
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg text-left">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-g font-poppins ray-300 text-left">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
