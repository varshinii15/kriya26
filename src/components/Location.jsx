import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Location = () => {
  return (
    <section id="location" className="w-full bg-white px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="special-font mb-10 text-center text-4xl uppercase leading-[0.9] text-black md:text-6xl"
        >
          <b>Location</b>
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
            <p className="font-general text-xs uppercase tracking-[0.2em] text-neutral-500">
              Venue
            </p>
            <h3 className="mt-3 font-zentry text-3xl uppercase leading-[0.9] text-black md:text-5xl animated-word-static">
              PSG College of Technology
            </h3>
            <p className="mt-4 font-circular-web text-base text-neutral-700">
              Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004.
            </p>
            <Link
              href="https://maps.app.goo.gl/CD2dDpf91uXuHr2M6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-black px-5 py-2 font-general text-xs uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white"
            >
              Open In Google Maps
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <iframe
              title="PSG College of Technology Location"
              src="https://www.google.com/maps?q=PSG+College+of+Technology&output=embed"
              className="h-[320px] w-full md:h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
