"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiLocationArrow } from "react-icons/ti";
import { motion } from "framer-motion";


export const BentoTilt = ({ children, className = "", onClick }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: transformStyle, cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, onClick, textColor = "text-white", titleColor = "text-white", cardId }) => {
  const hoverButtonRef = useRef(null);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "-70% 0px"
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div ref={cardRef} className="relative size-full">
      <img
        src={src}
        alt="feature-bg"
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-2 md:p-5 text-blue-75">
        <div>
          <h1 className={`special-font text-3xl xl:text-4xl font-bold ${titleColor} tracking-wider`}><b>{title}</b></h1>
          {description && (
            <p className={`mt-2 md:mt-3 max-w-64 text-xs md:text-base px-2 md:px-3 py-1 md:py-2 rounded-xl font-medium ${textColor} drop-shadow-lg transition-opacity duration-300 ${typeof window !== 'undefined' && window.innerWidth < 768
              ? (isVisible ? 'opacity-100' : 'opacity-0')
              : 'opacity-100'
              }`}>{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onClick={onClick}
            className="relative flex w-fit cursor-pointer items-center gap-1 md:gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-1 md:px-3 md:py-2 text-[10px] md:text-xs lg:text-sm uppercase text-white font-semibold transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95"
          >
            <TiLocationArrow className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4" />
            <p>Explore</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => {
  const router = useRouter();

  const handleCategoryClick = (category) => {
    router.push(`/portal/event?ctg=${category}`);
  };

  return (
    <section id="features-section" className="bg-black py-10 md:py-20 pt-10 md:pt-15">
      <div className="container mx-auto px-2 md:px-3 lg:px-10">
        <div className="flex justify-center mb-10">
          <motion.h1
            initial={{ opacity: 0, transform: "rotateX(-30deg) scale(0.9)" }}
            whileInView={{ opacity: 1, transform: "rotateX(0deg) scale(1)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-zentry animated-word-static text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-black text-white"
          >
            Event Category
          </motion.h1>
        </div>

        <BentoTilt
          className="bento-tilt_1 relative mb-3 md:mb-7 h-60 md:h-60 w-full overflow-hidden rounded-md lg:h-[70vh] xl:h-[75vh]"
          onClick={() => handleCategoryClick('core')}
        >
          <BentoCard
            src="/img/core-eng.png"
            title={
              <>
                <b>C</b>ore <b>E</b>ngineering
              </>
            }
            description="Mechanical, Civil, and Electrical engineering events showcasing innovation and technical excellence."
            textColor="text-white"
            isComingSoon
            onClick={() => handleCategoryClick('core')}
            cardId="core"
          />
        </BentoTilt>

        {/* Mobile: flex-col layout, Desktop: grid layout */}
        <div className="flex flex-col gap-3 md:grid md:h-[60vh] md:w-full md:grid-cols-2 md:grid-rows-2 md:gap-7 lg:h-screen xl:h-[110vh]">
          <BentoTilt
            className="bento-tilt_1 h-60 md:h-auto md:row-span-1 md:col-span-1"
            onClick={() => handleCategoryClick('coding')}
          >
            <BentoCard
              src="/img/coding.png"
              title={
                <>
                  <b>C</b>oding
                </>
              }
              description="Coding challenges and hackathons to test your programming skills and creativity."
              textColor="text-white"
              isComingSoon
              onClick={() => handleCategoryClick('coding')}
              cardId="coding"
            />
          </BentoTilt>

          <BentoTilt
            className="bento-tilt_2 h-60 md:h-auto md:row-span-1"
            onClick={() => handleCategoryClick('quiz')}
          >
            <BentoCard
              src="/img/quiz.png"
              title={
                <>
                  <b>Q</b>uiz
                </>
              }
              description="Test your knowledge across diverse domains in our technical quiz competitions."
              textColor="text-black"
              titleColor="text-black"
              isComingSoon
              onClick={() => handleCategoryClick('quiz')}
              cardId="quiz"
            />
          </BentoTilt>

          <BentoTilt
            className="bento-tilt_1 h-60 md:h-auto md:row-span-2 md:col-start-2 md:row-start-1 md:col-span-1"
            onClick={() => handleCategoryClick('fashion')}
          >
            <BentoCard
              src="/img/ft.png"
              title={
                <>
                  <b>F</b>ashion <b>T</b>echnology
                </>
              }
              description="Textile innovation and fashion-forward design meeting cutting-edge technology."
              textColor="text-white"
              isComingSoon
              onClick={() => handleCategoryClick('fashion')}
              cardId="fashion"
            />
          </BentoTilt>
        </div>

        <BentoTilt
          className="bento-tilt_1 relative mb-3 md:mb-7 mt-3 md:mt-7 h-60 md:h-60 w-full overflow-hidden rounded-md lg:h-[70vh] xl:h-[75vh]"
          onClick={() => handleCategoryClick('science')}
        >
          <BentoCard
            src="/img/sci-tech.png"
            title={
              <>
                <b>S</b>cience & <b>T</b>echnology
              </>
            }
            description="Scientific research and technological innovations pushing the boundaries of knowledge."
            textColor="text-white"
            isComingSoon
            onClick={() => handleCategoryClick('science')}
            cardId="science"
          />
        </BentoTilt>
      </div>
    </section>
  );
};

export default Features;