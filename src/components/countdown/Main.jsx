'use client';

import React, { useEffect, useState } from 'react';
import AnimatedTitle from '../AnimatedTitle';

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  const eventDetails = {
    title: 'Kriya 2026 - Technical Symposium',
    startTime: '2026-03-14T09:00:00',
    endTime: '2026-03-16T17:00:00',
    location: 'PSG College of Technology, Coimbatore',
    description: 'Join us at the forefront of technological advancements and gain valuable insights at our upcoming technical symposium Kriya 2026.',
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCalendar = () => {
    if (typeof window !== 'undefined') {
      const eventUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventDetails.title
      )}&dates=${eventDetails.startTime.replace(/[-:]/g, '')}/${eventDetails.endTime.replace(
        /[-:]/g,
        ''
      )}&location=${encodeURIComponent(eventDetails.location)}&details=${encodeURIComponent(eventDetails.description)}`;

      window.open(eventUrl, '_blank');
    }
  };

  if (!isClient) return null;

  return (
    <div className='flex items-center '>
      <div className="flex flex-col items-center lg:items-start md:py-6 lg:py-8 px-14 pb-10 md:pb-6">
        <div className="mb-2">
          <h1 className="special-font text-[3rem] md:text-[3rem] lg:text-[5rem] font-black uppercase text-white text-center lg:text-left">
            <b>M</b><b>ark </b><b>Y</b><b>our </b><br className="block lg:hidden" />
            <span className='text-[#3B82F6] text-[5rem]'><b>C</b><b>alendar !</b></span>
          </h1>
        </div>


        <p className="my-3 text-white text-base md:text-base lg:text-lg text-center lg:text-left">{eventDetails.description}</p>

        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={handleAddToCalendar}
            className="px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out transform rounded-full shadow-lg lg:text-base hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: '#3B82F6',
              boxShadow: '0 0 30px rgba(145, 70, 255, 0.4)'
            }}
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
