"use client";

import { motion } from "framer-motion";
import { Stethoscope, Sparkles, ShieldCheck, Smile } from "lucide-react";

const stats = [
  {
    icon: Smile,
    value: "10K+",
    label: "Happy Patients",
  },
  {
    icon: Stethoscope,
    value: "15+",
    label: "Years Experience",
  },
  {
    icon: ShieldCheck,
    value: "98%",
    label: "Success Rate",
  },
  {
    icon: Sparkles,
    value: "50+",
    label: "Expert Dentists",
  },
];

const StatsSection = () => {
  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              className="
                group
                flex
                items-center
                gap-4
                rounded-3xl
                border
                border-black/10
                bg-white/10
                backdrop-blur-2xl
                px-5
                py-5
                shadow-lg
                shadow-[#37c4b2]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/15
                hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)]
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/20
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  group-hover:scale-105
                "
              >
                <stat.icon className="h-10 w-10 text-black/70" />
              </div>

              <div>
                <p className="text-sm text-black/80">{stat.label}</p>
                <h3 className="text-2xl font-bold tracking-tight text-black/60">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
