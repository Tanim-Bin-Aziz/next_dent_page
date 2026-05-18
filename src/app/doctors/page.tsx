"use client";

import { doctors } from "@/data/doctors";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Stethoscope, ArrowRight } from "lucide-react";

export default function DoctorsPage() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">
          All <span className="text-[#37c4b2]">Doctors</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group rounded-[26px] bg-white/60 backdrop-blur-xl border border-black/5 shadow-lg hover:shadow-xl transition"
            >
              <div className="relative h-55">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover rounded-t-[26px]"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg">{doctor.name}</h3>

                <div className="flex items-center gap-2 mt-2">
                  <Stethoscope className="h-4 w-4 text-[#37c4b2]" />
                  <p className="text-sm text-[#37c4b2]">{doctor.specialty}</p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-black/50" />
                  <p className="text-xs text-black/60">{doctor.hospital}</p>
                </div>

                <Link
                  href={`/doctors/${doctor.id}`}
                  className="mt-4 flex items-center justify-center gap-2 bg-black/5 py-2 rounded-full"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
