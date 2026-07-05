import { getDoctors, getPatients } from "@/actions/appointments";
import NewAppointmentForm from "../_components/NewAppointmentForm";

export default async function NewAppointmentPage() {
  const [doctors, patients] = await Promise.all([getDoctors(), getPatients()]);

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New Appointment</h1>
      <NewAppointmentForm doctors={doctors} patients={patients} />
    </div>
  );
}
