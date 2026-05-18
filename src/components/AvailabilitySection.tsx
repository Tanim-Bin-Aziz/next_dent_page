"use client";

import { motion } from "framer-motion";
import { Clock, Phone, MapPin, Mail } from "lucide-react";

export function AvailabilitySection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Glass Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 md:p-10 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Heading */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-black/60 leading-tight">
                  We&lsquo;re{" "}
                  <span className="text-transparent bg-clip-text bg-[#37c4b2]">
                    Always Here
                  </span>
                </h2>

                <p className="mt-3 text-black/70 text-base sm:text-lg">
                  Open 6 days a week to ensure continuous dental care support.
                </p>
              </div>

              {/* Clinic Hours Card */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#37c4b2] flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-black/60 font-semibold text-lg">
                    Clinic Hours
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base border-b border-white/10 pb-2">
                    <span className="text-black/70">Saturday – Thursday</span>
                    <span className="text-[#37c4b2] font-semibold">
                      4:00 PM – 9:00 PM
                    </span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-black/70">Friday</span>
                    <span className="text-red-400 font-semibold">Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-red-500/50 flex items-center justify-center animate-pulse">
                  <Phone className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-black/80 font-semibold">
                    24/7 Emergency Support
                  </p>
                  <p className="text-black/80 text-sm">0171900000</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5 "
            >
              <ContactCard
                icon={<Phone className="w-5 h-5 text-white" />}
                title="Phone"
                lines={["+1 (234) 567-8900", "Emergency: +1 (234) 567-8911"]}
                gradient="bg-[#37c4b2]"
              />

              {/* Email */}
              <ContactCard
                icon={<Mail className="w-5 h-5 text-white" />}
                title="Email"
                lines={["info@nextdent.com", "support@nextdent.com"]}
                gradient="bg-[#37c4b2]"
              />

              {/* Location */}
              <ContactCard
                icon={<MapPin className="w-5 h-5 text-white" />}
                title="Location"
                lines={["123 Dental Street", "Medical District, NY 10001"]}
                gradient="bg-[#37c4b2]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  lines,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  gradient: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 transition-all duration-300">
      <div className="flex gap-4 items-start">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          {icon}
        </div>

        <div>
          <h4 className="text-black/80 font-semibold mb-1">{title}</h4>
          {lines.map((line, i) => (
            <p key={i} className="text-black/60 text-sm">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
