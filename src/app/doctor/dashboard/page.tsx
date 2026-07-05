// app/doctor/dashboard/page.tsx

import { TodayAppointmentsWidget } from "@/components/doctors/today-appointments-widget";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Doctor.</p>
      </div>

      <TodayAppointmentsWidget />
    </div>
  );
}
