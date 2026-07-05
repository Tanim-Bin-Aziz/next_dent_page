"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black/60 leading-tight">
            Welcome to
          </h1>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black/60 leading-tight">
            Next <span className="text-[#37c4b2]">Dent</span>
          </h1>

          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-[#1F6F5F] to-teal-300 bg-clip-text text-transparent leading-tight mt-1">
            Preventive Care
          </h1>

          <p className="text-black/70 text-base sm:text-lg leading-7 max-w-xl mt-6">
            Experience advanced dental care with modern technology, professional
            doctors, and personalized treatment designed to keep your smile
            healthy and confident.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2c9f88] to-[#1F6F5F] px-6 py-3 text-white font-medium shadow-lg transition hover:-translate-y-1"
            >
              <CalendarDays className="w-5 h-5" />
              Book Appointment
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[#37c4b2] px-6 py-3 text-[#37c4b2] hover:bg-cyan-400/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          {/* Glow */}
          <div className="absolute w-[260px] sm:w-[320px] md:w-[420px] h-[260px] sm:h-[320px] md:h-[420px] bg-[#37c4b2]/20 blur-3xl rounded-full"></div>

          {/* Image Card */}
          <div className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-3 sm:p-4 shadow-2xl">
            <div className="overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/chair.png"
                alt="Dental Chair"
                width={650}
                height={450}
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Left Card */}
            <div
              className="
                absolute
                -bottom-6 sm:-bottom-7
                -left-3 sm:-left-6
                scale-75 sm:scale-90 md:scale-100
                rounded-2xl sm:rounded-3xl
                border border-white/10
                bg-white/40 backdrop-blur-lg
                px-4 sm:px-6 py-3 sm:py-5
                shadow-xl
              "
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black/60 text-center">
                9+
              </h3>
              <p className="text-xs sm:text-sm text-black/60 mt-1 text-center">
                Years Experience
              </p>
            </div>

            {/* Floating Right Card */}
            <div
              className="
                absolute
                -top-6 sm:-top-8
                -right-3 sm:-right-6
                scale-75 sm:scale-90 md:scale-100
                rounded-2xl sm:rounded-3xl
                border border-white/10
                bg-white/40 backdrop-blur-xl
                px-4 sm:px-6 py-3 sm:py-5
                shadow-xl
              "
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black/60 text-center">
                98%
              </h3>
              <p className="text-xs sm:text-sm text-black/60 mt-1 text-center">
                Happy Patients
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
