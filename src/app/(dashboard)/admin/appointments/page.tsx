import { getAppointments, getDoctors } from "@/actions/appointments";
import AppointmentsTable from "./_components/AppointmentsTable";
import AppointmentFilters from "./_components/AppointmentFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { doctorId?: string; status?: string; date?: string };
}) {
  const [appointments, doctors] = await Promise.all([
    getAppointments(searchParams),
    getDoctors(),
  ]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button asChild>
          <Link href="/admin/appointments/new">+ New Appointment</Link>
        </Button>
      </div>

      <AppointmentFilters doctors={doctors} />
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
