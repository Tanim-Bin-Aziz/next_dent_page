"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

// TODO: replace this fake array with a real call, e.g.
//   const appts = await getAppointments({ doctorId, date: today });
// from src/actions/appointments.ts once doctor_id filtering is wired up.
const MOCK_TODAY_APPOINTMENTS = [
  {
    id: "mock-1",
    patientName: "Rahim Uddin",
    patientUid: "ND-00012",
    time: "10:30 AM",
    status: "upcoming" as const,
  },
  {
    id: "mock-2",
    patientName: "Sadia Islam",
    patientUid: "ND-00034",
    time: "12:00 PM",
    status: "upcoming" as const,
  },
  {
    id: "mock-3",
    patientName: "Karim Hossain",
    patientUid: "ND-00007",
    time: "2:15 PM",
    status: "completed" as const,
  },
];

const STATUS_STYLE: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  today: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function TodayAppointmentsWidget() {
  const appointments = MOCK_TODAY_APPOINTMENTS;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Today&apos;s Appointments</h2>
        <Badge variant="secondary">{appointments.length} total</Badge>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No appointments scheduled for today.
        </p>
      ) : (
        <div className="space-y-2">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{appt.patientName}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {appt.patientUid}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {appt.time}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[appt.status] ?? "bg-muted"}`}
                >
                  {appt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground italic">
        Sample data shown — will auto-populate from real appointments once
        database wiring is connected.
      </p>
    </div>
  );
}
