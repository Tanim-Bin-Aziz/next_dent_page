"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const cases = [
  {
    id: 1,
    title: "Complete Smile Transformation",
    patient: "John D.",
    treatment: "Veneers + Whitening",
    duration: "3 months",
    before:
      "https://images.unsplash.com/photo-1684607633024-f1a2179118fa?w=1080",
    after:
      "https://images.unsplash.com/photo-1684607632599-748b1792a116?w=1080",
    testimonial:
      "I never thought my smile could look this good! The team was amazing.",
    rating: 5,
  },
  {
    id: 2,
    title: "Dental Implant Success",
    patient: "Sarah M.",
    treatment: "Full Arch Implants",
    duration: "6 months",
    before:
      "https://images.unsplash.com/photo-1684607632041-32d729cdee35?w=1080",
    after:
      "https://images.unsplash.com/photo-1692643366768-b21bc8506ea1?w=1080",
    testimonial: "Life-changing experience! I can smile confidently again.",
    rating: 5,
  },
  {
    id: 3,
    title: "Orthodontic Excellence",
    patient: "Mike T.",
    treatment: "Clear Aligners",
    duration: "12 months",
    before:
      "https://images.unsplash.com/photo-1684607632845-723f8f427110?w=1080",
    after:
      "https://images.unsplash.com/photo-1631051103633-24959376b92d?w=1080",
    testimonial: "Perfect results without traditional braces hassle!",
    rating: 5,
  },
];

export default function CaseStudiesSection() {
  const [index, setIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(true);

  const current = cases[index];

  const next = () => setIndex((prev) => (prev + 1) % cases.length);

  const prev = () =>
    setIndex((prev) => (prev - 1 + cases.length) % cases.length);

  return (
    <section id="cases" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black">
            Real{" "}
            <span className="bg-[#37c4b2] bg-clip-text text-transparent">
              Case Studies
            </span>
          </h2>

          <p className="mt-3 text-black/60 max-w-xl mx-auto">
            Life-changing dental results from real patients
          </p>
        </motion.div>

        {/* Card */}
        <div className="bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[28px] shadow-lg p-5 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Image */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showBefore ? "before" : "after"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-square rounded-2xl overflow-hidden"
                >
                  <Image
                    src={showBefore ? current.before : current.after}
                    alt="case"
                    fill
                    className="object-cover object-top"
                  />

                  <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
                    {showBefore ? "Before" : "After"}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Toggle */}
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 text-sm rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
              >
                {showBefore ? "Show After" : "Show Before"}
              </button>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black">{current.title}</h3>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-black/60">Patient</span>
                  <span className="font-medium">{current.patient}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-black/60">Treatment</span>
                  <span className="font-medium">{current.treatment}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-black/60">Duration</span>
                  <span className="font-medium">{current.duration}</span>
                </p>
              </div>

              {/* Testimonial */}
              <div className="p-4 rounded-xl bg-black/5 text-black/70 italic text-sm">
                {current.testimonial}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {cases.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === index ? "w-6 bg-cyan-500" : "w-2 bg-black/20"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/cases"
            className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
          >
            View More Cases
          </Link>
        </div>
      </div>
    </section>
  );
}
