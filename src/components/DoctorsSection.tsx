"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Stethoscope, ArrowRight } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sazzad Aman Himel",
    specialty: "Endodontist | Assistant Professor",
    hospital: "NextDent |  Combined Military Hospital",
    image:
      "https://scontent.fjsr11-1.fna.fbcdn.net/v/t39.30808-1/573433777_25237912095841253_9051980859183070949_n.jpg",
    experience: "15+ Years",
  },
  {
    id: 2,
    name: "Dr. Nazia",
    specialty: "Endodontist",
    hospital: "NextDent |  Dhaka Dental College",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    experience: "8+ Years",
  },
  {
    id: 3,
    name: "Dr. Tariqul Razib",
    specialty: "Orthodontics",
    hospital: "Smile Care Hospital",
    image:
      "https://images.unsplash.com/photo-1729162128021-f37dca3ff30d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    experience: "12+ Years",
  },
  {
    id: 4,
    name: "Dr. Sajid Hasan",
    specialty: "Implantology",
    hospital: "Dental Vision Clinic",
    image:
      "https://images.unsplash.com/photo-1756699279298-c89cdef354ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    experience: "10+ Years",
  },
];

const DoctorsSection = () => {
  return (
    <section id="doctors" className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
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
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
            Our Expert{" "}
            <span className="bg-[#37c4b2] bg-clip-text text-transparent">
              Doctors
            </span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-black/60">
            Trusted dental specialists with modern care experience
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{
                opacity: 0,
                y: 25,
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
                overflow-hidden
                rounded-[26px]
                border
                border-black/5
                bg-white/60
                backdrop-blur-2xl
                shadow-lg
                shadow-[#37c4b2]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]
              "
            >
              {/* Image */}
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Experience */}
                <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xl">
                  {doctor.experience}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold tracking-tight text-black line-clamp-1">
                  {doctor.name}
                </h3>

                {/* Specialty */}
                <div className="mt-2 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 shrink-0 text-[#37c4b2]" />

                  <p className="text-sm font-medium text-[#37c4b2] line-clamp-2">
                    {doctor.specialty}
                  </p>
                </div>

                {/* Hospital */}
                <div className="mt-2 flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-black/50" />

                  <p className="text-xs leading-relaxed text-black/60 line-clamp-2">
                    {doctor.hospital}
                  </p>
                </div>

                {/* Button */}
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="
                    mt-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-black/10
                    bg-black/5
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-black
                    transition-all
                    duration-300
                    hover:bg-black/10
                  "
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/doctors"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-gradient-to-r
              from-cyan-500
              to-blue-500
              px-6
              py-3
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-cyan-500/20
              transition-all
              duration-300
              hover:scale-105
            "
          >
            View More Doctors
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
