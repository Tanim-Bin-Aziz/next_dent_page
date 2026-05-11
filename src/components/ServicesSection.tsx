"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Syringe,
  Bone,
  Anchor,
  Activity,
  Wrench,
  SmilePlus,
  TestTubeDiagonal,
  LucideIcon,
  Dna,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
};

const services: Service[] = [
  {
    icon: TestTubeDiagonal,
    title: "Teeth Cleaning & Whitening",
    description: "Deep cleaning & whitening for a healthy bright smile.",
    gradient: "bg-[#37c4b2]",
  },
  {
    icon: Syringe,
    title: "Minor Oral Surgery",
    description: "Safe minor surgical dental procedures with precision care.",
    gradient: "bg-[#37c4b2]",
  },
  {
    icon: Bone,
    title: "Dental Implants",
    description: "Permanent tooth replacement with natural stability.",
    gradient: "bg-[#37c4b2]",
  },
  {
    icon: Dna,
    title: "Endodontic Treatment",
    description: "Advanced root canal therapy with painless experience.",
    gradient: "bg-[#37c4b2]",
  },
  {
    icon: Wrench,
    title: "Restoration & Filling",
    description: "Repair damaged teeth with durable composite filling.",
    gradient: "bg-[#37c4b2]",
  },
  {
    icon: SmilePlus,
    title: "Fixed & Removable Prosthesis",
    description: "Custom crowns, bridges & dentures for full restoration.",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black">
            Dental{" "}
            <span className="bg-[#37c4b2] bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="mt-3 text-black/60 max-w-xl mx-auto">
            Complete modern dental care with expert precision
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="
                group relative
                rounded-[24px]
                border border-black/5
                bg-white/60
                backdrop-blur-2xl
                p-5
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]
              "
            >
              {/* Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-[24px] transition`}
              />

              {/* Icon */}
              <div
                className={`
                  w-12 h-12
                  rounded-2xl
                  bg-gradient-to-br ${service.gradient}
                  flex items-center justify-center
                  shadow-lg
                  mb-4
                  group-hover:scale-105
                  transition
                `}
              >
                <service.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-black leading-tight">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-black/60 mt-2 leading-relaxed">
                {service.description}
              </p>

              {/* Bottom CTA */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-black/50">
                  Advanced Dental Care
                </span>

                <Link
                  href="/treatments"
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-500 transition"
                >
                  Explore →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
