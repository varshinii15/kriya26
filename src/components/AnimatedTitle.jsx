"use client"
import clsx from "clsx";

const AnimatedTitle = ({ title, containerClass }) => {
  return (
    <div className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex justify-center items-center max-w-full flex-wrap gap-2 px-4 md:gap-3"
        >
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word-static"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;