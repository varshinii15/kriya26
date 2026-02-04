"use client"
import React, { useState } from 'react'
import { AiOutlinePlus } from "react-icons/ai";
function FAQitem({item,index}) {
    const [faqOpenIdx, setFaqOpenIdx] = useState(-1);
    return (
        <div>
            <FAQItem
                question={item.question}
                answer={item.answer}
                isOpened={index === faqOpenIdx}
                onClick={() => {
                    index === faqOpenIdx ? setFaqOpenIdx(-1) : setFaqOpenIdx(index);
                }}
            />
        </div>
    )
}
const FAQItem = ({ question, answer, isOpened = false, onClick }) => {
    return (
        <div className="w-full">
            <button className="p-4 lg:px-8 border-t border-gray-300 text-lg flex w-full justify-between items-center font-semibold" onClick={onClick}>
                <div className={`text-left text-base lg:text-lg py-2 ${isOpened ? "text-blue-700 font-bold" : "text-black font-normal"}`}>
                    {question}
                </div>
                <div>
                    <AiOutlinePlus className={`text-2xl ${isOpened ? "rotate-45" : "rotate-0"} transition-all`} />
                </div>
            </button>
            <div
                className={`${isOpened ? "h-fit px-4 lg:px-8 py-4 " : "h-0 overflow-y-hidden"
                    } transition-all ease-in-out text-sm`}
            >
                {answer}
            </div>
        </div>
    );
};

export default FAQitem