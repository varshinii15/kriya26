'use client';

import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [isClient, setIsClient] = useState(false);

  const calculateTimeLeft = () => {
    const targetDate = new Date('2026-03-13T00:00:00');
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      return calculateTimeLeft();
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center w-full text-white md:pr-10">
      <div className="w-full px-4">
        <div className="grid grid-cols-2 text-center gap-4 md:gap-6 lg:gap-8">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl xl:text-[180px] font-bold text-gray-500 leading-none">
              {timeLeft.days}
            </div>
            <h1 className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white text-center lg:text-left">
              <span style={{ color: '#3B82F6' }}><b>D</b><b>AYS</b></span>
            </h1>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl xl:text-[180px] font-bold text-gray-500 leading-none">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <h1 className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white text-center lg:text-left">
              <span style={{ color: '#3B82F6' }}><b>H</b><b>OURS</b></span>
            </h1>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl xl:text-[180px] font-bold text-gray-500 leading-none">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <h1 className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white text-center lg:text-left">
              <span style={{ color: '#3B82F6' }}><b>M</b><b>INUTES</b></span>
            </h1>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-8xl xl:text-[180px] font-bold text-gray-500 leading-none">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <h1 className="special-font text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white text-center lg:text-left">
              <span style={{ color: '#3B82F6' }}><b>S</b><b>ECONDS</b></span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;