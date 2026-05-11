"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold text-black/60 leading-tight">
              Welcome to
            </h1>

            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold text-black/60 leading-tight">
              Next <span className="text-[#37c4b2]">Dent</span>
            </h1>

            <h1 className="text-5xl md:text-6xl lg:text-4xl font-bold bg-gradient-to-r from-[#1F6F5F] to-teal-300 bg-clip-text text-transparent leading-tight">
              Preventive Care
            </h1>
          </div>

          {/* Description */}
          <p className="text-black/70 text-lg leading-8 max-w-xl mt-8">
            Experience advanced dental care with modern technology, professional
            doctors, and personalized treatment designed to keep your smile
            healthy and confident.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/appointments"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2c9f88] to-[#1F6F5F] px-7 py-4 text-white font-medium shadow-[0_10px_30px_rgba(45,212,191,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(45,212,191,0.45)]"
            >
              <CalendarDays className="w-5 h-5" />

              <span>Book Appointment</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[#37c4b2] bg-white/5 backdrop-blur-xl px-7 py-4 text-[#37c4b2] transition-all duration-300 hover:bg-cyan-400/10"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          {/* Glow */}
          <div className="absolute w-[420px] h-[420px] bg-[#37c4b2]/20 blur-3xl rounded-full"></div>

          {/* Glass Card */}
          <div className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl">
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

            {/* Floating Card */}
            <div className="absolute -bottom-7 -left-8 rounded-3xl border border-white/10 bg-white/40 backdrop-blur-lg px-6 py-5 shadow-2xl">
              <h3 className="text-3xl text-center font-bold text-black/60">
                9+
              </h3>

              <p className="text-sm text-black/60 mt-1">Years Experience</p>
            </div>

            {/* Floating Rating */}
            <div className="absolute -top-8 -right-8 rounded-3xl border border-white/10 bg-white/40 backdrop-blur-xl px-6 py-5 shadow-2xl">
              <h3 className="text-3xl font-bold text-black/60">98%</h3>

              <p className="text-sm text-black/60 mt-1">Happy Patients</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
