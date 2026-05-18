import { doctors } from "@/data/doctors";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function DoctorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doctor = doctors.find((d) => d.id === Number(id));

  if (!doctor) return notFound();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full rounded-[30px] bg-white/60 backdrop-blur-2xl border border-black/10 shadow-2xl p-6 md:p-10">
        <div className="relative w-40 h-40 mx-auto">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold">{doctor.name}</h2>
          <p className="text-[#37c4b2]">{doctor.specialty}</p>
          <p className="text-sm text-black/60">{doctor.hospital}</p>
          <p className="mt-2">Experience: {doctor.experience}</p>
        </div>

        <p className="mt-6 text-center">{doctor.bio}</p>
      </div>
    </section>
  );
}
