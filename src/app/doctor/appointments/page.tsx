import { AppointmentHistory } from "@/components/doctors/appointment-history";
import { TodayAppointmentsWidget } from "@/components/doctors/today-appointments-widget";

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-muted-foreground text-sm">
          Today&apos;s schedule, appointment history, and your full patient
          list.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayAppointmentsWidget />
        <AppointmentHistory />
      </div>
    </div>
  );
}
